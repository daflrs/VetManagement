namespace VetManagement.Models
{
    public class Pet
    {
        public int PetId { get; set; }
        public string Name { get; set; } = String.Empty;
        public string Species { get; set; } = String.Empty;
        public string Breed { get; set; } = String.Empty;
        public DateTime BirthDate { get; set; }
        public decimal Weight { get; set; }
        public int? OwnerId { get; set; }
        public Owner? Owner { get; set; }
        public ICollection<MedicalRecord> MedicalRecords { get; set; } = new List<MedicalRecord>();
        public bool isNeutered { get; set; }
        public bool isDeceased { get; set; }
        public DateOnly? DateOfDeath { get; set; }
    }
}
