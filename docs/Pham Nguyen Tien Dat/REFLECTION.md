# Tự phản ánh (Reflection và Lessons Learned)

---

## Reflection - Tuần 1: Khởi tạo dự án và Dựng Mockup UI

### Tổng quan quá trình
Trong tuần này, chúng tôi đã sử dụng Gemini và Stitch By Google để lên ý tưởng và dựng bản nháp giao diện (Mockup) tĩnh cho hệ thống Pro-Sport Complex Management. Việc áp dụng kỹ thuật Meta-prompting (dùng Gemini sinh prompt chuẩn tiếng Anh làm đầu vào cho Stitch) đã thể hiện hiệu suất rất cao trong việc trực quan hóa các ý tưởng thiết kế thành mã HTML/CSS chỉ trong thời gian ngắn.

### Hạn chế của AI
Tuy nhiên, kết quả đầu ra của AI ban đầu còn mang tính chất chung chung:
- Bỏ sót các thành phần nghiệp vụ đặc thù của nền tảng đặt sân thể thao (chẳng hạn như lịch dạng lưới hoặc form thanh toán).
- Mã nguồn sinh ra có dạng nguyên khối (monolithic) rất khó tái sử dụng và bảo trì trong tương lai.

### Giải pháp và Can thiệp của con người
Để giải quyết những hạn chế về mặt nghiệp vụ và cấu trúc này, chúng tôi đã:
1. Chủ động tinh chỉnh Prompt: Ép AI bổ sung các thành phần còn thiếu và điều chỉnh lại bảng màu cho khớp với nhận diện thương hiệu của dự án.
2. Tái cấu trúc mã nguồn: Tự tay bóc tách các file HTML tĩnh thành các module hoặc component riêng biệt như Header, Footer, Menu.

### Bài học rút ra
Sự điều chỉnh về mặt cấu trúc này đã giúp chúng tôi hiểu rằng AI rất giỏi trong việc phác thảo bố cục tổng thể, nhưng để sản phẩm đáp ứng đúng kiến trúc phần mềm, lập trình viên phải là người trực tiếp phân rã và tổ chức lại mã nguồn. Việc sử dụng kết hợp các công cụ AI theo chuỗi mang lại tốc độ vượt trội trong giai đoạn tạo mẫu, nhưng sự giám sát chặt chẽ và tinh chỉnh thủ công từ con người là bắt buộc để biến một giao diện mẫu thành một bộ khung dự án chuẩn hóa.

---

# Reflection - Tuần 2: Nâng cấp Premium UI/UX và Tích hợp Logic

## Tổng quan quá trình

Trong tuần này, chúng tôi tập trung đồng thời vào hai mục tiêu lớn:

1. Lột xác hoàn toàn giao diện người dùng đạt chuẩn Premium UI/UX.
2. Chuyển đổi thiết kế tĩnh thành các React Component hoạt động được cho 2 phân hệ lõi là Courts (Apex) và MatchPro.

Chúng tôi đã tận dụng Antigravity AI để sinh mã nguồn JSX, Tailwind CSS và gợi ý cấu trúc hiệu ứng chuyển động với thư viện GSAP cho tổng cộng 10 trang chức năng.

Bên cạnh đó, chúng tôi cũng hoàn thiện toàn bộ hệ thống giao diện đa phân hệ bao gồm hơn 40 trang React phủ khắp 6 phân hệ: **Public Pages**, **Admin Portal**, **EliteSport OS**, **Mobile App**, **Shop** và **Status Pages** — tất cả đều được xây dựng dựa trên ảnh thiết kế gốc và triển khai trong cùng một tuần.

---

## Hạn chế của AI và Khó khăn kỹ thuật

Mặc dù công cụ này giúp tăng tốc đáng kể quá trình xây dựng giao diện, nhưng lại bộc lộ nhiều điểm yếu khi đi vào thực tế:

- **Kiến trúc lộn xộn:** AI nhồi nhét trực tiếp mã animation vào bên trong component gây rối mắt.
- **Thiếu logic thực tế:** Hoàn toàn thiếu hụt luồng luân chuyển dữ liệu thực tế (Data Flow) và các ràng buộc kiểm tra tính hợp lệ (Validation) bắt buộc cho form đặt sân.
- **Lỗi môi trường phát triển:** Quá trình làm việc cục bộ bị gián đoạn bởi lỗi crash server Vite (báo lỗi EBUSY) liên tục xảy ra khi hệ thống hot-reload.
- **Lỗi Build — Entry Point sai:** AI sinh ra `index.html` với đường dẫn script trỏ sai (`/src/main.jsx` thay vì `/main.jsx`), khiến toàn bộ dự án không thể build. Lỗi này chỉ phát hiện được khi chạy thực tế, AI không tự kiểm tra cấu trúc thư mục trước khi sinh code.
- **Lỗi Routing hàng loạt:** AI để comment toàn bộ các route Public trong `App.jsx` khiến trang chủ và các trang đăng nhập, đăng ký đều trả về 404. Ngoài ra, các đường dẫn xuất hiện trên Navbar (`/courts`, `/matches`, `/gear`) không được đăng ký trong bộ định tuyến.
- **Lỗi tương thích trình duyệt:** AI sử dụng CSS selector `:has()` không được Firefox hỗ trợ, gây vỡ layout trên một phần người dùng. Đây là lỗi tinh vi không thể phát hiện nếu chỉ test trên Chrome.
- **Navigation dẫn đến trang không tồn tại:** AI sinh ra 10 nav link trong sidebar Admin trỏ tới các route chưa được xây dựng, gây lỗi 404 ngay khi người dùng click vào menu.
- **Lỗi layout Mobile:** Các trang Mobile App sử dụng `position: absolute` cho thanh nhập liệu và nút hành động, khiến nội dung bị che khuất do AI không nhận biết được scroll container thực tế của MobileLayout.

---

## Giải pháp và Can thiệp của con người

Để vượt qua những trở ngại kỹ thuật này, chúng tôi đã tiến hành tái cấu trúc (refactoring) mạnh mẽ:

- **Tối ưu Component:** Bóc tách logic GSAP ra thành các custom hooks (`useScrollReveal`, `useNavbarEntrance`) để giữ cho các UI Component sạch sẽ và dễ tái sử dụng.
- **Tích hợp API và Validation:** Tự tay cài đặt thư viện Axios để gọi API từ Backend và bổ sung các hàm chặn lỗi logic (ví dụ: chặn người dùng chọn ngày/giờ trong quá khứ).
- **Can thiệp cấu hình:** Trực tiếp chỉnh sửa file `vite.config.js` để hệ thống bỏ qua thư mục `.vs`, giải quyết dứt điểm lỗi hạ tầng môi trường mà AI không lường trước được.
- **Sửa lỗi Build thủ công:** Tự phát hiện và sửa đường dẫn entry point trong `index.html`, đảm bảo lệnh `npm run build` chạy thành công với 108 modules không lỗi.
- **Tái thiết lập hệ thống Routing:** Tự bổ sung và uncomment toàn bộ các route còn thiếu trong `App.jsx`, đảm bảo tất cả 40+ trang đều có thể truy cập đúng đường dẫn.
- **Kiểm tra đa trình duyệt:** Phát hiện và loại bỏ selector CSS `:has()` không tương thích, thay bằng cách tiếp cận dùng class thông thường, đảm bảo giao diện hiển thị đồng nhất trên cả Chrome và Firefox.
- **Sửa lỗi Layout Mobile:** Chuyển `position: absolute` sang `position: sticky` cho các thanh input và nút CTA trong Mobile App, giải quyết triệt để vấn đề chồng lấp nội dung.

---

## Bài học rút ra

- **AI giỏi sinh khối lượng, con người đảm bảo chất lượng:** AI có thể xây dựng nhanh hàng chục trang giao diện trong thời gian ngắn, nhưng không thể tự kiểm tra tính đúng đắn của từng chi tiết kỹ thuật trong môi trường thực tế.
- **Kiểm thử thực tế là bắt buộc:** Nhiều lỗi (entry point, routing, CSS trình duyệt, layout scroll) chỉ xuất hiện khi chạy thực tế, không thể phát hiện chỉ bằng cách đọc code.
- **Cung cấp ngữ cảnh đầy đủ giúp AI hiệu quả hơn:** Các prompt có đính kèm ảnh thiết kế và tài liệu yêu cầu (SRS) cho kết quả sát với mong muốn hơn nhiều so với prompt mô tả thuần văn bản.
- **Tái cấu trúc ngay từ đầu tiết kiệm thời gian dài hạn:** Việc tách logic animation thành custom hooks và phân tách component ngay trong tuần này giúp toàn bộ codebase dễ bảo trì và mở rộng trong các tuần tiếp theo.


# Reflection - Tuần 3: Hoàn thiện Phân hệ Phụ trợ và Chuẩn hóa Đa ngôn ngữ
## Tổng quan quá trình
Trong tuần này, chúng tôi tập trung vào việc hoàn thiện các mảng ghép cuối cùng của giao diện người dùng, cụ thể là phân hệ Gear (quản lý trang thiết bị thể thao) và tiến hành chuẩn hóa đa ngôn ngữ toàn bộ hệ thống sang Tiếng Anh.
Chúng tôi tiếp tục sử dụng Antigravity AI để tự động thiết kế và sinh mã nguồn cho 4 trang thông tin phụ trợ quan trọng: Equipment Rental Terms, Maintenance Tracking, Support Hub, và Privacy Policy. Đồng thời, hoàn thiện luồng chuyển hướng (Routing) đầy đủ cho các trang này để gắn kết liền mạch vào hệ thống chung.
---
## Hạn chế của AI và Khó khăn kỹ thuật
Quá trình chuẩn hóa đa ngôn ngữ toàn dự án (quét và dịch thuật tự động trên 40+ file mã nguồn) đã bộc lộ rõ rệt giới hạn về khả năng quản lý tài nguyên của AI khi hoạt động ở quy mô lớn:
- **Sự cố quá tải API (Rate Limit / Quota Exhausted):** Khi nhận được yêu cầu rà soát và dịch thuật trên diện rộng, AI đã tự động phân luồng (spawn) hàng loạt tiến trình phụ (sub-agents) để chạy song song cùng lúc. Điều này lập tức dẫn đến việc vượt quá hạn mức API cho phép của hệ thống (Error 429), khiến toàn bộ các tiến trình dịch thuật bị sập và thất bại.
- **Định tuyến tĩnh phá vỡ kiến trúc SPA:** Khi thiết kế giao diện tĩnh (đặc biệt là ở khu vực Footer), AI thường sử dụng thẻ HTML cơ bản `<a>` với thuộc tính `href="#"`. Nếu đưa vào thực tế, điều này sẽ làm trang web bị tải lại (reload) toàn bộ khi người dùng click, phá vỡ hoàn toàn trải nghiệm mượt mà của kiến trúc Single Page Application (SPA).
---
## Giải pháp và Can thiệp của con người
Để khắc phục tình trạng quá tải hệ thống và đảm bảo dự án đi đúng tiến độ, chúng tôi đã đưa ra các quyết định can thiệp kỹ thuật kịp thời:
- **Quản lý luồng thực thi (Resource Management):** Thay vì để AI tự do xử lý toàn dự án cùng lúc, chúng tôi đã can thiệp đình chỉ (kill) các tiến trình ngầm đang bị treo. Chúng tôi chủ động thu hẹp phạm vi công việc, yêu cầu AI ưu tiên dồn tài nguyên xử lý dứt điểm 4 trang chức năng cốt lõi của phân hệ Gear trước để tránh nghẽn hệ thống. Việc rà soát ngôn ngữ được chuyển sang hình thức kiểm tra cục bộ thay vì quét diện rộng.
- **Chuẩn hóa Định tuyến (Routing SPA):** Trực tiếp cấu hình và chỉ định AI chuyển đổi toàn bộ các thẻ liên kết tĩnh `<a>` thành component `<Link>` của thư viện React Router trong các file Layout. Thao tác này giúp cơ chế chuyển hướng nội bộ hoạt động trơn tru, giữ vững hiệu năng của một ứng dụng SPA thực thụ.
---
## Bài học rút ra
- **Ràng buộc hạ tầng và Chiến lược chia nhỏ tác vụ:** Dù AI có khả năng xử lý song song vô cùng mạnh mẽ, chúng vẫn bị ràng buộc khắt khe bởi giới hạn API (Quota) từ nhà cung cấp. Lập trình viên không nên phó mặc các tác vụ "quét toàn dự án" cho AI thao tác tự do, mà cần có kỹ năng chia nhỏ (break down) công việc thành các luồng xử lý cục bộ để đảm bảo an toàn cho hệ thống.
- **Vai trò điều phối của kỹ sư:** Khi hệ thống AI gặp lỗi sập luồng, con người phải đứng ở vị trí "người điều phối tài nguyên" (Orchestrator) — biết khi nào nên đóng băng tiến trình, đánh giá lại mức độ ưu tiên của công việc và chuyển hướng AI vào các tác vụ cốt lõi mang lại giá trị tức thời.
