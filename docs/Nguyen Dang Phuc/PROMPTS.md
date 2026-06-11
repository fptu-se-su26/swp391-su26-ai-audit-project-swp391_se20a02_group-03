Prompt #01
Date: 2026-05-20

AI Tool: Google Gemini
Author: Nguyễn Đăng Phúc
Purpose: Tạo câu lệnh cấu trúc (meta-prompt) chuyên biệt để hướng dẫn công cụ Stitch thiết kế bộ giao diện Web UI tĩnh cho hệ thống Pro-Sport Complex Management System.

//Prompt
"Như là một DESIGNER, bạn hãy cho tôi prompt để hướng dẫn Stitch làm phần thiết kế UI tĩnh cho dự án Pro-Sport Complex Management System của tôi. Hệ thống bao gồm các phân hệ: trang chủ, màn hình danh sách sân, giao diện Dashboard với biểu đồ thống kê và form thanh toán chi tiết (Payment UI). Bảng màu cần mang phong cách thể thao, năng động và khớp với nhận diện thương hiệu của nhóm."
//Expected Output
Bộ câu lệnh tiếng Anh chi tiết, được tối ưu hóa theo chuẩn cấu trúc đầu vào của công cụ Stitch By Google.
Đề xuất giải pháp phân bổ sơ đồ giao diện (Layout), định hướng màu sắc thể thao, bố cục trang chủ và cấu trúc bảng điều khiển (Dashboard) tích hợp biểu đồ thống kê.
//Evaluation
Prompt đạt hiệu quả cao trong việc giới thiệu ngữ cảnh hệ thống. Gemini đã hóa thân thành chuyên gia thiết kế rất tốt để xuất bản bộ từ khóa tiếng Anh chuẩn xác. Tuy nhiên, tôi đã phải thực hiện can thiệp kỹ thuật (Human Decision): chủ động thay đổi lại thông số bảng mã màu trong câu lệnh để khớp chính xác với bộ nhận diện thương hiệu đã chốt của nhóm, đồng thời ép AI bổ sung thêm luồng hiển thị form thanh toán chi tiết (Payment UI) – tính năng vận hành quan trọng mà hệ thống tự động đã bỏ sót trong lượt gợi ý đầu tiên.

Prompt #02
Date: 2026-05-22

AI Tool: Stitch By Google (kết hợp ChatGPT)
Author: Nguyễn Đăng Phúc
Purpose: Thiết lập cấu trúc giao diện Dashboard và phân hệ quản trị (SaaS Admin) dựa trên bộ khung câu lệnh đã chuẩn bị.

//Prompt
"Design a clean and modern dashboard for a sports complex management system. Include a sidebar for navigation with links to: Admin Dashboard, Court Management, Booking Overviews, Inventory, Pricing Matrix, and System Administration. The main content area should display real-time court cluster status with comprehensive metrics. Use a dynamic enterprise SaaS color palette, optimizing space for dense operational workflows."
//Expected Output
Bản vẽ mô hình giao diện (Mockup) hoàn chỉnh cho nền tảng Desktop SaaS phục vụ ban quản trị.
Cấu trúc các thành phần (Component Structure) trực quan như hệ thống thẻ trạng thái sân bãi, bảng dữ liệu điều hành và biểu đồ doanh thu.
//Evaluation
Công cụ Stitch đã tạo ra các thành phần giao diện theo phong cách Enterprise khá bài bản. Tuy nhiên, do đặc thù tự động hóa, các cấu phần giao diện trên trang bị lặp lại cấu trúc lặp khuôn quá nhiều. Tôi đã phải trực tiếp can thiệp thủ công: tự tay tùy chỉnh lại bố cục layout, khoảng cách (spacing) và card layout trên màn hình điều khiển trung tâm nhằm tối ưu hóa trải nghiệm người dùng, giúp giao diện làm nổi bật được các thông số nghiệp vụ quan trọng khi Admin vận hành thực tế.

Prompt #03
Date: 2026-06-02

AI Tool: ChatGPT / Claude
Author: Nguyễn Đăng Phúc
Purpose: Xây dựng kiến trúc hệ thống API RESTful dành riêng cho phân hệ Admin quản lý sân bãi nhằm chuẩn bị tích hợp Backend.
//Prompt
"Bạn là 1 backend developer xuất sắc với 10 năm kinh nghiệm, hãy đọc kĩ đặc tả @SRS.md để hiểu dự án và công nghệ sử dụng, đọc kĩ 2 file @AGENT.md để biết rule cho AI... hãy làm cho tôi API quản lý sân dành cho admin"
//Expected Output
Tài liệu đặc tả API Specification hoàn chỉnh đạt chuẩn RESTful cho module quản lý sân (Court Management).
Danh sách các endpoints tương ứng với các phương thức nghiệp vụ (GET, POST, PUT, DELETE).
Khuôn mẫu dữ liệu truyền tải đầu vào/đầu ra (Request/Response Body) dưới dạng cấu trúc JSON chuẩn hóa.
//Evaluation
AI đã hoàn thành xuất sắc vai trò của một lập trình viên Backend cấp cao khi cung cấp một bộ tài liệu API rất bài bản, logic đặt tên endpoint ngắn gọn và cấu trúc JSON sạch sẽ. Dù vậy, tôi đã phải thực hiện tinh chỉnh kỹ thuật nghiêm ngặt để đáp ứng ràng buộc nghiệp vụ thực tế (Business Rules):
Chủ động can thiệp vào cấu trúc JSON để bổ sung các trường dữ liệu thực tế của dự án như vị trí cụm sân (locationCluster) và cờ kiểm tra khả dụng (isAvailable).
Phát hiện lỗi logic bảo toàn dữ liệu nghiêm trọng từ AI khi hệ thống tự động cho phép gọi API xóa sân trực tiếp (DELETE). Tôi đã tự tay tái cấu trúc lại logic cho API Xóa và API cập nhật trạng thái: Nhúng thêm điều kiện kiểm tra dưới cơ sở dữ liệu, bắt buộc nếu sân đang tồn tại lịch đặt chỗ còn hiệu lực (Active Booking) thì Backend phải từ chối xử lý, lập tức chặn đứng hành động và trả về mã lỗi 400 Bad Request cùng cảnh báo, đảm bảo hệ thống không bị xung đột dữ liệu khi đưa vào vận hành.