namespace LabAnalysisAPI.Models
{
    public class Lab
    {
        public int LabId { get; set; } // PK
        public string Name { get; set; } = null!; // e.g., "Hemoglobin"
        public string? Description { get; set; }
        public string? Unit { get; set; } // e.g., "g/dL"
        public string? ReferenceRange { get; set; }
        public bool IsNumeric { get; set; } = true;

        public ICollection<UserLabResult> UserLabResults { get; set; } = new List<UserLabResult>();
    }
}