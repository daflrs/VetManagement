namespace VetManagement.DTOs
{
    public class UpdatePetDto
    {
        public string Name { get; set; } = String.Empty;
        public string Species { get; set; } = String.Empty;
        public string Breed { get; set; } = String.Empty;
        public DateTime BirthDate { get; set; }
        public decimal Weight { get; set; }
        public int? OwnerId { get; set; }
    }
}
