# BÁO CÁO PHÂN TÍCH VÀ THIẾT KẾ HỆ THỐNG
## HỆ THỐNG QUẢN LÝ TỔ HỢP THỂ THAO VÀ KẾT NỐI NGƯỜI CHƠI THÔNG MINH TÍCH HỢP AI (PRO-SPORT COMPLEX)

---

### 1. Chọn đề tài và lý do chọn đề tài
**1.1 Tên đề tài:** Hệ thống quản lý tổ hợp thể thao và kết nối người chơi thông minh tích hợp AI (Pro-Sport Complex Management System).

**1.2 Lý do chọn đề tài:** Hiện nay, phong trào tập luyện thể thao (đặc biệt là Cầu lông và Pickleball) đang phát triển mạnh mẽ, kéo theo nhu cầu đặt sân và tìm kiếm bạn chơi ngày càng tăng cao. Tuy nhiên, quy trình quản lý sân bãi và tổ chức giao lưu hiện tại vẫn gặp nhiều bất cập: thông tin lịch trống quản lý thủ công dẫn đến sai lệch giờ giấc hoặc trùng lịch; người chơi mất nhiều thời gian tìm hội nhóm phù hợp; chủ sân khó tối ưu tỷ lệ lấp đầy và quản lý dòng tiền. Đặc biệt, vấn nạn "bùng kèo" gây bức xúc và tổn thất chi phí. 

Hệ thống được xây dựng như một nền tảng trung gian kết nối người chơi, người tổ chức và quản lý tổ hợp thể thao, ứng dụng AI Chatbot để phân tích ngôn ngữ tự nhiên, gợi ý ghép kèo cá nhân hóa và tự động hóa quy trình quản lý sân bãi.

---

### 2. Giới thiệu đề tài, phạm vi và tính năng chính

**2.1 Giới thiệu đề tài:**
Là nền tảng website trung gian đa tác nhân, kết nối trực tiếp Khách hàng (Customer), Nhân viên điều phối (Staff) và Quản trị viên (Admin). Điểm nhấn công nghệ là AI Chatbot thấu hiểu ngôn ngữ tự nhiên và Ví trung gian (Escrow) đảm bảo tài chính.

**2.2 Phạm vi đề tài:**
- **Đối tượng:** Guest, Customer, Staff, Admin.
- **Chức năng:** E-KYC, Ma trận lịch bãi thời gian thực, Điều phối kèo, Ví ký quỹ, Quản lý kho, Phân tích dữ liệu AI.
- **Công nghệ:** ReactJS, Tailwind CSS, ASP.NET Core Web API (.NET 8/9), SQL Server, OpenAI API, VNPay Sandbox.

**2.3 Các tính năng chính:**
- **Người chơi:** Đăng ký/đăng nhập, E-KYC, Đặt sân, Cáp kèo/Join kèo, Thanh toán ví Escrow, Báo cáo bùng kèo, Chat với AI.
- **Nhân viên:** Check-in QR, Quản lý hóa đơn thuê đồ, Kiểm định thiết bị, Phát hành Voucher, Xác nhận bùng kèo.
- **Quản trị viên:** Quản lý User, sân bãi, giá, kho, phê duyệt E-KYC, giải quyết khiếu nại, báo cáo thống kê.
- **AI:** Phân tích cú pháp ngữ nghĩa để gợi ý sân bãi và kèo đấu phù hợp.

---

### 3. Tìm hiểu hai hệ thống tương tự
- **Nền tảng đặt sân truyền thống (VD: SanCaulong.vn):** Chỉ là danh bạ số điện thoại, không có lịch thời gian thực, không ghép kèo, không AI.
- **Hội nhóm mạng xã hội (Facebook/Zalo):** Cộng đồng đông nhưng tự phát, rủi ro bùng kèo cao, khó sàng lọc đối tượng, quy trình thu tiền tốn thời gian.

---

### 4. Xác định tác nhân
- **Guest:** Khách vãng lai, xem trang chủ, tra cứu sân.
- **Customer:** Người chơi đã xác thực, đặt sân, cáp kèo, ví trung gian.
- **Staff:** Nhân viên vận hành, quét QR, kiểm định thiết bị.
- **Admin:** Quản trị toàn cục, điều chỉnh giá, xử lý tranh chấp.
- **Payment Gateway (VNPay):** Xử lý giao dịch thanh toán và ký quỹ.

---

### 5. Xác định Use Cases

#### 5.1 Guest
| Mã UC | Tên Use Case | Mô tả |
| :--- | :--- | :--- |
| UC-G01 | Xem trang chủ | Xem thông tin tổ hợp, sự kiện. |
| UC-G02 | Xem lưới lịch bãi | Theo dõi trạng thái sân thời gian thực. |
| UC-G03 | Tìm kiếm và Lọc sân | Lọc theo tên, bộ môn, giá. |
| UC-G04 | Xem chi tiết sân | Xem ảnh, thông số, tiện ích. |
| UC-G05 | Xem danh sách kèo mở | Tra cứu kèo công khai. |
| UC-G06 | Đăng ký tài khoản | Khởi tạo tài khoản mới. |
| UC-G07 | Đăng nhập | Xác thực tài khoản. |
| UC-G08 | Khôi phục mật khẩu | Quên mật khẩu qua OTP/Email. |

#### 5.2 Customer
| Mã UC | Tên Use Case | Mô tả |
| :--- | :--- | :--- |
| UC-C01 | Cập nhật hồ sơ | Thay đổi thông tin cá nhân. |
| UC-C02 | Xác thực E-KYC | Định danh thực. |
| UC-C03 | Đổi mật khẩu | Bảo mật tài khoản. |
| UC-C04 | Đặt sân | Tạo đơn giữ sân. |
| UC-C05 | Hủy đặt sân | Hủy đơn có phí phạt. |
| UC-C06 | Xem lịch sử đặt sân | Tra cứu lịch sử. |
| UC-C07 | Tạo bài cáp kèo (Host) | Đăng tuyển đồng đội. |
| UC-C08 | Quản lý kèo của tôi | Phê duyệt/từ chối Joiner. |
| UC-C09 | Hủy kèo giao lưu | Hoàn tiền Escrow. |
| UC-C10 | Xin tham gia kèo | Gửi đơn xin gia nhập. |
| UC-C11 | Thanh toán ký quỹ | Chuyển vào Ví trung gian. |
| UC-C12 | Rút khỏi kèo | Hủy tham gia. |
| UC-C13 | Đánh giá người chơi | Chấm điểm uy tín. |
| UC-C14 | Báo cáo bùng kèo | Khiếu nại vi phạm. |
| UC-C15 | Chat với AI | Tra cứu qua chatbot. |

#### 5.3 Staff
| Mã UC | Tên Use Case | Mô tả |
| :--- | :--- | :--- |
| UC-S01 | Quét QR Check-in | Xác nhận khách đến. |
| UC-S02 | Check-out trả sân | Kết thúc phiên, tổng hợp phí. |
| UC-S03 | Quản lý hóa đơn thuê đồ | Xuất kho, thêm dịch vụ. |
| UC-S04 | Kiểm định dụng cụ trả | Kiểm tra hỏng hóc. |
| UC-S05 | Áp dụng phụ thu | Tính phí hư hại. |
| UC-S06 | Phát hành Voucher | Kích cầu. |
| UC-S07 | Xác nhận bùng kèo | Làm chứng bùng kèo. |

#### 5.4 Admin
| Mã UC | Tên Use Case | Mô tả |
| :--- | :--- | :--- |
| UC-A01 | Xem Dashboard | Thống kê doanh thu, hiệu suất. |
| UC-A02 | Quản lý người dùng | Khóa/Mở tài khoản. |
| UC-A03 | Phê duyệt E-KYC | Xác thực định danh. |
| UC-A04 | Quản lý sân bãi | Thêm/Sửa/Xóa. |
| UC-A05 | Cấu hình giá | Thiết lập bảng giá động. |
| UC-A06 | Quản lý kho | Kiểm soát tồn kho. |
| UC-A07 | Giải quyết khiếu nại | Phân xử bùng kèo. |

#### 5.5 Payment Gateway
| Mã UC | Tên Use Case | Mô tả |
| :--- | :--- | :--- |
| UC-P01 | Xử lý thanh toán | Khấu trừ tiền. |
| UC-P02 | Trả Webhook | Thông báo kết quả giao dịch. |
| UC-P03 | Xử lý lệnh Hoàn tiền | Hoàn tiền khi hủy kèo. |

---

### 6. Điểm nổi bật của hệ thống
Hệ thống là giải pháp trung gian công nghệ giải quyết triệt để hai bài toán nhức nhối: kết nối lòng tin tài chính (Ví Escrow) và tối ưu hóa vận hành quầy bãi. Việc ứng dụng AI Chatbot giúp tra cứu lịch bãi và gợi ý ghép nhóm cá nhân hóa vượt trội, cùng với mô hình kinh tế 'Try-Before-You-Buy' chuyển đổi chi phí thuê đồ cũ thành ưu đãi mua sắm đồ mới, giúp tăng trưởng doanh thu phụ trợ hiệu quả.