namespace VetManagement.Models
{
    public class Medication
    {
        public int MedicationId { get; set; }
        public string Name { get; set; } = String.Empty;
        public decimal Price { get; set; }
        public int AvailableCount { get; set; }
        public string Manufacturer { get; set; } = String.Empty;
        public DateOnly? ExpirationDate { get; set; }
    }
}
