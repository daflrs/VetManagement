namespace VetManagement.Models
{
    public class Treatment
    {
        public int TreatmentId { get; set; }
        public int MedicalRecordId { get; set; }
        public ICollection<TreatmentItem> TreatmentItems { get; set; } = [];
        public string Others { get; set; } = String.Empty;
    }
}
