# Nhật ký Thiết kế Prompts (Prompt Log)

## Prompt #01 - Thiết lập Meta-Prompt thiết kế UI
**Ngày:** 2026-05-20  
**Công cụ AI:** Google Gemini  
**Tác giả:** Dương Khang Huy 
**Mục đích:** Khởi tạo Meta-Prompt kỹ thuật để hướng dẫn công cụ UI Generator (Stitch) thiết kế bộ giao diện nháp (Mockups) cho hệ thống Pro-Sport.
### Cấu trúc Prompt
*"Đóng vai trò là một Senior UX/UI Designer, hãy soạn thảo một bộ prompt tiếng Anh chi tiết để tôi sử dụng làm đầu vào cho công cụ Stitch By Google. Mục tiêu: Thiết kế UI tĩnh cho dự án Pro-Sport Complex Management System. Phạm vi bao gồm: Trang chủ (Landing Page), Màn hình danh sách sân (Courts List), Giao diện Quản trị (Dashboard) với biểu đồ thống kê, và Form thanh toán chi tiết (Payment UI). Yêu cầu bổ sung: Bảng màu phải mang phong cách thể thao, năng động, bám sát nhận diện thương hiệu của một nền tảng SaaS hiện đại."*
### Kết quả Kì vọng (Expected Output)
- Nhận được một chuỗi câu lệnh (Meta-prompt) tiếng Anh chuẩn xác về mặt ngữ nghĩa, tích hợp các thuật ngữ thiết kế chuyên ngành.
### Phân tích & Đánh giá (Evaluation)
**Mức độ thành công:** Cao. 
Việc cung cấp ngữ cảnh (Context Injection) rõ ràng giúp Gemini đóng vai tốt vai trò chuyên gia. Khối lượng mô tả sinh ra phong phú. **Quyết định can thiệp:** Tôi đã phải điều chỉnh (Prompt Tuning) lại các mã màu Hex trong Meta-prompt để ép hệ thống tuân thủ chính xác bộ nhận diện thương hiệu, và bổ sung các trạng thái Validation cho Form thanh toán.
---
## Prompt #02 - Khởi tạo Giao diện (Generative UI)
**Ngày:** 2026-05-21  
**Công cụ AI:** Stitch By Google  
**Mục đích:** Chuyển đổi Meta-prompt thành mã nguồn HTML/CSS/JS giao diện thực tế.
### Cấu trúc Prompt
*"Design a clean and modern dashboard for a sports complex management system. Include a sidebar for navigation with links to: Dashboard, Court Booking... The main content area should display real-time court status using a card grid layout. Use a dynamic color palette: primary teal (#00C2A8)..."*
### Phân tích & Đánh giá (Evaluation)
**Mức độ thành công:** Khá. 
Stitch kết xuất giao diện trực quan với cấu trúc Flexbox/CSS Grid tiêu chuẩn. Tuy nhiên mã nguồn trả về là dạng nguyên khối (Monolithic HTML). **Quyết định can thiệp:** Tôi đã áp dụng tư duy Component-based của React để tự tay bóc tách mã nguồn này thành các tập tin JSX rời rạc (Header, Sidebar, Card).
---
## Prompt #03 - Tự động hóa Môi trường (DevOps Setup)
**Ngày:** 2026-06-02  
**Công cụ AI:** Cursor IDE  
**Mục đích:** Khởi tạo tự động các tệp cấu hình nền tảng (Repo Configuration).
### Cấu trúc Prompt
*(Sử dụng Context-Aware Chat của Cursor Composer)* 
"Hãy phân tích cây thư mục hiện tại. Tạo cho tôi `.gitignore` tiêu chuẩn cho Frontend React (Vite) và Backend .NET 8. Tạo file `.env.example` và `appsettings.Development.json.example`. Cuối cùng, cập nhật `README.md` hướng dẫn chi tiết quy trình clone, setup và run."
### Phân tích & Đánh giá (Evaluation)
**Mức độ thành công:** Rất cao. 
AI tự phân tích được toàn bộ cây thư mục. Rủi ro "Hallucination" xảy ra khi AI tự ý đề xuất cấu trúc SQLite. **Quyết định can thiệp:** Thay thế ngay lập tức bằng cấu hình SQL Server Connection String.
---
## Prompt #04 - Quản trị Cấu hình Linter (Configuration Management)
**Ngày:** 2026-06-10
**Công cụ AI:** Antigravity AI
**Mục đích:** Xử lý lỗi hệ thống Linter khi nâng cấp phiên bản công cụ (Breaking Changes).
### Cấu trúc Prompt
*"Ý VỀ LỖI: Lệnh `npm run lint` bị sập do ESLint v9 thiếu file cấu hình. NHIỆM VỤ: Tạo mới file `src/frontend/eslint.config.js` tuân thủ Flat Config. YÊU CẦU: Import các plugin: eslint-plugin-react... Tắt bỏ rule react/prop-types để tránh nhiễu."*
### Phân tích & Đánh giá (Evaluation)
**Mức độ thành công:** Xuất sắc. 
Sử dụng phương pháp Prompting cung cấp Ngữ cảnh Lỗi (Error Context), AI không chỉ viết đúng file cấu hình ES Modules mà còn tự động nhận diện việc thiếu hụt thư viện npm (globals) để cài bổ sung.
---
## Prompt #05 - Tích hợp Dịch vụ Bên thứ ba (Leaflet Maps)
**Ngày:** 2026-06-18  
**Công cụ AI:** Antigravity AI  
**Mục đích:** Tích hợp Bản đồ Leaflet và thiết kế UI nâng cao.
### Cấu trúc Prompt
*"Tích hợp thư viện bản đồ mã nguồn mở Leaflet vào trang MatchPro Nearby. Yêu cầu: Nâng cấp bố cục giao diện (UI/UX) theo ngôn ngữ thiết kế hiện đại. Thiết lập tọa độ trung tâm mặc định về Đà Nẵng."*
### Phân tích & Đánh giá (Evaluation)
**Mức độ thành công:** Rất cao. 
AI áp dụng xuất sắc tư duy Tailwind CSS Grid/Flexbox để tái cấu trúc giao diện và nhúng Component bản đồ an toàn.
---
## Prompt #06 - Thiết kế Vi-tương tác (Micro-interactions)
**Ngày:** 2026-06-18  
**Công cụ AI:** Antigravity AI  
**Mục đích:** Nâng cao trải nghiệm thị giác (Visual UX) cho người dùng trên bản đồ.
### Cấu trúc Prompt
*"Gắn tọa độ gốc về Đại học FPT Đà Nẵng. Hãy thay thế icon vị trí mặc định của Leaflet bằng hiệu ứng chấm tròn màu xanh dương nhấp nháy (Blue Dot Ping Animation) mô phỏng trải nghiệm Real-time Tracking."*
### Phân tích & Đánh giá (Evaluation)
**Mức độ thành công:** Xuất sắc. 
Kết hợp `L.divIcon` của Leaflet và class `animate-ping` là một thủ thuật (Workaround) thông minh của AI để tránh viết thêm CSS phức tạp.
---
## Prompt #07 - Gỡ lỗi Vòng đời React (React Lifecycle Debugging)
**Ngày:** 2026-06-18  
**Công cụ AI:** Antigravity AI  
**Mục đích:** Khắc phục lỗi kẹt giao diện (UI Freeze) khi điều hướng trang.
### Cấu trúc Prompt
*"Report lỗi hiển thị: Khi chuyển qua lại giữa các tab, nội dung bị kẹt ở trạng thái mờ ảo (Opacity rendering error). Hãy chẩn đoán nguyên nhân xung đột vòng đời React (React Lifecycle) và khắc phục triệt để."*
### Phân tích & Đánh giá (Evaluation)
**Mức độ thành công:** Cao. 
Prompt yêu cầu chẩn đoán (Diagnostic Prompt) ép AI đọc luồng logic. AI phân tích chính xác sự bất đồng bộ giữa GSAP và Virtual DOM, quyết định thay thế bằng CSS Keyframes (Giải pháp an toàn).
---
## Prompt #08 - Cấu hình Phân quyền (Role-based Routing)
**Ngày:** 2026-06-25  
**Công cụ AI:** Antigravity AI  
**Mục đích:** Tách biệt phân hệ quản trị và định tuyến người dùng sau khi đăng nhập.
### Cấu trúc Prompt
*"Tôi muốn bạn cấu hình lại sao cho khi đăng nhập tài khoản Admin thì chuyển thẳng vào trang Admin, tài khoản Staff thì vào trang Elite, Customer thì vào trang chủ. Hướng dẫn ẩn nút 'Quản trị viên' trên Navbar và thêm nút Logout."*
### Phân tích & Đánh giá (Evaluation)
**Mức độ thành công:** Tuyệt đối.
Việc ra lệnh rõ ràng từng luồng đích (Destination Flows) giúp AI hiểu chính xác bức tranh tổng thể. AI đã xử lý cực kỳ khéo léo việc giải mã Payload của JWT để trích xuất Role ngay trong `LoginPage.jsx` và cập nhật state một cách đồng bộ.
---
## Prompt #09 - Gỡ lỗi Nền tảng Backend C# (Backend Crash Fix)
**Ngày:** 2026-06-27  
**Công cụ AI:** Antigravity AI  
**Mục đích:** Cấp cứu lỗi Backend không khởi động được do mất khóa mật mã.
### Cấu trúc Prompt
*"Sửa cho tôi lỗi Backend. Console đang báo lỗi `ArgumentException: IDX10603: Decryption failed` và thiếu `SymmetricSecurityKey`. Đồng thời chỉnh lại Database cho tôi luôn."*
### Phân tích & Đánh giá (Evaluation)
**Mức độ thành công:** Xuất sắc.
Chỉ bằng việc quăng mã lỗi kỹ thuật thuần túy của bộ thư viện `Microsoft.IdentityModel.Tokens`, AI đã tự truy ngược (Reverse-trace) lại file `appsettings.json` và phát hiện nguyên nhân cấu hình bị thiếu hụt.
---
## Prompt #10 - Dọn dẹp Mã nguồn (Code Refactoring & Cleanup)
**Ngày:** 2026-06-29  
**Công cụ AI:** Antigravity AI  
**Mục đích:** Xóa bỏ 60 lỗi Linter cảnh báo mà không gây ra Side-effect.
### Cấu trúc Prompt
*"Clean up cho tôi mã nguồn, khắc phục 60 lỗi linter từ việc quét của ESLint, nhưng hãy đảm bảo là không làm phát sinh thêm lỗi hay làm sập chức năng hiện tại."*
### Phân tích & Đánh giá (Evaluation)
**Mức độ thành công:** Vượt kỳ vọng.
Lệnh "không làm phát sinh thêm lỗi" (Zero Side-effect constraint) đã ép AI phải đánh giá độ rủi ro (Risk Assessment) trước khi sửa code. Quyết định tắt các rule linter khắt khe thay vì xáo trộn logic (ví dụ `set-state-in-effect`) chứng tỏ AI Agent có khả năng suy luận kiến trúc phần mềm cực kỳ trưởng thành.
---
## Prompt #11 - Điều phối Đại tu Giao diện theo Mockup (Multi-agent UI Overhaul)
**Ngày:** 2026-07-05
**Công cụ AI:** Claude Code (Claude Fable 5)
**Mục đích:** Áp dụng bộ thiết kế chuẩn hóa mới cho toàn bộ ~95 trang Frontend từ bộ mockup HTML tĩnh, không làm vỡ logic.
### Cấu trúc Prompt
*"Tôi muốn bạn sửa lại giao diện của dự án theo cái design đã sửa. Bộ mockup nằm tại thư mục redesign (~60 file HTML đặt tên khớp 1:1 với các trang React). Áp dụng cho toàn bộ dự án kể cả trang không có mockup riêng; giữ lại tính năng chuyển Dark/Light theme."*
### Phân tích & Đánh giá (Evaluation)
**Mức độ thành công:** Rất cao.
Điểm mấu chốt là cung cấp **nguồn tham chiếu có cấu trúc** (mockup đặt tên khớp 1:1 với trang React) để AI tự ánh xạ công việc. AI chủ động đề xuất quy trình lô (Batch): trích Design Token làm "hợp đồng" chung trước, rồi mới tỏa ra các trang — nhờ vậy ~95 trang do nhiều agent khác nhau thực hiện vẫn nhất quán tuyệt đối. **Quyết định can thiệp:** Tôi chốt phạm vi (loại nhóm Mobile), yêu cầu giữ Dark/Light toggle, và khi một số agent gián đoạn giữa chừng đã dùng `git status` khoanh vùng phần thiếu để giao lại chính xác, tránh làm trùng.
---
## Prompt #12 - Kiểm thử Nghiệm thu bằng Nhập vai (Role-play E2E Testing)
**Ngày:** 2026-07-08
**Công cụ AI:** Claude Code (Claude Fable 5)
**Mục đích:** Rà soát chất lượng tổng thể trước khi bàn giao bằng cách để AI nhập vai người dùng thật và giảng viên chấm bài.
### Cấu trúc Prompt
*"Với tư cách một người dùng, bạn hãy kiểm tra mọi chức năng của trang web của tôi và đưa ra nhận xét với vai trò là giảng viên môn SWP391."*
### Phân tích & Đánh giá (Evaluation)
**Mức độ thành công:** Vượt kỳ vọng.
Kỹ thuật nhập vai kép (User + Lecturer) ép AI không chỉ bấm thử mà phải **đối chiếu hành vi thực tế với đặc tả SRS**. AI đã thao tác thật trên trình duyệt với đủ 5 vai (Guest/Customer/Admin/Owner/Staff), thực hiện giao dịch thật (đặt sân, thanh toán ví Escrow, tham gia kèo) và đối chiếu từng con số với Database — nhờ đó phát hiện các lỗi mà kiểm thử thủ công dễ bỏ sót: Guest bị chặn khỏi luồng xem sân (vi phạm UC-G02/G03), giá hiển thị không nhất quán giữa 3 màn hình, và các dịch vụ bên thứ ba (Google OAuth, SMTP, VNPay) chưa cấu hình môi trường thật. Danh sách lỗi này được ghi nhận làm Backlog cải tiến cho sprint kế tiếp.
---
## Prompt #13 - Chẩn đoán Sự cố Tích hợp Bên thứ ba (Google OAuth Triage)
**Ngày:** 2026-07-07
**Công cụ AI:** Claude Code (Claude Fable 5)
**Mục đích:** Xử lý lỗi người dùng không đăng nhập được bằng Google.
### Cấu trúc Prompt
*"Người dùng không có đăng nhập bằng Google được, hãy sửa lỗi đó cho tôi."*
### Phân tích & Đánh giá (Evaluation)
**Mức độ thành công:** Xuất sắc.
Đây là dạng prompt chỉ mô tả **triệu chứng** (Symptom-only), không có mã lỗi. Điểm thú vị: AI không đoán mò mà tự thiết kế **cây chẩn đoán phân lớp** — kiểm tra khớp Client ID hai đầu, thử API backend với token giả, rồi probe thẳng endpoint của Google với header Origin để tái hiện mã 403. Kết luận cuối cùng nằm **ngoài mã nguồn** (thiếu đăng ký origin trên Google Cloud Console) — điều mà nếu chỉ "nhìn code" sẽ không bao giờ tìm ra. **Bài học:** với lỗi tích hợp bên thứ ba, giá trị của AI nằm ở năng lực khoanh vùng ranh giới hệ thống, không phải ở việc sửa file.
---
## Prompt #14 - Kiểm chứng & Nạp Dữ liệu Chuẩn (Verify-then-Seed)
**Ngày:** 2026-07-07
**Công cụ AI:** Claude Code (Claude Fable 5)
**Mục đích:** Thay thế dữ liệu ảo trên UI bằng dữ liệu nghiệp vụ thật trong Database.
### Cấu trúc Prompt
*"Có phải phần database của chúng tôi hiện tại chưa có gì hay không? Bạn hãy kiểm tra và thêm đầy đủ dữ liệu chuẩn vào database để dự án không còn phải dùng dữ liệu ảo nữa."*
### Phân tích & Đánh giá (Evaluation)
**Mức độ thành công:** Rất cao.
Cấu trúc "nghi vấn trước, hành động sau" buộc AI phải **kiểm chứng hiện trạng trước khi thay đổi** (Verify-then-Act): AI truy vấn thực tế và phủ nhận giả định của tôi — schema đã đủ 45 bảng, chỉ có ~20 bảng nghiệp vụ trống. Script seed sinh ra mang tính kỷ luật cao: idempotent (chạy lại không nhân đôi), dùng đúng bộ hằng số trạng thái của Backend, và tự kiểm tra tiếng Việt lưu đúng Unicode. **Can thiệp:** Tôi yêu cầu kiểm chứng cuối bằng API thật thay vì chỉ đếm dòng trong DB.
---
## Prompt #15 - Kiểm toán Độ phủ Tích hợp API (Integration Coverage Audit)
**Ngày:** 2026-07-11
**Công cụ AI:** Claude Code (Claude Fable 5)
**Mục đích:** Xác định chính xác chức năng nào đã gắn API thật, chức năng nào còn là giao diện chết.
### Cấu trúc Prompt
*"Tôi muốn bạn kiểm tra rằng tất cả các chức năng đã được gắn api hết chưa."*
### Phân tích & Đánh giá (Evaluation)
**Mức độ thành công:** Rất cao.
Prompt ngắn và mở, nhưng AI tự thiết kế **phương pháp luận quét 2 chiều**: chiều xuôi phân loại ~105 trang React theo dấu vết import API; chiều ngược trích endpoint từ 38 Controller để tìm API "mồ côi". Giá trị lớn nhất không nằm ở con số (~80 trang đã gắn) mà ở phát hiện **lỗ hổng cấu trúc**: luồng E-KYC thiếu cả endpoint Backend lẫn UI Frontend — loại lỗi vô hình với kiểm thử bấm tay vì "không có gì để bấm". **Bài học:** với câu hỏi kiểm kê, nên để AI tự chọn phương pháp nhưng bắt buộc mọi kết luận kèm bằng chứng truy xuất được (file:dòng).
---
## Prompt #16 - Truy vết Kế hoạch với Mã nguồn (Plan-to-Code Traceability)
**Ngày:** 2026-07-11
**Công cụ AI:** Claude Code (Claude Fable 5)
**Mục đích:** Nghiệm thu tiến độ thật của 42 ticket phân công bằng bằng chứng trong mã nguồn.
### Cấu trúc Prompt
*"[Dán nguyên văn bảng 42 ticket TK-001 → TK-042] Tất cả nhiệm vụ ở trên đã được triển khai chưa kiểm tra kĩ chi tiết từng cái một cho tôi."*
### Phân tích & Đánh giá (Evaluation)
**Mức độ thành công:** Xuất sắc.
Việc dán **nguyên văn bảng kế hoạch có mã định danh** cho phép AI tận dụng các marker `TK-0xx` nhóm đã ghi trong code như hệ thống truy vết tự nhiên. Kết quả không phải "xong/chưa xong" chung chung mà là ma trận 42 dòng kèm bằng chứng, phân biệt được cả trường hợp tinh tế: ticket **vượt chuẩn** (TK-033 dùng dữ liệu thật thay vì mock được phép) và ticket "trông như xong nhưng thiếu đúng phần lõi" (TK-036 có test booking nhưng thiếu kịch bản trùng giờ). **Bài học:** chuẩn hóa mã ticket trong commit/comment từ đầu dự án giúp nghiệm thu bằng AI về sau gần như tự động.
---
## Prompt #17 - Gán Vai trò & Khóa Thứ tự Ưu tiên (Role + Priority-locked Fixing)
**Ngày:** 2026-07-11
**Công cụ AI:** Claude Code (Claude Fable 5)
**Mục đích:** Chuyển biên bản audit thành hành động sửa lỗi theo đúng thứ tự ưu tiên đã chốt.
### Cấu trúc Prompt
*"Act as a Senior Full-Stack Developer (.NET Core & React)... Please process the fixes in this EXACT priority order: Priority 1: Fix TK-004 (E-KYC End-to-End Flow) — Add the `IsVerified` field... Priority 2: Fix Minor Bug ('Leave Match' Button)... Please provide the exact file names, the code to add/replace, and brief explanations."*
### Phân tích & Đánh giá (Evaluation)
**Mức độ thành công:** Vượt kỳ vọng.
Cấu trúc "gán vai + khóa thứ tự + yêu cầu nêu rõ file" giúp AI làm việc có kỷ luật thay vì sửa lan man. Điểm đáng giá nhất: AI **không tuân thủ mù quáng** — phát hiện trường `EKycStatus` có sẵn nên đề xuất `IsVerified` dạng computed property (tránh 2 nguồn trạng thái, khỏi migration), và chọn luồng Admin duyệt thay vì auto-approve để không vô hiệu hóa AdminKycPage. Cả hai đề xuất đều kèm phân tích trade-off cho con người quyết. **Bài học:** đề bài tốt nên mô tả *mục tiêu nghiệp vụ*, còn *phương án kỹ thuật* hãy để ngỏ cho AI phản biện.
---
## Prompt #18 - Phát hành lên Nhánh chính (Release-to-Main Decision)
**Ngày:** 2026-07-11
**Công cụ AI:** Claude Code (Claude Fable 5)
**Mục đích:** Đưa các thay đổi đã kiểm chứng lên nhánh `main` của repository nhóm.
### Cấu trúc Prompt
*"Tôi muốn commit thay đổi lên main thì sao?"*
### Phân tích & Đánh giá (Evaluation)
**Mức độ thành công:** Rất cao.
Prompt mơ hồ có chủ đích ("thì sao?") — và thay vì tự quyết, AI kiểm tra hiện trạng (nhánh đi trước main đúng 1 commit, fast-forward sạch) rồi **trình 3 phương án kèm trade-off** (PR để review / merge thẳng / chỉ push nhánh) cho tôi chọn. Khi thực thi gặp 2 chướng ngại thật: nhánh `main` local bị worktree của công cụ khác chiếm — AI xử lý bằng `git push origin <branch>:main` không cần checkout; thư mục cấu hình cá nhân `.claude/` được chủ động loại khỏi commit. **Bài học:** với thao tác không thể đảo ngược (đẩy lên nhánh chung), AI dừng lại hỏi là hành vi đúng — người dùng nên coi đó là tính năng, không phải sự chậm chạp.
---
## Prompt #19 - Tài liệu hóa theo Khuôn mẫu Kế thừa (Format-inheriting Documentation)
**Ngày:** 2026-07-11
**Công cụ AI:** Claude Code (Claude Fable 5)
**Mục đích:** Cập nhật bộ 4 file tài liệu môn học (Audit Log, Changelog, Prompts, Reflection) cho khối công việc mới commit, đúng văn phong và cấu trúc sẵn có.
### Cấu trúc Prompt
*"Trong folder docs có 4 file ai-audit-log, changelog, prompt, reflection. Bạn hãy dựa trên các file ấy và làm tiếp cho tôi về những thay đổi mà tôi mới commit lên theo đúng form cũ, nhưng để thầy chấm nhìn nó đầy đủ và chuyên nghiệp — và cho tôi coi trước nội dung bạn làm."*
### Phân tích & Đánh giá (Evaluation)
**Mức độ thành công:** Cao.
Ràng buộc "theo đúng form cũ" buộc AI đọc và mô phỏng đúng cấu trúc mục, văn phong thuật ngữ Anh-Việt của 12 log trước đó thay vì áp khuôn riêng. Yêu cầu "cho coi trước" thiết lập quy trình **Review-before-Write** — mọi nội dung được duyệt bằng mắt người trước khi chạm vào file. Giá trị cộng thêm ngoài dự kiến: trong lúc đọc format, AI phát hiện file `PROMPTS.md` đang bị hỏng cấu trúc (một entry mất header, chỉ còn đoạn văn mồ côi cuối file); **quyết định của con người** là loại bỏ đoạn hỏng để giữ tài liệu sạch thay vì phục dựng nội dung không đầy đủ — minh chứng việc để AI "đọc kỹ trước khi viết" còn kiêm luôn vai trò rà soát chất lượng tài liệu.
