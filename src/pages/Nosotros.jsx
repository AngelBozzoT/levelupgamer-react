import { useEffect } from "react";
import imagenLevelUp from "/imagenlevelup.png"; // ← Importamos la imagen usando la infraestructura de Vite

export default function Nosotros() {
  const pilares = [
    { emoji: "🎯", titulo: "MISIÓN", desc: "Proveer el mejor hardware y periféricos para potenciar las habilidades de cada jugador.", color: "#1E90FF" },
    { emoji: "⚡", titulo: "VISIÓN", desc: "Ser el ecosistema gamer más grande y respetado de Latinoamérica.", color: "#39FF14" },
    { emoji: "👥", titulo: "COMUNIDAD", desc: "Fomentar un espacio donde los gamers puedan compartir, aprender y competir.", color: "#1E90FF" },
    { emoji: "🛡️", titulo: "CALIDAD", desc: "Solo trabajamos con marcas oficiales y ofrecemos garantía real en Chile.", color: "#ffc107" },
  ];

  return (
    <div>
      {/* Encabezado Premium Superior */}
      <div className="py-5 text-center">
        <div className="container pt-4">
          <h1 style={{ fontFamily: "Orbitron, sans-serif", fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 800, letterSpacing: 2 }}>
            <span style={{ color: "#fff" }}>SOBRE </span>
            <span style={{ color: "#39FF14", textShadow: "0 0 20px rgba(57,255,20,0.4)" }}>NOSOTROS</span>
          </h1>
          <p className="text-secondary mx-auto mt-3" style={{ maxWidth: "700px", fontSize: "1.05rem", lineHeight: 1.6 }}>
            Nacimos con una sola misión: llevar el gaming en Chile al siguiente nivel. Somos gamers, para gamers.
          </p>
        </div>
      </div>

      <div className="container pb-5">
        {/* Sección Historia + Imagen de Comunidad */}
        <div className="row align-items-center gy-5 mb-5 pb-4">
          <div className="col-md-6 text-start"> {/* Forzamos alineación limpia a la izquierda */}
            <h3 className="mb-4" style={{ fontFamily: "Orbitron, sans-serif", color: "#1E90FF", fontWeight: 700, letterSpacing: 1 }}>
              NUESTRA HISTORIA
            </h3>
            <p className="text-secondary" style={{ lineHeight: 1.9, fontSize: "0.95rem" }}>
              Level-Up Gamer es una tienda online dedicada a satisfacer las necesidades de los entusiastas de los videojuegos en Chile.
            </p>
            <p className="text-secondary" style={{ lineHeight: 1.9, fontSize: "0.95rem" }}>
              Lanzada hace dos años como respuesta a la creciente demanda durante la pandemia, Level-Up Gamer ofrece una amplia gama de productos para gamers, desde consolas y accesorios hasta computadores y sillas especializadas. Aunque no cuenta con una ubicación física, realiza despachos a todo el país.
            </p>
          </div>

          <div className="col-md-6 text-center">
            {/* Removimos el contenedor 'bg-white' para un look puramente oscuro e integrado */}
            <div 
              className="p-1 rounded-3 d-inline-block" 
              style={{ 
                background: "rgba(30,144,255,0.05)", 
                border: "1px solid rgba(30,144,255,0.2)",
                boxShadow: "0 0 30px rgba(30,144,255,0.15)", 
                maxWidth: "100%" 
              }}
            >
              <img 
                src={imagenLevelUp} // ← Ahora usa la variable inyectada dinámicamente
                alt="Comunidad Level-Up Gamer" 
                className="img-fluid rounded-2"
                style={{ maxHeight: "380px", width: "100%", objectFit: "cover" }}
              />
            </div>
          </div>
        </div>

        {/* Separador Visual Discreto */}
        <hr style={{ borderColor: "rgba(30,144,255,0.1)", margin: "3rem 0" }} />

        {/* Matriz Inferior de Pilares de Negocio */}
        <div className="row g-4 mb-5 pb-5">
          {pilares.map((p) => (
            <div key={p.titulo} className="col-sm-6 col-lg-3">
              <div 
                className="rounded-3 p-4 text-center h-100 d-flex flex-column align-items-center justify-content-center" 
                style={{ 
                  background: "rgba(10, 10, 22, 0.4)", 
                  border: `1px solid rgba(30,144,255,0.15)`,
                  transition: "all 0.3s"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = p.color;
                  e.currentTarget.style.boxShadow = `0 0 15px ${p.color}15`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(30,144,255,0.15)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div className="p-2 rounded-circle mb-3 d-flex align-items-center justify-content-center" style={{ background: "rgba(255,255,255,0.03)", width: "60px", height: "60px", fontSize: "2rem" }}>
                  {p.emoji}
                </div>
                <h5 style={{ color: "#fff", fontFamily: "Orbitron, sans-serif", fontSize: "1rem", fontWeight: 700, letterSpacing: 1, marginBottom: "12px" }}>
                  {p.titulo}
                </h5>
                <p className="text-secondary small mb-0" style={{ lineHeight: 1.6 }}>
                  {p.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Separador Visual para el Mapa */}
        <hr style={{ borderColor: "rgba(30,144,255,0.1)", margin: "3rem 0" }} />

        {/* ── 🗺️ NUEVA SECCIÓN: MAPA DE EVENTOS NACIONALES ── */}
        <div className="text-center mb-4">
          <h3 style={{ fontFamily: "Orbitron, sans-serif", color: "#1E90FF", fontWeight: 700, letterSpacing: 1 }}>
            🗺️ MAPA DE EVENTOS NACIONALES
          </h3>
          <p className="text-secondary mx-auto small" style={{ maxWidth: "800px" }}>
            Asiste a los eventos oficiales de videojuegos en Chile, escanea tu código en el stand de <span style={{ color: "#39FF14", fontWeight: 600 }}>Level-Up Gamer</span> y suma puntos para tu cuenta.
          </p>
        </div>

        {/* Contenedor del Mapa Embebido */}
        <div className="mb-4 rounded-3 p-1" style={{ background: "transparent", border: "1px solid #1E90FF55", boxShadow: "0 0 20px rgba(30,144,255,0.1)" }}>
          <iframe 
            src="https://maps.google.com/maps?q=Av.%20Providencia%201234,%20Providencia,%20Santiago&t=&z=15&ie=UTF8&iwloc=&output=embed" 
            width="100%" 
            height="420" 
            style={{ border: 0, borderRadius: "6px", display: "block" }} 
            allowFullScreen="" 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>

        {/* Tarjetas de Eventos */}
        <div className="row g-3">
          {/* Evento 1: FestiGame */}
          <div className="col-md-6 text-start">
            <div className="rounded-3 p-3 h-100" style={{ background: "rgba(10, 10, 22, 0.6)", border: "1px solid rgba(255,255,255,0.05)" }}>
              <h5 style={{ color: "#39FF14", fontSize: "0.95rem", fontWeight: 700, fontFamily: "Orbitron, sans-serif" }}>
                🎮 FestiGame 2026
              </h5>
              <p className="text-light mb-1 small" style={{ fontSize: "0.85rem" }}>Espacio Riesco, Santiago</p>
              <span className="text-info fw-bold" style={{ fontSize: "0.75rem" }}>Recompensa: +500 Pts LevelUp</span>
            </div>
          </div>

          {/* Evento 2: Torneo Duoc/Inacap */}
          <div className="col-md-6 text-start">
            <div className="rounded-3 p-3 h-100" style={{ background: "rgba(10, 10, 22, 0.6)", border: "1px solid rgba(255,255,255,0.05)" }}>
              <h5 style={{ color: "#39FF14", fontSize: "0.95rem", fontWeight: 700, fontFamily: "Orbitron, sans-serif" }}>
                🔥 Torneo de Esports Duoc/Inacap
              </h5>
              <p className="text-light mb-1 small" style={{ fontSize: "0.85rem" }}>Sede Providencia (Online/Presencial)</p>
              <span className="text-info fw-bold" style={{ fontSize: "0.75rem" }}>Recompensa: +300 Pts LevelUp</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}