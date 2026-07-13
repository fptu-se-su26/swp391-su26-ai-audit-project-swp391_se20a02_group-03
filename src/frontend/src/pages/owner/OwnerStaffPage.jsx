import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { ownerApi } from '../../api/ownerApi';
import PageLoader from '../../components/ui/PageLoader';
import EmptyState from '../../components/ui/EmptyState';
import StatusBadge from '../../components/ui/StatusBadge';

const PERMISSION_LABELS = {
  canCheckIn: 'Check-in',
  canCreateWalkIn: 'Walk-in',
};

const PERMISSION_KEYS = Object.keys(PERMISSION_LABELS);

export default function OwnerStaffPage() {
  const { complexId } = useOutletContext();
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [invite, setInvite] = useState({ email: '', canCheckIn: true, canCreateWalkIn: true });
  const [editId, setEditId] = useState(null);
  const [perms, setPerms] = useState({ canCheckIn: true, canCreateWalkIn: true });

  async function load() {
    try {
      setLoading(true);
      const res = await ownerApi.getStaff(complexId);
      if (res.statusCode === 200) setStaff(res.data || []);
      else setError(res.message);
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Lỗi tải nhân viên.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { if (complexId) load(); }, [complexId]);

  async function handleInvite(e) {
    e.preventDefault();
    try {
      const res = await ownerApi.inviteStaff({ ...invite, complexId });
      if (res.statusCode === 201) { setInvite({ email: '', canCheckIn: true, canCreateWalkIn: true }); load(); }
      else setError(res.message);
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Mời thất bại.');
    }
  }

  async function savePerms(id) {
    try {
      await ownerApi.updateStaffPermissions(id, complexId, perms);
      setEditId(null);
      load();
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Cập nhật quyền thất bại.');
    }
  }

  async function toggleStatus(row) {
    const next = row.status === 'Active' ? 'Inactive' : 'Active';
    try {
      await ownerApi.updateStaffStatus(row.staffAssignmentId, complexId, { status: next });
      load();
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Cập nhật trạng thái thất bại.');
    }
  }

  async function remove(id) {
    if (!window.confirm('Gỡ phân công nhân viên này?')) return;
    try {
      await ownerApi.removeStaff(id, complexId);
      load();
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Gỡ phân công thất bại.');
    }
  }

  if (loading) return <PageLoader label="Đang tải nhân viên..." />;

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-3xl md:text-4xl uppercase tracking-tight text-foreground">Quản lý nhân viên</h1>
      {error && <div className="text-sm text-danger">{error}</div>}

      <form onSubmit={handleInvite} className="border-2 border-border-strong bg-surface p-6 grid md:grid-cols-2 gap-3.5">
        <input required type="email" placeholder="Email nhân viên (đã có tài khoản)" className="input-base md:col-span-2" value={invite.email} onChange={e => setInvite({ ...invite, email: e.target.value })} />
        {PERMISSION_KEYS.map(k => (
          <label key={k} className="flex items-center gap-2 text-sm text-foreground">
            <input type="checkbox" checked={invite[k]} onChange={e => setInvite({ ...invite, [k]: e.target.checked })} />
            {PERMISSION_LABELS[k]}
          </label>
        ))}
        <button type="submit" className="md:col-span-2 btn-primary">Mời / Phân công</button>
      </form>

      {!staff.length ? (
        <EmptyState title="Chưa có nhân viên" subtitle="Chưa có nhân viên được phân công." />
      ) : (
        <div className="overflow-x-auto border-2 border-border-strong bg-surface">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-[var(--theme-primary)] text-[var(--theme-secondary)]">
                <th className="text-left px-4 py-3.5 label-mono">Nhân viên</th>
                <th className="text-left px-4 py-3.5 label-mono">Email</th>
                <th className="text-left px-4 py-3.5 label-mono">Trạng thái</th>
                <th className="text-left px-4 py-3.5 label-mono">Quyền</th>
                <th className="px-4 py-3.5" />
              </tr>
            </thead>
            <tbody>
              {staff.map(s => (
                <tr key={s.staffAssignmentId} className="border-t border-border-default hover:bg-surface-hover">
                  <td className="px-4 py-3.5 font-extrabold text-foreground">{s.fullName}</td>
                  <td className="px-4 py-3.5 text-foreground">{s.email}</td>
                  <td className="px-4 py-3.5"><StatusBadge status={s.status} /></td>
                  <td className="px-4 py-3.5 text-xs text-foreground-muted">
                    {[s.canCheckIn && 'Check-in', s.canCreateWalkIn && 'Walk-in'].filter(Boolean).join(', ')}
                  </td>
                  <td className="px-4 py-3.5 text-right space-x-3 whitespace-nowrap">
                    <button type="button" className="text-xs font-extrabold uppercase text-accent underline bg-transparent border-none cursor-pointer" onClick={() => { setEditId(s.staffAssignmentId); setPerms({ canCheckIn: s.canCheckIn, canCreateWalkIn: s.canCreateWalkIn }); }}>Sửa</button>
                    <button type="button" className="text-xs font-extrabold uppercase text-accent underline bg-transparent border-none cursor-pointer" onClick={() => toggleStatus(s)}>{s.status === 'Active' ? 'Vô hiệu' : 'Kích hoạt'}</button>
                    <button type="button" className="text-xs font-extrabold uppercase text-danger underline bg-transparent border-none cursor-pointer" onClick={() => remove(s.staffAssignmentId)}>Gỡ</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60" role="dialog" aria-modal="true" onClick={() => setEditId(null)}>
          <div className="bg-surface border-2 border-border-strong p-6 w-full max-w-md space-y-3" onClick={e => e.stopPropagation()}>
            <h3 className="font-heading text-xl uppercase text-foreground mb-1">Chỉnh quyền</h3>
            {PERMISSION_KEYS.map(k => (
              <label key={k} className="flex items-center gap-2 text-sm text-foreground">
                <input type="checkbox" checked={perms[k]} onChange={e => setPerms({ ...perms, [k]: e.target.checked })} />
                {PERMISSION_LABELS[k]}
              </label>
            ))}
            <div className="flex gap-3 justify-end pt-2">
              <button type="button" onClick={() => setEditId(null)} className="btn-outline">Hủy</button>
              <button type="button" onClick={() => savePerms(editId)} className="btn-primary">Lưu</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
