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
