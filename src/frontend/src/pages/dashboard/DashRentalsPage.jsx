import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import ProSportDashLayout from '../../layouts/ProSportDashLayout'
import { equipmentApi } from '../../api/equipmentApi'
import { useToast } from '../../components/Toast'
import PageLoader from '../../components/ui/PageLoader'
import EmptyState from '../../components/ui/EmptyState'
import { Loader2 } from 'lucide-react'

export default function DashRentalsPage() {
  const { addToast } = useToast()
  const [rentals, setRentals] = useState([])
  const [loading, setLoading] = useState(true)
  const [acting, setActing] = useState(false)

  const load = useCallback(async () => {
    try {
      setLoading(true)
      const res = await equipmentApi.getRentals('Rented')
      if (res.statusCode === 200 && Array.isArray(res.data)) setRentals(res.data)
      else setRentals([])
    } catch (err) {
      addToast(typeof err === 'string' ? err : 'Không tải được phiên thuê.', 'error')
    } finally {
      setLoading(false)
    }
  }, [addToast])

  useEffect(() => { load() }, [load])

  async function handleReturn(detailId) {
    setActing(true)
    try {
      const res = await equipmentApi.returnRental(detailId, { returnCondition: 'Good' })
      if (res.statusCode === 200) {
        addToast('Đã nhận trả thiết bị.', 'success')
        load()
      } else {
        addToast(res.message || 'Trả thất bại.', 'error')
      }
    } catch (err) {
      addToast(typeof err === 'string' ? err : 'Trả thất bại.', 'error')
    } finally {
      setActing(false)
    }
  }

  return (
    <ProSportDashLayout>
      <div>
        <div className="flex flex-wrap items-end justify-between gap-5 mb-6">
          <div>
            <h1 className="font-heading text-3xl md:text-4xl uppercase tracking-tight text-foreground mb-2">Thuê thiết bị</h1>
            <p className="text-[13px] text-foreground-muted">Phiên cho thuê đang hoạt động tại quầy.</p>
          </div>
          <Link to="/elite/equipment" className="btn-outline text-xs no-underline">Quản lý chi tiết →</Link>
        </div>

        {loading && <PageLoader label="Đang tải..." />}

        {!loading && (
          rentals.length === 0 ? (
            <EmptyState icon="📦" title="Không có thiết bị đang cho thuê" />
          ) : (
            <div className="border-2 border-border-strong bg-surface divide-y divide-border-default rounded-[2px]">
              {rentals.map(r => (
                <div key={r.detailId} className="p-4.5 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-extrabold text-foreground">{r.equipmentName}</p>
                    <p className="font-mono text-[10.5px] text-foreground-subtle mt-1">
                      #{r.detailId} • SL {r.quantity} • {r.customerName || `User #${r.userId}`}
                    </p>
                    <p className="text-xs text-foreground-subtle mt-0.5">{new Date(r.rentedAt).toLocaleString('vi-VN')}</p>
                  </div>
                  <button
                    type="button"
                    disabled={acting}
                    onClick={() => handleReturn(r.detailId)}
                    className="btn-primary text-xs py-2.5 px-5 flex items-center gap-1.5 disabled:opacity-60"
                  >
                    {acting && <Loader2 size={14} className="animate-spin" />}
                    Nhận trả
                  </button>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </ProSportDashLayout>
  )
}
