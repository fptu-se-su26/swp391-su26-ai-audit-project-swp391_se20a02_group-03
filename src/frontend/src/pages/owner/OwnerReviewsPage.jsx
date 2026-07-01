import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { ownerApi } from '../../api/ownerApi';
import PageLoader from '../../components/ui/PageLoader';

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
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Đánh giá tổ hợp</h2>
      {error && <div className="text-sm text-red-700 bg-red-50 border rounded-lg px-3 py-2">{error}</div>}
      {!items.length ? <p className="text-sm text-slate-500">Chưa có review.</p> : items.map(r => (
        <div key={r.complexReviewId} className="bg-white border rounded-xl p-4 space-y-2">
          <div className="flex justify-between text-sm gap-2">
            <strong>{r.customerName}</strong>
            <div className="flex gap-2 items-center">
              <span>★ {r.rating}</span>
              <button type="button" onClick={() => reportReview(r.complexReviewId)} className="text-xs text-red-600 underline bg-transparent border-none cursor-pointer">Báo cáo</button>
            </div>
          </div>
          <p className="text-sm">{r.content}</p>
          {r.ownerReply && <p className="text-sm text-emerald-800 bg-emerald-50 rounded-lg px-3 py-2">Phản hồi: {r.ownerReply}</p>}
          {!r.ownerReply && (
            <div className="flex gap-2">
              <input className="border rounded-lg px-3 py-2 text-sm flex-1" placeholder="Phản hồi..." value={replyText[r.complexReviewId] || ''} onChange={e => setReplyText({ ...replyText, [r.complexReviewId]: e.target.value })} />
              <button type="button" onClick={() => submitReply(r.complexReviewId)} className="px-3 py-2 bg-emerald-600 text-white rounded-lg border-none cursor-pointer text-sm">Gửi</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
