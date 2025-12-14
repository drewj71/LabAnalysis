namespace LabAnalysisAPI.Services.Email
{
    public interface IEmailService
    {
        Task SendPasswordResetAsync(string toEmail, string resetLink);
    }
}