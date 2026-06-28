import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import EliteLayout from '../../layouts/EliteLayout'
import { courtApi } from '../../api/courtApi'
import PageLoader from '../../components/ui/PageLoader'
import EmptyState from '../../components/ui/EmptyState'
import { useToast } from '../../components/Toast'

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600&q=80'

export default function ElitePosWalkInPage() {
  const { addToast } = useToast()
  const [courts, setCourts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedCourtId, setSelectedCourtId] = useState(null)

  useEffect(() => {
    courtApi.getAll({ pageSize: 24, status: 'Available' })
      .then(res => {
        if (res.statusCode === 200 && res.data) {
          const list = Array.isArray(res.data) ? res.data : (res.data.items || [])
          setCourts(list)
          if (list.length) setSelectedCourtId(list[0].courtId)
        } else {
          setError(res.message || 'Không tải được danh sách sân.')
        }
      })
      .catch(err => setError(typeof err === 'string' ? err : 'Không tải được danh sách sân.'))
      .finally(() => setLoading(false))
  }, [])

  function handleBook(courtName) {
    addToast(`Đã ghi nhận đặt trực tiếp tại quầy cho ${courtName}. Hoàn tất thanh toán tại quầy.`, 'success')
  }

  if (loading) {
    return (
      <EliteLayout>
        <PageLoader message="Đang tải sân..." />
      </EliteLayout>
    )
  }

  return (
    <EliteLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-1">Đặt sân trực tiếp tại quầy</h1>
            <p className="text-sm text-slate-500">Chọn sân trống và hoàn tất thanh toán ngay tại quầy.</p>
          </div>
          <Link to="/elite/scanner" className="text-sm font-semibold text-[#5E6AD2] no-underline hover:underline">Quét QR vào sân →</Link>
        </div>

        {error ? (
          <div className="bg-white rounded-xl border border-red-200 p-8 text-center">
            <p className="text-red-500 font-medium">{error}</p>
          </div>
        ) : courts.length === 0 ? (
          <EmptyState title="Không có sân trống" subtitle="Tất cả sân đang được sử dụng hoặc bảo trì." />
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6 items-start">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {courts.map(court => {
                const selected = selectedCourtId === court.courtId
                return (
                  <button
                    key={court.courtId}
                    type="button"
                    onClick={() => setSelectedCourtId(court.courtId)}
                    className={`text-left bg-white rounded-xl border-2 p-4 transition-all cursor-pointer ${selected ? 'border-[#5E6AD2] shadow-[0_4px_12px_rgba(94,106,210,0.15)]' : 'border-slate-200 hover:border-slate-300'}`}
                  >
                    <img src={court.imageUrl || FALLBACK_IMG} alt={court.name} className="w-full h-28 object-cover rounded-lg mb-3" />
                    <h3 className="text-base font-bold text-slate-800">{court.name}</h3>
                    <p className="text-xs text-slate-500 mt-1">{court.location || court.type || 'Trong nhà'}</p>
                    <span className={`inline-block mt-3 text-[0.65rem] font-bold px-2 py-1 rounded ${selected ? 'bg-[#5E6AD2] text-white' : 'bg-green-100 text-green-700'}`}>
                      {selected ? 'ĐANG CHỌN' : 'TRỐNG'}
                    </span>
                  </button>
                )
              })}
            </div>

            <aside className="bg-white rounded-xl border border-slate-200 p-6 sticky top-24">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Thanh toán nhanh</h2>
              {(() => {
                const court = courts.find(c => c.courtId === selectedCourtId) || courts[0]
                const price = court.basePrice ?? court.hourlyRate ?? 150000
                return (
                  <>
                    <p className="text-sm text-slate-600 mb-1">Sân đã chọn</p>
                    <p className="font-semibold text-slate-900 mb-4">{court.name}</p>
                    <div className="flex justify-between items-center py-3 border-t border-slate-100">
                      <span className="text-sm text-slate-500">Giá 90 phút</span>
                      <span className="text-lg font-bold text-[#5E6AD2]">{Number(price).toLocaleString('vi-VN')}đ</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleBook(court.name)}
                      className="w-full mt-4 bg-[#5E6AD2] hover:bg-[#4e5bc4] text-white border-none rounded-lg py-3 font-semibold cursor-pointer transition-colors"
                    >
                      Xác nhận đặt tại quầy
                    </button>
                  </>
                )
              })()}
            </aside>
          </div>
        )}
      </div>
    </EliteLayout>
  )
}
