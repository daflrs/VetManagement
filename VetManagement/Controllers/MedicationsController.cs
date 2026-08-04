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
    public class MedicationsController : ControllerBase
    {
        private readonly VetManagementDbContext _context;

        public MedicationsController(VetManagementDbContext context)
        {
            _context = context;
        }

        private static MedicationDto ToDto(Medication medication)
        {
            return new MedicationDto
            {
                MedicationId = medication.MedicationId,
                Name = medication.Name,
                Price = medication.Price,
                AvailableCount = medication.AvailableCount,
                Manufacturer = medication.Manufacturer,
                ExpirationDate = medication.ExpirationDate
            };
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<MedicationDto>>> GetMedications()
        {
            var medications = await _context.Medications
                .Select(m => ToDto(m))
                .ToListAsync();

            return Ok(medications);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<MedicationDto>> GetMedication(int id)
        {
            var medication = await _context.Medications
                .Where(m => m.MedicationId == id)
                .Select(m => ToDto(m))
                .FirstOrDefaultAsync();

            if (medication == null)
            {
                return ApiResponses.NotFound($"Medication with {id} not found.");
            }

            return Ok(medication);
        }

        [HttpPost]
        public async Task<ActionResult<MedicationDto>> CreateMedication(CreateMedicationDto dto)
        {
            var medication = new Medication
            {
                Name = dto.Name,
                Price = dto.Price,
                AvailableCount = dto.AvailableCount,
                Manufacturer = dto.Manufacturer,
                ExpirationDate = dto.ExpirationDate
            };

            _context.Medications.Add(medication);

            await _context.SaveChangesAsync();

            var result = ToDto(medication);

            return CreatedAtAction(
                nameof(GetMedication),
                new { id = medication.MedicationId },
                result);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<MedicationDto>> UpdateMedication(int id, UpdateMedicationDto dto)
        {
            var medication = await _context.Medications.FindAsync(id);

            if (medication == null)
            {
                return ApiResponses.NotFound($"Medication with {id} not found.");
            }

            medication.Name = dto.Name;
            medication.Price = dto.Price;
            medication.AvailableCount = dto.AvailableCount;
            medication.Manufacturer = dto.Manufacturer;
            medication.ExpirationDate = dto.ExpirationDate;

            await _context.SaveChangesAsync();

            return Ok(ToDto(medication));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMedication(int id)
        {
            var medication = await _context.Medications.FindAsync(id);

            if (medication == null)
            {
                return ApiResponses.NotFound($"Medication with {id} not found.");
            }

            _context.Medications.Remove(medication);

            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
