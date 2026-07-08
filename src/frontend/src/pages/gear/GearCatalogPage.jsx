import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import GearLayout from '../../layouts/GearLayout'
import { equipmentApi } from '../../api/equipmentApi'
import { useCart } from '../../context/CartContext'
import { useToast } from '../../components/Toast'
import { Plus, CheckSquare, Square, Frown, Swords, Footprints, Shirt, Circle, Briefcase, Shield } from 'lucide-react'
import PageLoader from '../../components/ui/PageLoader'
import EmptyState from '../../components/ui/EmptyState'

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
    <GearLayout>
      <div className="font-sans">

        {/* HEADER */}
        <div className="mb-10 max-w-2xl mx-auto text-center">
          <p className="label-mono text-foreground-muted mb-4">{'// Cửa hàng chính thức'}</p>
          <h1 className="font-heading text-4xl md:text-5xl uppercase tracking-tight text-foreground mb-4">Danh mục thiết bị</h1>
          <p className="text-[15px] text-foreground-muted">Khám phá dụng cụ cao cấp cho cầu lông và pickleball.</p>
        </div>

        {/* CATEGORY CHIPS */}
        <div className="mb-10 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => setSelectedItems([])}
            className={`px-5 h-10 text-xs font-extrabold uppercase tracking-[0.05em] rounded-[2px] border-2 transition-colors ${selectedItems.length === 0 ? 'bg-ink text-paper border-ink' : 'bg-transparent text-foreground border-border-hover hover:border-foreground'}`}
          >
            Tất cả
          </button>
          {itemTypes.map(it => (
            <button
              key={it}
              onClick={() => toggle(selectedItems, setSelectedItems, it)}
              className={`px-5 h-10 text-xs font-extrabold uppercase tracking-[0.05em] rounded-[2px] border-2 flex items-center gap-2 transition-colors ${selectedItems.includes(it) ? 'bg-ink text-paper border-ink' : 'bg-transparent text-foreground border-border-hover hover:border-foreground'}`}
            >
              <span>{itemTypeIcons[it]}</span>
              {itemTypeLabels[it] || it}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-10 items-start">

          {/* SIDEBAR FILTERS */}
          <aside className="card-base sticky top-24 lg:top-28">
            <h3 className="label-mono text-foreground mb-6">Bộ lọc</h3>

            <div className="mb-7">
              <h4 className="font-sans font-extrabold text-[13px] uppercase text-foreground mb-3">Môn thi đấu</h4>
              <div className="flex flex-col gap-2">
                {sports.map(s => (
                  <button
                    key={s}
                    onClick={() => toggle(selectedSports, setSelectedSports, s)}
                    className="flex items-center gap-2.5 text-left font-medium text-sm text-foreground hover:text-accent transition-colors py-1"
                  >
                    {selectedSports.includes(s) ? <CheckSquare className="w-4 h-4 text-accent" /> : <Square className="w-4 h-4 text-foreground-muted" />}
                    {sportLabels[s] || s}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-7">
              <h4 className="font-sans font-extrabold text-[13px] uppercase text-foreground mb-3">Tình trạng</h4>
              <div className="flex flex-col gap-2">
                {conditions.map(c => (
                  <button
                    key={c}
                    onClick={() => toggle(selectedConds, setSelectedConds, c)}
                    className="flex items-center gap-2.5 text-left font-medium text-sm text-foreground hover:text-accent transition-colors py-1"
                  >
                    {selectedConds.includes(c) ? <CheckSquare className="w-4 h-4 text-accent" /> : <Square className="w-4 h-4 text-foreground-muted" />}
                    {conditionLabels[c] || c}
                  </button>
                ))}
              </div>
            </div>

            <button onClick={handleReset} className="btn-outline w-full">
              Đặt lại bộ lọc
            </button>
          </aside>

          {/* MAIN PRODUCT GRID */}
          <div className="flex flex-col gap-6">

            {/* Top Toolbar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b-2 border-border-strong pb-4">
              <div className="text-sm font-semibold text-foreground">
                Hiển thị <strong>{filtered.length}</strong> sản phẩm
              </div>

              <div className="flex items-center gap-3">
                <span className="label-mono text-foreground-muted">Sắp xếp</span>
                <select
                  value={sort}
                  onChange={e => setSort(e.target.value)}
                  className="bg-transparent border-none text-sm font-semibold text-foreground outline-none cursor-pointer hover:text-accent transition-colors"
                >
                  <option value="recommended" className="bg-surface text-foreground">Gợi ý</option>
                  <option value="price-asc" className="bg-surface text-foreground">Giá: thấp → cao</option>
                  <option value="price-desc" className="bg-surface text-foreground">Giá: cao → thấp</option>
                  <option value="newest" className="bg-surface text-foreground">Mới nhất</option>
                </select>
              </div>
            </div>

            {/* Grid */}
            {loading ? (
              <PageLoader message="Đang tải thiết bị..." />
            ) : loadError ? (
              <div className="card-base p-16 text-center">
                <p className="text-danger font-medium mb-4">{loadError}</p>
                <button onClick={fetchProducts} className="btn-primary">Thử lại</button>
              </div>
            ) : filtered.length === 0 ? (
              <EmptyState
                icon={<Frown className="w-7 h-7" />}
                title="Không tìm thấy sản phẩm"
                subtitle="Thử điều chỉnh bộ lọc để xem thêm kết quả."
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filtered.map(p => (
                  <Link to={`/gear/catalog/${p.id}`} key={p.id} className="border-2 border-border-strong bg-surface rounded-[2px] flex flex-col overflow-hidden group">
                    {/* Image Area */}
                    <div className="relative aspect-square border-b-2 border-border-strong overflow-hidden bg-background-base">
                      <span className="absolute top-3 left-3 label-mono bg-ink text-paper px-2.5 py-1 z-10">
                        {badgeLabels[p.badge] || p.badge}
                      </span>
                      <img src={p.img} alt={p.name} className="w-full h-full object-cover" />
                    </div>

                    {/* Info Area */}
                    <div className="p-5 flex-1 flex flex-col">
                      <p className="label-mono text-foreground-muted mb-2">{sportLabels[p.sport] || p.sport}</p>
                      <h3 className="font-sans font-extrabold text-[15px] text-foreground mb-4 flex-1">{p.name}</h3>

                      <div className="flex items-center justify-between">
                        <span className="font-heading text-lg text-foreground">{p.priceLabel}</span>
                        <button
                          onClick={(e) => handleQuickAddToCart(e, p)}
                          className="w-9 h-9 flex items-center justify-center bg-ink text-paper hover:bg-accent hover:text-ink rounded-[2px] transition-colors"
                          title="Thêm vào giỏ"
                        >
                          <Plus className="w-4 h-4" />
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
    </GearLayout>
  )
}
