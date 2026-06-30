import { useEffect, useState } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';
import { ownerApi } from '../../api/ownerApi';
import OwnerStatusBadge from '../../components/owner/OwnerStatusBadge';
import PageLoader from '../../components/ui/PageLoader';

export default function OwnerRentalDetailPage() {
  const { complexId } = useOutletContext();
  const { rentalId } = useParams();
  const [rental, setRental] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [surcharge, setSurcharge] = useState({ amount: 0, reason: '' });

  async function load() {
    try {
      setLoading(true);
      const res = await ownerApi.getRental(rentalId, complexId);
      if (res.statusCode === 200) setRental(res.data);
      else setError(res.message);
    } catch { setError('Không tải được chi tiết.'); }
    finally { setLoading(false); }
  }

  useEffect(() => { if (complexId && rentalId) load(); }, [complexId, rentalId]);

  async function applySurcharge(e) {
    e.preventDefault();
    if (!window.confirm('Áp dụng surcharge?')) return;
    const res = await ownerApi.addSurcharge(rentalId, complexId, surcharge);
    if (res.statusCode === 201) { setSurcharge({ amount: 0, reason: '' }); load(); }
    else setError(res.message);
  }

  if (loading) return <PageLoader label="Đang tải chi tiết phiên thuê..." />;
  if (error || !rental) return <div className="text-red-700 text-sm">{error || 'Không tìm thấy.'}</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Phiên thuê #{rental.rentalSessionId}</h2>
        <OwnerStatusBadge status={rental.status} />
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white border rounded-xl p-4 text-sm space-y-1">
          <p><strong>Khách:</strong> {rental.customerName}</p>
          <p><strong>Booking:</strong> {rental.bookingId ? `#${rental.bookingId}` : '—'}</p>
          <p><strong>Phí thuê:</strong> {Number(rental.rentalFee).toLocaleString('vi-VN')} ₫</p>
          <p><strong>Surcharge:</strong> {Number(rental.surchargeTotal).toLocaleString('vi-VN')} ₫</p>
        </div>
        <div className="bg-white border rounded-xl p-4">
          <h3 className="font-semibold mb-2 text-sm">Assets</h3>
          <ul className="text-sm space-y-1">{rental.assets?.map(a => (
            <li key={a.rentalAssetId}>{a.assetCode} — {a.beforeCondition} → {a.afterCondition || '—'}</li>
          ))}</ul>
        </div>
      </div>
      <div className="bg-white border rounded-xl p-4">
        <h3 className="font-semibold mb-2 text-sm">Condition history</h3>
        {!rental.conditionHistory?.length ? <p className="text-sm text-slate-500">Chưa có.</p> : (
          <ul className="text-sm space-y-1">{rental.conditionHistory.map(c => (
            <li key={c.conditionCheckId}>{c.checkType}: {c.assetCode} — {c.condition} ({c.staffName})</li>
          ))}</ul>
        )}
      </div>
      {rental.status !== 'Completed' && (
        <form onSubmit={applySurcharge} className="bg-white border rounded-xl p-4 flex flex-wrap gap-2 items-end">
          <input type="number" required className="border rounded-lg px-3 py-2 text-sm" placeholder="Amount" value={surcharge.amount} onChange={e => setSurcharge({ ...surcharge, amount: +e.target.value })} />
          <input required className="border rounded-lg px-3 py-2 text-sm flex-1 min-w-[200px]" placeholder="Lý do" value={surcharge.reason} onChange={e => setSurcharge({ ...surcharge, reason: e.target.value })} />
          <button type="submit" className="px-4 py-2 bg-amber-600 text-white rounded-lg border-none cursor-pointer text-sm">Áp surcharge</button>
        </form>
      )}
    </div>
  );
}
