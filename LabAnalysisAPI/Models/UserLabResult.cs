namespace LabAnalysisAPI.Models
{
    public class UserLabResult
{
    public int UserLabResultId { get; set; } // PK

    public string UserId { get; set; } = null!;
    public ApplicationUser User { get; set; } = null!;

    public int LabId { get; set; }
    public Lab Lab { get; set; } = null!;

    public int LabReportId { get; set; }
    public LabReport LabReport { get; set; } = null!;

    public string? ResultValue { get; set; } // numeric or qualitative
    public string? Unit { get; set; } // optional override
    public string? Notes { get; set; }
    public bool? IsAbnormal { get; set; }
}

}