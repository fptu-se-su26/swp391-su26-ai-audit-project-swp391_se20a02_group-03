import { useEffect, useMemo, useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { ownerApi } from '../../api/ownerApi';
import StatusBadge from '../../components/ui/StatusBadge';
import PageLoader from '../../components/ui/PageLoader';
import EmptyState from '../../components/ui/EmptyState';

function isMaintenanceStatus(status) {
  return status === 'MAINTENANCE' || status === 'Maintenance';
}

export default function OwnerCourtsPage() {
  const { complexId } = useOutletContext();
  const [courts, setCourts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  async function load() {
    try {
      setLoading(true);
      setError(null);
      const res = await ownerApi.getCourts(complexId, {
        pageNumber: 1,
        pageSize: 100,
        searchTerm: search || undefined,
        status: statusFilter || undefined,
      });
      if (res.statusCode === 200) setCourts(res.data?.items || []);
      else setError(res.message);
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Lỗi tải sân.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { if (complexId) load(); }, [complexId, statusFilter]);

  const filtered = useMemo(() => {
    if (!search.trim()) return courts;
    const q = search.toLowerCase();
    return courts.filter(c => c.name?.toLowerCase().includes(q) || c.code?.toLowerCase().includes(q));
  }, [courts, search]);

  async function toggleStatus(court) {
    const next = isMaintenanceStatus(court.status) ? 'ACTIVE' : 'MAINTENANCE';
    if (!window.confirm(`Đổi trạng thái sân "${court.name}" sang ${next}?`)) return;
    try {
      const res = await ownerApi.updateCourtStatus(court.courtId, next);
      if (res.statusCode === 200) load();
      else setError(res.message || 'Không cập nhật được trạng thái.');
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Không cập nhật được trạng thái.');
    }
  }

  async function removeCourt(court) {
    if (!window.confirm(`Xóa sân "${court.name}"? Sân có lịch đặt trong tương lai sẽ không thể xóa.`)) return;
    try {
      const res = await ownerApi.deleteCourt(court.courtId);
      if (res.statusCode === 200) load();
      else setError(res.message || 'Không xóa được sân.');
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Không xóa được sân.');
    }
  }

  if (loading) return <PageLoader label="Đang tải danh sách sân..." />;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-end gap-5">
        <div>
          <h1 className="font-heading text-3xl md:text-4xl uppercase tracking-tight text-foreground mb-2">Quản lý sân</h1>
          <p className="text-sm text-foreground-muted">Thêm, sửa và quản lý trạng thái sân trong tổ hợp.</p>
        </div>
        <Link to="/owner/courts/create" className="btn-primary no-underline">
          + Tạo sân
        </Link>
      </div>

      {error && (
        <div className="border border-danger bg-danger-bg px-4 py-3 text-sm text-danger flex justify-between rounded-[2px]">
          <span>{error}</span>
          <button type="button" className="underline bg-transparent border-none cursor-pointer" onClick={load}>Thử lại</button>
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <input
          className="input-base flex-1 min-w-[200px] max-w-[340px]"
          placeholder="Tìm tên hoặc mã sân..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select className="input-base w-auto" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="">Tất cả trạng thái</option>
          <option value="Available">Hoạt động</option>
          <option value="Maintenance">Bảo trì</option>
          <option value="Inactive">Ngưng hoạt động</option>
        </select>
      </div>

      {!filtered.length ? (
        <EmptyState
          title="Chưa có sân nào"
          subtitle="Tạo sân đầu tiên để bắt đầu quản lý."
          action={<Link to="/owner/courts/create" className="btn-primary no-underline">Tạo sân đầu tiên</Link>}
        />
      ) : (
        <div className="overflow-x-auto border-2 border-border-strong bg-surface">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-[var(--theme-primary)] text-[var(--theme-secondary)]">
                <th className="text-left px-5 py-4 label-mono">Mã</th>
                <th className="text-left px-5 py-4 label-mono">Tên</th>
                <th className="text-left px-5 py-4 label-mono">Loại</th>
                <th className="text-left px-5 py-4 label-mono">Giá/giờ</th>
                <th className="text-left px-5 py-4 label-mono">Trạng thái</th>
                <th className="text-right px-5 py-4 label-mono">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.courtId} className="border-t border-border-default hover:bg-surface-hover">
                  <td className="px-5 py-4 font-mono text-xs text-foreground-muted">{c.code || '—'}</td>
                  <td className="px-5 py-4 font-bold">
                    <Link to={`/owner/courts/${c.courtId}`} className="text-foreground no-underline hover:underline">{c.name}</Link>
                  </td>
                  <td className="px-5 py-4 text-foreground-muted">{c.courtTypeName}</td>
                  <td className="px-5 py-4 text-foreground">{Number(c.pricePerHour || 0).toLocaleString('vi-VN')} ₫</td>
                  <td className="px-5 py-4"><StatusBadge status={c.status} /></td>
                  <td className="px-5 py-4 text-right whitespace-nowrap">
                    <Link to={`/owner/courts/${c.courtId}`} className="text-xs font-bold text-foreground no-underline hover:underline mr-4">Sửa</Link>
                    <button type="button" onClick={() => toggleStatus(c)} className="text-xs font-bold text-warning underline bg-transparent border-none cursor-pointer mr-4">
                      {isMaintenanceStatus(c.status) ? 'Kích hoạt' : 'Bảo trì'}
                    </button>
                    <button type="button" onClick={() => removeCourt(c)} className="text-xs font-bold text-danger underline bg-transparent border-none cursor-pointer">
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
