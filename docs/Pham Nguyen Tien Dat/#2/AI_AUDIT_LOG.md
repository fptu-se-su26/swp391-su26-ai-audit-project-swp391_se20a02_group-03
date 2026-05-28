# AI Audit Log

## Log #01
- **Date:** 2026-05-28
- **Author:** Phạm Nguyễn Tiến Đạt
- **AI Tool:** Gemini
- **Purpose:** Integrate GSAP animations, fix Vite environment errors, and build 10 complete UI pages.
- **Prompt Reference:** PROMPTS.md#prompt-01

### AI Output Summary
- Suggested installing `gsap` and `@gsap/react` libraries.
- Generated UI boilerplates for 6 Apex module pages (Booking, Matches, Shop, Profile, Settings, Support).
- Generated layouts and 4 MatchPro module pages (Trending Feed, Nearby Sports, Community Hub, Leaderboard).

### Human Decision & Intervention
- **Accepted:** Applied all UI structures and CSS layouts suggested by the AI.
- **Technical Intervention 1 (Code Refactoring):** Realized that writing animation code directly into components caused clutter. Decided to extract the GSAP logic into custom hooks (`useScrollReveal`, `useNavbarEntrance`) for better reusability and cleaner code.
- **Technical Intervention 2 (Environment Fix):** Diagnosed and reconfigured `vite.config.js` to ignore the `.vs` directory. This completely resolved the `EBUSY` server crash—an issue the AI initially didn't anticipate due to local machine specifics.

### Applied To
- `vite.config.js`
- `App.jsx`
- `src/hooks/`
- `src/pages/apex/` & `src/pages/matches/`

### Verification
- The Vite server now runs stably without crashing upon hot-reloading.
- The UI renders perfectly at the `/apex` and `/matches` routes, with smooth scrolling and entrance animations.
