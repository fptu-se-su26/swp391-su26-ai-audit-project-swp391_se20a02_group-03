import { useEffect, useMemo, useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { ownerApi } from '../../api/ownerApi';
import OwnerStatusBadge from '../../components/owner/OwnerStatusBadge';
import PageLoader from '../../components/ui/PageLoader';

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
    <div className="space-y-4">
      <div className="flex flex-wrap justify-between items-center gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Quản lý sân</h2>
          <p className="text-sm text-slate-500">Thêm, sửa và quản lý trạng thái sân trong tổ hợp.</p>
        </div>
        <Link to="/owner/courts/create" className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm no-underline hover:bg-emerald-700">
          + Tạo sân
        </Link>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 flex justify-between">
          <span>{error}</span>
          <button type="button" className="underline bg-transparent border-none cursor-pointer" onClick={load}>Thử lại</button>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <input
          className="rounded-lg border px-3 py-2 text-sm flex-1 min-w-[200px]"
          placeholder="Tìm tên hoặc mã sân..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select className="rounded-lg border px-3 py-2 text-sm" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="">Tất cả trạng thái</option>
          <option value="Available">Hoạt động</option>
          <option value="Maintenance">Bảo trì</option>
          <option value="Inactive">Ngưng hoạt động</option>
        </select>
      </div>

      {!filtered.length ? (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-500">
          Chưa có sân nào. <Link to="/owner/courts/create" className="text-emerald-700">Tạo sân đầu tiên</Link>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl border">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="text-left p-3">Mã</th>
                <th className="text-left p-3">Tên</th>
                <th className="text-left p-3">Loại</th>
                <th className="text-left p-3">Giá/giờ</th>
                <th className="text-left p-3">Trạng thái</th>
                <th className="text-right p-3">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.courtId} className="border-t hover:bg-slate-50">
                  <td className="p-3 font-mono text-xs">{c.code || '—'}</td>
                  <td className="p-3 font-medium">
                    <Link to={`/owner/courts/${c.courtId}`} className="text-emerald-700 no-underline hover:underline">{c.name}</Link>
                  </td>
                  <td className="p-3">{c.courtTypeName}</td>
                  <td className="p-3">{Number(c.pricePerHour || 0).toLocaleString('vi-VN')} ₫</td>
                  <td className="p-3"><OwnerStatusBadge status={c.status} type="court" /></td>
                  <td className="p-3 text-right whitespace-nowrap">
                    <Link to={`/owner/courts/${c.courtId}`} className="text-xs text-emerald-700 no-underline hover:underline mr-3">Sửa</Link>
                    <button type="button" onClick={() => toggleStatus(c)} className="text-xs text-amber-700 underline bg-transparent border-none cursor-pointer mr-3">
                      {isMaintenanceStatus(c.status) ? 'Kích hoạt' : 'Bảo trì'}
                    </button>
                    <button type="button" onClick={() => removeCourt(c)} className="text-xs text-red-600 underline bg-transparent border-none cursor-pointer">
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
