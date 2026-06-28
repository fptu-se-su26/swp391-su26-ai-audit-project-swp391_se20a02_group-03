/**
 * Emblem PRO-SPORT — lục giác + sân thi đấu nhìn từ trên (riêng biệt, không vạch/stripe).
 */
export default function ProSportLogoMark({ size = 32, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`prosport-mark shrink-0 ${className}`}
      aria-hidden="true"
    >
      <path
        d="M24 4.5L40.2 13.2v13.6L24 39.5 7.8 26.8V13.2L24 4.5z"
        stroke="currentColor"
        strokeWidth="2.1"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Sân — hình thoi + đường chia giữa */}
      <path
        d="M24 14.5L33.5 24L24 33.5L14.5 24L24 14.5z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
        fill="none"
      />
      <line x1="14.5" y1="24" x2="33.5" y2="24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="24" y1="14.5" x2="24" y2="33.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.45" />

      {/* Điểm trung tâm — bóng / tâm sân */}
      <circle cx="24" cy="24" r="2.2" fill="currentColor" />
    </svg>
  )
}
