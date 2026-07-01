# Nhật ký thay đổi (Changelog)

> **Người thực hiện (tất cả mục):** Phạm Nguyễn Tiến Đạt

---

## [2026-05-20] - Giai đoạn: Lên ý tưởng & Lập dàn ý thiết kế UI

### Thêm mới (Added)
- Chốt bố cục thiết kế tổng thể: trang chủ, màn hình danh sách sân, giao diện Dashboard với biểu đồ thống kê.
- Bổ sung yêu cầu thiết kế chi tiết hiển thị form thanh toán (Payment UI).

### Thay đổi (Changed)
- Tùy chỉnh lại bảng tone màu thể thao do AI gợi ý để đồng bộ chính xác với nhận diện thương hiệu của nhóm.

### Hỗ trợ từ AI (AI-assisted)
- Gemini đóng vai trò Designer, phân tích yêu cầu và viết bộ meta-prompt tiếng Anh làm đầu vào cho công cụ thiết kế Stitch.

---

## [2026-05-21] - Giai đoạn: Dựng Mockup UI tĩnh & Cấu trúc Layout

### Thêm mới (Added)
- Tạo layout trang Dashboard, thanh điều hướng (Navbar/Sidebar) và các component trạng thái sân.
- Thêm các thẻ JSTL, tích hợp dữ liệu động truyền từ Model/Controller thay thế mock data.

### Thay đổi (Changed)
- Bóc tách file HTML tĩnh nguyên khối thành module riêng (Header, Footer, Menu) theo cấu trúc dự án.

### Sửa lỗi (Fixed)
- Tinh chỉnh class CSS để sửa vỡ layout, responsive tốt hơn trên mobile.

### Hỗ trợ từ AI (AI-assisted)
- Stitch By Google sinh HTML/CSS/JS tĩnh từ bản thiết kế. Người thực hiện tự bóc tách file và ghép dữ liệu động.

---

## [2026-05-22] - Giai đoạn: Xây dựng React Components & Logic Form

### Thêm mới (Added)
- Xây dựng `BookingForm.jsx` và `Dashboard.jsx`.
- Tích hợp Axios gọi dữ liệu sân thực tế từ Java Backend.
- Validation form đặt sân (chặn chọn ngày quá khứ).

### Thay đổi (Changed)
- Tách UI nguyên khối thành component tái sử dụng: `Button`, `InputField`, `CourtCard`.

### Hỗ trợ từ AI (AI-assisted)
- Antigravity AI sinh React Functional Component, hook `useState`, class Tailwind. Người thực hiện tự viết logic API và Validation.

---

## [2026-05-28] - Giai đoạn: Nâng cấp toàn diện Premium UI/UX

### Thêm mới (Added)
- **Core:** Cài `gsap`, `@gsap/react`; custom hooks `useScrollReveal`, `useNavbarEntrance`.
- **Phân hệ Apex (6 trang):** Booking, Matches, Shop, Profile, Settings, Support.
- **Phân hệ MatchPro (4 trang):** Trending Feed, Nearby Sports, Community Hub, Leaderboard.

### Thay đổi (Changed)
- Chuyển logic animation từ component ra custom hooks (tái sử dụng, code sạch hơn).

### Sửa lỗi (Fixed)
- **Vite EBUSY:** Thêm `.vs` vào ignore trong `vite.config.js`.

### Hỗ trợ từ AI (AI-assisted)
- Antigravity AI đề xuất GSAP và sinh cấu trúc UI/CSS cho 10 trang mới. Người thực hiện tái cấu trúc theo chuẩn React Component.

---

## [2026-05-29] - Giai đoạn: Xây dựng hệ thống giao diện đa phân hệ

### Thêm mới (Added)

| Phân hệ | Số trang | Trang chính |
|---------|----------|-------------|
| Public | 7 | `HomePage`, `LoginPage`, `RegisterPage`, `RoleSelectionPage`, `ResetPasswordPage`, `AboutPage`, `ContactPage` |
| Admin Portal | 8 | `AdminDashboardPage`, `AdminUsersPage`, `AdminCourtsPage`, `AdminBookingsPage`, `AdminInventoryPage`, `AdminPricingPage`, `AdminKycPage`, `AdminComplaintsPage` |
| EliteSport OS | 6 | `EliteDashboardPage`, `EliteSchedulePage`, `ElitePosWalkInPage`, `EliteEquipmentPage`, `EliteVouchersPage`, `EliteDisputesPage` |
| Mobile App | 8 | `MobileHomePage`, `MobileDashboardPage`, `MobileMatchesPage`, `MobileBookingPage`, `MobileChatPage`, `MobileWalletPage`, `MobileProfilePage`, `MobileScannerPage` |
| Shop | 5 | `ShopPage`, `ShopProductPage`, `ShopCartPage`, `ShopCheckoutPage`, `ShopWishlistPage` |
| Status | 3 | `NotFoundPage`, `RestrictedPage`, `MaintenancePage` |

- **Layouts:** 7 layout — `EliteLayout`, `MobileLayout`, `AdminLayout`, `GearLayout`, `ShopLayout`, `MatchProLayout`, `ProSportDashLayout`.
- **Routing:** 40+ routes trong `App.jsx`; `AIChatbot.jsx` tích hợp Mobile Layout.

### Sửa lỗi (Fixed)
- **[Build]** `index.html` trỏ sai `/src/main.jsx` → sửa về `/main.jsx`.
- **[Routing]** Public routes bị comment → uncomment, bổ sung `/about`, `/courts`, `/matches`, `/gear`.
- **[CSS]** Selector `:has()` không tương thích Firefox → thay bằng class thông thường.
- **[Navigation]** 10 dead link trong `AdminLayout` sidebar → xóa.
- **[Layout Mobile]** `position: absolute` gây chồng nội dung → chuyển `sticky` trên `MobileChatPage`, `MobileBookingPage`.

### Hỗ trợ từ AI (AI-assisted)
- Antigravity AI sinh JSX, CSS, routing cho 40+ trang. Người thực hiện tự phát hiện và sửa 5 nhóm lỗi build/routing/CSS/layout mà AI không tự phát hiện.

---

## [2026-06-01] - Giai đoạn: Hoàn thiện phân hệ Gear & Chuẩn hóa đa ngôn ngữ (Tiếng Anh)

### Thêm mới (Added)
- **Phân hệ Gear (4 trang):** Equipment Rental Terms, Maintenance Tracking, Support Hub, Privacy Policy.
- **Routing:** Bổ sung route tương ứng trong `App.jsx`.

### Thay đổi (Changed)
- **Localization:** Quét và chuyển label tiếng Việt còn sót sang tiếng Anh (Premium UI).
- **SPA:** Footer `GearLayout.jsx` — `href="#"` → `<Link>` React Router.

### Sửa lỗi (Fixed)
- **Rate Limit 429:** Dịch thuật đa luồng vượt giới hạn API → đóng băng luồng dịch toàn dự án, ưu tiên hoàn thiện Gear trước.

### Hỗ trợ từ AI (AI-assisted)
- Antigravity AI sinh nội dung, CSS, component cho 4 trang Gear. Người thực hiện xử lý lỗi 429 và cấu hình lại React Router.

---

## [2026-06-04] - Giai đoạn: Thiết lập CI/CD & Hoàn thiện nền tảng pháp lý (Platform/Legal)

### Thêm mới (Added)
- **CI/CD:** Harness pipeline (`.harness/prosport_ci_pipeline.yaml`) — Build FE, Build BE, Audit Docs.
- **Legal (3 trang):** `PrivacyPolicyPage`, `TermsOfServicePage`, `SitemapPage`.
- **Platform:** `BrandMissionPage` — giao diện Cinematic + GSAP.
- **Routing:** 4 route mới trong `App.jsx`.

### Thay đổi (Changed)
- **About overhaul:** Nội dung Mission, Stats, Journey, Timeline, Leadership + GSAP ScrollTrigger.
- **Footer:** Liên kết tĩnh → route thực (`/courts`, Legal pages).

### Sửa lỗi (Fixed)
- **Dev server:** Thiếu `@react-oauth/google`, `axios` sau merge → cài bổ sung.
- **SPA base URL:** CTA "Join Our Mission" dùng `<a href>` → `<Link>` React Router.

### Hỗ trợ từ AI (AI-assisted)
- Antigravity AI viết Harness CI config và sinh React/GSAP cho About, Brand Mission, Legal. Người thực hiện fix dev server crash và lỗi điều hướng base URL.

---

## [2026-06-11] - Giai đoạn: Nâng cấp UI/UX, Chuẩn hóa GSAP Animations & Khắc phục lỗi điều hướng

### Thêm mới (Added)
- **Contact animations:** 4 hiệu ứng GSAP ScrollTrigger (Hero fade-in, form slide, cards stagger, FAQ fade-up).
- **Success state:** Hiệu ứng `scale-in` sau gửi form liên hệ.

### Thay đổi (Changed)
- Gom keyframe animation vào `index.css` (`authFadeInUp`, `authFloat`, `scaleIn`, …).
- Đồng bộ màu label form `ResetPasswordPage`.

### Sửa lỗi (Fixed)
- **Hash routing:** Footer "Discover" → `/#discover` + id section trên `HomePage`.
- **Hash scroll:** Hook `useLocation` + `useEffect` + `scrollIntoView({ behavior: 'smooth' })`.

### Hỗ trợ từ AI (AI-assisted)
- Antigravity AI gỡ lỗi hash-scroll và viết animation Contact. Người thực hiện revert đề xuất Dark Theme không phù hợp, chỉ giữ cải tiến Animation/Routing.

---

## [2026-06-15] - Giai đoạn: Tích hợp AI Chatbot Đa nhiệm & Xử lý sự cố CSDL

### Thêm mới (Added)
- **Backend:** Package `OpenAI` v2.1.0, `ChatbotService`, `POST /api/chatbot/chat`.
- **Frontend:** `AIChatbot.jsx` — Floating Widget (Pulse, Typing, Unread badge, Quick prompts).
- **RAG sơ cấp:** Inject dữ liệu sân trống + kèo mở vào System Prompt.
- **Global mount:** `<AIChatbot />` ngoài `<Routes>` trong `App.jsx`.

### Thay đổi (Changed)
- Nâng cấp System Prompt → Trợ lý đa nhiệm (kiến thức chung + ưu tiên Pro-Sport).
- Cấu hình OpenAI API Key thật, model `gpt-4o-mini`.

### Sửa lỗi (Fixed)
- **EF Core lock:** `dotnet ef database update` fail do `dotnet run` khóa `.dll` → dừng process, migrate, restart.
- **OpenAI 429:** Xác định `insufficient_quota` (hết credit), không phải lỗi code.

### Hỗ trợ từ AI (AI-assisted)
- Antigravity AI sinh luồng OpenAI SDK + UI Chatbot. Người thực hiện debug EF lock và cấp API Key.

---

## [2026-06-16] - Giai đoạn: Tổng rà soát & Vá lỗi toàn diện (Comprehensive Bug Fix)

### Thêm mới (Added)
- **Performance:** `React.lazy` + `Suspense` cho toàn bộ routes.
- **Security:** `DOMPurify` chống XSS trong Chatbot Markdown.
- **CORS:** Đọc danh sách động từ `appsettings.json`.

### Thay đổi (Changed)
- Mobile Wallet: `window.prompt`/`alert` → Modal nội bộ (fix iOS PWA popup block).
- Chuẩn hóa giờ email 12h → 24h; slot `HH:mm:ss` → `HH:mm`.

### Sửa lỗi (Fixed)
- **[Auth]** Chặn login tài khoản chưa OTP; bọc `ProtectedRoute` Admin/Elite.
- **[DB]** SQL Error 207 — bất đồng bộ String/Enum `BookingStatus`.
- **[Logic]** Infinite loop PricingRule; chỉ `Confirmed` mới check-in.
- **[OS]** Timezone Linux/Docker → fallback `Asia/Ho_Chi_Minh`.
- **[FE]** Data nesting sai `ApexMatchesPage`; Axios error hiển thị trắng.

### Hỗ trợ từ AI (AI-assisted)
- Antigravity AI quét song song Backend/Frontend, sinh 15+ bản vá. Người thực hiện kiểm soát merge, push về `DE190147/audit-module`.

---

## [2026-06-18] - Giai đoạn: Đồng bộ hóa ngôn ngữ (Việt hoá) & Tái cấu trúc Backend

### Thêm mới (Added)
- Script NodeJS dịch 40+ trang UI sang Tiếng Việt (`auto-translate-all.js`, …).
- Migration `20260617173327_AddPaymentDeadline`.

### Thay đổi (Changed)
- **Domain sanitization:** Loại bỏ Tennis, Bóng rổ, Golf, Padel — tập trung Pickleball & Cầu lông.
- **EscrowService:** `IDbContextTransaction` isolation `Serializable` chống data race.
- **Clean code:** Loại magic strings trong `BookingService`, `MatchService`.

### Sửa lỗi (Fixed)
- Merge conflict `GearRentalPage.jsx` — giữ cột Deposit + tiếng Việt.
- GitHub Push Protection — GCP API Key rò rỉ trong script dịch → Allow Secret.
- UI Rollback — loại thiết kế Nike do AI tự thêm (`git checkout`).

### Hỗ trợ từ AI (AI-assisted)
- Antigravity AI viết script dịch và kiến trúc transaction. Người thực hiện rollback UI rác, xử lý secret leak, resolve conflict.

---

## [2026-06-18] - Giai đoạn: Đồng bộ mã nguồn, Phân giải xung đột & Tự động hoá Refactoring

### Thêm mới (Added)
- Dependencies: `react-leaflet`, `leaflet`, `dompurify`.

### Thay đổi (Changed)
- PowerShell script Regex: arrow async → `async function` trên 35+ file `.jsx` (ESLint).
- `npm audit` + `dotnet list package --vulnerable` — giữ `vite` hiện tại tránh breaking change.

### Sửa lỗi (Fixed)
- Merge conflict `ProSportDbContextModelSnapshot.cs`; đổi tên Migration trùng.
- 60+ lỗi React Hooks hoisting trong `useEffect`.
- Vite HMR — `MatchProNearbyPage.jsx` thiếu import.

### Hỗ trợ từ AI (AI-assisted)
- Antigravity AI phân tích build log .NET, viết Regex script. Người thực hiện yêu cầu Deep Scan, kiểm soát commit/push.

---

## [2026-06-20] - Giai đoạn: Tổng rà soát lỗi, Cấu hình Testing & Chuẩn hóa thiết kế UI

### Thêm mới (Added)
- `scripts/blackbox_tests.js` — BlackBox E2E API.
- Clone `taste-skill`; quy tắc UI tại `.agents/AGENTS.md`.

### Thay đổi (Changed)
- Downgrade test .NET 10 → .NET 8 (`global.json`, `ProSport.Tests.csproj`).
- Xóa nhánh `implement-ui-from-design`; chuẩn hóa `DE190147/audit-module`.

### Sửa lỗi (Fixed)
- Backend: N+1, race conditions, EF state tracking.
- Unit tests: 7/7 pass (Enum `Cancelled`, DTO params).
- Frontend build: cài `react-leaflet`, `leaflet` — `npm run build` 0 errors.

### Hỗ trợ từ AI (AI-assisted)
- Antigravity AI quét Backend, thiết lập Unit Test, tích hợp `taste-skill`. Người thực hiện quyết định downgrade .NET và ép quy tắc UI chống AI-slop.

---

## [2026-06-27] - Giai đoạn: Hoàn thiện tích hợp Frontend–Backend & Bổ sung API còn thiếu (Voucher / Khiếu nại / E-KYC)

### Thêm mới (Added)
- **Voucher:** Full-stack CRUD, kiểm tra trùng mã, lọc hiệu lực.
- **Report:** Luồng khiếu nại khách → Admin/Staff; chống tự báo cáo & trùng.
- **E-KYC:** `KycController` duyệt/từ chối; đồng bộ `EkycProfile` + `User.EKycStatus`.
- **FE API:** `voucherApi.js`, `reportApi.js`, `kycApi.js`; mở rộng `bookingApi.js`.
- **TK-035:** Rating 1–5 sao + Trust Score tại `MatchDetailPage`.

### Thay đổi (Changed)
- **Mock → Real data** trên Admin, Elite, Shop, MatchPro, Customer pages.
- Chuẩn hóa envelope `ApiResponseDto`; Loading/Empty/Error nhất quán.

### Sửa lỗi (Fixed)
- Import sai `Check`, `Star`, `Trash2` từ `react` thay vì `lucide-react`.
- `hostId.substring()` trên số → `String(...)` tại `MatchProFeedPage`.
- Bóc tách `.data` dư tại `EliteScannerPage`; thêm nhập mã thủ công.

### Hỗ trợ từ AI (AI-assisted)
- Cursor (Claude Opus) dựng 3 cụm API + wiring FE. Người thực hiện ưu tiên nghiệp vụ, không migration mới, chỉ ra crash FE.

---

## [2026-06-29] - Giai đoạn: Google OAuth, Nhận diện thương hiệu PRO-SPORT, Việt hóa UI & Hoàn thiện phân hệ Staff (EliteSport OS + ProSport Dash)

### Thêm mới (Added)

**Auth & branding**
- Google OAuth FE: `@react-oauth/google`, `GoogleSignInButton`, `googleAuth.js`, `GoogleOAuthProvider`.
- Google OAuth BE: `POST /api/auth/google-login`, validate token trong `AuthService`.
- Branding: `ProSportLogoMark`, `ProSportLogo`, `logo.svg`, favicon.
- Utility: `labels.js`, `ConfirmDialog`, `PageLoader`; `setup-local.ps1`, `.env.example`.

**Staff vận hành**
- BE: Walk-in booking, check-in QR, thuê thiết bị, dashboard lịch sân, `StaffDemoSeeder`.
- FE Elite: POS, lịch sân, scanner, thuê/trả thiết bị, disputes, vouchers.
- FE Dash: Bookings, Matches, Rentals, Payments, Broadcast, Notif Settings (demo localStorage).
- Mobile scanner: `html5-qrcode`.

### Thay đổi (Changed)
- Việt hoá 80+ trang; chuẩn hóa `StatusBadge`, `labels.js`.
- Phân quyền dispute: Staff → `Investigating`; Admin → `Resolved`/`Rejected`.
- Route guard `EliteRoute`; logout trên Elite/Dash layouts.

### Sửa lỗi (Fixed)
- OAuth: origin localhost, typo Client ID, initialize trùng.
- Schedule `hh` → `HH`; guard check-in trùng mobile; seeder try/catch; scanner remount `scanKey`.

### Hỗ trợ từ AI (AI-assisted)
- Cursor (Claude Opus) triển khai song song OAuth + Staff P0→P3. **`dotnet test` 10/10**, commit `fed44de`, `a5939b6`.

---

## [2026-06-30] - Giai đoạn: Owner Portal (Court Owner), Player Features, Audit & Hardening toàn cổng Owner

### Thêm mới (Added)

**Owner Portal — Backend**
- 14+ controller `Controllers/Owner/`, `OwnerApiAuthorizationFilter`, `OwnerAccessService`.
- Migration `20260630170056` → `20260630191246`; dashboard, courts, bookings, finance, reports, staff, …
- `OwnerDemoSeeder` (`courtowner@prosport.vn`).

**Owner Portal — Frontend**
- Layout `/owner/*` (20+ trang); trang cấu hình: operating hours, cancellation policy, memberships.

**Player Features**
- Tournament (trừ phí Escrow), ELO confirm/dispute, Membership discount.
- Split payment, recurring booking, SignalR `NotificationHub`.

**Dev workflow**
- Submodule `.superpowers`, `docs/SUPERPOWERS.md`, test Staff → 403.

### Thay đổi (Changed)
- CourtOwner login → `/owner/dashboard`; báo cáo doanh thu scoped + timezone VN.
- UX: filter ngày, export CSV error handling, edit product/voucher/rental.

### Sửa lỗi (Fixed)

| Mức | Nội dung |
|-----|----------|
| **P0** | Tournament miễn phí; ELO self-report; Membership không giảm giá |
| **P0–P1** | IDOR cancellation policy; escrow scope; double-count revenue; dashboard `hh`→`HH` (**blackbox 14/14**) |
| **P2** | Export CSV blob JSON; xóa `OwnerInventoryPage.jsx` dead code |

### Hỗ trợ từ AI (AI-assisted)
- Cursor (Composer) Owner Portal full-stack (201 files), audit P0→P2, Superpowers.
- **`dotnet test` 73/73 pass**, `npm run build` OK; push **`4e0c435`** → `origin/DE190147/audit-module`.
- PR: **base `main` ← compare `DE190147/audit-module`**.





---

## [2026-07-01] - Giai đoạn: Audit remediation toàn hệ thống — Nghiệp vụ, Kế toán, Hiệu năng & Kiểm thử WhiteBox/BlackBox

### Thêm mới (Added)

**Backend**
- `PayEquipmentPurchaseAsync` — trừ ví Escrow + ghi `Transaction` khi mua/checkout thiết bị.
- `GET /api/courts/{id}/availability?date=…` — slot sân theo lịch vận hành, closure, maintenance.
- Migration `20260701013231_FixDataDesignAuditIssues`, `20260701021049_AddTransactionReferenceIdUniqueIndex`, `20260701031053_AddPerformanceQueryIndexes`.
- `ProSport.API/wwwroot/.gitkeep` — loại cảnh báo static files khi startup.

**Frontend**
- `ErrorBoundary.jsx`, lazy routes + `manualChunks` (react-vendor, leaflet, gsap).
- `useDebouncedValue.js` — debounce tìm kiếm Owner bookings/products.
- Unit test: `authStorage.test.js`, `date.test.js`; ESLint override cho context modules.

**Tests**
- `AuditBusinessLogicTests.cs` (cart atomic, bookingId, wallet debit, …).
- `SqlServerIntegrationTests.cs` + `SqlServerFactAttribute` (4 test, skip khi thiếu `PROSPORT_INTEGRATION_CONNECTION_STRING`).

### Thay đổi (Changed)
- **Escrow atomic:** `CreditWalletAsync`, `TryDebitWalletAsync`, … — `ExecuteUpdate` thay read-modify-write.
- **Cart checkout:** `CheckoutCartAtomicAsync` (Serializable); validate `bookingId`; gộp giỏ theo `equipmentId + bookingId`.
- **Hiệu năng:** `AsNoTracking`/`AsSplitQuery`, projection `OwnerDashboardService`, `AddResponseCompression`, split query trong `Program.cs`.
- **`CartCheckoutPage.jsx`:** truyền `bookingId` từ query string hoặc giỏ hàng.

### Sửa lỗi (Fixed)

| Mức | Nội dung |
|-----|----------|
| **P0** | Operator cancel hoàn **100%**; equipment damage không double-charge cọc; race escrow wallet |
| **P0** | Cart checkout all-or-nothing (không trừ stock một phần khi fail giữa chừng) |
| **P0** | Checkout/mua thiết bị **không trừ ví** — lỗ hổng kế toán (chỉ trừ tồn kho) |
| **P1** | Blackbox: `/api/courts` HTTP 500 (thiếu `OrderBy`); dashboard HTTP 400 (`TimeSpan` `HH`→`hh`); `Program.cs` CS1061 split query |
| **P1** | `StaffDemoSeeder` vi phạm CHECK `PaymentMethod` → `"Escrow"` |
| **P2** | `bookingId` checkout bị bỏ qua; FE luôn gửi `null` |

### Hỗ trợ từ AI (AI-assisted)
- Cursor (Composer) rà soát P0→P3, WhiteBox + BlackBox, tối ưu hiệu năng, vá kế toán Escrow.
- **`dotnet test` 95/99 pass** (4 skip SQL Server); Vitest **6/6**; blackbox **14/14 PASS**.
- Commit **`2a0924b`**, push **`4e0c435..2a0924b`** → `origin/DE190147/audit-module`.
