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
    }
}
