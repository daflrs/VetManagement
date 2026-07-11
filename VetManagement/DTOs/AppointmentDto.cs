using VetManagement.Models;

namespace VetManagement.DTOs
{
    public class AppointmentDto
    {
        public int AppointmentId { get; set; }
        public AppointmentType Type { get; set; }
        public DateTime AppointmentDate { get; set; }
        public string Reason { get; set; } = String.Empty;
        public AppointmentStatus Status { get; set; }
        public int PetId { get; set; }
        public string PetName { get; set; } = String.Empty;
        public int? MedicalRecordId { get; set; }
        public int DurationMinutes { get; set; }
    }
}
