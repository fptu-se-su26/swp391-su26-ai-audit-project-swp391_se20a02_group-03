import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { ownerApi } from '../../api/ownerApi';
import PageLoader from '../../components/ui/PageLoader';
import EmptyState from '../../components/ui/EmptyState';

export default function OwnerAuditLogsPage() {
  const { complexId } = useOutletContext();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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
  }, [complexId]);

  if (loading) return <PageLoader label="Đang tải audit log..." />;
  if (error) return <div className="text-sm text-danger">{error}</div>;

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-3xl md:text-4xl uppercase tracking-tight text-foreground">Nhật ký (Audit Log)</h1>

      {!items.length ? (
        <EmptyState title="Chưa có bản ghi" subtitle="Nhật ký thao tác sẽ hiển thị tại đây." />
      ) : (
        <div className="overflow-x-auto border-2 border-border-strong bg-surface">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-[var(--theme-primary)] text-[var(--theme-secondary)]">
                <th className="text-left px-4 py-3.5 label-mono">Thời gian</th>
                <th className="text-left px-4 py-3.5 label-mono">Hành động</th>
                <th className="text-left px-4 py-3.5 label-mono">Đối tượng</th>
                <th className="text-left px-4 py-3.5 label-mono">Chi tiết</th>
              </tr>
            </thead>
            <tbody>
              {items.map(a => (
                <tr key={a.auditLogId} className="border-t border-border-default">
                  <td className="px-4 py-3.5 font-mono text-xs text-foreground-muted whitespace-nowrap">{new Date(a.createdAt).toLocaleString('vi-VN')}</td>
                  <td className="px-4 py-3.5 font-bold text-foreground">{a.action}</td>
                  <td className="px-4 py-3.5 text-foreground">{a.entityType} #{a.entityId}</td>
                  <td className="px-4 py-3.5 text-xs text-foreground-muted truncate max-w-[240px]">{a.newValues}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
