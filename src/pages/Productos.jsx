import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { ProductosDB } from "../data/db.js";
import { CategoriasDB } from "../data/db.js";
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
  "TCG": "🃏"
};

export default function Productos() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [todos, setTodos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [orden, setOrden] = useState("");
  const [categorias, setCategorias] = useState([]);

  // Capturamos la categoría activa desde la URL
  const categoriaActiva = searchParams.get("cat") || "";

  useEffect(() => {
    setTodos(ProductosDB.listar());
    setCategorias(CategoriasDB.listar()); // ← Trae la lista real actualizada con TCG
  }, []);

  // 1. Filtrar los productos dinámicamente
  let productosFiltrados = todos.filter((p) => {
    const coincideBusqueda = p.titulo.toLowerCase().includes(busqueda.toLowerCase());
    const coincideCategoria = categoriaActiva ? p.categoria === categoriaActiva : true;
    return coincideBusqueda && coincideCategoria;
  });

  // 2. Ordenar si es necesario
  if (orden === "precio-asc") {
    productosFiltrados.sort((a, b) => a.precio - b.precio);
  } else if (orden === "precio-desc") {
    productosFiltrados.sort((a, b) => b.precio - a.precio);
  }

  const handleCategoriaClick = (cat) => {
    if (cat === "Todas" || categoriaActiva === cat) {
      setSearchParams({}); // Limpia el filtro y muestra todo
    } else {
      setSearchParams({ cat });
    }
  };

  return (
    <div className="container py-5 animate-fade-in">
      <h1 className="fw-bold mb-1" style={{ fontFamily: "Orbitron, sans-serif", color: "#1E90FF" }}>
        CATÁLOGO DE PRODUCTOS
      </h1>
      <p className="text-secondary mb-4">
        {categoriaActiva ? `Filtrando por: ${categoriaActiva}` : `Mostrando todos los productos (${productosFiltrados.length})`}
      </p>

      {/* ── 🏷️ BARRA DE CATEGORÍAS DINÁMICA REPARADA ── */}
      <div className="mb-5">
        <div 
          className="d-flex flex-wrap justify-content-center gap-2 py-3 px-2 rounded-3" 
          style={{ background: "#060612", border: "1px solid rgba(30, 144, 255, 0.15)" }}
        >
          {/* Botón Estático para Mostrar Todos (Línea rota eliminada) */}
          <button
            onClick={() => handleCategoriaClick("Todas")}
            className="btn px-4 py-2 transition-all"
            style={{
              fontFamily: "Orbitron, sans-serif",
              fontSize: "0.8rem",
              fontWeight: "700",
              letterSpacing: "0.5px",
              borderRadius: "30px",
              backgroundColor: !categoriaActiva ? "#39FF14" : "transparent",
              color: !categoriaActiva ? "#000" : "#a3a3c2",
              border: !categoriaActiva ? "1px solid #39FF14" : "1px solid rgba(255, 255, 255, 0.1)",
              boxShadow: !categoriaActiva ? "0 0 15px rgba(57, 255, 20, 0.4)" : "none",
              transition: "all 0.2s ease-in-out"
            }}
          >
            ⚡ Todos ({todos.length})
          </button>

          {/* Mapeo Dinámico de las Categorías */}
          {categorias.map((cat) => { 
            const esSeleccionado = categoriaActiva === cat;
            const count = todos.filter((p) => p.categoria === cat).length;

            return (
              <button
                key={cat}
                onClick={() => handleCategoriaClick(cat)}
                className="btn px-4 py-2 transition-all"
                style={{
                  fontFamily: "Orbitron, sans-serif",
                  fontSize: "0.8rem",
                  fontWeight: "700",
                  letterSpacing: "0.5px",
                  borderRadius: "30px",
                  backgroundColor: esSeleccionado ? "#39FF14" : "transparent",
                  color: esSeleccionado ? "#000" : "#a3a3c2",
                  border: esSeleccionado ? "1px solid #39FF14" : "1px solid rgba(255, 255, 255, 0.1)",
                  boxShadow: esSeleccionado ? "0 0 15px rgba(57, 255, 20, 0.4)" : "none",
                  transition: "all 0.2s ease-in-out"
                }}
              >
                <span className="me-2">{EMOJIS[cat] || "📦"}</span>
                {cat} <span style={{ fontSize: "0.7rem", opacity: esSeleccionado ? 0.7 : 0.5 }}>({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Barra de filtros (Buscador, Selector de orden) */}
      <div className="row g-3 mb-5">
        <div className="col-md-6">
          <input 
            type="text" 
            placeholder="Buscar productos..." 
            className="form-control bg-dark text-white border-secondary"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
        <div className="col-md-6">
          <select 
            className="form-select bg-dark text-white border-secondary" 
            value={orden} 
            onChange={(e) => setOrden(e.target.value)}
          >
            <option value="">Ordenar por</option>
            <option value="precio-asc">Precio: Menor a Mayor</option>
            <option value="precio-desc">Precio: Mayor a Minor</option>
          </select>
        </div>
      </div>

      {/* Grid de productos funcional */}
      {productosFiltrados.length === 0 ? (
        <div className="text-center py-5">
          <p style={{ fontSize: "3rem" }}>📦</p>
          <p className="text-secondary">No se encontraron productos.</p>
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