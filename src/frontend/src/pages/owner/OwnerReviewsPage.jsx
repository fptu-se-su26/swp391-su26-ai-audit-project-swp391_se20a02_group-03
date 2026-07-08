import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { ownerApi } from '../../api/ownerApi';
import PageLoader from '../../components/ui/PageLoader';
import EmptyState from '../../components/ui/EmptyState';

export default function OwnerReviewsPage() {
  const { complexId } = useOutletContext();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [replyText, setReplyText] = useState({});

  async function load() {
    try {
      setError(null);
      const res = await ownerApi.getReviews(complexId);
      if (res.statusCode === 200) setItems(res.data || []);
      else setError(res.message);
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Không tải đánh giá.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { if (complexId) load(); }, [complexId]);

  async function submitReply(id) {
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
    const reason = window.prompt('Lý do báo cáo review:');
    if (!reason?.trim()) return;
    try {
      const res = await ownerApi.reportReview(id, complexId, { reason });
      if (res.statusCode === 200) setError(null);
      else setError(res.message);
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Báo cáo thất bại.');
    }
  }

  if (loading) return <PageLoader label="Đang tải đánh giá..." />;

  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="font-heading text-3xl md:text-4xl uppercase tracking-tight text-foreground">Đánh giá tổ hợp</h1>
      {error && <div className="text-sm text-danger">{error}</div>}
      {!items.length ? (
        <EmptyState title="Chưa có đánh giá" subtitle="Chưa có review nào cho tổ hợp." />
      ) : items.map(r => (
        <div key={r.complexReviewId} className="border-2 border-border-strong bg-surface p-6 space-y-3">
          <div className="flex justify-between text-sm gap-2">
            <strong className="text-foreground">{r.customerName}</strong>
            <div className="flex gap-3 items-center">
              <span className="label-mono text-foreground">★ {r.rating}</span>
              <button type="button" onClick={() => reportReview(r.complexReviewId)} className="text-xs font-extrabold uppercase text-danger underline bg-transparent border-none cursor-pointer">Báo cáo</button>
            </div>
          </div>
          <p className="text-sm text-foreground">{r.content}</p>
          {r.ownerReply && (
            <div className="bg-background-base border-l-[3px] border-border-strong px-4 py-2.5 text-sm text-foreground-muted">
              Phản hồi: {r.ownerReply}
            </div>
          )}
          {!r.ownerReply && (
            <div className="flex gap-2.5">
              <input className="input-base flex-1" placeholder="Phản hồi..." value={replyText[r.complexReviewId] || ''} onChange={e => setReplyText({ ...replyText, [r.complexReviewId]: e.target.value })} />
              <button type="button" onClick={() => submitReply(r.complexReviewId)} className="btn-primary">Gửi</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
