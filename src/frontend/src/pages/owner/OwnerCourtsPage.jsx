import { useEffect, useMemo, useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { ownerApi } from '../../api/ownerApi';
import {
  OwnerPageHeader,
  OwnerBtn,
  OwnerCard,
  OwnerToolbar,
  OwnerSearchInput,
  OwnerTable,
  OwnerThead,
  OwnerTh,
  OwnerTd,
  OwnerStatusBadge,
  OwnerEmptyState,
  OwnerErrorState,
  OwnerTableLoader
} from '../../components/owner';

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

  useEffect(() => {
    if (complexId) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [complexId, statusFilter]);

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

  return (
    <div className="space-y-6 auth-animate-in pb-12">
      <OwnerPageHeader
        title="Quản lý sân"
        description="Thêm, sửa và quản lý trạng thái các sân trong tổ hợp."
      >
        <OwnerBtn to="/owner/courts/create" variant="primary">+ Tạo sân mới</OwnerBtn>
      </OwnerPageHeader>

      <OwnerToolbar>
        <div className="flex-1 w-full sm:w-auto max-w-[340px]">
          <OwnerSearchInput
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Tìm tên hoặc mã sân..."
          />
        </div>
        <select
          className="h-10 px-3 bg-white border border-gray-200 rounded-[8px] text-sm font-semibold text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#14b8a6]/20 focus:border-[#14b8a6] transition-all cursor-pointer"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
        >
          <option value="">Tất cả trạng thái</option>
          <option value="Available">Hoạt động</option>
          <option value="Maintenance">Bảo trì</option>
          <option value="Inactive">Ngưng hoạt động</option>
        </select>
      </OwnerToolbar>

      {error && (
        <OwnerErrorState message={error} onRetry={load} />
      )}

      <OwnerCard noPad>
        <OwnerTable>
          <OwnerThead>
            <OwnerTh>Mã</OwnerTh>
            <OwnerTh>Tên sân</OwnerTh>
            <OwnerTh>Loại sân</OwnerTh>
            <OwnerTh>Giá/giờ</OwnerTh>
            <OwnerTh>Trạng thái</OwnerTh>
            <OwnerTh right>Thao tác</OwnerTh>
          </OwnerThead>

          {loading && <OwnerTableLoader cols={6} rows={5} />}

          {!loading && !error && filtered.length === 0 && (
            <tbody>
              <tr>
                <td colSpan={6}>
                  <OwnerEmptyState title="Không tìm thấy sân nào."
                    description={search ? "Thử thay đổi từ khóa tìm kiếm." : "Tạo sân đầu tiên để bắt đầu quản lý."}
                    action={!search && (
                      <OwnerBtn to="/owner/courts/create" variant="primary" className="mt-4">Tạo sân ngay</OwnerBtn>
                    )}
                  />
                </td>
              </tr>
            </tbody>
          )}

          {!loading && !error && filtered.length > 0 && (
            <tbody className="divide-y divide-gray-50">
              {filtered.map(c => (
                <tr key={c.courtId} className="hover:bg-gray-50/50 transition-colors">
                  <OwnerTd>
                    <span className="font-mono text-[11px] font-semibold text-gray-400">{c.code || '—'}</span>
                  </OwnerTd>
                  <OwnerTd>
                    <Link to={`/owner/courts/${c.courtId}`} className="font-semibold text-[#0f172a] no-underline hover:text-[#14b8a6] transition-colors">
                      {c.name}
                    </Link>
                  </OwnerTd>
                  <OwnerTd>
                    <span className="text-gray-500">{c.courtTypeName}</span>
                  </OwnerTd>
                  <OwnerTd>
                    <span className="font-medium text-[#0f172a]">{Number(c.pricePerHour || 0).toLocaleString('vi-VN')} ₫</span>
                  </OwnerTd>
                  <OwnerTd>
                    <OwnerStatusBadge status={c.status} type="court" />
                  </OwnerTd>
                  <OwnerTd right>
                    <div className="flex items-center justify-end gap-3">
                      <Link to={`/owner/courts/${c.courtId}`} className="text-[12px] font-bold text-gray-500 hover:text-[#14b8a6] no-underline transition-colors uppercase tracking-wide">
                        Sửa
                      </Link>
                      <button
                        type="button"
                        onClick={() => toggleStatus(c)}
                        className="text-[12px] font-bold text-orange-500 hover:text-orange-600 uppercase tracking-wide bg-transparent border-0 cursor-pointer p-0 transition-colors"
                      >
                        {isMaintenanceStatus(c.status) ? 'Kích hoạt' : 'Bảo trì'}
                      </button>
                      <button
                        type="button"
                        onClick={() => removeCourt(c)}
                        className="text-[12px] font-bold text-red-500 hover:text-red-600 uppercase tracking-wide bg-transparent border-0 cursor-pointer p-0 transition-colors"
                      >
                        Xóa
                      </button>
                    </div>
                  </OwnerTd>
                </tr>
              ))}
            </tbody>
          )}
        </OwnerTable>
      </OwnerCard>
    </div>
  );
}
