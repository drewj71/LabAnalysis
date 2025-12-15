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

namespace LabAnalysisAPI.Controllers
{
    [ApiController]
    [Route("api/accounts")]
    [Authorize]
    public class AccountsController : ControllerBase
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly AppDbContext _db;

        public AccountsController(UserManager<IdentityUser> userManager, AppDbContext db)
        {
            _userManager = userManager;
            _db = db;
        }

        [HttpGet("confirm-email")]
        public async Task<IActionResult> ConfirmEmail(
            [FromQuery] string email,
            [FromQuery] string token)
        {
            var user = await _userManager.FindByEmailAsync(email);

            if (user == null)
                return NotFound("User not found.");

            var decodedToken = WebUtility.UrlDecode(token);

            var result = await _userManager.ConfirmEmailAsync(user, decodedToken);

            if (!result.Succeeded)
                return BadRequest("Email confirmation failed.");

            return Ok("Email confirmed successfully.");
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
