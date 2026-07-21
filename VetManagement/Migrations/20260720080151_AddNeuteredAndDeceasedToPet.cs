using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace VetManagement.Migrations
{
    /// <inheritdoc />
    public partial class AddNeuteredAndDeceasedToPet : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateOnly>(
                name: "DateOfDeath",
                table: "Pets",
                type: "date",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "Deceased",
                table: "Pets",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Neutered",
                table: "Pets",
                type: "bit",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DateOfDeath",
                table: "Pets");

            migrationBuilder.DropColumn(
                name: "Deceased",
                table: "Pets");

            migrationBuilder.DropColumn(
                name: "Neutered",
                table: "Pets");
        }
    }
}
