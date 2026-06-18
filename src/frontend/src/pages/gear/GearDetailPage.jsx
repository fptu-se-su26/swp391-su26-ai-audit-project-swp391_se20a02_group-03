import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import GearLayout from '../../layouts/GearLayout'
import { equipmentApi } from '../../api/equipmentApi'
import { bookingApi } from '../../api/bookingApi'

import { useCart } from '../../context/CartContext'
import { useToast } from '../../components/Toast'

export default function GearDetailPage() {
  const { id } = useParams()
  const { addToCart } = useCart()
  const { addToast } = useToast()
  const [gear, setGear] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [userBookings, setUserBookings] = useState([])
  const [showRentModal, setShowRentModal] = useState(false)
  const [isAdding, setIsAdding] = useState(false)

  useEffect(() => {
    fetchGearDetails()
    fetchUserBookings()
  }, [id])

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

  async function fetchUserBookings() {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) return;

    try {
      const response = await bookingApi.getMyBookings()
      if (response && response.statusCode === 200) {
        const active = response.data.filter(b => b.status === 'Pending' || b.status === 'Paid')
        setUserBookings(active)
      }
    } catch (error) {
      console.error('Error fetching bookings:', error)
    }
  }

  async function handleAddToCart(bookingId = null) {
    setIsAdding(true)
    try {
      const res = await addToCart(parseInt(id), quantity, bookingId)
      if (res.success) {
        addToast(`Đã thêm ${quantity} x ${gear.name} vào giỏ hàng`, 'success')
        setShowRentModal(false)
      } else {
        addToast(res.message, 'error')
      }
    } catch (error) {
      console.error('Add to cart error:', error)
      addToast('Lỗi khi thêm vào giỏ hàng', 'error')
    } finally {
      setIsAdding(false)
    }
  }

  function handleRentClick() {
    setShowRentModal(true)
  }

  if (loading) return (
    <GearLayout>
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-900"></div>
      </div>
    </GearLayout>
  )

  if (!gear) return (
    <GearLayout>
      <div className="text-center py-24">
        <h2 className="text-2xl font-bold text-brand-900">Không tìm thấy thiết bị</h2>
        <Link to="/gear/catalog" className="mt-4 inline-block text-accent">Quay lại cửa hàng</Link>
      </div>
    </GearLayout>
  )

  const depositPerUnit = Math.round(gear.depositAmountPerUnit ?? gear.retailPrice * 0.2)
  const totalDeposit = depositPerUnit * quantity

  return (
    <GearLayout>
      <main className="max-w-7xl mx-auto px-6 py-12">
        <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-400 mb-8">
          <Link to="/gear/catalog" className="hover:text-brand-900">Catalog</Link>
          <span>/</span>
          <span className="text-brand-900">{gear.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image */}
          <div className="bg-white rounded-3xl border border-brand-200 overflow-hidden aspect-square">
            <img 
              src={gear.imageUrl || 'https://images.unsplash.com/photo-1617083934551-1af7da84de49?w=800&q=80'} 
              alt={gear.name} 
              className="w-full h-full object-cover"
            />
          </div>

          {/* Info */}
          <div className="flex flex-col">
            <div className="mb-8">
              <span className="inline-block px-3 py-1 bg-brand-50 text-brand-600 text-xs font-bold uppercase tracking-widest rounded-md mb-4">
                {gear.type}
              </span>
              <h1 className="text-4xl font-bold text-brand-900 mb-4">{gear.name}</h1>
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between max-w-sm">
                  <span className="text-sm font-medium text-brand-500">Giá có đặt sân:</span>
                  <span className="text-2xl font-bold text-brand-900">{gear.rentalPrice?.toLocaleString()} VND</span>
                </div>
                <div className="flex items-center justify-between max-w-sm">
                  <span className="text-sm font-medium text-brand-500">Giá không đặt sân (30% surcharge):</span>
                  <span className="text-xl font-bold text-amber-600">{(gear.rentalPrice * 1.3)?.toLocaleString()} VND</span>
                </div>
              </div>
            </div>

            <div className="prose prose-brand mb-8 pt-6 border-t border-brand-100">
              <h3 className="text-sm font-bold uppercase tracking-widest text-brand-400 mb-2">Mô tả sản phẩm</h3>
              <p className="text-brand-600 leading-relaxed">{gear.description}</p>
            </div>

            <div className="bg-brand-50 rounded-2xl p-6 border border-brand-100 mb-10">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-medium text-brand-600">Trạng thái kho</span>
                <span className="text-sm font-bold text-emerald-600">Còn hàng ({gear.availableQuantity})</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-brand-200 bg-white rounded-xl overflow-hidden shrink-0">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 flex items-center justify-center hover:bg-brand-50 text-brand-900 font-bold"
                  >-</button>
                  <span className="w-12 text-center font-bold text-brand-900">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(Math.min(gear.availableQuantity, quantity + 1))}
                    className="w-12 h-12 flex items-center justify-center hover:bg-brand-50 text-brand-900 font-bold"
                  >+</button>
                </div>
                <button 
                  onClick={handleRentClick}
                  className="btn-primary flex-1 py-3 text-base shadow-lg shadow-brand-900/10"
                >
                  Thêm Vào Giỏ
                </button>
              </div>
              <p className="text-[10px] text-brand-400 mt-4 text-center">
                * Mô hình Try-Before-You-Buy: Bạn có thể mua thiết bị này sau khi thuê với giá ưu đãi.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white border border-brand-200 rounded-2xl flex flex-col gap-1">
                <span className="text-[10px] font-bold uppercase text-brand-400">Tiền cọc</span>
                <span className="text-sm font-bold text-brand-900">{depositPerUnit.toLocaleString()} VND / đơn vị</span>
              </div>
              <div className="p-4 bg-white border border-brand-200 rounded-2xl flex flex-col gap-1">
                <span className="text-[10px] font-bold uppercase text-brand-400">Hoàn trả</span>
                <span className="text-sm font-bold text-brand-900">Trong 24h</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Rental Selection Modal */}
      {showRentModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-brand-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="p-6 border-b border-brand-100 flex justify-between items-center bg-brand-50/50">
              <h3 className="font-heading text-xl font-bold text-brand-900">Chọn hình thức thuê</h3>
              <button onClick={() => setShowRentModal(false)} className="text-brand-400 hover:text-brand-900 transition-colors">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Option 1: Standalone (Surcharge) */}
              <div className="relative group">
                <button 
                  onClick={() => handleAddToCart(null)}
                  className="w-full text-left p-4 rounded-2xl border-2 border-brand-100 hover:border-amber-200 hover:bg-amber-50/30 transition-all duration-300"
                  disabled={isAdding}
                >
                  <p className="text-[10px] font-bold uppercase tracking-widest text-brand-400 mb-1">Thuê lẻ (Surcharge 30%)</p>
                  <p className="text-lg font-bold text-brand-900">{(gear.rentalPrice * 1.3).toLocaleString()} VND <span className="text-xs font-medium text-brand-500 font-sans">/ ngày</span></p>
                  <p className="text-xs text-brand-500 mt-2">Dành cho khách hàng chưa có lịch đặt sân tại CLB.</p>
                </button>
              </div>

              <div className="flex items-center gap-4">
                <div className="h-px flex-1 bg-brand-100"></div>
                <span className="text-[10px] font-bold text-brand-300 uppercase">Hoặc chọn lịch đặt sân</span>
                <div className="h-px flex-1 bg-brand-100"></div>
              </div>

              {/* Option 2: Active Bookings (Discounted) */}
              <div className="space-y-3 max-h-[240px] overflow-y-auto pr-2 scrollbar-hide">
                {!localStorage.getItem('token') && !sessionStorage.getItem('token') ? (
                  <div className="text-center py-4 bg-brand-50 rounded-2xl border border-dashed border-brand-200">
                    <p className="text-xs text-brand-400">Vui lòng đăng nhập để xem lịch đặt sân.</p>
                    <Link to="/login" className="text-xs font-bold text-accent mt-1 inline-block">Đăng nhập để nhận ưu đãi</Link>
                  </div>
                ) : userBookings.length > 0 ? (
                  userBookings.map(b => (
                    <button 
                      key={b.bookingId}
                      onClick={() => handleAddToCart(b.bookingId)}
                      className="w-full text-left p-4 rounded-2xl border-2 border-brand-100 hover:border-accent hover:bg-accent/5 transition-all duration-300"
                      disabled={isAdding}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <p className="text-xs font-bold text-brand-900">Booking #{b.bookingId}</p>
                        <span className="text-[10px] font-bold text-accent uppercase bg-accent/10 px-2 py-0.5 rounded">Ưu Đãi</span>
                      </div>
                      <p className="text-xs text-brand-500">Ngày: {new Date(b.bookingDate).toLocaleDateString('vi-VN')}</p>
                      <p className="text-sm font-bold text-brand-900 mt-1">{gear.rentalPrice.toLocaleString()} VND</p>
                    </button>
                  ))
                ) : (
                  <div className="text-center py-4 bg-brand-50 rounded-2xl border border-dashed border-brand-200">
                    <p className="text-xs text-brand-400">Bạn chưa có lịch đặt sân sắp tới.</p>
                    <Link to="/courts" className="text-xs font-bold text-accent mt-1 inline-block">Đặt sân ngay để nhận ưu đãi</Link>
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 bg-brand-50/50 text-[10px] text-brand-500 text-center border-t border-brand-100 space-y-1">
              <p>Tiền cọc: <strong>{totalDeposit.toLocaleString()} VND</strong> (hoàn lại khi trả đồ đúng tình trạng)</p>
              <p className="text-brand-400">* Thuê thiết bị kèm đặt sân giúp chúng tôi chuẩn bị sẵn sàng cho bạn.</p>
            </div>
          </div>
        </div>
      )}
    </GearLayout>
  )
}
