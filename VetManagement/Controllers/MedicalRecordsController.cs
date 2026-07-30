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
        private readonly IWebHostEnvironment _environment;

        public MedicalRecordsController(VetManagementDbContext context, IWebHostEnvironment environment)
        {
            _context = context;
            _environment = environment;
        }

        private static readonly string[] AllowedImageExtensions =
        {
            ".jpg",
            ".jpeg",
            ".png"
        };

        private static bool IsValidImage(IFormFile image)
        {
            var extension = Path.GetExtension(image.FileName).ToLowerInvariant();
            
            return AllowedImageExtensions.Contains(extension);
        }

        private static string GenerateFileName(IFormFile file)
        {
            return Guid.NewGuid() + Path.GetExtension(file.FileName);
        }

        private async Task<string> SaveImage(IFormFile image, string folderName)
        {
            var uploadsFolder = Path.Combine(
                _environment.WebRootPath,
                "uploads",
                folderName);

            if (!Directory.Exists(uploadsFolder))
            {
                Directory.CreateDirectory(uploadsFolder);
            }

            var fileName = GenerateFileName(image);

            var path = Path.Combine(
                uploadsFolder,
                fileName);

            using var stream = new FileStream(path, FileMode.Create);
            await image.CopyToAsync(stream);

            return $"/uploads/{folderName}/{fileName}";
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
                    : null,
                LabExam = medicalRecord.LabExam != null
                    ? new LabExamDto
                    {
                        LabExamId = medicalRecord.LabExam.LabExamId,
                        Interpretation = medicalRecord.LabExam.Interpretation,
                        LabExamFindings = medicalRecord.LabExam.LabExamFindings
                            .OrderByDescending(l => l.LabExamFindingId)
                            .Select(l => new LabExamFindingsDto
                            {
                                LabExamFindingId = l.LabExamFindingId,
                                ImagePath = l.ImagePath,
                                Remark = l.Remark
                            })
                            .ToList()
                    }
                    : null
            };
        }

        private async Task<MedicalRecord> GetMedicalRecordDetailss(int id)
        {
            return await _context.MedicalRecords
                .Include(m => m.Appointment)
                .Include(m => m.LabExam!)
                    .ThenInclude(l => l.LabExamFindings)
                .Include(m => m.Pet)
                    .ThenInclude(p => p.Owner)
                .FirstAsync(m => m.MedicalRecordId == id);
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
            var medicalRecord = await GetMedicalRecordDetailss(id);

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
        public async Task<ActionResult<MedicalRecordDetailsDto>> UpdateMedicalRecord(int id, UpdateMedicalRecordDto dto)
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

            return Ok(ToDetailsDto(await GetMedicalRecordDetailss(id)));
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

        [HttpPost("{id}/lab-examination")]
        public async Task<ActionResult<MedicalRecordDetailsDto>> CreateLabExamination(int id, CreateLabExaminationDto dto)
        {
            if (!await _context.MedicalRecords.AnyAsync(m => m.MedicalRecordId == id))
            {
                return ApiResponses.NotFound($"Medical record with {id} not found.");
            }

            if (await _context.LabExams.AnyAsync(l => l.MedicalRecordId == id))
            {
                return ApiResponses.BadRequest("A lab examination already exists for this medical record.");
            }

            var labExam = new LabExam
            {
                Interpretation = dto.Interpretation,
                MedicalRecordId = id
            };

            _context.LabExams.Add(labExam);

            await _context.SaveChangesAsync();

            return Ok(ToDetailsDto(await GetMedicalRecordDetailss(id)));
        }

        [HttpPut("{id}/lab-examination")]
        public async Task<ActionResult<MedicalRecordDetailsDto>> UpdateLabExamination(int id, UpdateLabExaminationDto dto)
        {
            if (!await _context.MedicalRecords.AnyAsync(m => m.MedicalRecordId == id))
            {
                return ApiResponses.NotFound($"Medical record with {id} not found.");
            }

            var labExam = await _context.LabExams.FirstOrDefaultAsync(l => l.MedicalRecordId == id);

            if (labExam == null)
            {
                return ApiResponses.NotFound($"This medical record does not have a lab examination.");
            }

            labExam.Interpretation = dto.Interpretation;

            await _context.SaveChangesAsync();

            var medicalRecord = await _context.MedicalRecords
                .Include(m => m.Appointment)
                .Include(m => m.LabExam!)
                    .ThenInclude(l => l.LabExamFindings)
                .Include(m => m.Pet)
                    .ThenInclude(p => p.Owner)
                .FirstAsync(m => m.MedicalRecordId == id);

            return Ok(ToDetailsDto(await GetMedicalRecordDetailss(id)));
        }

        [HttpPost("{id}/lab-exam-finding")]
        public async Task<ActionResult<MedicalRecordDetailsDto>> CreateLabExamFinding(int id, CreateLabExamFindingDto dto)
        {
            if (!await _context.MedicalRecords.AnyAsync(m => m.MedicalRecordId == id))
            {
                return ApiResponses.NotFound($"Medical record with {id} not found.");
            }

            var labExam = await _context.LabExams.FirstOrDefaultAsync(l => l.MedicalRecordId == id);

            if (labExam == null)
            {
                labExam = new LabExam
                {
                    MedicalRecordId = id
                };

                _context.LabExams.Add(labExam);

                await _context.SaveChangesAsync();
            }
            
            if (dto.Image == null && string.IsNullOrWhiteSpace(dto.Remark))
            {
                return ApiResponses.BadRequest("Please provide an image or a remark.");
            }

            string? imagePath = null;

            if (dto.Image != null)
            {
                if (!IsValidImage(dto.Image))
                {
                    return ApiResponses.BadRequest("Only JPG and PNG images are allowed.");
                }

                if (dto.Image.Length > 5 * 1024 * 1024)
                {
                    return ApiResponses.BadRequest("Maximum image size is 5 MB.");
                }

                imagePath = await SaveImage(dto.Image, "lab-exams");
            }

            var finding = new LabExamFinding
            {
                ImagePath = imagePath,
                Remark = dto.Remark,
                LabExamId = labExam.LabExamId
            };

            _context.LabExamFindings.Add(finding);

            await _context.SaveChangesAsync();

            return Ok(ToDetailsDto(await GetMedicalRecordDetailss(id)));
        }

        [HttpPut("{id}/lab-exam-finding/{findingId}")]
        public async Task<ActionResult<MedicalRecordDetailsDto>> UpdateLabExamFinding(int id, int findingId, UpdateLabExamFindingDto dto)
        {
            if (!await _context.MedicalRecords.AnyAsync(m => m.MedicalRecordId == id))
            {
                return ApiResponses.NotFound($"Medical record with {id} not found.");
            }

            var labExam = await _context.LabExams.FirstOrDefaultAsync(l => l.MedicalRecordId == id);

            if (labExam == null)
            {
                return ApiResponses.BadRequest($"This medical record does not have a lab examination.");
            }

            var labExamFinding = await _context.LabExamFindings.FirstOrDefaultAsync(l => l.LabExamFindingId == findingId);

            if (labExamFinding == null)
            {
                return ApiResponses.NotFound($"Lab examination finding with {findingId} not found.");
            }

            if (labExamFinding.LabExamId != labExam.LabExamId)
            {
                return ApiResponses.BadRequest($"This lab examination finding does not belong to this medical record.");
            }

            if (dto.Image == null && string.IsNullOrWhiteSpace(dto.Remark))
            {
                return ApiResponses.BadRequest("Please provide an image or a remark.");
            }

            if (dto.RemoveImage)
            {
                labExamFinding.ImagePath = null;
            }

            if (dto.Image != null)
            {
                if (!IsValidImage(dto.Image))
                {
                    return ApiResponses.BadRequest("Only JPG and PNG images are allowed.");
                }

                if (dto.Image.Length > 5 * 1024 * 1024)
                {
                    return ApiResponses.BadRequest("Maximum image size is 5 MB.");
                }

                if (!string.IsNullOrWhiteSpace(labExamFinding.ImagePath))
                {
                    var oldImagePath = Path.Combine(
                        _environment.WebRootPath,
                        labExamFinding.ImagePath.TrimStart('/').Replace('/', Path.DirectorySeparatorChar));

                    if (System.IO.File.Exists(oldImagePath))
                    {
                        System.IO.File.Delete(oldImagePath);
                    }
                }

                labExamFinding.ImagePath = await SaveImage(dto.Image, "lab-exams");
            }

            labExamFinding.Remark = dto.Remark;

            await _context.SaveChangesAsync();

            return Ok(ToDetailsDto(await GetMedicalRecordDetailss(id)));
        }

        [HttpDelete("{id}/lab-exam-finding/{findingId}")]
        public async Task<ActionResult<MedicalRecordDetailsDto>> DeleteLabExamFinding(int id, int findingId)
        {
            var labExamFinding = await _context.LabExamFindings.FindAsync(findingId);

            if (labExamFinding == null)
            {
                return ApiResponses.NotFound($"Lab examination finding with {findingId} not found.");
            }

            _context.LabExamFindings.Remove(labExamFinding);
            await _context.SaveChangesAsync();

            return Ok(ToDetailsDto(await GetMedicalRecordDetailss(id)));
        }
    }
}