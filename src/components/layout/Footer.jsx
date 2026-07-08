import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-auto py-5" style={{ background: "#05050f", borderTop: "1px solid #1E90FF33" }}>
      <div className="container">
        <div className="row gy-4">
          <div className="col-md-4">
            <h5 style={{ fontFamily: "Orbitron, sans-serif", color: "#39FF14" }}>⚡ LEVEL-UP GAMER</h5>
            <p className="text-secondary small">Tu destino gamer en Chile. Hardware, accesorios y cultura gaming al siguiente nivel.</p>
          </div>
          <div className="col-md-4">
            <h6 className="text-light fw-bold mb-3">Navegación</h6>
            <ul className="list-unstyled d-flex flex-column gap-1">
              {[["/ ", "Home"], ["/productos", "Productos"], ["/categorias", "Categorías"], ["/ofertas", "Ofertas"], ["/nosotros", "Nosotros"], ["/blogs", "Blog"], ["/contacto", "Contacto"]].map(([to, label]) => (
                <li key={to}><Link to={to} className="text-secondary text-decoration-none small footer-link">{label}</Link></li>
              ))}
            </ul>
          </div>
          <div className="col-md-4">
            <h6 className="text-light fw-bold mb-3">Contacto</h6>
            <p className="text-secondary small mb-1">📍 Santiago, Chile</p>
            <p className="text-secondary small mb-1">📧 contacto@levelupgamer.cl</p>
            <p className="text-secondary small">📞 +56 2 2345 6789</p>
          </div>
        </div>
        <hr style={{ borderColor: "#1E90FF33" }} />
        <p className="text-secondary text-center small mb-0">
          © 2026 Level-Up Gamer · Todos los derechos reservados · Proyecto Académico TI3V31
        </p>
      </div>
    </footer>
  );
}
