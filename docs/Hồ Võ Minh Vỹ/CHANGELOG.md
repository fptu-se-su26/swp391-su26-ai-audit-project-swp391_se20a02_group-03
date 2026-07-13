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

## [2026-06-01]
Author: VyHVM

### Added
- Hoàn thành chức năng Login và Register cho người dùng
- Tích hợp gọi API authentication từ Frontend tới Backend

### AI-assisted
- Sử dụng Cursor để sinh form đăng nhập, đăng ký
- Người thực hiện can thiệp thêm logic xác thực (validation) và phân quyền người dùng

## [2026-06-11]
Author: VyHVM

### Added
- Thiết kế và thiết lập cấu trúc Database cho dự án
- Thêm các bảng Entity và migration script cần thiết

### Changed
- Cập nhật UI cho trang Login/Register theo guideline màu sắc của dự án (thực hiện ngày 10/06)

### AI-assisted
- Dùng Google Gemini điều chỉnh UI form Login/Register
- Dùng Cursor tạo các bảng Database cơ bản
- Quyết định thủ công: Tự thêm các trường dữ liệu quan trọng và cấu hình lại quan hệ các bảng

## [2026-06-18]
Author: VyHVM

### Added
- Hoàn thành chức năng Booking (đặt sân)

### Fixed
- Sửa lỗi xung đột giờ khi đặt sân (conflict thời gian trống)

### AI-assisted
- Sử dụng Google Gemini và Cursor để xây dựng luồng API và giao diện chọn giờ
- Người thực hiện bổ sung thêm transaction khi ghi database để đảm bảo toàn vẹn dữ liệu, tránh trùng lịch

## [2026-06-27]
Author: VyHVM

### Added
- Phát triển API Quản lý thiết bị kho (CRUD) (thực hiện ngày 20/06)

### Changed
- Refactor lại mã nguồn Frontend, cấu trúc lại các component để tăng khả năng tái sử dụng

### AI-assisted
- Dùng Google Gemini tạo CRUD API thiết bị kho
- Dùng Cursor để tổ chức lại component Frontend
- Quyết định thủ công: Gộp các component nhỏ và xóa code dư thừa, bổ sung thuộc tính tình trạng cho thiết bị kho

## [2026-07-14]
Author: VyHVM

### Removed
- Gỡ bỏ hoàn toàn chức năng Cho thuê đồ (equipment rental): xóa các entity `RentalAsset`, `RentalSession`, `RentalSessionAsset`, `ConditionCheck`, `RentalSurcharge`, `BookingDetailEquipment` cùng service/repository/controller/DTO liên quan ở cả 2 hệ (thuê tại quầy của Staff và Rental Asset của Owner)
- Gỡ các trang và route rental phía Frontend (`OwnerRentals`, `OwnerRentalAssets`, `OwnerRentalDetail`, `DashRentals`, `EliteEquipment`) và chuyển trang cửa hàng về chế độ chỉ "Mua"

### Changed
- Tái tạo (regenerate) migration `InitialCreate` sạch, không còn bảng rental
- Chuẩn hóa trạng thái xác thực E-KYC của User về bộ giá trị thống nhất (`Unverified`/`Pending`/`Verified`/`Rejected`), khắc phục lệch giữa "Verified" (seed/Google) và "Approved" (luồng duyệt); sửa luôn lỗi hiển thị "chưa xác minh" ở trang Admin Users

### Added
- Bắt buộc xác thực E-KYC (và kiểm tra tài khoản bị khóa) trước khi Đặt sân và Tham gia kèo ký quỹ, nhằm chống bùng kèo/tài khoản ảo
- Bổ sung 2 unit test kiểm chứng chặn user chưa xác thực E-KYC (đặt sân, tham gia kèo)

### AI-assisted
- Dùng Claude Code (Claude Opus) khảo sát toàn bộ điểm phụ thuộc của rental, thực hiện xóa an toàn, và rà soát backend theo từng actor
- Quyết định thủ công: chọn phương án regenerate migration; phạm vi enforce E-KYC (đặt sân + join kèo, bỏ qua walk-in); giữ nguyên UI Admin KYC
