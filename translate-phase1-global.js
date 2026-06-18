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

// 1. Navbar
replaceInFile('src/frontend/src/components/Navbar.jsx', [
  ["label: 'Home'", "label: 'Trang chủ'"],
  ["label: 'Courts'", "label: 'Cơ sở/Sân'"],
  ["label: 'Matches'", "label: 'Kèo đấu'"],
  ["label: 'Gear'", "label: 'Cửa hàng Gear'"],
  ["label: 'About'", "label: 'Giới thiệu'"],
  ["label: 'Contact'", "label: 'Liên hệ'"],
  [">Logout<", ">Đăng xuất<"],
  [">Login<", ">Đăng nhập<"],
  [">Join Pro<", ">Tham gia Pro<"]
]);

// 2. Footer
replaceInFile('src/frontend/src/components/Footer.jsx', [
  ['Elevating athletic achievement<br />\\n            through precision engineering and<br />\\n            border-defying settings.', 'Nâng tầm thành tích thể thao<br />\\n            thông qua công nghệ chuẩn xác và<br />\\n            hệ thống vượt mọi giới hạn.'],
  ['>PLATFORM<', '>NỀN TẢNG<'],
  ['>Discover<', '>Khám phá<'],
  ['>Brand Mission<', '>Sứ mệnh thương hiệu<'],
  ['>Facilities<', '>Cơ sở vật chất<'],
  ['>LEGAL<', '>PHÁP LÝ<'],
  ['>Privacy Policy<', '>Chính sách bảo mật<'],
  ['>Terms of Service<', '>Điều khoản dịch vụ<'],
  ['>Sitemap<', '>Sơ đồ trang<'],
  ['>CONNECT<', '>KẾT NỐI<'],
  ['placeholder="Email"', 'placeholder="Địa chỉ Email"'],
  ['© 2024 PRO-SPORT COMPLEX. Engineered for Elite Performance.', '© 2024 PRO-SPORT COMPLEX. Được thiết kế cho Hiệu suất Tinh hoa.'],
  ['>About Us<', '>Về chúng tôi<'],
  ['>Terms<', '>Điều khoản<'],
  ['>Privacy<', '>Bảo mật<'],
  ['>Support<', '>Hỗ trợ<']
]);

// 3. AboutPage
replaceInFile('src/frontend/src/pages/AboutPage.jsx', [
  ["title: 'Innovation'", "title: 'Đổi mới'"],
  ["desc: 'Pioneering smart court technology and data-driven training to push the boundaries of athletic performance.'", "desc: 'Tiên phong trong công nghệ sân thông minh và huấn luyện dựa trên dữ liệu để đẩy lùi giới hạn hiệu suất thể thao.'"],
  ["statLabel: 'Patents Filed'", "statLabel: 'Bằng sáng chế'"],
  ["title: 'Community'", "title: 'Cộng đồng'"],
  ["desc: 'Building a thriving ecosystem where athletes, coaches and professionals connect, compete and grow together.'", "desc: 'Xây dựng một hệ sinh thái phát triển, nơi các vận động viên, huấn luyện viên và chuyên gia kết nối, cạnh tranh và cùng phát triển.'"],
  ["statLabel: 'Active Athletes'", "statLabel: 'Vận động viên'"],
  ["title: 'Performance'", "title: 'Hiệu suất'"],
  ["desc: 'Delivering measurable results through premium facilities, advanced analytics and personalized training plans.'", "desc: 'Mang lại kết quả đo lường được thông qua cơ sở vật chất cao cấp, phân tích chuyên sâu và kế hoạch huấn luyện cá nhân hóa.'"],
  ["statLabel: 'Sessions Booked'", "statLabel: 'Lượt đặt sân'"],
  ["title: 'Founded in Ho Chi Minh City'", "title: 'Thành lập tại TP.Hồ Chí Minh'"],
  ["desc: 'Started with a vision to digitize sports facility management across Southeast Asia.'", "desc: 'Bắt đầu với tầm nhìn số hóa quản lý cơ sở thể thao trên toàn Đông Nam Á.'"],
  ["title: 'First 50 Facilities Onboarded'", "title: '50 Cơ sở đầu tiên'"],
  ["desc: 'Partnered with tennis clubs, badminton halls and multi-sport complexes in Vietnam.'", "desc: 'Hợp tác với các câu lạc bộ tennis, sân cầu lông và khu liên hợp thể thao tại Việt Nam.'"],
  ["title: 'MatchPro Launch'", "title: 'Ra mắt MatchPro'"],
  ["desc: 'Launched our AI-powered matchmaking system, connecting athletes by skill level and location.'", "desc: 'Ra mắt hệ thống ghép kèo tích hợp AI, kết nối vận động viên theo kỹ năng và khu vực.'"],
  ["title: 'Series A Funding'", "title: 'Gọi vốn Series A'"],
  ["desc: 'Secured $5M in funding to expand our smart court technology and mobile platform.'", "desc: 'Gọi vốn 5 triệu USD để mở rộng công nghệ sân thông minh và nền tảng di động.'"],
  ["title: 'Regional Expansion'", "title: 'Mở rộng khu vực'"],
  ["desc: 'Expanded operations to Thailand, Singapore and Philippines with 200+ partner venues.'", "desc: 'Mở rộng hoạt động sang Thái Lan, Singapore và Philippines với hơn 200 cơ sở đối tác.'"],
  ["title: 'Pro-Sport 2.0'", "title: 'Pro-Sport 2.0'"],
  ["desc: 'Launched next-gen platform with real-time analytics, gear rental and tournament management.'", "desc: 'Ra mắt nền tảng thế hệ mới với phân tích theo thời gian thực, cho thuê thiết bị và quản lý giải đấu.'"],
  ["role: 'CEO & Co-Founder'", "role: 'CEO & Đồng sáng lập'"],
  ["quote: 'Technology should empower athletes, not complicate their game.'", "quote: 'Công nghệ nên tiếp sức cho vận động viên, chứ không làm phức tạp hóa cuộc chơi của họ.'"],
  ["quote: 'We build systems that think like coaches and perform like champions.'", "quote: 'Chúng tôi xây dựng hệ thống tư duy như huấn luyện viên và biểu diễn như nhà vô địch.'"],
  ["role: 'Head of Product'", "role: 'Giám đốc Sản phẩm'"],
  ["quote: 'Every feature we ship is tested on the court, not just in the lab.'", "quote: 'Mọi tính năng đều được kiểm thử trên sân thực tế, không chỉ trong phòng thí nghiệm.'"],
  ["role: 'VP of Operations'", "role: 'Phó giám đốc Vận hành'"],
  ["quote: 'Our venues set the standard for what modern sports facilities should be.'", "quote: 'Cơ sở của chúng tôi thiết lập tiêu chuẩn cho các khu thể thao hiện đại.'"],
  ["label: 'World-Class Venues'", "label: 'Cơ sở vật chất Đẳng cấp'"],
  ["label: 'Data-Driven Excellence'", "label: 'Sự xuất sắc từ Dữ liệu'"],
  ["label: 'Global Tournaments'", "label: 'Giải đấu Toàn cầu'"],
  ["label: 'Partner Venues'", "label: 'Cơ sở đối tác'"],
  ["label: 'Matches Played'", "label: 'Trận đấu diễn ra'"],
  ["label: 'Cities Covered'", "label: 'Thành phố phủ sóng'"],
  [">About PRO-SPORT<", ">Về PRO-SPORT<"],
  ["Redefining the Future of<br />Athletic Performance.", "Định hình lại Tương lai<br />Hiệu suất Thể thao."],
  ["We bridge the gap between human potential and technological precision,", "Chúng tôi thu hẹp khoảng cách giữa tiềm năng con người và độ chính xác của công nghệ,"],
  ["engineering environments where elite athletes are forged.", "xây dựng môi trường nơi các vận động viên tinh hoa được rèn giũa."],
  [">Explore Facilities →<", ">Khám phá Cơ sở →<"],
  [">Contact Us<", ">Liên hệ chúng tôi<"],
  [">Our Mission<", ">Sứ mệnh<"],
  ["Empowering Athletes Through<br />Technology & Premium Facilities", "Tiếp sức Vận động viên qua<br />Công nghệ & Cơ sở vật chất Cao cấp"],
  ["PRO-SPORT was born from a simple belief", "PRO-SPORT ra đời từ một niềm tin đơn giản: mọi vận động viên đều xứng đáng tiếp cận cơ sở vật chất đẳng cấp thế giới và các công cụ thông minh giúp họ đạt hiệu suất đỉnh cao. Chúng tôi kết hợp công nghệ tiên tiến với các địa điểm cao cấp để tạo ra một hệ sinh thái nơi vận động viên mọi cấp độ có thể rèn luyện, thi đấu và phát triển."],
  ["every athlete deserves access to world-class facilities and intelligent tools that help them reach their peak performance. We combine cutting-edge technology with premium venues to create an ecosystem where athletes of all levels can train, compete and grow.", ""],
  ["Our platform connects", "Nền tảng của chúng tôi kết nối"],
  ["venues", "cơ sở"],
  ["athletes", "vận động viên"],
  ["and", "và"],
  ["elite coaching programs", "các chương trình huấn luyện chuyên nghiệp"],
  ["into one seamless experience — from booking a court to finding your perfect match.", "vào một trải nghiệm liền mạch — từ việc đặt sân đến tìm kèo đấu hoàn hảo."],
  [">Smart Booking System<", ">Hệ thống Đặt sân Thông minh<"],
  [">AI Match-Making<", ">Ghép kèo AI<"],
  [">Real-Time Analytics<", ">Phân tích Thời gian thực<"],
  [">Years of Excellence in Sports Technology<", ">Năm xuất sắc trong Công nghệ Thể thao<"],
  [">What We Do<", ">Chúng tôi làm gì<"],
  [">Our Journey<", ">Hành trình<"],
  [">Why Choose Us<", ">Tại sao chọn chúng tôi<"],
  [">Core Principles<", ">Nguyên tắc Cốt lõi<"],
  [">The foundations that drive our commitment to athletic excellence.<", ">Nền tảng thúc đẩy cam kết của chúng tôi đối với sự xuất sắc trong thể thao.<"],
  [">Our Story<", ">Câu chuyện<"],
  [">From Vision to Reality<", ">Từ Tầm nhìn đến Hiện thực<"],
  [">Key milestones in our journey to transform sports management.<", ">Những cột mốc quan trọng trong hành trình thay đổi quản lý thể thao.<"],
  [">Our People<", ">Con người<"],
  [">Leadership Team<", ">Ban Lãnh đạo<"],
  [">The visionaries driving PRO-SPORT's mission forward.<", ">Những người có tầm nhìn thúc đẩy sứ mệnh của PRO-SPORT.<"],
  [">Trusted Partners & Brands<", ">Đối tác & Thương hiệu Tin cậy<"],
  [">Worldwide Presence<", ">Hiện diện Toàn cầu<"],
  [">Global Operations<", ">Hoạt động Toàn cầu<"],
  ["Operating across 14 cities, delivering consistent, elite-tier athletic infrastructure throughout Southeast Asia and beyond.", "Hoạt động tại 14 thành phố, mang đến cơ sở hạ tầng thể thao nhất quán, đẳng cấp hàng đầu trên toàn Đông Nam Á và vươn xa hơn nữa."],
  [">NETWORK ACTIVE<", ">MẠNG LƯỚI ĐANG HOẠT ĐỘNG<"],
  [">Ready to Elevate Your Game?<", ">Sẵn sàng Nâng tầm Cuộc chơi?<"],
  ["Join 500,000+ athletes who trust PRO-SPORT for their training, matches and competitive journey.", "Tham gia cùng hơn 500.000 vận động viên tin tưởng PRO-SPORT trong hành trình tập luyện, thi đấu và cạnh tranh của họ."],
  [">Start Free Journey →<", ">Bắt đầu Hành trình Miễn phí →<"],
  [">Talk to Sales<", ">Liên hệ Kinh doanh<"]
]);

// 4. ContactPage
replaceInFile('src/frontend/src/pages/ContactPage.jsx', [
  ["How do I book a court?", "Làm thế nào để đặt sân?"],
  ["Use our digital platform or mobile app to view real-time availability and secure your court instantly. Bookings can be made up to 7 days in advance.", "Sử dụng nền tảng web hoặc ứng dụng di động của chúng tôi để xem lịch trống theo thời gian thực và đặt sân ngay lập tức. Có thể đặt trước tối đa 7 ngày."],
  ["What is the cancellation policy?", "Chính sách hủy sân là gì?"],
  ["Cancellations can be made 24 hours prior to your booking for a full refund. Late cancellations may incur a 20% fee.", "Bạn có thể hủy sân trước 24 giờ để được hoàn tiền toàn bộ. Hủy trễ có thể phải chịu phí 20%."],
  ["Are training sessions available?", "Có các khóa huấn luyện không?"],
  ["Yes, we have a roster of elite coaches available for private sessions. Enquire via the form above or through the MatchPro section of the app.", "Có, chúng tôi có danh sách các huấn luyện viên chuyên nghiệp cho các khóa đào tạo cá nhân. Vui lòng liên hệ qua form hoặc phần MatchPro trên ứng dụng."],
  ["label: 'Hotline'", "label: 'Đường dây nóng'"],
  ["sub: 'Mon – Fri, 8am – 8pm'", "sub: 'T2 – T6, 8h – 20h'"],
  ["sub: 'Reply within 2 hours'", "sub: 'Phản hồi trong 2 giờ'"],
  ["label: 'Address'", "label: 'Địa chỉ'"],
  ["sub: 'San Francisco, CA 94110'", "sub: 'Thành phố Hồ Chí Minh'"],
  ["value: '66 Athletic Plaza, Sport Bay'", "value: 'Khu thể thao phức hợp, Phường 22'"],
  [">Connect With Excellence<", ">Kết nối cùng sự Hoàn hảo<"],
  ["Whether you're booking a court or joining a league, our team is here to ensure your performance meets your goals.", "Dù bạn đang đặt sân hay tham gia giải đấu, đội ngũ của chúng tôi luôn ở đây để đảm bảo trải nghiệm của bạn đạt được mục tiêu tốt nhất."],
  [">Get in Touch<", ">Liên hệ với chúng tôi<"],
  [">Message Sent!<", ">Đã gửi tin nhắn!<"],
  ["Our team will get back to you within 2 hours.", "Đội ngũ của chúng tôi sẽ phản hồi lại trong vòng 2 giờ."],
  [">Send another →<", ">Gửi tin khác →<"],
  [">Name<", ">Họ và tên<"],
  [">Email<", ">Email<"],
  [">Subject<", ">Chủ đề<"],
  [">General Inquiry<", ">Hỏi đáp chung<"],
  [">Court Booking<", ">Đặt sân<"],
  [">Technical Support<", ">Hỗ trợ kỹ thuật<"],
  [">Partnership<", ">Hợp tác<"],
  [">Message<", ">Nội dung<"],
  ['placeholder="How can we help you today?"', 'placeholder="Chúng tôi có thể giúp gì cho bạn hôm nay?"'],
  [">Send Message<", ">Gửi tin nhắn<"],
  [">Contact Details<", ">Thông tin liên hệ<"],
  [">Follow Our Performance<", ">Theo dõi chúng tôi<"],
  [">Live Support<", ">Hỗ trợ trực tuyến<"],
  ["Our agents available 24/7 for premium coaches.", "Nhân viên hỗ trợ 24/7 cho các HLV cao cấp."],
  [">Elite Facility<", ">Cơ sở vật chất hiện đại<"],
  ["Centrally located in the heart of the Sport bay for easy access.", "Tọa lạc tại vị trí trung tâm thể thao dễ dàng di chuyển."],
  [">Get Directions →<", ">Xem bản đồ →<"],
  [">Quick FAQ<", ">Câu hỏi thường gặp<"],
  [">View Full FAQ →<", ">Xem thêm FAQ →<"]
]);

// 5. BrandMissionPage
replaceInFile('src/frontend/src/pages/platform/BrandMissionPage.jsx', [
  [">Our Brand Mission<", ">Sứ mệnh Thương hiệu<"],
  ["Empowering the World<br />to Play More.", "Truyền cảm hứng để Thế giới<br />chơi thể thao nhiều hơn."],
  ["We are building the digital infrastructure for the physical world of sports. Connecting athletes, venues, and communities globally.", "Chúng tôi đang xây dựng hạ tầng kỹ thuật số cho thế giới thể thao thực tế. Kết nối vận động viên, cơ sở và cộng đồng trên toàn cầu."],
  ["\"We envision a world where finding a court, joining a game, or renting gear is as easy as ordering a coffee. PRO-SPORT is the bridge between human ambition and athletic realization.\"", "\"Chúng tôi hướng đến một thế giới nơi việc tìm sân, tham gia kèo đấu hay thuê đồ dễ dàng như việc gọi một ly cà phê. PRO-SPORT chính là nhịp cầu nối khát vọng con người với thành tích thể thao.\""],
  [">The PRO-SPORT Founding Team<", ">Đội ngũ sáng lập PRO-SPORT<"],
  [">What Drives Us<", ">Động lực của chúng tôi<"],
  ["The fundamental principles that guide every feature we build and every partnership we forge.", "Những nguyên tắc cốt lõi dẫn dắt mọi tính năng chúng tôi xây dựng và mọi mối quan hệ hợp tác."],
  ["title: 'Relentless Innovation'", "title: 'Đổi mới không ngừng'"],
  ["desc: 'We constantly challenge the status quo, utilizing AI and advanced data analytics to provide the most precise match-making and facility management systems in the industry.'", "desc: 'Chúng tôi liên tục thách thức hiện tại, ứng dụng AI và phân tích dữ liệu nâng cao để cung cấp hệ thống ghép kèo và quản lý cơ sở vật chất chính xác nhất trong ngành.'"],
  ["title: 'Inclusivity in Sports'", "title: 'Thể thao cho mọi người'"],
  ["desc: 'We believe sports are for everyone. Our platform breaks down barriers, making it easy for beginners and professionals alike to find courts, gear, and opponents.'", "desc: 'Chúng tôi tin rằng thể thao là dành cho tất cả. Nền tảng của chúng tôi phá vỡ mọi rào cản, giúp cả người mới lẫn dân chuyên dễ dàng tìm sân, thuê đồ và đối thủ.'"],
  ["title: 'Peak Performance'", "title: 'Hiệu suất đỉnh cao'"],
  ["desc: 'We settle for nothing less than excellence. From the quality of our partner venues to the speed of our app, performance is at the heart of everything we do.'", "desc: 'Chúng tôi không chấp nhận gì ngoài sự xuất sắc. Từ chất lượng của các cơ sở đối tác đến tốc độ của ứng dụng, hiệu suất là trọng tâm trong mọi việc chúng tôi làm.'"],
  [">Building a Community of Champions<", ">Xây dựng một Cộng đồng Nhà vô địch<"],
  ["Our mission extends beyond software. We are actively fostering a global community of sports enthusiasts. Through our platform, we enable local tournaments, sponsor grassroots athletes, and provide tools for independent coaches to thrive.", "Sứ mệnh của chúng tôi vượt xa khỏi ranh giới phần mềm. Chúng tôi tích cực bồi dưỡng một cộng đồng những người đam mê thể thao toàn cầu. Thông qua nền tảng này, chúng tôi tạo điều kiện cho các giải đấu địa phương, tài trợ các vận động viên phong trào, và cung cấp công cụ cho các huấn luyện viên độc lập phát triển."],
  ["When you use PRO-SPORT, you're not just booking a court—you're joining a movement dedicated to health, competition, and shared passion.", "Khi bạn sử dụng PRO-SPORT, bạn không chỉ đang đặt sân—bạn đang tham gia vào một phong trào cống hiến vì sức khỏe, sự cạnh tranh và đam mê chung."],
  [">Join Our Mission →<", ">Tham gia cùng chúng tôi →<"]
]);

// 6. NotFoundPage
replaceInFile('src/frontend/src/pages/status/NotFoundPage.jsx', [
  ["Page Not Found. Looks like you've wandered off the court.", "Không tìm thấy trang. Có vẻ như bạn đã đi lạc khỏi sân đấu."],
  ["The strategic play you are looking for doesn't exist or has been moved to a different playbook. Let's get you back in the game.", "Trang bạn đang tìm kiếm không tồn tại hoặc đã bị gỡ bỏ. Hãy để chúng tôi đưa bạn trở lại trận đấu."],
  [">Back to Dashboard<", ">Về Bảng điều khiển<"],
  [">Search Facility<", ">Tìm kiếm Cơ sở<"]
]);

// 7. MaintenancePage
replaceInFile('src/frontend/src/pages/status/MaintenancePage.jsx', [
  [">System Tune-up<", ">Bảo trì Hệ thống<"],
  [">HOURS<", ">GIỜ<"],
  [">MINS<", ">PHÚT<"],
  [">SECS<", ">GIÂY<"],
  ["We're upgrading our performance.", "Chúng tôi đang nâng cấp hiệu suất."],
  ["PRO-SPORT is currently undergoing scheduled maintenance to bring you new elite features. Our team is actively fine-tuning the engine.", "PRO-SPORT hiện đang trong quá trình bảo trì định kỳ để mang đến cho bạn những tính năng tinh hoa mới. Đội ngũ của chúng tôi đang tích cực tinh chỉnh hệ thống."],
  ['placeholder="Enter your email to be notified"', 'placeholder="Nhập email để nhận thông báo"'],
  [">Notify Me<", ">Thông báo cho tôi<"],
  [">Follow updates on our channels:<", ">Theo dõi cập nhật trên các kênh của chúng tôi:<"]
]);
