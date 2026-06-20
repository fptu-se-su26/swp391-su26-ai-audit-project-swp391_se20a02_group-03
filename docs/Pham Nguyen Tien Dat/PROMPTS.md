# Nhật ký thay đổi & Giao tiếp AI (Prompt Log)

### Prompt #01
- **Date:** 2026-05-20
- **AI Tool:** Google Gemini
- **Author:** Phạm Nguyễn Tiến Đạt
- **Purpose:** Tạo meta-prompt chuẩn để hướng dẫn công cụ Stitch thiết kế bộ giao diện UI tĩnh cho hệ thống Pro-Sport.
- **Prompt:** *"Đóng vai trò là một Chuyên gia Thiết kế UI/UX (UX/UI Designer), hãy xây dựng một bộ Meta-Prompt bằng tiếng Anh chuẩn xác để làm đầu vào cho nền tảng Stitch By Google. Yêu cầu hệ thống thiết kế bộ giao diện tĩnh cho dự án Pro-Sport Complex Management System, bao gồm trang chủ, danh sách sân và Dashboard thống kê mang phong cách thể thao, năng động."*
- **Expected Output:** Bộ meta-prompt tiếng Anh chi tiết, tối ưu làm đầu vào cho công cụ Stitch By Google. Đề xuất bảng màu, bố cục trang chủ, màn hình danh sách sân và layout Dashboard.
- **Evaluation:** Prompt rõ ràng về mục tiêu và phạm vi hệ thống. Gemini đóng vai trò Designer và sinh ra bộ prompt tiếng Anh chuẩn xác, đủ để đưa vào Stitch. Tuy nhiên, tôi đã phải can thiệp điều chỉnh (Human Decision) lại tone màu trong prompt để khớp chính xác hơn với nhận diện thương hiệu đã chốt của nhóm, đồng thời bổ sung thêm yêu cầu hiển thị form thanh toán chi tiết mà AI bỏ sót trong lần đầu.

---

### Prompt #02
- **Date:** 2026-05-21
- **AI Tool:** Stitch By Google
- **Author:** Phạm Nguyễn Tiến Đạt
- **Purpose:** Sinh mã nguồn UI tĩnh (HTML/CSS/JS) cho các trang lõi của hệ thống dựa trên meta-prompt đã chuẩn bị.
- **Prompt:** *"Design a clean, modern, and highly responsive dashboard for a sports complex management system. Include a comprehensive sidebar for global navigation, a main data-visualization area, and ensure the overall layout adheres to premium aesthetic standards with our designated sports color palette."*
- **Expected Output:** Mã nguồn HTML/CSS/JS cho giao diện web trực quan. Layout trang Dashboard, Navbar/Sidebar và các component hiển thị trạng thái sân.
- **Evaluation:** Stitch sinh ra giao diện trực quan, cấu trúc layout Grid/Flexbox và mã màu CSS sát với yêu cầu. Tuy nhiên, output là file HTML tĩnh nguyên khối, chưa phù hợp với kiến trúc component-based. Tôi đã phải tự bóc tách thành các file module riêng (Header, Footer, Menu), thay thế mock data bằng dữ liệu động và tinh chỉnh CSS để layout responsive tốt hơn trên thiết bị di động.

---

### Prompt #03
- **Date:** 2026-05-22
- **AI Tool:** Antigravity
- **Author:** Phạm Nguyễn Tiến Đạt
- **Purpose:** Xây dựng React Component cho form đặt sân và tích hợp dữ liệu thực từ Backend.
- **Prompt:** *"Phát triển một tập hợp các Functional Components trong React để xử lý biểu mẫu đặt sân (Court Booking Form). Các thành phần cần đảm bảo tính Responsive, sử dụng Tailwind CSS để styling và tích hợp quản lý trạng thái (State Management) với các trường chọn ngày, giờ và loại sân."*
- **Expected Output:** React Functional Component hoàn chỉnh cho BookingForm.jsx và Dashboard.jsx. Sử dụng hook useState để quản lý trạng thái form. Các thẻ JSX được style bằng class Tailwind CSS.
- **Evaluation:** AI sinh ra cấu trúc component đúng yêu cầu và hoạt động tốt với mock data. Tuy nhiên, toàn bộ UI và logic nằm trong một file nguyên khối, chưa phù hợp với nguyên tắc tái sử dụng component. Tôi đã tự tách nhỏ thành các component độc lập (Button, InputField, CourtCard), đồng thời tự viết tay logic gọi API bằng Axios để lấy dữ liệu sân thực từ Java Backend thay vì dùng dữ liệu tĩnh. Ngoài ra, tự bổ sung thêm logic validation để chặn người dùng chọn ngày trong quá khứ — tính năng này AI hoàn toàn bỏ sót.

---

### Prompt #04
- **Date:** 2026-05-28
- **AI Tool:** Antigravity
- **Author:** Phạm Nguyễn Tiến Đạt
- **Purpose:** Tích hợp hiệu ứng GSAP và hoàn thiện 10 trang UI cho phân hệ Apex và MatchPro.
- **Prompt:** *"Đóng vai trò là một Chuyên gia Kỹ sư Frontend (Senior Frontend Engineer), hãy thực hiện nâng cấp toàn diện ứng dụng React (Vite) hiện tại. Yêu cầu tích hợp thư viện GSAP để xử lý các hiệu ứng cuộn (Scroll Animation), đồng thời xây dựng hoàn chỉnh 10 trang UI thuộc phân hệ Apex và MatchPro tuân thủ chặt chẽ kiến trúc Component-Driven."*
- **Expected Output:** Cấu trúc UI và CSS layout cho 10 trang mới thuộc phân hệ Apex và MatchPro. Tích hợp thư viện gsap và @gsap/react. Animation hiệu ứng cuộn và navbar entrance.
- **Evaluation:** AI đề xuất đúng thư viện và sinh ra cấu trúc UI chuẩn cho 10 trang mới. Tuy nhiên, logic animation được viết trực tiếp vào từng component gây rối và khó tái sử dụng. Tôi đã tự tái cấu trúc (refactoring), rút trích logic GSAP thành các custom hooks (useScrollReveal, useNavbarEntrance). Đồng thời, khắc phục dứt điểm lỗi crash server (EBUSY) bằng cách thiết lập lại vite.config.js.

---

### Prompt #05
- **Date:** 2026-05-29
- **AI Tool:** Antigravity
- **Author:** Phạm Nguyễn Tiến Đạt
- **Purpose:** Sinh toàn bộ hệ thống giao diện React (40+ trang) cho 6 phân hệ dựa trên ảnh thiết kế.
- **Prompt:** *"Dựa trên bộ tài liệu thiết kế (Mockups/Wireframes) được đính kèm, hãy triển khai toàn bộ mã nguồn Frontend bằng thư viện React. Phân rã giao diện thành 40+ trang UI thuộc 6 phân hệ (Elite OS, Mobile App, Admin Portal, Shop, Public Pages), đảm bảo độ trung thực cao nhất (Pixel-perfect) so với thiết kế gốc và thiết lập cấu trúc Routing toàn cục."*
- **Expected Output:** Toàn bộ React Functional Components cho 6 phân hệ: Public Pages, Admin Portal, EliteSport OS, Mobile App, Shop, Status Pages. Các Layout Component bao bọc từng phân hệ. Hệ thống routing đầy đủ trong App.jsx.
- **Evaluation:** AI sinh ra 40+ trang React và 7 Layout Component phủ khắp hệ thống, giúp tiết kiệm đáng kể thời gian xây dựng nền tảng. Tuy nhiên, tôi phải tự phát hiện và xử lý 5 nhóm lỗi mà AI không tự nhận ra: entry point index.html sai đường dẫn khiến Vite không build được, các route Public bị comment out gây lỗi 404, selector CSS :has() không tương thích Firefox, 10 nav link trong AdminLayout trỏ tới route không tồn tại, và position: absolute trong các trang Mobile gây chồng lấp nội dung.

---

### Prompt #06
- **Date:** 2026-06-01
- **AI Tool:** Antigravity (Gemini)
- **Author:** Phạm Nguyễn Tiến Đạt
- **Purpose:** Hoàn thiện phân hệ phụ trợ cho Gear và chuẩn hóa đa ngôn ngữ toàn hệ thống sang Tiếng Anh.
- **Prompt:** *"Thực hiện quy trình Quốc tế hóa (Internationalization/Localization) bằng cách rà soát và chuyển đổi toàn bộ ngữ cảnh tiếng Việt sang tiếng Anh trên toàn hệ thống. Đồng thời, thiết kế và phát triển hoàn thiện mã nguồn cho 4 trang phụ trợ thuộc phân hệ Gear (Equipment Catalog, Rental Terms, Support, Privacy)."*
- **Expected Output:** Rà soát và dịch thuật toàn bộ các nhãn (labels), từ khóa tiếng Việt còn sót lại trên giao diện sang tiếng Anh nhằm chuẩn hóa Premium UI. Mã nguồn React hoàn chỉnh cho 4 trang phụ trợ thuộc phân hệ Gear: GearRentalTermsPage, GearMaintenancePage, GearSupportPage, GearPrivacyPage. Tự động tích hợp định tuyến (Routing) cho 4 trang mới vào App.jsx và cập nhật các liên kết tương ứng tại footer của GearLayout.jsx.
- **Evaluation:** AI đã hoàn thành rất tốt việc sinh cấu trúc UI tĩnh cho 4 trang phụ trợ của phân hệ Gear, đảm bảo tính thẩm mỹ, nhất quán và tích hợp thành công vào kiến trúc SPA hiện tại. Tuy nhiên, với prompt yêu cầu rà soát và dịch tiếng Việt trên quy mô diện rộng, AI đã tự động phân luồng (spawn) hàng loạt sub-agent chạy song song, dẫn đến lỗi vượt giới hạn API (Error 429 - Resource Exhausted). Tôi đã trực tiếp can thiệp đình chỉ luồng quét toàn dự án, khoanh vùng lại phạm vi làm việc để ưu tiên tài nguyên hoàn thiện 4 trang lõi của Gear trước. Cuối cùng, tôi chỉ định rõ AI phải cập nhật thẻ `<Link>` thay vì thẻ `<a>` tĩnh để bảo toàn luồng chuyển hướng của React Router.

---

### Prompt #07
- **Date:** 2026-06-04
- **AI Tool:** Antigravity (Gemini)
- **Author:** Phạm Nguyễn Tiến Đạt
- **Purpose:** Thiết lập CI Pipeline, tái thiết kế trang About và khởi tạo các trang Nền tảng/Pháp lý (Platform/Legal).
- **Prompt:** *"Khởi tạo và cấu hình luồng tích hợp liên tục (CI Pipeline) trên nền tảng Harness bao gồm các stage Build Frontend và Backend. Tiếp theo, đập đi xây lại (Overhaul) trang AboutPage và phát triển các trang Chính sách pháp lý (Legal Pages), đặc biệt chú trọng thiết kế giao diện cao cấp (Cinematic UI) tích hợp hiệu ứng GSAP cho trang Brand Mission."*
- **Expected Output:** File cấu hình hệ thống Harness CI (.harness/prosport_ci_pipeline.yaml) thực hiện 3 công việc tự động: Build Frontend, Build Backend và rà soát Audit Docs. Giao diện đập đi xây lại (Overhaul) toàn diện cho AboutPage.jsx với đầy đủ nội dung: Mission, Stats, Journey, Timeline, Leadership Team kết hợp cùng GSAP animations. Mã nguồn React hoàn chỉnh cho 3 trang pháp lý (PrivacyPolicyPage, TermsOfServicePage, SitemapPage) và 1 trang nền tảng (BrandMissionPage). Tự động bổ sung định tuyến vào App.jsx và cập nhật các liên kết đang để # ở Footer.jsx sang link thực tế.
- **Evaluation:** AI đã sinh code rất xuất sắc. Giao diện trang About và Brand Mission mang đậm chất Premium UI với hiệu ứng cuộn (GSAP ScrollTrigger) mượt mà. File cấu hình CI/CD sinh ra cũng hoàn toàn chính xác. Tuy nhiên, quá trình chạy thử gặp lỗi crash server Vite. Tôi đã phải trực tiếp can thiệp cài bổ sung dependencies (@react-oauth/google và axios) để phục hồi dev server. Ngoài ra, tại trang BrandMissionPage, AI đã sử dụng thẻ HTML tĩnh (`<a href="/register">`) làm mất base URL của dự án Vite (gây ra lỗi 404). Tôi đã chỉ đạo AI đổi lại toàn bộ bằng component `<Link>` để đảm bảo kiến trúc SPA.

---

### Prompt #08
- **Date:** 2026-06-11
- **AI Tool:** Antigravity
- **Author:** Phạm Nguyễn Tiến Đạt
- **Purpose:** Khắc phục lỗi điều hướng Footer, bổ sung GSAP animation cho trang Liên hệ (Contact) và chuẩn hóa hệ thống Keyframe animation toàn cục.
- **Prompt:** *"Khắc phục lỗi điều hướng Hash-scroll của React Router tại Footer. Tiến hành chuẩn hóa và tối ưu hóa hệ thống Keyframe Animations (GSAP ScrollTrigger) trên toàn dự án để tạo sự nhất quán về trải nghiệm (UX). Revert các thử nghiệm đổi màu nền (Dark Theme) về nguyên bản (Light Theme) nhưng bắt buộc phải bảo lưu cấu trúc mã hiệu ứng chuyển động đã xây dựng."*
- **Expected Output:** Sửa lỗi điều hướng khi click vào liên kết "Discover" ở khu vực Footer để trang tự động cuộn đến đúng section tương ứng trên trang chủ. Viết lại toàn bộ trang ContactPage.jsx để tích hợp các hiệu ứng GSAP ScrollTrigger cao cấp (Fade-in, Slide, Stagger, Fade-up) và thêm trạng thái gửi form thành công. Gom nhóm và chuẩn hóa toàn bộ các keyframe animation đang nằm rải rác về chung một file index.css. Áp dụng, sau đó hoàn tác (revert) các thay đổi về màu sắc giao diện theo quyết định định hướng sản phẩm.
- **Evaluation:** AI đã thể hiện khả năng xuất sắc trong việc chẩn đoán lỗi điều hướng, tự động đề xuất hook useLocation kết hợp useEffect để xử lý mượt mà tác vụ hash-scroll xuyên trang. Quá trình cấu trúc lại hiệu ứng GSAP và chuẩn hóa CSS keyframe cũng được thực hiện rất gọn gàng. Tuy nhiên, do AI tự động chuyển sang Dark Theme không phù hợp định hướng dự án, tôi đã phải ra quyết định can thiệp (Human Decision): hoàn tác toàn bộ mã màu về lại Light Theme và tự review lại logic hash-scroll trước khi commit để đảm bảo tương thích với basename của React Router.

---

### Prompt #09
- **Date:** 2026-06-15
- **AI Tool:** Antigravity (Gemini)
- **Author:** Phạm Nguyễn Tiến Đạt
- **Purpose:** Tích hợp module AI Chatbot, ứng dụng kỹ thuật RAG để cấp phát ngữ cảnh động và tái thiết kế System Prompt nhằm tối ưu hóa năng lực xử lý đa nhiệm của AI.
- **Prompt:** *"Thiết kế và triển khai kiến trúc AI Chatbot toàn diện từ Backend đến Frontend. Tại Backend, tích hợp OpenAI API và cấu trúc System Prompt nạp dữ liệu động (Real-time Context) từ DB. Tại Frontend, xây dựng Floating Widget UI với các hiệu ứng tương tác (Typing, Pulse ring), cấu hình mount global và mở rộng giới hạn logic để biến Chatbot thành một trợ lý AI Đa nhiệm."*
- **Expected Output:** Tích hợp thành công SDK OpenAI vào tầng Backend (.NET) thông qua class ChatbotService. Ứng dụng kỹ thuật truy xuất dữ liệu động (danh sách sân khả dụng, kèo đang mở) từ CSDL để inject vào System Prompt theo thời gian thực. Xây dựng component AIChatbot.jsx (Frontend) ở định dạng Floating Widget với UX cao cấp (hiệu ứng typing, unread badge, quick prompts). Tái định cấu trúc System Prompt để biến AI từ một bot đặc thù (Domain-specific) thành một trợ lý đa nhiệm.
- **Evaluation:** AI đã hoàn thành xuất sắc việc thiết kế UI Chatbot trên Frontend và triển khai logic C# để cấp phát Context. Tuy nhiên, hệ thống liên tục trả về ngoại lệ Build failed khi chạy dotnet ef database update do xung đột khóa tệp tin (File Lock). Tôi đã trực tiếp can thiệp: đình chỉ tiến trình Backend, thực thi migration, sau đó khởi động lại dịch vụ. Ngoài ra, khi cấu hình API Key thực tế và gặp lỗi HTTP 429, tôi đã phân tích log từ gateway của OpenAI, xác định nguyên nhân do tài khoản hết hạn mức (Quota Exceeded) và xử lý dứt điểm.

---

### Prompt #10
- **Date:** 2026-06-17
- **AI Tool:** Antigravity (Gemini)
- **Author:** Phạm Nguyễn Tiến Đạt
- **Purpose:** Tiến hành rà soát mã nguồn (Code Audit) và gỡ lỗi toàn diện (Comprehensive Bug Fix) trên toàn bộ kiến trúc hệ thống (.NET & React).
- **Prompt:** *"Kích hoạt quy trình Kiểm thử tĩnh (Static Analysis) và Tổng rà soát mã nguồn (Code Audit). Chủ động phát hiện và tung ra các bản vá lỗi (Patch) ở tầng Bảo mật (Security), Backend Logic và Frontend UX. Áp dụng kỹ thuật Lazy Loading để tối ưu hóa hiệu năng và trực tiếp xử lý các lỗi tương thích cấu hình môi trường."*
- **Expected Output:** Phát hiện và sinh mã nguồn khắc phục các lỗ hổng bảo mật ở cả Client và Server. Khắc phục các lỗi Runtime, sự cố Timezone, xử lý bất đồng bộ và rủi ro vòng lặp vô hạn ở tầng Backend API. Cải thiện kiến trúc UI/UX, sửa lỗi đóng gói dữ liệu từ Axios, tích hợp Lazy Loading ở tầng Frontend. Đảm bảo toàn bộ dự án vượt qua quá trình Compile/Build mà không phát sinh bất kỳ lỗi nào.
- **Evaluation:** AI tự động khởi tạo các Sub-agents quét song song và vá thành công 15+ lỗi quan trọng (XSS với DOMPurify, lỗi crash Timezone Linux, tối ưu ứng dụng với React.lazy()). Tuy nhiên, trong khâu vận hành Git, AI tự đẩy code lên nhánh mới. Tôi đã can thiệp định tuyến lại: chỉ đạo AI ép (Force Push) toàn bộ commit về nhánh DE190147/audit-module, chủ động từ chối lệnh git merge main tự động để ngừa xung đột (Merge Conflicts), đồng thời cùng AI truy vết xử lý dứt điểm lỗi SQL Error 207 phát sinh do bất đồng bộ Enum/String.

---

### Prompt #11
- **Date:** 2026-06-18
- **AI Tool:** Antigravity (Gemini)
- **Author:** Phạm Nguyễn Tiến Đạt
- **Purpose:** Đồng bộ hóa ngôn ngữ (Việt hoá toàn hệ thống), dọn dẹp ngữ cảnh nghiệp vụ (Domain Sanitization), tái cấu trúc Backend và quản lý luồng Version Control (Resolve Conflict & Bypass Security).
- **Prompt:** *"Thực thi tự động hóa quy trình Việt hóa (Localization) thông qua Script quét toàn dự án. Thực hiện thanh lọc dữ liệu (Domain Sanitization), loại bỏ hoàn toàn các môn thể thao ngoại lai để cô lập ngữ cảnh nghiệp vụ vào Pickleball/Cầu lông. Tại Backend, tái cấu trúc mã (Refactor) áp dụng chuẩn Giao dịch (Transaction Isolation) an toàn cho EscrowService. Sau đó, xử lý xung đột Git (Merge Conflicts), bypass cảnh báo bảo mật Secret Scanning và đẩy code an toàn lên CodeGraph."*
- **Expected Output:** Các kịch bản (scripts) tự động quét, dịch văn bản sang Tiếng Việt và thay thế các từ khóa/hình ảnh thể thao không liên quan cho hơn 40+ trang React. Bản nâng cấp luồng giao dịch Backend (EscrowService) tích hợp IDbContextTransaction với mức cô lập Serializable nhằm ngăn chặn Data Race. Hợp nhất thành công các file mã nguồn bị xung đột (Merge Conflict) và hoàn tất đẩy code (Git Push) qua rào cản kiểm duyệt.
- **Evaluation:** AI đã xây dựng thành công bộ kịch bản Node.js tùy chỉnh để quét và chuyển đổi chuỗi rất tinh vi, thực hiện Việt hoá quy mô lớn trong thời gian ngắn, đồng thời thiết lập kiến trúc Transaction Backend rất an toàn. Tuy nhiên, trong quá trình chỉnh sửa, AI đã tự ý ghi đè hệ thống CSS sang "phong cách Nike", đi chệch định hướng thiết kế cốt lõi. Tôi đã phải ra lệnh can thiệp (Human Decision) yêu cầu Rollback toàn diện giao diện về trạng thái nguyên thủy. Thêm vào đó, khi quy trình git push bị GitHub chặn đứng (Error GH013: Push Protection) do hệ thống quét thấy một đoạn mã GCP API Key rò rỉ trong file script, tôi đã trực tiếp truy cập cổng bảo mật của GitHub để thiết lập quyền ngoại lệ (Allow Secret), giúp mã nguồn được đẩy lên nhánh thành công. Cuối cùng, tôi đã phải tự tay cung cấp lại toàn bộ nội dung file GearRentalPage.jsx và yêu cầu AI rà soát để gỡ bỏ triệt để các mã lỗi Git Marker (<<<<<<<, =======) khi quá trình hợp nhất cục bộ xảy ra xung đột.

---

### Prompt #12
- **Date:** 2026-06-18
- **AI Tool:** Antigravity (Gemini)
- **Author:** Phạm Nguyễn Tiến Đạt
- **Purpose:** Đồng bộ mã nguồn từ nhánh main, xử lý xung đột Git (Merge Conflicts), rà soát bảo mật (Security Scan) và tự động hóa sửa lỗi React Hooks toàn dự án.
- **Prompt:** *"Hãy tiến hành đồng bộ mã nguồn mới nhất từ nhánh `main`. Sau đó, thực hiện quét lỗi toàn diện (Deep Scan) trên cả hệ thống Frontend và Backend. Rà soát các lỗ hổng bảo mật tiềm ẩn của thư viện, khắc phục triệt để các cảnh báo mã nguồn (Linting/Hooks errors) và xử lý xung đột Git nếu có. Cuối cùng, đóng gói toàn bộ bản vá lỗi và đẩy (push) an toàn lên nhánh làm việc hiện tại."*
- **Expected Output:** Hợp nhất thành công mã nguồn từ nhánh main và phân giải triệt để các tệp tin bị xung đột (Conflict). Quét và khắc phục tự động hóa toàn bộ các cảnh báo mã nguồn của React (ESLint/Hooks errors) trên hơn 35 trang giao diện. Báo cáo kết quả rà soát lỗ hổng bảo mật của các Dependencies (NPM, NuGet) và thực thi cài đặt nóng các package bị thiếu. Đóng gói và đẩy (Push) an toàn toàn bộ các thay đổi lên CodeGraph/GitHub.
- **Evaluation:** AI đã thể hiện năng lực chẩn đoán xuất sắc khi tự động đọc hiểu log lỗi từ trình biên dịch .NET Core để khắc phục sự cố hợp nhất (merge) tại file `ProSportDbContextModelSnapshot.cs` và đổi tên Migration class bị trùng lặp. Đặc biệt ấn tượng khi AI chủ động thiết kế và thực thi PowerShell Script sử dụng Regex để chuyển đổi hàng loạt cú pháp Arrow Function sang Async Function trên quy mô lớn, giúp triệt tiêu hoàn toàn rủi ro lỗi hoisting của React Hooks. Mặc dù bề mặt hệ thống đã khởi chạy thành công, nhưng dưới quyết định gắt gao yêu cầu phải "Deep Scan" liên tục từ người dùng (Human Decision), AI mới tiếp tục rà soát sâu và phát hiện ra lỗi sập Vite Server (HMR Error) do thiếu thư viện bản đồ (react-leaflet) để xử lý dứt điểm. Cuối cùng, tôi đã đóng vai trò kiểm soát luồng CI/CD, chỉ đạo AI gom toàn bộ các bản vá nhỏ lẻ thành một commit duy nhất và đẩy an toàn lên nhánh `DE190147/audit-module`.




---

### Prompt #13
- **Date:** 2026-06-20
- **AI Tool:** Antigravity (Gemini)
- **Author:** Phạm Nguyễn Tiến Đạt
- **Purpose:** Đóng vai trò Quản trị dự án (PM) để tổng rà soát, vá lỗi toàn diện (Bug Fix) cho Backend & Frontend, thiết lập hạ tầng kiểm thử (WhiteBox/BlackBox Testing) và chuẩn hóa quy tắc thiết kế UI với `taste-skill`.
- **Prompt:** *"Đóng vai trò là Quản trị viên Dự án (Project Manager), tiến hành tổng rà soát (Code Review) và vá lỗi (Bug Fix) toàn diện cho hệ thống, tập trung vào việc tối ưu hóa logic nghiệp vụ và hiệu suất truy xuất dữ liệu. Sau đó, thiết lập và thực thi các kịch bản kiểm thử hộp trắng (WhiteBox) và hộp đen (BlackBox). Tích hợp kho lưu trữ mã nguồn `taste-skill` vào môi trường dự án để chuẩn hóa quy tắc UI. Cuối cùng, quản lý hệ thống Version Control bằng cách gỡ bỏ các nhánh Git tạo lỗi và đẩy mã nguồn vào đúng nhánh chỉ định."*
- **Expected Output:** Phát hiện và sửa triệt để các lỗi ẩn ở tầng Backend (N+1 queries, Race conditions, lỗi State tracking của EF Core). Khởi tạo thành công script kiểm thử hộp đen E2E và vượt qua 100% các Unit Test hộp trắng. Cấu hình tích hợp repo `taste-skill` vào não bộ hệ thống Agent (thông qua `.agents/AGENTS.md`) để áp dụng các tiêu chuẩn thiết kế khắt khe (Minimalist, cấm font Serif, v.v.). Cuối cùng là đẩy (push) mã nguồn thành công, an toàn lên nhánh `DE190147/audit-module` và dọn dẹp các nhánh thừa trên Remote.
- **Evaluation:** AI đã thể hiện năng lực kỹ thuật bao quát rất xuất sắc từ tầng Database, Testing cho đến cấu hình Agent Rules. AI đã tự khắc phục thành công hàng loạt lỗi Unit Test (bổ sung Enum `Cancelled`, xử lý tham số DTO). Tuy nhiên, khi lệnh `dotnet test` bị hệ điều hành chặn đứng do Windows không hỗ trợ tính năng bảo mật CET của .NET 10, tôi đã trực tiếp can thiệp định hướng AI hạ cấp (downgrade) môi trường Test cục bộ về .NET 8, giúp quy trình kiểm thử tiếp tục diễn ra trơn tru. Đối với phần Frontend, tôi quyết liệt ép AI cài đặt kho lưu trữ `taste-skill` ngoại vi để thiết lập quy tắc thiết kế, ngăn chặn hoàn toàn rủi ro AI sinh ra giao diện rập khuôn rẻ tiền (AI-slop). Trong khâu Version Control, khi AI thực hiện đẩy code lên nhánh cục bộ, tôi đã can thiệp điều hướng commit thẳng về nhánh làm việc chính xác `DE190147/audit-module` và trực tiếp ra lệnh gỡ bỏ các nhánh rác trên GitHub để bảo vệ Git flow chuyên nghiệp.
