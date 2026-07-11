using VetManagement.Models;

namespace VetManagement.DTOs
{
    public class PetDto
    {
        public int PetId { get; set; }
        public string Name { get; set; } = String.Empty;
        public string Species { get; set; } = String.Empty;
        public string Breed { get; set; } = String.Empty;
        public DateTime BirthDate { get; set; }
        public decimal Weight { get; set; }
        public int? OwnerId { get; set; }
        public string? OwnerName { get; set; }
    }
}
