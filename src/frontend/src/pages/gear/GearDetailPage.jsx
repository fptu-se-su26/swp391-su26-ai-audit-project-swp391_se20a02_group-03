import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import ApexLayout from '../../layouts/ApexLayout'
import { equipmentApi } from '../../api/equipmentApi'
import { useCart } from '../../context/CartContext'
import { useToast } from '../../components/Toast'
import { translateItemType, translateSport } from '../../utils/labels'

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
        addToast(`Đã cất ${quantity}x ${gear.name} vào túi đồ!`, 'success')
      } else {
        addToast(res.message, 'error')
      }
    } catch (error) {
      console.error('Add to cart error:', error)
      addToast('Lỗi hệ thống khi lấy đồ', 'error')
    } finally {
      setIsAdding(false)
    }
  }

  if (loading) return (
    <ApexLayout>
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-neo-accent font-heading text-xl mb-4 animate-bounce" style={{ textShadow: '2px 2px 0px var(--color-neo-danger)' }}>ĐANG MỞ RƯƠNG...</div>
      </div>
    </ApexLayout>
  )

  if (!gear) return (
    <ApexLayout>
      <div className="flex flex-col items-center justify-center py-32 min-h-[60vh]">
        <div className="border-4 border-neo-muted bg-neo-surface p-12 text-center shadow-[8px_8px_0_var(--color-neo-danger)] rounded-sm max-w-md">
          <div className="text-6xl mb-6">🪹</div>
          <h2 className="text-xl font-heading text-neo-accent mb-4" style={{ textShadow: '1px 1px 0px var(--color-neo-danger)' }}>Rương trống rỗng</h2>
          <p className="text-xl text-neo-ink font-bold mb-8">Không tìm thấy món đồ này trong kho.</p>
          <button onClick={() => navigate(-1)} className="btn-primary w-full">Quay lại cửa tiệm</button>
        </div>
      </div>
    </ApexLayout>
  )

  return (
    <ApexLayout>
      <div className="font-sans relative z-10 animate-fade-up max-w-[1000px] mx-auto">
        
        {/* Breadcrumb / Back button */}
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-xl text-neo-ink hover:text-neo-accent transition-colors mb-8 group w-fit bg-neo-surface px-4 py-2 border-2 border-neo-muted shadow-[2px_2px_0_var(--color-neo-danger)] rounded-sm font-bold">
          <span className="group-hover:-translate-x-1 transition-transform">◄</span> Trở về tiệm
        </button>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_1.2fr] gap-8 items-start">
          
          {/* Image Viewer */}
          <div className="border-4 border-neo-muted bg-neo-secondary relative p-6 shadow-[8px_8px_0_var(--color-neo-danger)] rounded-sm flex items-center justify-center aspect-square">
            <div className="absolute inset-0 shadow-[inset_6px_6px_0_rgba(255,255,255,0.2),inset_-6px_-6px_0_rgba(0,0,0,0.1)] pointer-events-none z-10 rounded-sm"></div>
            {/* Wooden frame corners */}
            <div className="absolute top-2 left-2 w-4 h-4 border-t-4 border-l-4 border-neo-accent opacity-80"></div>
            <div className="absolute top-2 right-2 w-4 h-4 border-t-4 border-r-4 border-neo-accent opacity-80"></div>
            <div className="absolute bottom-2 left-2 w-4 h-4 border-b-4 border-l-4 border-neo-accent opacity-80"></div>
            <div className="absolute bottom-2 right-2 w-4 h-4 border-b-4 border-r-4 border-neo-accent opacity-80"></div>
            
            <img 
              src={gear.imageUrl || 'https://images.unsplash.com/photo-1617083934551-1af7da84de49?w=800&q=80'} 
              alt={gear.name} 
              className="w-[85%] h-[85%] object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.3)] z-0 hover:scale-105 transition-transform duration-500"
            />
          </div>

          {/* Info Area */}
          <div className="flex flex-col">
            
            <div className="border-4 border-neo-muted bg-neo-surface p-8 mb-6 shadow-[8px_8px_0_var(--color-neo-danger)] rounded-sm relative">
              {/* Badge */}
              {gear.retailPrice > 4000000 && (
                <div className="absolute -top-4 right-6 bg-neo-accent text-neo-secondary border-2 border-neo-muted shadow-[2px_2px_0_var(--color-neo-danger)] text-sm px-3 py-1 font-bold transform rotate-3">
                  Hàng Hiếm
                </div>
              )}

              <p className="text-lg text-neo-accent mb-2 uppercase tracking-wide font-bold" style={{ textShadow: '1px 1px 0px var(--color-neo-danger)' }}>
                ✦ {translateSport(gear.type)} {gear.category ? `• ${translateItemType(gear.category)}` : ''}
              </p>
              
              <h1 className="text-4xl text-neo-ink mb-6 leading-tight font-bold" style={{ textShadow: '2px 2px 0px var(--color-neo-danger)' }}>
                {gear.name}
              </h1>
              
              <div className="bg-neo-bg border-2 border-neo-muted p-4 flex items-center justify-between shadow-[inset_2px_2px_0_rgba(255,255,255,0.2)] mb-6 rounded-sm">
                <span className="text-xl text-neo-ink font-bold">Giá bán:</span>
                <span className="text-4xl text-neo-accent font-bold" style={{ textShadow: '2px 2px 0px var(--color-neo-danger)' }}>
                  {gear.retailPrice?.toLocaleString()} 🪙
                </span>
              </div>

              <div className="flex items-center justify-between text-xl border-t-2 border-neo-muted pt-4">
                <span className="text-neo-ink font-bold">Kho chứa:</span>
                <span className="text-neo-ink font-bold bg-neo-secondary border border-neo-muted px-3 py-1 rounded-sm shadow-[inset_1px_1px_0_rgba(255,255,255,0.4)]">
                  {gear.availableQuantity ?? gear.stockQuantity} món
                </span>
              </div>
            </div>

            {/* Description Box */}
            <div className="border-4 border-neo-muted bg-neo-secondary p-6 mb-6 shadow-[4px_4px_0_var(--color-neo-danger)] rounded-sm relative overflow-hidden">
               {/* Notebook lines effect */}
               <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'linear-gradient(transparent 95%, var(--color-neo-muted) 100%)', backgroundSize: '100% 32px' }}></div>
              
              <h3 className="font-heading text-sm text-neo-accent mb-4 relative z-10 inline-block border-b-2 border-neo-accent pb-1" style={{ textShadow: '1px 1px 0px var(--color-neo-danger)' }}>GHI CHÚ MÓN ĐỒ</h3>
              <p className="text-2xl text-neo-ink font-bold leading-8 relative z-10" style={{ textShadow: '1px 1px 0px rgba(0,0,0,0.1)' }}>
                {gear.description || 'Không có ghi chú nào cho món đồ này.'}
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mt-auto">
              <div className="flex items-center border-4 border-neo-muted bg-neo-surface h-14 shadow-[4px_4px_0_var(--color-neo-danger)] rounded-sm shrink-0">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-14 h-full flex items-center justify-center text-3xl text-neo-ink hover:bg-neo-bg transition-colors"
                >-</button>
                <span className="w-16 text-center text-3xl text-neo-ink font-bold bg-neo-bg border-x-4 border-neo-muted h-full flex items-center justify-center shadow-[inset_2px_2px_0_rgba(255,255,255,0.2)]">{quantity}</span>
                <button 
                  onClick={() => setQuantity(Math.min(gear.availableQuantity ?? gear.stockQuantity, quantity + 1))}
                  className="w-14 h-full flex items-center justify-center text-3xl text-neo-ink hover:bg-neo-bg transition-colors"
                >+</button>
              </div>
              
              <button 
                onClick={handleAddToCart}
                disabled={isAdding}
                className="flex-1 btn-primary h-14 text-2xl"
              >
                {isAdding ? 'Đang nhặt...' : 'Bỏ vào túi'}
              </button>
            </div>

          </div>
        </div>
      </div>
    </ApexLayout>
  )
}
