using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace VetManagement.Migrations
{
    /// <inheritdoc />
    public partial class AddTreatmentToMedicalRecords : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Treatment",
                table: "MedicalRecords");

            migrationBuilder.CreateIndex(
                name: "IX_Treatments_MedicalRecordId",
                table: "Treatments",
                column: "MedicalRecordId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Treatments_MedicalRecords_MedicalRecordId",
                table: "Treatments",
                column: "MedicalRecordId",
                principalTable: "MedicalRecords",
                principalColumn: "MedicalRecordId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Treatments_MedicalRecords_MedicalRecordId",
                table: "Treatments");

            migrationBuilder.DropIndex(
                name: "IX_Treatments_MedicalRecordId",
                table: "Treatments");

            migrationBuilder.AddColumn<string>(
                name: "Treatment",
                table: "MedicalRecords",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}
