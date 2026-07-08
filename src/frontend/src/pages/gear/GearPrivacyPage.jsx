import GearLayout from '../../layouts/GearLayout'
import { ShieldCheck, Info } from 'lucide-react'

const sections = [
  { title: 'Thông tin chúng tôi thu thập', body: `Chúng tôi thu thập thông tin cá nhân bạn cung cấp trực tiếp khi tạo tài khoản hoặc thuê thiết bị:
• Họ tên, email và số điện thoại
• Thông tin thanh toán (xử lý an toàn qua đối tác thanh toán)
• Giấy tờ xác minh danh tính (cho thuê thiết bị cao cấp)
• Lịch sử thuê, sở thích và mẫu sử dụng
• Mã thiết bị và dữ liệu duyệt web khi dùng nền tảng` },
  { title: 'Cách chúng tôi sử dụng thông tin', body: `Thông tin của bạn được dùng để:
• Xử lý và quản lý đơn thuê thiết bị
• Xác minh danh tính cho mục đích đặt cọc và trách nhiệm
• Gửi xác nhận, nhắc nhở và biên lai thuê
• Cải thiện danh mục thiết bị và giá dựa trên xu hướng sử dụng
• Hỗ trợ khách hàng và giải quyết tranh chấp
• Tuân thủ nghĩa vụ pháp lý và thực thi điều khoản thuê` },
  { title: 'Chia sẻ dữ liệu & bên thứ ba', body: `Chúng tôi không bán dữ liệu cá nhân. Chỉ chia sẻ với:
• Đối tác thanh toán (Stripe, MoMo) để hoàn tất giao dịch
• Kỹ thuật viên bảo trì thiết bị (hồ sơ ẩn danh)
• Cơ quan pháp luật khi được yêu cầu
• Nhà cung cấp dịch vụ vận hành nền tảng theo thỏa thuận bảo mật nghiêm ngặt
Mọi bên thứ ba đều bị ràng buộc nghĩa vụ bảo mật.` },
  { title: 'Bảo mật', body: `Chúng tôi áp dụng biện pháp bảo mật tiêu chuẩn ngành:
• Mã hóa SSL 256-bit cho mọi dữ liệu truyền tải
• Thông tin thanh toán được token hóa, không lưu trên máy chủ
• Kiểm tra bảo mật và pentest định kỳ
• Chỉ nhân sự được ủy quyền mới truy cập dữ liệu cá nhân
• Kế hoạch ứng phó sự cố khi có rủi ro rò rỉ dữ liệu` },
  { title: 'Lưu trữ dữ liệu', body: `Chúng tôi lưu dữ liệu cá nhân trong thời gian cần thiết:
• Tài khoản đang hoạt động: trong suốt thời gian tài khoản còn hiệu lực
• Hồ sơ thuê: 3 năm để tuân thủ pháp lý và tài chính
• Hồ sơ thanh toán: theo quy định thuế Việt Nam (5 năm)
• Bạn có thể yêu cầu xóa dữ liệu, trừ khi pháp luật yêu cầu lưu giữ` },
  { title: 'Quyền của bạn', body: `Theo luật bảo vệ dữ liệu, bạn có quyền:
• Truy cập bản sao dữ liệu cá nhân chúng tôi lưu giữ
• Yêu cầu sửa dữ liệu không chính xác hoặc thiếu
• Yêu cầu xóa dữ liệu ("quyền được quên")
• Phản đối xử lý dữ liệu cho mục đích marketing
• Nhận dữ liệu ở định dạng có cấu trúc, máy đọc được
Để thực hiện quyền, liên hệ privacy@prosport.vn` },
  { title: 'Cookie & theo dõi', body: `Nền tảng dùng cookie để:
• Duy trì đăng nhập giữa các phiên
• Ghi nhớ tùy chọn và nội dung giỏ hàng
• Phân tích cách dùng để cải thiện hiệu năng
• Đưa gợi ý phù hợp
Bạn có thể tắt cookie trong trình duyệt; một số tính năng có thể không hoạt động đúng.` },
  { title: 'Liên hệ & cập nhật', body: `Câu hỏi hoặc yêu cầu liên quan bảo mật:
Email: privacy@prosport.vn
Địa chỉ: PRO-SPORT Performance Systems, TP.Hồ Chí Minh, Việt Nam
Chúng tôi có thể cập nhật Chính sách này định kỳ. Thay đổi sẽ được thông báo qua email và đăng tại trang này kèm ngày hiệu lực mới. Tiếp tục sử dụng nền tảng sau khi cập nhật đồng nghĩa chấp nhận chính sách mới.` },
]

export default function GearPrivacyPage() {
  return (
    <GearLayout>
      <div className="font-sans max-w-[820px] mx-auto">
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 label-mono bg-ink text-paper px-3 py-1.5 mb-5">
            <ShieldCheck size={13} />
            Quyền riêng tư &amp; Dữ liệu
          </div>
          <h1 className="font-heading text-3xl md:text-4xl uppercase tracking-tight text-foreground mb-4">Chính sách bảo mật</h1>
          <p className="text-foreground-muted text-sm leading-relaxed max-w-lg">
            PRO-SPORT cam kết bảo vệ thông tin cá nhân của bạn. Chính sách này giải thích dữ liệu thu thập, cách sử dụng và quyền của bạn.
          </p>
          <p className="label-mono text-foreground-subtle mt-4">Có hiệu lực: 1 tháng 6, 2026 · Áp dụng cho mọi dịch vụ PRO-SPORT Gear</p>
        </div>

        <div className="border-2 border-border-strong bg-surface p-6 mb-8">
          <p className="label-mono text-foreground-muted mb-4">Mục lục</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {sections.map((s, i) => (
              <a key={i} href={`#privacy-${i}`} className="text-sm font-medium text-foreground hover:text-accent transition-colors flex items-center gap-2">
                <span className="text-foreground-subtle">{i + 1}.</span> {s.title}
              </a>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-5">
          {sections.map((s, i) => (
            <div key={i} id={`privacy-${i}`} className="border-2 border-border-strong bg-surface p-6">
              <h2 className="font-heading text-base uppercase text-foreground mb-4 flex items-center gap-3">
                <span className="w-7 h-7 bg-ink text-paper flex items-center justify-center label-mono shrink-0">{i + 1}</span>
                {s.title}
              </h2>
              <div className="text-sm text-foreground-muted leading-relaxed whitespace-pre-line">{s.body}</div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex items-start gap-3 p-5 border-2 border-border-strong bg-surface text-sm text-foreground-muted">
          <Info size={18} className="text-accent shrink-0 mt-0.5" />
          <p>Có thắc mắc về chính sách? Gửi email <a href="mailto:privacy@prosport.vn" className="text-accent font-bold hover:underline">privacy@prosport.vn</a> — chúng tôi phản hồi trong 48 giờ.</p>
        </div>
      </div>
    </GearLayout>
  )
}
