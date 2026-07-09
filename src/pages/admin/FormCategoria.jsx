import { useState } from "react";

export default function FormCategoria({ onGuardar, onCancelar }) {
  const [nombre, setNombre] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nombre.trim()) {
      setError("El nombre de la categoría es requerido");
      return;
    }
    if (nombre.trim().length > 30) {
      setError("Máximo 30 caracteres");
      return;
    }
    onGuardar(nombre.trim());
    setNombre("");
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="row g-2 align-items-end">
        <div className="col-sm-8">
          <label className="form-label text-secondary small">Nombre de la Nueva Categoría *</label>
          <input 
            type="text"
            value={nombre} 
            onChange={(e) => { setNombre(e.target.value); setError(""); }} 
            className={"form-control form-control-sm bg-dark text-white border-secondary" + (error ? " is-invalid" : "")} 
            placeholder="Ej: Teclados Mecánicos"
            maxLength={30}
          />
          {error && <div className="invalid-feedback">{error}</div>}
        </div>
        <div className="col-sm-4 d-flex gap-2">
          <button type="button" onClick={onCancelar} className="btn btn-sm btn-outline-secondary w-100">Cancelar</button>
          <button type="submit" className="btn btn-sm w-100" style={{ background: "#39FF14", color: "#000", fontWeight: 700 }}>➕ Añadir</button>
        </div>
      </div>
    </form>
  );
}