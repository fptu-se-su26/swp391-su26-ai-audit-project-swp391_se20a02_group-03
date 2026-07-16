import { useState, useEffect } from 'react'
import { Plus, Download, ChevronRight, CheckCircle2, Wallet, Building2, CreditCard, X } from 'lucide-react'
import ApexLayout from '../../layouts/ApexLayout'
import { paymentApi } from '../../api/paymentApi'

export default function ApexWalletPage() {
  const [activeTab, setActiveTab] = useState('all')
  const [wallet, setWallet] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)

  // Modals state
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false)
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false)
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false)

  // Form states
  const [linkForm, setLinkForm] = useState({ provider: 'PayOS', accountNumber: '', accountName: '' })
  const [amountInput, setAmountInput] = useState('')

  const fetchWalletData = async () => {
    try {
      setLoading(true)
      const walletRes = await paymentApi.getEscrowWallet()
      if (walletRes.statusCode === 200 && walletRes.data) {
        setWallet(walletRes.data)
      }

      const txnRes = await paymentApi.getMyTransactions()
      if (txnRes.statusCode === 200 && txnRes.data) {
        // Sắp xếp giao dịch mới nhất lên đầu
        const sortedTxns = txnRes.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        setTransactions(sortedTxns)
      }
    } catch (error) {
      alert('Lỗi khi tải thông tin ví')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWalletData()
  }, [])

  const handleLinkAccount = async (e) => {
    e.preventDefault()
    if (!linkForm.accountNumber || !linkForm.accountName) {
      alert('Vui lòng nhập đầy đủ thông tin')
      return
    }
    try {
      const res = await paymentApi.linkAccount(linkForm.provider, linkForm.accountNumber, linkForm.accountName)
      if (res.statusCode === 200) {
        alert(res.message)
        setIsLinkModalOpen(false)
        fetchWalletData()
      } else {
        alert(res.message || 'Lỗi khi liên kết tài khoản')
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Lỗi khi liên kết tài khoản')
    }
  }

  const handleDeposit = async (e) => {
    e.preventDefault()
    if (!amountInput || isNaN(amountInput) || Number(amountInput) <= 0) {
      alert('Vui lòng nhập số tiền hợp lệ')
      return
    }
    try {
      const res = await paymentApi.depositMock(Number(amountInput))
      if (res.statusCode === 200) {
        alert(res.message || 'Nạp tiền thành công')
        setIsDepositModalOpen(false)
        setAmountInput('')
        fetchWalletData()
      } else {
        alert(res.message || 'Nạp tiền thất bại')
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Lỗi khi nạp tiền')
    }
  }

  const handleWithdraw = async (e) => {
    e.preventDefault()
    if (!amountInput || isNaN(amountInput) || Number(amountInput) <= 0) {
      alert('Vui lòng nhập số tiền hợp lệ')
      return
    }
    try {
      const res = await paymentApi.withdrawEscrow(Number(amountInput))
      if (res.statusCode === 200) {
        alert(res.message || 'Rút tiền thành công')
        setIsWithdrawModalOpen(false)
        setAmountInput('')
        fetchWalletData()
      } else {
        alert(res.message || 'Rút tiền thất bại')
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Lỗi khi rút tiền')
    }
  }

  const requireLinkedAccount = (callback) => {
    if (!wallet?.linkedProvider || !wallet?.linkedAccountNumber) {
      alert('Vui lòng liên kết tài khoản trước khi thực hiện')
      setIsLinkModalOpen(true)
      return
    }
    callback()
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN').format(amount || 0) + ' đ'
  }

  const filteredTransactions = transactions.filter(t => {
    if (activeTab === 'all') return true
    if (activeTab === 'deposit' && t.type === 'Deposit') return true
    if (activeTab === 'withdraw' && t.type === 'Withdraw') return true
    if (activeTab === 'payment' && t.type === 'Payment') return true
    if (activeTab === 'escrow_lock' && t.type === 'EscrowLock') return true
    if (activeTab === 'escrow_release' && t.type === 'EscrowRelease') return true
    if (activeTab === 'refund' && t.type === 'Refund') return true
    return false
  })

  const getTransactionLabel = (type) => {
    switch (type) {
      case 'Deposit': return 'Nạp tiền'
      case 'Withdraw': return 'Rút tiền'
      case 'Payment': return 'Thanh toán'
      case 'EscrowLock': return 'Đóng cọc'
      case 'EscrowRelease': return 'Mở cọc'
      case 'Refund': return 'Hoàn tiền'
      default: return type
    }
  }

  if (loading) {
    return (
      <ApexLayout>
        <div className="flex items-center justify-center min-h-[500px]">
          <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </ApexLayout>
    )
  }

  return (
    <ApexLayout>
      <div className="space-y-6 animate-in fade-in duration-300">
        <div>
          <h1 className="font-heading text-3xl uppercase tracking-tight text-foreground mb-2">Ví của tôi</h1>
          <p className="text-foreground-subtle text-[15px]">Quản lý số dư, nguồn tiền và lịch sử giao dịch.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column: Balance and Payment Methods */}
          <div className="col-span-1 space-y-6">
            {/* Card 1: Tổng quan số dư */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center justify-center text-center">
              <p className="text-[13px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Số dư khả dụng</p>
              <h2 className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">{formatCurrency(wallet?.balance)}</h2>
              {wallet?.lockedBalance > 0 && (
                <p className="text-sm text-orange-500 mb-4 bg-orange-50 px-3 py-1 rounded-full border border-orange-100">
                  Đóng cọc: {formatCurrency(wallet?.lockedBalance)}
                </p>
              )}
              <div className="flex w-full gap-3 mt-4">
                <button 
                  onClick={() => requireLinkedAccount(() => setIsDepositModalOpen(true))}
                  className="flex-1 bg-teal-500 hover:bg-teal-600 text-white text-[14px] font-medium py-2.5 rounded-[8px] transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Plus size={16} />
                  Nạp tiền
                </button>
                <button 
                  onClick={() => requireLinkedAccount(() => setIsWithdrawModalOpen(true))}
                  className="flex-1 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 text-[14px] font-medium py-2.5 rounded-[8px] transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Download size={16} />
                  Rút tiền
                </button>
              </div>
            </div>

            {/* Card 2: Nguồn tiền & Thanh toán */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 text-[15px]">Tài khoản liên kết (Mặc định)</h3>
              </div>
              
              <div className="space-y-3">
                {wallet?.linkedProvider ? (
                  <div className="flex items-center p-3 rounded-[8px] border border-gray-100 bg-teal-50 hover:bg-teal-100 transition-colors cursor-default group relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-1">
                       <CheckCircle2 size={16} className="text-teal-500" />
                    </div>
                    <span className="text-2xl mr-3 text-teal-600"><CreditCard size={24} /></span>
                    <div className="flex-1">
                      <p className="font-semibold text-[14px] text-gray-900 leading-tight">{wallet.linkedProvider}</p>
                      <p className="text-[12px] text-gray-600 mt-0.5">{wallet.linkedAccountNumber} - {wallet.linkedAccountName}</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                    <p className="text-sm text-gray-500">Chưa liên kết tài khoản nào</p>
                  </div>
                )}
              </div>

              <button 
                onClick={() => setIsLinkModalOpen(true)}
                className="w-full mt-5 py-2 text-[14px] font-medium text-teal-600 hover:text-teal-700 hover:bg-teal-50 rounded-[8px] transition-colors flex items-center justify-center gap-1.5 border border-dashed border-teal-200"
              >
                <Plus size={16} />
                {wallet?.linkedProvider ? 'Đổi tài khoản liên kết' : 'Thêm liên kết'}
              </button>
            </div>
          </div>

          {/* Right Column: Transaction History */}
          <div className="col-span-1 md:col-span-2">
            {/* Card 3: Lịch sử giao dịch */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-full flex flex-col">
              <h3 className="font-semibold text-gray-900 text-[16px] mb-5">Lịch sử giao dịch</h3>
              
              {/* Filter Tabs */}
              <div className="flex flex-wrap gap-2 mb-6">
                {[
                  { id: 'all', label: 'Tất cả' },
                  { id: 'deposit', label: 'Nạp tiền' },
                  { id: 'withdraw', label: 'Rút tiền' },
                  { id: 'payment', label: 'Thanh toán' },
                  { id: 'escrow_lock', label: 'Đóng cọc' },
                  { id: 'escrow_release', label: 'Mở cọc' },
                  { id: 'refund', label: 'Hoàn tiền' },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-1.5 rounded-full text-[13px] font-medium transition-all ${
                      activeTab === tab.id 
                        ? 'bg-teal-500 text-white shadow-sm' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Transactions Table */}
              <div className="overflow-x-auto flex-1">
                <table className="w-full text-left border-collapse min-w-[500px]">
                  <thead>
                    <tr className="border-b border-gray-100 text-gray-500 text-[12px] uppercase tracking-wider">
                      <th className="pb-3 font-medium">Thời gian</th>
                      <th className="pb-3 font-medium">Loại</th>
                      <th className="pb-3 font-medium">Nội dung</th>
                      <th className="pb-3 font-medium text-right">Số tiền</th>
                    </tr>
                  </thead>
                  <tbody className="text-[14px]">
                    {filteredTransactions.length > 0 ? (
                      filteredTransactions.map(txn => {
                        const isPositive = ['Deposit', 'Refund', 'EscrowRelease'].includes(txn.type)
                        const dateObj = new Date(txn.createdAt)
                        const timeStr = `${dateObj.toLocaleTimeString('vi-VN', {hour:'2-digit', minute:'2-digit'})} ${dateObj.toLocaleDateString('vi-VN')}`
                        
                        return (
                          <tr key={txn.transactionId} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors group">
                            <td className="py-4 text-gray-500 text-[13px]">{timeStr}</td>
                            <td className="py-4">
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-[12px] font-medium bg-gray-100 text-gray-700 border border-gray-200">
                                {getTransactionLabel(txn.type)}
                              </span>
                            </td>
                            <td className="py-4 font-medium text-gray-900 group-hover:text-teal-600 transition-colors line-clamp-1 max-w-[200px]" title={txn.description}>
                              {txn.description}
                            </td>
                            <td className={`py-4 text-right font-bold tabular-nums ${
                              isPositive ? 'text-green-500' : 'text-red-500'
                            }`}>
                              {isPositive ? '+' : '-'}{formatCurrency(txn.amount)}
                            </td>
                          </tr>
                        )
                      })
                    ) : (
                      <tr>
                        <td colSpan={4} className="py-12 text-center text-gray-500">
                          <div className="flex flex-col items-center justify-center">
                            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                              <span className="text-xl">📭</span>
                            </div>
                            <p className="font-medium text-gray-900 text-[15px]">Chưa có giao dịch</p>
                            <p className="text-[13px]">Không tìm thấy giao dịch nào phù hợp.</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Liên kết tài khoản Modal */}
      {isLinkModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h3 className="font-heading text-xl uppercase tracking-tight text-gray-900">Liên kết tài khoản</h3>
              <button onClick={() => setIsLinkModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleLinkAccount} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phương thức thanh toán</label>
                <select 
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  value={linkForm.provider}
                  onChange={(e) => setLinkForm({...linkForm, provider: e.target.value})}
                >
                  <option value="PayOS">PayOS</option>
                  <option value="VNPay">VNPay</option>
                  <option value="Ví MoMo">Ví MoMo</option>
                  <option value="Ngân hàng Vietcombank">Vietcombank</option>
                  <option value="Ngân hàng MBBank">MBBank</option>
                  <option value="Ngân hàng Techcombank">Techcombank</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Số tài khoản / Số điện thoại</label>
                <input 
                  type="text" 
                  required
                  placeholder="VD: 0123456789"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  value={linkForm.accountNumber}
                  onChange={(e) => setLinkForm({...linkForm, accountNumber: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên chủ tài khoản</label>
                <input 
                  type="text" 
                  required
                  placeholder="VD: NGUYEN VAN A"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent uppercase"
                  value={linkForm.accountName}
                  onChange={(e) => setLinkForm({...linkForm, accountName: e.target.value.toUpperCase()})}
                />
              </div>
              <div className="pt-2 flex justify-end gap-3">
                <button type="button" onClick={() => setIsLinkModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">Hủy</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors shadow-sm">Lưu liên kết</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Nạp tiền Modal */}
      {isDepositModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h3 className="font-heading text-xl uppercase tracking-tight text-gray-900">Nạp tiền vào ví</h3>
              <button onClick={() => setIsDepositModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleDeposit} className="p-5 space-y-4">
              <div className="p-3 bg-teal-50 rounded-lg border border-teal-100 flex items-center gap-3">
                <Building2 className="text-teal-600" size={24} />
                <div>
                  <p className="text-xs text-teal-800 font-medium uppercase">Nguồn tiền nạp</p>
                  <p className="text-sm font-bold text-teal-900">{wallet?.linkedProvider} - {wallet?.linkedAccountNumber}</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Số tiền muốn nạp (VNĐ)</label>
                <input 
                  type="number" 
                  required
                  min="10000"
                  step="10000"
                  placeholder="VD: 100000"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-lg font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  value={amountInput}
                  onChange={(e) => setAmountInput(e.target.value)}
                />
              </div>
              <div className="pt-2 flex justify-end gap-3">
                <button type="button" onClick={() => setIsDepositModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">Hủy</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors shadow-sm">Nạp tiền</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Rút tiền Modal */}
      {isWithdrawModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h3 className="font-heading text-xl uppercase tracking-tight text-gray-900">Rút tiền về tài khoản</h3>
              <button onClick={() => setIsWithdrawModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleWithdraw} className="p-5 space-y-4">
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-100 flex items-center gap-3">
                <Wallet className="text-blue-600" size={24} />
                <div className="flex-1">
                  <p className="text-xs text-blue-800 font-medium uppercase">Tài khoản nhận tiền</p>
                  <p className="text-sm font-bold text-blue-900">{wallet?.linkedProvider}</p>
                  <p className="text-xs text-blue-700 mt-0.5">{wallet?.linkedAccountNumber} - {wallet?.linkedAccountName}</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex justify-between">
                  <span>Số tiền muốn rút (VNĐ)</span>
                  <span className="text-teal-600 text-xs">Khả dụng: {formatCurrency(wallet?.balance)}</span>
                </label>
                <input 
                  type="number" 
                  required
                  min="10000"
                  max={wallet?.balance || 0}
                  step="10000"
                  placeholder="VD: 50000"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-lg font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  value={amountInput}
                  onChange={(e) => setAmountInput(e.target.value)}
                />
              </div>
              <div className="pt-2 flex justify-end gap-3">
                <button type="button" onClick={() => setIsWithdrawModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">Hủy</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors shadow-sm">Yêu cầu rút tiền</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </ApexLayout>
  )
}
