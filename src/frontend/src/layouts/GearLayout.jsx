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
    <div className="min-h-screen flex flex-col bg-background-base text-foreground font-sans">
      {/* Top Navbar */}
      <header className="h-[76px] bg-ink border-b border-white/10 flex items-center px-6 md:px-10 gap-6 sticky top-0 z-[100]">
        <div className="flex items-center gap-6">
          <ProSportLogo size="sm" variant="light" iconOnly className="hidden sm:inline-flex" />
          <Link to="/apex" className="w-9 h-9 rounded-[2px] flex items-center justify-center text-paper/60 hover:text-paper transition-colors" title="Quay lại">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <Link to="/gear/catalog" className="font-heading text-lg uppercase tracking-tight text-paper flex items-center gap-2 no-underline">
            <Store className="w-5 h-5 text-accent" />
            Pro Gear
          </Link>
        </div>

        <nav className="hidden md:flex gap-6 ml-auto h-full items-center">
          {navLinks.map(link => (
            <Link key={link.path} to={link.path} className={`font-bold text-[13px] uppercase tracking-[0.06em] no-underline transition-colors ${
              isActive(link.path)
                ? 'text-paper border-b-2 border-paper pb-1'
                : 'text-paper/50 hover:text-paper'
            }`}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4 ml-auto md:ml-4">
          <Link to="/gear/cart" className="flex items-center gap-2 px-4 h-9 bg-transparent border-2 border-white/20 rounded-[2px] text-paper hover:border-paper font-bold text-[12px] uppercase tracking-[0.04em] transition-colors relative" aria-label="Giỏ hàng">
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Giỏ hàng</span>
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-accent text-ink w-4 h-4 flex items-center justify-center rounded-full text-[10px] font-bold">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </header>

      <main className="flex-1 p-6 md:p-10">
        <div className="max-w-[1400px] mx-auto">
          {children}
        </div>
      </main>

      <footer className="border-t border-border-default py-8 px-10 flex flex-col md:flex-row gap-6 items-center justify-between text-foreground-muted">
        <ProSportLogo size="sm" subtitle="Gear" />
        <p className="text-sm font-medium text-foreground-muted">Trang bị cho trận đấu của bạn.</p>
      </footer>
    </div>
  )
}
