# Kho lưu trữ Prompt & Chỉ thị AI

---

## Prompt #01

- **Ngày:** 2026-05-20
- **Công cụ AI:** Gemini
- **Người thực hiện:** Phạm Nguyễn Tiến Đạt
- **Mục đích:** Tạo một meta-prompt chuyên nghiệp để hướng dẫn một AI khác (Stitch) sinh giao diện.

### Prompt
> "As a DESIGNER, please give me a prompt to instruct Stitch to design the static UI for my Pro-Sport Complex Management System project. The interface should be user-friendly, feature court booking, schedule viewing, and a manager dashboard."

### Kết quả mong đợi
- Một prompt chi tiết bằng tiếng Anh tối ưu cho Stitch.
- Gợi ý về cấu trúc bố cục (Sidebar, Main Content, Cards) và bảng màu thể thao.

### Đánh giá
Prompt đã xác định rõ vai trò (DESIGNER) và các yêu cầu cốt lõi. Gemini cung cấp hướng dẫn rất chính xác. Tuy nhiên, vẫn cần tinh chỉnh thủ công để thêm các chi tiết cụ thể bị thiếu như "grid calendar view" (lịch dạng lưới) và "payment form" (form thanh toán) nhằm đảm bảo khớp hoàn toàn với luồng người dùng (User Flow) của dự án.

---

## Prompt #02

- **Ngày:** 2026-05-21
- **Công cụ AI:** Stitch By Google
- **Người thực hiện:** Phạm Nguyễn Tiến Đạt
- **Mục đích:** Dựng nhanh bản nháp UI (Wireframe/Mockup) để chốt bố cục thiết kế.

### Prompt
> "Design a clean and modern dashboard for a sports complex management system. Include a sidebar for navigation (Dashboard, Court Booking, Users, Settings), a main area showing a grid calendar view of booked courts, and quick stat cards for daily revenue and active bookings. Use a sporty color palette with energetic accents."

### Kết quả mong đợi
- Bản nháp giao diện HTML/CSS trực quan hiển thị trên trình duyệt.
- Bố cục trang dạng lưới responsive với Sidebar và các thẻ Card thống kê.

### Đánh giá
Prompt cung cấp đủ ngữ cảnh và yêu cầu rõ ràng. Vì đã được chuẩn bị kỹ từ Gemini (meta-prompting), Stitch nhận diện đầu vào hoàn hảo và render ra bố cục rất sát với ý tưởng, đóng vai trò là Base UI (Giao diện gốc) vững chắc cho toàn bộ dự án.

---

## Prompt #03

- **Ngày:** 2026-05-22
- **Công cụ AI:** Antigravity AI
- **Người thực hiện:** Phạm Nguyễn Tiến Đạt
- **Mục đích:** Sinh mã nguồn cho các React Component giao diện Frontend.

### Prompt
> "Based on a sports complex UI, build responsive React functional components for a Court Booking Form and a Dashboard. Use Tailwind CSS for styling. Include states for selecting date, time, and court type."

### Kết quả mong đợi
- Các functional component hoàn chỉnh bằng React (`.jsx`).
- Thiết lập sẵn các hook cơ bản (`useState`) và các thẻ HTML responsive được style bằng các class Tailwind CSS.

### Đánh giá
Prompt đã hướng dẫn thành công AI sinh ra bộ khung React và style Tailwind chạy được, giúp đẩy nhanh đáng kể giai đoạn phát triển ban đầu. Tuy nhiên, các logic thực tế như tích hợp API (Axios) và kiểm tra tính hợp lệ của form (chặn chọn ngày trong quá khứ) còn thiếu tính thực tiễn và nhóm phải tự code thủ công.

---

## Prompt #04

- **Ngày:** 2026-05-28
- **Công cụ AI:** Antigravity
- **Người thực hiện:** Phạm Nguyễn Tiến Đạt
- **Mục đích:** Nâng cấp toàn diện Premium UI/UX (React/Vite) với tiêu chuẩn thiết kế cao cấp.

### Prompt
> "Please act as an expert Frontend Developer and help me upgrade my existing React (Vite) application located at [Insert Your Directory Path Here]. I want to build out two major modules: the 'Courts Portal' and 'MatchPro', with a strong emphasis on premium UI/UX design and smooth animations."

### Kết quả mong đợi
- Cấu trúc thư mục tối ưu cho dự án React.
- Đề xuất các thư viện quản lý state và hiệu ứng (animation).
- Kế hoạch thiết kế UI chi tiết cho 2 phân hệ Courts và MatchPro.

### Đánh giá
Prompt xác định rõ vai trò chuyên gia, công nghệ sử dụng (React/Vite) và mục tiêu thiết kế chính xác (Premium UI/UX). Kết quả là AI đã cung cấp các giải pháp chuẩn xác, bao gồm việc sử dụng GSAP và cấu trúc UI theo chuẩn thương mại.
