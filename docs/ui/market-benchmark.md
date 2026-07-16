# Market Benchmark & UI Inventory

## Bảng đánh giá ProSport so với các hệ thống phổ biến

| Tiêu chí (0-5) | ProSport (Hiện tại) | Playtomic (Tham chiếu) | Stripe Dashboard | Bằng chứng / Nhận xét |
| :--- | :---: | :---: | :---: | :--- |
| **Khám phá sân (Discoverability)** | 3.5 | 5.0 | - | Sân hiển thị dạng lưới rõ ràng ở `/apex/booking`, nhưng thiêú cơ chế gợi ý nhanh vị trí gần nhất trên trang chủ (ApexHomePage mới chỉ liệt kê lịch). |
| **Booking Clarity** | 3.0 | 4.5 | - | Quy trình 3 bước ở `/apex/booking` khá chuẩn, nhưng UI "Chọn giờ" trên desktop có phần rời rạc so với "Tóm tắt" do chênh lệch chiều cao. |
| **Số bước hoàn thành nhiệm vụ** | 4.0 | 4.5 | - | Mất 3-4 click để đặt sân thành công (Khá tốt). |
| **Khả dụng sân (Availability Clarity)** | 3.5 | 5.0 | - | Khung giờ xanh/xám phân tách khá rõ, nhưng thiếu context về khung giờ khuyến mãi hay peak hour. |
| **Schedule usability (Owner)** | 4.0 | 4.5 | - | OwnerCalendar mới refactor đã khắc phục tình trạng khó quét lịch, hiển thị phân tách theo ngày giờ trực quan. |
| **Data density (Admin)** | 3.0 | - | 5.0 | Admin table ở `/admin/users` hiện hơi quá lớn (padding nhiều) so với tiêu chuẩn màn hình quản trị data-heavy (Stripe). |
| **Feedback / Status Visibility** | 4.0 | 4.0 | 5.0 | ProSport dùng Toaster và Status Badge tốt, tuy nhiên một số loading state còn nhấp nháy. |
| **Role-based Clarity** | 4.0 | 4.5 | 5.0 | Đã tách biệt User, Owner, Admin qua Layout và Route Guards. |

## Các mô hình tham chiếu

### 1. Playtomic (User Booking App)
- **Điểm mạnh:** UI tập trung vào Mobile-first, card booking to rõ, focus mạnh vào việc match team và book court nhanh.
- **Áp dụng cho ProSport:** Hệ thống thẻ sân (Court Card) và quy trình checkout rút gọn.

### 2. Stripe Dashboard (Admin/Finance UX)
- **Điểm mạnh:** Compact density, typography cực tốt (Inter), biểu đồ không lòe loẹt, empty states minh họa rõ ràng.
- **Áp dụng cho ProSport:** Layout của `/admin` và `/owner/finance`, sử dụng font Inter với bảng màu xám/navy để tối đa hoá sự chuyên nghiệp.

### 3. Shopify Admin
- **Điểm mạnh:** Tính nhất quán cao trong form và list, các action quan trọng (Save, Delete) có vị trí nhất quán.
- **Áp dụng cho ProSport:** Hệ thống Page Header kèm actions, và form cấu hình ở `/owner/settings`.
