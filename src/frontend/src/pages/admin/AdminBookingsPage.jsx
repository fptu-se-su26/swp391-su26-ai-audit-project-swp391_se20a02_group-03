import { useState, useEffect, useMemo } from 'react'
import AdminLayout from '../../layouts/AdminLayout'
import { bookingApi } from '../../api/bookingApi'
import { useToast } from '../../components/Toast'
import { CalendarDays } from 'lucide-react'
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
  AdminTableLoader,
  AdminEmptyState,
  AdminErrorState,
} from '../../components/admin'

const STATUS_TABS = [
  { key: '', label: 'Tất cả' },
  { key: 'Pending', label: 'Chờ xử lý' },
  { key: 'Confirmed', label: 'Đã xác nhận' },
  { key: 'Completed', label: 'Hoàn thành' },
  { key: 'Cancelled', label: 'Đã hủy' },
]

const STATUS_VARIANT = {
  Pending: 'warning',
  Confirmed: 'success',
  Completed: 'info',
  Cancelled: 'danger',
}

const PAYMENT_VARIANT = {
  Paid: 'success',
  Pending: 'warning',
  Unpaid: 'danger',
  Refunded: 'neutral',
}

const PAYMENT_LABEL = {
  Paid: 'Đã thanh toán',
  Pending: 'Chờ TT',
  Unpaid: 'Chưa TT',
  Refunded: 'Đã hoàn tiền',
}

const STATUS_LABEL = {
  Pending: 'Chờ xử lý',
  Confirmed: 'Đã xác nhận',
  Completed: 'Hoàn thành',
  Cancelled: 'Đã hủy',
}

function fmtTime(t) {
  return t ? String(t).slice(0, 5) : ''
}

export default function AdminBookingsPage() {
  const { addToast } = useToast()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  useEffect(() => {
    let active = true
    async function load() {
      try {
        setLoading(true)
        setError(null)
        const res = await bookingApi.getAllBookings()
        if (!active) return
        if (res.statusCode === 200 && Array.isArray(res.data)) {
          setBookings(res.data)
        } else {
          setError(res.message || 'Không tải được danh sách đặt sân.')
        }
      } catch (err) {
        if (active) setError(typeof err === 'string' ? err : 'Không tải được danh sách đặt sân.')
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => { active = false }
  }, [])

  const stats = useMemo(() => ({
    active: bookings.filter(b => b.status === 'Pending' || b.status === 'Confirmed').length,
    pendingPay: bookings.filter(b => b.paymentStatus === 'Pending').length,
    total: bookings.length,
  }), [bookings])

  const filtered = useMemo(() => {
    return bookings.filter(b => {
      if (statusFilter && b.status !== statusFilter) return false
      const q = search.trim().toLowerCase()
      if (!q) return true
      const court = b.details?.[0]?.courtName?.toLowerCase() || ''
      const customer = b.customerName?.toLowerCase() || ''
      return String(b.bookingId).includes(q) || court.includes(q) || customer.includes(q) || String(b.userId).includes(q)
    })
  }, [bookings, search, statusFilter])

  return (
    <AdminLayout>
      <AdminPageHeader
        title="Quản lý đặt sân"
        description="Theo dõi toàn bộ lượt đặt sân, thanh toán và trạng thái."
      />

      {/* Summary stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Đang hoạt động', value: stats.active, variant: 'teal' },
          { label: 'Tổng lượt đặt', value: stats.total, variant: 'gray' },
          { label: 'Chờ thanh toán', value: stats.pendingPay, variant: 'orange' },
        ].map(card => (
          <AdminCard key={card.label} className="flex flex-col gap-1 hover:shadow-md transition-shadow">
            <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 m-0">{card.label}</p>
            <p className={`font-heading text-3xl m-0 ${card.variant === 'teal' ? 'text-[#14b8a6]' : card.variant === 'orange' ? 'text-orange-500' : 'text-gray-900'}`}>
              {card.value}
            </p>
          </AdminCard>
        ))}
      </div>

      <AdminToolbar>
        <AdminSearchInput
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Tìm mã đặt / sân / khách hàng..."
          className="flex-1 max-w-[380px]"
        />
        <AdminFilterPills
          tabs={STATUS_TABS}
          activeKey={statusFilter}
          onChange={setStatusFilter}
        />
      </AdminToolbar>

      <AdminCard noPad>
        <AdminTable>
          <AdminThead>
            <AdminTh>Mã đặt</AdminTh>
            <AdminTh>Khách hàng</AdminTh>
            <AdminTh>Sân</AdminTh>
            <AdminTh>Ngày & Giờ</AdminTh>
            <AdminTh right>Tổng tiền</AdminTh>
            <AdminTh>Thanh toán</AdminTh>
            <AdminTh>Trạng thái</AdminTh>
          </AdminThead>

          {loading && <AdminTableLoader cols={7} />}

          {!loading && error && (
            <tbody>
              <tr>
                <td colSpan={7}>
                  <AdminErrorState message={error} />
                </td>
              </tr>
            </tbody>
          )}

          {!loading && !error && filtered.length === 0 && (
            <tbody>
              <tr>
                <td colSpan={7}>
                  <AdminEmptyState
                    message={search || statusFilter ? 'Không tìm thấy lượt đặt nào phù hợp.' : 'Chưa có lượt đặt sân nào.'}
                    isSearch={!!(search || statusFilter)}
                  />
                </td>
              </tr>
            </tbody>
          )}

          {!loading && !error && filtered.length > 0 && (
            <tbody className="divide-y divide-gray-50">
              {filtered.map(b => {
                const d = b.details?.[0]
                return (
                  <tr key={b.bookingId} className="hover:bg-gray-50/60 transition-colors">
                    <AdminTd>
                      <span className="font-mono font-bold text-gray-800 text-[13px]">
                        #BKG-{b.bookingId}
                      </span>
                    </AdminTd>
                    <AdminTd>
                      <span className="text-sm text-gray-700">
                        {b.customerName || `Người dùng #${b.userId}`}
                      </span>
                    </AdminTd>
                    <AdminTd>
                      <span className="text-sm font-semibold text-gray-800">
                        {d?.courtName || '—'}
                      </span>
                    </AdminTd>
                    <AdminTd>
                      {d ? (
                        <div>
                          <p className="flex items-center gap-1.5 text-sm font-semibold text-gray-800 m-0">
                            <CalendarDays size={13} className="text-gray-400 shrink-0" />
                            {new Date(d.bookingDate).toLocaleDateString('vi-VN')}
                          </p>
                          <p className="text-[12px] text-gray-400 m-0 mt-0.5">
                            {fmtTime(d.startTime)} – {fmtTime(d.endTime)}
                          </p>
                        </div>
                      ) : '—'}
                    </AdminTd>
                    <AdminTd className="text-right">
                      <span className="font-bold text-gray-900 text-[13px]">
                        {Number(b.totalAmount).toLocaleString('vi-VN')} ₫
                      </span>
                    </AdminTd>
                    <AdminTd>
                      <AdminStatusBadge
                        label={PAYMENT_LABEL[b.paymentStatus] || b.paymentStatus || 'Chưa TT'}
                        variant={PAYMENT_VARIANT[b.paymentStatus] || 'neutral'}
                      />
                    </AdminTd>
                    <AdminTd>
                      <AdminStatusBadge
                        label={STATUS_LABEL[b.status] || b.status}
                        variant={STATUS_VARIANT[b.status] || 'neutral'}
                      />
                    </AdminTd>
                  </tr>
                )
              })}
            </tbody>
          )}
        </AdminTable>

        {!loading && !error && (
          <div className="px-5 py-3 border-t border-gray-50">
            <p className="text-[12px] text-gray-400 m-0">
              Hiển thị <span className="font-semibold text-gray-600">{filtered.length}</span> / {bookings.length} lượt đặt
            </p>
          </div>
        )}
      </AdminCard>
    </AdminLayout>
  )
}
