import { useOwner } from '../../context/OwnerContext';

export default function ComplexSelector({ className = '' }) {
  const { complexes, complexId, setComplexId } = useOwner();

  if (!complexes.length) return null;

  return (
    <div className={className}>
      <label htmlFor="owner-complex-select" className="text-xs font-semibold text-slate-500 uppercase">
        Tổ hợp
      </label>
      <select
        id="owner-complex-select"
        className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm bg-white"
        value={complexId ?? ''}
        onChange={(e) => setComplexId(parseInt(e.target.value, 10))}
      >
        {complexes.map(c => (
          <option key={c.complexId} value={c.complexId}>{c.name}</option>
        ))}
      </select>
    </div>
  );
}
