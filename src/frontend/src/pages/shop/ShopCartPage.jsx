import { useState, useEffect, useCallback } from 'react'
import { Trash2, ShoppingBag, ArrowLeft, Plus, Minus, CreditCard } from 'lucide-react'
import { Link } from 'react-router-dom'
import ShopLayout from '../../layouts/ShopLayout'
import { cartApi } from '../../api/cartApi'
import { useToast } from '../../components/Toast'
import PageLoader from '../../components/ui/PageLoader'
import EmptyState from '../../components/ui/EmptyState'

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

  if (loading && !cart) {
    return (
      <ShopLayout>
        <PageLoader message="Đang tải giỏ hàng..." />
      </ShopLayout>
    )
  }

  if (items.length === 0) {
    return (
      <ShopLayout>
        <div className="font-sans max-w-[1100px] mx-auto px-5 md:px-10 py-8 pb-16">
          <EmptyState
            icon={<ShoppingBag className="w-7 h-7" />}
            title="Giỏ hàng đang trống"
            subtitle="Bạn chưa thêm sản phẩm nào vào giỏ hàng. Hãy khám phá cửa hàng ngay!"
            action={
              <Link to="/shop" className="btn-primary">Tiếp tục mua sắm</Link>
            }
          />
        </div>
      </ShopLayout>
    )
  }

  return (
    <ShopLayout>
      <div className="font-sans max-w-[1100px] mx-auto px-5 md:px-10 py-8 pb-16">

        {/* Header & Breadcrumb */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 flex-wrap">
          <div>
            <div className="flex items-center gap-2 label-mono text-foreground-muted mb-2.5">
              <Link to="/shop" className="hover:text-accent transition-colors">Cửa hàng</Link>
              <span>/</span>
              <span className="text-foreground">Giỏ hàng</span>
            </div>
            <h1 className="font-heading text-3xl md:text-4xl uppercase tracking-tight text-foreground">Giỏ hàng của bạn</h1>
          </div>
          <p className="text-sm text-foreground-muted">Bạn có <strong className="text-foreground">{cart?.totalItems || items.length} sản phẩm</strong> trong giỏ</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10 items-start">
          {/* Items List */}
          <div className="flex flex-col gap-4">
            {items.map(item => (
              <div
                key={item.cartItemId}
                className="border-2 border-border-strong bg-surface p-6 flex flex-col sm:flex-row items-center gap-6"
              >
                <div className="w-24 h-24 flex-shrink-0 border-2 border-border-strong overflow-hidden">
                  <img
                    src={item.imageUrl || FALLBACK_IMG}
                    alt={item.equipmentName}
                    className="w-full h-full object-cover"
                    onError={e => { e.currentTarget.src = FALLBACK_IMG }}
                  />
                </div>

                <div className="flex-1 min-w-0 w-full">
                  <h3 className="font-extrabold text-[15px] text-foreground mb-1.5 truncate">{item.equipmentName}</h3>
                  <p className="label-mono text-foreground-muted">{item.unitPrice.toLocaleString('vi-VN')}đ</p>
                </div>

                <div className="flex items-center gap-6 justify-between w-full sm:w-auto">
                  {/* Quantity */}
                  <div className="flex items-center border-2 border-border-strong h-10">
                    <button
                      onClick={() => changeQty(item, -1)}
                      disabled={busyId === item.cartItemId}
                      className="w-9 h-full flex items-center justify-center text-foreground hover:bg-surface-hover transition-colors disabled:opacity-40"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-9 text-center font-extrabold text-sm text-foreground border-x-2 border-border-strong h-full flex items-center justify-center">
                      {busyId === item.cartItemId ? '…' : item.quantity}
                    </span>
                    <button
                      onClick={() => changeQty(item, 1)}
                      disabled={busyId === item.cartItemId}
                      className="w-9 h-full flex items-center justify-center text-foreground hover:bg-surface-hover transition-colors disabled:opacity-40"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <p className="font-heading text-lg text-foreground min-w-[110px] text-right">{item.totalPrice.toLocaleString('vi-VN')}đ</p>

                  <button
                    onClick={() => remove(item)}
                    disabled={busyId === item.cartItemId}
                    className="w-10 h-10 flex items-center justify-center border-2 border-border-strong text-foreground-muted hover:text-danger hover:border-danger transition-colors disabled:opacity-40"
                    title="Gỡ bỏ"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}

            <Link to="/shop" className="inline-flex items-center gap-2 font-bold text-sm text-foreground hover:text-accent transition-colors mt-2 w-fit">
              <ArrowLeft size={16} />
              Quay lại cửa hàng
            </Link>
          </div>

          {/* Summary Panel */}
          <div className="sticky top-24 lg:top-28">
            <div className="border-2 border-border-strong bg-ink text-paper p-8">
              <h3 className="font-heading text-lg uppercase mb-6">Tóm tắt đơn hàng</h3>

              <div className="flex justify-between items-center pb-5 mb-5 border-b border-white/15">
                <span className="text-sm text-paper/60">Tạm tính ({cart?.totalItems || items.length} món)</span>
                <span className="font-bold text-sm">{subtotal.toLocaleString('vi-VN')}đ</span>
              </div>
              <div className="flex justify-between items-center pb-5 mb-5 border-b border-white/15">
                <span className="text-sm text-paper/60">Phí giao hàng</span>
                <span className="font-bold text-sm">Miễn phí</span>
              </div>

              <div className="flex justify-between items-center mb-7">
                <span className="font-extrabold text-base">Tổng thanh toán</span>
                <span className="font-heading text-2xl">{subtotal.toLocaleString('vi-VN')}đ</span>
              </div>

              <Link
                to="/shop/checkout"
                className="w-full h-14 flex items-center justify-center gap-3 font-extrabold text-[13px] uppercase tracking-[0.06em] bg-accent text-ink hover:bg-accent-bright transition-colors rounded-[2px]"
              >
                <CreditCard size={18} />
                Tiến hành thanh toán
              </Link>

              <p className="label-mono text-paper/50 text-center mt-5">Đảm bảo chất lượng sản phẩm chính hãng</p>
            </div>
          </div>
        </div>
      </div>
    </ShopLayout>
  )
}
