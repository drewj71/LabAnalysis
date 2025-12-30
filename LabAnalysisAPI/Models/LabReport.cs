namespace LabAnalysisAPI.Models
{
    public enum LabProcessingStatus
    {
        Uploaded,
        TextExtracted,
        Parsed,
        Analyzed,
        Failed
    }

    public class LabReport
    {
        public int LabReportId { get; set; } // PK
        public string UserId { get; set; } = null!;
        public ApplicationUser User { get; set; } = null!;

        public DateTime UploadDate { get; set; } = DateTime.UtcNow; // when uploaded
        public DateTime? TestDate { get; set; } // the date the tests were performed (optional if different from upload)

        public string? FileName { get; set; } // original filename
        public string? FilePath { get; set; } // path to the file on the server
        public string? FileType { get; set; } // file type (e.g., PDF, JPEG)
        public string? Source { get; set; } // lab name or system
        public string? Notes { get; set; }
        public string? RawText { get; set; }
        public string? NormalizedText { get; set; }
        public bool ExtractionSuccessful { get; set; } = false;
        public string? ExtractionError { get; set; }
        public LabProcessingStatus ProcessingStatus { get; set; } = LabProcessingStatus.Uploaded;

        public ICollection<UserLabResult> UserLabResults { get; set; } = new List<UserLabResult>();
    }

}