import React, { useEffect } from 'react';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import OwnerLayout from './OwnerLayout';

const mocks = vi.hoisted(() => ({
  logout: vi.fn(),
  owner: {
    complexes: [{ complexId: 1, name: 'Cụm sân A' }, { complexId: 2, name: 'Cụm sân B' }],
    complexId: 1,
    loading: false,
    error: null,
    reload: vi.fn(),
  },
}));

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({ user: { fullName: 'Chủ sân' }, logout: mocks.logout }),
}));

vi.mock('../context/OwnerContext', () => ({
  useOwner: () => mocks.owner,
}));

function Probe({ onMount }) {
  useEffect(() => {
    onMount();
  }, [onMount]);
  return <div>Owner route</div>;
}

function renderLayout(probeMount) {
  return (
    <MemoryRouter initialEntries={['/owner']}>
      <Routes>
        <Route path="/owner" element={<OwnerLayout />}>
          <Route index element={<Probe onMount={probeMount} />} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
}

describe('OwnerLayout', () => {
  beforeEach(() => {
    mocks.owner.complexId = 1;
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));
  });

  afterEach(() => cleanup());

  it('cô lập Outlet theo complexId để không giữ state của cụm sân cũ', () => {
    const probeMount = vi.fn();
    const { rerender } = render(renderLayout(probeMount));
    expect(probeMount).toHaveBeenCalledTimes(1);

    mocks.owner.complexId = 2;
    rerender(renderLayout(probeMount));
    expect(probeMount).toHaveBeenCalledTimes(2);
  });

  it('không cho focus sidebar đóng, hỗ trợ Escape và trả focus về nút menu', async () => {
    const user = userEvent.setup();
    render(renderLayout(vi.fn()));

    const sidebar = screen.getByLabelText('Sidebar navigation');
    const menuButton = screen.getByRole('button', { name: 'Mở menu' });
    expect(sidebar.getAttribute('aria-hidden')).toBe('true');
    expect(sidebar.hasAttribute('inert')).toBe(true);
    expect(menuButton.getAttribute('aria-expanded')).toBe('false');

    await user.click(menuButton);
    const closeButton = sidebar.querySelector('[data-owner-sidebar-close]');
    await waitFor(() => expect(document.activeElement).toBe(closeButton));
    expect(sidebar.getAttribute('aria-hidden')).toBeNull();
    expect(sidebar.hasAttribute('inert')).toBe(false);

    await user.keyboard('{Escape}');
    await waitFor(() => expect(document.activeElement).toBe(menuButton));
    expect(menuButton.getAttribute('aria-expanded')).toBe('false');
    expect(sidebar.hasAttribute('inert')).toBe(true);
  });
});
