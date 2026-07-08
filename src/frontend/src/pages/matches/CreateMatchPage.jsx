import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { bookingApi } from '../../api/bookingApi'
import { matchApi } from '../../api/matchApi'
import { useToast } from '../../components/Toast'
import { ArrowLeft, Info, Check } from 'lucide-react'

export default function CreateMatchPage() {
  const [step, setStep] = useState(1)
  const navigate = useNavigate()
  const { addToast } = useToast()

  const [myBookings, setMyBookings] = useState([])
  const [formData, setFormData] = useState({
    title: '',
    skillLevel: 'Mới chơi',
    bookingId: '',
    maxParticipants: 2,
    escrowAmount: 40000,
    notes: ''
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    bookingApi.getMyBookings()
      .then(res => {
        if(res.data) setMyBookings(res.data)
      })
      .catch(err => console.error(err))
  }, [])

  async function handleCreate() {
    if (!formData.bookingId) {
      addToast("Vui lòng chọn một sân đã đặt", "error")
      return
    }

    setIsLoading(true)
    try {
      const payload = {
        bookingId: parseInt(formData.bookingId),
        title: formData.title,
        skillLevel: formData.skillLevel,
        maxParticipants: parseInt(formData.maxParticipants),
        escrowAmount: parseFloat(formData.escrowAmount)
      }

      const res = await matchApi.createMatch(payload)
      if (res.statusCode === 200 || res.statusCode === 201) {
        addToast("Tạo kèo thành công!", "success")
        navigate('/matches')
      } else {
        addToast(res.message || "Có lỗi xảy ra", "error")
      }
    } catch (error) {
      addToast(error || "Có lỗi xảy ra", "error")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-background-base">
      <Navbar theme="dark" />

      <div className="max-w-[700px] mx-auto px-6 pt-[100px] sm:pt-[130px] pb-20 w-full flex-1">
        <div className="mb-8">
          <Link to="/matches" className="label-mono text-foreground-subtle hover:text-accent mb-4 inline-flex items-center gap-1.5">
            <ArrowLeft size={16} />
            Quay lại
          </Link>
          <h1 className="font-heading text-3xl uppercase tracking-tight text-foreground">Tạo kèo giao lưu mới</h1>
          <p className="text-foreground-muted text-sm mt-1">Tìm đồng đội, chia sẻ tiền sân dễ dàng qua ví ký quỹ.</p>
        </div>

        <div className="border-2 border-border-strong bg-surface overflow-hidden">
          {/* Progress */}
          <div className="flex border-b-2 border-border-strong p-4 gap-2">
            <div className={`flex-1 h-1.5 ${step >= 1 ? 'bg-accent' : 'bg-border-default'}`} />
            <div className={`flex-1 h-1.5 ${step >= 2 ? 'bg-accent' : 'bg-border-default'}`} />
            <div className={`flex-1 h-1.5 ${step >= 3 ? 'bg-accent' : 'bg-border-default'}`} />
          </div>

          <div className="p-6 sm:p-8">
            {step === 1 && (
              <div className="auth-animate-fade">
                <h2 className="font-heading text-lg uppercase text-foreground mb-6">Thông tin cơ bản</h2>
                <div className="space-y-5">
                  <div>
                    <label className="block label-mono text-foreground-muted mb-2">Tiêu đề kèo</label>
                    <input type="text" placeholder="VD: Tìm 2 tay vợt lông trình trung bình khá"
                           value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
                           className="input-base" />
                  </div>
                  <div>
                    <label className="block label-mono text-foreground-muted mb-2">Bộ môn</label>
                    <select className="input-base cursor-pointer">
                      <option className="bg-surface">Cầu lông</option>
                      <option className="bg-surface">Pickleball</option>
                    </select>
                  </div>
                  <div>
                    <label className="block label-mono text-foreground-muted mb-2">Trình độ yêu cầu</label>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => setFormData({...formData, skillLevel: 'Mới chơi'})} className={`flex-1 py-2.5 border-2 text-sm font-bold transition-colors ${formData.skillLevel === 'Mới chơi' ? 'border-accent bg-accent/10 text-accent' : 'border-border-default text-foreground-muted hover:border-border-hover'}`}>Mới chơi</button>
                      <button type="button" onClick={() => setFormData({...formData, skillLevel: 'Trung bình'})} className={`flex-1 py-2.5 border-2 text-sm font-bold transition-colors ${formData.skillLevel === 'Trung bình' ? 'border-accent bg-accent/10 text-accent' : 'border-border-default text-foreground-muted hover:border-border-hover'}`}>Trung bình</button>
                      <button type="button" onClick={() => setFormData({...formData, skillLevel: 'Khá / Giỏi'})} className={`flex-1 py-2.5 border-2 text-sm font-bold transition-colors ${formData.skillLevel === 'Khá / Giỏi' ? 'border-accent bg-accent/10 text-accent' : 'border-border-default text-foreground-muted hover:border-border-hover'}`}>Khá / Giỏi</button>
                    </div>
                  </div>
                </div>
                <button onClick={() => setStep(2)} className="btn-primary w-full h-12 mt-8">Tiếp tục</button>
              </div>
            )}

            {step === 2 && (
              <div className="auth-animate-fade">
                <h2 className="font-heading text-lg uppercase text-foreground mb-6">Địa điểm & Thời gian</h2>
                <div className="space-y-5">
                  <div>
                    <label className="block label-mono text-foreground-muted mb-2">Chọn sân (Từ danh sách đặt sân của bạn)</label>
                    <select value={formData.bookingId} onChange={e => setFormData({...formData, bookingId: e.target.value})} className="input-base border-accent bg-accent/5 font-medium cursor-pointer">
                      <option value="" className="bg-surface">-- Chọn đơn đặt sân --</option>
                      {myBookings.map(b => (
                        <option key={b.bookingId} value={b.bookingId} className="bg-surface">Đơn #{b.bookingId} - {new Date(b.bookingDate).toLocaleDateString()} {b.startTime}</option>
                      ))}
                    </select>
                    <p className="label-mono text-foreground-subtle mt-2">Kèo phải được gắn với một đơn đặt sân thực tế.</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 opacity-60 pointer-events-none">
                    <div>
                      <label className="block label-mono text-foreground-muted mb-2">Ngày</label>
                      <input type="text" value="Hôm nay" readOnly className="input-base" />
                    </div>
                    <div>
                      <label className="block label-mono text-foreground-muted mb-2">Giờ</label>
                      <input type="text" value="18:00 - 19:30" readOnly className="input-base" />
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 mt-8">
                  <button onClick={() => setStep(1)} className="btn-outline px-6 h-12">Quay lại</button>
                  <button onClick={() => setStep(3)} className="btn-primary flex-1 h-12">Tiếp tục</button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="auth-animate-fade">
                <h2 className="font-heading text-lg uppercase text-foreground mb-6">Chi phí & Chỗ</h2>
                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block label-mono text-foreground-muted mb-2">Số lượng chỗ cần tuyển</label>
                      <input type="number" value={formData.maxParticipants} onChange={e => setFormData({...formData, maxParticipants: e.target.value})} min="1" max="10" className="input-base" />
                    </div>
                    <div>
                      <label className="block label-mono text-foreground-muted mb-2">Số tiền cọc/chỗ (VNĐ)</label>
                      <input type="number" value={formData.escrowAmount} onChange={e => setFormData({...formData, escrowAmount: e.target.value})} step="5000" className="input-base" />
                    </div>
                  </div>

                  <div className="border-2 border-border-default bg-background-base p-4 flex gap-3">
                    <Info size={20} className="text-accent shrink-0 mt-0.5" />
                    <p className="text-xs text-foreground-muted leading-relaxed">
                      Ví ký quỹ sẽ tự động tạm giữ số tiền <b className="text-foreground">40,000 VNĐ</b> của mỗi người tham gia khi họ bấm Tham gia. Tiền sẽ được chuyển cho bạn sau khi kèo kết thúc thành công.
                    </p>
                  </div>

                  <div>
                    <label className="block label-mono text-foreground-muted mb-2">Ghi chú thêm</label>
                    <textarea rows="3" value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} placeholder="Nhớ mang theo nước uống..." className="input-base h-auto py-3 resize-none"></textarea>
                  </div>
                </div>
                <div className="flex gap-3 mt-8">
                  <button onClick={() => setStep(2)} className="btn-outline px-6 h-12">Quay lại</button>
                  <button onClick={handleCreate} disabled={isLoading} className="btn-primary flex-1 h-12 disabled:opacity-70">
                    {isLoading ? 'Đang tạo...' : 'Tạo kèo'}
                    {!isLoading && <Check size={18} />}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer variant="dark" />
    </div>
  )
}
