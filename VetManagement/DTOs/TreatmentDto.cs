namespace VetManagement.DTOs
{
    public class TreatmentDto
    {
        public int TreatmentId { get; set; }
        public int MedicalRecordId { get; set; }
        public List<TreatmentItemDto> TreatmentItems { get; set; } = new();
        public string Others { get; set; } = String.Empty;
    }
}
