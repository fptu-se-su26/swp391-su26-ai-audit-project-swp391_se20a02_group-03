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




# Reflection - Tuần 5: Triển khai Trợ lý AI, Tái cấu trúc Hệ thống và Quản trị Rủi ro (RAG, Concurrency, Git Security)

## Tổng quan quá trình
Trong tuần này, trọng tâm của chúng tôi là tiến tới việc tích hợp năng lực Trí tuệ Nhân tạo thực sự (Generative AI) vào hệ thống thay vì chỉ dùng AI như một công cụ sinh code. Chúng tôi đã nhanh chóng xây dựng hoàn chỉnh cụm tính năng AI Chatbot từ tầng Frontend (Giao diện React dạng Floating Widget với hiệu ứng trực quan) sâu xuống tầng Backend (Tích hợp OpenAI SDK cho .NET). Thay vì để Chatbot "trả lời mò", chúng tôi đã triển khai kỹ thuật **RAG sơ cấp (Retrieval-Augmented Generation)**: truy xuất dữ liệu từ cơ sở dữ liệu theo thời gian thực để bơm vào *System Prompt*, giúp AI bám sát dữ liệu thực tế của Pro-Sport.

Song song đó, chúng tôi tiến hành **Đồng bộ hóa Ngữ cảnh & Ngôn ngữ (Domain Sanitization & Localization)** trên quy mô lớn. Hơn 40+ trang UI được Việt hoá toàn diện và loại bỏ triệt để các môn thể thao ngoài luồng (Bóng rổ, Tennis) để bám sát chuyên đề Pickleball/Cầu lông. Về mặt hệ thống, chúng tôi thực hiện tái cấu trúc (Refactoring) các luồng giao dịch nhạy cảm ở Backend để đảm bảo tính toàn vẹn dữ liệu khi có lượng lớn người dùng truy cập đồng thời.

---

## Hạn chế của AI và Khó khăn kỹ thuật
Việc triển khai luồng giao tiếp phức tạp giữa Backend, Database và can thiệp sâu vào luồng Version Control đã làm nảy sinh các điểm nghẽn mà AI không thể tự mình giải quyết:

- **Lỗi xung đột tiến trình (File Lock / EBUsy) ở EF Core:** Khi thực hiện lệnh `dotnet ef database update` để ánh xạ bảng dữ liệu mới, hệ thống liên tục báo `Build failed`. Nguyên nhân là do server Backend vẫn đang chạy ngầm, khóa cứng các file `.dll`. Dù là người sinh lệnh, AI hoàn toàn không nhận thức được bối cảnh môi trường hệ điều hành (OS Environment) đang giữ các luồng chạy nền.
- **Rủi ro tràn bộ nhớ ngữ cảnh (Token Limit / Context Bloat):** Khi áp dụng RAG, việc AI ngây thơ "bơm" toàn bộ dữ liệu từ Database vào *System Prompt* có nguy cơ làm phình to kích thước payload, dẫn đến việc vượt giới hạn từ vựng của mô hình `gpt-4o-mini`, làm đội chi phí API và giảm tốc độ phản hồi.
- **Rủi ro rò rỉ bảo mật và Cổng chặn CI/CD (Secret Leakage & Push Protection):** Quá trình đẩy code (`git push`) bị GitHub chặn đứng (Error GH013). Nguyên nhân do AI tự sinh ra một kịch bản (script) tiện ích có chứa một GCP API Key bị lộ (hardcoded). AI hoàn toàn mù mờ trước các cơ chế bảo mật tự động của Git hooks.
- **Ảo giác thiết kế và Thay đổi ngoài luồng (Design Hallucination & Over-engineering):** Trong quá trình tinh chỉnh UI, AI đã "tự ý sáng tạo" và ghi đè toàn bộ CSS sang một phong cách thiết kế "mang hơi hướng Nike". Điều này hoàn toàn phá vỡ tính đồng bộ và nhận diện cốt lõi của dự án ban đầu.
- **Bất lực trước xung đột mã nguồn (Merge Conflicts):** AI sinh code xuất sắc trên môi trường sạch, nhưng khi phải hợp nhất (merge) code thực tế và đối diện với các cú pháp đánh dấu xung đột của Git (`<<<<<<<`, `=======`), AI thường tỏ ra lúng túng, bóc tách sai logic dẫn đến hỏng cấu trúc tệp tin.

---

## Giải pháp và Can thiệp của con người
Đối diện với các rào cản kiến trúc trên, chúng tôi đã phải đứng ở vị trí Kỹ sư Hệ thống và Giám đốc Sản phẩm (Product Owner) để can thiệp toàn diện:

- **Giám sát Môi trường Thực thi (Environment Orchestration):** Chúng tôi chủ động can thiệp terminal để đình chỉ luồng chạy nền (Kill background task) của Backend, ép hệ điều hành nhả khóa file `.dll` để chạy migration đồng bộ Database thành công.
- **Tối ưu hóa Ngữ cảnh (Context Pruning):** Thay vì để AI đẩy toàn bộ DB vào Prompt, chúng tôi trực tiếp can thiệp logic: Yêu cầu AI chỉ trích xuất dữ liệu thực sự cần thiết (các sân trống trong 2 ngày tới, các kèo đang mở) và nén thành JSON. Giải pháp này giúp tiết kiệm Token tuyệt đối và tăng Inference Speed.
- **Kiểm soát Toàn vẹn Dữ liệu (Enforcing ACID/Concurrency):** Đứng trước rủi ro Data Race khi nhiều người nạp/rút tiền ví cùng lúc, chúng tôi không dùng code "happy path" sơ sài của AI. Trực tiếp chỉ đạo AI áp dụng kiến trúc `IDbContextTransaction` với mức cô lập (Isolation Level) `Serializable` cho `EscrowService` ở Backend để đảm bảo giao dịch tuyệt đối an toàn.
- **Quản trị Phiên bản & Rollback (Version Control Management):** Để chấn chỉnh sự "sáng tạo quá đà" của AI (phong cách Nike), chúng tôi lập tức sử dụng `git checkout` để Rollback giao diện về lại nguyên bản, bảo vệ định hướng sản phẩm. Đồng thời, tự tay giải quyết thủ công các dòng lỗi Merge Conflict tại tệp `GearRentalPage.jsx`.
- **Vượt rào cản bảo mật (Bypassing Push Protection):** Trực tiếp truy cập vào phân hệ bảo mật của GitHub để thiết lập quyền ngoại lệ (Allow Secret) cho đoạn mã bị nhận diện nhầm, ép luồng push code vượt tường lửa thành công.

---

## Bài học rút ra
- **AI không hiểu rõ Môi trường Hệ điều hành:** AI có thể viết mã C# hay React rất xuất sắc, nhưng lại cực kỳ yếu trong việc quản lý bộ nhớ, tiến trình (Process) và khóa tệp tin (File Lock) trên máy thật. Kỹ năng quản trị hệ thống và DevOps cơ bản của kỹ sư phần mềm là không thể thay thế.
- **Xử lý Đồng thời (Concurrency) cần tư duy kỹ sư thực thụ:** Lập trình viên AI thường viết mã hoạt động hoàn hảo cho... 1 người dùng. Dưới tải trọng cao và truy cập đồng thời, hệ thống sẽ sụp đổ. Nhận diện và thiết kế kiến trúc khóa (Locks, ACID Transactions) là trách nhiệm không thể giao phó hoàn toàn cho máy móc.
- **AI là một "nhân viên" quá hăng hái (The Overzealous AI):** Đôi khi AI có xu hướng làm quá mức cần thiết (over-engineer) hoặc ảo giác ra các thiết kế sai định hướng. Lập trình viên phải đóng vai trò là một Product Owner nghiêm khắc: biết khi nào nên chấp nhận, khi nào phải phanh lại và quyết đoán nhấn "Rollback".
- **Kiểm soát An toàn Thông tin (Information Security):** Sự tiện lợi của AI đi kèm với rủi ro rò rỉ khóa bí mật (API Keys, Secrets) vào mã nguồn cực kỳ cao. Cần thiết lập tư duy phòng ngự nhiều lớp và tận dụng tối đa các công cụ quét bảo mật nền tảng (như GitHub Secret Scanning) làm lưới an toàn (safety net).
- **RAG không chỉ là Tìm kiếm, mà là Chắt lọc (Pruning):** Đưa dữ liệu thực vào AI là sức mạnh, nhưng đưa quá nhiều dữ liệu rác sẽ giết chết hiệu năng. Lập trình viên đóng vai trò là "bộ lọc" để tối ưu hóa lượng dữ liệu cung cấp cho AI, vừa tiết kiệm chi phí, vừa giúp AI trả lời thông minh và tập trung hơn.
- **Tư duy Kiến trúc Tổng thể (Architecture Thinking):** Việc tích hợp một tính năng mới (như Chatbot Widget) không chỉ nằm ở code của tính năng đó, mà nằm ở việc xác định kiến trúc mount ở đâu (Root level trong SPA) để không bị mất trạng thái. Công cụ AI giúp ta xây viên gạch nhanh hơn, nhưng bản thiết kế tổng thể của ngôi nhà vẫn phải do con người phác thảo.
