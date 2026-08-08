namespace VetManagement.DTOs
{
    public class CreateTreatmentItemDto
    {
        public int? MedicationId { get; set; }
        public int? ServiceId { get; set; }
        public int Quantity { get; set; }
        public string Reason { get; set; } = String.Empty;
    }
}
