Tự phản ánh (Reflection và Lessons Learned) - Nguyễn Đăng Phúc
Reflection - Giai đoạn 1: Nghiên cứu nghiệp vụ và Hoạch định cấu trúc màn hình UI/UX
Tổng quan quá trình
Trong giai đoạn khởi động dự án Pro Sport Manager System, tôi đã đóng vai trò chủ đạo trong việc bóc tách yêu cầu nghiệp vụ của một tổ hợp thể thao lớn (Badminton & Pickleball). Tôi tận dụng sức mạnh của Google Gemini để phân rã các module chức năng cốt lõi và thiết lập cấu trúc UX/UI ban đầu. Việc áp dụng kỹ thuật Meta-prompting (dùng Gemini đóng vai trò Designer để biên soạn ra bộ khung câu lệnh tiếng Anh tối ưu) đã giúp tăng tốc đáng kể quá trình phác thảo Wireframe và đồng bộ cấu trúc hơn 50 màn hình thông qua công cụ Stitch By Google.

Hạn chế của AI
Dù mang lại tốc độ vượt trội, giải pháp tự động hóa của AI trong giai đoạn đầu lộ rõ những điểm hạn chế mang tính rập khuôn:

Thiếu chiều sâu nghiệp vụ: AI chỉ đề xuất được các màn hình cơ bản mà bỏ sót các phân hệ cốt lõi, đặc thù phục vụ vận hành thực tế của sân thể thao (như sơ đồ lưới thời gian thực hay form thanh toán chi tiết).

Layout lặp cấu trúc: Công cụ sinh giao diện tự động Stitch có xu hướng lặp lại các component thiết kế giống nhau một cách máy móc trên nền tảng SaaS, khiến giao diện bị loãng và thiếu điểm nhấn cho các số liệu vận hành quan trọng.

Giải pháp và Can thiệp của con người (Human Decision)
Để biến các bản vẽ thô mang tính lý thuyết của AI thành một giải pháp phần mềm có giá trị thực tiễn, tôi đã trực tiếp thực hiện các can thiệp:

Tinh chỉnh Prompt chiến lược: Ép AI bổ sung luồng hiển thị form thanh toán (Payment UI) và cấu trúc quản lý đặt lịch vào câu lệnh đầu vào. Thay đổi toàn bộ thông số màu sắc trong prompt để giao diện đồng bộ chính xác với bộ nhận diện thương hiệu của nhóm.

Căn chỉnh bố cục thủ công: Tự tay sắp xếp lại các khoảng cách (spacing), card layout và sơ đồ hiển thị bảng điều khiển (Admin Dashboard) của Stitch để tối ưu hóa không gian hiển thị, làm nổi bật các thông tin quan trọng khi Admin điều hành sân bãi.

Bài học rút ra
AI là một trợ lý xuất sắc trong việc khơi gợi ý tưởng và xây dựng khung sườn tổng thể trên quy mô lớn, nhưng không thể thay thế tư duy nghiệp vụ thực tế của con người. Người kỹ sư thiết kế hệ thống phải là người trực tiếp định hướng, kiểm soát các ràng buộc thẩm mỹ và trải nghiệm (User Flow) để đảm bảo sản phẩm đầu ra vừa mang tính thực tế, vừa nhất quán với thương hiệu của dự án.

Reflection - Giai đoạn 2: Thiết kế kiến trúc API Admin và Bảo toàn logic nghiệp vụ
Tổng quan quá trình
Giai đoạn này tập trung vào việc hiện thực hóa các chức năng của phân hệ Admin điều hành trung tâm (Court Management) và chuẩn bị hạ tầng kết nối dữ liệu cho Backend. Tôi đã khai thác năng lực chuyên môn của ChatGPT và Claude trong vai trò một Lập trình viên Backend cấp cao có 10 năm kinh nghiệm để hoạch định hệ thống API RESTful. AI đã hỗ trợ đắc lực trong việc xuất bản nhanh tài liệu đặc tả API (API Specification), thiết lập cấu trúc các đường dẫn (endpoints) điều hướng và định hình cấu trúc dữ liệu truyền tải mẫu (Request/Response Body) dưới dạng JSON.

Hạn chế của AI và Nguy cơ kỹ thuật
Khi đi sâu vào thiết kế logic hệ thống, AI bắt đầu bộc lộ các lỗ hổng tư duy kỹ thuật nghiêm trọng do thiếu nhận thức về tính toàn vẹn của dữ liệu thực tế:

Bỏ sót ràng buộc toàn vẹn dữ liệu (Data Integrity): AI đề xuất một API xóa sân trực tiếp (DELETE) vô điều kiện mà không tính đến các mối quan hệ thực thể trong cơ sở dữ liệu. Nếu áp dụng nguyên văn code này vào thực tế, hệ thống sẽ gặp lỗi nghiêm trọng (xung đột dữ liệu hoặc crash) khi Admin vô tình xóa một sân đang có khách sử dụng.

Thiếu trường dữ liệu thực tế: Các chuỗi dữ liệu JSON mẫu do AI khởi tạo quá chung chung, thiếu hụt các thông tin định danh cốt lõi để phân loại cơ sở vật chất (như phân cụm sân hay cờ kiểm tra khả dụng).

Giải pháp và Can thiệp của con người (Human Decision)
Để bảo vệ hệ thống khỏi các xung đột logic nghiêm trọng trước khi bàn giao tài liệu cho đội ngũ code Backend, tôi đã tiến hành can thiệp kỹ thuật nghiêm ngặt:

Tái cấu trúc Logic API: Chủ động viết lại luồng xử lý cho API Xóa (DELETE) và API Cập nhật trạng thái (PUT). Nhúng thêm điều kiện kiểm tra nghiêm ngặt dưới database: Nếu sân bãi đang tồn tại bất kỳ lịch đặt chỗ nào còn hiệu lực (Active Booking), hệ thống Backend bắt buộc phải từ chối xử lý, chặn đứng hành động xóa và trả về mã lỗi 400 Bad Request kèm thông báo cảnh báo trực quan cho Admin.

Chuẩn hóa cấu trúc JSON: Bổ sung các trường dữ liệu thực tế bắt buộc của nhóm vào cấu trúc JSON mẫu (như vị trí cụm sân locationCluster và trạng thái khả dụng isAvailable) để đảm bảo khớp 100% với sơ đồ thực thể database.

Bài học rút ra
AI xây dựng khối lượng, con người kiểm soát chất lượng: AI có khả năng viết ra hàng trăm dòng tài liệu đặc tả API chuẩn RESTful chỉ trong vài giây, nhưng lập trình viên bắt buộc phải là "người gác cổng" về mặt logic. Sự am hiểu sâu sắc về ràng buộc nghiệp vụ (Business Rules) và kiểm thử luồng dữ liệu giả định là vũ khí duy nhất để phát hiện ra các lỗi hệ thống tiềm ẩn.

Tư duy hệ thống và Trách nhiệm học thuật: Việc đối chiếu chéo liên tục giữa tài liệu thiết kế giao diện UI/UX, sơ đồ cơ sở dữ liệu và tài liệu API giúp toàn bộ codebase của dự án giữ được tính đồng bộ cao. Không bao giờ được nộp hoặc áp dụng nguyên văn kết quả của AI mà không qua kiểm chứng, vì một sơ suất nhỏ trong logic API có thể phá vỡ tính ổn định của cả một hệ thống SaaS vận hành trên thực tế.