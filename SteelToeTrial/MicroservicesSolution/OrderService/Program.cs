using Steeltoe.Extensions.Configuration.ConfigServer;
using Microsoft.EntityFrameworkCore;
using OrderService.Data;
using OrderService.Models;
using Microsoft.Extensions.Options;

var builder = WebApplication.CreateBuilder(args);

// --- Steeltoe Configuration Provider: MUST be called early! ---
builder.AddConfigServer();

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// --- Configure strongly-typed options ---
builder.Services.Configure<MyAppSettings>(builder.Configuration.GetSection("myApp"));

// --- Configure DbContext with the connection string from the Config Server ---
builder.Services.AddDbContext<AppDbContext>(options =>
{
    var connectionString = builder.Configuration.GetSection("myApp:database:connectionString").Value;
    if (string.IsNullOrEmpty(connectionString))
    {
        throw new InvalidOperationException("PostgreSQL connection string for OrderService is not configured in Steeltoe Config Server.");
    }
    options.UseNpgsql(connectionString);
});

var app = builder.Build();

// --- Apply database migrations on startup ---
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    try
    {
        Console.WriteLine("OrderService: Applying database migrations...");
        dbContext.Database.Migrate();
        Console.WriteLine("OrderService: Database migrations applied successfully.");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"OrderService: Error applying migrations: {ex.Message}");
        Console.WriteLine(ex.ToString());
    }
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthorization();
app.MapControllers();

app.Run();

// --- Configuration Classes (can be in a separate file) ---
public class MyAppSettings
{
    public string Message { get; set; }
    public DatabaseSettings Database { get; set; } = new DatabaseSettings();
}

public class DatabaseSettings
{
    public string ConnectionString { get; set; }
}