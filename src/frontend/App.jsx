import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

// PRO-SPORT Public Pages
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import RoleSelectionPage from './pages/RoleSelectionPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import GearCatalogPage from './pages/gear/GearCatalogPage'

// PRO-SPORT Apex Portal (Courts & More)
import ApexHomePage from './pages/apex/ApexHomePage'
import ApexBookingPage from './pages/apex/ApexBookingPage'
import ApexMatchesPage from './pages/apex/ApexMatchesPage'
import ApexShopPage from './pages/apex/ApexShopPage'
import ApexProfilePage from './pages/apex/ApexProfilePage'
import ApexActivityPage from './pages/apex/ApexActivityPage'
import ApexSettingsPage from './pages/apex/ApexSettingsPage'
import ApexSupportPage from './pages/apex/ApexSupportPage'

// PRO-SPORT MatchPro
import MatchProFeedPage from './pages/matchpro/MatchProFeedPage'
import MatchProNearbyPage from './pages/matchpro/MatchProNearbyPage'
import MatchProCommunityPage from './pages/matchpro/MatchProCommunityPage'
import MatchProLeaderboardPage from './pages/matchpro/MatchProLeaderboardPage'

// PRO-SPORT Admin Portal
import AdminDashboardPage from './pages/admin/AdminDashboardPage'
import AdminCourtsPage from './pages/admin/AdminCourtsPage'
import AdminUsersPage from './pages/admin/AdminUsersPage'
import AdminBookingsPage from './pages/admin/AdminBookingsPage'

// PRO-SPORT EliteSport OS
import EliteDashboardPage from './pages/elite/EliteDashboardPage'
import EliteSchedulePage from './pages/elite/EliteSchedulePage'
import ElitePosWalkInPage from './pages/elite/ElitePosWalkInPage'

// PRO-SPORT Mobile App Pages
import MobileHomePage from './pages/mobile/MobileHomePage'
import MobileProfilePage from './pages/mobile/MobileProfilePage'
import MobileMatchesPage from './pages/mobile/MobileMatchesPage'
import MobileDashboardPage from './pages/mobile/MobileDashboardPage'
import MobileScannerPage from './pages/mobile/MobileScannerPage'
import MobileWalletPage from './pages/mobile/MobileWalletPage'
import MobileChatPage from './pages/mobile/MobileChatPage'
import MobileBookingPage from './pages/mobile/MobileBookingPage'

// Status / Error Pages
import NotFoundPage from './pages/status/NotFoundPage'
import RestrictedPage from './pages/status/RestrictedPage'
import MaintenancePage from './pages/status/MaintenancePage'

function App() {
    return (
        <Router>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/role-selection" element={<RoleSelectionPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/gear" element={<GearCatalogPage />} />
                
                {/* MatchPro Routes */}
                <Route path="/matches" element={<MatchProFeedPage />} />
                <Route path="/matches/nearby" element={<MatchProNearbyPage />} />
                <Route path="/matches/community" element={<MatchProCommunityPage />} />
                <Route path="/matches/leaderboard" element={<MatchProLeaderboardPage />} />

                {/* Apex Portal Routes (Courts) */}
                <Route path="/courts" element={<Navigate to="/apex" replace />} />
                <Route path="/apex" element={<ApexHomePage />} />
                <Route path="/apex/booking" element={<ApexBookingPage />} />
                <Route path="/apex/matches" element={<ApexMatchesPage />} />
                <Route path="/apex/shop" element={<ApexShopPage />} />
                <Route path="/apex/profile" element={<ApexProfilePage />} />
                <Route path="/apex/activity" element={<ApexActivityPage />} />
                <Route path="/apex/settings" element={<ApexSettingsPage />} />
                <Route path="/apex/support" element={<ApexSupportPage />} />

                {/* Admin Portal Routes */}
                <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
                <Route path="/admin/courts" element={<AdminCourtsPage />} />
                <Route path="/admin/users" element={<AdminUsersPage />} />
                <Route path="/admin/bookings" element={<AdminBookingsPage />} />

                {/* EliteSport OS Routes */}
                <Route path="/elite" element={<Navigate to="/elite/dashboard" replace />} />
                <Route path="/elite/dashboard" element={<EliteDashboardPage />} />
                <Route path="/elite/schedule" element={<EliteSchedulePage />} />
                <Route path="/elite/pos" element={<ElitePosWalkInPage />} />

                {/* Mobile App Routes */}
                <Route path="/mobile" element={<Navigate to="/mobile/home" replace />} />
                <Route path="/mobile/home" element={<MobileHomePage />} />
                <Route path="/mobile/profile" element={<MobileProfilePage />} />
                <Route path="/mobile/matches" element={<MobileMatchesPage />} />
                <Route path="/mobile/dashboard" element={<MobileDashboardPage />} />
                <Route path="/mobile/scanner" element={<MobileScannerPage />} />
                <Route path="/mobile/wallet" element={<MobileWalletPage />} />
                <Route path="/mobile/chat" element={<MobileChatPage />} />
                <Route path="/mobile/booking" element={<MobileBookingPage />} />

                {/* Status Pages */}
                <Route path="/maintenance" element={<MaintenancePage />} />
                <Route path="/403" element={<RestrictedPage />} />
                <Route path="/404" element={<NotFoundPage />} />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </Router>
    )
}

export default App
