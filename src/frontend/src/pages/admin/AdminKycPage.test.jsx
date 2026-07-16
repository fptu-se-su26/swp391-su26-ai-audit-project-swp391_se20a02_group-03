import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import AdminKycPage from './AdminKycPage'
import { kycApi } from '../../api/kycApi'
import { ToastProvider } from '../../components/Toast'

vi.mock('../../api/kycApi', () => ({
  kycApi: {
    getAll: vi.fn(),
    approve: vi.fn(),
    reject: vi.fn(),
  },
}))

vi.mock('../../layouts/AdminLayout', () => ({
  default: ({ children }) => <div data-testid="admin-layout">{children}</div>,
}))

const baseProfile = {
  ekycProfileId: 1,
  fullName: 'Nguyen Van A',
  identityNumber: '001',
  status: 'Pending',
  frontImageUrl: 'front-url',
  backImageUrl: 'back-url',
  faceImageUrl: '',
}

describe('AdminKycPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    kycApi.getAll.mockResolvedValue({ statusCode: 200, data: [baseProfile] })
  })

  function renderPage() {
    return render(
      <ToastProvider>
        <AdminKycPage />
      </ToastProvider>
    )
  }

  async function loadRequiredImages() {
    await screen.findByText(/Chi tiết KYC-1/i)
    const images = screen.getAllByRole('img')
    images.forEach(image => fireEvent.load(image))
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Phê duyệt' }).disabled).toBe(false)
    })
  }

  it('hiển thị trạng thái thiếu bằng chứng và khóa phê duyệt', async () => {
    kycApi.getAll.mockResolvedValue({
      statusCode: 200,
      data: [{ ...baseProfile, backImageUrl: '', faceImageUrl: '' }],
    })

    renderPage()
    await screen.findByText(/Chi tiết KYC-1/i)

    expect(screen.getByText('Chưa có bằng chứng')).toBeDefined()
    expect(screen.getByText('Không có ảnh (không bắt buộc)')).toBeDefined()
    expect(screen.getByRole('button', { name: 'Phê duyệt' }).disabled).toBe(true)
    expect(screen.queryByText('Xác nhận phê duyệt')).toBeNull()
  })

  it('không thay ảnh lỗi bằng ảnh stock và vẫn khóa phê duyệt', async () => {
    renderPage()
    await screen.findByText(/Chi tiết KYC-1/i)

    const frontImage = screen.getByRole('img', { name: 'Mặt trước' })
    fireEvent.error(frontImage)
    fireEvent.load(screen.getByRole('img', { name: 'Mặt sau' }))

    expect(await screen.findByText('Không tải được ảnh')).toBeDefined()
    expect(screen.getByRole('button', { name: 'Thử tải lại' })).toBeDefined()
    expect(document.querySelector('img[src*="images.unsplash.com"]')).toBeNull()
    expect(screen.getByRole('button', { name: 'Phê duyệt' }).disabled).toBe(true)
  })

  it('cho phép hủy hoặc xác nhận phê duyệt khi hai ảnh bắt buộc đã tải', async () => {
    kycApi.approve.mockResolvedValue({ statusCode: 200, message: 'OK' })
    renderPage()
    await loadRequiredImages()

    fireEvent.click(screen.getByRole('button', { name: 'Phê duyệt' }))
    expect(await screen.findByRole('button', { name: 'Xác nhận phê duyệt' })).toBeDefined()

    fireEvent.click(screen.getByRole('button', { name: 'Hủy' }))
    await waitFor(() => expect(screen.queryByRole('button', { name: 'Xác nhận phê duyệt' })).toBeNull())
    expect(kycApi.approve).not.toHaveBeenCalled()

    fireEvent.click(screen.getByRole('button', { name: 'Phê duyệt' }))
    fireEvent.click(await screen.findByRole('button', { name: 'Xác nhận phê duyệt' }))

    await waitFor(() => {
      expect(kycApi.approve).toHaveBeenCalledTimes(1)
      expect(kycApi.approve).toHaveBeenCalledWith(1)
    })
  })

  it('giữ nguyên hồ sơ và modal khi API phê duyệt thất bại', async () => {
    kycApi.approve.mockResolvedValue({ statusCode: 400, message: 'Không thể phê duyệt' })
    renderPage()
    await loadRequiredImages()

    fireEvent.click(screen.getByRole('button', { name: 'Phê duyệt' }))
    fireEvent.click(await screen.findByRole('button', { name: 'Xác nhận phê duyệt' }))

    await waitFor(() => expect(kycApi.approve).toHaveBeenCalledWith(1))
    expect(screen.getByText(/Chi tiết KYC-1/i)).toBeDefined()
    expect(screen.getByRole('button', { name: 'Xác nhận phê duyệt' })).toBeDefined()
  })
})
