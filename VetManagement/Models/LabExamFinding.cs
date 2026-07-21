namespace VetManagement.Models
{
    public class LabExamFinding
    {
        public int LabExamFindingId { get; set; }
        public string ImagePath { get; set; } = String.Empty;
        public string Remark { get; set; } = String.Empty;
        public int LabExamId { get; set; }
    }
}
