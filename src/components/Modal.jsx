import { useEffect, useRef } from 'react'

export default function Modal({ title, onClose, children }) {
  // Guardamos onClose en un ref para que el efecto no se re-ejecute
  // cada vez que el padre re-renderiza y recrea la función
  const onCloseRef = useRef(onClose)
  useEffect(() => { onCloseRef.current = onClose })

  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onCloseRef.current() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, []) // array vacío: el efecto corre solo al montar/desmontar

  function handleOverlayClick() { onCloseRef.current() }

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-box" role="dialog" aria-label={title} onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h3>{title}</h3>
          <button className="btn-ghost" onClick={handleOverlayClick} aria-label="Cerrar">✕</button>
        </div>
        {children}
      </div>
    </div>
  )
}
