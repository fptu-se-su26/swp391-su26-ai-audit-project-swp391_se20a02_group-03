import { useState } from 'react'
import ApexLayout from '../../layouts/ApexLayout'
import { Search, ChevronDown, CheckCircle2, Mail, Phone, MessageCircle } from 'lucide-react'

const faqs = [
  { q: 'Làm thế nào để hủy đặt sân?', a: 'Truy cập trang Đặt sân của bạn, chọn lượt đặt sân muốn hủy và nhấp vào "Hủy đặt sân". Các lượt hủy trước 24 giờ sẽ được hoàn tiền 100%.' },
  { q: 'Tôi có thể đổi lịch đặt sân không?', a: 'Có! Hãy đi tới các lượt đặt sân sắp tới của bạn, nhấp vào "Đổi lịch" và chọn một khung giờ mới. Đổi lịch miễn phí nếu thực hiện trước 4 giờ.' },
  { q: 'Việc nạp tiền vào ví hoạt động như thế nào?', a: 'Vào Cài đặt → Thanh toán → Ví và nhấp vào "Nạp tiền". Bạn có thể thêm tiền qua thẻ tín dụng, chuyển khoản ngân hàng hoặc MoMo.' },
  { q: 'Chính sách khách đi cùng là gì?', a: 'Mỗi lượt đặt sân có thể đi kèm tối đa 3 khách. Khách phải là thành viên PRO-SPORT đã đăng ký.' },
  { q: 'Làm thế nào để báo cáo sự cố về sân?', a: 'Sử dụng nút "Báo cáo sự cố" bên dưới hoặc liên hệ trực tiếp với bộ phận hỗ trợ. Đội ngũ cơ sở vật chất của chúng tôi sẽ phản hồi trong vòng 2 giờ.' },
]

export default function ApexSupportPage() {
  const [openFaq, setOpenFaq] = useState(null)
  const [form, setForm] = useState({ subject: '', category: 'Đặt sân', message: '' })
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
    setForm({ subject: '', category: 'Đặt sân', message: '' })
  }

  return (
    <ApexLayout>
      <div className="max-w-[1000px] mx-auto auth-animate-in space-y-8">

        {/* Header */}
        <div className="flex max-md:flex-col md:items-end justify-between gap-4 mb-2">
          <div>
            <h1 className="font-heading text-3xl uppercase tracking-[-0.01em] text-foreground">Trung tâm hỗ trợ</h1>
            <p className="text-sm text-foreground-muted mt-1">Tìm câu trả lời hoặc liên hệ đội ngũ hỗ trợ.</p>
          </div>
          <div className="relative w-full md:w-[280px]">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground-subtle" />
            <input
              type="text"
              placeholder="Tìm kiếm hỗ trợ..."
              className="input-base h-10 pl-10"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* FAQ */}
          <div className="lg:col-span-3 space-y-4">
            <h2 className="font-heading text-lg uppercase text-foreground mb-5">Câu hỏi thường gặp</h2>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <div
                  key={faq.q}
                  className={`bg-surface border-2 transition-colors duration-150 ${
                    openFaq === i ? 'border-accent' : 'border-border-strong hover:border-border-hover'
                  }`}
                >
                  <button
                    className="w-full px-5 py-4 flex items-center justify-between text-left focus:outline-none"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    <span className={`font-semibold pr-4 ${openFaq === i ? 'text-accent' : 'text-foreground'}`}>{faq.q}</span>
                    <ChevronDown size={20} className={`text-foreground-muted transition-transform duration-150 shrink-0 ${openFaq === i ? 'rotate-180' : ''}`} />
                  </button>
                  {openFaq === i && (
                    <div className="px-5 pb-5 pt-0 text-sm text-foreground-muted leading-relaxed auth-animate-fade">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="font-heading text-lg uppercase text-foreground mb-5">Liên hệ hỗ trợ</h2>

            <div className="card-base">
              {submitted ? (
                <div className="flex flex-col items-center justify-center py-8 text-center auth-animate-fade">
                  <div className="w-16 h-16 border-2 border-accent flex items-center justify-center mb-4">
                    <CheckCircle2 size={28} className="text-accent" />
                  </div>
                  <h3 className="font-heading text-lg uppercase text-foreground mb-2">Đã gửi tin nhắn</h3>
                  <p className="text-sm text-foreground-muted">Chúng tôi đã nhận được yêu cầu của bạn và sẽ phản hồi trong vòng 2 giờ.</p>
                </div>
              ) : (
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div>
                    <label htmlFor="support-subject" className="block label-mono text-foreground-muted mb-2">Chủ đề</label>
                    <input
                      id="support-subject"
                      type="text"
                      placeholder="Mô tả ngắn gọn vấn đề của bạn"
                      value={form.subject}
                      onChange={e => setForm({ ...form, subject: e.target.value })}
                      className="input-base h-11"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="support-category" className="block label-mono text-foreground-muted mb-2">Danh mục</label>
                    <select
                      id="support-category"
                      value={form.category}
                      onChange={e => setForm({ ...form, category: e.target.value })}
                      className="input-base h-11 cursor-pointer"
                    >
                      {['Đặt sân', 'Thanh toán', 'Trận đấu', 'Tài khoản', 'Kỹ thuật', 'Khác'].map(c => <option key={c} className="bg-surface">{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="support-message" className="block label-mono text-foreground-muted mb-2">Tin nhắn</label>
                    <textarea
                      id="support-message"
                      rows={4}
                      placeholder="Mô tả chi tiết vấn đề của bạn..."
                      value={form.message}
                      onChange={e => setForm({ ...form, message: e.target.value })}
                      className="input-base py-3 resize-none"
                      required
                    />
                  </div>
                  <button type="submit" className="btn-primary w-full h-11 mt-2">
                    Gửi tin nhắn
                  </button>
                </form>
              )}
            </div>

            <div className="bg-background-base border-2 border-border-default p-5 space-y-3">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 bg-surface border border-border-default flex items-center justify-center text-foreground-muted"><Mail size={16} /></span>
                <span className="text-sm font-semibold text-foreground">support@prosport.com</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 bg-surface border border-border-default flex items-center justify-center text-foreground-muted"><Phone size={16} /></span>
                <span className="text-sm font-semibold text-foreground">+84 28 3838 3838 <span className="font-normal text-foreground-muted text-xs ml-1">(8am–10pm)</span></span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 bg-surface border border-border-default flex items-center justify-center text-foreground-muted"><MessageCircle size={16} /></span>
                <span className="text-sm font-semibold text-foreground">Trò chuyện trực tiếp có sẵn trong ứng dụng</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ApexLayout>
  )
}
