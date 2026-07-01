# Tự phản ánh (Reflection và Lessons Learned)

---

## Reflection - Tuần 1: Khởi tạo dự án và Dựng Mockup UI

### Tổng quan quá trình
Trong tuần này, chúng tôi đã sử dụng Gemini và Stitch By Google để lên ý tưởng và dựng bản nháp giao diện (Mockup) tĩnh cho hệ thống Pro-Sport Complex Management. Việc áp dụng kỹ thuật Meta-prompting (dùng Gemini sinh prompt chuẩn tiếng Anh làm đầu vào cho Stitch) đã thể hiện hiệu suất rất cao trong việc trực quan hóa các ý tưởng thiết kế thành mã HTML/CSS chỉ trong thời gian ngắn.

### Hạn chế của AI
Tuy nhiên, kết quả đầu ra của AI ban đầu còn mang tính chất chung chung:
- Bỏ sót các thành phần nghiệp vụ đặc thù của nền tảng đặt sân thể thao (chẳng hạn như lịch dạng lưới hoặc form thanh toán).
- Mã nguồn sinh ra có dạng nguyên khối (monolithic) rất khó tái sử dụng và bảo trì trong tương lai.

### Giải pháp và Can thiệp của con người
Để giải quyết những hạn chế về mặt nghiệp vụ và cấu trúc này, chúng tôi đã:
1. Chủ động tinh chỉnh Prompt: Ép AI bổ sung các thành phần còn thiếu và điều chỉnh lại bảng màu cho khớp với nhận diện thương hiệu của dự án.
2. Tái cấu trúc mã nguồn: Tự tay bóc tách các file HTML tĩnh thành các module hoặc component riêng biệt như Header, Footer, Menu.

### Bài học rút ra
Sự điều chỉnh về mặt cấu trúc này đã giúp chúng tôi hiểu rằng AI rất giỏi trong việc phác thảo bố cục tổng thể, nhưng để sản phẩm đáp ứng đúng kiến trúc phần mềm, lập trình viên phải là người trực tiếp phân rã và tổ chức lại mã nguồn. Việc sử dụng kết hợp các công cụ AI theo chuỗi mang lại tốc độ vượt trội trong giai đoạn tạo mẫu, nhưng sự giám sát chặt chẽ và tinh chỉnh thủ công từ con người là bắt buộc để biến một giao diện mẫu thành một bộ khung dự án chuẩn hóa.

---

# Reflection - Tuần 2: Nâng cấp Premium UI/UX và Tích hợp Logic

## Tổng quan quá trình

Trong tuần này, chúng tôi tập trung đồng thời vào hai mục tiêu lớn:

1. Lột xác hoàn toàn giao diện người dùng đạt chuẩn Premium UI/UX.
2. Chuyển đổi thiết kế tĩnh thành các React Component hoạt động được cho 2 phân hệ lõi là Courts (Apex) và MatchPro.

Chúng tôi đã tận dụng Antigravity AI để sinh mã nguồn JSX, Tailwind CSS và gợi ý cấu trúc hiệu ứng chuyển động với thư viện GSAP cho tổng cộng 10 trang chức năng.

Bên cạnh đó, chúng tôi cũng hoàn thiện toàn bộ hệ thống giao diện đa phân hệ bao gồm hơn 40 trang React phủ khắp 6 phân hệ: **Public Pages**, **Admin Portal**, **EliteSport OS**, **Mobile App**, **Shop** và **Status Pages** — tất cả đều được xây dựng dựa trên ảnh thiết kế gốc và triển khai trong cùng một tuần.

---

## Hạn chế của AI và Khó khăn kỹ thuật

Mặc dù công cụ này giúp tăng tốc đáng kể quá trình xây dựng giao diện, nhưng lại bộc lộ nhiều điểm yếu khi đi vào thực tế:

- **Kiến trúc lộn xộn:** AI nhồi nhét trực tiếp mã animation vào bên trong component gây rối mắt.
- **Thiếu logic thực tế:** Hoàn toàn thiếu hụt luồng luân chuyển dữ liệu thực tế (Data Flow) và các ràng buộc kiểm tra tính hợp lệ (Validation) bắt buộc cho form đặt sân.
- **Lỗi môi trường phát triển:** Quá trình làm việc cục bộ bị gián đoạn bởi lỗi crash server Vite (báo lỗi EBUSY) liên tục xảy ra khi hệ thống hot-reload.
- **Lỗi Build — Entry Point sai:** AI sinh ra `index.html` với đường dẫn script trỏ sai (`/src/main.jsx` thay vì `/main.jsx`), khiến toàn bộ dự án không thể build. Lỗi này chỉ phát hiện được khi chạy thực tế, AI không tự kiểm tra cấu trúc thư mục trước khi sinh code.
- **Lỗi Routing hàng loạt:** AI để comment toàn bộ các route Public trong `App.jsx` khiến trang chủ và các trang đăng nhập, đăng ký đều trả về 404. Ngoài ra, các đường dẫn xuất hiện trên Navbar (`/courts`, `/matches`, `/gear`) không được đăng ký trong bộ định tuyến.
- **Lỗi tương thích trình duyệt:** AI sử dụng CSS selector `:has()` không được Firefox hỗ trợ, gây vỡ layout trên một phần người dùng. Đây là lỗi tinh vi không thể phát hiện nếu chỉ test trên Chrome.
- **Navigation dẫn đến trang không tồn tại:** AI sinh ra 10 nav link trong sidebar Admin trỏ tới các route chưa được xây dựng, gây lỗi 404 ngay khi người dùng click vào menu.
- **Lỗi layout Mobile:** Các trang Mobile App sử dụng `position: absolute` cho thanh nhập liệu và nút hành động, khiến nội dung bị che khuất do AI không nhận biết được scroll container thực tế của MobileLayout.

---

## Giải pháp và Can thiệp của con người

Để vượt qua những trở ngại kỹ thuật này, chúng tôi đã tiến hành tái cấu trúc (refactoring) mạnh mẽ:

- **Tối ưu Component:** Bóc tách logic GSAP ra thành các custom hooks (`useScrollReveal`, `useNavbarEntrance`) để giữ cho các UI Component sạch sẽ và dễ tái sử dụng.
- **Tích hợp API và Validation:** Tự tay cài đặt thư viện Axios để gọi API từ Backend và bổ sung các hàm chặn lỗi logic (ví dụ: chặn người dùng chọn ngày/giờ trong quá khứ).
- **Can thiệp cấu hình:** Trực tiếp chỉnh sửa file `vite.config.js` để hệ thống bỏ qua thư mục `.vs`, giải quyết dứt điểm lỗi hạ tầng môi trường mà AI không lường trước được.
- **Sửa lỗi Build thủ công:** Tự phát hiện và sửa đường dẫn entry point trong `index.html`, đảm bảo lệnh `npm run build` chạy thành công với 108 modules không lỗi.
- **Tái thiết lập hệ thống Routing:** Tự bổ sung và uncomment toàn bộ các route còn thiếu trong `App.jsx`, đảm bảo tất cả 40+ trang đều có thể truy cập đúng đường dẫn.
- **Kiểm tra đa trình duyệt:** Phát hiện và loại bỏ selector CSS `:has()` không tương thích, thay bằng cách tiếp cận dùng class thông thường, đảm bảo giao diện hiển thị đồng nhất trên cả Chrome và Firefox.
- **Sửa lỗi Layout Mobile:** Chuyển `position: absolute` sang `position: sticky` cho các thanh input và nút CTA trong Mobile App, giải quyết triệt để vấn đề chồng lấp nội dung.

---

## Bài học rút ra

- **AI giỏi sinh khối lượng, con người đảm bảo chất lượng:** AI có thể xây dựng nhanh hàng chục trang giao diện trong thời gian ngắn, nhưng không thể tự kiểm tra tính đúng đắn của từng chi tiết kỹ thuật trong môi trường thực tế.
- **Kiểm thử thực tế là bắt buộc:** Nhiều lỗi (entry point, routing, CSS trình duyệt, layout scroll) chỉ xuất hiện khi chạy thực tế, không thể phát hiện chỉ bằng cách đọc code.
- **Cung cấp ngữ cảnh đầy đủ giúp AI hiệu quả hơn:** Các prompt có đính kèm ảnh thiết kế và tài liệu yêu cầu (SRS) cho kết quả sát với mong muốn hơn nhiều so với prompt mô tả thuần văn bản.
- **Tái cấu trúc ngay từ đầu tiết kiệm thời gian dài hạn:** Việc tách logic animation thành custom hooks và phân tách component ngay trong tuần này giúp toàn bộ codebase dễ bảo trì và mở rộng trong các tuần tiếp theo.





# Reflection - Tuần 3: Hoàn thiện Nền tảng, Pháp lý và Chuẩn hóa CI/CD

## Tổng quan quá trình
Trong tuần này, chúng tôi tập trung vào việc hoàn thiện các mảng ghép cuối cùng của giao diện người dùng, cụ thể là phân hệ Gear (quản lý trang thiết bị thể thao), xây dựng các trang chính sách pháp lý (Privacy Policy, Terms of Service, Sitemap), và trang chủ đề nền tảng (Brand Mission). Đồng thời, tiến hành chuẩn hóa đa ngôn ngữ toàn bộ hệ thống sang Tiếng Anh.
Bên cạnh việc sử dụng Antigravity AI để tự động thiết kế mã nguồn giao diện với hiệu ứng GSAP ScrollTrigger cao cấp, chúng tôi còn ứng dụng AI để tự động sinh file cấu hình CI/CD (Harness Pipeline) nhằm tự động hóa quy trình Build Frontend, Backend và kiểm tra tài liệu Audit.

---

## Hạn chế của AI và Khó khăn kỹ thuật
Quá trình chuẩn hóa đa ngôn ngữ toàn dự án và tích hợp code mới đã bộc lộ rõ rệt giới hạn của AI khi hoạt động ở quy mô lớn:

- **Sự cố quá tải API (Rate Limit / Quota Exhausted):** Khi nhận được yêu cầu rà soát và dịch thuật trên diện rộng, AI đã tự động phân luồng (spawn) hàng loạt tiến trình phụ (sub-agents) để chạy song song cùng lúc. Điều này lập tức dẫn đến việc vượt quá hạn mức API cho phép của hệ thống (Error 429), khiến toàn bộ các tiến trình dịch thuật bị sập và thất bại.
- **Định tuyến tĩnh phá vỡ kiến trúc SPA:** Khi thiết kế giao diện tĩnh (đặc biệt là ở khu vực Footer và các nút CTA như "Join Our Mission"), AI thường sử dụng thẻ HTML cơ bản `<a>` với thuộc tính tĩnh (`href="/register"` hoặc `href="#"`). Nếu đưa vào thực tế, điều này sẽ làm ứng dụng thoát khỏi base path của Vite và tải lại toàn bộ trang (gây lỗi 404), phá vỡ hoàn toàn trải nghiệm mượt mà của kiến trúc Single Page Application (SPA).
- **Thiếu nhận thức về Môi trường thực thi (Environment Awareness):** Khi kéo code mới từ nhánh chính (main) chứa các thay đổi cấu trúc của team, môi trường dev (Vite) bị thiếu thư viện cục bộ và sập liên tục. Dù AI sinh code rất giỏi nhưng không tự nhận biết được sự thay đổi của cây `package.json` thực tế cho đến khi con người cung cấp trực tiếp đoạn log lỗi.

---

## Giải pháp và Can thiệp của con người
Để khắc phục tình trạng quá tải hệ thống và đảm bảo dự án đi đúng tiến độ, chúng tôi đã đưa ra các quyết định can thiệp kỹ thuật kịp thời:

- **Quản lý luồng thực thi (Resource Management):** Thay vì để AI tự do xử lý toàn dự án cùng lúc, chúng tôi đã can thiệp đình chỉ (kill) các tiến trình ngầm đang bị treo. Chủ động thu hẹp phạm vi công việc, yêu cầu AI dồn tài nguyên xử lý dứt điểm các trang chức năng cốt lõi trước để tránh nghẽn hệ thống. Việc rà soát ngôn ngữ được chuyển sang hình thức kiểm tra cục bộ thay vì quét diện rộng.
- **Chuẩn hóa Định tuyến (Routing SPA):** Trực tiếp phát hiện lỗi 404 và chỉ định AI chuyển đổi toàn bộ các thẻ liên kết tĩnh `<a>` thành component `<Link>` của thư viện React Router. Thao tác này giúp cơ chế chuyển hướng nội bộ bám sát base URL, giữ vững hiệu năng của một ứng dụng SPA thực thụ.
- **Quản trị Môi trường Chủ động:** Thay vì đợi AI tự suy đoán, lập trình viên chủ động đọc log terminal, chẩn đoán chính xác các dependencies bị thiếu (`@react-oauth/google`, `axios`) và ra lệnh trực tiếp (Direct command) cho AI cài đặt bổ sung để phục hồi dev server nhanh chóng.

---

## Bài học rút ra
- **Ràng buộc hạ tầng và Chiến lược chia nhỏ tác vụ:** Dù AI có khả năng xử lý song song vô cùng mạnh mẽ, chúng vẫn bị ràng buộc khắt khe bởi giới hạn API (Quota) từ nhà cung cấp. Lập trình viên không nên phó mặc các tác vụ "quét toàn dự án" cho AI thao tác tự do, mà cần có kỹ năng chia nhỏ (break down) công việc thành các luồng xử lý cục bộ để đảm bảo an toàn cho hệ thống.
- **Vai trò điều phối của kỹ sư (Orchestrator):** Khi hệ thống AI gặp lỗi sập luồng, con người phải đứng ở vị trí "người điều phối tài nguyên" — biết khi nào nên đóng băng tiến trình, đánh giá lại mức độ ưu tiên của công việc và chuyển hướng AI vào các tác vụ cốt lõi mang lại giá trị tức thời.
- **Lập trình viên là "Người Giám sát Môi trường":** AI có thể viết ra hàng ngàn dòng code giao diện hoàn hảo trong nháy mắt, nhưng hệ thống CI/CD, phân giải xung đột package, và kiểm soát cấu hình server cục bộ vẫn là "lãnh địa" bắt buộc phải có sự kiểm soát, đọc log và ra quyết định dứt khoát từ kỹ sư phần mềm.





# Reflection - Tuần 4 : Kiểm soát Thiết kế, Tối ưu Animation và Khắc phục lỗi Điều hướng

## Tổng quan quá trình
Trong phiên làm việc này, chúng tôi tập trung vào việc tinh chỉnh trải nghiệm vi mô (Micro-interactions) và khắc phục các lỗi điều hướng cục bộ trong ứng dụng. 
Tiếp tục sử dụng Antigravity AI, chúng tôi đã tái cấu trúc lại toàn bộ hệ thống Keyframe Animation (gom chung về `index.css` để dễ bảo trì), đồng thời tích hợp các hiệu ứng cuộn GSAP ScrollTrigger chuyên sâu cho trang Liên hệ (`ContactPage.jsx`). Ngoài ra, chúng tôi cũng giải quyết dứt điểm lỗi điều hướng Hash Scroll từ Footer về các section cụ thể trên trang chủ.

---

## Hạn chế của AI và Khó khăn kỹ thuật
Việc sử dụng AI để tự động "tối ưu giao diện" đã bộc lộ một số giới hạn về nhận thức định hướng sản phẩm:

- **Sự "sáng tạo" vượt ngoài khuôn khổ (Over-engineering):** Khi nhận được yêu cầu "đồng bộ tone màu và làm cho web chuyên nghiệp hơn", AI đã phân tích và tự ý chuyển đổi toàn bộ giao diện của các trang sang Dark Theme (nền tối, chữ trắng) kết hợp hiệu ứng glassmorphism. Dù giao diện sinh ra rất đẹp mắt và hiện đại, nhưng nó đi ngược lại hoàn toàn với nhận diện thương hiệu cốt lõi (Light Theme) mà nhóm đã thống nhất từ đầu.
- **Xử lý Hash Scroll trong kiến trúc SPA:** React Router mặc định không hỗ trợ tốt tính năng cuộn mượt đến anchor ID (`#id`) khi chuyển hướng từ một trang khác về trang chủ. Nếu AI sử dụng thẻ HTML tĩnh, luồng kiến trúc Single Page Application sẽ bị gián đoạn.

---

## Giải pháp và Can thiệp của con người
Để giữ cho dự án đi đúng quỹ đạo thiết kế và đảm bảo trải nghiệm người dùng, chúng tôi đã thực hiện các bước can thiệp quyết liệt:

- **Lọc và Hoàn tác (Selective Revert):** Đứng ở vai trò Quản lý Sản phẩm (Product Owner), chúng tôi đánh giá nhanh đề xuất Dark Theme của AI và quyết định bác bỏ. Chúng tôi ra lệnh cho AI hoàn tác (revert) toàn bộ các class CSS liên quan đến màu sắc, ép hệ thống trở về Light Theme nguyên bản, nhưng **chỉ phê duyệt và giữ lại** phần cấu trúc logic GSAP Animation.
- **Chuẩn hóa Logic Điều hướng:** Trực tiếp yêu cầu AI tích hợp hook `useLocation` kết hợp `useEffect` để bắt sự kiện thay đổi hash trên URL, gọi hàm `scrollIntoView` để xử lý mượt mà tác vụ cuộn trang mà không làm mất base URL.
- **Review mã nguồn trước khi Commit:** Không phó mặc hoàn toàn cho AI, chúng tôi yêu cầu AI dừng lại để con người review logic hash-scroll và quá trình cấu trúc các utility classes trong `index.css` trước khi cho phép thực hiện lệnh `git push` lên nhánh chung.

---

## Bài học rút ra
- **Lập trình viên là "Người gác cổng" (Gatekeeper) thương hiệu:** AI rất linh hoạt và có xu hướng "làm quá" (over-do) nếu prompt không chứa các ràng buộc cực kỳ khắt khe về UI/UX Guidelines. Con người phải luôn tỉnh táo để từ chối các đề xuất thiết kế dù đẹp nhưng không nhất quán với định dạng thương hiệu tổng thể.
- **Phân tách giữa Cấu trúc và Hiệu ứng (Separation of Concerns):** Nhờ việc yêu cầu AI tách rời các keyframe animation ra một file tập trung (`index.css`), việc chúng tôi yêu cầu revert màu sắc nền/chữ mà không làm hỏng hay mất đi các hiệu ứng chuyển động trở nên dễ dàng và an toàn hơn rất nhiều.
- **Trải nghiệm vi mô (Micro-interactions) nâng tầm sản phẩm:** Đôi khi không cần thiết kế lại toàn bộ giao diện. Việc thêm các trạng thái phản hồi nhỏ (ví dụ: Success form state với animation scale-in) và hiệu ứng cuộn (ScrollTrigger) cũng đủ giúp trang web trông "sống động" và mang lại cảm giác cao cấp (Premium) hơn hẳn.




# Reflection - Tuần 5: Triển khai Trợ lý AI, Tái cấu trúc Hệ thống, Quản trị Rủi ro & Chuẩn hóa Thẩm mỹ (RAG, Concurrency, Git Security, UI Taste)

## Tổng quan quá trình
Trong tuần này, trọng tâm của chúng tôi là tiến tới việc tích hợp năng lực Trí tuệ Nhân tạo thực sự (Generative AI) vào hệ thống thay vì chỉ dùng AI như một công cụ sinh code. Chúng tôi đã nhanh chóng xây dựng hoàn chỉnh cụm tính năng AI Chatbot từ tầng Frontend sâu xuống tầng Backend. Thay vì để Chatbot "trả lời mò", chúng tôi đã triển khai kỹ thuật **RAG sơ cấp (Retrieval-Augmented Generation)**: truy xuất dữ liệu từ cơ sở dữ liệu theo thời gian thực để bơm vào *System Prompt*, giúp AI bám sát dữ liệu thực tế của Pro-Sport.

Song song đó, chúng tôi tiến hành **Đồng bộ hóa Ngữ cảnh & Ngôn ngữ (Domain Sanitization & Localization)** trên quy mô lớn. Hơn 40+ trang UI được Việt hoá toàn diện và loại bỏ triệt để các môn thể thao ngoài luồng để bám sát chuyên đề Pickleball/Cầu lông. Về mặt hệ thống, chúng tôi thực hiện tái cấu trúc (Refactoring) các luồng giao dịch nhạy cảm ở Backend. Cuối cùng, chúng tôi thiết lập hạ tầng **Kiểm thử toàn diện (WhiteBox/BlackBox Testing)**, kết hợp với việc cài đặt **bộ quy tắc thiết kế cấp dự án (`taste-skill`)** nhằm định hình lại hoàn toàn phong cách thẩm mỹ của hệ thống, chấm dứt tình trạng sinh code UI rập khuôn do AI gây ra.

---

## Hạn chế của AI và Khó khăn kỹ thuật
Việc triển khai luồng giao tiếp phức tạp giữa Backend, Database và can thiệp sâu vào luồng Version Control đã làm nảy sinh các điểm nghẽn mà AI không thể tự mình giải quyết:

- **Rào cản Môi trường Phần cứng (OS Environment Constraints):** Khi thiết lập môi trường chạy Unit Test, AI gặp lỗi biên dịch do hệ điều hành Windows không hỗ trợ tính năng bảo mật CET của .NET 10. AI không tự nhận thức được giới hạn vật lý của máy host, dẫn đến bế tắc trong vòng lặp `Build failed`.
- **Hội chứng "AI-slop" trong thiết kế UI:** Nếu không bị giám sát, AI có xu hướng mặc định sinh ra các giao diện nghèo nàn, dùng màu sắc rập khuôn (ví dụ: nền trắng xám, gradient tím, font chữ Serif không hợp lý) thiếu đi "Gu" (Taste) của một sản phẩm phần mềm cao cấp.
- **Lỗi xung đột tiến trình (File Lock / EBUsy) ở EF Core:** Khi chạy `dotnet ef database update`, hệ thống liên tục báo lỗi do server Backend vẫn đang chạy ngầm khóa cứng các file `.dll`. AI hoàn toàn không nhận thức được bối cảnh hệ điều hành đang giữ các luồng chạy nền.
- **Rủi ro tràn bộ nhớ ngữ cảnh (Token Limit / Context Bloat):** Khi áp dụng RAG, việc AI ngây thơ bơm toàn bộ Database vào *System Prompt* có nguy cơ làm phình to kích thước payload, vượt giới hạn của mô hình `gpt-4o-mini`, làm đội chi phí API và giảm tốc độ.
- **Mù mờ trong cấu trúc Version Control & Rủi ro lộ Secret:** Khi thao tác với Git, AI tự ý tạo các nhánh (branch) mới không nằm trong kế hoạch, gây rác kho lưu trữ. Tệ hơn, AI tự sinh ra script chứa GCP API Key bị lộ (hardcoded), khiến GitHub chặn đứng thao tác `git push` (Error GH013).
- **Sự phức tạp của cấu trúc EF Core Snapshot:** Khi hợp nhất nhánh (merge branch), AI không thể xử lý được các xung đột (Conflict) nằm sâu trong file `ProSportDbContextModelSnapshot.cs`. Lịch sử Migration bị phân mảnh khiến Backend sụp đổ.

---

## Giải pháp và Can thiệp của con người
Đối diện với các rào cản kiến trúc trên, chúng tôi đã phải đứng ở vị trí Kỹ sư Hệ thống và Giám đốc Sản phẩm (Product Owner) để can thiệp toàn diện:

- **Kiểm soát linh hoạt phiên bản Môi trường (Environment Downgrade):** Thay vì cố gắng sửa lỗi OS một cách vô vọng, chúng tôi lập tức ra lệnh ép AI "hạ cấp" (downgrade) toàn bộ cấu trúc môi trường Test từ .NET 10 xuống .NET 8 (sửa `global.json`), tháo gỡ hoàn toàn điểm nghẽn phần cứng.
- **Bơm "Thẩm mỹ" vào não bộ AI (Injecting Design Taste):** Chủ động từ chối để AI tự do sáng tạo UI. Chúng tôi cung cấp Repo chứa bộ quy tắc thiết kế ngoại vi (`taste-skill`) và thiết lập nó như một bộ luật tối cao (`AGENTS.md`). Bắt buộc mọi code Frontend từ nay phải tuân thủ chuẩn Minimalist/Cold Luxury.
- **Định tuyến Git và Dọn dẹp kho lưu trữ (Git Flow Orchestration):** Can thiệp trực tiếp để điều hướng các commit do AI sinh ra về đúng nhánh làm việc chính thức (`DE190147/audit-module`), đồng thời phát lệnh xóa bỏ các nhánh rác để giữ cho CodeGraph luôn sạch sẽ.
- **Giám sát Môi trường Thực thi (Environment Orchestration):** Chủ động can thiệp terminal để đình chỉ luồng chạy nền của Backend, ép hệ điều hành nhả khóa file `.dll` để chạy migration DB thành công.
- **Kiểm soát Toàn vẹn Dữ liệu (Enforcing ACID/Concurrency):** Trực tiếp chỉ đạo AI áp dụng kiến trúc `IDbContextTransaction` với mức cô lập `Serializable` cho `EscrowService` ở Backend để đảm bảo giao dịch tiền tệ tuyệt đối an toàn.
- **Đánh giá Rủi ro Bảo mật (Security vs. Stability):** Phủ quyết đề xuất tự động cập nhật thư viện lỗ hổng của AI. Quyết định giữ lại cấu trúc Vite v6 hiện tại vì rủi ro vỡ config (Breaking changes) cao hơn nhiều so với lỗ hổng của thư viện dev.
- **Quản trị Phiên bản & Rollback:** Sử dụng `git checkout` để Rollback giao diện khi AI tự ý đổi phong cách CSS sai định hướng. Trực tiếp can thiệp giải quyết tay các điểm xung đột trong Snapshot và bypass tính năng Push Protection của GitHub.

---

## Bài học rút ra
- **AI thiếu "Gu" thẩm mỹ (Taste is Human):** AI có thể viết CSS rất nhanh, nhưng không biết cách làm cho nó "đẹp" theo tiêu chuẩn của một sản phẩm High-end. Thẩm mỹ là yếu tố thuộc về trực giác con người. Để AI làm tốt UI, ta phải thiết lập các quy định cực kỳ khắt khe (Design System/Rules) thay vì phó mặc cho máy móc.
- **Linh hoạt lùi một bước để tiến lên (The Art of Downgrading):** Trong phát triển phần mềm, chạy theo phiên bản công nghệ mới nhất (.NET 10) không phải lúc nào cũng tối ưu nếu nền tảng OS không hỗ trợ. Kỹ năng biết khi nào nên "hạ cấp" về phiên bản ổn định (.NET 8) là yếu tố sống còn.
- **AI không hiểu rõ Môi trường Hệ điều hành:** AI có thể viết mã C# hay React xuất sắc, nhưng cực kỳ yếu trong quản lý tiến trình (Process) và khóa tệp tin (File Lock) trên máy host. Kỹ năng DevOps cơ bản của kỹ sư là không thể thay thế.
- **Kỷ luật trong Version Control:** Việc để AI thao tác trực tiếp với Git mang lại tốc độ nhưng cũng đầy rủi ro. Người kỹ sư phải đóng vai trò "người gác cổng" (Gatekeeper), liên tục điều hướng commit và dọn dẹp nhánh thừa để bảo vệ tính vẹn toàn của mã nguồn.
- **Xử lý Đồng thời (Concurrency) cần tư duy kỹ sư thực thụ:** Nhận diện và thiết kế kiến trúc khóa (Locks, ACID Transactions) để chịu tải cao là trách nhiệm thuộc về con người, không thể giao phó hoàn toàn cho các đoạn code "happy path" của máy móc.
- **Cân bằng giữa Bảo mật và Ổn định (Security vs. Stability Trade-off):** Không phải cảnh báo bảo mật nào cũng cần fix ngay lập tức. Lập trình viên phải đủ bản lĩnh để từ chối các nâng cấp có rủi ro phá vỡ hệ thống (Breaking Changes).
- **RAG không chỉ là Tìm kiếm, mà là Chắt lọc (Pruning):** Đưa dữ liệu thực vào AI là sức mạnh, nhưng đưa quá nhiều sẽ giết chết hiệu năng. Lập trình viên đóng vai trò là "bộ lọc" để tối ưu hóa lượng dữ liệu cung cấp, vừa tiết kiệm chi phí, vừa giúp AI trả lời thông minh và tập trung hơn.
- **Tư duy Kiến trúc Tổng thể (Architecture Thinking):** Công cụ AI giúp ta xây từng viên gạch nhanh hơn, nhưng bản thiết kế tổng thể của hệ thống, luồng lưu trữ, định tuyến hay chiến lược Testing vẫn phải do con người phác thảo và kiểm soát gắt gao.







# Reflection - Tuần 6: Hoàn thiện Tích hợp Full-stack, Bổ sung API thiếu & Đồng nhất Hợp đồng Dữ liệu (Voucher/Report/E-KYC, Mock-to-Real Wiring, Response Envelope)

## Tổng quan quá trình
Trong tuần này, trọng tâm chuyển từ "xây dựng giao diện" sang "đưa hệ thống vào vận hành thực sự" — tức là khép kín vòng tròn Frontend ↔ Backend cho các phân hệ nghiệp vụ cốt lõi. Chúng tôi làm việc theo hai hướng song song được sắp xếp theo độ ưu tiên nghiệp vụ.

Hướng thứ nhất là **bổ sung trọn vẹn ba cụm API còn thiếu** theo kiến trúc phân tầng Domain–Application–Infrastructure–API: Voucher (mã giảm giá), Report (khiếu nại/bùng kèo) và E-KYC (phê duyệt định danh). Mỗi cụm được dựng đầy đủ chuỗi DTO → Repository → Service → Controller → Dependency Injection, tuân theo chuẩn phản hồi envelope `ApiResponseDto` và áp dụng phân quyền theo vai trò (Role-based Authorization).

Hướng thứ hai là **chuyển đổi hàng loạt trang từ dữ liệu giả (mock) sang dữ liệu thật**: quản lý đặt sân (Admin), check-in QR (Staff), cửa hàng và giỏ hàng (Shop), ghép trận (MatchPro), cùng việc hoàn thiện tính năng đánh giá người chơi & Trust Score (TK-035) end-to-end. Chúng tôi cũng chuẩn hóa nhất quán các trạng thái Loading / Empty / Error cho mọi trang được kết nối.

---

## Hạn chế của AI và Khó khăn kỹ thuật
Quá trình tích hợp sâu giữa hai tầng đã làm lộ ra các điểm yếu mà AI không tự nhận biết nếu thiếu sự kiểm soát:

- **Bất nhất về Hợp đồng Dữ liệu (Inconsistent Data Contract):** Codebase tồn tại song song hai kiểu phản hồi — controller cũ trả dữ liệu thô (raw object) còn các controller khác trả envelope `ApiResponseDto`. Nếu để AI tự sinh API mới mà không ràng buộc, mỗi endpoint sẽ có một "hình dạng" phản hồi khác nhau, khiến tầng `axiosClient` bóc tách sai và Frontend đọc nhầm `statusCode`/`data`.
- **Lỗi import gây sập trang (Crash on Render):** Nhiều trang do AI sinh trước đó import sai module — `Check`, `Star`, `Trash2` và cả `useState` bị nhập nhầm từ `react` thay vì `lucide-react`. Đây là lỗi "ẩn" không hề báo khi đọc lướt code, nhưng làm trắng màn hình ngay khi render thực tế.
- **Lỗi sai kiểu dữ liệu ngầm (Type Assumption):** Tại trang feed ghép trận, AI gọi `m.hostId.substring()` trên một giá trị kiểu số, gây crash ngay khi có dữ liệu thật trả về — một lỗi chỉ bộc lộ khi mock data được thay bằng API thực.
- **Bóc tách sai lớp vỏ phản hồi (Envelope Mismatch):** Trang check-in QR đọc dư một lớp `.data` (`scanResult.data?.bookingId`) khiến kết quả check-in luôn rỗng dù API trả về thành công.
- **Thiếu phán đoán về tác động Schema:** AI có xu hướng đề xuất tạo Migration mới khi thêm tính năng, trong khi thực tế các Entity và bảng (`Voucher`, `Report`, `EkycProfile`) đã tồn tại sẵn trong model — việc tạo migration thừa tiềm ẩn rủi ro đụng chạm schema và lịch sử EF Core.

---

## Giải pháp và Can thiệp của con người
Để đảm bảo hệ thống tích hợp một cách an toàn và nhất quán, chúng tôi đứng ở vai trò Kỹ sư Full-stack và Người kiểm soát kiến trúc để can thiệp:

- **Cưỡng chế chuẩn hóa Hợp đồng Dữ liệu:** Ra quyết định bắt buộc mọi Controller mới (Voucher/Report/E-KYC) phải tuân theo envelope `ApiResponseDto`, đồng bộ với cách `axiosClient` bóc tách phản hồi. Đồng thời, đối chiếu thủ công từng cặp Controller–API client để đảm bảo phía Frontend đọc đúng `statusCode`/`data` (envelope) hay raw tùy endpoint.
- **Điều phối phạm vi theo độ ưu tiên:** Thay vì để AI làm tuần tự dàn trải, chúng tôi trực tiếp sắp xếp thứ tự công việc theo giá trị nghiệp vụ và yêu cầu triển khai song song hai hướng (dựng backend còn thiếu + wiring trang đã có backend), tối ưu hóa tiến độ.
- **Truy vết và vá triệt để lỗi crash Frontend:** Chủ động chỉ ra các lỗi mà AI bỏ sót — import sai module, gọi phương thức chuỗi trên kiểu số, đọc dư lớp `.data` — và yêu cầu sửa dứt điểm, bổ sung thêm cả luồng nhập mã check-in thủ công cho trường hợp không có camera.
- **Kiểm soát rủi ro Database:** Xác định rõ không phát sinh Migration mới do Entity/bảng đã tồn tại sẵn; chỉ bổ sung tầng DTO/Repository/Service/Controller, giữ schema bất biến.
- **Đảm bảo tính toàn vẹn nghiệp vụ E-KYC:** Yêu cầu luồng duyệt/từ chối phải đồng bộ đồng thời cả `EkycProfile.Status` và `User.EKycStatus` trong cùng một giao dịch, tránh tình trạng dữ liệu "lệch pha" giữa hồ sơ và tài khoản.

---

## Bài học rút ra
- **Hợp đồng Dữ liệu là xương sống của tích hợp:** Khi hệ thống lớn dần, sự nhất quán về hình dạng phản hồi (response envelope) quan trọng không kém bản thân logic. Một quy ước thống nhất giúp Frontend–Backend "nói chung một ngôn ngữ" và loại bỏ cả lớp lỗi bóc tách dữ liệu âm thầm.
- **Lỗi tích hợp chỉ lộ khi gặp dữ liệu thật:** Nhiều lỗi (sai kiểu `hostId`, dư lớp `.data`, import nhầm) hoàn toàn ẩn mình dưới mock data và chỉ phát nổ khi kết nối API thực — khẳng định lại rằng kiểm thử với dữ liệu thật là bắt buộc, không thể thay thế bằng việc đọc code.
- **Tái sử dụng hạ tầng sẵn có thông minh hơn là tạo mới:** Việc nhận ra Entity/bảng đã tồn tại và chỉ cần bổ sung tầng nghiệp vụ (thay vì tạo migration mới) giúp tránh rủi ro schema và tiết kiệm thời gian — đây là phán đoán kiến trúc mà con người phải nắm, AI khó tự suy ra.
- **AI giỏi sinh tầng (layers), con người giữ tính nhất quán hệ thống:** AI có thể dựng nhanh chuỗi DTO–Repository–Service–Controller, nhưng việc đảm bảo chúng đồng nhất với phần còn lại của hệ thống (envelope, phân quyền, đồng bộ trạng thái xuyên bảng) vẫn cần bàn tay điều phối của kỹ sư.
- **Ưu tiên nghiệp vụ định hình thứ tự kỹ thuật:** Sắp xếp công việc theo giá trị nghiệp vụ và triển khai song song hợp lý giúp chuyển hệ thống từ "đẹp về hình thức" sang "vận hành được thực sự" một cách nhanh và an toàn.







# Reflection - Tuần 7: Google OAuth, Nhận diện Thương hiệu, Việt hóa & Hoàn thiện Phân hệ Staff (Auth End-to-end, Brand Identity, Localization, Dev Security, Staff Operations)

## Tổng quan quá trình

Sau khi hoàn tất tích hợp Full-stack ở Tuần 6, Tuần 7 chuyển trọng tâm sang **bốn trụ cột nâng cao chất lượng sản phẩm và vận hành thực tế** — vừa củng cố trải nghiệm người dùng, vừa đưa phân hệ Staff từ mock sang API thật.

**Trụ cột thứ nhất — Google OAuth end-to-end:** tích hợp `@react-oauth/google` tại Frontend (Login/Register), validate `googleIdToken` tại Backend (`AuthService.GoogleLoginAsync`), chuẩn hóa `VITE_GOOGLE_CLIENT_ID` / `GoogleAuth:ClientId` và hoàn thiện luồng đăng nhập qua `AuthContext`.

**Trụ cột thứ hai — Nhận diện thương hiệu PRO-SPORT:** thiết kế logo mới (mark + wordmark), áp dụng đồng bộ trên Navbar, Footer, layouts và trang auth/status; logo luôn điều hướng về trang chủ.

**Trụ cột thứ ba — Việt hóa & môi trường dev an toàn:** rà soát EN → VI trên 80+ trang/component, chuẩn hóa `StatusBadge`/`labels.js`, sửa auth/logout; thiết lập `setup-local.ps1`, file `.example` và loại secret khỏi Git.

**Trụ cột thứ tư — Phân hệ Staff (EliteSport OS + ProSport Dash):** triển khai luồng quầy walk-in, check-in QR, thuê/trả thiết bị, lịch sân realtime (06:00–22:00, UTC+7), dashboard Staff, seeder demo; wiring toàn bộ route `/elite/*`, `/dashboard/*`, `/mobile/scanner`; chuẩn hóa phân quyền dispute và đăng nhập theo vai trò (RoleSelection → `/403`).

---

## Hạn chế của AI và Khó khăn kỹ thuật

### Auth, branding & localization

- **Mù mờ với hạ tầng bên thứ ba:** AI sinh code OAuth đúng, nhưng không truy cập Google Cloud Console để tạo OAuth Web Client, thêm Authorized JavaScript Origins hay Test Users. Lỗi `The given origin is not allowed for the given client ID` chỉ giải quyết được khi con người thao tác trên GCP.
- **Nhạy cảm với cấu hình môi trường:** Thiếu/sai `VITE_GOOGLE_CLIENT_ID`, Client ID placeholder trên Backend, hoặc typo **một ký tự** (`...ubquh...` → `...u5quh...`) đều khiến OAuth sập — AI khó phát hiện typo khi user cung cấp ID qua chat.
- **Khởi tạo SDK trùng lặp:** Cảnh báo `google.accounts.id.initialize() is called multiple times` khi `GoogleOAuthProvider` hoặc nút Google mount sai vị trí — lỗi lifecycle, không hiện rõ khi chỉ đọc code tĩnh.
- **Thiếu nhận thức bảo mật repo:** AI có xu hướng ghi credential vào file có thể commit; cần gitignore và chỉ giữ bản `.example`.
- **Việt hóa quy mô lớn dễ sót:** Quét 80+ file tự động bỏ sót chuỗi trong logic điều kiện, prop động hoặc status mapping — giao diện lẫn lộn EN/VI.
- **Logo thiếu định hướng thương hiệu:** AI sinh logo generic hoặc giống đối thủ; cần nhiều vòng tinh chỉnh mới chốt phương án tối giản.

### Staff vận hành

- **Demo data vs thời gian thực:** `StaffDemoSeeder` sinh booking theo ngày seed — sau nửa đêm dữ liệu demo không còn khớp «hôm nay» nếu không refresh; AI thường không cảnh báo hạn chế vận hành này.
- **Timezone và format hiển thị:** Lịch sân dùng `DateTime` UTC trên server nhưng Staff vận hành theo giờ Việt Nam; AI có thể dùng format `hh` (12h) thay vì `HH` (24h) — gây hiểu nhầm slot trên UI quầy.
- **Luồng check-in có ràng buộc thời gian:** Check-in chỉ hợp lệ trong khung ±30 phút quanh slot — khó demo ngoài giờ; AI implement đúng nghiệp vụ nhưng không đề xuất cơ chế demo (ví dụ mã DEMO).
- **Race condition & double submit:** Mobile scanner có thể gọi API check-in hai lần nếu không có guard — lỗi runtime, dễ bỏ qua khi chỉ test desktop.
- **Phân quyền đa tầng:** Staff vs Admin trên dispute (`Investigating` vs `Resolved`/`Rejected`) và claim role trên JWT đòi hỏi hiểu rõ policy — AI đôi khi implement endpoint trước, guard sau.
- **Tính năng demo vs API thật:** Broadcast và Notif Settings chưa có backend — AI wiring có thể gây kỳ vọng sai nếu không gắn nhãn «demo» rõ ràng.

---

## Giải pháp và Can thiệp của con người

### Auth, branding & localization

- **Google Cloud Console:** Tạo OAuth Web Client, thêm `http://localhost:5173` và `http://127.0.0.1:5173`, bổ sung Test Users — khắc phục lỗi origin và 403 trên nút Google.
- **Kiểm tra Client ID:** Phát hiện typo 1 ký tự, đồng bộ `.env` và `appsettings.Development.json` cục bộ; restart dev server sau khi sửa env.
- **Cấu trúc OAuth Frontend:** Bọc `GoogleOAuthProvider` tại `main.jsx`, tách `GoogleSignInButton`, map payload qua `AuthContext.login()`.
- **Bảo vệ secret:** Loại `appsettings.Development.json` khỏi Git, bổ sung `.gitignore`, cung cấp `setup-local.ps1` và file `.example`.
- **Định hướng logo:** Tinh giản qua nhiều vòng; chốt lục giác + sân nhìn từ trên.
- **Việt hóa có chủ đích:** Ưu tiên auth, navbar, status badge, luồng nghiệp vụ cốt lõi; tách `labels.js`.
- **Version Control:** Commit gọn (`fed44de`, 121 file), `pull --rebase` trước push; loại file tạm khỏi commit.

### Staff vận hành

- **Timezone & lịch sân:** Bổ sung `VnTimeHelper` (UTC+7) cho dashboard Staff; mở rộng cửa sổ lịch 06:00–22:00; sửa format `HH:mm` trên UI.
- **Seeder an toàn:** `StaffDemoSeeder` bọc try/catch trong `Program.cs` — API không crash khi seed lỗi; ghi chú hạn chế «dữ liệu demo không tự roll theo ngày».
- **Check-in & scanner:** Guard `processingRef` trên mobile chống gọi trùng; remount scanner desktop qua `scanKey` sau check-in thành công; cập nhật `Booking.Status = Completed` sau check-in.
- **Phân quyền dispute:** Staff chỉ `Investigating`; Admin mới `Resolved`/`Rejected`; fallback claim role trên `ReportController`.
- **Route & session:** `EliteRoute` trên `/dashboard/*`, `/mobile/scanner`; `RoleSelectionPage` → `/403`; logout trên `EliteLayout`/`ProSportDashLayout`.
- **Minh bạch demo:** Gắn nhãn rõ Broadcast/Settings dùng localStorage, chưa có API backend.
- **Kiểm chứng trước push:** `npm run build`, `dotnet test` (10/10 pass); smoke test Staff: login → lịch sân → POS walk-in → check-in QR → Dash disputes/rentals. Commit `a5939b6` (74 file).

---

## Bài học rút ra

- **OAuth không chỉ là code — còn là vận hành hạ tầng:** Code, biến môi trường, GCP Console và origin trình duyệt phải khớp đồng thời. AI viết được code; cấu hình console và debug typo Client ID vẫn là lãnh địa của kỹ sư.
- **`localhost` và `127.0.0.1` là hai origin khác nhau:** Phải khai báo cả hai trên GCP nếu team dev dùng lẫn cả hai URL.
- **Secret không bao giờ vào Git, kể cả dev:** Client ID Frontend qua `.env` gitignored; JWT secret và seed password tách khỏi repo, chỉ commit `.example`.
- **Việt hóa là công việc sản phẩm, không phải script một lần:** Cần utility tập trung (`labels.js`) và rà soát theo luồng — tránh find-replace máy móc như Tuần 3/5.
- **Logo cần ràng buộc rõ trong prompt:** Product Owner can thiệp nhiều vòng; «ít hơn» thường đúng hơn «hoành tráng hơn».
- **Staff vận hành = API + UX quầy + thời gian thực:** Mock UI không đủ; lịch sân, check-in và timezone phải nhất quán từ DB đến màn hình Elite/Dash. Format giờ và guard double-submit là chi tiết nhỏ nhưng quyết định demo có thuyết phục hay không.
- **Seeder demo ≠ dữ liệu production:** Cần document hạn chế (không roll theo ngày, check-in trong khung giờ) để tránh hiểu nhầm khi demo cho giảng viên/stakeholder.
- **Phân quyền phải thiết kế trước khi wiring UI:** Staff/Admin khác policy trên cùng màn hình dispute — implement guard Backend trước, Frontend chỉ hiển thị action được phép.
- **Auth là nền tảng — test trên trình duyệt thật:** Login Google và chọn vai trò Staff chỉ xác nhận được khi chạy thực tế, mở DevTools xem GSI Logger và Network — build pass không đủ.
- **Rebase trước push là thói quen bắt buộc:** Nhánh feature dài ngày thường lệch remote; `pull --rebase` giữ lịch sử sạch và tránh surprise conflict khi merge PR.
- **Hai commit, một tuần, một mục tiêu chất lượng:** Tuần 7 gom `fed44de` (Auth/branding/i18n) và `a5939b6` (Staff) — tách commit theo phạm vi giúp review và rollback dễ hơn gộp một khối lớn.



---

# Reflection - Tuần 8: Owner Portal (Court Owner), Player Features, Audit & Hardening toàn cổng Owner

## Tổng quan quá trình

Sau khi hoàn thiện OAuth và phân hệ Staff ở Tuần 7, Tuần 8 chuyển trọng tâm sang **mở rộng nền tảng cho chủ sân (Court Owner)** và **vá các lỗi nghiệp vụ nghiêm trọng** trước khi mở rộng UI. Công việc được tổ chức theo thứ tự ưu tiên P0 → P2.
---

# Reflection - Tuần 8: Owner Portal, Player Features, Audit Remediation & Hardening toàn hệ thống

## Tổng quan quá trình

Sau khi hoàn thiện OAuth và phân hệ Staff ở Tuần 7, Tuần 8 chuyển trọng tâm sang **mở rộng nền tảng cho chủ sân (Court Owner)**, **vá các lỗi nghiệp vụ nghiêm trọng**, rồi **củng cố Escrow/Shop và kiểm thử toàn hệ thống** trước merge về `main`. Công việc được tổ chức theo thứ tự ưu tiên P0 → P3 (30–01/07/2026).

**P0 — Owner Portal:** xây dựng full-stack (Domain → Application → Infrastructure → API + Frontend) gồm dashboard, quản lý sân, lịch đặt sân (list/calendar/walk-in/check-in), tài chính, báo cáo, kho/voucher, thuê thiết bị, nhân sự, đánh giá và cấu hình (giờ mở cửa, chính sách hủy, hội viên); áp dụng `OwnerAccessService`, `OwnerApiAuthorizationFilter` và phân quyền theo vai trò.

**P0 — Sửa lỗi nghiệp vụ:** khắc phục đăng ký giải không thu phí, ELO tự báo cáo kết quả, membership không áp dụng giảm giá booking.

**P1 — Audit & hardening:** rà soát toàn cổng Owner, vá IDOR cancellation policy, sửa logic báo cáo doanh thu (double-count, scope escrow, múi giờ VN), bổ sung UI còn thiếu và xử lý export CSV.

**P2 — Tích hợp & phát hành:** đồng bộ `main`, chạy WhiteBox/BlackBox, commit gọn và push lên `DE190147/audit-module` (commit `4e0c435`, 201 files, **73/73** unit test pass).
**P2 — Tích hợp & phát hành (Owner Portal):** đồng bộ `main`, chạy WhiteBox/BlackBox, commit gọn và push lên `DE190147/audit-module` (commit `4e0c435`, 201 files, **73/73** unit test pass).

**P2→P3 — Audit remediation toàn hệ thống (cùng sprint, ngày 2026-07-01):** sau khi ship Owner Portal, tiếp tục rà soát và vá lỗi nghiệp vụ Escrow/cart/checkout thiết bị, tối ưu hiệu năng và hardening FE trước merge về `main`. Gồm: operator cancel hoàn **100%**; equipment damage không double-charge cọc; ví Escrow atomic (`ExecuteUpdate`); cart checkout **all-or-nothing** (Serializable) + validate `bookingId`; bổ sung trừ ví Escrow và ghi `Transaction` cho `BuyAsync`/`CheckoutCartAtomicAsync`; `AsNoTracking`/split query, compression, index DB; lazy routes, `ErrorBoundary`, debounce Owner; mở rộng `AuditBusinessLogicTests` và blackbox **14/14 PASS**; commit **`2a0924b`** (114 files, **95/99** unit test pass, 4 skip SQL Server).

Song song, nhóm tích hợp **Superpowers** (submodule, quy trình brainstorming + writing-plans) để chuẩn hóa workflow Agent cho các feature sau này.

---

## Hạn chế của AI và Khó khăn kỹ thuật

### Owner Portal & phạm vi lớn

- **Phình phạm vi (Scope creep):** AI có xu hướng sinh hàng loạt controller, entity, migration và trang Frontend trong một phiên — dễ tạo cảm giác «hoàn thiện» trong khi còn thiếu trang cấu hình quan trọng (operating hours, cancellation policy, membership) và chưa hardening bảo mật.
- **Phân quyền «happy path»:** Nhiều endpoint Owner được implement đúng luồng Owner/Admin nhưng bỏ sót kiểm tra quyền trên một số route nhạy cảm — ví dụ **IDOR** trên `OwnerCancellationPolicyController` (Staff hoặc user khác complex có thể đọc/sửa policy nếu biết `complexId`).
- **Báo cáo doanh thu sai ngữ nghĩa:** AI gộp `TotalAmount` booking với doanh thu sản phẩm/dịch vụ gây **double-count**; `escrowHeld` tính trên toàn hệ thống thay vì scoped theo tổ hợp; `revenueByDay` group theo UTC thay vì giờ Việt Nam — lỗi «âm thầm» chỉ lộ khi đối chiếu số liệu với nghiệp vụ thực tế.

### Player Features & nghiệp vụ tài chính

- **Tournament miễn phí:** `RegisterAsync` không trừ `EntryFee` — lỗi nghiệp vụ nghiêm trọng mà unit test ban đầu không bắt được nếu không assert số dư Escrow.
- **ELO self-report:** Cho phép người chơi tự báo cáo và cập nhật rating ngay — thiếu luồng xác nhận đối phương (confirm/dispute).
- **Membership «có entity nhưng không có hiệu lực»:** Gói hội viên tồn tại trong DB nhưng `BookingService` không gọi calculator giảm giá — pattern «backend có, luồng booking không dùng» rất phổ biến khi AI thêm feature theo lớp mà không nối end-to-end.

### Kiểm thử, Git & vận hành

- **Blackbox vs Whitebox:** Unit test pass nhiều nhưng dashboard Owner blackbox **13/14** do format giờ `hh` (12h) thay vì `HH` (24h) tại `OwnerDashboardService` — AI materialize query trước format nhưng chọn sai pattern TimeSpan.
- **Git staging thiếu kỷ luật:** AI dễ stage cả `scratch/`, `.cursor/`, tài liệu Word extract nếu không bị giám sát.
- **Hướng PR dễ nhầm:** Trên GitHub, đặt base/compare ngược (`main` → feature thay vì feature → `main`) khiến diff hiển thị commit của `main` chứ không phải công việc của nhóm — AI không tự giải thích UX GitHub cho người mới.

---

## Giải pháp và Can thiệp của con người

### Điều phối ưu tiên & audit

- **Bug nghiệp vụ trước UI:** Chỉ đạo sửa tournament/ELO/membership trước khi mở rộng thêm trang Owner — tránh «portal đẹp nhưng sai tiền».
- **Audit toàn diện, không dừng ở P0:** Ra lệnh sửa *tất cả* findings (UI thiếu, export CSV, finance filter, edit product/voucher/rental) thay vì chỉ vá IDOR.
- **Review diff trước commit:** Yêu cầu rà soát thay đổi, chạy `dotnet test` + `npm run build` trước khi stage — không push «cảm tính».

### Bảo mật & báo cáo

- **IDOR:** Bổ sung `RequireOwnerOrAdminAccessAsync` trên cancellation policy; thêm test Staff → 403 trên `OwnerApiAuthorizationFilter`.
- **Doanh thu:** `bookingRevenue` = tổng `BookingDetails.Price`; scope `escrowHeld` theo booking thuộc sân trong complex; group `revenueByDay` qua `VnTimeHelper`.
- **Hotfixes vận hành:** `CancelAndRefundSystemAsync` khi bảo trì/đóng cửa; revert role Staff khi gỡ phân công; sửa `productRevenue` trong report.

### Frontend Owner & UX

- **Trang cấu hình:** Bổ sung `/owner/operating-hours`, `/owner/cancellation-policy`, `/owner/memberships`; Settings làm hub link; sidebar đồng bộ.
- **Login flow:** CourtOwner redirect → `/owner/dashboard`; export CSV phát hiện response JSON lỗi thay vì tải file hỏng.
- **Dọn dead code:** Xóa `OwnerInventoryPage.jsx` không có route.

### Git, PR & workflow

- **Git hygiene:** Chỉ stage `src/`, docs liên quan, Superpowers setup; loại file tạm và tooling cá nhân.
- **Hướng dẫn PR:** **base `main` ← compare `DE190147/audit-module`**.
- **Superpowers:** Submodule + rule bắt buộc brainstorming/plan trước feature mới — giảm «code trước, suy nghĩ sau» ở các tuần tiếp theo.
- **Kiểm chứng:** Sửa `hh` → `HH` → blackbox dashboard **14/14**; merge `origin/main` Already up to date; push `4e0c435`.

---

## Bài học rút ra

- **Portal lớn cần audit bảo mật riêng:** AI sinh CRUD nhanh nhưng dễ bỏ sót IDOR và scope dữ liệu theo tenant (complex). Mỗi module Owner nên có checklist: *ai được gọi endpoint này với `complexId` của người khác?*
- **Doanh tho và escrow là vùng «không được đoán»:** Mọi metric phải trace được nguồn field DB và múi giờ hiển thị; blackbox + đối chiếu tay với 1–2 booking mẫu hiệu quả hơn chỉ tin unit test mock.
- **Feature «có API» ≠ feature «có hiệu lực»:** Tournament fee, membership discount, ELO confirm — cần test end-to-end assert thay đổi số dư/trạng thái, không chỉ assert HTTP 200.
- **Ưu tiên P0 nghiệp vụ trước P1 UI:** Chủ sân tin sản phẩm khi số tiền và quyền đúng; giao diện đầy đủ mà sai tiền phá niềm tin nhanh hơn thiếu vài nút.
- **Human phải yêu cầu «sửa hết audit»:** AI thường dừng ở fix đầu tiên hoặc critical duy nhất; Product Owner cần chỉ rõ *all findings* để tránh technical debt tích lũy trong cùng sprint.
- **Format datetime là lỗi kinh điển:** `hh` vs `HH` đã xuất hiện ở Staff (Tuần 7) và Owner dashboard (Tuần 8) — nên quy ước dự án: hiển thị slot/quầy luôn `HH:mm`, timezone VN qua `VnTimeHelper`.
- **Commit lớn cần staging có chủ đích:** 201 files một commit chấp nhận được nếu *một mục tiêu sprint* (Owner module); vẫn phải loại junk khỏi staging và ghi rõ phạm vi trong Changelog/Audit Log.
- **Workflow Agent (Superpowers) là đầu tư meta:** Tuần 8 vừa ship feature vừa chuẩn hóa «plan trước code» — phù hợp khi module còn nhiều gap (tournament UI cho Owner, notification bell, E2E) ở các tuần sau.
- **OAuth đã xong ở Tuần 7; Tuần 8 là multi-tenant Owner:** Bài học Tuần 7 (secret, origin, rebase) vẫn áp dụng; thêm lớp mới là **isolation theo complex** — lesson quan trọng nhất của sprint này.

### Kiểm thử, Git & vận hành

- **Blackbox vs Whitebox:** Unit test pass nhiều nhưng dashboard Owner blackbox **13/14** do format giờ `hh` (12h) thay vì `HH` (24h) tại `OwnerDashboardService` — AI materialize query trước format nhưng chọn sai pattern TimeSpan. Trong đợt remediation tiếp theo, sửa `HH` → `hh` cho TimeSpan lại gây **HTTP 400** blackbox — minh chứng lỗi format giờ dễ «vá nhầm chiều» nếu không có script API thực.
- **Whitebox pass ≠ hệ thống an toàn:** **73/73** sau commit Owner Portal không phát hiện gap kế toán checkout (chỉ trừ stock, không trừ ví Escrow), race wallet read-modify-write hay cart partial failure — cần `AuditBusinessLogicTests` và blackbox sau audit nội bộ.
- **Lỗi vận hành phát hiện muộn:** `/api/courts` HTTP 500 (thiếu `OrderBy` trước pagination split-query); `Program.cs` CS1061 (`UseQuerySplittingBehavior` sai vị trí); `StaffDemoSeeder` vi phạm CHECK `PaymentMethod` — không lộ khi chỉ chạy unit test mock.
- **Git staging thiếu kỷ luật:** AI dễ stage cả `scratch/`, `.cursor/`, tài liệu Word extract nếu không bị giám sát.
- **Hướng PR dễ nhầm:** Trên GitHub, đặt base/compare ngược (`main` → feature thay vì feature → `main`) khiến diff hiển thị commit của `main` chứ không phải công việc của nhóm — AI không tự giải thích UX GitHub cho người mới.

### Escrow, Shop & kế toán (phát hiện trong audit remediation)

- **Checkout «thành công» nhưng sai sổ sách:** Cart checkout trả HTTP 200 sau khi trừ stock và xóa giỏ, nhưng bỏ qua trừ ví Escrow và ghi `Transaction` — lỗi kế toán chỉ lộ khi đối chiếu số dư ví.
- **Partial failure nguy hiểm:** Checkout có thể trừ stock một phần rồi fail giữa chừng nếu không bọc transaction Serializable all-or-nothing.
- **Race trên ví Escrow:** Read-modify-write trên balance khi tournament/booking/cart chạy song song — AI hay vá từng service mà không thống nhất atomic tại `EscrowRepository`.
- **Operator cancel thiếu công bằng:** Vẫn tính `CancellationFee` khi admin/operator hủy — sai nghiệp vụ «sân lỗi thì hoàn full».
- **`bookingId` bị bỏ qua end-to-end:** BE có validate nhưng FE `CartCheckoutPage` gửi `null`; gộp giỏ chỉ theo `equipmentId` gây gộp nhầm item cùng thiết bị khác booking.
- **Equipment damage double-charge:** `AdditionalCharge` tính trên toàn `repairCost` thay vì `max(0, repairCost - deposit)`.

---

## Giải pháp và Can thiệp của con người

### Điều phối ưu tiên & audit

- **Bug nghiệp vụ trước UI:** Chỉ đạo sửa tournament/ELO/membership trước khi mở rộng thêm trang Owner — tránh «portal đẹp nhưng sai tiền».
- **Audit toàn diện, không dừng ở P0:** Ra lệnh sửa *tất cả* findings (UI thiếu, export CSV, finance filter, edit product/voucher/rental) thay vì chỉ vá IDOR.
- **Review diff trước commit:** Yêu cầu rà soát thay đổi, chạy `dotnet test` + `npm run build` trước khi stage — không push «cảm tính».

### Bảo mật & báo cáo

- **IDOR:** Bổ sung `RequireOwnerOrAdminAccessAsync` trên cancellation policy; thêm test Staff → 403 trên `OwnerApiAuthorizationFilter`.
- **Doanh thu:** `bookingRevenue` = tổng `BookingDetails.Price`; scope `escrowHeld` theo booking thuộc sân trong complex; group `revenueByDay` qua `VnTimeHelper`.
- **Hotfixes vận hành:** `CancelAndRefundSystemAsync` khi bảo trì/đóng cửa; revert role Staff khi gỡ phân công; sửa `productRevenue` trong report.

### Frontend Owner & UX

- **Trang cấu hình:** Bổ sung `/owner/operating-hours`, `/owner/cancellation-policy`, `/owner/memberships`; Settings làm hub link; sidebar đồng bộ.
- **Login flow:** CourtOwner redirect → `/owner/dashboard`; export CSV phát hiện response JSON lỗi thay vì tải file hỏng.
- **Dọn dead code:** Xóa `OwnerInventoryPage.jsx` không có route.

### Git, PR & workflow

- **Git hygiene:** Chỉ stage `src/`, docs liên quan, Superpowers setup; loại file tạm và tooling cá nhân.
- **Hướng dẫn PR:** **base `main` ← compare `DE190147/audit-module`**.
- **Superpowers:** Submodule + rule bắt buộc brainstorming/plan trước feature mới — giảm «code trước, suy nghĩ sau» ở các tuần tiếp theo.
- **Kiểm chứng Owner Portal:** Sửa `hh` → `HH` → blackbox dashboard **14/14**; merge `origin/main` Already up to date; push `4e0c435`.

### Audit remediation — Escrow, cart & kiểm thử

- **Kế toán trước tính năng mới:** Chỉ đạo bắt buộc trừ ví Escrow + ghi `Transaction` trước khi coi checkout «xong» — không chấp nhận chỉ HTTP 200.
- **`CheckoutCartAtomicAsync`:** Transaction Serializable — validate stock → trừ tồn → trừ ví → ghi transaction → soft-delete cart; rollback toàn bộ nếu một bước fail.
- **Atomic wallet:** `CreditWalletAsync`, `TryDebitWalletAsync` qua `ExecuteUpdate` tại `EscrowRepository`.
- **Operator cancel & equipment:** `CancellationFee = 0`, hoàn full; `AdditionalCharge = max(0, repairCost - deposit)`.
- **Cart semantics:** Gộp theo `equipmentId + bookingId`; FE truyền `bookingId` từ query hoặc item trong giỏ.
- **Regression & blackbox:** `AuditBusinessLogicTests`; sửa `CourtRepository.OrderBy`, dashboard TimeSpan, `Program.cs` split query, seeder `"Escrow"` → blackbox **14/14 PASS**.
- **Hiệu năng & FE:** Migration index; `AddResponseCompression`; lazy routes + `ErrorBoundary` + `manualChunks`; `useDebouncedValue`; `GET /api/courts/{id}/availability`.
- **Integration test CI:** 4 test SQL Server skip khi thiếu `PROSPORT_INTEGRATION_CONNECTION_STRING` — document thay vì ép chạy local.
- **Phát hành remediation:** `dotnet test` **95/99**; Vitest **6/6**; push **`2a0924b`** (`4e0c435..2a0924b`).

---

## Bài học rút ra

- **Portal lớn cần audit bảo mật riêng:** AI sinh CRUD nhanh nhưng dễ bỏ sót IDOR và scope dữ liệu theo tenant (complex). Mỗi module Owner nên có checklist: *ai được gọi endpoint này với `complexId` của người khác?*
- **Doanh tho và escrow là vùng «không được đoán»:** Mọi metric phải trace được nguồn field DB và múi giờ hiển thị; blackbox + đối chiếu tay với 1–2 booking mẫu hiệu quả hơn chỉ tin unit test mock.
- **Feature «có API» ≠ feature «có hiệu lực»:** Tournament fee, membership discount, ELO confirm — cần test end-to-end assert thay đổi số dư/trạng thái, không chỉ assert HTTP 200.
- **Ưu tiên P0 nghiệp vụ trước P1 UI:** Chủ sân tin sản phẩm khi số tiền và quyền đúng; giao diện đầy đủ mà sai tiền phá niềm tin nhanh hơn thiếu vài nút.
- **Human phải yêu cầu «sửa hết audit»:** AI thường dừng ở fix đầu tiên hoặc critical duy nhất; Product Owner cần chỉ rõ *all findings* để tránh technical debt tích lũy trong cùng sprint.
- **Format datetime là lỗi kinh điển:** `hh` vs `HH` xuất hiện ở Staff (Tuần 7), Owner dashboard (Tuần 8) và lại sai chiều khi remediation — cần utility/format chung và blackbox assert format response, không chỉ sửa tay theo log.
- **Commit lớn cần staging có chủ đích:** 201 files (`4e0c435`) + 114 files (`2a0924b`) chấp nhận được nếu *một mục tiêu sprint* (Owner + audit remediation); vẫn phải loại junk khỏi staging và ghi rõ phạm vi trong Changelog/Audit Log.
- **Workflow Agent (Superpowers) là đầu tư meta:** Tuần 8 vừa ship feature vừa chuẩn hóa «plan trước code» — phù hợp khi module còn nhiều gap (tournament UI cho Owner, notification bell, E2E) ở các sprint sau.
- **OAuth đã xong ở Tuần 7; Tuần 8 là multi-tenant Owner + củng cố tài chính:** Bài học Tuần 7 (secret, origin, rebase) vẫn áp dụng; thêm lớp **isolation theo complex** và **HTTP 200 không chứng minh đúng tiền** — checkout phải assert số dư ví + `Transaction`, cart/tournament cần Serializable + atomic wallet.
- **Portal lớn cần hai vòng audit:** Vòng 1 (Owner CRUD + IDOR + báo cáo); vòng 2 (Escrow/cart/Shop kế toán + hiệu năng + regression test) — không gộp vào tuần riêng nếu cùng sprint phát hành trên một nhánh.
- **Blackbox bổ sung whitebox, không thay thế:** Script `blackbox-api-test.ps1` nên chạy trước mọi merge lớn sau feature sprint.
- **Regression test theo câu chuyện nghiệp vụ:** Scenario kiểu `CartCheckout_RollsBack_WhenWalletInsufficient` hiệu quả hơn assert HTTP mock rời rạc — con người định nghĩa «câu chuyện tiền» cần bảo vệ.
