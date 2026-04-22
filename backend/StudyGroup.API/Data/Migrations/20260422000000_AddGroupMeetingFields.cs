using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StudyGroup.API.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddGroupMeetingFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Location",
                table: "Groups",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MeetingType",
                table: "Groups",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MeetingSchedule",
                table: "Groups",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Location",
                table: "Groups");

            migrationBuilder.DropColumn(
                name: "MeetingType",
                table: "Groups");

            migrationBuilder.DropColumn(
                name: "MeetingSchedule",
                table: "Groups");
        }
    }
}
