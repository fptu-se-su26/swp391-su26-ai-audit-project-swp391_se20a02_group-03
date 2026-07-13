## Reflection - Week 1
Trong tuần này, chúng tôi đã sử dụng Cursor để thiết lập cấu trúc thư mục ban đầu cho phần Backend .NET và Frontend React. AI đã thể hiện hiệu suất rất cao trong việc tạo ra các cấu hình dự án mẫu sạch sẽ, tách biệt và chuẩn hóa theo kiến trúc đa tầng của doanh nghiệp. Tuy nhiên, kết quả đầu ra của AI còn mang tính chất chung chung và thiếu các ranh giới quy định về cách AI sẽ hành xử trong các phiên làm việc tiếp theo khi các thành viên trong nhóm tương tác với các thư mục con cùng một lúc.

Để giải quyết hạn chế về việc mất ngữ cảnh này, chúng tôi đã xem xét các đề xuất cấu trúc của AI và đưa ra quyết định chủ động: tạo thêm file `AGENT.md` ngay tại thư mục gốc của kho chứa. File này đóng vai trò như một bộ quy tắc nghiêm ngặt về phong cách code, ranh giới framework và hướng dẫn hành vi cho AI. Sự điều chỉnh về mặt cấu trúc này đã giúp chúng tôi hiểu rằng việc thiết lập các ràng buộc từ sớm sẽ ngăn chặn AI tự ý sinh ra nợ kỹ thuật (technical debt) hoặc làm sai lệch kiến trúc mã nguồn trong các giai đoạn sau của dự án.

Bài học chính rút ra từ tuần này là mặc dù AI rất xuất sắc trong việc dựng lên bộ khung cấu trúc, lập trình viên vẫn phải chủ động xây dựng các rào chắn (`AGENT.md`) để quản lý giới hạn không gian làm việc của AI và duy trì tính nhất quán của dự án trong suốt quá trình làm việc nhóm.

---

## Reflection - Week 2
Trong tuần này, chúng tôi tập trung đồng thời vào hai mục tiêu: hoàn thiện giao diện người dùng Frontend và xây dựng đường ống tự động hóa triển khai. Chúng tôi đã tận dụng Google Anti-gravity để kiểm định các linh kiện UI và sinh mã nguồn cho các trang chức năng còn thiếu bằng Tailwind CSS. Mặc dù công cụ này giúp tăng tốc đáng kể quá trình làm prototype giao diện, kết quả đầu ra của nó vẫn có một vài sai lệch nhỏ về màu sắc và gặp khó khăn trong việc thiết lập chính xác các quy tắc trạng thái đặt sân phức tạp theo yêu cầu của tài liệu SRS, đòi hỏi chúng tôi phải tinh chỉnh thủ công cả về thẩm mỹ lẫn logic.

Song song với đó, chúng tôi sử dụng Google Gemini để xây dựng đường ống CI/CD tự động thông qua GitHub Actions. Mặc dù AI đã cung cấp thành công một bản thiết kế cấu hình YAML hoàn toàn chính xác về mặt cú pháp, nó lại thiếu ngữ cảnh không gian về cấu trúc thư mục lồng nhau của chúng tôi (`./src/frontend`) cũng như hành vi định tuyến đường dẫn thư mục con đặc thù của GitHub Pages, dẫn đến các lỗi chặn thực thi và lỗi không tìm thấy tài nguyên hệ thống trong lần chạy đầu tiên.

Để vượt qua những trở ngại kỹ thuật này, chúng tôi đã tự tay điều chỉnh lại kịch bản của AI bằng cách định nghĩa rõ ràng các ràng buộc trong `working-directory` và cấu hình thuộc tính `cache-dependency-path` hướng tới các file lock. Hơn nữa, chúng tôi đã can thiệp cấu hình thuộc tính `base` bên trong file `vite.config.js` để giải quyết triệt để lỗi tải tài nguyên. Bài học lớn nhất gặt hái được trong tuần này là AI là một công cụ tăng tốc tuyệt vời cho việc tạo mẫu và tự động hóa, nhưng sự can thiệp của con người vẫn là yếu tố quyết định để xác thực logic kinh doanh phức tạp và xử lý sự cố hạ tầng triển khai trong thế giới thực.

---

## Reflection - Week 3 (Đầu tháng 6)
Trong tuần 3, trọng tâm của nhóm là hoàn thiện các tính năng cốt lõi bao gồm Xác thực người dùng (Login/Register) và cấu trúc Cơ sở dữ liệu (Database). Chúng tôi đã dùng Cursor và Gemini để hỗ trợ tạo khung UI và API, cũng như sinh các class Entity cho EF Core. 
AI tiếp tục thể hiện thế mạnh trong việc sinh mã lặp đi lặp lại (boilerplate) như form đăng nhập hay CRUD cơ bản. Tuy nhiên, khi đối mặt với logic nghiệp vụ đặc thù (như validate dữ liệu người dùng, cấu hình quan hệ khóa ngoại giữa các bảng), đề xuất của AI thường thiếu sót hoặc chưa tối ưu. Việc rà soát và điều chỉnh thủ công của lập trình viên là bắt buộc để đảm bảo an toàn bảo mật và chuẩn hóa CSDL.

---

## Reflection - Week 4 (Giữa - Cuối tháng 6)
Tuần này đánh dấu những thách thức về mặt xử lý đồng thời và trải nghiệm người dùng, đặc biệt là với tính năng Đặt sân (Booking) và Quản lý kho. Khi xây dựng API đặt sân, AI đưa ra luồng thực thi cơ bản nhưng hoàn toàn bỏ qua kịch bản cạnh tranh (race condition) khi nhiều người dùng chọn cùng một khung giờ. Chúng tôi đã phải chủ động bổ sung Database Transaction và logic lock để khắc phục triệt để lỗ hổng này.
Ngoài ra, giai đoạn cuối tháng 6 cũng là lúc chúng tôi tiến hành refactor lại toàn bộ Frontend. Mặc dù AI hỗ trợ gom nhóm (grouping) và tối ưu hóa component rất nhanh, chúng tôi vẫn phải kiểm duyệt gắt gao để đảm bảo layout không bị vỡ. Bài học cốt lõi trong giai đoạn này là: AI có thể giúp xây dựng tính năng rất nhanh, nhưng trách nhiệm đảm bảo tính đúng đắn về nghiệp vụ, hiệu suất và bảo mật hoàn toàn thuộc về tư duy của người kỹ sư.

---

## Reflection - Week 5 (Giữa tháng 7)
Giai đoạn này nhóm tập trung tinh gọn phạm vi sản phẩm và củng cố bảo mật nghiệp vụ. Quyết định lớn nhất là loại bỏ hoàn toàn chức năng Cho thuê đồ, do quy trình vận hành của nó (đặt cọc, kiểm định, phụ thu, quản lý phiên thuê) quá phức tạp so với giá trị mang lại. Khi dùng Claude Code để thực hiện, chúng tôi đánh giá cao việc AI không xóa vội mà khảo sát toàn bộ điểm phụ thuộc trước: nó chỉ ra rằng thực thể Equipment được dùng chung cho cả bán lẫn thuê, và tồn tại tới hai hệ thống rental tách biệt (thuê tại quầy của Staff và Rental Asset của Owner). Nhờ phân tích này, việc bóc tách chỉ ảnh hưởng đúng phần cần xóa, giữ nguyên chức năng bán dụng cụ và đặt sân; toàn bộ build và unit test vẫn xanh sau khi tái tạo lại migration.

Ở nửa sau của tuần, chúng tôi yêu cầu AI rà soát backend theo từng actor. Đây là lúc giá trị của AI trong vai trò kiểm định (audit) thể hiện rõ nhất: nó dựng bản đồ phân quyền cho toàn bộ endpoint và phát hiện một lỗ hổng nghiệp vụ quan trọng mà con người dễ bỏ sót — tính năng E-KYC tuy được thiết kế nhưng chưa hề được bắt buộc ở luồng đặt sân và tham gia kèo, đồng thời giá trị trạng thái bị lệch giữa các nơi ("Verified" ở dữ liệu seed/Google so với "Approved" ở luồng Admin duyệt). Chúng tôi (Human Decision) quyết định chuẩn hóa trạng thái về một bộ hằng số thống nhất và thêm cơ chế chặn xác thực, nhưng chủ động giữ nguyên luồng walk-in tại quầy vì nhân viên đã trực tiếp xác minh khách.

Bài học tuần này: AI không chỉ mạnh ở việc sinh mã mà còn rất hữu ích khi đóng vai một người soát xét độc lập, giúp phát hiện lỗ hổng logic tiềm ẩn. Tuy nhiên, các quyết định về phạm vi (xóa gì, bắt buộc tới đâu, ảnh hưởng đến dữ liệu demo ra sao) vẫn phải do con người cân nhắc dựa trên bối cảnh nghiệp vụ thực tế.
