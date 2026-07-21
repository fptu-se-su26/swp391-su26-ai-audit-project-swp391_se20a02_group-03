export const CATEGORY_FALLBACKS = {
  Racket:          'https://images.unsplash.com/photo-1617634974415-8e0c61e4a23b?w=600&q=80',
  Footwear:        '/images/racket-yonex-astrox-88d.png',
  Apparel:         'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600&q=80',
  'Ball / Birdie': 'https://images.unsplash.com/photo-1599474924187-334a4ae5bd3c?w=600&q=80',
  Accessories:     'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=600&q=80',
  Protection:      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
}

const LOCAL_PRODUCT_IMAGES = [
  { keywords: ['astrox', '88d'],                  src: '/images/racket-yonex-astrox-88d.png' },
  { keywords: ['windstorm', '72', 'lining'],       src: '/images/racket-lining-windstorm-72.png' },
  { keywords: ['thruster', 'falcon', 'victor'],    src: '/images/racket-victor-thruster-k-falcon.png' },
  { keywords: ['selkirk', 'amped', 'epic'],        src: '/images/racket-selkirk-amped-epic.png' },
  { keywords: ['65z3', 'power cushion 65', 'yonex cushion'], src: '/images/shoe-yonex-65z3.png' },
  { keywords: ['eclipsion z2', 'power cushion eclipsion'], src: '/images/shoe-yonex-eclipsion-z2.png?v=2' },
  { keywords: ['comfort z2', 'power cushion comfort'], src: '/images/shoe-yonex-comfort-z2.png?v=2' },
]

export function resolveProductImage(name, category, imageUrl) {
  // Ảnh admin gán rõ ràng (ImageUrl) phải được ưu tiên trước — trước đây bảng match
  // từ khóa (LOCAL_PRODUCT_IMAGES) chạy trước và luôn thắng, nên một ImageUrl hợp lệ
  // do admin đặt vẫn bị âm thầm bỏ qua nếu tên sản phẩm trùng từ khóa của SP khác
  // (VD: mọi vợt có chữ "Astrox" trong tên đều bị gán nhầm ảnh Astrox 88D).
  if (imageUrl && imageUrl.length > 10 && !imageUrl.includes('placeholder')) return imageUrl

  const lower = (name || '').toLowerCase()
  for (const entry of LOCAL_PRODUCT_IMAGES) {
    if (entry.keywords.some(k => lower.includes(k))) return entry.src
  }
  return CATEGORY_FALLBACKS[category] || CATEGORY_FALLBACKS.Accessories
}
