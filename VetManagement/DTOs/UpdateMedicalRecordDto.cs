namespace VetManagement.DTOs
{
    public class UpdateMedicalRecordDto
    {
        public DateTime VisitDate { get; set; }
        public decimal Weight { get; set; }
        public string Complaint { get; set; } = String.Empty;
        public string Diagnosis { get; set; } = String.Empty;
        public string Treatment { get; set; } = String.Empty;
        public string ClinicalExam { get; set; } = String.Empty;
        public string ClientCommunication { get; set; } = String.Empty;
        public string Notes { get; set; } = String.Empty;
    }
}
