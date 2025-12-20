namespace LabAnalysisAPI.Models
{

    public class OnboardingStepRequest
    {
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Gender { get; set; }
        public DateOnly? DateOfBirth { get; set; }
        public int? Height { get; set; }
        public int? Weight { get; set; }
        public string? BloodType { get; set; }
        public List<string>? Allergies { get; set; }
        public List<string>? Medications { get; set; }
        public List<string>? MedicalConditions { get; set; }
        public IFormFile? LabReport { get; set; }
    }

}