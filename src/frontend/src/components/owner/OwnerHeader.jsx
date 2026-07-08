import OwnerBreadcrumb from './OwnerBreadcrumb';

export default function OwnerHeader({ complexName, onMenuOpen }) {
  return (
    <header className="sticky top-0 z-30 bg-surface border-b-2 border-border-strong px-4 py-3">
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="lg:hidden p-2 rounded-[2px] border-2 border-border-strong"
          onClick={onMenuOpen}
          aria-label="Mở menu"
        >
          ☰
        </button>
        <div className="flex-1 min-w-0">
          <OwnerBreadcrumb />
          <h1 className="font-heading text-lg uppercase tracking-tight text-foreground truncate">{complexName || 'Owner Portal'}</h1>
        </div>
      </div>
    </header>
  );
}
