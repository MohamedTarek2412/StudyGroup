using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using StudyGroup.API.Auth.JWT;
using StudyGroup.API.Auth.Password;
using StudyGroup.API.Auth.Policies;
using StudyGroup.API.Auth.Services;
using StudyGroup.API.Data;
using StudyGroup.API.Hubs;
using StudyGroup.API.Middlewares;
using StudyGroup.API.Repositories;
using StudyGroup.API.Repositories.Interfaces;
using StudyGroup.API.Services;
using StudyGroup.API.Models;

var builder = WebApplication.CreateBuilder(args);

// ─── DB ────────────────────────────────────────────────────────
builder.Services.AddDbContext<AppDbContext>(opt =>
    opt.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        sqlOptions => sqlOptions.EnableRetryOnFailure()
    ));
// ─── JWT Config ────────────────────────────────────────────────
builder.Services.Configure<JwtOptions>(builder.Configuration.GetSection("JwtOptions"));

var jwtOpts = builder.Configuration.GetSection("JwtOptions").Get<JwtOptions>()!;
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(opt =>
    {
        opt.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtOpts.Issuer,
            ValidAudience = jwtOpts.Audience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtOpts.Secret)),
            NameClaimType = "sub",
        };

        // Allow SignalR to pass token via query string
        opt.Events = new JwtBearerEvents
        {
            OnMessageReceived = ctx =>
            {
                var token = ctx.Request.Query["access_token"];
                var path = ctx.HttpContext.Request.Path;
                if (!string.IsNullOrEmpty(token) && path.StartsWithSegments("/hubs"))
                    ctx.Token = token;
                return Task.CompletedTask;
            }
        };
    });

builder.Services.AddAuthorization(o =>
{
    o.AddPolicy(AuthPolicies.ApprovedGroupCreator, policy =>
    {
        policy.RequireAuthenticatedUser();
        policy.RequireRole(Roles.GroupCreator);
        policy.AddRequirements(new ApprovedGroupCreatorRequirement());
    });
});
builder.Services.AddScoped<IAuthorizationHandler, ApprovedGroupCreatorHandler>();


// ─── CORS ──────────────────────────────────────────────────────
var allowedOrigins = builder.Configuration["CORS__AllowedOrigins"]?.Split(",")
                     ?? ["http://localhost:3000"];

builder.Services.AddCors(opt => opt.AddDefaultPolicy(p =>
    p.WithOrigins(allowedOrigins)
     .AllowAnyHeader()
     .AllowAnyMethod()
     .AllowCredentials()));

// ─── Repositories ──────────────────────────────────────────────
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IRoleRepository, RoleRepository>();
builder.Services.AddScoped<IRefreshTokenRepository, RefreshTokenRepository>();
builder.Services.AddScoped<IGroupRepository, GroupRepository>();
builder.Services.AddScoped<IJoinRequestRepository, JoinRequestRepository>();
builder.Services.AddScoped<IMaterialRepository, MaterialRepository>();
builder.Services.AddScoped<IDiscussionRepository, DiscussionRepository>();
builder.Services.AddScoped<INotificationRepository, NotificationRepository>();

// ─── Services ──────────────────────────────────────────────────
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IGroupService, GroupService>();
builder.Services.AddScoped<IJoinRequestService, JoinRequestService>();
builder.Services.AddScoped<IAdminService, AdminService>();
builder.Services.AddScoped<IMaterialService, MaterialService>();
builder.Services.AddScoped<IDiscussionService, DiscussionService>();
builder.Services.AddScoped<INotificationService, NotificationService>();

// ─── Auth Helpers ──────────────────────────────────────────────
builder.Services.AddSingleton<IPasswordHasher, PasswordHasher>();
builder.Services.AddSingleton<IJwtTokenGenerator, JwtTokenGenerator>();

// ─── SignalR ───────────────────────────────────────────────────
builder.Services.AddSignalR();

// ─── Controllers + Swagger ────────────────────────────────────
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Title = "StudyGroup API",
        Version = "v1",
        Description = "Backend API for StudyGroup — includes Auth, Groups, Join Requests, Materials, Discussions, and Notifications."
    });
    c.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Description = "Enter your JWT token here."
    });
    c.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {{
        new Microsoft.OpenApi.Models.OpenApiSecurityScheme
        {
            Reference = new Microsoft.OpenApi.Models.OpenApiReference
            {
                Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                Id = "Bearer"
            }
        }, []
    }});
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

    // 1. Ensure DB + Tables exist
    db.Database.Migrate();

    // 2. Seed roles if empty
    if (!db.Roles.Any())
    {
        // Roles are normally seeded by EF migrations (HasData). This block is only a safety net.
        db.Roles.AddRange(
            new Role { Id = 1, Name = "Admin" },
            new Role { Id = 2, Name = "GroupCreator" },
            new Role { Id = 3, Name = "Student" }
        );

        db.SaveChanges();
    }
}

// ─── Pipeline ──────────────────────────────────────────────────
app.UseMiddleware<GlobalExceptionMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

// ─── SignalR Hubs ──────────────────────────────────────────────
app.MapHub<NotificationHub>("/hubs/notifications");
app.MapHub<GroupDiscussionHub>("/hubs/discussion");

app.Run();