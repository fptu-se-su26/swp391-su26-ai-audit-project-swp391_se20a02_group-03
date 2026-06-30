using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProSport.Application.DTOs;
using ProSport.Application.DTOs.Owner;
using ProSport.Application.Interfaces;
using ProSport.Domain.Constants;
using ProSport.Domain.Entities;

namespace ProSport.API.Controllers.Owner;

[Route("api/owner/complexes")]
[ApiController]
[Authorize(Roles = Roles.CourtOwner + "," + Roles.Admin)]
public class OwnerComplexController : OwnerControllerBase
{
    private readonly IOwnerAccessService _ownerAccessService;
    private readonly IComplexRepository _complexRepository;

    public OwnerComplexController(
        ICurrentUserContext currentUser,
        IOwnerAccessService ownerAccessService,
        IComplexRepository complexRepository) : base(currentUser)
    {
        _ownerAccessService = ownerAccessService;
        _complexRepository = complexRepository;
    }

    [HttpGet]
    public async Task<IActionResult> GetComplexes()
    {
        var userId = GetUserId();
        if (userId == null) return UnauthorizedResult();

        try
        {
            if (IsAdmin)
            {
                var all = await _complexRepository.GetAllActiveAsync();
                return ToResult(new ApiResponseDto<List<Complex>>(200, "Success", all));
            }

            var ctx = await _ownerAccessService.GetOwnerContextAsync(userId.Value);
            return ToResult(new ApiResponseDto<List<ComplexDto>>(200, "Success", ctx.ManagedComplexes));
        }
        catch (Exception ex)
        {
            return FromOwnerException(ex);
        }
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetComplex(int id)
    {
        var userId = GetUserId();
        if (userId == null) return UnauthorizedResult();

        try
        {
            await _ownerAccessService.RequireOwnerOrAdminAccessAsync(userId.Value, id, IsAdmin);
            var complex = await _complexRepository.GetByIdAsync(id);
            if (complex == null)
                return StatusCode(404, new ApiResponseDto<object>(404, "Không tìm thấy tổ hợp."));

            return ToResult(new ApiResponseDto<Complex>(200, "Success", complex));
        }
        catch (Exception ex)
        {
            return FromOwnerException(ex);
        }
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateComplex(int id, [FromBody] UpdateComplexDto updateDto)
    {
        var userId = GetUserId();
        if (userId == null) return UnauthorizedResult();

        try
        {
            await _ownerAccessService.RequireOwnerOrAdminAccessAsync(userId.Value, id, IsAdmin);

            var existing = await _complexRepository.GetByIdAsync(id);
            if (existing == null)
                return StatusCode(404, new ApiResponseDto<object>(404, "Không tìm thấy tổ hợp."));

            if (!string.IsNullOrWhiteSpace(updateDto.Name)) existing.Name = updateDto.Name;
            if (updateDto.Address != null) existing.Address = updateDto.Address;
            if (updateDto.Description != null) existing.Description = updateDto.Description;
            if (updateDto.Phone != null) existing.Phone = updateDto.Phone;
            if (updateDto.Email != null) existing.Email = updateDto.Email;
            if (updateDto.LogoUrl != null) existing.LogoUrl = updateDto.LogoUrl;
            if (updateDto.OpeningTime != null) existing.OpeningTime = updateDto.OpeningTime;
            if (updateDto.ClosingTime != null) existing.ClosingTime = updateDto.ClosingTime;
            existing.UpdatedAt = DateTime.UtcNow;

            await _complexRepository.UpdateAsync(existing);
            return ToResult(new ApiResponseDto<Complex>(200, "Cập nhật tổ hợp thành công", existing));
        }
        catch (Exception ex)
        {
            return FromOwnerException(ex);
        }
    }
}
