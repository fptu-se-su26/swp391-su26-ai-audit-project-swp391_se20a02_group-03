import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { ownerApi } from '../../api/ownerApi';
import PageLoader from '../../components/ui/PageLoader';

export default function OwnerStaffPage() {
  const { complexId } = useOutletContext();
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [invite, setInvite] = useState({ email: '', canCheckIn: true, canCreateWalkIn: true, canManageRental: true, canApplySurcharge: false });
  const [editId, setEditId] = useState(null);
  const [perms, setPerms] = useState({ canCheckIn: true, canCreateWalkIn: true, canManageRental: true, canApplySurcharge: false });

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
      if (res.statusCode === 201) { setInvite({ email: '', canCheckIn: true, canCreateWalkIn: true, canManageRental: true, canApplySurcharge: false }); load(); }
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
      <h2 className="text-xl font-bold">Quản lý nhân viên</h2>
      {error && <div className="text-sm text-red-600 rounded-lg border border-red-200 bg-red-50 p-3">{error}</div>}

      <form onSubmit={handleInvite} className="bg-white rounded-xl border p-4 grid md:grid-cols-2 gap-3">
        <input required type="email" placeholder="Email nhân viên (đã có tài khoản)" className="rounded-lg border px-3 py-2 text-sm md:col-span-2" value={invite.email} onChange={e => setInvite({ ...invite, email: e.target.value })} />
        {['canCheckIn', 'canCreateWalkIn', 'canManageRental', 'canApplySurcharge'].map(k => (
          <label key={k} className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={invite[k]} onChange={e => setInvite({ ...invite, [k]: e.target.checked })} />
            {k}
          </label>
        ))}
        <button type="submit" className="md:col-span-2 rounded-lg bg-emerald-600 text-white py-2 text-sm">Mời / Phân công</button>
      </form>

      {!staff.length ? (
        <p className="text-sm text-slate-500">Chưa có nhân viên được phân công.</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl border">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="p-3 text-left">Nhân viên</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Trạng thái</th>
                <th className="p-3 text-left">Quyền</th>
                <th className="p-3" />
              </tr>
            </thead>
            <tbody>
              {staff.map(s => (
                <tr key={s.staffAssignmentId} className="border-t">
                  <td className="p-3 font-medium">{s.fullName}</td>
                  <td className="p-3">{s.email}</td>
                  <td className="p-3">{s.status}</td>
                  <td className="p-3 text-xs">
                    {s.canCheckIn && 'Check-in '}
                    {s.canCreateWalkIn && 'Walk-in '}
                    {s.canManageRental && 'Rental '}
                    {s.canApplySurcharge && 'Surcharge'}
                  </td>
                  <td className="p-3 text-right space-x-2">
                    <button type="button" className="text-xs underline bg-transparent border-none cursor-pointer" onClick={() => { setEditId(s.staffAssignmentId); setPerms({ canCheckIn: s.canCheckIn, canCreateWalkIn: s.canCreateWalkIn, canManageRental: s.canManageRental, canApplySurcharge: s.canApplySurcharge }); }}>Sửa</button>
                    <button type="button" className="text-xs underline bg-transparent border-none cursor-pointer" onClick={() => toggleStatus(s)}>{s.status === 'Active' ? 'Vô hiệu' : 'Kích hoạt'}</button>
                    <button type="button" className="text-xs text-red-600 underline bg-transparent border-none cursor-pointer" onClick={() => remove(s.staffAssignmentId)}>Gỡ</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-5 w-full max-w-md space-y-3">
            <h3 className="font-semibold">Chỉnh quyền</h3>
            {['canCheckIn', 'canCreateWalkIn', 'canManageRental', 'canApplySurcharge'].map(k => (
              <label key={k} className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={perms[k]} onChange={e => setPerms({ ...perms, [k]: e.target.checked })} />
                {k}
              </label>
            ))}
            <div className="flex gap-2 justify-end">
              <button type="button" onClick={() => setEditId(null)} className="px-3 py-1.5 border rounded-lg text-sm">Hủy</button>
              <button type="button" onClick={() => savePerms(editId)} className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-sm">Lưu</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
