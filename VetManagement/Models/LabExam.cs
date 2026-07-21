namespace VetManagement.Models
{
    public class LabExam
    {
        public int LabExamId { get; set; }
        public ICollection<LabExamFinding> LabExamFindings { get; set; } = new List<LabExamFinding>();
        public string Interpretation { get; set; } = String.Empty;
        public int MedicalRecordId { get; set; }
    }
}
