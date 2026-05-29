# Nhật ký thay đổi (Changelog)

## [2026-05-20] - Giai đoạn: Lên ý tưởng & Lập dàn ý thiết kế UI
**Người thực hiện:** Phạm Nguyễn Tiến Đạt

### Thêm mới (Added)
* Chốt bố cục thiết kế tổng thể: trang chủ, màn hình danh sách sân, giao diện Dashboard với biểu đồ thống kê.
* Bổ sung yêu cầu thiết kế chi tiết hiển thị form thanh toán (Payment UI).

### Thay đổi (Changed)
* Tùy chỉnh lại bảng tone màu thể thao do AI gợi ý để đồng bộ chính xác với nhận diện thương hiệu của nhóm.

### Hỗ trợ từ AI (AI-assisted)
* Gemini đóng vai trò Designer, phân tích yêu cầu và viết ra bộ meta-prompt tiếng Anh chuẩn xác làm đầu vào cho công cụ thiết kế Stitch.

---

## [2026-05-21] - Giai đoạn: Dựng Mockup UI tĩnh & Cấu trúc Layout
**Người thực hiện:** Phạm Nguyễn Tiến Đạt

### Thêm mới (Added)
* Tạo layout trang Dashboard, thanh điều hướng (Navbar/Sidebar) và các component trạng thái sân.
* Thêm các thẻ JSTL, tích hợp dữ liệu động truyền từ Model/Controller thay thế cho dữ liệu giả (mock data).

### Thay đổi (Changed)
* Bóc tách các file HTML tĩnh nguyên khối thành các file module riêng biệt (Header, Footer, Menu) để tuân thủ cấu trúc dự án.

### Sửa lỗi (Fixed)
* Tinh chỉnh lại các class CSS để sửa lỗi vỡ layout, giúp giao diện responsive tốt hơn trên thiết bị di động.

### Hỗ trợ từ AI (AI-assisted)
* Stitch By Google hỗ trợ sinh mã nguồn HTML/CSS/JS tĩnh trực quan dựa trên bản thiết kế. Người thực hiện tự bóc tách file và ghép dữ liệu động.

---

## [2026-05-22] - Giai đoạn: Xây dựng React Components & Logic Form
**Người thực hiện:** Phạm Nguyễn Tiến Đạt

### Thêm mới (Added)
* Xây dựng file `BookingForm.jsx` và `Dashboard.jsx`.
* Tích hợp thư viện Axios để viết logic gọi dữ liệu sân thực tế từ Java Backend.
* Thêm logic Validation cho form đặt sân (chặn người dùng chọn ngày trong quá khứ).

### Thay đổi (Changed)
* Tách nhỏ đoạn code UI nguyên khối thành các React Component độc lập có thể tái sử dụng (`Button`, `InputField`, `CourtCard`).

### Hỗ trợ từ AI (AI-assisted)
* Antigravity AI sinh cấu trúc React Functional Component hoàn chỉnh, bao gồm các hook (`useState`) và các class Tailwind CSS. Người thực hiện tự viết logic luồng dữ liệu API và Validation.

---

## [2026-05-28] - Giai đoạn: Nâng cấp toàn diện Premium UI/UX
**Người thực hiện:** Phạm Nguyễn Tiến Đạt

### Thêm mới (Added)
* **Core:** Cài đặt thư viện `gsap` và `@gsap/react` để tạo hiệu ứng chuyển động.
* **Core:** Thêm các custom hooks (`useScrollReveal`, `useNavbarEntrance`) để quản lý hiệu ứng.
* **Phân hệ Apex:** Xây dựng 6 trang UI hoàn chỉnh (Booking, Matches, Shop, Profile, Settings, Support).
* **Phân hệ MatchPro:** Xây dựng 4 trang mạng xã hội (Trending Feed, Nearby Sports, Community Hub, Leaderboard).

### Thay đổi (Changed)
* **Tái cấu trúc (Refactoring):** Chuyển logic animation trực tiếp từ các component ra các custom hooks để tái sử dụng và giúp code sạch hơn.

### Sửa lỗi (Fixed)
* **Môi trường Vite:** Khắc phục lỗi crash server (lỗi `EBUSY`) bằng cách thêm thư mục `.vs` vào danh sách ignore trong `vite.config.js`.

### Hỗ trợ từ AI (AI-assisted)
* Antigravity AI đề xuất thư viện GSAP và tạo sẵn cấu trúc UI, CSS layout ban đầu cho toàn bộ 10 trang mới. Người thực hiện tự tái cấu trúc lại theo chuẩn Component của React.




## [2026-05-29] - Giai đoạn: Xây dựng hệ thống giao diện đa phân hệ
**Người thực hiện:** Phạm Nguyễn Tiến Đạt

### Thêm mới (Added)

**Public Pages (7 trang):**
`HomePage`, `LoginPage`, `RegisterPage`, `RoleSelectionPage`, `ResetPasswordPage`, `AboutPage`, `ContactPage`

**Admin Portal (8 trang):**
`AdminDashboardPage`, `AdminUsersPage`, `AdminCourtsPage`, `AdminBookingsPage`, `AdminInventoryPage`, `AdminPricingPage`, `AdminKycPage`, `AdminComplaintsPage`

**EliteSport OS (6 trang):**
`EliteDashboardPage`, `EliteSchedulePage`, `ElitePosWalkInPage`, `EliteEquipmentPage`, `EliteVouchersPage`, `EliteDisputesPage`

**Mobile App (8 trang):**
`MobileHomePage`, `MobileDashboardPage`, `MobileMatchesPage`, `MobileBookingPage`, `MobileChatPage`, `MobileWalletPage`, `MobileProfilePage`, `MobileScannerPage`

**Shop (5 trang):**
`ShopPage`, `ShopProductPage`, `ShopCartPage`, `ShopCheckoutPage`, `ShopWishlistPage`

**Status Pages (3 trang):**
`NotFoundPage` (404), `RestrictedPage` (403), `MaintenancePage`

**Layouts & Infrastructure:**
- 7 Layout Component: `EliteLayout`, `MobileLayout`, `AdminLayout`, `GearLayout`, `ShopLayout`, `MatchProLayout`, `ProSportDashLayout`.
- Component `AIChatbot.jsx` tích hợp vào Mobile Layout.
- Thiết lập toàn bộ hệ thống routing trong `App.jsx` với 40+ routes.

### Sửa lỗi (Fixed)

- **[Build] Entry Point sai đường dẫn:** `index.html` trỏ tới `/src/main.jsx` nhưng file thực tế nằm ở `/main.jsx`, khiến Vite không thể build. Phát hiện và sửa thủ công.
- **[Routing] Routes bị comment:** Toàn bộ Public Routes trong `App.jsx` bị comment out, khiến `/`, `/login`, `/register` trả về 404. Uncomment và bổ sung các route còn thiếu (`/about`, `/courts`, `/matches`, `/gear`).
- **[CSS] Selector `:has()` không tương thích Firefox:** Xóa bỏ, thay bằng cách tiếp cận dùng class thông thường. Gộp các CSS rule bị khai báo trùng lặp.
- **[Navigation] Dead links trong AdminLayout:** 10 nav link trong sidebar trỏ tới route không được đăng ký, gây lỗi 404 khi click. Xóa toàn bộ.
- **[Layout Mobile] `position: absolute` gây chồng nội dung:** `MobileChatPage` và `MobileBookingPage` dùng `position: absolute` cho thanh input/nút CTA. Chuyển sang `position: sticky`.

### Hỗ trợ từ AI (AI-assisted)

Antigravity AI sinh toàn bộ cấu trúc JSX, CSS và hệ thống routing ban đầu cho 40+ trang UI dựa trên ảnh thiết kế. Người thực hiện tự phát hiện và sửa toàn bộ 5 nhóm lỗi kỹ thuật — bao gồm lỗi build, lỗi routing, lỗi CSS trình duyệt và lỗi layout mà AI không tự phát hiện được.
