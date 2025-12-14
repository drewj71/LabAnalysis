namespace LabAnalysisAPI.Models
{
    public class ResetPasswordDTO
    {
        public string Email { get; set; } = default!;
        public string Token { get; set; } = default!;
        public string NewPassword { get; set; } = default!;
        public string ConfirmPassword { get; set; } = default!;
    }
}