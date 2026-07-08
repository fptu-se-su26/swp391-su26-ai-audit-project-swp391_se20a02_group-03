import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import GearLayout from '../../layouts/GearLayout'
import { equipmentApi } from '../../api/equipmentApi'
import { useCart } from '../../context/CartContext'
import { useToast } from '../../components/Toast'
import { translateItemType, translateSport } from '../../utils/labels'
import PageLoader from '../../components/ui/PageLoader'
import EmptyState from '../../components/ui/EmptyState'
import { Minus, Plus, ArrowLeft, Frown } from 'lucide-react'

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
      <PageLoader message="Đang tải thiết bị..." />
    </GearLayout>
  )

  if (!gear) return (
    <GearLayout>
      <EmptyState
        icon={<Frown className="w-7 h-7" />}
        title="Không tìm thấy thiết bị"
        subtitle="Món đồ này có thể đã ngừng kinh doanh."
        action={<button onClick={() => navigate(-1)} className="btn-primary">Quay lại cửa tiệm</button>}
      />
    </GearLayout>
  )

  const stock = gear.availableQuantity ?? gear.stockQuantity ?? 0

  return (
    <GearLayout>
      <div className="font-sans max-w-[1100px] mx-auto">

        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 font-bold text-sm text-foreground hover:text-accent transition-colors mb-8 border-b-2 border-foreground pb-0.5 w-fit">
          <ArrowLeft className="w-4 h-4" /> Trở về cửa tiệm
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start">

          {/* Image */}
          <div className="relative aspect-square border-2 border-border-strong bg-surface flex items-start p-5 overflow-hidden">
            {gear.retailPrice > 4000000 && (
              <span className="label-mono bg-ink text-paper px-4 py-2">Hàng hiếm</span>
            )}
            <img
              src={gear.imageUrl || 'https://images.unsplash.com/photo-1617083934551-1af7da84de49?w=800&q=80'}
              alt={gear.name}
              className="absolute inset-0 w-full h-full object-cover -z-10"
            />
          </div>

          {/* Info */}
          <div>
            <p className="label-mono text-foreground-muted mb-3">
              {translateSport(gear.type)} {gear.category ? `· ${translateItemType(gear.category)}` : ''}
            </p>

            <h1 className="font-heading text-3xl md:text-4xl uppercase tracking-tight text-foreground mb-7 leading-[1.05]">
              {gear.name}
            </h1>

            <div className="border-2 border-border-strong p-5 flex items-center justify-between mb-6">
              <span className="font-bold text-sm text-foreground">Giá bán</span>
              <span className="font-heading text-2xl text-foreground">{gear.retailPrice?.toLocaleString('vi-VN')}đ</span>
            </div>

            <div className="flex items-center justify-between pb-6 border-b-2 border-border-strong mb-7">
              <span className="font-bold text-sm text-foreground">Kho chứa</span>
              <span className="label-mono bg-background-base border border-border-default px-3 py-1">{stock} món</span>
            </div>

            <div className="mb-8">
              <p className="label-mono text-foreground inline-block border-b-2 border-border-strong pb-1.5 mb-3">Mô tả sản phẩm</p>
              <p className="text-sm leading-[1.75] text-foreground-muted">
                {gear.description || 'Không có mô tả nào cho món đồ này.'}
              </p>
            </div>

            <div className="flex gap-4">
              <div className="flex items-center border-2 border-border-strong h-14 shrink-0">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-14 h-full flex items-center justify-center text-foreground hover:bg-surface-hover transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 h-full flex items-center justify-center font-extrabold text-base text-foreground border-x-2 border-border-strong">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(stock || 1, quantity + 1))}
                  className="w-14 h-full flex items-center justify-center text-foreground hover:bg-surface-hover transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={isAdding}
                className="btn-primary flex-1 h-14 text-sm"
              >
                {isAdding ? 'Đang thêm...' : 'Bỏ vào giỏ'}
              </button>
            </div>

          </div>
        </div>
      </div>
    </GearLayout>
  )
}
