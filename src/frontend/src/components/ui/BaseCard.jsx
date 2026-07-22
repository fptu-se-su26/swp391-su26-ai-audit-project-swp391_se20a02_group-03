// Density contexts per docs/ui/design-system-spec.md §2:
// comfortable = User portal, operational = Owner portal, compact = Admin portal
// Internal portals (Admin/Owner/Apex) are fixed-light dashboards, independent of the
// app-wide dark/light theme toggle — matches components/admin & components/owner kits.
const DENSITY = {
  comfortable: { pad: 'p-6 md:p-8', radius: 'rounded-lg' },
  operational: { pad: 'p-4 md:p-6', radius: 'rounded-md' },
  compact: { pad: 'p-3 md:p-4', radius: 'rounded-sm' },
}

export default function BaseCard({
  as: Tag = 'div',
  density = 'operational',
  noPad = false,
  hover = false,
  className = '',
  children,
  ...rest
}) {
  const { pad, radius } = DENSITY[density] || DENSITY.operational
  return (
    <Tag
      className={`bg-white border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] relative
        ${radius} ${noPad ? '' : pad}
        ${hover ? 'transition-shadow duration-200 ease-out hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)]' : ''}
        ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  )
}
