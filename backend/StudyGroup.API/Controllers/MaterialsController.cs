using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StudyGroup.API.Auth.Policies;
using StudyGroup.API.DTOs.Materials;
using StudyGroup.API.Middlewares;
using StudyGroup.API.Services;

namespace StudyGroup.API.Controllers;

[ApiController]
[Route("api/groups/{groupId:guid}/materials")]
[Authorize]
public class MaterialsController : ControllerBase
{
    private readonly IMaterialService _materials;

    public MaterialsController(IMaterialService materials) => _materials = materials;

    /// <summary>GET all materials for a group (members only)</summary>
    [HttpGet]
    public async Task<IActionResult> GetAll(Guid groupId)
        => Ok(await _materials.GetGroupMaterialsAsync(groupId, User.GetUserId()));

    /// <summary>POST upload a new material file</summary>
    [HttpPost]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> Upload(Guid groupId, [FromForm] MaterialUploadDto dto)
    {
        var result = await _materials.UploadMaterialAsync(groupId, dto.File, User.GetUserId());
        return CreatedAtAction(nameof(GetAll), new { groupId }, result);
    }

    /// <summary>GET download a material file</summary>
    [HttpGet("{materialId:guid}/download")]
    public async Task<IActionResult> Download(Guid groupId, Guid materialId)
    {
        var (data, fileName, contentType) =
            await _materials.DownloadMaterialAsync(materialId, User.GetUserId());
        return File(data, contentType, fileName);
    }

    /// <summary>DELETE a material (uploader or group owner)</summary>
    [HttpDelete("{materialId:guid}")]
    public async Task<IActionResult> Delete(Guid groupId, Guid materialId)
    {
        await _materials.DeleteMaterialAsync(materialId, User.GetUserId());
        return NoContent();
    }
}
