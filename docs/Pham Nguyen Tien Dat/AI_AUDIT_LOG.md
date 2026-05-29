###  Log#01
- **Ngày thực hiện:** 20/05/2026
- **Người thực hiện:** Phạm Nguyễn Tiến Đạt
- **Công cụ AI hỗ trợ:** Google Gemini
- **Mục tiêu:** Tạo câu lệnh (prompt) chuyên môn bằng tiếng Anh đóng vai trò một Designer chuyên nghiệp để hướng dẫn công cụ Stitch thiết kế giao diện hệ thống đặt sân thể thao phức hợp.
- **Tham chiếu Prompt:** PROMPTS.md#prompt-01
- **Đề xuất từ AI:** Sinh ra chuỗi prompt tiếng Anh mô tả chi tiết layout hệ thống gồm thanh điều hướng Sidebar, màn hình chính Main Content, bảng màu năng động (sporty) và các khối Card thống kê doanh thu cho Dashboard.
- **Quyết định điều chỉnh (Human Decision):** Kiểm tra và can thiệp trực tiếp, bổ sung thêm từ khóa nghiệp vụ đặc thù bị AI bỏ sót bao gồm `"grid calendar view"` (lịch hiển thị dạng lưới để xem trạng thái sân) và `"payment form"` (giao diện điền thông tin thanh toán).
- **Tập tin áp dụng:** `docs/PROMPTS.md`
- **Trạng thái kiểm duyệt:** Kiểm duyệt prompt đạt chất lượng tối ưu, sẵn sàng làm dữ liệu đầu vào cho AI sinh giao diện.

###  Log#02
- **Ngày thực hiện:** 21/05/2026
- **Người thực hiện:** Phạm Nguyễn Tiến Đạt
- **Công cụ AI hỗ trợ:** Stitch By Google
- **Mục tiêu:** Dựng nhanh bản nháp giao diện tĩnh (Wireframe/Mockup HTML/CSS) cho toàn bộ hệ thống quản lý để nhóm chốt bố cục tổng quan.
- **Tham chiếu Prompt:** PROMPTS.md#prompt-02
- **Đề xuất từ AI:** Xuất bản mẫu giao diện trực quan hiển thị trên trình duyệt bao gồm khung lưới điều hướng và cấu trúc hiển thị danh sách lịch đặt sân thô.
- **Quyết định điều chỉnh (Human Decision):** Sử dụng công cụ Chrome DevTools để kiểm tra sâu vào mã nguồn, trực tiếp căn chỉnh lại các mã màu Hex code và thuộc tính khoảng cách (padding/margin) để đảm bảo khớp hoàn toàn với quy chuẩn nhận diện thương hiệu của dự án.
- **Tập tin áp dụng:** `src/frontend/mockup`
- **Trạng thái kiểm duyệt:** Giao diện tĩnh hiển thị chuẩn bố cục, được thông qua làm Base UI cho toàn hệ thống.

###  Log#03
- **Ngày thực hiện:** 22/05/2026
- **Người thực hiện:** Phạm Nguyễn Tiến Đạt
- **Công cụ AI hỗ trợ:** Antigravity AI
- **Mục tiêu:** Chuyển đổi bản vẽ giao diện tĩnh từ Stitch thành các khối Functional Component thực tế chạy trên thư viện React, cấu hình kiểu dáng bằng Tailwind CSS.
- **Tham chiếu Prompt:** PROMPTS.md#prompt-03
- **Đề xuất từ AI:** Sinh cấu trúc mã nguồn file `.jsx` cho màn hình Dashboard và Form đặt sân, tích hợp sẵn React Hook cơ bản (`useState`) cùng hệ thống class CSS của Tailwind.
- **Quyết định điều chỉnh (Human Decision):** Đập rã toàn bộ cấu trúc file Monolithic khổng lồ do AI sinh ra thành các component nguyên tử (`Button.jsx`, `InputField.jsx`, `CourtCard.jsx`) để dễ tái sử dụng. Xóa bỏ hoàn toàn dữ liệu mẫu (Mock data) của AI và viết thư viện **Axios** thực hiện gọi API bất đồng bộ nối thẳng đến Server Backend Java.
- **Tập tin áp dụng:** `src/frontend/components/BookingForm.jsx`, `src/frontend/components/Dashboard.jsx`
- **Trạng thái kiểm duyệt:** Biên dịch mã nguồn React thành công, kết nối dynamic và map dữ liệu động từ Backend lên UI mượt mà.

###  Log#04
- **Ngày thực hiện:** 24/05/2026
- **Người thực hiện:** Phạm Nguyễn Tiến Đạt
- **Công cụ AI hỗ trợ:** Antigravity AI
- **Mục tiêu:** Khắc phục lỗi hiển thị, tối ưu hóa responsive đa thiết bị cho giao diện và thiết lập logic Validation nghiêm ngặt cho Form tiếp nhận thông tin đặt lịch sân.
- **Tham chiếu Prompt:** Phân đoạn sửa lỗi tại CHANGELOG.md#phase-05
- **Đề xuất từ AI:** Gợi ý các đoạn mã CSS căn chỉnh lề bề mặt nhằm xử lý hiển thị.
- **Quyết định điều chỉnh (Human Decision):** Tự tay viết logic lập trình bên trong hàm `handleSubmit` nhằm kiểm tra thời gian thực. Chặn đứng hoàn toàn hành vi người dùng cố tình chọn ngày giờ đặt sân lùi về quá khứ (AI mặc định bỏ qua tính năng kiểm soát này). Đồng thời chèn các tiền tố breakpoint (`md:`, `lg:`) của Tailwind để xử lý triệt để lỗi vỡ khối `div` khi co màn hình về giao diện điện thoại di động.
- **Tập tin áp dụng:** `src/frontend/components`, `src/frontend/styles`
- **Trạng thái kiểm duyệt:** Chạy thử nghiệm trên localhost và kiểm tra qua Chrome DevTools ổn định, không ghi nhận lỗi Console, tính năng chặn dữ liệu rác hoạt động chính xác 100%.
