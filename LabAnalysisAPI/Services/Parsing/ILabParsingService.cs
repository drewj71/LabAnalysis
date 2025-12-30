namespace LabAnalysisAPI.Services.Parsing
{
    public interface ILabParsingService
    {
        string NormalizeText(string rawText);
        List<ParsedLabCandidate> ParseCandidates(string normalizedText);
    }
}