# UI Audit Report

## 1. Cấp độ Macro (Architecture & Layouts)
- **Information Architecture:** Phân tách rạch ròi 3 luồng: `User (/apex)`, `Owner (/owner)`, `Admin (/admin)`. Tuy nhiên, User Portal đang ôm đồm nhiều tabs ở Sidebar (Shop, Matches, Activity, Settings...) khiến Sidebar dài.
- **Application Shell:** `ApexLayout` có fixed sidebar bên trái, header cố định bên trên. Đây là chuẩn SaaS tốt, tuy nhiên ở màn hình dưới 1024px Sidebar chiếm quá nhiều diện tích.
- **Responsive Strategy:** Breakpoint 900px được dùng cho Hamburger Menu ở ApexLayout. OwnerLayout cũng dùng 900px. Khá nhất quán nhưng cần chuyển hẳn sang `md (768px)` và `lg (1024px)` của Tailwind cho đồng bộ toàn cục.

## 2. Cấp độ Meso (Components & Pages)
- **User Dashboard (`/apex`):** "Next Game Hero" thiết kế đẹp, nhưng phần "Sự kiện sắp tới" chiếm quá nhiều spotlight so với việc "Đặt sân ngay" - vốn là core action.
- **Booking Flow (`/apex/booking`):** Stepper 3 bước hợp lý, nhưng phần "Tóm tắt đặt sân" trên desktop bị dính (sticky) ở top 24, nếu màn hình nhỏ có thể bị lỗi tràn viền.
- **Admin Tables (`/admin/users`):** `AdminTable` dùng padding khá rộng (p-4), dẫn đến mật độ dữ liệu thấp. Cần chuyển sang "compact mode" (py-2 px-3) cho Admin.
- **Error/Empty States:** Các trang như `/admin/users` đã có Empty State, tuy nhiên thiếu illustration đồng bộ hoặc các Call To Action (VD: "Thêm người dùng ngay").

## 3. Cấp độ Micro (Typography, Spacing, Visuals)
- **Typography:** Đang dùng `Inter` cho body và `Montserrat` cho Heading. Kích thước chữ ở User Portal khá tốt (14-16px), nhưng ở Admin cần scale xuống 13px để hiển thị nhiều thông tin.
- **Shadows:** Dự án đang lạm dụng quá nhiều các box shadow khác nhau (VD: `shadow-[0_2px_12px_rgba(0,0,0,0.03)]`, `shadow-[0_4px_24px_rgba(0,0,0,0.04)]`). Cần quy chuẩn hóa thành token.
- **Colors:** Teal (`#14b8a6`) đang dùng làm primary action. Cần đưa vào file CSS dưới dạng `var(--color-primary)` đồng bộ.
- **Buttons:** Nút ở User Portal có hiệu ứng translate và box-shadow (brutalist vibe) từ file `index.css` (class `.btn-primary`). Tuy nhiên ở Admin lại đang mix nhiều style nút khác nhau.

## Top 20 Gaps Nghiêm Trọng (P0/P1)
1. **P1 (Admin):** Mật độ dữ liệu ở Admin Tables quá loãng, cần chuyển sang Compact Density.
2. **P1 (User):** Responsive UI ở trang `/apex/booking` bước 2 (chọn giờ) bị vỡ layout trên thiết bị màn hình hẹp (390px).
3. **P2 (Global):** Hệ thống z-index lộn xộn (Header z-100, Sidebar z-200), dễ gây lỗi overlay với Modal.
4. **P2 (Owner/Admin):** Thiếu bulk actions (chọn nhiều row) trong Table để xử lý hàng loạt.
*(Tiếp tục bổ sung trong quá trình remediation)*

## Quick Wins
- Chuẩn hóa CSS Variables trong `index.css`.
- Thu gọn Padding/Margin trong `AdminTable`.
- Đồng bộ lại hiệu ứng Hover cho toàn bộ Button.
