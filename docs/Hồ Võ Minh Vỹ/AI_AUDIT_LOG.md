##Log#01
- Ngày thực hiện: 12/05/2026
- Người thực hiện:VyHVM
- Công cụ AI hỗ trợ: Cursor
- Mục tiêu: Tạo cấu trúc thư mục và kiến trúc dự án theo tiêu chuẩn của .NET (Backend) và React (Frontend).
- Tham chiếu Prompt: PROMPTS.md#prompt-01
- Đề xuất từ AI: tạo các folder backend, frontend, database và các file cần thiết
- Quyết định điều chỉnh (Human Decision): thêm các file AGENT.md để đặt luật hành động của AI trong dự án
- Tập tin áp dụng: src, docs
- Trạng thái kiểm duyệt: chạy không lỗi

##Log##02
- Ngày thực hiện: 24/05/2026
- Người thực hiện:VyHVM
- Công cụ AI hỗ trợ: Google antigravity
- Mục tiêu: fix các lỗi về UX/UI vadf thêm các trang còn thiếu
- Tham chiếu Prompt: PROMPTS.md#prompt-02
- Đề xuất từ AI: sửa các lỗi UX/UI, thêm các trang cần thiết
- Quyết định điều chỉnh (Human Decision): sửa lại màu sắc, thiết kế theo ý muốn
- Tập tin áp dụng: src/frontend
- Trạng thái kiểm duyệt: chạy không lỗi

##Log##03
- Ngày thực hiện: 25/05/2026
- Người thực hiện:VyHVM
- Công cụ AI hỗ trợ: Google gemini
- Mục tiêu: Tạo kịch bản GitHub Actions để Deploy
- Tham chiếu Prompt: PROMPTS.md#prompt-03
- Đề xuất từ AI: tạo src code .yml
- Quyết định điều chỉnh (Human Decision): Cấu hình lại file của Vite
- Tập tin áp dụng: .github
- Trạng thái kiểm duyệt: chạy không lỗi

##Log##04
- Ngày thực hiện: 01/06/2026
- Người thực hiện: VyHVM
- Công cụ AI hỗ trợ: Cursor
- Mục tiêu: Hoàn thành chức năng Login và Register
- Tham chiếu Prompt: PROMPTS.md#prompt-04
- Đề xuất từ AI: Tạo form đăng nhập, đăng ký và gọi API authentication
- Quyết định điều chỉnh (Human Decision): Thêm logic xác thực validation và phân quyền người dùng
- Tập tin áp dụng: src/frontend, backend
- Trạng thái kiểm duyệt: chạy không lỗi

##Log##05
- Ngày thực hiện: 10/06/2026
- Người thực hiện: VyHVM
- Công cụ AI hỗ trợ: Google gemini
- Mục tiêu: Cập nhật và cải thiện UI cho trang Login/Register
- Tham chiếu Prompt: PROMPTS.md#prompt-05
- Đề xuất từ AI: Cập nhật CSS/Tailwind, điều chỉnh layout form
- Quyết định điều chỉnh (Human Decision): Sửa lại màu sắc theo guideline của dự án
- Tập tin áp dụng: src/frontend/src/pages
- Trạng thái kiểm duyệt: chạy không lỗi

##Log##06
- Ngày thực hiện: 11/06/2026
- Người thực hiện: VyHVM
- Công cụ AI hỗ trợ: Cursor
- Mục tiêu: Hoàn thành thiết kế và setup Database
- Tham chiếu Prompt: PROMPTS.md#prompt-06
- Đề xuất từ AI: Tạo các bảng Entity và migration script
- Quyết định điều chỉnh (Human Decision): Thêm một số trường cần thiết và điều chỉnh quan hệ bảng
- Tập tin áp dụng: src/backend/Database
- Trạng thái kiểm duyệt: chạy không lỗi

##Log##07
- Ngày thực hiện: 12/06/2026
- Người thực hiện: VyHVM
- Công cụ AI hỗ trợ: Google gemini
- Mục tiêu: Hoàn thành chức năng Booking (đặt sân)
- Tham chiếu Prompt: PROMPTS.md#prompt-07
- Đề xuất từ AI: Tạo luồng API đặt sân và giao diện chọn giờ
- Quyết định điều chỉnh (Human Decision): Xử lý thêm các case xung đột giờ đặt (conflict)
- Tập tin áp dụng: src/frontend, src/backend
- Trạng thái kiểm duyệt: chạy không lỗi

##Log##08
- Ngày thực hiện: 18/06/2026
- Người thực hiện: VyHVM
- Công cụ AI hỗ trợ: Cursor
- Mục tiêu: Fix lỗi chức năng Booking
- Tham chiếu Prompt: PROMPTS.md#prompt-08
- Đề xuất từ AI: Cập nhật logic check thời gian trống để tránh trùng lịch
- Quyết định điều chỉnh (Human Decision): Bổ sung transaction khi ghi vào database để an toàn dữ liệu
- Tập tin áp dụng: src/backend
- Trạng thái kiểm duyệt: chạy không lỗi

##Log##09
- Ngày thực hiện: 20/06/2026
- Người thực hiện: VyHVM
- Công cụ AI hỗ trợ: Google gemini
- Mục tiêu: Tạo API Quản lý thiết bị kho
- Tham chiếu Prompt: PROMPTS.md#prompt-09
- Đề xuất từ AI: Tạo CRUD cho thiết bị kho
- Quyết định điều chỉnh (Human Decision): Thêm thuộc tính tình trạng thiết bị (cũ/mới/hỏng)
- Tập tin áp dụng: src/backend
- Trạng thái kiểm duyệt: chạy không lỗi

##Log##10
- Ngày thực hiện: 27/06/2026
- Người thực hiện: VyHVM
- Công cụ AI hỗ trợ: Cursor
- Mục tiêu: Refactor lại code frontend
- Tham chiếu Prompt: PROMPTS.md#prompt-10
- Đề xuất từ AI: Tổ chức lại cấu trúc component, tối ưu hóa tái sử dụng code
- Quyết định điều chỉnh (Human Decision): Gộp một số component nhỏ lại và xoá code thừa
- Tập tin áp dụng: src/frontend/src/components
- Trạng thái kiểm duyệt: chạy không lỗi

##Log##11
- Ngày thực hiện: 14/07/2026
- Người thực hiện: VyHVM
- Công cụ AI hỗ trợ: Claude Code (Claude Opus)
- Mục tiêu: Loại bỏ hoàn toàn chức năng "Cho thuê đồ" (equipment rental), chỉ giữ cáp kèo ký quỹ, trung gian đặt sân và bán dụng cụ.
- Tham chiếu Prompt: PROMPTS.md#prompt-11
- Đề xuất từ AI: Khảo sát toàn bộ điểm phụ thuộc của rental (2 hệ tách biệt: thuê tại quầy của Staff và Rental Asset của Owner), xóa entity/service/controller/DTO/migration liên quan; tách phần dùng chung (Equipment vừa bán vừa thuê) để giữ lại chức năng bán.
- Quyết định điều chỉnh (Human Decision): Chọn phương án regenerate lại migration InitialCreate cho sạch (thay vì tạo migration drop bảng); chỉ sửa code, tạm chưa cập nhật SRS.
- Tập tin áp dụng: src/backend, src/frontend
- Trạng thái kiểm duyệt: Build backend (Release) + frontend đều thành công, 104 unit test pass.

##Log##12
- Ngày thực hiện: 14/07/2026
- Người thực hiện: VyHVM
- Công cụ AI hỗ trợ: Claude Code (Claude Opus)
- Mục tiêu: Rà soát bảo mật/logic backend theo từng actor và khắc phục lỗ hổng E-KYC.
- Tham chiếu Prompt: PROMPTS.md#prompt-12
- Đề xuất từ AI: Dựng bản đồ phân quyền toàn bộ endpoint; phát hiện E-KYC chưa được bắt buộc ở luồng đặt sân/tham gia kèo và trạng thái E-KYC bị lệch ("Verified" ở seed/Google vs "Approved" ở luồng duyệt); đề xuất chuẩn hóa hằng số trạng thái + thêm cơ chế chặn xác thực.
- Quyết định điều chỉnh (Human Decision): Đồng ý chuẩn hóa trạng thái về "Verified" (giữ EkycProfile.Status cho UI Admin), bắt buộc E-KYC khi đặt sân và join kèo, không chặn luồng walk-in tại quầy (nhân viên đã xác minh trực tiếp).
- Tập tin áp dụng: src/backend
- Trạng thái kiểm duyệt: Build Release thành công, 106 unit test pass (thêm 2 test kiểm chứng gate).

##Log##13
- Ngày thực hiện: 14/07/2026
- Người thực hiện: VyHVM
- Công cụ AI hỗ trợ: Claude Code (Claude Opus)
- Mục tiêu: Tiếp tục rà soát backend theo từng actor và khắc phục lỗ hổng toàn vẹn dữ liệu đánh giá (Trust Score).
- Tham chiếu Prompt: PROMPTS.md#prompt-13
- Đề xuất từ AI: Phát hiện RatingService không kiểm tra người chấm/người bị chấm có cùng tham gia trận đấu, cho phép spam đánh giá thao túng Trust Score; đề xuất bắt buộc cả hai là participant Approved của kèo (đồng bộ với EloRatingService vốn đã kiểm đúng).
- Quyết định điều chỉnh (Human Decision): Đồng ý siết kiểm participant; giữ nguyên leaderboard/trust-score công khai (là route guest cố ý) và quyền voucher của Staff (role nội bộ tin cậy) để không phá vỡ Frontend.
- Tập tin áp dụng: src/backend
- Trạng thái kiểm duyệt: Build OK, 108 unit test pass (thêm 2 test cho RatingService).

##Log##14
- Ngày thực hiện: 14/07/2026
- Người thực hiện: VyHVM
- Công cụ AI hỗ trợ: Claude Code (Claude Opus)
- Mục tiêu: Rà soát lõi tài chính (ví Escrow) và vá lỗi mã tham chiếu giao dịch phí kèo.
- Tham chiếu Prompt: PROMPTS.md#prompt-14
- Đề xuất từ AI: `Transaction.ReferenceId` có unique index nhưng `PayMatchFee` đặt `MATCH-{matchId}` (thiếu userId) → người thứ 2 trả phí cùng kèo bị lỗi 500; đề xuất đổi `MATCH-{matchId}-{userId}` + thêm idempotency như luồng Deposit/Refund.
- Quyết định điều chỉnh (Human Decision): Đồng ý siết mã tham chiếu theo cặp (kèo, người).
- Tập tin áp dụng: src/backend
- Trạng thái kiểm duyệt: Build OK, 110 unit test pass (thêm 2 test).

##Log##15
- Ngày thực hiện: 14/07/2026
- Người thực hiện: VyHVM
- Công cụ AI hỗ trợ: Claude Code (Claude Opus)
- Mục tiêu: Bịt lỗ hổng bỏ qua xác thực E-KYC ở các đường tạo booking khác.
- Tham chiếu Prompt: PROMPTS.md#prompt-14
- Đề xuất từ AI: Gate E-KYC mới chỉ có ở `BookingService.CreateBooking`, còn `SplitPaymentService` và `RecurringBookingService` tự dựng booking nên né được gate; đề xuất thêm kiểm E-KYC/khóa tài khoản cho host ở cả hai.
- Quyết định điều chỉnh (Human Decision): Đồng ý bịt cả hai đường; tài khoản chưa xác thực không tạo được đơn theo mọi luồng.
- Tập tin áp dụng: src/backend
- Trạng thái kiểm duyệt: Build OK, 111 unit test pass (thêm test host chưa E-KYC → 403).

##Log##16
- Ngày thực hiện: 14/07/2026
- Người thực hiện: VyHVM
- Công cụ AI hỗ trợ: Claude Code (Claude Opus)
- Mục tiêu: Bắt buộc kiểm giờ hoạt động/đóng cửa/bảo trì phía server khi đặt sân.
- Tham chiếu Prompt: PROMPTS.md#prompt-14
- Đề xuất từ AI: `IsSlotWithinOperatingHoursAsync` tồn tại nhưng mồ côi (không nơi nào gọi) → khách đặt được sân ngoài giờ/đóng cửa/bảo trì qua API; không inject trực tiếp được vào BookingService do vòng lặp DI, đề xuất chuyển logic sang `ICourtRepository`.
- Quyết định điều chỉnh (Human Decision): Đồng ý wiring server-side qua CourtRepository, xóa method mồ côi.
- Tập tin áp dụng: src/backend
- Trạng thái kiểm duyệt: Build OK, 112 unit test pass (thêm 2 test).

##Log##17
- Ngày thực hiện: 14/07/2026
- Người thực hiện: VyHVM
- Công cụ AI hỗ trợ: Claude Code (Claude Opus)
- Mục tiêu: Phủ trọn review mọi service theo từng actor; vá lỗ hổng toàn vẹn báo cáo bùng kèo.
- Tham chiếu Prompt: PROMPTS.md#prompt-15
- Đề xuất từ AI: Soát nốt ReportService/Chatbot/Voucher/User/Court/Equipment/Dashboard. Phát hiện `ReportService` cùng lớp lỗi với RatingService (không kiểm participant) → cho phép bịa báo cáo; đề xuất bắt buộc cả hai là participant Approved của kèo.
- Quyết định điều chỉnh (Human Decision): Đồng ý siết ReportService; ghi nhận `EquipmentService.BuyAsync` là dead-code (không có endpoint) nên không sửa.
- Tập tin áp dụng: src/backend
- Trạng thái kiểm duyệt: Build Release OK, 113 unit test pass (thêm ReportServiceTests).
