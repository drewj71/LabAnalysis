namespace LabAnalysisAPI.Models
{
    public enum MedicationType
    {
        Prescription,
        OTC,
        Vitamin
    }
    
    public class Medication
    {
        public int MedicationId { get; set; }
        public string MedicationName { get; set; }
        public MedicationType Type { get; set; }
    }
}