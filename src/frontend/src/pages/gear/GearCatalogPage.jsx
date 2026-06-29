import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import ApexLayout from '../../layouts/ApexLayout'
import { equipmentApi } from '../../api/equipmentApi'
import { useCart } from '../../context/CartContext'
import { useToast } from '../../components/Toast'
import { Plus, CheckSquare, Square, Frown, Swords, Footprints, Shirt, Circle, Briefcase, Shield } from 'lucide-react'
import PageLoader from '../../components/ui/PageLoader'

const itemTypeIcons = {
  'Racket':       <Swords size={16} />,
  'Footwear':     <Footprints size={16} />,
  'Apparel':      <Shirt size={16} />,
  'Ball / Birdie':<Circle size={16} />,
  'Accessories':  <Briefcase size={16} />,
  'Protection':   <Shield size={16} />,
}

const itemTypeLabels = {
  'Racket': 'Vợt',
  'Footwear': 'Giày',
  'Apparel': 'Trang phục',
  'Ball / Birdie': 'Cầu / Bóng',
  'Accessories': 'Phụ kiện',
  'Protection': 'Bảo hộ',
}

const sportLabels = { Badminton: 'Cầu lông', Pickleball: 'Pickleball' }
const conditionLabels = { Premium: 'Cao cấp', New: 'Mới', Demo: 'Dùng thử' }
const badgeLabels = { Premium: 'Cao cấp', New: 'Mới' }

const sports    = ['Badminton', 'Pickleball']
const itemTypes = ['Racket', 'Footwear', 'Apparel', 'Ball / Birdie', 'Accessories', 'Protection']
const conditions = ['Premium', 'New', 'Demo']

const DEFAULT_SPORTS    = []
const DEFAULT_ITEMS     = []
const DEFAULT_CONDS     = []
const DEFAULT_PRICE_MIN = ''
const DEFAULT_PRICE_MAX = ''

export default function GearCatalogPage() {
  const { addToCart } = useCart()
  const { addToast } = useToast()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(null)
  const [selectedSports,  setSelectedSports]  = useState(DEFAULT_SPORTS)
  const [selectedItems,   setSelectedItems]   = useState(DEFAULT_ITEMS)
  const [selectedConds,   setSelectedConds]   = useState(DEFAULT_CONDS)
  const [priceMin,        setPriceMin]        = useState(DEFAULT_PRICE_MIN)
  const [priceMax,        setPriceMax]        = useState(DEFAULT_PRICE_MAX)
  const [sort,            setSort]            = useState('recommended')

  useEffect(() => {
    fetchProducts()
  }, [])

  async function fetchProducts() {
    try {
      setLoading(true)
      setLoadError(null)
      const response = await equipmentApi.getAll()

      if (response.statusCode !== 200) {
        setLoadError(response.message || 'Không tải được danh mục thiết bị.')
        setProducts([])
        return
      }

      const list = Array.isArray(response.data) ? response.data : (response.data?.items || [])
      const mappedData = list.map(p => {
        const displayName = (p.name || p.equipmentName || p.description || `Thiết bị #${p.equipmentId}`).trim()
        const price = Number(p.retailPrice ?? p.price ?? 0)
        return {
          id: p.equipmentId,
          name: displayName.length > 60 ? `${displayName.slice(0, 57)}...` : displayName,
          sport: p.type || p.sportType || 'Badminton',
          itemType: p.category || 'Accessories',
          badge: price > 4000000 ? 'Premium' : 'New',
          price,
          priceLabel: `${price.toLocaleString('vi-VN')}đ`,
          img: p.imageUrl || 'https://images.unsplash.com/photo-1617083934551-1af7da84de49?w=400&q=80',
          stockQuantity: p.stockQuantity ?? 0,
        }
      })
      setProducts(mappedData)
    } catch (error) {
      console.error('Error fetching equipment:', error)
      setLoadError(typeof error === 'string' ? error : 'Không tải được danh mục thiết bị.')
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  const toggle = (arr, setArr, val) =>
    setArr(arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val])

  function handleReset() {
    setSelectedSports(DEFAULT_SPORTS)
    setSelectedItems(DEFAULT_ITEMS)
    setSelectedConds(DEFAULT_CONDS)
    setPriceMin(DEFAULT_PRICE_MIN)
    setPriceMax(DEFAULT_PRICE_MAX)
  }

  // Filter + sort
  let filtered = products.filter(p => {
    const matchSport = selectedSports.length === 0 || selectedSports.includes(p.sport)
    const matchItem  = selectedItems.length === 0 || selectedItems.includes(p.itemType)
    const matchCond  = selectedConds.length === 0 || (p.badge && selectedConds.includes(p.badge === 'New' ? 'New' : p.badge))
    const matchMin   = priceMin === '' || p.price >= Number(priceMin)
    const matchMax   = priceMax === '' || p.price <= Number(priceMax)
    return matchSport && matchItem && matchCond && matchMin && matchMax
  })

  async function handleQuickAddToCart(e, product) {
    e.preventDefault(); e.stopPropagation();
    try {
      const res = await addToCart(product.id, 1);
      if (res.success) {
        addToast(`Đã thêm ${product.name} vào giỏ`, 'success');
      } else {
        addToast(res.message, 'error');
      }
    } catch (error) {
      addToast('Lỗi khi thêm vào giỏ hàng', 'error');
    }
  };

  if (sort === 'price-asc')  filtered = [...filtered].sort((a,b) => a.price - b.price)
  if (sort === 'price-desc') filtered = [...filtered].sort((a,b) => b.price - a.price)
  if (sort === 'newest')     filtered = [...filtered].sort((a,b) => b.id - a.id)

  return (
    <ApexLayout>
      <div className="font-sans relative z-10 animate-fade-up">
        
        {/* HEADER / SIGNBOARD */}
        <div className="mb-12 max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#5E6AD2]/10 border border-[#5E6AD2]/20 rounded-full text-[#5E6AD2] text-xs font-mono tracking-widest uppercase mb-4 shadow-[0_0_15px_rgba(94,106,210,0.3)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#5E6AD2] animate-pulse" />
            Cửa hàng chính thức
          </div>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight gradient-text mb-4">Danh mục thiết bị</h1>
          <p className="text-lg text-foreground-muted">Khám phá dụng cụ cao cấp cho cầu lông và pickleball.</p>
        </div>

        {/* CATEGORY CHIPS */}
        <div className="mb-10 flex flex-wrap justify-center gap-3">
          <button 
            onClick={() => setSelectedItems([])} 
            className={`px-4 py-2 text-sm font-medium transition-all duration-200 rounded-xl border ${selectedItems.length === 0 ? 'bg-[#5E6AD2] text-[var(--theme-primary)] border-[#5E6AD2] shadow-[0_4px_15px_rgba(94,106,210,0.4)]' : 'bg-white/[0.02] text-foreground-muted border-border-default hover:bg-white/[0.06] hover:text-[var(--theme-primary)]'}`}
          >
            Tất cả
          </button>
          {itemTypes.map(it => (
            <button 
              key={it}
              onClick={() => toggle(selectedItems, setSelectedItems, it)}
              className={`px-4 py-2 text-sm font-medium transition-all duration-200 flex items-center gap-2 rounded-xl border ${selectedItems.includes(it) ? 'bg-[#5E6AD2] text-[var(--theme-primary)] border-[#5E6AD2] shadow-[0_4px_15px_rgba(94,106,210,0.4)]' : 'bg-white/[0.02] text-foreground-muted border-border-default hover:bg-white/[0.06] hover:text-[var(--theme-primary)]'}`}
            >
              <span>{itemTypeIcons[it]}</span>
              {itemTypeLabels[it] || it}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-10">
          
          {/* SIDEBAR FILTERS */}
          <aside className="card-base p-6 h-fit sticky top-28">
            <h3 className="text-xs font-mono tracking-widest text-foreground-muted uppercase mb-6 flex items-center gap-2">
              <span className="w-1 h-3 bg-[#5E6AD2] rounded-full" />
              Bộ lọc
            </h3>
            
            <div className="mb-8">
              <h4 className="text-sm font-semibold text-foreground mb-3">Môn thi đấu</h4>
              <div className="flex flex-col gap-2">
                {sports.map(s => (
                  <button 
                    key={s}
                    onClick={() => toggle(selectedSports, setSelectedSports, s)}
                    className="flex items-center gap-3 text-left font-medium text-sm text-foreground-muted hover:text-[var(--theme-primary)] transition-colors py-1 group"
                  >
                    <div className="text-foreground-muted group-hover:text-[#5E6AD2] transition-colors">
                      {selectedSports.includes(s) ? <CheckSquare className="w-4 h-4 text-[#5E6AD2]" /> : <Square className="w-4 h-4" />}
                    </div>
                    {sportLabels[s] || s}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <h4 className="text-sm font-semibold text-foreground mb-3">Tình trạng</h4>
              <div className="flex flex-col gap-2">
                {conditions.map(c => (
                  <button 
                    key={c}
                    onClick={() => toggle(selectedConds, setSelectedConds, c)}
                    className="flex items-center gap-3 text-left font-medium text-sm text-foreground-muted hover:text-[var(--theme-primary)] transition-colors py-1 group"
                  >
                    <div className="text-foreground-muted group-hover:text-[#5E6AD2] transition-colors">
                      {selectedConds.includes(c) ? <CheckSquare className="w-4 h-4 text-[#5E6AD2]" /> : <Square className="w-4 h-4" />}
                    </div>
                    {conditionLabels[c] || c}
                  </button>
                ))}
              </div>
            </div>

            <button onClick={handleReset} className="w-full py-2.5 text-sm font-medium bg-[var(--theme-surface)] text-foreground-muted border border-border-default hover:bg-white/[0.06] hover:text-[var(--theme-primary)] transition-colors rounded-lg">
              Đặt lại bộ lọc
            </button>
          </aside>

          {/* MAIN PRODUCT GRID */}
          <div className="flex flex-col gap-6">
            
            {/* Top Toolbar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 card-base !py-3 !px-5">
              <div className="text-sm font-medium text-foreground-muted">
                Hiển thị <span className="text-[var(--theme-primary)]">{filtered.length}</span> sản phẩm
              </div>
              
              <div className="flex items-center gap-3">
                <span className="text-sm text-foreground-muted font-medium">Sắp xếp</span>
                <select 
                  value={sort} 
                  onChange={e => setSort(e.target.value)}
                  className="bg-transparent border-none text-sm font-medium text-[var(--theme-primary)] outline-none cursor-pointer hover:text-[#5E6AD2] transition-colors focus:ring-0 appearance-none"
                >
                  <option value="recommended" className="bg-background-base">Gợi ý</option>
                  <option value="price-asc" className="bg-background-base">Giá: thấp → cao</option>
                  <option value="price-desc" className="bg-background-base">Giá: cao → thấp</option>
                  <option value="newest" className="bg-background-base">Mới nhất</option>
                </select>
              </div>
            </div>

            {/* Grid */}
            {loading ? (
              <PageLoader message="Đang tải thiết bị..." />
            ) : loadError ? (
              <div className="card-base p-16 text-center">
                <p className="text-red-400 font-medium mb-4">{loadError}</p>
                <button onClick={fetchProducts} className="btn-primary">Thử lại</button>
              </div>
            ) : filtered.length === 0 ? (
              <div className="card-base p-16 text-center flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-[var(--theme-surface)] border border-border-default rounded-2xl flex items-center justify-center mb-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
                  <Frown className="w-8 h-8 text-foreground-muted" />
                </div>
                <h2 className="text-xl font-semibold text-foreground mb-2 tracking-tight">Không tìm thấy sản phẩm</h2>
                <p className="text-foreground-muted text-sm">Thử điều chỉnh bộ lọc để xem thêm kết quả.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filtered.map(p => (
                  <Link to={`/gear/catalog/${p.id}`} key={p.id} className="card-base group flex flex-col !p-0 overflow-hidden hover:-translate-y-1 transition-transform duration-300">
                    {/* Badge */}
                    <div className="absolute top-3 left-3 bg-black/40 backdrop-blur-md text-[var(--theme-primary)] font-mono text-[10px] tracking-widest uppercase px-2.5 py-1 border border-border-default rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.5)] z-10">
                      {badgeLabels[p.badge] || p.badge}
                    </div>
                    
                    {/* Image Area */}
                    <div className="h-[240px] bg-white/[0.02] border-b border-border-default p-8 flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/[0.02]" />
                      <img src={p.img} alt={p.name} className="w-full h-full object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] group-hover:scale-110 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] relative z-10" />
                    </div>
                    
                    {/* Info Area */}
                    <div className="p-5 flex-1 flex flex-col relative bg-gradient-to-b from-transparent to-white/[0.01]">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] bg-white/[0.06] text-foreground-muted font-mono uppercase tracking-widest px-2 py-0.5 rounded border border-border-default">{sportLabels[p.sport] || p.sport}</span>
                      </div>
                      <h3 className="text-lg font-semibold text-foreground mb-1 leading-snug flex-1 group-hover:text-[#5E6AD2] transition-colors">{p.name}</h3>
                      
                      <div className="flex items-end justify-between mt-4">
                        <div>
                          <p className="text-xs text-foreground-muted font-medium mb-0.5">Giá thuê</p>
                          <p className="text-lg text-[var(--theme-primary)] font-semibold tracking-tight">{p.priceLabel}</p>
                        </div>
                        <button 
                          onClick={(e) => handleQuickAddToCart(e, p)}
                          className="w-10 h-10 flex items-center justify-center bg-[#5E6AD2] text-[var(--theme-primary)] hover:bg-[#6872D9] shadow-[0_4px_14px_rgba(94,106,210,0.4)] active:scale-95 transition-all rounded-xl"
                          title="Thêm vào giỏ"
                        >
                          <Plus className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </ApexLayout>
  )
}
