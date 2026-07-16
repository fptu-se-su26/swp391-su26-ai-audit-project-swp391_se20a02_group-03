import { useState, useEffect, useCallback } from 'react'
import AdminLayout from '../../layouts/AdminLayout'
import { courtApi } from '../../api/courtApi'
import { useToast } from '../../components/Toast'
import { useConfirm } from '../../components/ui/ConfirmDialog'
import { Loader2, Trash2, Plus } from 'lucide-react'
import {
  AdminPageHeader,
  AdminCard,
  AdminTable,
  AdminThead,
  AdminTh,
  AdminTd,
  AdminStatusBadge,
  AdminFormField,
  adminInputCls,
  AdminBtn,
  AdminTableLoader,
  AdminEmptyState,
  AdminErrorState,
} from '../../components/admin'

function hhmm(timeStr) {
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
      <AdminPageHeader
        title="Cấu hình bảng giá sân"
        description="Quản lý khung giờ và giá thuê theo từng sân."
        action={
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 w-full sm:w-auto mt-2 sm:mt-0">
            <label htmlFor="court-select" className="text-[11px] font-bold uppercase tracking-widest text-gray-400 shrink-0">
              Sân đang chọn
            </label>
            <select
              id="court-select"
              value={selectedCourt}
              onChange={e => setSelectedCourt(e.target.value)}
              disabled={loadingCourts}
              className="h-10 px-3.5 text-sm bg-white border border-gray-200 rounded-[8px] outline-none text-gray-800 focus:ring-2 focus:ring-teal-100 focus:border-teal-300 w-full sm:min-w-[220px] sm:w-auto cursor-pointer disabled:opacity-60 transition-all"
            >
              {loadingCourts && <option>Đang tải...</option>}
              {!loadingCourts && courts.length === 0 && <option value="">Không có sân</option>}
              {courts.map(c => (
                <option key={c.courtId} value={c.courtId}>{c.name} ({c.courtTypeName})</option>
              ))}
            </select>
          </div>
        }
      />

      {error && <AdminErrorState message={error} />}

      {!error && (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 items-start">
          {/* Rules table */}
          <AdminCard noPad>
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-heading text-base uppercase tracking-wide text-gray-800 m-0">
                Khung giá hiện tại
              </h2>
            </div>

            <AdminTable>
              <AdminThead>
                <AdminTh>Khung giờ</AdminTh>
                <AdminTh right>Giá / giờ</AdminTh>
                <AdminTh>Loại ngày</AdminTh>
                <AdminTh>Phạm vi</AdminTh>
                <AdminTh right></AdminTh>
              </AdminThead>

              {loadingRules && <AdminTableLoader cols={5} />}

              {!loadingRules && rules.length === 0 && (
                <tbody>
                  <tr>
                    <td colSpan={5}>
                      <AdminEmptyState message="Chưa có khung giá nào cho sân này." />
                    </td>
                  </tr>
                </tbody>
              )}

              {!loadingRules && rules.length > 0 && (
                <tbody className="divide-y divide-gray-50">
                  {rules.map(r => (
                    <tr key={r.pricingRuleId} className="hover:bg-gray-50/60 transition-colors">
                      <AdminTd>
                        <span className="font-mono font-bold text-gray-800 text-[13px]">
                          {hhmm(r.startTime)} – {hhmm(r.endTime)}
                        </span>
                      </AdminTd>
                      <AdminTd className="text-right">
                        <span className="font-bold text-gray-900">
                          {Number(r.pricePerHour).toLocaleString('vi-VN')} ₫
                        </span>
                      </AdminTd>
                      <AdminTd>
                        <AdminStatusBadge
                          label={r.isWeekend ? 'Cuối tuần' : 'Ngày thường'}
                          variant={r.isWeekend ? 'warning' : 'neutral'}
                        />
                      </AdminTd>
                      <AdminTd>
                        {r.courtId == null ? (
                          <AdminStatusBadge label="Theo loại sân" variant="info" />
                        ) : (
                          <AdminStatusBadge label="Sân cụ thể" variant="neutral" />
                        )}
                      </AdminTd>
                      <AdminTd className="text-right">
                        {r.courtId != null && (
                          <AdminBtn
                            variant="ghost"
                            icon={deletingId === r.pricingRuleId
                              ? <Loader2 size={13} className="animate-spin" />
                              : <Trash2 size={13} />
                            }
                            disabled={deletingId === r.pricingRuleId}
                            onClick={() => handleDeleteRule(r.pricingRuleId)}
                            className="!h-8 !px-2.5 text-red-500 hover:!bg-red-50 hover:!text-red-600"
                          >
                            Xóa
                          </AdminBtn>
                        )}
                      </AdminTd>
                    </tr>
                  ))}
                </tbody>
              )}
            </AdminTable>
          </AdminCard>

          {/* Add rule form */}
          <AdminCard>
            <h2 className="font-heading text-base uppercase tracking-wide text-gray-800 m-0 mb-6">
              Thêm khung giá mới
            </h2>
            <form onSubmit={handleAddRule} className="flex flex-col gap-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <AdminFormField label="Giờ bắt đầu" htmlFor="start-time">
                  <input
                    id="start-time"
                    type="time"
                    value={form.startTime}
                    onChange={e => setForm({ ...form, startTime: e.target.value })}
                    className={adminInputCls()}
                  />
                </AdminFormField>
                <AdminFormField label="Giờ kết thúc" htmlFor="end-time">
                  <input
                    id="end-time"
                    type="time"
                    value={form.endTime}
                    onChange={e => setForm({ ...form, endTime: e.target.value })}
                    className={adminInputCls()}
                  />
                </AdminFormField>
              </div>

              <AdminFormField label="Giá mỗi giờ (VNĐ)" htmlFor="price-per-hour" required>
                <input
                  id="price-per-hour"
                  type="number"
                  min="0"
                  step="1000"
                  value={form.pricePerHour}
                  onChange={e => setForm({ ...form, pricePerHour: e.target.value })}
                  placeholder="VD: 120000"
                  className={adminInputCls()}
                />
              </AdminFormField>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isWeekend}
                  onChange={e => setForm({ ...form, isWeekend: e.target.checked })}
                  className="w-4 h-4 rounded accent-[#14b8a6]"
                />
                <span className="text-sm text-gray-700">Áp dụng cho cuối tuần (T7, CN)</span>
              </label>

              <AdminBtn
                type="submit"
                variant="primary"
                disabled={saving || !selectedCourt}
                loading={saving}
                icon={<Plus size={14} />}
                className="w-full justify-center"
              >
                Thêm khung giá
              </AdminBtn>
            </form>
          </AdminCard>
        </div>
      )}
    </AdminLayout>
  )
}
