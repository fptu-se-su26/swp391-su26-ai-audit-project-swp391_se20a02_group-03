import { useEffect, useState } from 'react'
import EliteLayout from '../../layouts/EliteLayout'
import { equipmentApi } from '../../api/equipmentApi'

const conditionOptions = [
  { value: 'Good', label: 'Tốt — hoàn full cọc' },
  { value: 'Damaged', label: 'Hư hỏng — trừ phí từ cọc' },
  { value: 'Lost', label: 'Mất — trừ cọc + phí bồi thường' },
]

export default function EliteEquipmentPage() {
  const [pendingReturns, setPendingReturns] = useState([])
  const [selected, setSelected] = useState(null)
  const [condition, setCondition] = useState('Good')
  const [damageNote, setDamageNote] = useState('')
  const [damageFee, setDamageFee] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchPendingReturns()
  }, [])

  const fetchPendingReturns = async () => {
    try {
      setLoading(true)
      const response = await equipmentApi.getPendingReturns()
      if (response.statusCode === 200) {
        setPendingReturns(response.data || [])
        if (response.data?.length > 0 && !selected) {
          setSelected(response.data[0])
        }
      }
    } catch (error) {
      console.error('Error fetching pending returns:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInspect = async () => {
    if (!selected) return

    try {
      setSubmitting(true)
      const payload = {
        condition,
        damageNote: damageNote || null,
        damageFee: condition === 'Damaged' ? Number(damageFee || 0) : null,
      }

      const response = await equipmentApi.inspectReturn(selected.equipmentRentalId, payload)
      if (response.statusCode === 200) {
        alert('Đã xử lý kiểm định và cọc thành công.')
        setSelected(null)
        setCondition('Good')
        setDamageNote('')
        setDamageFee('')
        fetchPendingReturns()
      } else {
        alert(response.message || 'Không thể xử lý kiểm định.')
      }
    } catch (error) {
      console.error('Inspect error:', error)
      alert('Lỗi kết nối server hoặc bạn chưa đăng nhập với quyền Staff/Admin.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <EliteLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-1">Kiểm định Dụng cụ & Phụ thu</h1>
            <p className="text-sm text-slate-500">Ghi nhận tình trạng thiết bị trả lại và xử lý tiền cọc.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-lg font-bold text-slate-800 mb-4">Chờ kiểm định ({pendingReturns.length})</h2>
            {loading ? (
              <p className="text-sm text-slate-400">Đang tải...</p>
            ) : pendingReturns.length === 0 ? (
              <p className="text-sm text-slate-400">Không có đơn trả đồ chờ kiểm định.</p>
            ) : (
              <div className="space-y-4">
                {pendingReturns.map(item => (
                  <button
                    key={item.equipmentRentalId}
                    type="button"
                    onClick={() => setSelected(item)}
                    className={`w-full text-left border rounded-lg p-4 transition-colors ${selected?.equipmentRentalId === item.equipmentRentalId ? 'border-[#00c2ff] bg-sky-50' : 'border-slate-200 hover:border-slate-300'}`}
                  >
                    <div className="flex justify-between mb-2">
                      <span className="font-bold text-slate-900">Mã đơn: R-{String(item.equipmentRentalId).padStart(3, '0')}</span>
                      <span className="text-xs font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">CHỜ KIỂM ĐỊNH</span>
                    </div>
                    <p className="text-sm text-slate-600">{item.equipmentName} × {item.quantity}</p>
                    <p className="text-xs text-slate-500 mt-2">Cọc: {Number(item.depositAmount).toLocaleString('vi-VN')} VND</p>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-lg font-bold text-slate-800 mb-4">
              {selected ? `Xử lý trả đồ (R-${String(selected.equipmentRentalId).padStart(3, '0')})` : 'Chọn đơn để kiểm định'}
            </h2>

            {selected ? (
              <div className="space-y-4">
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-sm space-y-2">
                  <p><strong>Thiết bị:</strong> {selected.equipmentName}</p>
                  <p><strong>Số lượng:</strong> {selected.quantity}</p>
                  <p><strong>Tiền thuê:</strong> {Number(selected.totalPrice).toLocaleString('vi-VN')} VND</p>
                  <p><strong>Tiền cọc:</strong> {Number(selected.depositAmount).toLocaleString('vi-VN')} VND</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Tình trạng trả đồ</label>
                  <select
                    value={condition}
                    onChange={e => setCondition(e.target.value)}
                    className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm outline-none"
                  >
                    {conditionOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                {condition === 'Damaged' && (
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Phí hư hỏng (VND)</label>
                    <input
                      type="number"
                      min="0"
                      max={selected.depositAmount}
                      value={damageFee}
                      onChange={e => setDamageFee(e.target.value)}
                      className="w-full border border-amber-300 rounded-md px-3 py-2 text-sm outline-none"
                      placeholder="Nhập phí trừ từ cọc"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Ghi chú</label>
                  <textarea
                    value={damageNote}
                    onChange={e => setDamageNote(e.target.value)}
                    rows={3}
                    className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm outline-none"
                    placeholder="Mô tả tình trạng thiết bị..."
                  />
                </div>

                <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg text-sm text-amber-900">
                  {condition === 'Good' && 'Hoàn lại toàn bộ tiền cọc cho khách.'}
                  {condition === 'Damaged' && 'Trừ phí hư hỏng từ tiền cọc, hoàn phần còn lại.'}
                  {condition === 'Lost' && 'Trừ toàn bộ cọc. Nếu giá trị thiết bị cao hơn cọc, tính thêm phí bồi thường.'}
                </div>

                <button
                  onClick={handleInspect}
                  disabled={submitting}
                  className="w-full bg-[#00c2ff] text-white font-semibold py-2 rounded-md hover:bg-[#00ace6] disabled:opacity-60"
                >
                  {submitting ? 'Đang xử lý...' : 'Xác nhận kiểm định & xử lý cọc'}
                </button>
              </div>
            ) : (
              <p className="text-sm text-slate-400">Chọn một đơn ở danh sách bên trái để bắt đầu kiểm định.</p>
            )}
          </div>
        </div>
      </div>
    </EliteLayout>
  )
}
