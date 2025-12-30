using System.Text;
using System.Text.RegularExpressions;

namespace LabAnalysisAPI.Services.Parsing
{
    public class LabParsingService : ILabParsingService
    {
        private static readonly Regex LabLineRegex = new(
            @"^(?<name>[A-Za-z][A-Za-z\s\(\)\-\/]+?)\s+" +
            @"(?<value>\d+(\.\d+)?)\s*" +
            @"(?<unit>[A-Za-z/%u\d\^]+)?\s*" +
            @"(?<range>\(?\d+(\.\d+)?\s*-\s*\d+(\.\d+)?\)?)?",
            RegexOptions.Compiled
        );


        public string NormalizeText(string rawText)
        {
            if (string.IsNullOrWhiteSpace(rawText))
                return string.Empty;

            return rawText
                .Replace("\r\n", "\n")
                .Replace("\r", "\n")
                .Replace("\t", " ")
                .Replace("•", "")
                .Replace("–", "-")
                .Replace("—", "-")
                .Replace("µ", "u")
                .Replace("μ", "u")
                .Split('\n')
                .Select(l => Regex.Replace(l, @"\s{2,}", " ").Trim())
                .Where(l => l.Length > 5)
                .Aggregate(new StringBuilder(), (sb, l) => sb.AppendLine(l))
                .ToString();
        }


        public List<ParsedLabCandidate> ParseCandidates(string normalizedText)
        {
            var candidates = new List<ParsedLabCandidate>();
            var lines = normalizedText.Split('\n', StringSplitOptions.RemoveEmptyEntries);

            foreach (var line in lines)
            {
                var match = LabLineRegex.Match(line);

                if (!match.Success)
                    continue;

                var name = match.Groups["name"].Value.Trim();
                var value = match.Groups["value"].Value;
                var unit = match.Groups["unit"]?.Value;
                var range = match.Groups["range"]?.Value;

                if (string.IsNullOrWhiteSpace(name) || string.IsNullOrWhiteSpace(value))
                    continue;

                var candidate = new ParsedLabCandidate
                {
                    RawLine = line,
                    TestName = name,
                    Value = value,
                    Unit = unit,
                    ReferenceRange = range
                };

                candidates.Add(candidate);
            }

            return candidates;
        }

    }
}