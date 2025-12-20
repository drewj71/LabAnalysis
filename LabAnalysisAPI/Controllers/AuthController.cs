using LabAnalysisAPI.Models;
using LabAnalysisAPI.Services.Email;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace LabAnalysisAPI.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IConfiguration _config;
        private readonly FrontendOptions _frontend;
        private readonly IEmailService _emailService;

        public AuthController(UserManager<ApplicationUser> userManager, IConfiguration config, IOptions<FrontendOptions> frontendOptions, IEmailService emailService)
        {
            _userManager = userManager;
            _config = config;
            _frontend = frontendOptions.Value;
            _emailService = emailService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDTO dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var existingUser = await _userManager.FindByEmailAsync(dto.Email);
            if (existingUser != null)
                return BadRequest("User with this email already exists.");

            var newUser = new ApplicationUser
            {
                UserName = dto.Email,
                Email = dto.Email,
                IsOnboarded = false,
                OnboardingStep = 0,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            var result = await _userManager.CreateAsync(newUser, dto.Password);

            if (!result.Succeeded)
                return BadRequest(result.Errors);

            var user = await _userManager.FindByEmailAsync(dto.Email);
            if (user == null || !await _userManager.CheckPasswordAsync(user, dto.Password))
                return Unauthorized("Invalid credentials.");

            var token = GenerateJwtToken(user);

            var emailConfirmationToken = await _userManager.GenerateEmailConfirmationTokenAsync(user);
            var confirmationLink = $"{_frontend.BaseUrl}/confirm-email" +
                $"?email={Uri.EscapeDataString(user.Email!)}" +
                $"&token={WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(emailConfirmationToken))}";

            // Send confirmation email
            await _emailService.SendConfirmationEmailAsync(
                user.Email!,
                confirmationLink);

            return Ok(new
            {
                token,
                expires = DateTime.UtcNow.AddHours(1)
            });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDTO dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = await _userManager.FindByEmailAsync(dto.Email);
            if (user == null || !await _userManager.CheckPasswordAsync(user, dto.Password))
                return Unauthorized("Invalid credentials.");

            var token = GenerateJwtToken(user);

            return Ok(new
            {
                token,
                expires = DateTime.UtcNow.AddHours(1)
            });
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDTO dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = await _userManager.FindByEmailAsync(dto.Email);

            // Ensure that users confirm they're email after registering, then this line can be readded
            if (user == null) // !await _userManager.IsEmailConfirmedAsync(user) 
            {
                // To prevent email enumeration, we return the same response
                return Ok("Password reset link has been sent to your email.");
            }

            var token = await _userManager.GeneratePasswordResetTokenAsync(user);

            var encodedToken = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(token));
            var resetLink =
                $"{_frontend.BaseUrl}/reset-password" +
                $"?email={Uri.EscapeDataString(user.Email!)}" +
                $"&token={encodedToken}";

            await _emailService.SendPasswordResetAsync(user.Email!, resetLink);

            return Ok("Password reset link has been sent to your email.");
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDTO dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            var user = await _userManager.FindByEmailAsync(dto.Email);
            if (user == null)
                return BadRequest("Invalid request.");

            var decodedToken = Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(dto.Token));

            var result = await _userManager.ResetPasswordAsync(user, decodedToken, dto.NewPassword);

            if (!result.Succeeded)
                return BadRequest(result.Errors);
            return Ok("Password has been reset successfully.");
        }

        private string GenerateJwtToken(ApplicationUser user)
        {
            var claims = new List<Claim>
            {
                new(ClaimTypes.NameIdentifier, user.Id),
                new(JwtRegisteredClaimNames.Email, user.Email!),
                new("emailConfirmed", user.EmailConfirmed.ToString()),
                new("firstName", user.FirstName ?? ""),
                new("lastName", user.LastName ?? ""),
                new("isOnboarded", user.IsOnboarded.ToString()),
                new("onboardingStep", user.OnboardingStep.ToString()),
                new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            };

            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_config["Jwt:Key"]!)
            );

            var creds = new SigningCredentials(
                key,
                SecurityAlgorithms.HmacSha256
            );

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(1),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
