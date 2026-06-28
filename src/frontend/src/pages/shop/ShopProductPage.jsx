import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Loader2, Minus, Plus, ShoppingCart } from 'lucide-react'
import ShopLayout from '../../layouts/ShopLayout'
import { equipmentApi } from '../../api/equipmentApi'
import { cartApi } from '../../api/cartApi'
import { useToast } from '../../components/Toast'

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

  if (loading) {
    return <ShopLayout><div className="py-32 text-center text-slate-400"><Loader2 className="inline animate-spin mr-2" size={22} /> Đang tải...</div></ShopLayout>
  }
  if (error || !product) {
    return <ShopLayout><div className="py-32 text-center text-red-500">{error || 'Không tìm thấy sản phẩm.'}</div></ShopLayout>
  }

  const price = product.retailPrice || product.price || 0
  const inStock = product.stockQuantity > 0 && product.status === 'Available'

  return (
    <ShopLayout>
      <div className="px-5 md:px-10 py-5 pb-16 max-w-[1200px] mx-auto">
        <div className="text-xs text-[#94a3b8] mb-5">
          <Link to="/shop" className="text-[#14B8A6] no-underline hover:underline">Cửa hàng</Link> › <span className="text-[#64748b]">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <div>
            <div className="relative rounded-2xl overflow-hidden bg-[#f5f9fc] aspect-square">
              <img src={product.imageUrl || FALLBACK_IMG} alt={product.name} className="w-full h-full object-cover" onError={e => { e.currentTarget.src = FALLBACK_IMG }} />
            </div>
          </div>

          <div>
            <p className="text-[0.7rem] font-bold tracking-widest uppercase text-[#94a3b8] mb-1">{product.category} • {product.type}</p>
            <h1 className="font-oswald text-3xl font-bold text-foreground mb-1.5">{product.name}</h1>
            <p className="text-sm text-[#14B8A6] mb-4">{product.categoryName}</p>

            <div className="flex items-center gap-4 mb-6">
              <span className="font-oswald text-3xl font-bold text-foreground">{price.toLocaleString('vi-VN')}₫</span>
              {inStock ? (
                <span className="flex items-center gap-1.5 text-[0.82rem] text-green-600"><span className="w-2 h-2 rounded-full bg-green-500" /> Còn {product.stockQuantity} sản phẩm</span>
              ) : (
                <span className="text-[0.82rem] bg-slate-100 text-slate-500 px-2.5 py-1 rounded-full font-semibold">Hết hàng</span>
              )}
            </div>

            {product.description && (
              <p className="text-sm text-[#475569] leading-relaxed mb-6">{product.description}</p>
            )}

            <div className="mb-5">
              <p className="text-[0.85rem] font-semibold text-foreground mb-2.5">Số lượng</p>
              <div className="flex items-center gap-3">
                <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-10 h-10 rounded-lg border border-[#e0ecf0] flex items-center justify-center hover:border-[#14B8A6]"><Minus size={16} /></button>
                <span className="w-12 text-center font-bold text-lg">{qty}</span>
                <button onClick={() => setQty(q => Math.min(product.stockQuantity || 1, q + 1))} className="w-10 h-10 rounded-lg border border-[#e0ecf0] flex items-center justify-center hover:border-[#14B8A6]"><Plus size={16} /></button>
              </div>
            </div>

            <button
              onClick={() => handleAddToCart(false)}
              disabled={!inStock || adding}
              className="bg-[#14B8A6] hover:bg-[#0b7373] text-white font-semibold flex items-center justify-center w-full gap-2 p-3.5 text-[0.95rem] mt-5 rounded-full transition-colors cursor-pointer border-none disabled:opacity-50"
            >
              {adding ? <Loader2 size={16} className="animate-spin" /> : <ShoppingCart size={16} />}
              {inStock ? 'Thêm vào giỏ' : 'Hết hàng'}
            </button>
            <button
              onClick={() => handleAddToCart(true)}
              disabled={!inStock || adding}
              className="w-full bg-white border-[1.5px] border-[#0F172A] text-foreground p-[13px] rounded-full text-[0.95rem] font-semibold cursor-pointer mt-2.5 transition-all hover:bg-[#0F172A] hover:text-white disabled:opacity-50"
            >
              Mua ngay
            </button>
          </div>
        </div>
      </div>
    </ShopLayout>
  )
}
