import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { formatearPrecio } from "../data/productos.js";

export default function Carrito() {
  const { items, cantidadTotal, totalFormateado, total, actualizar, eliminar, vaciar } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="container py-5 text-center">
        <div style={{ fontSize: "5rem" }}>🛒</div>
        <h2 className="text-white mt-3 mb-2" style={{ fontFamily: "Orbitron, sans-serif" }}>TU CARRITO ESTÁ VACÍO</h2>
        <p className="text-secondary mb-4">Agrega productos para comenzar tu compra</p>
        <Link to="/productos" className="btn btn-lg" style={{ background: "#1E90FF", color: "#fff", fontWeight: 700 }}>
          Explorar Productos
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h1 className="fw-bold mb-4" style={{ fontFamily: "Orbitron, sans-serif", color: "#1E90FF" }}>
        TU CARRITO
      </h1>

      <div className="row g-4">
        {/* Items */}
        <div className="col-lg-8">
          {items.map((item) => (
            <div key={item.codigo} className="rounded-3 p-3 mb-3 d-flex align-items-center gap-3"
              style={{ background: "#0d0d21", border: "1px solid #1E90FF22" }}>
              {/* Imagen */}
              <div className="rounded-2 flex-shrink-0" style={{ background: "#fff", width: 80, height: 80, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                <img src={item.producto.imagen} alt={item.producto.titulo} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", padding: 4 }} />
              </div>

              {/* Info */}
              <div className="flex-grow-1 min-width-0">
                <Link to={`/productos/${item.codigo}`} className="text-decoration-none">
                  <h6 className="text-white mb-1" style={{ fontFamily: "Orbitron, sans-serif", fontSize: "0.85rem" }}>
                    {item.producto.titulo}
                  </h6>
                </Link>
                <span style={{ color: "#1E90FF", fontSize: "0.8rem" }}>{item.producto.categoria}</span>
                <div className="mt-1" style={{ color: "#39FF14", fontWeight: 700 }}>
                  {formatearPrecio(item.precioFinal)} c/u
                </div>
              </div>

              {/* Controles cantidad */}
              <div className="d-flex align-items-center gap-2 flex-shrink-0">
                <button className="btn btn-sm btn-outline-secondary" style={{ width: 28, height: 28, padding: 0 }}
                  onClick={() => actualizar(item.codigo, item.cantidad - 1)}>−</button>
                <span className="text-white" style={{ minWidth: 24, textAlign: "center" }}>{item.cantidad}</span>
                <button className="btn btn-sm btn-outline-secondary" style={{ width: 28, height: 28, padding: 0 }}
                  onClick={() => actualizar(item.codigo, item.cantidad + 1)}>+</button>
              </div>

              {/* Subtotal */}
              <div className="text-end flex-shrink-0" style={{ minWidth: 90 }}>
                <div style={{ color: "#39FF14", fontWeight: 700, fontFamily: "Orbitron, sans-serif", fontSize: "0.9rem" }}>
                  {formatearPrecio(item.subtotal)}
                </div>
                <button className="btn btn-sm btn-link text-danger p-0 mt-1" style={{ fontSize: "0.75rem" }}
                  onClick={() => eliminar(item.codigo)}>Eliminar</button>
              </div>
            </div>
          ))}

          <div className="d-flex justify-content-between mt-3">
            <Link to="/productos" className="btn btn-outline-secondary btn-sm">← Seguir comprando</Link>
            <button className="btn btn-outline-danger btn-sm" onClick={vaciar}>🗑 Vaciar carrito</button>
          </div>
        </div>

        {/* Resumen */}
        <div className="col-lg-4">
          <div className="rounded-3 p-4" style={{ background: "#0d0d21", border: "1px solid #39FF1444", position: "sticky", top: 80 }}>
            <h5 className="text-white fw-bold mb-3" style={{ fontFamily: "Orbitron, sans-serif", fontSize: "1rem" }}>
              RESUMEN DEL PEDIDO
            </h5>
            <hr style={{ borderColor: "#1E90FF22" }} />
            <div className="d-flex justify-content-between text-secondary mb-2">
              <span>Productos ({cantidadTotal})</span>
              <span>{totalFormateado}</span>
            </div>
            <div className="d-flex justify-content-between text-secondary mb-3">
              <span>Envío</span>
              <span className="text-warning">Por calcular</span>
            </div>
            <hr style={{ borderColor: "#1E90FF22" }} />
            <div className="d-flex justify-content-between mb-4">
              <span className="text-white fw-bold">Total</span>
              <span style={{ color: "#39FF14", fontFamily: "Orbitron, sans-serif", fontWeight: 700, fontSize: "1.2rem" }}>
                {totalFormateado}
              </span>
            </div>
            <button onClick={() => navigate("/checkout")} className="btn w-100 fw-bold"
              style={{ background: "#1E90FF", color: "#fff", padding: "12px" }}>
              Ir a Pagar →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
