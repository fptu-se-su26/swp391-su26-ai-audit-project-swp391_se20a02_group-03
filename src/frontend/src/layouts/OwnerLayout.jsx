import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useOwner } from '../context/OwnerContext';
import OwnerSidebar from '../components/owner/OwnerSidebar';
import OwnerHeader from '../components/owner/OwnerHeader';

export default function OwnerLayout() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { complexes, complexId, loading, error, reload } = useOwner();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const displayName = user?.fullName || user?.name || 'Chủ sân';
  const complexName = complexes.find(c => c.complexId === complexId)?.name;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      {sidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-label="Đóng menu"
        />
      )}

      <OwnerSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        displayName={displayName}
        onLogout={handleLogout}
      />

      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <OwnerHeader complexName={complexName} onMenuOpen={() => setSidebarOpen(true)} />

        <main className="flex-1 p-4 md:p-6">
          {loading && (
            <div className="rounded-xl border border-slate-200 bg-white px-4 py-6 animate-pulse">
              <div className="h-4 w-40 bg-slate-200 rounded mb-2" />
              <div className="h-3 w-64 bg-slate-100 rounded" />
            </div>
          )}

          {error && !loading && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-4 mb-4 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-red-700">{error}</p>
              <button
                type="button"
                onClick={reload}
                className="text-sm font-semibold text-red-700 underline bg-transparent border-none cursor-pointer"
              >
                Thử lại
              </button>
            </div>
          )}

          {!complexId && !loading && !error && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-6 text-center text-amber-800">
              Tài khoản chưa được gán tổ hợp. Liên hệ Admin để được phê duyệt.
            </div>
          )}

          {complexId && !loading && <Outlet context={{ complexId }} />}
        </main>
      </div>
    </div>
  );
}
