import { Menu, X } from 'lucide-react';
import OwnerBreadcrumb from './OwnerBreadcrumb';
import ComplexSelector from './ComplexSelector';

export default function OwnerHeader({
  mobileSidebarOpen,
  mobileMenuButtonRef,
  onMobileMenuToggle,
  desktopSidebarCollapsed,
  onDesktopMenuToggle
}) {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center gap-4 px-4 md:px-8 sticky top-0 z-[100]">
      {/* Mobile hamburger */}
      <button
        ref={mobileMenuButtonRef}
        type="button"
        className="hidden max-[900px]:flex items-center justify-center w-11 h-11 rounded-[8px] text-gray-500 hover:bg-teal-50 hover:text-[#14b8a6] transition-colors border-0 bg-transparent cursor-pointer"
        onClick={onMobileMenuToggle}
        aria-label={mobileSidebarOpen ? 'Đóng menu' : 'Mở menu'}
        aria-controls="owner-sidebar"
        aria-expanded={mobileSidebarOpen}
      >
        {mobileSidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Desktop sidebar toggle */}
      <button
        type="button"
        className="max-[900px]:hidden flex items-center justify-center w-11 h-11 rounded-[8px] text-gray-500 hover:bg-teal-50 hover:text-[#14b8a6] transition-colors border-0 bg-transparent cursor-pointer"
        onClick={onDesktopMenuToggle}
        aria-label={desktopSidebarCollapsed ? 'Mở rộng menu' : 'Thu gọn menu'}
        aria-controls="owner-sidebar"
        aria-expanded={!desktopSidebarCollapsed}
      >
        <Menu size={20} />
      </button>

      {/* Title & Breadcrumb */}
      <div className="hidden sm:block">
        <OwnerBreadcrumb />
      </div>

      <div className="flex-1" />

      {/* Complex Selector */}
      <div className="ml-auto flex items-center">
        <ComplexSelector />
      </div>
    </header>
  );
}
