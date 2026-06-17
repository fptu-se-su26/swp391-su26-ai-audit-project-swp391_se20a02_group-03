const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src/frontend/src/pages');

// Massive Global Dictionary
const dictionary = [
  // Common UI words
  ['>Dashboard<', '>Bảng điều khiển<'],
  ['>Overview<', '>Tổng quan<'],
  ['>Search<', '>Tìm kiếm<'],
  ['>Search...<', '>Tìm kiếm...<'],
  ['placeholder="Search', 'placeholder="Tìm kiếm'],
  ['>Filter<', '>Lọc<'],
  ['>Filters<', '>Bộ lọc<'],
  ['>Actions<', '>Thao tác<'],
  ['>Edit<', '>Sửa<'],
  ['>Delete<', '>Xóa<'],
  ['>Remove<', '>Gỡ bỏ<'],
  ['>View<', '>Xem chi tiết<'],
  ['>View All<', '>Xem tất cả<'],
  ['>Cancel<', '>Hủy<'],
  ['>Save<', '>Lưu<'],
  ['>Save Changes<', '>Lưu thay đổi<'],
  ['>Confirm<', '>Xác nhận<'],
  ['>Approve<', '>Phê duyệt<'],
  ['>Reject<', '>Từ chối<'],
  ['>Submit<', '>Gửi<'],
  ['>Update<', '>Cập nhật<'],
  ['>Refresh<', '>Làm mới<'],
  ['>Settings<', '>Cài đặt<'],
  ['>Profile<', '>Hồ sơ<'],
  ['>Wallet<', '>Ví điện tử<'],
  ['>Logout<', '>Đăng xuất<'],
  ['>Status<', '>Trạng thái<'],
  ['>Date<', '>Ngày<'],
  ['>Time<', '>Thời gian<'],
  ['>Price<', '>Giá<'],
  ['>Total<', '>Tổng cộng<'],
  ['>Description<', '>Mô tả<'],

  // Entities
  ['>Courts<', '>Cơ sở/Sân<'],
  ['>Court<', '>Sân<'],
  ['>Bookings<', '>Đặt sân<'],
  ['>Booking<', '>Đặt sân<'],
  ['>Matches<', '>Kèo đấu<'],
  ['>Match<', '>Kèo đấu<'],
  ['>Users<', '>Người dùng<'],
  ['>Players<', '>Người chơi<'],
  ['>Customers<', '>Khách hàng<'],
  ['>Staff<', '>Nhân sự<'],
  ['>Inventory<', '>Kho thiết bị<'],
  ['>Equipment<', '>Thiết bị<'],
  ['>Pricing<', '>Bảng giá<'],
  ['>Complaints<', '>Khiếu nại<'],
  ['>Disputes<', '>Tranh chấp<'],
  ['>KYC Approvals<', '>Phê duyệt KYC<'],
  ['>Tournaments<', '>Giải đấu<'],
  ['>Leaderboard<', '>Bảng xếp hạng<'],
  ['>Community<', '>Cộng đồng<'],

  // Shop & Gear
  ['>Shop<', '>Cửa hàng<'],
  ['>Cart<', '>Giỏ hàng<'],
  ['>Checkout<', '>Thanh toán<'],
  ['>Add to Cart<', '>Thêm vào giỏ<'],
  ['>Buy Now<', '>Mua ngay<'],
  ['>Rent Gear<', '>Thuê thiết bị<'],
  ['>Categories<', '>Danh mục<'],
  ['>Brands<', '>Thương hiệu<'],
  ['>Product Details<', '>Chi tiết sản phẩm<'],
  ['>Reviews<', '>Đánh giá<'],
  ['>Related Products<', '>Sản phẩm liên quan<'],
  
  // Statuses
  ['>Available<', '>Trống<'],
  ['>Booked<', '>Đã đặt<'],
  ['>Maintenance<', '>Bảo trì<'],
  ['>Closed<', '>Đóng cửa<'],
  ['>Active<', '>Hoạt động<'],
  ['>Inactive<', '>Ngừng hoạt động<'],
  ['>Pending<', '>Chờ xử lý<'],
  ['>Completed<', '>Hoàn thành<'],
  ['>Cancelled<', '>Đã hủy<'],
  ['>Approved<', '>Đã duyệt<'],
  ['>Rejected<', '>Từ chối<'],
  ['>Ongoing<', '>Đang diễn ra<'],
  ['>Upcoming<', '>Sắp tới<'],
  ['>Draft<', '>Bản nháp<'],

  // Misc
  ['>View Details<', '>Xem chi tiết<'],
  ['>Learn More<', '>Tìm hiểu thêm<'],
  ['>Get Started<', '>Bắt đầu<'],
  ['>Back<', '>Quay lại<'],
  ['>Next<', '>Tiếp tục<'],
  ['>Load More<', '>Tải thêm<'],
  ['>No data available<', '>Không có dữ liệu<'],
  ['>Are you sure?<', '>Bạn có chắc chắn không?<']
];

function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  
  for (const file of files) {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (file.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf-8');
      let changed = false;
      
      for (const [search, replace] of dictionary) {
        if (content.includes(search)) {
          content = content.split(search).join(replace);
          changed = true;
        }
      }
      
      if (changed) {
        fs.writeFileSync(fullPath, content, 'utf-8');
        console.log(`Auto-translated: ${fullPath.replace(srcDir, '')}`);
      }
    }
  }
}

processDirectory(srcDir);
console.log('Global bulk translation complete.');
