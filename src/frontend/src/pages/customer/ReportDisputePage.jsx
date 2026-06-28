import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { reportApi } from '../../api/reportApi'
import { useToast } from '../../components/Toast'
import { Loader2 } from 'lucide-react'

const REASONS = [
  'Người chơi bùng kèo (Không đến)',
  'Host hủy kèo không báo trước',
  'Người chơi có hành vi thiếu văn hóa',
]

export default function ReportDisputePage() {
  const navigate = useNavigate()
  const { addToast } = useToast()
  const [matchId, setMatchId] = useState('')
  const [reportedUserId, setReportedUserId] = useState('')
  const [reason, setReason] = useState(REASONS[0])
  const [evidence, setEvidence] = useState('')
  const [detail, setDetail] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!matchId || !reportedUserId) {
      addToast('Vui lòng nhập mã kèo và mã người chơi bị báo cáo.', 'error')
      return
    }
    try {
      setSubmitting(true)
      const fullReason = detail.trim() ? `${reason} — ${detail.trim()}` : reason
      const res = await reportApi.createReport({
        matchId: Number(matchId),
        reportedUserId: Number(reportedUserId),
        reason: fullReason.slice(0, 1000),
        evidence: evidence.trim() || null,
      })
      if (res.statusCode === 201 || res.statusCode === 200) {
        addToast('Đã gửi báo cáo. Quản trị viên sẽ xử lý sớm.', 'success')
        navigate('/customer/bookings')
      } else {
        addToast(res.message || 'Gửi báo cáo thất bại.', 'error')
      }
    } catch (err) {
      addToast(typeof err === 'string' ? err : 'Gửi báo cáo thất bại.', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#f5f9fb]">
      <Navbar theme="light" />

      <div className="max-w-[700px] mx-auto px-6 pt-[90px] pb-20 w-full flex-1">
        <div className="mb-8">
          <Link to="/customer/bookings" className="text-slate-400 text-sm hover:text-[#14B8A6] mb-2 inline-block flex items-center gap-1">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            Quay lại
          </Link>
          <h1 className="font-['Oswald'] text-3xl font-bold text-slate-900 mb-2">Báo cáo vi phạm / Bùng kèo</h1>
          <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex gap-3">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" className="shrink-0 mt-0.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            <p className="text-sm text-red-800 leading-relaxed">
              Mọi báo cáo sai sự thật sẽ dẫn đến việc <b>khóa tài khoản vĩnh viễn</b>. Quản trị viên sẽ liên hệ Nhân viên (Staff) trực sân để đối chứng hình ảnh thực tế.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Mã kèo liên quan</label>
                <input
                  type="number"
                  value={matchId}
                  onChange={e => setMatchId(e.target.value)}
                  placeholder="VD: 12"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-[#14B8A6]"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Mã người chơi bị báo cáo</label>
                <input
                  type="number"
                  value={reportedUserId}
                  onChange={e => setReportedUserId(e.target.value)}
                  placeholder="VD: 8"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-[#14B8A6]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Lý do báo cáo</label>
              <div className="grid grid-cols-1 gap-3">
                {REASONS.map(r => (
                  <label key={r} className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer hover:border-[#14B8A6] ${reason === r ? 'border-[#14B8A6] bg-[#14B8A6]/5' : 'border-slate-200'}`}>
                    <input type="radio" name="reason" className="accent-[#14B8A6]" checked={reason === r} onChange={() => setReason(r)} />
                    <span className="text-sm font-medium text-slate-700">{r}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Link bằng chứng (Tùy chọn)</label>
              <input
                type="text"
                value={evidence}
                onChange={e => setEvidence(e.target.value)}
                placeholder="Dán link ảnh chụp màn hình tin nhắn..."
                className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-[#14B8A6]"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Mô tả chi tiết sự việc</label>
              <textarea
                rows="4"
                value={detail}
                onChange={e => setDetail(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-[#14B8A6] resize-none"
                placeholder="Vui lòng cung cấp chi tiết thời gian và sự việc..."
              ></textarea>
            </div>

            <button type="submit" disabled={submitting} className="w-full bg-slate-900 text-white font-bold py-3.5 rounded-xl hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-60">
              {submitting && <Loader2 size={18} className="animate-spin" />} Gửi Báo Cáo Yêu Cầu Xử Lý
            </button>
          </form>
        </div>
      </div>

      <Footer variant="light" />
    </div>
  )
}
