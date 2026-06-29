import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import ProSportDashLayout from '../../layouts/ProSportDashLayout'
import { equipmentApi } from '../../api/equipmentApi'
import { useToast } from '../../components/Toast'
import PageLoader from '../../components/ui/PageLoader'
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
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="dash-page-title">Thuê thiết bị</h1>
            <p className="dash-page-sub">Phiên cho thuê đang hoạt động tại quầy.</p>
          </div>
          <Link to="/elite/equipment" className="btn-outline text-sm no-underline px-4 py-2">Quản lý chi tiết →</Link>
        </div>

        {loading && <PageLoader label="Đang tải..." />}

        {!loading && (
          <div className="bg-white rounded-xl border-[1.5px] border-[#e0ecf0] divide-y divide-[#f0f5f9]">
            {rentals.length === 0 ? (
              <p className="p-8 text-center text-slate-400 text-sm">Không có thiết bị đang cho thuê.</p>
            ) : rentals.map(r => (
              <div key={r.detailId} className="p-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-bold text-foreground">{r.equipmentName}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    #{r.detailId} • SL {r.quantity} • {r.customerName || `User #${r.userId}`}
                  </p>
                  <p className="text-xs text-slate-400">{new Date(r.rentedAt).toLocaleString('vi-VN')}</p>
                </div>
                <button
                  type="button"
                  disabled={acting}
                  onClick={() => handleReturn(r.detailId)}
                  className="btn-primary text-sm py-2 px-4 flex items-center gap-1 disabled:opacity-60"
                >
                  {acting && <Loader2 size={14} className="animate-spin" />}
                  Nhận trả
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </ProSportDashLayout>
  )
}
