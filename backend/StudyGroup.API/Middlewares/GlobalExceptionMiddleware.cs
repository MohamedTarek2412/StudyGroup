 using System.Net;
using System.Text.Json;

namespace StudyGroup.API.Middlewares;

public class GlobalExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<GlobalExceptionMiddleware> _logger;

    public GlobalExceptionMiddleware(RequestDelegate next, ILogger<GlobalExceptionMiddleware> logger)
    {
        _next = next; _logger = logger;
    }

    public async Task InvokeAsync(HttpContext ctx)
    {
        try { await _next(ctx); }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unhandled exception");
            await WriteError(ctx, ex);
        }
    }

    private static Task WriteError(HttpContext ctx, Exception ex)
    {
        var (status, message) = ex switch
        {
            UnauthorizedAccessException => (HttpStatusCode.Unauthorized, ex.Message),
            KeyNotFoundException        => (HttpStatusCode.NotFound, ex.Message),
            InvalidOperationException   => (HttpStatusCode.BadRequest, ex.Message),
            _                           => (HttpStatusCode.InternalServerError, "An unexpected error occurred.")
        };

        ctx.Response.StatusCode = (int)status;
        ctx.Response.ContentType = "application/json";

        var body = JsonSerializer.Serialize(new { message });
        return ctx.Response.WriteAsync(body);
    }
}