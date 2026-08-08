namespace VetManagement.DTOs
{
    public class UpdateTreatmentItemDto
    {
        public int TreatmentItemId { get; set; }
        public int Quantity { get; set; }
        public string Reason { get; set; } = String.Empty;
    }
}
