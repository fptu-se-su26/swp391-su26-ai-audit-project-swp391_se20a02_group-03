import { useState, useEffect, useCallback } from 'react'
import AdminLayout from '../../layouts/AdminLayout'
import { userApi } from '../../api/userApi'
import { useToast } from '../../components/Toast'
import { Search, Lock, Unlock, Loader2, ShieldAlert } from 'lucide-react'

const ROLE_TABS = [
  { key: '', label: 'Tất cả' },
  { key: 'Admin', label: 'Quản trị viên' },
  { key: 'Staff', label: 'Nhân sự' },
  { key: 'Customer', label: 'Khách hàng' },
]

const ROLE_LABELS = {
  Admin: 'Quản trị viên',
  Staff: 'Nhân sự',
  Customer: 'Khách hàng',
}

const EKYC_LABELS = {
  Verified: 'Đã xác minh',
  Pending: 'Chờ xác minh',
  Rejected: 'Từ chối',
  NotSubmitted: 'Chưa nộp',
}

const PAGE_SIZE = 10

function initialsOf(name = '') {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export default function AdminUsersPage() {
  const { addToast } = useToast()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [activeRole, setActiveRole] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [actingId, setActingId] = useState(null)

  const fetchUsers = useCallback(async (opts = {}) => {
    const { search: s = search, role = activeRole, page: p = page } = opts
    try {
      setLoading(true)
      setError(null)
      const res = await userApi.getUsers({ search: s, role, page: p, pageSize: PAGE_SIZE })
      if (res.statusCode === 200 && res.data) {
        setUsers(res.data.items || [])
        setTotalPages(res.data.totalPages || 1)
        setTotalCount(res.data.totalCount || 0)
      } else {
        setUsers([])
        setError(res.message || 'Không tải được danh sách người dùng.')
      }
    } catch (err) {
      setUsers([])
      setError(typeof err === 'string' ? err : 'Không tải được danh sách người dùng.')
    } finally {
      setLoading(false)
    }
  }, [search, activeRole, page])

  // Tải lại khi đổi role hoặc trang.
  useEffect(() => {
    fetchUsers({ role: activeRole, page })
  }, [activeRole, page, fetchUsers])

  // Debounce tìm kiếm: gõ xong 400ms tự gọi API và reset về trang 1.
  useEffect(() => {
    const timer = setTimeout(() => {
      if (page !== 1) {
        setPage(1) // việc đổi page sẽ trigger effect ở trên để fetch
      } else {
        fetchUsers({ search, role: activeRole, page: 1 })
      }
    }, 400)
    return () => clearTimeout(timer)
  }, [search, activeRole, page, fetchUsers])

  async function handleToggleLock(user) {
    try {
      setActingId(user.userId)
      const res = user.isLocked
        ? await userApi.unlockUser(user.userId)
        : await userApi.lockUser(user.userId)
      if (res.statusCode === 200) {
        addToast(res.message || 'Cập nhật trạng thái thành công.', 'success')
        // Cập nhật tại chỗ để phản hồi ngay, không cần tải lại cả trang.
        setUsers(prev => prev.map(u =>
          u.userId === user.userId ? { ...u, isLocked: !u.isLocked } : u))
      } else {
        addToast(res.message || 'Thao tác thất bại.', 'error')
      }
    } catch (err) {
      addToast(typeof err === 'string' ? err : 'Thao tác thất bại.', 'error')
    } finally {
      setActingId(null)
    }
  }

  function handleRoleChange(roleKey) {
    setPage(1)
    setActiveRole(roleKey)
  }

  return (
    <AdminLayout>
      <div>
        <h1 className="font-heading text-3xl md:text-4xl uppercase tracking-tight text-foreground mb-2">Quản lý người dùng</h1>
        <p className="text-sm text-foreground-muted mb-7">Quản lý tài khoản, vai trò và trạng thái xác minh trên toàn hệ thống.</p>

        <div className="flex flex-wrap justify-between items-center gap-3.5 mb-5">
          <div className="flex items-center gap-2 bg-surface border-2 border-border-strong rounded-[2px] h-11 px-3.5 min-w-[280px] focus-within:border-accent">
            <Search size={16} className="text-foreground-subtle shrink-0" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Tìm theo tên hoặc email..."
              className="border-none outline-none font-sans text-sm text-foreground w-full bg-transparent"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {ROLE_TABS.map(tab => (
              <button
                key={tab.key}
                onClick={() => handleRoleChange(tab.key)}
                className={`py-2.5 px-4 font-sans text-[11.5px] uppercase tracking-wide rounded-[2px] border-2 transition-colors ${
                  activeRole === tab.key
                    ? 'bg-ink text-paper border-ink font-extrabold'
                    : 'bg-transparent text-foreground border-border-strong font-bold hover:bg-surface-hover'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="border-2 border-border-strong bg-surface">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse font-sans">
              <thead>
                <tr className="bg-ink text-paper">
                  <th className="px-4.5 py-3.5 text-left label-mono">Người dùng</th>
                  <th className="px-4.5 py-3.5 text-left label-mono">Vai trò</th>
                  <th className="px-4.5 py-3.5 text-left label-mono">Xác minh</th>
                  <th className="px-4.5 py-3.5 text-left label-mono">Ngày tạo</th>
                  <th className="px-4.5 py-3.5 text-left label-mono">Trạng thái</th>
                  <th className="px-4.5 py-3.5 text-right label-mono">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-default">
                {loading && (
                  <tr>
                    <td colSpan={6} className="px-5 py-12 text-center text-foreground-subtle">
                      <Loader2 className="inline animate-spin mr-2" size={18} /> Đang tải...
                    </td>
                  </tr>
                )}

                {!loading && error && (
                  <tr>
                    <td colSpan={6} className="px-5 py-12 text-center text-danger">
                      <ShieldAlert className="inline mr-2" size={18} /> {error}
                    </td>
                  </tr>
                )}

                {!loading && !error && users.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-5 py-12 text-center text-foreground-subtle">Không tìm thấy người dùng nào.</td>
                  </tr>
                )}

                {!loading && !error && users.map((u) => {
                  const verified = u.eKycStatus === 'Verified'
                  return (
                    <tr key={u.userId} className="hover:bg-surface-hover transition-colors">
                      <td className="px-4.5 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          {u.avatarUrl ? (
                            <img src={u.avatarUrl} alt={u.fullName} className="w-9 h-9 rounded-full object-cover shrink-0" />
                          ) : (
                            <div className="w-9 h-9 rounded-[2px] bg-ink text-paper flex items-center justify-center font-heading text-[13px] shrink-0">
                              {initialsOf(u.fullName)}
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="font-extrabold text-foreground text-sm truncate">{u.fullName}</p>
                            <p className="text-[11.5px] text-foreground-subtle truncate">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4.5 py-4 whitespace-nowrap text-sm text-foreground font-semibold">
                        {ROLE_LABELS[u.role] || u.role}
                      </td>
                      <td className="px-4.5 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full shrink-0" style={{ background: verified ? '#22c55e' : '#f59e0b' }}></span>
                          <span className="text-sm font-medium text-foreground">{EKYC_LABELS[u.eKycStatus] || u.eKycStatus}</span>
                        </div>
                      </td>
                      <td className="px-4.5 py-4 whitespace-nowrap">
                        <span className="text-sm text-foreground-muted">
                          {u.createdAt ? new Date(u.createdAt).toLocaleDateString('vi-VN') : '—'}
                        </span>
                      </td>
                      <td className="px-4.5 py-4 whitespace-nowrap">
                        <span className={`label-mono px-2.5 py-1 rounded-[2px] ${u.isLocked ? 'bg-transparent text-danger border border-danger' : 'bg-ink text-paper'}`}>
                          {u.isLocked ? 'Đã khóa' : 'Hoạt động'}
                        </span>
                      </td>
                      <td className="px-4.5 py-4 whitespace-nowrap text-right">
                        {u.role === 'Admin' ? (
                          <span className="text-xs text-foreground-subtle italic">Không thể khóa Admin</span>
                        ) : (
                          <button
                            onClick={() => handleToggleLock(u)}
                            disabled={actingId === u.userId}
                            className={`inline-flex items-center gap-1.5 py-1.5 px-3.5 rounded-[2px] text-[11.5px] font-bold uppercase border-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                              u.isLocked
                                ? 'bg-ink text-paper border-ink hover:opacity-90'
                                : 'bg-transparent text-foreground border-border-strong hover:bg-surface-hover'
                            }`}
                          >
                            {actingId === u.userId ? (
                              <Loader2 size={14} className="animate-spin" />
                            ) : u.isLocked ? (
                              <Unlock size={14} />
                            ) : (
                              <Lock size={14} />
                            )}
                            {u.isLocked ? 'Mở khóa' : 'Khóa'}
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap justify-between items-center gap-3 py-4 px-5 border-t-2 border-border-strong">
            <span className="label-mono text-foreground-muted">
              {totalCount > 0
                ? `Trang ${page} / ${totalPages} · Tổng ${totalCount} người dùng`
                : 'Không có dữ liệu'}
            </span>
            <div className="flex gap-1.5 items-center">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page <= 1 || loading}
                className="px-3.5 h-8 border-2 border-border-strong bg-transparent rounded-[2px] text-[12px] font-bold text-foreground hover:bg-surface-hover disabled:opacity-40 disabled:cursor-not-allowed"
              >
                &lt; Trước
              </button>
              <span className="px-3.5 h-8 flex items-center justify-center rounded-[2px] text-[12px] bg-ink text-paper font-bold min-w-8">{page}</span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages || loading}
                className="px-3.5 h-8 border-2 border-border-strong bg-transparent rounded-[2px] text-[12px] font-bold text-foreground hover:bg-surface-hover disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Sau &gt;
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
