using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace VetManagement.Migrations
{
    /// <inheritdoc />
    public partial class RemoveNullableNeuteredInPet : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Neutered",
                table: "Pets");

            migrationBuilder.RenameColumn(
                name: "Deceased",
                table: "Pets",
                newName: "isNeutered");

            migrationBuilder.AddColumn<bool>(
                name: "isDeceased",
                table: "Pets",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "isDeceased",
                table: "Pets");

            migrationBuilder.RenameColumn(
                name: "isNeutered",
                table: "Pets",
                newName: "Deceased");

            migrationBuilder.AddColumn<bool>(
                name: "Neutered",
                table: "Pets",
                type: "bit",
                nullable: true);
        }
    }
}
