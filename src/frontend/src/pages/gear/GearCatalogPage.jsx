import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import GearLayout from '../../layouts/GearLayout'
import { equipmentApi } from '../../api/equipmentApi'
import { useCart } from '../../context/CartContext'
import { useToast } from '../../components/Toast'
import { ShoppingCart, RotateCcw, Frown, Swords, Footprints, Shirt, Circle, Briefcase, Shield } from 'lucide-react'
import PageLoader from '../../components/ui/PageLoader'
import EmptyState from '../../components/ui/EmptyState'
import BaseCard from '../../components/ui/BaseCard'
import BaseButton from '../../components/ui/BaseButton'
import { resolveProductImage, CATEGORY_FALLBACKS } from '../../utils/productImages'

const itemTypeIcons = {
  'Racket':        <Swords size={14} />,
  'Footwear':      <Footprints size={14} />,
  'Apparel':       <Shirt size={14} />,
  'Ball / Birdie': <Circle size={14} />,
  'Accessories':   <Briefcase size={14} />,
  'Protection':    <Shield size={14} />,
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

const sports    = ['Badminton', 'Pickleball']
const itemTypes = ['Racket', 'Footwear', 'Apparel', 'Ball / Birdie', 'Accessories', 'Protection']
const conditions = ['Premium', 'New', 'Demo']

export default function GearCatalogPage() {
  const { addToCart } = useCart()
  const { addToast } = useToast()
  const [products, setProducts]         = useState([])
  const [loading, setLoading]           = useState(true)
  const [loadError, setLoadError]       = useState(null)
  const [selectedSports,  setSelectedSports]  = useState([])
  const [selectedItems,   setSelectedItems]   = useState([])
  const [selectedConds,   setSelectedConds]   = useState([])
  const [sort, setSort]                 = useState('recommended')
  const [activeTab, setActiveTab]       = useState('All')

  useEffect(() => { fetchProducts() }, [])

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
        const category = p.category || 'Accessories'
        return {
          id: p.equipmentId,
          name: displayName.length > 60 ? `${displayName.slice(0, 57)}...` : displayName,
          sport: p.type || p.sportType || 'Badminton',
          itemType: category,
          badge: price > 4000000 ? 'Premium' : 'New',
          price,
          priceLabel: `${price.toLocaleString('vi-VN')}đ`,
          img: resolveProductImage(displayName, category, p.imageUrl),
          stockQuantity: p.stockQuantity ?? 0,
        }
      })
      setProducts(mappedData)
    } catch (error) {
      setLoadError(typeof error === 'string' ? error : 'Không tải được danh mục thiết bị.')
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  const toggle = (arr, setArr, val) =>
    setArr(arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val])

  function handleReset() {
    setSelectedSports([])
    setSelectedItems([])
    setSelectedConds([])
    setActiveTab('All')
  }

  async function handleQuickAddToCart(e, product) {
    e.preventDefault(); e.stopPropagation()
    try {
      const res = await addToCart(product.id, 1)
      if (res.success) {
        addToast(`Đã thêm ${product.name} vào giỏ`, 'success')
      } else {
        addToast(res.message, 'error')
      }
    } catch {
      addToast('Lỗi khi thêm vào giỏ hàng', 'error')
    }
  }

  // Apply tab → itemType filter
  const effectiveItems = activeTab === 'All' ? selectedItems : [activeTab]

  let filtered = products.filter(p => {
    const matchSport = selectedSports.length === 0 || selectedSports.includes(p.sport)
    const matchItem  = effectiveItems.length === 0 || effectiveItems.includes(p.itemType)
    const matchCond  = selectedConds.length === 0 || selectedConds.includes(p.badge)
    return matchSport && matchItem && matchCond
  })

  if (sort === 'price-asc')  filtered = [...filtered].sort((a,b) => a.price - b.price)
  if (sort === 'price-desc') filtered = [...filtered].sort((a,b) => b.price - a.price)
  if (sort === 'newest')     filtered = [...filtered].sort((a,b) => b.id - a.id)

  return (
    <GearLayout>
      <div className="font-sans bg-[#F8F9FA] min-h-screen">

        {/* ── HERO BANNER — light & seamless ── */}
        <div className="text-center px-8 pt-14 pb-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#14b8a6] m-0 mb-4">
            — Cửa hàng chính thức —
          </p>
          <h1 className="font-heading text-4xl md:text-5xl uppercase tracking-tight text-[#0f172a] m-0 mb-3">
            Danh mục thiết bị
          </h1>
          <p className="text-[15px] text-gray-500 m-0 max-w-lg mx-auto">
            Khám phá dụng cụ cao cấp cho cầu lông và pickleball.
          </p>
        </div>

        {/* ── PILL CATEGORY TABS ── */}
        <div className="px-6 md:px-10 pb-6">
          <div className="max-w-[1400px] mx-auto flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => { setActiveTab('All'); setSelectedItems([]) }}
              className={`px-5 h-9 rounded-full text-[13px] font-bold transition-all cursor-pointer border ${
                activeTab === 'All'
                  ? 'bg-[#0f172a] text-white border-[#0f172a] shadow-sm'
                  : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              Tất cả
            </button>
            {itemTypes.map(it => (
              <button
                key={it}
                onClick={() => { setActiveTab(it); setSelectedItems([]) }}
                className={`px-5 h-9 rounded-full text-[13px] font-bold transition-all cursor-pointer border flex items-center gap-2 ${
                  activeTab === it
                    ? 'bg-[#0f172a] text-white border-[#0f172a] shadow-sm'
                    : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                {itemTypeIcons[it]}
                {itemTypeLabels[it] || it}
              </button>
            ))}
          </div>
        </div>

        <div className="max-w-[1400px] mx-auto px-4 md:px-10 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8 items-start">

            {/* ── SIDEBAR FILTERS ── */}
            <BaseCard as="aside" density="comfortable" noPad className="p-5 lg:sticky lg:top-20">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-[12px] font-bold uppercase tracking-widest text-gray-900 m-0">BỘ LỌC</h3>
                <button
                  onClick={handleReset}
                  className="flex items-center gap-1.5 bg-transparent border-0 text-[11px] text-gray-400 hover:text-gray-700 cursor-pointer font-medium transition-colors"
                >
                  <RotateCcw size={11} /> Đặt lại
                </button>
              </div>

              {/* Môn thi đấu */}
              <div className="mb-5 pb-5 border-b border-gray-100">
                <h4 className="text-[11px] font-bold text-gray-400 mb-3 m-0 uppercase tracking-widest">Môn thi đấu</h4>
                <div className="flex flex-col gap-2.5">
                  {sports.map(s => {
                    const checked = selectedSports.includes(s)
                    return (
                      <button key={s} onClick={() => toggle(selectedSports, setSelectedSports, s)} className="flex items-center gap-3 text-left cursor-pointer bg-transparent border-0 p-0 group">
                        <span className={`w-4 h-4 rounded-[4px] border-2 flex items-center justify-center shrink-0 transition-colors ${checked ? 'border-[#14b8a6] bg-[#14b8a6]' : 'border-gray-300 group-hover:border-gray-400'}`}>
                          {checked && <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><path d="M1 4L3 6L7 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                        </span>
                        <span className={`text-[13px] transition-colors ${checked ? 'font-bold text-gray-900' : 'text-gray-500 group-hover:text-gray-800'}`}>{sportLabels[s] || s}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Tình trạng */}
              <div className="mb-5">
                <h4 className="text-[11px] font-bold text-gray-400 mb-3 m-0 uppercase tracking-widest">Tình trạng</h4>
                <div className="flex flex-col gap-2.5">
                  {conditions.map(c => {
                    const val = c === 'Demo' ? 'New' : c
                    const checked = selectedConds.includes(val)
                    return (
                      <button key={c} onClick={() => toggle(selectedConds, setSelectedConds, val)} className="flex items-center gap-3 text-left cursor-pointer bg-transparent border-0 p-0 group">
                        <span className={`w-4 h-4 rounded-[4px] border-2 flex items-center justify-center shrink-0 transition-colors ${checked ? 'border-[#14b8a6] bg-[#14b8a6]' : 'border-gray-300 group-hover:border-gray-400'}`}>
                          {checked && <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><path d="M1 4L3 6L7 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                        </span>
                        <span className={`text-[13px] transition-colors ${checked ? 'font-bold text-gray-900' : 'text-gray-500 group-hover:text-gray-800'}`}>{conditionLabels[c] || c}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </BaseCard>

            {/* ── MAIN PRODUCT GRID ── */}
            <div className="flex flex-col gap-6">

              {/* Toolbar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <p className="text-[13px] text-gray-500 m-0">
                  Hiển thị <strong className="text-gray-900">{filtered.length}</strong> sản phẩm
                </p>
                <div className="flex items-center gap-2 bg-white rounded-[8px] border border-gray-200 px-3 h-9">
                  <span className="text-[12px] text-gray-400 font-bold uppercase tracking-wider">Sắp xếp</span>
                  <select
                    value={sort}
                    onChange={e => setSort(e.target.value)}
                    className="bg-transparent border-none text-[13px] font-bold text-gray-700 outline-none cursor-pointer"
                  >
                    <option value="recommended">Gợi ý</option>
                    <option value="price-asc">Giá: thấp → cao</option>
                    <option value="price-desc">Giá: cao → thấp</option>
                    <option value="newest">Mới nhất</option>
                  </select>
                </div>
              </div>

              {/* Grid */}
              {loading ? (
                <PageLoader message="Đang tải thiết bị..." />
              ) : loadError ? (
                <BaseCard density="comfortable" noPad className="p-16 text-center">
                  <p className="text-red-500 font-medium mb-4">{loadError}</p>
                  <BaseButton onClick={fetchProducts} variant="primary">Thử lại</BaseButton>
                </BaseCard>
              ) : filtered.length === 0 ? (
                <EmptyState
                  icon={<Frown className="w-7 h-7" />}
                  title="Không tìm thấy sản phẩm"
                  subtitle="Thử điều chỉnh bộ lọc để xem thêm kết quả."
                  action={<BaseButton onClick={handleReset} variant="primary">Xóa bộ lọc</BaseButton>}
                />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filtered.map(p => (
                    <Link
                      to={`/gear/catalog/${p.id}`}
                      key={p.id}
                      className="bg-white rounded-[12px] shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-gray-100 flex flex-col overflow-hidden group transition-all hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(0,0,0,0.10)] relative no-underline"
                    >
                      {/* Badge */}
                      <span className={`absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        p.badge === 'Premium'
                          ? 'bg-teal-50 text-[#14b8a6] border border-teal-100'
                          : 'bg-teal-50 text-[#14b8a6] border border-teal-100'
                      }`}>
                        {p.badge === 'Premium' ? 'Cao Cấp' : 'Mới'}
                      </span>

                      {/* Product image — studio style */}
                      <div className="relative w-full h-52 bg-gray-50 flex items-center justify-center p-6 overflow-hidden">
                        <img
                          src={p.img}
                          alt={p.name}
                          className="max-w-full max-h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
                          onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = CATEGORY_FALLBACKS[p.itemType] || CATEGORY_FALLBACKS.Accessories }}
                        />
                      </div>

                      {/* Info */}
                      <div className="p-5 flex-1 flex flex-col border-t border-gray-50">
                        <p className="text-[10px] font-bold uppercase text-gray-400 m-0 mb-1.5 tracking-[0.12em]">
                          {sportLabels[p.sport] || p.sport} · {itemTypeLabels[p.itemType] || p.itemType}
                        </p>
                        <h3 className="font-bold text-[14px] text-gray-900 m-0 mb-4 flex-1 leading-snug">{p.name}</h3>

                        <div className="flex items-end justify-between mt-auto">
                          <span className="text-[20px] font-bold text-gray-900 leading-none">{p.priceLabel}</span>
                          <button
                            onClick={(e) => handleQuickAddToCart(e, p)}
                            className="w-11 h-11 rounded-full bg-[#14b8a6] hover:bg-[#0f9e8c] active:scale-95 text-white flex items-center justify-center transition-all shadow-[0_4px_14px_rgba(20,184,166,0.3)] cursor-pointer border-0"
                            title="Thêm vào giỏ"
                          >
                            <ShoppingCart size={16} />
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
      </div>
    </GearLayout>
  )
}
