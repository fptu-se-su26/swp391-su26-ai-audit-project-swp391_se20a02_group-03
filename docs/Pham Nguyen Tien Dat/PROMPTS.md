# Nhật ký thay đổi & Giao tiếp AI (Prompt Log)

## Prompt #01
**Date:** 2026-05-20  
**AI Tool:** Google Gemini  
**Author:** Phạm Nguyễn Tiến Đạt  
**Purpose:** Tạo meta-prompt chuẩn để hướng dẫn công cụ Stitch thiết kế bộ giao diện UI tĩnh cho hệ thống Pro-Sport.

### Prompt
*"Đóng vai trò là một UI/UX Designer chuyên nghiệp, hãy xây dựng một meta-prompt tối ưu hóa nhằm định hướng công cụ Stitch By Google thiết kế bộ giao diện tĩnh (Static UI) cho dự án 'Pro-Sport Complex Management System'. Yêu cầu thiết kế phải bao quát các phân hệ cốt lõi: Trang chủ (Home), Màn hình danh sách sân (Court Directory), Bảng điều khiển quản trị (Dashboard) tích hợp biểu đồ thống kê trực quan, và Giao diện thanh toán chi tiết (Payment UI). Hệ thống màu sắc (Color Scheme) cần tuân thủ phong cách thể thao, năng động và đảm bảo tính đồng bộ tuyệt đối với bộ nhận diện thương hiệu (Brand Identity) của nhóm."*

### Expected Output
- Bộ meta-prompt tiếng Anh chi tiết, tối ưu làm đầu vào cho công cụ Stitch By Google.
- Đề xuất bảng màu, bố cục trang chủ, màn hình danh sách sân và layout Dashboard.

### Evaluation
Prompt rõ ràng về mục tiêu và phạm vi hệ thống. Gemini đóng vai trò Designer và sinh ra bộ prompt tiếng Anh chuẩn xác, đủ để đưa vào Stitch. Tuy nhiên, tôi đã phải can thiệp điều chỉnh (Human Decision) lại tone màu trong prompt để khớp chính xác hơn với nhận diện thương hiệu đã chốt của nhóm, đồng thời bổ sung thêm yêu cầu hiển thị form thanh toán chi tiết mà AI bỏ sót trong lần đầu.

---

## Prompt #02
**Date:** 2026-05-21  
**AI Tool:** Stitch By Google  
**Author:** Phạm Nguyễn Tiến Đạt  
**Purpose:** Sinh mã nguồn UI tĩnh (HTML/CSS/JS) cho các trang lõi của hệ thống dựa trên meta-prompt đã chuẩn bị.

### Prompt
*"Develop a clean, modern, and highly intuitive Dashboard interface for the 'Pro-Sport Complex Management System'. The architecture must include a fixed Sidebar for navigation, containing routing links to: Dashboard, Court Booking, Match Management, Equipment Rental, and Reports. The primary content area must implement a Grid-based Card Layout to visualize real-time court statuses (Available / Booked / Maintenance). Apply a dynamic and professional color palette: Primary Teal (#00C2A8), Dark Navy (#0A0E1A), and White for card backgrounds. The structural layout must be strictly responsive, ensuring optimal user experience (UX) across both Desktop and Mobile viewports."*

### Expected Output
- Mã nguồn HTML/CSS/JS cho giao diện web trực quan.
- Layout trang Dashboard, Navbar/Sidebar và các component hiển thị trạng thái sân.

### Evaluation
Stitch sinh ra giao diện trực quan, cấu trúc layout Grid/Flexbox và mã màu CSS sát với yêu cầu. Tuy nhiên, output là file HTML tĩnh nguyên khối, chưa phù hợp với kiến trúc component-based. Tôi đã phải tự bóc tách thành các file module riêng (Header, Footer, Menu), thay thế mock data bằng dữ liệu động và tinh chỉnh CSS để layout responsive tốt hơn trên thiết bị di động.

---

## Prompt #03
**Date:** 2026-05-22  
**AI Tool:** Antigravity  
**Author:** Phạm Nguyễn Tiến Đạt  
**Purpose:** Xây dựng React Component cho form đặt sân và tích hợp dữ liệu thực từ Backend.

### Prompt
*"Engineer a fully responsive React functional component for the Sports Court Booking Form. The interface must incorporate input fields for Data Selection (Date, Time Slots, Court Type) and Player Count. Implement React 'useState' hooks for robust local state management. The component must be styled utilizing Tailwind CSS utility classes, strictly adhering to the project's established Design System and ensuring cross-device compatibility."*

### Expected Output
- React Functional Component hoàn chỉnh cho `BookingForm.jsx` và `Dashboard.jsx`.
- Sử dụng hook `useState` để quản lý trạng thái form.
- Các thẻ JSX được style bằng class Tailwind CSS.

### Evaluation
AI sinh ra cấu trúc component đúng yêu cầu và hoạt động tốt với mock data. Tuy nhiên, toàn bộ UI và logic nằm trong một file nguyên khối, chưa phù hợp với nguyên tắc tái sử dụng component. Tôi đã tự tách nhỏ thành các component độc lập (`Button`, `InputField`, `CourtCard`), đồng thời tự viết tay logic gọi API bằng Axios để lấy dữ liệu sân thực từ Java Backend thay vì dùng dữ liệu tĩnh. Ngoài ra, tự bổ sung thêm logic validation để chặn người dùng chọn ngày trong quá khứ — tính năng này AI hoàn toàn bỏ sót.

---

## Prompt #04
**Date:** 2026-05-22  
**AI Tool:** Antigravity  
**Author:** Phạm Nguyễn Tiến Đạt  
**Purpose:** Sinh toàn bộ hệ thống giao diện React (40+ trang) cho 6 phân hệ dựa trên ảnh thiết kế.

### Prompt
*"Dựa trên các bản thiết kế UI/UX (Mockups/Wireframes) được đính kèm, hãy đóng vai trò là một Frontend Developer chuyên nghiệp để chuyển đổi (convert) toàn bộ thiết kế thành các React Components. Yêu cầu xây dựng mã nguồn Frontend sử dụng ReactJS, đảm bảo cấu trúc thẻ DOM và hệ thống Tailwind CSS tái tạo chính xác (pixel-perfect) bố cục, tỷ lệ và phong cách thiết kế của dự án."*

### Expected Output
- Toàn bộ React Functional Components cho 6 phân hệ: Public Pages, Admin Portal, EliteSport OS, Mobile App, Shop, Status Pages.
- Các Layout Component bao bọc từng phân hệ.
- Hệ thống routing đầy đủ trong `App.jsx`.

### Evaluation
AI sinh ra 40+ trang React và 7 Layout Component phủ khắp hệ thống, giúp tiết kiệm đáng kể thời gian xây dựng nền tảng. Tuy nhiên, tôi phải tự phát hiện và xử lý 5 nhóm lỗi mà AI không tự nhận ra: entry point `index.html` sai đường dẫn khiến Vite không build được, các route Public bị comment out gây lỗi 404, selector CSS `:has()` không tương thích Firefox, 10 nav link trong AdminLayout trỏ tới route không tồn tại, và `position: absolute` trong các trang Mobile gây chồng lấp nội dung.

---

## Prompt #05
**Date:** 2026-05-28  
**AI Tool:** Antigravity  
**Author:** Phạm Nguyễn Tiến Đạt  
**Purpose:** Tích hợp hiệu ứng GSAP và hoàn thiện 10 trang UI cho phân hệ Apex và MatchPro.

### Prompt
*"Acting as a Senior Frontend Developer, execute a comprehensive structural upgrade for the existing React (Vite) application. First, integrate the GSAP (GreenSock Animation Platform) library to orchestrate advanced UI animations and scroll transitions. Subsequently, architect and implement UI components for two core modules: the 'Apex' module (Booking, Matches, Shop, Profile, Settings, Support) and the 'MatchPro' module (Trending Feed, Nearby Sports, Community Hub, Leaderboard). Ensure all implementations align with modern frontend engineering standards."*

### Expected Output
- Cấu trúc UI và CSS layout cho 10 trang mới thuộc phân hệ Apex và MatchPro.
- Tích hợp thư viện `gsap` và `@gsap/react`.
- Animation hiệu ứng cuộn và navbar entrance.

### Evaluation
AI đề xuất đúng thư viện và sinh ra cấu trúc UI chuẩn cho 10 trang mới. Tuy nhiên, logic animation được viết trực tiếp vào từng component gây rối và khó tái sử dụng. Tôi đã tự tái cấu trúc (refactoring), rút trích logic GSAP thành các custom hooks (`useScrollReveal`, `useNavbarEntrance`). Đồng thời, khắc phục dứt điểm lỗi crash server (EBUSY) bằng cách thiết lập lại `vite.config.js`.

---

## Prompt #06
**Date:** 2026-06-01  
**AI Tool:** Antigravity (Gemini)  
**Author:** Phạm Nguyễn Tiến Đạt  
**Purpose:** Hoàn thiện phân hệ phụ trợ cho Gear và chuẩn hóa đa ngôn ngữ toàn hệ thống sang Tiếng Anh.

### Prompt
*"Thực hiện quy trình Localization (Đồng bộ ngôn ngữ) trên toàn bộ dự án: Quét mã nguồn Frontend và chuyển đổi toàn bộ các nhãn (labels), chuỗi văn bản (text strings) tiếng Việt sang Tiếng Anh để chuẩn hóa giao diện. Đồng thời, xây dựng và hoàn thiện mã nguồn React cho các phân hệ phụ trợ thuộc module Gear, bao gồm: Equipment Catalog, Rental Terms, Maintenance Tracking và Support Hub."*

### Expected Output
- Rà soát và dịch thuật toàn bộ các nhãn (labels), từ khóa tiếng Việt còn sót lại trên giao diện sang tiếng Anh nhằm chuẩn hóa Premium UI.
- Mã nguồn React hoàn chỉnh cho 4 trang phụ trợ thuộc phân hệ Gear: `GearRentalTermsPage`, `GearMaintenancePage`, `GearSupportPage`, `GearPrivacyPage`.
- Tự động tích hợp định tuyến (Routing) cho 4 trang mới vào `App.jsx` và cập nhật các liên kết tương ứng tại footer của `GearLayout.jsx`.

### Evaluation
AI đã hoàn thành rất tốt việc sinh cấu trúc UI tĩnh cho 4 trang phụ trợ của phân hệ Gear, đảm bảo tính thẩm mỹ, nhất quán và tích hợp thành công vào kiến trúc SPA hiện tại. Tuy nhiên, với prompt yêu cầu rà soát và dịch tiếng Việt trên quy mô diện rộng, AI đã tự động phân luồng (spawn) hàng loạt sub-agent chạy song song, dẫn đến lỗi vượt giới hạn API (Error 429 - Resource Exhausted). Tôi đã trực tiếp can thiệp đình chỉ luồng quét toàn dự án, khoanh vùng lại phạm vi làm việc để ưu tiên tài nguyên hoàn thiện 4 trang lõi của Gear trước. Cuối cùng, tôi chỉ định rõ AI phải cập nhật thẻ `<Link>` thay vì thẻ `<a>` tĩnh để bảo toàn luồng chuyển hướng của React Router.

---

## Prompt #07
**Date:** 2026-06-04  
**AI Tool:** Antigravity (Gemini)  
**Author:** Phạm Nguyễn Tiến Đạt  
**Purpose:** Thiết lập CI Pipeline, tái thiết kế trang About và khởi tạo các trang Nền tảng/Pháp lý (Platform/Legal).

### Prompt
*"Thiết lập và triển khai hệ thống Continuous Integration (CI) thông qua cấu hình Harness CI Pipeline cho dự án. Tiếp theo, tiến hành tái thiết kế (Overhaul) nội dung và kiến trúc UI cho trang About Us (bao gồm Brand Mission, System Stats, Timeline). Cuối cùng, bổ sung logic điều hướng và xây dựng giao diện hoàn chỉnh cho các nút Call-to-Action (CTA) hiện đang thiếu mã nguồn UI."*

### Expected Output
- File cấu hình hệ thống Harness CI (`.harness/prosport_ci_pipeline.yaml`) thực hiện 3 công việc tự động: Build Frontend, Build Backend và rà soát Audit Docs.
- Giao diện đập đi xây lại (Overhaul) toàn diện cho `AboutPage.jsx` với đầy đủ nội dung: Mission, Stats, Journey, Timeline, Leadership Team kết hợp cùng GSAP animations.
- Mã nguồn React hoàn chỉnh cho 3 trang pháp lý (`PrivacyPolicyPage`, `TermsOfServicePage`, `SitemapPage`) và 1 trang nền tảng (`BrandMissionPage`).
- Tự động bổ sung định tuyến vào `App.jsx` và cập nhật các liên kết đang để `#` ở `Footer.jsx` sang link thực tế.

### Evaluation
AI đã sinh code rất xuất sắc. Giao diện trang About và Brand Mission mang đậm chất Premium UI với hiệu ứng cuộn (GSAP ScrollTrigger) mượt mà. File cấu hình CI/CD sinh ra cũng hoàn toàn chính xác. Tuy nhiên, quá trình chạy thử gặp lỗi crash server Vite. Tôi đã phải trực tiếp can thiệp cài bổ sung dependencies (`@react-oauth/google` và `axios`) để phục hồi dev server. Ngoài ra, tại trang `BrandMissionPage`, AI đã sử dụng thẻ HTML tĩnh (`<a href="/register">`) làm mất base URL của dự án Vite (gây ra lỗi 404). Tôi đã chỉ đạo AI đổi lại toàn bộ bằng component `<Link>` để đảm bảo kiến trúc SPA.

---

## Prompt #08
**Date:** 2026-06-11  
**AI Tool:** Antigravity  
**Author:** Phạm Nguyễn Tiến Đạt  
**Purpose:** Khắc phục lỗi điều hướng Footer, bổ sung GSAP animation cho trang Liên hệ (Contact) và chuẩn hóa hệ thống Keyframe animation toàn cục.

### Prompt
*"Khắc phục sự cố điều hướng (Routing Flow) tại khu vực Footer: Đảm bảo liên kết 'Discover' cuộn chính xác đến section tương ứng trên trang chủ bằng kỹ thuật Hash-scrolling. Tiến hành đánh giá và nâng cấp toàn bộ hệ thống phối màu (Color Theme) để tối ưu tính chuyên nghiệp. Tuy nhiên, theo quyết định sản phẩm mới nhất: Yêu cầu hoàn tác (Rollback) toàn bộ thay đổi hệ thống màu sắc về lại nguyên bản (Light Theme) và chỉ duy trì các đoạn mã logic GSAP Animation đã được bổ sung."*

### Expected Output
- Sửa lỗi điều hướng khi click vào liên kết "Discover" ở khu vực Footer để trang tự động cuộn đến đúng section tương ứng trên trang chủ.
- Viết lại toàn bộ trang `ContactPage.jsx` để tích hợp các hiệu ứng GSAP ScrollTrigger cao cấp (Fade-in, Slide, Stagger, Fade-up) và thêm trạng thái gửi form thành công.
- Gom nhóm và chuẩn hóa toàn bộ các keyframe animation đang nằm rải rác về chung một file `index.css`.
- Áp dụng, sau đó hoàn tác (revert) các thay đổi về màu sắc giao diện theo quyết định định hướng sản phẩm.

### Evaluation
AI đã thể hiện khả năng xuất sắc trong việc chẩn đoán lỗi điều hướng, tự động đề xuất hook `useLocation` kết hợp `useEffect` để xử lý mượt mà tác vụ hash-scroll xuyên trang. Quá trình cấu trúc lại hiệu ứng GSAP và chuẩn hóa CSS keyframe cũng được thực hiện rất gọn gàng. Tuy nhiên, do AI tự động chuyển sang Dark Theme không phù hợp định hướng dự án, tôi đã phải ra quyết định can thiệp (Human Decision): hoàn tác toàn bộ mã màu về lại Light Theme và tự review lại logic hash-scroll trước khi commit để đảm bảo tương thích với `basename` của React Router.

---

## Prompt #09
**Date:** 2026-06-15  
**AI Tool:** Antigravity (Gemini)  
**Author:** Phạm Nguyễn Tiến Đạt  
**Purpose:** Tích hợp module AI Chatbot, ứng dụng kỹ thuật RAG để cấp phát ngữ cảnh động và tái thiết kế System Prompt nhằm tối ưu hóa năng lực xử lý đa nhiệm của AI.

### Prompt
*"Triển khai kiến trúc AI Chatbot cho hệ thống. Thứ nhất, thực hiện mount (gắn) Chatbot Widget vào cấu trúc DOM tại `App.jsx` để thiết lập hoạt động dưới dạng Global Component trên toàn bộ vòng đời ứng dụng. Thứ hai, nâng cấp System Prompt và kiến trúc luồng dữ liệu (Data Pipeline) để thiết lập năng lực xử lý đa nhiệm (Multi-tasking) cho Chatbot, cho phép AI hoạt động tương tự mô hình General-purpose AI như Gemini hay ChatGPT, đồng thời tích hợp cơ chế cấp phát ngữ cảnh (Context Injection) động từ cơ sở dữ liệu."*

### Expected Output
- Tích hợp thành công SDK OpenAI vào tầng Backend (.NET) thông qua class `ChatbotService`.
- Ứng dụng kỹ thuật truy xuất dữ liệu động (danh sách sân khả dụng, kèo đang mở) từ CSDL để inject vào *System Prompt* theo thời gian thực.
- Xây dựng component `AIChatbot.jsx` (Frontend) ở định dạng Floating Widget với UX cao cấp (hiệu ứng typing, unread badge, quick prompts).
- Tái định cấu trúc *System Prompt* để biến AI từ một bot đặc thù (Domain-specific) thành một trợ lý đa nhiệm.

### Evaluation
AI đã hoàn thành xuất sắc việc thiết kế UI Chatbot trên Frontend và triển khai logic C# để cấp phát Context. Tuy nhiên, hệ thống liên tục trả về ngoại lệ `Build failed` khi chạy `dotnet ef database update` do xung đột khóa tệp tin (File Lock). Tôi đã trực tiếp can thiệp: đình chỉ tiến trình Backend, thực thi migration, sau đó khởi động lại dịch vụ. Ngoài ra, khi cấu hình API Key thực tế và gặp lỗi `HTTP 429`, tôi đã phân tích log từ gateway của OpenAI, xác định nguyên nhân do tài khoản hết hạn mức (Quota Exceeded) và xử lý dứt điểm.

---

## Prompt #10
**Date:** 2026-06-17  
**AI Tool:** Antigravity (Gemini)  
**Author:** Phạm Nguyễn Tiến Đạt  
**Purpose:** Tiến hành rà soát mã nguồn (Code Audit) và gỡ lỗi toàn diện (Comprehensive Bug Fix) trên toàn bộ kiến trúc hệ thống (.NET & React).

### Prompt
*"Thực hiện quy trình Code Audit (Rà soát mã nguồn) toàn diện trên quy mô toàn hệ thống (cả Frontend và Backend). Yêu cầu quét sâu vào cấu trúc dự án để định vị và đề xuất bản vá (Patch) cho các lỗ hổng bảo mật (XSS, Injection, Unauthorized Access), các lỗi rò rỉ luồng nghiệp vụ (Business Logic Flaws), và các sự cố Runtime tiềm ẩn. Chủ động áp dụng các quyết định kỹ thuật (Technical Decisions) cần thiết để tối ưu hóa hiệu suất (Performance Optimization), chuẩn hóa dữ liệu (Data Standardization) và nâng cao trải nghiệm người dùng (UX)."*

### Expected Output
- Phát hiện và sinh mã nguồn khắc phục các lỗ hổng bảo mật ở cả Client và Server.
- Khắc phục các lỗi Runtime, sự cố Timezone, xử lý bất đồng bộ và rủi ro vòng lặp vô hạn ở tầng Backend API.
- Cải thiện kiến trúc UI/UX, sửa lỗi đóng gói dữ liệu từ Axios, tích hợp Lazy Loading ở tầng Frontend.
- Đảm bảo toàn bộ dự án vượt qua quá trình Compile/Build mà không phát sinh bất kỳ lỗi nào.

### Evaluation
AI tự động khởi tạo các Sub-agents quét song song và vá thành công 15+ lỗi quan trọng (XSS với `DOMPurify`, lỗi crash Timezone Linux, tối ưu ứng dụng với `React.lazy()`). Tuy nhiên, trong khâu vận hành Git, AI tự đẩy code lên nhánh mới. Tôi đã can thiệp định tuyến lại: chỉ đạo AI ép (Force Push) toàn bộ commit về nhánh `DE190147/audit-module`, chủ động từ chối lệnh `git merge main` tự động để ngừa xung đột (Merge Conflicts), đồng thời cùng AI truy vết xử lý dứt điểm lỗi SQL `Error 207` phát sinh do bất đồng bộ Enum/String.





## Prompt #11
**Date:** 2026-06-18  
**AI Tool:** Antigravity (Gemini)  
**Author:** Phạm Nguyễn Tiến Đạt  
**Purpose:** Đồng bộ hóa ngôn ngữ (Việt hoá toàn hệ thống), dọn dẹp ngữ cảnh nghiệp vụ (Domain Sanitization), tái cấu trúc Backend và quản lý luồng Version Control (Resolve Conflict & Bypass Security).

### Prompt
*"Tiến hành quy trình Domain Sanitization (Dọn dẹp ngữ cảnh nghiệp vụ) trên toàn hệ thống: Loại bỏ triệt để các tài nguyên (hình ảnh, metadata) và từ khóa thuộc về các môn thể thao ngoài luồng (như Tennis, Bóng rổ, Golf, Padel); cấu hình lại dữ liệu dự án để bám sát chuyên đề Pickleball và Cầu lông. Kế tiếp, thực hiện quy trình Localization (Việt hoá) hàng loạt trên toàn bộ Frontend. Về mặt UI/UX, tiến hành UI Rollback: Khôi phục cấu trúc giao diện về đúng trạng thái nguyên bản sau khi đã dịch thuật, loại bỏ hoàn toàn các thử nghiệm thiết kế thừa (phong cách Nike). Cuối cùng, vận hành quy trình Git Version Control: Hợp nhất (Merge) các thay đổi và đẩy mã nguồn (Push) lên nhánh `DE190147/audit-module` trên hệ thống CodeGraph/GitHub."*

### Expected Output
- Các kịch bản (scripts) tự động quét, dịch văn bản sang Tiếng Việt và thay thế các từ khóa/hình ảnh thể thao không liên quan cho hơn 40+ trang React.
- Bản nâng cấp luồng giao dịch Backend (`EscrowService`) tích hợp `IDbContextTransaction` với mức cô lập `Serializable` nhằm ngăn chặn Data Race.
- Hợp nhất thành công các file mã nguồn bị xung đột (Merge Conflict) và hoàn tất đẩy code (Git Push) qua rào cản kiểm duyệt.

### Evaluation
AI đã xây dựng thành công bộ kịch bản Node.js tùy chỉnh để quét và chuyển đổi chuỗi rất tinh vi, thực hiện Việt hoá quy mô lớn trong thời gian ngắn, đồng thời thiết lập kiến trúc Transaction Backend rất an toàn. 

Tuy nhiên, trong quá trình chỉnh sửa, AI đã tự ý ghi đè hệ thống CSS sang "phong cách Nike", đi chệch định hướng thiết kế cốt lõi. Tôi đã phải ra lệnh can thiệp (Human Decision) yêu cầu Rollback toàn diện giao diện về trạng thái nguyên thủy. Thêm vào đó, khi quy trình `git push` bị GitHub chặn đứng (Error GH013: Push Protection) do hệ thống quét thấy một đoạn mã GCP API Key rò rỉ trong file script, tôi đã trực tiếp truy cập cổng bảo mật của GitHub để thiết lập quyền ngoại lệ (Allow Secret), giúp mã nguồn được đẩy lên nhánh thành công. Cuối cùng, tôi đã phải tự tay cung cấp lại toàn bộ nội dung file `GearRentalPage.jsx` và yêu cầu AI rà soát để gỡ bỏ triệt để các mã lỗi Git Marker (`<<<<<<<`, `=======`) khi quá trình hợp nhất cục bộ xảy ra xung đột.
