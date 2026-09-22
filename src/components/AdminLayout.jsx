import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './AdminLayout.css'

const links = [
  { to: '/admin', label: 'Resumen', end: true },
  { to: '/admin/productos', label: 'Productos' },
  { to: '/admin/categorias', label: 'Categorías' },
  { to: '/admin/pedidos', label: 'Pedidos' },
]

export default function AdminLayout() {
  const { profile, signOut } = useAuth()

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">Russo <span>admin</span></div>
        <nav className="admin-nav">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} className={({isActive}) => isActive ? 'active' : ''}>
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="admin-sidebar-footer">
     
          <button style={{color: 'red', borderRadius: '5px', padding: '10px', cursor: 'pointer',backgroundColor: 'red', }}  onClick={signOut}>Salir</button>
        </div>
      </aside>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  )
}
