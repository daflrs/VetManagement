using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VetManagement.Common;
using VetManagement.Data;
using VetManagement.DTOs;
using VetManagement.Models;

namespace VetManagement.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ServicesController : ControllerBase
    {
        private readonly VetManagementDbContext _context;

        public ServicesController(VetManagementDbContext context)
        {
            _context = context;
        }

        private static ServiceDto ToDto(Service service)
        {
            return new ServiceDto
            {
                ServiceId = service.ServiceId,
                Name = service.Name,
                Price = service.Price
            };
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ServiceDto>>> GetServices()
        {
            var services = await _context.Services
                .Select(s => ToDto(s))
                .ToListAsync();

            return Ok(services);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ServiceDto>> GetService(int id)
        {
            var service = await _context.Services
                .Where(s => s.ServiceId == id)
                .Select(s => ToDto(s))
                .FirstOrDefaultAsync();

            if (service == null)
            {
                return ApiResponses.NotFound($"Service with {id} not found.");
            }

            return Ok(service);
        }

        [HttpPost]
        public async Task<ActionResult<ServiceDto>> CreateService(CreateServiceDto dto)
        {
            var service = new Service
            {
                Name = dto.Name,
                Price = dto.Price
            };

            _context.Services.Add(service);

            await _context.SaveChangesAsync();

            var result = ToDto(service);

            return CreatedAtAction(
                nameof(GetService),
                new { id = service.ServiceId },
                result);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ServiceDto>> UpdateService(int id, UpdateServiceDto dto)
        {
            var service = await _context.Services.FindAsync(id);

            if (service == null)
            {
                return ApiResponses.NotFound($"Service with {id} not found.");
            }

            service.Name = dto.Name;
            service.Price = dto.Price;

            await _context.SaveChangesAsync();

            return Ok(ToDto(service));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteService(int id)
        {
            var service = await _context.Services.FindAsync(id);

            if (service == null)
            {
                return ApiResponses.NotFound($"Service with {id} not found.");
            }

            _context.Services.Remove(service);

            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
