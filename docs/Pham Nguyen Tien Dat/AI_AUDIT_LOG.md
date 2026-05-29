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
- Các file `.jsp` (Header, Footer, Menu).
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
