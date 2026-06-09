## Prompt #01
**Date:** 2026-05-20  
**AI Tool:** Google Gemini  
**Author:** Dương Khang Huy 
**Purpose:** Tạo prompt chuẩn để hướng dẫn công cụ Stitch thiết kế bộ giao diện UI tĩnh cho hệ thống Pro-Sport.

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
**Author:** Dương Khang Huy  
**Purpose:** Sinh mã nguồn UI tĩnh (HTML/CSS/JS) cho các trang lõi của hệ thống dựa trên prompt đã chuẩn bị.

### Prompt
*"Design a clean and modern dashboard for a sports complex management system. Include a sidebar for navigation with links to: Dashboard, Court Booking, Match Management, Equipment Rental, and Reports. The main content area should display real-time court status (Available / Booked / Maintenance) using a card grid layout. Use a dynamic color palette: primary teal (#00C2A8), dark navy (#0A0E1A), with white backgrounds for cards. Ensure the layout is fully responsive for both desktop and mobile views."*

### Expected Output
- Mã nguồn HTML/CSS/JS cho giao diện web trực quan.
- Layout trang Dashboard, Navbar/Sidebar và các component hiển thị trạng thái sân.

### Evaluation
Stitch sinh ra giao diện trực quan, cấu trúc layout Grid/Flexbox và mã màu CSS sát với yêu cầu. Tuy nhiên, output là file HTML tĩnh nguyên khối, chưa phù hợp với kiến trúc component-based. Tôi đã phải tự bóc tách thành các file module riêng (Header, Footer, Menu), thay thế mock data bằng dữ liệu động và tinh chỉnh CSS để layout responsive tốt hơn trên thiết bị di động.

---

## Prompt #03
**Date:** 2026-06-02  
**AI Tool:** Cursor  
**Author:** Dương Khang Huy  
**Purpose:** Khởi tạo cấu trúc file cấu hình môi trường, gitignore và tài liệu hướng dẫn chạy dự án (Repo Setup).

### Prompt
*(Sử dụng tính năng Cursor Composer)* "Tạo cho tôi các file .gitignore chuẩn cho dự án Frontend React (Vite) và Backend .NET 8. Đồng thời tạo các file .env.example và appsettings.Development.json.example với các biến môi trường cần thiết (JWT, Database). Cuối cùng, cập nhật README.md hướng dẫn chi tiết cách cài đặt và chạy dự án này."

### Expected Output
- File `.gitignore` bỏ qua chính xác các thư mục `node_modules`, `bin/`, `obj/`, v.v.
- Các file mẫu cấu hình môi trường không chứa mật khẩu thật.
- Tài liệu `README.md` rõ ràng các bước khởi chạy bằng CLI.

### Evaluation
Cursor sinh file cực kỳ nhanh và chuẩn xác nhờ khả năng nhận diện ngữ cảnh của toàn bộ project. Tuy nhiên, ở `appsettings.Development.json.example`, AI gợi ý dùng SQLite. Tôi đã phải trực tiếp can thiệp và sửa lại thành Connection String của SQL Server Local để phù hợp với định hướng công nghệ của dự án.
