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

export default function Productos() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [todos, setTodos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [orden, setOrden] = useState("");

  // Capturamos la categoría activa desde la URL
  const categoriaActiva = searchParams.get("cat") || "";

  useEffect(() => {
    setTodos(ProductosDB.listar());
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
    if (categoriaActiva === cat) {
      setSearchParams({}); // Si hace clic en la misma, limpia el filtro y muestra todo
    } else {
      setSearchParams({ cat });
    }
  };

  return (
    <div className="container py-5">
      <h1 className="fw-bold mb-1" style={{ fontFamily: "Orbitron, sans-serif", color: "#1E90FF" }}>
        CATÁLOGO DE PRODUCTOS
      </h1>
      <p className="text-secondary mb-4">
        {categoriaActiva ? `Filtrando por: ${categoriaActiva}` : `Mostrando todos los productos (${productosFiltrados.length})`}
      </p>

      {/* ── 🚀 EL BANNER INTERACTIVO AHORA VIVE AQUÍ ARRIBA ── */}
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
                    background: "#000000", 
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
                  <div style={{ fontSize: "1.8rem" }}>{EMOJIS[cat] || "📦"}</div>
                  <p className="mb-1 mt-2 text-light" style={{ fontSize: "0.75rem", fontWeight: 600 }}>{cat}</p>
                  <span className="text-secondary" style={{ fontSize: "0.65rem" }}>({count})</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Barra de filtros original (Buscador, Selector de orden, etc.) */}
      <div className="row g-3 mb-5">
        <div className="col-md-6">
          <input 
            type="text" 
            placeholder="Buscar productos..." 
            className="form-control"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
        <div className="col-md-6">
          <select className="form-select" value={orden} onChange={(e) => setOrden(e.target.value)}>
            <option value="">Ordenar por</option>
            <option value="precio-asc">Precio: Menor a Mayor</option>
            <option value="precio-desc">Precio: Mayor a Menor</option>
          </select>
        </div>
      </div>

      {/* Grid de productos */}
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