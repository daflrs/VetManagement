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
    public class MedicalRecordsController : ControllerBase
    {
        private readonly VetManagementDbContext _context;

        public MedicalRecordsController(VetManagementDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<MedicalRecordDto>>> GetMedicalRecords()
        {
            var medicalRecords = await _context.MedicalRecords
                .Select(m => new MedicalRecordDto
                {
                    MedicalRecordId = m.MedicalRecordId,
                    AppointmentId = m.AppointmentId,
                    PetName = m.Pet.Name,
                    VisitDate = m.VisitDate,
                    Symptoms = m.Symptoms,
                    Diagnosis = m.Diagnosis,
                    Treatment = m.Treatment,
                    Weight = m.Weight,
                    Notes = m.Notes
                })
                .ToListAsync();

            return Ok(medicalRecords);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<MedicalRecordDto>> GetMedicalRecord(int id)
        {
            var medicalRecord = await _context.MedicalRecords
                .Where(m => m.MedicalRecordId == id)
                .Select(m => new MedicalRecordDto
                {
                    MedicalRecordId = m.MedicalRecordId,
                    AppointmentId = m.AppointmentId,
                    VisitDate = m.VisitDate,
                    Symptoms = m.Symptoms,
                    Diagnosis = m.Diagnosis,
                    Treatment = m.Treatment,
                    Weight = m.Weight,
                    Notes = m.Notes,
                    PetName = m.Pet.Name
                })
                .FirstOrDefaultAsync();

            if (medicalRecord == null)
            {
                return ApiResponses.NotFound($"Medical record with {id} not found.");
            }

            return Ok(medicalRecord);
        }

        [HttpGet("details/{id}")]
        public async Task<ActionResult<MedicalRecordDetailsDto>> GetMedicalRecordDetails(int id)
        {
            var medicalRecord = await _context.MedicalRecords
                .Where(m => m.MedicalRecordId == id)
                .Select(m => new MedicalRecordDetailsDto
                {
                    VisitDate = m.VisitDate,
                    Symptoms = m.Symptoms,
                    Diagnosis = m.Diagnosis,
                    Treatment = m.Treatment,
                    Weight = m.Weight,
                    Notes = m.Notes,
                    Pet = new PetDto
                    {
                        PetId = m.PetId,
                        Name = m.Pet.Name,
                        Species = m.Pet.Species,
                        Breed = m.Pet.Breed,
                        BirthDate = m.Pet.BirthDate,
                        Weight = m.Pet.Weight
                    },
                    Owner = m.Pet.Owner != null
                        ? new OwnerDto
                        {
                            OwnerId = m.Pet.Owner.OwnerId,
                            FirstName = m.Pet.Owner.FirstName,
                            LastName = m.Pet.Owner.LastName,
                            PhoneNumber = m.Pet.Owner.PhoneNumber,
                            Email = m.Pet.Owner.Email,
                            Address = m.Pet.Owner.Address
                        }
                        : null,
                    Appointment = m.Appointment != null
                        ? new AppointmentDto
                        {
                            AppointmentId = m.Appointment.AppointmentId,
                            Type = m.Appointment.Type,
                            AppointmentDate = m.Appointment.AppointmentDate,
                            Reason = m.Appointment.Reason,
                            Status = m.Appointment.Status
                        }
                        : null
                })
                .FirstOrDefaultAsync();

            if (medicalRecord == null)
            {
                return ApiResponses.NotFound($"Medical record with {id} not found.");
            }

            return Ok(medicalRecord);
        }

        [HttpPost]
        public async Task<ActionResult<MedicalRecordDto>> CreateMedicalRecord(CreateMedicalRecordDto dto)
        {
            if (dto.AppointmentId is not null
                && await _context.MedicalRecords.AnyAsync(m => m.AppointmentId == dto.AppointmentId))
            {
                return ApiResponses.BadRequest("A medical record already exists for this appointment.");
            }

            var medicalRecord = new MedicalRecord
            {
                PetId = dto.PetId,
                VisitDate = dto.VisitDate,
                Symptoms = dto.Symptoms,
                Diagnosis = dto.Diagnosis,
                Treatment = dto.Treatment,
                Weight = dto.Weight,
                Notes = dto.Notes,
                AppointmentId = dto.AppointmentId
            };

            _context.MedicalRecords.Add(medicalRecord);

            await _context.SaveChangesAsync();

            var result = await _context.MedicalRecords
                .Where(m => m.MedicalRecordId == medicalRecord.MedicalRecordId)
                .Select(m => new MedicalRecordDto
                {
                    MedicalRecordId = m.MedicalRecordId,
                    AppointmentId = m.AppointmentId,
                    VisitDate = m.VisitDate,
                    Symptoms = m.Symptoms,
                    Diagnosis = m.Diagnosis,
                    Treatment = m.Treatment,
                    Weight = m.Weight,
                    Notes = m.Notes,
                    PetName = m.Pet.Name
                })
                .FirstAsync();

            return CreatedAtAction(
                nameof(GetMedicalRecord),
                new { id = medicalRecord.MedicalRecordId },
                result);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<MedicalRecordDto>> UpdateMedicalRecord(int id, UpdateMedicalRecordDto dto)
        {
            var medicalRecord = await _context.MedicalRecords.FindAsync(id);

            if (medicalRecord == null)
            {
                return ApiResponses.NotFound($"Medical record with {id} not found.");
            }

            medicalRecord.VisitDate = dto.VisitDate;
            medicalRecord.Symptoms = dto.Symptoms;
            medicalRecord.Diagnosis = dto.Diagnosis;
            medicalRecord.Treatment = dto.Treatment;
            medicalRecord.Weight = dto.Weight;
            medicalRecord.Notes = dto.Notes;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMedicalRecord(int id)
        {
            var medicalRecord = await _context.MedicalRecords.FindAsync(id);

            if (medicalRecord == null)
            {
                return ApiResponses.NotFound($"Medical record with {id} not found.");
            }

            _context.MedicalRecords.Remove(medicalRecord);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
