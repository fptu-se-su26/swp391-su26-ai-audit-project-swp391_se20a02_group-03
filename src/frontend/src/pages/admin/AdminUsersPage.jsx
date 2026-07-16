import { useState, useEffect, useCallback, useRef } from 'react'
import AdminLayout from '../../layouts/AdminLayout'
import { userApi } from '../../api/userApi'
import { useToast } from '../../components/Toast'
import { Lock, Unlock, Loader2 } from 'lucide-react'
import { useConfirm } from '../../components/ui/ConfirmDialog'
import {
  AdminPageHeader,
  AdminCard,
  AdminToolbar,
  AdminSearchInput,
  AdminFilterPills,
  AdminTable,
  AdminThead,
  AdminTh,
  AdminTd,
  AdminStatusBadge,
  AdminPagination,
  AdminTableLoader,
  AdminEmptyState,
  AdminErrorState,
  AdminBtn,
} from '../../components/admin'

const ROLE_TABS = [
  { key: '', label: 'Tất cả' },
  { key: 'Admin', label: 'Quản trị viên' },
  { key: 'Staff', label: 'Nhân sự' },
  { key: 'Customer', label: 'Khách hàng' },
  { key: 'CourtOwner', label: 'Đối tác' },
]

const ROLE_LABELS = {
  Admin: 'Quản trị viên',
  Staff: 'Nhân sự',
  Customer: 'Khách hàng',
  CourtOwner: 'Đối tác',
}

const EKYC_LABELS = {
  Verified: 'Đã xác minh',
  Pending: 'Chờ xác minh',
  Rejected: 'Từ chối',
  NotSubmitted: 'Chưa nộp',
  Unverified: 'Chưa xác minh',
}

const EKYC_VARIANT = {
  Verified: 'success',
  Pending: 'warning',
  Rejected: 'danger',
  NotSubmitted: 'neutral',
  Unverified: 'neutral',
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
  const confirm = useConfirm()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [activeRole, setActiveRole] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [actingId, setActingId] = useState(null)

  const [debouncedSearch, setDebouncedSearch] = useState('')
  const activeRequestRef = useRef(null)

  const fetchUsers = useCallback(async (opts = {}) => {
    const { search: s = debouncedSearch, role = activeRole, page: p = page } = opts

    if (activeRequestRef.current) {
      activeRequestRef.current.abort()
    }
    const controller = new AbortController()
    activeRequestRef.current = controller

    try {
      setLoading(true)
      setError(null)
      const res = await userApi.getUsers(
        { search: s, role, page: p, pageSize: PAGE_SIZE },
        { signal: controller.signal }
      )
      if (res.statusCode === 200 && res.data) {
        setUsers(res.data.items || [])
        setTotalPages(res.data.totalPages || 1)
        setTotalCount(res.data.totalCount || 0)
      } else {
        setUsers([])
        setError(res.message || 'Không tải được danh sách người dùng.')
      }
    } catch (err) {
      if (controller.signal.aborted || err === 'canceled' || err?.name === 'CanceledError' || err?.message === 'canceled') {
        return // Ignore abort errors
      }
      setUsers([])
      setError(typeof err === 'string' ? err : 'Không tải được danh sách người dùng.')
    } finally {
      if (activeRequestRef.current === controller) {
        setLoading(false)
        activeRequestRef.current = null
      }
    }
  }, [debouncedSearch, activeRole, page])

  useEffect(() => {
    fetchUsers({ search: debouncedSearch, role: activeRole, page })
    return () => activeRequestRef.current?.abort()
  }, [debouncedSearch, activeRole, page, fetchUsers])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (search !== debouncedSearch) {
        setDebouncedSearch(search)
        setPage(1)
      }
    }, 400)
    return () => clearTimeout(timer)
  }, [search, debouncedSearch])

  async function handleToggleLock(user) {
    const actionName = user.isLocked ? 'mở khóa' : 'khóa'
    const isOk = await confirm({
      title: `${user.isLocked ? 'Mở khóa' : 'Khóa'} tài khoản`,
      message: `Bạn có chắc chắn muốn ${actionName} tài khoản ${user.email} không?`,
      confirmLabel: user.isLocked ? 'Mở khóa' : 'Khóa',
      variant: user.isLocked ? 'primary' : 'danger',
    })

    if (!isOk) return

    try {
      setActingId(user.userId)
      const res = user.isLocked
        ? await userApi.unlockUser(user.userId)
        : await userApi.lockUser(user.userId)
      if (res.statusCode === 200) {
        addToast(res.message || 'Cập nhật trạng thái thành công.', 'success')
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
      <AdminPageHeader
        title="Quản lý người dùng"
        description="Quản lý tài khoản, vai trò và trạng thái xác minh trên toàn hệ thống."
      />

      <AdminToolbar>
        <AdminSearchInput
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Tìm theo tên hoặc email..."
          className="flex-1 max-w-[360px]"
        />
        <AdminFilterPills
          tabs={ROLE_TABS}
          activeKey={activeRole}
          onChange={handleRoleChange}
        />
      </AdminToolbar>

      <AdminCard noPad>
        <AdminTable>
          <AdminThead>
            <AdminTh>Người dùng</AdminTh>
            <AdminTh>Vai trò</AdminTh>
            <AdminTh>Xác minh KYC</AdminTh>
            <AdminTh>Ngày tạo</AdminTh>
            <AdminTh>Trạng thái</AdminTh>
            <AdminTh right>Thao tác</AdminTh>
          </AdminThead>

          {loading && <AdminTableLoader cols={6} />}

          {!loading && error && (
            <tbody>
              <tr>
                <td colSpan={6}>
                  <AdminErrorState message={error} onRetry={() => fetchUsers()} />
                </td>
              </tr>
            </tbody>
          )}

          {!loading && !error && users.length === 0 && (
            <tbody>
              <tr>
                <td colSpan={6}>
                  <AdminEmptyState
                    message={search ? 'Không tìm thấy người dùng nào phù hợp.' : 'Chưa có người dùng nào.'}
                    isSearch={!!search}
                  />
                </td>
              </tr>
            </tbody>
          )}

          {!loading && !error && users.length > 0 && (
            <tbody className="divide-y divide-gray-50">
              {users.map(u => {
                const ekycVariant = EKYC_VARIANT[u.eKycStatus] || 'neutral'
                return (
                  <tr key={u.userId} className="hover:bg-gray-50/60 transition-colors">
                    <AdminTd>
                      <div className="flex items-center gap-3">
                        {u.avatarUrl ? (
                          <img
                            src={u.avatarUrl}
                            alt={u.fullName}
                            className="w-9 h-9 rounded-full object-cover shrink-0 ring-1 ring-gray-100"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-teal-50 text-teal-700 flex items-center justify-center text-[13px] font-bold shrink-0">
                            {initialsOf(u.fullName)}
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 text-sm truncate m-0">{u.fullName}</p>
                          <p className="text-[11px] text-gray-400 truncate m-0">{u.email}</p>
                        </div>
                      </div>
                    </AdminTd>
                    <AdminTd>
                      <span className="text-sm font-medium text-gray-700">
                        {ROLE_LABELS[u.role] || u.role}
                      </span>
                    </AdminTd>
                    <AdminTd>
                      <AdminStatusBadge
                        label={EKYC_LABELS[u.eKycStatus] || u.eKycStatus}
                        variant={ekycVariant}
                      />
                    </AdminTd>
                    <AdminTd>
                      <span className="text-sm text-gray-500">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString('vi-VN') : '—'}
                      </span>
                    </AdminTd>
                    <AdminTd>
                      <AdminStatusBadge
                        label={u.isLocked ? 'Đã khóa' : 'Hoạt động'}
                        variant={u.isLocked ? 'danger' : 'success'}
                      />
                    </AdminTd>
                    <AdminTd className="text-right">
                      {u.role === 'Admin' ? (
                        <span className="text-xs text-gray-400 italic">Không khóa Admin</span>
                      ) : (
                        <AdminBtn
                          onClick={() => handleToggleLock(u)}
                          disabled={actingId === u.userId}
                          loading={actingId === u.userId}
                          variant={u.isLocked ? 'primary' : 'secondary'}
                          icon={u.isLocked ? <Unlock size={13} /> : <Lock size={13} />}
                        >
                          {u.isLocked ? 'Mở khóa' : 'Khóa'}
                        </AdminBtn>
                      )}
                    </AdminTd>
                  </tr>
                )
              })}
            </tbody>
          )}
        </AdminTable>

        {!loading && !error && (
          <div className="px-6 pb-4">
            <AdminPagination
              page={page}
              totalPages={totalPages}
              totalCount={totalCount}
              onPrev={() => setPage(p => Math.max(1, p - 1))}
              onNext={() => setPage(p => Math.min(totalPages, p + 1))}
              loading={loading}
              noun="người dùng"
            />
          </div>
        )}
      </AdminCard>
    </AdminLayout>
  )
}
