import { Link, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { ArrowLeft, ShoppingBag, Store } from 'lucide-react'
import ProSportLogo from '../components/ui/ProSportLogo'

const navLinks = [
  { path: '/gear/catalog', label: 'Danh mục' },
]

export default function GearLayout({ children }) {
  const location = useLocation()
  const { cartCount } = useCart()
  const isActive = (path) => location.pathname.startsWith(path)

  return (
    <div className="min-h-screen flex flex-col bg-background-base text-foreground font-sans relative overflow-hidden">
      {/* ─── Ambient Background System ─── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#0a0a0f_0%,#050506_50%,#020203_100%)]" />
        <div className="absolute inset-0 bg-noise" />
        <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[1200px] h-[800px] bg-[#5E6AD2]/10 blur-[150px] rounded-full mix-blend-screen pointer-events-none" />
      </div>

      {/* Top Navbar */}
      <header className="h-16 bg-background-base/50 backdrop-blur-md border-b border-border-default flex items-center px-6 md:px-10 gap-6 sticky top-0 z-[100]">
        <div className="flex items-center gap-6">
          <ProSportLogo size="sm" iconOnly className="hidden sm:inline-flex" />
          <Link to="/apex" className="w-9 h-9 rounded-lg flex items-center justify-center text-foreground-muted hover:text-[var(--theme-primary)] hover:bg-[var(--theme-surface)] transition-colors" title="Quay lại">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <Link to="/gear/catalog" className="text-lg font-semibold tracking-tight text-[var(--theme-primary)] flex items-center gap-2">
            <Store className="w-5 h-5 text-[#5E6AD2]" />
            PRO GEAR
          </Link>
        </div>

        <nav className="hidden md:flex gap-6 ml-auto h-full items-center">
          {navLinks.map(link => (
            <Link key={link.path} to={link.path} className={`text-sm font-medium transition-colors relative ${
              isActive(link.path)
                ? 'text-[var(--theme-primary)] after:absolute after:-bottom-[22px] after:left-0 after:right-0 after:h-0.5 after:bg-[#5E6AD2] after:shadow-[0_0_8px_rgba(94,106,210,0.8)]'
                : 'text-foreground-muted hover:text-foreground'
            }`}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4 ml-auto md:ml-4">
          <Link to="/gear/cart" className="flex items-center gap-2 px-4 h-9 bg-[var(--theme-surface)] border border-border-default rounded-lg text-foreground-muted hover:bg-white/[0.06] hover:text-[var(--theme-primary)] font-medium transition-colors relative" aria-label="Giỏ hàng">
            <ShoppingBag className="w-4 h-4 text-foreground-muted" />
            <span className="hidden sm:inline text-sm">Giỏ hàng</span>
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#5E6AD2] text-[var(--theme-primary)] w-4 h-4 flex items-center justify-center rounded-full text-[10px] font-bold shadow-[0_0_8px_rgba(94,106,210,0.6)]">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </header>

      <main className="flex-1 relative p-6 md:p-10 z-10">
        <div className="max-w-[1400px] mx-auto">
          {children}
        </div>
      </main>

      <footer className="border-t border-border-default py-8 px-10 flex flex-col md:flex-row gap-6 items-center justify-between text-foreground-muted relative z-10">
        <ProSportLogo size="sm" subtitle="Gear" />
        <p className="text-sm font-medium text-foreground-muted">Trang bị cho trận đấu của bạn.</p>
      </footer>
    </div>
  )
}
