import { useCallback, useEffect, useRef, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useOwner } from '../context/OwnerContext';
import OwnerSidebar from '../components/owner/OwnerSidebar';
import OwnerHeader from '../components/owner/OwnerHeader';

export default function OwnerLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { complexes, complexId, loading, error, reload } = useOwner();
  
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [desktopSidebarCollapsed, setDesktopSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(() => (
    typeof window !== 'undefined' && window.matchMedia
      ? window.matchMedia('(max-width: 900px)').matches
      : false
  ));
  const mobileMenuButtonRef = useRef(null);
  const sidebarRef = useRef(null);

  const displayName = user?.fullName || user?.name || 'Chủ sân';
  const complexName = complexes.find(c => c.complexId === complexId)?.name;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const closeMobileSidebar = useCallback(() => {
    setMobileSidebarOpen(false);
  }, []);

  useEffect(() => {
    if (!window.matchMedia) return undefined;
    const mediaQuery = window.matchMedia('(max-width: 900px)');
    const handleChange = (event) => setIsMobile(event.matches);
    setIsMobile(mediaQuery.matches);
    mediaQuery.addEventListener?.('change', handleChange);
    return () => mediaQuery.removeEventListener?.('change', handleChange);
  }, []);

  useEffect(() => {
    if (!isMobile) setMobileSidebarOpen(false);
  }, [isMobile]);

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [location.pathname]);

  // Handle body scroll lock and keyboard focus for the mobile drawer.
  useEffect(() => {
    if (!mobileSidebarOpen || !isMobile) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const focusTimer = window.setTimeout(() => {
      sidebarRef.current?.querySelector('[data-owner-sidebar-close]')?.focus();
    }, 0);
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeMobileSidebar();
      }
    };
    document.addEventListener('keydown', handleEscape);

    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = previousOverflow;
      if (window.matchMedia?.('(max-width: 900px)').matches) {
        mobileMenuButtonRef.current?.focus();
      }
    };
  }, [closeMobileSidebar, isMobile, mobileSidebarOpen]);

  const sidebarHidden = isMobile ? !mobileSidebarOpen : desktopSidebarCollapsed;

  return (
    <div className="flex min-h-screen bg-background-base font-sans text-foreground">
      
      {/* ─── Mobile Sidebar Backdrop ─── */}
      {mobileSidebarOpen && (
        <div
          className="hidden max-[900px]:block fixed inset-0 bg-ink/60 z-[199] backdrop-blur-sm transition-opacity"
          aria-hidden="true"
          onClick={closeMobileSidebar}
        />
      )}

      {/* ─── Sidebar ─── */}
      <OwnerSidebar
        open={mobileSidebarOpen}
        collapsed={desktopSidebarCollapsed}
        isHidden={sidebarHidden}
        asideRef={sidebarRef}
        onClose={closeMobileSidebar}
        displayName={displayName}
        onLogout={handleLogout}
      />

      {/* ─── Main Content Wrapper ─── */}
      <div 
        className={`flex-1 flex flex-col min-h-screen transition-all duration-200 ${
          desktopSidebarCollapsed ? 'ml-0' : 'ml-[260px]'
        } max-[900px]:!ml-0`}
      >
        <OwnerHeader 
          complexName={complexName} 
          mobileSidebarOpen={mobileSidebarOpen}
          mobileMenuButtonRef={mobileMenuButtonRef}
          onMobileMenuToggle={() => setMobileSidebarOpen(open => !open)} 
          desktopSidebarCollapsed={desktopSidebarCollapsed}
          onDesktopMenuToggle={() => setDesktopSidebarCollapsed(!desktopSidebarCollapsed)}
        />

        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <div className="max-w-[1200px] mx-auto">
            {loading && (
              <div className="bg-white rounded-[16px] border border-gray-100 shadow-[0_2px_16px_rgba(0,0,0,0.03)] px-6 py-8 animate-pulse">
                <div className="h-5 w-48 bg-gray-200 rounded-[6px] mb-3" />
                <div className="h-4 w-72 bg-gray-100 rounded-[6px]" />
              </div>
            )}

            {error && !loading && (
              <div className="bg-red-50 border border-red-100 rounded-[16px] px-6 py-6 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-sm font-medium text-red-600 m-0">{error}</p>
                <button
                  type="button"
                  onClick={reload}
                  className="px-4 py-2 bg-white border border-red-200 text-red-600 text-sm font-bold rounded-[8px] hover:bg-red-50 transition-colors"
                >
                  Thử lại
                </button>
              </div>
            )}

            {!complexId && !loading && !error && (
              <div className="bg-orange-50 border border-orange-100 rounded-[16px] px-6 py-8 text-center">
                <h3 className="text-lg font-bold text-orange-800 mb-2 m-0">Chưa chọn tổ hợp sân</h3>
                <p className="text-sm text-orange-600 m-0">Vui lòng chọn một tổ hợp sân từ thanh menu bên trên hoặc liên hệ Admin nếu tài khoản chưa được phân quyền.</p>
              </div>
            )}

            {complexId && !loading && <Outlet key={complexId} context={{ complexId }} />}
          </div>
        </main>
      </div>
    </div>
  );
}
