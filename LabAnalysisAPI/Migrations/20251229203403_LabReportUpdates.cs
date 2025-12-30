using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LabAnalysisAPI.Migrations
{
    /// <inheritdoc />
    public partial class LabReportUpdates : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ExtractionError",
                table: "LabReports",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "ExtractionSuccessful",
                table: "LabReports",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "NormalizedText",
                table: "LabReports",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ProcessingStatus",
                table: "LabReports",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "RawText",
                table: "LabReports",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ExtractionError",
                table: "LabReports");

            migrationBuilder.DropColumn(
                name: "ExtractionSuccessful",
                table: "LabReports");

            migrationBuilder.DropColumn(
                name: "NormalizedText",
                table: "LabReports");

            migrationBuilder.DropColumn(
                name: "ProcessingStatus",
                table: "LabReports");

            migrationBuilder.DropColumn(
                name: "RawText",
                table: "LabReports");
        }
    }
}
