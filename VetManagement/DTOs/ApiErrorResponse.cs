namespace VetManagement.DTOs
{
    public class ApiErrorResponse
    {
        public string Message { get; set; } = String.Empty;
        public int StatusCode { get; set; }
        public string? Details { get; set; }
        public string? TraceId { get; set; }
    }
}
