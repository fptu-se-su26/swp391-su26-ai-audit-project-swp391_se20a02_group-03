## Prompt #01
**Date:** 2026-05-20  
**AI Tool:** Google Gemini  
**Author:** Phạm Nguyễn Tiến Đạt  
**Purpose:** Tạo meta-prompt chuẩn để hướng dẫn công cụ Stitch thiết kế bộ giao diện UI tĩnh cho hệ thống Pro-Sport.

### Prompt
*"Như là một DESIGNER, bạn hãy cho tôi prompt để hướng dẫn Stitch làm phần thiết kế UI tĩnh cho dự án Pro-Sport Complex Management System của tôi. Hệ thống bao gồm các phân hệ: trang chủ, màn hình danh sách sân, giao diện Dashboard với biểu đồ thống kê và form thanh toán chi tiết (Payment UI). Bảng màu cần mang phong cách thể thao, năng động và khớp với nhận diện thương hiệu của nhóm."*

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
*"Design a clean and modern dashboard for a sports complex management system. Include a sidebar for navigation with links to: Dashboard, Court Booking, Match Management, Equipment Rental, and Reports. The main content area should display real-time court status (Available / Booked / Maintenance) using a card grid layout. Use a dynamic color palette: primary teal (#00C2A8), dark navy (#0A0E1A), with white backgrounds for cards. Ensure the layout is fully responsive for both desktop and mobile views."*

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
*"Build a responsive React component for a sports court booking form. It should include fields for selecting the date, time slots, court type, and number of players. Use useState hooks for state management and style with Tailwind CSS classes consistent with the existing design system."*

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
*"sau đây tôi sẽ gửi các ảnh về thiết kế hệ thống của tôi, bạn hãy code react để thiết kế phần front end để giao diện giống trong ảnh giúp tôi nhé. Như một DEV, hãy code front end bằng react để tạo giao diện giống như ảnh cho dự án của tôi."*

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
*"Please act as an expert Frontend Developer and help me upgrade my existing React (Vite) application located at... Tích hợp thư viện GSAP để tạo hiệu ứng animation. Xây dựng 6 trang cho phân hệ Apex (Booking, Matches, Shop, Profile, Settings, Support) và 4 trang cho phân hệ MatchPro (Trending Feed, Nearby Sports, Community Hub, Leaderboard)."*

### Expected Output
- Cấu trúc UI và CSS layout cho 10 trang mới thuộc phân hệ Apex và MatchPro.
- Tích hợp thư viện `gsap` và `@gsap/react`.
- Animation hiệu ứng cuộn và navbar entrance.

### Evaluation
AI đề xuất đúng thư viện và sinh ra cấu trúc UI chuẩn cho 10 trang mới. Tuy nhiên, logic animation được viết trực tiếp vào từng component gây rối và khó tái sử dụng. Tôi đã tự quyết định





## Prompt #06
**Date:** 2026-06-01  
**AI Tool:** Antigravity (Gemini)  
**Author:** Phạm Nguyễn Tiến Đạt  
**Purpose:** Hoàn thiện phân hệ phụ trợ cho Gear và chuẩn hóa đa ngôn ngữ toàn hệ thống sang Tiếng Anh.
### Prompt
*"sửa ở các chỗ khác luôn xem ở đâu có ngôn ngữ khác chuyển sang tiếng anh tất"*
và
*"hoàn thành các mục trong gear (Equioment catalog, .....)"*
### Expected Output
- Rà soát và dịch thuật toàn bộ các nhãn (labels), từ khóa tiếng Việt còn sót lại trên giao diện sang tiếng Anh nhằm chuẩn hóa Premium UI.
- Mã nguồn React hoàn chỉnh cho 4 trang phụ trợ thuộc phân hệ Gear: `GearRentalTermsPage`, `GearMaintenancePage`, `GearSupportPage`, `GearPrivacyPage`.
- Tự động tích hợp định tuyến (Routing) cho 4 trang mới vào `App.jsx` và cập nhật các liên kết tương ứng tại footer của `GearLayout.jsx`.
### Evaluation
AI đã hoàn thành rất tốt việc sinh cấu trúc UI tĩnh tĩnh cho 4 trang phụ trợ của phân hệ Gear, đảm bảo tính thẩm mỹ, nhất quán và tích hợp thành công vào kiến trúc SPA hiện tại. 
Tuy nhiên, với prompt yêu cầu rà soát và dịch tiếng Việt trên quy mô diện rộng (toàn bộ 40+ file dự án), AI đã tự động phân luồng (spawn) hàng loạt sub-agent chạy song song, lập tức dẫn đến lỗi vượt giới hạn API (Error 429 - Resource Exhausted). Tôi đã phải trực tiếp can thiệp: đình chỉ luồng quét toàn bộ dự án, khoanh vùng lại phạm vi làm việc để ưu tiên tài nguyên hoàn thiện 4 trang lõi của Gear trước nhằm tránh treo hệ thống. Cuối cùng, tôi chỉ định rõ AI phải cập nhật thẻ `<Link>` thay vì thẻ `<a>` tĩnh để bảo toàn luồng chuyển hướng của React Router.




## Prompt #07
**Date:** 2026-06-04  
**AI Tool:** Antigravity (Gemini)  
**Author:** Phạm Nguyễn Tiến Đạt  
**Purpose:** Thiết lập CI Pipeline, tái thiết kế trang About và khởi tạo các trang Nền tảng/Pháp lý (Platform/Legal).

### Prompt
*"làm đi" (sau khi yêu cầu setup Harness CI)*
và
*"hoàn thiện nội dung và giao diện cho phần about (brandMission,.....)"*
và
*"phần mấy cái nút này chưa có giao diện cho nó nè code phần giao diện cho nó"*

### Expected Output
- File cấu hình hệ thống Harness CI (`.harness/prosport_ci_pipeline.yaml`) thực hiện 3 công việc tự động: Build Frontend, Build Backend và rà soát Audit Docs.
- Giao diện đập đi xây lại (Overhaul) toàn diện cho `AboutPage.jsx` với đầy đủ nội dung: Mission, Stats, Journey, Timeline, Leadership Team kết hợp cùng GSAP animations.
- Mã nguồn React hoàn chỉnh cho 3 trang pháp lý (`PrivacyPolicyPage`, `TermsOfServicePage`, `SitemapPage`) và 1 trang nền tảng (`BrandMissionPage`).
- Tự động bổ sung định tuyến vào `App.jsx` và cập nhật các liên kết đang để `#` ở `Footer.jsx` sang link thực tế.

### Evaluation
AI đã sinh code rất xuất sắc. Giao diện trang About và Brand Mission mang đậm chất Premium UI với hiệu ứng cuộn (GSAP ScrollTrigger) mượt mà. File cấu hình CI/CD sinh ra cũng hoàn toàn chính xác. 
Tuy nhiên, quá trình chạy thử gặp lỗi crash server Vite (do thiếu các package `@react-oauth/google` và `axios` sau khi pull code mới từ nhánh main về). Tôi đã phải trực tiếp can thiệp và yêu cầu AI chạy lệnh cài bổ sung dependencies để phục hồi dev server. Ngoài ra, tại trang `BrandMissionPage`, AI đã sử dụng thẻ HTML tĩnh (`<a href="/register">`) làm mất base URL của dự án Vite (gây ra lỗi 404 khi bấm vào nút CTA). Tôi đã phát hiện và chỉ đạo AI đổi lại toàn bộ bằng component `<Link>` của React Router để đảm bảo tính toàn vẹn của cấu trúc Single Page Application (SPA).




## Prompt #08
**Date:** 2026-06-11  
**AI Tool:** Antigravity  
**Author:** Phạm Nguyễn Tiến Đạt  
**Purpose:** Khắc phục lỗi điều hướng Footer, bổ sung GSAP animation cho trang Liên hệ (Contact) và chuẩn hóa hệ thống Keyframe animation toàn cục.
### Prompt
*"chưa vào được phần discover ở phần platform ở Home"*  
và  
*"sửa các Screen đều theo tone màu như thế này để trang web được đồng bộ, chuyên nghiệp"*  
và  
*"cho màu của các trang về như cũ đi chỉ giữ animation th"*
### Expected Output
- Sửa lỗi điều hướng khi click vào liên kết "Discover" ở khu vực Footer để trang tự động cuộn đến đúng section tương ứng trên trang chủ.
- Viết lại toàn bộ trang `ContactPage.jsx` để tích hợp các hiệu ứng GSAP ScrollTrigger cao cấp (Fade-in, Slide, Stagger, Fade-up) và thêm trạng thái gửi form thành công.
- Gom nhóm và chuẩn hóa toàn bộ các keyframe animation đang nằm rải rác về chung một file `index.css`.
- Áp dụng, sau đó hoàn tác (revert) các thay đổi về màu sắc giao diện theo quyết định định hướng sản phẩm.
### Evaluation
AI đã thể hiện khả năng xuất sắc trong việc chẩn đoán lỗi điều hướng. Thay vì chỉ gắn link đơn thuần, AI đã tự động đề xuất và tích hợp hook `useLocation` kết hợp `useEffect` để xử lý mượt mà tác vụ hash-scroll xuyên trang. Quá trình cấu trúc lại hiệu ứng GSAP và chuẩn hóa CSS keyframe cũng được thực hiện rất gọn gàng và tuân thủ nguyên tắc Clean Code.
Tuy nhiên, trong quá trình thực thi, khi nhận được yêu cầu đồng bộ tone màu, AI đã tự động quyết định chuyển đổi toàn bộ giao diện sang Dark Theme (nền tối). Mặc dù giao diện Dark Theme sinh ra rất cao cấp, nhưng do không phù hợp với định hướng thiết kế cốt lõi của dự án ở thời điểm hiện tại, tôi đã phải ra quyết định can thiệp (Human Decision): yêu cầu AI lập tức hoàn tác (revert) toàn bộ mã màu về lại nguyên bản (Light Theme) và chỉ được phép giữ lại các cải tiến về mặt animation. Ngoài ra, tôi cũng trực tiếp review lại toàn bộ logic hash-scroll của AI trước khi commit để đảm bảo tính đúng đắn với cấu hình `basename` của React Router.
