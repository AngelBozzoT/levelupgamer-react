import { Link, NavLink, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import logoGamer from "/Logo.png"; // ← Ya lo importas bien acá

export default function Navbar() {
  const { cantidadTotal } = useCart();
  const { usuario, logout, esAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navLinkClass = ({ isActive }) =>
    "nav-link fw-semibold" + (isActive ? " active text-warning" : " text-light");

  return (
    <nav className="navbar navbar-expand-lg navbar-dark sticky-top" style={{ background: "rgba(5,5,15,0.97)", borderBottom: "1px solid #1E90FF33" }}>
      <div className="container">
        {/* ── LOGO CON RUTA AUTOMATIZADA POR VITE ── */}
        <Link to="/" className="navbar-brand d-flex align-items-center gap-2">
          <img 
            src={logoGamer} // ← Cambiado de "/Logo.png" a {logoGamer}
            alt="Level-Up Gamer Logo" 
            style={{ height: "40px", width: "auto" }}
          />
          <span style={{ fontFamily: "Orbitron, sans-serif", color: "#39FF14", fontSize: "1.1rem", letterSpacing: 2 }}>
            LEVEL-UP GAMER
          </span>
        </Link>

        {/* Hamburguesa */}
        <button className="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navMain">
          <span className="navbar-toggler-icon" />
        </button>

        {/* Links */}
        <div className="collapse navbar-collapse" id="navMain">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 gap-1">
            <li className="nav-item"><NavLink to="/" end className={navLinkClass}>Home</NavLink></li>
            <li className="nav-item"><NavLink to="/productos" className={navLinkClass}>Productos</NavLink></li>
            <li className="nav-item"><NavLink to="/ofertas" className={navLinkClass}>Ofertas</NavLink></li>
            <li className="nav-item"><NavLink to="/nosotros" className={navLinkClass}>Nosotros</NavLink></li>
            <li className="nav-item"><NavLink to="/blogs" className={navLinkClass}>Blog</NavLink></li>
            <li className="nav-item"><NavLink to="/contacto" className={navLinkClass}>Contacto</NavLink></li>
            
            {/* ⚙️ Acceso directo visible en el menú principal si eres Admin */}
            {esAdmin && (
              <li className="nav-item">
                <NavLink to="/admin" className="nav-link fw-semibold text-info">⚙️ Admin</NavLink>
              </li>
            )}
          </ul>

          {/* Botones lado derecho */}
          <div className="d-flex align-items-center gap-2 flex-wrap">
            {/* Carrito */}
            <Link to="/carrito" className="btn btn-outline-light btn-sm position-relative">
              🛒
              {cantidadTotal > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning text-dark">
                  {cantidadTotal}
                </span>
              )}
            </Link>

            {usuario ? (
              <div className="dropdown">
                <button className="btn btn-outline-warning btn-sm dropdown-toggle" data-bs-toggle="dropdown">
                  👤 {usuario.nombre}
                </button>
                <ul className="dropdown-menu dropdown-menu-dark dropdown-menu-end">
                  {esAdmin && (
                    <li><Link className="dropdown-item" to="/admin">⚙️ Panel Admin</Link></li>
                  )}
                  <li><hr className="dropdown-divider" /></li>
                  <li><button className="dropdown-item text-danger" onClick={handleLogout}>Cerrar Sesión</button></li>
                </ul>
              </div>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline-info btn-sm">Ingresar</Link>
                <Link to="/registro" className="btn btn-sm" style={{ background: "#39FF14", color: "#000", fontWeight: 700 }}>Registrarse</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}