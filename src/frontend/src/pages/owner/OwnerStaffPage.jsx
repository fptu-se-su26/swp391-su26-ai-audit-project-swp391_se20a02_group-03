import { useEffect, useState } from 'react';
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
  OwnerTableLoader,
  OwnerBtn,
  OwnerFormField,
  ownerInputCls,
  OwnerStatusBadge,
  OwnerModal
} from '../../components/owner';

const PERMISSION_LABELS = {
  canCheckIn: 'Quyền Check-in',
  canCreateWalkIn: 'Quyền Walk-in',
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
  const [showInviteForm, setShowInviteForm] = useState(false);

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
    if (!invite.email.trim()) return;
    try {
      const res = await ownerApi.inviteStaff({ ...invite, complexId });
      if (res.statusCode === 201) {
        setInvite({ email: '', canCheckIn: true, canCreateWalkIn: true });
        setShowInviteForm(false);
        load();
      }
      else setError(res.message);
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Mời thất bại.');
    }
  }

  async function savePerms() {
    if (!editId) return;
    try {
      await ownerApi.updateStaffPermissions(editId, complexId, perms);
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

  return (
    <div className="space-y-6 auth-animate-in pb-12">
      <OwnerPageHeader
        title="Quản lý nhân viên"
        description="Thêm nhân viên và quản lý quyền truy cập tổ hợp."
      >
        <OwnerBtn variant="primary" onClick={() => setShowInviteForm(!showInviteForm)}>
          {showInviteForm ? 'Đóng form' : '+ Mời nhân viên'}
        </OwnerBtn>
      </OwnerPageHeader>

      {error && (
        <div className="bg-red-50 border border-red-100 rounded-[16px] px-6 py-4 flex items-center justify-between">
          <p className="text-sm font-medium text-red-600 m-0">{error}</p>
          <button type="button" onClick={() => setError(null)} className="text-sm text-red-500 underline bg-transparent border-none cursor-pointer">Ẩn</button>
        </div>
      )}

      {showInviteForm && (
        <OwnerCard className="border-[#14b8a6] border-t-4">
          <h3 className="font-heading text-base uppercase tracking-tight text-[#0f172a] m-0 mb-4">Mời nhân viên mới</h3>
          <form onSubmit={handleInvite} className="grid sm:grid-cols-2 gap-6">
            <div className="sm:col-span-2">
              <OwnerFormField label="Email nhân viên (đã có tài khoản ProSport)" required>
                <input
                  required
                  type="email"
                  placeholder="VD: nhanvien@example.com"
                  className={ownerInputCls}
                  value={invite.email}
                  onChange={e => setInvite({ ...invite, email: e.target.value })}
                />
              </OwnerFormField>
            </div>

            <div className="sm:col-span-2">
              <p className="text-[12px] font-bold uppercase tracking-wide text-gray-500 mb-2">Quyền hạn</p>
              <div className="flex flex-wrap gap-6">
                {PERMISSION_KEYS.map(k => (
                  <label key={k} className="flex items-center gap-2 text-sm text-[#0f172a] cursor-pointer">
                    <input
                      type="checkbox"
                      className="accent-[#14b8a6] w-4 h-4 cursor-pointer"
                      checked={invite[k]}
                      onChange={e => setInvite({ ...invite, [k]: e.target.checked })}
                    />
                    {PERMISSION_LABELS[k]}
                  </label>
                ))}
              </div>
            </div>

            <div className="sm:col-span-2 flex justify-end pt-4 border-t border-gray-100 mt-2">
              <OwnerBtn type="submit">Gửi lời mời</OwnerBtn>
            </div>
          </form>
        </OwnerCard>
      )}

      <OwnerCard noPad>
        <OwnerTable>
          <OwnerThead>
            <OwnerTh>Tên nhân viên</OwnerTh>
            <OwnerTh>Email</OwnerTh>
            <OwnerTh>Quyền</OwnerTh>
            <OwnerTh>Trạng thái</OwnerTh>
            <OwnerTh right>Thao tác</OwnerTh>
          </OwnerThead>

          {loading && <OwnerTableLoader cols={5} rows={3} />}

          {!loading && !staff.length && (
            <tbody>
              <tr>
                <td colSpan={5}>
                  <OwnerEmptyState title="Chưa có nhân viên"
                    description="Tổ hợp của bạn chưa có nhân viên nào được phân công."
                    action={!showInviteForm && (
                      <OwnerBtn variant="primary" onClick={() => setShowInviteForm(true)} className="mt-4">
                        Mời nhân viên ngay
                      </OwnerBtn>
                    )}
                  />
                </td>
              </tr>
            </tbody>
          )}

          {!loading && staff.length > 0 && (
            <tbody className="divide-y divide-gray-50">
              {staff.map(s => (
                <tr key={s.staffAssignmentId} className="hover:bg-gray-50/50 transition-colors">
                  <OwnerTd>
                    <span className="font-bold text-[#0f172a]">{s.fullName}</span>
                  </OwnerTd>
                  <OwnerTd>
                    <span className="text-gray-500">{s.email}</span>
                  </OwnerTd>
                  <OwnerTd>
                    <div className="flex flex-wrap gap-1">
                      {s.canCheckIn && <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-[4px] text-[10px] font-bold uppercase tracking-wider">Check-in</span>}
                      {s.canCreateWalkIn && <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-[4px] text-[10px] font-bold uppercase tracking-wider">Walk-in</span>}
                      {!s.canCheckIn && !s.canCreateWalkIn && <span className="text-gray-400 text-xs italic">Không có quyền</span>}
                    </div>
                  </OwnerTd>
                  <OwnerTd>
                    <OwnerStatusBadge status={s.status} type="general" />
                  </OwnerTd>
                  <OwnerTd right>
                    <div className="flex items-center justify-end gap-3">
                      <button
                        type="button"
                        className="text-[12px] font-bold text-gray-500 hover:text-[#14b8a6] uppercase tracking-wide bg-transparent border-0 cursor-pointer transition-colors"
                        onClick={() => { setEditId(s.staffAssignmentId); setPerms({ canCheckIn: s.canCheckIn, canCreateWalkIn: s.canCreateWalkIn }); }}
                      >
                        Sửa quyền
                      </button>
                      <button
                        type="button"
                        className="text-[12px] font-bold text-orange-500 hover:text-orange-600 uppercase tracking-wide bg-transparent border-0 cursor-pointer transition-colors"
                        onClick={() => toggleStatus(s)}
                      >
                        {s.status === 'Active' ? 'Vô hiệu' : 'Kích hoạt'}
                      </button>
                      <button
                        type="button"
                        className="text-[12px] font-bold text-red-500 hover:text-red-600 uppercase tracking-wide bg-transparent border-0 cursor-pointer transition-colors"
                        onClick={() => remove(s.staffAssignmentId)}
                      >
                        Gỡ
                      </button>
                    </div>
                  </OwnerTd>
                </tr>
              ))}
            </tbody>
          )}
        </OwnerTable>
      </OwnerCard>

      <OwnerModal
        open={!!editId}
        onClose={() => setEditId(null)}
        title="Chỉnh sửa quyền nhân viên"
        maxWidth="max-w-sm"
      >
        <div className="space-y-4">
          {PERMISSION_KEYS.map(k => (
            <label key={k} className="flex items-center gap-3 text-sm text-[#0f172a] cursor-pointer bg-gray-50 p-3 rounded-[8px] border border-gray-100">
              <input
                type="checkbox"
                className="accent-[#14b8a6] w-4 h-4 cursor-pointer"
                checked={perms[k]}
                onChange={e => setPerms({ ...perms, [k]: e.target.checked })}
              />
              <span className="font-semibold">{PERMISSION_LABELS[k]}</span>
            </label>
          ))}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
            <OwnerBtn variant="secondary" onClick={() => setEditId(null)}>Hủy</OwnerBtn>
            <OwnerBtn variant="primary" onClick={savePerms}>Lưu thay đổi</OwnerBtn>
          </div>
        </div>
      </OwnerModal>
    </div>
  );
}
