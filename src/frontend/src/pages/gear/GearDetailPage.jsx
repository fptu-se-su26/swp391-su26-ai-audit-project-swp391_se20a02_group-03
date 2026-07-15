import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import GearLayout from '../../layouts/GearLayout'
import { equipmentApi } from '../../api/equipmentApi'
import { useCart } from '../../context/CartContext'
import { useToast } from '../../components/Toast'
import { translateItemType, translateSport } from '../../utils/labels'
import PageLoader from '../../components/ui/PageLoader'
import EmptyState from '../../components/ui/EmptyState'
import { Minus, Plus, ArrowLeft, Frown, ShoppingCart, ShieldCheck } from 'lucide-react'
import { resolveProductImage, CATEGORY_FALLBACKS } from '../../utils/productImages'

function formatVND(amount) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount);
}

export default function GearDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const { addToast } = useToast()
  const [gear, setGear] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)

  useEffect(() => {
    async function fetchGearDetails() {
      try {
        setLoading(true)
        const response = await equipmentApi.getById(id)
        if (response.statusCode === 200) {
          setGear(response.data)
        }
      } catch (error) {
        console.error('Error fetching gear details:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchGearDetails()
  }, [id])

  async function handleAddToCart() {
    setIsAdding(true)
    try {
      const res = await addToCart(parseInt(id), quantity, null)
      if (res.success) {
        addToast(`Đã thêm ${quantity}x ${gear.name} vào giỏ`, 'success')
      } else {
        addToast(res.message, 'error')
      }
    } catch (error) {
      console.error('Add to cart error:', error)
      addToast('Lỗi hệ thống khi thêm vào giỏ hàng', 'error')
    } finally {
      setIsAdding(false)
    }
  }

  if (loading) return (
    <GearLayout>
      <div className="bg-[#F8F9FA] min-h-screen">
        <PageLoader message="Đang tải thông tin sản phẩm..." />
      </div>
    </GearLayout>
  )

  if (!gear) return (
    <GearLayout>
      <div className="bg-[#F8F9FA] min-h-screen flex items-center justify-center py-24">
        <div className="bg-white rounded-[16px] shadow-[0_2px_16px_rgba(0,0,0,0.06)] border border-gray-100 p-10 max-w-md w-full text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
                <Frown size={32} />
            </div>
            <h2 className="font-heading text-2xl uppercase tracking-tight text-[#0f172a] mb-4">Không tìm thấy thiết bị</h2>
            <p className="text-gray-500 mb-8 text-[14px]">Sản phẩm này có thể đã ngừng kinh doanh hoặc đường dẫn không đúng.</p>
            <button onClick={() => navigate('/gear/catalog')} className="bg-[#14b8a6] hover:bg-[#0f9e8c] text-white px-8 py-3 rounded-[8px] text-[13px] font-bold uppercase tracking-wide w-full transition-colors border-0 cursor-pointer shadow-[0_4px_14px_rgba(20,184,166,0.3)]">
                Về cửa hàng
            </button>
        </div>
      </div>
    </GearLayout>
  )

  const stock = gear.availableQuantity ?? gear.stockQuantity ?? 0
  const categoryLabel = `${translateSport(gear.type)} - ${translateItemType(gear.category)}`
  const productImage = resolveProductImage(gear.name, gear.category, gear.imageUrl)

  return (
    <GearLayout>
      <div className="font-sans bg-[#F8F9FA] min-h-screen pb-20">
        <div className="max-w-[1200px] mx-auto px-4 md:px-10 py-10">

          {/* ── BREADCRUMB ── */}
          <div className="mb-8 flex items-center gap-2 text-[12px] font-bold uppercase tracking-wider text-gray-400">
            <Link to="/gear/catalog" className="hover:text-[#14b8a6] transition-colors no-underline text-gray-400">
              Cửa tiệm
            </Link>
            <span>/</span>
            <span className="text-gray-500">{translateSport(gear.type)}</span>
            <span>/</span>
            <span className="text-gray-700">{translateItemType(gear.category)}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-start">

            {/* ── LEFT: IMAGE GALLERY ── */}
            <div className="relative aspect-square md:aspect-[4/5] rounded-[24px] bg-gray-50 border border-gray-100 flex items-center justify-center p-8 overflow-hidden group">
              {gear.retailPrice > 4000000 && (
                <span className="absolute top-6 left-6 bg-[#0f172a] text-white text-[11px] font-bold uppercase tracking-widest px-4 py-2 rounded-full z-10 shadow-lg">
                  Hàng Hiếm
                </span>
              )}
              <img
                src={productImage}
                alt={gear.name}
                className="w-full h-full object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-105"
                onError={e => { e.target.src = CATEGORY_FALLBACKS[gear.category] || CATEGORY_FALLBACKS.Accessories }}
              />
            </div>

            {/* ── RIGHT: PRODUCT INFO ── */}
            <div className="pt-2 md:pt-8 flex flex-col">
              
              {/* Category & Title */}
              <p className="text-[12px] font-bold uppercase tracking-widest text-[#14b8a6] mb-3 m-0">
                {categoryLabel}
              </p>
              <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl uppercase tracking-tight text-[#0f172a] mb-6 leading-[1.1] m-0">
                {gear.name}
              </h1>

              {/* Price */}
              <div className="mb-8">
                <span className="font-heading text-4xl lg:text-[42px] text-[#0f172a] tracking-tight">{formatVND(gear.retailPrice)}</span>
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-2 mb-8">
                <div className={`w-2 h-2 rounded-full ${stock > 0 ? 'bg-[#14b8a6]' : 'bg-red-500'}`}></div>
                <span className="text-[14px] text-gray-600 font-medium">
                  Tình trạng: <span className={stock > 0 ? 'text-[#14b8a6]' : 'text-red-500'}>Còn {stock} sản phẩm</span>
                </span>
              </div>

              {/* Divider */}
              <hr className="border-t border-gray-200/60 my-8 w-full" />

              {/* Description */}
              <div className="mb-10">
                <h3 className="text-[13px] font-bold uppercase tracking-widest text-[#0f172a] mb-4 m-0">Mô tả sản phẩm</h3>
                <p className="text-[15px] leading-[1.8] text-gray-500 m-0">
                  {gear.description || 'Sản phẩm này hiện chưa có mô tả chi tiết từ nhà sản xuất. Vui lòng liên hệ hỗ trợ để biết thêm thông tin.'}
                </p>
              </div>

              {/* Action Area */}
              <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                {/* Quantity Selector */}
                <div className="flex items-center bg-white border border-gray-200 rounded-full h-14 w-full sm:w-36 shrink-0 shadow-sm">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-full flex items-center justify-center text-gray-500 hover:text-[#0f172a] transition-colors bg-transparent border-0 cursor-pointer disabled:opacity-30 rounded-l-full"
                    disabled={quantity <= 1}
                  >
                    <Minus size={16} />
                  </button>
                  <span className="flex-1 flex items-center justify-center font-bold text-[16px] text-[#0f172a]">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(stock || 1, quantity + 1))}
                    className="w-12 h-full flex items-center justify-center text-gray-500 hover:text-[#0f172a] transition-colors bg-transparent border-0 cursor-pointer disabled:opacity-30 rounded-r-full"
                    disabled={quantity >= stock}
                  >
                    <Plus size={16} />
                  </button>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  disabled={isAdding || stock === 0}
                  className="flex-1 h-14 flex items-center justify-center gap-3 bg-[#14b8a6] hover:bg-[#0f9e8c] active:scale-[0.98] text-white rounded-full text-[14px] font-bold uppercase tracking-wider transition-all cursor-pointer border-0 shadow-[0_8px_24px_rgba(20,184,166,0.35)] disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100 disabled:hover:bg-[#14b8a6]"
                >
                  {isAdding ? (
                      <>
                          <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                          Đang thêm...
                      </>
                  ) : (
                      <>
                          <ShoppingCart size={18} />
                          Bỏ vào giỏ
                      </>
                  )}
                </button>
              </div>
              
              <div className="flex items-center gap-2 mt-6 justify-center sm:justify-start">
                  <ShieldCheck size={16} className="text-gray-400" />
                  <span className="text-[13px] text-gray-500 font-medium">Cam kết hàng chính hãng 100%</span>
              </div>

            </div>
          </div>
        </div>
      </div>
    </GearLayout>
  )
}
