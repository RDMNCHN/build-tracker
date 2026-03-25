import { useState, useCallback, createContext, useContext } from 'react'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [msg, setMsg] = useState('')
  const [show, setShow] = useState(false)
  const [tid, setTid] = useState(null)

  const toast = useCallback((message, type = 'success') => {
    if (tid) clearTimeout(tid)
    setMsg(message)
    setShow(true)
    const t = setTimeout(() => setShow(false), 2500)
    setTid(t)
  }, [tid])

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className={`toast ${show ? 'show' : ''}`} style={{
        background: msg.includes('Fehler') ? '#e94560' : '#27ae60'
      }}>{msg}</div>
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)
