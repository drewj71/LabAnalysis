namespace LabAnalysisAPI.Models
{
    public class EmailOptions
    {
        public string ApiKey { get; set; } = default!;
        public string SenderEmail { get; set; } = default!;
        public string SenderName { get; set; } = default!;
        public int PasswordResetTemplateId { get; set; } = default!;
        public int ConfirmationTemplateId { get; set; } = default!;
    }
}
