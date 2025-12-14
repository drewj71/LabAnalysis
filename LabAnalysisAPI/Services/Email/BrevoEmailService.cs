using LabAnalysisAPI.Models;
using Microsoft.Extensions.Options;
using System.Text.Json;
using System.Text;

namespace LabAnalysisAPI.Services.Email
{
    public class BrevoEmailService : IEmailService
    {
        private readonly EmailOptions _emailOptions;
        private readonly HttpClient _httpClient;
        private readonly ILogger<BrevoEmailService> _logger;

        public BrevoEmailService(IOptions<EmailOptions> emailOptions, HttpClient httpClient, ILogger<BrevoEmailService> logger)
        {
            _emailOptions = emailOptions.Value;
            _httpClient = httpClient;
            _logger = logger;
        }

        public async Task SendPasswordResetAsync(string toEmail, string resetLink)
        {
            var payload = new
            {
                sender = new
                {
                    email = _emailOptions.SenderEmail,
                    name = _emailOptions.SenderName
                },
                to = new[]
                {
                    new
                    {
                        email = toEmail,
                    }
                },
                subject = "Reset Your Password",
                templateId = _emailOptions.PasswordResetTemplateId,
                @params = new
                {
                    resetLink
                }
            };

            var request = new HttpRequestMessage(HttpMethod.Post, "smtp/email")
            {
                Content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json")
            };

            request.Headers.Add("api-key", _emailOptions.ApiKey);

            try
            {
                var response = await _httpClient.SendAsync(request);

                if (!response.IsSuccessStatusCode)
                {
                    var body = await response.Content.ReadAsStringAsync();
                    _logger.LogError(
                        "Brevo reset password email failed to send. Status: {Status}. Response: {Response}",
                        response.StatusCode,
                        body);
                }
            } 
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error sending Brevo reset password email.");
            }
        }
    }
}