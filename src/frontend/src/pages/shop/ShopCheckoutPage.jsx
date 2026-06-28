import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Loader2, Lock } from 'lucide-react'
import { cartApi } from '../../api/cartApi'
import { useToast } from '../../components/Toast'

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&q=80'
const payMethods = ['VNPay', 'Tiền mặt', 'Ví Escrow']

export default function ShopCheckoutPage() {
  const navigate = useNavigate()
  const { addToast } = useToast()
  const [cart, setCart] = useState(null)
  const [loading, setLoading] = useState(true)
  const [payMethod, setPayMethod] = useState('VNPay')
  const [placing, setPlacing] = useState(false)

  useEffect(() => {
    let active = true
    async function load() {
      try {
        const res = await cartApi.getCart()
        if (!active) return
        if (res?.success !== false && res?.data) setCart(res.data)
        else setCart({ items: [], totalPrice: 0, totalItems: 0 })
      } catch (err) {
        addToast(typeof err === 'string' ? err : 'Không tải được giỏ hàng.', 'error')
        setCart({ items: [], totalPrice: 0, totalItems: 0 })
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => { active = false }
  }, [addToast])

  const items = cart?.items || []
  const total = cart?.totalPrice || 0

  async function confirmPurchase() {
    if (items.length === 0) { addToast('Giỏ hàng đang trống.', 'error'); return }
    try {
      setPlacing(true)
      const res = await cartApi.checkout({})
      if (res?.success !== false) {
        addToast('Thanh toán thành công! Cảm ơn bạn đã mua hàng.', 'success')
        navigate('/shop')
      } else {
        addToast(res?.message || 'Thanh toán thất bại.', 'error')
      }
    } catch (err) {
      addToast(typeof err === 'string' ? err : 'Thanh toán thất bại.', 'error')
    } finally {
      setPlacing(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f9fc]">
      <header className="h-14 bg-white border-b border-[#e0ecf0] flex items-center justify-center">
        <Link to="/shop" className="font-oswald text-xl font-bold text-foreground tracking-wider no-underline">PRO-SPORT</Link>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_380px] gap-7 max-w-[1100px] my-8 mx-auto px-6 flex-1 items-start w-full">
        <div className="flex flex-col gap-5">
          <div className="bg-white rounded-[14px] p-6 border-[1.5px] border-[#e0ecf0]">
            <h2 className="text-base font-bold text-foreground mb-5">Thông tin giao hàng</h2>
            <div className="grid grid-cols-2 gap-3.5">
              <div className="flex flex-col gap-1.5 col-span-2">
                <label className="text-[0.78rem] font-semibold text-[#94a3b8]">Họ tên người nhận</label>
                <input type="text" placeholder="Nguyễn Văn A" className="border-[1.5px] border-[#e0ecf0] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#14B8A6]" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[0.78rem] font-semibold text-[#94a3b8]">Số điện thoại</label>
                <input type="text" placeholder="09xxxxxxxx" className="border-[1.5px] border-[#e0ecf0] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#14B8A6]" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[0.78rem] font-semibold text-[#94a3b8]">Hình thức</label>
                <input type="text" defaultValue="Nhận tại quầy" className="border-[1.5px] border-[#e0ecf0] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#14B8A6]" />
              </div>
              <div className="flex flex-col gap-1.5 col-span-2">
                <label className="text-[0.78rem] font-semibold text-[#94a3b8]">Địa chỉ</label>
                <input type="text" placeholder="Số nhà, đường, phường..." className="border-[1.5px] border-[#e0ecf0] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#14B8A6]" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[14px] p-6 border-[1.5px] border-[#e0ecf0]">
            <h2 className="text-base font-bold text-foreground mb-5">Phương thức thanh toán</h2>
            <div className="flex gap-2.5 flex-wrap">
              {payMethods.map(m => (
                <button key={m} onClick={() => setPayMethod(m)} className={`border-[1.5px] rounded-lg p-3 px-4 bg-white cursor-pointer text-[0.82rem] font-semibold transition-all min-w-[100px] ${payMethod === m ? 'border-[#14B8A6] text-[#14B8A6] bg-[#14B8A6]/5' : 'border-[#e0ecf0] text-[#64748b] hover:border-[#14B8A6] hover:text-[#14B8A6]'}`}>
                  {m}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[14px] p-6 border-[1.5px] border-[#e0ecf0] md:sticky md:top-6">
          <h2 className="text-base font-bold text-foreground mb-4">Tóm tắt đơn hàng</h2>
          {loading ? (
            <div className="py-8 text-center text-slate-400"><Loader2 className="inline animate-spin mr-2" size={18} /> Đang tải...</div>
          ) : items.length === 0 ? (
            <p className="py-8 text-center text-slate-400 text-sm">Giỏ hàng trống.</p>
          ) : (
            <>
              {items.map(item => (
                <div key={item.cartItemId} className="flex items-center gap-3 py-2.5 border-b border-[#f0f5f9]">
                  <img src={item.imageUrl || FALLBACK_IMG} alt={item.equipmentName} className="w-[46px] h-[46px] rounded-lg object-cover shrink-0" onError={e => { e.currentTarget.src = FALLBACK_IMG }} />
                  <div className="min-w-0">
                    <p className="text-[0.85rem] font-bold text-foreground truncate">{item.equipmentName}</p>
                    <p className="text-[0.75rem] text-[#94a3b8]">SL: {item.quantity} × {item.unitPrice.toLocaleString('vi-VN')}₫</p>
                  </div>
                  <span className="ml-auto text-[0.85rem] font-semibold text-foreground whitespace-nowrap">{item.totalPrice.toLocaleString('vi-VN')}₫</span>
                </div>
              ))}
              <div className="flex justify-between text-base font-bold text-foreground my-3.5 pt-3 border-t-[1.5px] border-[#e0ecf0]">
                <span>Tổng cộng</span>
                <span className="text-[#14B8A6] text-[1.15rem]">{total.toLocaleString('vi-VN')}₫</span>
              </div>
            </>
          )}
          <button
            onClick={confirmPurchase}
            disabled={placing || items.length === 0}
            className="bg-[#14B8A6] hover:bg-[#0b7373] text-white font-semibold flex items-center justify-center w-full gap-2 p-3.5 rounded-full text-[0.95rem] border-none cursor-pointer transition-colors disabled:opacity-50"
          >
            {placing ? <Loader2 size={16} className="animate-spin" /> : <Lock size={14} />}
            Xác nhận thanh toán
          </button>
          <p className="flex items-center justify-center gap-1.5 text-[0.78rem] text-[#94a3b8] mt-2.5">
            <Lock size={12} /> Thanh toán được mã hóa an toàn
          </p>
        </div>
      </div>

      <footer className="bg-[#0d1a24] text-white/55 flex flex-col md:flex-row items-center justify-between p-4 px-10 text-xs gap-5 mt-auto">
        <span className="font-oswald text-base font-bold text-white">PRO-SPORT</span>
        <p>© 2026 PRO-SPORT. Engineered for Elite Performance.</p>
      </footer>
    </div>
  )
}
