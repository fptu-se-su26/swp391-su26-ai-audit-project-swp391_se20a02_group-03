const fs = require('fs');
const path = require('path');

function replaceInFile(relativePath, replacements) {
  const filePath = path.join(__dirname, relativePath);
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf-8');
  for (const [search, replace] of replacements) {
    content = content.split(search).join(replace);
  }
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`${relativePath} translated successfully`);
}

const resetPassReps = [
  ["Please enter your email.", "Vui lòng nhập email của bạn."],
  ["Failed to send OTP. Email might not exist.", "Gửi OTP thất bại. Email có thể không tồn tại."],
  ["Invalid or expired OTP.", "OTP không hợp lệ hoặc đã hết hạn."],
  ["Password must be at least 8 characters.", "Mật khẩu phải có ít nhất 8 ký tự."],
  ["Password reset successfully! Please login.", "Đổi mật khẩu thành công! Vui lòng đăng nhập."],
  ["Failed to reset password.", "Đổi mật khẩu thất bại."],
  ["RECOVER\\nYOUR\\nACCESS.", "KHÔI PHỤC\\nQUYỀN\\nTRUY CẬP."],
  ["Enter the email associated with your account and we\\'ll send a verification code.", "Nhập email liên kết với tài khoản của bạn và chúng tôi sẽ gửi mã xác thực."],
  ["CHECK\\nYOUR\\nINBOX.", "KIỂM TRA\\nHỘP THƯ."],
  ["We sent a 6-digit code to your email. Enter it below to verify.", "Chúng tôi đã gửi mã 6 số đến email của bạn. Nhập mã xuống bên dưới để xác thực."],
  ["SET A\\nNEW\\nPASSWORD.", "ĐẶT\\nMẬT KHẨU\\nMỚI."],
  ["Choose a strong password to secure your Pro-Sport account.", "Chọn một mật khẩu mạnh để bảo vệ tài khoản Pro-Sport của bạn."],
  ["Step {step + 1} of 3", "Bước {step + 1} / 3"],
  ["Account recovery", "Khôi phục tài khoản"],
  ["Reset your<br />password", "Đặt lại<br />mật khẩu"],
  ["Enter verification<br />code", "Nhập mã<br />xác thực"],
  ["Create new<br />password", "Tạo mật khẩu<br />mới"],
  ["Enter the email address associated with your account.", "Nhập địa chỉ email liên kết với tài khoản của bạn."],
  ["We sent a 6-digit OTP to", "Chúng tôi đã gửi mã OTP 6 số đến"],
  ["Choose a strong password for your account.", "Chọn một mật khẩu mạnh cho tài khoản của bạn."],
  [">Email Address<", ">Địa chỉ Email<"],
  [">Enter OTP Code<", ">Nhập mã OTP<"],
  [">New Password<", ">Mật khẩu mới<"],
  [">Send OTP<", ">Gửi OTP<"],
  [">Verify OTP<", ">Xác thực OTP<"],
  [">Reset Password<", ">Đặt lại mật khẩu<"],
  ["Back to Login", "Quay lại Đăng nhập"]
];

replaceInFile('src/frontend/src/pages/ResetPasswordPage.jsx', resetPassReps);

const completeProfileReps = [
  ["Required field.", "Trường bắt buộc."],
  ["Invalid VN phone number.", "Số điện thoại VN không hợp lệ."],
  ["Profile updated successfully!", "Cập nhật hồ sơ thành công!"],
  ["Session expired. Please login again.", "Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại."],
  ["Failed to update profile. Phone number might be in use.", "Cập nhật hồ sơ thất bại. Số điện thoại có thể đã được sử dụng."],
  ["Complete Profile", "Hoàn tất hồ sơ"],
  ["Just one more step to finish setting up your account.", "Chỉ còn một bước nữa để hoàn tất thiết lập tài khoản của bạn."],
  [">Phone Number<", ">Số điện thoại<"],
  ["Complete Setup →", "Hoàn tất thiết lập →"]
];

replaceInFile('src/frontend/src/pages/CompleteProfilePage.jsx', completeProfileReps);

const roleSelectionReps = [
  ["Choose Your Role", "Chọn vai trò của bạn"],
  ["Select how you'd like to access the platform.", "Chọn cách bạn muốn truy cập vào nền tảng."],
  ["Player / Member", "Người chơi / Thành viên"],
  ["Book courts, join matches &amp; connect with other players", "Đặt sân, tham gia kèo đấu &amp; kết nối với người chơi khác"],
  ["Court Staff / Manager", "Nhân viên / Quản lý cơ sở"],
  ["Manage schedules, walk-ins &amp; POS terminal", "Quản lý lịch đặt, khách lẻ &amp; máy tính tiền POS"],
  ["Administrator", "Quản trị viên"],
  ["Full system control, analytics &amp; management portal", "Toàn quyền kiểm soát hệ thống, phân tích &amp; cổng quản lý"]
];

replaceInFile('src/frontend/src/pages/RoleSelectionPage.jsx', roleSelectionReps);
