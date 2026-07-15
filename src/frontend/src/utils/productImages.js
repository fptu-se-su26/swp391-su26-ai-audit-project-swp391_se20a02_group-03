export const CATEGORY_FALLBACKS = {
  Racket:          'https://images.unsplash.com/photo-1617634974415-8e0c61e4a23b?w=600&q=80',
  Footwear:        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
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
]

export function resolveProductImage(name, category, imageUrl) {
  const lower = (name || '').toLowerCase()
  for (const entry of LOCAL_PRODUCT_IMAGES) {
    if (entry.keywords.some(k => lower.includes(k))) return entry.src
  }
  if (imageUrl && imageUrl.length > 10 && !imageUrl.includes('placeholder')) return imageUrl
  return CATEGORY_FALLBACKS[category] || CATEGORY_FALLBACKS.Accessories
}
