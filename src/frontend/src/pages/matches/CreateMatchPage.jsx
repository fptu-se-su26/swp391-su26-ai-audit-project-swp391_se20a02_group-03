import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { bookingApi } from '../../api/bookingApi'
import { matchApi } from '../../api/matchApi'
import { useToast } from '../../components/Toast'

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
    <div className="flex flex-col min-h-screen bg-background-deep">
      <Navbar theme="dark" />

      <div className="max-w-[700px] mx-auto px-6 pt-[90px] pb-20 w-full flex-1">
        <div className="mb-8">
          <Link to="/matches" className="text-foreground-muted text-sm hover:text-[#5E6AD2] mb-2 inline-block flex items-center gap-1">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            Quay lại
          </Link>
          <h1 className="font-['Oswald'] text-3xl font-bold text-[var(--theme-primary)]">Tạo kèo giao lưu mới</h1>
          <p className="text-foreground-muted text-sm mt-1">Tìm đồng đội, chia sẻ tiền sân dễ dàng qua ví Escrow.</p>
        </div>

        <div className="card-base !p-0 rounded-3xl border border-border-default shadow-sm overflow-hidden">
          {/* Progress */}
          <div className="flex border-b border-border-default bg-[var(--theme-surface)] p-4 gap-2">
            <div className={`flex-1 h-1.5 rounded-full ${step >= 1 ? 'bg-[#5E6AD2]' : 'bg-white/20'}`} />
            <div className={`flex-1 h-1.5 rounded-full ${step >= 2 ? 'bg-[#5E6AD2]' : 'bg-white/20'}`} />
            <div className={`flex-1 h-1.5 rounded-full ${step >= 3 ? 'bg-[#5E6AD2]' : 'bg-white/20'}`} />
          </div>

          <div className="p-8">
            {step === 1 && (
              <div className="animate-[fadeIn_0.3s_ease]">
                <h2 className="text-lg font-bold text-[var(--theme-primary)] mb-6">Thông tin cơ bản</h2>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-foreground-muted mb-2">Tiêu đề kèo</label>
                    <input type="text" placeholder="VD: Tìm 2 tay vợt lông trình trung bình khá" 
                           value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
                           className="w-full border border-border-default bg-[var(--theme-surface)] text-[var(--theme-primary)] placeholder:text-foreground-muted rounded-xl px-4 py-3 outline-none focus:border-[#5E6AD2]" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground-muted mb-2">Bộ môn</label>
                    <select className="w-full border border-border-default bg-[var(--theme-surface)] text-[var(--theme-primary)] rounded-xl px-4 py-3 outline-none focus:border-[#5E6AD2]">
                      <option className="bg-background-elevated">Cầu lông</option>
                      <option className="bg-background-elevated">Pickleball</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground-muted mb-2">Trình độ yêu cầu</label>
                    <div className="flex gap-2">
                      <button onClick={() => setFormData({...formData, skillLevel: 'Mới chơi'})} className={`flex-1 py-2 rounded-lg border text-sm ${formData.skillLevel === 'Mới chơi' ? 'border-[#5E6AD2] bg-[#5E6AD2]/5 text-[#fff] font-medium' : 'border-border-default hover:border-[#5E6AD2]'}`}>Mới chơi</button>
                      <button onClick={() => setFormData({...formData, skillLevel: 'Trung bình'})} className={`flex-1 py-2 rounded-lg border text-sm ${formData.skillLevel === 'Trung bình' ? 'border-[#5E6AD2] bg-[#5E6AD2]/5 text-[#fff] font-medium' : 'border-border-default hover:border-[#5E6AD2]'}`}>Trung bình</button>
                      <button onClick={() => setFormData({...formData, skillLevel: 'Khá / Giỏi'})} className={`flex-1 py-2 rounded-lg border text-sm ${formData.skillLevel === 'Khá / Giỏi' ? 'border-[#5E6AD2] bg-[#5E6AD2]/5 text-[#fff] font-medium' : 'border-border-default hover:border-[#5E6AD2]'}`}>Khá / Giỏi</button>
                    </div>
                  </div>
                </div>
                <button onClick={() => setStep(2)} className="mt-8 w-full bg-[#5E6AD2] text-[var(--theme-primary)] font-bold py-3.5 rounded-xl hover:bg-[#6872D9] transition-colors">Tiếp tục</button>
              </div>
            )}

            {step === 2 && (
              <div className="animate-[fadeIn_0.3s_ease]">
                <h2 className="text-lg font-bold text-[var(--theme-primary)] mb-6">Địa điểm & Thời gian</h2>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-foreground-muted mb-2">Chọn sân (Từ danh sách đặt sân của bạn)</label>
                    <select value={formData.bookingId} onChange={e => setFormData({...formData, bookingId: e.target.value})} className="w-full border border-[#5E6AD2] bg-[#5E6AD2]/10 text-[var(--theme-primary)] rounded-xl px-4 py-3 outline-none font-medium">
                      <option value="" className="bg-background-elevated">-- Chọn Booking --</option>
                      {myBookings.map(b => (
                        <option key={b.bookingId} value={b.bookingId} className="bg-background-elevated">Booking #{b.bookingId} - {new Date(b.bookingDate).toLocaleDateString()} {b.startTime}</option>
                      ))}
                    </select>
                    <p className="text-xs text-foreground-muted mt-2">Kèo phải được gắn với một đơn đặt sân thực tế.</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 opacity-60 pointer-events-none">
                    <div>
                      <label className="block text-sm font-semibold text-foreground-muted mb-2">Ngày</label>
                      <input type="text" value="Hôm nay" readOnly className="w-full border border-border-default rounded-xl px-4 py-3 bg-[var(--theme-surface)] text-[var(--theme-primary)]" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-foreground-muted mb-2">Giờ</label>
                      <input type="text" value="18:00 - 19:30" readOnly className="w-full border border-border-default rounded-xl px-4 py-3 bg-[var(--theme-surface)] text-[var(--theme-primary)]" />
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 mt-8">
                  <button onClick={() => setStep(1)} className="px-6 bg-[var(--theme-surface-hover)] text-foreground-muted font-bold py-3.5 rounded-xl hover:bg-white/20">Quay lại</button>
                  <button onClick={() => setStep(3)} className="flex-1 bg-[#5E6AD2] text-[var(--theme-primary)] font-bold py-3.5 rounded-xl hover:bg-[#6872D9]">Tiếp tục</button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="animate-[fadeIn_0.3s_ease]">
                <h2 className="text-lg font-bold text-[var(--theme-primary)] mb-6">Chi phí & Slot</h2>
                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-foreground-muted mb-2">Số lượng slot cần tuyển</label>
                      <input type="number" value={formData.maxParticipants} onChange={e => setFormData({...formData, maxParticipants: e.target.value})} min="1" max="10" className="w-full border border-border-default bg-[var(--theme-surface)] text-[var(--theme-primary)] rounded-xl px-4 py-3 outline-none focus:border-[#5E6AD2]" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-foreground-muted mb-2">Số tiền Camp/Slot (VNĐ)</label>
                      <input type="number" value={formData.escrowAmount} onChange={e => setFormData({...formData, escrowAmount: e.target.value})} step="5000" className="w-full border border-border-default bg-[var(--theme-surface)] text-[var(--theme-primary)] rounded-xl px-4 py-3 outline-none focus:border-[#5E6AD2]" />
                    </div>
                  </div>
                  
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex gap-3">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" className="shrink-0 mt-0.5"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                    <p className="text-xs text-blue-300 leading-relaxed">
                      Ví Escrow sẽ tự động tạm giữ số tiền <b>40,000 VNĐ</b> của mỗi người tham gia khi họ bấm Join. Tiền sẽ được chuyển cho bạn sau khi kèo kết thúc thành công.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground-muted mb-2">Ghi chú thêm</label>
                    <textarea rows="3" value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} placeholder="Nhớ mang theo nước uống..." className="w-full border border-border-default bg-[var(--theme-surface)] text-[var(--theme-primary)] placeholder:text-foreground-muted rounded-xl px-4 py-3 outline-none focus:border-[#5E6AD2] resize-none"></textarea>
                  </div>
                </div>
                <div className="flex gap-3 mt-8">
                  <button onClick={() => setStep(2)} className="px-6 bg-[var(--theme-surface-hover)] text-foreground-muted font-bold py-3.5 rounded-xl hover:bg-white/20">Quay lại</button>
                  <button onClick={handleCreate} disabled={isLoading} className="flex-1 bg-[#5E6AD2] text-[var(--theme-primary)] font-bold py-3.5 rounded-xl text-center hover:bg-[#6872D9] flex items-center justify-center gap-2 disabled:opacity-70">
                    {isLoading ? 'Đang tạo...' : 'Tạo kèo'}
                    {!isLoading && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>}
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
