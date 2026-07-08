import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ARTICULOS_BLOG } from "./Blogs.jsx";

export default function BlogDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [art, setArt] = useState(null);

  useEffect(() => {
    const encontrado = ARTICULOS_BLOG.find((a) => a.id === id);
    if (!encontrado) navigate("/blogs", { replace: true });
    else setArt(encontrado);
  }, [id, navigate]);

  if (!art) return <div className="container py-5 text-center text-secondary">Cargando...</div>;

  return (
    <div className="container py-5" style={{ maxWidth: 820 }}>
      {/* Volver */}
      <Link to="/blogs" className="btn btn-outline-secondary btn-sm mb-4">← Volver al Blog</Link>

      {/* Imagen hero */}
      <div className="rounded-3 overflow-hidden mb-4" style={{ maxHeight: 380 }}>
        <img
          src={art.imagen}
          alt={art.titulo}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          onError={(e) => { e.target.src = "https://via.placeholder.com/800x380?text=Level-Up+Blog"; }}
        />
      </div>

      {/* Meta */}
      <div className="d-flex align-items-center gap-3 mb-3">
        <span
          className="badge"
          style={{
            background: "transparent",
            border: `1px solid ${art.colorCategoria}`,
            color: art.colorCategoria,
            fontSize: "0.75rem",
          }}
        >
          {art.categoria}
        </span>
        <span className="text-secondary small">{art.fecha}</span>
      </div>

      {/* Título */}
      <h1
        style={{
          fontFamily: "Orbitron, sans-serif",
          color: "#fff",
          fontSize: "clamp(1.4rem, 3vw, 2rem)",
          lineHeight: 1.3,
          marginBottom: 24,
        }}
      >
        {art.titulo}
      </h1>

      {/* Resumen destacado */}
      <p
        className="lead mb-5"
        style={{ color: "#aaa", borderLeft: `3px solid ${art.colorCategoria}`, paddingLeft: 16 }}
      >
        {art.resumen}
      </p>

      {/* Contenido por secciones */}
      {art.contenido.map((seccion, i) => (
        <div key={i} className="mb-4">
          <h2 style={{ color: art.colorCategoria, fontSize: "1.15rem", fontFamily: "Orbitron, sans-serif", marginBottom: 12 }}>
            {seccion.subtitulo}
          </h2>
          <p style={{ color: "#cfcfe8", lineHeight: 1.85, fontSize: "1.02rem" }}>{seccion.texto}</p>
        </div>
      ))}

      {/* Footer del artículo */}
      <hr style={{ borderColor: "#1E90FF22", marginTop: 40 }} />
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mt-4">
        <Link to="/blogs" className="text-secondary small text-decoration-none">← Todos los artículos</Link>
        <span className="badge bg-secondary">Level-Up Gamer Blog</span>
      </div>
    </div>
  );
}
