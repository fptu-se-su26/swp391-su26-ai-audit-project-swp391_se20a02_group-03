# Nhật ký thay đổi (Changelog)

## [2026-05-18] - Giai đoạn: Phân tích yêu cầu & Phân rã Module
**Người thực hiện:** Dương Khang Huy

### Thêm mới (Added)
* Khởi tạo sơ đồ trang (Site Map) tổng thể và bảng phân quyền chi tiết cho các vai trò: Customer, Staff, Admin.
* Xác định danh sách các module chức năng cốt lõi cho hệ thống quản lý Badminton & Pickleball.

### Thay đổi (Changed)
* Cắt giảm số lượng màn hình từ gợi ý ban đầu để thu hẹp phạm vi vừa vặn với tiến độ đồ án.
* Tự chỉnh sửa thủ công luồng đặt sân (Booking Flow) và thuê đồ (Rental Flow) để sát với nghiệp vụ thực tế tại Việt Nam.

### Hỗ trợ từ AI (AI-assisted)
* ChatGPT đóng vai trò UX/UI Designer, phân tích yêu cầu đầu vào để liệt kê danh sách màn hình và đề xuất luồng nghiệp vụ sơ bộ.

---

## [2026-05-24] - Giai đoạn: Lên ý tưởng & Thiết kế giao diện UI tĩnh
**Người thực hiện:** Dương Khang Huy

### Thêm mới (Added)
* Chốt bố cục thiết kế UI tĩnh cho toàn bộ 14 module chức năng trên bản Desktop.
* Bổ sung yêu cầu thiết kế chi tiết cho các form trạng thái lỗi hệ thống và thông báo thời gian thực.

### Thay đổi (Changed)
* Tùy chỉnh lại thông số màu sắc (Color Palette) và khoảng cách (Spacing) trong Prompt để đồng bộ chính xác với nhận diện thương hiệu đã chốt của nhóm.
* Tinh chỉnh lại mật độ thông tin hiển thị trên các thẻ Layout Card và Dashboard.

### Hỗ trợ từ AI (AI-assisted)
* ChatGPT hỗ trợ tối ưu bộ Prompt tiếng Anh kỹ thuật; Công cụ Stitch by Google tiếp nhận Prompt để sinh tự động giao diện mockup.
* **Minh chứng:** [Stitch Project Link](https://stitch.withgoogle.com/projects/16441357012891837362)

---

## [2026-06-02] - Giai đoạn: Khởi tạo Repository và Cấu hình Môi trường
**Người thực hiện:** Dương Khang Huy

### Thêm mới (Added)
* Khởi tạo file `.gitignore` tiêu chuẩn cho cả hai nền tảng Frontend (React) và Backend (.NET).
* Thêm các file cấu hình môi trường mẫu: `src/backend/.env.example`, `src/frontend/.env.example` và `appsettings.Development.json.example`.
* Cập nhật tài liệu `README.md` với hướng dẫn cài đặt và khởi chạy dự án chi tiết.

### Thay đổi (Changed)
* Cập nhật lại Connection String trong `appsettings.Development.json.example` để tương thích với cấu hình SQL Server nội bộ của nhóm.

### Hỗ trợ từ AI (AI-assisted)
* Cursor đóng vai trò hỗ trợ lập trình, tự động sinh các file boilerplate (`.gitignore`, `.env.example`, `README.md`) dựa trên ngữ cảnh công nghệ của dự án.
* **Minh chứng:** Commit `[DE190900] chore: category-1 repo setup, gitignore, env examples, run docs`.

---

## [2026-06-10] - Giai đoạn: Tối ưu môi trường và Nâng cấp Linter Frontend
**Người thực hiện:** Dương Khang Huy

### Thêm mới (Added)
* Khởi tạo file cấu hình mới `src/frontend/eslint.config.js` tuân thủ chuẩn Flat Config của ESLint v9.
* Cài đặt bổ sung các dependencies nội bộ hỗ trợ linter: `globals`, `@eslint/js`.

### Thay đổi (Changed)
* Chuyển đổi toàn bộ quy tắc linter cho React/Vite từ chuẩn JSON cũ sang chuẩn JavaScript Import.
* Tắt bỏ rule `react/prop-types` để tối giản cảnh báo thừa khi không dùng TypeScript.

### Hỗ trợ từ AI (AI-assisted)
* Antigravity AI đóng vai trò Kỹ sư Hệ thống (DevOps/Tooling), tự động biên soạn cấu trúc Flat Config phức tạp và xử lý các lỗi xung đột (conflict dependencies) trong quá trình cài đặt NPM.

---
## Cam kết cập nhật Changelog
Nhóm cam kết rằng nội dung changelog phản ánh chính xác các phần việc thực tế đã hoàn thành.

| Đại diện sinh viên/nhóm | Ngày xác nhận |
| :---: | :---: |
| Dương Khang Huy | 24/05/2026 |
