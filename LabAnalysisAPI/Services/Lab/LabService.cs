using LabAnalysisAPI.Data;
using LabAnalysisAPI.Models;
using LabAnalysisAPI.Services.Parsing;
using LabAnalysisAPI.Services.Pdf;
using Microsoft.Extensions.Options;

namespace LabAnalysisAPI.Services.Lab
{
    public class LabService : ILabService
    {
        private readonly IPdfTextExtractionService _pdfExtraction;
        private readonly ILabParsingService _labParsing;
        private readonly AppDbContext _dbContext;
        private readonly BackendOptions _backendOptions;
        private readonly ILogger<LabService> _logger;

        public LabService(
            IPdfTextExtractionService pdfExtraction,
            AppDbContext dbContext,
            IOptions<BackendOptions> backendOptions,
            ILabParsingService labParsing,
            ILogger<LabService> logger
        )
        {
            _pdfExtraction = pdfExtraction;
            _labParsing = labParsing;
            _logger = logger;
            _dbContext = dbContext;
            _backendOptions = backendOptions.Value;
        }

        public async Task<int> CreateLabReportAsync(string userId, IFormFile file)
        {
            await using var memoryStream = new MemoryStream();
            await file.CopyToAsync(memoryStream);
            memoryStream.Position = 0;

            string rawText = _pdfExtraction.ExtractText(memoryStream);

            if (string.IsNullOrWhiteSpace(rawText) || rawText.Length < 500)
            {
                return 0;
            }

            var normalizedText = _labParsing.NormalizeText(rawText);
            var parsedCandidates = _labParsing.ParseCandidates(rawText);

            foreach (var candidate in parsedCandidates)
            {
                _logger.LogInformation(
                    "Parsed candidate: {Name} | {Value} {Unit}",
                    candidate.TestName,
                    candidate.Value,
                    candidate.Unit
                );
            }

            var uploadsPath = Path.Combine(_backendOptions.UploadsPath, "Uploads");
            Directory.CreateDirectory(uploadsPath);

            var fileName = $"{Guid.NewGuid()}_{file.FileName}";
            var filePath = Path.Combine(uploadsPath, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                memoryStream.Position = 0;
                await memoryStream.CopyToAsync(stream);
            }

            var labReport = new LabReport
            {
                UserId = userId,
                UploadDate = DateTime.UtcNow,
                FileName = file.FileName,
                FilePath = filePath,
                FileType = file.ContentType,
                RawText = rawText,
                NormalizedText = normalizedText,
                ExtractionSuccessful = true,
                ProcessingStatus = LabProcessingStatus.Parsed
            };

            _dbContext.LabReports.Add(labReport);
            await _dbContext.SaveChangesAsync();

            return labReport.LabReportId;
        }
    }
}
