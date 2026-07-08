/**
 * Fallback toàn cục cho ảnh vỡ: ảnh nào tải lỗi (URL hỏng, host chặn…)
 * sẽ được thay bằng placeholder mang thương hiệu thay vì ô trắng trơn.
 * Lắp một lần ở main.jsx — bắt sự kiện error ở capture phase nên phủ mọi <img> trong app.
 */
const PLACEHOLDER = 'data:image/svg+xml,' + encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400">
  <rect width="600" height="400" fill="#e4e2da"/>
  <g fill="none" stroke="#0d1b2a" stroke-width="3" opacity="0.35">
    <rect x="258" y="128" width="84" height="84" transform="rotate(45 300 170)"/>
    <rect x="278" y="148" width="44" height="44" transform="rotate(45 300 170)"/>
  </g>
  <text x="300" y="282" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="21" font-weight="bold" letter-spacing="6" fill="#0d1b2a" opacity="0.45">PRO-SPORT</text>
</svg>`
)

export function installImageFallback() {
  window.addEventListener(
    'error',
    (event) => {
      const el = event.target
      if (!(el instanceof HTMLImageElement)) return
      if (el.dataset.fallbackApplied === '1') return
      el.dataset.fallbackApplied = '1'
      el.srcset = ''
      el.src = PLACEHOLDER
    },
    true
  )
}
