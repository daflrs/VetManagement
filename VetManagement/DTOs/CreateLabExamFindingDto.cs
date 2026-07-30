namespace VetManagement.DTOs
{
    public class CreateLabExamFindingDto
    {
        public IFormFile? Image { get; set; }
        public string Remark { get; set; } = String.Empty;
    }
}
