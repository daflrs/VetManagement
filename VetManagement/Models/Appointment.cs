namespace VetManagement.Models
{
    public class Appointment
    {
        public int AppointmentId { get; set; }
        public int PetId { get; set; }
        public AppointmentType Type { get; set; } = AppointmentType.WalkIn;
        public DateTime AppointmentDate { get; set; } = DateTime.Now;
        public string Reason { get; set; } = String.Empty;
        public AppointmentStatus Status { get; set; } = AppointmentStatus.Scheduled;
        public Pet Pet { get; set; } = null!;
        public MedicalRecord? MedicalRecord { get; set; }
        public int DurationMinutes { get; set; } = 30;
        public DateTime? CheckInTime { get; set; }
        public DateTime? CheckOutTime { get; set; }
        public int? RecordedDurationMinutes { get; set; }
    }
}
