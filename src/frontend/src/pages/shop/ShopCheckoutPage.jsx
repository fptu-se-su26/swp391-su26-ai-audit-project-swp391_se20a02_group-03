import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ProSportLogo from '../../components/ui/ProSportLogo'
import { Loader2, Lock } from 'lucide-react'
import { cartApi } from '../../api/cartApi'
import { useToast } from '../../components/Toast'

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&q=80'
const payMethods = ['VNPay', 'Tiền mặt', 'Ví ký quỹ']

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
    <div className="min-h-screen flex flex-col bg-background-base font-sans">
      <header className="h-[76px] bg-ink border-b border-white/10 flex items-center justify-center">
        <ProSportLogo size="sm" variant="light" />
      </header>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_380px] gap-8 max-w-[1100px] my-10 mx-auto px-5 md:px-10 flex-1 items-start w-full">
        <div className="flex flex-col gap-6">
          <div className="card-base">
            <h2 className="label-mono text-foreground mb-6">Thông tin giao hàng</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="text-xs font-bold uppercase tracking-[0.04em] text-foreground-muted">Họ tên người nhận</label>
                <input type="text" placeholder="Nguyễn Văn A" className="input-base" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-[0.04em] text-foreground-muted">Số điện thoại</label>
                <input type="text" placeholder="09xxxxxxxx" className="input-base" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-[0.04em] text-foreground-muted">Hình thức</label>
                <input type="text" defaultValue="Nhận tại quầy" className="input-base" />
              </div>
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="text-xs font-bold uppercase tracking-[0.04em] text-foreground-muted">Địa chỉ</label>
                <input type="text" placeholder="Số nhà, đường, phường..." className="input-base" />
              </div>
            </div>
          </div>

          <div className="card-base">
            <h2 className="label-mono text-foreground mb-6">Phương thức thanh toán</h2>
            <div className="flex gap-3 flex-wrap">
              {payMethods.map(m => (
                <button
                  key={m}
                  onClick={() => setPayMethod(m)}
                  className={`px-5 h-11 text-xs font-extrabold uppercase tracking-[0.05em] rounded-[2px] border-2 transition-colors min-w-[110px] ${payMethod === m ? 'bg-ink text-paper border-ink' : 'bg-transparent text-foreground border-border-hover hover:border-foreground'}`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="card-base md:sticky md:top-6">
          <h2 className="label-mono text-foreground mb-6">Tóm tắt đơn hàng</h2>
          {loading ? (
            <div className="py-8 text-center text-foreground-muted"><Loader2 className="inline animate-spin mr-2" size={18} /> Đang tải...</div>
          ) : items.length === 0 ? (
            <p className="py-8 text-center text-foreground-muted text-sm">Giỏ hàng trống.</p>
          ) : (
            <>
              <div className="flex flex-col divide-y divide-border-default border-b-2 border-border-strong mb-4">
                {items.map(item => (
                  <div key={item.cartItemId} className="flex items-center gap-3 py-3">
                    <img
                      src={item.imageUrl || FALLBACK_IMG}
                      alt={item.equipmentName}
                      className="w-12 h-12 border-2 border-border-strong object-cover shrink-0"
                      onError={e => { e.currentTarget.src = FALLBACK_IMG }}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-extrabold text-foreground truncate">{item.equipmentName}</p>
                      <p className="label-mono text-foreground-muted">SL {item.quantity} × {item.unitPrice.toLocaleString('vi-VN')}đ</p>
                    </div>
                    <span className="text-sm font-bold text-foreground whitespace-nowrap">{item.totalPrice.toLocaleString('vi-VN')}đ</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center mb-6">
                <span className="font-extrabold text-base text-foreground">Tổng cộng</span>
                <span className="font-heading text-2xl text-foreground">{total.toLocaleString('vi-VN')}đ</span>
              </div>
            </>
          )}
          <button
            onClick={confirmPurchase}
            disabled={placing || items.length === 0}
            className="btn-primary w-full h-14 flex items-center justify-center gap-2 text-sm"
          >
            {placing ? <Loader2 size={16} className="animate-spin" /> : <Lock size={14} />}
            Xác nhận thanh toán
          </button>
          <p className="flex items-center justify-center gap-1.5 label-mono text-foreground-muted mt-4">
            <Lock size={12} /> Thanh toán được mã hóa an toàn
          </p>
        </div>
      </div>

      <footer className="bg-ink text-paper/55 flex flex-col md:flex-row items-center justify-between p-4 px-10 text-xs gap-5 mt-auto">
        <ProSportLogo size="sm" variant="light" />
        <p>© 2026 PRO-SPORT. Thiết kế cho hiệu suất đỉnh cao.</p>
      </footer>
    </div>
  )
}
