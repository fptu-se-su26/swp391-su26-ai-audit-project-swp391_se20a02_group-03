# BÁO CÁO PHÂN TÍCH VÀ THIẾT KẾ HỆ THỐNG
## HỆ THỐNG QUẢN LÝ TỔ HỢP THỂ THAO VÀ KẾT NỐI NGƯỜI CHƠI THÔNG MINH TÍCH HỢP AI (PRO-SPORT COMPLEX)

---

### 1. Chọn đề tài và lý do chọn đề tài
**1.1 Tên đề tài:** Hệ thống quản lý tổ hợp thể thao và kết nối người chơi thông minh tích hợp AI (Pro-Sport Complex Management System).

**1.2 Lý do chọn đề tài:** Hiện nay, phong trào tập luyện thể thao (đặc biệt là Cầu lông và Pickleball) đang phát triển mạnh mẽ, kéo theo nhu cầu đặt sân và tìm kiếm bạn chơi ngày càng tăng cao. Tuy nhiên, quy trình quản lý sân bãi và tổ chức giao lưu hiện tại vẫn gặp nhiều bất cập: thông tin lịch trống quản lý thủ công dẫn đến sai lệch giờ giấc hoặc trùng lịch; người chơi mất nhiều thời gian tìm hội nhóm phù hợp; chủ sân khó tối ưu tỷ lệ lấp đầy và quản lý dòng tiền. Đặc biệt, vấn nạn "bùng kèo" gây bức xúc và tổn thất chi phí. 

Hệ thống được xây dựng như một nền tảng trung gian kết nối người chơi, người tổ chức và quản lý tổ hợp thể thao, ứng dụng AI Chatbot để phân tích ngôn ngữ tự nhiên, gợi ý ghép kèo cá nhân hóa và tự động hóa quy trình quản lý sân bãi.

---

### 2. Giới thiệu đề tài, phạm vi và tính năng chính

**2.1 Giới thiệu đề tài:**
Là nền tảng website trung gian đa tác nhân, kết nối trực tiếp Khách hàng (Customer), Nhân viên điều phối (Staff) và Quản trị viên (Admin). Điểm nhấn công nghệ là AI Chatbot thấu hiểu ngôn ngữ tự nhiên và Ví trung gian (Escrow) đảm bảo tài chính.

**2.2 Phạm vi đề tài:**
- **Đối tượng:** Guest, Customer, Staff, Admin.
- **Chức năng:** E-KYC, Ma trận lịch bãi thời gian thực, Điều phối kèo, Ví ký quỹ, Quản lý kho, Phân tích dữ liệu AI.
- **Công nghệ:** ReactJS, Tailwind CSS, ASP.NET Core Web API (.NET 8/9), SQL Server, OpenAI API, VNPay Sandbox.

**2.3 Các tính năng chính:**
- **Người chơi:** Đăng ký/đăng nhập, E-KYC, Đặt sân, Cáp kèo/Join kèo, Thanh toán ví Escrow, Báo cáo bùng kèo, Chat với AI.
- **Nhân viên:** Check-in QR, Quản lý hóa đơn thuê đồ, Kiểm định thiết bị, Phát hành Voucher, Xác nhận bùng kèo.
- **Quản trị viên:** Quản lý User, sân bãi, giá, kho, phê duyệt E-KYC, giải quyết khiếu nại, báo cáo thống kê.
- **AI:** Phân tích cú pháp ngữ nghĩa để gợi ý sân bãi và kèo đấu phù hợp.

---

### 3. Tìm hiểu hai hệ thống tương tự
- **Nền tảng đặt sân truyền thống (VD: SanCaulong.vn):** Chỉ là danh bạ số điện thoại, không có lịch thời gian thực, không ghép kèo, không AI.
- **Hội nhóm mạng xã hội (Facebook/Zalo):** Cộng đồng đông nhưng tự phát, rủi ro bùng kèo cao, khó sàng lọc đối tượng, quy trình thu tiền tốn thời gian.

---

### 4. Xác định tác nhân
- **Guest:** Khách vãng lai, xem trang chủ, tra cứu sân.
- **Customer:** Người chơi đã xác thực, đặt sân, cáp kèo, ví trung gian.
- **Staff:** Nhân viên vận hành, quét QR, kiểm định thiết bị.
- **Admin:** Quản trị toàn cục, điều chỉnh giá, xử lý tranh chấp.
- **Payment Gateway (VNPay):** Xử lý giao dịch thanh toán và ký quỹ.

---

### 5. Xác định Use Cases

#### 5.1 Guest
| Mã UC | Tên Use Case | Mô tả |
| :--- | :--- | :--- |
| UC-G01 | Xem trang chủ | Xem thông tin tổ hợp, sự kiện. |
| UC-G02 | Xem lưới lịch bãi | Theo dõi trạng thái sân thời gian thực. |
| UC-G03 | Tìm kiếm và Lọc sân | Lọc theo tên, bộ môn, giá. |
| UC-G04 | Xem chi tiết sân | Xem ảnh, thông số, tiện ích. |
| UC-G05 | Xem danh sách kèo mở | Tra cứu kèo công khai. |
| UC-G06 | Đăng ký tài khoản | Khởi tạo tài khoản mới. |
| UC-G07 | Đăng nhập | Xác thực tài khoản. |
| UC-G08 | Khôi phục mật khẩu | Quên mật khẩu qua OTP/Email. |

#### 5.2 Customer
| Mã UC | Tên Use Case | Mô tả |
| :--- | :--- | :--- |
| UC-C01 | Cập nhật hồ sơ | Thay đổi thông tin cá nhân. |
| UC-C02 | Xác thực E-KYC | Định danh thực. |
| UC-C03 | Đổi mật khẩu | Bảo mật tài khoản. |
| UC-C04 | Đặt sân | Tạo đơn giữ sân. |
| UC-C05 | Hủy đặt sân | Hủy đơn có phí phạt. |
| UC-C06 | Xem lịch sử đặt sân | Tra cứu lịch sử. |
| UC-C07 | Tạo bài cáp kèo (Host) | Đăng tuyển đồng đội. |
| UC-C08 | Quản lý kèo của tôi | Phê duyệt/từ chối Joiner. |
| UC-C09 | Hủy kèo giao lưu | Hoàn tiền Escrow. |
| UC-C10 | Xin tham gia kèo | Gửi đơn xin gia nhập. |
| UC-C11 | Thanh toán ký quỹ | Chuyển vào Ví trung gian. |
| UC-C12 | Rút khỏi kèo | Hủy tham gia. |
| UC-C13 | Đánh giá người chơi | Chấm điểm uy tín. |
| UC-C14 | Báo cáo bùng kèo | Khiếu nại vi phạm. |
| UC-C15 | Chat với AI | Tra cứu qua chatbot. |

#### 5.3 Staff
| Mã UC | Tên Use Case | Mô tả |
| :--- | :--- | :--- |
| UC-S01 | Quét QR Check-in | Xác nhận khách đến. |
| UC-S02 | Check-out trả sân | Kết thúc phiên, tổng hợp phí. |
| UC-S03 | Quản lý hóa đơn thuê đồ | Xuất kho, thêm dịch vụ. |
| UC-S04 | Kiểm định dụng cụ trả | Kiểm tra hỏng hóc. |
| UC-S05 | Áp dụng phụ thu | Tính phí hư hại. |
| UC-S06 | Phát hành Voucher | Kích cầu. |
| UC-S07 | Xác nhận bùng kèo | Làm chứng bùng kèo. |

#### 5.4 Admin
| Mã UC | Tên Use Case | Mô tả |
| :--- | :--- | :--- |
| UC-A01 | Xem Dashboard | Thống kê doanh thu, hiệu suất. |
| UC-A02 | Quản lý người dùng | Khóa/Mở tài khoản. |
| UC-A03 | Phê duyệt E-KYC | Xác thực định danh. |
| UC-A04 | Quản lý sân bãi | Thêm/Sửa/Xóa. |
| UC-A05 | Cấu hình giá | Thiết lập bảng giá động. |
| UC-A06 | Quản lý kho | Kiểm soát tồn kho. |
| UC-A07 | Giải quyết khiếu nại | Phân xử bùng kèo. |

#### 5.5 Payment Gateway
| Mã UC | Tên Use Case | Mô tả |
| :--- | :--- | :--- |
| UC-P01 | Xử lý thanh toán | Khấu trừ tiền. |
| UC-P02 | Trả Webhook | Thông báo kết quả giao dịch. |
| UC-P03 | Xử lý lệnh Hoàn tiền | Hoàn tiền khi hủy kèo. |

---

### 6. Điểm nổi bật của hệ thống
Hệ thống là giải pháp trung gian công nghệ giải quyết triệt để hai bài toán nhức nhối: kết nối lòng tin tài chính (Ví Escrow) và tối ưu hóa vận hành quầy bãi. Việc ứng dụng AI Chatbot giúp tra cứu lịch bãi và gợi ý ghép nhóm cá nhân hóa vượt trội, cùng với mô hình kinh tế 'Try-Before-You-Buy' chuyển đổi chi phí thuê đồ cũ thành ưu đãi mua sắm đồ mới, giúp tăng trưởng doanh thu phụ trợ hiệu quả.

### 7.Business Model
**7.1 Tổng quan mô hình kinh doanh:**

Pro-Sport Complex Management System là nền tảng trung gian kết nối Người chơi (Customer), Chủ sân/Quản trị viên (Admin) và Nhân viên vận hành (Staff). Hệ thống cung cấp giải pháp quản lý sân thể thao, kết nối cộng đồng người chơi và hỗ trợ thanh toán an toàn thông qua cơ chế ví trung gian (Escrow).

Mô hình kinh doanh của hệ thống tập trung vào việc tạo giá trị cho cả người chơi và chủ sân thông qua số hóa quy trình đặt sân, tổ chức kèo đấu và quản lý vận hành.

**7.2 Khách hàng mục tiêu:**

- **Người chơi cá nhân:** Có nhu cầu đặt sân, tìm đồng đội và tham gia các hoạt động thể thao.
- **Chủ sân thể thao:** Cần công cụ quản lý lịch sân, doanh thu và khách hàng.
- **Câu lạc bộ/Hội nhóm thể thao:** Tổ chức các buổi giao lưu, thi đấu hoặc giải đấu.
- **Đơn vị kinh doanh thiết bị thể thao:** Tiếp cận khách hàng thông qua quảng bá sản phẩm trên nền tảng.

**7.3 Giá trị cốt lõi (Value Proposition):**

- **Đặt sân trực tuyến:** Xem lịch sân theo thời gian thực và đặt sân nhanh chóng.
- **Kết nối người chơi:** Hỗ trợ tạo kèo, tham gia kèo và tìm kiếm đồng đội phù hợp.
- **Ví trung gian (Escrow):** Đảm bảo minh bạch tài chính và hạn chế tình trạng bùng kèo.
- **AI Chatbot:** Tìm kiếm sân bãi và gợi ý kèo đấu bằng ngôn ngữ tự nhiên.
- **Quản lý tập trung:** Hỗ trợ chủ sân quản lý lịch bãi, doanh thu và kho dụng cụ.

**7.4 Nguồn doanh thu (Revenue Streams):**

- **Phí dịch vụ đặt sân:** Thu một phần phí từ các giao dịch đặt sân thành công.
- **Phí giao dịch ví trung gian:** Thu phí xử lý khi người dùng tham gia các kèo có ký quỹ.
- **Gói thành viên Premium:** Cung cấp các tính năng nâng cao cho người dùng trả phí.
- **Quảng cáo sản phẩm thể thao:** Hợp tác với các nhà cung cấp thiết bị thể thao.
- **Dịch vụ tổ chức giải đấu:** Thu phí từ các đơn vị tổ chức giải đấu trong tương lai.

**7.5 Kênh tiếp cận khách hàng (Channels):**

- Website Pro-Sport.
- Cộng đồng Facebook, Zalo và TikTok.
- Các câu lạc bộ và trung tâm thể thao.
- Chương trình giới thiệu người dùng mới.

**7.6 Quan hệ khách hàng (Customer Relationship):**

- Tự phục vụ thông qua nền tảng trực tuyến.
- Hỗ trợ tự động bằng AI Chatbot.
- Hệ thống đánh giá uy tín người chơi.
- Tiếp nhận và xử lý khiếu nại trực tuyến.

**7.7 Lợi thế cạnh tranh:**

- Tích hợp AI hỗ trợ tìm kiếm sân và ghép kèo.
- Áp dụng cơ chế Escrow chống bùng kèo.
- Cung cấp lịch sân theo thời gian thực.
- Kết hợp quản lý sân bãi và kết nối cộng đồng trên cùng một nền tảng.
- Hỗ trợ quản lý dụng cụ và doanh thu cho chủ sân.

---

### 8. Actor Court Owner (Chủ sân) — bổ sung 2026-06

**8.1 Vai trò:** `CourtOwner` (COURT_OWNER) — quản lý dữ liệu thuộc tổ hợp được gán qua bảng `ComplexOwner`. Tách biệt với `Admin` (System Admin toàn hệ thống) và `Staff` (vận hành quầy theo `StaffAssignment`).

**8.2 Ma trận quyền (foundation):**

| Tài nguyên / API | Admin | CourtOwner | Staff | Customer |
| :--- | :---: | :---: | :---: | :---: |
| `/api/owner/*` | ✅ toàn bộ | ✅ tổ hợp được gán | ❌ 403 | ❌ 403 |
| `/owner/*` (UI) | ✅ | ✅ | ❌ 403 | ❌ 403 |
| Dashboard doanh thu/lấp sân | ✅ mọi complex | ✅ complex được gán | ❌ | ❌ |
| Sửa thông tin tổ hợp | ✅ | ✅ complex được gán | ❌ | ❌ |
| Quản lý User toàn hệ thống | ✅ | ❌ | ❌ | ❌ |

**8.3 Onboarding Court Owner:**
1. Admin tạo tài khoản User với role `CourtOwner` (hoặc chuyển role từ Customer).
2. Admin gán liên kết `ComplexOwner` (user_id, complex_id, is_primary, status = Active).
3. Chủ sân đăng nhập JWT → gọi `GET /api/owner/context` → nhận `managedComplexes` và `defaultComplexId`.
4. Frontend lưu complex đang chọn (localStorage); mọi API dashboard/complex dùng `complexId` query nhưng **quyền kiểm tra server-side** qua `OwnerAccessService`.

**8.4 Mô hình dữ liệu `ComplexOwner`:**
- `id`, `user_id`, `complex_id`, `is_primary`, `status` (Active / Inactive / Suspended)
- `approved_by`, `created_at`, `updated_at`
- UNIQUE (`user_id`, `complex_id`); index `user_id`, `complex_id`
- FK tới `Users`, `Complexes`

**8.5 Use case Owner Dashboard (UC-O01):**
- **Actor:** CourtOwner (hoặc Admin xem thay)
- **Precondition:** JWT hợp lệ; user có quyền trên `complexId`
- **Flow:** Chọn tổ hợp → `GET /api/owner/dashboard?complexId=&from=&to=` → hiển thị KPI
- **KPI:** totalRevenue, bookingRevenue, rentalRevenue, productRevenue, surchargeRevenue, refundAmount, bookingCount, pendingBookingCount, occupancyRate, activeRentalCount, damagedAssetCount, lowStockCount, upcomingBookings, revenueByDate, occupancyByCourt
- **Quy tắc:** Booking `PendingPayment`, `Cancelled`, `Expired` **không** tính vào doanh thu và occupancy

**8.6 Quy tắc bảo mật tenant isolation:**
- User hiện tại lấy từ JWT (`ICurrentUserContext`), **không tin** `ownerId` từ body/query do client gửi để xác thực.
- `complexId` trong request chỉ dùng để chọn scope; `OwnerAccessService.RequireComplexAccess` / `RequireOwnerOrAdminAccess` bắt buộc trước mọi truy vấn dữ liệu.
- Owner A không đọc được Complex của Owner B (403/404).
- Filter `OwnerApiAuthorizationFilter` chặn Customer/Staff trên mọi `/api/owner/*`.
- Service layer luôn kiểm tra quyền — không chỉ dựa vào `[Authorize]` ở Controller.

**8.7 API prefix:** `/api/owner/*` — JWT Bearer.

**8.8 Frontend:** `/owner/dashboard`, `/owner/complex`, `/owner/settings` — `OwnerRoute`, `OwnerLayout`, `ComplexSelector`.

**8.9 Tài khoản demo:** `courtowner@prosport.vn` / `Admin@123456` — ComplexId 1.

**8.10 Khác biệt kiến trúc thực tế:** Dự án dùng **ASP.NET Core 8 + EF Core + React/Vite**, không phải Java Servlet/JSP như mô tả ban đầu trong đề bài mẫu.

---

### 9. Court Owner — Task 3 (Inventory, Rental, Finance, Audit) — 2026-06

**9.1 Phạm vi:** Kho sản phẩm theo Complex, Rental Asset/Session, Condition Check, Surcharge, Voucher scoped, Báo cáo tài chính, Review tổ hợp, Audit Log đọc được.

**9.2 Entity mới:** `ProductStock`, `RentalAsset`, `RentalSession`, `RentalSessionAsset`, `ConditionCheck`, `RentalSurcharge`, `ComplexReview`. Voucher mở rộng: `ApplicableComplexId`, `ApplicableProductId`, `VoucherType`, `Status`.

**9.3 API Owner Task 3:**
| Nhóm | Endpoint |
|------|----------|
| Inventory | `GET/POST/PUT /api/owner/inventory/products`, `GET/POST/PUT/PATCH .../rental-assets` |
| Rentals | `GET/POST /api/owner/rentals`, `GET {id}`, `GET {id}/condition-history`, `POST condition-check`, `POST surcharge` |
| Voucher | `GET/POST/PUT /api/owner/vouchers`, `PATCH {id}/status` |
| Reports | `GET /api/owner/reports/revenue|occupancy|inventory|export` |
| Reviews | `GET /api/owner/reviews`, `POST {id}/reply`, `POST {id}/report` |
| Audit | `GET /api/owner/audit-logs?complexId=` |

**9.4 Frontend routes:** `/owner/inventory/products`, `/owner/inventory/rental-assets`, `/owner/rentals`, `/owner/rentals/:rentalId`, `/owner/vouchers`, `/owner/finance`, `/owner/reports`, `/owner/reviews`, `/owner/audit-logs`.

**9.5 Quy tắc nghiệp vụ:**
- Asset `RENTED` không cho thuê lại; `RentCount` tăng khi condition check final (non-damaged).
- Asset `DAMAGED` → `MAINTENANCE` → `AVAILABLE` (không tự về AVAILABLE).
- Condition history không sửa sau session `Completed`.
- Surcharge bắt buộc amount + reason + AuditLog.
- Owner không sửa PaymentTransaction/Ledger; export report sau authorization.
- Voucher scoped theo `ApplicableComplexId`; Try-Before-You-Buy qua `VoucherType`.

**9.6 Migration:** `AddOwnerTask3InventoryRental` — chạy `dotnet ef database update`.

**9.7 Deployment:** `vercel.json` rewrite SPA; CORS đọc từ `Cors:AllowedOrigins`; JWT secret từ env (không hard-code production).

**9.8 Test plan:** 43 unit tests (Task 1+2+3); IDOR qua `RequireOwnerOrAdminAccessAsync` + filter `complexId` trên mọi query.
