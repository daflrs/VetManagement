using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace VetManagement.Migrations
{
    /// <inheritdoc />
    public partial class AddLabExamAndLabExamFinding : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "LabExams",
                columns: table => new
                {
                    LabExamId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Interpretation = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    MedicalRecordId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LabExams", x => x.LabExamId);
                    table.ForeignKey(
                        name: "FK_LabExams_MedicalRecords_MedicalRecordId",
                        column: x => x.MedicalRecordId,
                        principalTable: "MedicalRecords",
                        principalColumn: "MedicalRecordId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "LabExamFindings",
                columns: table => new
                {
                    LabExamFindingId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ImagePath = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Remark = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    LabExamId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LabExamFindings", x => x.LabExamFindingId);
                    table.ForeignKey(
                        name: "FK_LabExamFindings_LabExams_LabExamId",
                        column: x => x.LabExamId,
                        principalTable: "LabExams",
                        principalColumn: "LabExamId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_LabExamFindings_LabExamId",
                table: "LabExamFindings",
                column: "LabExamId");

            migrationBuilder.CreateIndex(
                name: "IX_LabExams_MedicalRecordId",
                table: "LabExams",
                column: "MedicalRecordId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "LabExamFindings");

            migrationBuilder.DropTable(
                name: "LabExams");
        }
    }
}
