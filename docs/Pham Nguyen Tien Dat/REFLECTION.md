Reflection - Week 1
Trong tuần này, chúng tôi đã sử dụng Gemini và Stitch By Google để lên ý tưởng và dựng bản nháp giao diện (Mockup) tĩnh cho hệ thống Pro-Sport Complex Management. Việc áp dụng kỹ thuật Meta-prompting (dùng Gemini sinh prompt chuẩn tiếng Anh làm đầu vào cho Stitch) đã thể hiện hiệu suất rất cao trong việc trực quan hóa các ý tưởng thiết kế thành mã HTML/CSS chỉ trong thời gian ngắn. Tuy nhiên, kết quả đầu ra của AI ban đầu còn mang tính chất chung chung, bỏ sót các thành phần nghiệp vụ đặc thù của nền tảng đặt sân thể thao (chẳng hạn như lịch dạng lưới - grid calendar view, hay form thanh toán), đồng thời mã nguồn sinh ra có dạng nguyên khối (monolithic) khó tái sử dụng.

Để giải quyết hạn chế về mặt nghiệp vụ và cấu trúc này, chúng tôi đã chủ động can thiệp bằng cách tinh chỉnh lại các câu lệnh prompt để ép AI bổ sung các thành phần còn thiếu, điều chỉnh lại bảng màu cho khớp với nhận diện thương hiệu của dự án. Đồng thời, chúng tôi tự tay bóc tách các file HTML tĩnh thành các module riêng biệt (Header, Footer, Menu). Sự điều chỉnh về mặt cấu trúc này đã giúp chúng tôi hiểu rằng AI rất giỏi trong việc phác thảo bố cục tổng thể, nhưng để sản phẩm đáp ứng đúng kiến trúc phần mềm, lập trình viên phải là người phân rã và tổ chức lại mã nguồn.

Bài học chính rút ra từ tuần này là việc sử dụng kết hợp các công cụ AI theo chuỗi (chaining AI tools) mang lại tốc độ vượt trội trong giai đoạn tạo mẫu, nhưng sự giám sát chặt chẽ và tinh chỉnh thủ công từ con người là bắt buộc để biến một giao diện mẫu thành một bộ khung dự án chuẩn hóa.





Reflection - Week 2
Trong tuần này, chúng tôi tập trung đồng thời vào hai mục tiêu: lột xác hoàn toàn giao diện người dùng đạt chuẩn Premium UI/UX và chuyển đổi thiết kế tĩnh thành các React Component hoạt động được cho hai phân hệ lõi là Courts (Apex) và MatchPro. Chúng tôi đã tận dụng Antigravity AI để sinh mã nguồn JSX, Tailwind CSS và gợi ý cấu trúc hiệu ứng chuyển động với thư viện GSAP cho 10 trang chức năng. Mặc dù công cụ này giúp tăng tốc đáng kể quá trình xây dựng giao diện, kết quả đầu ra của nó lại bộc lộ điểm yếu lớn về kiến trúc: AI nhồi nhét trực tiếp mã animation vào bên trong component gây rối mắt, đồng thời hoàn toàn thiếu hụt logic luân chuyển dữ liệu thực tế (Data Flow) và các ràng buộc kiểm tra tính hợp lệ (Validation) cho form đặt sân.
Song song với đó, quá trình phát triển cục bộ bị gián đoạn nghiêm trọng bởi lỗi crash server Vite (EBUSY) liên tục xảy ra khi hệ thống hot-reload.

Để vượt qua những trở ngại kỹ thuật này, chúng tôi đã tiến hành tái cấu trúc (refactoring) mạnh mẽ mã nguồn do AI sinh ra. Chúng tôi đã bóc tách logic GSAP ra thành các custom hooks (useScrollReveal, useNavbarEntrance) để giữ cho UI Component sạch sẽ. Về mặt dữ liệu, chúng tôi tự tay tích hợp thư viện Axios để gọi API từ Backend và bổ sung các hàm chặn lỗi (ví dụ: không cho phép chọn ngày quá khứ). Cuối cùng, chúng tôi đã can thiệp sâu vào cấu hình vite.config.js để bỏ qua thư mục .vs, giải quyết dứt điểm lỗi hạ tầng môi trường.

Bài học lớn nhất gặt hái được trong tuần này là AI đóng vai trò như một "nhà thầu phụ" xuất sắc trong việc xây dựng các khối UI, nhưng tư duy tổ chức vòng đời Component, quản lý State và khắc phục sự cố môi trường của một kỹ sư phần mềm vẫn là yếu tố quyết định để dự án thực sự hoạt động được trong thế giới thực.
