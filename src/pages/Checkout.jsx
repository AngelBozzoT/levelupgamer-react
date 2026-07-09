import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { PedidosDB, ProductosDB } from "../data/db.js"; // ← Importamos ProductosDB para validar
import { formatearPrecio } from "../data/productos.js";

const REGIONES = [
  "Arica y Parinacota","Tarapacá","Antofagasta","Atacama","Coquimbo",
  "Valparaíso","Región Metropolitana","O'Higgins","Maule","Ñuble",
  "Biobío","Araucanía","Los Ríos","Los Lagos","Aysén","Magallanes",
];

export default function Checkout() {
  const { items, total, totalFormateado, vaciar } = useCart();
  const { usuario } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: usuario?.nombre || "",
    apellidos: usuario?.apellidos || "",
    correo: usuario?.correo || "",
    telefono: "",
    region: usuario?.region || "",
    comuna: usuario?.comuna || "",
    direccion: usuario?.direccion || "",
    metodoPago: "debito",
  });
  const [errores, setErrores] = useState({});
  const [procesando, setProcesando] = useState(false);

  if (items.length === 0) {
    return (
      <div className="container py-5 text-center">
        <p className="text-secondary">Tu carrito está vacío.</p>
        <Link to="/productos" className="btn btn-outline-light btn-sm">Ver productos</Link>
      </div>
    );
  }

  const validar = () => {
    const e = {};
    if (!form.nombre.trim()) e.nombre = "El nombre es requerido";
    if (!form.apellidos.trim()) e.apellidos = "Los apellidos son requeridos";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.correo)) e.correo = "Correo inválido";
    if (!form.region) e.region = "Selecciona una región";
    if (!form.comuna.trim()) e.comuna = "La comuna es requerida";
    if (!form.direccion.trim()) e.direccion = "La dirección es requerida";
    return e;
  };

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    if (errores[e.target.name]) setErrores((er) => ({ ...er, [e.target.name]: "" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const e2 = validar();
    if (Object.keys(e2).length > 0) { setErrores(e2); return; }

    setProcesando(true);

    // ── 🔥 CAPA DE AUDITORÍA: CONTROL DE STOCK INMEDIATO ──
    const productosEnDB = ProductosDB.listar();
    for (const item of items) {
      const prodReal = productosEnDB.find((p) => p.codigo === item.codigo);
      // Si la cantidad solicitada en el carrito supera el inventario del LocalStorage, rechazamos
      if (prodReal && item.cantidad > prodReal.stock) {
        setTimeout(() => {
          setProcesando(false);
          navigate("/checkout-error"); // Desvío directo sin tocar la pasarela
        }, 800);
        return;
      }
    }
    
    // Simular proceso de pago (2 seg)
    setTimeout(() => {
      // 🎲 SIMULACIÓN INTELIGENTE DE PASARELA (80% éxito / 20% error aleatorio)
      const pagoExitoso = Math.random() > 0.2;

      if (pagoExitoso) {
        try {
          // Descontar inventario en la simulación de DB antes de crear la orden
          items.forEach((item) => {
            const prodReal = productosEnDB.find((p) => p.codigo === item.codigo);
            if (prodReal) {
              const nuevoStock = Math.max(0, prodReal.stock - item.cantidad);
              ProductosDB.actualizar(prodReal.codigo, { ...prodReal, stock: nuevoStock });
            }
          });

          const pedido = PedidosDB.crear({
            items: items.map((i) => ({ codigo: i.codigo, titulo: i.producto.titulo, cantidad: i.cantidad, precio: i.precioFinal })),
            total,
            cliente: { nombre: form.nombre, apellidos: form.apellidos, correo: form.correo },
            envio: { region: form.region, comuna: form.comuna, direccion: form.direccion },
            metodoPago: form.metodoPago,
          });

          vaciar();
          // 🔀 CORREGIDO: Redirección con guion alineada con App.jsx
          navigate(`/checkout-exito?id=${pedido.id}`);
        } catch {
          navigate("/checkout-error");
        }
      } else {
        navigate("/checkout-error");
      }
      setProcesando(false);
    }, 2000);
  };

  const inputClass = (campo) =>
    "form-control bg-dark text-white border-secondary" + (errores[campo] ? " is-invalid" : "");

  return (
    <div className="container py-5">
      <h1 className="fw-bold mb-4" style={{ fontFamily: "Orbitron, sans-serif", color: "#1E90FF" }}>
        CHECKOUT
      </h1>
      {usuario && (
        <div className="alert alert-info alert-sm mb-4 py-2">
          📋 Datos pre-cargados desde tu cuenta. Puedes modificarlos si es necesario.
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="row g-4">
          {/* Formulario */}
          <div className="col-lg-7">
            {/* Datos personales */}
            <div className="rounded-3 p-4 mb-4" style={{ background: "#0d0d21", border: "1px solid #1E90FF22" }}>
              <h5 className="text-white fw-bold mb-4" style={{ fontFamily: "Orbitron, sans-serif", fontSize: "0.95rem" }}>
                📋 DATOS DE CONTACTO
              </h5>
              <div className="row g-3">
                <div className="col-sm-6">
                  <label className="form-label text-secondary small">Nombre *</label>
                  <input name="nombre" value={form.nombre} onChange={handleChange} className={inputClass("nombre")} />
                  {errores.nombre && <div className="invalid-feedback">{errores.nombre}</div>}
                </div>
                <div className="col-sm-6">
                  <label className="form-label text-secondary small">Apellidos *</label>
                  <input name="apellidos" value={form.apellidos} onChange={handleChange} className={inputClass("apellidos")} />
                  {errores.apellidos && <div className="invalid-feedback">{errores.apellidos}</div>}
                </div>
                <div className="col-sm-6">
                  <label className="form-label text-secondary small">Correo *</label>
                  <input type="email" name="correo" value={form.correo} onChange={handleChange} className={inputClass("correo")} />
                  {errores.correo && <div className="invalid-feedback">{errores.correo}</div>}
                </div>
                <div className="col-sm-6">
                  <label className="form-label text-secondary small">Teléfono</label>
                  <input name="telefono" value={form.telefono} onChange={handleChange} className="form-control bg-dark text-white border-secondary" placeholder="+56 9 xxxx xxxx" />
                </div>
              </div>
            </div>

            {/* Dirección */}
            <div className="rounded-3 p-4 mb-4" style={{ background: "#0d0d21", border: "1px solid #1E90FF22" }}>
              <h5 className="text-white fw-bold mb-4" style={{ fontFamily: "Orbitron, sans-serif", fontSize: "0.95rem" }}>
                📍 DIRECCIÓN DE ENVÍO
              </h5>
              <div className="row g-3">
                <div className="col-sm-6">
                  <label className="form-label text-secondary small">Región *</label>
                  <select name="region" value={form.region} onChange={handleChange} className={"form-select bg-dark text-white border-secondary" + (errores.region ? " is-invalid" : "")}>
                    <option value="">Selecciona una región</option>
                    {REGIONES.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                  {errores.region && <div className="invalid-feedback">{errores.region}</div>}
                </div>
                <div className="col-sm-6">
                  <label className="form-label text-secondary small">Comuna *</label>
                  <input name="comuna" value={form.comuna} onChange={handleChange} className={inputClass("comuna")} placeholder="Ej: Santiago" />
                  {errores.comuna && <div className="invalid-feedback">{errores.comuna}</div>}
                </div>
                <div className="col-12">
                  <label className="form-label text-secondary small">Dirección *</label>
                  <input name="direccion" value={form.direccion} onChange={handleChange} className={inputClass("direccion")} placeholder="Calle, número, depto..." />
                  {errores.direccion && <div className="invalid-feedback">{errores.direccion}</div>}
                </div>
              </div>
            </div>

            {/* Método de pago */}
            <div className="rounded-3 p-4" style={{ background: "#0d0d21", border: "1px solid #1E90FF22" }}>
              <h5 className="text-white fw-bold mb-4" style={{ fontFamily: "Orbitron, sans-serif", fontSize: "0.95rem" }}>
                💳 MÉTODO DE PAGO
              </h5>
              <div className="d-flex flex-wrap gap-3">
                {[["debito", "💳 Débito"], ["credito", "🏦 Crédito"], ["transferencia", "📲 Transferencia"]].map(([val, label]) => (
                  <label key={val} className="d-flex align-items-center gap-2 p-3 rounded-2"
                    style={{ background: form.metodoPago === val ? "rgba(30,144,255,0.15)" : "#05050f", border: `1px solid ${form.metodoPago === val ? "#1E90FF" : "#2a2a5a"}`, cursor: "pointer" }}>
                    <input type="radio" name="metodoPago" value={val} checked={form.metodoPago === val} onChange={handleChange} className="form-check-input" />
                    <span className="text-light">{label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Resumen del pedido */}
          <div className="col-lg-5">
            <div className="rounded-3 p-4" style={{ background: "#0d0d21", border: "1px solid #39FF1444", position: "sticky", top: 80 }}>
              <h5 className="text-white fw-bold mb-3" style={{ fontFamily: "Orbitron, sans-serif", fontSize: "0.95rem" }}>
                🛒 RESUMEN
              </h5>
              <hr style={{ borderColor: "#1E90FF22" }} />
              {items.map((item) => (
                <div key={item.codigo} className="d-flex justify-content-between mb-2">
                  <span className="text-secondary small">{item.producto.titulo} ×{item.cantidad}</span>
                  <span className="text-white small">{formatearPrecio(item.subtotal)}</span>
                </div>
              ))}
              <hr style={{ borderColor: "#1E90FF22" }} />
              <div className="d-flex justify-content-between mb-1">
                <span className="text-secondary">Envío</span>
                <span className="text-warning small">Por calcular</span>
              </div>
              <div className="d-flex justify-content-between mb-4">
                <span className="text-white fw-bold">Total</span>
                <span style={{ color: "#39FF14", fontFamily: "Orbitron, sans-serif", fontWeight: 700, fontSize: "1.2rem" }}>{totalFormateado}</span>
              </div>
              <button type="submit" disabled={procesando} className="btn w-100 fw-bold py-3"
                style={{ background: procesando ? "#333" : "#1E90FF", color: "#fff", fontSize: "1rem" }}>
                {procesando ? "⏳ Procesando..." : "Confirmar Compra →"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}