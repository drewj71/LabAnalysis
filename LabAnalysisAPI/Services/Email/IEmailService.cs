namespace LabAnalysisAPI.Services.Email
{
    public interface IEmailService
    {
        Task SendEmailTemplateAsync(string toEmail, string subject, int templateId, object parameters);
        Task SendPasswordResetAsync(string toEmail, string resetLink);
        Task SendConfirmationEmailAsync(string toEmail, string confirmationLink);
    }
}