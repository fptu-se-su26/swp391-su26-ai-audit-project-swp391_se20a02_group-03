import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { ownerApi } from '../../api/ownerApi';
import PageLoader from '../../components/ui/PageLoader';

export default function OwnerAuditLogsPage() {
  const { complexId } = useOutletContext();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!complexId) return;
    ownerApi.getAuditLogs({ complexId, page: 1, size: 50 }).then(res => {
      if (res.statusCode === 200) setItems(res.data?.items || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [complexId]);

  if (loading) return <PageLoader label="Đang tải audit log..." />;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Audit Log</h2>
      {!items.length ? <p className="text-sm text-slate-500">Chưa có bản ghi.</p> : (
        <div className="overflow-x-auto bg-white rounded-xl border">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500"><tr>
              <th className="text-left p-3">Thời gian</th><th className="text-left p-3">Action</th><th className="text-left p-3">Entity</th><th className="text-left p-3">Chi tiết</th>
            </tr></thead>
            <tbody>{items.map(a => (
              <tr key={a.auditLogId} className="border-t">
                <td className="p-3 text-xs">{new Date(a.createdAt).toLocaleString('vi-VN')}</td>
                <td className="p-3">{a.action}</td>
                <td className="p-3">{a.entityType} #{a.entityId}</td>
                <td className="p-3 text-xs text-slate-500 truncate max-w-[200px]">{a.newValues}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}
