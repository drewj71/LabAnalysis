using LabAnalysisAPI.Models;
using LabAnalysisAPI.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Text;
using Microsoft.AspNetCore.WebUtilities;
using LabAnalysisAPI.Services.Email;
using LabAnalysisAPI.Services.User;
using Microsoft.Extensions.Options;
using System.Security.Claims;

namespace LabAnalysisAPI.Controllers
{
    [ApiController]
    [Route("api/user")]
    [Authorize]
    public class UserController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly FrontendOptions _frontend;
        private readonly IEmailService _emailService;
        private readonly IUserService _userService;

        public UserController(UserManager<ApplicationUser> userManager, IOptions<FrontendOptions> frontendOptions, IEmailService emailService, IUserService userService)
        {
            _userManager = userManager;
            _userService = userService;
            _frontend = frontendOptions.Value;
            _emailService = emailService;
        }

        [HttpGet("confirm-email")]
        public async Task<IActionResult> ConfirmEmail(
            [FromQuery] string email,
            [FromQuery] string token)
        {
            var user = await _userManager.FindByEmailAsync(email);

            if (user == null)
                return NotFound("User not found.");

            var decodedTokenBytes = WebEncoders.Base64UrlDecode(token);
            var decodedToken = Encoding.UTF8.GetString(decodedTokenBytes);

            var result = await _userManager.ConfirmEmailAsync(user, decodedToken);

            if (!result.Succeeded)
                return BadRequest("Email confirmation failed.");

            return Ok("Email confirmed successfully.");
        }

        [HttpGet("resend-confirm-email")]
        public async Task<IActionResult> ResendConfirmEmail(
            [FromQuery] string email)
        {
            var user = await _userManager.FindByEmailAsync(email);

            if (user == null)
                return NotFound("User not found.");

            if (user.EmailConfirmed)
                return BadRequest("Email already confirmed.");

            var emailConfirmationToken = await _userManager.GenerateEmailConfirmationTokenAsync(user);
            var confirmationLink = $"{_frontend.BaseUrl}/confirm-email" +
                $"?email={Uri.EscapeDataString(user.Email!)}" +
                $"&token={WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(emailConfirmationToken))}";

            // Send confirmation email
            await _emailService.SendConfirmationEmailAsync(
                user.Email!,
                confirmationLink);

            return Ok("Email confirmation link sent successfully.");
        }

        [HttpPost("onboarding/{stepId}")]
        public async Task<IActionResult> SubmitOnboardingStep(string stepId, [FromForm] OnboardingStepRequest request)
        {
            var userId = User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized();

            var user = await _userService.GetUserByIdAsync(userId);
            if (user == null) return NotFound();

            try
            {
                await _userService.SubmitOnboardingStepAsync(user, stepId, request);
                return Ok(new { message = "Step submitted successfully.", onboardingStep = user.OnboardingStep });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
