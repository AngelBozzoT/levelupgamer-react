import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ProductosDB } from "../data/db.js";
import { useCart } from "../context/CartContext.jsx";
import { formatearPrecio, calcularPrecioConDescuento } from "../data/productos.js";
import Toast from "../components/ui/Toast.jsx";

export default function ProductoDetalle() {
  const { codigo } = useParams();
  const navigate = useNavigate();
  const { agregar } = useCart();
  const [producto, setProducto] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const p = ProductosDB.buscarPorCodigo(codigo);
    if (!p) navigate("/productos", { replace: true });
    else setProducto(p);
  }, [codigo, navigate]);

  if (!producto) return <div className="container py-5 text-center text-secondary">Cargando...</div>;

  const precioFinal = calcularPrecioConDescuento(producto.precio, producto.descuento);
  const stockBajo = Number(producto.stock) <= Number(producto.stockCritico ?? 0);

  const handleAgregar = () => {
    agregar(producto.codigo, cantidad);
    setToast(`✅ ${producto.titulo} añadido al carrito`);
  };

  const srcImagen = producto.imagen.startsWith("http")
    ? producto.imagen
    : (producto.imagen.startsWith("/") ? producto.imagen : `/${producto.imagen}`);

  return (
    <div className="container py-5">
      {toast && <Toast mensaje={toast} onClose={() => setToast(null)} />}

      <Link to="/productos" className="btn btn-outline-secondary btn-sm mb-4">← Volver al catálogo</Link>

      <div className="row g-5">
        {/* Imagen Estilizada */}
        <div className="col-md-5">
          {/* Mantenemos tu fondo oscuro premium combinando con el entorno general */}
          <div className="rounded-3 p-4 d-flex align-items-center justify-content-center" style={{ background: "#0a0a16", border: "1px solid #1E90FF33", minHeight: 360 }}>
            <img 
              src={srcImagen} 
              alt={producto.titulo} 
              style={{ maxHeight: 320, maxWidth: "100%", objectFit: "contain" }}
            />
          </div>
        </div>

        {/* Info */}
        <div className="col-md-7">
          <span className="badge mb-2" style={{ background: "rgba(30,144,255,0.15)", color: "#1E90FF", border: "1px solid #1E90FF" }}>
            {producto.categoria}
          </span>
          <h1 style={{ fontFamily: "Orbitron, sans-serif", color: "#fff", fontSize: "clamp(1.3rem,3vw,2rem)" }}>
            {producto.titulo}
          </h1>
          <p className="text-secondary small">Código: {producto.codigo}</p>
          <p style={{ color: "#ccc", lineHeight: 1.8 }}>{producto.descripcion}</p>

          {/* Precio */}
          <div className="my-4">
            {producto.descuento > 0 && (
              <div>
                <span className="text-secondary text-decoration-line-through me-2">{formatearPrecio(producto.precio)}</span>
                <span className="badge bg-danger">-{producto.descuento}%</span>
              </div>
            )}
            <span style={{ fontFamily: "Orbitron, sans-serif", color: "#39FF14", fontSize: "2rem", fontWeight: 700 }}>
              {formatearPrecio(precioFinal)}
            </span>
          </div>

          {/* Stock */}
          {stockBajo ? (
            <span className="badge bg-danger mb-3">⚠ Stock crítico: quedan {producto.stock} unidades</span>
          ) : (
            <span className="badge bg-success mb-3">✓ En stock ({producto.stock} disponibles)</span>
          )}

          {/* Cantidad */}
          <div className="d-flex align-items-center gap-3 mb-4">
            <span className="text-light">Cantidad:</span>
            <div className="d-flex align-items-center gap-2" style={{ background: "#0a0a16", border: "1px solid #2a2a5a", borderRadius: 8, padding: "6px 14px" }}>
              <button className="btn btn-sm btn-outline-secondary px-2 py-0" onClick={() => setCantidad(Math.max(1, cantidad - 1))}>−</button>
              <span className="text-white px-2">{cantidad}</span>
              <button className="btn btn-sm btn-outline-secondary px-2 py-0" onClick={() => setCantidad(Math.min(producto.stock, cantidad + 1))}>+</button>
            </div>
          </div>

          {/* Acciones */}
          <div className="d-flex gap-3 flex-wrap">
            <button onClick={handleAgregar} disabled={producto.stock === 0} className="btn btn-lg px-5"
              style={{ background: "transparent", border: "2px solid #39FF14", color: "#39FF14", fontWeight: 700 }}>
              🛒 Añadir al Carrito
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}