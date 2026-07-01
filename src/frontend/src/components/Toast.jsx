import { useState, useEffect, createContext, useContext, useCallback, useMemo } from 'react'

const ToastContext = createContext(null)

// Hook exported alongside provider — intentional colocation for toast API surface.
// eslint-disable-next-line react-refresh/only-export-components
export function useToast() {
  return useContext(ToastContext)
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, type = 'success', duration = 4000) => {
    const id = Date.now() + Math.random()
    setToasts(prev => [...prev, { id, message, type, duration }])
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const toastApi = useMemo(() => {
    const show = (message, type = 'success', duration = 4000) => addToast(message, type, duration)
    return new Proxy(show, {
      get(target, prop) {
        if (prop === 'addToast') return target
        return target[prop]
      },
    })
  }, [addToast])

  return (
    <ToastContext.Provider value={toastApi}>
      {children}
      <div className="fixed top-20 right-6 z-[9999] flex flex-col gap-4 pointer-events-none max-w-sm">
        {toasts.map(toast => (
          <Toast key={toast.id} {...toast} onDismiss={() => removeToast(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

function Toast({ id, message, type, duration, onDismiss }) {
  const [visible, setVisible] = useState(false)
  const [exiting, setExiting] = useState(false)

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true))
    const timer = setTimeout(() => {
      setExiting(true)
      setTimeout(onDismiss, 300)
    }, duration)
    return () => clearTimeout(timer)
  }, [duration, onDismiss])

  const typeConfig = {
    success: { icon: '★', color: 'text-neo-accent', bg: 'bg-neo-secondary' },
    error:   { icon: '×', color: 'text-[var(--theme-primary)]', bg: 'bg-neo-danger' },
    warning: { icon: '!', color: 'text-neo-accent', bg: 'bg-neo-secondary' },
    info:    { icon: 'i', color: 'text-[var(--theme-primary)]', bg: 'bg-neo-secondary' }
  }

  const conf = typeConfig[type] || typeConfig.info

  return (
    <div
      className={`pointer-events-auto flex items-start gap-4 px-5 py-4 ${conf.bg} border-4 border-neo-muted font-sans text-xl transition-all duration-300 shadow-[inset_2px_2px_0_rgba(255,255,255,0.4),inset_-2px_-2px_0_rgba(0,0,0,0.1),4px_4px_0_var(--color-neo-danger)]`}
      style={{
        transform: visible && !exiting ? 'translateY(0) scale(1)' : 'translateY(-20px) scale(0.95)',
        opacity: visible && !exiting ? 1 : 0,
      }}
    >
      <div className={`w-8 h-8 shrink-0 flex items-center justify-center border-2 border-neo-muted bg-neo-bg font-heading text-sm ${conf.color} shadow-[inset_1px_1px_0_rgba(255,255,255,0.4)]`} style={{ textShadow: '1px 1px 0px rgba(0,0,0,0.2)' }}>
        {conf.icon}
      </div>
      <div className="flex-1 pt-1 text-neo-ink leading-tight font-bold" style={{ textShadow: '1px 1px 0px rgba(0,0,0,0.1)' }}>
        {message}
      </div>
    </div>
  )
}
