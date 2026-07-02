
# Prompt Repository

## Prompt #01

* Date: 12/06/2026
* Author: Phat1425
* AI Tool: Claude
* Purpose: Thiết kế Equipment Rental Module

### Prompt

Analyze the existing ASP.NET Core project architecture and design a complete Equipment Rental module following Clean Architecture principles.

Requirements:

* Repository Pattern
* Service Layer Pattern
* DTO Layer
* Dependency Injection
* Entity Framework Core
* RESTful API Support

### Usage

Prompt was provided to Cursor for code generation and implementation support.

### Evaluation

The prompt generated useful architecture suggestions and implementation ideas.

---

## Prompt #02

* Date: 14/06/2026
* Author: Phat1425
* AI Tool: Claude
* Purpose: DTO design and business logic implementation

### Prompt

Generate DTOs and business workflow for Equipment Rental.

Requirements:

* EquipmentDto
* RentEquipmentRequest
* ReturnEquipmentRequest
* Validation Rules
* Rental Workflow
* Entity Framework Compatibility

### Usage

Used in Cursor to generate DTO classes and workflow implementation.

### Evaluation

The generated code required validation and schema adjustments.

---

## Prompt #03

* Date: 16/06/2026
* Author: Phat1425
* AI Tool: Claude
* Purpose: Frontend integration and seed data generation

### Prompt

Suggest best practices for integrating React frontend pages with ASP.NET Core APIs and generate sample equipment data for testing.

Requirements:

* API Integration
* Seed Data
* Frontend Service Layer
* Error Handling

### Usage

Used in Cursor to support frontend integration and database seeding.

### Evaluation

The output accelerated implementation but still required manual review and testing.



# Prompts

...

---

## Prompt #04
**Ngày sử dụng:** 17/06/2026 - 18/06/2026
**Bối cảnh:** Xử lý xung đột merge trong Program.cs sau khi kéo nhánh upstream, dọn dẹp migration cũ và sửa lỗi cấu hình login flow.

**Prompt gửi cho Claude:**
```
Tôi đang gặp xung đột merge trong file Program.cs khi kéo thay đổi từ nhánh
upstream. Hãy phân tích các điểm xung đột, đề xuất hướng giải quyết an toàn
(giữ logic nào, chấp nhận thay đổi nào từ upstream), và gợi ý cách dọn dẹp
các migration cũ không còn khớp với schema hiện tại, đồng thời tạo migration
khởi tạo mới cho tính năng Cart và Equipment. Ngoài ra hãy rà soát lại luồng
đăng nhập (login flow) hiện tại để tìm lỗi cấu hình.
```

**Prompt gửi cho Cursor (sinh code):**
```
Dựa trên hướng giải quyết đã thống nhất, hãy sửa Program.cs để merge đúng,
xóa các migration cũ bị lỗi, generate migration khởi tạo mới cho Cart và
Equipment, và sửa cấu hình project liên quan đến login flow.
```

**Kết quả sử dụng:** Xem Log #04 trong AI_AUDIT_LOG.md.
