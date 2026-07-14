import { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import AIChatbot from './components/AIChatbot'
import PageLoader from './components/ui/PageLoader'
import { ToastProvider } from './components/Toast'
import { ConfirmProvider } from './components/ui/ConfirmDialog'
import { ThemeProvider } from './context/ThemeContext'
import { useAuth } from './context/AuthContext'

// PRO-SPORT Public Pages — lazy loaded to reduce initial bundle
const HomePage = lazy(() => import('./pages/HomePage'))
const LoginPage = lazy(() => import('./pages/LoginPage'))
const RegisterPage = lazy(() => import('./pages/RegisterPage'))
const CompleteProfilePage = lazy(() => import('./pages/CompleteProfilePage'))
const RoleSelectionPage = lazy(() => import('./pages/RoleSelectionPage'))
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage'))
const AboutPage = lazy(() => import('./pages/AboutPage'))
const ContactPage = lazy(() => import('./pages/ContactPage'))
const PrivacyPolicyPage = lazy(() => import('./pages/legal/PrivacyPolicyPage'))
const TermsOfServicePage = lazy(() => import('./pages/legal/TermsOfServicePage'))
const SitemapPage = lazy(() => import('./pages/legal/SitemapPage'))
const BrandMissionPage = lazy(() => import('./pages/platform/BrandMissionPage'))
const CourtDetailPage = lazy(() => import('./pages/courts/CourtDetailPage'))
const BookingPage = lazy(() => import('./pages/courts/BookingPage'))
const MatchDetailPage = lazy(() => import('./pages/matches/MatchDetailPage'))
const CreateMatchPage = lazy(() => import('./pages/matches/CreateMatchPage'))
const GearCatalogPage = lazy(() => import('./pages/gear/GearCatalogPage'))
const GearDetailPage = lazy(() => import('./pages/gear/GearDetailPage'))
const GearMaintenancePage = lazy(() => import('./pages/gear/GearMaintenancePage'))
const GearSupportPage = lazy(() => import('./pages/gear/GearSupportPage'))
const GearPrivacyPage = lazy(() => import('./pages/gear/GearPrivacyPage'))
const ReportDisputePage = lazy(() => import('./pages/customer/ReportDisputePage'))
const CartPage = lazy(() => import('./pages/gear/CartPage'))
const CartCheckoutPage = lazy(() => import('./pages/gear/CartCheckoutPage'))
const OrdersPage = lazy(() => import('./pages/gear/OrdersPage'))

// PRO-SPORT Apex Portal
const ApexHomePage = lazy(() => import('./pages/apex/ApexHomePage'))
const ApexBookingPage = lazy(() => import('./pages/apex/ApexBookingPage'))
const ApexMatchesPage = lazy(() => import('./pages/apex/ApexMatchesPage'))
const ApexProfilePage = lazy(() => import('./pages/apex/ApexProfilePage'))
const ApexActivityPage = lazy(() => import('./pages/apex/ApexActivityPage'))
const ApexSettingsPage = lazy(() => import('./pages/apex/ApexSettingsPage'))
const ApexSupportPage = lazy(() => import('./pages/apex/ApexSupportPage'))
const ApexBookingsPage = lazy(() => import('./pages/apex/ApexBookingsPage'))

// PRO-SPORT MatchPro
const MatchProFeedPage = lazy(() => import('./pages/matchpro/MatchProFeedPage'))
const MatchProNearbyPage = lazy(() => import('./pages/matchpro/MatchProNearbyPage'))
const MatchProCommunityPage = lazy(() => import('./pages/matchpro/MatchProCommunityPage'))
const MatchProLeaderboardPage = lazy(() => import('./pages/matchpro/MatchProLeaderboardPage'))

// PRO-SPORT Admin Portal — lazy loaded (large portal, not needed on first visit)
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
const EliteSchedulePage   = lazy(() => import('./pages/elite/EliteSchedulePage'))
const EliteVouchersPage   = lazy(() => import('./pages/elite/EliteVouchersPage'))
const EliteDisputesPage   = lazy(() => import('./pages/elite/EliteDisputesPage'))
const EliteScannerPage    = lazy(() => import('./pages/elite/EliteScannerPage'))

// PRO-SPORT Staff Dash — lazy loaded
const DashInboxPage       = lazy(() => import('./pages/dashboard/DashInboxPage'))
const DashBroadcastPage   = lazy(() => import('./pages/dashboard/DashBroadcastPage'))
const DashBookingsPage    = lazy(() => import('./pages/dashboard/DashBookingsPage'))
const DashMatchesPage     = lazy(() => import('./pages/dashboard/DashMatchesPage'))
const DashPaymentsPage    = lazy(() => import('./pages/dashboard/DashPaymentsPage'))
const DashNotifSettingsPage = lazy(() => import('./pages/dashboard/DashNotifSettingsPage'))

// PRO-SPORT Court Owner Portal — lazy loaded
const OwnerDashboardPage = lazy(() => import('./pages/owner/OwnerDashboardPage'))
const OwnerComplexPage     = lazy(() => import('./pages/owner/OwnerComplexPage'))
const OwnerCourtsPage      = lazy(() => import('./pages/owner/OwnerCourtsPage'))
const OwnerCourtCreatePage = lazy(() => import('./pages/owner/OwnerCourtCreatePage'))
const OwnerCourtDetailPage = lazy(() => import('./pages/owner/OwnerCourtDetailPage'))
const OwnerPricingPage     = lazy(() => import('./pages/owner/OwnerPricingPage'))
const OwnerBookingsPage    = lazy(() => import('./pages/owner/OwnerBookingsPage'))
const OwnerBookingCalendarPage = lazy(() => import('./pages/owner/OwnerBookingCalendarPage'))
const OwnerBookingDetailPage = lazy(() => import('./pages/owner/OwnerBookingDetailPage'))
const OwnerWalkInPage = lazy(() => import('./pages/owner/OwnerWalkInPage'))
const OwnerStaffPage       = lazy(() => import('./pages/owner/OwnerStaffPage'))
const OwnerProductsPage    = lazy(() => import('./pages/owner/OwnerProductsPage'))
const OwnerVouchersPage    = lazy(() => import('./pages/owner/OwnerVouchersPage'))
const OwnerFinancePage     = lazy(() => import('./pages/owner/OwnerFinancePage'))
const OwnerReportsPage     = lazy(() => import('./pages/owner/OwnerReportsPage'))
const OwnerReviewsPage     = lazy(() => import('./pages/owner/OwnerReviewsPage'))
const OwnerAuditLogsPage   = lazy(() => import('./pages/owner/OwnerAuditLogsPage'))
const OwnerSettingsPage    = lazy(() => import('./pages/owner/OwnerSettingsPage'))
const OwnerOperatingHoursPage = lazy(() => import('./pages/owner/OwnerOperatingHoursPage'))
const OwnerCancellationPolicyPage = lazy(() => import('./pages/owner/OwnerCancellationPolicyPage'))
const OwnerMembershipsPage = lazy(() => import('./pages/owner/OwnerMembershipsPage'))
import OwnerLayout from './layouts/OwnerLayout'
import { OwnerProvider } from './context/OwnerContext'

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
  <div className="flex items-center justify-center min-h-screen bg-background-base">
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
    return (
        <ErrorBoundary homePath="/admin/dashboard" title="Lỗi Admin Portal">
            {children}
        </ErrorBoundary>
    )
}

function EliteRoute({ children }) {
    const { isAuthenticated, isStaff, isAdmin, loading } = useAuth()
    if (loading) return <RouteLoader />
    if (!isAuthenticated) return <Navigate to="/login" replace />
    if (!isStaff && !isAdmin) return <Navigate to="/403" replace />
    return children
}

function OwnerRoute({ children }) {
    const { isAuthenticated, isCourtOwner, isAdmin, loading } = useAuth()
    if (loading) return <RouteLoader />
    if (!isAuthenticated) return <Navigate to="/login" replace />
    if (!isCourtOwner && !isAdmin) return <Navigate to="/403" replace state={{ reason: 'Chỉ tài khoản Chủ sân hoặc Quản trị mới truy cập Owner Portal.' }} />
    return (
        <ErrorBoundary homePath="/owner/dashboard" title="Lỗi Owner Portal">
            {children}
        </ErrorBoundary>
    )
}

function App() {
    return (
        <ErrorBoundary>
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
                    <Route path="/gear/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />

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

                    {/* Court Owner Portal */}
                    <Route path="/owner" element={<OwnerRoute><OwnerProvider><OwnerLayout /></OwnerProvider></OwnerRoute>}>
                        <Route index element={<Navigate to="/owner/dashboard" replace />} />
                        <Route path="dashboard" element={<OwnerDashboardPage />} />
                        <Route path="courts" element={<OwnerCourtsPage />} />
                        <Route path="courts/create" element={<OwnerCourtCreatePage />} />
                        <Route path="courts/:courtId" element={<OwnerCourtDetailPage />} />
                        <Route path="pricing" element={<OwnerPricingPage />} />
                        <Route path="bookings" element={<OwnerBookingsPage />} />
                        <Route path="bookings/calendar" element={<OwnerBookingCalendarPage />} />
                        <Route path="bookings/walk-in" element={<OwnerWalkInPage />} />
                        <Route path="bookings/:bookingId" element={<OwnerBookingDetailPage />} />
                        <Route path="staff" element={<OwnerStaffPage />} />
                        <Route path="inventory/products" element={<OwnerProductsPage />} />
                        <Route path="vouchers" element={<OwnerVouchersPage />} />
                        <Route path="finance" element={<OwnerFinancePage />} />
                        <Route path="reports" element={<OwnerReportsPage />} />
                        <Route path="reviews" element={<OwnerReviewsPage />} />
                        <Route path="audit-logs" element={<OwnerAuditLogsPage />} />
                        <Route path="complex" element={<OwnerComplexPage />} />
                        <Route path="operating-hours" element={<OwnerOperatingHoursPage />} />
                        <Route path="cancellation-policy" element={<OwnerCancellationPolicyPage />} />
                        <Route path="memberships" element={<OwnerMembershipsPage />} />
                        <Route path="settings" element={<OwnerSettingsPage />} />
                    </Route>

                    <Route path="/restricted" element={<Navigate to="/403" replace />} />

                    {/* Elite Staff Portal Routes — protected + role-restricted (Staff/Admin) */}
                    <Route path="/elite" element={<Navigate to="/elite/dashboard" replace />} />
                    <Route path="/elite/dashboard" element={<EliteRoute><EliteDashboardPage /></EliteRoute>} />
                    <Route path="/elite/bookings" element={<EliteRoute><EliteBookingsPage /></EliteRoute>} />
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
        </ErrorBoundary>
    )
}

export default App
