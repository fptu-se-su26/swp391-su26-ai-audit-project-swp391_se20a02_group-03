## [2026-05-12]
Author: VyHVM

### Added
- Khởi tạo cấu trúc thư mục tiêu chuẩn cho toàn bộ dự án (`src/backend`, `src/frontend`, `database`, `docs`)
- Tạo file cấu hình `AGENT.md` tại thư mục gốc để thiết lập bộ quy tắc chuẩn (rules) cho dự án

### AI-assisted
- Sử dụng công cụ Cursor để tham khảo và đề xuất bộ khung thư mục chuẩn cho .NET 8 và ReactJS
- Team đã tự quyết định việc bổ sung thêm file `AGENT.md` để tối ưu hóa việc quản lý mã nguồn bằng AI trong tương lai

## [2026-05-24]
Author: VyHVM

### Added
- Bổ sung mã nguồn (UI components) cho các trang giao diện Frontend còn thiếu theo đúng tài liệu SRS

### Changed
- Điều chỉnh lại toàn bộ bảng màu (color palette) và bố cục (layout) của các trang Frontend để phù hợp với định hướng thiết kế

### Fixed
- Khắc phục tình trạng vỡ layout ở một số component hiển thị trên thiết bị di động
- Cải thiện luồng trải nghiệm người dùng (UX) tại màn hình Đặt sân

### AI-assisted
- Sử dụng Google Anti-gravity để dò tìm các điểm chưa tối ưu trong UX/UI và sinh mã React components cho các trang mới
- Người thực hiện đã tự can thiệp tinh chỉnh lại các mã màu CSS để giao diện hiển thị đúng ý đồ thiết kế nhất

## [2026-05-25]
Author: VyHVM

### Added
- Thêm kịch bản tự động hóa CI/CD `deploy-pages.yml` vào thư mục `.github/workflows`

### Changed
- Cập nhật cấu hình file `vite.config.js` (thêm thuộc tính `base`) để điều hướng đúng đường dẫn mã nguồn khi chạy thực tế trên hạ tầng GitHub Pages

### AI-assisted
- Dùng Google Gemini để tự động sinh toàn bộ kịch bản YAML thực thi GitHub Actions
- Quá trình deploy được team kết hợp giám sát, tự cấu hình thêm file Vite để đảm bảo web hiển thị thành công mà không bị lỗi trắng trang
