using System.Security.Claims;
using LabAnalysisAPI.Services.Lab;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LabAnalysisAPI.Controllers
{
    [ApiController]
    [Route("api/lab")]
    [Authorize]
    public class LabController : ControllerBase
    {
        private readonly ILabService _labService;


        public LabController(ILabService labService)
        {
            _labService = labService;
        }

        [HttpPost("upload-lab")]
        public async Task<IActionResult> UploadLab(IFormFile labReport)
        {
            if (labReport == null || labReport.Length == 0)
                return BadRequest("No file uploaded.");

            int result = await _labService.CreateLabReportAsync(User?.FindFirst(ClaimTypes.NameIdentifier)?.Value, labReport);

            if (result == 0)
            {
                return BadRequest("Failed to extract text from the uploaded lab report.");
            }

            return Ok("File uploaded and processed successfully.");
        }
    }
}