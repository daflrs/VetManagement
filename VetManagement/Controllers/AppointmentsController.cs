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
    public class AppointmentsController : ControllerBase
    {
        private readonly VetManagementDbContext _context;

        public AppointmentsController(VetManagementDbContext context)
        {
            _context = context;
        }

        private static AppointmentDetailsDto ToDetailsDto(Appointment appointment)
        {
            return new AppointmentDetailsDto
            {
                AppointmentId = appointment.AppointmentId,
                AppointmentDate = appointment.AppointmentDate,
                Reason = appointment.Reason,
                Status = appointment.Status,
                Type = appointment.Type,
                DurationMinutes = appointment.DurationMinutes,
                CheckInTime = appointment.CheckInTime,
                CheckOutTime = appointment.CheckOutTime,
                RecordedDurationMinutes = appointment.RecordedDurationMinutes,
                Pet = new PetDto
                {
                    PetId = appointment.PetId,
                    Name = appointment.Pet.Name,
                    Species = appointment.Pet.Species,
                    Breed = appointment.Pet.Breed,
                    BirthDate = appointment.Pet.BirthDate,
                    Weight = appointment.Pet.Weight
                },
                Owner = appointment.Pet.Owner != null
                        ? new OwnerDto
                        {
                            OwnerId = appointment.Pet.Owner.OwnerId,
                            FirstName = appointment.Pet.Owner.FirstName,
                            LastName = appointment.Pet.Owner.LastName,
                            PhoneNumber = appointment.Pet.Owner.PhoneNumber,
                            Email = appointment.Pet.Owner.Email,
                            Address = appointment.Pet.Owner.Address
                        }
                        : null
            };
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<AppointmentDto>>> GetAppointments()
        {
            var appointments = await _context.Appointments
                .Include(a => a.Pet)
                .Select(a => new AppointmentDto
                {
                    AppointmentId = a.AppointmentId,
                    PetId = a.PetId,
                    Type = a.Type,
                    AppointmentDate = a.AppointmentDate,
                    Reason = a.Reason,
                    Status = a.Status,
                    PetName = a.Pet.Name,
                    MedicalRecordId = a.MedicalRecord != null
                        ? a.MedicalRecord.MedicalRecordId
                        : null
                })
                .ToListAsync();

            return Ok(appointments);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<AppointmentDto>> GetAppointment(int id)
        {
            var appointment = await _context.Appointments
                .Include(a => a.Pet)
                .Where(a => a.AppointmentId == id)
                .Select(a => new AppointmentDto
                {
                    AppointmentId = a.AppointmentId,
                    PetId = a.PetId,
                    Type = a.Type,
                    AppointmentDate = a.AppointmentDate,
                    Reason = a.Reason,
                    Status = a.Status,
                    PetName = a.Pet.Name,
                    MedicalRecordId = a.MedicalRecord != null
                        ? a.MedicalRecord.MedicalRecordId
                        : null
                })
                .FirstOrDefaultAsync();

            if (appointment == null)
            {
                return ApiResponses.NotFound($"Appointment with {id} not found.");
            }

            return Ok(appointment);
        }

        [HttpGet("details/{id}")]
        public async Task<ActionResult<AppointmentDetailsDto>> GetAppointmentDetails(int id)
        {
            var appointment = await _context.Appointments
                .Include(a => a.Pet)
                .ThenInclude(p => p.Owner)
                .Where(a => a.AppointmentId == id)
                .FirstOrDefaultAsync();

            if (appointment == null)
            {
                return ApiResponses.NotFound($"Appointment with {id} not found.");
            }

            return Ok(ToDetailsDto(appointment));
        }

        [HttpGet("available-for-medical-record")]
        public async Task<ActionResult<IEnumerable<AppointmentDto>>> GetAppointmentsAvailableForMedicalRecord()
        {
            var appointments = await _context.Appointments
                .Include(a => a.Pet)
                .Where(a => 
                    a.Status == AppointmentStatus.Completed && 
                    a.MedicalRecord == null)
                .Select(a => new AppointmentDto
                {
                    AppointmentId = a.AppointmentId,
                    PetId = a.PetId,
                    Type = a.Type,
                    AppointmentDate = a.AppointmentDate,
                    Reason = a.Reason,
                    Status = a.Status,
                    PetName = a.Pet.Name
                })
                .ToListAsync();

            return Ok(appointments);
        }

        [HttpPost]
        public async Task<ActionResult<AppointmentDto>> CreateAppointment(CreateAppointmentDto dto)
        {
            var pet = await _context.Pets
                .FirstOrDefaultAsync(p => p.PetId == dto.PetId);

            if (pet == null)
            {
                return ApiResponses.NotFound("Pet not found");
            }

            if (dto.Type != AppointmentType.Scheduled)
            {
                dto.AppointmentDate = DateTime.Now;
            }

            var appointment = new Appointment
            {
                AppointmentDate = dto.AppointmentDate,
                PetId = dto.PetId,
                Reason = dto.Reason,
                Type = dto.Type
            };

            _context.Appointments.Add(appointment);

            await _context.SaveChangesAsync();

            var result = new AppointmentDto
            {
                AppointmentId = appointment.AppointmentId,
                PetId = appointment.PetId,
                AppointmentDate = appointment.AppointmentDate,
                Reason = appointment.Reason,
                Status = appointment.Status,
                PetName = pet.Name,
                Type = dto.Type
            };

            return CreatedAtAction(
                nameof(GetAppointment),
                new { id = appointment.AppointmentId },
                result);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<AppointmentDto>> UpdateAppointment(int id, UpdateAppointmentDto dto)
        {
            var appointment = await _context.Appointments.FindAsync(id);

            if (appointment == null)
            {
                return ApiResponses.NotFound($"Appointment with {id} not found.");
            }

            if (dto.Type != AppointmentType.Scheduled)
            {
                dto.AppointmentDate = DateTime.Now;
            }

            switch (appointment.Status)
            {
                case AppointmentStatus.Scheduled:
                    appointment.AppointmentDate = dto.AppointmentDate;
                    appointment.Type = dto.Type;
                    break;
                case AppointmentStatus.Cancelled:
                case AppointmentStatus.NoShow:
                    appointment.Type = dto.Type;
                    break;
            }

            appointment.Reason = dto.Reason;
            appointment.DurationMinutes = dto.DurationMinutes;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpPost("{id}/check-in")]
        public async Task<ActionResult<AppointmentDetailsDto>> CheckInAppointment(int id)
        {
            var appointment = await _context.Appointments
                .Include(a => a.Pet)
                .ThenInclude(p => p.Owner)
                .FirstOrDefaultAsync(a => a.AppointmentId == id);

            if (appointment == null)
            {
                return ApiResponses.NotFound($"Appointment with {id} not found.");
            }

            if (appointment.Status != AppointmentStatus.Scheduled)
            {
                return ApiResponses.BadRequest("Appointment status is not scheduled.");
            }

            appointment.Status = AppointmentStatus.InProgress;
            appointment.CheckInTime = DateTime.Now;

            await _context.SaveChangesAsync();

            return Ok(ToDetailsDto(appointment));
        }

        [HttpPost("{id}/cancel")]
        public async Task<ActionResult<AppointmentDetailsDto>> CancelAppointment(int id)
        {
            var appointment = await _context.Appointments
                .Include(a => a.Pet)
                .ThenInclude(p => p.Owner)
                .FirstOrDefaultAsync(a => a.AppointmentId == id);

            if (appointment == null)
            {
                return ApiResponses.NotFound($"Appointment with {id} not found.");
            }

            if (appointment.Status != AppointmentStatus.Scheduled)
            {
                return ApiResponses.BadRequest("Appointment status is not scheduled.");
            }

            appointment.Status = AppointmentStatus.Cancelled;

            await _context.SaveChangesAsync();

            return Ok(ToDetailsDto(appointment));
        }

        [HttpPost("{id}/no-show")]
        public async Task<ActionResult<AppointmentDetailsDto>> NoShowAppointment(int id)
        {
            var appointment = await _context.Appointments
                .Include(a => a.Pet)
                .ThenInclude(p => p.Owner)
                .FirstOrDefaultAsync(a => a.AppointmentId == id);

            if (appointment == null)
            {
                return ApiResponses.NotFound($"Appointment with {id} not found.");
            }

            if (appointment.Status != AppointmentStatus.Scheduled)
            {
                return ApiResponses.BadRequest("Appointment status is not scheduled.");
            }

            appointment.Status = AppointmentStatus.NoShow;

            await _context.SaveChangesAsync();

            return Ok(ToDetailsDto(appointment));
        }

        [HttpPost("{id}/complete")]
        public async Task<ActionResult<AppointmentDetailsDto>> CompleteAppointment(int id)
        {
            var appointment = await _context.Appointments
                .Include(a => a.Pet)
                .ThenInclude(p => p.Owner)
                .FirstOrDefaultAsync(a => a.AppointmentId == id);

            if (appointment == null)
            {
                return ApiResponses.NotFound($"Appointment with {id} not found.");
            }

            if (appointment.Status != AppointmentStatus.InProgress)
            {
                return ApiResponses.BadRequest("Appointment status is not in-progress.");
            }

            appointment.Status = AppointmentStatus.Completed;
            appointment.CheckOutTime = DateTime.Now;
            appointment.RecordedDurationMinutes = appointment.CheckOutTime.HasValue && appointment.CheckInTime.HasValue
                ? (int)(appointment.CheckOutTime.Value - appointment.CheckInTime.Value).TotalMinutes
                : null;

            await _context.SaveChangesAsync();

            return Ok(ToDetailsDto(appointment));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAppointment(int id)
        {
            var appointment = await _context.Appointments.FindAsync(id);

            if (appointment == null)
            {
                return ApiResponses.NotFound($"Appointment with {id} not found.");
            }

            _context.Appointments.Remove(appointment);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
