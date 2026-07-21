import { describe, it, expect } from 'vitest'
import { resolveProductImage, CATEGORY_FALLBACKS } from './productImages'

// BUG: resolveProductImage kiểm tra bảng match-từ-khóa (LOCAL_PRODUCT_IMAGES) TRƯỚC
// ImageUrl admin đã đặt, nên một sản phẩm có ImageUrl hợp lệ vẫn bị ghi đè nếu tên chỉ
// cần chứa một từ khóa trùng với sản phẩm khác (VD: mọi vợt có chữ "Astrox" trong tên
// đều bị gán nhầm ảnh Astrox 88D). Test dưới đây khoá lại: ImageUrl admin đặt phải luôn
// được ưu tiên trước match-từ-khóa.
describe('resolveProductImage — ImageUrl admin đặt được ưu tiên trước match-từ-khóa', () => {
  it('sản phẩm trùng từ khóa với SP khác nhưng có ImageUrl riêng thì dùng đúng ImageUrl đó', () => {
    const src = resolveProductImage(
      'Vợt Cầu Lông Yonex Astrox 77 Tour Limited - Light Beige',
      'Racket',
      CATEGORY_FALLBACKS.Racket
    )
    expect(src).toBe(CATEGORY_FALLBACKS.Racket)
    expect(src).not.toBe('/images/racket-yonex-astrox-88d.png')
  })

  it('không có ImageUrl thật thì vẫn fallback về match-từ-khóa như cũ (không regressive)', () => {
    const src = resolveProductImage('Vợt Yonex Astrox 88D', 'Racket', null)
    expect(src).toBe('/images/racket-yonex-astrox-88d.png')
  })

  it('không có ImageUrl và không khớp từ khóa nào thì fallback theo category', () => {
    const src = resolveProductImage('Quấn cán vợt cao cấp', 'Accessories', '')
    expect(src).toBe(CATEGORY_FALLBACKS.Accessories)
  })
})
