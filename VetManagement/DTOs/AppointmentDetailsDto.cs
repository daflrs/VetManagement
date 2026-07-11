using VetManagement.Models;

namespace VetManagement.DTOs
{
    public class AppointmentDetailsDto
    {
        public int AppointmentId { get; set; }
        public AppointmentType Type { get; set; }
        public DateTime AppointmentDate { get; set; }
        public string Reason { get; set; } = String.Empty;
        public AppointmentStatus Status { get; set; }
        public OwnerDto? Owner { get; set; }
        public PetDto Pet { get; set; } = null!;
        public MedicalRecord? MedicalRecord { get; set; }
        public int DurationMinutes { get; set; }
        public DateTime? CheckInTime { get; set; }
        public DateTime? CheckOutTime { get; set; }
        public int? RecordedDurationMinutes { get; set; }
    }
}
