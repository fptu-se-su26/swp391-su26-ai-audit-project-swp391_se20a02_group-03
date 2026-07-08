import { createContext, useCallback, useContext, useState } from 'react'

const ConfirmContext = createContext(null)

export function ConfirmProvider({ children }) {
  const [dialog, setDialog] = useState(null)

  const confirm = useCallback((options = {}) => {
    return new Promise((resolve) => {
      setDialog({
        title: options.title || 'Xác nhận',
        message: options.message || 'Bạn có chắc chắn muốn tiếp tục?',
        confirmLabel: options.confirmLabel || 'Xác nhận',
        cancelLabel: options.cancelLabel || 'Hủy',
        variant: options.variant || 'default',
        resolve,
      })
    })
  }, [])

  function close(result) {
    dialog?.resolve(result)
    setDialog(null)
  }

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {dialog && (
        <div
          className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-ink/60"
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-dialog-title"
          onClick={() => close(false)}
        >
          <div
            className="bg-surface rounded-[2px] max-w-md w-full p-6 border-2 border-border-strong"
            onClick={e => e.stopPropagation()}
          >
            <h3 id="confirm-dialog-title" className="font-heading text-xl uppercase text-foreground mb-2">
              {dialog.title}
            </h3>
            <p className="text-sm text-foreground-muted mb-6 leading-relaxed">{dialog.message}</p>
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => close(false)}
                className="btn-outline"
              >
                {dialog.cancelLabel}
              </button>
              <button
                type="button"
                autoFocus
                onClick={() => close(true)}
                className={`inline-flex items-center justify-center gap-2 px-5 h-10 font-sans text-sm font-extrabold uppercase tracking-[0.04em] rounded-[2px] border-2 transition-colors duration-150 ${
                  dialog.variant === 'danger'
                    ? 'bg-danger border-danger text-paper hover:opacity-90'
                    : 'btn-primary'
                }`}
              >
                {dialog.confirmLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  )
}

export function useConfirm() {
  const ctx = useContext(ConfirmContext)
  if (!ctx) throw new Error('useConfirm phải dùng trong ConfirmProvider')
  return ctx
}

export const BOOKING_CANCEL_CONFIRM = {
  title: 'Hủy đặt sân',
  message: 'Bạn có chắc chắn muốn hủy đơn đặt sân này?',
  confirmLabel: 'Hủy đặt sân',
  cancelLabel: 'Giữ lại',
  variant: 'danger',
}
