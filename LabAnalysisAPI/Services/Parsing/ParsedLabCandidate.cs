namespace LabAnalysisAPI.Services.Parsing
{
    public class ParsedLabCandidate
    {
        public string RawLine { get; set; } = null!;
        public string TestName { get; set; } = null!;
        public string? Value { get; set; }
        public string? Unit { get; set; }
        public string? ReferenceRange { get; set; }
        public bool? IsAbnormal { get; set; }
    }
}
