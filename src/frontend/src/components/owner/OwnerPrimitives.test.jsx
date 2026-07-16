import React, { useState } from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { OwnerFormField, OwnerModal, OwnerSearchInput, ownerInputCls } from './index';

function ModalHarness({ onClose }) {
  const [open, setOpen] = useState(false);
  const [checked, setChecked] = useState(false);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>Mở phân quyền</button>
      <OwnerModal open={open} onClose={() => { setOpen(false); onClose(); }} title="Phân quyền">
        <label>
          <input
            type="checkbox"
            checked={checked}
            onChange={(event) => setChecked(event.target.checked)}
          />
          Check-in
        </label>
        <button type="button">Lưu</button>
      </OwnerModal>
    </>
  );
}

describe('Owner shared primitives', () => {
  afterEach(() => {
    cleanup();
    document.body.style.overflow = '';
  });

  it('liên kết label, required, help text và error với control nằm trong wrapper', () => {
    const { rerender } = render(
      <OwnerFormField label="Mã sân" required helpText="Để trống sẽ tự sinh mã.">
        <div className="relative">
          <input className={ownerInputCls} />
        </div>
      </OwnerFormField>
    );

    const input = screen.getByRole('textbox', { name: 'Mã sân' });
    expect(input.required).toBe(true);
    expect(input.getAttribute('aria-describedby')).toBeTruthy();
    expect(document.getElementById(input.getAttribute('aria-describedby')).textContent).toContain('Để trống');

    rerender(
      <OwnerFormField label="Mã sân" required error="Mã sân không hợp lệ">
        <div className="relative">
          <input className={ownerInputCls} />
        </div>
      </OwnerFormField>
    );

    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(screen.getByRole('alert').textContent).toContain('không hợp lệ');
  });

  it('cung cấp accessible name mặc định cho ô tìm kiếm', () => {
    render(<OwnerSearchInput value="" onChange={() => {}} />);
    expect(screen.getByRole('textbox', { name: 'Tìm kiếm' })).toBeDefined();
  });

  it('giữ focus trong modal qua rerender và trả focus đúng opener khi đóng', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    document.body.style.overflow = 'clip';
    render(<ModalHarness onClose={onClose} />);

    const opener = screen.getByRole('button', { name: 'Mở phân quyền' });
    await user.click(opener);

    const checkbox = await screen.findByRole('checkbox', { name: 'Check-in' });
    checkbox.focus();
    fireEvent.click(checkbox);
    expect(document.activeElement).toBe(checkbox);

    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(document.activeElement).toBe(opener);
    expect(document.body.style.overflow).toBe('clip');
  });
});
