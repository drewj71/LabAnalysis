using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LabAnalysisAPI.Migrations
{
    /// <inheritdoc />
    public partial class UserOnboarding : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsOnboarded",
                table: "AspNetUsers",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "OnboardingStep",
                table: "AspNetUsers",
                type: "int",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsOnboarded",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "OnboardingStep",
                table: "AspNetUsers");
        }
    }
}
