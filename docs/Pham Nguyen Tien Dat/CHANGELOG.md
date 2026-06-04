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






## [2026-06-01] - Giai đoạn: Hoàn thiện phân hệ Gear & Chuẩn hóa đa ngôn ngữ (Tiếng Anh)
**Người thực hiện:** Phạm Nguyễn Tiến Đạt
### Thêm mới (Added)
* **Phân hệ Gear:** Xây dựng mới mã nguồn hoàn chỉnh cho 4 trang phụ trợ bao gồm Equipment Rental Terms (Điều khoản thuê), Maintenance Tracking (Theo dõi bảo trì), Support Hub (Trung tâm hỗ trợ), và Privacy Policy (Chính sách bảo mật).
* **Định tuyến:** Tích hợp bổ sung các route mới vào `App.jsx` tương ứng với 4 trang phụ trợ vừa tạo.
### Thay đổi (Changed)
* **Dịch thuật (Localization):** Quét và chuyển đổi đồng bộ các từ khóa, nhãn (label) tiếng Việt còn sót lại trên giao diện sang tiếng Anh nhằm đảm bảo tính nhất quán (Premium UI) cho người dùng.
* **Định tuyến SPA:** Cập nhật các liên kết tĩnh (`href="#"`) ở khu vực Footer của `GearLayout.jsx` thành component `<Link>` của React Router, giúp giữ vững kiến trúc Single Page Application (không reload trang khi chuyển hướng).
### Sửa lỗi (Fixed)
* **Sự cố quá tải API (Rate Limit):** Quá trình AI phân luồng (spawn) đa luồng dịch thuật tự động song song gây ra lỗi vượt giới hạn API (Error 429). Đã can thiệp đóng băng luồng dịch toàn dự án, ưu tiên dồn tài nguyên xử lý hoàn thiện các trang chức năng cốt lõi của Gear trước để tránh treo hệ thống.
### Hỗ trợ từ AI (AI-assisted)
* Antigravity AI hỗ trợ rà soát ngôn ngữ, tự động sinh nội dung, CSS layout và cấu trúc React Component cho 4 trang thuộc phân hệ Gear. Người thực hiện can thiệp trực tiếp khi xảy ra lỗi giới hạn API và tự cấu hình lại liên kết React Router để đảm bảo luồng chuyển hướng không bị gián đoạn.



## [2026-06-04] - Giai đoạn: Thiết lập CI/CD & Hoàn thiện nền tảng pháp lý (Platform/Legal)
**Người thực hiện:** Phạm Nguyễn Tiến Đạt
### Thêm mới (Added)
* **Hạ tầng CI/CD:** Thiết lập thành công Harness CI pipeline (`.harness/prosport_ci_pipeline.yaml`) với 3 luồng tự động: Build Frontend (Vite/React), Build Backend (.NET) và tự động kiểm tra Audit Docs.
* **Trang Chính sách (Legal):** Sinh mới 3 trang pháp lý chuẩn SEO và UI cao cấp bao gồm `PrivacyPolicyPage.jsx`, `TermsOfServicePage.jsx` và `SitemapPage.jsx`.
* **Trang Nền tảng (Platform):** Khởi tạo trang chuyên đề `BrandMissionPage.jsx` độc lập với giao diện Cinematic, typography cỡ lớn và GSAP animations mượt mà.
* **Định tuyến:** Bổ sung 4 route mới vào `App.jsx` tương ứng với các trang vừa được tạo.
### Thay đổi (Changed)
* **Nâng cấp UI (Overhaul):** Đập đi xây lại toàn bộ trang About (`AboutPage.jsx`) với nội dung thực tế phong phú (Mission, Stats, Journey, Timeline, Leadership Team) tích hợp hiệu ứng cuộn GSAP ScrollTrigger.
* **Cập nhật Footer:** Điều chỉnh toàn bộ các liên kết tĩnh (`href="#"`) trong `Footer.jsx` sang định tuyến thực tế (chuyển "Country" thành "Facilities" trỏ tới `/courts`, gắn link thực cho các trang Legal).
### Sửa lỗi (Fixed)
* **Môi trường Dev:** Xử lý lỗi crash Vite dev server do thiếu thư viện (sau khi merge code mới từ nhánh main) bằng cách chủ động cài đặt bổ sung các dependencies bị thiếu (`@react-oauth/google`, `axios`).
* **Định tuyến SPA (Base URL):** Khắc phục lỗi 404 khi click vào nút CTA "Join Our Mission" ở trang Brand Mission. Lỗi xảy ra do dùng thẻ HTML tĩnh (`<a href>`) làm ứng dụng thoát khỏi base path của Vite. Đã thay thế triệt để bằng component `<Link>` của React Router.
### Hỗ trợ từ AI (AI-assisted)
* Antigravity AI (Gemini) hỗ trợ viết file cấu hình cho Harness CI và sinh toàn bộ mã nguồn React, class Tailwind, logic GSAP animation cho các trang About, Brand Mission, Legal. Người thực hiện trực tiếp chẩn đoán, can thiệp xử lý lỗi sập dev server và fix thành công lỗi điều hướng mất base URL đặc thù của kiến trúc SPA.
