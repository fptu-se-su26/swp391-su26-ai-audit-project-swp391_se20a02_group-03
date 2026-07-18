# Project instructions

## Spec-driven workflow (spec-kit)

Khi người dùng yêu cầu **một tính năng mới** (thêm / xây dựng / làm chức năng mới;
"add/build/implement/create feature"), hãy khởi động quy trình spec-kit **trước khi
viết code**, theo thứ tự:

1. `/speckit-specify` — tạo `spec.md` từ mô tả.
2. `/speckit-plan` — kế hoạch kỹ thuật.
3. `/speckit-tasks` — sinh `tasks.md` (task theo thứ tự phụ thuộc).
4. `/speckit-implement` — thực thi.

**Bỏ qua** quy tắc này khi: đang sửa bug, refactor nhỏ, hỏi–đáp, hoặc người dùng nói
rõ muốn bỏ qua spec. Không ép buộc — nếu tính năng đã có spec thì tiếp tục từ bước phù hợp.

> Một `UserPromptSubmit` hook (`.claude/hooks/speckit-feature-nudge.ps1`) cũng tự nhắc
> quy tắc này khi phát hiện yêu cầu tính năng mới. Hook chỉ chèn nhắc nhở, không chặn.
