namespace VetManagement.DTOs
{
    public class LabExamFindingsDto
    {
        public int LabExamFindingId { get; set; }
        public string? ImagePath { get; set; }
        public string Remark { get; set; } = String.Empty;
    }
}
