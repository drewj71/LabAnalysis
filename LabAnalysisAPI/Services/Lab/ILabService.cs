namespace LabAnalysisAPI.Services.Lab
{
    public interface ILabService
    {
        Task<int> CreateLabReportAsync(string userId, IFormFile file);
    }
}