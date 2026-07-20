import { useOwner } from '../../context/OwnerContext';
import { Building2, ChevronDown } from 'lucide-react';

export default function ComplexSelector({ className = '' }) {
  const { complexes, complexId, setComplexId } = useOwner();

  if (!complexes.length) return null;

  return (
    <div className={`relative flex items-center ${className}`}>
      <div className="absolute left-3 text-gray-400 pointer-events-none">
        <Building2 size={16} />
      </div>
      <select
        id="owner-complex-select"
        aria-label="Chọn tổ hợp sân"
        className="h-10 pl-9 pr-10 bg-gray-50/50 hover:bg-gray-100 border border-gray-200 rounded-[8px] text-sm font-semibold text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#14b8a6]/20 focus:border-[#14b8a6] transition-all cursor-pointer appearance-none min-w-[200px]"
        value={complexId ?? ''}
        onChange={(e) => setComplexId(parseInt(e.target.value, 10))}
      >
        <option value="" disabled>-- Chọn tổ hợp sân --</option>
        {complexes.map(c => (
          <option key={c.complexId} value={c.complexId}>{c.name}</option>
        ))}
      </select>
      <div className="absolute right-3 text-gray-400 pointer-events-none">
        <ChevronDown size={16} />
      </div>
    </div>
  );
}
