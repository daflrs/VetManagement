namespace VetManagement.Models
{
    public class TreatmentItem
    {
        public int TreatmentItemId { get; set; }
        public int TreatmentId { get; set; }
        public int? MedicationId { get; set; }
        public Medication? Medication { get; set; }
        public int? ServiceId { get; set; }
        public Service? Service { get; set; }
        public string NameAtTreatment { get; set; } = String.Empty;
        public decimal UnitPrice { get; set; }
        public int Quantity { get; set; }
        public string Reason { get; set; } = String.Empty;
    }
}
