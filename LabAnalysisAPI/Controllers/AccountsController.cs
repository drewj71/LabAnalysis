using LabAnalysisAPI.Models;
using LabAnalysisAPI.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Net;
using Microsoft.AspNetCore.WebUtilities;
using LabAnalysisAPI.Services.Email;
using Microsoft.Extensions.Options;

namespace LabAnalysisAPI.Controllers
{
    [ApiController]
    [Route("api/accounts")]
    [Authorize]
    public class AccountsController : ControllerBase
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly AppDbContext _db;
        private readonly FrontendOptions _frontend;
        private readonly IEmailService _emailService;

        public AccountsController(UserManager<IdentityUser> userManager, AppDbContext db, IOptions<FrontendOptions> frontendOptions, IEmailService emailService)
        {
            _userManager = userManager;
            _db = db;
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


        // [HttpGet("user-accounts")]
        // public async Task<IActionResult> GetUserAccounts()
        // {
        //     var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        //     if (string.IsNullOrEmpty(userId))
        //         return Unauthorized("User ID not found in token.");

        //     var userAccounts = await _db.PlaidAccounts
        //         .Include(a => a.UserPlaidAccount)
        //         .Where(a => a.UserPlaidAccount.UserId == userId)
        //         .ToListAsync();
        //     return Ok(userAccounts);
        // }

        // [HttpGet("user-transactions")]
        // public async Task<IActionResult> GetUserTransactions()
        // {
        //     var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        //     if (string.IsNullOrEmpty(userId))
        //         return Unauthorized();

        //     var transactions = await _db.Transactions
        //         .Include(t => t.TransactionCategory)
        //         .Where(t => t.UserId == userId)
        //         .OrderByDescending(t => t.Date)
        //         .ToListAsync();

        //     return Ok(transactions);
        // }

    }
}
