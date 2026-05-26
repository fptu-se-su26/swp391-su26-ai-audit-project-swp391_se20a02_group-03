##Prompt #01
- Date: 2026-05-12
- AI Tool: Cursor
- Author: VyHVM
- Purpose: Tạo cấu trúc thư mục và kiến trúc dự án theo tiêu chuẩn của .NET và React.

###Prompt
"Tôi đang khởi tạo dự án Pro-Sport Complex. Backend sử dụng .NET 8 và Frontend sử dụng ReactJS (Vite). Hãy tạo cho tôi cấu trúc cây thư mục chuẩn cho dự án này. Yêu cầu bao gồm các thư mục chính: src/backend, src/frontend, database và docs. Ngoài ra, hãy tạo thêm một file trống tên là AGENT.md ở thư mục gốc để tôi đặt luật hành động cho AI sau này."

###Expected Output
- Sơ đồ cây thư mục (Folder tree structure) chuẩn cho cả 2 nền tảng.
- Các lệnh terminal (CLI) để khởi tạo nhanh các thư mục và file cấu hình cơ bản.

###Evaluation
Prompt khá rõ ràng về mặt công nghệ và mục tiêu. AI (Cursor) đã đề xuất đúng cấu trúc thư mục chuẩn của .NET và React. Quyết định tự chủ động yêu cầu tạo thêm file AGENT.md từ sớm là rất đúng đắn để định hình quy tắc code cho các phiên làm việc sau. Mã nguồn khởi tạo chạy mượt, không có lỗi.

##Prompt #02
- Date: 2026-05-24
- AI Tool: Google Anti-gravity
- Author: VyHVM
- Purpose: Fix các lỗi về UX/UI và hoàn thiện các trang Frontend còn thiếu.

###Prompt
"Hãy đọc kỹ file @AGENT.md để nắm bắt các quy tắc thiết kế giao diện (UI rules) của team và đọc @SRS.md để hiểu rõ yêu cầu nghiệp vụ của các phân hệ. Dựa trên source code hiện tại trong thư mục src/frontend, hãy fix các lỗi vỡ layout, sai lệch màu sắc ở trang Đặt sân. Sau đó, viết tiếp code để hoàn thiện các trang còn thiếu theo đúng mô tả trong tài liệu SRS."

###Expected Output
- Code React components đã được sửa lỗi layout và CSS (Tailwind).
- Source code cho các trang giao diện mới, đảm bảo luồng UX khớp với mô tả nghiệp vụ.

###Evaluation
Việc cung cấp context bằng cách ép AI đọc @AGENT.md và @SRS.md mang lại hiệu quả cực cao. AI không tự biên tự diễn mà tuân thủ đúng tone màu và nghiệp vụ đã quy định. Tuy nhiên, do AI đôi khi chọn sai mã màu chi tiết, tôi (người dùng) vẫn phải can thiệp điều chỉnh (Human Decision) một chút để giao diện sắc nét và đúng ý đồ hơn. Code chạy ổn định.

##Prompt #03
- Date: 2026-05-25
- AI Tool: Google Gemini
- Author: VyHVM
- Purpose: Tạo kịch bản GitHub Actions để Deploy tự động Frontend lên GitHub Pages.

###Prompt
"Đọc file @AGENT.md để tuân thủ các quy tắc bảo mật môi trường và đọc @SRS.md để xác định phạm vi công nghệ Frontend (React Vite) của dự án. Hãy viết cho tôi một kịch bản GitHub Actions (file .yml) hoàn chỉnh. Kịch bản này phải tự động thực hiện các bước: cài đặt Node.js, cài thư viện, build dự án và deploy thư mục dist lên GitHub Pages mỗi khi có thay đổi được push lên nhánh main."

###Expected Output
- Một file mã nguồn .yml chuẩn cú pháp GitHub Actions.
- Các bước (steps) trong jobs phải bao gồm checkout code, setup-node, npm install, npm run build và deploy-pages.

###Evaluation
Prompt rất chặt chẽ và cung cấp đủ ngữ cảnh hạ tầng thông qua tài liệu đính kèm. AI sinh ra file kịch bản .yml cực kỳ chuẩn xác và chạy thành công không lỗi ở luồng GitHub Actions. Dù vậy, tôi đã phải dùng kiến thức cá nhân để cấu hình lại thuộc tính base trong file vite.config.js để web không bị lỗi đường dẫn khi chạy thực tế trên GitHub Pages. Sự kết hợp giữa AI sinh code và con người cấu hình môi trường là rất hoàn hảo
