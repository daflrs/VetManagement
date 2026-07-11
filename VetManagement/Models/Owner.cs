namespace VetManagement.Models
{
    public class Owner
    {
        public int OwnerId { get; set; }
        public string FirstName { get; set; } = String.Empty;
        public string LastName { get; set; } = String.Empty;
        public string PhoneNumber { get; set; } = String.Empty;
        public string Email { get; set; } = String.Empty;
        public string Address { get; set; } = String.Empty;
        public ICollection<Pet> Pets { get; set; } = new List<Pet>();
    }
}
