# AI Audit Log

## Log #01
- **Ngày:** 2026-05-20
- **Người thực hiện:** Phạm Nguyễn Tiến Đạt
- **Công cụ AI:** Gemini
- **Mục đích:** Tạo prompt để hướng dẫn Stitch thiết kế giao diện web UI.
- **Tham chiếu Prompt:** "Như là một DESIGNER, bạn hãy cho tôi prompt để hướng dẫn Stitch làm phần thiết kế UI tĩnh cho dự án Pro-Sport Complex Management System của tôi..."

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
- **Tham chiếu Prompt:** "Design a clean and modern dashboard for a sports complex management system. Include a sidebar for navigation..."

### Tóm tắt kết quả AI
- Sinh ra mã nguồn (HTML/CSS/JS) cho một giao diện web trực quan.
- Tạo layout trang Dashboard, thanh điều hướng (Navbar/Sidebar), và các component hiển thị trạng thái sân (trống/đã đặt/đang bảo trì).

### Quyết định & Can thiệp của con người
- **Chấp nhận:** Sử dụng toàn bộ cấu trúc Layout, lưới (Grid/Flexbox) và mã màu CSS cho các trang lõi.
- **Can thiệp kỹ thuật 1 (Tách Component):** Tách các file HTML tĩnh nguyên khối thành các file `.jsp` riêng biệt (Header, Footer, Menu) để tái sử dụng theo cấu trúc Java Web.
- **Can thiệp kỹ thuật 2 (Dữ liệu động & Sửa lỗi Responsive):** Thêm các thẻ JSTL, thay thế dữ liệu giả (mock data) của Stitch bằng dữ liệu động truyền từ Model/Controller, và tinh chỉnh các class CSS để responsive tốt hơn trên thiết bị di động.

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
- **Tham chiếu Prompt:** "Build a responsive React component for a sports court booking form. It should include fields for selecting the date, time slots, court type..."

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
- **Tham chiếu Prompt:** "Please act as an expert Frontend Developer and help me upgrade my existing React (Vite) application located at..."

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





## Log #05
**Ngày:** 2026-05-29 
**Người thực hiện:** Phạm Nguyễn Tiến Đạt  
**Công cụ AI:** Antigravity  
**Mục đích:** Xây dựng toàn bộ hệ thống giao diện đa phân hệ (Elite OS, Mobile App, Admin Portal, Shop, Public Pages, Status Pages).  
**Tham chiếu Prompt:** *"sau đây tôi sẽ gửi các ảnh về thiết kế hệ thống của tôi, bạn hãy code react để thiết kế phần front end để giao diện giống trong ảnh giúp tôi nhé..."*

---

### Tóm tắt kết quả AI

- Sinh ra **40+ React pages** phủ khắp 6 phân hệ độc lập từ ảnh thiết kế:
  - **Public Pages (7 trang):** `HomePage`, `LoginPage`, `RegisterPage`, `RoleSelectionPage`, `ResetPasswordPage`, `AboutPage`, `ContactPage`
  - **Admin Portal (8 trang):** `AdminDashboardPage`, `AdminUsersPage`, `AdminCourtsPage`, `AdminBookingsPage`, `AdminInventoryPage`, `AdminPricingPage`, `AdminKycPage`, `AdminComplaintsPage`
  - **EliteSport OS (6 trang):** `EliteDashboardPage`, `EliteSchedulePage`, `ElitePosWalkInPage`, `EliteEquipmentPage`, `EliteVouchersPage`, `EliteDisputesPage`
  - **Mobile App (8 trang):** `MobileHomePage`, `MobileDashboardPage`, `MobileMatchesPage`, `MobileBookingPage`, `MobileChatPage`, `MobileWalletPage`, `MobileProfilePage`, `MobileScannerPage`
  - **Shop (5 trang):** `ShopPage`, `ShopProductPage`, `ShopCartPage`, `ShopCheckoutPage`, `ShopWishlistPage`
  - **Status Pages (3 trang):** `NotFoundPage` (404), `RestrictedPage` (403), `MaintenancePage`
- Tạo **6 Layout Component** riêng biệt: `EliteLayout`, `MobileLayout`, `AdminLayout`, `GearLayout`, `ShopLayout`, `MatchProLayout`, `ProSportDashLayout`.
- Tạo component `AIChatbot.jsx` tích hợp vào layout Mobile.
- Thiết lập toàn bộ hệ thống routing trong `App.jsx` với 40+ routes.

---

### Quyết định & Can thiệp của con người

**Chấp nhận:** Tái sử dụng toàn bộ cấu trúc JSX, CSS, và logic routing do AI sinh ra làm nền tảng.

**Can thiệp kỹ thuật 1 (Sửa lỗi Build — Entry Point):** AI sinh ra file `index.html` với đường dẫn script trỏ sai (`/src/main.jsx` thay vì `/main.jsx`) khiến Vite không thể build. Tự phát hiện và sửa thủ công — AI không tự nhận ra do không kiểm tra cấu trúc thư mục thực tế.

**Can thiệp kỹ thuật 2 (Sửa lỗi Routing):** AI để comment toàn bộ các route Public trong `App.jsx` khiến trang chủ `/` và các trang `/login`, `/register` trả về 404. Ngoài ra, các route `/about`, `/courts`, `/matches`, `/gear` tồn tại ở Navbar nhưng không được đăng ký. Tự bổ sung và uncomment toàn bộ.

**Can thiệp kỹ thuật 3 (Sửa lỗi CSS tương thích trình duyệt):** AI sử dụng selector CSS `:has()` không được hỗ trợ trên Firefox, gây vỡ layout trên một số trình duyệt. Xóa bỏ toàn bộ, thay bằng cách tiếp cận dùng class thông thường. Đồng thời phát hiện và gộp các CSS rule bị khai báo trùng lặp.

**Can thiệp kỹ thuật 4 (Sửa lỗi Navigation):** AI sinh ra 10 nav link trong `AdminLayout` (Matches, Inventory, Rentals, Products, Payments, Vouchers...) trỏ tới các route không được đăng ký trong `App.jsx`, gây lỗi 404 khi click vào sidebar. Tự phát hiện và xóa toàn bộ các link không hợp lệ.

**Can thiệp kỹ thuật 5 (Sửa lỗi Layout Mobile):** `MobileChatPage` và `MobileBookingPage` sử dụng `position: absolute` cho thanh input/nút sticky, gây chồng lấp nội dung do không nhận biết được scroll container thực tế của `MobileLayout`. Chuyển sang `position: sticky` để xử lý đúng hành vi.

---

### Áp dụng cho

- `src/frontend/src/App.jsx` — Cấu hình toàn bộ routing
- `src/frontend/index.html` — Sửa entry point
- `src/frontend/src/layouts/` — Toàn bộ 7 file Layout
- `src/frontend/src/pages/` — Toàn bộ 40+ trang UI
- `src/frontend/src/components/AIChatbot.jsx`

---

### Kiểm chứng

- Chạy `npm run build` để xác nhận **0 lỗi**, **108 modules** transform thành công.
- Duyệt thủ công qua 40+ route trên `localhost:5173` để xác nhận không có trang nào trả về 404.
- Kiểm tra giao diện Mobile trên Chrome DevTools (Device Toolbar) ở kích thước 414px để xác nhận layout không bị vỡ.
- Kiểm tra trên Firefox để xác nhận lỗi `:has()` đã được xử lý hoàn toàn.

## Log #06
**Ngày:** 2026-06-01  
**Người thực hiện:** Phạm Nguyễn Tiến Đạt  
**Công cụ AI:** Antigravity (Gemini)  
**Mục đích:** Hoàn thiện phân hệ Gear (Trang thông tin & phụ trợ) và chuẩn hóa đa ngôn ngữ (Tiếng Anh).  
**Tham chiếu Prompt:** "sửa ở các chỗ khác luôn xem ở đâu có ngôn ngữ khác chuyển sang tiếng anh tất", "hoàn thành các mục trong gear (Equioment catalog, .....)"  
**Tóm tắt kết quả AI**
* Quét và dịch các từ khóa tiếng Việt còn sót lại sang tiếng Anh để chuẩn hóa giao diện.
* Tạo mới mã nguồn hoàn chỉnh cho 4 trang phụ trợ của phân hệ Gear: Equipment Rental Terms (Điều khoản thuê), Maintenance Tracking (Theo dõi bảo trì), Support Hub (Trung tâm hỗ trợ), Privacy Policy (Chính sách bảo mật).
* Tự động cập nhật `App.jsx` để thêm các route mới và chỉnh sửa `GearLayout.jsx` để gắn link thực vào footer.
**Quyết định & Can thiệp của con người**
* **Chấp nhận:** Áp dụng toàn bộ nội dung, layout và CSS nội bộ do AI sinh ra cho 4 trang thuộc phân hệ Gear. Các giao diện rất đồng nhất và tuân thủ đúng chuẩn Premium UI.
* **Can thiệp kỹ thuật 1 (Xử lý sự cố API Quota):** Khi yêu cầu AI rà soát và dịch tiếng Việt trên toàn bộ 40+ file, AI đã tự động phân luồng (spawn) quá nhiều sub-agent chạy song song gây ra lỗi vượt quá giới hạn API (Error 429 - Resource Exhausted). Đã quyết định can thiệp: dừng ngang các luồng dịch thuật tự động, chủ động thu hẹp phạm vi và chuyển AI sang task hoàn thiện giao diện phân hệ Gear trước để tránh nghẽn luồng.
* **Can thiệp kỹ thuật 2 (Định tuyến SPA):** Ban đầu các link do thiết kế tĩnh thường để `href="#"`. Yêu cầu AI can thiệp thay thế toàn bộ bằng component `<Link>` của React Router trong file `GearLayout.jsx`, đảm bảo ứng dụng giữ vững cấu trúc Single Page Application không bị reload trang khi chuyển hướng.
**Áp dụng cho**
* `src/frontend/src/pages/gear/GearRentalTermsPage.jsx`
* `src/frontend/src/pages/gear/GearMaintenancePage.jsx`
* `src/frontend/src/pages/gear/GearSupportPage.jsx`
* `src/frontend/src/pages/gear/GearPrivacyPage.jsx`
* `src/frontend/src/layouts/GearLayout.jsx`
* `src/frontend/src/App.jsx`
**Kiểm chứng**
* Thực thi lệnh `npm run build` trên terminal, kết quả đóng gói thành công (172 modules transformed) và không xuất hiện cảnh báo/lỗi về cú pháp hay thiếu component.
* Xác nhận tính năng điều hướng qua lại giữa Catalog, Rentals, Dashboard và các trang thông tin mới ở Footer hoạt động trơn tru.
