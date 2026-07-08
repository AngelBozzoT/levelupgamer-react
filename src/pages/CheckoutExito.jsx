import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { PedidosDB } from "../data/db.js";
import { formatearPrecio } from "../data/productos.js";

export default function CheckoutExito() {
  const [params] = useSearchParams();
  const pedido = PedidosDB.buscarPorId(params.get("id"));
  
  // Estados para simular el envío del correo electrónico
  const [enviandoCorreo, setEnviandoCorreo] = useState(false);
  const [correoEnviado, setCorreoEnviado] = useState(false);

  // 🖨️ Función real para imprimir boleta o guardarla como PDF nativo
  const handleImprimir = () => {
    window.print();
  };

  // 📧 Función simulada para envío interactivo de correo
  const handleEnviarCorreo = () => {
    if (!pedido?.cliente?.correo) return;
    
    setEnviandoCorreo(true);
    setTimeout(() => {
      setEnviandoCorreo(false);
      setCorreoEnviado(true);
      
      // Desaparece el mensaje de éxito después de 5 segundos
      setTimeout(() => setCorreoEnviado(false), 5000);
    }, 2000);
  };

  return (
    <div className="container py-5 text-center">
      <div style={{ maxWidth: 600, margin: "0 auto" }}>
        {/* Ícono animado */}
        <div style={{ fontSize: "5rem", marginBottom: 16, animation: "pulse 1s ease" }}>🎉</div>

        <h1 style={{ fontFamily: "Orbitron, sans-serif", color: "#39FF14", fontSize: "clamp(1.5rem,4vw,2.5rem)" }}>
          ¡COMPRA EXITOSA!
        </h1>
        <p className="text-secondary mb-4 lead">
          Tu pedido ha sido recibido y está siendo procesado.
        </p>

        {/* Notificación interactiva del correo */}
        {correoEnviado && (
          <div className="alert alert-success text-start mb-4 py-2 small animate__animated animate__fadeIn" style={{ border: "1px solid #39FF14" }}>
            ✅ ¡Boleta digital enviada con éxito a <strong>{pedido?.cliente?.correo}</strong>! Revisa tu bandeja de entrada.
          </div>
        )}

        {pedido && (
          <>
            {/* Agregamos una ID para aislar la boleta si usas hojas de estilo de impresión */}
            <div id="boleta-imprimible" className="rounded-3 p-4 mb-4 text-start" style={{ background: "#0d0d21", border: "1px solid #39FF1444" }}>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-secondary">N° Pedido</span>
                <span className="text-warning fw-bold" style={{ fontFamily: "Orbitron, sans-serif", fontSize: "0.85rem" }}>{pedido.id}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-secondary">Fecha</span>
                <span className="text-white">{new Date(pedido.fecha).toLocaleDateString("es-CL")}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-secondary">Estado</span>
                <span className="badge bg-success">{pedido.estado}</span>
              </div>
              <hr style={{ borderColor: "#1E90FF22" }} />
              <h6 className="text-secondary mb-3" style={{ fontSize: "0.8rem" }}>PRODUCTOS</h6>
              {pedido.items.map((item) => (
                <div key={item.codigo} className="d-flex justify-content-between mb-2">
                  <span className="text-light small">{item.titulo} ×{item.cantidad}</span>
                  <span className="text-white small">{formatearPrecio(item.precio * item.cantidad)}</span>
                </div>
              ))}
              <hr style={{ borderColor: "#1E90FF22" }} />
              <div className="d-flex justify-content-between">
                <span className="text-white fw-bold">Total pagado</span>
                <span style={{ color: "#39FF14", fontFamily: "Orbitron, sans-serif", fontWeight: 700 }}>{formatearPrecio(pedido.total)}</span>
              </div>
            </div>

            {/* ── 🔥 BOTONES ADICIONALES DE ACCIÓN EXIGIDOS ── */}
            <div className="d-flex gap-2 justify-content-center mb-4">
              <button 
                onClick={handleImprimir} 
                className="btn btn-sm btn-danger px-3"
                style={{ fontSize: "0.8rem", fontWeight: 600 }}
              >
                📄 Imprimir boleta en PDF
              </button>
              <button 
                onClick={handleEnviarCorreo} 
                disabled={enviandoCorreo}
                className="btn btn-sm btn-success px-3"
                style={{ fontSize: "0.8rem", fontWeight: 600 }}
              >
                {enviandoCorreo ? "⏳ Enviando..." : "✉️ Enviar boleta por email"}
              </button>
            </div>
          </>
        )}

        <p className="text-secondary small mb-4">
          📧 Recibirás un correo de confirmación en breve.
        </p>
        
        <div className="d-flex gap-3 justify-content-center flex-wrap">
          <Link to="/" className="btn btn-lg" style={{ background: "#1E90FF", color: "#fff", fontWeight: 700 }}>
            Volver al Home
          </Link>
          <Link to="/productos" className="btn btn-lg btn-outline-light">
            Seguir comprando
          </Link>
        </div>
      </div>
    </div>
  );
}