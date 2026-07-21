namespace VetManagement.Models
{
    public class MedicalRecord
    {
        public int MedicalRecordId { get; set; }
        public int PetId { get; set; }
        public Pet Pet { get; set; } = null!;
        public int? AppointmentId { get; set; }
        public Appointment? Appointment { get; set; }
        public DateTime VisitDate { get; set; }
        public decimal Weight { get; set; }
        public string Complaint { get; set; } = String.Empty;
        public string Diagnosis { get; set; } = String.Empty;
        public string Treatment { get; set; } = String.Empty;
        public string ClinicalExam { get; set; } = String.Empty;
        public string ClientCommunication { get; set; } = String.Empty;
        public LabExam? LabExam { get; set; }
        public string Notes { get; set; } = String.Empty;
    }
}
