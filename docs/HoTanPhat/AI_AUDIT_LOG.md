# AI Audit Log

## Log #01

* Ngày thực hiện: 12/06/2026 - 13/06/2026

* Người thực hiện: Phat1425

* Công cụ AI hỗ trợ:

  * Claude: phân tích yêu cầu và xây dựng prompt
  * Cursor: sinh mã nguồn từ prompt

* Mục tiêu:
  Thiết kế kiến trúc và xây dựng nền tảng cho Equipment Rental Module.

* Tham chiếu Prompt:
  PROMPTS.md#prompt-01

* Đề xuất từ AI:

  * Repository Pattern
  * Service Layer Pattern
  * DTO Layer
  * Equipment Rental Workflow
  * Clean Architecture Structure

* Quyết định điều chỉnh (Human Decision):

  * Điều chỉnh kiến trúc theo cấu trúc thực tế của dự án.
  * Bổ sung convention đặt tên và Dependency Injection.

* Tập tin áp dụng:

  * IEquipmentRepository.cs
  * EquipmentRepository.cs
  * IEquipmentService.cs
  * EquipmentService.cs

* Trạng thái kiểm duyệt:
  Build thành công và tích hợp được vào hệ thống hiện tại.

---

## Log #02

* Ngày thực hiện: 14/06/2026 - 15/06/2026

* Người thực hiện: Phat1425

* Công cụ AI hỗ trợ:

  * Claude: xây dựng prompt kỹ thuật
  * Cursor: sinh code và gợi ý triển khai

* Mục tiêu:
  Xây dựng DTO, xử lý nghiệp vụ thuê thiết bị và rà soát Entity Framework Core.

* Tham chiếu Prompt:
  PROMPTS.md#prompt-02

* Đề xuất từ AI:

  * EquipmentDto
  * RentEquipmentRequest
  * ReturnEquipmentRequest
  * Validation Logic
  * Entity Mapping Review

* Quyết định điều chỉnh (Human Decision):

  * Điều chỉnh validation theo yêu cầu nghiệp vụ.
  * Sửa mapping giữa Entity Framework và cơ sở dữ liệu thực tế.

* Tập tin áp dụng:

  * EquipmentDto.cs
  * RentEquipmentRequest.cs
  * ReturnEquipmentRequest.cs
  * DbContext
  * Entity Configurations

* Trạng thái kiểm duyệt:
  API hoạt động ổn định và migration thành công.

---

## Log #03

* Ngày thực hiện: 16/06/2026 - 17/06/2026

* Người thực hiện: Phat1425

* Công cụ AI hỗ trợ:

  * Claude: đề xuất hướng tích hợp hệ thống
  * Cursor: hỗ trợ sinh code frontend

* Mục tiêu:
  Seed dữ liệu thiết bị và kết nối Frontend với Backend APIs.

* Tham chiếu Prompt:
  PROMPTS.md#prompt-03

* Đề xuất từ AI:

  * Sinh dữ liệu mẫu cho Equipment Rental.
  * Kết nối Gear Pages với API.
  * Tối ưu luồng hiển thị dữ liệu.

* Quyết định điều chỉnh (Human Decision):

  * Tùy chỉnh dữ liệu seed.
  * Điều chỉnh endpoint và response model.

* Tập tin áp dụng:

  * SeedData.cs
  * Gear Pages
  * Shop Pages
  * API Services

* Trạng thái kiểm duyệt:
  Hiển thị dữ liệu thành công và kiểm thử chức năng hoàn tất.
