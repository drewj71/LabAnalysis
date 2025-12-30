namespace LabAnalysisAPI.Models
{
    public enum AllergySeverity
    {
        Mild,
        Moderate,
        Severe
    }

    public class UserAllergy
    {
        public string UserId { get; set; }
        public ApplicationUser User { get; set; }
        public int AllergyId { get; set; }
        public Allergy Allergy { get; set; }
        public AllergySeverity? Severity { get; set; }
        public string? Notes { get; set; }
    }
}