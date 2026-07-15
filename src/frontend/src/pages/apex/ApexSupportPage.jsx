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

  const inputClasses = "w-full px-4 h-12 bg-[#F8F9FA] border border-gray-200 rounded-[12px] text-[14px] text-gray-700 focus:bg-white focus:border-[#14b8a6] focus:ring-4 focus:ring-[#14b8a6]/10 transition-all outline-none"

  return (
    <ApexLayout>
      <div className="font-sans max-w-[1100px] mx-auto auth-animate-in space-y-8 pb-20">

        {/* Header */}
        <div className="flex max-md:flex-col md:items-end justify-between gap-6 mb-10">
          <div>
            <h1 className="font-heading text-3xl md:text-4xl uppercase tracking-tight text-[#0f172a] m-0 mb-2">Trung tâm hỗ trợ</h1>
            <p className="text-[14px] text-gray-500 m-0">Tìm câu trả lời hoặc liên hệ trực tiếp với đội ngũ hỗ trợ của chúng tôi.</p>
          </div>
          <div className="relative w-full md:w-[320px]">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm vấn đề của bạn..."
              className="w-full pl-12 pr-4 h-12 bg-white border border-gray-200 rounded-full text-[14px] text-gray-700 focus:border-[#14b8a6] focus:ring-4 focus:ring-[#14b8a6]/10 transition-all outline-none shadow-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* FAQ Area */}
          <div className="lg:col-span-3 space-y-4">
            <h2 className="font-bold text-[18px] text-[#0f172a] mb-6 m-0">Câu hỏi thường gặp</h2>
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div
                  key={faq.q}
                  className={`bg-white rounded-[16px] transition-all duration-300 border shadow-[0_2px_16px_rgba(0,0,0,0.02)] overflow-hidden ${
                    openFaq === i 
                    ? 'border-[#14b8a6]/40 shadow-[0_4px_20px_rgba(20,184,166,0.08)]' 
                    : 'border-gray-100 hover:border-gray-300 hover:shadow-[0_4px_16px_rgba(0,0,0,0.04)]'
                  }`}
                >
                  <button
                    className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none bg-transparent border-0 cursor-pointer"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    <span className={`font-bold text-[15px] pr-4 transition-colors ${openFaq === i ? 'text-[#14b8a6]' : 'text-[#0f172a]'}`}>
                      {faq.q}
                    </span>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${openFaq === i ? 'bg-[#14b8a6]/10 text-[#14b8a6]' : 'bg-gray-50 text-gray-400'}`}>
                      <ChevronDown size={18} className={`transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`} />
                    </div>
                  </button>
                  <div 
                    className={`px-6 text-[14.5px] text-gray-600 leading-relaxed transition-all duration-300 ease-in-out origin-top ${
                      openFaq === i ? 'pb-6 opacity-100 max-h-40' : 'max-h-0 opacity-0 overflow-hidden pb-0'
                    }`}
                  >
                    {faq.a}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Area */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="font-bold text-[18px] text-[#0f172a] mb-6 m-0">Gửi yêu cầu hỗ trợ</h2>

            {/* Form Card */}
            <div className="bg-white rounded-[20px] shadow-[0_2px_16px_rgba(0,0,0,0.04)] border border-gray-100 p-8">
              {submitted ? (
                <div className="flex flex-col items-center justify-center py-10 text-center auth-animate-fade">
                  <div className="w-20 h-20 rounded-full bg-teal-50 flex items-center justify-center mb-6">
                    <CheckCircle2 size={36} className="text-[#14b8a6]" />
                  </div>
                  <h3 className="font-bold text-[18px] text-[#0f172a] m-0 mb-3">Đã gửi tin nhắn</h3>
                  <p className="text-[14px] text-gray-500 leading-relaxed m-0">Chúng tôi đã nhận được yêu cầu của bạn và sẽ phản hồi qua email trong vòng 2 giờ tới.</p>
                  <button 
                    onClick={() => setSubmitted(false)}
                    className="mt-8 px-6 py-2.5 rounded-full bg-[#F8F9FA] text-[#0f172a] text-[13px] font-bold border border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    Gửi yêu cầu khác
                  </button>
                </div>
              ) : (
                <form className="space-y-5" onSubmit={handleSubmit}>
                  <div>
                    <label htmlFor="support-subject" className="block text-[13px] font-bold text-gray-600 mb-2">Chủ đề</label>
                    <input
                      id="support-subject"
                      type="text"
                      placeholder="Mô tả ngắn gọn vấn đề của bạn"
                      value={form.subject}
                      onChange={e => setForm({ ...form, subject: e.target.value })}
                      className={inputClasses}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="support-category" className="block text-[13px] font-bold text-gray-600 mb-2">Danh mục</label>
                    <select
                      id="support-category"
                      value={form.category}
                      onChange={e => setForm({ ...form, category: e.target.value })}
                      className={`${inputClasses} cursor-pointer appearance-none bg-no-repeat bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2224%22%20height%3D%2224%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%2F%3E%3C%2Fsvg%3E')] bg-[position:right_1rem_center] bg-[length:1.2em_1.2em] pr-10`}
                    >
                      {['Đặt sân', 'Thanh toán', 'Trận đấu', 'Tài khoản', 'Kỹ thuật', 'Khác'].map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="support-message" className="block text-[13px] font-bold text-gray-600 mb-2">Nội dung tin nhắn</label>
                    <textarea
                      id="support-message"
                      rows={4}
                      placeholder="Mô tả chi tiết vấn đề bạn đang gặp phải..."
                      value={form.message}
                      onChange={e => setForm({ ...form, message: e.target.value })}
                      className={`${inputClasses} h-32 py-3 resize-none`}
                      required
                    />
                  </div>
                  <button type="submit" className="w-full h-12 rounded-full bg-[#14b8a6] hover:bg-[#0f9e8c] text-white text-[14px] font-bold uppercase tracking-wide transition-all shadow-[0_4px_14px_rgba(20,184,166,0.25)] border-0 cursor-pointer mt-4">
                    Gửi tin nhắn
                  </button>
                </form>
              )}
            </div>

            {/* Contact Info Card */}
            <div className="bg-white rounded-[20px] shadow-[0_2px_16px_rgba(0,0,0,0.04)] border border-gray-100 p-6 space-y-4">
              <div className="flex items-center gap-4 p-3 rounded-[12px] hover:bg-[#F8F9FA] transition-colors cursor-pointer border border-transparent hover:border-gray-100">
                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                  <Mail size={18} />
                </div>
                <div>
                  <p className="text-[14px] font-bold text-[#0f172a] m-0 mb-0.5">Email hỗ trợ</p>
                  <p className="text-[13px] text-gray-500 m-0">support@prosport.com</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-3 rounded-[12px] hover:bg-[#F8F9FA] transition-colors cursor-pointer border border-transparent hover:border-gray-100">
                <div className="w-10 h-10 rounded-full bg-teal-50 text-[#14b8a6] flex items-center justify-center shrink-0">
                  <Phone size={18} />
                </div>
                <div>
                  <p className="text-[14px] font-bold text-[#0f172a] m-0 mb-0.5">Hotline 24/7</p>
                  <p className="text-[13px] text-gray-500 m-0">+84 28 3838 3838 <span className="italic text-gray-400 text-[11px] ml-1">(8am–10pm)</span></p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-3 rounded-[12px] hover:bg-[#F8F9FA] transition-colors cursor-pointer border border-transparent hover:border-gray-100">
                <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-500 flex items-center justify-center shrink-0">
                  <MessageCircle size={18} />
                </div>
                <div>
                  <p className="text-[14px] font-bold text-[#0f172a] m-0 mb-0.5">Live Chat</p>
                  <p className="text-[13px] text-gray-500 m-0">Trò chuyện trực tiếp trong ứng dụng</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </ApexLayout>
  )
}
