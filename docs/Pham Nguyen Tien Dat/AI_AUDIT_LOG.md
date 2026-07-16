# AI Audit Log



## Log #01
- **Ngày:** 2026-05-20
- **Người thực hiện:** Phạm Nguyễn Tiến Đạt
- **Công cụ AI:** Google Gemini
- **Mục đích:** Tạo prompt để hướng dẫn Stitch thiết kế giao diện web UI.
- **Tham chiếu Prompt:** Prompt #01 — *"Đóng vai trò là một Chuyên gia Thiết kế UI/UX (UX/UI Designer), hãy xây dựng một bộ Meta-Prompt bằng tiếng Anh chuẩn xác để làm đầu vào cho nền tảng Stitch By Google. Yêu cầu hệ thống thiết kế bộ giao diện tĩnh cho dự án Pro-Sport Complex Management System, bao gồm trang chủ, danh sách sân và Dashboard thống kê mang phong cách thể thao, năng động."*

### Tóm tắt kết quả AI
- AI đóng vai trò Designer, phân tích các thành phần cần thiết và trả về một bộ prompt tiếng Anh chi tiết được tối ưu cho Stitch.
- Đề xuất bảng màu thể thao, năng động, bố cục trang chủ, màn hình danh sách sân và giao diện dashboard với các biểu đồ thống kê cơ bản.

### Quyết định & Can thiệp của con người
- **Chấp nhận:** Sử dụng nguyên cấu trúc prompt tiếng Anh và các gợi ý bố cục UI.
- **Can thiệp kỹ thuật:** Tùy chỉnh lại tone màu trong prompt của AI để khớp với nhận diện thương hiệu đã chốt của nhóm. Thêm yêu cầu cụ thể hiển thị form thanh toán chi tiết (Payment UI) mà ban đầu AI bỏ sót.

### Áp dụng cho
- Prompt đầu vào cho công cụ Stitch By Google.

### Kiểm chứng
- Đánh giá độ hoàn thiện của prompt được tạo ra. Hướng thiết kế giao diện có độ chính xác cao, mặc dù vẫn cần tinh chỉnh thủ công một chút để các component khớp hoàn toàn với luồng người dùng (User Flow).

---

## Log #02
- **Ngày:** 2026-05-21
- **Người thực hiện:** Phạm Nguyễn Tiến Đạt
- **Công cụ AI:** Stitch By Google
- **Mục đích:** Tạo UI và code Frontend tĩnh dựa trên prompt đã chuẩn bị.
- **Tham chiếu Prompt:** Prompt #02 — *"Design a clean, modern, and highly responsive dashboard for a sports complex management system. Include a comprehensive sidebar for global navigation, a main data-visualization area, and ensure the overall layout adheres to premium aesthetic standards with our designated sports color palette."*

### Tóm tắt kết quả AI
- Sinh ra mã nguồn (HTML/CSS/JS) cho một giao diện web trực quan.
- Tạo layout trang Dashboard, thanh điều hướng (Navbar/Sidebar), và các component hiển thị trạng thái sân (trống/đã đặt/đang bảo trì).

### Quyết định & Can thiệp của con người
- **Chấp nhận:** Sử dụng toàn bộ cấu trúc Layout, lưới (Grid/Flexbox) và mã màu CSS cho các trang lõi.
- **Can thiệp kỹ thuật 1 (Tách Component):** Bóc tách HTML tĩnh nguyên khối thành các module React riêng (Header, Footer, Menu) theo kiến trúc component-based.
- **Can thiệp kỹ thuật 2 (Dữ liệu động & Sửa lỗi Responsive):** Thay thế mock data bằng dữ liệu động, tinh chỉnh CSS để responsive tốt hơn trên thiết bị di động.

### Áp dụng cho
- Các file `.jsx` (Header, Footer, Menu).
- Các layout UI Frontend.

### Kiểm chứng
- Đối chiếu giao diện thực tế với bản nháp do Stitch sinh ra để đảm bảo tính đồng bộ về màu sắc và layout.
- Tiến hành test trực quan trên cả màn hình PC và Mobile bằng DevTools của trình duyệt.

---

## Log #03
- **Ngày:** 2026-05-22
- **Người thực hiện:** Phạm Nguyễn Tiến Đạt
- **Công cụ AI:** Antigravity
- **Mục đích:** Thiết kế và sinh mã nguồn cho các React UI Component.
- **Tham chiếu Prompt:** Prompt #03 — *"Phát triển một tập hợp các Functional Components trong React để xử lý biểu mẫu đặt sân (Court Booking Form). Các thành phần cần đảm bảo tính Responsive, sử dụng Tailwind CSS để styling và tích hợp quản lý trạng thái (State Management) với các trường chọn ngày, giờ và loại sân."*

### Tóm tắt kết quả AI
- Trả về một cấu trúc React Functional Component hoàn chỉnh.
- Bao gồm các hook cơ bản (`useState`) để quản lý trạng thái form và các thẻ JSX được style bằng các class Tailwind CSS.

### Quyết định & Can thiệp của con người
- **Chấp nhận:** Tái sử dụng toàn bộ cấu trúc JSX và class Tailwind CSS cho form đặt sân, hiển thị danh sách sân và component Dashboard.
- **Can thiệp kỹ thuật 1 (Tái cấu trúc - Refactoring):** Tách nhỏ mã code nguyên khối do AI sinh ra thành các React Component có thể tái sử dụng (ví dụ: `Button`, `InputField`, `CourtCard`).
- **Can thiệp kỹ thuật 2 (Tích hợp API & Validation):** Tự viết tay logic gọi API (Axios) để lấy dữ liệu sân thực tế từ Java Backend thay vì dùng dữ liệu tĩnh. Thêm logic validation cho form để chặn người dùng chọn ngày trong quá khứ trước khi submit.

### Áp dụng cho
- `BookingForm.jsx`
- `Dashboard.jsx`
- Thư viện UI Component (`Button`, `InputField`, `CourtCard`)

### Kiểm chứng
- Các component được chạy và test trong môi trường `localhost:3000`.
- Mở tab Network và Console trong Chrome DevTools để theo dõi các component render thừa và đảm bảo việc gọi API tuân thủ chuẩn RESTful.

---

## Log #04
- **Ngày:** 2026-05-28
- **Người thực hiện:** Phạm Nguyễn Tiến Đạt
- **Công cụ AI:** Antigravity
- **Mục đích:** Tích hợp hiệu ứng GSAP, sửa lỗi môi trường Vite và xây dựng 10 trang UI hoàn chỉnh.
- **Tham chiếu Prompt:** Prompt #04 — *"Đóng vai trò là một Chuyên gia Kỹ sư Frontend (Senior Frontend Engineer), hãy thực hiện nâng cấp toàn diện ứng dụng React (Vite) hiện tại. Yêu cầu tích hợp thư viện GSAP để xử lý các hiệu ứng cuộn (Scroll Animation), đồng thời xây dựng hoàn chỉnh 10 trang UI thuộc phân hệ Apex và MatchPro tuân thủ chặt chẽ kiến trúc Component-Driven."*

### Tóm tắt kết quả AI
- Đề xuất cài đặt thư viện `gsap` và `@gsap/react`.
- Tạo form UI cho 6 trang phân hệ Apex (Booking, Matches, Shop, Profile, Settings, Support).
- Tạo layout và 4 trang cho phân hệ MatchPro (Trending Feed, Nearby Sports, Community Hub, Leaderboard).

### Quyết định & Can thiệp của con người
- **Chấp nhận:** Áp dụng toàn bộ cấu trúc UI và CSS layout do AI gợi ý.
- **Can thiệp kỹ thuật 1 (Tái cấu trúc code):** Nhận thấy việc viết code animation trực tiếp vào component gây rối mắt. Đã quyết định tách logic GSAP thành các custom hooks (`useScrollReveal`, `useNavbarEntrance`) để tái sử dụng và giúp code sạch hơn.
- **Can thiệp kỹ thuật 2 (Sửa lỗi môi trường):** Tự chẩn đoán và cấu hình lại `vite.config.js` để ignore thư mục `.vs`. Việc này đã giải quyết dứt điểm lỗi crash server `EBUSY` — một vấn đề mà AI ban đầu không lường trước được do đặc thù máy tính cá nhân.

### Áp dụng cho
- `vite.config.js`
- `App.jsx`
- `src/hooks/`
- `src/pages/apex/` & `src/pages/matches/`

### Kiểm chứng
- Server Vite hiện tại chạy ổn định mà không bị crash khi hot-reload.
- Giao diện render hoàn hảo tại các route `/apex` và `/matches`, với hiệu ứng cuộn và animation xuất hiện mượt mà.

---

## Log #05
- **Ngày:** 2026-05-29 
- **Người thực hiện:** Phạm Nguyễn Tiến Đạt  
- **Công cụ AI:** Antigravity  
- **Mục đích:** Xây dựng toàn bộ hệ thống giao diện đa phân hệ (Elite OS, Mobile App, Admin Portal, Shop, Public Pages, Status Pages).  
- **Tham chiếu Prompt:** Prompt #05 — *"Dựa trên bộ tài liệu thiết kế (Mockups/Wireframes) được đính kèm, hãy triển khai toàn bộ mã nguồn Frontend bằng thư viện React. Phân rã giao diện thành 40+ trang UI thuộc 6 phân hệ (Elite OS, Mobile App, Admin Portal, Shop, Public Pages), đảm bảo độ trung thực cao nhất (Pixel-perfect) so với thiết kế gốc và thiết lập cấu trúc Routing toàn cục."*

### Tóm tắt kết quả AI
- Sinh ra **40+ React pages** phủ khắp 6 phân hệ độc lập từ ảnh thiết kế:
  - **Public Pages (7 trang):** `HomePage`, `LoginPage`...
  - **Admin Portal (8 trang):** `AdminDashboardPage`, `AdminUsersPage`...
  - **EliteSport OS (6 trang):** `EliteDashboardPage`, `EliteSchedulePage`...
  - **Mobile App (8 trang):** `MobileHomePage`, `MobileDashboardPage`...
  - **Shop (5 trang):** `ShopPage`, `ShopProductPage`...
  - **Status Pages (3 trang):** `NotFoundPage`, `RestrictedPage`, `MaintenancePage`
- Tạo **7 Layout Component** riêng biệt và thiết lập hệ thống routing trong `App.jsx`.

### Quyết định & Can thiệp của con người
- **Chấp nhận:** Tái sử dụng toàn bộ cấu trúc JSX, CSS, và logic routing do AI sinh ra làm nền tảng.
- **Can thiệp kỹ thuật 1 (Sửa lỗi Build — Entry Point):** AI sinh ra file `index.html` với đường dẫn script trỏ sai. Tự phát hiện và sửa thủ công.
- **Can thiệp kỹ thuật 2 (Sửa lỗi Routing):** AI để comment toàn bộ các route Public trong `App.jsx` khiến trang chủ trả về 404. Tự bổ sung và uncomment toàn bộ.
- **Can thiệp kỹ thuật 3 (Sửa lỗi CSS):** AI sử dụng selector CSS `:has()` không được hỗ trợ trên Firefox. Xóa bỏ toàn bộ, thay bằng class thông thường.
- **Can thiệp kỹ thuật 4 (Sửa lỗi Navigation):** Xóa toàn bộ các link không hợp lệ trong `AdminLayout` sinh ra lỗi 404.
- **Can thiệp kỹ thuật 5 (Sửa lỗi Layout Mobile):** Chuyển đổi `position: absolute` sang `position: sticky` để thanh input/nút không chồng lấp nội dung.

### Áp dụng cho
- `src/frontend/src/App.jsx`
- `src/frontend/index.html`
- `src/frontend/src/layouts/`
- `src/frontend/src/pages/`
- `src/frontend/src/components/AIChatbot.jsx`

### Kiểm chứng
- Chạy `npm run build` xác nhận **0 lỗi**.
- Duyệt thủ công 40+ route trên `localhost:5173`.
- Kiểm tra giao diện Mobile trên Chrome DevTools ở kích thước 414px.

---

## Log #06
- **Ngày:** 2026-06-01  
- **Người thực hiện:** Phạm Nguyễn Tiến Đạt  
- **Công cụ AI:** Antigravity (Gemini)  
- **Mục đích:** Hoàn thiện phân hệ Gear (Trang thông tin & phụ trợ) và chuẩn hóa đa ngôn ngữ (Tiếng Anh).  
- **Tham chiếu Prompt:** Prompt #06 — *"Thực hiện quy trình Quốc tế hóa (Internationalization/Localization) bằng cách rà soát và chuyển đổi toàn bộ ngữ cảnh tiếng Việt sang tiếng Anh trên toàn hệ thống. Đồng thời, thiết kế và phát triển hoàn thiện mã nguồn cho 4 trang phụ trợ thuộc phân hệ Gear (Equipment Catalog, Rental Terms, Support, Privacy)."*

### Tóm tắt kết quả AI
- Quét và dịch các từ khóa tiếng Việt còn sót lại sang tiếng Anh để chuẩn hóa giao diện.
- Tạo mới mã nguồn hoàn chỉnh cho 4 trang phụ trợ của phân hệ Gear: Equipment Rental Terms, Maintenance Tracking, Support Hub, Privacy Policy.
- Tự động cập nhật `App.jsx` để thêm route và chỉnh sửa `GearLayout.jsx`.

### Quyết định & Can thiệp của con người
- **Chấp nhận:** Áp dụng toàn bộ nội dung, layout và CSS nội bộ do AI sinh ra cho 4 trang thuộc phân hệ Gear.
- **Can thiệp kỹ thuật 1 (Xử lý sự cố API Quota):** AI sinh luồng dịch thuật tự động quá nhiều gây lỗi 429 Resource Exhausted. Tự quyết định dừng luồng ngang và chủ động thu hẹp phạm vi.
- **Can thiệp kỹ thuật 2 (Định tuyến SPA):** Thay thế toàn bộ thẻ anchor `href` do AI thiết kế tĩnh bằng component `<Link>` của React Router để giữ vững cấu trúc SPA.

### Áp dụng cho
- `src/frontend/src/pages/gear/*` (RentalTerms, Maintenance, Support, Privacy)
- `src/frontend/src/layouts/GearLayout.jsx`

### Kiểm chứng
- Thực thi lệnh `npm run build` đóng gói thành công.
- Xác nhận điều hướng qua lại giữa Catalog, Rentals, Dashboard hoạt động trơn tru.

---

## Log #07
- **Ngày:** 2026-06-04  
- **Người thực hiện:** Phạm Nguyễn Tiến Đạt  
- **Công cụ AI:** Antigravity 
- **Mục đích:** Khởi tạo CI Pipeline, nâng cấp toàn diện trang About và hoàn thiện các trang Chính sách pháp lý (Legal) & Nền tảng (Platform).  
- **Tham chiếu Prompt:** Prompt #07 — *"Khởi tạo và cấu hình luồng tích hợp liên tục (CI Pipeline) trên nền tảng Harness bao gồm các stage Build Frontend và Backend. Tiếp theo, đập đi xây lại (Overhaul) trang AboutPage và phát triển các trang Chính sách pháp lý (Legal Pages), đặc biệt chú trọng thiết kế giao diện cao cấp (Cinematic UI) tích hợp hiệu ứng GSAP cho trang Brand Mission."*

### Tóm tắt kết quả AI
- Thiết lập thành công hệ thống Harness CI pipeline với 3 stage.
- Xây dựng lại toàn bộ trang `AboutPage.jsx` với nội dung thực tế kèm hiệu ứng GSAP ScrollTrigger cao cấp.
- Sinh ra 3 trang chính sách pháp lý: `PrivacyPolicyPage`, `TermsOfServicePage` và `SitemapPage`.
- Khởi tạo trang chuyên đề `BrandMissionPage.jsx` với giao diện Cinematic.

### Quyết định & Can thiệp của con người
- **Chấp nhận:** Sử dụng toàn bộ config CI Pipeline và thiết kế giao diện Premium UI.
- **Can thiệp kỹ thuật 1 (Sửa lỗi Môi trường):** Bổ sung các package bị thiếu sau khi pull code để dev server khởi động thành công.
- **Can thiệp kỹ thuật 2 (Sửa lỗi Định tuyến):** Can thiệp thay thẻ `<a href="/register">` bằng component `<Link to="/register">` giúp ứng dụng bám đúng base path của Vite.

### Áp dụng cho
- `.harness/prosport_ci_pipeline.yaml`
- `src/frontend/src/pages/AboutPage.jsx` & nhóm trang `legal/`, `platform/`
- `src/frontend/src/App.jsx` & `Footer.jsx`

### Kiểm chứng
- Lệnh `npm run build` chạy thành công. Test điều hướng trực tiếp trên trình duyệt hoạt động chuẩn xác.

---

## Log #08
- **Ngày:** 2026-06-11
- **Người thực hiện:** Phạm Nguyễn Tiến Đạt
- **Công cụ AI:** Antigravity
- **Mục đích:** Sửa lỗi điều hướng tính năng "Discover" trong Footer, bổ sung GSAP animation cho trang Contact và chuẩn hóa hệ thống Keyframe animation toàn cục.
- **Tham chiếu Prompt:** Prompt #08 — *"Khắc phục lỗi điều hướng Hash-scroll của React Router tại Footer. Tiến hành chuẩn hóa và tối ưu hóa hệ thống Keyframe Animations (GSAP ScrollTrigger) trên toàn dự án để tạo sự nhất quán về trải nghiệm (UX). Revert các thử nghiệm đổi màu nền (Dark Theme) về nguyên bản (Light Theme) nhưng bắt buộc phải bảo lưu cấu trúc mã hiệu ứng chuyển động đã xây dựng."*

### Tóm tắt kết quả AI
- Chẩn đoán và sửa lỗi điều hướng link "Discover" thành `/#discover`.
- Tích hợp hook `useLocation` kết hợp `useEffect` để xử lý hash-scroll mượt mà.
- Viết lại `ContactPage.jsx` với 4 GSAP ScrollTrigger animations.
- Chuẩn hóa toàn bộ keyframe CSS trong `index.css`.
- Revert màu sắc về Light Theme theo yêu cầu, chỉ giữ lại hiệu ứng animation.

### Quyết định & Can thiệp của con người
- **Chấp nhận:** Toàn bộ logic hash-scroll, cấu trúc GSAP animation và bộ keyframe chuẩn hóa.
- **Can thiệp kỹ thuật 1 (Điều chỉnh phạm vi):** Yêu cầu AI chỉ giữ lại animation GSAP, từ chối việc đổi màu sắc toàn trang sang Dark Theme để phù hợp định hướng sản phẩm.
- **Can thiệp kỹ thuật 2 (Review Logic):** Yêu cầu Code Review toàn bộ logic hash scroll trước khi commit.

### Áp dụng cho
- `Footer.jsx`, `HomePage.jsx`, `ContactPage.jsx`, `ResetPasswordPage.jsx`, `index.css`

### Kiểm chứng
- Hash-scroll hoạt động mượt từ mọi route. ScrollTrigger kích hoạt đúng thứ tự. Push commit thành công.

---

## Log #09
- **Ngày:** 2026-06-15
- **Người thực hiện:** Phạm Nguyễn Tiến Đạt
- **Công cụ AI:** Antigravity (Gemini)
- **Mục đích:** Triển khai toàn bộ cụm tính năng AI Chatbot (TK-030, TK-031, TK-032), tích hợp dữ liệu thực tế (Real-time Context) và xử lý lỗi Build/Database.
- **Tham chiếu Prompt:** Prompt #09 — *"Thiết kế và triển khai kiến trúc AI Chatbot toàn diện từ Backend đến Frontend. Tại Backend, tích hợp OpenAI API và cấu trúc System Prompt nạp dữ liệu động (Real-time Context) từ DB. Tại Frontend, xây dựng Floating Widget UI với các hiệu ứng tương tác (Typing, Pulse ring), cấu hình mount global và mở rộng giới hạn logic để biến Chatbot thành một trợ lý AI Đa nhiệm."*

### Tóm tắt kết quả AI
- **Backend (.NET):** Tích hợp `OpenAI` v2.1.0, xây dựng `ChatbotService` nạp dữ liệu động (danh sách sân, kèo mở).
- **Nâng cấp Đa nhiệm:** Tinh chỉnh System Prompt cho phép AI hoạt động đa nhiệm (code, tính toán, dịch thuật).
- **Frontend:** Thiết kế widget `AIChatbot.jsx` dạng Floating Bubble hiển thị global với đầy đủ hiệu ứng Typing, Unread badge.

### Quyết định & Can thiệp của con người
- **Chấp nhận:** Áp dụng toàn bộ kiến trúc Dependency Injection và Widget UI.
- **Can thiệp kỹ thuật 1 (Xử lý lỗi File Lock):** Can thiệp đình chỉ tiến trình Backend đang chạy ngầm để chạy `dotnet ef database update` nhằm ánh xạ thành công các Entity.
- **Can thiệp kỹ thuật 2 (Bảo mật & Quota):** Phát hiện lỗi `HTTP 429` do hết quota OpenAI API khi nạp key thật.
- **Can thiệp kỹ thuật 3 (Định hướng sản phẩm):** Yêu cầu AI mở khóa prompt khỏi các giới hạn hẹp của lĩnh vực đặt sân để nâng cao UX.

### Áp dụng cho
- `ChatbotService.cs`, `ChatController.cs`, `appsettings.json`
- `AIChatbot.jsx`, `App.jsx`

### Kiểm chứng
- Lệnh `dotnet build` và `vite build` thành công. Call API trực tiếp nhận Response tốt. Chatbot render trơn tru.

---

## Log #10
- **Ngày:** 2026-06-17
- **Người thực hiện:** Phạm Nguyễn Tiến Đạt
- **Công cụ AI:** Antigravity (Gemini)
- **Mục đích:** Tổng rà soát (Audit) mã nguồn và sửa lỗi toàn diện (Comprehensive Bug Fix) cho cả Frontend và Backend, dọn dẹp các lỗ hổng bảo mật, lỗi logic và tối ưu UX.
- **Tham chiếu Prompt:** Prompt #10 — *"Kích hoạt quy trình Kiểm thử tĩnh (Static Analysis) và Tổng rà soát mã nguồn (Code Audit). Chủ động phát hiện và tung ra các bản vá lỗi (Patch) ở tầng Bảo mật (Security), Backend Logic và Frontend UX. Áp dụng kỹ thuật Lazy Loading để tối ưu hóa hiệu năng và trực tiếp xử lý các lỗi tương thích cấu hình môi trường."*

### Tóm tắt kết quả AI
- Tự động khởi tạo Sub-agents quét toàn bộ dự án ngầm.
- Tung ra 15+ bản vá bao quát: vá lỗ hổng XSS bằng DOMPurify, bảo mật ProtectedRoute, xử lý Timezone Linux, vá lỗi lặp vô hạn, tối ưu hóa định dạng thời gian.
- Tích hợp Lazy Loading (`React.lazy()`) cho Router để tối ưu load time.

### Quyết định & Can thiệp của con người
- **Chấp nhận:** Áp dụng toàn bộ các bản vá sửa lỗi.
- **Can thiệp kỹ thuật 1 (Quản lý Version Control):** Can thiệp hủy bỏ nhánh thừa do AI tạo và ép force-push commit sang thẳng nhánh làm việc gốc `DE190147/audit-module`.
- **Can thiệp kỹ thuật 2 (Kiểm soát Merge Code):** Từ chối lệnh tự động `git merge` từ AI để giải quyết qua giao diện Pull Request.
- **Can thiệp kỹ thuật 3 (Rà soát kiến trúc Database):** Sửa lỗi SQL `Error 207` sinh ra do bất đồng bộ Enum/String.

### Áp dụng cho
- `BookingService.cs`, `AuthService.cs`, `Program.cs`
- `App.jsx`, `axiosClient.js`, các page thuộc Apex và Mobile.

### Kiểm chứng
- Build thành công, commit hơn 600 dòng code thay đổi an toàn lên GitHub.

---

## Log #11
- **Ngày:** 2026-06-18
- **Người thực hiện:** Phạm Nguyễn Tiến Đạt
- **Công cụ AI:** Antigravity (Gemini)
- **Mục đích:** Đồng bộ hóa ngôn ngữ (Việt hoá toàn hệ thống), dọn dẹp ngữ cảnh nghiệp vụ (chỉ giữ Pickleball/Cầu lông), tái cấu trúc (Refactor) giao dịch Backend và xử lý xung đột Git/Push Protection.
- **Tham chiếu Prompt:** Prompt #11 — *"Thực thi tự động hóa quy trình Việt hóa (Localization) thông qua Script quét toàn dự án. Thực hiện thanh lọc dữ liệu (Domain Sanitization), loại bỏ hoàn toàn các môn thể thao ngoại lai để cô lập ngữ cảnh nghiệp vụ vào Pickleball/Cầu lông. Tại Backend, tái cấu trúc mã (Refactor) áp dụng chuẩn Giao dịch (Transaction Isolation) an toàn cho EscrowService. Sau đó, xử lý xung đột Git (Merge Conflicts), bypass cảnh báo bảo mật Secret Scanning và đẩy code an toàn lên CodeGraph."*

### Tóm tắt kết quả AI
- Viết script ngầm (`auto-translate-all.js`, `remove-sports.js`) dịch và thay thế chuỗi tự động cho 40+ trang UI. Loại bỏ các môn thể thao ngoài luồng.
- Refactor `EscrowService.cs` áp dụng `IDbContextTransaction` chống lỗi Data Race.
- Nhận diện và tự động hợp nhất (merge) code xung đột tại `GearRentalPage.jsx`.

### Quyết định & Can thiệp của con người
- **Chấp nhận:** Áp dụng toàn bộ kiến trúc giao dịch (Transaction) và ngôn ngữ hiển thị.
- **Can thiệp kỹ thuật 1 (Rollback thiết kế thừa):** Buộc AI khôi phục nguyên bản thiết kế CSS bị phá vỡ trong quá trình tự động dịch thuật.
- **Can thiệp kỹ thuật 2 (Bypass Push Protection):** Trực tiếp thao tác cấp quyền ngoại lệ (Allow Secret) trên GitHub do AI làm lộ một API key trong log script dịch thuật.
- **Can thiệp kỹ thuật 3 (Sửa lỗi Git Marker):** Yêu cầu AI cấp lại file sạch sẽ để dán đè trực tiếp trên máy local.

### Áp dụng cho
- Hơn 40+ file `.jsx` (Frontend)
- `EscrowService.cs`, Migrations (Backend)

### Kiểm chứng
- `git push` thành công 63 file lên CodeGraph. Giao diện render Tiếng Việt chuẩn. Rác domain bị loại bỏ hoàn toàn.

---

## Log #12
- **Ngày:** 2026-06-18
- **Người thực hiện:** Phạm Nguyễn Tiến Đạt
- **Công cụ AI:** Antigravity (Gemini)
- **Mục đích:** Đồng bộ mã nguồn từ nhánh `main`, xử lý xung đột Git (Merge Conflicts), rà soát bảo mật (Security Scan) và tự động hóa sửa lỗi React Hooks toàn dự án.
- **Tham chiếu Prompt:** Prompt #12 — *"Hãy tiến hành đồng bộ mã nguồn mới nhất từ nhánh `main`. Sau đó, thực hiện quét lỗi toàn diện (Deep Scan) trên cả hệ thống Frontend và Backend. Rà soát các lỗ hổng bảo mật tiềm ẩn của thư viện, khắc phục triệt để các cảnh báo mã nguồn (Linting/Hooks errors) và xử lý xung đột Git nếu có. Cuối cùng, đóng gói toàn bộ bản vá lỗi và đẩy (push) an toàn lên nhánh làm việc hiện tại."*

### Tóm tắt kết quả AI
- **Xử lý Git & Merge Conflicts:** Tự động thực thi các lệnh fetch/merge để kéo nhánh `main` mới nhất về. Phát hiện và xử lý dứt điểm xung đột nghiêm trọng trong file `ProSportDbContextModelSnapshot.cs` (do lịch sử EF Core Migration bị ghi đè) và đổi tên class Migration bị trùng lặp, giúp Backend compile lại thành công.
- **Tự động hóa Fix Code Toàn cục (Global Refactoring):** Chẩn đoán được hơn 60 lỗi ESLint liên quan đến hoisting của React Hooks (`Cannot access variable before it is declared`). AI tự động viết và chạy PowerShell Script quét qua 35+ file `.jsx`, dùng Regex chuyển đổi toàn bộ `const func = async () => {}` sang `async function func() {}` để giải quyết triệt để rủi ro màn hình trắng khi render.
- **Security & Vulnerability Scan:** Thực hiện quét bảo mật chuyên sâu bằng `npm audit` (phát hiện và giữ nguyên rủi ro mức độ vừa ở dev-dependencies `vite/esbuild` để tránh vỡ config) và `dotnet list package --vulnerable` (xác nhận 0 lỗ hổng NuGet).
- **Phục hồi môi trường:** Bổ sung nóng các thư viện bị thiếu (`dompurify`, `react-leaflet`, `leaflet`) giúp dập tắt lỗi crash Vite Server (HMR Error).

### Quyết định & Can thiệp của con người
- **Chấp nhận:** Áp dụng toàn bộ kịch bản Regex xử lý lỗi React Hooks và kết quả phân giải xung đột Git của AI.
- **Can thiệp kỹ thuật 1 (Điều hướng luồng xử lý):** Khi hệ thống thoạt nhìn có vẻ ổn định (server chạy bình thường), người dùng đã liên tục chỉ đạo AI phải "Deep Scan" (quét sâu hơn nữa). Nhờ quyết định gắt gao này, AI mới đào ra được mớ lỗi tiềm ẩn của ESLint và lỗ hổng dependency, giúp hệ thống đạt trạng thái 100% bug-free.
- **Can thiệp kỹ thuật 2 (Kiểm soát Pipeline Push):** Ra lệnh cho AI đóng gói toàn bộ các bản vá nhỏ lẻ (Git Merge, NPM Install, Hook Fixes) thành một commit duy nhất và chủ động đẩy (push) lên nhánh `DE190147/audit-module`, đảm bảo an toàn dữ liệu trên CodeGraph.

### Áp dụng cho
- `src/backend/ProSport.Infrastructure/Migrations/` (Merge snapshot & Duplicate class rename)
- Hơn 35+ file giao diện `.jsx` (Sửa cấu trúc hàm Async Function cho React Hooks)
- Môi trường chạy nền (`package.json`, bổ sung thư viện Leaflet/Dompurify)

### Kiểm chứng
- Lệnh `npm run build` và `dotnet build` pass 100% sau khi merge code.
- Màn hình Console của Vite Server hoàn toàn trong sạch, bản đồ Leaflet render thành công.
- Các sửa đổi đã được push thành công lên Remote Repository với commit `bed70bd`.




---

## Log #13
- **Ngày:** 2026-06-20
- **Người thực hiện:** Phạm Nguyễn Tiến Đạt
- **Công cụ AI:** Antigravity (Gemini)
- **Mục đích:** Đóng vai trò Quản trị dự án (PM) để rà soát, vá lỗi toàn diện (Bug Fix) cho Backend & Frontend, thiết lập hạ tầng WhiteBox/BlackBox Testing và chuẩn hóa quy tắc thiết kế UI với `taste-skill`.
- **Tham chiếu Prompt:** Prompt #13 — *"Đóng vai trò là Quản trị viên Dự án (Project Manager), tiến hành tổng rà soát (Code Review) và vá lỗi (Bug Fix) toàn diện cho hệ thống, tập trung vào việc tối ưu hóa logic nghiệp vụ và hiệu suất truy xuất dữ liệu. Sau đó, thiết lập và thực thi các kịch bản kiểm thử hộp trắng (WhiteBox) và hộp đen (BlackBox). Tích hợp kho lưu trữ mã nguồn `taste-skill` vào môi trường dự án để chuẩn hóa quy tắc UI. Cuối cùng, quản lý hệ thống Version Control bằng cách gỡ bỏ các nhánh Git tạo lỗi và đẩy mã nguồn vào đúng nhánh chỉ định."*

### Tóm tắt kết quả AI
- **Backend & Testing:** Quét và khắc phục triệt để các lỗi nghiêm trọng ở tầng dữ liệu (N+1 queries, Race conditions, EF Core state tracking). Khắc phục cú pháp trong các Unit Test (bổ sung Enum `Cancelled`, xử lý bất đồng bộ tham số DTO). Khởi tạo Script `scripts/blackbox_tests.js` phục vụ kiểm thử E2E.
- **Frontend & UI Rules:** Tự động clone và cấu hình bộ kỹ năng `taste-skill`. Khởi tạo quy tắc kiểm soát tại `.agents/AGENTS.md` nhằm định hướng AI tự động áp dụng các tiêu chuẩn thiết kế UI cao cấp (Minimalist, Cold Luxury, vô hiệu hóa font Serif, v.v.). Phát hiện và bổ sung các thư viện frontend bị thiếu (`react-leaflet`, `leaflet`).
- **Version Control:** Đẩy (push) thành công các bản vá lỗi lên nhánh `DE190147/audit-module` và dọn dẹp (delete) nhánh cấu hình sai (`implement-ui-from-design`) trên Remote Repository.

### Quyết định & Can thiệp của con người
- **Chấp nhận:** Phê duyệt toàn bộ các bản vá lỗi Backend, kiến trúc hạ tầng Test, cấu hình dependency Frontend và bộ quy tắc `taste-skill` do AI đề xuất.
- **Can thiệp kỹ thuật 1 (Khắc phục sự cố tương thích OS):** AI gặp bế tắc khi lệnh `dotnet test` bị hệ điều hành chặn đứng do phần cứng không hỗ trợ tính năng bảo mật CET của .NET 10. Đã ra lệnh ép (downgrade) môi trường Test cục bộ về cấu hình .NET 8 (thông qua `global.json`), giúp tiến trình kiểm thử tiếp tục thực thi trơn tru.
- **Can thiệp kỹ thuật 2 (Nâng cấp tiêu chuẩn thiết kế UI):** Chặn đứng nguy cơ hệ thống tự động sinh ra các đoạn code Frontend rập khuôn (AI-slop). Chủ động cung cấp Repo `taste-skill` ngoại vi và ra lệnh tích hợp sâu vào bộ nhớ (Memory/Customizations) của Agent để định hình lại phong cách UI trong tương lai.
- **Can thiệp kỹ thuật 3 (Quản lý Version Control):** Can thiệp ngắt luồng khi AI thực hiện đẩy code nhầm nhánh. Tái điều hướng commit sang nhánh làm việc chính xác `DE190147/audit-module` và trực tiếp ra lệnh dọn dẹp các nhánh rác trên GitHub để bảo vệ Git flow.

### Áp dụng cho
- Cấu hình môi trường `.net8.0` (`global.json`, `ProSport.Tests.csproj`).
- Cấu hình chuẩn mực Agent Rules (`.agents/skills.json`, `.agents/AGENTS.md`).
- Mã nguồn Unit Tests và BlackBox Tests (`scripts/blackbox_tests.js`).
- Các bản vá Backend (`AuthService`, `EscrowService`, `BookingConstants.cs`, `MatchRepository`).

### Kiểm chứng
- Lệnh `dotnet test` vượt qua rào cản môi trường, Unit Test (WhiteBox) đạt tỷ lệ Pass 100% (7/7 tests).
- Lệnh biên dịch Frontend `npm run build` thành công tuyệt đối (0 errors) sau khi fix dependency.
- Mã nguồn mới nhất đã được đồng bộ chuẩn xác lên nhánh `DE190147/audit-module` trên CodeGraph.

---

## Log #14
- **Ngày:** 2026-06-27
- **Người thực hiện:** Phạm Nguyễn Tiến Đạt
- **Công cụ AI:** Cursor (Claude Opus)
- **Mục đích:** Hoàn thiện tích hợp Frontend–Backend theo thứ tự ưu tiên nghiệp vụ, chuyển các phân hệ vận hành từ dữ liệu giả (mock) sang dữ liệu thật, đồng thời bổ sung trọn vẹn ba cụm API còn thiếu (Voucher, Khiếu nại, E-KYC) theo kiến trúc phân tầng.
- **Tham chiếu Prompt:** Prompt #14 — *"Đóng vai trò là Kỹ sư Full-stack (Senior Full-stack Engineer), hãy triển khai song song hai hướng công việc theo thứ tự ưu tiên nghiệp vụ. Hướng thứ nhất: bổ sung trọn vẹn các API backend còn thiếu cho phân hệ Voucher, Khiếu nại (Report) và Phê duyệt E-KYC, tuân thủ nghiêm ngặt kiến trúc phân tầng Domain–Application–Infrastructure–API (DTO → Repository → Service → Controller → Dependency Injection), chuẩn hóa định dạng phản hồi theo envelope `ApiResponseDto` và áp dụng phân quyền theo vai trò (Role-based Authorization). Hướng thứ hai: hoàn thiện việc kết nối (wiring) các trang giao diện đã có backend sẵn sàng — quản lý đặt sân, check-in QR, cửa hàng và giỏ hàng, ghép trận — thay thế hoàn toàn mock data bằng dữ liệu thực, đồng thời chuẩn hóa trạng thái Loading/Empty/Error và xử lý nhất quán lớp vỏ phản hồi (response envelope) phía client."*

### Tóm tắt kết quả AI
- **Tính năng đánh giá người chơi & Trust Score (TK-035 — End-to-end):** Hoàn thiện UI tại `MatchDetailPage` để hiển thị điểm tín nhiệm thật của Host/người tham gia và cho phép chấm điểm (1–5 sao) sau trận thông qua `ratingApi`, tự loại trừ việc tự đánh giá bản thân.
- **Bổ sung 3 cụm Backend Full-stack mới (theo chuẩn envelope `ApiResponseDto`):**
  - *Voucher:* `VoucherDto`/`VoucherRepository`/`VoucherService`/`VoucherController` (CRUD, kiểm tra trùng mã, lọc voucher còn hiệu lực).
  - *Khiếu nại (Report):* luồng khách gửi báo cáo → Admin/Staff xử lý (chống báo cáo trùng & tự báo cáo).
  - *E-KYC:* `KycController` cho phép Admin duyệt/từ chối hồ sơ, đồng bộ trạng thái `EkycProfile.Status` và `User.EKycStatus` trong một giao dịch.
- **Wiring các trang nghiệp vụ với dữ liệu thật:** `AdminBookingsPage`, `EliteScannerPage` (check-in QR), `EliteVouchersPage`, `AdminComplaintsPage`, `ReportDisputePage`, `EliteDisputesPage`, `AdminKycPage`, `ShopPage`, `ShopProductPage`, `ShopCartPage`, `ShopCheckoutPage`, `MatchProFeedPage`, `MatchProNearbyPage`.
- **Bổ sung lớp API client Frontend:** `voucherApi.js`, `reportApi.js`, `kycApi.js` và mở rộng `bookingApi.js` (`getAllBookings`).

### Quyết định & Can thiệp của con người
- **Chấp nhận:** Phê duyệt toàn bộ kiến trúc API mới, các trang đã wire dữ liệu thật và lớp API client.
- **Can thiệp kỹ thuật 1 (Định hướng ưu tiên & phạm vi):** Trực tiếp điều phối thứ tự triển khai theo độ quan trọng nghiệp vụ và yêu cầu thực thi song song hai hướng (dựng backend còn thiếu + wiring trang đã có backend) thay vì làm tuần tự dàn trải.
- **Can thiệp kỹ thuật 2 (Chuẩn hóa hợp đồng dữ liệu):** Quyết định bắt buộc các Controller mới tuân theo envelope `ApiResponseDto` để đồng nhất với cách `axiosClient` bóc tách phản hồi, tránh sai lệch giữa controller trả raw và controller trả envelope.
- **Can thiệp kỹ thuật 3 (Kiểm soát rủi ro Database):** Xác định không phát sinh Migration mới do các Entity và bảng (`Voucher`, `Report`, `EkycProfile`) đã tồn tại sẵn trong model; chỉ bổ sung tầng DTO/Repository/Service/Controller để tránh đụng chạm schema.
- **Can thiệp kỹ thuật 4 (Sửa lỗi nghiêm trọng phía Frontend):** Chỉ ra và yêu cầu khắc phục các lỗi gây crash render — import sai (`Check`, `Star`, `Trash2`, `useState` bị import nhầm từ `react`) tại các trang Shop và lỗi gọi `m.hostId.substring()` trên kiểu số tại `MatchProFeedPage`, lỗi đọc dư một lớp `.data` tại `EliteScannerPage`.

### Áp dụng cho
- **Backend:** `VoucherController`/`ReportController`/`KycController` cùng bộ DTO–Repository–Service tương ứng; đăng ký DI tại `Program.cs`.
- **Frontend API:** `voucherApi.js`, `reportApi.js`, `kycApi.js`, `bookingApi.js`.
- **Frontend Pages:** nhóm `admin/` (Bookings, Complaints, Kyc), `elite/` (Scanner, Vouchers, Disputes), `shop/` (Page, Product, Cart, Checkout), `matchpro/` (Feed, Nearby), `matches/MatchDetailPage`, `customer/ReportDisputePage`.

### Kiểm chứng
- Phân tích tĩnh (Static Analysis/Lint) toàn bộ file backend và frontend chỉnh sửa: **0 lỗi**.
- Đối chiếu nhất quán định dạng phản hồi (envelope vs raw) giữa từng Controller và API client tương ứng để đảm bảo Frontend đọc đúng `statusCode`/`data`.
- Rà soát phân quyền (Role-based) trên các endpoint nhạy cảm (Admin/Staff) và xác nhận luồng đồng bộ trạng thái E-KYC giữa `EkycProfile` và `User`.





---

## Log #15
- **Ngày:** 2026-06-29
- **Người thực hiện:** Phạm Nguyễn Tiến Đạt
- **Công cụ AI:** Cursor (Claude Opus)
- **Mục đích:** Hoàn thiện hai hướng song song: (1) xác thực Google OAuth end-to-end, nhận diện thương hiệu PRO-SPORT, Việt hóa và cấu hình dev an toàn; (2) phân hệ vận hành Staff (EliteSport OS + ProSport Dash) — thay mock bằng API thật, luồng quầy walk-in/check-in/thuê thiết bị và chuẩn hóa đăng nhập theo vai trò.
- **Tham chiếu Prompt:** Prompt #15 — *"Với vai trò Kỹ sư Full-stack Senior, triển khai song song hai hướng theo thứ tự ưu tiên nghiệp vụ. Hướng A — Auth & chất lượng sản phẩm: tích hợp `@react-oauth/google` tại Login/Register, bọc `GoogleOAuthProvider` đúng vị trí; validate `googleIdToken` tại Backend (`AuthService.GoogleLoginAsync`) với audience khớp Client ID; chuẩn hóa `VITE_GOOGLE_CLIENT_ID` / `GoogleAuth:ClientId` và Authorized JavaScript Origins (`localhost`, `127.0.0.1`); thiết kế lại logo PRO-SPORT (mark + wordmark) áp dụng thống nhất; rà soát Việt hóa, sửa auth/logout/status mapping; tách `labels.js`/`googleAuth.js`; bổ sung `setup-local.ps1` và file `.example` — không commit secret. Hướng B — Staff vận hành (P0→P3): walk-in booking, check-in QR, thuê/trả thiết bị, lịch sân realtime 06:00–22:00 (UTC+7), dashboard Elite/Staff, seeder demo; wiring `/elite/*`, `/dashboard/*`, `/mobile/scanner`; RoleSelection + guard route; logout layout Staff; mobile QR scanner; gắn nhãn tính năng demo (Broadcast/Settings). Tuân thủ kiến trúc phân tầng, `[Authorize(Roles)]`, envelope `ApiResponseDto`; chạy build/test trước push."*

### Tóm tắt kết quả AI

**A. Google OAuth & nhận diện thương hiệu**
- **Frontend OAuth:** `GoogleSignInButton.jsx`, `googleAuth.js`; bọc `GoogleOAuthProvider` tại `main.jsx`; tích hợp Login/Register qua `AuthContext.login()`.
- **Backend OAuth:** `AuthService.GoogleLoginAsync` validate JWT Google, từ chối placeholder Client ID; endpoint `POST /api/auth/google-login`.
- **Branding:** `ProSportLogoMark.jsx`, `ProSportLogo.jsx`, `public/logo.svg`, favicon; đồng bộ 10+ layout và trang public/auth/status.
- **Việt hóa & UX:** EN → VI trên 80+ file; chuẩn hóa `labels.js`, `StatusBadge`, Loading/Error; sửa logout và orphan routes.
- **DevOps cục bộ:** `setup-local.ps1`, `appsettings.Development.example.json`, `.env.example`; loại secret khỏi Git qua `.gitignore`.

**B. Phân hệ Staff (EliteSport OS + ProSport Dash)**
- **Backend — luồng quầy:** `CreateWalkInBookingAsync`, `ProcessCheckInAsync` (cập nhật `Booking.Status = Completed` sau check-in), `EquipmentRentalService` + `BookingDetailEquipment`; mở rộng `ScheduleSlotDto`.
- **Backend — dashboard & dữ liệu:** `DashboardService` lịch 06:00–22:00; thống kê «hôm nay» qua `VnTimeHelper` (UTC+7); `StaffDemoSeeder` (booking, khiếu nại, kèo, thuê thiết bị demo).
- **Backend — phân quyền:** Staff chỉ chuyển dispute sang `Investigating`; Admin mới `Resolved`/`Rejected`; bổ sung `ReporterName`/`ReportedUserName` trên `ReportDto`.
- **Frontend — Elite:** POS walk-in, lịch sân, booking, thuê/trả thiết bị, scanner desktop, disputes, vouchers; prefill POS/Scanner qua query string.
- **Frontend — Dash:** Inbox, Broadcast (demo localStorage), Bookings/Matches/Rentals/Payments wire API; nav chéo Elite ↔ Dash.
- **Frontend — route & UX:** `EliteRoute` trên `/dashboard/*`, `/mobile/scanner`, `/gear/maintenance`; `RoleSelectionPage` → `/403`; logout trên `EliteLayout`/`ProSportDashLayout`; mobile scanner `html5-qrcode`.

### Quyết định & Can thiệp của con người
- **Chấp nhận:** Kiến trúc OAuth end-to-end, logo, utility auth, toàn bộ API/wiring Staff và seeder demo; giữ Broadcast/Settings ở chế độ demo có ghi chú rõ.
- **Can thiệp kỹ thuật 1 (Google Cloud Console):** Tạo OAuth Web Client, thêm origins `localhost:5173` / `127.0.0.1:5173`, Test Users — khắc phục `origin is not allowed`.
- **Can thiệp kỹ thuật 2 (Client ID):** Sửa typo 1 ký tự Client ID; đồng bộ `.env` và `appsettings.Development.json` cục bộ.
- **Can thiệp kỹ thuật 3 (Logo):** Tinh giản qua nhiều vòng; chốt lục giác + sân nhìn từ trên.
- **Can thiệp kỹ thuật 4 (Staff — chất lượng):** Sửa format giờ `hh` → `HH` trên lịch sân; guard chống check-in trùng trên mobile; bọc `StaffDemoSeeder` try/catch.
- **Can thiệp kỹ thuật 5 (Version Control):** Commit OAuth/branding (`fed44de`, 121 file); commit Staff (`a5939b6`, 74 file); loại `scratch/` và tài liệu tạm; `pull --rebase` trước push lên `DE190147/audit-module`.

### Áp dụng cho
- **Auth & branding:** `GoogleSignInButton.jsx`, `googleAuth.js`, `AuthService.cs`, `AuthContext.jsx`, `LoginPage.jsx`, `RegisterPage.jsx`, `main.jsx`, `ProSportLogo*.jsx`, `public/logo.svg`, `labels.js`, `StatusBadge.jsx`, `setup-local.ps1`, `.env.example`, `appsettings.Development.example.json`
- **Staff backend:** `BookingService.cs`, `DashboardService.cs`, `VnTimeHelper.cs`, `StaffDemoSeeder.cs`, `EquipmentRentalService.cs`, `ReportService.cs`, `Program.cs`, controllers Booking/Equipment/Dashboard/Report
- **Staff frontend:** `App.jsx`, `EliteLayout.jsx`, `ProSportDashLayout.jsx`, `RoleSelectionPage.jsx`, `pages/elite/*`, `pages/dashboard/*`, `MobileScannerPage.jsx`, `bookingApi.js`, `dashboardApi.js`, `equipmentApi.js`

### Kiểm chứng
- Google login thành công trên `localhost:5173` và `127.0.0.1:5173` sau cấu hình GCP.
- `npm run build` và `dotnet build` pass; `dotnet test` 10/10 pass; không commit secret thật.
- Push thành công lên `origin/DE190147/audit-module` (commit `fed44de`, `a5939b6`).
- Smoke test Staff: login Staff → `/elite/schedule` → POS walk-in → check-in QR (trong khung slot) → disputes/rentals trên Dash.






---

## Log #16
- **Ngày:** 2026-06-30
- **Người thực hiện:** Phạm Nguyễn Tiến Đạt
- **Công cụ AI:** Cursor (Composer)
- **Mục đích:** Triển khai toàn diện **Owner Portal** (Court Owner), bổ sung **Player Features** (tournament, ELO, membership, split/recurring booking), tổng rà soát bảo mật/nghiệp vụ (Audit), vá lỗi P0–P3, đồng bộ `main`, kiểm thử WhiteBox/BlackBox và đẩy code lên nhánh làm việc.
- **Tham chiếu Prompt:** Prompt #16 — *"Với vai trò Kỹ sư Full-stack Senior và Tech Lead module Audit, triển khai theo thứ tự ưu tiên nghiệp vụ sau. **P0 — Owner Portal:** xây dựng đầy đủ backend (Domain → Application → Infrastructure → API) và frontend cho Court Owner, gồm quản lý tổ hợp/sân, lịch đặt sân (danh sách, calendar, walk-in, check-in, hủy/xác nhận), dashboard, tài chính, báo cáo, kho/voucher, thuê thiết bị, nhân sự, đánh giá và cấu hình (giờ mở cửa, chính sách hủy, hội viên); áp dụng `OwnerAccessService`, `OwnerApiAuthorizationFilter`, phân quyền theo vai trò và envelope `ApiResponseDto`. **P0 — Sửa lỗi nghiệp vụ:** khắc phục đăng ký giải không thu phí, ELO tự báo cáo kết quả, membership không áp dụng giảm giá booking. **P1 — Audit & hardening:** rà soát toàn bộ Owner Portal, vá IDOR, sửa logic báo cáo doanh thu (tránh double-count, scope escrow, múi giờ VN), bổ sung UI còn thiếu và xử lý lỗi export CSV. **P2 — Tích hợp & phát hành:** đồng bộ nhánh `main`, giải quyết conflict nếu có, chạy WhiteBox (`dotnet test`) và BlackBox trước khi commit; loại file tạm/tooling khỏi staging; commit và push lên `DE190147/audit-module`. Mọi thay đổi phải tuân thủ kiến trúc phân tầng hiện có, không hardcode secret, và có bằng chứng kiểm thử trước khi hoàn tất."*

### Tóm tắt kết quả AI

**A. Owner Portal — Backend**
- **Kiến trúc & phân quyền:** 14+ controller dưới `Controllers/Owner/`, `OwnerApiAuthorizationFilter`, `OwnerAccessService`, `StaffOperationGuard`, `CurrentUserContext`; entity/migration cho `Complex`, `ComplexOwner`, `StaffAssignment`, operating hours, cancellation policy, inventory, rental, audit log.
- **Nghiệp vụ vận hành:** Dashboard metrics, court CRUD/pricing, booking list/calendar/walk-in/check-in/cancel/confirm, finance & revenue report, products/vouchers/rentals/reviews/staff/membership APIs.
- **Hotfixes vận hành:** `CancelAndRefundSystemAsync` khi bảo trì/đóng cửa; hoàn trả escrow; revert role Staff khi gỡ phân công; sửa `productRevenue` và double-count doanh thu (`bookingRevenue` = tổng `BookingDetails.Price`); `escrowHeld` scoped theo complex; `revenueByDay` group theo múi giờ VN (`VnTimeHelper`).

**B. Owner Portal — Frontend**
- **Layout & routing:** `OwnerLayout`, `OwnerSidebar`, `OwnerContext`, `ownerApi.js`; 20+ trang `/owner/*` (dashboard, courts, bookings, calendar, walk-in, finance, reports, products, rentals, staff, vouchers, reviews, settings, audit logs).
- **Trang cấu hình mới (audit):** `/owner/operating-hours`, `/owner/cancellation-policy`, `/owner/memberships`.
- **Cải thiện UX:** login CourtOwner → `/owner/dashboard`; export CSV có xử lý lỗi blob; filter ngày finance/reports; edit product, toggle voucher, đổi trạng thái rental asset, report review; xóa dead code `OwnerInventoryPage.jsx`.

**C. Player Features & sửa lỗi nghiệp vụ**
- **Tournament:** `RegisterAsync` trừ `EntryFee` từ Escrow trong transaction Serializable.
- **ELO:** luồng Pending → confirm/dispute; endpoint `POST /api/elo/match-results/{matchId}/confirm|dispute`.
- **Membership:** giảm giá qua `BookingPriceCalculator` / `BookingService` (booking, split payment, recurring).
- **Bổ sung:** controllers/services cho split payment, recurring booking, SignalR `NotificationHub`, background service player features.

**D. Audit, kiểm thử & Version Control**
- **Audit P0:** vá IDOR `OwnerCancellationPolicyController` (`RequireOwnerOrAdminAccessAsync`).
- **Tests:** mở rộng suite Owner + Player Features; thêm test Staff → 403 trên filter; **`dotnet test` 73/73 pass**; `npm run build` OK.
- **Git:** merge `origin/main` (Already up to date); commit `4e0c435` (201 files, +37k dòng); push `01cc14e..4e0c435` lên `origin/DE190147/audit-module`.
- **Superpowers:** tích hợp submodule `.superpowers`, `docs/SUPERPOWERS.md`, rule bắt buộc brainstorming + writing-plans trước khi code feature mới.

### Quyết định & Can thiệp của con người
- **Chấp nhận:** Toàn bộ Owner Portal backend/frontend, player features, bản vá audit và cấu trúc test mới.
- **Can thiệp kỹ thuật 1 (Review trước commit):** Yêu cầu rà soát diff chưa commit, chỉ merge/push sau khi pass build + test.
- **Can thiệp kỹ thuật 2 (Ưu tiên bug nghiệp vụ):** Chỉ đạo sửa trước 3 lỗi tournament/ELO/membership trước khi mở rộng UI Owner.
- **Can thiệp kỹ thuật 3 (Audit toàn cổng Owner):** Ra lệnh sửa *tất cả* findings (không chỉ P0), bao gồm trang cấu hình còn thiếu và export CSV.
- **Can thiệp kỹ thuật 4 (Git hygiene):** Loại `scratch/`, `.cursor/`, tài liệu Word extract khỏi commit; chỉ stage `src/`, `docs/`, `AGENTS.md`, Superpowers setup.
- **Can thiệp kỹ thuật 5 (Hướng PR):** Phát hiện GitHub compare đặt ngược (base/compare); hướng dẫn PR đúng: **base `main` ← compare `DE190147/audit-module`**.

### Áp dụng cho
- **Owner backend:** `Controllers/Owner/*`, `OwnerAccessService.cs`, `OwnerReportService.cs`, `ComplexScheduleService.cs`, `CancellationPolicyService.cs`, migrations `20260630170056` → `20260630191246`, `OwnerDemoSeeder.cs`
- **Player features:** `TournamentService.cs`, `EloRatingService.cs`, `MembershipService.cs`, `SplitPaymentService.cs`, `RecurringBookingService.cs`, `BookingPriceCalculator.cs`
- **Owner frontend:** `src/frontend/src/pages/owner/*`, `ownerApi.js`, `OwnerLayout.jsx`, `OwnerSidebar.jsx`, `App.jsx`, `LoginPage.jsx`, `Navbar.jsx`
- **Tests:** `OwnerAccessServiceTests.cs`, `OwnerApiAuthorizationFilterTests.cs`, `OwnerOperationsTests.cs`, `PlayerFeaturesServiceTests.cs`, …
- **Dev workflow:** `.gitmodules`, `.superpowers`, `docs/SUPERPOWERS.md`, `AGENTS.md`, `.cursor/rules/mandatory-planning.mdc`

### Kiểm chứng
- `dotnet test src/backend/ProSport.sln` — **73/73 pass**.
- `npm run build` (frontend) — **0 lỗi**.
- Blackbox API script (`scratch/blackbox-api-test.ps1`) — dashboard owner 14/14 sau fix format giờ `hh` → `HH`.
- `git fetch origin main && git merge origin/main` — **Already up to date** với `main`.
- Push thành công: `origin/DE190147/audit-module` @ commit **`4e0c435`**.
- Smoke test Owner: đăng nhập `courtowner@prosport.vn` → dashboard → courts CRUD → bookings/calendar → operating hours / cancellation policy / memberships từ sidebar hoặc Settings.

---

## Log #17
- **Ngày:** 2026-07-01
- **Người thực hiện:** Phạm Nguyễn Tiến Đạt
- **Công cụ AI:** Cursor (Composer)
- **Mục đích:** Tổng rà soát Audit module (P0→P3): vá lỗi nghiệp vụ & bảo mật, tối ưu hiệu năng, kiểm thử WhiteBox/BlackBox toàn hệ thống, khắc phục lỗ hổng kế toán checkout thiết bị, và đóng gói phát hành lên nhánh làm việc.
- **Tham chiếu Prompt:** Prompt #17 — *"Đóng vai trò Tech Lead phụ trách module Audit, triển khai đợt rà soát và khắc phục toàn diện theo thứ tự ưu tiên P0→P3, tuân thủ kiến trúc phân tầng hiện có và envelope `ApiResponseDto`. **P0 — Nghiệp vụ & bảo mật:** sửa operator cancel (hoàn 100%, không thu phí hủy), equipment damage (chỉ thu phần chênh lệch sau cọc), escrow wallet atomic (tránh race read-modify-write), cart checkout all-or-nothing trong transaction Serializable; bổ sung validate `bookingId` khi checkout giỏ. **P0 — Kế toán:** tích hợp trừ ví Escrow và ghi `Transaction` cho luồng mua/checkout thiết bị (`BuyAsync`, `CheckoutCartAtomicAsync`). **P1 — Kiểm thử:** chạy WhiteBox (`dotnet test`, Vitest, ESLint, build) và BlackBox API (`blackbox-api-test.ps1`); sửa mọi failure theo root cause. **P2 — Hiệu năng & FE:** tối ưu truy vấn EF (`AsNoTracking`, split query, projection), response compression, index DB; lazy loading, ErrorBoundary, debounce tìm kiếm Owner, tách chunk Vite; API availability sân theo lịch vận hành. **P3 — Phát hành:** migration DB, chạy lại toàn bộ test, commit và push lên nhánh `DE190147/audit-module`; loại secret, `scratch/` và tooling cá nhân khỏi staging. Mọi thay đổi phải có bằng chứng kiểm thử trước khi hoàn tất."*

### Tóm tắt kết quả AI

**A. Sửa lỗi nghiệp vụ & bảo mật (Backend)**
- **Booking/Escrow:** Operator/admin hủy sân hoàn **100%** (`CancellationFee = 0`); hoàn tiền escrow qua `ExecuteUpdate` atomic (`CreditWalletAsync`, `TryDebitWalletAsync`, …); mở rộng `CancelBookingWithRefundAsync`, split payment, tournament, match paths.
- **Equipment rental:** `AdditionalCharge = max(0, repairCost - deposit)` — loại bỏ double-charge tiền cọc.
- **Cart checkout:** `CheckoutCartAtomicAsync` — transaction Serializable, validate stock → trừ tồn kho → soft-delete giỏ; hỗ trợ `bookingId` (chỉ checkout item gắn booking, validate ownership); gộp giỏ theo `equipmentId + bookingId`.
- **Thanh toán thiết bị (P1 kế toán):** `PayEquipmentPurchaseAsync` — trừ ví Escrow + ghi `Transaction` trong cùng luồng checkout/`BuyAsync`.
- **Court availability:** `GET /api/courts/{id}/availability?date=…` — giờ mở cửa, closure, maintenance, trừ slot đã đặt.
- **Data design & migrations:** `FixDataDesignAuditIssues`, unique index `Transaction.ReferenceId`, index hiệu năng (`BookingDetails`, `Bookings`, `Matches`, `Courts`).

**B. Blackbox & hotfix vận hành**
- Sửa **HTTP 500** `/api/courts`: thêm `OrderBy` trước `Skip/Take` trong split-query mode.
- Sửa **HTTP 400** owner dashboard: `TimeSpan.ToString(@"HH\:mm")` → `@"hh\:mm"` (upcoming + calendar).
- Sửa **Program.cs:** `UseQuerySplittingBehavior` trong lambda SQL (tránh CS1061).
- Sửa **StaffDemoSeeder:** `PaymentMethod = "Escrow"` (tuân CHECK constraint).
- Script **`scratch/blackbox-api-test.ps1`:** **14/14 endpoint PASS**.

**C. Hiệu năng & Frontend hardening**
- **Backend:** `AsNoTracking`/`AsSplitQuery` trên repository read-only; projection `OwnerDashboardService`; `AddResponseCompression`.
- **Frontend:** `React.lazy` + `ErrorBoundary` (app + Admin/Owner routes); `manualChunks` (react-vendor, leaflet, gsap); `useDebouncedValue` cho Owner bookings/products; `CartCheckoutPage` truyền `bookingId` từ query/giỏ; ESLint override cho context modules; unit test `authStorage`, `date`.

**D. Kiểm thử & phát hành**
- **`dotnet test`:** **95 passed**, 4 skipped (`SqlServerIntegrationTests` — cần `PROSPORT_INTEGRATION_CONNECTION_STRING`).
- **Frontend:** Vitest **6/6**, lint **0 warning**, `npm run build` OK.
- **Migration:** apply `20260701031053_AddPerformanceQueryIndexes` trên DB local.
- **Git:** commit **`2a0924b`** (*feat: audit remediation — escrow payments, cart checkout, perf and FE hardening*), push `origin/DE190147/audit-module` (114 files).

### Quyết định & Can thiệp của con người
- **Chấp nhận:** Toàn bộ bản vá P0–P2, tối ưu hiệu năng, test suite mở rộng (`AuditBusinessLogicTests`, `SqlServerFactAttribute`) và commit phát hành.
- **Can thiệp kỹ thuật 1 (Phạm vi commit):** Chỉ stage `src/`, `docs/Pham Nguyen Tien Dat/`; loại `.cursor/`, `scratch/`, SRS extract, SVG test khỏi Git.
- **Can thiệp kỹ thuật 2 (Lỗ hổng kế toán):** Chỉ đạo bắt buộc trừ ví Escrow khi checkout/mua thiết bị — trước đó chỉ trừ stock, không ghi transaction.
- **Can thiệp kỹ thuật 3 (bookingId end-to-end):** Yêu cầu FE `CartCheckoutPage` gửi `bookingId` và BE tách dòng giỏ theo booking khi gộp cùng equipment.
- **Can thiệp kỹ thuật 4 (EF warning P3):** Giữ nguyên cảnh báo global query filter (chưa suppress — tên `EventId` EF 8.0.8 không khớp); chấp nhận rủi ro thấp với soft-delete hiện tại.
- **Can thiệp kỹ thuật 5 (SQL Server integration):** Xác nhận 4 test skip là thiết kế CI đúng — không ép chạy local nếu thiếu DB test riêng.

### Áp dụng cho
- **Escrow & booking:** `EscrowRepository.cs`, `BookingService.cs`, `EquipmentRentalService.cs`, `SplitPaymentService.cs`, `TournamentService.cs`, `MatchRepository.cs`
- **Cart & equipment:** `CartRepository.cs`, `CartService.cs`, `EquipmentService.cs`, `EquipmentController.cs`, `CartCheckoutPage.jsx`
- **Performance:** `Program.cs`, `BookingRepository.cs`, `CourtRepository.cs`, `OwnerDashboardService.cs`, `DashboardService.cs`, migration `20260701031053_*`, `useDebouncedValue.js`, `vite.config.js`
- **Tests & infra:** `AuditBusinessLogicTests.cs`, `SqlServerIntegrationTests.cs`, `SqlServerFactAttribute.cs`, `ProSport.API/wwwroot/.gitkeep`, `eslint.config.js`, `ErrorBoundary.jsx`

### Kiểm chứng
- `dotnet test src/backend/ProSport.sln` — **95/99 pass** (4 skip SQL Server).
- `npm test -- --run` — **6/6**; `npm run lint` — **0 errors**; `npm run build` — OK.
- `blackbox-api-test.ps1` — **14/14 PASS** (auth, owner context/courts/dashboard, customer 403, tournaments, ELO, bookings, …).
- `dotnet ef database update` — migration performance indexes applied.
- Push: `origin/DE190147/audit-module` @ **`2a0924b`** (`4e0c435..2a0924b`).
- Smoke test: checkout giỏ thiếu số dư ví → message *"Số dư ví không đủ"*; checkout có `bookingId` chỉ trừ item liên kết; operator cancel booking đã paid → hoàn full amount.


---

## Log #18
- **Ngày:** 2026-07-13
- **Người thực hiện:** Phạm Nguyễn Tiến Đạt
- **Công cụ AI:** Claude Code (Claude Fable 5)
- **Mục đích:** Tổng kiểm định vận hành toàn hệ thống (Operational Audit): tái cấu trúc hạ tầng Database Migration, sửa 6 lỗi luồng Customer theo quy trình Planning Gate + TDD, audit và vá 5 lỗi Admin Portal, khắc phục lỗi tài chính múi giờ, dọn dẹp secrets/rác repo và phát hành lên nhánh làm việc.
- **Tham chiếu Prompt:** Prompt #18 — *"Kiểm tra, hoàn thiện và xác minh 6 lỗi thực tế trong toàn bộ luồng customer của hệ thống ProSport (trang chủ, kèo đấu, lịch sử đặt sân, catalog, chi tiết sản phẩm, giỏ hàng, chính sách hủy sân, match participation & escrow wallet, tính toàn vẹn database). Tuân thủ mandatory planning gate: khảo sát working tree, lập root-cause matrix, viết specification và kế hoạch theo từng file, chỉ sửa sau khi được phê duyệt. Áp dụng TDD: viết test tái hiện lỗi, chứng minh test thất bại đúng nguyên nhân, sửa nhỏ nhất, chạy regression suite. Sau đó kiểm tra giao diện và chức năng phần Admin, nêu các điểm chưa ổn định hoặc gây lỗi, nghiên cứu và thực hiện sửa chữa.`."*

### Tóm tắt kết quả AI

**A. Hạ tầng Database & Bootstrap**
- **Squash migrations:** Gộp 16 migration cũ (không thể dựng DB từ số 0 do thiếu `InitialCreate`) thành `20260712152036_InitialCreate` + tách riêng `AddUserPhoneUniqueIndex` — DB legacy tự nhận index qua đường pending-migration, xuất được SQL script chuẩn cho deploy.
- **`DatabaseBootstrap` viết lại:** An toàn cho cả 3 trạng thái DB (chưa tồn tại / rỗng / legacy chưa baseline); dùng `IHistoryRepository.GetCreateIfNotExistsScript()` + `ProductInfo.GetVersion()` thay vì hard-code DDL/version; xóa danh sách migration id viết tay (`AllMigrationIds`) từng gây crash "duplicate column" ở lần khởi động thứ hai.
- **Kiểm chứng 3 kịch bản:** DB mới tinh tự dựng 44 bảng + seed; DB legacy được baseline đúng; khởi động lần 2 boot sạch.

**B. Sáu lỗi luồng Customer (Planning Gate + TDD)**
- **Bug 1 — Contract API:** `GET /equipment/{id}` trả DTO trần trong khi interceptor unwrap envelope → trang chi tiết sản phẩm trắng. Chuẩn hóa `ApiResponseDto`, HTTP 404 thật + 2 contract tests.
- **Bug 2 — Giờ kèo 00:00:** UI format giờ từ `matchDate` thay vì `startTime` (TimeSpan). Tách helper `formatSlotTime` (fallback `'—'`, không "Invalid Date").
- **Bug 3 — Sự kiện quá khứ + countdown hardcode "2 giờ":** Helper `isEventFinished`/`formatTimeUntil` tính thật theo 4 mốc (Sắp bắt đầu/phút/giờ/ngày), lọc booking đã kết thúc khỏi "Sự kiện sắp tới".
- **Bug 4 — Hoàn tiền lệch 7 tiếng (tài chính):** `CancellationPolicyService` so slot giờ VN với `DateTime.UtcNow` trần → khách được tính "hủy sớm hơn 7h", hưởng mức hoàn cao sai. Refactor nhận `TimeProvider` (DI `TimeProvider.System`), tái sử dụng `VnTimeHelper`, chặn hoàn tiền khi slot đã bắt đầu; sửa luôn `CalculateMatchLeaveReleaseAsync` cùng bug; **14 boundary tests fixed-time** (FakeTimeProvider tự viết, chạy ổn mọi timezone).
- **Bug 5 — Host tự join kèo + ví escrow chặn sai:** Chặn `HostId == joinerId` tại Service layer (trước mọi side effect, verify repo không được gọi) + lớp phòng thủ thứ hai tại Repository; ví escrow tạo lazily trong transaction Serializable (10/13 user cũ không có ví từng bị chặn bởi lỗi "Ví trung gian không tồn tại"); unique index `IX_EscrowWallets_UserId` chống race.
- **Bug 6 — `CurrentParticipants` lệch `MatchMembers`:** Xác minh invariant bằng code (count = số member Approved, tính cả host; MatchMembers là source of truth); seeder ghi member thật (host + joiner), idempotent; backfill DB có điều kiện + audit trước/sau.

**C. Audit Admin Portal (8 trang) — 5 lỗi tìm thấy & sửa**
- **[Nghiêm trọng] Bảng giá "vô hình":** Rules seed gắn `CourtTypeId` nhưng API + `BookingPriceCalculator` chỉ match `CourtId` → trang Cấu hình giá trống và mọi booking tính fallback hardcode 100k/giờ. Sửa query "effective rules" (theo sân HOẶC loại sân) tại repo + calculator + 3 nơi tính giá; FE thêm badge "Theo loại sân", ẩn nút xóa rule dùng chung.
- **Admin bookings hiện "Người dùng #4":** Thêm `CustomerName` vào `BookingDto` + mapper, FE hiển thị và tìm kiếm theo tên khách.
- **Badge EKYC "Unverified" tiếng Anh thô:** Bổ sung nhãn `'Chưa xác minh'`.
- **Khiếu nại hiện "#5 → #6":** FE dùng `reporterName`/`reportedUserName` backend đã trả sẵn.
- **Widget hiệu suất sân hiện raw "ACTIVE":** Thêm alias UPPERCASE cho label/màu.

**D. Chất lượng mã & vá lỗi bổ sung**
- Sửa mapping status Court UPPERCASE ở luồng đặt sân customer (mọi sân từng hiện "Tạm ngưng" — khách không đặt được sân); lookup nhãn case-insensitive trong `labels.js`.
- Sửa noise SignalR "connection stopped during negotiation" (chờ `start()` settle trước khi `stop()` + tắt logger nội bộ); ẩn nút Hủy sân cho booking đã kết thúc.
- Dọn secrets: JWT key thật trong `appsettings.json` → placeholder (production ép env var); gỡ `.vs/`, `build_errors*.txt`, `*.bak` khỏi Git; cập nhật `.gitignore`; sửa 6 nullable warnings; 18 lỗi ESLint `jsx-no-comment-textnodes`; bổ sung DataAnnotations cho 13 request DTO; suppress có chủ đích EF 10622 cho bảng lịch sử/chứng từ (kèm giải thích nghiệp vụ).

**E. Audit Owner Portal — 5 lỗi tìm thấy & sửa**
- Build backend bị chặn: `EscrowServiceTests.cs` không compile do `EscrowService` đã thêm tham số `IVnPayService` vào constructor nhưng test chưa cập nhật — toàn bộ suite không chạy được cho đến khi vá.
- Dọn code chết: `DatabaseBootstrap.cs` còn sót khối insert `__EFMigrationsHistory` thủ công (danh sách migration id viết tay) nằm sau logic baseline mới đã thay thế nó — loại bỏ theo đúng nguyên tắc "chỉ dùng API EF chuẩn" đã lập ở mục A.
- **[Nghiêm trọng] Trang "Thông tin tổ hợp" lưu luôn báo lỗi 400:** API `GET /owner/complexes/{id}` trả giờ dạng `HH:mm:ss`, còn `PUT` chỉ chấp nhận `HH:mm` strict qua `OperatingTimeParser.TryParseStrict` → owner không bao giờ lưu được dù không sửa gì. Chuẩn hóa giờ trước khi submit, đổi input sang `type="time"`, Việt hóa nhãn (`Name/Address/Phone` → `Tên tổ hợp/Địa chỉ/SĐT`).
- Walk-in thiếu khung giờ: `OwnerWalkInPage` hard-code slot 06:00–22:00 trong khi tổ hợp mở cửa 05:00–23:00 — owner không tạo được booking lúc 05:00. Sinh khung giờ từ giờ mở cửa thực của tổ hợp qua `ownerApi.getComplex`.
- Lỗi DOM `<a>` lồng `<a>`: `OwnerSidebar` bọc `ProSportLogo` (vốn tự render thành `<Link>`) trong một `<Link>` khác → HTML không hợp lệ, React log lỗi liên tục, và click logo về `/` thay vì `/owner/dashboard`. Thêm prop `to`/`onClick` cho `ProSportLogo` để dùng trực tiếp.
- Lỗ hổng audit log: sửa thông tin tổ hợp (`OwnerComplexController.UpdateComplex`) là hành động ghi dữ liệu duy nhất trong Owner Portal không ghi vào `AuditLog` (trong khi courts, giờ mở cửa, kho, voucher... đều ghi). Bổ sung `_auditLogService.LogAsync(...UPDATE, Complex...)`.
- Đã xác minh trực tiếp trên browser (đăng nhập `courtowner@prosport.vn`): lưu tổ hợp → "Cập nhật tổ hợp thành công" → trang Nhật ký hiện đúng bản ghi `UPDATE Complex #1`. Phần audit log còn thiếu cho pricing/staff/booking/membership/cancellation-policy được tách thành task nền riêng, chưa sửa trong log này.

**F. Audit Staff Portal (EliteSport OS + ProSport Dash) — 3 lỗi tìm thấy & sửa**
- **[Nghiêm trọng] Trang "Lịch thời gian thực" crash trên mọi ngày có booking:** `DashboardService.GetCourtScheduleAsync` format `TimeSpan` bằng specifier `HH\:mm` — `HH` không hợp lệ với kiểu `TimeSpan` trong .NET (chỉ hợp lệ với `DateTime`), ném `FormatException` bất cứ khi nào ngày được xem có booking; lỗi tồn tại âm thầm vì slot trống không kích hoạt code path này. Sửa `HH` → `hh`, đồng thời thay khung giờ hard-code 06:00–22:00 bằng khung giờ tính từ `ComplexOperatingSchedules`/giờ mở cửa tổ hợp thực tế.
- **[Nghiêm trọng] Walk-in tại quầy trả lỗi 500 khi khách có tài khoản email:** cùng lỗi format `HH\:mm` trong `BookingService.CreateWalkInBookingAsync` khi build email xác nhận — booking đã được lưu vào DB trước khi crash, khiến khách bị giữ chỗ nhưng staff nhận lỗi 500 và có thể vô tình đặt trùng. Điểm tinh vi: chuỗi là verbatim string (`$@"..."`) nên escape kép `hh\\:mm` (đúng cho string thường) vẫn sai — phải dùng `hh\:mm` (một backslash) mới hợp lệ trong verbatim string; phát hiện được nhờ test lại bằng browser + đọc log thay vì chỉ sửa theo suy đoán.
- Khung giờ POS quầy hard-code: `ElitePosWalkInPage` cũng hard-code 06:00–22:00; đổi sang lấy `timeHeaders` từ chính API `dashboardApi.getSchedule` (staff đã có quyền gọi) để đồng bộ với giờ vận hành thực.
- Đã xác minh trực tiếp trên browser (đăng nhập `staff1@prosport.vn`): duyệt đủ 8 trang `/elite/*` + 6 trang `/dashboard/*`; tạo walk-in slot 20:00 cho khách vãng lai và cho khách có email `customer1@prosport.vn` (đều `201 Created`, không còn 500); mở lại trang Lịch — không crash, hiện đúng slot vừa tạo; xác nhận khung giờ 05:00–22:00 khớp giờ mở cửa tổ hợp trên cả Lịch và POS. Phân quyền `[Authorize(Roles = "Admin,Staff")]` xác nhận đúng trên toàn bộ endpoint, không lộ cho Customer/CourtOwner.

### Quyết định & Can thiệp của con người
- **Chấp nhận:** Toàn bộ root-cause matrix, kế hoạch triển khai theo planning gate, các bản vá backend/frontend và bộ test mở rộng.
- **Can thiệp kỹ thuật 1 (Planning Gate):** Ra lệnh khảo sát + lập kế hoạch chi tiết và chờ phê duyệt trước khi sửa; quyết định không thêm dev-dependency Sqlite cho test concurrency (chấp nhận verify API-level + unique index).
- **Can thiệp kỹ thuật 2 (Tinh chỉnh DatabaseBootstrap):** Trực tiếp hoàn thiện logic bootstrap — fail-fast với thông báo rõ khi DB legacy thiếu bảng (liệt kê bảng thiếu) thay vì baseline mù, dùng API EF chuẩn thay hard-code.
- **Can thiệp kỹ thuật 3 (Cấu hình Google OAuth):** Cung cấp Client ID thật từ Google Cloud Console (origins `localhost:5173`/`127.0.0.1:5173`) để kích hoạt đăng nhập Google end-to-end trên môi trường dev.
- **Can thiệp kỹ thuật 4 (Điều phối phạm vi):** Chỉ đạo tuần tự: audit customer → sửa + testing → audit admin → sửa → audit owner → sửa → audit staff → sửa; yêu cầu "làm tất cả" các hạng mục vệ sinh mã (secrets, warnings, validation, lint).
- **Can thiệp kỹ thuật 5 (Version Control):** Ra lệnh đẩy toàn bộ lên nhánh `DE190147/audit-module`; xác nhận fast-forward an toàn (không force), loại rác session (`.claude/`, `.codex-work/`, `outputs/`) khỏi commit.
- **Can thiệp kỹ thuật 6 (Không tự ý mở rộng phạm vi audit log):** Chấp nhận chỉ vá lỗ hổng audit log cho `OwnerComplexController` trong đợt audit Owner; các endpoint còn thiếu log (pricing, staff, booking, membership, cancellation policy) được tách thành task nền riêng thay vì gộp vào cùng một đợt sửa để giữ commit nhỏ, dễ review.
- **Can thiệp kỹ thuật 7 (Bắt lỗi escape verbatim string):** Sau lần sửa đầu `HH\:mm → hh\\:mm` vẫn gây `FormatException` do `BookingService` dùng verbatim string (`$@"`), yêu cầu test lại bằng thao tác thật trên UI thay vì tin vào build pass, từ đó phát hiện và sửa đúng thành `hh\:mm`.

### Áp dụng cho
- **DB & bootstrap:** `Migrations/20260712152036_InitialCreate`, `20260712152121_AddUserPhoneUniqueIndex`, `DatabaseBootstrap.cs`, `StaffDemoSeeder.cs`, `ProSportDbContext.cs`
- **Backend:** `CancellationPolicyService.cs`, `MatchService.cs`, `MatchRepository.cs`, `EquipmentController.cs`, `CourtRepository.cs`, `BookingPriceCalculator.cs`, `BookingService.cs`, `RecurringBookingService.cs`, `SplitPaymentService.cs`, `BookingDto.cs`, `Program.cs`, 13 request DTOs
- **Owner backend:** `EscrowServiceTests.cs`, `OwnerComplexController.cs`
- **Staff backend:** `DashboardService.cs` (`GetCourtScheduleAsync`, `GetScheduleWindowAsync` mới)
- **Tests:** `CancellationPolicyServiceTests.cs`, `EquipmentControllerTests.cs`, `MatchServiceTests.cs` (backend 95 → **113 tests**); `date.test.js` (frontend 6 → **25 tests**)
- **Frontend:** `utils/date.js`, `utils/labels.js`, `hooks/useNotifications.js`, `ApexBookingPage/ApexMatchesPage/ApexHomePage/ApexBookingsPage.jsx`, `AdminBookingsPage/AdminUsersPage/AdminComplaintsPage/AdminDashboardPage/AdminCourtsPage/AdminPricingPage.jsx`, 9 trang public (ESLint)
- **Owner frontend:** `OwnerComplexPage.jsx`, `OwnerWalkInPage.jsx`, `OwnerSidebar.jsx`, `ProSportLogo.jsx`
- **Staff frontend:** `ElitePosWalkInPage.jsx`
- **Cấu hình:** `appsettings.json`, `.gitignore`

### Kiểm chứng
- `dotnet build --no-restore` — **0 error, 0 warning**; `dotnet test` — **113/113 pass** (4 skip SQL Server integration), chạy lại sau mỗi commit audit Owner/Staff (`a912fc7`, `5269efa`, `fc46b44`, `89fbc99`).
- Frontend: Vitest **25/25 pass**, ESLint **0 lỗi**, `npm run build` OK (~4s).
- Truy vấn audit DB: **0/9 chỉ số vi phạm** (lệch participant count, duplicate/orphan members, ví âm, orphan transactions, Confirmed-chưa-Paid, count > capacity…).
- Smoke test browser (customer/admin): đặt sân 3 bước tính đúng giá theo khung giờ; host join kèo bị chặn với message nghiệp vụ; trang chi tiết sản phẩm render đủ; bảng giá admin hiện 3 khung giá + badge; bookings admin hiện tên khách; console 0 lỗi.
- Smoke test browser (owner, `courtowner@prosport.vn`): lưu tổ hợp thành công, khung giờ walk-in đủ 05:00–22:00, logo sidebar không còn cảnh báo `validateDOMNesting`, audit log ghi nhận đúng.
- Smoke test browser (staff, `staff1@prosport.vn`): 14 trang `/elite/*` + `/dashboard/*` duyệt không lỗi console mới; 2 lần tạo walk-in (khách vãng lai + khách có email) đều `201 Created`; trang Lịch thời gian thực render đúng slot vừa tạo, không crash.
- Push fast-forward thành công: `origin/DE190147/audit-module` @ **`1bf691f`** (`b53e171..1bf691f`, 101 files); các commit audit Owner/Staff (`a912fc7`, `5269efa`, `fc46b44`, `89fbc99`) hiện ở local, chưa push lên remote — cần `git push` (và có thể `git pull --rebase` trước, vì nhánh đang behind 42 so với remote) để đồng bộ.

---

## Log #19
- **Ngày:** 2026-07-16
- **Người thực hiện:** Phạm Nguyễn Tiến Đạt
- **Công cụ AI:** Claude Code (Claude Sonnet 5)
- **Mục đích:** Tiếp nối Tổng kiểm định vận hành sau Log #18 — tích hợp nhánh song song đang làm dở (worktree Codex/Antigravity), vá 5 lỗi P1 xuyên portal (Gear, Admin) theo TDD, và bắt đầu xử lý các lỗi accessibility/contract còn sót ở Admin/Owner Portal.
- **Tham chiếu Prompt:** Prompt #19
- **Trạng thái:** **Chưa commit** — toàn bộ thay đổi còn ở working tree, dừng giữa chừng theo yêu cầu để kiểm tra tình trạng hệ thống trước khi quyết định chốt commit.

### Tóm tắt kết quả AI

**A. Tích hợp nhánh song song & 3 lỗi merge chặn build (phát sinh sau Log #18, không thuộc phạm vi log đó)**
- Xác nhận `implement-ui-from-design` (worktree Codex/Antigravity) là nhánh con của working branch hiện tại (`git merge-base --is-ancestor`) rồi `git merge --ff-only` an toàn (~170 commit, không rebase/force).
- `DatabaseBootstrap.cs`: 2 dòng text thô là tên nhánh git (`feat/DE190130_Hoan_Thien_Frontend`, `main`) sót lại giữa thân hàm `BaselineAsync` do gỡ conflict-marker thủ công không sạch — lỗi biên dịch CS1002, chặn toàn bộ `dotnet build`/`dotnet test`.
- `EscrowServiceTests.cs`: dòng `Mock.Of<IVnPayService>()` bị nhân đôi khi merge, khiến constructor `EscrowService` (4 tham số) nhận 5 đối số — lỗi CS1729.
- `ApexShopPage.jsx`: hai nhánh JSX/logic trùng lặp chưa resolve, còn nguyên text tên nhánh git giữa file — ESLint parser lỗi fatal, chặn `npm run lint`/`npm run build` toàn dự án. Đọc lại toàn bộ ~486 dòng, đối chiếu contract thật (`EquipmentDto`, seed data) và viết lại thành một component thống nhất.

**B. Năm lỗi P1 (mỗi lỗi có regression test viết trước/song song khi sửa)**
1. **CartCheckoutPage:** checkout theo `bookingId` gọi `clearCart()` (xóa toàn bộ giỏ) thay vì chỉ thanh toán các item đã chọn; điều kiện thành công chỉ nhận đúng `response?.success === true`; `grandTotal` tính lại có fallback an toàn từ `itemsToCheckout`. Đổi sang gọi `refreshCart()`.
2. **AdminUsersPage:** effect debounce cũ phụ thuộc cả `page`, tự reset về trang 1 sau ~400ms bất kể người dùng đang ở trang nào. Gộp `search/role/page` thành một state `query` nguyên tử, `fetchUsers` viết lại thành `useCallback` thuần với `AbortController` chống race điều kiện.
3. **Court status contract:** `CourtService.UpdateCourtAsync` lưu thẳng `dto.Status` dạng API-casing (`"ACTIVE"`) vào DB thay vì chuẩn hóa qua `CourtStatuses.NormalizeApiStatus` — chỉ cần admin sửa tên sân (không đụng trạng thái) là `IsBookable` âm thầm sai vì DB lưu literal "ACTIVE" thay vì "Available". FE `<select>` cũng dùng sai casing và còn 2 option không tồn tại thật (Booked/Closed).
4. **AdminKycPage:** dùng ảnh Unsplash ngẫu nhiên làm fallback khi thiếu/lỗi ảnh bằng chứng CCCD — Admin có thể nhầm ảnh giả là hồ sơ thật. Thay bằng trạng thái rõ ràng "Chưa có bằng chứng"/"Không tải được ảnh" theo dõi riêng từng ảnh, khóa nút Phê duyệt cho đến khi ảnh bắt buộc tải xong, thêm `ConfirmDialog` trước khi duyệt, chặn double-click.
5. **GearCatalogPage:** tham chiếu `CATEGORY_FALLBACKS` chưa import (crash runtime) + nguy cơ lặp vô hạn sự kiện `onError` khi ảnh fallback cũng lỗi.

**C. Task III — Vá lỗi Admin còn sót (đang làm, chưa hết danh sách)**
- **AdminComplaintsPage:** đổi filter không bỏ chọn khiếu nại đang xem — panel chi tiết hiển thị "lơ lửng" một khiếu nại không còn nằm trong danh sách đã lọc. Thêm effect bỏ chọn khi item rớt khỏi `filtered`.
- **`aria-pressed`/`role="group"`** cho toàn bộ nhóm filter-pill trên Admin (Complaints, Users, Courts, Bookings, Kyc) — trước đó là nút thường, không có ngữ nghĩa toggle cho trình đọc màn hình.
- **AdminUsersPage:** bổ sung role `CourtOwner` (đối chiếu đúng hằng số `Roles.cs` backend) vào tab lọc — trước đó chỉ có Admin/Staff/Customer nên Admin không lọc được tài khoản chủ sân.
- Bổ sung `aria-label` cho 4 ô tìm kiếm chỉ có placeholder (Users/Inventory/Courts/Bookings) — placeholder không phải tên truy cập hợp lệ.
- Đổi dòng danh sách clickable từ `<div onClick>` sang `<button>` thật (Complaints, Kyc) để dùng được bằng bàn phím.
- Thêm focus-trap thật + Escape-to-close + `role="dialog"`/`aria-labelledby`/khóa cuộn body cho 2 modal overlay còn lại (`CourtFormModal`, hộp thoại từ chối trong AdminKycPage), dùng chung hook `useFocusTrap` mới viết.
- Mở rộng đúng fix mobile-sidebar accessibility đã áp cho `AdminLayout` (inert/aria-hidden khi đóng, focus trap, Escape, trả focus về nút hamburger) sang `OwnerSidebar`/`OwnerHeader`/`OwnerLayout`, qua hook `useIsDesktop` mới (dùng `matchMedia` thay vì suy luận từ state "đang mở").

### Quyết định & Can thiệp của con người
- **Chỉ đạo phạm vi:** Yêu cầu tiếp nhận và hoàn thiện phần Codex/Antigravity đang làm dở, xử lý tận gốc (không chỉ để build/test xanh), không dừng sau vài lỗi đầu tiên, viết test trước cho mỗi bug.
- **Chấp nhận việc mở rộng phạm vi ngoài danh sách gốc:** Đồng ý để AI tự vá 3 lỗi merge-corruption phát hiện qua audit (không nằm trong yêu cầu ban đầu) vì đây là điều kiện tiên quyết để chạy được `dotnet test`/`npm run build`/`npm run lint` theo đúng yêu cầu kiểm chứng.
- **Dừng đúng lúc để kiểm tra tình trạng hệ thống:** Sau khi hỏi ước lượng khối lượng công việc/token còn lại, chủ động yêu cầu tạm dừng và hỏi thẳng "hệ thống có bug gì không, dùng để review được chưa" — buộc AI chạy lại `npx eslint .`, `npx vitest run`, `npm run build` toàn dự án để xác nhận trạng thái thật thay vì suy đoán.
- **Không chấp nhận báo cáo mập mờ:** Yêu cầu ghi rõ cả phần **chưa xong** (AdminPricingPage mobile-overflow 320px mới phân tích chưa vá; Task IV/V/VI/VII chưa bắt đầu) thay vì chỉ liệt kê phần đã làm.

### Áp dụng cho
- **Backend:** `CourtService.cs`, `DatabaseBootstrap.cs`, `EscrowServiceTests.cs`; test mới `CourtServiceTests.cs` (4 method, 8 test case qua Theory).
- **Frontend:** `api/userApi.js`, `components/owner/OwnerHeader.jsx`, `components/owner/OwnerSidebar.jsx`, `layouts/AdminLayout.jsx`, `layouts/OwnerLayout.jsx`, `pages/admin/{AdminBookingsPage,AdminComplaintsPage,AdminCourtsPage,AdminInventoryPage,AdminKycPage,AdminUsersPage}.jsx`, `pages/apex/ApexShopPage.jsx`, `pages/gear/{CartCheckoutPage,GearCatalogPage}.jsx`, `vite.config.js`, `package.json` (thêm devDependency `@testing-library/react` + `jest-dom` + `user-event`).
- **Frontend (mới):** `hooks/useFocusTrap.js`, `hooks/useIsDesktop.js`, `test/setup.js` (RTL `afterEach(cleanup)`), 7 file test (`AdminComplaintsPage`, `AdminCourtsPage`, `AdminKycPage`, `AdminUsersPage`, `ApexShopPage`, `CartCheckoutPage`, `GearCatalogPage`).

### Kiểm chứng
- Frontend: ESLint toàn dự án — **0 lỗi**; Vitest — **62/62 pass** (9 file test, gồm cả 7 test mới); `npm run build` — thành công.
- Backend: sau khi vá 2 lỗi merge-corruption, build lại được; `CourtServiceTests` mới (8/8 pass qua Theory) xác nhận round-trip trạng thái sân không còn regressive.
- Đã khởi động backend thật (`dotnet run`, kết nối SQL Server thật) để chuẩn bị smoke test bằng browser ở viewport 320px — **phiên browser bị treo/mất tab giữa chừng**, chưa hoàn tất xác minh trực quan; đã tắt sạch process `dotnet` chạy nền trước khi dừng phiên.
- **Chưa làm / còn tồn đọng (không được báo cáo là xong):** fix AdminPricingPage mobile-overflow 320px (mới chẩn đoán, chưa áp code); toàn bộ Task IV (Owner còn sót), Task V (Cart drawer/CartPage/Gear routes), Task VI (Mobile + Staff/Elite — theo đúng brief gốc là phần gần như chưa động tới), Task VII (verification cuối + bảng PASS/FAIL route) của bản yêu cầu 9 phần vẫn chưa bắt đầu.
- **Chưa commit:** toàn bộ thay đổi trên vẫn ở working tree của nhánh `DE190147/audit-module`, dừng theo yêu cầu người dùng để đánh giá tình trạng trước khi quyết định chốt một mốc commit.
