import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { inicializarDB } from "./data/db.js";

// Layout
import Navbar from "./components/layout/Navbar.jsx";
import Footer from "./components/layout/Footer.jsx";

// Páginas públicas
import Home from "./pages/Home.jsx";
import Productos from "./pages/Productos.jsx";
import ProductoDetalle from "./pages/ProductoDetalle.jsx";
import Categorias from "./pages/Categorias.jsx";
import Ofertas from "./pages/Ofertas.jsx";
import Carrito from "./pages/Carrito.jsx";
import Checkout from "./pages/Checkout.jsx";
import CheckoutExito from "./pages/CheckoutExito.jsx";
import CheckoutError from "./pages/CheckoutError.jsx";
import Login from "./pages/Login.jsx";
import Registro from "./pages/Registro.jsx";
import Nosotros from "./pages/Nosotros.jsx";
import Blogs from "./pages/Blogs.jsx";
import BlogDetalle from "./pages/BlogDetalle.jsx";
import Contacto from "./pages/Contacto.jsx";

// Admin
import Panel from "./pages/admin/Panel.jsx";

// Inicializar BD en el arranque (solo la primera vez)
inicializarDB();

// Página 404
function NotFound() {
  return (
    <div className="container py-5 text-center">
      <div style={{ fontSize: "5rem" }}>🕹️</div>
      <h1 style={{ fontFamily: "Orbitron, sans-serif", color: "#1E90FF", fontSize: "3rem" }}>404</h1>
      <p className="text-secondary mb-4">Esta página no existe en el metaverso gamer.</p>
      <a href="/" className="btn" style={{ background: "#1E90FF", color: "#fff", fontWeight: 700 }}>Volver al Home</a>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <div className="d-flex flex-column" style={{ minHeight: "100vh", background: "#000000" }}>
            <Navbar />
            <main className="flex-grow-1">
              <Routes>
                {/* ── Públicas ── */}
                <Route path="/" element={<Home />} />
                <Route path="/productos" element={<Productos />} />
                <Route path="/productos/:codigo" element={<ProductoDetalle />} />
                <Route path="/categorias" element={<Categorias />} />
                <Route path="/ofertas" element={<Ofertas />} />
                <Route path="/carrito" element={<Carrito />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/checkout-exito" element={<CheckoutExito />} />
                <Route path="/checkout-error" element={<CheckoutError />} />
                <Route path="/login" element={<Login />} />
                <Route path="/registro" element={<Registro />} />
                <Route path="/nosotros" element={<Nosotros />} />
                <Route path="/blogs" element={<Blogs />} />
                <Route path="/blogs/:id" element={<BlogDetalle />} />
                <Route path="/contacto" element={<Contacto />} />

                {/* ── Admin ── */}
                <Route path="/admin" element={<Panel />} />

                {/* ── 404 ── */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
