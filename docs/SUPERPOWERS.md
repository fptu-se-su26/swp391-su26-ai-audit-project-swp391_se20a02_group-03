# Superpowers — Tích hợp ProSport

Dự án đã tích hợp [Superpowers](https://github.com/obra/superpowers) — framework kỹ năng (skills) giúp AI agent làm việc có quy trình: brainstorm → plan → TDD → review.

## Cấu trúc trong repo

```
.superpowers/          # Git submodule → github.com/obra/superpowers
.cursor-plugin/        # Plugin Cursor cấp project (trỏ vào .superpowers)
docs/SUPERPOWERS.md    # Tài liệu này
```

## Cài đặt cho thành viên nhóm

### Đã tự động trong repo (khuyến nghị)

Project đã cấu hình sẵn — **không bắt buộc** `/add-plugin` nếu hooks hoạt động:

| File | Tác dụng |
|------|----------|
| `.cursor/hooks.json` | Inject `using-superpowers` mỗi session Agent |
| `.cursor/rules/superpowers.mdc` | Rule luôn bật — agent phải dùng skills |
| `.cursor/skills/` | Junction tới 14 skills Superpowers |
| `AGENTS.md` | Hướng dẫn agent ở root project |

**Sau khi clone, chạy một lần:**

```powershell
git submodule update --init .superpowers
powershell -ExecutionPolicy Bypass -File scripts/setup-superpowers.ps1
```

**Sau đó:** mở chat **Agent mới** hoặc **restart Cursor**.

Kiểm tra: Cursor → Settings → **Hooks** — phải thấy `sessionStart` → `superpowers-session-start.cmd`.

### Cách bổ sung — Plugin marketplace


1. Clone repo **kèm submodule**:
   ```bash
   git clone --recurse-submodules https://github.com/fptu-se-su26/swp391-su26-ai-audit-project-swp391_se20a02_group-03
   ```
   Nếu đã clone trước đó:
   ```bash
   git submodule update --init --recursive
   ```

2. Mở project trong **Cursor**.

3. Trong Agent chat, cài plugin từ thư mục project:
   ```text
   /add-plugin .
   ```
   Hoặc tìm **Superpowers (ProSport)** trong Plugin Marketplace nếu đã publish.

4. Mở chat Agent mới — hook `sessionStart` sẽ inject skill `using-superpowers`.

### Cách 2 — Marketplace chính thức

Trong Cursor Agent chat:
```text
/add-plugin superpowers
```
(Cài global, không gắn submodule — phù hợp nếu không cần pin version trong repo.)

## Quy trình làm việc mặc định

| Skill | Khi nào dùng |
|-------|----------------|
| `brainstorming` | Trước khi code feature mới |
| `using-git-worktrees` | Sau khi duyệt design, tạo nhánh/worktree riêng |
| `writing-plans` | Chia task nhỏ, có file path + bước verify |
| `test-driven-development` | RED → GREEN → REFACTOR |
| `subagent-driven-development` | Thực thi plan với subagent + review |
| `systematic-debugging` | Debug có hệ thống |
| `requesting-code-review` | Review giữa các task |

Chi tiết: [.superpowers/README.md](../.superpowers/README.md)

## Cập nhật Superpowers

```bash
cd .superpowers
git fetch origin
git checkout main
git pull
cd ..
git add .superpowers
git commit -m "chore: bump superpowers submodule"
```

## Cùng tồn tại với `.agent/` (ECC)

- **Superpowers** — quy trình dev chung (TDD, plan, debug).
- **`.agent/`** — plugin Everything Claude Code (reviewer, build-resolver, v.v.).

Ưu tiên: chỉ dẫn người dùng trong `AGENTS.md` / rules > Superpowers skills > prompt mặc định.

## ProSport — ghi chú dự án

- Backend: `src/backend/` (.NET 8, EF Core)
- Frontend: `src/frontend/` (React + Vite)
- Chạy test: `dotnet test src/backend/ProSport.sln`
- Build FE: `npm run build` (trong `src/frontend`)

Khi agent dùng skill `writing-plans`, luôn tham chiếu đúng cấu trúc thư mục trên.

## Tắt telemetry (tùy chọn)

Superpowers có thể gửi version qua logo visual companion. Tắt bằng:
```bash
set SUPERPOWERS_DISABLE_TELEMETRY=1
```
