using LabAnalysisAPI.Models;

namespace LabAnalysisAPI.Services.User
{
    public interface IUserService
    {
        Task<ApplicationUser?> GetUserByIdAsync(string id);
        Task SubmitOnboardingStepAsync(ApplicationUser user, string stepId, OnboardingStepRequest request);
    }
}