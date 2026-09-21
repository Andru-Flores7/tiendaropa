import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          <span className="footer-logo">Russo Indumentaria</span>
          <p>Ropa con carácter, hecha para durar. © {new Date().getFullYear()}</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <a href="https://www.instagram.com/russo.indumentaria?stkn=MXdtenoxaWs4OHBvZQ%3D%3D" target="_blank" rel="noopener noreferrer" aria-label="Instagram" style={{ color: 'var(--ink)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
          </a>
          <a href="https://l.instagram.com/?u=https%3A%2F%2Fwww.tiktok.com%2F%40russo.indumentaria%3F_t%3DZM-8ykejQiypkr%26_r%3D1%26fbclid%3DPAcGRvZgJleHRuA2FlbQIxMQBzcnRjBmFwcF9pZA85MzY2MTk3NDMzOTI0NTkAAaewJjfKjw9UjNje5v8IBNcC5w_lmQsuht-N7ur9H7I6Uw_sY0BE9HAmTFR6Bg_aem_ZmFrZWR1bW15MTZieXRlcw&e=AUDVIi_l5aiVVXlRWHivpFrnnZ_tE-59Wm5JwKL3c_FduPBgmHLvm0rMxalJdCb8ND2pYRDGgEPUWhyuIgGg0fAw1qFAtnaNT9uUnQpUqlKkbB8g7LKa69COZ-4EZ6yPQpsgAVaK1eIlNFxP7Yr9ynk" target="_blank" rel="noopener noreferrer" aria-label="TikTok" style={{ color: 'var(--ink)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path>
            </svg>
          </a>
          <a href="/admin/login" className="footer-admin-btn" aria-label="Admin Login" style={{ marginLeft: 'var(--space-2)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </a>
        </div>
      </div>
    </footer>
  )
}
