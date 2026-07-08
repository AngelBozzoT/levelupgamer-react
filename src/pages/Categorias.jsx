import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { ProductosDB } from "../data/db.js";
import { CATEGORIAS } from "../data/productos.js";
import ProductCard from "../components/ui/ProductCard.jsx";

const EMOJIS = {
  "Juegos de Mesa": "🎲",
  "Accesorios": "🎧",
  "Consolas": "🕹️",
  "Computadores Gamers": "💻",
  "Sillas Gamers": "🪑",
  "Mouse": "🖱️",
  "Mousepad": "⬛",
  "Poleras Personalizadas": "👕",
};

export default function Categorias() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [todos, setTodos] = useState([]);
  const categoriaActiva = searchParams.get("cat") || "";

  useEffect(() => { setTodos(ProductosDB.listar()); }, []);

  const productosFiltrados = categoriaActiva
    ? todos.filter((p) => p.categoria === categoriaActiva)
    : todos;

  // Manejador inteligente: si hace clic en la activa, se deselecciona (vuelve a Mostrar Todas)
  const handleCategoriaClick = (cat) => {
    if (categoriaActiva === cat) {
      setSearchParams({});
    } else {
      setSearchParams({ cat });
    }
  };

  return (
    <div className="container py-5">
      <h1 className="fw-bold mb-1" style={{ fontFamily: "Orbitron, sans-serif", color: "#1E90FF" }}>
        CATEGORÍAS
      </h1>
      <p className="text-secondary mb-4">
        {!categoriaActiva 
          ? `Mostrando todos los productos (${todos.length})` 
          : "Explora nuestra selección por tipo de producto"}
      </p>

      {/* ── 🚀 BANNER VISUAL DE ICONOS GRANDES ── */}
      <div className="p-4 mb-5 rounded-3" style={{ background: "rgba(13, 13, 33, 0.4)", border: "1px solid rgba(30,144,255,0.1)" }}>
        <div className="row g-3 justify-content-center">
          {CATEGORIAS.map((cat) => {
            const esSeleccionado = categoriaActiva === cat;
            const count = todos.filter((p) => p.categoria === cat).length;

            return (
              <div key={cat} className="col-6 col-sm-4 col-md-3 col-lg-2">
                <button
                  onClick={() => handleCategoriaClick(cat)}
                  className="w-100 text-decoration-none border-0 text-center p-3 rounded-3"
                  style={{ 
                    background: "#0d0d21", 
                    border: esSeleccionado ? "1px solid #39FF14" : "1px solid #1E90FF22", 
                    boxShadow: esSeleccionado ? "0 0 15px rgba(57,255,20,0.2)" : "none",
                    transition: "all 0.3s",
                    cursor: "pointer"
                  }}
                  onMouseEnter={(e) => { 
                    if (!esSeleccionado) {
                      e.currentTarget.style.borderColor = "#39FF14"; 
                      e.currentTarget.style.boxShadow = "0 0 15px rgba(57,255,20,0.2)"; 
                    }
                  }}
                  onMouseLeave={(e) => { 
                    if (!esSeleccionado) {
                      e.currentTarget.style.borderColor = "#1E90FF22"; 
                      e.currentTarget.style.boxShadow = "none"; 
                    }
                  }}
                >
                  <div style={{ fontSize: "2rem" }}>{EMOJIS[cat] || "📦"}</div>
                  <p className="mb-1 mt-2 text-light" style={{ fontSize: "0.75rem", fontWeight: 600 }}>{cat}</p>
                  <span className="text-secondary" style={{ fontSize: "0.65rem" }}>({count})</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Título de sección activa */}
      {categoriaActiva && (
        <h2 className="mb-4" style={{ color: "#fff", fontFamily: "Orbitron, sans-serif", fontSize: "1.2rem" }}>
          {EMOJIS[categoriaActiva] || "📦"} {categoriaActiva}
          <span className="text-secondary ms-2" style={{ fontSize: "1rem", fontFamily: "sans-serif" }}>
            — {productosFiltrados.length} producto{productosFiltrados.length !== 1 ? "s" : ""}
          </span>
        </h2>
      )}

      {/* Grid de productos */}
      {productosFiltrados.length === 0 ? (
        <div className="text-center py-5">
          <p style={{ fontSize: "3rem" }}>📦</p>
          <p className="text-secondary">No hay productos en esta categoría.</p>
        </div>
      ) : (
        <div className="row g-4">
          {productosFiltrados.map((p) => (
            <div key={p.codigo} className="col-sm-6 col-md-4 col-lg-3">
              <ProductCard producto={p} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}