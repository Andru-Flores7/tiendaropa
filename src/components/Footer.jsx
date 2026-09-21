import { Link } from 'react-router-dom'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">

        {/* Marca */}
        <div className="footer-brand">
          <span className="footer-logo">Russo Indumentaria</span>
          <p>Ropa con carácter, hecha para durar.</p>
          <div className="footer-social">
            <a
              href="https://www.instagram.com/russo.indumentaria"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="footer-social-link"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg>
              @russo.indumentaria
            </a>
          </div>
        </div>

        {/* Tienda */}
        <div className="footer-col">
          <p className="footer-col-title">Tienda</p>
          <nav>
            <Link to="/tienda">Todos los productos</Link>
            <Link to="/checkout">Finalizar compra</Link>
          </nav>
        </div>

        {/* Legal */}
        <div className="footer-col">
          <p className="footer-col-title">Legal</p>
          <nav>
            <Link to="/terminos">Términos y condiciones</Link>
            <Link to="/envios">Política de envíos</Link>
            <Link to="/devoluciones">Cambios y devoluciones</Link>
          </nav>
        </div>

      </div>

      <div className="container footer-bottom">
        <p>© {new Date().getFullYear()} Russo Indumentaria. Todos los derechos reservados.</p>
        <a href="/admin/login" className="footer-admin-link" aria-label="Admin">Panel admin</a>
      </div>
    </footer>
  )
}
