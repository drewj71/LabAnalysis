namespace LabAnalysisAPI.Models
{
    public enum ConditionStatus
    {
        Active,
        Recovered,
        Chronic
    }

    public enum ConditionSeverity
    {
        Mild,
        Moderate,
        Severe
    }

    public class UserCondition
    {
        public string UserId { get; set; }
        public ApplicationUser User { get; set; }
        public int ConditionId { get; set; }
        public Condition Condition { get; set; }
        public DateTime? DiagnosisDate { get; set; }
        public ConditionStatus? Status { get; set; }
        public ConditionSeverity? Severity { get; set; }
        public string? Notes { get; set; }
    }
}