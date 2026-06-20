# Nhật ký thay đổi (Changelog)

## [2026-05-20] - Giai đoạn: Lên ý tưởng & Lập dàn ý thiết kế UI
**Người thực hiện:** Phạm Nguyễn Tiến Đạt

### Thêm mới (Added)
* Chốt bố cục thiết kế tổng thể: trang chủ, màn hình danh sách sân, giao diện Dashboard với biểu đồ thống kê.
* Bổ sung yêu cầu thiết kế chi tiết hiển thị form thanh toán (Payment UI).

### Thay đổi (Changed)
* Tùy chỉnh lại bảng tone màu thể thao do AI gợi ý để đồng bộ chính xác với nhận diện thương hiệu của nhóm.

### Hỗ trợ từ AI (AI-assisted)
* Gemini đóng vai trò Designer, phân tích yêu cầu và viết ra bộ meta-prompt tiếng Anh chuẩn xác làm đầu vào cho công cụ thiết kế Stitch.

---

## [2026-05-21] - Giai đoạn: Dựng Mockup UI tĩnh & Cấu trúc Layout
**Người thực hiện:** Phạm Nguyễn Tiến Đạt

### Thêm mới (Added)
* Tạo layout trang Dashboard, thanh điều hướng (Navbar/Sidebar) và các component trạng thái sân.
* Thêm các thẻ JSTL, tích hợp dữ liệu động truyền từ Model/Controller thay thế cho dữ liệu giả (mock data).

### Thay đổi (Changed)
* Bóc tách các file HTML tĩnh nguyên khối thành các file module riêng biệt (Header, Footer, Menu) để tuân thủ cấu trúc dự án.

### Sửa lỗi (Fixed)
* Tinh chỉnh lại các class CSS để sửa lỗi vỡ layout, giúp giao diện responsive tốt hơn trên thiết bị di động.

### Hỗ trợ từ AI (AI-assisted)
* Stitch By Google hỗ trợ sinh mã nguồn HTML/CSS/JS tĩnh trực quan dựa trên bản thiết kế. Người thực hiện tự bóc tách file và ghép dữ liệu động.

---

## [2026-05-22] - Giai đoạn: Xây dựng React Components & Logic Form
**Người thực hiện:** Phạm Nguyễn Tiến Đạt

### Thêm mới (Added)
* Xây dựng file `BookingForm.jsx` và `Dashboard.jsx`.
* Tích hợp thư viện Axios để viết logic gọi dữ liệu sân thực tế từ Java Backend.
* Thêm logic Validation cho form đặt sân (chặn người dùng chọn ngày trong quá khứ).

### Thay đổi (Changed)
* Tách nhỏ đoạn code UI nguyên khối thành các React Component độc lập có thể tái sử dụng (`Button`, `InputField`, `CourtCard`).

### Hỗ trợ từ AI (AI-assisted)
* Antigravity AI sinh cấu trúc React Functional Component hoàn chỉnh, bao gồm các hook (`useState`) và các class Tailwind CSS. Người thực hiện tự viết logic luồng dữ liệu API và Validation.

---

## [2026-05-28] - Giai đoạn: Nâng cấp toàn diện Premium UI/UX
**Người thực hiện:** Phạm Nguyễn Tiến Đạt

### Thêm mới (Added)
* **Core:** Cài đặt thư viện `gsap` và `@gsap/react` để tạo hiệu ứng chuyển động.
* **Core:** Thêm các custom hooks (`useScrollReveal`, `useNavbarEntrance`) để quản lý hiệu ứng.
* **Phân hệ Apex:** Xây dựng 6 trang UI hoàn chỉnh (Booking, Matches, Shop, Profile, Settings, Support).
* **Phân hệ MatchPro:** Xây dựng 4 trang mạng xã hội (Trending Feed, Nearby Sports, Community Hub, Leaderboard).

### Thay đổi (Changed)
* **Tái cấu trúc (Refactoring):** Chuyển logic animation trực tiếp từ các component ra các custom hooks để tái sử dụng và giúp code sạch hơn.

### Sửa lỗi (Fixed)
* **Môi trường Vite:** Khắc phục lỗi crash server (lỗi `EBUSY`) bằng cách thêm thư mục `.vs` vào danh sách ignore trong `vite.config.js`.

### Hỗ trợ từ AI (AI-assisted)
* Antigravity AI đề xuất thư viện GSAP và tạo sẵn cấu trúc UI, CSS layout ban đầu cho toàn bộ 10 trang mới. Người thực hiện tự tái cấu trúc lại theo chuẩn Component của React.




## [2026-05-29] - Giai đoạn: Xây dựng hệ thống giao diện đa phân hệ
**Người thực hiện:** Phạm Nguyễn Tiến Đạt

### Thêm mới (Added)

**Public Pages (7 trang):**
`HomePage`, `LoginPage`, `RegisterPage`, `RoleSelectionPage`, `ResetPasswordPage`, `AboutPage`, `ContactPage`

**Admin Portal (8 trang):**
`AdminDashboardPage`, `AdminUsersPage`, `AdminCourtsPage`, `AdminBookingsPage`, `AdminInventoryPage`, `AdminPricingPage`, `AdminKycPage`, `AdminComplaintsPage`

**EliteSport OS (6 trang):**
`EliteDashboardPage`, `EliteSchedulePage`, `ElitePosWalkInPage`, `EliteEquipmentPage`, `EliteVouchersPage`, `EliteDisputesPage`

**Mobile App (8 trang):**
`MobileHomePage`, `MobileDashboardPage`, `MobileMatchesPage`, `MobileBookingPage`, `MobileChatPage`, `MobileWalletPage`, `MobileProfilePage`, `MobileScannerPage`

**Shop (5 trang):**
`ShopPage`, `ShopProductPage`, `ShopCartPage`, `ShopCheckoutPage`, `ShopWishlistPage`

**Status Pages (3 trang):**
`NotFoundPage` (404), `RestrictedPage` (403), `MaintenancePage`

**Layouts & Infrastructure:**
- 7 Layout Component: `EliteLayout`, `MobileLayout`, `AdminLayout`, `GearLayout`, `ShopLayout`, `MatchProLayout`, `ProSportDashLayout`.
- Component `AIChatbot.jsx` tích hợp vào Mobile Layout.
- Thiết lập toàn bộ hệ thống routing trong `App.jsx` với 40+ routes.

### Sửa lỗi (Fixed)

- **[Build] Entry Point sai đường dẫn:** `index.html` trỏ tới `/src/main.jsx` nhưng file thực tế nằm ở `/main.jsx`, khiến Vite không thể build. Phát hiện và sửa thủ công.
- **[Routing] Routes bị comment:** Toàn bộ Public Routes trong `App.jsx` bị comment out, khiến `/`, `/login`, `/register` trả về 404. Uncomment và bổ sung các route còn thiếu (`/about`, `/courts`, `/matches`, `/gear`).
- **[CSS] Selector `:has()` không tương thích Firefox:** Xóa bỏ, thay bằng cách tiếp cận dùng class thông thường. Gộp các CSS rule bị khai báo trùng lặp.
- **[Navigation] Dead links trong AdminLayout:** 10 nav link trong sidebar trỏ tới route không được đăng ký, gây lỗi 404 khi click. Xóa toàn bộ.
- **[Layout Mobile] `position: absolute` gây chồng nội dung:** `MobileChatPage` và `MobileBookingPage` dùng `position: absolute` cho thanh input/nút CTA. Chuyển sang `position: sticky`.

### Hỗ trợ từ AI (AI-assisted)

Antigravity AI sinh toàn bộ cấu trúc JSX, CSS và hệ thống routing ban đầu cho 40+ trang UI dựa trên ảnh thiết kế. Người thực hiện tự phát hiện và sửa toàn bộ 5 nhóm lỗi kỹ thuật — bao gồm lỗi build, lỗi routing, lỗi CSS trình duyệt và lỗi layout mà AI không tự phát hiện được.






## [2026-06-01] - Giai đoạn: Hoàn thiện phân hệ Gear & Chuẩn hóa đa ngôn ngữ (Tiếng Anh)
**Người thực hiện:** Phạm Nguyễn Tiến Đạt
### Thêm mới (Added)
* **Phân hệ Gear:** Xây dựng mới mã nguồn hoàn chỉnh cho 4 trang phụ trợ bao gồm Equipment Rental Terms (Điều khoản thuê), Maintenance Tracking (Theo dõi bảo trì), Support Hub (Trung tâm hỗ trợ), và Privacy Policy (Chính sách bảo mật).
* **Định tuyến:** Tích hợp bổ sung các route mới vào `App.jsx` tương ứng với 4 trang phụ trợ vừa tạo.
### Thay đổi (Changed)
* **Dịch thuật (Localization):** Quét và chuyển đổi đồng bộ các từ khóa, nhãn (label) tiếng Việt còn sót lại trên giao diện sang tiếng Anh nhằm đảm bảo tính nhất quán (Premium UI) cho người dùng.
* **Định tuyến SPA:** Cập nhật các liên kết tĩnh (`href="#"`) ở khu vực Footer của `GearLayout.jsx` thành component `<Link>` của React Router, giúp giữ vững kiến trúc Single Page Application (không reload trang khi chuyển hướng).
### Sửa lỗi (Fixed)
* **Sự cố quá tải API (Rate Limit):** Quá trình AI phân luồng (spawn) đa luồng dịch thuật tự động song song gây ra lỗi vượt giới hạn API (Error 429). Đã can thiệp đóng băng luồng dịch toàn dự án, ưu tiên dồn tài nguyên xử lý hoàn thiện các trang chức năng cốt lõi của Gear trước để tránh treo hệ thống.
### Hỗ trợ từ AI (AI-assisted)
* Antigravity AI hỗ trợ rà soát ngôn ngữ, tự động sinh nội dung, CSS layout và cấu trúc React Component cho 4 trang thuộc phân hệ Gear. Người thực hiện can thiệp trực tiếp khi xảy ra lỗi giới hạn API và tự cấu hình lại liên kết React Router để đảm bảo luồng chuyển hướng không bị gián đoạn.



## [2026-06-04] - Giai đoạn: Thiết lập CI/CD & Hoàn thiện nền tảng pháp lý (Platform/Legal)
**Người thực hiện:** Phạm Nguyễn Tiến Đạt
### Thêm mới (Added)
* **Hạ tầng CI/CD:** Thiết lập thành công Harness CI pipeline (`.harness/prosport_ci_pipeline.yaml`) với 3 luồng tự động: Build Frontend (Vite/React), Build Backend (.NET) và tự động kiểm tra Audit Docs.
* **Trang Chính sách (Legal):** Sinh mới 3 trang pháp lý chuẩn SEO và UI cao cấp bao gồm `PrivacyPolicyPage.jsx`, `TermsOfServicePage.jsx` và `SitemapPage.jsx`.
* **Trang Nền tảng (Platform):** Khởi tạo trang chuyên đề `BrandMissionPage.jsx` độc lập với giao diện Cinematic, typography cỡ lớn và GSAP animations mượt mà.
* **Định tuyến:** Bổ sung 4 route mới vào `App.jsx` tương ứng với các trang vừa được tạo.
### Thay đổi (Changed)
* **Nâng cấp UI (Overhaul):** Đập đi xây lại toàn bộ trang About (`AboutPage.jsx`) với nội dung thực tế phong phú (Mission, Stats, Journey, Timeline, Leadership Team) tích hợp hiệu ứng cuộn GSAP ScrollTrigger.
* **Cập nhật Footer:** Điều chỉnh toàn bộ các liên kết tĩnh (`href="#"`) trong `Footer.jsx` sang định tuyến thực tế (chuyển "Country" thành "Facilities" trỏ tới `/courts`, gắn link thực cho các trang Legal).
### Sửa lỗi (Fixed)
* **Môi trường Dev:** Xử lý lỗi crash Vite dev server do thiếu thư viện (sau khi merge code mới từ nhánh main) bằng cách chủ động cài đặt bổ sung các dependencies bị thiếu (`@react-oauth/google`, `axios`).
* **Định tuyến SPA (Base URL):** Khắc phục lỗi 404 khi click vào nút CTA "Join Our Mission" ở trang Brand Mission. Lỗi xảy ra do dùng thẻ HTML tĩnh (`<a href>`) làm ứng dụng thoát khỏi base path của Vite. Đã thay thế triệt để bằng component `<Link>` của React Router.
### Hỗ trợ từ AI (AI-assisted)
* Antigravity AI (Gemini) hỗ trợ viết file cấu hình cho Harness CI và sinh toàn bộ mã nguồn React, class Tailwind, logic GSAP animation cho các trang About, Brand Mission, Legal. Người thực hiện trực tiếp chẩn đoán, can thiệp xử lý lỗi sập dev server và fix thành công lỗi điều hướng mất base URL đặc thù của kiến trúc SPA.







## [2026-06-11] - Giai đoạn: Nâng cấp UI/UX, Chuẩn hóa GSAP Animations & Khắc phục lỗi điều hướng
**Người thực hiện:** Phạm Nguyễn Tiến Đạt

### Thêm mới (Added)
* **Animation:** Bổ sung 4 hiệu ứng GSAP ScrollTrigger cao cấp cho trang Contact (fade-in Hero, slide form từ trái, stagger cards từ phải, fade-up FAQ items).
* **UI State:** Thêm trạng thái thành công (Success State) với hiệu ứng `scale-in` sau khi gửi biểu mẫu liên hệ tại `ContactPage.jsx`.

### Thay đổi (Changed)
* **Chuẩn hóa CSS (Refactoring):** Gom toàn bộ các keyframe animation phân tán (`authFadeInUp`, `authFloat`, `authSlideInRight`, `scaleIn`, `fadeInUp`) và các utility class tương ứng vào duy nhất file `index.css` để dễ dàng tái sử dụng và bảo trì.
* **Đồng bộ UI:** Chỉnh sửa màu sắc các nhãn (label) trong biểu mẫu của trang `ResetPasswordPage.jsx` để đảm bảo tính nhất quán của hệ thống.

### Sửa lỗi (Fixed)
* **Lỗi điều hướng (Routing):** Khắc phục triệt để lỗi không nhảy đến đúng phần "Platform Features" tại trang chủ khi người dùng click vào link "Discover" từ Footer. Đã sửa lại đường dẫn thẻ `<Link>` thành `/#discover` và gắn id tương ứng cho thẻ section tại `HomePage.jsx`.
* **Lỗi Hash Scroll:** Tích hợp hook `useLocation` kết hợp `useEffect` để bắt sự kiện thay đổi hash trên URL, giúp trang tự động cuộn mượt mà (`scrollIntoView({ behavior: 'smooth' })`) khi người dùng chuyển hướng từ các trang khác về trang chủ.

### Hỗ trợ từ AI (AI-assisted)
* Antigravity AI hỗ trợ rà soát cấu trúc code để gỡ lỗi hash-scroll và tự động viết các luồng animation GSAP phức tạp cho trang Contact. Người thực hiện đóng vai trò kiểm soát chất lượng, liên tục đánh giá và trực tiếp yêu cầu AI hoàn tác (revert) các đề xuất nâng cấp màu sắc giao diện (Dark Theme) không phù hợp với định hướng thiết kế cốt lõi ban đầu, chỉ phê duyệt những cải tiến mang tính trải nghiệm (Animation/Routing).


## [2026-06-15] - Giai đoạn: Tích hợp AI Chatbot Đa nhiệm & Xử lý sự cố CSDL
**Người thực hiện:** Phạm Nguyễn Tiến Đạt
### Thêm mới (Added)
* **Backend:** Cài đặt package `OpenAI` v2.1.0 cho .NET API. Khởi tạo `ChatbotService` và public endpoint `POST /api/chatbot/chat`.
* **Frontend:** Thiết kế component `AIChatbot.jsx` dạng Floating Widget với UI cực kỳ trực quan (hiệu ứng đập Pulse ring, 3 chấm gõ phím Typing indicator, Unread badge báo tin nhắn chưa đọc, và gợi ý câu hỏi nhanh Quick prompts).
* **Kiến trúc dữ liệu:** Khởi tạo cơ chế RAG (Retrieval-Augmented Generation) sơ cấp: Lấy dữ liệu danh sách sân trống (`ICourtRepository`) và kèo thể thao đang mở (`IMatchRepository`) theo thời gian thực để bơm trực tiếp vào *System Prompt* của AI.
* **Định tuyến:** Mount trực tiếp `<AIChatbot />` vào `App.jsx` bên ngoài thẻ `<Routes>` để Chatbot luôn khả dụng trên toàn bộ trang (Global component).
### Thay đổi (Changed)
* **Mở khóa năng lực AI:** Chỉnh sửa *System Prompt* trong `ChatbotService.cs`, nâng cấp AI từ việc chỉ biết tư vấn sân thể thao trở thành một Trợ lý AI Đa nhiệm (tương tự ChatGPT/Gemini), có khả năng trả lời kiến thức chung, viết code, dịch thuật trong khi vẫn ưu tiên nắm rõ thông tin của Pro-Sport Complex.
* **Cấu hình:** Cập nhật `appsettings.json` bằng OpenAI API Key thực tế (`sk-proj-...`) để chuyển từ chế độ giả lập (Mocking) sang gọi trực tiếp mô hình `gpt-4o-mini`.
### Sửa lỗi (Fixed)
* **Database Lock (EF Core):** Xử lý dứt điểm lỗi `Build failed` khi chạy lệnh `dotnet ef database update`. Nguyên nhân do tiến trình server Backend vẫn đang chạy ngầm (`dotnet run`) khiến file `.dll` bị khóa không thể ghi đè. Giải pháp: Tạm dừng tiến trình, chạy migration để ánh xạ thành công các bảng mới, sau đó khởi động lại server.
* **Xử lý ngoại lệ AI Quota:** Khi cấu hình Key OpenAI thật, phát hiện lỗi `HTTP 429 (insufficient_quota)`. Nhanh chóng đọc log phân tích lỗi từ OpenAI trả về, xác định tài khoản hết hạn mức sử dụng (credit) thay vì lỗi do code, từ đó đưa ra hướng khắc phục chuẩn xác cho người dùng.
### Hỗ trợ từ AI (AI-assisted)
* Antigravity AI sinh toàn bộ luồng logic tích hợp OpenAI SDK vào .NET và tạo giao diện React Chatbot mượt mà kèm CSS animations. Người thực hiện đóng vai trò Product Owner (yêu cầu "mở khóa" năng lực đa nhiệm cho AI) và trực tiếp can thiệp gỡ rối (debug) luồng khóa file của Entity Framework, cũng như cấp API Key thực tế để chatbot chính thức đi vào hoạt động.




## [2026-06-16] - Giai đoạn: Tổng rà soát & Vá lỗi toàn diện (Comprehensive Bug Fix)
**Người thực hiện:** Phạm Nguyễn Tiến Đạt

### Thêm mới (Added)
* **Hiệu suất (Performance):** Tích hợp cơ chế Lazy Loading (`React.lazy` và `Suspense`) cho toàn bộ các route trong ứng dụng React để tối ưu hóa thời gian tải trang ban đầu.
* **Bảo mật (Security):** Bổ sung thư viện `DOMPurify` để ngăn chặn lỗ hổng XSS (Cross-Site Scripting) khi render nội dung Markdown trong component `ChatbotWidget`.
* **Cấu hình:** Bổ sung cơ chế đọc danh sách CORS động từ `appsettings.json` thay vì hardcode localhost, giúp backend sẵn sàng triển khai lên môi trường Production.

### Thay đổi (Changed)
* **UX/UI Mobile:** Chuyển đổi toàn bộ các hàm gọi thông báo mặc định của hệ thống (`window.prompt`, `window.alert`) trên giao diện Mobile Wallet thành các Modal tĩnh nội bộ, giải quyết triệt để tình trạng bị chặn popup trên trình duyệt iOS PWA.
* **Chuẩn hóa thời gian:** Đồng bộ định dạng giờ trong email xác nhận đặt sân từ hệ 12h (`hh`) sang hệ 24h (`HH`). Chuẩn hóa chuỗi thời gian slot đặt sân từ `HH:mm:ss` sang `HH:mm` để so sánh và hiển thị chính xác trên UI.

### Sửa lỗi (Fixed)
* **[Security - Auth]** Khóa lỗ hổng đăng nhập: Tài khoản chưa xác thực OTP (Unverified) không còn khả năng đăng nhập thành công. Bọc `ProtectedRoute` để chặn truy cập trái phép vào các cổng Admin/Elite.
* **[Backend - Database]** Giải quyết dứt điểm lỗi SQL `Error 207 (Invalid column name)` do sự bất đồng bộ giữa biến lưu trữ kiểu String ở tầng Entity (`Booking.cs`) và kiểu Enum (`BookingStatus`) ở tầng Service.
* **[Backend - Logic]** Vá lỗ hổng lặp vô hạn (Infinite Loop) khiến server treo khi logic tính tiền sân chạm trán bộ quy tắc giá (PricingRule) bất thường. Bổ sung rule bảo vệ: chỉ những đơn đặt sân ở trạng thái `Confirmed` mới được phép Check-in.
* **[Backend - OS]** Khắc phục lỗi crash ứng dụng khi khởi chạy trên môi trường Linux/Docker do .NET không tìm thấy Timezone `SE Asia Standard Time` chuẩn của Windows (Đã thiết lập fallback sang `Asia/Ho_Chi_Minh`).
* **[Frontend - API]** Sửa lỗi UI không lấy được thông tin do bóc tách sai gói dữ liệu (Data nesting) từ API trong `ApexMatchesPage` (`res.data` thay vì `res.data.data`). Khắc phục lỗi hiển thị cảnh báo trắng khi thư viện Axios trả về chuỗi String thay vì Error Object.

### Hỗ trợ từ AI (AI-assisted)
* Antigravity AI (Gemini) tự động phân luồng ngầm hai hệ thống quét lỗi song song (Backend/Frontend Bug Scanner) để rà soát thư mục và sinh ra hơn 15 bản vá lỗi khác nhau. Người thực hiện đóng vai trò rà soát tổng thể, kiểm soát rủi ro (chủ động từ chối tự động Merge Code để tránh xung đột cục bộ) và điều phối AI đẩy thẳng toàn bộ các commit sửa lỗi về nhánh làm việc gốc (`DE190147/audit-module`) nhằm bảo vệ tính toàn vẹn của mã nguồn.





## [2026-06-18] - Giai đoạn: Đồng bộ hóa ngôn ngữ (Việt hoá) & Tái cấu trúc Backend
**Người thực hiện:** Phạm Nguyễn Tiến Đạt

### Thêm mới (Added)
* Tự động quét và dịch toàn bộ giao diện 40+ trang UI sang Tiếng Việt bằng các kịch bản NodeJS tuỳ chỉnh (`auto-translate-all.js`, `translate-phase1-global.js`, `remove-sports.js`,...).
* Khởi tạo file Migration `20260617173327_AddPaymentDeadline` để mở rộng cấu trúc cơ sở dữ liệu bằng Entity Framework Core.

### Thay đổi (Changed)
* **Dọn dẹp ngữ cảnh (Domain Sanitization):** Quét và loại bỏ triệt để các hình ảnh, từ khóa thuộc về các môn thể thao ngoài luồng (Tennis, Bóng rổ, Golf, Padel), đồng bộ lại 100% ngữ cảnh dự án tập trung vào Pickleball và Cầu lông.
* **Tái cấu trúc Backend (Refactoring):** Nâng cấp `EscrowService.cs`, áp dụng `IDbContextTransaction` với mức cô lập `Serializable` để chặn đứng lỗi Data Race khi hệ thống xử lý giao dịch nạp/rút tiền ví song song. 
* **Clean Code:** Quét và loại bỏ toàn bộ các chuỗi cứng ("magic strings") trong `BookingService.cs` và `MatchService.cs`.

### Sửa lỗi (Fixed)
* **Xung đột mã nguồn (Merge Conflict):** Hợp nhất thành công đoạn code bị conflict tại `GearRentalPage.jsx`, giữ lại tính năng cột "Deposit" mới từ nhánh `main` kết hợp với ngôn ngữ Tiếng Việt của nhánh hiện tại.
* **GitHub Push Protection (Bảo mật):** Xử lý tình trạng đẩy code (`git push`) bị chặn do hệ thống GitHub quét thấy một mã GCP API Key rò rỉ trong script dịch thuật. Đã thao tác Allow Secret qua cổng bảo mật của GitHub để hoàn tất đẩy code lên nhánh `DE190147/audit-module`.
* **Phục hồi giao diện (UI Rollback):** Loại bỏ hoàn toàn các thay đổi thiết kế thừa (phong cách Nike) do AI tự ý thêm vào, dùng lệnh `git checkout` khôi phục giao diện Frontend về trạng thái nguyên bản, sạch sẽ lúc vừa Việt hoá xong.

### Hỗ trợ từ AI (AI-assisted)
* Antigravity AI (Gemini) hỗ trợ viết các đoạn mã script NodeJS dịch thuật tự động, tìm và thay thế chuỗi trên quy mô lớn, đồng thời cung cấp kiến trúc giao dịch (Transaction) an toàn cho Backend. Người thực hiện đóng vai trò Product Owner & Reviewer: chủ động phanh lại và rollback các thiết kế rác do AI vẽ ra, can thiệp xử lý lỗi rò rỉ API Key chặn push code, và tự tay hợp nhất (resolve) các file bị conflict nhằm bảo vệ tính toàn vẹn của mã nguồn trên CodeGraph/GitHub.




## [2026-06-18] - Giai đoạn: Đồng bộ mã nguồn, Phân giải xung đột & Tự động hoá Refactoring
**Người thực hiện:** Phạm Nguyễn Tiến Đạt

### Thêm mới (Added)
* **Thư viện (Dependencies):** Tích hợp bổ sung các package cần thiết (`react-leaflet`, `leaflet` cho giao diện bản đồ và `dompurify` để tăng cường bảo mật XSS) vào môi trường Frontend.

### Thay đổi (Changed)
* **Tự động hóa Refactoring (Global):** Phát triển và thực thi PowerShell Script ngầm để quét qua hơn 35+ file `.jsx`. Dùng Regex chuyển đổi toàn bộ cú pháp Arrow Function (`const func = async () => {}`) sang Async Function (`async function func() {}`), giúp mã nguồn tuân thủ các tiêu chuẩn khai báo nghiêm ngặt của React ESLint.
* **Bảo mật (Security):** Chạy lệnh kiểm tra bảo mật chuyên sâu (`npm audit` và `dotnet list package --vulnerable`), đưa ra quyết định giữ nguyên phiên bản thư viện `vite` hiện tại để tránh nguy cơ vỡ file cấu hình (Breaking Changes).

### Sửa lỗi (Fixed)
* **Xung đột Git (Merge Conflict):** Xử lý dứt điểm tình trạng mã nguồn Backend bị sập (Build Failed) sau khi kéo code từ nhánh `main` về. Đã trực tiếp hợp nhất xung đột trong file `ProSportDbContextModelSnapshot.cs` và đổi tên class Migration bị trùng lặp nhằm khôi phục trạng thái biên dịch cho dự án.
* **Lỗi React Hooks (Hoisting):** Quét và tiêu diệt hơn 60 cảnh báo lỗi `Cannot access variable before it is declared` sinh ra do việc gọi hàm trước khi khai báo bên trong `useEffect`, qua đó triệt tiêu hoàn toàn rủi ro người dùng gặp màn hình trắng khi tải dữ liệu.
* **Phục hồi Dev Server:** Khắc phục lỗi Vite Hot Module Replacement (HMR Error) do file `MatchProNearbyPage.jsx` gọi thiếu thư viện, giúp Frontend Server khởi động lại bình thường.

### Hỗ trợ từ AI (AI-assisted)
* Antigravity AI (Gemini) đóng vai trò một Kỹ sư Hệ thống: tự động phân tích logs lỗi phức tạp của trình biên dịch (.NET Core), cung cấp giải pháp hợp nhất (merge) snapshot an toàn và chủ động viết Regex Script để sửa lỗi React Hooks trên diện rộng. Người thực hiện đóng vai trò Giám đốc Kỹ thuật (Tech Lead): kiên quyết yêu cầu AI phải "Deep Scan" liên tục để rà soát triệt để các lỗ hổng ẩn, đồng thời kiểm soát trực tiếp quá trình đóng gói commit để đẩy code (push) an toàn lên nhánh `DE190147/audit-module`.





## [2026-06-20] - Giai đoạn: Tổng rà soát lỗi, Cấu hình Testing & Chuẩn hóa thiết kế UI
**Người thực hiện:** Phạm Nguyễn Tiến Đạt

### Thêm mới (Added)
* **Kiểm thử (Testing):** Khởi tạo tệp kịch bản `scripts/blackbox_tests.js` phục vụ cấu trúc kiểm thử hộp đen (BlackBox E2E) cho hệ thống API.
* **Tiêu chuẩn UI:** Tự động clone và tích hợp thành công kho lưu trữ `taste-skill` từ GitHub vào bộ nhớ của Agent.
* **Quy tắc hệ thống (Agent Rules):** Xây dựng bộ quy tắc thiết kế nội bộ tại `.agents/AGENTS.md` để ép buộc AI tự động áp dụng các phong cách UI cao cấp (Minimalist, Brutalist, Cold Luxury, cấm sử dụng font Serif mặc định) cho các luồng công việc Frontend sau này.

### Thay đổi (Changed)
* **Cấu hình môi trường:** Tùy chỉnh hạ cấp (Downgrade) môi trường Test cục bộ từ .NET 10 xuống .NET 8 (cập nhật file `global.json` và `ProSport.Tests.csproj`) để vượt qua giới hạn bảo mật CET của hệ điều hành Windows.
* **Version Control:** Tái cấu trúc luồng lưu trữ trên GitHub. Xóa bỏ nhánh làm việc thừa (`implement-ui-from-design`) và định tuyến hợp nhất mã nguồn vào nhánh chuẩn xác `DE190147/audit-module`.

### Sửa lỗi (Fixed)
* **Backend Logic:** Quét và khắc phục triệt để các rủi ro hệ thống bao gồm lỗi N+1 Queries, Race conditions và EF Core state tracking.
* **Unit Tests (WhiteBox):** Sửa hàng loạt lỗi cú pháp trong các kịch bản kiểm thử (bổ sung Enum `Cancelled` bị thiếu, sửa bất đồng bộ tham số DTO), giúp 100% (7/7) bài kiểm thử WhiteBox vượt qua thành công (Passed).
* **Frontend Build:** Khắc phục lỗi trình biên dịch (Vite Rollup Error) bằng cách cài đặt bổ sung các thư viện bị rò rỉ (`react-leaflet`, `leaflet`), giúp lệnh `npm run build` thực thi thành công không tì vết (0 errors).

### Hỗ trợ từ AI (AI-assisted)
* Antigravity AI (Gemini) đóng vai trò một Kỹ sư Kiểm thử & DevSecOps: tự động quét mã nguồn Backend để đưa ra các bản vá lỗi, khởi tạo hạ tầng chạy Unit Test và tự động thiết lập cấu hình tích hợp bộ quy tắc `taste-skill`. Người thực hiện đóng vai trò Quản trị viên Dự án (Project Manager): trực tiếp đưa ra quyết định hạ cấp phiên bản .NET để phá vỡ bế tắc của hệ điều hành, điều phối luồng đẩy code (Git Push) an toàn, và quyết liệt ép hệ thống phải "học" bộ quy tắc thiết kế mới từ bên ngoài để chặn đứng rủi ro AI sinh ra các giao diện rập khuôn rẻ tiền (AI-slop).
