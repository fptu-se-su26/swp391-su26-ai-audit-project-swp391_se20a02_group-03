import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

export default function BookingPage() {
  const [searchParams] = useSearchParams()
  const slot = searchParams.get('slot') || '10:00'
  const [paymentMethod, setPaymentMethod] = useState('escrow')
  const [isSuccess, setIsSuccess] = useState(false)

  const court = {
    name: 'The Apex Pavilion – Court A',
    price: 120000,
    serviceFee: 6000,
  }

  const total = court.price + court.serviceFee

  if (isSuccess) {
    return (
      <div className="flex flex-col min-h-screen bg-brand-50">
        <Navbar theme="light" />
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl p-10 max-w-[480px] w-full text-center shadow-xl shadow-brand-900/5 border border-brand-200/60">
            <div className="w-20 h-20 bg-accent/10 text-accent rounded-full flex items-center justify-center mx-auto mb-6">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <h1 className="font-heading text-3xl font-bold text-brand-900 tracking-tight mb-2">Đặt sân thành công!</h1>
            <p className="text-brand-500 mb-8 leading-relaxed text-[0.95rem]">
              Cảm ơn bạn. Sân {court.name} lúc {slot} đã được giữ chỗ. Mã đặt sân của bạn là <b className="text-brand-900">#BK-8842</b>.
            </p>
            <div className="flex gap-4">
              <Link to="/customer/bookings" className="btn-outline flex-1 py-3.5 rounded-xl text-[0.9rem]">Lịch sử đặt sân</Link>
              <Link to="/courts" className="btn-primary flex-1 py-3.5 rounded-xl text-[0.9rem] hover:-translate-y-0.5 hover:shadow-lg">Về trang chủ</Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-brand-50">
      <Navbar theme="light" />

      <main className="flex-1 max-w-[1080px] mx-auto px-6 pt-28 pb-24 w-full">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2.5 text-xs font-semibold tracking-wide uppercase text-brand-400 mb-8">
          <Link to="/" className="hover:text-accent transition-colors duration-200">Trang chủ</Link>
          <span className="text-brand-300">/</span>
          <Link to="/courts" className="hover:text-accent transition-colors duration-200">Sân bãi</Link>
          <span className="text-brand-300">/</span>
          <span className="text-brand-900">Xác nhận đặt sân</span>
        </nav>

        <h1 className="font-heading text-[clamp(1.8rem,3vw,2.4rem)] font-bold text-brand-900 tracking-tight mb-10">Xác nhận đặt sân</h1>

        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-8 lg:gap-12 items-start">
          <div className="flex flex-col gap-6">
            {/* User Details */}
            <div className="bg-white rounded-3xl p-7 border border-brand-200/60 shadow-sm">
              <h2 className="font-heading text-xl font-bold text-brand-900 tracking-tight mb-5">Thông tin người đặt</h2>
              <div className="grid grid-cols-2 gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-brand-500 tracking-wide uppercase">Họ và tên</label>
                  <input type="text" value="Alex Mercer" readOnly className="w-full bg-brand-50/50 border border-brand-200/70 rounded-xl px-4 py-3 text-sm text-brand-900 font-medium outline-none" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-brand-500 tracking-wide uppercase">Số điện thoại</label>
                  <input type="text" value="0901234567" readOnly className="w-full bg-brand-50/50 border border-brand-200/70 rounded-xl px-4 py-3 text-sm text-brand-900 font-medium outline-none" />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-3xl p-7 border border-brand-200/60 shadow-sm">
              <h2 className="font-heading text-xl font-bold text-brand-900 tracking-tight mb-5">Phương thức thanh toán</h2>
              
              <div className="flex flex-col gap-3">
                <label className={`group flex items-start gap-4 p-5 border-2 rounded-2xl cursor-pointer transition-all duration-300 ${paymentMethod === 'escrow' ? 'border-accent bg-accent/5 shadow-sm shadow-accent/5' : 'border-brand-200/60 hover:border-brand-300/80 hover:bg-brand-50/50'}`}>
                  <input type="radio" name="payment" value="escrow" checked={paymentMethod === 'escrow'} onChange={() => setPaymentMethod('escrow')} className="mt-0.5 accent-accent" />
                  <div>
                    <p className="font-bold text-brand-900 text-sm">Ví Escrow Pro-Sport</p>
                    <p className="text-brand-500 text-xs mt-1.5 leading-relaxed">Số dư hiện tại: <b className="text-brand-900">4,850,000 VNĐ</b></p>
                  </div>
                </label>

                <label className={`group flex items-start gap-4 p-5 border-2 rounded-2xl cursor-pointer transition-all duration-300 ${paymentMethod === 'vnpay' ? 'border-accent bg-accent/5 shadow-sm shadow-accent/5' : 'border-brand-200/60 hover:border-brand-300/80 hover:bg-brand-50/50'}`}>
                  <input type="radio" name="payment" value="vnpay" checked={paymentMethod === 'vnpay'} onChange={() => setPaymentMethod('vnpay')} className="mt-0.5 accent-accent" />
                  <div className="flex-1 flex justify-between items-center">
                    <div>
                      <p className="font-bold text-brand-900 text-sm">Thanh toán VNPay</p>
                      <p className="text-brand-500 text-xs mt-1.5 leading-relaxed">Thẻ ATM / Thẻ tín dụng / VNPAY QR</p>
                    </div>
                    <img src="https://vnpay.vn/s1/statics.vnpay.vn/2023/6/0oxhzjmxbksr1686814746087.png" alt="VNPay" className="h-6" />
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Panel - Summary */}
          <div className="lg:sticky lg:top-28">
            <div className="bg-white rounded-3xl p-7 lg:p-8 border border-brand-200/60 shadow-xl shadow-brand-900/5 relative overflow-hidden">
              {/* Subtle accent line on top */}
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-accent to-indigo-400" />
              
              <h2 className="font-heading text-xl font-bold text-brand-900 tracking-tight mb-6">Tóm tắt đơn đặt</h2>
              
              <div className="flex gap-4 pb-5 border-b border-brand-200/60 mb-5">
                <img src="https://images.unsplash.com/photo-1544919982-b61976f0ba43?w=200&q=80" alt="Court" className="w-20 h-20 object-cover rounded-2xl shrink-0" />
                <div>
                  <h3 className="font-bold text-brand-900 text-sm leading-snug">{court.name}</h3>
                  <p className="text-xs text-brand-500 mt-2 font-medium">Hôm nay • {slot} (90 phút)</p>
                </div>
              </div>

              <div className="space-y-3.5 mb-6">
                <div className="flex justify-between items-center text-[0.9rem]">
                  <span className="text-brand-500 font-medium">Tiền sân</span>
                  <span className="font-semibold text-brand-900">{court.price.toLocaleString('vi-VN')} VNĐ</span>
                </div>
                <div className="flex justify-between items-center text-[0.9rem]">
                  <span className="text-brand-500 font-medium flex items-center gap-1.5">
                    Phí dịch vụ
                    <span className="bg-brand-100 text-brand-500 text-[0.65rem] font-bold px-1.5 py-0.5 rounded">5%</span>
                  </span>
                  <span className="font-semibold text-brand-900">{court.serviceFee.toLocaleString('vi-VN')} VNĐ</span>
                </div>
                <div className="flex justify-between items-center text-[1.05rem] border-t border-brand-200/60 pt-4 mt-2">
                  <span className="font-bold text-brand-900">Tổng thanh toán</span>
                  <span className="font-heading text-2xl font-bold text-accent">{total.toLocaleString('vi-VN')} VNĐ</span>
                </div>
              </div>

              <button onClick={() => setIsSuccess(true)} className="w-full flex items-center justify-center gap-2.5 py-4 bg-brand-900 text-white font-semibold text-[0.95rem] rounded-xl transition-all duration-300 hover:bg-brand-800 hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98] shadow-sm">
                Thanh toán & Đặt sân
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </button>
              
              <p className="text-center text-brand-400 text-[0.7rem] font-medium mt-4 uppercase tracking-wider leading-relaxed">
                Bằng việc nhấn đặt sân, bạn đồng ý với <a href="#" className="text-accent hover:underline">Điều khoản</a> và <a href="#" className="text-accent hover:underline">Chính sách hủy sân</a> của chúng tôi.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer variant="light" />
    </div>
  )
}
