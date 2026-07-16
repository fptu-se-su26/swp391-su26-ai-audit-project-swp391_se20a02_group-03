import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import { ownerApi } from '../../api/ownerApi';
import { 
  OwnerPageHeader, 
  OwnerCard, 
  OwnerTable,
  OwnerThead,
  OwnerTh,
  OwnerTd,
  OwnerEmptyState,
  OwnerErrorState,
  OwnerTableLoader
} from '../../components/owner';

export default function OwnerAuditLogsPage() {
  const { complexId } = useOutletContext();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  function load() {
    if (!complexId) return;
    setLoading(true);
    setError(null);
    ownerApi.getAuditLogs({ complexId, page: 1, size: 50 })
      .then(res => {
        if (res.statusCode === 200) setItems(res.data?.items || []);
        else setError(res.message || 'Không tải được audit log.');
      })
      .catch(err => setError(typeof err === 'string' ? err : 'Không tải được audit log.'))
      .finally(() => setLoading(false));
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { load(); }, [complexId]);

  return (
    <div className="space-y-6 auth-animate-in pb-12">
      <OwnerPageHeader 
        title="Nhật ký thao tác" 
        description="Xem lịch sử các thao tác quan trọng trong tổ hợp (Audit Log)."
      />

      {error && <OwnerErrorState message={error} onRetry={load} />}

      <OwnerCard noPad>
        <OwnerTable>
          <OwnerThead>
            <OwnerTh>Thời gian</OwnerTh>
            <OwnerTh>Hành động</OwnerTh>
            <OwnerTh>Đối tượng</OwnerTh>
            <OwnerTh>Chi tiết</OwnerTh>
          </OwnerThead>

          {loading && <OwnerTableLoader cols={4} rows={6} />}

          {!loading && !error && !items.length && (
            <tbody>
              <tr>
                <td colSpan={4}>
                  <OwnerEmptyState 
                    icon={Search} 
                    title="Chưa có dữ liệu nhật ký thao tác nào." 
                  />
                </td>
              </tr>
            </tbody>
          )}

          {!loading && !error && items.length > 0 && (
            <tbody className="divide-y divide-gray-50">
              {items.map(a => (
                <tr key={a.auditLogId} className="hover:bg-gray-50/50 transition-colors">
                  <OwnerTd>
                    <span className="font-mono text-[12px] text-gray-500 whitespace-nowrap">
                      {new Date(a.createdAt).toLocaleString('vi-VN')}
                    </span>
                  </OwnerTd>
                  <OwnerTd>
                    <span className="font-bold text-[#0f172a] uppercase tracking-wide text-xs bg-gray-100 px-2 py-1 rounded-[4px]">
                      {a.action}
                    </span>
                  </OwnerTd>
                  <OwnerTd>
                    <span className="font-medium text-gray-700">{a.entityType}</span>
                    <span className="font-mono text-xs text-gray-400 ml-1">#{a.entityId}</span>
                  </OwnerTd>
                  <OwnerTd>
                    <div className="text-xs text-gray-600 truncate max-w-sm font-mono" title={a.newValues}>
                      {a.newValues}
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
