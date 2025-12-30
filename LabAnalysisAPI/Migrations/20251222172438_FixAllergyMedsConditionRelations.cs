using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LabAnalysisAPI.Migrations
{
    /// <inheritdoc />
    public partial class FixAllergyMedsConditionRelations : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ApplicationUserId",
                table: "UserLabResults",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "Status",
                table: "UserConditions",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<int>(
                name: "Severity",
                table: "UserConditions",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<DateTime>(
                name: "DiagnosisDate",
                table: "UserConditions",
                type: "datetime2",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2");

            migrationBuilder.CreateIndex(
                name: "IX_UserLabResults_ApplicationUserId",
                table: "UserLabResults",
                column: "ApplicationUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_UserLabResults_AspNetUsers_ApplicationUserId",
                table: "UserLabResults",
                column: "ApplicationUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserLabResults_AspNetUsers_ApplicationUserId",
                table: "UserLabResults");

            migrationBuilder.DropIndex(
                name: "IX_UserLabResults_ApplicationUserId",
                table: "UserLabResults");

            migrationBuilder.DropColumn(
                name: "ApplicationUserId",
                table: "UserLabResults");

            migrationBuilder.AlterColumn<int>(
                name: "Status",
                table: "UserConditions",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "Severity",
                table: "UserConditions",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "DiagnosisDate",
                table: "UserConditions",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true);
        }
    }
}
