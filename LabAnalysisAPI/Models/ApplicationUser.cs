using Microsoft.AspNetCore.Identity;

namespace LabAnalysisAPI.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public DateOnly? DateOfBirth { get; set; }
        public string? Gender { get; set; }
        public decimal? Height { get; set; }
        public decimal? Weight { get; set; }
        public string? BloodType { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? LastLogin { get; set; }
        public bool IsOnboarded { get; set; } = false;
        public int OnboardingStep { get; set; } = 0;
        public ICollection<UserAllergy> UserAllergies { get; set; } = [];
        public ICollection<UserMedication> UserMedications { get; set; } = [];
        public ICollection<UserCondition> UserConditions { get; set; } = [];
        public ICollection<UserLabResult> UserLabResults { get; set; } = [];
    }
}
