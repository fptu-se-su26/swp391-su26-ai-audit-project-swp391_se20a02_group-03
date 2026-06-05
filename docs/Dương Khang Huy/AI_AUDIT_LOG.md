# AI Audit Log

## Log #01
- **Ngày:** 2026-05-18
- **Người thực hiện:** Dương Khang Huy
- **Công cụ AI:** ChatGPT
- **Mục đích:** Khảo sát yêu cầu hệ thống để lên danh sách màn hình và phân rã các module chức năng.
- **Tham chiếu Prompt:** *"Giả sử bạn là một designer. Dưới đây là các chức năng mà một hệ thống tôi phát triển sẽ có. Vui lòng liệt kê ra những màn hình (Screen) mà sẽ có trong hệ thống bên dưới, đồng thời chú thích trong những màn hình đó có những tính năng gì."*

### Tóm tắt kết quả AI
- AI đóng vai trò UX/UI Designer, phân tích toàn bộ yêu cầu đầu vào và đề xuất cấu trúc tổng thể cho nền tảng quản lý trung tâm thể thao Badminton & Pickleball.
- Trả về danh sách các module cốt lõi, bảng phân loại vai trò người dùng (Customer, Staff, Admin) và ước tính khoảng 55–60 màn hình cần thiết cho toàn hệ thống cùng luồng điều hướng cơ bản.

### Quyết định & Can thiệp của con người
- **Chấp nhận:** Sử dụng khung phân rã danh sách màn hình đề xuất và tư duy phân quyền làm nền tảng để thiết kế sơ đồ trang (Site Map).
- **Can thiệp kỹ thuật:** Gộp và cắt giảm số lượng màn hình trùng lặp để thu hẹp phạm vi đúng với tiến độ dự án. Tự chỉnh sửa thủ công luồng đặt sân (Booking Flow) và thuê đồ (Rental Flow) theo đúng nghiệp vụ thực tế tại sân Việt Nam thay vì giữ nguyên gợi ý chung chung của AI.

### Áp dụng cho
- Tài liệu đặc tả hệ thống (SRS), phân chia Task thiết kế Wireframe và xây dựng User Flow cho nhóm.

### Kiểm chứng
- Đối chiếu danh sách màn hình với yêu cầu môn học SWP391. Kết quả đạt độ bao phủ tốt, chỉ cần tinh chỉnh lại luồng di chuyển (Navigation) để tránh việc người dùng phải thao tác quá nhiều bước.

---

## Log #02
- **Ngày:** 2026-05-18
- **Người thực hiện:** Dương Khang Huy
- **Công cụ AI:** ChatGPT
- **Mục đích:** Tạo bộ Prompt kỹ thuật chuyên sâu để ra lệnh cho công cụ Stitch thiết kế UI tĩnh cho toàn bộ 14 module.
- **Tham chiếu Prompt:** *"Viết prompt AI để ra lệnh cho Stitch with Google thiết kế cho mình các màn hình trong Authentication & Authorization Module. Yêu cầu là mô tả rõ hệ thống này là hệ thống gì để Stitch tạo UX/UI chuẩn nhất. Tương tự prompt cho: Court Management Module, Smart Booking Module..."*

### Tóm tắt kết quả AI
- AI phân tích cấu trúc hệ thống Sport-Tech SaaS, trả về một chuỗi các Prompt tiếng Anh chi tiết được tối ưu riêng cho Stitch.
- Đề xuất phong cách thiết kế Enterprise SaaS kết hợp Fintech, cấu trúc layout dạng lưới (Grid), bố cục Dashboard và danh sách thành phần giao diện (Component Structure) cho hơn 58 màn hình Desktop.

### Quyết định & Can thiệp của con người
- **Chấp nhận:** Sử dụng nguyên cấu trúc viết Prompt bằng tiếng Anh, tư duy sắp xếp bố cục Dashboard và các quy tắc thiết kế (Business rules) do AI gợi ý.
- **Can thiệp kỹ thuật:** Thay đổi toàn bộ thông số màu sắc (Color Palette) và khoảng cách (Spacing) trong Prompt để khớp với bộ nhận diện thương hiệu (Branding) đã chốt của nhóm. Bổ sung thêm các yêu cầu hiển thị trạng thái lỗi hệ thống và thông báo thời gian thực mà ban đầu AI chưa thiết lập chặt chẽ.

### Áp dụng cho
- Prompt đầu vào trực tiếp cho công cụ Stitch with Google để kết xuất giao diện Mockup UI Desktop.

### Kiểm chứng
- Đánh giá chất lượng UI được sinh ra từ Stitch. Hướng thiết kế giao diện có độ chính xác cao và đồng bộ tốt, tuy nhiên nhóm vẫn phải can thiệp thủ công để tinh chỉnh lại mật độ thông tin trên các thẻ Layout Card và Dashboard sao cho dễ nhìn hơn.
