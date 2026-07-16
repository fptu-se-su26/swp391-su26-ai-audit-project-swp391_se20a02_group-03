import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import AdminComplaintsPage from './AdminComplaintsPage'
import { reportApi } from '../../api/reportApi'

vi.mock('../../api/reportApi', () => ({
  reportApi: {
    getAll: vi.fn(),
    resolve: vi.fn(),
  },
}))

vi.mock('../../layouts/AdminLayout', () => ({
  default: ({ children }) => <div>{children}</div>,
}))

vi.mock('../../components/Toast', () => ({
  useToast: () => ({ addToast: vi.fn() }),
}))

const pendingReport = {
  reportId: 1,
  status: 'Pending',
  reason: 'Không đến thi đấu',
  reporterId: 10,
  reportedUserId: 20,
  matchId: 30,
  createdAt: '2026-07-16T00:00:00Z',
}

describe('AdminComplaintsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    reportApi.getAll.mockResolvedValue({ statusCode: 200, data: [pendingReport] })
    reportApi.resolve.mockResolvedValue({
      statusCode: 200,
      data: { ...pendingReport, status: 'Resolved', adminNote: 'Đã xác minh' },
    })
  })

  it('bỏ chọn hồ sơ sau khi cập nhật làm hồ sơ không còn thuộc bộ lọc', async () => {
    render(<AdminComplaintsPage />)

    await screen.findByRole('button', { name: /#RP-1/i })
    fireEvent.click(screen.getByRole('tab', { name: 'Chờ xử lý' }))
    fireEvent.click(await screen.findByRole('button', { name: /#RP-1/i }))
    expect(screen.getByText(/#RP-1: Không đến thi đấu/i)).toBeDefined()

    fireEvent.click(screen.getByRole('button', { name: 'Xử lý xong' }))

    await waitFor(() => {
      expect(reportApi.resolve).toHaveBeenCalledWith(1, { status: 'Resolved', adminNote: '' })
      expect(screen.getByText('Chọn một khiếu nại để xem chi tiết.')).toBeDefined()
      expect(screen.queryByRole('button', { name: 'Xử lý xong' })).toBeNull()
    })
  })
})
