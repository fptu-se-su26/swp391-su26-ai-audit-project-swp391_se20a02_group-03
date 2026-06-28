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

const ROLE_COLORS = {
  Admin: '#818cf8',
  Staff: '#0ea5e9',
  Customer: '#94a3b8',
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeRole, page])

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])

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
      <div className="space-y-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-1">Quản lý người dùng</h1>
            <p className="text-sm text-slate-500">Quản lý tài khoản, vai trò và trạng thái xác minh trên toàn hệ thống.</p>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <div className="flex flex-wrap gap-3 justify-between items-center p-5 border-b border-slate-200">
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-full py-2 px-4 w-80 focus-within:border-[#14B8A6]">
              <Search size={16} className="text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Tìm theo tên hoặc email..."
                className="border-none outline-none font-['Inter'] text-sm text-slate-900 w-full bg-transparent"
              />
            </div>
            <div className="flex gap-2">
              {ROLE_TABS.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => handleRoleChange(tab.key)}
                  className={`py-[6px] px-4 rounded-full border text-sm font-medium cursor-pointer transition-colors ${
                    activeRole === tab.key
                      ? 'border-[#e0f2fe] bg-[#e0f2fe] text-[#0284c7]'
                      : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Người dùng</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Vai trò</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Xác minh</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Ngày tạo</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Trạng thái</th>
                  <th className="px-5 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading && (
                  <tr>
                    <td colSpan={6} className="px-5 py-12 text-center text-slate-400">
                      <Loader2 className="inline animate-spin mr-2" size={18} /> Đang tải...
                    </td>
                  </tr>
                )}

                {!loading && error && (
                  <tr>
                    <td colSpan={6} className="px-5 py-12 text-center text-red-500">
                      <ShieldAlert className="inline mr-2" size={18} /> {error}
                    </td>
                  </tr>
                )}

                {!loading && !error && users.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-5 py-12 text-center text-slate-400">Không tìm thấy người dùng nào.</td>
                  </tr>
                )}

                {!loading && !error && users.map((u) => {
                  const roleColor = ROLE_COLORS[u.role] || '#94a3b8'
                  const verified = u.eKycStatus === 'Verified'
                  return (
                    <tr key={u.userId} className="hover:bg-slate-50/55 transition-colors">
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          {u.avatarUrl ? (
                            <img src={u.avatarUrl} alt={u.fullName} className="w-10 h-10 rounded-full object-cover" />
                          ) : (
                            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ background: roleColor }}>
                              {initialsOf(u.fullName)}
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-slate-900 text-sm">{u.fullName}</p>
                            <p className="text-xs text-slate-500">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className="inline-block py-1 px-3 rounded-full text-xs font-bold" style={{ background: roleColor + '20', color: roleColor === '#94a3b8' ? '#64748b' : roleColor }}>
                          {ROLE_LABELS[u.role] || u.role}
                        </span>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full" style={{ background: verified ? '#22c55e' : '#f59e0b' }}></span>
                          <span className="text-sm font-medium text-slate-900">{EKYC_LABELS[u.eKycStatus] || u.eKycStatus}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className="text-sm text-slate-500">
                          {u.createdAt ? new Date(u.createdAt).toLocaleDateString('vi-VN') : '—'}
                        </span>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className={`inline-block py-1 px-3 rounded-full text-xs font-bold ${u.isLocked ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                          {u.isLocked ? 'Đã khóa' : 'Hoạt động'}
                        </span>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap text-right">
                        {u.role === 'Admin' ? (
                          <span className="text-xs text-slate-400 italic">Không thể khóa Admin</span>
                        ) : (
                          <button
                            onClick={() => handleToggleLock(u)}
                            disabled={actingId === u.userId}
                            className={`inline-flex items-center gap-1.5 py-1.5 px-3 rounded-md text-xs font-semibold cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                              u.isLocked
                                ? 'bg-green-50 text-green-700 hover:bg-green-100'
                                : 'bg-red-50 text-red-600 hover:bg-red-100'
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

          <div className="flex justify-between items-center py-4 px-5 border-t border-slate-200 bg-white">
            <span className="text-sm text-slate-500">
              {totalCount > 0
                ? `Trang ${page} / ${totalPages} · Tổng ${totalCount} người dùng`
                : 'Không có dữ liệu'}
            </span>
            <div className="flex gap-1 items-center">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page <= 1 || loading}
                className="px-3 h-8 border border-slate-200 bg-white rounded text-sm text-slate-600 cursor-pointer hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                &lt; Trước
              </button>
              <span className="px-3 h-8 flex items-center justify-center rounded text-sm bg-slate-800 text-white font-semibold min-w-8">{page}</span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages || loading}
                className="px-3 h-8 border border-slate-200 bg-white rounded text-sm text-slate-600 cursor-pointer hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
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
