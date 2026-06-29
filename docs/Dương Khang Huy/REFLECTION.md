# Reflection

---
## Tuần 1: Khởi tạo Kiến trúc & Định hình Thiết kế (Generative Prototyping)
### Tổng quan Quá trình
Trong giai đoạn đầu, thách thức lớn nhất là biến các đặc tả yêu cầu (SRS) khô khan thành thiết kế trực quan. Bằng việc kết hợp ChatGPT và công cụ Stitch by Google, chúng tôi đã đẩy nhanh quá trình tạo mẫu (Prototyping) tĩnh lên gấp nhiều lần. Kỹ thuật Meta-prompting đã phát huy tối đa hiệu quả trong việc tạo ra mã nguồn HTML/CSS nền tảng.
### Hạn chế của AI & Bài học rút ra
- **Kiến trúc Nguyên khối (Monolithic Code):** Giao diện sinh ra nằm trong một file HTML duy nhất, vi phạm nghiêm trọng nguyên tắc "Tách biệt mối quan tâm" (Separation of Concerns).
- **Bài học rút ra:** AI là một công cụ mạnh mẽ trong việc vượt qua "Hội chứng trang giấy trắng" (Blank Page Syndrome), nhưng Lập trình viên phải đóng vai trò Kiến trúc sư (Architect) để bóc tách mã nguồn nguyên khối thành các Component độc lập (Header, Sidebar) sẵn sàng cho React.
---
## Tuần 2: Nâng cấp Trải nghiệm Người dùng (Premium UI/UX) & Tích hợp Logic
### Hạn chế Kỹ thuật Tinh vi của AI
Mặc dù tốc độ sinh code rất nhanh, AI lại để lại một "khoản nợ kỹ thuật" (Technical Debt) khổng lồ:
1. **Quản lý Trạng thái kém:** Nhúng trực tiếp logic hoạt ảnh vào UI Component.
2. **Lỗi Định tuyến (Routing Errors):** Tự ý comment các Route quan trọng trong `App.jsx`, dẫn đến lỗi 404 diện rộng.
3. **Lỗi Tương thích (Cross-browser):** Sử dụng các CSS Selector quá mới (`:has()`) chưa được hỗ trợ trên Firefox.
4. **Sai lệch Entry Point:** File `index.html` trỏ sai đường dẫn bundle, làm sập tiến trình Build.
### Bài học Lập trình
- **"AI giỏi sinh khối lượng, Con người đảm bảo chất lượng"**. Việc lạm dụng AI tạo mã nguồn hàng loạt mà thiếu quy trình Review Code sẽ dẫn đến sụp đổ hệ thống khi đưa lên Production. Kỹ năng gỡ lỗi (Debugging) và kiểm soát luồng dữ liệu của kỹ sư phần mềm là vô giá.
---
## Tuần 3: Quản trị Cấu hình (DevOps & Environment Setup)
### Khó khăn & Giải pháp
- **Rủi ro ảo giác (Hallucination):** AI có xu hướng mặc định chọn SQLite làm cơ sở dữ liệu thay vì SQL Server.
- **Giải pháp:** Áp dụng nguyên tắc "Bất tín" (Zero Trust) đối với cấu hình sinh tự động. Lập trình viên trực tiếp sửa đổi Connection String để bám sát mô hình kiến trúc Hệ thống Phân tán (Distributed System Architecture).
---
## Tuần 4: Bảo trì Hệ thống (System Tooling Maintenance)
### Phân tích Tình huống
Khi bộ công cụ Linter (ESLint) nâng cấp lên v9, định dạng cấu hình cũ (JSON) bị vô hiệu hóa, khiến tiến trình CI/CD bị đình trệ. Antigravity AI được huy động như một Kỹ sư Dev-Tooling tự động biên dịch lại toàn bộ các Rule sang cấu trúc Flat Config (ES Modules).
### Bài học rút ra
- Trong môi trường JavaScript liên tục biến động, khả năng của AI tổng hợp và tóm tắt các tài liệu kỹ thuật mới (New Documentation) giúp nhóm thoát khỏi "Configuration Hell" để tập trung vào mã nguồn nghiệp vụ.
---
## Tuần 5: Nâng cao Trải nghiệm (Refining UX) & Quản lý Xung đột Mã nguồn
### Khó khăn & Giải pháp Chuyên sâu
- **Xung đột Vòng đời (Lifecycle Conflicts):** Việc AI lạm dụng Animation JS (GSAP) trong các Tab gây ra kẹt UI. Giải pháp là tái cấu trúc chuyển sang CSS Keyframes thuần túy nhằm giảm tải Main Thread.
- **Khủng hoảng Hợp nhất Git (Merge Crisis):** Xung đột dữ liệu nghiêm trọng tại Snapshot EF Core. Giải pháp: Khai thác năng lực đọc Log hệ thống của AI để nhanh chóng tìm ra Package `dompurify` bị thiếu và dùng lệnh `git checkout --ours` bảo vệ mã nguồn giao diện.
### Bài học Cốt lõi
- **Kỹ năng Sinh tồn (Survival Skills):** Khả năng đọc và phân tích Stack Trace trên Terminal, cũng như sự bình tĩnh khi đối mặt với Merge Conflicts, là những kỹ năng định hình một Kỹ sư Phần mềm thực thụ mà AI chỉ có thể làm trợ lý công cụ.
---
## Tuần 6: Quản trị Luồng Truy cập & Tối ưu hóa Mã nguồn 
### Tổng quan Quá trình
Phân tách hoàn toàn layout Khách hàng và Admin, sử dụng JWT Payload để định tuyến động. 60+ cảnh báo Linter đã được giải quyết để mang lại một mã nguồn Sạch (Clean Code).
### Bài học rút ra
1. **Nghệ thuật "Thỏa hiệp" với Công cụ:** Tắt bỏ các nguyên tắc Linter quá khắt khe để bảo toàn logic hiện tại chứng tỏ mức độ trưởng thành của Lập trình viên trong việc quản trị rủi ro phần mềm.
2. **Sức mạnh của Role-Based Access Control (RBAC):** Bảo mật Frontend bằng định tuyến động mang lại UX tuyệt vời và giấu đi các chức năng nhạy cảm.
---
## Tuần 7: Tích hợp Toàn diện & Tối ưu Hiệu năng (Performance Optimization)
### Tổng quan Quá trình
Hệ thống bắt đầu bộc lộ sự chậm chạp khi khối lượng dữ liệu (Data Volume) tăng lên ở màn hình Lịch sử Đặt sân và Quản lý Doanh thu. Nguyên nhân cốt lõi đến từ vấn đề N+1 Queries cổ điển trong Entity Framework.
### Hạn chế của AI
- AI rất giỏi trong việc viết các truy vấn CRUD (Create, Read, Update, Delete) cơ bản cho một đối tượng. Tuy nhiên, AI lại thiếu tầm nhìn về Kiến trúc Hiệu năng (Performance Architecture). Khi được yêu cầu truy xuất dữ liệu có liên kết (Sân - Hóa đơn - Người dùng), mã do AI sinh ra ban đầu liên tục gọi truy vấn nhỏ xuống Database, vắt kiệt RAM của máy chủ.
### Giải pháp và Bài học Lập trình
- Tự phân tích SQL Profiler, can thiệp vào các câu lệnh LINQ do AI sinh ra, bổ sung `.Include()` (Eager Loading) và ép `.AsNoTracking()` để loại bỏ việc Cache dữ liệu không cần thiết.
- **Bài học rút ra:** AI có thể hoàn thành xuất sắc một Tính năng (Feature), nhưng không có khái niệm về "Khả năng mở rộng" (Scalability). Việc tối ưu hóa hệ thống tải cao luôn đòi hỏi nền tảng kiến thức sâu rộng về Cấu trúc dữ liệu và Cơ sở dữ liệu của một Kỹ sư con người.
---
## Tuần 8: Xử lý Tương tranh & Kiểm thử Nghiệm thu (Concurrency & UAT)
**Chuyện gì đã xảy ra?**
TPhats hiện bug nếu hai người cùng ấn thanh toán một sân ở cùng một thời điểm, hệ thống bị lặp (Double Booking) và cho phép cả hai người cùng đặt thành công một giờ chơi. 
**Cách tôi dùng AI để giải quyết:**
- AI đề xuất 2 cách: Optimistic Lock và Pessimistic Lock. 
- Tôi chọn cách an toàn hơn: Dùng Transaction để khóa bản ghi đó lại (Row Lock) ngay khi có người đang thanh toán, đồng thời set một Background Task để giữ chỗ trong 10 phút. Nếu 10 phút sau người đó không thanh toán xong thì mới nhả sân ra cho người khác đặt.
**Cảm nghĩ cá nhân sau 8 tuần làm đồ án:**
- AI có thể viết hộ code giao diện và API CRUD. Nhưng khi fix mấy lỗi liên quan đến transaction hay bảo mật, AI chỉ có thể đóng vai trò tư vấn giải pháp, còn người trực tiếp chèn code, debug và chịu trách nhiệm cho nó chạy được. 
- **Bài học rút ra:** phải biết đặt đúng câu hỏi, chọn lọc giải pháp AI đưa ra, và biết cách ráp nối mọi thứ lại thành một hệ thống không bị sập.
