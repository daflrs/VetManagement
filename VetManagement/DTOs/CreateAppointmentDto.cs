using VetManagement.Models;

namespace VetManagement.DTOs
{
    public class CreateAppointmentDto
    {
        public string Reason { get; set; } = String.Empty;
        public DateTime AppointmentDate { get; set; }
        public AppointmentType Type { get; set; }
        public int PetId { get; set; }
    }
}
