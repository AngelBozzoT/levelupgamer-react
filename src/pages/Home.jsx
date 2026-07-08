import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { ProductosDB } from "../data/db.js";
import ProductCard from "../components/ui/ProductCard.jsx";

export default function Home() {
  const [destacados, setDestacados] = useState([]);

  useEffect(() => {
    setDestacados(ProductosDB.listar().filter((p) => p.destacado));
  }, []);

  return (
    <div>
      {/* ── 🕹️ HERO BANNER REPARADO CON FONDO REAL ── */}
      <div 
        className="hero-gamer-bg" 
        style={{ 
          backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.75)), url('https://static.vecteezy.com/system/resources/thumbnails/025/533/976/small_2x/gamer-ergonomic-chair-with-remote-controller-car-wireless-vr-and-entertainment-gadget-in-neon-light-room-ai-generated-photo.jpeg')",
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          minHeight: "70vh",
          display: "flex",
          alignItems: "center"
        }}
      >
        <div className="container">
          <div className="row align-items-center">
            
            {/* Columna de Texto Principal */}
            <div className="col-md-10 col-lg-8 text-start animate-fade-up">
              <span className="badge-neon-blue px-3 py-1 rounded mb-3 d-inline-block" style={{ fontSize: "0.75rem", fontFamily: "Orbitron, sans-serif", letterSpacing: "1px" }}>
                NEW LEVEL UNLOCKED
              </span>
              
              <h1 style={{ fontFamily: "Orbitron, sans-serif", fontSize: "clamp(2.5rem, 6vw, 4rem)", fontWeight: 900, lineHeight: 1.1, marginBottom: "20px" }}>
                <span style={{ color: "#fff" }}>SUBE DE NIVEL </span><br />
                <span style={{ color: "#39FF14", textShadow: "0 0 20px rgba(57,255,20,0.4)" }}>TU SETUP</span>
              </h1>
              
              <p className="text-secondary mb-4 lead" style={{ fontSize: "1.1rem", maxWidth: "550px", lineHeight: 1.6 }}>
                La tienda definitiva para gamers en Chile. Encuentra el hardware más potente, accesorios premium y únete a la comunidad.
              </p>
              
              <div className="d-flex gap-3 flex-wrap">
                <Link to="/productos" className="btn btn-neon-blue px-4 py-2.5">
                  EXPLORAR CATÁLOGO
                </Link>
                <Link to="/registro" className="btn btn-neon-green px-4 py-2.5">
                  ÚNETE AHORA
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── PRODUCTOS DESTACADOS ── */}
      <section className="py-5" style={{ background: "#000000" }}>
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 style={{ fontFamily: "Orbitron, sans-serif", color: "#39FF14" }}>⭐ DESTACADOS</h2>
            <Link to="/productos" className="btn btn-outline-light btn-sm">Ver todos →</Link>
          </div>
          {destacados.length === 0 ? (
            <p className="text-secondary text-center py-4">Cargando productos...</p>
          ) : (
            <div className="row g-4">
              {destacados.map((p) => (
                <div key={p.codigo} className="col-sm-6 col-md-4 col-lg-3">
                  <ProductCard producto={p} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── 🚀 NUEVA SECCIÓN: PRÓXIMAMENTE / PRÓXIMOS LANZAMIENTOS ── */}
      <section className="py-5" style={{ background: "#000000" }}>
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="fw-bold mb-0" style={{ fontFamily: "Orbitron, sans-serif", color: "#39FF14", fontSize: "1.5rem" }}>
              🚀 PRÓXIMOS LANZAMIENTOS
            </h2>
            <span className="badge-neon-green px-3 py-1 rounded-pill small" style={{ fontSize: "0.75rem", fontFamily: "Orbitron, sans-serif" }}>
              PRE-ORDERS 2026
            </span>
          </div>
          
          <p className="text-secondary mb-5" style={{ marginTop: "-10px" }}>
            Asegura tus coleccionables antes de que se agoten. Próximamente disponibles en Level-Up Gamer.
          </p>

          <div className="row g-4">
            {/* Ítem 1: Cartas Pokémon */}
            <div className="col-sm-6 col-md-4 col-lg-3">
              <div className="product-card p-3 h-100 text-start" style={{ background: "#000000", border: "1px solid rgba(57, 255, 20, 0.15)" }}>
                <div className="position-relative text-center bg-white rounded-3 p-2 mb-3" style={{ height: "200px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <img 
                    src="https://dojiw2m9tvv09.cloudfront.net/76324/product/upc28995.JPG" 
                    alt="Pokémon TCG Elite Trainer Box" 
                    className="img-fluid" 
                    style={{ maxHeight: "180px", objectFit: "contain" }}
                  />
                  <span className="position-absolute top-0 start-0 badge bg-danger m-2" style={{ fontFamily: "Orbitron, sans-serif", fontSize: "0.65rem" }}>
                    TCG JAPAN
                  </span>
                </div>
                <span className="text-info" style={{ fontSize: "0.75rem", fontWeight: 600 }}>Coleccionables</span>
                <h5 className="text-white my-1" style={{ fontSize: "1rem", fontFamily: "sans-serif", fontWeight: 600 }}>
                  Pokémon TCG: Booster Box Premium
                </h5>
                <p className="text-warning small mb-3" style={{ fontFamily: "Orbitron, sans-serif" }}>Próximamente precio</p>
                <button className="btn btn-sm btn-outline-success w-100 fw-bold" style={{ fontSize: "0.75rem" }} disabled>
                  🔔 Notificarme al llegar
                </button>
              </div>
            </div>

            {/* Ítem 2: Figura Anime Collectible */}
            <div className="col-sm-6 col-md-4 col-lg-3">
              <div className="product-card p-3 h-100 text-start" style={{ background: "#000000", border: "1px solid rgba(57, 255, 20, 0.15)" }}>
                <div className="position-relative text-center bg-white rounded-3 p-2 mb-3" style={{ height: "200px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <img 
                    src="https://ironstudios.com.br/cdn/shop/files/7694980.jpg?v=1767631932" 
                    alt="Anime Action Figure" 
                    className="img-fluid" 
                    style={{ maxHeight: "180px", objectFit: "contain" }}
                  />
                  <span className="position-absolute top-0 start-0 badge bg-warning text-dark m-2" style={{ fontFamily: "Orbitron, sans-serif", fontSize: "0.65rem" }}>
                    LIMITADO
                  </span>
                </div>
                <span className="text-info" style={{ fontSize: "0.75rem", fontWeight: 600 }}>Figuras de Acción</span>
                <h5 className="text-white my-1" style={{ fontSize: "1rem", fontFamily: "sans-serif", fontWeight: 600 }}>
                  Estatua Coleccionable Shonen Premium
                </h5>
                <p className="text-warning small mb-3" style={{ fontFamily: "Orbitron, sans-serif" }}>Próximamente precio</p>
                <button className="btn btn-sm btn-outline-success w-100 fw-bold" style={{ fontSize: "0.75rem" }} disabled>
                  🔔 Notificarme al llegar
                </button>
              </div>
            </div>

            {/* Ítem 3: Periférico Edición Especial */}
            <div className="col-sm-6 col-md-4 col-lg-3">
              <div className="product-card p-3 h-100 text-start" style={{ background: "#000000", border: "1px solid rgba(57, 255, 20, 0.15)" }}>
                <div className="position-relative text-center bg-white rounded-3 p-2 mb-3" style={{ height: "200px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <img 
                    src="https://m.media-amazon.com/images/I/61PcirmA4DL.jpg" 
                    alt="Mouse Gamer Edición Especial" 
                    className="img-fluid" 
                    style={{ maxHeight: "180px", objectFit: "contain" }}
                  />
                  <span className="position-absolute top-0 start-0 badge bg-info m-2" style={{ fontFamily: "Orbitron, sans-serif", fontSize: "0.65rem" }}>
                    EXCLUSIVO
                  </span>
                </div>
                <span className="text-info" style={{ fontSize: "0.75rem", fontWeight: 600 }}>Periféricos</span>
                <h5 className="text-white my-1" style={{ fontSize: "1rem", fontFamily: "sans-serif", fontWeight: 600 }}>
                  Mouse Pro Wireless — Cyberpunk Edition
                </h5>
                <p className="text-warning small mb-3" style={{ fontFamily: "Orbitron, sans-serif" }}>Próximamente precio</p>
                <button className="btn btn-sm btn-outline-success w-100 fw-bold" style={{ fontSize: "0.75rem" }} disabled>
                  🔔 Notificarme al llegar
                </button>
              </div>
            </div>

            {/* Ítem 4: Consola Edición Especial Real */}
            <div className="col-sm-6 col-md-4 col-lg-3">
              <div className="product-card p-3 h-100 text-start" style={{ background: "#000000", border: "1px solid rgba(57, 255, 20, 0.15)" }}>
                <div className="position-relative text-center bg-white rounded-3 p-2 mb-3" style={{ height: "200px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <img 
                    src="https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcR9Cs8_32lexlj7RXcE93zL0NppTmZR2_PqTPgfJOLZ1sg4LH-42vSlPitfpcig638kenK2AwwKOOnWxKKXqTSx03Np6NABlof8Qd3mt--3QUzI0ll2Ek-fAg" 
                    alt="Nintendo Switch OLED Edición Pokémon" 
                    className="img-fluid" 
                    style={{ maxHeight: "180px", objectFit: "contain" }}
                  />
                  <span className="position-absolute top-0 start-0 badge m-2" style={{ background: "#9333ea", fontFamily: "Orbitron, sans-serif", fontSize: "0.65rem" }}>
                    PRE-ORDER
                  </span>
                </div>
                <span className="text-info" style={{ fontSize: "0.75rem", fontWeight: 600 }}>Consolas</span>
                <h5 className="text-white my-1" style={{ fontSize: "1rem", fontFamily: "sans-serif", fontWeight: 600 }}>
                  Nintendo Switch OLED — Pokémon Scarlet & Violet Ed.
                </h5>
                <p className="text-warning small mb-3" style={{ fontFamily: "Orbitron, sans-serif" }}>Próximamente precio</p>
                <button className="btn btn-sm btn-outline-success w-100 fw-bold" style={{ fontSize: "0.75rem" }} disabled>
                  🔔 Notificarme al llegar
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── BANNER OFERTAS ── */}
      <section className="py-5" style={{ background: "linear-gradient(135deg, #1a0a00, #0d0d21)" }}>
        <div className="container text-center">
          <h2 style={{ fontFamily: "Orbitron, sans-serif", color: "#ffc107", fontSize: "clamp(1.5rem,4vw,2.5rem)" }}>
            🔥 OFERTAS ESPECIALES
          </h2>
          <p className="text-secondary mb-4">Descuentos de hasta 20% en productos seleccionados</p>
          <Link to="/ofertas" className="btn btn-warning btn-lg px-5 fw-bold">
            Ver Ofertas
          </Link>
        </div>
      </section>
    </div>
  );
}