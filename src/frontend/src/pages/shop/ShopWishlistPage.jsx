import { Share2, Plus, X } from 'lucide-react'
import ShopLayout from '../../layouts/ShopLayout'

const items = [
  {
    id: 1,
    name: 'Aero-Swift Pro Elite Run',
    sub: 'Giày chạy đường phố nam',
    price: '$240.00',
    badge: 'CÒN HÀNG',
  },
  {
    id: 2,
    name: 'PulseTrack V4 Biometric Watch',
    sub: 'Thiết bị đeo hiệu suất',
    price: '$299.00',
    oldPrice: '$350.00',
    badge: 'GIẢM GIÁ',
  },
]

export default function ShopWishlistPage() {
  return (
    <ShopLayout>
      <div className="font-sans max-w-[1100px] mx-auto px-5 md:px-10 py-8 pb-16">

        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <p className="label-mono text-foreground-muted mb-4">{'// Đã lưu'}</p>
            <h1 className="font-heading text-3xl md:text-4xl uppercase tracking-tight text-foreground">Danh sách yêu thích</h1>
            <p className="text-sm text-foreground-muted mt-2">{items.length} sản phẩm đã lưu. Theo dõi thiết bị yêu thích của bạn.</p>
          </div>
          <div className="flex gap-3">
            <button className="btn-outline flex items-center gap-2">
              <Share2 size={14} />
              Chia sẻ danh sách
            </button>
            <button className="btn-primary">Thêm tất cả vào giỏ</button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map(item => (
            <div key={item.id} className="border-2 border-border-strong bg-surface rounded-[2px] flex flex-col overflow-hidden group">
              <div className="relative aspect-square border-b-2 border-border-strong overflow-hidden bg-background-base">
                {item.badge && (
                  <span className={`absolute top-3 left-3 label-mono px-2.5 py-1 z-10 ${item.oldPrice ? 'bg-danger-bg text-danger border border-danger' : 'bg-ink text-paper'}`}>
                    {item.badge}
                  </span>
                )}
                <button
                  className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-surface border-2 border-border-strong text-foreground-muted hover:text-danger hover:border-danger transition-colors z-10 rounded-[2px]"
                  aria-label="Xóa"
                >
                  <X size={14} />
                </button>
              </div>

              <div className="p-5 flex-1 flex flex-col">
                <h3 className="font-sans font-extrabold text-[15px] text-foreground mb-1">{item.name}</h3>
                <p className="label-mono text-foreground-muted mb-4">{item.sub}</p>

                <div className="flex items-center justify-between mt-auto">
                  <div>
                    {item.oldPrice && <span className="text-xs text-foreground-muted line-through block mb-0.5">{item.oldPrice}</span>}
                    <span className={`font-heading text-lg ${item.oldPrice ? 'text-danger' : 'text-foreground'}`}>{item.price}</span>
                  </div>
                  <button
                    className="w-9 h-9 flex items-center justify-center bg-ink text-paper hover:bg-accent hover:text-ink rounded-[2px] transition-colors"
                    aria-label="Thêm vào giỏ"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ShopLayout>
  )
}
