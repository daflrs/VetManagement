using VetManagement.Models;

namespace VetManagement.DTOs
{
    public class MedicalRecordDetailsDto
    {
        public int MedicalRecordId { get; set; }
        public PetDto Pet { get; set; } = null!;
        public OwnerDto? Owner { get; set; }
        public AppointmentDto? Appointment { get; set; } = null!;
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
