namespace VetManagement.DTOs
{
    public class MedicalRecordDto
    {
        public int MedicalRecordId { get; set; }
        public string PetName { get; set; } = String.Empty;
        public int? AppointmentId { get; set; }
        public DateTime VisitDate { get; set; }
        public string Symptoms { get; set; } = String.Empty;
        public string Diagnosis { get; set; } = String.Empty;
        public string Treatment { get; set; } = String.Empty;
        public decimal Weight { get; set; }
        public string Notes { get; set; } = String.Empty;
    }
}
