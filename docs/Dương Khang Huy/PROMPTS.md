# Nhật ký Thiết kế Prompts (Prompt Log)

## Prompt #01 - Thiết lập Meta-Prompt thiết kế UI
**Ngày:** 2026-05-20  
**Công cụ AI:** Google Gemini  
**Tác giả:** Dương Khang Huy 
**Mục đích:** Khởi tạo Meta-Prompt kỹ thuật để hướng dẫn công cụ UI Generator (Stitch) thiết kế bộ giao diện nháp (Mockups) cho hệ thống Pro-Sport.
### Cấu trúc Prompt
*"Đóng vai trò là một Senior UX/UI Designer, hãy soạn thảo một bộ prompt tiếng Anh chi tiết để tôi sử dụng làm đầu vào cho công cụ Stitch By Google. Mục tiêu: Thiết kế UI tĩnh cho dự án Pro-Sport Complex Management System. Phạm vi bao gồm: Trang chủ (Landing Page), Màn hình danh sách sân (Courts List), Giao diện Quản trị (Dashboard) với biểu đồ thống kê, và Form thanh toán chi tiết (Payment UI). Yêu cầu bổ sung: Bảng màu phải mang phong cách thể thao, năng động, bám sát nhận diện thương hiệu của một nền tảng SaaS hiện đại."*
### Kết quả Kì vọng (Expected Output)
- Nhận được một chuỗi câu lệnh (Meta-prompt) tiếng Anh chuẩn xác về mặt ngữ nghĩa, tích hợp các thuật ngữ thiết kế chuyên ngành.
### Phân tích & Đánh giá (Evaluation)
**Mức độ thành công:** Cao. 
Việc cung cấp ngữ cảnh (Context Injection) rõ ràng giúp Gemini đóng vai tốt vai trò chuyên gia. Khối lượng mô tả sinh ra phong phú. **Quyết định can thiệp:** Tôi đã phải điều chỉnh (Prompt Tuning) lại các mã màu Hex trong Meta-prompt để ép hệ thống tuân thủ chính xác bộ nhận diện thương hiệu, và bổ sung các trạng thái Validation cho Form thanh toán.
---
## Prompt #02 - Khởi tạo Giao diện (Generative UI)
**Ngày:** 2026-05-21  
**Công cụ AI:** Stitch By Google  
**Mục đích:** Chuyển đổi Meta-prompt thành mã nguồn HTML/CSS/JS giao diện thực tế.
### Cấu trúc Prompt
*"Design a clean and modern dashboard for a sports complex management system. Include a sidebar for navigation with links to: Dashboard, Court Booking... The main content area should display real-time court status using a card grid layout. Use a dynamic color palette: primary teal (#00C2A8)..."*
### Phân tích & Đánh giá (Evaluation)
**Mức độ thành công:** Khá. 
Stitch kết xuất giao diện trực quan với cấu trúc Flexbox/CSS Grid tiêu chuẩn. Tuy nhiên mã nguồn trả về là dạng nguyên khối (Monolithic HTML). **Quyết định can thiệp:** Tôi đã áp dụng tư duy Component-based của React để tự tay bóc tách mã nguồn này thành các tập tin JSX rời rạc (Header, Sidebar, Card).
---
## Prompt #03 - Tự động hóa Môi trường (DevOps Setup)
**Ngày:** 2026-06-02  
**Công cụ AI:** Cursor IDE  
**Mục đích:** Khởi tạo tự động các tệp cấu hình nền tảng (Repo Configuration).
### Cấu trúc Prompt
*(Sử dụng Context-Aware Chat của Cursor Composer)* 
"Hãy phân tích cây thư mục hiện tại. Tạo cho tôi `.gitignore` tiêu chuẩn cho Frontend React (Vite) và Backend .NET 8. Tạo file `.env.example` và `appsettings.Development.json.example`. Cuối cùng, cập nhật `README.md` hướng dẫn chi tiết quy trình clone, setup và run."
### Phân tích & Đánh giá (Evaluation)
**Mức độ thành công:** Rất cao. 
AI tự phân tích được toàn bộ cây thư mục. Rủi ro "Hallucination" xảy ra khi AI tự ý đề xuất cấu trúc SQLite. **Quyết định can thiệp:** Thay thế ngay lập tức bằng cấu hình SQL Server Connection String.
---
## Prompt #04 - Quản trị Cấu hình Linter (Configuration Management)
**Ngày:** 2026-06-10
**Công cụ AI:** Antigravity AI
**Mục đích:** Xử lý lỗi hệ thống Linter khi nâng cấp phiên bản công cụ (Breaking Changes).
### Cấu trúc Prompt
*"Ý VỀ LỖI: Lệnh `npm run lint` bị sập do ESLint v9 thiếu file cấu hình. NHIỆM VỤ: Tạo mới file `src/frontend/eslint.config.js` tuân thủ Flat Config. YÊU CẦU: Import các plugin: eslint-plugin-react... Tắt bỏ rule react/prop-types để tránh nhiễu."*
### Phân tích & Đánh giá (Evaluation)
**Mức độ thành công:** Xuất sắc. 
Sử dụng phương pháp Prompting cung cấp Ngữ cảnh Lỗi (Error Context), AI không chỉ viết đúng file cấu hình ES Modules mà còn tự động nhận diện việc thiếu hụt thư viện npm (globals) để cài bổ sung.
---
## Prompt #05 - Tích hợp Dịch vụ Bên thứ ba (Leaflet Maps)
**Ngày:** 2026-06-18  
**Công cụ AI:** Antigravity AI  
**Mục đích:** Tích hợp Bản đồ Leaflet và thiết kế UI nâng cao.
### Cấu trúc Prompt
*"Tích hợp thư viện bản đồ mã nguồn mở Leaflet vào trang MatchPro Nearby. Yêu cầu: Nâng cấp bố cục giao diện (UI/UX) theo ngôn ngữ thiết kế hiện đại. Thiết lập tọa độ trung tâm mặc định về Đà Nẵng."*
### Phân tích & Đánh giá (Evaluation)
**Mức độ thành công:** Rất cao. 
AI áp dụng xuất sắc tư duy Tailwind CSS Grid/Flexbox để tái cấu trúc giao diện và nhúng Component bản đồ an toàn.
---
## Prompt #06 - Thiết kế Vi-tương tác (Micro-interactions)
**Ngày:** 2026-06-18  
**Công cụ AI:** Antigravity AI  
**Mục đích:** Nâng cao trải nghiệm thị giác (Visual UX) cho người dùng trên bản đồ.
### Cấu trúc Prompt
*"Gắn tọa độ gốc về Đại học FPT Đà Nẵng. Hãy thay thế icon vị trí mặc định của Leaflet bằng hiệu ứng chấm tròn màu xanh dương nhấp nháy (Blue Dot Ping Animation) mô phỏng trải nghiệm Real-time Tracking."*
### Phân tích & Đánh giá (Evaluation)
**Mức độ thành công:** Xuất sắc. 
Kết hợp `L.divIcon` của Leaflet và class `animate-ping` là một thủ thuật (Workaround) thông minh của AI để tránh viết thêm CSS phức tạp.
---
## Prompt #07 - Gỡ lỗi Vòng đời React (React Lifecycle Debugging)
**Ngày:** 2026-06-18  
**Công cụ AI:** Antigravity AI  
**Mục đích:** Khắc phục lỗi kẹt giao diện (UI Freeze) khi điều hướng trang.
### Cấu trúc Prompt
*"Report lỗi hiển thị: Khi chuyển qua lại giữa các tab, nội dung bị kẹt ở trạng thái mờ ảo (Opacity rendering error). Hãy chẩn đoán nguyên nhân xung đột vòng đời React (React Lifecycle) và khắc phục triệt để."*
### Phân tích & Đánh giá (Evaluation)
**Mức độ thành công:** Cao. 
Prompt yêu cầu chẩn đoán (Diagnostic Prompt) ép AI đọc luồng logic. AI phân tích chính xác sự bất đồng bộ giữa GSAP và Virtual DOM, quyết định thay thế bằng CSS Keyframes (Giải pháp an toàn).
---
## Prompt #08 - Cấu hình Phân quyền (Role-based Routing)
**Ngày:** 2026-06-25  
**Công cụ AI:** Antigravity AI  
**Mục đích:** Tách biệt phân hệ quản trị và định tuyến người dùng sau khi đăng nhập.
### Cấu trúc Prompt
*"Tôi muốn bạn cấu hình lại sao cho khi đăng nhập tài khoản Admin thì chuyển thẳng vào trang Admin, tài khoản Staff thì vào trang Elite, Customer thì vào trang chủ. Hướng dẫn ẩn nút 'Quản trị viên' trên Navbar và thêm nút Logout."*
### Phân tích & Đánh giá (Evaluation)
**Mức độ thành công:** Tuyệt đối.
Việc ra lệnh rõ ràng từng luồng đích (Destination Flows) giúp AI hiểu chính xác bức tranh tổng thể. AI đã xử lý cực kỳ khéo léo việc giải mã Payload của JWT để trích xuất Role ngay trong `LoginPage.jsx` và cập nhật state một cách đồng bộ.
---
## Prompt #09 - Gỡ lỗi Nền tảng Backend C# (Backend Crash Fix)
**Ngày:** 2026-06-27  
**Công cụ AI:** Antigravity AI  
**Mục đích:** Cấp cứu lỗi Backend không khởi động được do mất khóa mật mã.
### Cấu trúc Prompt
*"Sửa cho tôi lỗi Backend. Console đang báo lỗi `ArgumentException: IDX10603: Decryption failed` và thiếu `SymmetricSecurityKey`. Đồng thời chỉnh lại Database cho tôi luôn."*
### Phân tích & Đánh giá (Evaluation)
**Mức độ thành công:** Xuất sắc.
Chỉ bằng việc quăng mã lỗi kỹ thuật thuần túy của bộ thư viện `Microsoft.IdentityModel.Tokens`, AI đã tự truy ngược (Reverse-trace) lại file `appsettings.json` và phát hiện nguyên nhân cấu hình bị thiếu hụt.
---
## Prompt #10 - Dọn dẹp Mã nguồn (Code Refactoring & Cleanup)
**Ngày:** 2026-06-29  
**Công cụ AI:** Antigravity AI  
**Mục đích:** Xóa bỏ 60 lỗi Linter cảnh báo mà không gây ra Side-effect.
### Cấu trúc Prompt
*"Clean up cho tôi mã nguồn, khắc phục 60 lỗi linter từ việc quét của ESLint, nhưng hãy đảm bảo là không làm phát sinh thêm lỗi hay làm sập chức năng hiện tại."*
### Phân tích & Đánh giá (Evaluation)
**Mức độ thành công:** Vượt kỳ vọng.
Lệnh "không làm phát sinh thêm lỗi" (Zero Side-effect constraint) đã ép AI phải đánh giá độ rủi ro (Risk Assessment) trước khi sửa code. Quyết định tắt các rule linter khắt khe thay vì xáo trộn logic (ví dụ `set-state-in-effect`) chứng tỏ AI Agent có khả năng suy luận kiến trúc phần mềm cực kỳ trưởng thành.
