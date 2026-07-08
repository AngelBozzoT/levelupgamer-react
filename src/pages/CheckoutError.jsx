import { Link } from "react-router-dom";

export default function CheckoutError() {
  return (
    <div className="container py-5 text-center">
      <div style={{ maxWidth: 600, margin: "0 auto" }}>
        <div style={{ fontSize: "5rem", marginBottom: 16 }}>❌</div>
        <h1 style={{ fontFamily: "Orbitron, sans-serif", color: "#ff4444", fontSize: "clamp(1.5rem,4vw,2.5rem)", textShadow: "0 0 15px rgba(255,68,68,0.3)" }}>
          ERROR AL PROCESAR EL PAGO
        </h1>
        <p className="text-secondary mb-4 lead" style={{ fontSize: "0.95rem" }}>
          No pudimos completar tu compra. Tu carrito sigue intacto.
        </p>

        <div className="rounded-3 p-4 mb-4" style={{ background: "rgba(26, 8, 8, 0.5)", border: "1px solid rgba(255, 68, 68, 0.2)" }}>
          <p className="text-secondary mb-0 small" style={{ lineHeight: 1.7 }}>
            🔄 Posibles causas: fondos insuficientes, error de red o tarjeta rechazada.<br />
            Intenta de nuevo o usa otro método de pago.
          </p>
        </div>

        <div className="d-flex gap-3 justify-content-center flex-wrap">
          <Link 
            to="/checkout" 
            className="btn px-4 py-2" 
            style={{ 
              background: "transparent", 
              border: "2px solid #ff4444", 
              color: "#ff4444", 
              fontWeight: 700,
              fontSize: "0.9rem",
              transition: "all 0.3s"
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#ff4444"; e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#ff4444"; }}
          >
            Intentar de nuevo
          </Link>
          <Link 
            to="/carrito" 
            className="btn px-4 py-2 btn-outline-secondary text-light"
            style={{ fontSize: "0.9rem" }}
          >
            Revisar Carrito
          </Link>
        </div>
      </div>
    </div>
  );
}