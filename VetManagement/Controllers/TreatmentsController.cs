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
    public class TreatmentsController : ControllerBase
    {
        private readonly VetManagementDbContext _context;

        public TreatmentsController(VetManagementDbContext context)
        {
            _context = context;
        }

        private async Task<Treatment> GetTreatment(int id)
        {
            return await _context.Treatments
                .Include(t => t.TreatmentItems)
                    .ThenInclude(ti => ti.Medication)
                .Include(t => t.TreatmentItems)
                    .ThenInclude(ti => ti.Service)
                .FirstAsync(t => t.TreatmentId == id);
        }

        private static TreatmentDto ToTreatmentDto(Treatment treatment)
        {
            return new TreatmentDto
            {
                TreatmentId = treatment.TreatmentId,
                TreatmentItems = treatment.TreatmentItems
                    .OrderByDescending(t => t.TreatmentItemId)
                    .Select(t => new TreatmentItemDto
                    {
                        TreatmentItemId = t.TreatmentItemId,
                        Medication = t.Medication != null
                            ? new MedicationDto
                            {
                                MedicationId = t.Medication.MedicationId,
                                Name = t.Medication.Name,
                                Price = t.Medication.Price,
                                AvailableCount = t.Medication.AvailableCount,
                                Manufacturer = t.Medication.Manufacturer,
                                ExpirationDate = t.Medication.ExpirationDate
                            }
                            : null,
                        Service = t.Service != null
                            ? new ServiceDto
                            {
                                ServiceId = t.Service.ServiceId,
                                Name = t.Service.Name,
                                Price = t.Service.Price
                            }
                            : null,
                        NameAtTreatment = t.NameAtTreatment,
                        UnitPrice = t.UnitPrice,
                        Quantity = t.Quantity,
                        Reason = t.Reason
                    })
                    .ToList(),
                Others = treatment.Others
            };
        }

        [HttpPost("{id}")]
        public async Task<ActionResult<TreatmentDto>> CreateTreatment(int id, CreateTreatmentDto dto)
        {
            if (!await _context.MedicalRecords.AnyAsync(m => m.MedicalRecordId == id))
            {
                return ApiResponses.NotFound($"Medical record with {id} not found.");
            }

            if (await _context.Treatments.AnyAsync(t => t.MedicalRecordId == id))
            {
                return ApiResponses.BadRequest("A treatment plan already exists for this medical record.");
            }

            var treatment = new Treatment
            {
                Others = dto.Others,
                MedicalRecordId = id
            };

            _context.Treatments.Add(treatment);

            await _context.SaveChangesAsync();

            return Ok(ToTreatmentDto(await GetTreatment(treatment.TreatmentId)));
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<TreatmentDto>> UpdateTreatment(int id, UpdateTreatmentDto dto)
        {
            if (!await _context.MedicalRecords.AnyAsync(m => m.MedicalRecordId == id))
            {
                return ApiResponses.NotFound($"Medical record with {id} not found.");
            }

            var treatment = await _context.Treatments.FirstOrDefaultAsync(t => t.MedicalRecordId == id);

            if (treatment == null)
            {
                return ApiResponses.BadRequest("This medical record does not have a treatment plan.");
            }

            treatment.Others = dto.Others;

            await _context.SaveChangesAsync();

            return Ok(ToTreatmentDto(await GetTreatment(treatment.TreatmentId)));
        }

        [HttpPost("{id}/treatment-items")]
        public async Task<ActionResult<TreatmentDto>> CreateTreatmentItems(int id, CreateTreatmentItemsDto dto)
        {
            if (!await _context.MedicalRecords.AnyAsync(m => m.MedicalRecordId == id))
            {
                return ApiResponses.NotFound($"Medical record with {id} not found.");
            }

            var duplicateMedicationIds = dto.TreatmentItems
                .Where(t => t.MedicationId != null)
                .GroupBy(t => t.MedicationId)
                .Where(g => g.Count() > 1);

            if (duplicateMedicationIds.Any())
            {
                return ApiResponses.BadRequest("Duplicate medications detected. Not allowed.");
            }

            var duplicateServiceIds = dto.TreatmentItems
                .Where(t => t.ServiceId != null)
                .GroupBy(t => t.ServiceId)
                .Where(g => g.Count() > 1);

            if (duplicateServiceIds.Any())
            {
                return ApiResponses.BadRequest("Duplicate services detected. Not allowed.");
            }

            var treatment = await _context.Treatments.FirstOrDefaultAsync(t => t.MedicalRecordId == id);

            if (treatment == null)
            {
                treatment = new Treatment
                {
                    MedicalRecordId = id
                };

                _context.Treatments.Add(treatment);

                await _context.SaveChangesAsync();
            }

            foreach (var item in dto.TreatmentItems)
            {

                if ((item.MedicationId == null && item.ServiceId == null)
                    || (item.MedicationId != null && item.ServiceId != null))
                {
                    return ApiResponses.BadRequest("Either a medication or a service must be chosen.");
                }

                Medication? medication = null;
                Service? service = null;

                if (item.MedicationId != null)
                {
                    if (item.Quantity <= 0)
                    {
                        return ApiResponses.BadRequest("Quantity must be greater than zero.");
                    }

                    medication = await _context.Medications.FindAsync(item.MedicationId);

                    if (medication == null)
                    {
                        return ApiResponses.NotFound($"Medication with {item.MedicationId} not found.");
                    }

                    if (medication.AvailableCount < item.Quantity)
                    {
                        return ApiResponses.BadRequest($"Not enough in stock. There are {medication.AvailableCount} left.");
                    }

                    medication.AvailableCount -= item.Quantity;
                }

                if (item.ServiceId != null)
                {
                    service = await _context.Services.FindAsync(item.ServiceId);

                    if (service == null)
                    {
                        return ApiResponses.NotFound($"Service with {item.ServiceId} not found.");
                    }
                }

                var treatmentItem = new TreatmentItem
                {
                    MedicationId = medication?.MedicationId,
                    ServiceId = service?.ServiceId,
                    NameAtTreatment = medication?.Name ?? service!.Name,
                    UnitPrice = medication?.Price ?? service!.Price,
                    Quantity = item.Quantity,
                    Reason = item.Reason,
                    TreatmentId = treatment.TreatmentId
                };

                _context.TreatmentItems.Add(treatmentItem);
            }

            await _context.SaveChangesAsync();

            return Ok(ToTreatmentDto(await GetTreatment(treatment.TreatmentId)));
        }

        [HttpPut("{id}/treatment-items")]
        public async Task<ActionResult<TreatmentDto>> UpdateTreatmentItems(int id, UpdateTreatmentItemsDto dto)
        {
            if (!await _context.MedicalRecords.AnyAsync(m => m.MedicalRecordId == id))
            {
                return ApiResponses.NotFound($"Medical record with {id} not found.");
            }

            var treatment = await _context.Treatments
                .Include(t => t.TreatmentItems)
                .FirstOrDefaultAsync(t => t.MedicalRecordId == id);

            if (treatment == null)
            {
                return ApiResponses.BadRequest($"This medical record does not have a treatment plan.");
            }

            foreach (var item in dto.TreatmentItems)
            {
                var treatmentItem = treatment.TreatmentItems.FirstOrDefault(ti => ti.TreatmentItemId == item.TreatmentItemId);

                if (treatmentItem == null)
                {
                    return ApiResponses.NotFound($"Treatment item with {item.TreatmentItemId} not found.");
                }

                if (treatmentItem.MedicationId != null)
                {
                    if (item.Quantity <= 0)
                    {
                        return ApiResponses.BadRequest("Quantity must be greater than zero.");
                    }

                    var medication = await _context.Medications.FindAsync(treatmentItem.MedicationId);

                    if (medication == null)
                    {
                        return ApiResponses.NotFound($"Medication with {treatmentItem.MedicationId} not found.");
                    }

                    var quantityDifference = item.Quantity - treatmentItem.Quantity;

                    if (medication.AvailableCount < quantityDifference)
                    {
                        return ApiResponses.BadRequest($"Not enough in stock. There are {medication.AvailableCount} left.");
                    }

                    medication.AvailableCount -= quantityDifference;
                }

                if (treatmentItem.ServiceId != null)
                {
                    var service = await _context.Services.FindAsync(treatmentItem.ServiceId);

                    if (service == null)
                    {
                        return ApiResponses.NotFound($"Service with {treatmentItem.ServiceId} not found.");
                    }
                }

                treatmentItem.Quantity = item.Quantity;
                treatmentItem.Reason = item.Reason;
            }

            await _context.SaveChangesAsync();

            return Ok(ToTreatmentDto(await GetTreatment(treatment.TreatmentId)));
        }

        [HttpDelete("{id}/treatment-items/{itemId}")]
        public async Task<ActionResult<MedicalRecordDetailsDto>> DeleteLabExamFinding(int id, int itemId)
        {
            var treatment = await _context.Treatments.FirstOrDefaultAsync(t => t.MedicalRecordId == id);

            if (treatment == null)
            {
                return ApiResponses.NotFound($"Treatment with {id} not found.");
            }

            var treatmentItem = await _context.TreatmentItems.FirstOrDefaultAsync(ti => ti.TreatmentItemId == itemId);

            if (treatmentItem == null)
            {
                return ApiResponses.NotFound($"Treatment item with {itemId} not found.");
            }

            if (treatmentItem.MedicationId != null)
            {
                var medication = await _context.Medications.FindAsync(treatmentItem.MedicationId);

                if (medication == null)
                {
                    return ApiResponses.NotFound($"Medication with {treatmentItem.MedicationId} not found.");
                }

                medication.AvailableCount += treatmentItem.Quantity;
            }

            if (treatmentItem.ServiceId != null)
            {
                var service = await _context.Services.FindAsync(treatmentItem.ServiceId);

                if (service == null)
                {
                    return ApiResponses.NotFound($"Service with {treatmentItem.ServiceId} not found.");
                }
            }

            _context.TreatmentItems.Remove(treatmentItem);

            await _context.SaveChangesAsync();

            return Ok(ToTreatmentDto(await GetTreatment(treatment.TreatmentId)));
        }
    }
}
