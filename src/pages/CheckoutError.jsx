import { useNavigate } from "react-router-dom";

export default function CheckoutError() {
  const navigate = useNavigate();

  return (
    <div className="container d-flex flex-column align-items-center justify-content-center text-center animate-fade-in" style={{ minHeight: "75vh" }}>
      
      {/* Icono Neón de Advertencia */}
      <div className="mb-4" style={{ fontSize: "4.5rem", filter: "drop-shadow(0 0 15px #ff4444)" }}>
        ❌
      </div>

      {/* Títulos de Error de Negocio */}
      <h1 style={{ fontFamily: "Orbitron, sans-serif", color: "#ff4444", fontWeight: 700, letterSpacing: "1px" }} className="mb-2">
        TRANSACCIÓN RECHAZADA
      </h1>
      
      <p className="text-light px-3 mb-4" style={{ maxWidth: "500px", fontSize: "0.95rem" }}>
        No se pudo procesar la compra en este momento. Esto puede deberse a fondos insuficientes, un problema de conexión con el proveedor de pagos o datos del formulario inválidos.
      </p>

      {/* Tarjeta de Detalles Técnicos Simulados para QA */}
      <div className="p-3 rounded-3 mb-4 text-start" style={{ background: "#1a0808", border: "1px solid #ff444433", maxWidth: "450px", width: "100%" }}>
        <small className="d-block text-secondary" style={{ fontFamily: "monospace", fontSize: "0.75rem" }}>
          <span className="text-danger fw-bold">CÓDIGO_ERROR:</span> LUG_PAYMENT_REJECTED_402<br />
          <span className="text-danger fw-bold">ESTADO:</span> Transacción fallida (Simulación localStorage)<br />
          <span className="text-danger fw-bold">ACCIÓN:</span> Por favor, revisa los datos de facturación e intenta nuevamente.
        </small>
      </div>

      {/* Botones de Redirección Funcionales */}
      <div className="d-flex flex-wrap gap-3 justify-content-center">
        <button 
          onClick={() => navigate("/carrito")} 
          className="btn px-4 py-2 text-dark"
          style={{ background: "#ffc107", fontFamily: "Orbitron, sans-serif", fontWeight: 700, borderRadius: "4px" }}
        >
          🔄 Volver al Carrito
        </button>
        
        <button 
          onClick={() => navigate("/")} 
          className="btn px-4 py-2 btn-outline-light"
          style={{ fontFamily: "Orbitron, sans-serif", fontWeight: 600, borderRadius: "4px" }}
        >
          🏠 Ir al Home
        </button>
      </div>

    </div>
  );
}