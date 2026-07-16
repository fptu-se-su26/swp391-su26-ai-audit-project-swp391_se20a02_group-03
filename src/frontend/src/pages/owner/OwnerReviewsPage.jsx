import { useCallback, useEffect, useRef, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { ownerApi } from '../../api/ownerApi';
import {
  OwnerPageHeader,
  OwnerCard,
  OwnerBtn,
  OwnerEmptyState,
  OwnerErrorState,
  ownerInputCls
} from '../../components/owner';
import { Star, MessageCircle, AlertTriangle, CornerDownRight } from 'lucide-react';

export default function OwnerReviewsPage() {
  const { complexId } = useOutletContext();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [replyText, setReplyText] = useState({});
  const [loadedComplexId, setLoadedComplexId] = useState(null);
  const requestIdRef = useRef(0);

  const load = useCallback(async () => {
    if (!complexId) return;
    const requestId = ++requestIdRef.current;
    setLoading(true);
    setError(null);
    setItems([]);
    setReplyText({});
    setLoadedComplexId(null);

    try {
      const res = await ownerApi.getReviews(complexId);
      if (requestId !== requestIdRef.current) return;
      if (res.statusCode !== 200) throw new Error(res.message || 'Không tải đánh giá.');
      setItems(res.data || []);
      setLoadedComplexId(complexId);
    } catch (err) {
      if (requestId === requestIdRef.current) {
        setError(typeof err === 'string' ? err : err?.message || 'Không tải đánh giá.');
      }
    } finally {
      if (requestId === requestIdRef.current) setLoading(false);
    }
  }, [complexId]);

  useEffect(() => {
    load();
    return () => {
      requestIdRef.current += 1;
    };
  }, [load]);

  async function submitReply(id) {
    if (loadedComplexId !== complexId) return;
    const reply = replyText[id];
    if (!reply?.trim()) return;
    try {
      const res = await ownerApi.replyReview(id, complexId, { reply });
      if (res.statusCode === 200) {
        setReplyText(t => ({ ...t, [id]: '' }));
        load();
      } else setError(res.message);
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Gửi phản hồi thất bại.');
    }
  }

  async function reportReview(id) {
    if (loadedComplexId !== complexId) return;
    const reason = window.prompt('Lý do báo cáo review này (spam, ngôn từ không phù hợp...):');
    if (!reason?.trim()) return;
    try {
      const res = await ownerApi.reportReview(id, complexId, { reason });
      if (res.statusCode === 200) {
        window.alert('Đã gửi báo cáo thành công. Quản trị viên sẽ xem xét.');
        setError(null);
      }
      else setError(res.message);
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Báo cáo thất bại.');
    }
  }

  function renderStars(rating) {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map(star => (
          <Star
            key={star}
            size={16}
            className={star <= rating ? "fill-amber-400 text-amber-400" : "fill-gray-100 text-gray-200"}
          />
        ))}
      </div>
    );
  }

  if (loading || (!error && loadedComplexId !== complexId)) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto auth-animate-in pb-12">
        <OwnerPageHeader
          title="Đánh giá từ khách hàng"
          description="Xem và phản hồi đánh giá của khách hàng về tổ hợp của bạn."
        />
        <div className="space-y-4 animate-pulse">
          <div className="h-40 bg-white rounded-[16px] border border-gray-100 shadow-[0_2px_16px_rgba(0,0,0,0.03)]" />
          <div className="h-40 bg-white rounded-[16px] border border-gray-100 shadow-[0_2px_16px_rgba(0,0,0,0.03)]" />
        </div>
      </div>
    );
  }

  if (loadedComplexId !== complexId) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto auth-animate-in pb-12">
        <OwnerPageHeader
          title="Đánh giá từ khách hàng"
          description="Xem và phản hồi đánh giá của khách hàng về tổ hợp của bạn."
        />
        <OwnerErrorState message={error || 'Không tải đánh giá.'} onRetry={load} />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto auth-animate-in pb-12">
      <OwnerPageHeader
        title="Đánh giá từ khách hàng"
        description="Xem và phản hồi đánh giá của khách hàng về tổ hợp của bạn."
      />

      {error && <OwnerErrorState message={error} onRetry={load} />}

      {!items.length ? (
        <OwnerEmptyState
          title="Chưa có đánh giá nào"
          description="Tổ hợp của bạn chưa nhận được đánh giá nào từ khách hàng."
        />
      ) : (
        <div className="space-y-4">
          {items.map(r => (
            <OwnerCard key={r.complexReviewId} className="group">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                <div className="flex flex-col gap-1.5">
                  <span className="font-bold text-[#0f172a] text-base">{r.customerName}</span>
                  <div className="flex items-center gap-3">
                    {renderStars(r.rating)}
                    <span className="text-xs font-medium text-gray-500">
                      {(() => {
                        const d = r.createdAt ? new Date(r.createdAt) : null;
                        return (d && !isNaN(d.valueOf())) ? d.toLocaleDateString('vi-VN') : 'Không rõ thời gian';
                      })()}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => reportReview(r.complexReviewId)}
                  className="min-h-11 px-3 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-gray-500 hover:text-red-500 transition-colors bg-transparent border-0 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded"
                  title="Báo cáo đánh giá xấu/spam"
                >
                  <AlertTriangle size={14} /> Báo cáo
                </button>
              </div>

              <div className="bg-gray-50/50 rounded-[8px] p-4 border border-gray-100">
                <p className="text-sm text-[#0f172a] m-0 whitespace-pre-wrap leading-relaxed">{r.content}</p>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-50">
                {r.ownerReply ? (
                  <div className="flex items-start gap-3">
                    <CornerDownRight className="text-gray-300 mt-1 shrink-0" size={16} />
                    <div className="flex-1 bg-teal-50/50 rounded-[8px] p-4 border border-teal-100/50">
                      <p className="text-[11px] font-bold uppercase tracking-widest text-[#14b8a6] mb-2 m-0 flex items-center gap-1.5">
                        <MessageCircle size={14} /> Phản hồi của bạn
                      </p>
                      <p className="text-sm text-gray-700 m-0 whitespace-pre-wrap">{r.ownerReply}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-3">
                    <CornerDownRight className="text-gray-300 mt-3 shrink-0" size={16} />
                    <div className="flex-1 flex flex-col sm:flex-row gap-3">
                      <input
                        className={ownerInputCls}
                        placeholder="Nhập phản hồi của bạn..."
                        aria-label={`Phản hồi đánh giá của ${r.customerName || 'khách hàng'}`}
                        value={replyText[r.complexReviewId] || ''}
                        onChange={e => setReplyText({ ...replyText, [r.complexReviewId]: e.target.value })}
                        onKeyDown={e => e.key === 'Enter' && submitReply(r.complexReviewId)}
                      />
                      <OwnerBtn
                        variant="secondary"
                        onClick={() => submitReply(r.complexReviewId)}
                        disabled={loadedComplexId !== complexId || !replyText[r.complexReviewId]?.trim()}
                        className="whitespace-nowrap sm:w-auto w-full"
                      >
                        Gửi phản hồi
                      </OwnerBtn>
                    </div>
                  </div>
                )}
              </div>
            </OwnerCard>
          ))}
        </div>
      )}
    </div>
  );
}
