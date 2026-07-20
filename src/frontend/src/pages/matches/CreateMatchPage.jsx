import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { bookingApi } from '../../api/bookingApi'
import { matchApi } from '../../api/matchApi'
import { useToast } from '../../components/Toast'
import { ArrowLeft, Info, Check, ArrowRight, Calendar, Clock, Plus, X } from 'lucide-react'
import dayjs from 'dayjs'
import ProSportLogo from '../../components/ui/ProSportLogo'

export default function CreateMatchPage() {
  const [step, setStep] = useState(1)
  const [showExitModal, setShowExitModal] = useState(false)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { addToast } = useToast()

  const [myBookings, setMyBookings] = useState([])
  const [formData, setFormData] = useState({
    skillLevel: 'Mới chơi',
    bookingId: '',
    maxParticipants: 2,
    escrowAmount: 40000,
    notes: ''
  })
  const [isLoading, setIsLoading] = useState(false)

  function handleExitRequest() {
    const isDirty = step > 1 || formData.bookingId !== '' || formData.notes.trim() !== '';
    if (isDirty) {
      setShowExitModal(true)
    } else {
      navigate('/matches')
    }
  }

  useEffect(() => {
    bookingApi.getMyBookings()
      .then(res => {
        if(res.data) setMyBookings(res.data)
      })
      .catch(err => console.error(err))

    const draftStr = localStorage.getItem('draft_match_creation')
    const urlStep = searchParams.get('step')
    const newBookingId = searchParams.get('new_booking_id')
    
    if (draftStr && urlStep === '2') {
      try {
        const draft = JSON.parse(draftStr)
        if (newBookingId) {
          draft.bookingId = newBookingId
        }
        setFormData(draft)
        setStep(2)
      } catch (e) { console.error(e) }
    }
  }, [searchParams])

  async function handleCreate() {
    if (!formData.bookingId) {
      addToast("Vui lòng chọn một sân đã đặt", "error")
      return
    }

    const selectedBooking = myBookings.find(b => b.bookingId == formData.bookingId)
    const detail = selectedBooking?.details?.[0]
    
    if (!detail) {
      addToast("Dữ liệu đơn đặt sân không hợp lệ", "error")
      return
    }

    setIsLoading(true)
    try {
      const payload = {
        courtId: detail.courtId,
        bookingId: parseInt(formData.bookingId),
        matchDate: detail.bookingDate,
        startTime: detail.startTime,
        endTime: detail.endTime,
        maxParticipants: parseInt(formData.maxParticipants),
        escrowAmount: parseFloat(formData.escrowAmount),
        levelRequirement: formData.skillLevel,
        notes: formData.notes
      }

      const res = await matchApi.createMatch(payload)
      if (res.statusCode === 200 || res.statusCode === 201) {
        addToast("Tạo trận đấu thành công!", "success")
        localStorage.removeItem('draft_match_creation')
        navigate('/matches')
      } else {
        addToast(res.message || "Có lỗi xảy ra", "error")
      }
    } catch (error) {
      let errorMsg = "Có lỗi xảy ra"
      if (error.response?.data?.message) {
         errorMsg = error.response.data.message
      } else if (error.response?.data?.errors) {
         const errors = error.response.data.errors
         if (typeof errors === 'object' && !Array.isArray(errors)) {
           // extract first error from validation dictionary
           errorMsg = Object.values(errors)[0]?.[0] || JSON.stringify(errors)
         } else {
           errorMsg = JSON.stringify(errors)
         }
      } else if (error.message) {
         errorMsg = error.message
      }
      addToast(errorMsg, "error")
    } finally {
      setIsLoading(false)
    }
  }

  const selectedBooking = myBookings.find(b => b.bookingId == formData.bookingId)

  const inputClasses = "w-full px-4 h-12 bg-[#F8F9FA] border border-gray-200 rounded-[12px] text-[14.5px] text-gray-700 focus:bg-white focus:border-[#14b8a6] focus:ring-4 focus:ring-[#14b8a6]/10 transition-all outline-none"

  return (
    <div className="flex flex-col min-h-screen bg-[#F8F9FA] font-sans">
      {/* Focus Header */}
      <div className="h-[76px] bg-[#0f172a]/95 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-6 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Link
            to="/apex"
            className="flex items-center justify-center w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-white cursor-pointer"
            title="Về trang chủ APEX"
          >
            <ArrowLeft size={20} />
          </Link>
          <div className="cursor-pointer" onClick={handleExitRequest}>
             <ProSportLogo size="sm" variant="light" />
          </div>
        </div>
        <button 
           onClick={handleExitRequest}
           className="h-10 px-5 rounded-full bg-white/10 hover:bg-red-500 text-white text-[13px] font-bold uppercase tracking-wide transition-colors flex items-center gap-2 border-0 cursor-pointer"
        >
           Thoát <X size={16} />
        </button>
      </div>

      <div className="max-w-[700px] mx-auto px-6 pt-[60px] pb-20 w-full flex-1">
        <div className="mb-10 text-center relative">
          <h1 className="font-heading text-3xl sm:text-4xl uppercase tracking-tight text-[#0f172a] m-0 mb-2">Tổ chức trận giao lưu</h1>
          <p className="text-gray-500 text-[14.5px] m-0">Tìm đồng đội, chia sẻ tiền sân dễ dàng qua ví ký quỹ.</p>
        </div>

        <div className="bg-white rounded-[24px] shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden">
          
          {/* Progress Indicator */}
          <div className="px-8 pt-8 pb-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex-1">
                <div className={`h-1.5 rounded-full transition-colors ${step >= 1 ? 'bg-[#14b8a6]' : 'bg-gray-100'}`} />
              </div>
              <div className="flex-1">
                <div className={`h-1.5 rounded-full transition-colors ${step >= 2 ? 'bg-[#14b8a6]' : 'bg-gray-100'}`} />
              </div>
              <div className="flex-1">
                <div className={`h-1.5 rounded-full transition-colors ${step >= 3 ? 'bg-[#14b8a6]' : 'bg-gray-100'}`} />
              </div>
            </div>
            <div className="flex justify-between text-[11px] font-bold text-gray-400 uppercase tracking-wider px-1">
              <span className={step >= 1 ? 'text-[#14b8a6]' : ''}>Thông tin</span>
              <span className={step >= 2 ? 'text-[#14b8a6]' : ''}>Địa điểm</span>
              <span className={step >= 3 ? 'text-[#14b8a6]' : ''}>Chi phí</span>
            </div>
          </div>

          <div className="p-8 pt-4">
            {/* Step 1: Thông tin cơ bản */}
            {step === 1 && (
              <div className="auth-animate-fade">
                <h2 className="font-bold text-[20px] text-[#0f172a] mb-6 m-0">Thông tin cơ bản</h2>
                <p className="text-[13.5px] text-gray-500 -mt-4 mb-6">Bộ môn và tên trận sẽ tự động lấy theo sân bạn đã đặt ở bước tiếp theo.</p>
                <div className="space-y-6">
                  <div>
                    <label className="block text-[13px] font-bold text-gray-600 mb-2">Trình độ yêu cầu</label>
                    <div className="flex gap-3">
                      {['Mới chơi', 'Trung bình', 'Khá / Giỏi'].map(level => (
                        <button 
                          key={level}
                          type="button" 
                          onClick={() => setFormData({...formData, skillLevel: level})} 
                          className={`flex-1 py-3 rounded-[12px] text-[13.5px] font-bold transition-all border cursor-pointer ${
                            formData.skillLevel === level 
                            ? 'border-[#14b8a6] bg-teal-50/50 text-[#14b8a6] shadow-sm' 
                            : 'border-gray-200 bg-white text-gray-500 hover:border-[#14b8a6] hover:text-[#14b8a6]'
                          }`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setStep(2)} 
                  className="w-full h-12 mt-10 rounded-full bg-[#14b8a6] hover:bg-[#0f9e8c] text-white text-[14px] font-bold uppercase tracking-wide transition-all shadow-[0_4px_14px_rgba(20,184,166,0.25)] border-0 cursor-pointer flex items-center justify-center gap-2"
                >
                  Tiếp tục <ArrowRight size={18} />
                </button>
              </div>
            )}

            {/* Step 2: Địa điểm & Thời gian */}
            {step === 2 && (
              <div className="auth-animate-fade">
                <h2 className="font-bold text-[20px] text-[#0f172a] mb-6 m-0">Địa điểm & Thời gian</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                  <div className="md:col-span-3 flex flex-col">
                    <label className="block text-[13px] font-bold text-gray-600 mb-3">Chọn đơn đặt sân của bạn</label>
                    <div className="flex flex-col gap-3 max-h-[350px] overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin' }}>
                      {(() => {
                        const eligibleBookings = myBookings.filter(b => {
                          const detail = b.details?.[0];
                          if (!detail) return false;
                          const dateObj = new Date(detail.bookingDate)
                          const isValidDate = !isNaN(dateObj.getTime())
                          const bookingDateStr = isValidDate ? dayjs(dateObj).format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD');
                          const bookingDateTime = dayjs(`${bookingDateStr}T${detail.startTime || '00:00:00'}`);
                          const isPast = bookingDateTime.isBefore(dayjs());
                          const isConfirmed = !['pending', 'expired', 'cancelled', 'chờ thanh toán', 'hết hạn', 'hủy', 'failed'].includes(b.status?.toString().toLowerCase());
                          return !isPast && isConfirmed;
                        });

                        if (eligibleBookings.length === 0) {
                          return (
                            <div className="text-center text-gray-500 py-10 bg-[#F8F9FA] rounded-[16px] border border-gray-100 flex flex-col items-center justify-center">
                              <Calendar size={32} className="text-gray-300 mb-3" />
                              <p className="m-0 text-[14px]">Bạn chưa có đơn đặt sân hợp lệ nào.</p>
                            </div>
                          )
                        }

                        return eligibleBookings.map(b => {
                          const detail = b.details?.[0] || {};
                          const dateObj = new Date(detail.bookingDate)
                          const isValidDate = !isNaN(dateObj.getTime())
                          
                          return (
                            <div 
                              key={b.bookingId} 
                              onClick={() => setFormData({...formData, bookingId: b.bookingId})}
                              className={`p-4 rounded-[16px] border-2 cursor-pointer transition-all ${
                                formData.bookingId == b.bookingId 
                                ? 'border-[#14b8a6] bg-teal-50/50 shadow-sm' 
                                : 'border-gray-100 bg-white hover:border-[#14b8a6]/50 hover:bg-teal-50/20 hover:shadow-sm'
                              }`}
                            >
                              <div className="flex items-center justify-between mb-3">
                                <span className="font-bold text-[15px] text-[#0f172a]">
                                   Đơn #{b.bookingId} - {detail.courtName || 'Sân thể thao cao cấp'}
                                </span>
                                <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full text-teal-700 bg-teal-100/50">
                                   Có sẵn
                                </span>
                              </div>
                              <div className="flex flex-col gap-2">
                                 <div className="flex items-center gap-2 text-[13.5px] font-medium text-gray-600">
                                    <Calendar size={16} className="text-gray-400"/> 
                                    {isValidDate ? dayjs(dateObj).format('dddd, DD/MM/YYYY') : '---'}
                                 </div>
                                 <div className="flex items-center gap-2 text-[13.5px] font-medium text-gray-600">
                                    <Clock size={16} className="text-gray-400"/> {detail.startTime ? `${detail.startTime} - ${detail.endTime}` : '---'}
                                 </div>
                              </div>
                            </div>
                          )
                        })
                      })()}
                      
                      {/* No-Dead-End UX Solution */}
                      <button 
                        onClick={() => {
                          localStorage.setItem('draft_match_creation', JSON.stringify(formData));
                          navigate('/apex/booking?origin=host_match');
                        }}
                        className="w-full p-5 mt-1 rounded-[16px] border-2 border-dashed border-gray-200 bg-[#F8F9FA] hover:border-[#14b8a6]/50 hover:bg-teal-50/20 text-gray-500 hover:text-[#14b8a6] transition-all flex items-center justify-center gap-3 cursor-pointer"
                      >
                        <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center pointer-events-none">
                           <Plus size={18} />
                        </div>
                        <span className="text-[13.5px] font-bold pointer-events-none">Đặt sân mới ngay tại đây</span>
                      </button>
                    </div>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-[13px] font-bold text-gray-600 mb-3 md:block hidden">&nbsp;</label>
                    <div className="bg-[#F8F9FA] rounded-[20px] p-5 border border-gray-100 h-full">
                        <div className="mb-5">
                          <label className="block text-[12.5px] font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Ngày chơi</label>
                          <input 
                            type="text" 
                            value={selectedBooking?.details?.[0] && !isNaN(new Date(selectedBooking.details[0].bookingDate).getTime()) ? dayjs(selectedBooking.details[0].bookingDate).format('DD/MM/YYYY') : 'Chưa chọn'} 
                            readOnly 
                            className="w-full px-4 h-12 bg-white border border-gray-200 rounded-[12px] text-[14.5px] text-[#0f172a] font-bold outline-none pointer-events-none" 
                          />
                        </div>
                        
                        <div className="mb-6">
                          <label className="block text-[12.5px] font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Khung giờ</label>
                          <input 
                            type="text" 
                            value={selectedBooking?.details?.[0] ? `${selectedBooking.details[0].startTime} - ${selectedBooking.details[0].endTime}` : 'Chưa chọn'} 
                            readOnly 
                            className="w-full px-4 h-12 bg-white border border-gray-200 rounded-[12px] text-[14.5px] text-[#14b8a6] font-bold outline-none pointer-events-none" 
                          />
                        </div>
                        
                        <div className="flex gap-3 p-4 bg-teal-50/50 rounded-[16px] border border-teal-100/50 text-[13px] font-medium text-gray-600 leading-relaxed">
                           <Info size={20} className="text-[#14b8a6] shrink-0 mt-0.5" />
                           <p className="m-0">Trận giao lưu phải được gắn với một đơn đặt sân thực tế để đảm bảo uy tín.</p>
                        </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 mt-10">
                  <button 
                    onClick={() => setStep(1)} 
                    className="h-12 px-8 rounded-full border border-gray-200 text-gray-600 bg-white hover:bg-gray-50 text-[13px] font-bold uppercase tracking-wide transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    <ArrowLeft size={16} /> Quay lại
                  </button>
                  <button 
                    onClick={() => setStep(3)} 
                    className="flex-1 h-12 rounded-full bg-[#14b8a6] hover:bg-[#0f9e8c] text-white text-[14px] font-bold uppercase tracking-wide transition-all shadow-[0_4px_14px_rgba(20,184,166,0.25)] border-0 cursor-pointer flex items-center justify-center gap-2"
                  >
                    Tiếp tục <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Chi phí & Chỗ */}
            {step === 3 && (
              <div className="auth-animate-fade">
                <h2 className="font-bold text-[20px] text-[#0f172a] mb-6 m-0">Chi phí & Chỗ trống</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                  <div className="md:col-span-3 space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-[13px] font-bold text-gray-600 mb-2">Số người cần tìm</label>
                        <input type="number" value={formData.maxParticipants} onChange={e => setFormData({...formData, maxParticipants: e.target.value})} min="1" max="10" className={inputClasses} />
                      </div>
                      <div>
                        <label className="block text-[13px] font-bold text-gray-600 mb-2 flex justify-between items-center">
                          <span>Số tiền mỗi người đóng góp (VNĐ)</span>
                        </label>
                        <input type="number" value={formData.escrowAmount} onChange={e => setFormData({...formData, escrowAmount: e.target.value})} step="1000" className={inputClasses} />
                        {selectedBooking && (
                           <div className="mt-2 text-right">
                              <button 
                                onClick={() => setFormData({...formData, escrowAmount: Math.round((selectedBooking?.totalPrice || 100000) / (parseInt(formData.maxParticipants || 1) + 1))})}
                                className="text-[12px] font-bold text-[#14b8a6] hover:text-[#0f9e8c] bg-teal-50/50 hover:bg-teal-100/50 px-3 py-1.5 rounded-full transition-colors border-0 cursor-pointer"
                              >
                                Gợi ý chia đều: {Math.round((selectedBooking?.totalPrice || 100000) / (parseInt(formData.maxParticipants || 1) + 1)).toLocaleString('vi-VN')} đ
                              </button>
                           </div>
                        )}
                      </div>
                    </div>

                    <div className="bg-teal-50/50 border border-teal-100 rounded-[16px] p-5 flex gap-4 mt-2">
                      <div className="w-10 h-10 rounded-full bg-white text-[#14b8a6] flex items-center justify-center shrink-0 shadow-sm border border-teal-50">
                        <Info size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold text-[14px] text-[#0f172a] m-0 mb-1">Cơ chế Ký quỹ an toàn</h4>
                        <p className="text-[13.5px] text-gray-600 leading-relaxed m-0 mb-2">
                          <strong className="text-[#14b8a6]">Tiền cọc tạo trận của bạn: 0 đ</strong> (Miễn phí vì bạn đã thanh toán tiền sân).
                        </p>
                        <p className="text-[13.5px] text-gray-600 leading-relaxed m-0">
                          Chỉ những người tham gia (khách) mới bị tạm giữ số tiền đóng góp ({parseInt(formData.escrowAmount || 0).toLocaleString('vi-VN')} đ) khi họ bấm Tham gia để chống bùng kèo. Số tiền này sẽ được chuyển thẳng cho bạn ngay khi trận đấu kết thúc thành công.
                        </p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[13px] font-bold text-gray-600 mb-2">Ghi chú thêm (Tùy chọn)</label>
                      <textarea rows="3" value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} placeholder="VD: Nhớ mang theo nước uống và khởi động trước khi vào sân nhé..." className={`${inputClasses} h-28 py-3 resize-none`}></textarea>
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <div className="bg-white rounded-[20px] p-6 border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] h-full">
                       <h3 className="text-[15px] font-bold uppercase tracking-tight text-[#0f172a] mb-5 m-0 flex items-center gap-2">
                         Tóm tắt tài chính
                       </h3>
                       
                       <div className="space-y-4 mb-6">
                         <div className="flex items-center justify-between text-[14px]">
                           <span className="text-gray-500 font-medium">Tiền sân bạn đã trả</span>
                           <strong className="text-[#0f172a]">{(selectedBooking?.totalPrice || 100000).toLocaleString('vi-VN')} đ</strong>
                         </div>
                         <div className="flex items-center justify-between text-[14px]">
                           <span className="text-gray-500 font-medium">Thu hồi dự kiến ({formData.maxParticipants || 0} người)</span>
                           <strong className="text-green-600">+ {(parseInt(formData.maxParticipants || 0) * parseInt(formData.escrowAmount || 0)).toLocaleString('vi-VN')} đ</strong>
                         </div>
                       </div>
                       
                       <div className="pt-5 border-t border-gray-100">
                         <div className="flex items-center justify-between">
                           <span className="text-[13px] font-bold uppercase tracking-wide text-gray-500 m-0">Chi phí cuối của bạn</span>
                           <strong className="text-[22px] font-black text-[#14b8a6]">
                             {Math.max(0, (selectedBooking?.totalPrice || 100000) - (parseInt(formData.maxParticipants || 0) * parseInt(formData.escrowAmount || 0))).toLocaleString('vi-VN')} đ
                           </strong>
                         </div>
                       </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 mt-10">
                  <button 
                    onClick={() => setStep(2)} 
                    className="h-12 px-8 rounded-full border border-gray-200 text-gray-600 bg-white hover:bg-gray-50 text-[13px] font-bold uppercase tracking-wide transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    <ArrowLeft size={16} /> Quay lại
                  </button>
                  <button 
                    onClick={handleCreate} 
                    disabled={isLoading} 
                    className="flex-1 h-12 rounded-full bg-[#14b8a6] hover:bg-[#0f9e8c] text-white text-[14px] font-bold uppercase tracking-wide transition-all shadow-[0_4px_14px_rgba(20,184,166,0.25)] border-0 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        Đang tạo trận đấu...
                      </span>
                    ) : (
                      <>Hoàn tất tạo trận đấu <Check size={18} /></>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Exit Confirmation Modal */}
      {showExitModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm auth-animate-in">
          <div className="bg-white rounded-[24px] shadow-2xl p-8 max-w-[400px] w-full text-center">
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-5">
               <X size={32} className="text-red-500" />
            </div>
            <h3 className="text-[20px] font-bold text-[#0f172a] m-0 mb-2">Bạn có chắc chắn muốn thoát?</h3>
            <p className="text-[14.5px] text-gray-500 m-0 mb-8">Mọi thông tin trận đấu bạn đang tạo sẽ bị mất.</p>
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => setShowExitModal(false)}
                className="w-full h-12 rounded-full bg-[#14b8a6] hover:bg-[#0f9e8c] text-white text-[14px] font-bold uppercase tracking-wide transition-all shadow-sm cursor-pointer border-0"
              >
                Tiếp tục tạo trận
              </button>
              <button 
                onClick={() => navigate('/matches')}
                className="w-full h-12 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 text-[14px] font-bold uppercase tracking-wide transition-colors cursor-pointer border-0"
              >
                Thoát
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
