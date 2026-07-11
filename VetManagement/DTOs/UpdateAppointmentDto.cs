using VetManagement.Models;

namespace VetManagement.DTOs
{
    public class UpdateAppointmentDto
    {
        public string Reason { get; set; } = String.Empty;
        public DateTime AppointmentDate { get; set; }
        public AppointmentType Type { get; set; }
        public AppointmentStatus Status { get; set; }
        public int DurationMinutes { get; set; }
    }
}
