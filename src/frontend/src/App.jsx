import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom'
import { ToastProvider } from './components/Toast'
import { ConfirmProvider } from './components/ui/ConfirmDialog'
import { ThemeProvider } from './context/ThemeContext'
import { useAuth } from './context/AuthContext'

// PRO-SPORT Public Pages
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import CompleteProfilePage from './pages/CompleteProfilePage'
import RoleSelectionPage from './pages/RoleSelectionPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import PrivacyPolicyPage from './pages/legal/PrivacyPolicyPage'
import TermsOfServicePage from './pages/legal/TermsOfServicePage'
import SitemapPage from './pages/legal/SitemapPage'
import BrandMissionPage from './pages/platform/BrandMissionPage'
import CourtDetailPage from './pages/courts/CourtDetailPage'
import BookingPage from './pages/courts/BookingPage'
import MatchDetailPage from './pages/matches/MatchDetailPage'
import CreateMatchPage from './pages/matches/CreateMatchPage'
import GearCatalogPage from './pages/gear/GearCatalogPage'
import GearDetailPage from './pages/gear/GearDetailPage'

import GearMaintenancePage from './pages/gear/GearMaintenancePage'
import GearSupportPage from './pages/gear/GearSupportPage'
import GearPrivacyPage from './pages/gear/GearPrivacyPage'
import ReportDisputePage from './pages/customer/ReportDisputePage'

import AIChatbot from './components/AIChatbot'
import PageLoader from './components/ui/PageLoader'
import CartPage from './pages/gear/CartPage'
import CartCheckoutPage from './pages/gear/CartCheckoutPage'

// PRO-SPORT Apex Portal (Courts & More)
import ApexHomePage from './pages/apex/ApexHomePage'
import ApexBookingPage from './pages/apex/ApexBookingPage'
import ApexMatchesPage from './pages/apex/ApexMatchesPage'
import ApexProfilePage from './pages/apex/ApexProfilePage'
import ApexActivityPage from './pages/apex/ApexActivityPage'
import ApexSettingsPage from './pages/apex/ApexSettingsPage'
import ApexSupportPage from './pages/apex/ApexSupportPage'
import ApexBookingsPage from './pages/apex/ApexBookingsPage'

// PRO-SPORT MatchPro
import MatchProFeedPage from './pages/matchpro/MatchProFeedPage'
import MatchProNearbyPage from './pages/matchpro/MatchProNearbyPage'
import MatchProCommunityPage from './pages/matchpro/MatchProCommunityPage'
import MatchProLeaderboardPage from './pages/matchpro/MatchProLeaderboardPage'

// PRO-SPORT Admin Portal — lazy loaded (large portal, not needed on first visit)
import { lazy, Suspense } from 'react'
const AdminDashboardPage    = lazy(() => import('./pages/admin/AdminDashboardPage'))
const AdminUsersPage        = lazy(() => import('./pages/admin/AdminUsersPage'))
const AdminCourtsPage       = lazy(() => import('./pages/admin/AdminCourtsPage'))
const AdminKycPage          = lazy(() => import('./pages/admin/AdminKycPage'))
const AdminPricingPage      = lazy(() => import('./pages/admin/AdminPricingPage'))
const AdminInventoryPage    = lazy(() => import('./pages/admin/AdminInventoryPage'))
const AdminComplaintsPage   = lazy(() => import('./pages/admin/AdminComplaintsPage'))
const AdminBookingsPage     = lazy(() => import('./pages/admin/AdminBookingsPage'))

// PRO-SPORT Elite Staff — lazy loaded
const ElitePosWalkInPage  = lazy(() => import('./pages/elite/ElitePosWalkInPage'))
const EliteDashboardPage  = lazy(() => import('./pages/elite/EliteDashboardPage'))
const EliteBookingsPage   = lazy(() => import('./pages/elite/EliteBookingsPage'))
const EliteEquipmentPage  = lazy(() => import('./pages/elite/EliteEquipmentPage'))
const EliteSchedulePage   = lazy(() => import('./pages/elite/EliteSchedulePage'))
const EliteVouchersPage   = lazy(() => import('./pages/elite/EliteVouchersPage'))
const EliteDisputesPage   = lazy(() => import('./pages/elite/EliteDisputesPage'))
const EliteScannerPage    = lazy(() => import('./pages/elite/EliteScannerPage'))

// PRO-SPORT Staff Dash — lazy loaded
const DashInboxPage       = lazy(() => import('./pages/dashboard/DashInboxPage'))
const DashBroadcastPage   = lazy(() => import('./pages/dashboard/DashBroadcastPage'))
const DashBookingsPage    = lazy(() => import('./pages/dashboard/DashBookingsPage'))
const DashMatchesPage     = lazy(() => import('./pages/dashboard/DashMatchesPage'))
const DashRentalsPage     = lazy(() => import('./pages/dashboard/DashRentalsPage'))
const DashPaymentsPage    = lazy(() => import('./pages/dashboard/DashPaymentsPage'))
const DashNotifSettingsPage = lazy(() => import('./pages/dashboard/DashNotifSettingsPage'))

// PRO-SPORT Mobile App Pages — lazy loaded
const MobileHomePage      = lazy(() => import('./pages/mobile/MobileHomePage'))
const MobileProfilePage   = lazy(() => import('./pages/mobile/MobileProfilePage'))
const MobileMatchesPage   = lazy(() => import('./pages/mobile/MobileMatchesPage'))
const MobileDashboardPage = lazy(() => import('./pages/mobile/MobileDashboardPage'))
const MobileScannerPage   = lazy(() => import('./pages/mobile/MobileScannerPage'))
const MobileWalletPage    = lazy(() => import('./pages/mobile/MobileWalletPage'))
const MobileChatPage      = lazy(() => import('./pages/mobile/MobileChatPage'))
const MobileBookingPage   = lazy(() => import('./pages/mobile/MobileBookingPage'))

// Status / Error Pages
import NotFoundPage from './pages/status/NotFoundPage'
import RestrictedPage from './pages/status/RestrictedPage'
import MaintenancePage from './pages/status/MaintenancePage'
import PaymentReturnPage from './pages/status/PaymentReturnPage'

const RouteLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-[#f8fafc]">
    <PageLoader message="Đang tải trang..." />
  </div>
)

const routerBasename = (import.meta.env.BASE_URL ?? '/').replace(/\/$/, '')

function ShopProductRedirect() {
    const { id } = useParams()
    return <Navigate to={`/gear/catalog/${id}`} replace />
}

// CRITICAL FIX: Route guards now use AuthContext instead of direct localStorage reads
// This ensures guards react to context-driven login/logout actions
function GuestRoute({ children }) {
    const { isAuthenticated, loading } = useAuth()
    if (loading) return <RouteLoader />
    if (isAuthenticated) return <Navigate to="/" replace />
    return children
}

function ProtectedRoute({ children }) {
    const { isAuthenticated, loading } = useAuth()
    if (loading) return <RouteLoader />
    if (!isAuthenticated) return <Navigate to="/login" replace />
    return children
}

function AdminRoute({ children }) {
    const { isAuthenticated, isAdmin, loading } = useAuth()
    if (loading) return <RouteLoader />
    if (!isAuthenticated) return <Navigate to="/login" replace />
    if (!isAdmin) return <Navigate to="/403" replace />
    return children
}

function EliteRoute({ children }) {
    const { isAuthenticated, isStaff, isAdmin, loading } = useAuth()
    if (loading) return <RouteLoader />
    if (!isAuthenticated) return <Navigate to="/login" replace />
    if (!isStaff && !isAdmin) return <Navigate to="/403" replace />
    return children
}

function App() {
    return (
        <ThemeProvider>
        <ToastProvider>
        <ConfirmProvider>
            <Router basename={routerBasename || undefined}>
                <Suspense fallback={<RouteLoader />}>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
                    <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />
                    <Route path="/complete-profile" element={<CompleteProfilePage />} />
                    <Route path="/role-selection" element={<RoleSelectionPage />} />
                    <Route path="/reset-password" element={<GuestRoute><ResetPasswordPage /></GuestRoute>} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/brand-mission" element={<BrandMissionPage />} />
                    <Route path="/privacy" element={<PrivacyPolicyPage />} />
                    <Route path="/terms" element={<TermsOfServicePage />} />
                    <Route path="/sitemap" element={<SitemapPage />} />

                    {/* Courts */}
                    <Route path="/courts" element={<Navigate to="/apex/booking" replace />} />
                    <Route path="/courts/:id" element={<CourtDetailPage />} />
                    <Route path="/courts/:id/book" element={<BookingPage />} />

                    {/* Matches / MatchPro — IMPORTANT: static routes BEFORE :id param */}
                    <Route path="/matches" element={<MatchProFeedPage />} />
                    <Route path="/matches/create" element={<ProtectedRoute><CreateMatchPage /></ProtectedRoute>} />
                    <Route path="/matches/nearby" element={<MatchProNearbyPage />} />
                    <Route path="/matches/community" element={<MatchProCommunityPage />} />
                    <Route path="/matches/leaderboard" element={<MatchProLeaderboardPage />} />
                    <Route path="/matches/:id" element={<MatchDetailPage />} />

                    {/* Customer — redirects to Apex */}
                    <Route path="/customer/profile" element={<Navigate to="/apex/profile" replace />} />
                    <Route path="/customer/bookings" element={<Navigate to="/apex/bookings" replace />} />
                    <Route path="/customer/report" element={<ProtectedRoute><ReportDisputePage /></ProtectedRoute>} />

                    <Route path="/gear" element={<Navigate to="/gear/catalog" replace />} />

                    <Route path="/gear/catalog" element={<GearCatalogPage />} />
                    <Route path="/gear/catalog/:id" element={<GearDetailPage />} />
                    <Route path="/gear/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
                    <Route path="/gear/cart/checkout" element={<ProtectedRoute><CartCheckoutPage /></ProtectedRoute>} />

                    <Route path="/gear/maintenance" element={<EliteRoute><GearMaintenancePage /></EliteRoute>} />
                    <Route path="/gear/support" element={<GearSupportPage />} />
                    <Route path="/gear/privacy" element={<GearPrivacyPage />} />

                    {/* Shop legacy routes → Gear */}
                    <Route path="/shop" element={<Navigate to="/gear/catalog" replace />} />
                    <Route path="/shop/cart" element={<Navigate to="/gear/cart" replace />} />
                    <Route path="/shop/checkout" element={<Navigate to="/gear/cart/checkout" replace />} />
                    <Route path="/shop/product/:id" element={<ShopProductRedirect />} />
                    <Route path="/shop/wishlist" element={<Navigate to="/gear/catalog" replace />} />
                    <Route path="/shop/*" element={<Navigate to="/gear/catalog" replace />} />

                    {/* Apex Portal Routes */}
                    <Route path="/apex" element={<ProtectedRoute><ApexHomePage /></ProtectedRoute>} />
                    <Route path="/apex/booking" element={<ProtectedRoute><ApexBookingPage /></ProtectedRoute>} />
                    <Route path="/apex/matches" element={<ProtectedRoute><ApexMatchesPage /></ProtectedRoute>} />
                    <Route path="/apex/shop" element={<Navigate to="/gear/catalog" replace />} />
                    <Route path="/apex/profile" element={<ProtectedRoute><ApexProfilePage /></ProtectedRoute>} />
                    <Route path="/apex/activity" element={<ProtectedRoute><ApexActivityPage /></ProtectedRoute>} />
                    <Route path="/apex/bookings" element={<ProtectedRoute><ApexBookingsPage /></ProtectedRoute>} />
                    <Route path="/apex/settings" element={<ProtectedRoute><ApexSettingsPage /></ProtectedRoute>} />
                    <Route path="/apex/support" element={<ProtectedRoute><ApexSupportPage /></ProtectedRoute>} />

                    {/* Admin Portal Routes — protected + role-restricted (Admin only) */}
                    <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
                    <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />
                    <Route path="/admin/users" element={<AdminRoute><AdminUsersPage /></AdminRoute>} />
                    <Route path="/admin/courts" element={<AdminRoute><AdminCourtsPage /></AdminRoute>} />
                    <Route path="/admin/kyc" element={<AdminRoute><AdminKycPage /></AdminRoute>} />
                    <Route path="/admin/pricing" element={<AdminRoute><AdminPricingPage /></AdminRoute>} />
                    <Route path="/admin/inventory" element={<AdminRoute><AdminInventoryPage /></AdminRoute>} />
                    <Route path="/admin/complaints" element={<AdminRoute><AdminComplaintsPage /></AdminRoute>} />
                    <Route path="/admin/bookings" element={<AdminRoute><AdminBookingsPage /></AdminRoute>} />
                    <Route path="/restricted" element={<Navigate to="/403" replace />} />

                    {/* Elite Staff Portal Routes — protected + role-restricted (Staff/Admin) */}
                    <Route path="/elite" element={<Navigate to="/elite/dashboard" replace />} />
                    <Route path="/elite/dashboard" element={<EliteRoute><EliteDashboardPage /></EliteRoute>} />
                    <Route path="/elite/bookings" element={<EliteRoute><EliteBookingsPage /></EliteRoute>} />
                    <Route path="/elite/equipment" element={<EliteRoute><EliteEquipmentPage /></EliteRoute>} />
                    <Route path="/elite/pos" element={<EliteRoute><ElitePosWalkInPage /></EliteRoute>} />
                    <Route path="/elite/schedule" element={<EliteRoute><EliteSchedulePage /></EliteRoute>} />
                    <Route path="/elite/vouchers" element={<EliteRoute><EliteVouchersPage /></EliteRoute>} />
                    <Route path="/elite/disputes" element={<EliteRoute><EliteDisputesPage /></EliteRoute>} />
                    <Route path="/elite/scanner" element={<EliteRoute><EliteScannerPage /></EliteRoute>} />

                    {/* Staff ProSport Dash — protected (Staff/Admin) */}
                    <Route path="/dashboard" element={<Navigate to="/dashboard/inbox" replace />} />
                    <Route path="/dashboard/inbox" element={<EliteRoute><DashInboxPage /></EliteRoute>} />
                    <Route path="/dashboard/broadcast" element={<EliteRoute><DashBroadcastPage /></EliteRoute>} />
                    <Route path="/dashboard/bookings" element={<EliteRoute><DashBookingsPage /></EliteRoute>} />
                    <Route path="/dashboard/matches" element={<EliteRoute><DashMatchesPage /></EliteRoute>} />
                    <Route path="/dashboard/rentals" element={<EliteRoute><DashRentalsPage /></EliteRoute>} />
                    <Route path="/dashboard/payments" element={<EliteRoute><DashPaymentsPage /></EliteRoute>} />
                    <Route path="/dashboard/settings" element={<EliteRoute><DashNotifSettingsPage /></EliteRoute>} />

                    {/* Mobile App Routes — lazy */}
                    <Route path="/mobile" element={<Navigate to="/mobile/home" replace />} />
                    <Route path="/mobile/home" element={<MobileHomePage />} />
                    <Route path="/mobile/profile" element={<ProtectedRoute><MobileProfilePage /></ProtectedRoute>} />
                    <Route path="/mobile/matches" element={<MobileMatchesPage />} />
                    <Route path="/mobile/dashboard" element={<ProtectedRoute><MobileDashboardPage /></ProtectedRoute>} />
                    <Route path="/mobile/scanner" element={<EliteRoute><MobileScannerPage /></EliteRoute>} />
                    <Route path="/mobile/wallet" element={<ProtectedRoute><MobileWalletPage /></ProtectedRoute>} />
                    <Route path="/mobile/chat" element={<MobileChatPage />} />
                    <Route path="/mobile/booking" element={<ProtectedRoute><MobileBookingPage /></ProtectedRoute>} />

                    {/* Status Pages */}
                    <Route path="/maintenance" element={<MaintenancePage />} />
                    <Route path="/payment-return" element={<PaymentReturnPage />} />
                    <Route path="/403" element={<RestrictedPage />} />
                    <Route path="/404" element={<NotFoundPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
                </Suspense>
                <AIChatbot />
            </Router>
        </ConfirmProvider>
        </ToastProvider>
        </ThemeProvider>
    )
}

export default App
