namespace VetManagement.DTOs
{
    public class UpdateLabExamFindingDto
    {
        public IFormFile? Image { get; set; }
        public string Remark { get; set; } = String.Empty;
        public bool RemoveImage { get; set; }
    }
}
