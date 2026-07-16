import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { ownerApi } from '../../api/ownerApi';
import {
  OwnerPageHeader,
  OwnerCard,
  OwnerToolbar,
  OwnerSearchInput,
  OwnerTable,
  OwnerThead,
  OwnerTh,
  OwnerTd,
  OwnerStatusBadge,
  OwnerEmptyState,
  OwnerErrorState,
  OwnerTableLoader,
  OwnerBtn,
  OwnerFormField,
  ownerInputCls
} from '../../components/owner';
import { useDebouncedValue } from '../../utils/useDebouncedValue';

export default function OwnerProductsPage() {
  const { complexId } = useOutletContext();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [keyword, setKeyword] = useState('');
  const debouncedKeyword = useDebouncedValue(keyword, 400);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ sku: '', productName: '', category: 'Racket', quantity: 0, lowStockThreshold: 5, sellingPrice: 0 });

  async function load() {
    try {
      setLoading(true);
      setError(null);
      const res = await ownerApi.getProducts(complexId, { keyword: debouncedKeyword, page: 1, size: 50 });
      if (res.statusCode === 200) setItems(res.data?.items || []);
      else setError(res.message);
    } catch (e) {
      setError(typeof e === 'string' ? e : 'Lỗi tải kho.');
    } finally {
      setLoading(false);
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { if (complexId) load(); }, [complexId, debouncedKeyword]);

  function startEdit(p) {
    setEditId(p.productStockId);
    setForm({
      sku: p.sku,
      productName: p.productName,
      category: p.category || 'Racket',
      quantity: p.quantity,
      lowStockThreshold: p.lowStockThreshold,
      sellingPrice: p.sellingPrice,
    });
    setShowForm(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = editId
        ? await ownerApi.updateProduct(editId, complexId, form)
        : await ownerApi.createProduct({ ...form, complexId });
      if (res.statusCode === 200 || res.statusCode === 201) {
        setShowForm(false);
        setEditId(null);
        setForm({ sku: '', productName: '', category: 'Racket', quantity: 0, lowStockThreshold: 5, sellingPrice: 0 });
        load();
      } else setError(res.message);
    } catch (e) {
      setError(typeof e === 'string' ? e : 'Lưu thất bại.');
    }
  }

  return (
    <div className="space-y-6 auth-animate-in pb-12">
      <OwnerPageHeader
        title="Kho sản phẩm"
        description="Quản lý kho hàng hóa, dụng cụ và nước uống tại tổ hợp."
      >
        <OwnerBtn variant="primary" onClick={() => { setEditId(null); setShowForm(v => !v); }}>
          {showForm ? 'Đóng form' : '+ Thêm sản phẩm'}
        </OwnerBtn>
      </OwnerPageHeader>

      <OwnerCard className="space-y-4">
        <OwnerToolbar className="!mb-0">
          <div className="flex-1 min-w-[200px]">
            <OwnerSearchInput
              placeholder="Tìm theo SKU, tên sản phẩm..."
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            {/* Lọc danh mục ở đây nếu cần */}
          </div>
        </OwnerToolbar>
      </OwnerCard>

      {error && <OwnerErrorState message={error} onRetry={load} />}

      {showForm && (
        <OwnerCard className="border-[#14b8a6] border-t-4">
          <h3 className="font-heading text-base uppercase tracking-tight text-[#0f172a] m-0 mb-4">
            {editId ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
          </h3>
          <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            <OwnerFormField label="SKU" required>
              <input required className={ownerInputCls} placeholder="Mã SKU" value={form.sku} onChange={e => setForm({ ...form, sku: e.target.value })} disabled={!!editId} />
            </OwnerFormField>
            <OwnerFormField label="Tên sản phẩm" required>
              <input required className={ownerInputCls} placeholder="Tên sản phẩm" value={form.productName} onChange={e => setForm({ ...form, productName: e.target.value })} />
            </OwnerFormField>
            <OwnerFormField label="Danh mục">
              <input className={ownerInputCls} placeholder="VD: Nước uống" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
            </OwnerFormField>
            <OwnerFormField label="Số lượng">
              <input type="number" className={ownerInputCls} placeholder="Tồn kho" value={form.quantity} onChange={e => setForm({ ...form, quantity: +e.target.value })} />
            </OwnerFormField>
            <OwnerFormField label="Ngưỡng cảnh báo (tồn thấp)">
              <input type="number" className={ownerInputCls} placeholder="VD: 5" value={form.lowStockThreshold} onChange={e => setForm({ ...form, lowStockThreshold: +e.target.value })} />
            </OwnerFormField>
            <OwnerFormField label="Giá bán (VND)">
              <input type="number" className={ownerInputCls} placeholder="Giá bán" value={form.sellingPrice} onChange={e => setForm({ ...form, sellingPrice: +e.target.value })} />
            </OwnerFormField>

            <div className="sm:col-span-2 md:col-span-3 flex justify-end pt-4 border-t border-gray-100">
              <OwnerBtn type="submit">{editId ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm'}</OwnerBtn>
            </div>
          </form>
        </OwnerCard>
      )}

      <OwnerCard noPad>
        <OwnerTable>
          <OwnerThead>
            <OwnerTh>SKU</OwnerTh>
            <OwnerTh>Tên sản phẩm</OwnerTh>
            <OwnerTh>Tồn kho</OwnerTh>
            <OwnerTh>Giá bán</OwnerTh>
            <OwnerTh>Trạng thái</OwnerTh>
            <OwnerTh right>Thao tác</OwnerTh>
          </OwnerThead>

          {loading && <OwnerTableLoader cols={6} rows={5} />}

          {!loading && !error && !items.length && (
            <tbody>
              <tr>
                <td colSpan={6}>
                  <OwnerEmptyState title="Không có sản phẩm nào"
                    description={debouncedKeyword ? `Không tìm thấy kết quả nào cho "${debouncedKeyword}".` : "Thêm sản phẩm đầu tiên vào kho hàng của bạn."}
                  />
                </td>
              </tr>
            </tbody>
          )}

          {!loading && !error && items.length > 0 && (
            <tbody className="divide-y divide-gray-50">
              {items.map(p => (
                <tr key={p.productStockId} className="hover:bg-gray-50/50 transition-colors">
                  <OwnerTd>
                    <span className="font-mono text-[13px] text-gray-500">{p.sku}</span>
                  </OwnerTd>
                  <OwnerTd>
                    <span className="font-bold text-[#0f172a] block">{p.productName}</span>
                    <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wide">{p.category}</span>
                  </OwnerTd>
                  <OwnerTd>
                    <div className="flex items-center gap-2">
                      <span className={`font-semibold ${p.isLowStock ? 'text-red-600' : 'text-gray-700'}`}>{p.quantity}</span>
                      {p.isLowStock && <span className="bg-red-50 text-red-600 px-2 py-0.5 rounded-[4px] text-[10px] font-bold uppercase tracking-wider">Sắp hết</span>}
                    </div>
                  </OwnerTd>
                  <OwnerTd>
                    <span className="font-medium text-[#14b8a6]">{Number(p.sellingPrice).toLocaleString('vi-VN')} ₫</span>
                  </OwnerTd>
                  <OwnerTd>
                    <OwnerStatusBadge status={p.status} type="general" />
                  </OwnerTd>
                  <OwnerTd right>
                    <button
                      type="button"
                      onClick={() => startEdit(p)}
                      className="text-[12px] font-bold text-gray-500 hover:text-[#14b8a6] uppercase tracking-wide bg-transparent border-0 cursor-pointer transition-colors"
                    >
                      Sửa
                    </button>
                  </OwnerTd>
                </tr>
              ))}
            </tbody>
          )}
        </OwnerTable>
      </OwnerCard>
    </div>
  );
}
