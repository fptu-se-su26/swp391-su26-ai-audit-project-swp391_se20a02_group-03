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

---

# Reflection - Tuần 3: Khởi tạo và Cấu hình Môi trường Phát triển (Category 1)

## Tổng quan quá trình

Trong giai đoạn này, dự án bắt đầu bước vào quá trình setup codebase chính thức. Chúng tôi đã dùng Cursor IDE để tự động hóa việc khởi tạo các file cấu hình môi trường chuẩn cho toàn bộ repository, bao gồm `.gitignore`, `README.md`, và các file `*.env.example`.

## Hạn chế của AI và Khó khăn kỹ thuật

Mặc dù việc setup bằng AI vô cùng nhanh chóng, vẫn tồn tại một số vấn đề:
- AI thiết lập cấu hình Database mẫu là SQLite vì tính phổ biến trong các bài tutorial, thay vì sử dụng SQL Server như nhóm đã định hướng trong SRS.
- File `.gitignore` sinh ra đôi khi thiếu sót một số thư mục cache đặc thù của công cụ nội bộ hoặc của một số extension IDE cụ thể.

## Giải pháp và Can thiệp của con người

- **Hiệu chỉnh cấu hình Database:** Tự tay chỉnh sửa lại `appsettings.Development.json.example` để khai báo mẫu Connection String của SQL Server (LocalDB) và hướng dẫn cách thiết lập.
- **Rà soát File bỏ qua:** Kiểm tra kỹ file `.gitignore` để chắc chắn thư mục `node_modules` và thư mục `bin/`, `obj/` của .NET không lọt vào commit.

## Bài học rút ra

- **AI lý tưởng cho Boilerplate:** Việc viết các file cấu hình cơ bản là tốn thời gian nhưng rập khuôn. Cursor hoàn thành việc này trong vài giây, giúp nhóm lập tức tập trung vào viết logic nghiệp vụ.
- **Luôn phải rà soát thiết lập mặc định:** Không bao giờ tin tưởng hoàn toàn vào các cài đặt môi trường do AI sinh ra. Luôn phải căn chỉnh lại theo đúng yêu cầu kiến trúc đã thống nhất từ đầu.

---

# Reflection - Tuần 4: Bảo trì và Cập nhật Công cụ Hệ thống (System Tooling)

## Tổng quan quá trình
Sau khi dự án đã đi vào guồng quay, một trở ngại lớn xuất hiện: Công cụ kiểm tra chất lượng code (ESLint) nâng cấp lên phiên bản v9 và phá vỡ hoàn toàn cấu trúc file cấu hình cũ (Breaking Changes). Việc này làm tê liệt hoàn toàn hệ thống Linter của nhóm.

## Hạn chế của dự án / Khó khăn kỹ thuật
Cấu trúc "Flat Config" của ESLint v9 là một khái niệm rất mới, đòi hỏi lập trình viên phải đọc lại hàng chục trang Document để hiểu cách `import` các plugin bằng file JavaScript thuần, thay vì chỉ cấu hình bằng một file JSON đơn giản như trước kia. Việc tự mò mẫm cấu trúc này tốn quá nhiều thời gian không đáng có.

## Giải pháp và Vai trò của AI
Chúng tôi đã đẩy toàn bộ đầu bài kỹ thuật (plugins cần dùng, các rules cần tắt) cho Antigravity AI. AI xử lý vai trò như một kỹ sư Dev-Tooling chuyên nghiệp: "dịch" cấu hình mong muốn sang cấu trúc mảng (Array) của Flat Config chỉ trong nháy mắt.

## Bài học rút ra
- **Cứu tinh trong các bản cập nhật "Breaking Changes":** Các framework và công cụ JavaScript liên tục thay đổi cấu trúc lõi. Việc tận dụng AI để viết lại các file cấu hình Boilerplate (như Webpack, Vite, ESLint) giúp lập trình viên không bị sa lầy vào những tài liệu config khó hiểu, từ đó dồn toàn bộ trí lực vào việc code tính năng nghiệp vụ lõi (Business Logic).

---

# Reflection - Tuần 5: Nâng cấp Giao diện Nâng cao và Xử lý Xung đột Mã nguồn

## Tổng quan quá trình
Trong giai đoạn này, chúng tôi tiến hành đại tu giao diện cho phân hệ MatchPro (Tìm kèo/sân) sang ngôn ngữ thiết kế Light Luxury. Cùng với việc áp dụng các hiệu ứng hoạt ảnh phức tạp, hệ thống cũng bắt đầu được hợp nhất (merge) với nhánh `main` chứa mã nguồn từ các thành viên khác để đảm bảo tính đồng bộ. 

## Hạn chế của AI và Khó khăn kỹ thuật
- **Kiến trúc hoạt ảnh không tương thích:** Việc AI lạm dụng GSAP Context kết hợp với vòng đời Rendering của React cho các component được render có điều kiện (như cấu trúc Tabs) đã gây ra hiện tượng phần tử bị kẹt ở trạng thái vô hình (`opacity: 0`).
- **Khủng hoảng hợp nhất mã nguồn (Merge Conflicts):** Quá trình kéo code từ nhánh `main` sinh ra nhiều xung đột chéo trên file Snapshot của Entity Framework và lỗi thiếu hụt thư viện NPM (do thành viên khác quên push cập nhật `package.json`).

## Giải pháp và Can thiệp của con người
- **Thay đổi tư duy hoạt ảnh:** Từ bỏ GSAP cho các thành phần UI tĩnh, chuyển sang sử dụng CSS Keyframes thuần túy. Cách tiếp cận này giúp trình duyệt tự động xử lý hoạt ảnh ngay khi phần tử được mount vào DOM mà không bị đứt gãy bởi React Lifecycle.
- **Xử lý xung đột dứt khoát:** Nhờ AI chẩn đoán ngay lỗi sập server Vite qua Terminal Logs và cài đặt bổ sung package `dompurify` bị thiếu. Áp dụng kỹ thuật Git phân tách (`git checkout --ours`) để bảo vệ thành quả UI vừa thiết kế khỏi bị ghi đè bởi mã cũ từ `main`.

## Bài học rút ra
- **Đơn giản hóa (KISS) trong thiết kế Frontend:** Không nên lạm dụng các công cụ nặng nề (như GSAP) cho những tác vụ đơn giản mà CSS thuần có thể xử lý hoàn hảo. Sự đơn giản luôn mang lại độ ổn định cao nhất.
- **Tầm quan trọng của Log hệ thống:** Khả năng đọc và truy xuất nguồn gốc lỗi từ log Console là kỹ năng sinh tồn thiết yếu trong môi trường làm việc nhóm, giúp xử lý lỗi sập dự án trong vài giây.
- **Quy trình Git hợp tác:** Cần thiết lập quy tắc rõ ràng cho team (như luôn phải cài package trước khi commit) và không hoảng loạn khi gặp xung đột. Khả năng cô lập vấn đề để giải quyết từng file conflict giúp tiết kiệm hàng giờ gỡ lỗi thủ công.
