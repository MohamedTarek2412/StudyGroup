 
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using StudyGroup.API.Auth.JWT;
using StudyGroup.API.Auth.Password;
using StudyGroup.API.Auth.Services;
using StudyGroup.API.Config;
using StudyGroup.API.Data;
using StudyGroup.API.Hubs;
using StudyGroup.API.Middlewares;
using StudyGroup.API.Repositories;
using StudyGroup.API.Repositories.Interfaces;
using StudyGroup.API.Services;
using System.Text;
 
var builder = WebApplication.CreateBuilder(args);
 
// ─── Database ──────────────────────────────────────────────────
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
 
// ─── JWT Options ───────────────────────────────────────────────
var jwtOptions = builder.Configuration.GetSection("JwtOptions").Get<JwtOptions>()!;
builder.Services.AddSingleton(jwtOptions);
 
// ─── Authentication ────────────────────────────────────────────
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme    = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer           = true,
        ValidateAudience         = true,
        ValidateLifetime         = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer              = jwtOptions.Issuer,
        ValidAudience            = jwtOptions.Audience,
        IssuerSigningKey         = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtOptions.Secret))
    };
 
    // ─── SignalR: قرأ الـ Token من الـ query string ────────────
    options.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            var accessToken = context.Request.Query["access_token"];
            var path = context.HttpContext.Request.Path;
            if (!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/hubs"))
                context.Token = accessToken;
            return Task.CompletedTask;
        }
    };
});
 
// ─── Authorization ─────────────────────────────────────────────
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminOnly",        policy => policy.RequireRole("Admin"));
    options.AddPolicy("GroupCreatorOnly", policy => policy.RequireRole("GroupCreator"));
    options.AddPolicy("StudentOnly",      policy => policy.RequireRole("Student"));
    options.AddPolicy("MemberOrCreator",  policy => policy.RequireRole("GroupCreator", "Student"));
});
 
// ─── CORS ──────────────────────────────────────────────────────
var allowedOrigins = builder.Configuration["Cors:AllowedOrigins"] ?? "http://localhost:3000";
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
        policy.WithOrigins(allowedOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials());
});
 
// ─── Repositories ──────────────────────────────────────────────
builder.Services.AddScoped<IUserRepository,         UserRepository>();
builder.Services.AddScoped<IRoleRepository,         RoleRepository>();
builder.Services.AddScoped<IRefreshTokenRepository, RefreshTokenRepository>();
builder.Services.AddScoped<IGroupRepository,        GroupRepository>();
builder.Services.AddScoped<IJoinRequestRepository,  JoinRequestRepository>();
builder.Services.AddScoped<IMaterialRepository,     MaterialRepository>();
builder.Services.AddScoped<IDiscussionRepository,   DiscussionRepository>();
builder.Services.AddScoped<INotificationRepository, NotificationRepository>();
 
// ─── Auth Services ─────────────────────────────────────────────
builder.Services.AddScoped<IPasswordHasher,    PasswordHasher>();
builder.Services.AddScoped<IJwtTokenGenerator, JwtTokenGenerator>();
builder.Services.AddScoped<IAuthService,       AuthService>();
 
// ─── Business Services ─────────────────────────────────────────
builder.Services.AddScoped<IGroupService,        GroupService>();
builder.Services.AddScoped<IJoinRequestService,  JoinRequestService>();
builder.Services.AddScoped<IMaterialService,     MaterialService>();
builder.Services.AddScoped<IDiscussionService,   DiscussionService>();
builder.Services.AddScoped<INotificationService, NotificationService>();
builder.Services.AddScoped<IAdminService,        AdminService>();
 
// ─── SignalR ───────────────────────────────────────────────────
builder.Services.AddSignalR();
 
// ─── Controllers + Swagger ─────────────────────────────────────
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title   = "StudyGroup API",
        Version = "v1"
    });
 
    // ─── Swagger: دعم JWT ──────────────────────────────────────
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name         = "Authorization",
        Type         = SecuritySchemeType.Http,
        Scheme       = "Bearer",
        BearerFormat = "JWT",
        In           = ParameterLocation.Header,
        Description  = "اكتب الـ JWT token هنا"
    });
    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" }
            },
            Array.Empty<string>()
        }
    });
});
 
// ─── HttpContext Accessor ──────────────────────────────────────
builder.Services.AddHttpContextAccessor();
 
// ══════════════════════════════════════════════════════════════
var app = builder.Build();
// ══════════════════════════════════════════════════════════════
 
// ─── Global Exception Handler ──────────────────────────────────
app.UseMiddleware<GlobalExceptionMiddleware>();
 
// ─── Swagger (Development only) ────────────────────────────────
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "StudyGroup API v1"));
}
 
// ─── Static Files (uploads) ────────────────────────────────────
app.UseStaticFiles();
 
// ─── CORS ──────────────────────────────────────────────────────
app.UseCors("AllowFrontend");
 
// ─── Auth ──────────────────────────────────────────────────────
app.UseAuthentication();
app.UseMiddleware<CurrentUserMiddleware>();
app.UseAuthorization();
 
// ─── Controllers ───────────────────────────────────────────────
app.MapControllers();
 
// ─── SignalR Hubs ──────────────────────────────────────────────
app.MapHub<GroupDiscussionHub>("/hubs/discussion");
app.MapHub<NotificationHub>("/hubs/notifications");
 
// ─── Auto Migration on Startup ─────────────────────────────────
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
}
 
app.Run();