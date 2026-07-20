import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ErrorBoundary from './ErrorBoundary';

// BUG: ErrorBoundary bọc NGOÀI <Router> trong App.jsx (App.jsx render <ErrorBoundary><Router>...
// </Router></ErrorBoundary>). Khi một route con crash, cây con bị unmount (bao gồm cả Router)
// và ErrorBoundary render fallback thay thế. Fallback cũ dùng react-router-dom <Link>, vốn cần
// Router context — nhưng Router đã bị unmount cùng cây con crash, nên <Link> tự crash tiếp,
// khiến CẢ TRANG trắng hoàn toàn (không có boundary nào cao hơn để bắt lỗi thứ hai này).
// Test dưới đây tái hiện đúng kịch bản: ErrorBoundary KHÔNG được bọc trong Router.

function Bomb() {
  throw new Error('Crash giả lập để test ErrorBoundary');
}

describe('ErrorBoundary — fallback không phụ thuộc Router context', () => {
  it('hiển thị đúng màn hình lỗi dù không có <Router> bao ngoài (không tự crash lần 2)', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <Bomb />
      </ErrorBoundary>
    );

    expect(screen.getByText('Đã xảy ra lỗi')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /quay lại/i })).toHaveAttribute('href', '/');

    consoleError.mockRestore();
  });
});
