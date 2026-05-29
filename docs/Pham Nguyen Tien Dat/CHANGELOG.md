📋 [Phase 01 & 02] Phân tích & Thiết kế UI (16/05/2026 – 20/05/2026)
- **Ngày thực hiện:** 20/05/2026
- **Người thực hiện:** Phạm Nguyễn Tiến Đạt
- **Công cụ AI hỗ trợ:** Google Gemini, Stitch By Google
- **Mục tiêu:** Tạo câu lệnh chuyên môn bằng tiếng Anh để điều khiển công cụ Stitch sinh giao diện tĩnh và dashboard thô cho người quản lý.
- **Tham chiếu Prompt:** PROMPTS.md#prompt-02
- **Đề xuất từ AI:** Trả về đoạn prompt tiếng Anh tối ưu hóa layout Sidebar, Card thống kê và bản nháp UI trực quan trên trình duyệt.
- **Quyết định điều chỉnh (Human Decision):** Tự viết bổ sung thêm các trường nghiệp vụ đặc thù như `"grid calendar view"` (lịch hiển thị dạng lưới) và `"payment form"` để đảm bảo sát với tài liệu SRS.
- **Tập tin áp dụng:** `docs/SRS.md`, `src/frontend/mockup`
- **Trạng thái kiểm duyệt:** Hoàn thành thiết kế Base UI, làm nền tảng cho việc code React.

### 💻 [Phase 03] Triển khai Mã nguồn (21/05/2026 – 22/05/2026)
- **Ngày thực hiện:** 22/05/2026
- **Người thực hiện:** Phạm Nguyễn Tiến Đạt
- **Công cụ AI hỗ trợ:** Antigravity AI
- **Mục tiêu:** Sinh mã nguồn các khối Functional Component React (Stateful, JSX) kết hợp Tailwind CSS từ thiết kế tĩnh.
- **Tham chiếu Prompt:** PROMPTS.md#prompt-03
- **Đề xuất từ AI:** Trả về cấu trúc file `.jsx` cho Form đặt sân và Dashboard có sẵn `useState`.
- **Quyết định điều chỉnh (Human Decision):** Đập rã mã nguồn monolithic lớn của AI thành component nhỏ độc lập; xóa dữ liệu mẫu (Mock data) của AI để thay bằng các hàm Axios gọi API động.
- **Tập tin áp dụng:** `src/frontend/components/BookingForm.jsx`, `src/frontend/components/Dashboard.jsx`
- **Trạng thái kiểm duyệt:** Biên dịch React thành công, kết nối dynamic dữ liệu mượt mà.




