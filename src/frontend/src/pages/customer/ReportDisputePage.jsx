import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { reportApi } from '../../api/reportApi'
import { useToast } from '../../components/Toast'
import { ArrowLeft, AlertTriangle, Loader2 } from 'lucide-react'

const REASONS = [
  'Người chơi bùng kèo (Không đến)',
  'Chủ kèo hủy kèo không báo trước',
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
    <div className="flex flex-col min-h-screen bg-background-base">
      <Navbar theme="light" />

      <div className="max-w-[700px] mx-auto px-6 pt-[100px] sm:pt-[130px] pb-20 w-full flex-1">
        <div className="mb-8">
          <Link to="/customer/bookings" className="label-mono text-foreground-subtle hover:text-accent mb-4 inline-flex items-center gap-1.5">
            <ArrowLeft size={16} />
            Quay lại
          </Link>
          <h1 className="font-heading text-3xl uppercase tracking-tight text-foreground mb-4">Báo cáo vi phạm / Bùng kèo</h1>
          <div className="border-2 border-danger bg-danger-bg p-4 flex gap-3">
            <AlertTriangle size={20} className="text-danger shrink-0 mt-0.5" />
            <p className="text-sm text-danger leading-relaxed">
              Mọi báo cáo sai sự thật sẽ dẫn đến việc <b>khóa tài khoản vĩnh viễn</b>. Quản trị viên sẽ liên hệ Nhân viên (Staff) trực sân để đối chứng hình ảnh thực tế.
            </p>
          </div>
        </div>

        <div className="card-base">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-4">
              <div>
                <label className="block label-mono text-foreground-muted mb-2">Mã kèo liên quan</label>
                <input
                  type="number"
                  value={matchId}
                  onChange={e => setMatchId(e.target.value)}
                  placeholder="VD: 12"
                  className="input-base"
                />
              </div>
              <div>
                <label className="block label-mono text-foreground-muted mb-2">Mã người chơi bị báo cáo</label>
                <input
                  type="number"
                  value={reportedUserId}
                  onChange={e => setReportedUserId(e.target.value)}
                  placeholder="VD: 8"
                  className="input-base"
                />
              </div>
            </div>

            <div>
              <label className="block label-mono text-foreground-muted mb-2">Lý do báo cáo</label>
              <div className="grid grid-cols-1 gap-3">
                {REASONS.map(r => (
                  <label key={r} className={`flex items-center gap-3 p-4 border-2 cursor-pointer transition-colors ${reason === r ? 'border-accent bg-accent/5' : 'border-border-default hover:border-border-hover'}`}>
                    <input type="radio" name="reason" className="accent-accent" checked={reason === r} onChange={() => setReason(r)} />
                    <span className="text-sm font-medium text-foreground">{r}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block label-mono text-foreground-muted mb-2">Link bằng chứng (Tùy chọn)</label>
              <input
                type="text"
                value={evidence}
                onChange={e => setEvidence(e.target.value)}
                placeholder="Dán link ảnh chụp màn hình tin nhắn..."
                className="input-base"
              />
            </div>

            <div>
              <label className="block label-mono text-foreground-muted mb-2">Mô tả chi tiết sự việc</label>
              <textarea
                rows="4"
                value={detail}
                onChange={e => setDetail(e.target.value)}
                className="input-base h-auto py-3 resize-none"
                placeholder="Vui lòng cung cấp chi tiết thời gian và sự việc..."
              ></textarea>
            </div>

            <button type="submit" disabled={submitting} className="btn-primary w-full h-12 disabled:opacity-60">
              {submitting && <Loader2 size={18} className="animate-spin" />} Gửi Báo Cáo Yêu Cầu Xử Lý
            </button>
          </form>
        </div>
      </div>

      <Footer variant="light" />
    </div>
  )
}
