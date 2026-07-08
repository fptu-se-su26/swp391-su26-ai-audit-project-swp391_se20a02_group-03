import { useEffect, useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { ownerApi } from '../../api/ownerApi';
import OwnerStatusBadge from '../../components/owner/OwnerStatusBadge';
import PageLoader from '../../components/ui/PageLoader';
import EmptyState from '../../components/ui/EmptyState';

export default function OwnerRentalsPage() {
  const { complexId } = useOutletContext();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!complexId) return;
    setLoading(true);
    setError(null);
    ownerApi.getRentals({ complexId, page: 1, size: 50 })
      .then(res => {
        if (res.statusCode === 200) setItems(res.data?.items || []);
        else setError(res.message || 'Không tải được danh sách phiên thuê.');
      })
      .catch(err => setError(typeof err === 'string' ? err : 'Không tải được danh sách phiên thuê.'))
      .finally(() => setLoading(false));
  }, [complexId]);

  if (loading) return <PageLoader label="Đang tải phiên thuê..." />;
  if (error) return <div className="text-sm text-danger">{error}</div>;

  return (
    <div className="space-y-4">
      <h1 className="font-heading text-3xl md:text-4xl uppercase tracking-tight text-foreground">Phiên thuê thiết bị</h1>
      {!items.length ? <EmptyState title="Chưa có phiên thuê" subtitle="Các phiên thuê thiết bị sẽ hiển thị tại đây." /> : (
        <div className="overflow-x-auto border-2 border-border-strong bg-surface">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-[var(--theme-primary)] text-[var(--theme-secondary)]">
                <th className="text-left px-4 py-3.5 label-mono">ID</th>
                <th className="text-left px-4 py-3.5 label-mono">Khách</th>
                <th className="text-left px-4 py-3.5 label-mono">Phí thuê</th>
                <th className="text-left px-4 py-3.5 label-mono">Surcharge</th>
                <th className="text-left px-4 py-3.5 label-mono">Trạng thái</th>
                <th className="px-4 py-3.5" />
              </tr>
            </thead>
            <tbody>{items.map(r => (
              <tr key={r.rentalSessionId} className="border-t border-border-default">
                <td className="px-4 py-3.5 text-foreground">#{r.rentalSessionId}</td>
                <td className="px-4 py-3.5 font-bold text-foreground">{r.customerName}</td>
                <td className="px-4 py-3.5 text-foreground">{Number(r.rentalFee).toLocaleString('vi-VN')} ₫</td>
                <td className="px-4 py-3.5 text-foreground">{Number(r.surchargeTotal).toLocaleString('vi-VN')} ₫</td>
                <td className="px-4 py-3.5"><OwnerStatusBadge status={r.status} /></td>
                <td className="px-4 py-3.5 text-right"><Link to={`/owner/rentals/${r.rentalSessionId}`} className="text-foreground font-bold underline">Chi tiết</Link></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}
