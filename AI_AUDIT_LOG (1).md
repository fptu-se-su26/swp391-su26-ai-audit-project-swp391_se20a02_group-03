# AI Audit Log

## 1. Thông tin chung

| Thông tin | Nội dung |
|---|---|
| Môn học | Dự án Phát triển phần mềm |
| Mã môn học | SWP391 |
| Lớp | SE20A02  |
| Học kỳ | Summer2026 |
| Tên bài tập / Project | Pro-Sport Management System |
| Tên sinh viên / Nhóm | Nhóm 3 |
| MSSV / Danh sách MSSV | Nguyễn Đăng Phúc (MSSV: DE190130) |
| Giảng viên hướng dẫn | QuangLTN3 |
| Ngày bắt đầu |  |
| Ngày hoàn thành |  |

---

## 2. Công cụ AI đã sử dụng

Đánh dấu các công cụ AI đã sử dụng trong quá trình thực hiện bài tập/project.

- [x] ChatGPT
- [x] Gemini
- [X] Claude
- [x] GitHub Copilot
- [x] Cursor
- [ ] Antigravity
- [ ] Perplexity
- [ ] Microsoft Copilot
- [ ] Công cụ khác: Stitch with Google
---

## 3. Mục tiêu sử dụng AI

Nhóm sử dụng AI để hỗ trợ trong quá trình phân tích yêu cầu hệ thống, xây dựng ý tưởng giải pháp, thiết kế kiến trúc chức năng và thiết kế UX/UI cho hệ thống quản lý trung tâm thể thao Badminton & Pickleball.

AI được sử dụng để:

- Phân tích yêu cầu nghiệp vụ
- Xây dựng danh sách chức năng hệ thống
- Thiết kế cấu trúc module
- Gợi ý kiến trúc màn hình UX/UI
- Sinh prompt thiết kế cho Stitch with Google
- Thiết kế dashboard và admin workflow
- Thiết kế giao diện booking, payment, rental, social matching
- Hỗ trợ viết tài liệu mô tả hệ thống
- Tối ưu luồng trải nghiệm người dùng
- Hỗ trợ tạo mockup giao diện desktop SaaS
- Hỗ trợ chuẩn hóa design system và component structure

### Mô tả mục tiêu sử dụng AI

```text
Viết tại đây...

```text
Viết tại đây...

## 4. Nhật ký sử dụng AI chi tiết

> Mỗi lần sử dụng AI cho một phần quan trọng của bài tập/project, sinh viên cần ghi lại theo mẫu bên dưới.  
> Sinh viên/nhóm có thể nhân bản mẫu “Lần sử dụng AI” nhiều lần tùy theo số lần sử dụng AI thực tế.

---

### Lần sử dụng AI số 1

| Nội dung | Thông tin |
|---|---|
| Ngày sử dụng | 2026-05-18 |
| Công cụ AI | ChatGPT |
| Mục đích sử dụng | Phân tích yêu cầu hệ thống và phân rã module |
| Phần việc liên quan | Requirement / Design |
| Mức độ sử dụng | Hỗ trợ nhiều |

#### 4.1. Prompt đã sử dụng

```text
Giả sử bạn là một designer. Dưới đây là các chức năng mà một hệ thống tôi phát triển sẽ có. Vui lòng liệt kê ra những màn hình (Screen) mà sẽ có trong hệ thống bên dưới, đồng thời chú thích trong những màn hình đó có những tính năng gì.
```

#### 4.2. Kết quả AI gợi ý

Tóm tắt nội dung AI đã trả lời hoặc gợi ý.

```text
AI đã phân tích toàn bộ yêu cầu hệ thống và đề xuất cấu trúc UX/UI tổng thể cho nền tảng quản lý trung tâm thể thao Badminton & Pickleball.

Kết quả bao gồm:
- Danh sách các module chính của hệ thống
- Danh sách các màn hình cần có cho từng module
- Chức năng chính của từng màn hình
- Phân loại vai trò người dùng (Customer, Staff, Admin)
- Đề xuất luồng nghiệp vụ và navigation giữa các màn hình

Tổng số màn hình được đề xuất khoảng 55–60 screens cho toàn bộ hệ thống.
```

#### 4.3. Phần sinh viên/nhóm đã sử dụng từ AI

Mô tả rõ phần nào được sử dụng lại từ gợi ý của AI.

```text
Nhóm sử dụng:
- Danh sách các module hệ thống
- Danh sách màn hình UX/UI
- Gợi ý chức năng cho từng màn hình
- Luồng điều hướng tổng thể giữa các module

Các nội dung này được sử dụng làm nền tảng để thiết kế UI/UX và xây dựng mockup hệ thống.
```

#### 4.4. Phần sinh viên/nhóm tự chỉnh sửa hoặc cải tiến

Mô tả sinh viên/nhóm đã thay đổi, kiểm tra, sửa lỗi hoặc cải tiến gì so với gợi ý ban đầu của AI.

```text
Nhóm đã:
- Điều chỉnh lại số lượng màn hình phù hợp với phạm vi project
- Tùy chỉnh flow booking và rental theo nghiệp vụ thực tế
- Bổ sung thêm các màn hình quản trị và dashboard
- Chuẩn hóa naming convention cho các module
- Tinh chỉnh lại quyền hạn giữa Customer, Staff và Admin
```

#### 4.5. Minh chứng

| Loại minh chứng | Nội dung |
|---|---|
| Link commit |  |
| File liên quan |  |
| Screenshot |  |
| Kết quả chạy/test |  |
| Link video demo |  |
| Ghi chú khác |  |

#### 4.6. Nhận xét cá nhân/nhóm

Sinh viên/nhóm học được gì sau lần sử dụng AI này?

```text
Nhóm học được cách phân tích yêu cầu hệ thống theo hướng UX/UI và cách tổ chức module cho một hệ thống SaaS quy mô lớn. AI hỗ trợ nhóm tiết kiệm thời gian trong việc lên cấu trúc màn hình và xác định flow nghiệp vụ ban đầu.
```

---

### Lần sử dụng AI số 2

| Nội dung | Thông tin |
|---|---|
| Ngày sử dụng | 2026-05-18  |
| Công cụ AI | ChatGPT / Stitch with Google |
| Mục đích sử dụng | Thiết kế UX/UI cho toàn bộ hệ thống quản lý trung tâm thể thao Badminton & Pickleball |
| Phần việc liên quan | Design |
| Mức độ sử dụng | Hỗ trợ nhiều |

#### 4.1. Prompt đã sử dụng

```text
Viết prompt AI để ra lệnh cho Stitch with Google thiết kế cho mình các màn hình trong Authentication & Authorization Module.
Yêu cầu là mô tả rõ hệ thống này là hệ thống gì để Stitch tạo UX/UI chuẩn nhất.

Tương tự prompt cho:
- Court Management Module
- Smart Booking Module
- Social Matching Module
- Inventory Management Module
- Rental Management Module
- E-commerce Module
- Payment Integration Module
- Create Voucher Screen
- Promotion & Voucher Module
- Dashboard & Reporting Module
- Notification Module
- Audit & Logging Module
- System Administration Module
- Cross-system Shared Screens
```

#### 4.2. Kết quả AI gợi ý

```text
AI đã tạo các prompt chi tiết để sử dụng với Stitch with Google nhằm sinh giao diện UX/UI desktop cho toàn bộ hệ thống.

Kết quả bao gồm:
- Mô tả hệ thống sport-tech SaaS
- Design style tổng thể
- UX requirements
- Business rules
- Dashboard structure
- Danh sách màn hình cho từng module
- Thành phần giao diện và layout
- Navigation flow giữa các màn hình
- Design system theo phong cách enterprise SaaS và fintech

Tổng cộng hơn 58 màn hình UX/UI desktop được thiết kế bằng AI.
```

#### 4.3. Phần sinh viên/nhóm đã sử dụng từ AI

```text
Nhóm sử dụng:
- Prompt thiết kế UX/UI cho Stitch with Google
- Danh sách màn hình cho từng module
- Layout dashboard và component structure
- Gợi ý màu sắc, typography và UI style
- Navigation và workflow giữa các màn hình

Các nội dung này được dùng để generate mockup giao diện và xây dựng tài liệu thiết kế UI/UX.
```

#### 4.4. Phần sinh viên/nhóm tự chỉnh sửa hoặc cải tiến

```text
Nhóm đã:
- Chỉnh sửa lại màu sắc và spacing phù hợp branding nhóm
- Tinh chỉnh bố cục dashboard và card layout
- Bổ sung thêm icon, trạng thái và thông báo hệ thống
- Điều chỉnh số lượng component hiển thị trên từng màn hình
- Đồng bộ design system giữa các module
- Tối ưu trải nghiệm người dùng cho desktop workflow
```

#### 4.5. Minh chứng

| Loại minh chứng | Nội dung |
|---|---|
| Link commit |  |
| File liên quan |  |
| Screenshot |  |
| Kết quả chạy/test |  |
| Link video demo |  |
| Ghi chú khác |  |

#### 4.6. Nhận xét cá nhân/nhóm

```text
Nhóm học được cách sử dụng AI để xây dựng prompt chuyên nghiệp cho công cụ thiết kế UX/UI. AI hỗ trợ tăng tốc quá trình tạo mockup và giúp nhóm định hình rõ hơn về hệ thống design enterprise SaaS.
```

---

### Lần sử dụng AI số 3

| Nội dung | Thông tin |
|---|---|
| Ngày sử dụng |  |
| Công cụ AI | ChatGPT / Gemini / Claude / GitHub Copilot / Cursor / Antigravity / Khác |
| Mục đích sử dụng |  |
| Phần việc liên quan | Requirement / Design / Database / Frontend / Backend / Testing / Debug / Report / Presentation / Other |
| Mức độ sử dụng | Hỗ trợ ý tưởng / Hỗ trợ một phần / Hỗ trợ nhiều / Sinh chính nội dung |

#### 4.1. Prompt đã sử dụng

```text
Dán nguyên văn prompt đã hỏi AI tại đây.
```

#### 4.2. Kết quả AI gợi ý

```text
Viết tại đây...
```

#### 4.3. Phần sinh viên/nhóm đã sử dụng từ AI

```text
Viết tại đây...
```

#### 4.4. Phần sinh viên/nhóm tự chỉnh sửa hoặc cải tiến

```text
Viết tại đây...
```

#### 4.5. Minh chứng

| Loại minh chứng | Nội dung |
|---|---|
| Link commit |  |
| File liên quan |  |
| Screenshot |  |
| Kết quả chạy/test |  |
| Link video demo |  |
| Ghi chú khác |  |

#### 4.6. Nhận xét cá nhân/nhóm

```text
Viết tại đây...
```

---

## 5. Bảng tổng hợp mức độ sử dụng AI

Đánh dấu mức độ AI hỗ trợ ở từng hạng mục.

| Hạng mục | Không dùng AI | AI hỗ trợ ít | AI hỗ trợ nhiều | AI sinh chính | Ghi chú |
|---|:---:|:---:|:---:|:---:|---|
| Phân tích yêu cầu |  |  |  |  |  |
| Viết user story/use case |  |  |  |  |  |
| Thiết kế database |  |  |  |  |  |
| Thiết kế kiến trúc hệ thống |  |  |  |  |  |
| Thiết kế giao diện |  |  |  |  |  |
| Code frontend |  |  |  |  |  |
| Code backend |  |  |  |  |  |
| Debug lỗi |  |  |  |  |  |
| Viết test case |  |  |  |  |  |
| Kiểm thử sản phẩm |  |  |  |  |  |
| Tối ưu code |  |  |  |  |  |
| Viết báo cáo |  |  |  |  |  |
| Làm slide thuyết trình |  |  |  |  |  |

---

## 6. Các lỗi hoặc hạn chế từ AI

Ghi lại các trường hợp AI trả lời sai, thiếu, chưa phù hợp hoặc sinh code không chạy.

| STT | Lỗi/hạn chế từ AI | Cách phát hiện | Cách xử lý/cải tiến |
|---:|---|---|---|
| 1 |  |  |  |
| 2 |  |  |  |
| 3 |  |  |  |

---

## 7. Kiểm chứng kết quả AI

Mô tả cách sinh viên/nhóm kiểm tra lại kết quả do AI gợi ý.

Có thể bao gồm:

- Chạy thử chương trình
- Viết test case
- So sánh với yêu cầu đề bài
- Kiểm tra output
- Đối chiếu tài liệu môn học
- Hỏi lại giảng viên
- Review cùng thành viên nhóm
- Kiểm tra lỗi bảo mật
- Kiểm tra bằng dữ liệu mẫu
- So sánh trước và sau khi dùng AI

### Nội dung kiểm chứng

```text
Viết tại đây...
```

---

## 8. Đóng góp cá nhân hoặc đóng góp nhóm

### 8.1. Đối với bài cá nhân

Mô tả phần sinh viên tự làm, phần AI hỗ trợ và phần đã tự cải tiến.

```text
Viết tại đây...
```

### 8.2. Đối với bài nhóm

| Thành viên | MSSV | Nhiệm vụ chính | Có sử dụng AI không? | Minh chứng đóng góp |
|---|---|---|---|---|
|  |  |  | Có / Không |  |
|  |  |  | Có / Không |  |
|  |  |  | Có / Không |  |
|  |  |  | Có / Không |  |

---

## 9. Reflection cuối bài

### 9.1. AI đã hỗ trợ em/nhóm ở điểm nào?

```text
Viết tại đây...
```

### 9.2. Phần nào em/nhóm không sử dụng theo gợi ý của AI? Vì sao?

```text
Viết tại đây...
```

### 9.3. Em/nhóm đã kiểm tra tính đúng đắn của kết quả AI như thế nào?

```text
Viết tại đây...
```

### 9.4. Nếu không có AI, phần nào sẽ khó khăn nhất?

```text
Viết tại đây...
```

### 9.5. Sau bài tập/project này, em/nhóm học được gì về môn học?

```text
Viết tại đây...
```

### 9.6. Sau bài tập/project này, em/nhóm học được gì về cách sử dụng AI có trách nhiệm?

```text
Viết tại đây...
```

---

## 10. Cam kết học thuật

Sinh viên/nhóm cam kết rằng:

- Nội dung AI hỗ trợ đã được ghi nhận trung thực.
- Không nộp nguyên văn kết quả AI mà không kiểm tra.
- Có khả năng giải thích các phần đã nộp.
- Chịu trách nhiệm về tính đúng đắn của sản phẩm cuối cùng.
- Hiểu rằng việc sử dụng AI không khai báo có thể ảnh hưởng đến kết quả đánh giá.

| Đại diện sinh viên/nhóm | Ngày xác nhận |
|---|---|
|  |  |
