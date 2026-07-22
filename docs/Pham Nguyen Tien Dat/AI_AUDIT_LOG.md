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
- **Công cụ AI:** Claude Code (Claude Sonnet 5), Antigravity, Codex
- **Mục đích:** Tiếp nối tổng kiểm định vận hành sau Log #18; tiếp quản và hoàn thiện phần UI/UX Admin, Owner, Gear/Apex đang làm dở; xử lý lỗi merge, lỗi contract dữ liệu và regression; hòa giải các xung đột khi đưa thay đổi vào nhánh `DE190147/audit-module`.
- **Tham chiếu Prompt:** Prompt #19
- **Trạng thái:** **Đã hoàn tất commit và push** lên `origin/DE190147/audit-module`.

### Tóm tắt kết quả AI

**A. Tích hợp nhánh song song và xử lý merge-corruption**
- Kiểm tra worktree `implement-ui-from-design` của Antigravity/Codex và xác định đây là phần UI đang làm dở cần tiếp quản.
- Phát hiện và xử lý các lỗi merge-corruption chặn build/test:
  - `DatabaseBootstrap.cs`: còn text tên nhánh git trong thân hàm `BaselineAsync`, gây lỗi biên dịch.
  - `EscrowServiceTests.cs`: tham số mock `IVnPayService` bị nhân đôi sau merge, gây sai constructor `EscrowService`.
  - `ApexShopPage.jsx`: còn JSX/logic trùng lặp và text tên nhánh git, làm ESLint parser lỗi.
- Đối chiếu contract thật của backend (`EquipmentDto`, seed data, `CourtStatuses`) trước khi sửa, không chỉ chỉnh để build xanh.

**B. Các lỗi P1 đã xử lý**
1. **CartCheckoutPage**
   - Checkout theo `bookingId` không còn gọi `clearCart()` để xóa toàn bộ giỏ hàng.
   - Chỉ coi thanh toán thành công khi `response?.success === true`.
   - Tổng tiền có fallback an toàn từ danh sách item checkout.
   - Sau thanh toán thành công dùng `refreshCart()` để đồng bộ lại dữ liệu giỏ hàng.

2. **AdminUsersPage**
   - Sửa debounce search làm tự reset trang về trang 1.
   - Tách state tìm kiếm đã debounce, giữ đúng trang hiện tại khi phân trang.
   - Dùng `AbortController` để tránh race condition giữa request cũ và request mới.
   - Bổ sung xử lý chuỗi lỗi `'canceled'` từ axios interceptor.
   - Bổ sung role `CourtOwner` vào bộ lọc người dùng.

3. **Court status contract**
   - Khôi phục giá trị lưu DB chuẩn là `Available`; API vẫn trả/nhận `ACTIVE`.
   - `CourtService.UpdateAsync` chuẩn hóa status trước khi lưu.
   - `CourtRepository.GetPagedCourtsAsync` chuẩn hóa status API trước khi lọc DB.
   - Bổ sung `CourtStatusesTests` và `CourtRepositoryTests`.
   - Sửa form Admin Courts chỉ hiển thị các status hợp lệ: `ACTIVE`, `MAINTENANCE`, `INACTIVE`.

4. **AdminKycPage**
   - Loại bỏ ảnh Unsplash giả làm fallback cho bằng chứng CCCD.
   - Hiển thị trạng thái rõ ràng cho ảnh thiếu/lỗi tải.
   - Khóa nút phê duyệt khi chưa có hoặc chưa tải được ảnh bắt buộc.
   - Thêm xác nhận trước khi phê duyệt và chặn thao tác double-click.

5. **GearCatalogPage**
   - Bổ sung import fallback ảnh theo category để tránh crash runtime.
   - Chặn vòng lặp `onError` khi ảnh fallback cũng tải lỗi.
   - Sửa cấu trúc tương tác lồng `Link`/`button`.

**C. Hoàn thiện Admin Portal**
- `AdminComplaintsPage`
  - Dòng danh sách chuyển từ `<div onClick>` sang `<button>` để dùng được bằng bàn phím.
  - Khi trạng thái khiếu nại thay đổi và không còn thuộc filter hiện tại, hệ thống tự bỏ chọn bản ghi để tránh detail panel hiển thị dữ liệu lạc trạng thái.
  - Bổ sung regression test cho trường hợp này.

- `AdminLayout` và modal
  - Bổ sung `matchMedia` guard cho môi trường test.
  - Sidebar mobile có `inert`, `aria-hidden`, Escape để đóng, focus restore và scroll lock.
  - Modal có role/label/focus management tốt hơn.

- `AdminUsersPage`, `AdminBookingsPage`, `AdminCourtsPage`, `AdminInventoryPage`, `AdminKycPage`
  - Bổ sung accessible name cho ô tìm kiếm.
  - Cải thiện filter-pill, trạng thái loading/error/empty và thao tác bằng bàn phím.
  - Đồng bộ lại test để phản ánh contract API thật.

**D. Hoàn thiện Owner Portal**
- Bổ sung và dùng chung owner UI primitives: button, card, form field, modal, trạng thái rỗng/lỗi, search input.
- Cải thiện `OwnerSidebar`, `OwnerHeader`, `OwnerLayout`:
  - Sidebar mobile/desktop không còn tabbable khi bị ẩn.
  - Có Escape, focus restore, aria state và scroll lock hợp lý.
- Tách tương tác lồng `Link > button` tại các trang Booking/Court.
- Bổ sung nhãn truy cập cho Complex Selector, search input và reply input.
- Cải thiện modal Owner: focus trap, trả focus về phần tử mở modal, bảo toàn body overflow.
- Cô lập state theo `complexId` trong Owner Layout để giảm nguy cơ giữ state của cụm sân cũ khi đổi complex.
- Bổ sung test cho Owner primitives, Owner layout, Owner bookings và Owner operating hours.

**E. Hoàn thiện Apex/Gear Portal**
- `ApexShopPage`
  - Viết lại thành một component thống nhất sau merge conflict.
  - Sửa filter môn thể thao để map đúng dữ liệu API:
    - `Badminton` ↔ `Cầu lông`
    - `Pickleball`
    - `Tennis`
  - Loại bỏ filter trạng thái giả `Premium/New/Trial`; thay bằng filter tồn kho thật `Còn hàng/Hết hàng`.
  - Bổ sung modal quick view và cart drawer có dialog semantics, Escape, focus restore, scroll lock và accessible label.
  - Sửa test Apex để có Router và CartContext mock.

- `CartPage`, `CartCheckoutPage`, `GearCatalogPage`, `GearDetailPage`
  - Sửa fallback ảnh, error handling, accessibility và các flow checkout/cart liên quan.
  - Không còn dùng cross-sell fake ID gây request lỗi.

**F. Hòa giải xung đột khi đưa vào nhánh cá nhân**
- Snapshot UI của Antigravity được commit trước ở worktree riêng.
- Khi cherry-pick sang `DE190147/audit-module`, xuất hiện xung đột tại các file Admin, Owner, Apex, Gear, package và API.
- Theo xác nhận của người dùng, ưu tiên snapshot Antigravity tại vùng xung đột.
- Codex tiếp tục kiểm tra sau merge thay vì dừng ở mức resolve marker:
  - Không còn conflict marker trong source.
  - Sửa test Admin Complaints, Admin Courts và Apex Shop bị sai/thiếu dependency sau merge.
  - Sửa lỗi React refs bị cập nhật trong render làm ESLint chặn `OwnerModal` và dialog Apex.
  - Làm sạch trailing whitespace để `git diff --check` sạch.
- Không commit các thư mục audit cục bộ `.claude/`, `.codex-work/`, `outputs/`.

### Quyết định và can thiệp của con người
- Yêu cầu AI tiếp quản phần Codex/Antigravity đang làm dở, xử lý tận gốc thay vì chỉ làm test/build xanh.
- Đồng ý mở rộng phạm vi để sửa lỗi merge-corruption vì đây là điều kiện cần để chạy kiểm chứng toàn hệ thống.
- Xác nhận ưu tiên snapshot Antigravity khi hòa giải xung đột với nhánh `DE190147/audit-module`.
- Yêu cầu commit và push sau khi xử lý conflict, regression và kiểm chứng xong.
- Yêu cầu không đưa các file audit cục bộ, output và script tạm vào commit.

### Áp dụng cho
- **Backend:** `CourtService.cs`, `CourtStatuses.cs`, `Court.cs`, `CourtRepository.cs`, `DatabaseBootstrap.cs`, `EscrowServiceTests.cs`.
- **Backend test mới/cập nhật:** `CourtStatusesTests.cs`, `CourtRepositoryTests.cs`.
- **Frontend Admin:** `AdminLayout`, `AdminBookingsPage`, `AdminComplaintsPage`, `AdminCourtsPage`, `AdminDashboardPage`, `AdminInventoryPage`, `AdminKycPage`, `AdminPricingPage`, `AdminUsersPage`.
- **Frontend Owner:** `OwnerLayout`, `OwnerHeader`, `OwnerSidebar`, `ComplexSelector`, owner UI primitives và các trang Owner liên quan.
- **Frontend User/Gear/Apex:** `ApexShopPage`, `ApexBookingPage`, `ApexHomePage`, `CartCheckoutPage`, `CartPage`, `GearCatalogPage`, `GearDetailPage`.
- **Tài liệu:** `docs/ui/design-system-spec.md`, `docs/ui/market-benchmark.md`, `docs/ui/remediation-plan.md`, `docs/ui/ui-audit.md`.
- **Frontend test:** Admin Complaints, Admin Courts, Admin KYC, Admin Users, Apex Shop, Cart Checkout, Gear Catalog, Owner Layout, Owner Primitives, Owner Bookings, Owner Operating Hours.

### Kiểm chứng cuối cùng
- Frontend:
  - `npm test -- --run` — **63/63 pass**.
  - `npm run lint -- --quiet` — pass.
  - `npm run build` — pass.
- Backend:
  - `dotnet test ProSport.sln --no-restore` — **142 pass, 4 skipped, 0 fail**.
- Chất lượng merge:
  - `git diff --check` — pass.
  - Không còn conflict marker trong mã nguồn.

### Commit và push
- `72d0529 feat: unify portal UI and harden workflows`
- `1348d57 fix: reconcile conflicted portal workflows`
- Đã push thành công lên `origin/DE190147/audit-module`.
- Remote branch hiện trỏ tới commit `1348d57`.

### Phần còn tồn đọng
- Chưa hoàn tất kiểm thử trực quan toàn bộ route bằng browser ở viewport mobile 320px.
- Cần tiếp tục audit sâu Mobile và Staff/Elite Portal để bao phủ toàn bộ brief UI ban đầu.
- Một số hạng mục responsive chuyên biệt, ví dụ Admin Pricing ở viewport rất hẹp, cần kiểm chứng trực quan riêng trước khi kết luận hoàn tất toàn bộ UI.

---

## Log #20
- **Ngày:** 2026-07-17
- **Người thực hiện:** Phạm Nguyễn Tiến Đạt
- **Công cụ AI:** Claude Code (Claude Sonnet 5)
- **Mục đích:** Tải `main` mới nhất từ GitHub (sau khi PR #48/#49/#50 được merge, bao gồm tính năng Escrow wallet-linking, CommunityFeed, viết lại ApexBookingPage/ApexWalletPage/CreateMatchPage), tự rà soát tìm bug phát sinh và tự nghiên cứu, thực hiện fix — không chờ danh sách lỗi được giao sẵn.
- **Tham chiếu Prompt:** Prompt #20
- **Trạng thái:** Đã commit trên nhánh mới `fix/main-bug-sweep-post-PR50` (từ `main` @ `e935c10`), **chưa push/mở PR**.

### Tóm tắt kết quả AI

**A. Rà soát ban đầu**
- `git fetch` + `git checkout main` + `git pull` — cập nhật `main` từ `ad03418` lên `e935c10` (34 commit, bao gồm PR #48 gộp audit-module, PR #49 gộp tiếp Task III/IV UI, PR #50 gộp `feat/DE190130_Hoan_Thien_Frontend_P2` + commit fixup `bae6c1e fix(frontend): resolve conflicts and fix Create Match payload`).
- Diff `f4411d2..e935c10`: 34 file, +5308/-648 dòng — Escrow wallet-linking (backend), `CommunityFeed.jsx` mới, viết lại lớn `ApexBookingPage`/`ApexWalletPage`/`CreateMatchPage`/`MatchProCommunityPage`/`MatchProLeaderboardPage`.
- Chạy `npm install`, `npx eslint .`, `npm run build`, `npx vitest run`, `dotnet build`, `dotnet test` trên `main` để xác lập baseline trước khi tìm bug cụ thể.

**B. Năm bug thật tìm được và đã sửa**
1. **[P0 — chặn toàn bộ test]** `package.json` thiếu hẳn `@testing-library/jest-dom` (bị rơi mất khi resolve conflict merge PR #50, dù `081ae16` trước đó đã thêm) → cả 13 file test fail ngay từ bước resolve import, 0 test nào chạy được. Khôi phục dependency + `npm install` lại → 63/63 pass.
2. **[P0 — tài chính]** `MatchService.CreateMatchAsync` bỏ qua hoàn toàn `dto.EscrowAmount` (số tiền ký quỹ host tự cấu hình ở Step 3 UI, có nút "Gợi ý chia đều") và luôn tự tính lại `Math.Round(booking.TotalAmount / dto.MaxParticipants)` — số tiền hiển thị cho host trước khi submit không khớp số tiền thực sự lưu vào DB. Viết test tái hiện (`CreateMatchAsync_UsesHostConfiguredEscrowAmount_NotAutoSplitOfBookingTotal`) xác nhận lỗi đúng nguyên nhân (100000 thay vì 60000 mong đợi), sửa dùng `dto.EscrowAmount`.
3. **[P1 — tính năng hỏng hoàn toàn]** `MatchDetailPage.jsx` tham chiếu các field không tồn tại trên `MatchDto` thật (`match.title`, `match.skillLevel`, `match.location`, `match.participants`) — heading trận đấu luôn rỗng, badge môn thể thao hardcode "Cầu Lông" bất kể môn thật, và toàn bộ tính năng "Đánh giá người chơi" (TK-035) không bao giờ hoạt động vì `participants` luôn `undefined` (không có field này trên `MatchDto`, và endpoint `/participants` duy nhất chỉ host mới gọi được). Bổ sung endpoint mới `GET /matches/{id}/members` (host hoặc joiner đã duyệt mới xem được, 403 với người ngoài) ở cả `IMatchService`/`MatchService`/`MatchController`, viết 2 test (`GetMatchMembersAsync_ReturnsApprovedMembers_ForHostOrApprovedJoiner`, `GetMatchMembersAsync_Returns403_ForUserNotInMatch`), rồi sửa lại toàn bộ field hiển thị theo đúng contract thật (`courtName`/`levelRequirement`/`sportType`/`hostName`).
4. **[P2 — dữ liệu giả]** `CreateMatchPage.jsx` có 2 field "Tên trận đấu" và "Bộ môn" (dropdown không có `value`/`onChange`) mà người dùng nhập/chọn vào nhưng không bao giờ được gửi lên backend (không tồn tại trong `CreateMatchDto`) — bỏ khỏi form, tránh đánh lừa người dùng nghĩ trận đấu có tên/môn tùy chỉnh.
5. **[P2 — contract sai]** `matchApi.approveJoiner` gọi sai hoàn toàn URL/method (`POST /matches/{id}/approve/{pid}`) so với route backend thật (`PUT /matches/{id}/participants/{pid}/approve`) — sửa lại đúng, đồng thời phát hiện tính năng "host duyệt người xin tham gia" hiện **chưa có bất kỳ trang UI nào gọi tới** (chỉ tồn tại ở tầng API/service, không sử dụng được từ giao diện) — bổ sung `rejectJoiner`/`getPendingJoiners` cho đối xứng nhưng **không** tự ý xây dựng trang UI mới cho tính năng này (vượt phạm vi sửa bug, cần quyết định sản phẩm riêng).

### Quyết định & Can thiệp của con người
- **Chỉ đạo:** Tải `main` mới nhất, tự rà soát tìm bug, tự nghiên cứu và tự sửa — không chờ danh sách lỗi được giao sẵn.
- **Không mở rộng phạm vi thành xây tính năng mới:** Khi phát hiện tính năng "host duyệt joiner" thiếu UI hoàn toàn, chỉ sửa contract API (URL/method) cho đúng và bổ sung hàm client sẵn sàng dùng, không tự ý dựng thêm một trang quản trị mới — việc đó cần quyết định phạm vi sản phẩm, không phải một bug fix đơn thuần.
- **Không commit thẳng lên `main`:** Tạo nhánh riêng `fix/main-bug-sweep-post-PR50` cho các bản vá, giữ đúng quy ước PR-review của repo thay vì commit trực tiếp lên nhánh chính.

### Áp dụng cho
- **Backend:** `MatchController.cs` (endpoint mới `GET /matches/{id}/members`), `IMatchService.cs`, `MatchService.cs` (bỏ auto-split escrow, thêm `GetMatchMembersAsync`), `MatchServiceTests.cs` (+4 test).
- **Frontend:** `package.json`/`package-lock.json` (khôi phục `@testing-library/jest-dom`), `api/matchApi.js` (sửa `approveJoiner`, thêm `getMatchMembers`/`rejectJoiner`/`getPendingJoiners`), `pages/matches/CreateMatchPage.jsx` (bỏ 2 field giả), `pages/matches/MatchDetailPage.jsx` (sửa contract field + wiring members thật).

### Kiểm chứng
- Frontend: ESLint **0 lỗi**; Vitest **63/63 pass**; `npm run build` — thành công.
- Backend: `dotnet build` — 0 warning, 0 error; `dotnet test` — **145/149 pass** (4 skip SQL Server integration, +4 test mới so với baseline `main`).
- Commit cục bộ `b7775a8` trên nhánh `fix/main-bug-sweep-post-PR50` (dựa trên `main` @ `e935c10`) — **chưa push, chưa mở PR**, chờ quyết định của người dùng.




---

## Log #21
- **Ngày:** 2026-07-17 → 2026-07-19
- **Người thực hiện:** Phạm Nguyễn Tiến Đạt
- **Công cụ AI:** Claude Code (Claude Sonnet 5)
- **Mục đích:** Đối chiếu State Diagram với codebase thật và vá lệch pha; hoàn thiện vòng đời Tournament và chuẩn hóa status Booking/Equipment/ComplexOwner/ComplexReview/Report/User qua audit theo từng phạm vi vai trò (User/Admin/Owner) bằng spec-kit; thử nghiệm redesign toàn bộ UI Admin và Public/Customer theo hướng "editorial sports brutalism"; sau đó rollback phần UI theo yêu cầu và chốt commit/push phần backend/database lên `DE190147/audit-module`.
- **Tham chiếu Prompt:** Prompt #21
- **Trạng thái:** **Đã commit & push** (`7ecc942`, fast-forward `1348d57..7ecc942`) — riêng phần redesign UI Admin/Customer (mục D) **đã bị rollback theo yêu cầu, không nằm trong commit**.

### Tóm tắt kết quả AI

**A. Đối chiếu State Diagram ↔ Codebase**
- Đọc `STATE_DIAGRAM_PRO-SPORT.drawio`, đối chiếu từng state/transition với code thật. Phát hiện Booking thiếu kích hoạt `PendingPayment`/`Expired`, Tournament thiếu state Close/Complete/Cancel, thiếu cạnh player tự rút khỏi trận. Sửa lại `.drawio` cho khớp code làm baseline.

**B. Backlog P1–P3 (spec-kit `specs/001`, `specs/002`)**
- P1: kích hoạt đầy đủ `PendingPayment`/`Expired` cho Booking.
- P2: hoàn thiện Tournament lifecycle Close/Complete/Cancel.
- P3: sửa comment lỗi thời tại `MatchParticipant.Status` (escrow đã tách sang cờ `HasPaidEscrow`, không còn là status).

**C. Re-audit sau P1–P3 — chọn A1 + B**
- Phát hiện các nhánh timeout Booking vẫn lẫn lộn `Cancelled`/`Expired`. Hai hướng sửa (A1: luôn `Expired`; A2: revert `Cancelled`) loại trừ lẫn nhau — chọn **A1** (nhất quán "hết hạn do không thao tác"), cộng thêm **B**: bổ sung cạnh Tournament "player tự rút khỏi trận" còn thiếu.

**D. Audit DB/Frontend theo phạm vi vai trò (`specs/003–005`) + thử nghiệm redesign UI (`specs/006–007`, đã rollback)**
- Audit lần lượt User → Admin → Owner, phát hiện bug thật: `OwnerMembershipsPage` gửi status `'Suspended'` không hợp lệ lên API.
- Chốt tập status hợp lệ cho `Equipment`/`ComplexOwner`/`ComplexReview`/`Report`/`User`, enforce bằng 4 migration DB check constraint.
- Redesign thử nghiệm Admin UI (25 task) và Public/Customer UI (30 task, 4 component dùng chung `CourtCard`/`MatchCard`/`ProductCard`/`MatchDayRail`) theo quy trình spec-kit 4 giai đoạn có gate phê duyệt bắt buộc đúng cụm từ. **Toàn bộ phần này đã bị rollback ở mục E, không còn trong working tree.**

**E. Rollback UI & Version Control**
- Theo yêu cầu người dùng, xác nhận PR #49 (`github.com/.../pull/49`) = commit `1348d57`; sau khi làm rõ phạm vi (giữ bugfix đã commit ở `191cec1`, chỉ bỏ UI **chưa commit**), chạy `git checkout -- src/frontend` + `git clean -fd` cho 4 component mới → `src/frontend` sạch, về đúng `191cec1`.
- Commit `7ecc942` gộp toàn bộ thay đổi backend/database/spec-kit, **cố ý loại trừ** `.claude/skills/` (~7.7MB font asset, không phải code dự án). Push fast-forward `origin/DE190147/audit-module`.

### Quyết định & Can thiệp của con người
- **Chỉ đạo có nguyên tắc:** khi A1/A2 loại trừ nhau, yêu cầu AI tự chọn và giải thích rõ lý do thay vì hỏi lại; giao quyền quyết định data-modeling (status set) cho AI với điều kiện có nghiên cứu evidence trước khi chốt.
- **Ép gate phê duyệt nghiêm ngặt:** với brief redesign UI dài, yêu cầu AI chỉ tiến từng giai đoạn spec-kit khi nhận đúng cụm từ (`APPROVE SPEC`/`APPROVE PLAN`/`APPROVE IMPLEMENTATION`) — từ chối "tiếp tục" mơ hồ 2 lần, AI tuân thủ đúng.
- **Chặn hành động ngoài phạm vi đã duyệt:** khi AI định xóa `MatchProLayout.css` dựa trên một câu trả lời chung chung, hệ thống permission tự động chặn vì mâu thuẫn với chính plan đã `APPROVE PLAN` trước đó — AI khôi phục ngay và giải thích lý do dừng thay vì lách qua.
- **Quyết định rollback UI:** sau khi xem preview, yêu cầu rollback UI về một PR cụ thể; làm rõ qua nhiều vòng hỏi đáp để xác định đúng phạm vi (giữ bugfix `191cec1`, chỉ bỏ phần chưa commit) trước khi cho phép AI thực thi thao tác mất dữ liệu không hoàn tác.
- **Kiểm soát Version Control:** chỉ định rõ commit đúng nhánh `DE190147/audit-module` rồi mới push; AI chủ động loại `.claude/skills/` khỏi commit để tránh phình repo bằng asset không liên quan.

### Áp dụng cho
- **Backend:** `TournamentController.cs`, `ITournamentService.cs`, `EscrowService.cs`, `ReportService.cs`, `MatchParticipant.cs`, `ProSportDbContext.cs`, `BookingRepository.cs`, `EscrowRepository.cs`, `SplitPaymentService.cs`, `TournamentService.cs`.
- **Test:** `AuditBusinessLogicTests.cs`, `PlayerFeaturesServiceTests.cs`, `SqlServerIntegrationTests.cs`, `TournamentLifecycleTests.cs` (mới).
- **Database:** 4 migration mới (`TournamentStatusConstraint`, `UserStatusConstraints`, `AdminEntityStatusConstraints`, `OwnerEntityStatusConstraints`), `ProSportDB_EFCore_AutoGenerated.sql`.
- **Tài liệu:** `specs/001`–`specs/007`, `STATE_DIAGRAM_PRO-SPORT.drawio`, `.specify/`, `CLAUDE.md`.
- **Frontend (đã rollback, không còn trong working tree):** `CourtCard.jsx`, `MatchCard.jsx`, `ProductCard.jsx`, `MatchDayRail.jsx` và ~29 trang Admin/Apex/Gear/Match từng được restyle.

### Kiểm chứng
- `dotnet test`: **161/161 pass**, 9 skip (integration, cần connection string thật) — không hồi quy sau các thay đổi backend.
- Trước rollback: Vitest **71/71 pass**, ESLint **0 lỗi**, `npm run build` thành công; live browser xác nhận luồng booking/match/shop hoạt động đúng (đăng nhập `customer1@prosport.vn`).
- Sau rollback: `git status -- src/frontend` sạch, xác nhận UI về đúng trạng thái commit `191cec1`.
- `git push origin DE190147/audit-module`: fast-forward `1348d57..7ecc942`, không xung đột.



---
## Log #22
- **Ngày:** 2026-07-21
- **Người thực hiện:** Phạm Nguyễn Tiến Đạt
- **Công cụ AI:** Claude Code (Claude Sonnet 5)
- **Mục đích:** Bổ sung tính năng Thêm/Xóa sản phẩm cho Admin Inventory (`AdminInventoryPage`); trong quá trình đó phát hiện và vá 2 bug thật ở tầng backend/frontend: `EquipmentService.CreateAsync` hardcode Category/SportType/StockQuantity, và `resolveProductImage` ưu tiên sai thứ tự khiến ImageUrl admin đặt bị ghi đè bởi bảng match-từ-khóa.
- **Tham chiếu Prompt:** "Yêu cầu bổ sung nút Thêm và Xóa sản phẩm ở trang Admin Inventory. Khi thử tạo một sản phẩm Pickleball thật để kiểm tra tính năng, phát hiện dữ liệu lưu vào hệ thống không khớp với lựa chọn thực tế và yêu cầu xử lý triệt để thay vì chỉ vá ở giao diện. Khi rà soát ảnh cho nhóm sản phẩm Yonex Astrox, phát hiện ảnh bị gán nhầm hàng loạt và yêu cầu xác định nguyên nhân gốc. Cuối cùng, cung cấp trực tiếp ảnh sản phẩm để thay thế ảnh hiển thị của "Giày Yonex Power Cushion Cascade Drive"
- **Trạng thái:** Hoàn thành, đã kiểm chứng bằng test — **chưa commit**.

### Tóm tắt kết quả AI

**A. Tính năng Thêm sản phẩm (Admin Inventory)**
- Thêm modal `AddProductModal` trong `AdminInventoryPage.jsx`: chọn danh mục (`EquipmentCategory` thật từ API `/equipment-categories`), môn thể thao (Badminton/Pickleball), giá, tồn kho, ảnh (URL tuỳ chọn), mô tả.
- Thêm `equipmentApi.create()` (POST `/equipment`) và `equipmentApi.getCategories()` vào `equipmentApi.js`.
- Nút "Thêm sản phẩm" bị `disabled` khi danh mục chưa load xong, tránh submit với `equipmentCategoryId` rỗng.

**B. Tính năng Xóa sản phẩm (Admin Inventory)**
- Thêm nút xóa từng dòng, dùng `useConfirm()` (dialog xác nhận) trước khi gọi `equipmentApi.delete(id)` (đã có sẵn ở backend, chỉ nối UI).
- Cập nhật state lạc quan (`setItems(prev => prev.filter(...))`) sau khi xóa thành công, có toast thành công/thất bại.

**C. Bug — `EquipmentService.CreateAsync` hardcode dữ liệu (`src/backend/ProSport.Application/Services/EquipmentService.cs`)**
- Phát hiện khi nối tính năng Thêm sản phẩm ở FE: mọi thiết bị mới tạo qua API đều bị gắn cứng `Category = "Racket"`, `SportType = "Badminton"`, `StockQuantity = 0` bất kể DTO gửi lên gì — tạo giày Pickleball vẫn hiện là vợt cầu lông, và luôn hết hàng ngay khi tạo.
- Sửa: `Category` lấy từ `EquipmentCategory.Name` thật của FK đã chọn (fallback `"Accessories"` nếu category null), `SportType`/`StockQuantity` lấy trực tiếp từ `dto`. Thêm `SportType` (regex `Badminton|Pickleball`) và `StockQuantity` vào `CreateEquipmentDto` với validation.
- Thêm test khóa lại hành vi: `EquipmentServiceTests.CreateAsync_PickleballFootwear_SavesRealCategorySportTypeAndStock_NotHardcoded`.

**D. Bug — `resolveProductImage` sai thứ tự ưu tiên (`src/frontend/src/utils/productImages.js`)**
- Bảng match-từ-khóa (`LOCAL_PRODUCT_IMAGES`) được kiểm tra **trước** `ImageUrl` admin đã gán, nên một sản phẩm có `ImageUrl` hợp lệ vẫn bị âm thầm ghi đè nếu tên chỉ cần trùng từ khóa với sản phẩm khác (VD: mọi vợt có chữ "Astrox" trong tên đều bị gán nhầm ảnh Astrox 88D dù đã có ảnh riêng).
- Sửa: kiểm tra `ImageUrl` hợp lệ trước, chỉ fallback về bảng từ khóa khi không có `ImageUrl` thật.
- Thêm test khóa lại: `productImages.test.js` — 3 case (ImageUrl ưu tiên trước từ khóa; không có ImageUrl vẫn fallback từ khóa như cũ; không khớp gì thì fallback theo category).

### Quyết định & Can thiệp của con người
- **Phát hiện bug qua kiểm thử tính năng, không phải audit chủ động:** cả 2 bug (C, D) không nằm trong yêu cầu ban đầu ("thêm nút Thêm/Xóa sản phẩm") — lộ ra khi thử tạo sản phẩm Pickleball thật và khi gán ảnh cho các sản phẩm Yonex Astrox. Người dùng đồng ý mở rộng phạm vi sang sửa luôn 2 bug này thay vì chỉ né tránh ở tầng UI.
- **Yêu cầu bắt buộc có test khóa hành vi** trước khi coi bug đã sửa xong — không chỉ sửa code mà không kiểm chứng bằng test tự động, tránh regressive về sau.
- **Chưa commit:** theo thói quen làm việc đã thiết lập, giữ nguyên trạng thái working tree cho đến khi người dùng xác nhận rõ phạm vi commit tiếp theo.

### Áp dụng cho
- **Backend:** `CreateEquipmentDto.cs`, `EquipmentService.cs`.
- **Test:** `EquipmentServiceTests.cs` (mới), `productImages.test.js` (mới).
- **Frontend:** `AdminInventoryPage.jsx`, `equipmentApi.js`, `productImages.js`.

### Kiểm chứng
- `dotnet test --filter FullyQualifiedName~EquipmentServiceTests`: **1/1 pass**.
- `npx vitest run src/utils/productImages.test.js`: **3/3 pass**.
- `npx vitest run` (toàn bộ frontend): **74/74 pass**, 18/18 test file, không hồi quy.




---
## Log #23
- **Ngày:** 2026-07-22
- **Người thực hiện:** Phạm Nguyễn Tiến Đạt
- **Công cụ AI:** Antigravity / Claude Code
- **Mục đích:** Đồng bộ dữ liệu hạt giống (seed data) thiết bị, dọn dẹp bảo mật cấu hình, tối ưu giao diện theo nguyên tắc Taste Skill và đẩy code lên nhánh làm việc.
- **Tham chiếu Prompt:** "Yêu cầu đồng bộ dữ liệu sản phẩm từ cơ sở dữ liệu lên mã nguồn (DatabaseSeeder) và thay đổi đường dẫn ảnh tĩnh để đảm bảo tính nhất quán khi triển khai trên các môi trường khác. Chỉ đạo rà soát toàn diện frontend và cấu hình để phát hiện, khắc phục các bất cập hoặc lỗi bảo mật tiềm ẩn. Áp dụng chuẩn Taste Skill để tối ưu hóa giao diện người dùng (customer UI), đặc biệt yêu cầu tinh chỉnh hộp thoại thông báo (Notification Box) để loại bỏ thiết kế khô cứng, mang lại trải nghiệm mượt mà và cao cấp hơn. Cuối cùng, yêu cầu đóng gói toàn bộ thay đổi và đẩy lên nhánh DE190147/audit-module."
- **Trạng thái:** Hoàn thành, đã commit và push thành công lên nhánh `DE190147/audit-module`.

### Tóm tắt kết quả AI

**A. Đồng bộ DatabaseSeeder & Sửa lỗi đường dẫn ảnh tĩnh**
- Chuyển đổi 47 sản phẩm thực tế từ cơ sở dữ liệu local sang file `DatabaseSeeder.cs` để đảm bảo những thành viên khác khi tải project về và chạy sẽ có ngay dữ liệu cửa hàng đầy đủ.
- Gỡ bỏ URL hardcode `http://localhost:5173` trong đường dẫn ảnh, chuyển thành đường dẫn tương đối (VD: `/images/...`) để đảm bảo tính di động (portability) và tránh bug không load được ảnh trên môi trường Production.

**B. Dọn dẹp bảo mật (Security Cleanup) ở appsettings.json**
- Chủ động rà soát file cấu hình và phát hiện các thông tin nhạy cảm (Gmail App Password và Hash Secret của VNPay) đang bị hardcode trực tiếp trong `appsettings.json`.
- Tiến hành gỡ bỏ các chuỗi nhạy cảm này ra khỏi source code để ngăn chặn rò rỉ bảo mật khi đẩy code lên Git (đồng thời khuyến cáo người dùng nên thay đổi các secret này).

**C. Tối ưu Giao diện Thông báo (NotificationMenu) theo Taste Skill**
- Nhận diện giao diện box thông báo hiện tại có thiết kế khá "robot" (viền đen dày `border-2`, góc vuông cứng `rounded-[2px]`).
- Áp dụng các nguyên tắc từ `DESIGN.md` (Taste Skill): Chuyển sang viền mỏng nhẹ (`border-slate-200/60`), bo góc lớn (`rounded-[16px]`), đổ bóng mềm (`shadow-[0_12px_40px...]`).
- Tối ưu trạng thái chưa đọc (unread) với nền xanh ngọc nhạt (`bg-teal-50/30`) và chấm tròn phát sáng (`shadow-[0_0_8px...]`), kèm theo hiệu ứng hover đổi màu mượt mà giúp giao diện trông cao cấp (Premium) hơn.

**D. Quản lý Source Code**
- Tổng hợp toàn bộ thay đổi và commit theo convention (`style: optimize notification menu UI per Taste Skill, sync DatabaseSeeder`).
- Push thành công toàn bộ code lên nhánh `DE190147/audit-module` trên repository.

### Quyết định & Can thiệp của con người
- **Đảm bảo tính nhất quán (Portability):** Chỉ đạo AI kiểm tra kỹ các vấn đề tiềm ẩn ở frontend/database để đảm bảo khi người khác kéo source về chạy vẫn ra đúng giao diện và dữ liệu (không bị chết link ảnh).
- **Trải nghiệm Thẩm mỹ (Taste Skill):** Yêu cầu cụ thể việc cải thiện độ mượt mà ("smooth") của giao diện thông báo thay vì chấp nhận thiết kế khô cứng mặc định, hướng tới trải nghiệm cao cấp cho khách hàng.
- **Commit và Push:** Trực tiếp chỉ định nhánh đích để tự động hóa việc đưa code lên repository, khép lại quy trình phát triển.

### Áp dụng cho
- **Backend:** `src/backend/ProSport.Infrastructure/Data/DatabaseSeeder.cs`, `src/backend/ProSport.Infrastructure/Data/ModelBuilderSeedExtensions.cs`, `src/backend/ProSport.API/appsettings.json`.
- **Frontend:** `src/frontend/src/components/ui/NotificationMenu.jsx`.

### Kiểm chứng
- Code build và biên dịch thành công.
- Khôi phục seed data và hiển thị ảnh tương đối hoạt động tốt.
- Box Thông báo hiển thị mượt mà, bóng đổ tinh tế, hết cảm giác "robot".
- Đã đẩy code an toàn lên nhánh `DE190147/audit-module`.
