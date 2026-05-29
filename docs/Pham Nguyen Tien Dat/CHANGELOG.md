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
