# Prompt Log

## 1. Thông tin chung

| Thông tin | Nội dung |
|---|---|
| Môn học | Software Development Project Test |
| Mã môn học | SWP391 |
| Lớp | SE20A02 |
| Học kỳ | SU26 |
| Tên bài tập / Project | Pro Sport Manager System |
| Tên sinh viên / Nhóm | Dương Khang Huy - Group 3 |
| MSSV / Danh sách MSSV | DE190900 |
| Giảng viên hướng dẫn | QuangLTN3 |
| Ngày bắt đầu | 11/5/2026 |
| Ngày cập nhật gần nhất | 2/7/2026  |

---

## 2. Mục đích của file Prompt Log

File này dùng để ghi lại các prompt quan trọng đã sử dụng trong quá trình thực hiện bài tập, lab, assignment hoặc project.

---

## 3. Công cụ AI đã sử dụng

- [x] ChatGPT
- [x] Gemini
- [ ] Claude
- [x] GitHub Copilot
- [ ] Cursor
- [ ] Antigravity
- [ ] Microsoft Copilot
- [ ] Perplexity
- [x] Stitch with Google
- [ ] Công cụ khác: ....................................

---

## 4. Bảng tổng hợp prompt đã sử dụng

| STT | Ngày | Công cụ AI | Mục đích | Prompt tóm tắt | Kết quả chính | Có sử dụng vào bài không? | Minh chứng |
|---:|---|---|---|---|---|---|---|
| 1 | 2026-05-12 | ChatGPT | Triển khai ý tưởng rộng hơn | iả sử bạn là một designer. Dưới đây là... | AI đọc file, đánh giá ý tưởng,... | Có |   |
| 2 | 2026-05-12 | ChatGPT | Tạo prompt cho Stitch thiết kế giao diện | Viết promt AI để ra lệnh cho Stitch with google... | Create a full screen web... | Có |   |

---

## 5. Prompt chi tiết

### Prompt số 1

| Nội dung | Thông tin |
|---|---|
| Ngày sử dụng | 2026-05-24 |
| Công cụ AI | ChatGPT |
| Mục đích | Triển khai ý tưởng rộng hơn |
| Phần việc liên quan | Design |
| Mức độ sử dụng | Hỏi ý tưởng |

#### 5.1. Prompt nguyên văn

```text
giả sử bạn là một designer. Dưới đây là các chức năng mà một hệ thống tôi phát triển sẽ có. Vui lòng liệt kê ra những Màn hình (Screen) mà sẽ có trong hệ thông bên dưới, đồng thới chú thích trong những màn hình đó có những tính năng gì

1. Authentication & Authorization Module

(Module Xác thực và Phân quyền)

Chức năng chính
Đăng ký tài khoản
Đăng nhập / Đăng xuất
Quên mật khẩu
Xác thực E-KYC bằng CCCD/Thẻ sinh viên
Phân quyền hệ thống:
Customer
Staff
Admin
JWT/Session authentication
Quản lý hồ sơ người dùng
Actors
Guest
Customer
Staff
Admin
Yêu cầu nghiệp vụ
Email phải duy nhất
Mật khẩu mã hóa
Staff/Admin có quyền truy cập dashboard quản trị
Chỉ user đã xác thực mới được thuê dụng cụ cao cấp
2. Court Management Module

(Module Quản lý Sân)

Chức năng chính
CRUD sân thể thao
Quản lý loại sân:
Cầu lông
Pickleball
Quản lý trạng thái sân:
Available
Maintenance
Booked
Thiết lập giá theo giờ
Upload hình ảnh sân
Actors
Admin
Staff
Yêu cầu nghiệp vụ
Không cho phép xóa sân đang có booking
Có thể cấu hình khung giờ hoạt động
3. Smart Booking Module

(Module Đặt Sân Thông Minh)

Chức năng chính
Xem lịch sân realtime
Tìm slot trống
Đặt sân online
Đặt cọc
Thanh toán booking
Auto lock slot khi thanh toán
Hủy booking
Booking history
Actors
Customer
Staff
Yêu cầu nghiệp vụ
Không được trùng lịch sân
Lock slot tối đa X phút khi thanh toán
Booking chỉ confirm khi thanh toán thành công
Core Features
Real-time availability
Conflict detection
Booking transaction handling
4. Social Matching Module

(Module Cáp Kèo / Kết Nối Người Chơi)

Chức năng chính
Tạo bài đăng tìm người chơi
Join kèo
Approve/Reject thành viên
Hiển thị trình độ chơi
Tính phí tham gia tự động
Escrow payment
Check-in người tham gia
Đánh dấu no-show
Actors
Customer
Yêu cầu nghiệp vụ
Người tham gia phải trả tiền trước
Nếu vắng mặt:
bị trừ phí
Host chỉ nhận tiền khi xác nhận đủ người
Core Features
Anti no-show mechanism
Shared payment logic
5. Inventory Management Module

(Module Quản lý Kho & Dụng cụ)

Chức năng chính
CRUD sản phẩm
Quản lý:
Kho New
Kho Demo/Rental
Theo dõi tồn kho
Theo dõi Rent_Count
Theo dõi khấu hao
Quản lý thương hiệu
Quản lý danh mục
Actors
Staff
Admin
Yêu cầu nghiệp vụ
Sản phẩm demo không được bán như hàng mới
Tự động cập nhật số lượt thuê
6. Rental Management Module

(Module Thuê/Mượn Dụng Cụ)

Chức năng chính
Thuê dụng cụ tại sân
POS interface cho Staff
Ghi nhận thời gian mượn
Trả dụng cụ
Condition Check:
Normal
Minor Scratch
Damaged
Tính surcharge
Rental history
Actors
Staff
Customer
Yêu cầu nghiệp vụ
Có thể yêu cầu đặt cọc
Nếu hư hỏng:
tự động tính phụ phí
Lưu lịch sử tình trạng sản phẩm
7. E-commerce Module

(Module Bán Hàng Online)

Chức năng chính
Hiển thị sản phẩm
Search / Filter
Product detail
Shopping cart
Checkout
Order management
Voucher usage
Actors
Customer
Yêu cầu nghiệp vụ
Chỉ hàng New mới được bán
Kiểm tra tồn kho trước checkout
8. Payment Integration Module

(Module Thanh Toán)

Chức năng chính
VNPay integration
MoMo integration
Deposit payment
Refund processing
Escrow payment handling
Transaction history
Actors
Customer
System
Yêu cầu nghiệp vụ
Payment callback phải verify chữ ký
Giao dịch thất bại phải rollback
9. Promotion & Voucher Module

(Module Khuyến mãi)

Chức năng chính
Sinh voucher tự động
Try-Before-You-Buy
Discount management
Voucher validation
Expiration management
Actors
Admin
Customer
Yêu cầu nghiệp vụ
Voucher chỉ dùng 1 lần
Voucher sinh từ rental phải đúng giá trị thuê
10. Dashboard & Reporting Module

(Module Dashboard & Báo Cáo)

Chức năng chính
Revenue dashboard
Court occupancy statistics
Booking statistics
Rental statistics
Best-selling products
User activity analytics
Actors
Admin
Yêu cầu nghiệp vụ
Dashboard realtime/basic realtime
Export Excel/PDF
11. Notification Module

(Module Thông Báo)

Chức năng chính
Email booking confirmation
Payment notification
Reminder trước giờ chơi
Voucher notification
Social matching updates
Actors
System
Customer
Yêu cầu nghiệp vụ
Gửi email sau thanh toán thành công
Reminder trước X phút
12. Audit & Logging Module

(Module Nhật ký hệ thống)

Chức năng chính
Log login/logout
Log payment transaction
Log inventory changes
Log booking updates
Error logging
Actors
Admin
System
Yêu cầu nghiệp vụ
Không cho sửa log
Theo dõi lịch sử thay đổi dữ liệu quan trọng
13. System Administration Module

(Module Quản trị hệ thống)

Chức năng chính
Quản lý user
Quản lý role
System settings
Court pricing configuration
Operating hours
Maintenance scheduling
Actors
Admin
```

#### 5.2. Bối cảnh khi viết prompt

```text
```

#### 5.3. Kết quả AI trả về

```text
Dưới góc nhìn của một UI/UX Designer, hệ thống này sẽ được chia thành nhiều **Screen (Màn hình)** theo từng nhóm nghiệp vụ để dễ sử dụng, dễ mở rộng và đúng flow người dùng.

---

# 1. Authentication & Authorization Module

## (Xác thực & Phân quyền)

### 1.1 Landing Page / Home

**Chức năng**

* Giới thiệu hệ thống
* CTA:

  * Đăng nhập
  * Đăng ký
  * Xem sân
  * Xem sản phẩm
* Banner khuyến mãi
* Giới thiệu dịch vụ

---

### 1.2 Login Screen

**Chức năng**

* Đăng nhập email/password
* Remember me
* Đăng nhập Google/Facebook (optional)
* Quên mật khẩu
* Validate tài khoản

---

### 1.3 Register Screen

**Chức năng**

* Nhập:

  * Họ tên
  * Email
  * Password
  * Confirm password
* Chấp nhận điều khoản
* Validate email unique

---

### 1.4 Forgot Password Screen

**Chức năng**

* Nhập email
* Gửi OTP/link reset
* Reset password

---

### 1.5 E-KYC Verification Screen

**Chức năng**

* Upload CCCD/Thẻ sinh viên
* Camera scan
* OCR preview
* Xác thực trạng thái:

  * Pending
  * Verified
  * Rejected

---

### 1.6 User Profile Screen

**Chức năng**

* Avatar
* Thông tin cá nhân
* Đổi mật khẩu
* Trạng thái KYC
* Lịch sử hoạt động
* Membership/VIP

---

### 1.7 Role & Permission Management Screen (Admin)

**Chức năng**

* CRUD role
* Gán quyền:

  * Customer
  * Staff
  * Admin
* Matrix permission table

---

# 2. Court Management Module

## (Quản lý sân)

### 2.1 Court List Screen

**Chức năng**

* Danh sách sân
* Filter:

  * Loại sân
  * Trạng thái
* Search sân
* Quick status

---

### 2.2 Court Detail Screen

**Chức năng**

* Hình ảnh sân
* Giá theo giờ
* Trạng thái
* Lịch hoạt động
* Mô tả sân

---

### 2.3 Create/Edit Court Screen

**Chức năng**

* CRUD sân
* Upload ảnh
* Cấu hình:

  * Giờ hoạt động
  * Giá
  * Loại sân
  * Maintenance

---

### 2.4 Court Schedule Management Screen

**Chức năng**

* Calendar view
* Block maintenance slot
* Set available hours
* Drag/drop slot

---

# 3. Smart Booking Module

## (Đặt sân thông minh)

### 3.1 Real-time Court Availability Screen

**Chức năng**

* Live court schedule
* Xem slot trống
* Color trạng thái:

  * Available
  * Booked
  * Locked

---

### 3.2 Booking Search Screen

**Chức năng**

* Tìm sân theo:

  * Thời gian
  * Môn chơi
  * Giá
* Gợi ý slot phù hợp

---

### 3.3 Booking Detail Screen

**Chức năng**

* Thông tin booking
* Chọn thời gian
* Chọn sân
* Chọn dịch vụ thêm

---

### 3.4 Payment & Deposit Screen

**Chức năng**

* Thanh toán
* Đặt cọc
* Chọn cổng:

  * VNPay
  * MoMo
* Countdown lock slot

---

### 3.5 Booking Success Screen

**Chức năng**

* QR booking
* Invoice
* Email confirmation
* Add to calendar

---

### 3.6 Booking History Screen

**Chức năng**

* Danh sách booking
* Filter trạng thái
* Hủy booking
* Re-book

---

# 4. Social Matching Module

## (Cáp kèo / Kết nối người chơi)

### 4.1 Social Feed Screen

**Chức năng**

* Danh sách kèo
* Feed realtime
* Search theo:

  * Skill
  * Khu vực
  * Thời gian

---

### 4.2 Create Match Post Screen

**Chức năng**

* Tạo bài tìm người chơi
* Chọn:

  * Trình độ
  * Số lượng
  * Phí tham gia
  * Sân
  * Thời gian

---

### 4.3 Match Detail Screen

**Chức năng**

* Thông tin kèo
* Danh sách thành viên
* Join kèo
* Payment escrow

---

### 4.4 Match Approval Screen (Host)

**Chức năng**

* Approve/Reject người tham gia
* Quản lý waiting list

---

### 4.5 Check-in Management Screen

**Chức năng**

* QR check-in
* Mark no-show
* Attendance tracking

---

# 5. Inventory Management Module

## (Quản lý kho)

### 5.1 Inventory Dashboard Screen

**Chức năng**

* Tổng quan tồn kho
* Sản phẩm sắp hết
* Rental usage

---

### 5.2 Product List Screen

**Chức năng**

* CRUD sản phẩm
* Search/filter
* Inventory status

---

### 5.3 Product Detail Screen

**Chức năng**

* Hình ảnh
* Thông số
* Rent count
* Depreciation
* Inventory history

---

### 5.4 Brand Management Screen

**Chức năng**

* CRUD brand
* Brand logo

---

### 5.5 Category Management Screen

**Chức năng**

* CRUD category
* Category hierarchy

---

# 6. Rental Management Module

## (Thuê/Mượn dụng cụ)

### 6.1 Rental POS Screen

**Chức năng**

* Staff chọn sản phẩm
* Scan barcode
* Quick checkout
* Deposit handling

---

### 6.2 Rental Checkout Screen

**Chức năng**

* Xác nhận thuê
* Thời gian thuê
* Điều kiện sản phẩm

---

### 6.3 Return Equipment Screen

**Chức năng**

* Return item
* Condition check:

  * Normal
  * Scratch
  * Damaged
* Auto surcharge

---

### 6.4 Rental History Screen

**Chức năng**

* Lịch sử thuê
* Tình trạng thiết bị
* Fee history

---

# 7. E-commerce Module

## (Bán hàng online)

### 7.1 Product Catalog Screen

**Chức năng**

* Grid/list sản phẩm
* Search/filter
* Category menu

---

### 7.2 Product Detail Screen

**Chức năng**

* Ảnh sản phẩm
* Review
* Inventory
* Add to cart

---

### 7.3 Shopping Cart Screen

**Chức năng**

* Danh sách sản phẩm
* Quantity update
* Voucher apply

---

### 7.4 Checkout Screen

**Chức năng**

* Shipping info
* Payment method
* Order summary

---

### 7.5 Order History Screen

**Chức năng**

* Tracking order
* Invoice
* Reorder

---

# 8. Payment Integration Module

## (Thanh toán)

### 8.1 Payment Gateway Screen

**Chức năng**

* Chọn phương thức thanh toán
* VNPay/MoMo

---

### 8.2 Transaction History Screen

**Chức năng**

* Lịch sử giao dịch
* Refund status
* Escrow status

---

### 8.3 Refund Management Screen

**Chức năng**

* Request refund
* Approve/refuse refund

---

# 9. Promotion & Voucher Module

## (Khuyến mãi)

### 9.1 Voucher List Screen

**Chức năng**

* Danh sách voucher
* Expiration status

---

### 9.2 Create Voucher Screen

**Chức năng**

* Discount config
* Quantity
* Expiration
* Conditions

---

### 9.3 Voucher Validation Screen

**Chức năng**

* Check voucher valid
* Remaining usage

---

# 10. Dashboard & Reporting Module

## (Dashboard & Báo cáo)

### 10.1 Admin Dashboard Screen

**Chức năng**

* Revenue chart
* Booking chart
* Occupancy
* KPI cards

---

### 10.2 Analytics Screen

**Chức năng**

* User analytics
* Peak hours
* Top products

---

### 10.3 Report Export Screen

**Chức năng**

* Export:

  * Excel
  * PDF
* Date range filter

---

# 11. Notification Module

## (Thông báo)

### 11.1 Notification Center Screen

**Chức năng**

* Booking reminder
* Payment status
* Match updates

---

### 11.2 Email Template Management Screen (Admin)

**Chức năng**

* Customize email template
* Preview email

---

# 12. Audit & Logging Module

## (Nhật ký hệ thống)

### 12.1 System Logs Screen

**Chức năng**

* Login/logout logs
* Error logs
* Payment logs

---

### 12.2 Audit Trail Screen

**Chức năng**

* Theo dõi thay đổi dữ liệu
* User action history
* Immutable logs

---

# 13. System Administration Module

## (Quản trị hệ thống)

### 13.1 User Management Screen

**Chức năng**

* CRUD user
* Ban/unban
* Reset password

---

### 13.2 System Settings Screen

**Chức năng**

* Operating hours
* Pricing config
* Maintenance mode

---

### 13.3 Maintenance Scheduling Screen

**Chức năng**

* Lên lịch bảo trì sân
* Notify affected bookings

---

# 14. Cross-system Shared Screens

## (Màn hình dùng chung)

### 14.1 Header / Navigation

**Chức năng**

* Search global
* Notification bell
* User menu

---

### 14.2 Sidebar Dashboard

**Chức năng**

* Dynamic menu theo role
* Quick actions

---

### 14.3 Error / Empty State Screens

**Chức năng**

* 404
* No booking
* Payment failed

---

# Tổng kết kiến trúc UI

## Nhóm Customer Screens

* Booking
* Social matching
* Shopping
* Rental
* Payment
* Notifications
* Profile

---

## Nhóm Staff Screens

* POS rental
* Court management
* Booking support
* Inventory management

---

## Nhóm Admin Screens

* Dashboard
* Analytics
* User management
* Audit logs
* System configuration
* Promotions

---

# Ước lượng số lượng màn hình

| Module           | Số Screen |
| ---------------- | --------- |
| Authentication   | 7         |
| Court Management | 4         |
| Booking          | 6         |
| Social Matching  | 5         |
| Inventory        | 5         |
| Rental           | 4         |
| E-commerce       | 5         |
| Payment          | 3         |
| Promotion        | 3         |
| Dashboard        | 3         |
| Notification     | 2         |
| Audit            | 2         |
| Administration   | 3         |
| Shared           | 3         |

### Tổng khoảng:

# ~55–60 Screens

Đây là quy mô khá chuẩn cho:

* Capstone Project
* SWP391
* Startup MVP+
* SaaS Sport Complex Platform

```

#### 5.4. Kết quả đã áp dụng vào bài

```text
All of the result (with review)
```

#### 5.5. Phần sinh viên/nhóm đã chỉnh sửa hoặc cải tiến

```text
Chỉnh sửa lại một vài chỗ còn chưa hợp lí, chỉnh lại các tools
```

#### 5.6. Đánh giá chất lượng prompt

- [x] Prompt rõ ràng
- [x] Prompt có đủ bối cảnh
- [ ] Prompt còn thiếu thông tin
- [x] Prompt tạo ra kết quả tốt
- [ ] Prompt tạo ra kết quả chưa phù hợp
- [ ] Cần hỏi lại AI nhiều lần
- [ ] Cần tự kiểm tra và chỉnh sửa nhiều

#### 5.7. Minh chứng liên quan

| Loại minh chứng | Nội dung |
|---|---|
| File/Link |   |

#### 5.8. Ghi chú thêm

```text
 
```

---

### Prompt số 2

| Nội dung | Thông tin |
|---|---|
| Ngày sử dụng | 2026-05-24 |
| Công cụ AI | ChatGPT |
| Mục đích | Tạo prompt cho Stitch thiết kế giao diện |
| Phần việc liên quan | Design |
| Mức độ sử dụng | Hỏi ý tưởng |

#### 5.1. Prompt nguyên văn

```text
Viết promt AI để ra lệnh cho Stitch with google (Một công cụ thiết kế UX/UI AI) thiết kế cho mình các màn hình trong Authentication & Authorization Module.
Yêu cầu là mô tả rõ hệ thống này là hệ thống gì để stitch tạo UX/UI chuẩn nhất
```

#### 5.2. Bối cảnh khi viết prompt

```text

```

#### 5.3. Kết quả AI trả về

```text
Design a modern, professional, and scalable UX/UI for a web-based sport complex management platform called “Pro-Sport Complex Management System”.

SYSTEM OVERVIEW:
This system is an all-in-one sports ecosystem platform that allows users to:

* Book badminton and pickleball courts in real-time
* Rent sports equipment
* Purchase sports products online
* Join social matches and connect with other players
* Manage payments, vouchers, and bookings
* Support staff/admin operations with dashboards and analytics

The platform has 4 user roles:

1. Guest
2. Customer
3. Staff
4. Admin

The design style should feel:

* Modern SaaS product
* Clean and premium
* Sport-tech startup aesthetic
* Similar quality level to Airbnb, Playtomic, Notion, Stripe Dashboard, or Decathlon apps
* Minimal but highly usable
* Mobile-first responsive design
* Smooth UX flow with clear hierarchy

PRIMARY COLOR STYLE:

* Dark navy / royal blue
* White background sections
* Neon green or cyan accent
* Soft shadows
* Rounded cards/buttons
* Clean typography
* Glassmorphism/light futuristic sports-tech feeling

TARGET USERS:

* Young sports players (18–35)
* University students
* Amateur and semi-professional badminton/pickleball players
* Sports center staff
* Sport complex administrators

IMPORTANT UX REQUIREMENTS:

* Fast onboarding flow
* Easy authentication
* Trustworthy verification process
* Professional dashboard access for staff/admin
* Security-focused design
* Real-time status indicators
* Accessibility-friendly UI
* Clear visual feedback and validation states

NOW DESIGN THE FOLLOWING SCREENS:

1. Landing Page
   Features:

* Hero section with sports court visuals
* CTA buttons:

  * Login
  * Register
  * Book Court
* Feature showcase
* Social proof/testimonials
* Responsive navigation bar

2. Login Screen
   Features:

* Email/password login
* Remember me
* Forgot password link
* Login with Google
* Validation error states
* Modern card-based auth layout

3. Register Screen
   Features:

* Full name
* Email
* Password
* Confirm password
* Terms & conditions checkbox
* Email uniqueness validation
* Success feedback UI

4. Forgot Password Screen
   Features:

* Email input
* Send OTP/reset link
* Success state
* Minimal clean layout

5. Reset Password Screen
   Features:

* OTP verification
* New password
* Confirm password
* Password strength indicator

6. E-KYC Verification Screen
   Features:

* Upload Citizen ID / Student Card
* Camera scan placeholder
* OCR preview section
* Verification status:

  * Pending
  * Verified
  * Rejected
* Security/trust UI indicators

7. User Profile Screen
   Features:

* Profile avatar
* Personal information
* Verification badge
* Edit profile
* Change password
* Booking summary
* Rental history preview

8. Staff/Admin Dashboard Entry Screen
   Features:

* Role-based dashboard access
* Quick statistics cards
* Sidebar navigation
* Secure admin aesthetic
* Notification panel

9. Role & Permission Management Screen (Admin)
   Features:

* User list table
* Role assignment
* Permission matrix
* Toggle permissions
* Search/filter users

UX/UI GUIDELINES:

* Use consistent design system
* Design reusable components
* Use realistic dashboard cards/charts
* Include hover/focus states
* Use modern icons
* Include empty states and loading states
* Use realistic spacing and typography hierarchy
* Prioritize usability and conversion

DELIVERABLE STYLE:

* High-fidelity UI mockups
* Figma-ready structure
* Real SaaS product quality
* Professional component organization
* Responsive layouts for desktop and mobile

Generate all screens with consistent design language and connected user flow.


```

#### 5.4. Kết quả đã áp dụng vào bài

```text
All of it with review
```

#### 5.5. Phần sinh viên/nhóm đã chỉnh sửa hoặc cải tiến

```text

```

#### 5.6. Đánh giá chất lượng prompt

- [x] Prompt rõ ràng
- [x] Prompt có đủ bối cảnh
- [ ] Prompt còn thiếu thông tin
- [x] Prompt tạo ra kết quả tốt
- [ ] Prompt tạo ra kết quả chưa phù hợp
- [ ] Cần hỏi lại AI nhiều lần
- [x] Cần tự kiểm tra và chỉnh sửa nhiều

#### 5.7. Minh chứng liên quan

| Loại minh chứng | Nội dung |
|---|---|
| File/Link |   |

#### 5.8. Ghi chú thêm

```text
 
```

---

## 6. Prompt quan trọng nhất

### 6.1. Prompt được chọn

```text
Viết promt AI để ra lệnh cho Stitch with google (Một công cụ thiết kế UX/UI AI) thiết kế cho mình các màn hình trong Authentication & Authorization Module.
Yêu cầu là mô tả rõ hệ thống này là hệ thống gì để stitch tạo UX/UI chuẩn nhất
```

### 6.2. Vì sao prompt này quan trọng?

```text
 
```

### 6.3. Kết quả prompt này mang lại

```text
AI đọc file, đánh giá ý tưởng, chỉ ra chỗ nào tốt chỗ nào cần cải thiện, triển khai ý tưởng web sâu hơn,...
```

### 6.4. Sinh viên/nhóm đã kiểm tra kết quả như thế nào?

```text
All of of the result (with review)
```

### 6.5. Sinh viên/nhóm đã cải tiến gì từ kết quả AI?

```text
Chỉnh sửa lại một vài chỗ còn chưa hợp lí, chỉnh lại các tools, framework sử dụng, confirm lại ý tưởng và các câu hỏi mở của AI
```

---

## 7. Prompt chưa hiệu quả

```text
Chưa có prompt chưa hiệu quả được ghi nhận.
```

---

## 8. Bài học về cách viết prompt

### 8.1. Khi viết prompt, em/nhóm cần cung cấp thông tin gì để AI trả lời tốt hơn?

```text
Mục tiêu rõ ràng: muốn AI làm gì
Context: project, tech stack, tình huống hiện tại
Yêu cầu cụ thể: dùng framework gì, style gì, best practice không
Constraint: không dùng gì, giới hạn gì
Output mong muốn: code, roadmap, bảng, markdown, prompt,...
Ví dụ input/output nếu có
Thông tin hiện tại: lỗi gì, đã thử gì rồi
```

### 8.2. Em/nhóm đã học được gì về cách đặt câu hỏi cho AI?

```text
Prompt tốt thường có:
- Mục tiêu rõ ràng
- Context đầy đủ
- Yêu cầu cụ thể
- Constraint / giới hạn
- Format output mong muốn
- Ví dụ nếu có
```

### 8.3. Lần sau em/nhóm sẽ cải thiện prompt như thế nào?

```text
Cung cấp nhiều context hơn
Nói rõ output muốn nhận
Đưa constraint ngay từ đầu
Thêm ví dụ thực tế
Chia task lớn thành nhiều bước
Mention tech stack/version cụ thể
Mô tả lỗi và expected behavior rõ hơn
```

---

## 9. Phân loại prompt đã sử dụng

| Loại prompt | Số lượng | Ví dụ prompt tiêu biểu |
|---|---:|---|
| Prompt Design | 2 |  |

---

## 10. Checklist chất lượng prompt

| Tiêu chí | Đã đạt? | Ghi chú |
|---|:---:|---|
| Prompt có mục tiêu rõ ràng | x | |
| Prompt có đủ bối cảnh | x | |
| Tự kiểm tra và chỉnh sửa | x | |

---

## 11. Cam kết sử dụng prompt minh bạch

## 16. Cam kết Prompt

| Đại diện sinh viên/nhóm | Ngày xác nhận |
|---|---|
| Hồ Võ Minh Vỹ | 24/5/2026 |
