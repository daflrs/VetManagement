namespace VetManagement.DTOs
{
    public class OwnerDto
    {
        public int OwnerId { get; set; }
        public string FirstName { get; set; } = String.Empty;
        public string LastName { get; set; } = String.Empty;
        public string PhoneNumber { get; set; } = String.Empty;
        public string Email { get; set; } = String.Empty;
        public string Address { get; set; } = String.Empty;
        public int PetCount { get; set; }
    }
}
