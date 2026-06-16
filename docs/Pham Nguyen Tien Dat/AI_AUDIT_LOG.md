# AI Audit Log

## Log #01
- **Ngày:** 2026-05-20
- **Người thực hiện:** Phạm Nguyễn Tiến Đạt
- **Công cụ AI:** Gemini
- **Mục đích:** Tạo prompt để hướng dẫn Stitch thiết kế giao diện web UI.
- **Tham chiếu Prompt:** "Như là một DESIGNER, bạn hãy cho tôi prompt để hướng dẫn Stitch làm phần thiết kế UI tĩnh cho dự án Pro-Sport Complex Management System của tôi..."

### Tóm tắt kết quả AI
- AI đóng vai trò Designer, phân tích các thành phần cần thiết và trả về một bộ prompt tiếng Anh chi tiết được tối ưu cho Stitch.
- Đề xuất bảng màu thể thao, năng động, bố cục trang chủ, màn hình danh sách sân và giao diện dashboard với các biểu đồ thống kê cơ bản.

### Quyết định & Can thiệp của con người
- **Chấp nhận:** Sử dụng nguyên cấu trúc prompt tiếng Anh và các gợi ý bố cục UI.
- **Can thiệp kỹ thuật:** Tùy chỉnh lại tone màu trong prompt của AI để khớp với nhận diện thương hiệu đã chốt của nhóm. Thêm yêu cầu cụ thể hiển thị form thanh toán chi tiết (Payment UI) mà ban đầu AI bỏ sót.

### Áp dụng cho
- Prompt đầu vào cho công cụ Stitch By Google.

### Kiểm chứng
- Đánh giá độ hoàn thiện của prompt được tạo ra. Hướng thiết kế giao diện có độ chính xác cao, mặc dù vẫn cần tinh chỉnh thủ công một chút để các component khớp hoàn toàn với luồng người dùng (User Flow).

---

## Log #02
- **Ngày:** 2026-05-21
- **Người thực hiện:** Phạm Nguyễn Tiến Đạt
- **Công cụ AI:** Stitch By Google
- **Mục đích:** Tạo UI và code Frontend tĩnh dựa trên prompt đã chuẩn bị.
- **Tham chiếu Prompt:** "Design a clean and modern dashboard for a sports complex management system. Include a sidebar for navigation..."

### Tóm tắt kết quả AI
- Sinh ra mã nguồn (HTML/CSS/JS) cho một giao diện web trực quan.
- Tạo layout trang Dashboard, thanh điều hướng (Navbar/Sidebar), và các component hiển thị trạng thái sân (trống/đã đặt/đang bảo trì).

### Quyết định & Can thiệp của con người
- **Chấp nhận:** Sử dụng toàn bộ cấu trúc Layout, lưới (Grid/Flexbox) và mã màu CSS cho các trang lõi.
- **Can thiệp kỹ thuật 1 (Tách Component):** Tách các file HTML tĩnh nguyên khối thành các file `.jsp` riêng biệt (Header, Footer, Menu) để tái sử dụng theo cấu trúc Java Web.
- **Can thiệp kỹ thuật 2 (Dữ liệu động & Sửa lỗi Responsive):** Thêm các thẻ JSTL, thay thế dữ liệu giả (mock data) của Stitch bằng dữ liệu động truyền từ Model/Controller, và tinh chỉnh các class CSS để responsive tốt hơn trên thiết bị di động.

### Áp dụng cho
- Các file `.jsx` (Header, Footer, Menu).
- Các layout UI Frontend.

### Kiểm chứng
- Đối chiếu giao diện thực tế với bản nháp do Stitch sinh ra để đảm bảo tính đồng bộ về màu sắc và layout.
- Tiến hành test trực quan trên cả màn hình PC và Mobile bằng DevTools của trình duyệt.

---

## Log #03
- **Ngày:** 2026-05-22
- **Người thực hiện:** Phạm Nguyễn Tiến Đạt
- **Công cụ AI:** Antigravity
- **Mục đích:** Thiết kế và sinh mã nguồn cho các React UI Component.
- **Tham chiếu Prompt:** "Build a responsive React component for a sports court booking form. It should include fields for selecting the date, time slots, court type..."

### Tóm tắt kết quả AI
- Trả về một cấu trúc React Functional Component hoàn chỉnh.
- Bao gồm các hook cơ bản (`useState`) để quản lý trạng thái form và các thẻ JSX được style bằng các class Tailwind CSS.

### Quyết định & Can thiệp của con người
- **Chấp nhận:** Tái sử dụng toàn bộ cấu trúc JSX và class Tailwind CSS cho form đặt sân, hiển thị danh sách sân và component Dashboard.
- **Can thiệp kỹ thuật 1 (Tái cấu trúc - Refactoring):** Tách nhỏ mã code nguyên khối do AI sinh ra thành các React Component có thể tái sử dụng (ví dụ: `Button`, `InputField`, `CourtCard`).
- **Can thiệp kỹ thuật 2 (Tích hợp API & Validation):** Tự viết tay logic gọi API (Axios) để lấy dữ liệu sân thực tế từ Java Backend thay vì dùng dữ liệu tĩnh. Thêm logic validation cho form để chặn người dùng chọn ngày trong quá khứ trước khi submit.

### Áp dụng cho
- `BookingForm.jsx`
- `Dashboard.jsx`
- Thư viện UI Component (`Button`, `InputField`, `CourtCard`)

### Kiểm chứng
- Các component được chạy và test trong môi trường `localhost:3000`.
- Mở tab Network và Console trong Chrome DevTools để theo dõi các component render thừa và đảm bảo việc gọi API tuân thủ chuẩn RESTful.

---

## Log #04
- **Ngày:** 2026-05-28
- **Người thực hiện:** Phạm Nguyễn Tiến Đạt
- **Công cụ AI:** Antigravity
- **Mục đích:** Tích hợp hiệu ứng GSAP, sửa lỗi môi trường Vite và xây dựng 10 trang UI hoàn chỉnh.
- **Tham chiếu Prompt:** "Please act as an expert Frontend Developer and help me upgrade my existing React (Vite) application located at..."

### Tóm tắt kết quả AI
- Đề xuất cài đặt thư viện `gsap` và `@gsap/react`.
- Tạo form UI cho 6 trang phân hệ Apex (Booking, Matches, Shop, Profile, Settings, Support).
- Tạo layout và 4 trang cho phân hệ MatchPro (Trending Feed, Nearby Sports, Community Hub, Leaderboard).

### Quyết định & Can thiệp của con người
- **Chấp nhận:** Áp dụng toàn bộ cấu trúc UI và CSS layout do AI gợi ý.
- **Can thiệp kỹ thuật 1 (Tái cấu trúc code):** Nhận thấy việc viết code animation trực tiếp vào component gây rối mắt. Đã quyết định tách logic GSAP thành các custom hooks (`useScrollReveal`, `useNavbarEntrance`) để tái sử dụng và giúp code sạch hơn.
- **Can thiệp kỹ thuật 2 (Sửa lỗi môi trường):** Tự chẩn đoán và cấu hình lại `vite.config.js` để ignore thư mục `.vs`. Việc này đã giải quyết dứt điểm lỗi crash server `EBUSY` — một vấn đề mà AI ban đầu không lường trước được do đặc thù máy tính cá nhân.

### Áp dụng cho
- `vite.config.js`
- `App.jsx`
- `src/hooks/`
- `src/pages/apex/` & `src/pages/matches/`

### Kiểm chứng
- Server Vite hiện tại chạy ổn định mà không bị crash khi hot-reload.
- Giao diện render hoàn hảo tại các route `/apex` và `/matches`, với hiệu ứng cuộn và animation xuất hiện mượt mà.





## Log #05
**Ngày:** 2026-05-29 
**Người thực hiện:** Phạm Nguyễn Tiến Đạt  
**Công cụ AI:** Antigravity  
**Mục đích:** Xây dựng toàn bộ hệ thống giao diện đa phân hệ (Elite OS, Mobile App, Admin Portal, Shop, Public Pages, Status Pages).  
**Tham chiếu Prompt:** *"sau đây tôi sẽ gửi các ảnh về thiết kế hệ thống của tôi, bạn hãy code react để thiết kế phần front end để giao diện giống trong ảnh giúp tôi nhé..."*

---

### Tóm tắt kết quả AI

- Sinh ra **40+ React pages** phủ khắp 6 phân hệ độc lập từ ảnh thiết kế:
  - **Public Pages (7 trang):** `HomePage`, `LoginPage`, `RegisterPage`, `RoleSelectionPage`, `ResetPasswordPage`, `AboutPage`, `ContactPage`
  - **Admin Portal (8 trang):** `AdminDashboardPage`, `AdminUsersPage`, `AdminCourtsPage`, `AdminBookingsPage`, `AdminInventoryPage`, `AdminPricingPage`, `AdminKycPage`, `AdminComplaintsPage`
  - **EliteSport OS (6 trang):** `EliteDashboardPage`, `EliteSchedulePage`, `ElitePosWalkInPage`, `EliteEquipmentPage`, `EliteVouchersPage`, `EliteDisputesPage`
  - **Mobile App (8 trang):** `MobileHomePage`, `MobileDashboardPage`, `MobileMatchesPage`, `MobileBookingPage`, `MobileChatPage`, `MobileWalletPage`, `MobileProfilePage`, `MobileScannerPage`
  - **Shop (5 trang):** `ShopPage`, `ShopProductPage`, `ShopCartPage`, `ShopCheckoutPage`, `ShopWishlistPage`
  - **Status Pages (3 trang):** `NotFoundPage` (404), `RestrictedPage` (403), `MaintenancePage`
- Tạo **6 Layout Component** riêng biệt: `EliteLayout`, `MobileLayout`, `AdminLayout`, `GearLayout`, `ShopLayout`, `MatchProLayout`, `ProSportDashLayout`.
- Tạo component `AIChatbot.jsx` tích hợp vào layout Mobile.
- Thiết lập toàn bộ hệ thống routing trong `App.jsx` với 40+ routes.

---

### Quyết định & Can thiệp của con người

**Chấp nhận:** Tái sử dụng toàn bộ cấu trúc JSX, CSS, và logic routing do AI sinh ra làm nền tảng.

**Can thiệp kỹ thuật 1 (Sửa lỗi Build — Entry Point):** AI sinh ra file `index.html` với đường dẫn script trỏ sai (`/src/main.jsx` thay vì `/main.jsx`) khiến Vite không thể build. Tự phát hiện và sửa thủ công — AI không tự nhận ra do không kiểm tra cấu trúc thư mục thực tế.

**Can thiệp kỹ thuật 2 (Sửa lỗi Routing):** AI để comment toàn bộ các route Public trong `App.jsx` khiến trang chủ `/` và các trang `/login`, `/register` trả về 404. Ngoài ra, các route `/about`, `/courts`, `/matches`, `/gear` tồn tại ở Navbar nhưng không được đăng ký. Tự bổ sung và uncomment toàn bộ.

**Can thiệp kỹ thuật 3 (Sửa lỗi CSS tương thích trình duyệt):** AI sử dụng selector CSS `:has()` không được hỗ trợ trên Firefox, gây vỡ layout trên một số trình duyệt. Xóa bỏ toàn bộ, thay bằng cách tiếp cận dùng class thông thường. Đồng thời phát hiện và gộp các CSS rule bị khai báo trùng lặp.

**Can thiệp kỹ thuật 4 (Sửa lỗi Navigation):** AI sinh ra 10 nav link trong `AdminLayout` (Matches, Inventory, Rentals, Products, Payments, Vouchers...) trỏ tới các route không được đăng ký trong `App.jsx`, gây lỗi 404 khi click vào sidebar. Tự phát hiện và xóa toàn bộ các link không hợp lệ.

**Can thiệp kỹ thuật 5 (Sửa lỗi Layout Mobile):** `MobileChatPage` và `MobileBookingPage` sử dụng `position: absolute` cho thanh input/nút sticky, gây chồng lấp nội dung do không nhận biết được scroll container thực tế của `MobileLayout`. Chuyển sang `position: sticky` để xử lý đúng hành vi.

---

### Áp dụng cho

- `src/frontend/src/App.jsx` — Cấu hình toàn bộ routing
- `src/frontend/index.html` — Sửa entry point
- `src/frontend/src/layouts/` — Toàn bộ 7 file Layout
- `src/frontend/src/pages/` — Toàn bộ 40+ trang UI
- `src/frontend/src/components/AIChatbot.jsx`

---

### Kiểm chứng

- Chạy `npm run build` để xác nhận **0 lỗi**, **108 modules** transform thành công.
- Duyệt thủ công qua 40+ route trên `localhost:5173` để xác nhận không có trang nào trả về 404.
- Kiểm tra giao diện Mobile trên Chrome DevTools (Device Toolbar) ở kích thước 414px để xác nhận layout không bị vỡ.
- Kiểm tra trên Firefox để xác nhận lỗi `:has()` đã được xử lý hoàn toàn.

## Log #06
**Ngày:** 2026-06-01  
**Người thực hiện:** Phạm Nguyễn Tiến Đạt  
**Công cụ AI:** Antigravity (Gemini)  
**Mục đích:** Hoàn thiện phân hệ Gear (Trang thông tin & phụ trợ) và chuẩn hóa đa ngôn ngữ (Tiếng Anh).  
**Tham chiếu Prompt:** "sửa ở các chỗ khác luôn xem ở đâu có ngôn ngữ khác chuyển sang tiếng anh tất", "hoàn thành các mục trong gear (Equioment catalog, .....)"  
**Tóm tắt kết quả AI**
* Quét và dịch các từ khóa tiếng Việt còn sót lại sang tiếng Anh để chuẩn hóa giao diện.
* Tạo mới mã nguồn hoàn chỉnh cho 4 trang phụ trợ của phân hệ Gear: Equipment Rental Terms (Điều khoản thuê), Maintenance Tracking (Theo dõi bảo trì), Support Hub (Trung tâm hỗ trợ), Privacy Policy (Chính sách bảo mật).
* Tự động cập nhật `App.jsx` để thêm các route mới và chỉnh sửa `GearLayout.jsx` để gắn link thực vào footer.
**Quyết định & Can thiệp của con người**
* **Chấp nhận:** Áp dụng toàn bộ nội dung, layout và CSS nội bộ do AI sinh ra cho 4 trang thuộc phân hệ Gear. Các giao diện rất đồng nhất và tuân thủ đúng chuẩn Premium UI.
* **Can thiệp kỹ thuật 1 (Xử lý sự cố API Quota):** Khi yêu cầu AI rà soát và dịch tiếng Việt trên toàn bộ 40+ file, AI đã tự động phân luồng (spawn) quá nhiều sub-agent chạy song song gây ra lỗi vượt quá giới hạn API (Error 429 - Resource Exhausted). Đã quyết định can thiệp: dừng ngang các luồng dịch thuật tự động, chủ động thu hẹp phạm vi và chuyển AI sang task hoàn thiện giao diện phân hệ Gear trước để tránh nghẽn luồng.
* **Can thiệp kỹ thuật 2 (Định tuyến SPA):** Ban đầu các link do thiết kế tĩnh thường để `href="#"`. Yêu cầu AI can thiệp thay thế toàn bộ bằng component `<Link>` của React Router trong file `GearLayout.jsx`, đảm bảo ứng dụng giữ vững cấu trúc Single Page Application không bị reload trang khi chuyển hướng.
**Áp dụng cho**
* `src/frontend/src/pages/gear/GearRentalTermsPage.jsx`
* `src/frontend/src/pages/gear/GearMaintenancePage.jsx`
* `src/frontend/src/pages/gear/GearSupportPage.jsx`
* `src/frontend/src/pages/gear/GearPrivacyPage.jsx`
* `src/frontend/src/layouts/GearLayout.jsx`


### Log #07
**Ngày:** 2026-06-04  
**Người thực hiện:** Phạm Nguyễn Tiến Đạt  
**Công cụ AI:** Antigravity 
**Mục đích:** Khởi tạo CI Pipeline, nâng cấp toàn diện trang About và hoàn thiện các trang Chính sách pháp lý (Legal) & Nền tảng (Platform).  
**Tham chiếu Prompt:** *"làm đi" (setup Harness CI)*, *"hoàn thiện nội dung và giao diện cho phần about (brandMission,.....)"*, *"phần mấy cái nút này chưa có giao diện cho nó nè code phần giao diện cho nó"*, *"phần brand mission chưa có giao diện"*

**Tóm tắt kết quả AI**
* Thiết lập thành công hệ thống Harness CI pipeline (`.harness/prosport_ci_pipeline.yaml`) với 3 stage: Build Frontend (Vite/React), Build Backend (.NET) và tự động rà soát sự tồn tại của Audit Docs.
* Đập đi xây lại (Overhaul) toàn bộ trang `AboutPage.jsx` với nội dung thực tế (Mission, Stats, Journey, Timeline, Leadership Team) kèm hiệu ứng GSAP ScrollTrigger cao cấp.
* Sinh ra 3 trang chính sách pháp lý (Legal) mới: `PrivacyPolicyPage.jsx`, `TermsOfServicePage.jsx` và `SitemapPage.jsx`.
* Khởi tạo trang chuyên đề `BrandMissionPage.jsx` độc lập với giao diện Cinematic, typography cỡ lớn và GSAP animations mượt mà.
* Tự động cập nhật toàn bộ hệ thống định tuyến trong `App.jsx` và sửa liên kết trong `Footer.jsx` từ thẻ `#` tĩnh sang route thực tế.

**Quyết định & Can thiệp của con người**
* **Chấp nhận:** Sử dụng toàn bộ config CI Pipeline và thiết kế giao diện Premium UI của các trang vừa tạo. Cấu trúc HTML/CSS và GSAP animation hoạt động đúng ý đồ.
* **Can thiệp kỹ thuật 1 (Sửa lỗi Môi trường & Dependencies):** Chủ động yêu cầu AI cài đặt bổ sung các package bị thiếu (`@react-oauth/google`, `axios`) sau khi pull code mới nhất từ nhánh `main` về, giúp dev server (Vite) khởi động lại thành công thay vì bị crash.
* **Can thiệp kỹ thuật 2 (Sửa lỗi Định tuyến - SPA Base URL):** Phát hiện lỗi 404 khi người dùng click vào nút *"Join Our Mission"*. Nguyên nhân do AI dùng thẻ HTML tĩnh (`<a href="/register">`) thay vì thẻ điều hướng của React Router. Đã chỉ đạo AI sửa lại bằng component `<Link to="/register">`, giúp ứng dụng bám đúng base path cấu hình trong Vite và không bị reload trang.

**Áp dụng cho**
* `.harness/prosport_ci_pipeline.yaml`
* `src/frontend/src/pages/AboutPage.jsx`
* `src/frontend/src/pages/legal/PrivacyPolicyPage.jsx`
* `src/frontend/src/pages/legal/TermsOfServicePage.jsx`
* `src/frontend/src/pages/legal/SitemapPage.jsx`
* `src/frontend/src/pages/platform/BrandMissionPage.jsx`
* `src/frontend/src/components/Footer.jsx`
* `src/frontend/src/App.jsx`

**Kiểm chứng**
* Lệnh `npm run build` chạy thành công (0 lỗi cú pháp hay cảnh báo thiếu import).
* Dev server Vite (`npm run dev`) build lại nhanh chóng sau khi bổ sung module.
* Test luồng thao tác trực tiếp trên trình duyệt (Click chuyển trang qua lại ở phần Footer, bấm nút CTA chuyển tới trang Đăng ký) xác nhận điều hướng mượt mà, không gặp lỗi 404 và hiệu ứng cuộn chạy chuẩn.
* `src/frontend/src/App.jsx`
**Kiểm chứng**
* Thực thi lệnh `npm run build` trên terminal, kết quả đóng gói thành công (172 modules transformed) và không xuất hiện cảnh báo/lỗi về cú pháp hay thiếu component.
* Xác nhận tính năng điều hướng qua lại giữa Catalog, Rentals, Dashboard và các trang thông tin mới ở Footer hoạt động trơn tru.






## Log #08
**Ngày:** 2026-06-11
**Người thực hiện:** Phạm Nguyễn Tiến Đạt
**Công cụ AI:** Antigravity
**Mục đích:** Sửa lỗi điều hướng tính năng "Discover" trong Footer, bổ sung GSAP animation cho trang Contact và chuẩn hóa hệ thống Keyframe animation toàn cục.
**Tham chiếu Prompt:** *"The 'Discover' link in the Platform section of the Footer is not navigating correctly to the corresponding section on the Home page. Please investigate and fix the routing/scroll behavior."*, *"Please update the remaining pages to match the color tone of the Home page for visual consistency. Apply changes flexibly and aesthetically — avoid a repetitive, cookie-cutter approach. Add appropriate animations and refine the layout to achieve a professional, user-friendly interface overall."*, *"Please revert all color changes back to the original theme. Keep only the newly added animations."*

---

### Tóm tắt kết quả AI

* Chẩn đoán và sửa lỗi điều hướng link "Discover" trong `Footer.jsx`: cập nhật `<Link to="/">` thành `<Link to="/#discover">` đồng thời gắn `id="discover"` cho section Platform Features trong `HomePage.jsx`.
* Tích hợp hook `useLocation` từ React Router kết hợp `useEffect` để xử lý hash-scroll mượt mà (`scrollIntoView({ behavior: 'smooth' })`) khi người dùng truy cập `/#discover` từ bất kỳ trang nào.
* Viết lại toàn bộ `ContactPage.jsx`: bổ sung 4 GSAP ScrollTrigger animations (hero fade-in, form slide từ trái, channel cards stagger từ phải, FAQ items fade up), thêm trạng thái thành công sau khi gửi form với hiệu ứng `scale-in`.
* Chuẩn hóa hệ thống keyframe CSS trong `index.css`: gom tất cả keyframe animation (`authFadeInUp`, `authFloat`, `authSlideInRight`, `scaleIn`, `fadeInUp`) và các utility class tương ứng (`.auth-animate-in`, `.animate-scale-in`, `.animate-fade-up`) vào một nơi duy nhất, loại bỏ khai báo phân tán.
* Thử nghiệm nâng cấp toàn bộ giao diện sang Dark Theme theo yêu cầu, sau đó revert màu sắc về Light Theme theo yêu cầu thứ hai, chỉ giữ lại phần animation đã thêm.

---

### Quyết định & Can thiệp của con người

* **Chấp nhận:** Toàn bộ logic hash-scroll, cấu trúc GSAP animation và bộ keyframe chuẩn hóa trong `index.css`.
* **Can thiệp kỹ thuật 1 (Điều chỉnh phạm vi thay đổi):** Sau khi AI áp dụng Dark Theme toàn bộ lên các trang (`bg-brand-950`, `text-white`...), người dùng quyết định revert lại màu sắc ban đầu (Light Theme). Yêu cầu AI chỉ giữ lại phần animation GSAP, không thay đổi màu sắc giao diện — đây là quyết định sản phẩm nằm ngoài phạm vi AI có thể tự đánh giá.
* **Can thiệp kỹ thuật 2 (Review trước khi hoàn thành):** Yêu cầu AI thực hiện code review toàn bộ logic hash scroll (`useLocation`, `useEffect`, `getElementById`) trước khi commit, đảm bảo tính đúng đắn với cấu hình `basename` của React Router trong Vite.

---

### Áp dụng cho

* `src/frontend/src/components/Footer.jsx` — Sửa link Discover → `/#discover`
* `src/frontend/src/pages/HomePage.jsx` — Thêm `id="discover"`, tích hợp `useLocation` hash scroll
* `src/frontend/src/pages/ContactPage.jsx` — Thêm GSAP ScrollTrigger animations + form success state
* `src/frontend/src/pages/ResetPasswordPage.jsx` — Đồng bộ màu label form
* `src/frontend/src/index.css` — Chuẩn hóa toàn bộ keyframe & animation utility classes

---

### Kiểm chứng

* Kiểm tra trực tiếp trên trình duyệt: click nút "Discover" trong Footer từ trang `/courts` → trang chủ cuộn mượt đến section `#discover` mà không reload trang.
* Xác nhận HMR (Hot Module Replacement) của Vite cập nhật đúng tất cả 5 file sau mỗi lần chỉnh sửa, không có lỗi console.
* Duyệt qua trang Contact, quan sát hiệu ứng ScrollTrigger kích hoạt đúng thứ tự: hero → form card → channel cards (stagger) → FAQ items.
* Thực hiện `git push` thành công lên nhánh `DE190147/audit-module` (commit `969d022`), không có conflict.




## Log #09
- **Ngày:** 2026-06-15
- **Người thực hiện:** Phạm Nguyễn Tiến Đạt
- **Công cụ AI:** Antigravity (Gemini)
- **Mục đích:** Triển khai toàn bộ cụm tính năng AI Chatbot (TK-030, TK-031, TK-032), tích hợp dữ liệu thực tế (Real-time Context) và xử lý lỗi Build/Database.
- **Tham chiếu Prompt:** *"triển khai nhóm AI chatbox cho tôi"*, *"Giờ mount widget vào App.jsx để nó xuất hiện trên toàn bộ trang"*, *"hãy phát triển chatbox sao cho nó trả lời được đa nhiệm như các AI khác như gemini"*.

### Tóm tắt kết quả AI
- **Backend (.NET):** Tích hợp thư viện `OpenAI` v2.1.0. Xây dựng `ChatbotService` với khả năng lấy dữ liệu động từ `ICourtRepository` (danh sách sân) và `IMatchRepository` (danh sách kèo đang mở) để nạp vào *System Prompt* của mô hình `gpt-4o-mini`. Tạo endpoint public `POST /api/chatbot/chat`.
- **Nâng cấp Đa nhiệm:** Tinh chỉnh lại *System Prompt* để Chatbot không bị gò bó vào riêng nghiệp vụ thể thao, mà hoạt động như một AI đa nhiệm thực thụ (trả lời kiến thức chung, code, tính toán, dịch thuật...) nhưng vẫn hiểu sâu sắc về Pro-Sport Complex.
- **Frontend (React/Vite):** Thiết kế widget `AIChatbot.jsx` dạng Floating Bubble ở góc dưới màn hình. Tích hợp hiệu ứng *Pulse ring* (vòng đập), *Typing indicator* (3 chấm nhấp nháy), *Quick prompts*, *Unread badge*, và parse cú pháp markdown. Mount thành công vào `App.jsx` để hiển thị global trên toàn site.

### Quyết định & Can thiệp của con người
- **Chấp nhận:** Áp dụng toàn bộ kiến trúc Dependency Injection cho Chatbot ở Backend và thiết kế Widget UI trên Frontend.
- **Can thiệp kỹ thuật 1 (Xử lý lỗi File Lock khi Migration):** Khi thực hiện `dotnet ef database update`, hệ thống báo lỗi *Build failed* do tiến trình `dotnet run` đang khóa các file `.dll`. Đã can thiệp đình chỉ tiến trình Backend đang chạy ngầm, sau đó chạy lại lệnh Migration để ánh xạ thành công các Entity vào DB, rồi mới khởi động lại server.
- **Can thiệp kỹ thuật 2 (Bảo mật & Quota API):** AI yêu cầu nạp API Key OpenAI. Khi điền key thật vào `appsettings.json`, phát hiện lỗi `HTTP 429 (insufficient_quota)` do tài khoản hết hạn mức. Nắm bắt được nguyên lý hoạt động thực tế của tích hợp AI (yêu cầu chi phí/quota) chứ không chỉ dừng ở code logic.
- **Can thiệp kỹ thuật 3 (Định hướng sản phẩm):** Khi AI ban đầu xây dựng prompt bị giới hạn trong lĩnh vực đặt sân, người dùng đã chủ động chỉ đạo "mở khóa" AI thành dạng đa nhiệm như Gemini, giúp tăng trải nghiệm tổng thể (UX) cho user khi dùng ứng dụng.

### Áp dụng cho
- `src/backend/ProSport.Infrastructure/Services/ChatbotService.cs` (Logic AI & Context)
- `src/backend/ProSport.API/Controllers/ChatController.cs`
- `src/backend/ProSport.API/appsettings.json` (Cấu hình OpenAI API Key)
- `src/frontend/src/components/AIChatbot.jsx` (Giao diện Client)
- `src/frontend/src/App.jsx` (Mount Global Component)

### Kiểm chứng
- Lệnh `dotnet build` và `vite build` đều chạy thành công (0 errors).
- Server Backend (`localhost:5138`) và Frontend (`localhost:5173`) boot thành công song song.
- Dùng `Invoke-RestMethod` (PowerShell) để call thử API Đăng ký sinh ra User và mã OTP vào Database thành công, xác nhận EF Core Database Update đã map chuẩn xác các bảng dữ liệu.
- Component Chatbot render chuẩn xác trên giao diện mà không vỡ layout, có hiệu ứng thu gọn/mở rộng trơn tru.
