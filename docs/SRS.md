# BÁO CÁO PHÂN TÍCH VÀ THIẾT KẾ HỆ THỐNG
## HỆ THỐNG QUẢN LÝ TỔ HỢP THỂ THAO VÀ KẾT NỐI NGƯỜI CHƠI THÔNG MINH TÍCH HỢP AI (PRO-SPORT COMPLEX)

---

### 1. Chọn đề tài và lý do chọn đề tài
**1.1 Tên đề tài:** Hệ thống quản lý tổ hợp thể thao và kết nối người chơi thông minh tích hợp AI (Pro-Sport Complex Management System).

**1.2 Lý do chọn đề tài:** Hiện nay, phong trào tập luyện thể thao (đặc biệt là Cầu lông và Pickleball) đang phát triển mạnh mẽ, kéo theo nhu cầu đặt sân và tìm kiếm đồng đội ngày càng tăng cao. Tuy nhiên, quy trình quản lý sân bãi và tổ chức giao lưu hiện tại vẫn còn gặp nhiều bất cập: thông tin lịch trống quản lý thủ công dẫn đến sai lệch giờ giấc hoặc trùng lịch (double-booking); người chơi khó tìm hội nhóm phù hợp; chủ sân khó tối ưu tỷ lệ lấp đầy và quản lý dòng tiền. Đặc biệt, vấn nạn "bùng kèo" gây bức xúc và tổn thất chi phí. 

Hệ thống được xây dựng như nền tảng trung gian kết nối người chơi, người tổ chức và quản lý sân, ứng dụng AI Chatbot để tra cứu lịch bãi và gợi ý ghép kèo cá nhân hóa.

---

### 2. Giới thiệu đề tài, phạm vi và tính năng chính

#### 2.1 Giới thiệu đề tài
Hệ thống là nền tảng website trung gian đa tác nhân, đồng bộ quy trình vận hành giữa Khách hàng (Customer), Nhân viên (Staff) và Quản trị viên (Admin).

#### 2.2 Phạm vi đề tài
- **Đối tượng sử dụng:** Guest, Customer, Staff, Admin.
- **Phạm vi chức năng:** E-KYC, Quản lý lịch bãi thời gian thực, Điều phối kèo, Ví ký quỹ (Escrow), Quản lý kho hàng, AI Chatbot.
- **Phạm vi công nghệ:** ReactJS, Tailwind CSS, ASP.NET Core Web API (.NET 8/9), SQL Server, OpenAI API, VNPay Sandbox.

#### 2.3 Các tính năng chính
- **Người chơi:** Đăng ký/đăng nhập, E-KYC, Đặt sân, Cáp kèo/Join kèo, Thanh toán ví Escrow, Báo cáo bùng kèo, Chat AI.
- **Nhân viên:** Check-in QR, Check-out, Quản lý hóa đơn thuê đồ, Kiểm định thiết bị, Phát hành Voucher, Xác nhận bùng kèo.
- **Quản trị viên:** Quản lý User, Quản lý sân/giá, Quản lý kho, Phê duyệt E-KYC, Giải quyết khiếu nại, Thống kê doanh thu.
- **AI:** Phân tích ngôn ngữ tự nhiên để gợi ý sân và kèo đấu.

---

### 3. Tìm hiểu hai hệ thống tương tự
- **Nền tảng đặt sân truyền thống (VD: SanCaulong.vn):** Chỉ là danh bạ số điện thoại, không có lưới lịch thời gian thực, không hỗ trợ ghép kèo hay AI.
- **Hội nhóm mạng xã hội (Facebook/Zalo):** Cộng đồng lớn nhưng tự phát, rủi ro "bùng kèo" cao, thông tin bị trôi, khó sàng lọc đối tượng.

---

### 4. Xác định tác nhân
- **Guest:** Khách vãng lai, quyền xem hạn chế.
- **Customer:** Đã xác thực, quyền đặt sân, tạo/join kèo, ví điện tử.
- **Staff:** Vận hành quầy, check-in, quản lý đồ thuê.
- **Admin:** Quản trị toàn cục, xử lý khiếu nại, cấu hình hệ thống.
- **Payment Gateway (VNPay):** Xử lý giao dịch thanh toán và hoàn tiền.

---

### 5. Xác định Use Cases

#### 5.1 Guest
| Mã UC | Tên Use Case |
| :--- | :--- |
| UC-G01 | Xem trang chủ |
| UC-G02 | Xem lưới lịch bãi |
| UC-G03 | Tìm kiếm và Lọc sân |
| UC-G04 | Xem chi tiết sân |
| UC-G05 | Xem danh sách kèo mở |
| UC-G06 | Đăng ký tài khoản |
| UC-G07 | Đăng nhập |
| UC-G08 | Khôi phục mật khẩu |

#### 5.2 Customer
| Mã UC | Tên Use Case |
| :--- | :--- |
| UC-C01 | Cập nhật hồ sơ |
| UC-C02 | Xác thực E-KYC |
| UC-C03 | Đổi mật khẩu |
| UC-C04 | Đặt sân |
| UC-C05 | Hủy đặt sân |
| UC-C06 | Xem lịch sử đặt sân |
| UC-C07 | Tạo bài cáp kèo (Host) |
| UC-C08 | Quản lý kèo của tôi |
| UC-C09 | Hủy kèo giao lưu |
| UC-C10 | Xin tham gia kèo (Joiner) |
| UC-C11 | Thanh toán ký quỹ (Escrow) |
| UC-C12 | Rút khỏi kèo |
| UC-C13 | Đánh giá người chơi |
| UC-C14 | Báo cáo bùng kèo |
| UC-C15 | Chat với AI Assistant |

#### 5.3 Staff
| Mã UC | Tên Use Case |
| :--- | :--- |
| UC-S01 | Quét QR Check-in |
| UC-S02 | Check-out trả sân |
| UC-S03 | Quản lý hóa đơn thuê đồ |
| UC-S04 | Kiểm định dụng cụ trả |
| UC-S05 | Áp dụng phụ thu hư hỏng |
| UC-S06 | Phát hành Voucher |
| UC-S07 | Xác nhận bùng kèo |

#### 5.4 Admin
| Mã UC | Tên Use Case |
| :--- | :--- |
| UC-A01 | Xem Dashboard thống kê |
| UC-A02 | Quản lý người dùng |
| UC-A03 | Phê duyệt E-KYC |
| UC-A04 | Quản lý sân bãi (CRUD) |
| UC-A05 | Cấu hình giá thuê |
| UC-A06 | Quản lý kho hàng (CRUD) |
| UC-A07 | Giải quyết khiếu nại kèo |

#### 5.5 Payment Gateway (VNPay)
| Mã UC | Tên Use Case |
| :--- | :--- |
| UC-P01 | Xử lý thanh toán |
| UC-P02 | Trả Webhook giao dịch |
| UC-P03 | Xử lý lệnh Hoàn tiền |

---

### 6. Điểm nổi bật của hệ thống
Hệ thống là giải pháp trung gian công nghệ giải quyết bài toán niềm tin (Escrow) và hiệu suất vận hành. Điểm khác biệt nằm ở cơ chế ký quỹ bảo đảm tài chính, tự động hóa xử lý bùng kèo và ứng dụng AI Chatbot để tối ưu trải nghiệm tra cứu, kết nối người chơi văn minh, chuyên nghiệp.