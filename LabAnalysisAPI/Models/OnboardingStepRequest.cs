using Microsoft.AspNetCore.Mvc;

namespace LabAnalysisAPI.Models
{

    public class MedicationRequest
    {
        public string? Name { get; set; }
        public string? Dosage { get; set; }
        public string? Frequency { get; set; }
        public DateOnly? StartDate { get; set; }
        public DateOnly? EndDate { get; set; }
        public string? Notes { get; set; }
    }

    public class ConditionRequest
    {
        public string? Name { get; set; }
        public DateTime? DiagnosisDate { get; set; }
        public ConditionStatus Status { get; set; }
        public ConditionSeverity Severity { get; set; }
        public string? Notes { get; set; }
    }

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
        public string? MedicationsJson { get; set; }
        public string? MedicalConditionsJson { get; set; }
        public IFormFile? LabReport { get; set; }
    }
}