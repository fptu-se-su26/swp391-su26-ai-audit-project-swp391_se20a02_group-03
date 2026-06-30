# ProSport — Agent Instructions

## Superpowers (bat san)

Project hooks inject `using-superpowers` moi session Agent. Ap dung skills trong `.cursor/skills/` hoac `.superpowers/skills/`.

- Feature / refactor: `brainstorming` → `writing-plans` → TDD
- Bug: `systematic-debugging`
- **Mandatory planning gate:** `.cursor/rules/mandatory-planning.mdc` — no code until spec + approved plan exist
- Docs: `docs/SUPERPOWERS.md`

## Stack

- Backend: `src/backend/` — ASP.NET Core 8, EF Core, SQL Server
- Frontend: `src/frontend/` — React, Vite, Tailwind
- Test: `dotnet test src/backend/ProSport.sln`
- Build FE: `npm run build` (trong `src/frontend`)

## UI

Xem `.agents/AGENTS.md` cho quy tac thiet ke frontend.
