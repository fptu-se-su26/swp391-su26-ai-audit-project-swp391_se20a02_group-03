Nhật ký thay đổi (Changelog) - Nguyễn Đăng Phúc
[2026-05-20] - Giai đoạn: Nghiên cứu nghiệp vụ & Hoạch định cấu trúc màn hình UI/UX
Người thực hiện: Nguyễn Đăng Phúc

Thêm mới (Added)
Phân tích và bóc tách toàn bộ yêu cầu nghiệp vụ của hệ thống quản lý tổ hợp thể thao Badminton & Pickleball để lên cấu trúc UX/UI tổng thể.
Xác định danh sách các module cốt lõi và phân loại chi tiết 3 vai trò người dùng trong hệ thống: Khách hàng (Customer), Nhân viên (Staff), và Quản trị viên (Admin).
Bổ sung yêu cầu thiết kế giao diện hóa đơn/thanh toán chi tiết (Payment UI) vào luồng nghiệp vụ – phần việc mà công cụ thiết kế ban đầu chưa tự động nhận diện.

Thay đổi (Changed)
Cơ cấu và điều chỉnh lại số lượng màn hình (khoảng 55–60 screens) để tối ưu hóa phạm vi dự án thực tế.
Tùy chỉnh thông số bảng mã màu thể thao và tinh chỉnh lại các class trong prompt để đạt sự đồng bộ chính xác với bộ nhận diện thương hiệu đã chốt của nhóm.

Hỗ trợ từ AI (AI-assisted)
Gemini đóng vai trò Chuyên gia thiết kế (Designer), hỗ trợ phân rã cấu trúc các module và chuyển đổi các ý tưởng giao diện tĩnh thành bộ khung Prompt tiếng Anh chuyên biệt, làm dữ liệu đầu vào (Input prompt) trực tiếp cho bộ công cụ Stitch By Google.

[2026-05-22] - Giai đoạn: Thiết kế giao diện Dashboard & Phân hệ quản trị (SaaS Admin)
Người thực hiện: Nguyễn Đăng Phúc

Thêm mới (Added)
Thiết lập bố cục tổng thể cho trang quản lý trung tâm (Admin Dashboard), thanh menu điều hướng (Navbar/Sidebar) và các cấu phần giao diện đặc thù cho việc điều hành sân bãi.
Thiết kế chi tiết cấu trúc Prompt để nạp vào công cụ Stitch with Google nhằm đồng bộ hóa thư viện thiết kế (Design System) theo phong cách Enterprise SaaS cho phân hệ Admin.

Thay đổi (Changed)
Tùy chỉnh quy trình vận hành tự động cho Admin: Thay đổi cách phân bổ sơ đồ giao diện, card layout và bố cục bảng điều khiển để cắt giảm thao tác thừa cho người quản lý.

Hỗ trợ từ AI (AI-assisted)
Stitch By Google (kết hợp ChatGPT) hỗ trợ khởi tạo nhanh mô hình giao diện (Mockup) thô cho các phân hệ của Admin dựa trên bộ câu lệnh. Người thực hiện tự căn chỉnh thủ công layout và spacing bằng tay để làm nổi bật thông tin dữ liệu quan trọng.

[2026-06-02] - Giai đoạn: Thiết kế kiến trúc API RESTful cho module Admin quản lý sân
Người thực hiện: Nguyễn Đăng Phúc

Thêm mới (Added)
Xây dựng và ban hành tài liệu đặc tả hệ thống API (API Specification) chuẩn RESTful phục vụ cho phân hệ Admin, bao gồm các chức năng cốt lõi: Thêm sân mới (POST), Sửa đổi thông tin (PUT), Xóa sân (DELETE), và Tra cứu danh sách sân kèm bộ lọc (GET).
Thiết lập khuôn mẫu dữ liệu đầu vào/đầu ra (Request/Response Body) dưới dạng JSON, đồng thời bổ sung các trường dữ liệu thực tế của dự án như vị trí cụm sân (locationCluster) và cờ trạng thái khả dụng (isAvailable).

Sửa lỗi / Tối ưu logic (Fixed)
Khắc phục lỗi logic bảo toàn dữ liệu: Phát hiện AI sinh lệnh xóa sân trực tiếp (DELETE) mà không có ràng buộc. Đã tự tay tái cấu trúc lại logic: Bổ sung điều kiện kiểm tra dưới cơ sở dữ liệu, nếu sân đang có lịch đặt chỗ còn hiệu lực (Active Booking) thì hệ thống sẽ từ chối xóa và trả về mã lỗi 400 Bad Request kèm cảnh báo hệ thống.

Hỗ trợ từ AI (AI-assisted)
ChatGPT và Claude đóng vai trò Chuyên gia lập trình Backend cấp cao, hỗ trợ chuẩn hóa cấu trúc endpoint và sinh chuỗi JSON mẫu cho các request/response. Người thực hiện trực tiếp thẩm định cú pháp JSON, đối chiếu dữ liệu với sơ đồ thực thể của nhóm trước khi bàn giao cho thành viên viết code backend thực tế.