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

---

## Log #03
- **Ngày:** 2026-06-02
- **Người thực hiện:** Dương Khang Huy
- **Công cụ AI:** Cursor
- **Mục đích:** Khởi tạo cấu trúc file cấu hình môi trường, gitignore, và tài liệu hướng dẫn chạy dự án (Repo Setup).
- **Tham chiếu Prompt:** *(Sử dụng Cursor Composer/Chat)* "Tạo cho tôi các file .gitignore chuẩn cho dự án Frontend React (Vite) và Backend .NET 8. Đồng thời tạo các file .env.example và appsettings.Development.json.example với các biến môi trường cần thiết. Cuối cùng, hãy cập nhật README.md hướng dẫn chi tiết cách cài đặt và chạy dự án này."

### Tóm tắt kết quả AI
- Cursor tự động phân tích ngữ cảnh dự án (chứa Frontend React và Backend C#) để tạo ra các file `.gitignore` tiêu chuẩn cho từng thư mục.
- Tạo sẵn các file `.env.example` và `appsettings.Development.json.example` với các khóa cơ bản như Database Connection String, JWT Secret.
- Viết mới nội dung `README.md` bao gồm các bước `npm install`, `dotnet run` chi tiết.

### Quyết định & Can thiệp của con người
- **Chấp nhận:** Sử dụng 95% nội dung do Cursor sinh ra vì rất chuẩn xác với framework đang dùng.
- **Can thiệp kỹ thuật:** Kiểm tra lại các biến môi trường, điền thêm cấu hình Connection String mẫu cho SQL Server Local thay vì dùng SQLite như AI ban đầu gợi ý.

### Áp dụng cho
- Commit khởi tạo hạ tầng dự án (`[DE190900] chore: category-1 repo setup, gitignore, env examples, run docs`).

### Kiểm chứng
- Clone dự án ra thư mục mới, làm theo hướng dẫn trong `README.md`, chạy thử `npm run dev` và `dotnet run`. Cả hai hệ thống đều khởi động thành công và không bị commit nhầm các file rác như `node_modules` hay `bin/obj`.

---

## Log #04
- **Ngày:** 2026-06-10
- **Người thực hiện:** Dương Khang Huy
- **Công cụ AI:** Antigravity AI
- **Mục đích:** Sửa lỗi hệ thống `npm run lint` bị sập bằng cách thiết lập cấu hình ESLint v9 (Flat Config) hỗ trợ môi trường React/Vite.
- **Tham chiếu Prompt:** *"Tạo mới file src/frontend/eslint.config.js theo định dạng Flat Config (chuẩn ESLint v9) hỗ trợ React và React Hooks. Import các plugin cần thiết: eslint-plugin-react, react-hooks, react-refresh... Tắt rule react/prop-types."*

### Tóm tắt kết quả AI
- AI đã phân tích yêu cầu và viết thành công file `eslint.config.js` hoàn toàn bằng cú pháp Flat Config (sử dụng Array và ES Modules `import` trực tiếp thay vì khai báo chuỗi string như chuẩn cũ).
- Tự động phát hiện thiếu dependency và thay mặt người dùng chạy các lệnh `npm install` để bổ sung `@eslint/js` và `globals`.

### Quyết định & Can thiệp của con người
- **Chấp nhận:** Sử dụng 100% mã nguồn cấu hình do AI viết do đáp ứng hoàn hảo chuẩn v9.

### Áp dụng cho
- Môi trường quản lý chất lượng code Frontend (`src/frontend/eslint.config.js`).

### Kiểm chứng
- Chạy lại lệnh `npm run lint`. Hệ thống Linter đã nhận diện được file cấu hình, hoạt động trơn tru và quét ra thành công hơn 40 cảnh báo lặt vặt trong các file `.jsx` hiện hành.
