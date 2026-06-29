import { useState, useEffect, useCallback } from 'react'
import AdminLayout from '../../layouts/AdminLayout'
import { courtApi } from '../../api/courtApi'
import { useToast } from '../../components/Toast'
import { useConfirm } from '../../components/ui/ConfirmDialog'
import { Loader2, Trash2, Plus, ShieldAlert } from 'lucide-react'

function hhmm(timeStr) {
  // "17:00:00" -> "17:00"
  if (!timeStr) return '--:--'
  return String(timeStr).slice(0, 5)
}

export default function AdminPricingPage() {
  const { addToast } = useToast()
  const confirm = useConfirm()
  const [courts, setCourts] = useState([])
  const [selectedCourt, setSelectedCourt] = useState('')
  const [rules, setRules] = useState([])
  const [loadingCourts, setLoadingCourts] = useState(true)
  const [loadingRules, setLoadingRules] = useState(false)
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [form, setForm] = useState({ startTime: '05:00', endTime: '17:00', pricePerHour: '', isWeekend: false })

  // Tải danh sách sân.
  useEffect(() => {
    let active = true
    async function loadCourts() {
      try {
        setLoadingCourts(true)
        const res = await courtApi.getAll({ pageSize: 100 })
        if (!active) return
        if (res.statusCode === 200 && res.data) {
          const list = Array.isArray(res.data) ? res.data : (res.data.items || [])
          setCourts(list)
          if (list.length > 0) setSelectedCourt(String(list[0].courtId))
        } else {
          setError(res.message || 'Không tải được danh sách sân.')
        }
      } catch (err) {
        if (active) setError(typeof err === 'string' ? err : 'Không tải được danh sách sân.')
      } finally {
        if (active) setLoadingCourts(false)
      }
    }
    loadCourts()
    return () => { active = false }
  }, [])

  const fetchRules = useCallback(async (courtId) => {
    if (!courtId) return
    try {
      setLoadingRules(true)
      const res = await courtApi.getPricingRules(courtId)
      if (res.statusCode === 200) {
        setRules(Array.isArray(res.data) ? res.data : (res.data?.items || []))
      } else {
        setRules([])
      }
    } catch {
      setRules([])
    } finally {
      setLoadingRules(false)
    }
  }, [])

  useEffect(() => {
    if (selectedCourt) fetchRules(selectedCourt)
  }, [selectedCourt, fetchRules])

  async function handleAddRule(e) {
    e.preventDefault()
    if (!selectedCourt) return
    const price = Number(form.pricePerHour)
    if (!price || price <= 0) {
      addToast('Vui lòng nhập giá hợp lệ.', 'error')
      return
    }
    if (form.startTime >= form.endTime) {
      addToast('Giờ bắt đầu phải nhỏ hơn giờ kết thúc.', 'error')
      return
    }
    try {
      setSaving(true)
      const res = await courtApi.createPricingRule(selectedCourt, {
        startTime: `${form.startTime}:00`,
        endTime: `${form.endTime}:00`,
        pricePerHour: price,
        isWeekend: form.isWeekend,
      })
      if (res.statusCode === 200 || res.statusCode === 201) {
        addToast('Đã thêm khung giá.', 'success')
        setForm({ startTime: '05:00', endTime: '17:00', pricePerHour: '', isWeekend: false })
        fetchRules(selectedCourt)
      } else {
        addToast(res.message || 'Thêm khung giá thất bại.', 'error')
      }
    } catch (err) {
      addToast(typeof err === 'string' ? err : 'Thêm khung giá thất bại.', 'error')
    } finally {
      setSaving(false)
    }
  }

  async function handleDeleteRule(ruleId) {
    const ok = await confirm({
      title: 'Xóa khung giá',
      message: 'Xóa khung giá này?',
      confirmLabel: 'Xóa',
      cancelLabel: 'Hủy',
      variant: 'danger',
    })
    if (!ok) return
    try {
      setDeletingId(ruleId)
      const res = await courtApi.deletePricingRule(selectedCourt, ruleId)
      if (res.statusCode === 200 || res.statusCode === 204) {
        addToast('Đã xóa khung giá.', 'success')
        setRules(prev => prev.filter(r => r.pricingRuleId !== ruleId))
      } else {
        addToast(res.message || 'Xóa thất bại.', 'error')
      }
    } catch (err) {
      addToast(typeof err === 'string' ? err : 'Xóa thất bại.', 'error')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-2">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-1">Cấu hình Bảng giá Sân</h1>
            <p className="text-sm text-slate-500">Quản lý khung giờ và giá thuê theo từng sân.</p>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-slate-500">Sân:</label>
            <select
              value={selectedCourt}
              onChange={e => setSelectedCourt(e.target.value)}
              disabled={loadingCourts}
              className="border border-slate-200 rounded-md py-2 px-3 text-sm text-slate-900 outline-none bg-white min-w-56"
            >
              {loadingCourts && <option>Đang tải...</option>}
              {!loadingCourts && courts.length === 0 && <option value="">Không có sân</option>}
              {courts.map(c => (
                <option key={c.courtId} value={c.courtId}>{c.name} ({c.courtTypeName})</option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <div className="py-10 text-center text-red-500">
            <ShieldAlert className="inline mr-2" size={20} /> {error}
          </div>
        )}

        {!error && (
          <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-6">
            {/* Bảng khung giá hiện tại */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <h2 className="text-base font-bold text-slate-800 p-5 border-b border-slate-100">Khung giá hiện tại</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <tr>
                      <th className="px-5 py-3">Khung giờ</th>
                      <th className="px-5 py-3 text-right">Giá / giờ</th>
                      <th className="px-5 py-3 text-center">Cuối tuần</th>
                      <th className="px-5 py-3 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {loadingRules && (
                      <tr><td colSpan={4} className="px-5 py-10 text-center text-slate-400">
                        <Loader2 className="inline animate-spin mr-2" size={16} /> Đang tải...
                      </td></tr>
                    )}
                    {!loadingRules && rules.length === 0 && (
                      <tr><td colSpan={4} className="px-5 py-10 text-center text-slate-400">Chưa có khung giá nào cho sân này.</td></tr>
                    )}
                    {!loadingRules && rules.map(r => (
                      <tr key={r.pricingRuleId} className="hover:bg-slate-50">
                        <td className="px-5 py-3 font-medium text-slate-900">{hhmm(r.startTime)} – {hhmm(r.endTime)}</td>
                        <td className="px-5 py-3 text-right font-semibold text-slate-900">{Number(r.pricePerHour).toLocaleString('vi-VN')} ₫</td>
                        <td className="px-5 py-3 text-center">
                          {r.isWeekend
                            ? <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded text-xs font-bold">Cuối tuần</span>
                            : <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded text-xs font-medium">Ngày thường</span>}
                        </td>
                        <td className="px-5 py-3 text-right">
                          <button
                            onClick={() => handleDeleteRule(r.pricingRuleId)}
                            disabled={deletingId === r.pricingRuleId}
                            className="inline-flex items-center gap-1 text-red-600 hover:bg-red-50 px-2 py-1 rounded text-xs font-semibold disabled:opacity-50"
                          >
                            {deletingId === r.pricingRuleId ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Form thêm khung giá */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 h-fit">
              <h2 className="text-base font-bold text-slate-800 mb-5">Thêm khung giá mới</h2>
              <form onSubmit={handleAddRule} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Giờ bắt đầu</label>
                    <input type="time" value={form.startTime} onChange={e => setForm({ ...form, startTime: e.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-[#14B8A6]" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Giờ kết thúc</label>
                    <input type="time" value={form.endTime} onChange={e => setForm({ ...form, endTime: e.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-[#14B8A6]" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Giá mỗi giờ (VNĐ)</label>
                  <input type="number" min="0" step="1000" value={form.pricePerHour} onChange={e => setForm({ ...form, pricePerHour: e.target.value })} placeholder="VD: 120000" className="w-full border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-[#14B8A6]" />
                </div>
                <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                  <input type="checkbox" checked={form.isWeekend} onChange={e => setForm({ ...form, isWeekend: e.target.checked })} className="w-4 h-4 accent-[#14B8A6]" />
                  Áp dụng cho cuối tuần (T7, CN)
                </label>
                <button
                  type="submit"
                  disabled={saving || !selectedCourt}
                  className="w-full bg-[#14B8A6] text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-[#0b7373] flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {saving ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                  Thêm khung giá
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
