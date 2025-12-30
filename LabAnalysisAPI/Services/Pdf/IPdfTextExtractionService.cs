namespace LabAnalysisAPI.Services.Pdf
{
    public interface IPdfTextExtractionService
    {
        string ExtractText(Stream pdfStream);
    }
}