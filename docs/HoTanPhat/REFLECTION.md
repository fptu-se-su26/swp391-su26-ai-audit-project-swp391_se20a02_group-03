
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



# Reflection

...

---

## Giai đoạn 17/06/2026 - 18/06/2026

Trong giai đoạn này, phần việc chính không phải là phát triển tính năng mới mà là xử lý hậu quả của việc tích hợp code giữa các nhánh: xung đột merge trong `Program.cs` và sự lệch pha giữa các migration cũ với schema thực tế. AI (Claude) hỗ trợ tốt ở bước phân tích — giúp xác định nhanh những điểm xung đột nào an toàn để chấp nhận theo upstream và những điểm nào cần giữ lại logic cục bộ, thay vì phải dò từng dòng thủ công.

Tuy nhiên, việc dọn migration là phần cần con người kiểm soát chặt: AI có thể gợi ý xóa migration cũ và tạo migration khởi tạo mới, nhưng quyết định cuối cùng về việc có làm mất dữ liệu hay không vẫn phải do người thực hiện xác nhận thủ công trước khi áp dụng, vì đây là thao tác có rủi ro cao (không thể hoàn tác dễ dàng nếu chạy nhầm trên môi trường có dữ liệu thật).

Bài học rút ra:
- Nên tách riêng các lần merge lớn để dễ theo dõi xung đột, tránh gộp nhiều thay đổi cùng lúc.
- Khi để AI đề xuất thao tác với migration, cần luôn kiểm tra lại bằng cách review diff và test trên môi trường dev trước khi áp dụng lên môi trường chính.
- Việc ghi log cấu hình login flow riêng biệt giúp dễ truy vết khi có lỗi phát sinh sau này.
