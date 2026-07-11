namespace VetManagement.DTOs
{
    public class CreateMedicalRecordDto
    {
        public int PetId { get; set; }
        public int? AppointmentId { get; set; }
        public DateTime VisitDate { get; set; }
        public string Symptoms { get; set; } = String.Empty;
        public string Diagnosis { get; set; } = String.Empty;
        public string Treatment { get; set; } = String.Empty;
        public decimal Weight { get; set; }
        public string Notes { get; set; } = String.Empty;
    }
}
