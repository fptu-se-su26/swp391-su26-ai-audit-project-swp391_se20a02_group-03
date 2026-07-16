import { useState, useEffect } from 'react'
import MobileLayout from '../../layouts/MobileLayout'
import { paymentApi } from '../../api/paymentApi'
import { useAuth } from '../../context/AuthContext'
import { translateTransactionType, translateStatus } from '../../utils/labels'

export default function MobileWalletPage() {
  const { user } = useAuth()
  const displayName = user?.fullName || 'Người dùng'
  const [wallet, setWallet] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showDepositModal, setShowDepositModal] = useState(false)
  const [depositAmount, setDepositAmount] = useState('')
  const [depositError, setDepositError] = useState('')

  useEffect(() => {
    async function fetchData() {
      try {
        const [walletRes, transRes] = await Promise.all([
          paymentApi.getEscrowWallet(),
          paymentApi.getMyTransactions()
        ]);
        if (walletRes.data) setWallet(walletRes.data);
        if (transRes.data) setTransactions(transRes.data);
      } catch (err) {
        console.error('Lỗi tải ví ký quỹ:', err);
        setError(typeof err === 'string' ? err : 'Không tải được ví. Vui lòng thử lại.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  function handleAddFunds() {
    setDepositAmount('');
    setDepositError('');
    setShowDepositModal(true);
  }

  async function handleDepositConfirm() {
    const amount = parseInt(depositAmount.replace(/\D/g, ''));
    if (isNaN(amount) || amount < 10000) {
      setDepositError('Số tiền không hợp lệ (tối thiểu 10.000 VNĐ)');
      return;
    }
    try {
      const refId = Date.now().toString();
      const res = await paymentApi.createPayOsUrl(amount, 'Deposit', refId);
      if (res.statusCode === 200 && res.data) {
        window.location.assign(res.data);
      } else {
        setDepositError('Không thể tạo URL thanh toán PayOS');
      }
    } catch (err) {
      console.error(err);
      setDepositError(typeof err === 'string' ? err : 'Có lỗi xảy ra khi gọi PayOS API');
    }
  }

  return (
    <MobileLayout>
      {/* Deposit Modal */}
      {showDepositModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 24, width: '100%', maxWidth: 340 }}>
            <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700, color: '#0F172A' }}>Nạp tiền vào ví</h3>
            <label style={{ fontSize: 13, color: '#64748b', fontWeight: 600 }}>Số tiền (VNĐ)</label>
            <input
              type="number"
              value={depositAmount}
              onChange={e => { setDepositAmount(e.target.value); setDepositError(''); }}
              placeholder="Ví dụ: 100000"
              style={{ width: '100%', marginTop: 8, padding: '10px 12px', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
              autoFocus
            />
            {depositError && <p style={{ color: '#ef4444', fontSize: 12, marginTop: 6 }}>{depositError}</p>}
            <p style={{ color: '#94a3b8', fontSize: 11, marginTop: 6 }}>Tối thiểu: 10.000 VNĐ</p>
            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <button onClick={() => setShowDepositModal(false)} style={{ flex: 1, padding: '10px 0', border: '1px solid #e2e8f0', borderRadius: 10, background: '#f8fafc', cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>Hủy</button>
              <button onClick={handleDepositConfirm} style={{ flex: 1, padding: '10px 0', border: 'none', borderRadius: 10, background: '#006070', color: '#fff', cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>Xác nhận</button>
            </div>
          </div>
        </div>
      )}
      <div className="font-sans -mx-4 -my-5 pb-24">
        
        {/* Balance */}
        <div className="bg-[#006070] text-[var(--theme-primary)] p-6 rounded-b-[24px] flex justify-between items-center shadow-sm">
          <div>
            <p className="text-[0.62rem] font-bold tracking-wider opacity-60">SỐ DƯ KHẢ DỤNG (VNĐ)</p>
            <h1 className="font-['Oswald'] text-3xl font-bold mt-1 text-[var(--theme-primary)]">
              {isLoading ? "..." : (wallet?.balance?.toLocaleString('vi-VN') || "0")} đ
            </h1>
          </div>
          <button className="bg-[var(--theme-surface-hover)] border-none w-9 h-9 rounded-full text-[var(--theme-primary)] flex items-center justify-center cursor-pointer hover:bg-white/20">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
          </button>
        </div>

        {/* Card Scroll */}
        <div className="flex gap-4 overflow-x-auto p-5 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="w-full min-w-[280px] bg-slate-900 text-[var(--theme-primary)] rounded-2xl p-5 shadow-lg relative overflow-hidden flex flex-col gap-4 border border-border-default">
            <div className="flex justify-between items-center">
              <h3 className="font-['Oswald'] text-base font-bold tracking-wide">PRO-SPORT</h3>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72"/></svg>
            </div>
            <div>
              <p className="text-[0.55rem] font-bold tracking-wider opacity-50">SỐ THẺ</p>
              <p className="text-sm font-semibold tracking-[0.1em] mt-1">**** **** **** 4928</p>
            </div>
            <div className="flex justify-between items-center mt-2">
              <div>
                <p className="text-[0.55rem] font-bold tracking-wider opacity-50">CHỦ THẺ</p>
                <p className="text-xs font-bold">{displayName}</p>
              </div>
              <div>
                <p className="text-[0.55rem] font-bold tracking-wider opacity-50">HSD</p>
                <p className="text-xs font-bold">12/28</p>
              </div>
            </div>
          </div>
        </div>

        {/* Add Funds Button */}
        <div className="px-5 mb-6">
          <button onClick={handleAddFunds} className="w-full bg-[#00c2ff] hover:bg-[#00ace6] text-[var(--theme-primary)] py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 border-none cursor-pointer shadow-md transition-all">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
            Nạp tiền qua PayOS
          </button>
        </div>

        {/* Transactions */}
        <div className="px-5 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-slate-900">Giao dịch gần đây</h3>
            <span className="text-xs font-semibold text-[#008ba3] cursor-pointer">Xem tất cả</span>
          </div>

          <div className="flex flex-col gap-3">
            {isLoading ? (
              <p className="text-center text-sm text-slate-500 py-4">Đang tải lịch sử...</p>
            ) : transactions.length === 0 ? (
              <p className="text-center text-sm text-slate-500 py-4">Chưa có giao dịch nào.</p>
            ) : (
              transactions.map(t => {
                const isPositive = t.type === 'Deposit' || t.type === 'EscrowRelease';
                const Icon = isPositive ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 19 19 12"/></svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72"/></svg>
                );
                
                return (
                  <div key={t.transactionId} className="flex items-center bg-white p-3 rounded-xl border border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.01)]">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${isPositive ? 'bg-[#00c2ff]/10 text-[#00c2ff]' : 'bg-red-100 text-red-600'}`}>
                      {Icon}
                    </div>
                    <div className="flex-1 ml-3 min-w-0">
                      <h4 className="text-xs font-bold text-slate-800 truncate">{t.description || translateTransactionType(t.type)}</h4>
                      <p className="text-[0.72rem] text-slate-400 mt-0.5">{new Date(t.createdAt).toLocaleString('vi-VN')}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className={`text-xs font-bold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                        {isPositive ? '+' : '-'}{t.amount.toLocaleString('vi-VN')} đ
                      </p>
                      <span className={`inline-block text-[0.6rem] font-bold px-1.5 py-0.5 rounded mt-1 ${(t.status || '') === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                        {(translateStatus(t.status, 'Không rõ')).toUpperCase()}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>
    </MobileLayout>
  )
}
