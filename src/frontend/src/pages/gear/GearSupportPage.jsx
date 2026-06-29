import { useState } from 'react'
import GearLayout from '../../layouts/GearLayout'

const faqs = [
  { q: 'Làm sao để gia hạn thời gian thuê?', a: 'Vào trang Thuê thiết bị và nhấn "Gia hạn" trên đơn đang hoạt động. Có thể gia hạn tối đa 30 phút trước giờ kết thúc dự kiến. Bạn cũng có thể gọi hotline để được hỗ trợ ngay.' },
  { q: 'Trả thiết bị bị hỏng thì sao?', a: 'Nếu hư hỏng vượt mức hao mòn bình thường, chi phí sửa chữa hoặc thay thế sẽ trừ từ tiền cọc. Trường hợp nghiêm trọng, bạn có thể phải thanh toán phần chênh lệch. Kỹ thuật viên đánh giá trong vòng 24 giờ.' },
  { q: 'Có thể hủy hoặc đổi lịch thuê không?', a: 'Hủy trước 24 giờ: hoàn tiền 100%. Trong 2–24 giờ: hoàn 50%. Đổi giờ hoặc gia hạn miễn phí nếu thực hiện trước giờ bắt đầu thuê ít nhất 2 giờ.' },
  { q: 'Tiền cọc hoàn lại như thế nào?', a: 'Cọc được hoàn trong 24 giờ sau khi xác nhận đã trả thiết bị. Hoàn về phương thức thanh toán ban đầu; có thể mất 3–5 ngày làm việc để hiển thị.' },
  { q: 'Thiết bị lỗi trong lúc thuê thì làm gì?', a: 'Liên hệ ngay hotline. Nếu xác nhận lỗi, chúng tôi thay thiết bị miễn phí. Không tiếp tục dùng thiết bị bị lỗi.' },
  { q: 'Thiết bị có được khử trùng giữa các lượt thuê không?', a: 'Có. Mọi thiết bị đều qua quy trình vệ sinh chuẩn trước mỗi lượt thuê. Vợt, quấn cán, găng tay được khử trùng thêm.' },
  { q: 'Có thể đặt trước một món cụ thể không?', a: 'Có! Trong Danh mục, chọn món và nhấn "Thêm vào thuê" — giữ đúng đơn vị đó trong khung giờ của bạn. Giữ chỗ 15 phút trong khi thanh toán.' },
]

const contactMethods = [
  { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.12 6.12l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>, label: 'Điện thoại', value: '+84 28 3456 7890', sub: 'T2 – CN, 8:00 – 22:00', action: 'tel:+84283456789', actionLabel: 'Gọi ngay', color: '#14B8A6' },
  { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>, label: 'Email', value: 'gear@prosport.vn', sub: 'Phản hồi trong 2 giờ', action: 'mailto:gear@prosport.vn', actionLabel: 'Gửi email', color: '#6366f1' },
  { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>, label: 'Chat trực tiếp', value: 'Trò chuyện với chúng tôi', sub: 'Phản hồi trung bình: 3 phút', action: '#', actionLabel: 'Bắt đầu chat', color: '#f59e0b' },
]

export default function GearSupportPage() {
  const [open, setOpen] = useState(null)
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sent, setSent] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    setSent(true)
  }

  return (
    <GearLayout>
      <div className="px-7 py-10 max-w-[900px] mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-14 h-14 bg-[#14B8A6]/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#14B8A6]">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          </div>
          <h1 className="font-['Oswald'] text-3xl font-bold text-foreground mb-2">Trung tâm hỗ trợ</h1>
          <p className="text-slate-400 text-sm max-w-md mx-auto">Hỗ trợ thuê, trả, bảo trì thiết bị và các vấn đề khác. Chúng tôi phục vụ 7 ngày/tuần.</p>
        </div>

        {/* Contact Methods */}
        <div className="grid grid-cols-3 max-[650px]:grid-cols-1 gap-4 mb-10">
          {contactMethods.map((c, i) => (
            <div key={i} className="bg-white rounded-2xl border border-[#e0ecf0] p-5 flex flex-col items-center text-center gap-3">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: c.color + '18', color: c.color }}>{c.icon}</div>
              <div>
                <p className="text-[0.7rem] text-slate-400 uppercase tracking-wider">{c.label}</p>
                <p className="font-semibold text-foreground text-sm mt-0.5">{c.value}</p>
                <p className="text-[0.72rem] text-slate-400 mt-0.5">{c.sub}</p>
              </div>
              <a href={c.action} className="btn-outline text-[0.78rem] py-1.5 px-4 no-underline">{c.actionLabel}</a>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-[1fr_360px] max-[800px]:grid-cols-1 gap-7">

          {/* FAQ */}
          <div>
            <h2 className="font-['Oswald'] text-xl font-bold text-foreground mb-4">Câu hỏi thường gặp</h2>
            <div className="flex flex-col gap-2">
              {faqs.map((faq, i) => (
                <div key={i} className="bg-white rounded-xl border border-[#e0ecf0] overflow-hidden">
                  <button onClick={() => setOpen(open === i ? null : i)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer bg-transparent border-none">
                    <span className="text-[0.875rem] font-semibold text-foreground pr-4">{faq.q}</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#14B8A6" strokeWidth="2.5"
                      className="shrink-0 transition-transform duration-200"
                      style={{ transform: open === i ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  </button>
                  {open === i && (
                    <div className="px-5 pb-4 text-sm text-slate-500 leading-relaxed border-t border-[#f0f4f8]">
                      <p className="pt-3">{faq.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="font-['Oswald'] text-xl font-bold text-foreground mb-4">Gửi tin nhắn</h2>
            {sent ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center">
                <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-600">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <p className="font-semibold text-emerald-800 mb-1">Đã gửi tin nhắn!</p>
                <p className="text-sm text-emerald-600">Chúng tôi sẽ phản hồi trong vòng 2 giờ.</p>
                <button onClick={() => setSent(false)} className="mt-4 text-sm text-emerald-700 underline bg-transparent border-none cursor-pointer">Gửi tin khác</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-[#e0ecf0] p-6 flex flex-col gap-4">
                {[
                  { id: 'name', label: 'Họ và tên', placeholder: 'Họ tên đầy đủ', type: 'text' },
                  { id: 'email', label: 'Email', placeholder: 'email@example.com', type: 'email' },
                  { id: 'subject', label: 'Chủ đề', placeholder: 'VD: Trả thiết bị bị hỏng', type: 'text' },
                ].map(f => (
                  <div key={f.id}>
                    <label htmlFor={`support-${f.id}`} className="text-[0.75rem] font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">{f.label}</label>
                    <input id={`support-${f.id}`} type={f.type} required placeholder={f.placeholder}
                      value={form[f.id]} onChange={e => setForm({...form, [f.id]: e.target.value})}
                      className="w-full border border-[#e0ecf0] rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:border-[#14B8A6] transition-colors" />
                  </div>
                ))}
                <div>
                  <label htmlFor="support-message" className="text-[0.75rem] font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">Nội dung</label>
                  <textarea id="support-message" required rows={5} placeholder="Mô tả chi tiết vấn đề của bạn..."
                    value={form.message} onChange={e => setForm({...form, message: e.target.value})}
                    className="w-full border border-[#e0ecf0] rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:border-[#14B8A6] transition-colors resize-none" />
                </div>
                <button type="submit" className="btn-primary w-full justify-center">Gửi yêu cầu</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </GearLayout>
  )
}
