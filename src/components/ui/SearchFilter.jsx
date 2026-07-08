import { CATEGORIAS } from "../../data/productos.js";

export default function SearchFilter({ busqueda, setBusqueda, categoria, setCategoria, orden, setOrden }) {
  return (
    <div className="row g-2 mb-4">
      {/* Búsqueda */}
      <div className="col-12 col-md-5">
        <div className="input-group">
          <span className="input-group-text" style={{ background: "#0a0a16", border: "1px solid #2a2a5a", color: "#1E90FF" }}>🔍</span>
          <input
            type="text"
            className="form-control bg-dark text-white border-0 border-start"
            placeholder="Buscar productos..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            style={{ borderLeft: "1px solid #2a2a5a !important", background: "#0a0a16" }}
          />
          {busqueda && (
            <button className="btn btn-outline-secondary btn-sm" onClick={() => setBusqueda("")}>✕</button>
          )}
        </div>
      </div>

      {/* Categoría */}
      <div className="col-12 col-md-4">
        <select
          className="form-select"
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          style={{ background: "#0a0a16", color: "#fff", border: "1px solid #2a2a5a" }}
        >
          <option value="">Todas las categorías</option>
          {CATEGORIAS.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Orden */}
      <div className="col-12 col-md-3">
        <select
          className="form-select"
          value={orden}
          onChange={(e) => setOrden(e.target.value)}
          style={{ background: "#0a0a16", color: "#fff", border: "1px solid #2a2a5a" }}
        >
          <option value="">Ordenar por</option>
          <option value="precio-asc">Precio: menor a mayor</option>
          <option value="precio-desc">Precio: mayor a menor</option>
          <option value="nombre-asc">Nombre A-Z</option>
          <option value="descuento">Mayor descuento</option>
        </select>
      </div>
    </div>
  );
}
