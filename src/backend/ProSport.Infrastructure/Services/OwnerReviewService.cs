using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using ProSport.Application.DTOs;
using ProSport.Application.DTOs.Owner;
using ProSport.Application.Interfaces;
using ProSport.Domain.Entities;
using ProSport.Infrastructure.Data;

namespace ProSport.Infrastructure.Services;

public class OwnerReviewService : IOwnerReviewService
{
    private readonly ProSportDbContext _db;
    private readonly IAuditLogService _auditLog;

    public OwnerReviewService(ProSportDbContext db, IAuditLogService auditLog)
    {
        _db = db;
        _auditLog = auditLog;
    }

    public async Task<ApiResponseDto<List<ComplexReviewDto>>> GetReviewsAsync(int complexId)
    {
        var raw = await _db.ComplexReviews.AsNoTracking()
            .Include(r => r.User)
            .Where(r => r.ComplexId == complexId && !r.IsDeleted)
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync();
        return new ApiResponseDto<List<ComplexReviewDto>>(200, "Success", raw.Select(Map).ToList());
    }

    public async Task<ApiResponseDto<ComplexReviewDto>> ReplyToReviewAsync(int actorUserId, int reviewId, int complexId, OwnerReviewReplyDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Reply))
            return new ApiResponseDto<ComplexReviewDto>(400, "Nội dung phản hồi không được để trống.");

        var review = await _db.ComplexReviews.Include(r => r.User)
            .FirstOrDefaultAsync(r => r.ComplexReviewId == reviewId && r.ComplexId == complexId && !r.IsDeleted);
        if (review == null) return new ApiResponseDto<ComplexReviewDto>(404, "Không tìm thấy review.");

        review.OwnerReply = dto.Reply.Trim();
        review.OwnerReplyAt = DateTime.UtcNow;
        review.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        await _auditLog.LogAsync(actorUserId, "REPLY", "ComplexReview", reviewId.ToString(), complexId, null, dto.Reply);
        return new ApiResponseDto<ComplexReviewDto>(200, "Phản hồi thành công.", Map(review));
    }

    public async Task<ApiResponseDto<ComplexReviewDto>> ReportReviewAsync(int actorUserId, int reviewId, int complexId, OwnerReviewReportDto dto)
    {
        var review = await _db.ComplexReviews.Include(r => r.User)
            .FirstOrDefaultAsync(r => r.ComplexReviewId == reviewId && r.ComplexId == complexId && !r.IsDeleted);
        if (review == null) return new ApiResponseDto<ComplexReviewDto>(404, "Không tìm thấy review.");

        review.IsReported = true;
        review.ReportReason = dto.Reason.Trim();
        review.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        await _auditLog.LogAsync(actorUserId, "REPORT", "ComplexReview", reviewId.ToString(), complexId, null, dto.Reason);
        return new ApiResponseDto<ComplexReviewDto>(200, "Báo cáo review thành công.", Map(review));
    }

    private static ComplexReviewDto Map(ComplexReview r) => new()
    {
        ComplexReviewId = r.ComplexReviewId,
        ComplexId = r.ComplexId,
        CustomerName = r.User?.FullName ?? "",
        Rating = r.Rating,
        Content = r.Content,
        OwnerReply = r.OwnerReply,
        OwnerReplyAt = r.OwnerReplyAt,
        IsReported = r.IsReported,
        Status = r.Status,
        CreatedAt = r.CreatedAt
    };
}
