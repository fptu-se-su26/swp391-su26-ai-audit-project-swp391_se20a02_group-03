# Reflection

---
## Tuần 1: Khởi tạo Kiến trúc & Định hình Thiết kế (Generative Prototyping)
### Tổng quan Quá trình
Trong giai đoạn đầu, thách thức lớn nhất là biến các đặc tả yêu cầu (SRS) khô khan thành thiết kế trực quan. Bằng việc kết hợp ChatGPT và công cụ Stitch by Google, chúng tôi đã đẩy nhanh quá trình tạo mẫu (Prototyping) tĩnh lên gấp nhiều lần. Kỹ thuật Meta-prompting đã phát huy tối đa hiệu quả trong việc tạo ra mã nguồn HTML/CSS nền tảng.
### Hạn chế của AI & Bài học rút ra
- **Kiến trúc Nguyên khối (Monolithic Code):** Giao diện sinh ra nằm trong một file HTML duy nhất, vi phạm nghiêm trọng nguyên tắc "Tách biệt mối quan tâm" (Separation of Concerns).
- **Bài học rút ra:** AI là một công cụ mạnh mẽ trong việc vượt qua "Hội chứng trang giấy trắng" (Blank Page Syndrome), nhưng Lập trình viên phải đóng vai trò Kiến trúc sư (Architect) để bóc tách mã nguồn nguyên khối thành các Component độc lập (Header, Sidebar) sẵn sàng cho React.
---
## Tuần 2: Nâng cấp Trải nghiệm Người dùng (Premium UI/UX) & Tích hợp Logic
### Hạn chế Kỹ thuật Tinh vi của AI
Mặc dù tốc độ sinh code rất nhanh, AI lại để lại một "khoản nợ kỹ thuật" (Technical Debt) khổng lồ:
1. **Quản lý Trạng thái kém:** Nhúng trực tiếp logic hoạt ảnh vào UI Component.
2. **Lỗi Định tuyến (Routing Errors):** Tự ý comment các Route quan trọng trong `App.jsx`, dẫn đến lỗi 404 diện rộng.
3. **Lỗi Tương thích (Cross-browser):** Sử dụng các CSS Selector quá mới (`:has()`) chưa được hỗ trợ trên Firefox.
4. **Sai lệch Entry Point:** File `index.html` trỏ sai đường dẫn bundle, làm sập tiến trình Build.
### Bài học Lập trình
- **"AI giỏi sinh khối lượng, Con người đảm bảo chất lượng"**. Việc lạm dụng AI tạo mã nguồn hàng loạt mà thiếu quy trình Review Code sẽ dẫn đến sụp đổ hệ thống khi đưa lên Production. Kỹ năng gỡ lỗi (Debugging) và kiểm soát luồng dữ liệu của kỹ sư phần mềm là vô giá.
---
## Tuần 3: Quản trị Cấu hình (DevOps & Environment Setup)
### Khó khăn & Giải pháp
- **Rủi ro ảo giác (Hallucination):** AI có xu hướng mặc định chọn SQLite làm cơ sở dữ liệu thay vì SQL Server.
- **Giải pháp:** Áp dụng nguyên tắc "Bất tín" (Zero Trust) đối với cấu hình sinh tự động. Lập trình viên trực tiếp sửa đổi Connection String để bám sát mô hình kiến trúc Hệ thống Phân tán (Distributed System Architecture).
---
## Tuần 4: Bảo trì Hệ thống (System Tooling Maintenance)
### Phân tích Tình huống
Khi bộ công cụ Linter (ESLint) nâng cấp lên v9, định dạng cấu hình cũ (JSON) bị vô hiệu hóa, khiến tiến trình CI/CD bị đình trệ. Antigravity AI được huy động như một Kỹ sư Dev-Tooling tự động biên dịch lại toàn bộ các Rule sang cấu trúc Flat Config (ES Modules).
### Bài học rút ra
- Trong môi trường JavaScript liên tục biến động, khả năng của AI tổng hợp và tóm tắt các tài liệu kỹ thuật mới (New Documentation) giúp nhóm thoát khỏi "Configuration Hell" để tập trung vào mã nguồn nghiệp vụ.
---
## Tuần 5: Nâng cao Trải nghiệm (Refining UX) & Quản lý Xung đột Mã nguồn
### Khó khăn & Giải pháp Chuyên sâu
- **Xung đột Vòng đời (Lifecycle Conflicts):** Việc AI lạm dụng Animation JS (GSAP) trong các Tab gây ra kẹt UI. Giải pháp là tái cấu trúc chuyển sang CSS Keyframes thuần túy nhằm giảm tải Main Thread.
- **Khủng hoảng Hợp nhất Git (Merge Crisis):** Xung đột dữ liệu nghiêm trọng tại Snapshot EF Core. Giải pháp: Khai thác năng lực đọc Log hệ thống của AI để nhanh chóng tìm ra Package `dompurify` bị thiếu và dùng lệnh `git checkout --ours` bảo vệ mã nguồn giao diện.
### Bài học Cốt lõi
- **Kỹ năng Sinh tồn (Survival Skills):** Khả năng đọc và phân tích Stack Trace trên Terminal, cũng như sự bình tĩnh khi đối mặt với Merge Conflicts, là những kỹ năng định hình một Kỹ sư Phần mềm thực thụ mà AI chỉ có thể làm trợ lý công cụ.
---
## Tuần 6: Quản trị Luồng Truy cập & Tối ưu hóa Mã nguồn 
### Tổng quan Quá trình
Phân tách hoàn toàn layout Khách hàng và Admin, sử dụng JWT Payload để định tuyến động. 60+ cảnh báo Linter đã được giải quyết để mang lại một mã nguồn Sạch (Clean Code).
### Bài học rút ra
1. **Nghệ thuật "Thỏa hiệp" với Công cụ:** Tắt bỏ các nguyên tắc Linter quá khắt khe để bảo toàn logic hiện tại chứng tỏ mức độ trưởng thành của Lập trình viên trong việc quản trị rủi ro phần mềm.
2. **Sức mạnh của Role-Based Access Control (RBAC):** Bảo mật Frontend bằng định tuyến động mang lại UX tuyệt vời và giấu đi các chức năng nhạy cảm.
---
## Tuần 7: Tích hợp Toàn diện & Tối ưu Hiệu năng (Performance Optimization)
### Tổng quan Quá trình
Hệ thống bắt đầu bộc lộ sự chậm chạp khi khối lượng dữ liệu (Data Volume) tăng lên ở màn hình Lịch sử Đặt sân và Quản lý Doanh thu. Nguyên nhân cốt lõi đến từ vấn đề N+1 Queries cổ điển trong Entity Framework.
### Hạn chế của AI
- AI rất giỏi trong việc viết các truy vấn CRUD (Create, Read, Update, Delete) cơ bản cho một đối tượng. Tuy nhiên, AI lại thiếu tầm nhìn về Kiến trúc Hiệu năng (Performance Architecture). Khi được yêu cầu truy xuất dữ liệu có liên kết (Sân - Hóa đơn - Người dùng), mã do AI sinh ra ban đầu liên tục gọi truy vấn nhỏ xuống Database, vắt kiệt RAM của máy chủ.
### Giải pháp và Bài học Lập trình
- Tự phân tích SQL Profiler, can thiệp vào các câu lệnh LINQ do AI sinh ra, bổ sung `.Include()` (Eager Loading) và ép `.AsNoTracking()` để loại bỏ việc Cache dữ liệu không cần thiết.
- **Bài học rút ra:** AI có thể hoàn thành xuất sắc một Tính năng (Feature), nhưng không có khái niệm về "Khả năng mở rộng" (Scalability). Việc tối ưu hóa hệ thống tải cao luôn đòi hỏi nền tảng kiến thức sâu rộng về Cấu trúc dữ liệu và Cơ sở dữ liệu của một Kỹ sư con người.
---
## Tuần 8: Xử lý Tương tranh & Kiểm thử Nghiệm thu (Concurrency & UAT)
**Chuyện gì đã xảy ra?**
TPhats hiện bug nếu hai người cùng ấn thanh toán một sân ở cùng một thời điểm, hệ thống bị lặp (Double Booking) và cho phép cả hai người cùng đặt thành công một giờ chơi. 
**Cách tôi dùng AI để giải quyết:**
- AI đề xuất 2 cách: Optimistic Lock và Pessimistic Lock. 
- Tôi chọn cách an toàn hơn: Dùng Transaction để khóa bản ghi đó lại (Row Lock) ngay khi có người đang thanh toán, đồng thời set một Background Task để giữ chỗ trong 10 phút. Nếu 10 phút sau người đó không thanh toán xong thì mới nhả sân ra cho người khác đặt.
**Cảm nghĩ cá nhân sau 8 tuần làm đồ án:**
- AI có thể viết hộ code giao diện và API CRUD. Nhưng khi fix mấy lỗi liên quan đến transaction hay bảo mật, AI chỉ có thể đóng vai trò tư vấn giải pháp, còn người trực tiếp chèn code, debug và chịu trách nhiệm cho nó chạy được. 
- **Bài học rút ra:** phải biết đặt đúng câu hỏi, chọn lọc giải pháp AI đưa ra, và biết cách ráp nối mọi thứ lại thành một hệ thống không bị sập.
---
## Tuần 9: Đại tu Giao diện Quy mô lớn & Nghệ thuật Điều phối Đa tác tử (Multi-agent Orchestration)
### Tổng quan Quá trình
Thách thức của tuần này khác hẳn các tuần trước: không phải viết mới một tính năng, mà là **thay da toàn bộ sản phẩm** (~95 trang, 124 file, hơn 6.600 dòng thay đổi) theo một bộ thiết kế mới trong khi hệ thống vẫn phải chạy. Thay vì để một AI xử lý tuần tự, tôi áp dụng mô hình điều phối đa tác tử: xây "hợp đồng thiết kế" (Design Token trong `index.css`) trước, rồi chia các phân hệ cho nhiều AI Agent chạy song song, mỗi agent bị ràng buộc nghiêm ngặt "chỉ đổi lớp trình bày, cấm đụng logic".
### Hạn chế của AI & Bài học rút ra
- **AI Agent không bền (Session Fragility):** Nhiều agent gián đoạn giữa chừng do giới hạn phiên làm việc, không để lại báo cáo. Nếu tin vào lời báo cáo "đã xong" thay vì kiểm tra bằng chứng, sản phẩm sẽ thủng lỗ chỗ. Giải pháp: dùng `git status` làm **nguồn sự thật duy nhất** (Single Source of Truth) để khoanh vùng phần thiếu và giao lại chính xác.
- **Nhất quán không tự nhiên mà có:** Hai agent khác nhau cùng đọc một design system vẫn có thể cho ra hai kết quả lệch nhau. Việc con người chuẩn hóa token và cung cấp "trang mẫu đã duyệt" cho agent sau tham chiếu là yếu tố quyết định tính đồng bộ.
- **Kiểm thử nhập vai phơi bày sự thật:** Khi để AI đóng vai người dùng thật đi hết luồng nghiệp vụ (đặt sân → trả tiền → đối chiếu ví trong Database), hàng loạt vấn đề mà build xanh và lint sạch không thể phát hiện đã lộ ra — từ luồng Guest bị chặn cho tới ba màn hình hiển thị ba mức giá khác nhau.
### Bài học Cốt lõi
- Ở quy mô lớn, giá trị của Kỹ sư không nằm ở việc gõ từng dòng code nhanh hơn AI, mà ở **năng lực làm Tổng công trình sư**: chốt phạm vi (quyết định loại nhóm Mobile), thiết kế ràng buộc cho AI, nghiệm thu bằng bằng chứng (build, browser, database) thay vì bằng lời hứa của công cụ.
---
## Tuần 9 (tiếp): Nghiệm thu, Chẩn đoán Sự cố & Bàn giao (Acceptance, Triage & Handover)
### Tổng quan Quá trình
Giai đoạn cuối không sinh thêm nhiều dòng code, nhưng lại là giai đoạn "đáng tiền" nhất: để AI nhập vai người dùng thật đi hết mọi luồng nghiệp vụ trên đủ 5 vai trò, chẩn đoán chuỗi sự cố xác thực, và đóng gói mọi thứ thành Pull Request chờ Leader phê duyệt.
### Hạn chế của AI & Bài học rút ra
- **Lỗi không phải lúc nào cũng nằm trong code:** Sự cố Google Sign-In hóa ra là thiếu đăng ký origin trên Google Cloud Console — thứ không một dòng code nào thể hiện. AI chỉ tìm ra được nhờ dám "bước ra ngoài codebase" probe thẳng endpoint của Google. Bài học: kỹ sư giỏi phải vẽ được **ranh giới hệ thống** (code / cấu hình / hạ tầng bên thứ ba) trước khi đổ lỗi cho bất kỳ tầng nào.
- **Build xanh không có nghĩa là sản phẩm đúng:** Lint sạch, build thành công, nhưng kiểm thử nhập vai vẫn phơi ra chuyện ba màn hình hiển thị ba mức giá cho cùng một đơn đặt sân, và khách vãng lai bị chặn khỏi luồng xem sân trái với SRS. Kiểm thử theo hành vi người dùng (Behavior-driven) là lớp lưới an toàn cuối cùng mà không công cụ tĩnh nào thay thế được.
### Cảm nghĩ sau giai đoạn nước rút
- Vai trò của tôi đã dịch chuyển rõ rệt: từ người "nhờ AI viết code" thành người **đặt đề bài, cấp ràng buộc, thẩm định bằng chứng và chịu trách nhiệm cuối cùng**. AI làm được khối lượng của cả một nhóm nhỏ, nhưng phương hướng, phạm vi và chuẩn nghiệm thu vẫn phải do con người cầm.
---
## Tuần 10: Kiểm toán Truy vết & Đóng Lỗ hổng Nghiệp vụ (Traceability Audit & Gap Closing)
### Tổng quan Quá trình
Sau khi giao diện đã hoàn thiện, câu hỏi không còn là "trang này đẹp chưa" mà là **"cái gì đang thật, cái gì đang diễn"**. Tôi dùng AI thực hiện hai lớp kiểm toán: quét độ phủ tích hợp API trên ~105 trang, và truy vết 42 ticket kế hoạch xuống từng dòng code. Kết quả cho bức tranh trung thực: 36/42 ticket hoàn thành, nhưng lỗ hổng nghiêm trọng nhất nằm ở nơi ít ngờ tới — luồng E-KYC "thủng cả 2 đầu", nghĩa là trang phê duyệt của Admin đã "chờ một hồ sơ không bao giờ tới" suốt nhiều tuần mà không ai nhận ra.
### Hạn chế của AI & Bài học rút ra
- **Giao diện chết là điểm mù của kiểm thử bấm tay:** nút "Gửi yêu cầu xác thực" trông hoàn hảo nhưng không gọi API sẽ vượt qua mọi buổi demo lướt nhanh. Chỉ kiểm toán bằng bằng chứng tĩnh (dấu vết import, ánh xạ endpoint 2 chiều) mới phơi bày được. Nguy hiểm hơn là bug "Rút khỏi kèo" chỉ đổi state UI: người dùng tưởng đã rút kèo nhưng **tiền cọc thật vẫn bị khóa** — một lỗi tài chính núp dưới vỏ bọc "giao diện vẫn phản hồi mượt mà".
- **AI biết cãi đúng lúc mới là AI đáng tin:** đề bài của chính tôi yêu cầu thêm cột `IsVerified` vào bảng Users, nhưng AI phát hiện trường `EKycStatus` có sẵn và đề xuất computed property để tránh hai nguồn trạng thái lệch nhau. Nếu AI "ngoan ngoãn" làm theo, hệ thống gánh thêm nợ kỹ thuật âm thầm (cột trùng lặp + migration thừa). Vai trò của tôi là thẩm định trade-off và phê duyệt — không phải gõ thay.
- **Ma trận truy vết rẻ hơn ta tưởng:** nhờ nhóm có thói quen ghi marker `TK-0xx` vào code từ đầu, việc nghiệm thu 42 ticket vốn mất cả buổi họp chỉ còn là một phiên đối chiếu có bằng chứng. Kỷ luật nhỏ đầu dự án trả lãi lớn cuối dự án.
### Bài học Cốt lõi
- Nghiệm thu phần mềm không phải là tin vào cảm giác "có vẻ xong", mà là **đối chiếu ma trận yêu cầu – mã nguồn – bằng chứng chạy thật**. AI quét và đối chiếu nhanh gấp trăm lần con người, nhưng định nghĩa "thế nào là xong" (Definition of Done) và chịu trách nhiệm với chữ "xong" đó vẫn thuộc về kỹ sư.
---
## Tuần 10 (tiếp): Kỷ luật Phát hành & Tài liệu hóa như Mã nguồn (Release Discipline & Docs-as-Code)
### Tổng quan Quá trình
Sửa xong code mới đi được nửa đường — nửa còn lại là đưa nó lên `main` một cách an toàn và để lại dấu vết tài liệu cho người chấm lẫn người kế thừa. Chuyến "hạ cánh" này gặp đủ chướng ngại đời thực: tiến trình API cũ khóa file DLL làm bộ test không chạy được, nhánh `main` local bị worktree của một công cụ AI khác chiếm giữ, và file tài liệu `PROMPTS.md` hóa ra đã bị hỏng cấu trúc từ lần sửa trước.
### Hạn chế của AI & Bài học rút ra
- **Build xanh trên máy đang chạy bản cũ là ảo giác:** hệ thống "đang chạy ngon" thực chất chạy binary cũ — không có endpoint nào tôi vừa viết. Nếu demo ngay lúc đó, mọi tính năng mới đều "biến mất" khó hiểu. Bài học: sau khi sửa Backend, **khởi động lại tiến trình là một bước của quy trình**, không phải chuyện hiển nhiên.
- **AI dừng lại hỏi là tính năng, không phải điểm yếu:** trước thao tác không thể đảo ngược (đẩy lên nhánh chung của nhóm), AI trình 3 phương án kèm trade-off thay vì tự quyết. Tôi chọn merge thẳng vì nhóm đang nước rút — nhưng quyền chọn đó phải thuộc về người chịu trách nhiệm, không thuộc về công cụ.
- **Tài liệu cũng cần review như code:** khi yêu cầu AI viết tiếp bộ tài liệu "theo đúng form cũ", tôi buộc nó đọc kỹ 12 entry trước — và chính việc đọc kỹ đó phát hiện ra file PROMPTS.md có một entry mất header nằm im từ lâu. Quy trình "cho tôi coi trước nội dung" (Review-before-Write) với tài liệu cũng quan trọng như Pull Request với mã nguồn: thứ gì được ghi xuống nhân danh mình, mình phải duyệt trước.
### Cảm nghĩ sau 10 tuần
- Điều tôi tự hào nhất không phải là số dòng code, mà là **chuỗi bằng chứng khép kín**: audit có file:dòng → sửa có test 95/95 → phát hành có fast-forward sạch → tài liệu có ngày tháng và commit hash đối chiếu được. AI tham gia ở mọi khâu, nhưng sợi chỉ xuyên suốt — biết nghi ngờ, biết duyệt, biết chịu trách nhiệm — là phần việc không thể ủy quyền.
