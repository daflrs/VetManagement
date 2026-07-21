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

        private static MedicalRecordDetailsDto ToDetailsDto(MedicalRecord medicalRecord)
        {
            return new MedicalRecordDetailsDto
            {
                VisitDate = medicalRecord.VisitDate,
                Complaint = medicalRecord.Complaint,
                Diagnosis = medicalRecord.Diagnosis,
                Treatment = medicalRecord.Treatment,
                Weight = medicalRecord.Weight,
                ClinicalExam = medicalRecord.ClinicalExam,
                ClientCommunication = medicalRecord.ClientCommunication,
                Notes = medicalRecord.Notes,
                Pet = new PetDto
                {
                    PetId = medicalRecord.PetId,
                    Name = medicalRecord.Pet.Name,
                    Species = medicalRecord.Pet.Species,
                    Breed = medicalRecord.Pet.Breed,
                    BirthDate = medicalRecord.Pet.BirthDate,
                    Weight = medicalRecord.Pet.Weight
                },
                Owner = medicalRecord.Pet.Owner != null
                        ? new OwnerDto
                        {
                            OwnerId = medicalRecord.Pet.Owner.OwnerId,
                            FirstName = medicalRecord.Pet.Owner.FirstName,
                            LastName = medicalRecord.Pet.Owner.LastName,
                            PhoneNumber = medicalRecord.Pet.Owner.PhoneNumber,
                            Email = medicalRecord.Pet.Owner.Email,
                            Address = medicalRecord.Pet.Owner.Address
                        }
                        : null,
                Appointment = medicalRecord.Appointment != null
                        ? new AppointmentDto
                        {
                            AppointmentId = medicalRecord.Appointment.AppointmentId,
                            Type = medicalRecord.Appointment.Type,
                            AppointmentDate = medicalRecord.Appointment.AppointmentDate,
                            Reason = medicalRecord.Appointment.Reason,
                            Status = medicalRecord.Appointment.Status
                        }
                        : null
            };
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
                    Complaint = m.Complaint,
                    Diagnosis = m.Diagnosis,
                    Treatment = m.Treatment,
                    Weight = m.Weight,
                    ClinicalExam = m.ClinicalExam,
                    ClientCommunication = m.ClientCommunication,
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
                    Complaint = m.Complaint,
                    Diagnosis = m.Diagnosis,
                    Treatment = m.Treatment,
                    Weight = m.Weight,
                    ClinicalExam = m.ClinicalExam,
                    ClientCommunication = m.ClientCommunication,
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
                .Include(m => m.Appointment)
                .Include(m => m.Pet)
                    .ThenInclude(p => p.Owner)
                .FirstOrDefaultAsync(m => m.MedicalRecordId == id);

            if (medicalRecord == null)
            {
                return ApiResponses.NotFound($"Medical record with {id} not found.");
            }

            return Ok(ToDetailsDto(medicalRecord));
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
                Complaint = dto.Complaint,
                Diagnosis = dto.Diagnosis,
                Treatment = dto.Treatment,
                Weight = dto.Weight,
                ClinicalExam = dto.ClinicalExam,
                ClientCommunication = dto.ClientCommunication,
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
                    Complaint = m.Complaint,
                    Diagnosis = m.Diagnosis,
                    Treatment = m.Treatment,
                    Weight = m.Weight,
                    ClinicalExam = m.ClinicalExam,
                    ClientCommunication = m.ClientCommunication,
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
            medicalRecord.Complaint = dto.Complaint;
            medicalRecord.Diagnosis = dto.Diagnosis;
            medicalRecord.Treatment = dto.Treatment;
            medicalRecord.Weight = dto.Weight;
            medicalRecord.ClinicalExam = dto.ClinicalExam;
            medicalRecord.ClientCommunication = dto.ClientCommunication;
            medicalRecord.Notes = dto.Notes;

            await _context.SaveChangesAsync();

            var updatedMedicalRecord = await _context.MedicalRecords
                .Include(m => m.Appointment)
                .Include(m => m.Pet)
                    .ThenInclude(p => p.Owner)
                .FirstAsync(m => m.MedicalRecordId == id);

            return Ok(ToDetailsDto(updatedMedicalRecord));
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
