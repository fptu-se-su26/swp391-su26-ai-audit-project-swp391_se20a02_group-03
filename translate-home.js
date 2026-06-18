const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'frontend', 'src', 'pages', 'HomePage.jsx');
let content = fs.readFileSync(filePath, 'utf-8');

const replacements = [
  ["Featured Pro", "Sân Tiêu Chuẩn Pro"],
  ["View All 42 Facilities", "Xem toàn bộ 42 cơ sở"],
  ["Explore the full network", "Khám phá toàn bộ hệ thống"],
  ["Real-Time Court Grid", "Lưới sân thời gian thực"],
  ["Live availability matrix across all courts. No more phone calls or double bookings.", "Ma trận trạng thái trống trên tất cả các sân. Không còn cần gọi điện hoặc đặt trùng."],
  ["Smart Match-Making", "Ghép đội thông minh"],
  ["AI-powered player matching by skill level, schedule, and location preference.", "Tính năng ghép đội AI theo kỹ năng, lịch trình và vị trí ưa thích."],
  ["Escrow Wallet", "Ví điện tử trung gian"],
  ["Secure deposit system eliminates no-shows. Funds held until match completion.", "Hệ thống cọc an toàn loại bỏ tình trạng không đến. Tiền được giữ cho đến khi hoàn thành."],
  ["AI Chatbot Assistant", "Trợ lý Chatbot AI"],
  ["Natural language search for courts and matches. Ask, and it finds the best fit.", "Tìm kiếm sân và trận đấu bằng ngôn ngữ tự nhiên. Hỏi là tìm thấy ngay."],
  ["Create Account", "Tạo tài khoản"],
  ["Sign up in seconds. Complete E-KYC for full access to all platform features.", "Đăng ký trong vài giây. Hoàn tất e-KYC để truy cập đầy đủ tính năng."],
  ["Find & Book", "Tìm & Đặt sân"],
  ["Browse real-time court availability or join open matches in your area.", "Duyệt tìm sân trống hoặc tham gia các trận mở trong khu vực của bạn."],
  ["Play & Connect", "Chơi & Kết nối"],
  ["Check in via QR, play your match, and build your reputation score.", "Check-in bằng QR, tham gia thi đấu và xây dựng điểm uy tín của bạn."],
  ["Premium Facilities", "Cơ sở vật chất cao cấp"],
  ["Active Athletes", "Vận động viên tích cực"],
  ["Satisfaction Rate", "Tỷ lệ hài lòng"],
  ["Matches Completed", "Kèo đấu hoàn thành"],
  ["Elevating Athletic Performance", "Nâng tầm hiệu suất thể thao"],
  ["FLUID PERFORMANCE.<br />", "HIỆU SUẤT MƯỢT MÀ.<br />"],
  [">ELITE CONTROL.<", ">KIỂM SOÁT ĐỈNH CAO.<"],
  ["The premier management platform for athletes and facilities.\\n              Book courts, schedule matches, and access pro-tier gear with\\n              seamless precision.", "Nền tảng quản lý hàng đầu cho vận động viên và cơ sở.\\n              Đặt sân, lên lịch kèo đấu và mua trang bị chuyên nghiệp\\n              với độ chính xác tuyệt đối."],
  [">Start Free Journey<", ">Bắt đầu miễn phí<"],
  ["Start Free Journey", "Bắt đầu miễn phí"],
  [">Watch Demo<", ">Xem Demo<"],
  ["Watch Demo", "Xem Demo"],
  ["Trusted by Elite Facilities & Brands", "Được tin dùng bởi các Cơ sở & Thương hiệu hàng đầu"],
  ["Platform Features", "Tính năng hệ thống"],
  ["Everything You Need.<br />", "Mọi thứ bạn cần.<br />"],
  [">Nothing You Don't.<", ">Không có gì thừa thãi.<"],
  ["How It Works", "Cách hoạt động"],
  ["From Sign-Up<br />to Game Day.", "Từ lúc Đăng ký<br />đến ngày Ra sân."],
  ["Three simple steps to transform how you book courts, find opponents, and manage your sports experience.", "3 bước đơn giản để thay đổi cách bạn đặt sân, tìm đối thủ và quản lý thể thao."],
  [">Get Started<", ">Bắt đầu ngay<"],
  ["Get Started", "Bắt đầu ngay"],
  ["Ready to Play?", "Sẵn sàng ra sân?"],
  ["Join the Pro-Sport<br />Network Today.", "Tham gia mạng lưới<br />Pro-Sport ngay hôm nay."],
  ["Start booking courts, finding opponents, and elevating your game. Free to join, no commitment required.", "Bắt đầu đặt sân, tìm đối thủ và nâng tầm trận đấu của bạn. Tham gia miễn phí, không ràng buộc."],
  [">Create Free Account<", ">Tạo tài khoản miễn phí<"],
  ["Create Free Account", "Tạo tài khoản miễn phí"],
  [">Browse Courts<", ">Duyệt danh sách sân<"],
  ["Browse Courts", "Duyệt danh sách sân"]
];

for (const [search, replace] of replacements) {
  content = content.split(search).join(replace);
}

fs.writeFileSync(filePath, content, 'utf-8');
console.log('HomePage.jsx translated successfully');
