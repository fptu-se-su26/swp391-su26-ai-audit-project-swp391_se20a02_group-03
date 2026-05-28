# Changelog

## [2026-05-28] - Phase: Premium UI/UX Overhaul
**Author:** Phạm Nguyễn Tiến Đạt

### Added
- **Core:** Successfully integrated GSAP (`gsap`, `@gsap/react`) for global animations.
- **Core:** Added custom hooks (`useScrollReveal`, `useNavbarEntrance`) for reusable animation logic.
- **Courts Portal (Apex Module):** Created 6 fully functional UI pages:
  - `ApexBookingPage`: 3-step Wizard for court reservations.
  - `ApexMatchesPage`: Multi-tab match management.
  - `ApexShopPage`: E-commerce store supporting Rent/Buy modes with a Cart panel.
  - `ApexProfilePage`: User profile and statistics.
  - `ApexSettingsPage`: Account settings management.
  - `ApexSupportPage`: Support center with an accordion FAQ.
- **MatchPro Module:** Created 4 sports social network pages:
  - `Trending Feed`: Highlighted tournaments and open matches.
  - `Nearby Sports`: Map-based interface for nearby courts/players.
  - `Community Hub`: Social network feed, events, and groups.
  - `Leaderboard`: Ranking board featuring a 3D-effect Top 3 Podium.

### Changed
- **Routing:** Updated `App.jsx`, defining all `<Route>` paths for the 10 new pages to ensure seamless navigation without 404 errors.
- **Layout:** Upgraded `MatchProLayout` with smooth drop-down animations for the Logo and Header/Sidebar.

### Fixed
- **DX (Developer Experience):** Fixed the Vite server crash (`EBUSY` error) during hot-reloads by updating `vite.config.js` to ignore Visual Studio's `.vs` directory.

### AI-assisted
- UI layout design, CSS structuring, and initial animation flows were ideated and generated with AI assistance, then manually refactored to meet strict React Componentization standards.
