import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'

// Matches AdminPageHeader / OwnerPageHeader — fixed-light dashboard header
export default function PageHeader({ title, subtitle, breadcrumb = [], actions }) {
  return (
    <div className="mb-8">
      {breadcrumb.length > 0 && (
        <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-2">
          {breadcrumb.map((crumb, i) => (
            <span key={crumb.to || crumb.label} className="flex items-center gap-1.5">
              {i > 0 && <ChevronRight className="w-3.5 h-3.5" />}
              {crumb.to ? (
                <Link to={crumb.to} className="hover:text-gray-600 transition-colors no-underline">{crumb.label}</Link>
              ) : (
                <span className="text-gray-500">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>
      )}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl uppercase tracking-tight text-gray-900 m-0 mb-1">{title}</h1>
          {subtitle && <p className="text-sm text-gray-500 m-0">{subtitle}</p>}
        </div>
        {actions && <div className="flex items-center gap-3 shrink-0">{actions}</div>}
      </div>
    </div>
  )
}
