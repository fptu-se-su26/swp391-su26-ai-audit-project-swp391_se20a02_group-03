# Canonical Design System Specification

Dựa trên yêu cầu "Minimalist/Cold Luxury" và "Say NO to AI Slop".

## 1. Design Tokens (CSS Variables)

```css
:root {
  /* Colors - Core */
  --color-primary: #14b8a6; /* Teal 500 */
  --color-primary-hover: #0f9e8c;
  --color-ink: #0f172a; /* Slate 900 */
  --color-paper: #ffffff;
  --color-surface: #f8f9fa;

  /* Colors - Semantics */
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-danger: #ef4444;
  --color-info: #3b82f6;

  /* Borders & Shadows */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-full: 9999px;

  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-md: 0 4px 12px rgba(0,0,0,0.03);
  --shadow-float: 0 8px 30px rgba(0,0,0,0.08);
}
```

## 2. Density Contexts

Hệ thống cung cấp 3 cấp độ density:
- **Comfortable (User Portal):** Padding lớn (`p-6` đến `p-8`), Radius lớn (`rounded-2xl`), Font to (`14px-16px`). Trọng tâm: Dễ bấm, dễ nhìn trên mobile.
- **Operational (Owner Portal):** Padding trung bình (`p-4` đến `p-6`), Radius vừa (`rounded-xl`), Font trung bình (`13px-15px`). Trọng tâm: Tốc độ xử lý.
- **Compact (Admin Portal):** Padding nhỏ (`p-3` đến `p-4`), Radius nhỏ (`rounded-lg`), Font nhỏ (`12px-14px`). Trọng tâm: Mật độ dữ liệu cao, dễ quét.

## 3. Shared Components Architecture

Các component dùng chung nằm ở `src/components/ui/`:
- `BaseButton`: Xử lý variants (solid, outline, ghost) và sizes (sm, md, lg).
- `BaseTable`: Component bảng có hỗ trợ compact mode prop.
- `BaseCard`: Container chứa shadow và radius theo context.
- `StatusBadge`: Chuẩn hóa màu sắc trạng thái.
- `PageHeader`: Tiêu đề trang + Breadcrumb + Actions.
