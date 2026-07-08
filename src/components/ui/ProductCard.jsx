import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext.jsx";
import { formatearPrecio, calcularPrecioConDescuento } from "../../data/productos.js";

export default function ProductCard({ producto }) {
  const { agregar } = useCart();
  const precioFinal = calcularPrecioConDescuento(producto.precio, producto.descuento);
  const stockBajo = Number(producto.stock) <= Number(producto.stockCritico ?? 0);

  // 🌟 Lógica inteligente: Si es link de internet se queda igual, si es local de public asegura el '/'
  const srcImagen = producto.imagen.startsWith("http")
    ? producto.imagen
    : (producto.imagen.startsWith("/") ? producto.imagen : `/${producto.imagen}`);

  return (
    <div className="card h-100 border-0 product-card" style={{ background: "#070c12", border: "1px solid rgba(30,144,255,0.15)" }}>
      {/* Badge de descuento */}
      {producto.descuento > 0 && (
        <span className="badge bg-danger position-absolute top-0 end-0 m-2" style={{ zIndex: 1 }}>
          -{producto.descuento}%
        </span>
      )}

      {/* ── CONTENEDOR DE IMAGEN CORREGIDO Y CENTRADO TOTALMENTE ── */}
      <Link 
        to={`/productos/${producto.codigo}`} 
        className="d-flex align-items-center justify-content-center p-2" 
        style={{ background: "#fff", height: 200, overflow: "hidden" }}
      >
        <img
          src={srcImagen} // <-- Usamos la ruta inteligente corregida
          alt={producto.titulo}
          style={{ 
            maxHeight: "160px",  /* Forzamos a que reduzca sutilmente el alto para que deje un margen limpio */
            maxWidth: "90%",     /* Evita que se recueste o estire en los costados */
            objectFit: "contain", 
            display: "block" 
          }}
        />
      </Link>

      <div className="card-body d-flex flex-column p-3">
        {/* Categoría */}
        <span className="badge mb-2" style={{ background: "rgba(30,144,255,0.15)", color: "#1E90FF", border: "1px solid #1E90FF", fontSize: "0.7rem", alignSelf: "flex-start" }}>
          {producto.categoria}
        </span>

        {/* Título */}
        <Link to={`/productos/${producto.codigo}`} className="text-decoration-none">
          <h6 className="card-title text-white mb-1" style={{ fontFamily: "Orbitron, sans-serif", fontSize: "0.85rem", lineHeight: 1.4 }}>
            {producto.titulo}
          </h6>
        </Link>

        {/* Precio */}
        <div className="mt-auto pt-2">
          {producto.descuento > 0 && (
            <span className="text-secondary text-decoration-line-through small me-2">
              {formatearPrecio(producto.precio)}
            </span>
          )}
          <span style={{ color: "#39FF14", fontFamily: "Orbitron, sans-serif", fontWeight: 700, fontSize: "1rem" }}>
            {formatearPrecio(precioFinal)}
          </span>

          {/* Stock crítico */}
          {stockBajo && (
            <div className="mt-1">
              <span className="badge bg-danger" style={{ fontSize: "0.65rem" }}>⚠ Stock crítico</span>
            </div>
          )}

          {/* Botones */}
          <div className="d-flex gap-2 mt-3">
            <Link to={`/productos/${producto.codigo}`} className="btn btn-sm btn-outline-info flex-fill" style={{ fontSize: "0.75rem" }}>
              Ver detalles
            </Link>
            <button
              onClick={() => agregar(producto.codigo)}
              className="btn btn-sm flex-fill"
              style={{ background: "transparent", border: "1px solid #39FF14", color: "#39FF14", fontSize: "0.75rem" }}
              disabled={producto.stock === 0}
            >
              {producto.stock === 0 ? "Sin stock" : "🛒 Añadir"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}