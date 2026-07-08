# Nhật ký thay đổi (Changelog)
Bản báo cáo tiến trình phát triển và kiểm soát phiên bản của dự án Pro-Sport Complex Management.
## [2026-05-18] - Giai đoạn: Phân tích Yêu cầu & Thiết kế Kiến trúc Thông tin
**Người thực hiện:** Dương Khang Huy
### Thêm mới (Added)
* Khởi tạo Sơ đồ trang (Site Map) tổng thể và ma trận phân quyền (RBAC Matrix) cho 3 nhóm người dùng: Customer, Staff, Admin.
* Xác định và phân rã các module chức năng cốt lõi (Core Modules).
### Thay đổi (Changed)
* Cắt giảm số lượng màn hình quản trị thừa để thu hẹp phạm vi dự án (Scope Management).
* Tái cấu trúc luồng nghiệp vụ (Business Flow) cho tính năng Đặt sân (Booking) và Thuê trang thiết bị (Rental).
### Hỗ trợ từ AI (AI-assisted)
* Sử dụng ChatGPT (GPT-4) làm Trợ lý Phân tích Nghiệp vụ (Business Analyst) để rà soát đặc tả yêu cầu, liệt kê danh sách màn hình.
---
## [2026-05-24] - Giai đoạn: Lên ý tưởng & Thiết kế UI/UX (Static Mockups)
**Người thực hiện:** Dương Khang Huy
### Thêm mới (Added)
* Hoàn thiện thiết kế giao diện UI tĩnh (Static Mockups) cho toàn bộ 14 module chức năng trên bản Desktop.
* Thiết lập hệ thống thiết kế cơ sở (Basic Design System): Trạng thái lỗi (Error States), Form xác thực.
### Thay đổi (Changed)
* Hiệu chỉnh hệ thống biến thiết kế (Design Tokens) bao gồm Color Palette, Typography trong bộ Prompt đầu vào.
### Hỗ trợ từ AI (AI-assisted)
* Áp dụng kỹ thuật Meta-prompting: ChatGPT biên soạn các đoạn mã lệnh tiếng Anh chuyên sâu; Stitch by Google tiếp nhận sinh mã HTML/CSS.
* **Minh chứng:** [Stitch Project Link](https://stitch.withgoogle.com/projects/16441357012891837362)
---
## [2026-06-02] - Giai đoạn: Khởi tạo Repository và Vận hành Môi trường (DevOps Setup)
**Người thực hiện:** Dương Khang Huy
### Thêm mới (Added)
* Thiết lập file `.gitignore` tiêu chuẩn để cách ly file nhạy cảm Frontend (React) và Backend (.NET).
* Khởi tạo các file cấu hình môi trường bảo mật (Environment Templates): `.env.example`, `appsettings.Development.json.example`.
* Soạn thảo tài liệu `README.md` theo tiêu chuẩn kỹ thuật triển khai dự án.
### Thay đổi (Changed)
* Điều chỉnh Database Connection String sang chuẩn SQL Server nội bộ.
### Hỗ trợ từ AI (AI-assisted)
* Cursor IDE đóng vai trò Trợ lý Kỹ sư Hệ thống, phân tích ngữ cảnh (Context-aware) sinh mã Boilerplate.
---
## [2026-06-10] - Giai đoạn: Tối ưu Môi trường & Nâng cấp Hệ thống Kiểm duyệt Mã nguồn (Linter)
**Người thực hiện:** Dương Khang Huy
### Thêm mới (Added)
* Triển khai cấu hình Linter `src/frontend/eslint.config.js` tuân thủ Flat Config của ESLint v9.
* Khai báo bổ sung các gói Dependencies: `globals`, `@eslint/js`.
### Thay đổi (Changed)
* Chuyển đổi quy tắc kiểm duyệt (Linting Rules) sang kiến trúc JavaScript ES Modules. Vô hiệu hóa rule `react/prop-types`.
### Hỗ trợ từ AI (AI-assisted)
* Antigravity AI thực hiện biên soạn cấu trúc Flat Config phức tạp và chủ động vá lỗi thiếu hụt thư viện NPM.
---
## [2026-06-18] - Giai đoạn: Nâng cấp Trải nghiệm Người dùng (MatchPro) & Hợp nhất Mã nguồn
**Người thực hiện:** Dương Khang Huy
### Thêm mới (Added)
* Tích hợp Bản đồ Địa lý (`react-leaflet`) vào MatchPro Nearby.
* Khởi tạo Component Custom Marker với vi-tương tác "Chấm xanh nhấp nháy" (Live Location Ping).
### Thay đổi (Changed)
* Tái cấu trúc toàn diện (Major Refactoring) giao diện MatchPro sang ngôn ngữ thiết kế "Light Luxury" (lưới Grid, bo góc lớn 3xl).
* Chuyển đổi triết lý hoạt ảnh: Loại bỏ GSAP, chuyển sang CSS Keyframes thuần túy.
### Sửa lỗi (Fixed)
* Gỡ lỗi sập ứng dụng (Vite Crash) do thiếu thư viện `dompurify`.
* Xử lý xung đột Git (Merge Conflicts) tại `DbContextSnapshot`.
### Hỗ trợ từ AI (AI-assisted)
* Antigravity AI tự động thiết kế lại layout phức tạp, tối ưu thuật toán rendering và thực thi lệnh Git để giải quyết xung đột mã nguồn.
---
## [2026-06-25 đến 29] - Giai đoạn: Phân tách Phân hệ Quản trị (Admin Portal), Định tuyến và Tối ưu Mã nguồn
**Người thực hiện:** Dương Khang Huy
### Thêm mới (Added)
* Bổ sung luồng điều hướng bảo mật (Access Control Guard) tại `LoginPage.jsx` (Chuyển Admin vào `/admin`, Staff vào `/elite`).
* Thêm nút Đăng xuất (Logout) kèm logic xóa JWT Token trực tiếp vào `AdminLayout.jsx`.
### Thay đổi (Changed)
* Tách biệt hoàn toàn Layout của Khách hàng và Quản trị viên.
* Bổ sung cơ chế ẩn nút "Quản trị viên" trên thanh Navbar dựa vào việc giải mã thông tin (Payload) của JWT Token.
* Cập nhật `eslint.config.js` để vô hiệu hóa rule siêu khắt khe `set-state-in-effect`, giảm độ nhiễu Linter.
### Sửa lỗi (Fixed)
* Khắc phục lỗi **Backend Runtime Crash** (`ArgumentException: IDX10603`) do biến cấu hình `JwtSettings:SecretKey` bị thất lạc trong `appsettings.json`.
* Khắc phục lỗi rò rỉ bộ nhớ (Memory Leak) và giật lag giao diện trong trang `ApexSettingsPage` do Component `Toggle` bị khai báo lồng nhau (Nested static component).
### Hỗ trợ từ AI (AI-assisted)
* Antigravity AI chẩn đoán chính xác luồng dữ liệu (Data Flow) để cấu trúc lại React Router. AI thể hiện khả năng đọc Stack Trace Backend C# tuyệt vời để khôi phục cấu hình Database, đồng thời dọn dẹp mã nguồn (Refactoring) đạt mức tối ưu hiệu năng mà không làm vỡ kiến trúc logic hiện tại.
---
## [2026-07-05 đến 07] - Giai đoạn: Đại tu Giao diện theo Design System mới & Chuẩn hóa Dữ liệu Nghiệp vụ
**Người thực hiện:** Dương Khang Huy
### Thêm mới (Added)
* Bộ Design Token tập trung trong `index.css`: bảng màu Navy/Cream/Teal, bộ font Anton – Inter – JetBrains Mono, quy tắc hình khối viền cứng (Neo-Brutalist), hỗ trợ đầy đủ 2 theme Sáng/Tối.
* Tiện ích `imageFallback.js` xử lý ảnh hỏng/thiếu thống nhất toàn dự án.
* Bộ dữ liệu nghiệp vụ chuẩn (Seed Data) cho ~20 bảng: giờ mở cửa, chính sách hủy, ví Escrow, kèo đấu, voucher, kho sản phẩm, tài sản cho thuê, đánh giá tổ hợp, nhật ký Audit — thay thế hoàn toàn dữ liệu ảo trên UI.
### Thay đổi (Changed)
* Restyle đồng bộ ~95 trang trên 9 phân hệ (Owner, Admin, Elite, MatchPro, Gear, Dashboard, Auth, Legal, Status) theo bộ mockup thiết kế mới; **giữ nguyên 100% logic nghiệp vụ, API call và nội dung tiếng Việt**.
* Tái cấu trúc 9 Layout Shell (Sidebar/Navbar) và 13 Component UI dùng chung (StatusBadge, StatCard, ConfirmDialog...) theo token mới.
### Sửa lỗi (Fixed)
* Luồng Đăng ký không còn thất bại toàn phần khi dịch vụ gửi email OTP gặp sự cố (bọc try-catch tại `AuthService`, log OTP ở môi trường Dev).
### Hỗ trợ từ AI (AI-assisted)
* Claude Code đóng vai trò Điều phối viên đa tác tử (Multi-agent Orchestrator): phân rã công việc theo lô, điều phối nhiều AI Agent song song mỗi agent một phân hệ, tự kiểm chứng bằng ESLint/Vite Build và duyệt giao diện thực tế trên trình duyệt sau mỗi lô.
---
## [2026-07-07 đến 09] - Giai đoạn: Nghiệm thu Hệ thống, Chẩn đoán Sự cố & Chuẩn bị Bàn giao
**Người thực hiện:** Dương Khang Huy
### Thêm mới (Added)
* Biên bản kiểm thử nghiệm thu E2E trên đủ 5 vai trò người dùng, gồm 12 phát hiện xếp hạng mức nghiêm trọng, đối chiếu trực tiếp với đặc tả SRS.
* Checklist cấu hình môi trường bên thứ ba cần hoàn thiện trước demo: Google OAuth Origins, SMTP, VNPay Sandbox, OpenAI API Key.
### Sửa lỗi (Fixed)
* Truy ra nguyên nhân gốc lỗi đăng nhập Google (HTTP 403 từ endpoint GSI — origin `localhost:5173` chưa đăng ký trên Google Cloud Console), phân định rõ lỗi cấu hình hạ tầng thay vì lỗi mã nguồn.
* Khôi phục quyền truy cập tài khoản bị "kẹt" (khởi tạo qua Google Sign-In nên không có mật khẩu khả dụng) bằng chính API `change-password` của hệ thống, kiểm chứng hai chiều thành công.
### Thay đổi (Changed)
* Đóng gói toàn bộ khối lượng công việc thành 12 commit có cấu trúc (tách bạch Frontend redesign / Backend hardening), kiểm tra an toàn trước khi đẩy (xác nhận `.env` nằm trong `.gitignore`, loại trừ cấu hình cá nhân), push lên nhánh `DE190900/audit-module` chờ Leader review và merge qua Pull Request.
### Hỗ trợ từ AI (AI-assisted)
* Claude Code thực hiện chẩn đoán phân lớp sự cố xác thực bằng bằng chứng HTTP tái lập được; hỗ trợ chuẩn hóa quy trình Git (commit message, kiểm tra rò rỉ secrets, hướng dẫn quy trình PR theo template của repo).
