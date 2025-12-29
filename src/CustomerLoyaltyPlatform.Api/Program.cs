using CustomerLoyaltyPlatform.Api;
using CustomerLoyaltyPlatform.Core;
using CustomerLoyaltyPlatform.Infrastructure;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Serilog;

Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .CreateBootstrapLogger();

try
{
    Log.Information("Starting CustomerLoyaltyPlatform API");

    var builder = WebApplication.CreateBuilder(args);

    builder.Host.UseSerilog((context, services, configuration) => configuration
        .ReadFrom.Configuration(context.Configuration)
        .ReadFrom.Services(services)
        .Enrich.FromLogContext()
        .Enrich.WithEnvironmentName()
        .Enrich.WithThreadId()
        .Enrich.WithProperty("Application", "CustomerLoyaltyPlatform.Api")
        .WriteTo.Console(outputTemplate: "[{Timestamp:HH:mm:ss} {Level:u3}] {CorrelationId} {Message:lj}{NewLine}{Exception}"));

    builder.Services.AddControllers();
    builder.Services.AddEndpointsApiExplorer();
    builder.Services.AddSwaggerGen();

    builder.Services.AddDbContext<CustomerLoyaltyPlatformContext>(options =>
        options.UseSqlServer(
            builder.Configuration.GetConnectionString("DefaultConnection"),
            b => b.MigrationsAssembly(typeof(CustomerLoyaltyPlatformContext).Assembly.FullName)));

    builder.Services.AddScoped<ICustomerLoyaltyPlatformContext>(provider =>
        provider.GetRequiredService<CustomerLoyaltyPlatformContext>());

    builder.Services.AddMediatR(cfg =>
        cfg.RegisterServicesFromAssemblyContaining<Program>());

    var corsOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? [];

    builder.Services.AddCors(options => options.AddPolicy(
        "CorsPolicy",
        builder =>
        {
            if (corsOrigins.Length > 0)
            {
                builder.WithOrigins(corsOrigins)
                    .AllowAnyMethod()
                    .AllowAnyHeader()
                    .AllowCredentials();
            }
            else
            {
                builder.AllowAnyOrigin()
                    .AllowAnyMethod()
                    .AllowAnyHeader();
            }
        }));

    var app = builder.Build();

    app.UseSerilogRequestLogging(options =>
    {
        options.EnrichDiagnosticContext = (diagnosticContext, httpContext) =>
        {
            diagnosticContext.Set("RequestHost", httpContext.Request.Host.Value ?? string.Empty);
            diagnosticContext.Set("RequestScheme", httpContext.Request.Scheme);

            if (httpContext.Request.Headers.TryGetValue("X-Correlation-Id", out var correlationId))
            {
                diagnosticContext.Set("CorrelationId", correlationId.ToString());
            }
        };
    });

    if (app.Environment.IsDevelopment())
    {
        app.UseSwagger();
        app.UseSwaggerUI();
    }

    if (!app.Environment.IsDevelopment())
    {
        app.UseHttpsRedirection();
    }

    app.UseCors("CorsPolicy");
    app.UseAuthorization();
    app.MapControllers();

    app.Run();
}
catch (Exception ex)
{
    Log.Fatal(ex, "Application terminated unexpectedly");
}
finally
{
    Log.CloseAndFlush();
}

namespace CustomerLoyaltyPlatform.Api
{
    /// <summary>
    /// Program class.
    /// </summary>
    public partial class Program
    {
    }
}
