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
Prompt #04

Date: 2026-06-10

AI Tool: ChatGPT / AntiGravity

Author: Nguyễn Đăng Phúc

Purpose: Đánh giá mức độ hoàn thiện của phân hệ Admin Court Management API và kiểm tra sự tương thích giữa Source Code Backend với cơ sở dữ liệu thực tế.

//Prompt

"I need a complete progress audit of the Admin Court Management API.

Objective:
Determine exactly how much of the Admin Court Management module is completed and what still remains before production readiness.

Please inspect:

Controllers
Services
Repositories
DTOs
Entity configurations
Migrations
Database schema

Compare the EF Core model against the SQL schema and identify all mismatches.

Generate a report including:

Completed features
Existing bugs
Missing features
Blocking issues
Recommended fixes

Do not modify code.
Audit only."

//Expected Output
Báo cáo đánh giá tiến độ hoàn thiện của phân hệ Admin Court Management.
Danh sách Endpoint đã triển khai và mức độ sẵn sàng vận hành.
Phân tích sự khác biệt giữa mô hình EF Core và Database Schema.
Danh sách lỗi kiến trúc và các vấn đề có thể gây lỗi Runtime.
//Evaluation

AI đã thực hiện khá tốt vai trò kiểm toán kỹ thuật (Technical Auditor) khi rà soát toàn bộ các tầng xử lý của Backend. Hệ thống đã phát hiện được nhiều điểm bất thường trong cấu trúc dữ liệu và luồng xử lý API.

Tuy nhiên, tôi đã phải chủ động giới hạn phạm vi hoạt động của AI nhằm tránh việc tự động tạo thêm Migration hoặc Seeder mới. Tôi yêu cầu AI chỉ được sử dụng SQL Schema hiện có làm nguồn dữ liệu chuẩn (Source of Truth), đồng thời bắt buộc phải cung cấp bằng chứng kỹ thuật cụ thể (Evidence-Based Audit) thay vì đưa ra các kết luận suy đoán.

Prompt #05

Date: 2026-06-12

AI Tool: AntiGravity

Author: Nguyễn Đăng Phúc

Purpose: Kiểm tra tính tương thích giữa cơ sở dữ liệu SQL Server và mô hình Entity Framework Core của hệ thống.

//Prompt

"The audit report identifies a fatal schema mismatch.

Now provide evidence.

For every mismatch generate a comparison table:

| Database Table | SQL Column | EF Entity | EF Property | Status |

Include:

Courts
Users
Roles
Bookings
BookingDetails
CourtTypes
TimeSlots
PriceMatrix

For each mismatch provide:

SQL definition
EF Core definition
Source file path
Line number
Expected runtime exception

Do not summarize.
Show actual evidence from source files and SQL scripts."

//Expected Output
Bảng đối chiếu chi tiết giữa SQL Schema và EF Core Models.
Danh sách các cột dữ liệu không tương thích.
Dự đoán lỗi Runtime có thể xảy ra khi ứng dụng truy cập cơ sở dữ liệu.
Bằng chứng kỹ thuật gồm tên file, dòng mã nguồn và cấu trúc bảng liên quan.
//Evaluation

AI đã hỗ trợ hiệu quả trong việc phân tích sự khác biệt giữa Database Schema và tầng Data Access. Tuy nhiên, tôi không chấp nhận các kết luận tổng quát mà yêu cầu AI phải truy xuất đầy đủ bằng chứng từ mã nguồn và tập lệnh SQL.

Thông qua quá trình đối chiếu, tôi phát hiện nguyên nhân cốt lõi không nằm ở API Controller hay Service Layer mà đến từ sự không đồng bộ giữa các Entity Models và cấu trúc cơ sở dữ liệu thực tế, từ đó định hướng lại chiến lược xử lý lỗi cho nhóm.

Prompt #06

Date: 2026-06-14

AI Tool: ChatGPT

Author: Nguyễn Đăng Phúc

Purpose: Hỗ trợ quản lý mã nguồn Git và đồng bộ các thay đổi của phân hệ Admin Court Management lên GitHub Repository.

//Prompt

"Tôi đang phát triển chức năng Admin Court Management trên nhánh cá nhân.

Hãy kiểm tra trạng thái Git hiện tại và hướng dẫn tôi:

Xác định branch đang làm việc.
Kiểm tra remote repository.
Đồng bộ local branch với remote branch.
Stage các thay đổi cần thiết.
Loại bỏ các file không nên commit.
Commit theo chuẩn Git Flow.
Push code lên đúng branch cá nhân.

Ưu tiên đảm bảo an toàn dữ liệu và không làm mất các thay đổi hiện tại."

//Expected Output
Quy trình thao tác Git chi tiết từng bước.
Hướng dẫn kiểm tra Branch, Remote và Tracking Branch.
Hướng dẫn Stage, Commit và Push code lên GitHub.
Đề xuất xử lý an toàn khi xuất hiện thay đổi chưa được commit.
//Evaluation

AI đã hỗ trợ tốt trong việc phân tích trạng thái Git Repository và xác định nguyên nhân khiến nhánh cá nhân không hiển thị trên môi trường làm việc cục bộ.

Tuy nhiên, tôi đã trực tiếp đánh giá từng lệnh Git trước khi thực thi nhằm đảm bảo không làm mất dữ liệu đang phát triển. Trong quá trình làm việc, tôi phát hiện một số file dữ liệu SQL không nên được đưa vào Commit và chủ động loại bỏ chúng khỏi quá trình đồng bộ mã nguồn.

Kết quả cuối cùng, tôi đã tự mình hoàn thành việc chuyển đổi sang đúng nhánh phát triển cá nhân, thiết lập Tracking Branch và đồng bộ thành công mã nguồn của phân hệ Admin Court Management lên GitHub Repository của nhóm.

Prompt #07

Date: 2026-06-15

AI Tool: AntiGravity / ChatGPT

Author: Nguyễn Đăng Phúc

Purpose: Kiểm tra dữ liệu Seed, xác thực người dùng và đánh giá mức độ sẵn sàng của hệ thống trước khi triển khai kiểm thử tích hợp.

//Prompt

"Verify the existing SQL seed data and authentication flow.

Requirements:

Use existing SQL seed files.
Do not create new seeders.
Do not create migrations.
Verify existing users, roles and permissions.
Validate BCrypt password hashes.
Verify login functionality using seeded accounts.
Report all inconsistencies between seed data and application models."
//Expected Output
Báo cáo kiểm tra dữ liệu khởi tạo (Seed Data).
Đánh giá tính hợp lệ của tài khoản mẫu và phân quyền người dùng.
Xác minh khả năng đăng nhập bằng dữ liệu hiện có.
Danh sách các lỗi liên quan đến Password Hash và Authentication.
//Evaluation

AI đã hỗ trợ phân tích dữ liệu khởi tạo và phát hiện các bất thường liên quan đến chuỗi mã hóa mật khẩu BCrypt trong tập dữ liệu Seed.

Tuy nhiên, tôi đã chủ động yêu cầu AI không được phép tự động tạo tài khoản quản trị viên mới hoặc xây dựng lại hệ thống Seeder. Thay vào đó, tôi trực tiếp định hướng quá trình kiểm tra dựa trên dữ liệu chính thức của dự án nhằm bảo đảm tính nhất quán giữa môi trường phát triển và môi trường triển khai thực tế.

Thông qua quá trình đánh giá này, tôi đã xác định được các rủi ro tiềm ẩn ảnh hưởng đến chức năng đăng nhập và xây dựng cơ sở dữ liệu phục vụ cho giai đoạn kiểm thử tích hợp tiếp theo.
