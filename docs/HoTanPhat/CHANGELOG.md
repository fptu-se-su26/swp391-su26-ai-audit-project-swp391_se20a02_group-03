# Changelog

## [2026-06-13]

Author: Phat1425

### Added

* Equipment Rental module architecture.
* Repository Layer.
* Service Layer.

### AI-assisted

* Claude generated technical prompts.
* Cursor generated initial implementation.
* Final code was reviewed and modified manually.

---

## [2026-06-15]

Author: Phat1425

### Added

* Equipment DTO classes.
* Rental workflow implementation.

### Changed

* Validation logic.
* Entity Framework configurations.

### Fixed

* Database mapping inconsistencies.

### AI-assisted

* Claude supported prompt engineering.
* Cursor generated implementation drafts.

---

## [2026-06-17]

Author: Phat1425

### Added

* Equipment seed data.
* Frontend API integration.

### Changed

* Gear pages connected to real APIs.
* Shop page structure consolidated.

### Fixed

* API response handling issues.
* Entity mapping issues.

### AI-assisted

* Claude assisted with architecture and integration planning.
* Cursor assisted with code generation.

# Changelog

...

---

## [17/06/2026 - 18/06/2026]

### Fixed
- Sửa lỗi cấu hình login flow và project config (`chore: minor fixes to login flow and project config`).
- Giải quyết xung đột merge trong `Program.cs` khi hợp nhất thay đổi từ nhánh upstream (`fix: resolve migration conflicts by accepting upstream changes`).
- Dọn dẹp các migration cũ không còn khớp với schema hiện tại và thêm migration khởi tạo cho tính năng Cart và Equipment (`Resolve merge conflicts in Program.cs, clean old migrations, and add initial migration for cart and equipment features`).

### Notes
- Toàn bộ thay đổi đã được build và migration kiểm tra thành công, không gây mất dữ liệu ở các bảng hiện có.
