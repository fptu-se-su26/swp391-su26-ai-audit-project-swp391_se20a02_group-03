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
Nhật ký thay đổi (Changelog) - Nguyễn Đăng Phúc

[2026-06-10] - Giai đoạn: Rà soát kiến trúc Backend & Kiểm tra tính tương thích Database

Người thực hiện: Nguyễn Đăng Phúc

Thêm mới (Added)
Thực hiện kiểm tra toàn diện kiến trúc Backend theo mô hình nhiều tầng (Controller – Service – Repository – Infrastructure).
Xây dựng bộ tiêu chí đánh giá mức độ hoàn thiện của phân hệ quản lý sân (Court Management Module) dành cho vai trò Quản trị viên.
Bổ sung quy trình kiểm tra tính tương thích giữa mô hình Entity Framework Core và cơ sở dữ liệu SQL Server hiện có.
Thiết lập mẫu báo cáo Audit nhằm theo dõi các lỗi liên quan đến Authentication, Authorization và Database Mapping.
Thay đổi (Changed)
Điều chỉnh phương pháp kiểm thử từ hướng Code-First sang Database-First nhằm đảm bảo tính đồng nhất với cơ sở dữ liệu được nhóm xây dựng trước đó.
Cập nhật quy trình đánh giá API, yêu cầu đối chiếu trực tiếp giữa SQL Schema và EF Core Models thay vì chỉ dựa trên Migration.
Hỗ trợ từ AI (AI-assisted)
ChatGPT và AntiGravity hỗ trợ rà soát kiến trúc hệ thống, phân tích mối quan hệ giữa các tầng xử lý và đề xuất quy trình Audit Backend theo chuẩn Enterprise Application.
[2026-06-12] - Giai đoạn: Kiểm tra và đánh giá phân hệ Admin Court Management API

Người thực hiện: Nguyễn Đăng Phúc

Thêm mới (Added)
Tiến hành Audit toàn bộ các API thuộc phân hệ quản lý sân dành cho Admin.
Xác định danh sách Endpoint chính bao gồm:
Lấy danh sách sân.
Lấy thông tin sân theo ID.
Tạo mới sân.
Cập nhật thông tin sân.
Xóa sân.
Truy vấn lịch sử đặt sân liên quan.
Thiết lập ma trận kiểm tra trạng thái Endpoint nhằm đánh giá mức độ hoàn thiện của từng chức năng.
Sửa lỗi / Tối ưu logic (Fixed)
Phát hiện sự không đồng nhất giữa cấu trúc bảng dữ liệu trong SQL Server và các Entity được khai báo trong EF Core.
Xác định nguy cơ phát sinh lỗi Runtime (HTTP 500 Internal Server Error) do tên cột và quan hệ dữ liệu không khớp giữa Database và Source Code.
Kiến nghị chuyển hướng ưu tiên từ việc bổ sung tính năng mới sang xử lý đồng bộ Schema Mapping.
Hỗ trợ từ AI (AI-assisted)
AntiGravity hỗ trợ phân tích source code, truy vết luồng xử lý API và xây dựng báo cáo đánh giá mức độ hoàn thiện của module.
ChatGPT hỗ trợ xác minh kết quả Audit, đối chiếu nguyên nhân lỗi và đề xuất phương án xử lý theo hướng Database-Driven Development.
[2026-06-14] - Giai đoạn: Quản lý mã nguồn Git và triển khai nhánh chức năng cá nhân

Người thực hiện: Nguyễn Đăng Phúc

Thêm mới (Added)
Thiết lập và đồng bộ nhánh phát triển cá nhân:
feat/DE190130_API_Quan_Ly_San
Hoàn tất việc cập nhật các thay đổi liên quan đến phân hệ quản lý sân và đồng bộ lên kho mã nguồn GitHub của nhóm.
Thực hiện kiểm tra trạng thái repository, xác minh kết nối Remote Repository và cấu hình theo dõi nhánh (Tracking Branch).
Thay đổi (Changed)
Điều chỉnh quy trình làm việc Git nhằm đảm bảo các thay đổi chỉ được triển khai trên nhánh chức năng riêng, tránh tác động trực tiếp tới nhánh chính (main).
Chuẩn hóa quy trình Commit và Push theo chuẩn Git Flow của dự án.
Hỗ trợ từ AI (AI-assisted)
ChatGPT hỗ trợ xử lý các tình huống liên quan đến Git Branch, Remote Tracking, Push/Pull Repository và xác minh tính toàn vẹn của mã nguồn trước khi đồng bộ lên GitHub.
AI hỗ trợ phân tích log Git và hướng dẫn khôi phục trạng thái làm việc khi phát sinh xung đột giữa Local Branch và Remote Branch.
[2026-06-15] - Giai đoạn: Kiểm tra dữ liệu Seed và xác thực hệ thống đăng nhập

Người thực hiện: Nguyễn Đăng Phúc

Thêm mới (Added)
Thực hiện kiểm tra dữ liệu khởi tạo (Seed Data) phục vụ cho phân hệ xác thực người dùng.
Đánh giá mức độ phù hợp của các tài khoản mẫu, vai trò (Roles) và dữ liệu sân được khởi tạo trong cơ sở dữ liệu.
Sửa lỗi / Tối ưu logic (Fixed)
Phát hiện bất thường trong dữ liệu mật khẩu mã hóa BCrypt của các tài khoản khởi tạo.
Đề xuất quy trình xác minh tính hợp lệ của Password Hash trước khi tiến hành kiểm thử Authentication.
Ngăn chặn việc tạo thêm Seeder hoặc Migration mới khi hệ thống đã tồn tại bộ SQL Schema và SQL Seed Data chính thức.
Hỗ trợ từ AI (AI-assisted)
AntiGravity hỗ trợ kiểm tra cấu trúc dữ liệu khởi tạo và phân tích khả năng ảnh hưởng của Seed Data đến luồng xác thực.
ChatGPT hỗ trợ xây dựng quy trình đối chiếu giữa dữ liệu thực tế trong Database và các Entity Models của hệ thống.

Các mục này phù hợp để đưa vào Individual Contribution Report, Project Logbook, Weekly Progress Report hoặc Defense Document vì thể hiện rõ:

Công việc thực hiện.
Quyết định kỹ thuật.
Các lỗi đã phát hiện.
Vai trò của AI và vai trò trực tiếp của bạn trong quá trình thực hiện.
