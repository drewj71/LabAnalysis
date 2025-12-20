namespace LabAnalysisAPI.Models
{
    public class UserMedication
    {
        public string UserId { get; set; }
        public ApplicationUser User { get; set; }
        public int MedicationId { get; set; }
        public Medication Medication { get; set; }
        public string? Dosage { get; set; }
        public string? Frequency { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string? Notes { get; set; }
    }
}