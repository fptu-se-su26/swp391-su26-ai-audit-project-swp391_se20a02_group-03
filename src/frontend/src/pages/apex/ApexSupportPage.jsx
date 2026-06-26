import { useState } from 'react'
import ApexLayout from '../../layouts/ApexLayout'

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
      <div className="max-w-[1000px] mx-auto animate-fade-up space-y-8">
        
        {/* Compact Header */}
        <div className="flex max-md:flex-col md:items-end justify-between gap-4 mb-2">
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Trung tâm hỗ trợ</h1>
            <p className="text-sm text-foreground-muted mt-1">Tìm câu trả lời hoặc liên hệ đội ngũ hỗ trợ.</p>
          </div>
          <div className="relative w-full md:w-[280px]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="text"
              placeholder="Tìm kiếm hỗ trợ..."
              className="w-full h-10 pl-10 pr-4 bg-white border border-[#E2E8F0] rounded-xl text-sm text-foreground placeholder:text-[#94A3B8] font-medium focus:border-[#14B8A6] focus:ring-1 focus:ring-[#14B8A6]/20 outline-none transition-all shadow-sm"
            />
          </div>
        </div>


        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          
          {/* FAQ */}
          <div className="lg:col-span-3 space-y-4">
            <h2 className="text-lg font-bold text-foreground mb-5">Câu hỏi thường gặp</h2>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <div 
                  key={faq.q} 
                  className={`bg-white border rounded-2xl overflow-hidden transition-all duration-200 ${
                    openFaq === i ? 'border-[#14B8A6] shadow-sm' : 'border-[#E2E8F0] hover:border-[#CBD5E1]'
                  }`}
                >
                  <button 
                    className="w-full px-5 py-4 flex items-center justify-between text-left focus:outline-none" 
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    <span className={`font-semibold pr-4 ${openFaq === i ? 'text-[#14B8A6]' : 'text-foreground'}`}>{faq.q}</span>
                    <span className={`text-[#94A3B8] transition-transform duration-200 ${openFaq === i ? 'rotate-180' : ''}`}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
                    </span>
                  </button>
                  {openFaq === i && (
                    <div className="px-5 pb-5 pt-0 text-sm text-[#475569] leading-relaxed animate-fade-in">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-lg font-bold text-foreground mb-5">Liên hệ hỗ trợ</h2>
            
            <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-sm">
              {submitted ? (
                <div className="flex flex-col items-center justify-center py-8 text-center animate-scale-in">
                  <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-3xl mb-4">✅</div>
                  <h3 className="text-[17px] font-bold text-foreground mb-2">Đã gửi tin nhắn</h3>
                  <p className="text-sm text-foreground-muted">Chúng tôi đã nhận được yêu cầu của bạn và sẽ phản hồi trong vòng 2 giờ.</p>
                </div>
              ) : (
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div>
                    <label htmlFor="support-subject" className="block text-xs font-bold text-[#475569] uppercase tracking-wider mb-2">Chủ đề</label>
                    <input 
                      id="support-subject" 
                      type="text" 
                      placeholder="Mô tả ngắn gọn vấn đề của bạn" 
                      value={form.subject} 
                      onChange={e => setForm({ ...form, subject: e.target.value })} 
                      className="w-full h-11 px-4 bg-white border border-[#E2E8F0] rounded-xl text-sm text-foreground font-medium focus:border-[#14B8A6] focus:ring-1 focus:ring-[#14B8A6]/20 outline-none transition-all shadow-sm" 
                      required 
                    />
                  </div>
                  <div>
                    <label htmlFor="support-category" className="block text-xs font-bold text-[#475569] uppercase tracking-wider mb-2">Danh mục</label>
                    <select 
                      id="support-category" 
                      value={form.category} 
                      onChange={e => setForm({ ...form, category: e.target.value })} 
                      className="w-full h-11 px-4 bg-white border border-[#E2E8F0] rounded-xl text-sm text-foreground font-medium focus:border-[#14B8A6] focus:ring-1 focus:ring-[#14B8A6]/20 outline-none transition-all shadow-sm cursor-pointer"
                    >
                      {['Đặt sân', 'Thanh toán', 'Trận đấu', 'Tài khoản', 'Kỹ thuật', 'Khác'].map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="support-message" className="block text-xs font-bold text-[#475569] uppercase tracking-wider mb-2">Tin nhắn</label>
                    <textarea 
                      id="support-message" 
                      rows={4} 
                      placeholder="Mô tả chi tiết vấn đề của bạn..." 
                      value={form.message} 
                      onChange={e => setForm({ ...form, message: e.target.value })} 
                      className="w-full p-4 bg-white border border-[#E2E8F0] rounded-xl text-sm text-foreground font-medium focus:border-[#14B8A6] focus:ring-1 focus:ring-[#14B8A6]/20 outline-none transition-all shadow-sm resize-none" 
                      required 
                    />
                  </div>
                  <button type="submit" className="w-full h-11 bg-[#14B8A6] text-[var(--theme-primary)] rounded-xl font-semibold shadow-sm hover:bg-[#0D9488] active:scale-[0.98] transition-all duration-200 mt-2">
                    Gửi tin nhắn
                  </button>
                </form>
              )}
            </div>

            <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-white shadow-sm border border-[#E2E8F0] flex items-center justify-center text-foreground-muted">📧</span>
                <span className="text-sm font-semibold text-foreground">support@prosport.com</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-white shadow-sm border border-[#E2E8F0] flex items-center justify-center text-foreground-muted">📞</span>
                <span className="text-sm font-semibold text-foreground">+84 28 3838 3838 <span className="font-normal text-foreground-muted text-xs ml-1">(8am–10pm)</span></span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-white shadow-sm border border-[#E2E8F0] flex items-center justify-center text-foreground-muted">💬</span>
                <span className="text-sm font-semibold text-foreground">Trò chuyện trực tiếp có sẵn trong ứng dụng</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ApexLayout>
  )
}
