import { useEffect, useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { ownerApi } from '../../api/ownerApi';
import OwnerStatusBadge from '../../components/owner/OwnerStatusBadge';
import PageLoader from '../../components/ui/PageLoader';

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
  if (error) return <div className="text-sm text-red-600">{error}</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-slate-900">Phiên thuê thiết bị</h2>
      {!items.length ? <p className="text-sm text-slate-500">Chưa có phiên thuê.</p> : (
        <div className="overflow-x-auto bg-white rounded-xl border">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500"><tr>
              <th className="text-left p-3">ID</th><th className="text-left p-3">Khách</th><th className="text-left p-3">Phí thuê</th><th className="text-left p-3">Surcharge</th><th className="text-left p-3">Trạng thái</th><th className="text-left p-3"></th>
            </tr></thead>
            <tbody>{items.map(r => (
              <tr key={r.rentalSessionId} className="border-t">
                <td className="p-3">#{r.rentalSessionId}</td>
                <td className="p-3">{r.customerName}</td>
                <td className="p-3">{Number(r.rentalFee).toLocaleString('vi-VN')} ₫</td>
                <td className="p-3">{Number(r.surchargeTotal).toLocaleString('vi-VN')} ₫</td>
                <td className="p-3"><OwnerStatusBadge status={r.status} /></td>
                <td className="p-3"><Link to={`/owner/rentals/${r.rentalSessionId}`} className="text-emerald-700 no-underline">Chi tiết</Link></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}
