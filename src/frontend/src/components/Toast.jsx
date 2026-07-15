import { useState, useEffect, createContext, useContext, useCallback, useMemo } from 'react'

const ToastContext = createContext(null)

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
      <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-3 pointer-events-none max-w-[340px]">
        {toasts.map(toast => (
          <Toast key={toast.id} {...toast} onDismiss={() => removeToast(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

function Toast({ message, type, duration, onDismiss }) {
  const [visible, setVisible] = useState(false)
  const [exiting, setExiting] = useState(false)

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true))
    const timer = setTimeout(() => {
      setExiting(true)
      setTimeout(onDismiss, 350)
    }, duration)
    return () => clearTimeout(timer)
  }, [duration, onDismiss])

  const typeConfig = {
    success: {
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="8" fill="#14b8a6" fillOpacity="0.15"/>
          <path d="M4.5 8L7 10.5L11.5 6" stroke="#14b8a6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      accent: '#14b8a6',
      bar: 'bg-[#14b8a6]',
    },
    error: {
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="8" fill="#ef4444" fillOpacity="0.15"/>
          <path d="M5.5 5.5L10.5 10.5M10.5 5.5L5.5 10.5" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      ),
      accent: '#ef4444',
      bar: 'bg-red-500',
    },
    warning: {
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="8" fill="#f59e0b" fillOpacity="0.15"/>
          <path d="M8 5v4M8 10.5v.5" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      ),
      accent: '#f59e0b',
      bar: 'bg-amber-400',
    },
    info: {
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="8" fill="#3b82f6" fillOpacity="0.15"/>
          <path d="M8 7v4M8 5.5v.5" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      ),
      accent: '#3b82f6',
      bar: 'bg-blue-500',
    },
  }

  const conf = typeConfig[type] || typeConfig.info

  return (
    <div
      className="pointer-events-auto relative bg-white rounded-[12px] shadow-[0_8px_30px_rgba(0,0,0,0.10)] border border-gray-100 overflow-hidden font-sans"
      style={{
        transform: visible && !exiting ? 'translateX(0) scale(1)' : 'translateX(40px) scale(0.96)',
        opacity: visible && !exiting ? 1 : 0,
        transition: 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1), opacity 0.3s ease',
      }}
    >
      {/* Colored top bar */}
      <div className={`absolute top-0 left-0 right-0 h-[3px] ${conf.bar}`} />

      <div className="flex items-start gap-3 px-4 py-4 pt-5">
        {/* Icon */}
        <div className="shrink-0 mt-0.5">
          {conf.icon}
        </div>

        {/* Message */}
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-bold text-[#0f172a] m-0 leading-snug">{message}</p>
        </div>

        {/* Dismiss button */}
        <button
          onClick={() => { setExiting(true); setTimeout(onDismiss, 350) }}
          className="shrink-0 w-5 h-5 flex items-center justify-center text-gray-300 hover:text-gray-500 transition-colors bg-transparent border-0 cursor-pointer rounded-full hover:bg-gray-100 -mt-0.5 -mr-1"
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M2 2L8 8M8 2L2 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      {/* Progress bar */}
      <div
        className={`absolute bottom-0 left-0 h-[2px] ${conf.bar} opacity-30`}
        style={{
          animation: `toast-shrink ${duration}ms linear forwards`,
        }}
      />

      <style>{`
        @keyframes toast-shrink {
          from { width: 100%; }
          to   { width: 0%; }
        }
      `}</style>
    </div>
  )
}
