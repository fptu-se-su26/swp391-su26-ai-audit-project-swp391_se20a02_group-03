import { useState } from 'react'
import { Plus, Download, ChevronRight } from 'lucide-react'
import ApexLayout from '../../layouts/ApexLayout'

// Mock data
const mockLinkedMethods = [
  { id: 1, type: 'bank', name: 'Ngân hàng Vietcombank', number: '**** 1234', icon: '🏦' },
  { id: 2, type: 'ewallet', name: 'Ví MoMo', number: '**** 5678', icon: '📱' },
]

const mockTransactions = [
  { id: 'TXN1001', time: '15/07/2026 10:30', content: 'Nạp tiền từ Momo', type: 'deposit', amount: 200000, status: 'Thành công' },
  { id: 'TXN1002', time: '14/07/2026 15:45', content: 'Đóng cọc trận cầu lông', type: 'deposit_match', amount: -50000, status: 'Thành công' },
  { id: 'TXN1003', time: '12/07/2026 09:12', content: 'Hoàn cọc trận tennis', type: 'refund', amount: 100000, status: 'Thành công' },
  { id: 'TXN1004', time: '10/07/2026 18:20', content: 'Rút tiền về Vietcombank', type: 'withdraw', amount: -150000, status: 'Thất bại' },
]

export default function ApexWalletPage() {
  const [activeTab, setActiveTab] = useState('all')

  const filteredTransactions = mockTransactions.filter(t => {
    if (activeTab === 'all') return true
    if (activeTab === 'deposit' && t.type === 'deposit') return true
    if (activeTab === 'withdraw' && t.type === 'withdraw') return true
    if (activeTab === 'deposit_match' && t.type === 'deposit_match') return true
    if (activeTab === 'refund' && t.type === 'refund') return true
    return false
  })

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
            <h2 className="text-4xl font-bold text-gray-900 mb-6 tracking-tight">500.000 đ</h2>
            <div className="flex w-full gap-3">
              <button className="flex-1 bg-teal-500 hover:bg-teal-600 text-white text-[14px] font-medium py-2.5 rounded-[8px] transition-colors flex items-center justify-center gap-1.5 shadow-sm">
                <Plus size={16} />
                Nạp tiền
              </button>
              <button className="flex-1 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 text-[14px] font-medium py-2.5 rounded-[8px] transition-colors flex items-center justify-center gap-1.5 shadow-sm">
                <Download size={16} />
                Rút tiền
              </button>
            </div>
          </div>

          {/* Card 2: Nguồn tiền & Thanh toán */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 text-[15px]">Nguồn tiền & Thanh toán</h3>
            </div>
            
            <div className="space-y-3">
              {mockLinkedMethods.map(method => (
                <div key={method.id} className="flex items-center p-3 rounded-[8px] border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-colors cursor-pointer group">
                  <span className="text-2xl mr-3 group-hover:scale-105 transition-transform">{method.icon}</span>
                  <div className="flex-1">
                    <p className="font-semibold text-[14px] text-gray-900 leading-tight">{method.name}</p>
                    <p className="text-[12px] text-gray-500 mt-0.5">{method.number}</p>
                  </div>
                  <ChevronRight size={16} className="text-gray-400 group-hover:text-teal-500 transition-colors" />
                </div>
              ))}
            </div>

            <button className="w-full mt-5 py-2 text-[14px] font-medium text-teal-600 hover:text-teal-700 hover:bg-teal-50 rounded-[8px] transition-colors flex items-center justify-center gap-1.5 border border-dashed border-teal-200">
              <Plus size={16} />
              Thêm liên kết
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
                { id: 'deposit_match', label: 'Đóng cọc' },
                { id: 'refund', label: 'Hoàn cọc' },
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
                    <th className="pb-3 font-medium">Nội dung</th>
                    <th className="pb-3 font-medium">Trạng thái</th>
                    <th className="pb-3 font-medium text-right">Số tiền</th>
                  </tr>
                </thead>
                <tbody className="text-[14px]">
                  {filteredTransactions.length > 0 ? (
                    filteredTransactions.map(txn => (
                      <tr key={txn.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors group">
                        <td className="py-4 text-gray-500 text-[13px]">{txn.time}</td>
                        <td className="py-4 font-medium text-gray-900 group-hover:text-teal-600 transition-colors">{txn.content}</td>
                        <td className="py-4">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[12px] font-medium ${
                            txn.status === 'Thành công' ? 'bg-green-50 text-green-700 border border-green-200/50' : 'bg-red-50 text-red-700 border border-red-200/50'
                          }`}>
                            {txn.status}
                          </span>
                        </td>
                        <td className={`py-4 text-right font-bold tabular-nums ${
                          txn.amount > 0 ? 'text-green-500' : 'text-red-500'
                        }`}>
                          {txn.amount > 0 ? '+' : ''}{txn.amount.toLocaleString('vi-VN')} đ
                        </td>
                      </tr>
                    ))
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
    </ApexLayout>
  )
}
