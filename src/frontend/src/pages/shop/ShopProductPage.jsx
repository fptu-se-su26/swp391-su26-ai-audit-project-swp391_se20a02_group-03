import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Minus, Plus, ShoppingCart, ArrowLeft, Frown } from 'lucide-react'
import ShopLayout from '../../layouts/ShopLayout'
import { equipmentApi } from '../../api/equipmentApi'
import { cartApi } from '../../api/cartApi'
import { useToast } from '../../components/Toast'
import PageLoader from '../../components/ui/PageLoader'
import EmptyState from '../../components/ui/EmptyState'

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80'

export default function ShopProductPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToast } = useToast()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [qty, setQty] = useState(1)
  const [adding, setAdding] = useState(false)

  useEffect(() => {
    let active = true
    async function load() {
      try {
        setLoading(true)
        setError(null)
        const res = await equipmentApi.getById(id)
        if (!active) return
        // GetById trả EquipmentDto trực tiếp (không bọc envelope)
        const data = res?.data && res?.statusCode ? res.data : res
        if (data && data.equipmentId) setProduct(data)
        else setError('Không tìm thấy sản phẩm.')
      } catch (err) {
        if (active) setError(typeof err === 'string' ? err : 'Không tải được sản phẩm.')
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => { active = false }
  }, [id])

  async function handleAddToCart(goToCart = false) {
    if (!product) return
    try {
      setAdding(true)
      const res = await cartApi.addToCart({ equipmentId: product.equipmentId, quantity: qty })
      if (res?.success === false) {
        addToast(res.message || 'Thêm vào giỏ thất bại.', 'error')
        return
      }
      addToast('Đã thêm vào giỏ hàng!', 'success')
      if (goToCart) navigate('/shop/cart')
    } catch (err) {
      addToast(typeof err === 'string' ? err : 'Thêm vào giỏ thất bại. Vui lòng đăng nhập.', 'error')
    } finally {
      setAdding(false)
    }
  }

  if (loading) return (
    <ShopLayout>
      <PageLoader message="Đang tải sản phẩm..." />
    </ShopLayout>
  )

  if (error || !product) return (
    <ShopLayout>
      <EmptyState
        icon={<Frown className="w-7 h-7" />}
        title="Không tìm thấy sản phẩm"
        subtitle={error || 'Sản phẩm này có thể đã ngừng kinh doanh.'}
        action={<button onClick={() => navigate('/shop')} className="btn-primary">Quay lại cửa hàng</button>}
      />
    </ShopLayout>
  )

  const price = product.retailPrice || product.price || 0
  const inStock = product.stockQuantity > 0 && product.status === 'Available'

  return (
    <ShopLayout>
      <div className="font-sans max-w-[1100px] mx-auto px-5 md:px-10 py-8 pb-16">

        <div className="flex items-center gap-2 label-mono text-foreground-muted mb-8">
          <Link to="/shop" className="hover:text-accent transition-colors">Cửa hàng</Link>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </div>

        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 font-bold text-sm text-foreground hover:text-accent transition-colors mb-8 border-b-2 border-foreground pb-0.5 w-fit">
          <ArrowLeft className="w-4 h-4" /> Trở về cửa hàng
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start">

          {/* Image */}
          <div className="relative aspect-square border-2 border-border-strong bg-surface flex items-start p-5 overflow-hidden">
            {!inStock && (
              <span className="label-mono bg-foreground-muted text-paper px-4 py-2">Hết hàng</span>
            )}
            <img
              src={product.imageUrl || FALLBACK_IMG}
              alt={product.name}
              className="absolute inset-0 w-full h-full object-cover -z-10"
              onError={e => { e.currentTarget.src = FALLBACK_IMG }}
            />
          </div>

          {/* Info */}
          <div>
            <p className="label-mono text-foreground-muted mb-3">{product.category} · {product.type}</p>

            <h1 className="font-heading text-3xl md:text-4xl uppercase tracking-tight text-foreground mb-7 leading-[1.05]">
              {product.name}
            </h1>

            <div className="border-2 border-border-strong p-5 flex items-center justify-between mb-6">
              <span className="font-bold text-sm text-foreground">Giá bán</span>
              <span className="font-heading text-2xl text-foreground">{price.toLocaleString('vi-VN')}đ</span>
            </div>

            <div className="flex items-center justify-between pb-6 border-b-2 border-border-strong mb-7">
              <span className="font-bold text-sm text-foreground">Tình trạng kho</span>
              {inStock ? (
                <span className="label-mono bg-background-base border border-border-default px-3 py-1">Còn {product.stockQuantity} sản phẩm</span>
              ) : (
                <span className="label-mono bg-danger-bg text-danger border border-danger px-3 py-1">Hết hàng</span>
              )}
            </div>

            {product.description && (
              <div className="mb-8">
                <p className="label-mono text-foreground inline-block border-b-2 border-border-strong pb-1.5 mb-3">Mô tả sản phẩm</p>
                <p className="text-sm leading-[1.75] text-foreground-muted">{product.description}</p>
              </div>
            )}

            <div className="mb-6">
              <p className="font-bold text-sm text-foreground mb-3">Số lượng</p>
              <div className="flex items-center border-2 border-border-strong h-14 w-fit">
                <button
                  onClick={() => setQty(q => Math.max(1, q - 1))}
                  className="w-14 h-full flex items-center justify-center text-foreground hover:bg-surface-hover transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 h-full flex items-center justify-center font-extrabold text-base text-foreground border-x-2 border-border-strong">
                  {qty}
                </span>
                <button
                  onClick={() => setQty(q => Math.min(product.stockQuantity || 1, q + 1))}
                  className="w-14 h-full flex items-center justify-center text-foreground hover:bg-surface-hover transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => handleAddToCart(false)}
                disabled={!inStock || adding}
                className="btn-primary h-14 text-sm flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-4 h-4" />
                {adding ? 'Đang thêm...' : (inStock ? 'Bỏ vào giỏ' : 'Hết hàng')}
              </button>
              <button
                onClick={() => handleAddToCart(true)}
                disabled={!inStock || adding}
                className="btn-outline h-14 text-sm"
              >
                Mua ngay
              </button>
            </div>
          </div>
        </div>
      </div>
    </ShopLayout>
  )
}
