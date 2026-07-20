import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Swords, Circle, CheckCircle, CreditCard, Wallet, Check, ArrowLeft, ArrowRight, Calendar, Users, Info, MapPin, List, Map } from 'lucide-react'
import dayjs from 'dayjs'
import ApexLayout from '../../layouts/ApexLayout'
import { bookingApi } from '../../api/bookingApi'
import { paymentApi } from '../../api/paymentApi'
import { useToast } from '../../components/Toast'

// Map imports
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const timeSlots = [
  '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
  '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
  '18:00', '19:00', '20:00', '21:00', '22:00',
]

const sportTypes = ['Tất cả', 'Cầu lông', 'Pickleball']

// Modern SVG strings for leaflet icons (Teal accent)
const swordSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5"></polyline><line x1="13" x2="19" y1="19" y2="13"></line><line x1="16" x2="20" y1="16" y2="20"></line><line x1="19" x2="21" y1="21" y2="19"></line><polyline points="14.5 6.5 18 3 21 3 21 6 17.5 9.5"></polyline><line x1="5" x2="9" y1="14" y2="18"></line><line x1="7" x2="4" y1="17" y2="20"></line><line x1="3" x2="5" y1="19" y2="21"></line></svg>`

const iconHtml = `<div style="background:#14b8a6; padding:8px; border-radius:50%; border:3px solid #ffffff; box-shadow: 0 4px 12px rgba(20,184,166,0.4); display:flex; align-items:center; justify-content:center;">${swordSvg}</div>`

// Custom DivIcons
const badmintonIcon = L.divIcon({
  html: iconHtml,
  className: '',
  iconSize: [36, 36],
  iconAnchor: [18, 42],
  popupAnchor: [0, -42]
})

const pickleballIcon = L.divIcon({
  html: iconHtml,
  className: '',
  iconSize: [36, 36],
  iconAnchor: [18, 42],
  popupAnchor: [0, -42]
})

const userIcon = L.divIcon({
  html: `<div style="width:18px; height:18px; background:#111827; border-radius:50%; border:3px solid #ffffff; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>`,
  className: '',
  iconSize: [24, 24],
  iconAnchor: [12, 12]
})

const USER_POSITION = [15.968, 108.261]

function MapFlyTo({ selectedPosition }) {
  const map = useMap()
  useEffect(() => {
    if (selectedPosition) {
      map.flyTo(selectedPosition, 17, { duration: 1.2 })
    } else {
      map.flyTo(USER_POSITION, 16, { duration: 1.2 })
    }
  }, [selectedPosition, map])
  return null
}

const modernCardClass = "bg-white rounded-[12px] shadow-[0_2px_12px_-4px_rgba(0,0,0,0.06)] border border-gray-100"

export default function ApexBookingPage() {
  const [filter, setFilter] = useState('Tất cả')
  const [viewMode, setViewMode] = useState('list') // 'list' hoặc 'map'
  const [courts, setCourts] = useState([])
  const [selectedCourt, setSelectedCourt] = useState(null)
  
  // Map specific state
  const [selectedVenueId, setSelectedVenueId] = useState(null)

  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [minDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [selectedSlots, setSelectedSlots] = useState([])
  const [bookedSlots, setBookedSlots] = useState([])
  const [step, setStep] = useState(1) // 1=select court, 2=pick time, 3=confirm
  const [booked, setBooked] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('payos')
  const [escrowBalance, setEscrowBalance] = useState(0)
  const [createdBookingId, setCreatedBookingId] = useState(null)

  const { addToast } = useToast()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const origin = searchParams.get('origin')

  // Load Courts
  useEffect(() => {
    bookingApi.getCourts()
      .then(res => {
        if (res.data) {
          const courtsArray = Array.isArray(res.data) ? res.data : (res.data.items || []);
          const mappedCourts = courtsArray.map((c, index) => {
            const angle = (index * 0.85) % (2 * Math.PI)
            const lat = USER_POSITION[0] + Math.sin(angle) * 0.012 * (index + 1)
            const lng = USER_POSITION[1] + Math.cos(angle) * 0.012 * (index + 1)

            const courtType = c.courtTypeName || 'Badminton'
            const isBooked = !['available', 'active'].includes(c.status?.toLowerCase())

            return {
              id: c.courtId,
              name: c.name,
              type: courtType,
              price: c.pricePerHour > 0 ? c.pricePerHour : 150000,
              status: isBooked ? 'booked' : 'available',
              icon: courtType.toLowerCase().includes('pickleball') ? <Circle size={16} /> : <Swords size={16} />,
              capacity: 4,
              features: c.description ? c.description.split(',').map(s => s.trim()) : ['Sân thảm PVC Yonex cao cấp'],
              imageUrl: (
                c.name?.toLowerCase().includes('a1') ? '/images/caulong-a1.jpg' :
                c.name?.toLowerCase().includes('a2') ? '/images/caulong-a3.jpg' :
                c.name?.toLowerCase().includes('a3') ? '/images/caulong-a3.jpg' :
                c.name?.toLowerCase().includes('p1') ? '/images/pickleball-p1.jpg' :
                c.name?.toLowerCase().includes('p2') ? '/images/pickleball-p2.jpg' :
                (c.imageUrl && c.imageUrl.length > 5 ? c.imageUrl : (courtType.toLowerCase().includes('pickleball') ? '/images/pickleball-p1.jpg' : '/images/caulong-a1.jpg'))
              ),
              // Map specific fields
              distance: `${(0.4 + index * 0.7).toFixed(1)} KM`,
              rating: 4.8,
              position: [lat, lng],
              activePlayers: isBooked ? 8 : 4
            }
          })
          setCourts(mappedCourts)
        }
      })
      .catch(err => addToast('Lỗi tải danh sách sân: ' + (typeof err === 'string' ? err : err.message || 'Lỗi không xác định'), 'error'))

    // Load Wallet
    paymentApi.getEscrowWallet()
      .then(res => {
        if (res.data) setEscrowBalance(res.data.balance || 0)
      })
      .catch(err => console.error("Lỗi ví", err))
  }, [addToast])

  // Sync selected court with map selected venue
  useEffect(() => {
    if (selectedVenueId && step === 1) {
      const court = courts.find(c => c.id === selectedVenueId)
      if (court) setSelectedCourt(court)
    }
  }, [selectedVenueId, courts, step])

  // Load booked slots when court or date changes
  useEffect(() => {
    if (selectedCourt && selectedDate) {
      bookingApi.getBookedSlots(selectedCourt.id, selectedDate)
        .then(res => {
          if (res.data) {
            const slots = Array.isArray(res.data) ? res.data : []
            const normalized = slots.map(s => typeof s === 'string' ? s.substring(0, 5) : s)
            setBookedSlots(normalized)
          } else {
            setBookedSlots([])
          }
        })
        .catch(err => console.error('Lỗi tải giờ bận', err))
    }
  }, [selectedCourt, selectedDate])

  const filtered = courts.filter(c => filter === 'Tất cả' || (filter === 'Cầu lông' && c.type === 'Badminton') || (filter === 'Pickleball' && c.type === 'Pickleball'))
  
  const activeVenueInfo = courts.find(c => c.id === selectedVenueId)

  function handleSelectCourt(court) {
    if (court.status === 'booked') return
    setSelectedCourt(court)
    setSelectedVenueId(court.id)
    setStep(2)
  }

  function toggleSlot(slot) {
    if (bookedSlots.includes(slot)) return

    setSelectedSlots(prev => {
        if (prev.includes(slot)) return prev.filter(s => s !== slot)

        if (prev.length > 0) {
            const slotHour = parseInt(slot.split(':')[0])
            const prevHours = prev.map(s => parseInt(s.split(':')[0]))
            const minHour = Math.min(...prevHours)
            const maxHour = Math.max(...prevHours)

            if (slotHour !== minHour - 1 && slotHour !== maxHour + 1) {
                addToast("Vui lòng chọn các khung giờ liên tiếp", "warning")
                return prev
            }
        }
        return [...prev, slot].sort()
    })
  }

  const totalPrice = selectedCourt ? selectedSlots.length * selectedCourt.price : 0

  function calculateEndTime(lastSlot) {
    if (!lastSlot) return ''
    const h = parseInt(lastSlot.split(':')[0])
    return `${String(h + 1).padStart(2, '0')}:00`
  }

  async function handleConfirm() {
    if (selectedSlots.length === 0) return

    if (paymentMethod === 'escrow' && escrowBalance < totalPrice) {
      addToast(`Số dư ví không đủ! (Cần thêm ${(totalPrice - escrowBalance).toLocaleString('vi-VN')} VNĐ). Vui lòng nạp tiền.`, "error");
      return;
    }

    setIsLoading(true)
    try {
      const startTime = selectedSlots[0].length === 5 ? selectedSlots[0] + ':00' : selectedSlots[0]
      const lastSlot = selectedSlots[selectedSlots.length - 1]
      const endTimeStr = calculateEndTime(lastSlot)
      const endTime = endTimeStr.length === 5 ? endTimeStr + ':00' : endTimeStr

      const payload = {
        details: [
          {
            courtId: selectedCourt.id,
            bookingDate: selectedDate,
            startTime: startTime,
            endTime: endTime
          }
        ]
      }

      const res = await bookingApi.createBooking(payload)

      if (res.statusCode === 200 || res.statusCode === 201) {
        const bookingId = res.data?.bookingId

        if (!bookingId) {
            addToast("Không nhận được mã đặt sân từ server.", "error")
            setIsLoading(false)
            return
        }

        if (paymentMethod === 'payos') {
          const payosRes = await paymentApi.createPayOsUrl(0, 'Booking', bookingId)
          if (payosRes.statusCode === 200 && payosRes.data) {
             addToast('Bạn có 15 phút để hoàn tất thanh toán. Quá hạn sẽ tự động hủy đơn.', 'warning')
             // Redirect user to PayOS portal
             window.location.assign(payosRes.data)
             return
          } else {
             addToast("Không thể tạo link thanh toán PayOS", "error")
          }
        } else if (paymentMethod === 'escrow') {
          const escrowRes = await paymentApi.payBookingByEscrow(bookingId)
          if (escrowRes.statusCode === 200) {
            setCreatedBookingId(bookingId)
            setBooked(true)
          } else {
            addToast("Lỗi thanh toán ví: " + escrowRes.message, "error")
          }
        }
      } else {
        addToast(res.message || "Lỗi đặt sân", "error")
      }
    } catch (error) {
      const errMsg = typeof error === 'string' ? error : (error?.response?.data?.message || error?.message || "Có lỗi xảy ra");
      addToast(errMsg, "error")
    } finally {
      setIsLoading(false)
    }
  }

  if (booked) {
    return (
      <ApexLayout>
        <div className="bg-[#F8F9FA] min-h-screen py-12">
          <div className="max-w-[500px] mx-auto p-10 text-center auth-animate-in bg-white rounded-[24px] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100">
            <div className="w-20 h-20 rounded-full bg-teal-50 flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={40} className="text-[#14b8a6]" />
            </div>
            <h2 className="font-bold text-[24px] text-[#0f172a] mb-2 m-0 tracking-tight">Đặt sân thành công!</h2>
            <p className="text-[18px] font-bold text-[#14b8a6] mb-2 m-0 uppercase">{selectedCourt?.name}</p>
            <p className="text-gray-500 mb-8 text-[14px] m-0 font-medium">{dayjs(selectedDate).format('DD/MM/YYYY')} · {selectedSlots[0]} – {calculateEndTime(selectedSlots[selectedSlots.length - 1])}</p>

            <div className="bg-[#F8F9FA] rounded-[16px] p-6 mb-8 text-center border border-gray-100">
              <p className="text-[13px] text-gray-500 mb-1 m-0 font-bold uppercase tracking-wide">Đã thanh toán</p>
              <p className="text-3xl font-bold text-[#0f172a] m-0">{totalPrice.toLocaleString('vi-VN')} đ</p>
              <p className="text-[12px] text-gray-400 mt-2 m-0 font-medium">qua {paymentMethod === 'payos' ? 'PayOS' : 'Ví Pro-Sport'}</p>
            </div>

            {origin === 'host_match' ? (
              <button
                className="w-full bg-[#14b8a6] hover:bg-[#0f9e8c] text-white h-14 rounded-full text-[14px] font-bold uppercase tracking-wide transition-all shadow-[0_4px_14px_rgba(20,184,166,0.25)] border-0 cursor-pointer"
                onClick={() => navigate(`/matches/create?step=2&new_booking_id=${createdBookingId}`)}
              >
                Quay lại hoàn thành tạo trận
              </button>
            ) : (
              <button
                className="w-full bg-[#14b8a6] hover:bg-[#0f9e8c] text-white h-14 rounded-full text-[14px] font-bold uppercase tracking-wide transition-all shadow-[0_4px_14px_rgba(20,184,166,0.25)] border-0 cursor-pointer"
                onClick={() => { setBooked(false); setStep(1); setSelectedCourt(null); setSelectedSlots([]); setSelectedVenueId(null); }}
              >
                Đặt thêm sân khác
              </button>
            )}
          </div>
        </div>
      </ApexLayout>
    )
  }

  return (
    <ApexLayout>
      <div className="bg-[#F8F9FA] min-h-screen">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-10 auth-animate-in pb-28 lg:pb-12 font-sans">

          {/* Header & Stepper */}
          <div className="flex max-md:flex-col md:items-end justify-between gap-6 mb-10">
            <div>
              <h1 className="font-heading text-4xl uppercase tracking-tight text-[#0f172a] mb-2 m-0">ĐẶT SÂN</h1>
              <p className="text-[14.5px] text-gray-500 m-0">Chọn môn thể thao, thời gian và bắt đầu trận đấu.</p>
            </div>

            <div className="flex items-center gap-3">
              {['Chọn sân', 'Chọn giờ', 'Xác nhận'].map((s, i) => (
                <div key={s} className="flex items-center gap-3">
                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all ${
                    step === i + 1 ? 'bg-teal-50 text-[#14b8a6]' :
                    step > i + 1 ? 'bg-gray-100 text-[#0f172a]' : 'text-gray-400'
                  }`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[12px] font-bold ${
                      step === i + 1 ? 'bg-[#14b8a6] text-white shadow-sm' :
                      step > i + 1 ? 'bg-[#0f172a] text-white' : 'bg-gray-200 text-gray-500'
                    }`}>
                      {step > i + 1 ? <Check size={14} /> : i + 1}
                    </div>
                    <span className="text-[13px] font-bold hidden sm:block">{s}</span>
                  </div>
                  {i < 2 && <div className="w-8 h-[2px] bg-gray-200 rounded-full" />}
                </div>
              ))}
            </div>
          </div>

          {/* Step 1: Select Court (List / Map View) */}
          {step === 1 && (
            <div className="auth-animate-fade">
              
              {/* Category Filters & View Mode Toggle */}
              <div className="flex max-md:flex-col items-center justify-between gap-6 mb-10 bg-white p-2 pl-4 rounded-full shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-gray-100/50 relative z-10">
                <div className="flex flex-wrap gap-2 w-full md:w-auto">
                  {sportTypes.map(t => (
                    <button
                      key={t}
                      className={`px-5 py-2.5 rounded-full text-[14px] font-bold transition-all duration-300 cursor-pointer border-0 ${
                        filter === t
                          ? 'bg-[#0f172a] text-white shadow-[0_4px_12px_rgba(15,23,42,0.2)]'
                          : 'bg-transparent text-gray-500 hover:bg-gray-100 hover:text-[#0f172a]'
                      }`}
                      onClick={() => setFilter(t)}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                <div className="flex bg-[#F8F9FA] p-1.5 rounded-full border border-gray-200/60 shadow-inner w-full md:w-auto">
                  <button 
                    className={`flex-1 md:w-[140px] h-10 flex items-center justify-center gap-2.5 rounded-full text-[13.5px] font-bold uppercase tracking-wider transition-all duration-300 border-0 cursor-pointer ${
                      viewMode === 'list' 
                        ? 'bg-[#14b8a6] text-white shadow-[0_4px_14px_rgba(20,184,166,0.35)] transform scale-100' 
                        : 'bg-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-200/50'
                    }`}
                    onClick={() => setViewMode('list')}
                  >
                    <List size={18} strokeWidth={viewMode === 'list' ? 2.5 : 2} /> 
                    Danh sách
                  </button>
                  <button 
                    className={`flex-1 md:w-[140px] h-10 flex items-center justify-center gap-2.5 rounded-full text-[13.5px] font-bold uppercase tracking-wider transition-all duration-300 border-0 cursor-pointer ${
                      viewMode === 'map' 
                        ? 'bg-[#14b8a6] text-white shadow-[0_4px_14px_rgba(20,184,166,0.35)] transform scale-100' 
                        : 'bg-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-200/50'
                    }`}
                    onClick={() => setViewMode('map')}
                  >
                    <Map size={18} strokeWidth={viewMode === 'map' ? 2.5 : 2} /> 
                    Bản đồ
                  </button>
                </div>
              </div>

              {/* LIST VIEW */}
              {viewMode === 'list' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {courts.length === 0 && filtered.length === 0 && (
                    <div className="col-span-full py-20 text-center text-gray-500 text-[14px]">Đang tải danh sách sân...</div>
                  )}
                  {courts.length > 0 && filtered.length === 0 && (
                    <div className="col-span-full py-20 text-center text-gray-500 text-[14px]">Không có sân phù hợp với bộ lọc hiện tại.</div>
                  )}
                  {filtered.map(court => (
                    <div
                      key={court.id}
                      className={`flex flex-col justify-between overflow-hidden transition-all duration-300 bg-white rounded-[20px] border border-gray-100 ${
                        court.status === 'booked' ? 'opacity-60 cursor-not-allowed filter grayscale-[0.3]' :
                        selectedCourt?.id === court.id ? 'ring-2 ring-[#14b8a6] shadow-[0_8px_30px_rgba(20,184,166,0.15)] cursor-pointer -translate-y-1' :
                        'shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:-translate-y-1 cursor-pointer'
                      }`}
                      onClick={() => court.status !== 'booked' && setSelectedCourt(court)}
                    >
                      {/* Thumbnail Image */}
                      <div className="h-[180px] relative bg-gray-100 overflow-hidden">
                        <img src={court.imageUrl} alt={court.name} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                        <span className={`absolute top-4 left-4 px-3 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider shadow-sm ${
                          court.status === 'booked' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
                        }`}>
                          {court.status === 'booked' ? 'Tạm ngưng' : 'Khả dụng'}
                        </span>
                      </div>

                      <div className="p-6 flex-1 flex flex-col">
                        <h3 className="font-bold text-[18px] uppercase tracking-tight text-[#0f172a] m-0 mb-2">{court.name}</h3>
                        <p className="text-[13px] text-gray-500 mb-4 flex items-center gap-1.5 font-medium m-0">
                          <span className="text-[#14b8a6]">{court.icon}</span> 
                          {court.type === 'Badminton' ? 'Cầu lông' : court.type}
                        </p>
                        
                        <div className="flex flex-col gap-2 mt-auto">
                          <div className="flex items-center gap-2 text-[13px] text-gray-600 font-medium">
                            <Users size={16} className="text-gray-400" /> Tối đa {court.capacity} người
                          </div>
                          <div className="flex items-center gap-2 text-[13px] text-gray-600 font-medium">
                            <Info size={16} className="text-gray-400" /> <span className="line-clamp-1">{court.features[0] || 'Sân đạt chuẩn'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-6 pt-2 mt-auto">
                        <div className="flex items-baseline gap-1">
                          <span className="text-[20px] font-bold text-[#0f172a] m-0">{court.price.toLocaleString('vi-VN')}đ</span>
                          <span className="text-[13px] text-gray-500 font-medium">/h</span>
                        </div>
                        {court.status !== 'booked' && (
                          <button
                            className={`h-10 px-5 rounded-full text-[13px] font-bold uppercase tracking-wide transition-all border-0 cursor-pointer shadow-sm ${
                              selectedCourt?.id === court.id
                                ? 'bg-[#0f172a] text-white'
                                : 'bg-[#14b8a6] hover:bg-[#0f9e8c] text-white shadow-[0_4px_12px_rgba(20,184,166,0.25)]'
                            }`}
                            onClick={(e) => { e.stopPropagation(); handleSelectCourt(court); }}
                          >
                            {selectedCourt?.id === court.id ? 'Đã chọn' : 'Chọn sân'}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* MAP VIEW */}
              {viewMode === 'map' && (
                <div className="flex flex-col gap-6 animate-fade-in">
                  
                  {/* Map Hero */}
                  <div className={`w-full h-[380px] max-sm:h-[300px] overflow-hidden relative z-0 rounded-[20px] shadow-sm border border-gray-100`}>
                    <div className="absolute top-4 left-4 z-[400]">
                      <span className="bg-white/95 backdrop-blur text-[#14b8a6] px-4 py-2 rounded-full flex items-center gap-2 text-[12px] font-bold uppercase tracking-wider shadow-sm border border-gray-100">
                        <MapPin size={14} /> FPT City Complex
                      </span>
                    </div>

                    <MapContainer center={USER_POSITION} zoom={16} scrollWheelZoom={true} className="w-full h-full z-0 bg-gray-100">
                      <TileLayer
                        attribution='&copy; <a href="https://carto.com/">CartoDB</a>'
                        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                      />
                      <MapFlyTo selectedPosition={activeVenueInfo?.position} />
                      <Marker position={USER_POSITION} icon={userIcon} zIndexOffset={1000} />

                      {filtered.map(v => (
                        <Marker
                          key={v.id}
                          position={v.position}
                          icon={v.type === 'Badminton' ? badmintonIcon : pickleballIcon}
                          eventHandlers={{
                            click: () => setSelectedVenueId(v.id)
                          }}
                        >
                          <Popup className="mp-popup-modern">
                            <div className="w-[220px] flex flex-col bg-white rounded-[12px] overflow-hidden shadow-xl">
                              <img src={v.imageUrl} alt={v.name} className="w-full h-[110px] object-cover" />
                              <div className="p-3">
                                <h3 className="font-bold text-gray-900 text-[14px] leading-tight m-0 mb-1">{v.name}</h3>
                                <p className="text-[12px] text-gray-500 mb-3 m-0">{v.distance} • <strong className="text-gray-900">{v.price.toLocaleString('vi-VN')}đ</strong>/giờ</p>
                                <button 
                                  className="w-full bg-[#14b8a6] hover:bg-[#15c3b0] text-white font-bold text-[12px] uppercase tracking-wide py-2.5 rounded-[8px] transition-colors cursor-pointer outline-none border-0"
                                  onClick={() => handleSelectCourt(v)}
                                >
                                  Chọn sân này
                                </button>
                              </div>
                            </div>
                          </Popup>
                        </Marker>
                      ))}
                    </MapContainer>
                  </div>

                  {/* Horizontal List below Map */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                    {filtered.map(v => (
                      <div
                        key={v.id}
                        className={`overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-[0_8px_24px_-4px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 flex flex-col ${modernCardClass} ${selectedVenueId === v.id ? 'ring-2 ring-[#14b8a6]' : ''}`}
                        onClick={() => setSelectedVenueId(v.id)}
                      >
                        <div className="relative w-full h-[140px] overflow-hidden">
                          <span className="absolute top-3 left-3 bg-black/40 backdrop-blur-md text-white px-3 py-1 rounded-full text-[11px] font-bold tracking-wider">
                            ★ {v.rating}
                          </span>
                          <span className="absolute top-3 right-3 bg-black/40 backdrop-blur-md text-white px-3 py-1 rounded-full text-[11px] font-bold tracking-wider">
                            {v.distance}
                          </span>
                          <img src={v.imageUrl} alt={v.name} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                        </div>

                        <div className="p-4 flex flex-col flex-1 bg-white">
                          <h3 className="font-bold text-gray-900 text-[16px] mb-1.5 m-0 line-clamp-1">{v.name}</h3>
                          <p className="text-[13px] text-gray-500 mb-3 m-0 font-medium">
                            {v.type === 'Badminton' ? 'Cầu lông' : 'Pickleball'} • {v.capacity} Người
                          </p>
                          
                          <span className="flex items-center gap-1.5 text-[12px] font-medium text-gray-600 mb-4">
                            <div className="w-2 h-2 rounded-full bg-[#14b8a6]"></div>
                            {v.activePlayers} người đang chơi
                          </span>

                          <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100 group">
                            <span className="font-bold text-[16px] text-gray-900">
                              {v.price.toLocaleString('vi-VN')}đ<span className="font-normal text-[12px] text-gray-500 ml-0.5">/giờ</span>
                            </span>
                            <span 
                              className="text-[13px] font-bold text-[#14b8a6] flex items-center gap-1 group-hover:underline"
                              onClick={(e) => { e.stopPropagation(); handleSelectCourt(v); }}
                            >
                              Chọn sân <span className="text-[14px]">➔</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              )}
            </div>
          )}

          {/* Step 2: Pick Time */}
          {step === 2 && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 auth-animate-fade">
              {/* Left: Time Picker */}
              <div className="lg:col-span-2 bg-white rounded-[24px] shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-gray-100 p-5 md:p-8">
                <div className="flex max-sm:flex-col sm:items-center justify-between gap-4 mb-6 md:mb-8 pb-4 md:pb-6 border-b border-gray-100">
                  <h2 className="text-[18px] md:text-[20px] font-bold uppercase tracking-tight text-[#0f172a] m-0">Chọn khung giờ</h2>
                  <div className="flex items-center gap-2 bg-[#F8F9FA] p-1.5 rounded-full border border-gray-200">
                    <span className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-500 shrink-0"><Calendar size={16} /></span>
                    <input
                      id="booking-date"
                      type="date"
                      value={selectedDate}
                      min={minDate}
                      onChange={e => { setSelectedDate(e.target.value); setSelectedSlots([]); }}
                      className="h-8 pr-4 bg-transparent text-[13px] md:text-[14px] font-bold text-[#0f172a] cursor-pointer outline-none transition-all appearance-none border-0"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 md:gap-6 mb-6 md:mb-8 text-[12px] md:text-[13px] font-bold text-gray-500">
                  <div className="flex items-center gap-2"><span className="w-4 h-4 rounded-full bg-[#F8F9FA] border border-gray-200" /> Trống</div>
                  <div className="flex items-center gap-2"><span className="w-4 h-4 rounded-full bg-[#14b8a6] shadow-[0_0_10px_rgba(20,184,166,0.3)]" /> Đang chọn</div>
                  <div className="flex items-center gap-2"><span className="w-4 h-4 rounded-full bg-gray-200" /> Kín chỗ / Quá hạn</div>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                  {timeSlots.map(slot => {
                    const isBooked = bookedSlots.includes(slot)
                    const isSelected = selectedSlots.includes(slot)
                    const isPast = selectedDate === minDate && slot < new Date().toTimeString().slice(0, 5)
                    const isDisabled = isBooked || isPast

                    return (
                      <button
                        key={slot}
                        className={`h-12 rounded-[12px] text-[15px] font-bold transition-all border cursor-pointer ${
                          isDisabled
                            ? 'bg-gray-50 border-gray-100 text-gray-400 cursor-not-allowed opacity-50'
                            : isSelected
                            ? 'bg-[#14b8a6] border-[#14b8a6] text-white shadow-[0_4px_12px_rgba(20,184,166,0.3)] transform -translate-y-0.5'
                            : 'bg-white border-gray-200 text-gray-600 hover:border-[#14b8a6] hover:text-[#14b8a6] hover:bg-teal-50'
                        }`}
                        onClick={() => toggleSlot(slot)}
                        disabled={isDisabled}
                      >
                        {slot}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Right: Summary Panel */}
              <div className="bg-white rounded-[24px] shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-gray-100 p-6 md:p-8 h-fit lg:sticky lg:top-24">
                <h3 className="text-[16px] md:text-[18px] font-bold uppercase tracking-tight text-[#0f172a] mb-6 m-0">Tóm tắt đặt sân</h3>

                <div className="flex items-center gap-4 mb-8 bg-[#F8F9FA] p-4 rounded-[16px] border border-gray-100">
                  <img src={selectedCourt.imageUrl} alt="" className="w-16 h-16 rounded-[12px] object-cover shrink-0 shadow-sm" />
                  <div>
                    <p className="text-[15px] font-bold uppercase text-[#0f172a] leading-tight m-0 mb-1">{selectedCourt.name}</p>
                    <p className="text-[13px] font-bold text-[#14b8a6] m-0">{selectedCourt.type === 'Badminton' ? 'Cầu lông' : selectedCourt.type}</p>
                  </div>
                </div>

                <div className="space-y-5 mb-8">
                  <div className="flex items-center justify-between text-[14.5px]">
                    <span className="text-gray-500 font-medium">Ngày chơi</span>
                    <strong className="text-[#0f172a]">{dayjs(selectedDate).format('DD/MM/YYYY')}</strong>
                  </div>
                  <div className="flex items-center justify-between text-[14.5px]">
                    <span className="text-gray-500 font-medium">Khung giờ</span>
                    <strong className="text-[#0f172a] text-right max-w-[140px] truncate">{selectedSlots.length > 0 ? selectedSlots.join(', ') : '—'}</strong>
                  </div>
                  <div className="flex items-center justify-between text-[14.5px]">
                    <span className="text-gray-500 font-medium">Thời lượng</span>
                    <strong className="text-[#0f172a]">{selectedSlots.length} tiếng</strong>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100 mb-8">
                  <div className="flex items-center justify-between">
                    <span className="text-[14px] font-bold uppercase tracking-wide text-gray-500 m-0">Tổng tiền</span>
                    <strong className="text-[24px] font-black text-[#14b8a6]">{totalPrice.toLocaleString('vi-VN')} đ</strong>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <button
                    className={`h-12 rounded-full text-[14px] font-bold uppercase tracking-wide transition-all flex items-center justify-center gap-2 border-0 ${
                      selectedSlots.length === 0
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-[#14b8a6] hover:bg-[#0f9e8c] text-white shadow-[0_4px_14px_rgba(20,184,166,0.3)] cursor-pointer'
                    }`}
                    disabled={selectedSlots.length === 0}
                    onClick={() => setStep(3)}
                  >
                    Tiếp tục thanh toán <ArrowRight size={18} />
                  </button>
                  <button
                    className="bg-white text-gray-500 hover:text-[#0f172a] h-12 rounded-full text-[13px] font-bold uppercase tracking-wide transition-colors cursor-pointer flex items-center justify-center gap-2 border border-transparent hover:bg-gray-50"
                    onClick={() => { setStep(1); setSelectedSlots([]) }}
                  >
                    <ArrowLeft size={16} /> Đổi sân khác
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Confirm */}
          {step === 3 && (
            <div className="max-w-[700px] mx-auto auth-animate-fade">
              <h2 className="text-[20px] font-bold uppercase tracking-tight text-[#0f172a] mb-8 m-0 text-center">Xác nhận thanh toán</h2>

              <div className="bg-white rounded-[24px] shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-gray-100 p-8 mb-8">
                <div className="space-y-6 mb-8">
                  <div className="flex max-sm:flex-col sm:items-center justify-between pb-4 border-b border-gray-100">
                    <span className="text-[14px] font-medium text-gray-500 mb-1 sm:mb-0">Sân bãi</span>
                    <strong className="text-[16px] font-bold uppercase text-[#0f172a] flex items-center gap-2"><span className="text-[#14b8a6]">{selectedCourt.icon}</span> {selectedCourt.name}</strong>
                  </div>
                  <div className="flex max-sm:flex-col sm:items-center justify-between pb-4 border-b border-gray-100">
                    <span className="text-[14px] font-medium text-gray-500 mb-1 sm:mb-0">Ngày chơi</span>
                    <strong className="text-[16px] font-bold text-[#0f172a] flex items-center gap-2"><Calendar size={18} className="text-gray-400" /> {dayjs(selectedDate).format('DD/MM/YYYY')}</strong>
                  </div>
                  <div className="flex max-sm:flex-col sm:items-center justify-between pb-4 border-b border-gray-100">
                    <span className="text-[14px] font-medium text-gray-500 mb-1 sm:mb-0">Khung giờ</span>
                    <strong className="text-[16px] font-bold text-[#14b8a6]">{selectedSlots[0]} – {calculateEndTime(selectedSlots[selectedSlots.length - 1])}</strong>
                  </div>
                  <div className="flex max-sm:flex-col sm:items-center justify-between">
                    <span className="text-[14px] font-medium text-gray-500 mb-1 sm:mb-0">Thời lượng</span>
                    <strong className="text-[16px] font-bold text-[#0f172a]">{selectedSlots.length} tiếng</strong>
                  </div>
                </div>

                <div className="p-6 bg-[#F8F9FA] rounded-[16px] flex items-center justify-between mb-8 border border-gray-100">
                  <span className="text-[15px] font-bold uppercase tracking-wide text-gray-500 m-0">Tổng thanh toán</span>
                  <strong className="text-[28px] font-black text-[#14b8a6]">{totalPrice.toLocaleString('vi-VN')} đ</strong>
                </div>

                <div className="mb-8">
                  <h3 className="text-[15px] font-bold text-[#0f172a] mb-4 m-0">Chọn nguồn tiền thanh toán</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label className={`flex items-start gap-4 p-5 rounded-[16px] border-2 cursor-pointer transition-all ${
                      paymentMethod === 'payos' ? 'border-[#14b8a6] bg-teal-50/50 shadow-sm' : 'border-gray-100 hover:border-gray-200 hover:bg-[#F8F9FA]'
                    }`}>
                      <input type="radio" name="payment" checked={paymentMethod === 'payos'} onChange={() => setPaymentMethod('payos')} className="w-4 h-4 accent-[#14b8a6]" />
                      <span className="text-[15px] font-bold text-[#0f172a] flex items-center gap-3"><CreditCard size={20} className="text-[#14b8a6]" /> PayOS</span>
                    </label>
                    <label className={`flex flex-col justify-center p-5 rounded-[16px] border-2 cursor-pointer transition-all ${
                      paymentMethod === 'escrow' ? 'border-[#14b8a6] bg-teal-50/50 shadow-sm' : 'border-gray-100 hover:border-gray-200 hover:bg-[#F8F9FA]'
                    }`}>
                      <div className="flex items-center gap-4 mb-1">
                        <input type="radio" name="payment" checked={paymentMethod === 'escrow'} onChange={() => setPaymentMethod('escrow')} className="w-4 h-4 accent-[#14b8a6]" />
                        <span className="text-[15px] font-bold text-[#0f172a] flex items-center gap-3"><Wallet size={20} className="text-[#14b8a6]" /> Ví cá nhân</span>
                      </div>
                      <span className="text-[13px] font-medium text-gray-500 ml-9">Số dư khả dụng: {escrowBalance.toLocaleString('vi-VN')} đ</span>
                    </label>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <button
                    className="bg-white text-gray-600 hover:text-[#0f172a] border border-gray-200 hover:border-gray-300 hover:bg-gray-50 w-full sm:w-1/3 h-14 rounded-full text-[14px] font-bold uppercase tracking-wide transition-colors cursor-pointer flex items-center justify-center gap-2"
                    disabled={isLoading}
                    onClick={() => setStep(2)}
                  >
                    <ArrowLeft size={18} /> Đổi giờ
                  </button>
                  <button
                    className="bg-[#14b8a6] hover:bg-[#0f9e8c] text-white flex-1 h-14 rounded-full text-[15px] font-bold uppercase tracking-wide transition-all shadow-[0_4px_16px_rgba(20,184,166,0.3)] border-0 cursor-pointer flex items-center justify-center"
                    disabled={isLoading}
                    onClick={handleConfirm}
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        Đang xử lý...
                      </span>
                    ) : (
                      `Thanh toán ngay`
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Popup modern style override */}
      <style dangerouslySetInnerHTML={{__html: `
        .mp-popup-modern .leaflet-popup-content-wrapper { background: transparent !important; padding: 0 !important; border-radius: 0 !important; box-shadow: none !important; }
        .mp-popup-modern .leaflet-popup-content { margin: 0 !important; width: auto !important; }
        .mp-popup-modern .leaflet-popup-tip-container { display: none; }
      `}} />
    </ApexLayout>
  )
}
