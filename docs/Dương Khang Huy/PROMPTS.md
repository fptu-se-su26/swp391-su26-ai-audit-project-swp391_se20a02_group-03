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

---

## Prompt #04
**Date:** 2026-06-10
**AI Tool:** Antigravity AI
**Author:** Dương Khang Huy
**Purpose:** Viết cấu trúc Flat Config cho dự án sử dụng ESLint v9 và React Vite.

### Prompt
*"Ý VỀ LỖI: Lệnh `npm run lint` bị sập hoàn toàn do dự án đã lên ESLint v9 nhưng thiếu file cấu hình `eslint.config.js`. NHIỆM VỤ: Tạo mới file `src/frontend/eslint.config.js` theo định dạng Flat Config. YÊU CẦU: Import các plugin eslint-plugin-react, react-hooks, react-refresh... Cấu hình languageOptions để nhận diện browser và globals... Tắt rule react/prop-types."*

### Expected Output
- File cấu hình hoạt động được ngay lập tức, khắc phục được lỗi crash linter hiện hành.

### Evaluation
AI tuân thủ nghiêm ngặt các tham số cấu hình được đưa ra. Điều đáng giá là AI tự động nhận ra file `package.json` chưa cài đặt `globals` nên đã chủ động chạy lệnh NPM bổ sung thư viện trước khi tạo file, giúp tiết kiệm thời gian sửa lỗi (debug) lặt vặt.

---

## Prompt #05
**Date:** 2026-06-18  
**AI Tool:** Antigravity AI  
**Author:** Dương Khang Huy  
**Purpose:** Tích hợp bản đồ Leaflet vào trang MatchPro Nearby và định tuyến giao diện.

### Prompt
*"Tích hợp thư viện bản đồ mã nguồn mở Leaflet vào trang MatchPro Nearby. Yêu cầu: Nâng cấp toàn diện bố cục giao diện (UI/UX) theo hướng hiện đại, đồng thời thiết lập tọa độ trung tâm mặc định về khu vực Đà Nẵng."*

### Expected Output
- Giao diện `MatchProNearbyPage.jsx` được cấu trúc lại hoàn toàn.
- Bản đồ tương tác hiển thị ổn định, lấy tọa độ mặc định là Đà Nẵng.

### Evaluation
AI đã phân tích chính xác yêu cầu, không chỉ nhúng thành công bản đồ `react-leaflet` mà còn tự động sử dụng cấu trúc Grid/Flexbox của TailwindCSS để thiết kế lại layout trang cho thoáng đãng, chuẩn phong cách hiện đại.

---

## Prompt #06
**Date:** 2026-06-18  
**AI Tool:** Antigravity AI  
**Author:** Dương Khang Huy  
**Purpose:** Tạo hiệu ứng vi-tương tác (Micro-interaction) cho điểm định vị người dùng trên bản đồ.

### Prompt
*"Tùy chỉnh định vị người dùng: Gắn tọa độ gốc về Đại học FPT Đà Nẵng. Hãy thay thế icon vị trí mặc định bằng hiệu ứng chấm tròn xanh nhấp nháy (Blue Dot Ping Animation) để mô phỏng trải nghiệm thời gian thực giống Google Maps."*

### Expected Output
- Điểm đánh dấu (Marker) trên bản đồ chuyển về tọa độ của ĐH FPT Đà Nẵng.
- Điểm đánh dấu có hiệu ứng sóng tỏa ra (ping) màu xanh dương.

### Evaluation
AI đã xử lý yêu cầu này rất tinh tế bằng cách khởi tạo một `L.divIcon` tùy chỉnh, thay vì dùng ảnh tĩnh, kết hợp nhúng thẳng class `animate-ping` của TailwindCSS vào trong marker. Kết quả mang lại một trải nghiệm thị giác thời gian thực rất mượt mà.

---

## Prompt #07
**Date:** 2026-06-18  
**AI Tool:** Antigravity AI  
**Author:** Dương Khang Huy  
**Purpose:** Sửa lỗi hiển thị UI bị kẹt (bug opacity) khi người dùng thao tác chuyển qua lại giữa các tab chức năng.

### Prompt
*"Kiểm tra URL: .../matches/community. Report lỗi hiển thị: Khi chuyển qua lại giữa các tab (Sự kiện, Hội nhóm, Thử thách), nội dung bị kẹt ở trạng thái mờ ảo (Opacity rendering error). Hãy chẩn đoán nguyên nhân vòng đời React và khắc phục triệt để."*

### Expected Output
- Loại bỏ hoàn toàn hiện tượng kẹt nội dung khi mount/unmount Component.
- Hoạt ảnh chuyển đổi mượt mà và ổn định.

### Evaluation
AI thể hiện khả năng gỡ lỗi hệ thống rất tốt. Đã tự động chẩn đoán được việc lạm dụng GSAP trong vòng đời React (Lifecycle) là nguyên nhân gây kẹt CSS. Quyết định thay thế bằng một chuỗi CSS Keyframes thuần túy (`@keyframes fadeUpAnim`) của AI là một giải pháp an toàn và hoàn hảo.

---

## Prompt #08
**Date:** 2026-06-18  
**AI Tool:** Antigravity AI  
**Author:** Dương Khang Huy  
**Purpose:** Đại tu giao diện trang Feed bằng ngôn ngữ thiết kế mới (Light Luxury).

### Prompt
*"Kiểm tra URL: .../matches. Yêu cầu: Tái cấu trúc lại toàn bộ bố cục trang Feed. Áp dụng ngôn ngữ thiết kế mới (Light Luxury) để mang lại trải nghiệm thị giác cao cấp và cấu trúc mạch lạc hơn."*

### Expected Output
- Mã nguồn `MatchProFeedPage.jsx` được tối ưu hóa hiển thị.
- Các bài đăng (Posts) và thanh bên (Sidebar) được bọc trong các Card có bo góc tròn, viền mỏng và shadow nhẹ.

### Evaluation
AI đã hoàn thiện giao diện một cách cực kỳ bắt mắt. Phong cách Light Luxury được thể hiện rõ ràng qua việc tối ưu khoảng trắng (white-space), màu chủ đạo Teal hiện đại và các thẻ card bo góc `rounded-3xl` mang lại cảm giác rất "đắt tiền" (Premium). Không cần sự can thiệp thủ công nào thêm từ con người.
