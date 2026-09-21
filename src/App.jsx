import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import CartDrawer from './components/CartDrawer'
import ProtectedRoute from './components/ProtectedRoute'
import AdminLayout from './components/AdminLayout'

import Home from './pages/Home'
import Shop from './pages/Shop'
import ProductDetail from './pages/ProductDetail'
import Checkout from './pages/Checkout'
import OrderConfirmation from './pages/OrderConfirmation'

import Login from './pages/admin/Login'
import Dashboard from './pages/admin/Dashboard'
import Products from './pages/admin/Products'
import Categories from './pages/admin/Categories'
import Orders from './pages/admin/Orders'

function StoreLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
      <CartDrawer />
    </>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<StoreLayout><Home /></StoreLayout>} />
      <Route path="/tienda" element={<StoreLayout><Shop /></StoreLayout>} />
      <Route path="/producto/:slug" element={<StoreLayout><ProductDetail /></StoreLayout>} />
      <Route path="/checkout" element={<StoreLayout><Checkout /></StoreLayout>} />
      <Route path="/pedido-confirmado" element={<StoreLayout><OrderConfirmation /></StoreLayout>} />

      <Route path="/admin/login" element={<Login />} />
      <Route
        path="/admin"
        element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}
      >
        <Route index element={<Dashboard />} />
        <Route path="productos" element={<Products />} />
        <Route path="categorias" element={<Categories />} />
        <Route path="pedidos" element={<Orders />} />
      </Route>

      <Route path="*" element={<StoreLayout><div className="state-block"><h3>Página no encontrada</h3></div></StoreLayout>} />
    </Routes>
  )
}
