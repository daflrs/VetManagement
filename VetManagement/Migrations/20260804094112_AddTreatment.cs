using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace VetManagement.Migrations
{
    /// <inheritdoc />
    public partial class AddTreatment : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Treatments",
                columns: table => new
                {
                    TreatmentId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MedicalRecordId = table.Column<int>(type: "int", nullable: false),
                    Others = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Treatments", x => x.TreatmentId);
                });

            migrationBuilder.CreateTable(
                name: "TreatmentItems",
                columns: table => new
                {
                    TreatmentItemId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TreatmentId = table.Column<int>(type: "int", nullable: false),
                    MedicationId = table.Column<int>(type: "int", nullable: true),
                    ServiceId = table.Column<int>(type: "int", nullable: true),
                    NameAtTreatment = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UnitPrice = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Quantity = table.Column<int>(type: "int", nullable: false),
                    Reason = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TreatmentItems", x => x.TreatmentItemId);
                    table.ForeignKey(
                        name: "FK_TreatmentItems_Medications_MedicationId",
                        column: x => x.MedicationId,
                        principalTable: "Medications",
                        principalColumn: "MedicationId");
                    table.ForeignKey(
                        name: "FK_TreatmentItems_Services_ServiceId",
                        column: x => x.ServiceId,
                        principalTable: "Services",
                        principalColumn: "ServiceId");
                    table.ForeignKey(
                        name: "FK_TreatmentItems_Treatments_TreatmentId",
                        column: x => x.TreatmentId,
                        principalTable: "Treatments",
                        principalColumn: "TreatmentId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_TreatmentItems_MedicationId",
                table: "TreatmentItems",
                column: "MedicationId");

            migrationBuilder.CreateIndex(
                name: "IX_TreatmentItems_ServiceId",
                table: "TreatmentItems",
                column: "ServiceId");

            migrationBuilder.CreateIndex(
                name: "IX_TreatmentItems_TreatmentId",
                table: "TreatmentItems",
                column: "TreatmentId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TreatmentItems");

            migrationBuilder.DropTable(
                name: "Treatments");
        }
    }
}
