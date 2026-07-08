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
  if (error || !rental) return <div className="text-danger text-sm">{error || 'Không tìm thấy.'}</div>;

  return (
    <div className="space-y-4 max-w-3xl">
      <div className="flex items-center gap-3.5">
        <h1 className="font-heading text-3xl md:text-4xl uppercase tracking-tight text-foreground">Phiên thuê #{rental.rentalSessionId}</h1>
        <OwnerStatusBadge status={rental.status} />
      </div>
      <div className="grid md:grid-cols-2 gap-5">
        <div className="border-2 border-border-strong bg-surface p-6 text-sm flex flex-col gap-2.5">
          <p className="m-0 text-foreground"><span className="text-foreground-subtle">Khách:</span> <strong>{rental.customerName}</strong></p>
          <p className="m-0 text-foreground"><span className="text-foreground-subtle">Booking:</span> {rental.bookingId ? `#${rental.bookingId}` : '—'}</p>
          <p className="m-0 text-foreground"><span className="text-foreground-subtle">Phí thuê:</span> {Number(rental.rentalFee).toLocaleString('vi-VN')} ₫</p>
          <p className="m-0 text-foreground"><span className="text-foreground-subtle">Surcharge:</span> {Number(rental.surchargeTotal).toLocaleString('vi-VN')} ₫</p>
        </div>
        <div className="border-2 border-border-strong bg-surface p-6">
          <h3 className="font-heading text-sm uppercase text-foreground mb-3">Assets</h3>
          <ul className="text-sm space-y-1 text-foreground">{rental.assets?.map(a => (
            <li key={a.rentalAssetId}>{a.assetCode} — {a.beforeCondition} → {a.afterCondition || '—'}</li>
          ))}</ul>
        </div>
      </div>
      <div className="border-2 border-border-strong bg-surface p-6">
        <h3 className="font-heading text-sm uppercase text-foreground mb-3">Condition history</h3>
        {!rental.conditionHistory?.length ? <p className="text-sm text-foreground-muted">Chưa có.</p> : (
          <ul className="text-sm space-y-1 text-foreground">{rental.conditionHistory.map(c => (
            <li key={c.conditionCheckId}>{c.checkType}: {c.assetCode} — {c.condition} ({c.staffName})</li>
          ))}</ul>
        )}
      </div>
      {rental.status !== 'Completed' && (
        <form onSubmit={applySurcharge} className="border-2 border-border-strong bg-surface p-6 flex flex-wrap gap-2.5 items-center">
          <input type="number" required className="input-base w-auto" placeholder="Amount" value={surcharge.amount} onChange={e => setSurcharge({ ...surcharge, amount: +e.target.value })} />
          <input required className="input-base flex-1 min-w-[200px]" placeholder="Lý do" value={surcharge.reason} onChange={e => setSurcharge({ ...surcharge, reason: e.target.value })} />
          <button type="submit" className="btn-primary">Áp surcharge</button>
        </form>
      )}
    </div>
  );
}
