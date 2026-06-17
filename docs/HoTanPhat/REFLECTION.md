
# Reflection

## Reflection - Milestone 1

Trong giai đoạn đầu phát triển Equipment Rental Module, nhóm sử dụng Claude để phân tích yêu cầu, nghiên cứu giải pháp và xây dựng các prompt kỹ thuật. Các prompt sau đó được sử dụng trong Cursor để hỗ trợ sinh mã nguồn.

AI hỗ trợ tốt trong việc:

* Đề xuất kiến trúc hệ thống.
* Sinh các lớp Repository và Service.
* Tạo DTO và validation cơ bản.
* Hỗ trợ tích hợp Frontend với Backend.

Tuy nhiên, mã nguồn sinh bởi AI không thể sử dụng trực tiếp mà cần được rà soát và điều chỉnh.

Các công việc phải thực hiện thủ công bao gồm:

* Điều chỉnh business logic theo yêu cầu thực tế.
* Sửa Entity Framework Mapping.
* Kiểm tra Dependency Injection.
* Kiểm thử API.
* Tích hợp với cơ sở dữ liệu hiện có.

Qua quá trình này, nhận thấy AI giúp tăng tốc độ phát triển nhưng không thay thế được việc hiểu kiến trúc hệ thống và kiểm thử phần mềm. Mọi thay đổi được áp dụng vào dự án đều đã được xem xét, chỉnh sửa và xác thực trước khi đưa vào mã nguồn chính thức.
