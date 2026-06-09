# AI Audit Log

// LOG01
Thời gian: 2026-05-20

Thành viên đảm nhiệm: Nguyễn Đăng Phúc (MSSV: DE190130)
Hệ thống AI: Gemini
Mục tiêu: Xây dựng câu lệnh (prompt) tối ưu nhằm định hình giao diện Web UI trên nền tảng thiết kế Stitch.
Nội dung Prompt gốc: "Như là một DESIGNER, bạn hãy cho tôi prompt để hướng dẫn Stitch làm phần thiết kế UI tĩnh cho dự án Pro-Sport Complex Management System của tôi..."

Giải pháp do AI đề xuất
AI đã hóa thân thành chuyên gia thiết kế (Designer), bóc tách các thành phần giao diện thiết yếu và cung cấp hệ thống prompt bằng tiếng Anh chuẩn hóa cho Stitch.
Đưa ra định hướng về phối màu đậm chất thể thao, bố cục trực quan cho trang chủ, giao diện hiển thị danh sách sân bãi, cùng với khu vực bảng điều khiển (dashboard) tích hợp các biểu đồ phân tích số liệu cơ bản.
Đánh giá và Chỉnh sửa từ phía thành viên
Nội dung tiếp thu: Áp dụng toàn bộ khung cấu trúc prompt tiếng Anh cùng các phương án tổ chức, sắp xếp các cấu phần giao diện do AI hoạch định.
Tinh chỉnh thực tế: Trực tiếp sửa đổi lại thông số màu sắc trong prompt để đảm bảo tính đồng bộ với bộ nhận diện thương hiệu của nhóm. Đồng thời, chủ động bổ sung thêm yêu cầu thiết kế giao diện hóa đơn/thanh toán (Payment UI) – tính năng mà ban đầu AI chưa đề cập tới.
Khai thác thực tế
Sử dụng làm dữ liệu đầu vào (Input prompt) trực tiếp cho bộ công cụ Stitch By Google.

Kết quả thẩm định
Kiểm tra trực quan sản phẩm prompt đầu ra. Định hướng bố cục tổng thể có độ tương thích cao với yêu cầu, dù vẫn cần căn chỉnh thủ công một số chi tiết nhỏ để các thành phần (components) ăn khớp hoàn toàn với kịch bản trải nghiệm của người dùng (User Flow).

//LOG02
Thời gian: 2026-05-22
Thành viên đảm nhiệm: Nguyễn Đăng Phúc (MSSVL:DE190130)
Hệ thống AI: Stitch By Google
Mục tiêu: Hiện thực hóa giao diện và xây dựng mã nguồn Frontend tĩnh từ bộ câu lệnh đã thiết lập.
Nội dung Prompt gốc: "Design a clean and modern dashboard for a sports complex management system. Include a sidebar for navigation..."

Giải pháp do AI đề xuất
Tự động khởi tạo bộ mã nguồn (HTML/CSS/JS) hoàn chỉnh cho một giao diện web trực quan, hiện đại.
Thiết lập bố cục tổng thể cho trang điều khiển trung tâm (Dashboard), thanh menu điều hướng (Navbar/Sidebar) và các cấu phần (components) hiển thị trực quan trạng thái vận hành của sân bãi (sân trống, đã có lịch, hoặc đang sửa chữa).

Đánh giá và Chỉnh sửa từ phía thành viên
Nội dung tiếp thu: Khai thác toàn bộ giải pháp phân bổ sơ đồ giao diện (Layout), hệ thống lưới (Grid/Flexbox) cùng bảng mã màu CSS cho các trang giao diện cốt lõi.
Tinh chỉnh kỹ thuật 1 (Cấu trúc lại mã nguồn): Thực hiện bóc tách file HTML nguyên khối ban đầu thành các tệp tin .jsp độc lập (Header, Footer, Menu) nhằm tối ưu hóa khả năng tái sử dụng mã nguồn theo kiến trúc Java Web.
Tinh chỉnh kỹ thuật 2 (Tích hợp dữ liệu và Tối ưu hiển thị): Nhúng thêm các biểu thức thẻ JSTL để thay thế toàn bộ dữ liệu mẫu (mock data) của Stitch bằng nguồn dữ liệu động được đổ về từ Model/Controller, đồng thời hiệu chỉnh lại các lớp CSS nhằm nâng cao khả năng hiển thị linh hoạt (Responsive) trên màn hình thiết bị di động.
Khai thác thực tế
Tích hợp trực tiếp vào các file thành phần .jsx (Header, Footer, Menu).
Áp dụng vào hệ thống giao diện Frontend của dự án.

Kết quả thẩm định
Tiến hành so sánh đối chiếu trực tiếp giữa giao diện thực tế sau khi xử lý với bản thiết kế thô từ Stitch để bảo đảm tính thống nhất về mặt mỹ thuật và bố cục.
Sử dụng bộ công cụ DevTools trên trình duyệt để kiểm thử kỹ năng hiển thị tương thích trên cả môi trường máy tính (PC) lẫn điện thoại (Mobile).

//LOG03
Thời gian: 2026-06-02
Thành viên đảm nhiệm: Nguyễn Đăng Phúc (MSSV: DE190130)

Hệ thống AI: ChatGPT / Claude

Mục tiêu: Thiết lập cấu trúc hệ thống API RESTful dành cho phân hệ Admin quản lý sân bãi dựa trên tài liệu đặc tả và quy định dự án.
Nội dung Prompt gốc: "Bạn là 1 backend developer xuất sắc với 10 năm kinh nghiệm, hãy đọc kĩ đặc tả @SRS.md để hiểu dự án và công nghệ sử dụng, đọc kĩ 2 file @AGENT.md để biết rule cho AI... hãy làm cho tôi API quản lý sân dành cho admin"

Giải pháp do AI đề xuất
Đóng vai trò Chuyên gia lập trình Backend cấp cao, phân tích sâu tài liệu nghiệp vụ công nghệ để xuất bản tài liệu đặc tả API RESTful hoàn chỉnh cho module Admin quản lý sân.
Định hình toàn bộ cấu trúc các đường dẫn (endpoints) bao gồm đầy đủ phương thức (GET, POST, PUT, DELETE) cho các tính năng: Thêm sân mới, Cập nhật thông tin, Xóa sân, Chuyển đổi trạng thái vận hành, và Tìm kiếm kèm bộ lọc theo loại sân (Badminton/Pickleball).
Cung cấp khuôn mẫu dữ liệu đầu vào/đầu ra (Request/Response Body) dưới dạng JSON chuẩn hóa, chứa đầy đủ các trường thông tin cốt lõi (id, courtName, courtType, status, pricePerHour).

Đánh giá và Chỉnh sửa từ phía thành viên
Nội dung tiếp thu: Áp dụng toàn bộ tư duy thiết kế luồng API chuẩn RESTful, kiến trúc đặt tên endpoint ngắn gọn và cấu trúc JSON mẫu do AI hoạch định.
Tinh chỉnh kỹ thuật (Xử lý ràng buộc nghiệp vụ thực tế): * Trực tiếp can thiệp và bổ sung các trường dữ liệu thực tế của nhóm vào cấu trúc JSON (như vị trí cụm sân locationCluster và cờ kiểm tra khả dụng isAvailable).
Chủ động tái cấu trúc logic cho API Xóa (DELETE) và API Cập nhật trạng thái sân (PUT status): Thêm điều kiện kiểm tra nghiêm ngặt dưới database, nếu sân đang có lịch đặt chỗ còn hiệu lực (Active Booking) thì hệ thống sẽ từ chối xử lý và trả về mã lỗi 400 Bad Request kèm thông báo cảnh báo, thay vì cho phép xóa trực tiếp như AI gợi ý ban đầu.

Khai thác thực tế
Sử dụng làm bộ tài liệu đặc tả API chuẩn (API Specification) để bàn giao cho các thành viên phụ trách Database và Frontend phối hợp đóng gói mã nguồn.

Kết quả thẩm định
Kiểm tra tính hợp lệ về mặt cú pháp của chuỗi JSON mẫu và chạy thử nghiệm giả lập các luồng request/response để đảm bảo không bị xung đột logic nghiệp vụ.

Đối chiếu các endpoint với sơ đồ thực thể database của nhóm nhằm đảm bảo tính đồng bộ dữ liệu hoàn toàn trước khi tiến hành code Backend thực tế.