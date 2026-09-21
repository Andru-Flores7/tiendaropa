import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
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
import NotFound from './pages/NotFound'
import Terms from './pages/Terms'
import Shipping from './pages/Shipping'
import Returns from './pages/Returns'

import Login from './pages/admin/Login'
import Dashboard from './pages/admin/Dashboard'
import Products from './pages/admin/Products'
import Categories from './pages/admin/Categories'
import Orders from './pages/admin/Orders'

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/tienda" element={<Shop />} />
        <Route path="/producto/:slug" element={<ProductDetail />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/pedido-confirmado" element={<OrderConfirmation />} />
        <Route path="/terminos" element={<Terms />} />
        <Route path="/envios" element={<Shipping />} />
        <Route path="/devoluciones" element={<Returns />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')

  if (isAdmin) {
    return (
      <Routes>
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
      </Routes>
    )
  }

  return (
    <>
      <Navbar />
      <AnimatedRoutes />
      <Footer />
      <CartDrawer />
    </>
  )
}
