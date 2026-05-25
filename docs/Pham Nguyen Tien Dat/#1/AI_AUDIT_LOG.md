# AI Audit Log

## 1. Thông tin chung

| Thông tin | Nội dung |
|---|---|
| Môn học | Software development project |
| Mã môn học | SWP391 |
| Lớp | SE20A02 |
| Học kỳ | SU26 |
| Tên bài tập / Project | Pro-Sport Complex Management System |
| Tên sinh viên / Nhóm | Phạm Nguyễn Tiến  |
| MSSV / Danh sách MSSV | DE190147 |
| Giảng viên hướng dẫn | QuangLTN3 |
| Ngày bắt đầu | 2026-05-15 |
| Ngày hoàn thành | 2026-05-25 |

---

## 2. Công cụ AI đã sử dụng

Đánh dấu các công cụ AI đã sử dụng trong quá trình thực hiện bài tập/project.

- [ ] ChatGPT
- [ x ] Gemini
- [ ] Claude
- [ ] GitHub Copilot
- [ ] Cursor
- [ ] Antigravity
- [ ] Perplexity
- [ ] Microsoft Copilot
- [ x ] Công cụ khác: Stitch By Google

---

## 3. Mục tiêu sử dụng AI

Mô tả ngắn gọn sinh viên/nhóm đã sử dụng AI để hỗ trợ những công việc nào.

Ví dụ:

- Phân tích yêu cầu bài toán
- Gợi ý ý tưởng giải pháp
- Thiết kế database
- Thiết kế giao diện
- Viết code mẫu
- Debug lỗi
- Tối ưu code
- Viết test case
- Kiểm tra bảo mật
- Viết báo cáo
- Chuẩn bị slide thuyết trình
- Tìm hiểu công nghệ mới

### Mô tả mục tiêu sử dụng AI

Sử dụng Gemini để lên ý tưởng thiết kế giao diện và hoàn thoành phần design trang web cho dự án. 


## 4. Nhật ký sử dụng AI chi tiết

> Mỗi lần sử dụng AI cho một phần quan trọng của bài tập/project, sinh viên cần ghi lại theo mẫu bên dưới.  
> Sinh viên/nhóm có thể nhân bản mẫu “Lần sử dụng AI” nhiều lần tùy theo số lần sử dụng AI thực tế.

---

### Lần sử dụng AI số 1

| Nội dung | Thông tin |
|---|---|
| Ngày sử dụng | 2026/05/20 |
| Công cụ AI | Gemini |
| Mục đích sử dụng | Tạo prompt để yêu cầu stitch thiết kế giao diện web  |
| Phần việc liên quan |  Design / Tạo Prompt |
| Mức độ sử dụng | Hỗ trợ nhiều |

#### 4.1. Prompt đã sử dụng

```text
Dán nguyên văn prompt đã hỏi AI tại đây.
```
Như là một DESIGNER, bạn hãy cho tôi prompt để hướng dẫn Stitch làm phần thiết kế UI cho dự án Pro-Sport Complex Management System của tôi. Yêu cầu giao diện thân thiện, có chức năng đặt sân, xem lịch, và dashboard cho người quản lý.

#### 4.2. Kết quả AI gợi ý

Tóm tắt nội dung AI đã trả lời hoặc gợi ý.

```text
Viết tại đây...
```
AI đã đóng vai trò Designer, phân tích các thành phần cần thiết và trả về một bộ prompt chi tiết bằng tiếng Anh (tối ưu cho Stitch), bao gồm: tone màu chủ đạo (thể thao, năng động), layout cho trang chủ, màn hình danh sách sân (hiển thị trạng thái trống/kín), và giao diện dashboard với các biểu đồ thống kê cơ bản.

#### 4.3. Phần sinh viên/nhóm đã sử dụng từ AI

Mô tả rõ phần nào được sử dụng lại từ gợi ý của AI.

```text
Viết tại đây...
```
Sử dụng nguyên cấu trúc prompt tiếng Anh và các gợi ý về bố cục (layout) màn hình đặt sân thể thao để đưa vào công cụ Stitch By Google nhằm generate ra các component UI.

#### 4.4. Phần sinh viên/nhóm tự chỉnh sửa hoặc cải tiến

Mô tả sinh viên/nhóm đã thay đổi, kiểm tra, sửa lỗi hoặc cải tiến gì so với gợi ý ban đầu của AI.

```text
Viết tại đây...
```
Đã tùy chỉnh lại tone màu trong prompt của AI thành màu sắc phù hợp với nhận diện thương hiệu đã chốt của nhóm, đồng thời bổ sung thêm yêu cầu hiển thị chi tiết form thanh toán (Payment UI) mà AI ban đầu bỏ sót.

#### 4.5. Minh chứng

| Loại minh chứng | Nội dung |
|---|---|
| Link commit |  |
| File liên quan |  |
| Screenshot | https://drive.google.com/drive/u/0/folders/1XYE9kzz93BVNLShX8tkJFNkyd-kvb7E3 |
| Kết quả chạy/test |  |
| Link video demo |  |
| Ghi chú khác |  |

#### 4.6. Nhận xét cá nhân/nhóm

Sinh viên/nhóm học được gì sau lần sử dụng AI này?

```text
Viết tại đây...
```
Việc dùng Gemini để "meta-prompt" (tạo prompt cho một AI khác) giúp tiết kiệm rất nhiều thời gian so với việc tự mò mẫm cách ra lệnh cho Stitch. Giao diện sinh ra mang tính định hướng tốt, tuy nhiên vẫn cần tinh chỉnh thủ công để các component khớp hoàn toàn với luồng người dùng (User Flow).

---

### Lần sử dụng AI số 2

| Nội dung | Thông tin |
|---|---|
| Ngày sử dụng | 2026-05-21 |
| Công cụ AI | Stitch By Google |
| Mục đích sử dụng | Tạo giao diện (UI) và sinh mã Frontend từ prompt đã chuẩn bị |
| Phần việc liên quan |  Design / Frontend |
| Mức độ sử dụng |Sinh chính nội dung |

#### 4.1. Prompt đã sử dụng

```text
Dán nguyên văn prompt đã hỏi AI tại đây.
```
Design a clean and modern dashboard for a sports complex management system. Include a sidebar for navigation (Dashboard, Court Booking, Users, Settings, a main area showing a calendar view of booked courts, and quick stat cards for daily revenue and active bookings. Use a sporty color palette with energetic accents.

#### 4.2. Kết quả AI gợi ý

```text
Viết tại đây...
```
Stitch By Google đã sinh ra mã nguồn (HTML/CSS/JS) cho một giao diện web trực quan, bao gồm layout của trang Dashboard, các thanh điều hướng (Navbar/Sidebar), và các thành phần (components) hiển thị trạng thái sân (trống/đã đặt/đang bảo trì) cùng với các nút chức năng.

#### 4.3. Phần sinh viên/nhóm đã sử dụng từ AI

```text
Viết tại đây...
```
Nhóm quyết định sử dụng toàn bộ cấu trúc Layout, bố cục chia lưới (Grid/Flexbox) và các mã màu CSS mà Stitch đã tạo ra cho các trang chính như Trang chủ, Danh sách sân và Form đặt sân.

#### 4.4. Phần sinh viên/nhóm tự chỉnh sửa hoặc cải tiến

```text
Viết tại đây...
```
Tách các file HTML tĩnh mà Stitch sinh ra thành các file .jsp riêng biệt (Header, Footer, Menu) để tái sử dụng (include) theo cấu trúc của Java Web.

Gắn thêm các thẻ thư viện JSTL và thay thế dữ liệu giả (mock data) của Stitch bằng dữ liệu động (dynamic data) được truyền xuống từ Model/Controller.

Tinh chỉnh lại một số class CSS để giao diện responsive tốt hơn trên màn hình điện thoại di động.

#### 4.5. Minh chứng

| Loại minh chứng | Nội dung |
|---|---|
| Link commit |  |
| File liên quan |  |
| Screenshot | https://drive.google.com/drive/u/0/folders/1XYE9kzz93BVNLShX8tkJFNkyd-kvb7E3 |
| Kết quả chạy/test |  |
| Link video demo |  |
| Ghi chú khác |  |

#### 4.6. Nhận xét cá nhân/nhóm

```text
Viết tại đây...
```
Stitch giúp chuyển đổi ý tưởng bằng văn bản thành mã code Frontend một cách trực quan và cực kỳ nhanh chóng. Thay vì phải tự viết từng thẻ HTML/CSS từ đầu, nhóm chỉ cần tập trung vào việc bóc tách component và ghép nối với Backend, tiết kiệm được rất nhiều thời gian thiết kế tĩnh.
---

### Lần sử dụng AI số 3

| Nội dung | Thông tin |
|---|---|
| Ngày sử dụng | 2026-05-22 |
| Công cụ AI | Antigravity |
| Mục đích sử dụng | Thiết kế và sinh mã nguồn các Component giao diện bằng React |
| Phần việc liên quan | Design /Frontend |
| Mức độ sử dụng | Hỗ trợ nhiều|

#### 4.1. Prompt đã sử dụng

```text
Dán nguyên văn prompt đã hỏi AI tại đây.
```
Build a responsive React component for a sports court booking form. It should include fields for selecting the date, time slots, court type (e.g., Tennis, Badminton, Football), and a submit button. Use Tailwind CSS for styling and ensure the design is modern and sporty.

#### 4.2. Kết quả AI gợi ý

```text
Viết tại đây...
```
Antigravity AI đã trả về một cấu trúc React Functional Component hoàn chỉnh. Code bao gồm các hooks cơ bản như useState để quản lý trạng thái form (ngày, giờ, loại sân), cùng với các thẻ JSX được định dạng sẵn giao diện đẹp mắt, reponsive thông qua các class của Tailwind CSS.ết kế.
#### 4.3. Phần sinh viên/nhóm đã sử dụng từ AI

```text
Viết tại đây...
```
Nhóm đã tái sử dụng toàn bộ cấu trúc UI (JSX) và các class Tailwind CSS mà Antigravity tạo ra cho form đặt sân, danh sách hiển thị sân và bảng điều khiển (Dashboard component) để đảm bảo tính đồng bộ về mặt thiết kế.
#### 4.4. Phần sinh viên/nhóm tự chỉnh sửa hoặc cải tiến

```text
Viết tại đây...
```
Tách nhỏ các đoạn code monolithic do AI sinh ra thành các React Components tái sử dụng được (như Button, InputField, CourtCard).

Tự viết thêm các logic gọi API (sử dụng fetch hoặc axios) để lấy dữ liệu sân thực tế từ Backend (Java) thay vì dùng dữ liệu tĩnh của AI.

Thêm logic validation (kiểm tra tính hợp lệ) cho form trước khi gửi dữ liệu đi, ví dụ: bắt lỗi không được chọn thời gian trong quá khứ.
#### 4.5. Minh chứng

| Loại minh chứng | Nội dung |
|---|---|
| Link commit |  |
| File liên quan |  |
| Screenshot | https://drive.google.com/drive/u/0/folders/1XYE9kzz93BVNLShX8tkJFNkyd-kvb7E3 |
| Kết quả chạy/test |  |
| Link video demo |  |
| Ghi chú khác |  |

#### 4.6. Nhận xét cá nhân/nhóm

```text
Viết tại đây...
```
Antigravity AI giải quyết được khối lượng lớn công việc cắt HTML/CSS (chuyển đổi thành JSX và Tailwind). Tuy nhiên, để một ứng dụng React hoạt động và giao tiếp được với Backend API, nhóm phải tự nắm vững kiến thức về React Hooks, Lifecycle và xử lý bất đồng bộ.
---

## 5. Bảng tổng hợp mức độ sử dụng AI

Đánh dấu mức độ AI hỗ trợ ở từng hạng mục.

| Hạng mục | Không dùng AI | AI hỗ trợ ít | AI hỗ trợ nhiều | AI sinh chính | Ghi chú |
|---|:---:|:---:|:---:|:---:|---|
| Phân tích yêu cầu |  |  |  |  |  |
| Viết user story/use case |x  |  |  |  |  |
| Thiết kế database |  |  |  |  |  |
| Thiết kế kiến trúc hệ thống | x |  |  |  |  |
| Thiết kế giao diện |  |  |  | x |  |
| Code frontend |  |  |  | x |  |
| Code backend |  |  |  |  |  |
| Debug lỗi |  |  |  |  |  |
| Viết test case |  |  |  |  |  |
| Kiểm thử sản phẩm |  |  |  | x |  |
| Tối ưu code |  |  |  | x |  |
| Viết báo cáo | x |  |  |  |  |
| Làm slide thuyết trình |  |  |  |  |  |

---

## 6. Các lỗi hoặc hạn chế từ AI

Ghi lại các trường hợp AI trả lời sai, thiếu, chưa phù hợp hoặc sinh code không chạy.

| STT | Lỗi/hạn chế từ AI | Cách phát hiện | Cách xử lý/cải tiến |
|---:|---|---|---|
| 1 | Antigravity AI sinh ra React Component với dữ liệu cứng (Hardcoded data), không có cơ chế gọi API thật. | Review code trong file JSX. | Tự tích hợp Axios và viết logic xử lý response/request nối với Backend. |
| 2 | Prompt do Gemini tạo ra cho Stitch đôi khi sinh ra các khối (div) không chuẩn kích thước responsive trên màn hình nhỏ. | Thu nhỏ màn hình trình duyệt (DevTools). | Sử dụng các class md:, lg: của Tailwind để chỉnh lại breakpoints ở bước code React. |
| 3 | AI bỏ qua bước validation form (cho phép chọn ngày trong quá khứ).   | Test chức năng UI trên trình duyệt. | Thêm code xử lý điều kiện bắt buộc nhập và chặn ngày quá khứ trong hàm handleSubmit. |

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
Về Code Frontend (React): Mọi component do Antigravity AI tạo ra đều được chạy kiểm tra trên môi trường localhost:3000. Nhóm mở thẻ Network và Console trong Chrome DevTools để theo dõi việc render component có bị dư thừa không và các API call có hoạt động đúng chuẩn RESTful không.

Về UI/UX: Đối chiếu giao diện thực tế của ứng dụng React với bản nháp do Stitch sinh ra, đảm bảo tính đồng bộ về màu sắc và layout. Nhóm tiến hành test thử nghiệm trên cả màn hình PC và Mobile.
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
| Phạm Nguyễn Tiến Đạt | DE190147 | Thiết kết UI/UX và Front end | Có |https://github.com/tiendat2277sg-wq &&&&  https://drive.google.com/drive/u/0/folders/1XYE9kzz93BVNLShX8tkJFNkyd-kvb7E3|
|  |  |  | Có / Không |  |
|  |  |  | Có / Không |  |
|  |  |  | Có / Không |  |

---

## 9. Reflection cuối bài

### 9.1. AI đã hỗ trợ em/nhóm ở điểm nào?

```text
Viết tại đây...
```
Các công cụ AI (như Stitch và Antigravity) giúp giải phóng nhóm khỏi các công việc tốn thời gian ở phần thiết kế UI và cắt HTML/CSS. Thay vì phải tự viết từng thẻ div và class, nhóm có sẵn một bộ khung React xịn xò để tích hợp thẳng API vào, tối ưu tốc độ phát triển dự án.
### 9.2. Phần nào em/nhóm không sử dụng theo gợi ý của AI? Vì sao?

```text
Viết tại đây...
```
Nhóm từ chối cách AI quản lý State (trạng thái) bên trong các component React. Code AI sinh ra thường gộp hết mọi thứ vào một component lớn (Monolithic). Nhóm đã bóc tách nó ra theo chuẩn Clean Code của React để dễ bảo trì sau này. Ngoài ra, phần Backend (Java/SQL) nhóm hoàn toàn tự làm để đảm bảo kiến trúc chặt chẽ.
### 9.3. Em/nhóm đã kiểm tra tính đúng đắn của kết quả AI như thế nào?

```text
Viết tại đây...
```
Mọi đoạn code React sinh ra đều được đặt vào hệ thống và test việc gọi API thực tế đến Backend. Nếu giao diện render lỗi hoặc dữ liệu không đổ ra được bảng, nhóm sẽ tự trace log và fix bug bằng tay.
### 9.4. Nếu không có AI, phần nào sẽ khó khăn nhất?

```text
Viết tại đây...
```
Khó khăn lớn nhất là việc biến ý tưởng giao diện thành code React/Tailwind một cách nhanh chóng. Các thành viên trong nhóm vốn quen thuộc với Java Backend hơn, nên nếu phải tự mò mẫm code Frontend từ đầu, dự án sẽ khó có được giao diện đẹp và responsive kịp deadline.
### 9.5. Sau bài tập/project này, em/nhóm học được gì về môn học?

```text
Viết tại đây...
```
Học được cách phát triển một dự án thực tế theo mô hình Tách biệt Client - Server (React kết hợp Java Backend API), hiểu rõ cách thức dữ liệu di chuyển từ CSDL, qua Backend xử lý logic nghiệp vụ, và cuối cùng render lên màn hình cho người dùng qua Frontend.
### 9.6. Sau bài tập/project này, em/nhóm học được gì về cách sử dụng AI có trách nhiệm?

```text
Viết tại đây...
```
Biết cách phân bổ công cụ AI đúng mục đích: Dùng AI chuyên ngữ nghĩa (Gemini) để làm trung gian giao tiếp với AI chuyên sinh UI/Code (Stitch, Antigravity). Dù AI code UI rất nhanh, nhưng tư duy phân chia component và luồng luân chuyển dữ liệu API (Data Flow) phải do kỹ sư phần mềm (con người) kiểm soát hoàn toàn.
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
| Phạm Nguyễn Tiến Đạt | 2026/05/25 |
