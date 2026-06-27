import { useState, useEffect, useCallback } from 'react'
import { Trash2, Loader2, ShoppingBag } from 'lucide-react'
import { Link } from 'react-router-dom'
import ShopLayout from '../../layouts/ShopLayout'
import { cartApi } from '../../api/cartApi'
import { useToast } from '../../components/Toast'

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&q=80'

export default function ShopCartPage() {
  const { addToast } = useToast()
  const [cart, setCart] = useState(null)
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState(null)

  const load = useCallback(async () => {
    try {
      setLoading(true)
      const res = await cartApi.getCart()
      if (res?.success !== false && res?.data) setCart(res.data)
      else setCart({ items: [], totalPrice: 0, totalItems: 0 })
    } catch (err) {
      addToast(typeof err === 'string' ? err : 'Không tải được giỏ hàng. Vui lòng đăng nhập.', 'error')
      setCart({ items: [], totalPrice: 0, totalItems: 0 })
    } finally {
      setLoading(false)
    }
  }, [addToast])

  useEffect(() => { load() }, [load])

  async function changeQty(item, delta) {
    const next = item.quantity + delta
    if (next < 1) return
    try {
      setBusyId(item.cartItemId)
      const res = await cartApi.updateQuantity(item.cartItemId, next)
      if (res?.success !== false && res?.data) setCart(res.data)
      else addToast(res?.message || 'Cập nhật thất bại.', 'error')
    } catch (err) {
      addToast(typeof err === 'string' ? err : 'Cập nhật thất bại.', 'error')
    } finally {
      setBusyId(null)
    }
  }

  async function remove(item) {
    try {
      setBusyId(item.cartItemId)
      const res = await cartApi.removeItem(item.cartItemId)
      if (res?.success !== false && res?.data) setCart(res.data)
      addToast('Đã xóa sản phẩm khỏi giỏ.', 'success')
    } catch (err) {
      addToast(typeof err === 'string' ? err : 'Xóa thất bại.', 'error')
    } finally {
      setBusyId(null)
    }
  }

  const items = cart?.items || []
  const subtotal = cart?.totalPrice || 0

  return (
    <ShopLayout>
      <div className="px-5 md:px-10 py-8 pb-16 max-w-[1100px] mx-auto">
        <h1 className="font-oswald text-3xl font-bold text-foreground mb-6">Giỏ hàng của bạn</h1>

        {loading ? (
          <div className="py-20 text-center text-slate-400"><Loader2 className="inline animate-spin mr-2" size={20} /> Đang tải...</div>
        ) : items.length === 0 ? (
          <div className="py-20 text-center">
            <ShoppingBag size={48} className="mx-auto text-slate-300 mb-4" />
            <p className="text-slate-500 mb-6">Giỏ hàng đang trống.</p>
            <Link to="/shop" className="inline-block bg-[#14B8A6] text-white font-semibold px-6 py-3 rounded-full no-underline hover:bg-[#0b7373]">Tiếp tục mua sắm</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-[1fr_360px] gap-7 items-start">
            <div className="flex flex-col gap-4">
              {items.map(item => (
                <div key={item.cartItemId} className="flex gap-4 bg-white rounded-[14px] p-4 border-[1.5px] border-[#e0ecf0]">
                  <img src={item.imageUrl || FALLBACK_IMG} alt={item.equipmentName} className="w-[90px] h-[90px] rounded-[10px] object-cover shrink-0 bg-[#f5f9fc]" onError={e => { e.currentTarget.src = FALLBACK_IMG }} />
                  <div className="flex-1 flex flex-col gap-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-[0.95rem] font-bold text-foreground mb-1">{item.equipmentName}</h3>
                        <p className="text-xs text-[#94a3b8]">Đơn giá: {item.unitPrice.toLocaleString('vi-VN')}₫</p>
                      </div>
                      <span className="text-base font-bold text-[#14B8A6] whitespace-nowrap">{item.totalPrice.toLocaleString('vi-VN')}₫</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 border-[1.5px] border-[#e0ecf0] rounded-full py-1.5 px-3.5">
                        <button onClick={() => changeQty(item, -1)} disabled={busyId === item.cartItemId} className="bg-transparent border-none cursor-pointer text-base text-[#64748b] leading-none hover:text-[#14B8A6] disabled:opacity-40">−</button>
                        <span className="text-sm font-bold text-foreground min-w-[20px] text-center">{busyId === item.cartItemId ? '…' : item.quantity}</span>
                        <button onClick={() => changeQty(item, 1)} disabled={busyId === item.cartItemId} className="bg-transparent border-none cursor-pointer text-base text-[#64748b] leading-none hover:text-[#14B8A6] disabled:opacity-40">+</button>
                      </div>
                      <button className="bg-transparent border-none cursor-pointer text-[0.82rem] text-red-500 flex items-center gap-1 disabled:opacity-40" onClick={() => remove(item)} disabled={busyId === item.cartItemId}>
                        <Trash2 size={14} /> Xóa
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-[14px] p-6 border-[1.5px] border-[#e0ecf0] md:sticky md:top-20">
              <h2 className="font-oswald text-[1.2rem] font-bold text-foreground mb-5">Tóm tắt đơn hàng</h2>
              <div className="flex flex-col gap-2.5 mb-4 border-b border-[#f0f5f9] pb-4">
                <div className="flex justify-between text-[0.875rem] text-[#64748b]"><span>Tạm tính ({cart?.totalItems || items.length} món)</span><span>{subtotal.toLocaleString('vi-VN')}₫</span></div>
                <div className="flex justify-between text-[0.875rem] text-[#64748b]"><span>Phí giao hàng</span><span>Miễn phí</span></div>
              </div>
              <div className="flex justify-between text-base font-bold text-foreground my-4">
                <span>Tổng cộng</span>
                <span className="text-[#14B8A6] text-[1.15rem]">{subtotal.toLocaleString('vi-VN')}₫</span>
              </div>
              <Link to="/shop/checkout" className="bg-[#14B8A6] hover:bg-[#0b7373] text-white font-semibold flex items-center justify-center w-full rounded-full p-[13px] text-[0.95rem] transition-colors border-none no-underline">
                Tiến hành thanh toán →
              </Link>
            </div>
          </div>
        )}
      </div>
    </ShopLayout>
  )
}
