# Remediation Plan & Rollout Strategy

## Kế hoạch thực thi theo Batch

### Batch 1: Core Foundation (Cơ sở hạ tầng UI)
- **Mục tiêu:** Cập nhật `src/frontend/src/index.css` với các Canonical Tokens mới.
- **Hành động:**
  - Tạo các helper classes cho button, card dựa trên token.
  - Chuẩn hóa lại các typography utilities.
  - Chạy Regression Test để đảm bảo không làm gãy UI hiện tại (đặc biệt là Staff/Mobile App).

### Batch 2: Pilot Rollout (Thử nghiệm diện hẹp)
- **Mục tiêu:** Áp dụng Design System lên các trang lõi của từng Role để đánh giá mức độ tương thích.
- **Scope:**
  - `User`: `/apex` (Dashboard) và `/apex/booking` (Core flow).
  - `Owner`: `/owner/dashboard` và `/owner/bookings`.
  - `Admin`: `/admin/dashboard` và `/admin/users`.
- **Hành động:** Chuyển đổi component, padding, typography sang chuẩn Density mới. Trình User phê duyệt trước khi đi tiếp.

### Batch 3: User Portal Full Rollout
- **Mục tiêu:** Đồng bộ UI/UX cho toàn bộ hành trình User.
- **Scope:** `/apex/*`, `/gear/*`, `/matches/*`.
- **Ưu tiên:** Trải nghiệm đặt sân (Checkout), Khám phá sản phẩm (Shop), Giao diện Wallet. Cải thiện Responsive hoàn toàn trên thiết bị màn hình hẹp (390px).

### Batch 4: Owner Portal Full Rollout
- **Mục tiêu:** Làm mượt mà các luồng thao tác hàng ngày của chủ sân.
- **Scope:** `/owner/*` (Các trang còn lại sau Pilot).
- **Ưu tiên:** Calendar View, Finance Dash, Staff Management.

### Batch 5: Admin Portal Full Rollout
- **Mục tiêu:** Nén mật độ thông tin (Compact Density) cho hệ thống Admin.
- **Scope:** `/admin/*`.
- **Ưu tiên:** Các bảng quản lý lớn (Courts, KYC, Complaints), thêm chức năng thao tác nhanh.

### Batch 6: Final Polish & Accessibility
- **Mục tiêu:** Rà soát và hoàn thiện chi tiết.
- **Hành động:**
  - Check WCAG 2.2 Contrast Ratio.
  - Fix focus states cho keyboard navigation.
  - Đo đạc Performance (Web Vitals).

## Rủi ro và Rollback
- **Rủi ro:** Sửa CSS global (`index.css`) có thể làm vỡ layout của nhánh `Staff` hoặc `Mobile`.
- **Rollback:** Thực hiện thay đổi thông qua Git branch riêng biệt, dùng UI Components cô lập (Scoped) thay vì đè tag HTML gốc. Mọi sự cố sẽ được revert commit CSS.

## Batch 1.5: Delta Plan - Hotfix Remediation
- **Mục tiêu:** Sửa các lỗi functional và runtime được báo cáo từ code review.
- **Phạm vi & Hành động:**
  1. `CartCheckoutPage.jsx`: Sửa điều kiện kiểm tra thanh toán thành `response.success === true` thay vì `statusCode === 200`. Đảm bảo clear cart và navigate. Xử lý lỗi từ backend message. Thêm test.
  2. `CartCheckoutPage.jsx`: Sửa công thức tổng tiền `cartData?.grandTotal ?? cartData?.totalPrice` và xử lý dự phòng fallback. Cập nhật tính toán Wallet shortfall. Thêm test.
  3. `OwnerEmptyState`: Import đầy đủ icon `Search`, `Calendar`, `Users` trong 3 file `OwnerAuditLogsPage.jsx`, `OwnerBookingCalendarPage.jsx`, `OwnerMembershipsPage.jsx`.
  4. `OwnerFormField`: Sửa Rules of Hooks bằng cách đưa `useId()` ra ngoài và gọi không điều kiện.
