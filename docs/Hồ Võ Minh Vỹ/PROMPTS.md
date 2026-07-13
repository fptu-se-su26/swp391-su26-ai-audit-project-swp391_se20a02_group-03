## Prompt #01
- Date: 2026-05-12
- AI Tool: Cursor
- Author: VyHVM
- Purpose: Tạo cấu trúc thư mục và kiến trúc dự án theo tiêu chuẩn của .NET và React.

### Prompt
"Tôi đang khởi tạo dự án Pro-Sport Complex. Backend sử dụng .NET 8 và Frontend sử dụng ReactJS (Vite). Hãy tạo cho tôi cấu trúc cây thư mục chuẩn cho dự án này. Yêu cầu bao gồm các thư mục chính: src/backend, src/frontend, database và docs. Ngoài ra, hãy tạo thêm một file trống tên là AGENT.md ở thư mục gốc để tôi đặt luật hành động cho AI sau này."

### Expected Output
- Sơ đồ cây thư mục (Folder tree structure) chuẩn cho cả 2 nền tảng.
- Các lệnh terminal (CLI) để khởi tạo nhanh các thư mục và file cấu hình cơ bản.

### Evaluation
Prompt khá rõ ràng về mặt công nghệ và mục tiêu. AI (Cursor) đã đề xuất đúng cấu trúc thư mục chuẩn của .NET và React. Quyết định tự chủ động yêu cầu tạo thêm file AGENT.md từ sớm là rất đúng đắn để định hình quy tắc code cho các phiên làm việc sau. Mã nguồn khởi tạo chạy mượt, không có lỗi.

## Prompt #02
- Date: 2026-05-24
- AI Tool: Google Anti-gravity
- Author: VyHVM
- Purpose: Fix các lỗi về UX/UI và hoàn thiện các trang Frontend còn thiếu.

### Prompt
"Hãy đọc kỹ file @AGENT.md để nắm bắt các quy tắc thiết kế giao diện (UI rules) của team và đọc @SRS.md để hiểu rõ yêu cầu nghiệp vụ của các phân hệ. Dựa trên source code hiện tại trong thư mục src/frontend, hãy fix các lỗi vỡ layout, sai lệch màu sắc ở trang Đặt sân. Sau đó, viết tiếp code để hoàn thiện các trang còn thiếu theo đúng mô tả trong tài liệu SRS."

### Expected Output
- Code React components đã được sửa lỗi layout và CSS (Tailwind).
- Source code cho các trang giao diện mới, đảm bảo luồng UX khớp với mô tả nghiệp vụ.

### Evaluation
Việc cung cấp context bằng cách ép AI đọc @AGENT.md và @SRS.md mang lại hiệu quả cực cao. AI không tự biên tự diễn mà tuân thủ đúng tone màu và nghiệp vụ đã quy định. Tuy nhiên, do AI đôi khi chọn sai mã màu chi tiết, tôi (người dùng) vẫn phải can thiệp điều chỉnh (Human Decision) một chút để giao diện sắc nét và đúng ý đồ hơn. Code chạy ổn định.

## Prompt #03
- Date: 2026-05-25
- AI Tool: Google Gemini
- Author: VyHVM
- Purpose: Tạo kịch bản GitHub Actions để Deploy tự động Frontend lên GitHub Pages.

### Prompt
"Đọc file @AGENT.md để tuân thủ các quy tắc bảo mật môi trường và đọc @SRS.md để xác định phạm vi công nghệ Frontend (React Vite) của dự án. Hãy viết cho tôi một kịch bản GitHub Actions (file .yml) hoàn chỉnh. Kịch bản này phải tự động thực hiện các bước: cài đặt Node.js, cài thư viện, build dự án và deploy thư mục dist lên GitHub Pages mỗi khi có thay đổi được push lên nhánh main."

### Expected Output
- Một file mã nguồn .yml chuẩn cú pháp GitHub Actions.
- Các bước (steps) trong jobs phải bao gồm checkout code, setup-node, npm install, npm run build và deploy-pages.

### Evaluation
Prompt rất chặt chẽ và cung cấp đủ ngữ cảnh hạ tầng thông qua tài liệu đính kèm. AI sinh ra file kịch bản .yml cực kỳ chuẩn xác và chạy thành công không lỗi ở luồng GitHub Actions. Dù vậy, tôi đã phải dùng kiến thức cá nhân để cấu hình lại thuộc tính base trong file vite.config.js để web không bị lỗi đường dẫn khi chạy thực tế trên GitHub Pages. Sự kết hợp giữa AI sinh code và con người cấu hình môi trường là rất hoàn hảo

## Prompt #04
- Date: 2026-06-01
- AI Tool: Cursor
- Author: VyHVM
- Purpose: Tạo chức năng Login và Register.

### Prompt
"Tạo cho tôi form Login và Register bằng React cho dự án, kết nối với API backend qua fetch/axios. Form cần có các trường cơ bản như email, password."

### Expected Output
- Code UI form đăng nhập, đăng ký.
- Logic gọi API authentication.

### Evaluation
AI đã tạo UI khá ổn định. Tuy nhiên cần phải tự thêm logic xác thực form (validation) và cơ chế lưu trữ token (Human Decision).

## Prompt #05
- Date: 2026-06-10
- AI Tool: Google gemini
- Author: VyHVM
- Purpose: Cập nhật và làm đẹp giao diện Login/Register.

### Prompt
"Hãy thiết kế lại form Login và Register với Tailwind CSS, sử dụng màu sắc hiện đại và bố cục thân thiện hơn."

### Expected Output
- Code component đã được làm mới với Tailwind CSS.

### Evaluation
UI được cải thiện đáng kể, tuy nhiên vẫn phải tự tinh chỉnh lại bộ màu cho khớp với bảng màu chung của cả dự án.

## Prompt #06
- Date: 2026-06-11
- AI Tool: Cursor
- Author: VyHVM
- Purpose: Tạo Entity và cấu hình Database.

### Prompt
"Sử dụng Entity Framework Core, hãy tạo các class Entity cho dự án quản lý sân thể thao và sinh migration script."

### Expected Output
- Các class model backend và file context.

### Evaluation
AI tạo bảng tương đối đầy đủ nhưng thiếu một số quan hệ phức tạp. Quyết định tự động điều chỉnh bằng tay.

## Prompt #07
- Date: 2026-06-12
- AI Tool: Google gemini
- Author: VyHVM
- Purpose: Tạo luồng Booking.

### Prompt
"Viết logic API cho chức năng đặt sân, nhận đầu vào là ID sân, thời gian bắt đầu và kết thúc."

### Expected Output
- Controller và Service xử lý việc đặt sân.

### Evaluation
AI làm đúng luồng cơ bản nhưng chưa xử lý tốt trường hợp trùng lịch (conflict).

## Prompt #08
- Date: 2026-06-18
- AI Tool: Cursor
- Author: VyHVM
- Purpose: Fix lỗi Booking.

### Prompt
"Tôi bị lỗi trùng lịch khi 2 người đặt cùng lúc. Hãy gợi ý cách dùng transaction và khóa (lock) để xử lý."

### Expected Output
- Code update cho Service Booking sử dụng transaction.

### Evaluation
Gợi ý của Cursor rất hữu ích, tôi đã áp dụng thành công transaction để bảo đảm an toàn dữ liệu.

## Prompt #09
- Date: 2026-06-20
- AI Tool: Google gemini
- Author: VyHVM
- Purpose: API thiết bị kho.

### Prompt
"Viết các API CRUD cho thực thể Thiết bị kho (Equipment)."

### Expected Output
- Controller và Service cho Equipment.

### Evaluation
AI sinh CRUD rất nhanh. Tôi đã tự thêm một số trường trạng thái của thiết bị để nghiệp vụ đầy đủ hơn.

## Prompt #10
- Date: 2026-06-27
- AI Tool: Cursor
- Author: VyHVM
- Purpose: Refactor frontend.

### Prompt
"Hãy xem xét và refactor lại các component UI trong thư mục này, gộp các phần trùng lặp."

### Expected Output
- Mã nguồn Frontend gọn gàng hơn.

### Evaluation
AI gộp component tốt, nhưng cần review kỹ để tránh phá vỡ layout giao diện.

## Prompt #11
- Date: 2026-07-14
- AI Tool: Claude Code (Claude Opus)
- Author: VyHVM
- Purpose: Loại bỏ hoàn toàn chức năng cho thuê đồ, giữ lại cáp kèo ký quỹ, đặt sân và bán dụng cụ.

### Prompt
"Dựa theo cấu trúc dự án, hãy hiểu hệ thống rồi loại bỏ hoàn toàn chức năng cho thuê đồ vì quá rắc rối; chỉ giữ lại các chức năng như cáp kèo ký quỹ, trung gian đặt sân, bán dụng cụ..."

### Expected Output
- Xóa toàn bộ code rental ở backend và frontend mà không phá vỡ các chức năng còn lại (đặc biệt là bán dụng cụ vốn dùng chung entity Equipment).
- Cập nhật database/migration tương ứng; build và test phải xanh.

### Evaluation
AI khảo sát rất kỹ trước khi sửa: phát hiện có 2 hệ rental tách biệt và entity Equipment dùng chung cho cả bán lẫn thuê nên chỉ bóc đúng phần thuê. Tôi (Human Decision) chọn regenerate migration cho sạch và chỉ sửa code. Kết quả build backend/frontend thành công, 104 unit test pass.

## Prompt #12
- Date: 2026-07-14
- AI Tool: Claude Code (Claude Opus)
- Author: VyHVM
- Purpose: Rà soát backend theo từng actor để tìm chỗ chưa hợp lý.

### Prompt
"Check 1 lượt phần backend của từng actor xem chỗ nào chưa hợp lý."

### Expected Output
- Bản đồ phân quyền của toàn bộ endpoint; chỉ ra lỗ hổng IDOR/logic/nhất quán theo từng actor (Guest, Customer, Staff, CourtOwner, Admin, Payment Gateway).

### Evaluation
AI dựng bản đồ authorization và xác minh từng service. Điểm mạnh của hệ thống (ownership/host check, tenant isolation của Owner, chữ ký VNPay IPN) đều đúng. Phát hiện quan trọng: E-KYC chưa được bắt buộc và trạng thái E-KYC bị lệch. Tôi đồng ý cho AI sửa (chuẩn hóa trạng thái + thêm gate E-KYC cho đặt sân/join kèo), giữ nguyên hành vi walk-in. Build Release + 106 test pass.

## Prompt #13
- Date: 2026-07-14
- AI Tool: Claude Code (Claude Opus)
- Author: VyHVM
- Purpose: Tiếp tục check backend từng actor và fix lỗi để hoàn thiện phần backend.

### Prompt
"Tiếp tục check backend các actor và fix lỗi cho hoàn thành luôn phần backend của dự án."

### Expected Output
- Rà soát sâu các endpoint chưa kiểm kỹ (upload, split-payment, recurring, rating, payment, owner GET) và fix các bug thật còn lại.

### Evaluation
AI soát thêm và xác nhận phần lớn backend đã chắc (ownership, tenant isolation ở tầng service, payment integrity, upload validation). Phát hiện 1 bug thật: RatingService cho phép đánh giá người không cùng trận đấu — đã fix + thêm 2 test. Các điểm còn lại (quyền voucher của Staff, endpoint leaderboard công khai) được xác định là quyết định thiết kế nên giữ nguyên để tránh phá vỡ Frontend.
