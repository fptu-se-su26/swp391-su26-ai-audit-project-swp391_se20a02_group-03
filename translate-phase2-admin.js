const fs = require('fs');
const path = require('path');

function replaceInFile(relativePath, replacements) {
  const filePath = path.join(__dirname, relativePath);
  if (!fs.existsSync(filePath)) {
    console.log(`Skipping: ${relativePath}`);
    return;
  }
  let content = fs.readFileSync(filePath, 'utf-8');
  for (const [search, replace] of replacements) {
    content = content.split(search).join(replace);
  }
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`${relativePath} translated successfully`);
}

replaceInFile('src/frontend/src/pages/admin/AdminDashboardPage.jsx', [
  ['>Dashboard Overview<', '>Tổng quan Bảng điều khiển<'],
  ['>Real-time pulse of your sports facility operations.<', '>Nhịp đập thời gian thực của hoạt động cơ sở thể thao.<'],
  ['>Last 7 Days<', '>7 ngày qua<'],
  ['>Last 30 Days<', '>30 ngày qua<'],
  ['>This Year<', '>Năm nay<'],
  ['>Export Report<', '>Xuất Báo cáo<'],
  ['>Total Revenue<', '>Tổng Doanh thu<'],
  ['>Active Bookings<', '>Lượt Đặt sân Tích cực<'],
  ['>Live Matches<', '>Kèo đấu Đang diễn ra<'],
  ['>Equipment Out<', '>Thiết bị Cho mượn<'],
  ['>Utilized<', '>Đã sử dụng<'],
  ['>Revenue Trends<', '>Xu hướng Doanh thu<'],
  ['>Court Utilization Heatmap<', '>Bản đồ Nhiệt Sử dụng Sân<'],
  ['>Real-time Activity<', '>Hoạt động Thời gian thực<'],
  ['>System events across all facilities<', '>Các sự kiện hệ thống trên toàn bộ cơ sở<'],
  ['>Court 4 Payment Cleared<', '>Thanh toán Sân 4 Hoàn tất<'],
  ['>Booking #B-7829 by Michael T.<', '>Đơn đặt sân #B-7829 bởi Michael T.<'],
  ['>Just now<', '>Vừa xong<'],
  ['>New Member Registration<', '>Đăng ký Thành viên Mới<'],
  ['>Sarah J. joined Pro Tier.<', '>Sarah J. đã tham gia gói Pro.<'],
  ['>5 mins ago<', '>5 phút trước<'],
  ['>Match Started: Semi-Finals<', '>Kèo đấu Bắt đầu: Bán kết<'],
  ['>Center Court is now live.<', '>Sân trung tâm hiện đang hoạt động.<'],
  ['>12 mins ago<', '>12 phút trước<'],
  ['>Equipment Delay<', '>Trễ Thiết bị<'],
  ['>Racket set #14 late return flagged.<', '>Bộ vợt #14 bị đánh dấu trả trễ.<'],
  ['>28 mins ago<', '>28 phút trước<'],
  ['>Booking Cancelled<', '>Đã Hủy Đặt sân<'],
  ['>Court 2 at 18:00 freed up.<', '>Sân 2 lúc 18:00 đã trống.<'],
  ['>1 hour ago<', '>1 giờ trước<'],
  ['>View All Logs<', '>Xem Tất cả Nhật ký<']
]);

replaceInFile('src/frontend/src/pages/admin/AdminCourtsPage.jsx', [
  ['>Court Management<', '>Quản lý Sân<'],
  ['>Overview and scheduling of all facilities.<', '>Tổng quan và lịch trình của tất cả các cơ sở.<'],
  ['>Schedule Maintenance<', '>Lên lịch Bảo trì<'],
  ['>Edit Pricing<', '>Chỉnh sửa Bảng giá<'],
  ['>+ Add New Court<', '>+ Thêm Sân Mới<'],
  ['>SPORT TYPE<', '>LOẠI THỂ THAO<'],
  ['>STATUS<', '>TRẠNG THÁI<'],
  ['>Available<', '>Trống<'],
  ['>Booked<', '>Đã Đặt<'],
  ['>Maintenance<', '>Bảo trì<'],
  ['>Closed<', '>Đóng cửa<'],
  ['>AVAILABLE<', '>TRỐNG<'],
  ['>BOOKED<', '>ĐÃ ĐẶT<'],
  ['>MAINTENANCE<', '>BẢO TRÌ<'],
  ['>Main Pavilion, East Wing<', '>Gian chính, Cánh Đông<'],
  ['>Next Booking<', '>Lượt đặt Tiếp theo<'],
  ['>Quick Book<', '>Đặt Nhanh<'],
  ['>Indoor Complex, Sector 2<', '>Khu phức hợp Trong nhà, Khu 2<'],
  ['>Current Session<', '>Phiên Hiện tại<'],
  ['>Pro Member<', '>Thành viên Pro<'],
  ['>South Gardens<', '>Vườn Nam<'],
  ['>Task<', '>Nhiệm vụ<'],
  ['>Surface Reshaping<', '>Làm lại Bề mặt<'],
  ['>Est. Completion<', '>Dự kiến Hoàn thành<'],
  ['>Today, 17:00<', '>Hôm nay, 17:00<'],
  ['>Update Status<', '>Cập nhật Trạng thái<']
]);

// Run a generic global replace on all Admin files
function translateAdminGlobally() {
  const dir = path.join(__dirname, 'src/frontend/src/pages/admin');
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.jsx'));
  const dict = [
    ['>Dashboard<', '>Bảng điều khiển<'],
    ['>Courts<', '>Cơ sở/Sân<'],
    ['>Bookings<', '>Đặt sân<'],
    ['>Matches<', '>Kèo đấu<'],
    ['>Users<', '>Người dùng<'],
    ['>Settings<', '>Cài đặt<'],
    ['>Pricing<', '>Bảng giá<'],
    ['>Inventory<', '>Kho thiết bị<'],
    ['>Complaints<', '>Khiếu nại<'],
    ['>KYC Approvals<', '>Phê duyệt KYC<'],
    ['>Search...<', '>Tìm kiếm...<'],
    ['>Filter<', '>Lọc<'],
    ['>Export<', '>Xuất<'],
    ['>Actions<', '>Thao tác<'],
    ['>Edit<', '>Sửa<'],
    ['>Delete<', '>Xóa<'],
    ['>View<', '>Xem<'],
    ['>Approve<', '>Phê duyệt<'],
    ['>Reject<', '>Từ chối<']
  ];
  for(const f of files) {
    let content = fs.readFileSync(path.join(dir, f), 'utf-8');
    for (const [search, replace] of dict) {
      content = content.split(search).join(replace);
    }
    fs.writeFileSync(path.join(dir, f), content, 'utf-8');
    console.log(`Global replaced in ${f}`);
  }
}

translateAdminGlobally();
