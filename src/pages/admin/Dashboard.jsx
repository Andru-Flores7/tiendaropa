import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { formatPrice } from '../../utils'

export default function Dashboard() {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    async function load() {
      const [{ count: productCount }, { count: orderCount }, { data: orders }] = await Promise.all([
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('total, status'),
      ])
      const revenue = (orders || [])
        .filter((o) => o.status !== 'cancelado')
        .reduce((sum, o) => sum + Number(o.total), 0)
      const pending = (orders || []).filter((o) => o.status === 'pendiente').length

      setStats({ productCount, orderCount, revenue, pending })
    }
    load()
  }, [])

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Resumen</h1>
          <p>Vista general de tu tienda</p>
        </div>
      </div>

      {!stats ? (
        <div className="state-block"><div className="spinner" /></div>
      ) : (
        <div className="stat-grid">
          <div className="stat-card"><span>Productos</span><strong>{stats.productCount ?? 0}</strong></div>
          <div className="stat-card"><span>Pedidos</span><strong>{stats.orderCount ?? 0}</strong></div>
          <div className="stat-card"><span>Pedidos pendientes</span><strong>{stats.pending}</strong></div>
          <div className="stat-card"><span>Ingresos totales</span><strong>{formatPrice(stats.revenue)}</strong></div>
        </div>
      )}
    </div>
  )
}
