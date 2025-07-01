using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OrderService.Data;
using OrderService.Models;
using Microsoft.Extensions.Options;

namespace OrderService.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class OrdersController : ControllerBase
    {
        private readonly AppDbContext _dbContext;
        private readonly MyAppSettings _appSettings;
        private readonly IConfiguration _configuration;

        public OrdersController(AppDbContext dbContext, IOptions<MyAppSettings> appSettings, IConfiguration configuration)
        {
            _dbContext = dbContext;
            _appSettings = appSettings.Value;
            _configuration = configuration;
        }

        [HttpGet("config-info")]
        public IActionResult GetConfigInfo()
        {
            var configMessage = _appSettings.Message;
            var connectionString = _configuration["myApp:database:connectionString"];
            var servicePort = _configuration["server:port"];

            return Ok(new
            {
                Service = "OrderService",
                ConfigMessage = configMessage,
                DbConnectionString = connectionString,
                ServicePort = servicePort
            });
        }

        [HttpGet]
        public async Task<IActionResult> GetAllOrders()
        {
            var orders = await _dbContext.Orders.ToListAsync();
            return Ok(orders);
        }

        [HttpPost]
        public async Task<IActionResult> CreateOrder(Order order)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            _dbContext.Orders.Add(order);
            await _dbContext.SaveChangesAsync();
            return CreatedAtAction(nameof(GetAllOrders), new { id = order.Id }, order);
        }
    }
}