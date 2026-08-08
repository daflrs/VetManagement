using VetManagement.Models;

namespace VetManagement.DTOs
{
    public class TreatmentItemDto
    {
        public int TreatmentItemId { get; set; }
        public int TreatmentId { get; set; }
        public MedicationDto? Medication { get; set; }
        public ServiceDto? Service { get; set; }
        public string NameAtTreatment { get; set; } = String.Empty;
        public decimal UnitPrice { get; set; }
        public int Quantity { get; set; }
        public string Reason { get; set; } = String.Empty;
    }
}
