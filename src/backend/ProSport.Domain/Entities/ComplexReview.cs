namespace ProSport.Domain.Entities;

public class ComplexReview : BaseEntity
{
    public int ComplexReviewId { get; set; }
    public int ComplexId { get; set; }
    public int UserId { get; set; }
    public int Rating { get; set; }
    public string Content { get; set; } = string.Empty;
    public string? OwnerReply { get; set; }
    public DateTime? OwnerReplyAt { get; set; }
    public bool IsReported { get; set; }
    public string? ReportReason { get; set; }
    public string Status { get; set; } = "Published";

    public Complex Complex { get; set; } = null!;
    public User User { get; set; } = null!;
}
