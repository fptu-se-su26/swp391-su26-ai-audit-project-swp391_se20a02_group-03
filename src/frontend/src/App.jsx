import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { ToastProvider } from './components/Toast'

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
import GearDashboardPage from './pages/gear/GearDashboardPage'
import GearRentalPage from './pages/gear/GearRentalPage'
import GearRentalTermsPage from './pages/gear/GearRentalTermsPage'
import GearMaintenancePage from './pages/gear/GearMaintenancePage'
import GearSupportPage from './pages/gear/GearSupportPage'
import GearPrivacyPage from './pages/gear/GearPrivacyPage'
import BookingHistoryPage from './pages/customer/BookingHistoryPage'
import CustomerProfilePage from './pages/customer/CustomerProfilePage'
import ReportDisputePage from './pages/customer/ReportDisputePage'

import AIChatbot from './components/AIChatbot'
import { CartProvider } from './context/CartContext'
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

// PRO-SPORT Elite Staff — lazy loaded
const ElitePosWalkInPage  = lazy(() => import('./pages/elite/ElitePosWalkInPage'))
const EliteSchedulePage   = lazy(() => import('./pages/elite/EliteSchedulePage'))
const EliteEquipmentPage  = lazy(() => import('./pages/elite/EliteEquipmentPage'))
const EliteVouchersPage   = lazy(() => import('./pages/elite/EliteVouchersPage'))
const EliteDisputesPage   = lazy(() => import('./pages/elite/EliteDisputesPage'))
const EliteScannerPage    = lazy(() => import('./pages/elite/EliteScannerPage'))

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

// Loading fallback for lazy routes
const PageLoader = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#f8fafc' }}>
    <div style={{ textAlign: 'center' }}>
      <div style={{ width: 40, height: 40, border: '3px solid #e2e8f0', borderTopColor: '#0d8a8a', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
      <p style={{ color: '#64748b', fontSize: 14, fontFamily: 'Inter, sans-serif' }}>Loading...</p>
    </div>
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
)

// BUG #13 FIX: Redirect guard — authenticated users can't access login/register
function GuestRoute({ children }) {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token')
    if (token) return <Navigate to="/" replace />
    return children
}

function ProtectedRoute({ children }) {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token')
    if (!token) return <Navigate to="/login" replace />
    return children
}

function App() {
    return (
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || '451555739002-p36a1gvgpgb5pf5585modtkess26flmf.apps.googleusercontent.com'}>
        <ToastProvider>
        <CartProvider>
            <Router basename="/swp391-su26-ai-audit-project-swp391_se20a02_group-03">
                <Suspense fallback={<PageLoader />}>
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
                    <Route path="/courts" element={<ApexHomePage />} />
                    <Route path="/courts/:id" element={<CourtDetailPage />} />
                    <Route path="/courts/:id/book" element={<BookingPage />} />

                    {/* Matches / MatchPro — IMPORTANT: static routes BEFORE :id param */}
                    <Route path="/matches" element={<MatchProFeedPage />} />
                    <Route path="/matches/create" element={<ProtectedRoute><CreateMatchPage /></ProtectedRoute>} />
                    <Route path="/matches/nearby" element={<MatchProNearbyPage />} />
                    <Route path="/matches/community" element={<MatchProCommunityPage />} />
                    <Route path="/matches/leaderboard" element={<MatchProLeaderboardPage />} />
                    <Route path="/matches/:id" element={<MatchDetailPage />} />

                    {/* Customer */}
                    <Route path="/customer/profile" element={<ProtectedRoute><CustomerProfilePage /></ProtectedRoute>} />
                    <Route path="/customer/bookings" element={<ProtectedRoute><BookingHistoryPage /></ProtectedRoute>} />
                    <Route path="/customer/report" element={<ProtectedRoute><ReportDisputePage /></ProtectedRoute>} />

                    <Route path="/gear" element={<Navigate to="/gear/catalog" replace />} />
                    <Route path="/gear/dashboard" element={<GearDashboardPage />} />
                    <Route path="/gear/rentals" element={<GearRentalPage />} />
                    <Route path="/gear/catalog" element={<GearCatalogPage />} />
                    <Route path="/gear/catalog/:id" element={<GearDetailPage />} />
                    <Route path="/gear/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
                    <Route path="/gear/cart/checkout" element={<ProtectedRoute><CartCheckoutPage /></ProtectedRoute>} />
                    <Route path="/gear/rental-terms" element={<GearRentalTermsPage />} />
                    <Route path="/gear/maintenance" element={<GearMaintenancePage />} />
                    <Route path="/gear/support" element={<GearSupportPage />} />
                    <Route path="/gear/privacy" element={<GearPrivacyPage />} />

                    {/* Apex Portal Routes */}
                    <Route path="/apex" element={<ProtectedRoute><ApexHomePage /></ProtectedRoute>} />
                    <Route path="/apex/booking" element={<ProtectedRoute><ApexBookingPage /></ProtectedRoute>} />
                    <Route path="/apex/matches" element={<ProtectedRoute><ApexMatchesPage /></ProtectedRoute>} />
                    <Route path="/apex/shop" element={<Navigate to="/gear/catalog" replace />} />
                    <Route path="/apex/profile" element={<ProtectedRoute><ApexProfilePage /></ProtectedRoute>} />
                    <Route path="/apex/activity" element={<ProtectedRoute><ApexActivityPage /></ProtectedRoute>} />
                    <Route path="/apex/settings" element={<ProtectedRoute><ApexSettingsPage /></ProtectedRoute>} />
                    <Route path="/apex/support" element={<ProtectedRoute><ApexSupportPage /></ProtectedRoute>} />

                    {/* Admin Portal Routes — protected + lazy */}
                    <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
                    <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboardPage /></ProtectedRoute>} />
                    <Route path="/admin/users" element={<ProtectedRoute><AdminUsersPage /></ProtectedRoute>} />
                    <Route path="/admin/courts" element={<ProtectedRoute><AdminCourtsPage /></ProtectedRoute>} />
                    <Route path="/admin/kyc" element={<ProtectedRoute><AdminKycPage /></ProtectedRoute>} />
                    <Route path="/admin/pricing" element={<ProtectedRoute><AdminPricingPage /></ProtectedRoute>} />
                    <Route path="/admin/inventory" element={<ProtectedRoute><AdminInventoryPage /></ProtectedRoute>} />
                    <Route path="/admin/complaints" element={<ProtectedRoute><AdminComplaintsPage /></ProtectedRoute>} />

                    {/* Elite Staff Portal Routes — protected + lazy */}
                    <Route path="/elite" element={<Navigate to="/elite/pos" replace />} />
                    <Route path="/elite/pos" element={<ProtectedRoute><ElitePosWalkInPage /></ProtectedRoute>} />
                    <Route path="/elite/schedule" element={<ProtectedRoute><EliteSchedulePage /></ProtectedRoute>} />
                    <Route path="/elite/equipment" element={<ProtectedRoute><EliteEquipmentPage /></ProtectedRoute>} />
                    <Route path="/elite/vouchers" element={<ProtectedRoute><EliteVouchersPage /></ProtectedRoute>} />
                    <Route path="/elite/disputes" element={<ProtectedRoute><EliteDisputesPage /></ProtectedRoute>} />
                    <Route path="/elite/scanner" element={<ProtectedRoute><EliteScannerPage /></ProtectedRoute>} />

                    {/* Mobile App Routes — lazy */}
                    <Route path="/mobile" element={<Navigate to="/mobile/home" replace />} />
                    <Route path="/mobile/home" element={<MobileHomePage />} />
                    <Route path="/mobile/profile" element={<ProtectedRoute><MobileProfilePage /></ProtectedRoute>} />
                    <Route path="/mobile/matches" element={<MobileMatchesPage />} />
                    <Route path="/mobile/dashboard" element={<ProtectedRoute><MobileDashboardPage /></ProtectedRoute>} />
                    <Route path="/mobile/scanner" element={<ProtectedRoute><MobileScannerPage /></ProtectedRoute>} />
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
        </CartProvider>
        </ToastProvider>
        </GoogleOAuthProvider>
    )
}

export default App
