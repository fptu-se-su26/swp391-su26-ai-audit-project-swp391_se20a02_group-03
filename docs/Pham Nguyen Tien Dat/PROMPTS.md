## Prompt #01
**Date:** 2026-05-20  
**AI Tool:** Google Gemini  
**Author:** Phạm Nguyễn Tiến Đạt  
**Purpose:** Tạo meta-prompt chuẩn để hướng dẫn công cụ Stitch thiết kế bộ giao diện UI tĩnh cho hệ thống Pro-Sport.

### Prompt
*"Như là một DESIGNER, bạn hãy cho tôi prompt để hướng dẫn Stitch làm phần thiết kế UI tĩnh cho dự án Pro-Sport Complex Management System của tôi. Hệ thống bao gồm các phân hệ: trang chủ, màn hình danh sách sân, giao diện Dashboard với biểu đồ thống kê và form thanh toán chi tiết (Payment UI). Bảng màu cần mang phong cách thể thao, năng động và khớp với nhận diện thương hiệu của nhóm."*

### Expected Output
- Bộ meta-prompt tiếng Anh chi tiết, tối ưu làm đầu vào cho công cụ Stitch By Google.
- Đề xuất bảng màu, bố cục trang chủ, màn hình danh sách sân và layout Dashboard.

### Evaluation
Prompt rõ ràng về mục tiêu và phạm vi hệ thống. Gemini đóng vai trò Designer và sinh ra bộ prompt tiếng Anh chuẩn xác, đủ để đưa vào Stitch. Tuy nhiên, tôi đã phải can thiệp điều chỉnh (Human Decision) lại tone màu trong prompt để khớp chính xác hơn với nhận diện thương hiệu đã chốt của nhóm, đồng thời bổ sung thêm yêu cầu hiển thị form thanh toán chi tiết mà AI bỏ sót trong lần đầu.

---

## Prompt #02
**Date:** 2026-05-21  
**AI Tool:** Stitch By Google  
**Author:** Phạm Nguyễn Tiến Đạt  
**Purpose:** Sinh mã nguồn UI tĩnh (HTML/CSS/JS) cho các trang lõi của hệ thống dựa trên meta-prompt đã chuẩn bị.

### Prompt
*"Design a clean and modern dashboard for a sports complex management system. Include a sidebar for navigation with links to: Dashboard, Court Booking, Match Management, Equipment Rental, and Reports. The main content area should display real-time court status (Available / Booked / Maintenance) using a card grid layout. Use a dynamic color palette: primary teal (#00C2A8), dark navy (#0A0E1A), with white backgrounds for cards. Ensure the layout is fully responsive for both desktop and mobile views."*

### Expected Output
- Mã nguồn HTML/CSS/JS cho giao diện web trực quan.
- Layout trang Dashboard, Navbar/Sidebar và các component hiển thị trạng thái sân.

### Evaluation
Stitch sinh ra giao diện trực quan, cấu trúc layout Grid/Flexbox và mã màu CSS sát với yêu cầu. Tuy nhiên, output là file HTML tĩnh nguyên khối, chưa phù hợp với kiến trúc component-based. Tôi đã phải tự bóc tách thành các file module riêng (Header, Footer, Menu), thay thế mock data bằng dữ liệu động và tinh chỉnh CSS để layout responsive tốt hơn trên thiết bị di động.

---

## Prompt #03
**Date:** 2026-05-22  
**AI Tool:** Antigravity  
**Author:** Phạm Nguyễn Tiến Đạt  
**Purpose:** Xây dựng React Component cho form đặt sân và tích hợp dữ liệu thực từ Backend.

### Prompt
*"Build a responsive React component for a sports court booking form. It should include fields for selecting the date, time slots, court type, and number of players. Use useState hooks for state management and style with Tailwind CSS classes consistent with the existing design system."*

### Expected Output
- React Functional Component hoàn chỉnh cho `BookingForm.jsx` và `Dashboard.jsx`.
- Sử dụng hook `useState` để quản lý trạng thái form.
- Các thẻ JSX được style bằng class Tailwind CSS.

### Evaluation
AI sinh ra cấu trúc component đúng yêu cầu và hoạt động tốt với mock data. Tuy nhiên, toàn bộ UI và logic nằm trong một file nguyên khối, chưa phù hợp với nguyên tắc tái sử dụng component. Tôi đã tự tách nhỏ thành các component độc lập (`Button`, `InputField`, `CourtCard`), đồng thời tự viết tay logic gọi API bằng Axios để lấy dữ liệu sân thực từ Java Backend thay vì dùng dữ liệu tĩnh. Ngoài ra, tự bổ sung thêm logic validation để chặn người dùng chọn ngày trong quá khứ — tính năng này AI hoàn toàn bỏ sót.

---

## Prompt #04
**Date:** 2026-05-22  
**AI Tool:** Antigravity  
**Author:** Phạm Nguyễn Tiến Đạt  
**Purpose:** Sinh toàn bộ hệ thống giao diện React (40+ trang) cho 6 phân hệ dựa trên ảnh thiết kế.

### Prompt
*"sau đây tôi sẽ gửi các ảnh về thiết kế hệ thống của tôi, bạn hãy code react để thiết kế phần front end để giao diện giống trong ảnh giúp tôi nhé. Như một DEV, hãy code front end bằng react để tạo giao diện giống như ảnh cho dự án của tôi."*

### Expected Output
- Toàn bộ React Functional Components cho 6 phân hệ: Public Pages, Admin Portal, EliteSport OS, Mobile App, Shop, Status Pages.
- Các Layout Component bao bọc từng phân hệ.
- Hệ thống routing đầy đủ trong `App.jsx`.

### Evaluation
AI sinh ra 40+ trang React và 7 Layout Component phủ khắp hệ thống, giúp tiết kiệm đáng kể thời gian xây dựng nền tảng. Tuy nhiên, tôi phải tự phát hiện và xử lý 5 nhóm lỗi mà AI không tự nhận ra: entry point `index.html` sai đường dẫn khiến Vite không build được, các route Public bị comment out gây lỗi 404, selector CSS `:has()` không tương thích Firefox, 10 nav link trong AdminLayout trỏ tới route không tồn tại, và `position: absolute` trong các trang Mobile gây chồng lấp nội dung.

---

## Prompt #05
**Date:** 2026-05-28  
**AI Tool:** Antigravity  
**Author:** Phạm Nguyễn Tiến Đạt  
**Purpose:** Tích hợp hiệu ứng GSAP và hoàn thiện 10 trang UI cho phân hệ Apex và MatchPro.

### Prompt
*"Please act as an expert Frontend Developer and help me upgrade my existing React (Vite) application located at... Tích hợp thư viện GSAP để tạo hiệu ứng animation. Xây dựng 6 trang cho phân hệ Apex (Booking, Matches, Shop, Profile, Settings, Support) và 4 trang cho phân hệ MatchPro (Trending Feed, Nearby Sports, Community Hub, Leaderboard)."*

### Expected Output
- Cấu trúc UI và CSS layout cho 10 trang mới thuộc phân hệ Apex và MatchPro.
- Tích hợp thư viện `gsap` và `@gsap/react`.
- Animation hiệu ứng cuộn và navbar entrance.

### Evaluation
AI đề xuất đúng thư viện và sinh ra cấu trúc UI chuẩn cho 10 trang mới. Tuy nhiên, logic animation được viết trực tiếp vào từng component gây rối và khó tái sử dụng. Tôi đã tự quyết định
