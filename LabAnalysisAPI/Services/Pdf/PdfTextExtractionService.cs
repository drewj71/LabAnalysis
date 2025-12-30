using System.Text;
using UglyToad.PdfPig;

namespace LabAnalysisAPI.Services.Pdf
{
    public class PdfTextExtractionService : IPdfTextExtractionService
    {
        public string ExtractText(Stream pdfStream)
        {
            using var document = PdfDocument.Open(pdfStream);
            var text = new StringBuilder();

            foreach (var page in document.GetPages())
            {
                text.AppendLine($"--- Page {page.Number} ---");
                text.AppendLine(page.Text);
            }

            return text.ToString();
        }
    }
}