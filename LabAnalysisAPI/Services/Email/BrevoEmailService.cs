using LabAnalysisAPI.Models;
using Microsoft.Extensions.Options;
using System.Net.Http;

namespace LabAnalysisAPI.Services.Email
{
    public class BrevoEmailService : IEmailService
    {
        private readonly EmailOptions _emailOptions;
        private readonly HttpClient _httpClient;

        public BrevoEmailService(IOptions<EmailOptions> emailOptions, HttpClient httpClient)
        {
            _emailOptions = emailOptions.Value;
            _httpClient = httpClient;
        }

        public async Task SendPasswordResetAsync(string toEmail, string resetLink)
        {
            // Implement the logic to send an email using Brevo's API
            // Use _emailOptions.ApiKey, _emailOptions.SenderEmail, and _emailOptions.SenderName as needed

            // Example (pseudo-code):
            /*
            var client = new BrevoClient(_emailOptions.ApiKey);
            var email = new BrevoEmail
            {
                From = new BrevoContact { Email = _emailOptions.SenderEmail, Name = _emailOptions.SenderName },
                To = new List<BrevoContact> { new BrevoContact { Email = toEmail } },
                Subject = "Password Reset Request",
                HtmlContent = $"<p>Click <a href='{resetLink}'>here</a> to reset your password.</p>"
            };
            await client.SendEmailAsync(email);
            */

            await Task.CompletedTask; // Remove this line when implementing actual email sending
        }
    }
}