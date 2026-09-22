import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { formatPrice } from '../../utils'
import { Download } from 'lucide-react'

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [currentMonthName, setCurrentMonthName] = useState('')

  useEffect(() => {
    async function load() {
      const [{ count: productCount }, { count: orderCount }, { data: orders }] = await Promise.all([
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('total, status, created_at'),
      ])
      const revenue = (orders || [])
        .filter((o) => o.status !== 'cancelado')
        .reduce((sum, o) => sum + Number(o.total), 0)
      const pending = (orders || []).filter((o) => o.status === 'pendiente').length

      // Calculate current month's revenue
      const now = new Date()
      const currentMonth = now.getMonth()
      const currentYear = now.getFullYear()
      
      const currentMonthOrders = (orders || []).filter((o) => {
        if (!o.created_at) return false
        const d = new Date(o.created_at)
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear && o.status !== 'cancelado'
      })
      
      const monthRevenue = currentMonthOrders.reduce((sum, o) => sum + Number(o.total), 0)

      setStats({ productCount, orderCount, revenue, pending, monthRevenue, currentMonthOrders })
      
      setCurrentMonthName(now.toLocaleString('es-ES', { month: 'long', year: 'numeric' }))
    }
    load()
  }, [])

  const handleDownloadReceipt = () => {
    if (!stats) return
    const content = `COMPROBANTE DE GANANCIAS\n` +
      `========================\n` +
      `Mes: ${currentMonthName}\n` +
      `Total de Pedidos Completados/Pendientes: ${stats.currentMonthOrders.length}\n` +
      `Ingresos del Mes: ${formatPrice(stats.monthRevenue)}\n\n` +
      `Ingresos Históricos Totales: ${formatPrice(stats.revenue)}\n` +
      `Fecha de Emisión: ${new Date().toLocaleString('es-ES')}\n`

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `comprobante-ganancias-${currentMonthName.replace(' ', '-')}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Resumen</h1>
          <p>Vista general de tu tienda</p>
        </div>
        {stats && (
          <button className="btn btn-outline" onClick={handleDownloadReceipt}>
            <Download size={18} />
            Descargar Ganancias del Mes
          </button>
        )}
      </div>

      {!stats ? (
        <div className="state-block"><div className="spinner" /></div>
      ) : (
        <div className="stat-grid">
          <div className="stat-card"><span>Productos</span><strong>{stats.productCount ?? 0}</strong></div>
          <div className="stat-card"><span>Pedidos Totales</span><strong>{stats.orderCount ?? 0}</strong></div>
          <div className="stat-card"><span>Pedidos Pendientes</span><strong>{stats.pending}</strong></div>
          <div className="stat-card"><span>Ingresos ({currentMonthName})</span><strong>{formatPrice(stats.monthRevenue)}</strong></div>
          <div className="stat-card"><span>Ingresos Totales</span><strong>{formatPrice(stats.revenue)}</strong></div>
        </div>
      )}
    </div>
  )
}
