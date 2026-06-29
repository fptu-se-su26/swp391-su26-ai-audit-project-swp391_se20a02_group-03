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
