using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProductService.Data;
using ProductService.Models;
using Microsoft.Extensions.Options;

namespace ProductService.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly AppDbContext _dbContext;
        private readonly MyAppSettings _appSettings;
        private readonly IConfiguration _configuration;

        public ProductsController(AppDbContext dbContext, IOptions<MyAppSettings> appSettings, IConfiguration configuration)
        {
            _dbContext = dbContext;
            _appSettings = appSettings.Value;
            _configuration = configuration;
        }

        [HttpGet("config-info")]
        public IActionResult GetConfigInfo()
        {
            // Access configuration via strongly-typed options
            var configMessage = _appSettings.Message;
            // Access raw configuration
            var connectionString = _configuration["myApp:database:connectionString"];
            var servicePort = _configuration["server:port"];

            return Ok(new
            {
                Service = "ProductService",
                ConfigMessage = configMessage,
                DbConnectionString = connectionString,
                ServicePort = servicePort
            });
        }

        [HttpGet]
        public async Task<IActionResult> GetAllProducts()
        {
            var products = await _dbContext.Products.ToListAsync();
            return Ok(products);
        }

        [HttpPost]
        public async Task<IActionResult> CreateProduct(Product product)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            _dbContext.Products.Add(product);
            await _dbContext.SaveChangesAsync();
            return CreatedAtAction(nameof(GetAllProducts), new { id = product.Id }, product);
        }
    }
}