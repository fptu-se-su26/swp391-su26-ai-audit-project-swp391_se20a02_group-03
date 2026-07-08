import { useState } from 'react'
import GearLayout from '../../layouts/GearLayout'
import { Phone, Mail, MessageSquare, ChevronDown, CheckCircle2 } from 'lucide-react'

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
  { icon: <Phone size={20} />, label: 'Điện thoại', value: '+84 28 3456 7890', sub: 'T2 – CN, 8:00 – 22:00', action: 'tel:+84283456789', actionLabel: 'Gọi ngay' },
  { icon: <Mail size={20} />, label: 'Email', value: 'gear@prosport.vn', sub: 'Phản hồi trong 2 giờ', action: 'mailto:gear@prosport.vn', actionLabel: 'Gửi email' },
  { icon: <MessageSquare size={20} />, label: 'Chat trực tiếp', value: 'Trò chuyện với chúng tôi', sub: 'Phản hồi trung bình: 3 phút', action: '#', actionLabel: 'Bắt đầu chat' },
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
      <div className="font-sans max-w-[900px] mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-14 h-14 bg-ink text-paper flex items-center justify-center mx-auto mb-4">
            <MessageSquare size={26} />
          </div>
          <h1 className="font-heading text-3xl md:text-4xl uppercase tracking-tight text-foreground mb-3">Trung tâm hỗ trợ</h1>
          <p className="text-foreground-muted text-sm max-w-md mx-auto">Hỗ trợ thuê, trả, bảo trì thiết bị và các vấn đề khác. Chúng tôi phục vụ 7 ngày/tuần.</p>
        </div>

        {/* Contact Methods */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {contactMethods.map((c, i) => (
            <div key={i} className="border-2 border-border-strong bg-surface p-5 flex flex-col items-center text-center gap-3">
              <div className="w-11 h-11 flex items-center justify-center border-2 border-border-strong text-foreground">{c.icon}</div>
              <div>
                <p className="label-mono text-foreground-muted">{c.label}</p>
                <p className="font-extrabold text-foreground text-sm mt-1">{c.value}</p>
                <p className="text-xs text-foreground-muted mt-1">{c.sub}</p>
              </div>
              <a href={c.action} className="btn-outline text-xs h-9 px-4 no-underline">{c.actionLabel}</a>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">

          {/* FAQ */}
          <div>
            <h2 className="font-heading text-xl uppercase tracking-tight text-foreground mb-5">Câu hỏi thường gặp</h2>
            <div className="flex flex-col gap-3">
              {faqs.map((faq, i) => (
                <div key={i} className="border-2 border-border-strong bg-surface overflow-hidden">
                  <button onClick={() => setOpen(open === i ? null : i)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer bg-transparent border-none">
                    <span className="text-[14px] font-extrabold text-foreground pr-4">{faq.q}</span>
                    <ChevronDown
                      size={16}
                      className="shrink-0 text-accent transition-transform duration-200"
                      style={{ transform: open === i ? 'rotate(180deg)' : 'rotate(0deg)' }}
                    />
                  </button>
                  {open === i && (
                    <div className="px-5 pb-4 text-sm text-foreground-muted leading-relaxed border-t-2 border-border-default">
                      <p className="pt-3">{faq.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="font-heading text-xl uppercase tracking-tight text-foreground mb-5">Gửi tin nhắn</h2>
            {sent ? (
              <div className="border-2 border-accent bg-surface p-8 text-center">
                <div className="w-14 h-14 bg-accent text-ink rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 size={26} />
                </div>
                <p className="font-extrabold text-foreground mb-1">Đã gửi tin nhắn!</p>
                <p className="text-sm text-foreground-muted">Chúng tôi sẽ phản hồi trong vòng 2 giờ.</p>
                <button onClick={() => setSent(false)} className="mt-4 text-sm text-accent underline bg-transparent border-none cursor-pointer font-bold">Gửi tin khác</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="border-2 border-border-strong bg-surface p-6 flex flex-col gap-4">
                {[
                  { id: 'name', label: 'Họ và tên', placeholder: 'Họ tên đầy đủ', type: 'text' },
                  { id: 'email', label: 'Email', placeholder: 'email@example.com', type: 'email' },
                  { id: 'subject', label: 'Chủ đề', placeholder: 'VD: Trả thiết bị bị hỏng', type: 'text' },
                ].map(f => (
                  <div key={f.id}>
                    <label htmlFor={`support-${f.id}`} className="label-mono text-foreground-muted block mb-2">{f.label}</label>
                    <input id={`support-${f.id}`} type={f.type} required placeholder={f.placeholder}
                      value={form[f.id]} onChange={e => setForm({ ...form, [f.id]: e.target.value })}
                      className="input-base h-11" />
                  </div>
                ))}
                <div>
                  <label htmlFor="support-message" className="label-mono text-foreground-muted block mb-2">Nội dung</label>
                  <textarea id="support-message" required rows={5} placeholder="Mô tả chi tiết vấn đề của bạn..."
                    value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                    className="input-base !h-auto py-3 resize-none" />
                </div>
                <button type="submit" className="btn-primary w-full">Gửi yêu cầu</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </GearLayout>
  )
}
