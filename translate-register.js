const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'frontend', 'src', 'pages', 'RegisterPage.jsx');
let content = fs.readFileSync(filePath, 'utf-8');

const replacements = [
  ["['Details', 'Preferences', 'Verify']", "['Chi tiết', 'Sở thích', 'Xác thực']"],
  ["Required field.", "Trường bắt buộc."],
  ["No numbers or special chars allowed.", "Không chứa số hoặc ký tự đặc biệt."],
  ["Invalid VN phone number.", "Số điện thoại VN không hợp lệ."],
  ["Please enter a valid email format.", "Vui lòng nhập đúng định dạng email."],
  ["Min 8 chars, at least 1 number.", "Tối thiểu 8 ký tự, ít nhất 1 số."],
  ["Passwords do not match.", "Mật khẩu không khớp."],
  ["You must agree to the Terms & Conditions.", "Bạn phải đồng ý với Điều khoản & Điều kiện."],
  ["Registration failed. Email might already exist.", "Đăng ký thất bại. Email có thể đã tồn tại."],
  ["Invalid or expired OTP.", "OTP không hợp lệ hoặc đã hết hạn."],
  ["Please enter the 6-digit OTP.", "Vui lòng nhập 6 số OTP."],
  ["A new OTP has been sent to your email.", "Một OTP mới đã được gửi đến email của bạn."],
  ["Failed to resend OTP.", "Gửi lại OTP thất bại."],
  ["Google Login failed. Token not received.", "Đăng nhập Google thất bại. Không nhận được token."],
  ["Google Login failed.", "Đăng nhập Google thất bại."],
  ["Account created successfully! Please login.", "Tạo tài khoản thành công! Vui lòng đăng nhập."],
  ["JOIN THE\\nELITE\\nNETWORK.", "THAM GIA\\nMẠNG LƯỚI\\nĐỈNH CAO."],
  ["Create your account and start booking courts, connecting with players, and more.", "Tạo tài khoản và bắt đầu đặt sân, kết nối với người chơi và hơn thế nữa."],
  ["TELL US\\nWHAT YOU\\nPLAY.", "BẠN CHƠI\\nMÔN THỂ THAO\\nNÀO."],
  ["Help us personalize your experience with your sport preferences.", "Giúp chúng tôi cá nhân hóa trải nghiệm theo sở thích thể thao của bạn."],
  ["ALMOST\\nTHERE.", "SẮP\\nHOÀN THÀNH."],
  ["Verify your email to activate your Pro-Sport account.", "Xác thực email để kích hoạt tài khoản Pro-Sport của bạn."],
  ["Step {step + 1} of {steps.length}", "Bước {step + 1} / {steps.length}"],
  ["Create account</p>", "Tạo tài khoản</p>"], // text-accent Create account
  ["Create Account", "Tạo tài khoản"], // button
  ["Get started with<br />Pro-Sport", "Bắt đầu với<br />Pro-Sport"],
  ["Choose your<br />sports", "Chọn môn thể thao<br />của bạn"],
  ["Verify your<br />email", "Xác thực email<br />của bạn"],
  ["Fill in your details to create your athlete account.", "Điền thông tin để tạo tài khoản vận động viên của bạn."],
  ["Select the sports you play to personalize your feed.", "Chọn các môn thể thao bạn chơi để cá nhân hóa bảng tin."],
  ["We sent a 6-digit code to ", "Chúng tôi đã gửi mã 6 số đến "],
  ["This email is already registered.", "Email này đã được đăng ký."],
  ["Login Now", "Đăng nhập ngay"],
  ["Forgot Password?", "Quên mật khẩu?"],
  [">Full Name<", ">Họ và Tên<"],
  ["placeholder=\"John Doe\"", "placeholder=\"Nguyễn Văn A\""],
  [">Phone Number<", ">Số điện thoại<"],
  [">Email Address<", ">Địa chỉ Email<"],
  ["placeholder=\"john.doe@example.com\"", "placeholder=\"nguyenvana@example.com\""],
  [">Password<", ">Mật khẩu<"],
  [">Confirm Password<", ">Xác nhận mật khẩu<"],
  ["I agree to the <Link", "Tôi đồng ý với <Link"],
  [">Terms &amp; Conditions<", ">Điều khoản &amp; Điều kiện<"],
  [" and our <Link", " và <Link"],
  [">Privacy Policy<", ">Chính sách bảo mật<"],
  ["Select your sport preferences", "Chọn sở thích thể thao của bạn"],
  ["Badminton courts & matches", "Sân cầu lông & các trận đấu"],
  ["Pickleball courts & community", "Sân Pickleball & cộng đồng"],
  ["Enter the verification code sent to", "Nhập mã xác thực đã được gửi đến"],
  [">Continue<", ">Tiếp tục<"],
  [">Skip for now<", ">Bỏ qua lúc này<"],
  ["Didn't receive the code?", "Không nhận được mã?"],
  ["Resend OTP", "Gửi lại OTP"],
  [">or<", ">hoặc<"],
  ["Already have an account?", "Đã có tài khoản?"],
  [">Sign in<", ">Đăng nhập<"]
];

for (const [search, replace] of replacements) {
  content = content.split(search).join(replace);
}

fs.writeFileSync(filePath, content, 'utf-8');
console.log('RegisterPage.jsx translated successfully');
