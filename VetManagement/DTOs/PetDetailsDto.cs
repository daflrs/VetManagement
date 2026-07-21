using VetManagement.Models;

namespace VetManagement.DTOs
{
    public class PetDetailsDto
    {
        public int PetId { get; set; }
        public string Name { get; set; } = String.Empty;
        public string Species { get; set; } = String.Empty;
        public string Breed { get; set; } = String.Empty;
        public DateTime BirthDate { get; set; }
        public decimal Weight { get; set; }
        public OwnerDto? Owner { get; set; }
        public bool isNeutered { get; set; }
        public bool isDeceased { get; set; }
        public DateOnly? DateOfDeath { get; set; }
    }
}
