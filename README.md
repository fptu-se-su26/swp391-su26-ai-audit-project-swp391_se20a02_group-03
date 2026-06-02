# SE AI Audit Project Template

## 1. Project Information

| Item | Description |
|---|---|
| Course | SWP391  |
| Class | SE20A02 |
| Semester | SU26 |
| Group | 3 |
| Topic | Pro-Sport Complex Management System |
| Repository |  |

---

## 2. Team Members

| No | Student ID | Full Name | GitHub Username | Role | Main Responsibility |
|---:|---|---|---|---|---|
| 1 | DE190408  | Hồ Võ Minh Vỹ | minhvy259 | Leader |  |
| 2 | DE190147 | Phạm Nguyễn Tiến Đạt | tiendat2277sg-wq | Member |  |
| 3 | DE190900 | Dương Khang Huy | khuy17 | Member |  |
| 4 | DE191003 |  Hồ Tấn Phát  | Phat1425 | Member |  |
| 5 | DE190130 | Nguyễn Đăng Phúc | chuotphuc311005-lgtm | Member |  |

---

## 3. Project Structure

```text
src/
  frontend/          # React + Vite (UI)
  backend/           # ASP.NET Core Web API (ProSportAPI)
docs/                # SRS, AI audit logs, changelog
.github/             # CI workflows (when added)
README.md
```

---

## 4. Required AI Audit Documents

Each group must maintain the following documents:

```text
docs/AI_AUDIT_LOG.md
docs/PROMPTS.md
docs/REFLECTION.md
docs/CHANGELOG.md
```

---

## 5. Workflow

Students must follow this workflow:

```text
Issue → Branch → Commit → Pull Request → Review → Merge
```

Direct push to the `main` branch should be avoided.

---

## 6. Branch Naming Convention

```text
feature/studentid-task-name
bugfix/studentid-error-name
docs/studentid-update-audit-log
test/studentid-test-case-name
```

Example:

```text
feature/se123456-login-page
bugfix/se123456-login-validation
docs/se123456-update-ai-audit-log
```

---

## 7. Commit Message Convention

```text
[StudentID] type: short description
```

Examples:

```text
[SE123456] feat: add login page
[SE123456] fix: fix login validation
[SE123456] docs: update AI audit log
[SE123456] test: add login test cases
```

Common types:

```text
feat, fix, docs, test, refactor, style, chore
```

---

## 8. How to Run

### 8.1. Prerequisites

| Tool | Version (tested) | Notes |
|---|---|---|
| [Node.js](https://nodejs.org/) | 18+ (LTS khuyến nghị) | Chạy frontend |
| npm | đi kèm Node.js | `npm ci` trong `src/frontend` |
| [.NET SDK](https://dotnet.microsoft.com/download) | 10.x | Backend target `net10.0` |
| SQL Server | tùy chọn | Chỉ cần khi cấu hình EF Core (sprint sau); API hiện chạy không bắt buộc DB |

Kiểm tra nhanh:

```powershell
node -v
npm -v
dotnet --version
```

### 8.2. First-time setup

Từ thư mục gốc repository:

**Frontend**

```powershell
cd src/frontend
copy .env.example .env
npm ci
```

**Backend**

```powershell
cd src/backend
# Khi cần connection string SQL Server (sprint sau), sao chép file mẫu:
# copy appsettings.Development.json.example appsettings.Development.json
# rồi chỉnh ConnectionStrings trong file vừa tạo (file local không commit secret thật).
dotnet restore
```

### 8.3. Chạy development

Mở **hai terminal** (frontend và backend).

**Terminal 1 — API**

```powershell
cd src/backend
dotnet run --launch-profile http
```

- API: `http://localhost:5047`
- OpenAPI (Development): `http://localhost:5047/openapi/v1.json`

**Terminal 2 — Web UI**

```powershell
cd src/frontend
npm run dev
```

- Ứng dụng: `http://localhost:5173` (cổng Vite mặc định; xem log terminal nếu bị chiếm cổng)

Biến `VITE_API_URL` trong `src/frontend/.env` phải trùng URL API (mặc định `http://localhost:5047`).

### 8.4. Build kiểm tra (trước khi PR)

```powershell
cd src/backend
dotnet build --configuration Release

cd ../frontend
npm run build
```

### 8.5. Xử lý lỗi thường gặp

| Triệu chứng | Cách xử lý |
|---|---|
| `dotnet` không nhận lệnh | Cài .NET SDK 10.x và mở lại terminal |
| `npm ci` báo lock file không khớp `package.json` | Chạy `npm install` một lần trong `src/frontend`, commit `package-lock.json`, sau đó dùng lại `npm ci` |
| `npm ci` lỗi khác | Xóa `src/frontend/node_modules`, chạy lại `npm ci` |
| Cổng 5047 hoặc 5173 bị chiếm | Đổi port trong `launchSettings.json` hoặc dừng process đang dùng cổng |
| Frontend không gọi được API | Kiểm tra `src/frontend/.env` và backend đang chạy |

### 8.6. Environment files (không commit secret)

| File mẫu | Sao chép thành | Mục đích |
|---|---|---|
| `src/frontend/.env.example` | `src/frontend/.env` | `VITE_API_URL` |
| `src/backend/.env.example` | (tùy chọn) biến môi trường shell | `ConnectionStrings__*` khi dùng EF |
| `src/backend/appsettings.Development.json.example` | `appsettings.Development.json` (local) | Connection string SQL Server khi có DB |

Các file `.env` và `appsettings` chứa mật khẩu thật **không** được đưa lên Git (đã cấu hình trong `.gitignore`).

---

## 9. AI Usage Rule

Students are allowed to use AI tools such as ChatGPT, Gemini, Claude, GitHub Copilot, Cursor, Antigravity, or similar tools.

However, all important AI usage must be recorded in:

```text
docs/AI_AUDIT_LOG.md
docs/PROMPTS.md
docs/CHANGELOG.md
docs/REFLECTION.md
```

Students must be able to explain, verify, and defend all submitted work.
