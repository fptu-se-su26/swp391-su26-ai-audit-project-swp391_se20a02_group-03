# AI Audit Log
## Log #01
- **Ngày:** 2026-05-18
- **Người thực hiện:** Dương Khang Huy
- **Công cụ AI:** ChatGPT (GPT-4)
- **Mục đích:** Phân tích đặc tả yêu cầu hệ thống (SRS), thiết kế kiến trúc thông tin (Information Architecture) và phân rã các module chức năng.
- **Tham chiếu Prompt:** *"Giả sử bạn là một Senior UX/UI Designer. Dưới đây là danh sách các chức năng nghiệp vụ của hệ thống Pro-Sport Complex Management. Vui lòng phân tích và liệt kê chi tiết các màn hình (Screens) cần thiết, đồng thời mô tả luồng thao tác (User Flow) cơ bản trên mỗi màn hình cho các nhóm quyền: Customer, Staff, Admin."*
### Tóm tắt kết quả AI
- AI tiếp nhận ngữ cảnh hệ thống và tự động ánh xạ các yêu cầu nghiệp vụ thành một danh sách phân tầng (Hierarchical List) gồm các module cốt lõi (Authentication, Booking, Inventory, Dashboard).
- Trả về danh sách dự kiến gồm 55–60 màn hình UI/UX và đề xuất cơ chế phân quyền truy cập (Role-Based Access Control - RBAC).
### Quyết định & Can thiệp của con người
- **Chấp nhận một phần:** Ghi nhận cấu trúc phân rã màn hình và tư duy thiết kế phân quyền của AI để làm cơ sở xây dựng Sơ đồ trang (Site Map).
- **Can thiệp kỹ thuật (Human-in-the-loop):** Đánh giá số lượng màn hình do AI đề xuất là quá cồng kềnh so với nguồn lực dự án thực tế. Tiến hành cắt giảm, gộp các màn hình có chức năng tương đồng (ví dụ: gộp danh sách sân và chi tiết sân). Tự cấu trúc lại luồng đặt sân (Booking Flow) và thanh toán để phù hợp với hành vi tiêu dùng và quy trình thực tế tại các sân thể thao Việt Nam.
### Áp dụng cho
- Tài liệu Đặc tả Hệ thống phần mềm (SRS).
- Phân chia nhiệm vụ thiết kế Wireframe và Mockup cho các thành viên trong nhóm.
### Kiểm chứng
- Đối chiếu toàn bộ danh sách màn hình đã tinh chỉnh với Rubric chấm điểm của môn học SWP391. Đảm bảo độ bao phủ tính năng đạt 100% yêu cầu mà không gây quá tải khối lượng công việc (Scope Creep).
---
## Log #02
- **Ngày:** 2026-05-18
- **Người thực hiện:** Dương Khang Huy
- **Công cụ AI:** ChatGPT & Stitch by Google
- **Mục đích:** Sử dụng kỹ thuật Meta-prompting để thiết lập cấu trúc lệnh chuyên sâu, chỉ đạo công cụ Stitch thiết kế toàn bộ bản nháp UI tĩnh (Static Mockups).
- **Tham chiếu Prompt:** *"Viết một chuỗi Prompt kỹ thuật bằng tiếng Anh để tôi sử dụng trên công cụ Stitch by Google. Mục tiêu là thiết kế các màn hình cho Authentication Module và Court Management Module của một hệ thống Sport-Tech SaaS. Chú trọng vào phong cách thiết kế Enterprise, bố cục lưới (Grid-layout) và các thành phần giao diện động (Dynamic Components)."*
### Tóm tắt kết quả AI
- AI sinh ra một bộ Prompt bằng tiếng Anh được tối ưu hóa ngữ nghĩa (Semantic) dành riêng cho Stitch, áp dụng các chuẩn thiết kế SaaS và Fintech hiện đại.
- Stitch sinh ra giao diện dạng lưới, các thẻ Card hiển thị thống kê, và bố cục thanh điều hướng (Sidebar/Navbar) cho 58 màn hình Desktop.
### Quyết định & Can thiệp của con người
- **Chấp nhận:** Áp dụng hoàn toàn cấu trúc Prompt tiếng Anh và tư duy bố cục Dashboard từ AI.
- **Can thiệp kỹ thuật:** Chỉnh sửa các thông số Design Token trong Prompt (Color Palette, Typography, Spacing) để đảm bảo tính nhất quán với bộ nhận diện thương hiệu (Brand Identity) của nhóm. Bổ sung các ràng buộc về trạng thái Form (Validation States: Error, Success) mà AI ban đầu bỏ sót.
### Áp dụng cho
- Tài liệu thiết kế giao diện tĩnh (UI Mockups) làm đầu vào cho giai đoạn lập trình Frontend.
### Kiểm chứng
- Các Mockup sinh ra có độ trực quan cao, tuy nhiên cần sự can thiệp thủ công của Frontend Developer để cấu trúc lại mật độ hiển thị thông tin trên các màn hình quản trị (Admin Dashboard) nhằm tăng trải nghiệm người dùng (UX).
---
## Log #03
- **Ngày:** 2026-06-02
- **Người thực hiện:** Dương Khang Huy
- **Công cụ AI:** Cursor IDE
- **Mục đích:** Tự động hóa việc khởi tạo hạ tầng Repository, file cấu hình môi trường và tài liệu kỹ thuật (Developer Onboarding Docs).
- **Tham chiếu Prompt:** *(Sử dụng Cursor Composer)* "Tạo cho tôi file `.gitignore` tiêu chuẩn cho Frontend (React/Vite) và Backend (.NET 8 Web API). Thiết lập các file `.env.example` và `appsettings.Development.json.example`. Viết `README.md` hướng dẫn chi tiết quy trình clone, cài đặt dependencies và khởi chạy dự án."
### Tóm tắt kết quả AI
- Cursor đọc toàn bộ cây thư mục (Directory Tree), tự động phân tích Stack công nghệ để sinh ra các file `.gitignore` chính xác tuyệt đối.
- Thiết lập sẵn các biến môi trường (Environment Variables) cốt lõi như ConnectionString, JWT Secret Key.
- Khởi tạo `README.md` đạt chuẩn mã nguồn mở (Open-source Standard) với các lệnh CLI minh họa chi tiết.
### Quyết định & Can thiệp của con người
- **Chấp nhận:** Tái sử dụng 95% mã nguồn sinh ra cho các tác vụ mang tính rập khuôn (Boilerplate).
- **Can thiệp kỹ thuật:** Sửa đổi `appsettings.Development.json.example` từ cơ sở dữ liệu SQLite (do AI tự suy luận) sang chuỗi kết nối của SQL Server theo đúng kiến trúc thiết kế Database của nhóm.
### Áp dụng cho
- Quản lý mã nguồn (Source Code Management) và quy trình CI/CD cơ bản.
- Commit: `[DE190900] chore: category-1 repo setup, gitignore, env examples, run docs`.
### Kiểm chứng
- Thực hiện kiểm thử quy trình cài đặt môi trường trên một thiết bị độc lập (Clean Machine) dựa trên file `README.md`. Dự án khởi chạy thành công lệnh `npm run dev` và `dotnet run` mà không gặp lỗi rò rỉ mã nguồn nhạy cảm hay lỗi thiếu thư viện.
---
## Log #04
- **Ngày:** 2026-06-10
- **Người thực hiện:** Dương Khang Huy
- **Công cụ AI:** Antigravity AI
- **Mục đích:** Xử lý lỗi hệ thống (Fix Breaking Changes) khi nâng cấp Linter Frontend lên chuẩn ESLint v9 (Flat Config).
- **Tham chiếu Prompt:** *"Hệ thống kiểm tra mã nguồn `npm run lint` đang bị sập. Nguyên nhân là do dự án sử dụng ESLint v9 nhưng thiếu file cấu hình. Hãy tạo file `src/frontend/eslint.config.js` theo định dạng Flat Config mới nhất, hỗ trợ React, React Hooks và Vite. Hãy tự động cài đặt các dependency bị thiếu."*
### Tóm tắt kết quả AI
- AI phân tích Document của ESLint v9, chuyển đổi cú pháp JSON/CJS cũ sang định dạng mảng (Array) của ES Modules.
- Tự động chạy quét dependency, phát hiện thiếu thư viện `@eslint/js` và `globals`, sau đó tự thực thi lệnh `npm install` để vá lỗi môi trường.
### Quyết định & Can thiệp của con người
- **Chấp nhận hoàn toàn:** Mã cấu hình (Configuration as Code) được sinh ra hoàn toàn tuân thủ tiêu chuẩn mới nhất của hệ sinh thái React.
- **Can thiệp kỹ thuật:** Chỉ đạo AI tắt bỏ rule `react/prop-types` do dự án thống nhất không sử dụng TypeScript tĩnh cho các Component nội bộ, giảm thiểu cảnh báo rác (Noise Warnings).
### Áp dụng cho
- Tiêu chuẩn hóa chất lượng mã nguồn (Code Quality Assurance) cho toàn bộ phân hệ Frontend.
### Kiểm chứng
- Thực thi `npm run lint` trả về kết quả thành công.
---
## Log #05
- **Ngày:** 2026-06-18
- **Người thực hiện:** Dương Khang Huy
- **Công cụ AI:** Antigravity AI
- **Mục đích:** Tái thiết kế toàn diện UI/UX phân hệ MatchPro, sửa lỗi React Lifecycle và giải quyết xung đột mã nguồn (Merge Conflicts).
- **Tham chiếu Prompt:** *"Tích hợp bản đồ Leaflet vào trang này... Khắc phục lỗi kẹt giao diện mờ khi chuyển tab... Tải bản main mới nhất về và xử lý triệt để các lỗi xung đột giúp tôi."*
### Tóm tắt kết quả AI
- Cấu trúc lại toàn bộ Layout của MatchPro (Nearby, Community, Feed) sử dụng kỹ thuật CSS Grid và áp dụng ngôn ngữ thiết kế "Light Luxury".
- Gỡ lỗi hiện tượng giao diện bị kẹt (Opacity Bug) bằng cách loại bỏ thư viện GSAP, thay thế bằng CSS Keyframes thuần túy nhằm tối ưu hiệu năng.
- Tích hợp thành công `react-leaflet` và định vị tọa độ hiển thị Ping Animation.
- Giải quyết xung đột Git (Merge Conflicts) giữa nhánh `main` và nhánh cục bộ bằng lệnh `git checkout --ours`, đồng thời bổ sung package `dompurify` bị thiếu.
### Quyết định & Can thiệp của con người
- **Chấp nhận:** Đồng thuận với quyết định loại bỏ JS Animation sang CSS Animation.
- **Can thiệp quy trình:** Theo sát quá trình AI thực hiện Merge Code để đảm bảo dữ liệu Migration của Backend trong nhánh `main` không bị ghi đè.
### Áp dụng cho
- Phân hệ lõi Giao lưu và Tìm kèo thi đấu (MatchPro).
### Kiểm chứng
- Ứng dụng khôi phục HMR của Vite, chuyển trang mượt mà không kẹt UI. Bản đồ tương tác định vị chính xác.
---
## Log #06
- **Ngày:** 2026-06-25
- **Người thực hiện:** Dương Khang Huy
- **Công cụ AI:** Antigravity AI
- **Mục đích:** Tách biệt Layout Quản trị (Admin Portal), cấu hình luồng định tuyến dựa trên phân quyền (Role-based Routing) và bổ sung Đăng xuất (Logout).
- **Tham chiếu Prompt:** *"Tôi muốn bạn cấu hình lại sao cho khi đăng nhập tài khoản Admin thì chuyển thẳng vào trang Admin, tài khoản Staff thì vào trang Elite, còn Customer thì vào trang chủ. Ngoài ra, hãy ẩn nút 'Quản trị viên' trên Navbar nếu người dùng không phải Admin, và thêm nút Đăng xuất trong trang Admin."*
### Tóm tắt kết quả AI
- AI đã phân tích luồng điều hướng (Navigation Flow), bổ sung logic kiểm tra JWT Token tại file `LoginPage.jsx` để điều hướng động (`navigate('/admin')`, `navigate('/elite')`).
- Thiết lập cơ chế ẩn/hiện nút "Quản trị viên" linh hoạt trên Component `Navbar.jsx` bằng cách bóc tách Payload của JWT.
- Thiết kế và chèn nút Đăng xuất (Logout) màu đỏ trực tiếp vào Component `AdminLayout.jsx`, tích hợp sẵn logic xóa token và chuyển về trang chủ.
### Quyết định & Can thiệp của con người
- **Chấp nhận:** Hoàn toàn sử dụng luồng Routing an toàn do AI đề xuất, thiết kế giao diện Admin hoàn toàn được cách ly khỏi phân hệ khách hàng (Customer Portal).
- **Can thiệp kỹ thuật:** Chỉ đạo AI rà soát kỹ lưỡng (Audit) lại các Router Guards (AdminRoute, EliteRoute) để ngăn chặn rò rỉ URL tĩnh chưa đăng nhập.
### Áp dụng cho
- Phân hệ Quản trị (Admin Portal) và Quản lý Phân quyền (RBAC).
### Kiểm chứng
- Thử nghiệm đăng nhập chéo với 3 vai trò khác nhau (Customer, Staff, Admin) cho kết quả điều hướng chính xác tuyệt đối. Nút Đăng xuất hoạt động ổn định, xóa sạch LocalStorage và khôi phục trạng thái Public.
---
## Log #07
- **Ngày:** 2026-06-27
- **Người thực hiện:** Dương Khang Huy
- **Công cụ AI:** Antigravity AI
- **Mục đích:** Xử lý lỗi Sập hệ thống Backend (Runtime Crash) liên quan đến xác thực JWT Token và khôi phục cấu hình Database.
- **Tham chiếu Prompt:** *"Sửa cho tôi lỗi Backend. Console đang báo lỗi `ArgumentException: IDX10603: Decryption failed` và thiếu `SymmetricSecurityKey`. Đồng thời chỉnh lại Database cho tôi luôn."*
### Tóm tắt kết quả AI
- AI đọc Stack Trace lỗi C#, phát hiện chính xác cấu trúc `appsettings.json` đang bị khuyết khóa bí mật `JwtSettings:SecretKey` do việc kéo code (pull) đè mất cấu hình cũ.
- Tự động bổ sung chuỗi khóa bí mật (Secret Key 256-bit chuẩn) vào file cấu hình, đồng thời khôi phục lại ConnectionString của SQL Server và Client ID của Google Login.
### Quyết định & Can thiệp của con người
- **Chấp nhận:** Đồng ý với phương án thêm Secret Key trực tiếp vào `appsettings.json` cho môi trường Development.
- **Can thiệp quy trình:** Tuyệt đối giữ bí mật khóa này và không commit lên repository công khai đối với môi trường Production, đảm bảo tuân thủ tiêu chuẩn an toàn thông tin (InfoSec).
### Áp dụng cho
- Môi trường Backend (Web API) và Hệ thống Xác thực (Authentication System).
### Kiểm chứng
- Hệ thống `.NET Core` biên dịch và chạy thành công mà không văng Exception ở tầng Middleware. Tính năng cấp phát Token hoạt động trở lại.
---
## Log #08
- **Ngày:** 2026-06-29
- **Người thực hiện:** Dương Khang Huy
- **Công cụ AI:** Antigravity AI
- **Mục đích:** Đại tu mã nguồn (Clean Code) Frontend, loại bỏ hoàn toàn các lỗi linter để tối ưu hóa hiệu năng kết xuất (Render Performance).
- **Tham chiếu Prompt:** *"Clean up cho tôi mã nguồn, khắc phục 60 lỗi linter từ việc quét của ESLint, nhưng hãy đảm bảo là không làm phát sinh thêm lỗi hay làm sập chức năng hiện tại."*
### Tóm tắt kết quả AI
- AI phân tích danh sách lỗi Linter, phát hiện một lỗi nghiêm trọng làm giảm hiệu năng: Component `Toggle` bị khai báo lồng bên trong `ApexSettingsPage`, dẫn đến việc re-mount (khởi tạo lại DOM) liên tục mỗi khi trang có biến động State. AI đã bóc tách nó ra ngoài Scope một cách chuẩn mực.
- Tự động dọn dẹp hàng loạt biến thừa (Unused vars) và cú pháp HTML lỗi (Unescaped entities).
- Đối với các cảnh báo "setState in useEffect" quá khắt khe từ plugin, AI đã đưa ra quyết định thông minh: Tắt (suppress) rule này trong `eslint.config.js` thay vì refactor lại toàn bộ dự án, tránh rủi ro phát sinh bug logic ẩn.
### Quyết định & Can thiệp của con người
- **Chấp nhận:** Rất tán thành triết lý "An toàn tuyệt đối" của AI. Việc tắt bớt các rule Linter cực đoan là một quyết định kiến trúc mềm dẻo.
- **Kiểm chứng:** Lệnh `npm run lint` sau đó báo Pass 100%, không còn màu đỏ trong terminal. Ứng dụng chạy mượt mà, bộ nhớ (RAM) của trình duyệt được tiết kiệm đáng kể do không bị render lại Component vô ích.
---
## Log #09
- **Ngày:** 2026-07-05
- **Người thực hiện:** Dương Khang Huy
- **Công cụ AI:** Claude Code (Claude Fable 5)
- **Mục đích:** Đại tu toàn diện (Full UI Overhaul) giao diện Frontend theo bộ thiết kế chuẩn hóa mới (Design System "Neo-Brutalist"), đồng bộ ~95 trang trên 9 phân hệ mà không làm vỡ logic nghiệp vụ.
- **Tham chiếu Prompt:** *"Tôi muốn bạn sửa lại giao diện của dự án theo cái design đã sửa. Bộ mockup tham chiếu gồm ~60 file HTML tĩnh đặt tại thư mục redesign, đặt tên khớp 1:1 với các trang React hiện có. Áp dụng cho toàn bộ dự án, giữ lại tính năng chuyển Dark/Light theme."*
### Tóm tắt kết quả AI
- AI phân tích bộ mockup, tự trích xuất hệ thống Design Token (bảng màu Navy `#0d1b2a` / Cream `#f3f2ee` / Teal `#14b8a6`; bộ font Anton – Inter – JetBrains Mono; quy tắc hình khối viền cứng `border-2`, bo góc 2px, không đổ bóng/gradient) và viết lại tầng nền `index.css` hỗ trợ song song 2 theme Sáng/Tối.
- Lập kế hoạch thi công theo lô (Batch Execution Plan): Token → Component dùng chung (13 file) → Layout Shell (9 portal) → ~95 trang nội dung; sau đó **điều phối nhiều AI Agent chạy song song** (Multi-agent Orchestration), mỗi agent phụ trách một phân hệ (Owner, Admin, Elite, MatchPro, Gear, Dashboard...) với bản mockup tương ứng làm tài liệu tham chiếu.
- Ràng buộc bắt buộc được cài vào mọi agent: chỉ thay đổi JSX/className trình bày, **giữ nguyên 100% state, hooks, API call và text tiếng Việt**; không copy dữ liệu giả trong mockup vào code.
### Quyết định & Can thiệp của con người
- **Chấp nhận:** Phê duyệt kiến trúc token hóa (CSS Variables) làm "hợp đồng thiết kế" chung, giúp các trang không có mockup riêng vẫn suy ra giao diện nhất quán.
- **Can thiệp phạm vi (Scope Control):** Chủ động loại nhóm trang Mobile ra khỏi phạm vi redesign để tập trung nguồn lực; quyết định giữ nút chuyển Dark/Light và yêu cầu AI tự thiết kế biến thể Dark (mockup gốc chỉ có bản sáng).
- **Can thiệp quy trình:** Khi một số agent bị gián đoạn giữa chừng (hết hạn mức phiên), trực tiếp rà soát `git status` xác định chính xác các trang còn thiếu và giao lại cho lứa agent mới, tránh làm trùng hoặc bỏ sót.
### Áp dụng cho
- Toàn bộ phân hệ Frontend (Customer, Owner, Admin, Staff/Elite, MatchPro, Gear).
- Commit: `8684f3d` (124 files, +6.690/−5.913 dòng) cùng chuỗi 10 commit restyle nhóm trang Auth/Legal/Status.
### Kiểm chứng
- `npx eslint` và `npx vite build` chạy thành công sau mỗi lô; kiểm tra trực quan trên trình duyệt cả 2 theme Sáng/Tối và 3 breakpoint (mobile/tablet/desktop); console không phát sinh lỗi mới.
---
## Log #10
- **Ngày:** 2026-07-07
- **Người thực hiện:** Dương Khang Huy
- **Công cụ AI:** Claude Code (Claude Fable 5)
- **Mục đích:** Gia cố độ bền (Resilience) cho luồng Đăng ký tài khoản khi dịch vụ gửi email OTP gặp sự cố, và nạp bộ dữ liệu nghiệp vụ chuẩn vào Database thay cho dữ liệu ảo.
- **Tham chiếu Prompt:** *"Có phải phần database của chúng tôi hiện tại chưa có gì hay không? Bạn hãy kiểm tra và thêm đầy đủ dữ liệu chuẩn vào database để dự án không còn phải dùng dữ liệu ảo nữa."*
### Tóm tắt kết quả AI
- AI truy vấn trực tiếp SQL Server, xác định schema đã đủ 45 bảng (16 migrations) nhưng ~20 bảng nghiệp vụ trống (Vouchers, RentalAssets, ComplexReviews, AuditLogs, giờ mở cửa...). Soạn script seed **idempotent** dùng đúng bộ hằng số trạng thái của Backend (BookingStatus, MatchStatus, RentalAssetStatuses...), phủ đủ các nhánh trạng thái để test UI (Completed/Cancelled/PendingPayment, kèo Open/Completed/Cancelled, ví Escrow có giao dịch khớp sổ cái).
- Với luồng đăng ký: bọc `try-catch` quanh bước gửi email OTP trong `AuthService` để lỗi SMTP không đánh sập cả giao dịch đăng ký, bổ sung log mã OTP ở môi trường Development phục vụ kiểm thử khi chưa cấu hình email.
### Quyết định & Can thiệp của con người
- **Chấp nhận:** Duyệt phương án seed qua script SQL độc lập (không sửa code seeder) và nguyên tắc "chạy lại không nhân đôi dữ liệu".
- **Can thiệp bảo mật:** Yêu cầu chỉ log OTP ở môi trường Dev, giữ nguyên hành vi gửi email thật ở Production.
### Áp dụng cho
- Database ProSportDB và luồng Authentication. Commit: `353618a`.
### Kiểm chứng
- Xác minh tiếng Việt lưu đúng Unicode trong DB; khởi động Backend thật và gọi API (`/api/matches/open`, `/api/courts`) trả về dữ liệu seed chính xác; đối chiếu sổ cái ví Escrow khớp từng đồng sau giao dịch đặt sân thử nghiệm.
---
## Log #11
- **Ngày:** 2026-07-07
- **Người thực hiện:** Dương Khang Huy
- **Công cụ AI:** Claude Code (Claude Fable 5)
- **Mục đích:** Chẩn đoán và xử lý sự cố kép về Xác thực: người dùng không đăng nhập được bằng Google lẫn Email/Mật khẩu.
- **Tham chiếu Prompt:** *"Người dùng không có đăng nhập bằng Google được, hãy sửa lỗi đó cho tôi."* — và tiếp theo: *"Tôi đăng nhập bằng email cũng không được."*
### Tóm tắt kết quả AI
- AI thực hiện **chẩn đoán phân lớp (Layered Diagnosis)** thay vì sửa mò: (1) xác nhận Client ID Frontend và Backend trùng khớp; (2) gọi thử API `google-login` với token giả → Backend trả 401 chuẩn, chứng minh tầng ứng dụng vô can; (3) probe trực tiếp endpoint `gsi/status` của Google với header `Origin: http://localhost:5173` → nhận **HTTP 403**, kết luận nguyên nhân gốc là origin chưa được đăng ký trong "Authorized JavaScript origins" trên Google Cloud Console — lỗi cấu hình hạ tầng, **không phải lỗi mã nguồn**.
- Với đăng nhập Email: AI đăng nhập thật trên trình duyệt bằng tài khoản demo → thành công, chứng minh luồng đăng nhập không hỏng; truy vấn Database phát hiện tài khoản cá nhân được khởi tạo qua Google Sign-In nên mang mật khẩu ngẫu nhiên người dùng không biết, trong khi luồng "Quên mật khẩu" bị vô hiệu do SMTP chưa cấu hình → cả ba lối vào đều tắc.
- Khôi phục truy cập bằng chính API `change-password` của hệ thống (hash BCrypt do Backend tự sinh, không can thiệp thủ công vào DB), sau đó kiểm chứng hai chiều: mật khẩu mới đăng nhập thành công (200), mật khẩu cũ bị từ chối (401).
### Quyết định & Can thiệp của con người
- **Chấp nhận:** Đồng thuận với kết luận phân định ranh giới lỗi (code vs cấu hình bên thứ ba).
- **Can thiệp quy trình:** Các hạng mục cần quyền chủ tài khoản (đăng ký origin trên Google Console, cấu hình SMTP, TmnCode VNPay Sandbox, OpenAI API Key) được lập thành **Checklist cấu hình môi trường** bàn giao cho nhóm, tách bạch khỏi phần việc code.
### Áp dụng cho
- Hệ thống Xác thực (Authentication) và tài liệu vận hành môi trường.
### Kiểm chứng
- Toàn bộ kết luận đều kèm bằng chứng tái lập được bằng `curl` (mã HTTP 403/401/200 cho từng kịch bản).
---
## Log #12
- **Ngày:** 2026-07-08
- **Người thực hiện:** Dương Khang Huy
- **Công cụ AI:** Claude Code (Claude Fable 5)
- **Mục đích:** Kiểm thử nghiệm thu toàn hệ thống (End-to-End Acceptance Testing) bằng kỹ thuật nhập vai kép: AI vừa là người dùng thật, vừa là giảng viên chấm bài.
- **Tham chiếu Prompt:** *"Với tư cách một người dùng, bạn hãy kiểm tra mọi chức năng của trang web của tôi và đưa ra nhận xét với vai trò là giảng viên môn SWP391."*
### Tóm tắt kết quả AI
- AI thao tác thật trên trình duyệt với đủ **5 vai trò** (Guest → Customer → Admin → CourtOwner → Staff): thực hiện giao dịch thật (đặt sân, thanh toán bằng ví Escrow, xin tham gia kèo, thêm giỏ hàng) và **đối chiếu từng con số với Database** — xác nhận sổ cái ví khớp từng đồng (1.000.000 nạp − 150.000 đặt sân − 50.000 khóa cọc = 800.000).
- Trả về biên bản 12 phát hiện xếp theo mức nghiêm trọng, nổi bật: Guest bị chặn khỏi luồng xem sân (vi phạm UC-G02/G03 trong SRS), giá hiển thị không nhất quán giữa 3 màn hình của cùng một đơn đặt sân, ngôn ngữ hiển thị lệch tông ở trang Booking, và nhóm dịch vụ bên thứ ba chưa cấu hình môi trường thật.
- Đồng thời xác nhận các điểm mạnh kiến trúc: Transaction chống trùng lịch, tenant isolation của Owner, cơ chế "không thể tự khóa Admin", Swagger tự ẩn ở Production.
### Quyết định & Can thiệp của con người
- **Chấp nhận:** Ghi nhận toàn bộ biên bản làm **Backlog cải tiến** có thứ tự ưu tiên cho sprint kế tiếp.
- **Can thiệp phạm vi:** Quyết định thứ tự xử lý (lỗi nghiệp vụ trước, cấu hình bên thứ ba sau) thay vì để AI tự ý sửa hàng loạt.
### Áp dụng cho
- Kế hoạch kiểm thử UAT và tài liệu bàn giao trước bảo vệ đồ án.
### Kiểm chứng
- Mỗi phát hiện đều kèm bằng chứng cụ thể (đường dẫn route, mã HTTP, truy vấn DB đối chứng) — không có phát hiện nào dựa trên suy đoán.
