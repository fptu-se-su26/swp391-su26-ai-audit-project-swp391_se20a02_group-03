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





---

## [2026-07-13] - Giai đoạn: Tổng kiểm định vận hành — Tái cấu trúc Database Migration, Sửa lỗi luồng Customer (Planning Gate + TDD), Audit Admin/Owner/Staff Portal

### Thêm mới (Added)

**Database & Bootstrap**
- Migration gộp `20260712152036_InitialCreate` (dựng đủ 44 bảng + seed từ DB trống) + `20260712152121_AddUserPhoneUniqueIndex` (unique index filtered cho `Users.PhoneNumber`).
- `DatabaseBootstrap` phiên bản mới: an toàn cho 3 trạng thái DB (chưa tồn tại / rỗng / legacy chưa baseline); dùng `IHistoryRepository` + `ProductInfo.GetVersion()` thay hard-code DDL; fail-fast kèm danh sách bảng thiếu khi DB legacy không đầy đủ.

**Backend**
- `CancellationPolicyService` nhận `TimeProvider` (DI `TimeProvider.System`) — thời gian inject được cho test; guard chặn hoàn tiền khi slot đã bắt đầu.
- `BookingDto.CustomerName` — admin xem tên khách thay vì "Người dùng #id".
- Query "effective pricing rules" (theo sân HOẶC theo loại sân) tại `CourtRepository`; `BookingPriceCalculator` nhận `effectiveRules`.
- DataAnnotations cho 13 request DTO (Court, Equipment, Match, Cart, Rental, Chat, PricingRule, …).

**Tests (backend 95 → 113, frontend 6 → 25)**
- `CancellationPolicyServiceTests.cs` — 14 test fixed-time (FakeTimeProvider tự viết): boundary ±1 phút quanh mốc 48h/24h, regression lệch 7 tiếng, bất biến số tiền.
- `EquipmentControllerTests.cs` — 2 contract test envelope 200/404.
- `MatchServiceTests` +2 — host join bị chặn tại Service, verify không side effect.
- `date.test.js` +19 — `formatSlotTime`, `buildEventDateTime`, `isEventFinished`, `formatTimeUntil` (đủ boundary phút/giờ/ngày).

**Frontend**
- `utils/date.js` +4 helper thời gian nghiệp vụ (parse không phụ thuộc locale, fallback an toàn, không "Invalid Date").
- Badge "Theo loại sân" trên trang Cấu hình bảng giá (rule dùng chung ẩn nút xóa).

**Owner Portal**
- `OwnerComplexController` ghi `AuditLog` khi cập nhật thông tin tổ hợp (`UPDATE Complex`) — hành động ghi dữ liệu duy nhất còn thiếu log trong cổng Owner.
- `OwnerWalkInPage` sinh khung giờ walk-in từ giờ mở cửa thực của tổ hợp (`ownerApi.getComplex`) thay vì hard-code 06:00–22:00.
- `ProSportLogo` nhận thêm prop `to`/`onClick` để dùng trực tiếp làm link, không cần bọc `<Link>` ngoài.

**Staff Portal (EliteSport OS + ProSport Dash)**
- `DashboardService.GetScheduleWindowAsync` (mới) — tính khung giờ hiển thị lịch từ `ComplexOperatingSchedules`/giờ mở cửa tổ hợp thực tế thay vì hard-code 06:00–22:00.
- `ElitePosWalkInPage` lấy `timeHeaders` từ API `dashboardApi.getSchedule` để đồng bộ khung giờ POS quầy với giờ vận hành thực.

### Thay đổi (Changed)
- **Chuẩn hóa contract:** `GET /equipment/{id}` trả envelope `ApiResponseDto` + HTTP 404 thật (đồng nhất với interceptor unwrap của `axiosClient`).
- **Host join kèo:** validation `HostId == joinerId` chạy tại Service **trước** transaction; Repository giữ check làm lớp phòng thủ thứ hai; ví Escrow tạo lazily trong transaction Serializable (đồng nhất với `EscrowService`/`BookingService`).
- **`StaffDemoSeeder`:** ghi `MatchParticipants` thật (Host + Joiner, Approved) khớp `CurrentParticipants = 2`; giữ idempotent qua guard `DEMO-QR`.
- **Secrets & vệ sinh repo:** JWT key thật trong `appsettings.json` → placeholder (non-Development bắt buộc env var); gỡ `.vs/`, `build_errors*.txt`, `*.bak` khỏi Git tracking; bổ sung pattern `.gitignore`.
- **EF 10622:** suppress có chủ đích cho 4 bảng lịch sử/chứng từ (giữ hồ sơ khi cha soft-delete — kèm comment nghiệp vụ); riêng `OtpCode` áp matching filter `!User.IsDeleted`.
- Ẩn nút "Hủy sân" cho booking đã kết thúc (backend vốn hoàn 0đ — chỉ là UX).

### Sửa lỗi (Fixed)

| Mức | Nội dung |
|-----|----------|
| **P0** | **Hoàn tiền lệch 7 tiếng:** slot giờ VN so với `DateTime.UtcNow` trần → khách hưởng mức hoàn cao sai chính sách; sửa cả `CalculateBookingRefundAsync` lẫn `CalculateMatchLeaveReleaseAsync` dùng `VnTimeHelper` |
| **P0** | **Khách không đặt được sân:** FE so `status === 'available'` nhưng API trả `'ACTIVE'` → mọi sân hiện "Tạm ngưng", nút chọn khóa |
| **P0** | **Bảng giá "vô hình":** rules seed gắn `CourtTypeId` nhưng API + calculator chỉ match `CourtId` → trang giá trống, mọi booking tính fallback 100k/giờ thay vì 80k/120k/140k theo khung giờ |
| **P0** | **Trang chi tiết sản phẩm trắng:** endpoint trả DTO trần → `res.statusCode` undefined → false "KHÔNG TÌM THẤY THIẾT BỊ" |
| **P1** | Host tự join kèo của mình lọt validation (chỉ chết vì "Số dư không đủ"); 10/13 user cũ thiếu ví bị chặn bởi lỗi "Ví trung gian không tồn tại" |
| **P1** | Giờ kèo luôn hiển thị "lúc 00:00" (format từ `matchDate` thay vì `startTime`); trang chủ hiện sự kiện quá khứ + countdown hardcode "Bắt đầu sau 2 giờ" |
| **P1** | `CurrentParticipants = 2` nhưng 0 record `MatchMembers` (seeder) — backfill DB kèm audit trước/sau |
| **P2** | Admin: tên khách "#4" → tên thật; khiếu nại "#5 → #6" → tên người; badge EKYC "Unverified" → "Chưa xác minh"; widget hiệu suất sân raw "ACTIVE" → "Trống" + màu đúng |
| **P2** | SignalR noise "connection stopped during negotiation" khi chuyển trang (StrictMode double-mount) — chờ `start()` settle trước khi `stop()` |
| **P3** | 6 nullable warnings (CS8600/8601/8604) → build 0 warning; 18 lỗi ESLint `jsx-no-comment-textnodes` trên 9 trang |
| **P0** | Owner: build backend bị chặn — `EscrowServiceTests.cs` không compile do `EscrowService` thêm tham số `IVnPayService` mà test chưa cập nhật |
| **P0** | Owner: trang "Thông tin tổ hợp" lưu luôn báo lỗi 400 — `GET` trả giờ `HH:mm:ss` nhưng `PUT` chỉ chấp nhận `HH:mm` strict (`OperatingTimeParser.TryParseStrict`) → owner không bao giờ lưu được dù không sửa gì |
| **P1** | Owner: `<a>` lồng `<a>` trong `OwnerSidebar` (logo bọc trong `<Link>` ngoài) — HTML không hợp lệ, click logo về `/` thay vì `/owner/dashboard` |
| **P0** | Staff: trang "Lịch thời gian thực" crash trên mọi ngày có booking — `DashboardService` format `TimeSpan` bằng specifier `HH\:mm` (không hợp lệ với `TimeSpan`, chỉ hợp lệ với `DateTime`) → `FormatException`; lỗi âm thầm vì slot trống không kích hoạt code path |
| **P0** | Staff: walk-in tại quầy trả lỗi 500 khi khách có tài khoản email — cùng lỗi format trong `BookingService` khi build email xác nhận; **booking đã lưu DB trước khi crash**, khách bị giữ chỗ nhưng staff nhận lỗi |

### Hỗ trợ từ AI (AI-assisted)
- Claude Code (Claude Fable 5) thực thi theo mandatory planning gate: khảo sát working tree → root-cause matrix 6 bug → kế hoạch từng file → chờ phê duyệt → TDD (test đỏ đúng nguyên nhân → sửa → xanh). Người thực hiện phê duyệt kế hoạch, tinh chỉnh `DatabaseBootstrap` (fail-fast, API EF chuẩn), cung cấp Google OAuth Client ID, quyết định không thêm dependency Sqlite và kiểm soát phạm vi commit (loại rác session khỏi staging).
- Tiếp đó, audit trực tiếp trên browser (không chỉ đọc code) cho Owner Portal (`courtowner@prosport.vn`) và Staff Portal (`staff1@prosport.vn`): duyệt toàn bộ trang, thao tác thật (lưu form, tạo walk-in, xem lịch) để bắt lỗi mà review tĩnh bỏ sót — kể cả một lỗi escape verbatim string tinh vi (`hh\\:mm` sai trong `$@"..."`, phải dùng `hh\:mm`) chỉ lộ ra khi test lại bằng thao tác thật sau lần sửa đầu.
- **`dotnet test` 113/113 pass** (4 skip SQL Server); Vitest **25/25**; ESLint **0 lỗi**; build BE/FE **0 warning/0 error**; audit DB **0/9 chỉ số vi phạm**.
- Smoke test browser: đặt sân 3 bước giá đúng theo khung giờ, host join bị chặn đúng message, bảng giá admin hiển thị đủ, console 0 lỗi; owner lưu tổ hợp thành công + audit log ghi nhận; staff tạo walk-in (khách vãng lai và khách có email) đều `201 Created`, trang Lịch không còn crash.
- Commit **`1bf691f`** (101 files), push fast-forward **`b53e171..1bf691f`** → `origin/DE190147/audit-module`. Các commit audit Owner/Staff (`a912fc7`, `5269efa`, `fc46b44`, `89fbc99`) hiện ở local, chưa push.

---

## [2026-07-16] - Giai đoạn: Tiếp nối kiểm định vận hành — 5 lỗi P1 xuyên portal, Accessibility Admin/Owner và hòa giải xung đột

> **Trạng thái:** Đã hoàn tất commit và push lên nhánh `DE190147/audit-module`. Remote hiện ở commit `1348d57`.

### Thêm mới (Added)
- UI primitives dùng chung cho Admin và Owner: button, card, form field, modal, empty/error state, status badge và search input.
- Tài liệu UI: `docs/ui/design-system-spec.md`, `market-benchmark.md`, `remediation-plan.md`, `ui-audit.md`.
- `CourtStatusesTests.cs` và `CourtRepositoryTests.cs` để khóa contract trạng thái sân:
  - API: `ACTIVE`, `MAINTENANCE`, `INACTIVE`.
  - Giá trị lưu DB chuẩn: `Available`, `Maintenance`, `Inactive`.
- Test frontend cho Admin Complaints, Admin Courts, Admin KYC, Admin Users, Apex Shop, Cart Checkout, Gear Catalog, Owner Layout, Owner Primitives, Owner Bookings và Owner Operating Hours.
- Accessibility cho modal/cart drawer/quick view Apex: `role="dialog"`, `aria-modal`, focus trap, Escape, focus restore và scroll lock.
- Bộ lọc tồn kho thật trong Apex Shop: `Còn hàng`/`Hết hàng`, thay cho các trạng thái giả `Premium/New/Trial`.

### Thay đổi (Changed)
- `CourtService.UpdateAsync` chuẩn hóa status qua `CourtStatuses.NormalizeApiStatus` trước khi lưu.
- `CourtRepository.GetPagedCourtsAsync` chuẩn hóa status API trước khi lọc DB; lọc `ACTIVE` không còn trả về rỗng.
- `AdminUsersPage` dùng request hủy được, xử lý lỗi `'canceled'`, không reset trang sai khi debounce và có thêm role `CourtOwner`.
- `CartCheckoutPage` chỉ làm mới giỏ hàng sau checkout booking thành công, không xóa toàn bộ giỏ.
- `AdminKycPage` bỏ ảnh Unsplash fallback; dùng trạng thái thiếu/lỗi ảnh rõ ràng và khóa duyệt khi chưa có bằng chứng bắt buộc.
- `AdminComplaintsPage` tự bỏ chọn bản ghi nếu status mới không còn thuộc filter hiện tại.
- `ApexShopPage` map filter môn thể thao đúng theo API (`Badminton`, `Pickleball`, `Tennis`) và dùng filter tồn kho thực tế.
- `OwnerLayout` cô lập state theo `complexId`; Owner sidebar/modal/search/form được cải thiện accessibility.
- Các tương tác lồng `Link > button` ở Owner/Gear được tách lại thành phần tử hợp lệ.
- Làm sạch trailing whitespace trên các file thay đổi để `git diff --check` sạch.

### Sửa lỗi (Fixed)

| Mức | Nội dung |
|-----|----------|
| **P0** | `DatabaseBootstrap.cs` còn text tên nhánh git trong code, làm backend không biên dịch được |
| **P0** | `EscrowServiceTests.cs` bị nhân đôi mock `IVnPayService`, constructor nhận sai số tham số |
| **P0** | `ApexShopPage.jsx` còn corruption merge, JSX/logic trùng lặp và parser lỗi |
| **P0** | `CartCheckoutPage` xóa nhầm toàn bộ giỏ khi chỉ checkout một booking |
| **P0** | `AdminUsersPage` tự reset về trang 1 sau debounce |
| **P0** | Status sân API `ACTIVE` bị lưu sai vào DB thay vì canonical `Available`, làm sai `IsBookable` |
| **P1** | Admin KYC dùng ảnh fallback giả, có thể khiến Admin duyệt sai hồ sơ |
| **P1** | Gear Catalog crash do thiếu `CATEGORY_FALLBACKS` và có thể lặp `onError` vô hạn |
| **P1** | Lọc sân với `ACTIVE` trả về rỗng do repository so sánh trực tiếp với status DB |
| **P2** | Admin Complaints giữ detail panel “lơ lửng” khi bản ghi rời filter |
| **P2** | Modal/sidebar Admin và Owner thiếu Escape, focus trap, focus restore hoặc aria state |
| **P2** | Apex cart drawer/quick view thiếu dialog semantics và có phần tử ẩn vẫn tabbable |
| **P2** | Filter Apex so sánh nhãn tiếng Việt với giá trị API, dẫn đến lọc sai |
| **P2** | Một số test sau merge thiếu Router/CartContext, hoặc kỳ vọng nhãn status cũ |
| **P2** | Cập nhật ref trong render ở Owner Modal/Apex dialog làm ESLint chặn build |

### Hỗ trợ từ AI (AI-assisted)
- **Antigravity** thực hiện phần lớn chỉnh sửa đồng bộ UI Admin, Owner, Gear/Apex; tạo design system, UI primitives, tài liệu audit và các test regression.
- **Codex** tiếp quản worktree Antigravity, kiểm tra regression nền, sửa contract status sân, lọc sân, test environment `matchMedia`, Apex Shop, Admin Complaints và các lỗi accessibility/ref sau merge.
- Khi đưa snapshot Antigravity sang `DE190147/audit-module`, xuất hiện xung đột ở các file Admin/Owner/Apex/Gear/package/API. Theo xác nhận của người dùng, ưu tiên snapshot Antigravity tại các vùng xung đột, sau đó tiếp tục kiểm thử và sửa regression thay vì chỉ resolve marker.
- Không commit các thư mục audit cục bộ `.claude/`, `.codex-work/`, `outputs/`.

### Kiểm chứng
- Frontend:
  - `npm test -- --run` — **63/63 pass**.
  - `npm run lint -- --quiet` — pass.
  - `npm run build` — pass.
- Backend:
  - `dotnet test ProSport.sln --no-restore` — **142 pass, 4 skipped, 0 fail**.
- Chất lượng merge:
  - `git diff --check` — pass.
  - Không còn conflict marker trong source.

### Commit và push
- `72d0529 feat: unify portal UI and harden workflows`
- `1348d57 fix: reconcile conflicted portal workflows`
- Đã push thành công lên `origin/DE190147/audit-module`.

### Phần còn tồn đọng
- Chưa hoàn tất kiểm thử trực quan toàn bộ route bằng browser ở viewport mobile 320px.
- Cần tiếp tục audit sâu Mobile và Staff/Elite Portal để bao phủ toàn bộ brief UI ban đầu.
- Một số hạng mục responsive chuyên biệt, như Admin Pricing ở viewport rất hẹp, cần kiểm chứng trực quan riêng.

---

## [2026-07-17] - Giai đoạn: Rà soát `main` sau PR #50 và tự phát hiện + vá 5 bug (nhánh riêng, chưa merge)

> **Trạng thái:** Đã commit trên nhánh `fix/main-bug-sweep-post-PR50` (dựa trên `main` @ `e935c10`) — **chưa push, chưa mở PR**.

### Thêm mới (Added)
- `GET /matches/{id}/members` — endpoint mới cho host hoặc joiner đã duyệt xem danh sách thành viên cùng kèo (phục vụ tính năng đánh giá uy tín TK-035); 403 với người không thuộc kèo.
- `matchApi.getMatchMembers`, `matchApi.rejectJoiner`, `matchApi.getPendingJoiners` (frontend) — chưa có trang UI nào gọi `rejectJoiner`/`getPendingJoiners`, dựng sẵn cho tính năng "host duyệt joiner" vốn thiếu giao diện.
- 4 test backend mới: `CreateMatchAsync_UsesHostConfiguredEscrowAmount_NotAutoSplitOfBookingTotal`, `GetMatchMembersAsync_ReturnsApprovedMembers_ForHostOrApprovedJoiner`, `GetMatchMembersAsync_Returns403_ForUserNotInMatch`.

### Thay đổi (Changed)
- `MatchService.CreateMatchAsync` dùng đúng `dto.EscrowAmount` do host cấu hình thay vì tự tính lại `TotalAmount/MaxParticipants`.
- `MatchDetailPage.jsx` đổi toàn bộ field hiển thị theo đúng contract thật của `MatchDto`: `courtName`, `levelRequirement`, `sportType` (qua `translateSport`), `hostName` — thay cho các field không tồn tại (`location`, `skillLevel`, `title`, hardcode "Cầu Lông").
- `matchApi.approveJoiner` sửa đúng URL/method (`PUT /matches/{id}/participants/{pid}/approve`) thay vì `POST /matches/{id}/approve/{pid}` sai hoàn toàn.
- `CreateMatchPage.jsx` bỏ 2 field "Tên trận đấu" và "Bộ môn" không có tác dụng (không tồn tại trong `CreateMatchDto`).

### Sửa lỗi (Fixed)

| Mức | Nội dung |
|-----|----------|
| **P0** | `package.json` thiếu `@testing-library/jest-dom` (rơi mất khi resolve conflict PR #50) → toàn bộ 13 file test fail 0 test chạy được |
| **P0** | `MatchService.CreateMatchAsync` bỏ qua `dto.EscrowAmount`, tự tính lại số tiền ký quỹ khác với số host đã cấu hình trên UI — sai lệch tài chính giữa hiển thị và dữ liệu lưu |
| **P1** | `MatchDetailPage.jsx` dùng field không tồn tại (`title`/`skillLevel`/`location`/`participants`) khiến heading trận đấu rỗng, badge môn thể thao sai, và tính năng "Đánh giá người chơi" (TK-035) không bao giờ hoạt động |
| **P2** | `CreateMatchPage.jsx`: 2 field "Tên trận đấu"/"Bộ môn" nhập vào rồi biến mất, không gửi lên backend |
| **P2** | `matchApi.approveJoiner` sai URL/method so với route backend thật |

### Hỗ trợ từ AI (AI-assisted)
- Claude Code (Claude Sonnet 5) tự rà soát diff `f4411d2..e935c10` (34 file, +5308/-648) không có danh sách lỗi được giao sẵn — tự xác định phạm vi cần kiểm tra (CreateMatchPage vì được nêu tên trong commit message fixup, tính năng Escrow mới, các trang viết lại lớn), đối chiếu trực tiếp `MatchDto`/`CreateMatchDto` thật ở backend để xác nhận từng field trước khi kết luận là bug thay vì đoán.
- Tuân thủ TDD cho 2 bug backend: viết test tái hiện trước, xác nhận test đỏ đúng nguyên nhân, sửa nhỏ nhất, chạy lại regression suite.
- Chủ động không mở rộng phạm vi thành xây UI mới khi phát hiện tính năng "host duyệt joiner" thiếu giao diện hoàn toàn — chỉ sửa đúng contract API.
- **ESLint 0 lỗi**, **Vitest 63/63 pass**, `npm run build` thành công; **`dotnet test` 145/149 pass** (4 skip, +4 test mới).
- Tạo nhánh riêng `fix/main-bug-sweep-post-PR50` thay vì commit thẳng lên `main`, giữ đúng quy ước PR-review; commit `b7775a8` — chưa push.






---

## [2026-07-19] - Giai đoạn: Đồng bộ State Machine Booking/Tournament, Audit đa vai trò & Thử nghiệm Redesign UI (đã rollback)

### Thêm mới (Added)
- Tournament lifecycle đầy đủ: state Close/Complete/Cancel + cạnh "player tự rút khỏi trận".
- Domain constants mới: `TournamentStatus`, `ReportStatus`.
- 4 migration ràng buộc status DB: `TournamentStatusConstraint`, `UserStatusConstraints`, `AdminEntityStatusConstraints`, `OwnerEntityStatusConstraints`.
- Test mới: `TournamentLifecycleTests`, mở rộng `SqlServerIntegrationTests`.
- Tài liệu spec-kit `specs/001`–`specs/007`; `STATE_DIAGRAM_PRO-SPORT.drawio` đã đối chiếu và sửa khớp code.

### Thay đổi (Changed)
- Booking: mọi nhánh timeout nhất quán set `Expired` (trước đây lẫn `Cancelled`).
- Chốt tập status hợp lệ cho `Equipment`/`ComplexOwner`/`ComplexReview`/`Report`/`User`, enforce bằng DB check constraint.
- `MatchParticipant.Status`: sửa comment lỗi thời (escrow đã tách sang cờ `HasPaidEscrow`).

### Thử nghiệm & Rollback (Experimental — Reverted)
- Redesign toàn bộ Admin UI (`specs/006`, 25 task) và Public/Customer UI (`specs/007`, 30 task) theo hệ nhận diện "editorial sports brutalism": 4 component dùng chung mới (`CourtCard`, `MatchCard`, `ProductCard`, `MatchDayRail`), ~29 trang được restyle.
- Theo yêu cầu người dùng (đối chiếu PR #49 = commit `1348d57`), rollback toàn bộ phần UI **chưa commit** về đúng trạng thái commit `191cec1` — giữ nguyên bugfix đã có, loại bỏ hoàn toàn phần redesign thử nghiệm.

### Version Control
- Commit `7ecc942`: gộp toàn bộ thay đổi backend/database/spec-kit, loại trừ `.claude/skills/` (asset binary ~7.7MB, không phải code dự án).
- Push fast-forward `origin/DE190147/audit-module` (`1348d57..7ecc942`).

### Hỗ trợ từ AI (AI-assisted)
- Claude Code (Claude Sonnet 5) thực hiện audit đối chiếu state diagram, quy trình spec-kit 4 giai đoạn có gate phê duyệt nghiêm ngặt cho redesign UI (từ chối tiến hành khi chưa nhận đúng cụm từ phê duyệt), và toàn bộ thao tác Git theo chỉ đạo trực tiếp. Người thực hiện kiểm soát chặt phạm vi rollback qua nhiều vòng làm rõ trước khi cho phép thực thi, và loại trừ asset không liên quan khỏi commit.




---
## [2026-07-21] - Giai đoạn: Tính năng Thêm/Xóa sản phẩm (Admin Inventory) & Vá 2 bug dữ liệu sản phẩm

### Thêm mới (Added)
- Tính năng **Thêm sản phẩm** trong Admin Inventory: modal `AddProductModal` (chọn danh mục thật từ API, môn thể thao, giá, tồn kho, ảnh URL tuỳ chọn, mô tả) + `equipmentApi.create()` / `equipmentApi.getCategories()`.
- Tính năng **Xóa sản phẩm** trong Admin Inventory: nút xóa từng dòng có dialog xác nhận (`useConfirm`), cập nhật state lạc quan + toast kết quả.
- `SportType`, `StockQuantity` được thêm vào `CreateEquipmentDto` (có validation) để admin có thể set thật khi tạo sản phẩm.
- Test mới khóa hành vi: `EquipmentServiceTests.CreateAsync_PickleballFootwear_SavesRealCategorySportTypeAndStock_NotHardcoded`, `productImages.test.js` (3 case).

### Sửa lỗi (Fixed)
- **`EquipmentService.CreateAsync` hardcode dữ liệu:** mọi thiết bị mới tạo qua API trước đây đều bị gắn cứng `Category = "Racket"`, `SportType = "Badminton"`, `StockQuantity = 0` bất kể admin chọn gì — tạo giày Pickleball vẫn hiện thành vợt cầu lông, luôn hết hàng ngay khi tạo. Nay lấy đúng `EquipmentCategory.Name` theo FK đã chọn và giá trị thật từ DTO.
- **`resolveProductImage` sai thứ tự ưu tiên:** bảng match-từ-khóa từng chạy trước `ImageUrl` admin đã gán, khiến một sản phẩm có ảnh riêng vẫn bị ghi đè nếu tên trùng từ khóa với sản phẩm khác (VD: mọi vợt có chữ "Astrox" bị gán nhầm ảnh Astrox 88D). Nay `ImageUrl` hợp lệ luôn được ưu tiên trước.
- Cập nhật ảnh sản phẩm "Yonex Power Cushion Cascade Drive" (`shoe-yonex-cascade-drive.png`) theo ảnh thật do người dùng cung cấp.

### Version Control
- **Chưa commit** — toàn bộ thay đổi backend/frontend/test ở trên vẫn đang ở working tree, chờ xác nhận phạm vi commit tiếp theo.

### Hỗ trợ từ AI (AI-assisted)
- Claude Code (Claude Sonnet 5) triển khai tính năng Thêm/Xóa sản phẩm theo yêu cầu; phát hiện 2 bug dữ liệu (hardcode Category/SportType/StockQuantity, sai thứ tự ưu tiên ảnh) ngay trong quá trình kiểm thử tính năng thay vì qua audit chủ động, và được yêu cầu bổ sung test khóa hành vi trước khi coi bug đã sửa xong. Người thực hiện xác nhận mở rộng phạm vi sang sửa bug thay vì chỉ né tránh ở tầng UI, và cung cấp trực tiếp ảnh sản phẩm thay thế.


---
## [2026-07-22] - Giai đoạn: Đồng bộ Seed Data Thiết bị & Cải tiến UI, Bảo mật

### Thêm mới (Added)
- **Tối ưu UI (Taste Skill) cho NotificationMenu:** Áp dụng thiết kế bứt phá khỏi khung mặc định (brutalist) của hệ thống thông báo. Thay thế giao diện khô cứng bằng viền mỏng (`border-slate-200/60`), bo góc lớn (`rounded-[16px]`), đổ bóng nổi mượt mà (`shadow-[0_12px_40px_rgba(0,0,0,0.08)]`), kèm theo hiệu ứng highlight trạng thái chưa đọc (nền xanh ngọc nhạt và dấu chấm sáng) mang lại cảm giác cao cấp (Premium).

### Sửa lỗi (Fixed)
- **Hardcode đường dẫn tĩnh:** Đồng bộ dữ liệu hạt giống (`DatabaseSeeder.cs`) với 47 sản phẩm thực tế từ Database Local. Phát hiện và thay thế toàn bộ prefix `http://localhost:5173` trong URL của ảnh thành đường dẫn tương đối (VD: `/images/product.jpg`), đảm bảo tính di động (portability) khi các thành viên khác clone project hoặc deploy lên Production không bị lỗi không tải được ảnh.
- **Rò rỉ bảo mật (Security Leak) ở appsettings.json:** Phát hiện và gỡ bỏ hoàn toàn mật khẩu ứng dụng Gmail (`SenderPassword`) và chuỗi mã hoá của VNPay (`HashSecret`) đang bị hardcode trực tiếp trên mã nguồn, ngăn ngừa nguy cơ lộ tài nguyên khi push lên public repository.

### Version Control
- **Đã commit & push:** Đóng gói toàn bộ các thay đổi vào 1 commit với thông điệp `style: optimize notification menu UI per Taste Skill, sync DatabaseSeeder` và đẩy thẳng lên nhánh làm việc `DE190147/audit-module`.

### Hỗ trợ từ AI (AI-assisted)
- Antigravity / Claude Code thực hiện đồng bộ DatabaseSeeder theo yêu cầu; trong quá trình đó chủ động cảnh báo và xử lý vấn đề hardcode domain tĩnh của ảnh, rà soát và khắc phục rò rỉ bảo mật ở file cấu hình. Tiếp nhận chỉ đạo áp dụng nguyên tắc "Taste Skill" để tinh chỉnh trực tiếp giao diện (smooth box thông báo), loại bỏ triệt để cảm giác robot (default styling). Toàn bộ quá trình từ lúc phát hiện, sửa lỗi, hoàn thiện giao diện đến quản lý source code (commit & push) đều được thực hiện trơn tru dưới sự giám sát và quyết định của người thực hiện.
