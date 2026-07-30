namespace VetManagement.DTOs
{
    public class LabExamDto
    {
        public int LabExamId { get; set; }
        public List<LabExamFindingsDto> LabExamFindings { get; set; } = new();
        public string Interpretation { get; set; } = String.Empty;
        public int MedicalRecordId { get; set; }
    }
}
