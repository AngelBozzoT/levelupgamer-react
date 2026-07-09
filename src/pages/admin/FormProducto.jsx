import { useState, useEffect } from "react";
// Elimiamos la importación fija de CATEGORIAS porque ahora viene por props

export default function FormProducto({ inicial, onGuardar, onCancelar, modoEdicion, categoriasLista }) {
  const [form, setForm] = useState(inicial);
  const [errores, setErrores] = useState({});

  useEffect(() => setForm(inicial), [inicial]);

  const set = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
    if (errores[name]) setErrores((er) => ({ ...er, [name]: "" }));
  };

  const validar = () => {
    const e = {};
    if (!form.codigo.trim() || form.codigo.trim().length < 3) e.codigo = "Mínimo 3 caracteres";
    if (!form.titulo.trim() || form.titulo.length > 100) e.titulo = "Requerido (máx 100)";
    if (!form.categoria) e.categoria = "Selecciona una categoría";
    if (form.precio === "" || Number(form.precio) < 0) e.precio = "Precio requerido (mín 0)";
    if (form.stock === "" || !Number.isInteger(Number(form.stock)) || Number(form.stock) < 0) e.stock = "Stock entero ≥ 0";
    if (form.descripcion.length > 500) e.descripcion = "Máx 500 caracteres";
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const e2 = validar();
    if (Object.keys(e2).length > 0) { setErrores(e2); return; }
    onGuardar({
      ...form,
      precio: Number(form.precio),
      descuento: Number(form.descuento || 0),
      stock: parseInt(form.stock),
      stockCritico: parseInt(form.stockCritico || 0),
      destacado: Boolean(form.destacado),
    });
  };

  const inp = (campo) => "form-control form-control-sm bg-dark text-white border-secondary" + (errores[campo] ? " is-invalid" : "");

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="row g-3">
        <div className="col-sm-4">
          <label className="form-label text-secondary small">Código *</label>
          <input name="codigo" value={form.codigo} onChange={set} className={inp("codigo")} disabled={modoEdicion} placeholder="Ej: MS002" />
          {errores.codigo && <div className="invalid-feedback">{errores.codigo}</div>}
        </div>
        
        <div className="col-sm-8">
          <label className="form-label text-secondary small">Nombre del Producto *</label>
          <input name="titulo" value={form.titulo} onChange={set} className={inp("titulo")} maxLength={100} />
          {errores.titulo && <div className="invalid-feedback">{errores.titulo}</div>}
        </div>
        
        {/* ── SECTOR CORREGIDO: SELECTOR DINÁMICO DE CATEGORÍAS ── */}
        <div className="col-sm-6">
          <label className="form-label text-secondary small">Categoría *</label>
          <select 
            name="categoria" 
            value={form.categoria} 
            onChange={set} 
            className={"form-select form-select-sm bg-dark text-white border-secondary" + (errores.categoria ? " is-invalid" : "")}
          >
            <option value="">Seleccionar...</option>
            {/* Mapeamos de las props con contingencia por si llega undefined */}
            {(categoriasLista || []).map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          {errores.categoria && <div className="invalid-feedback">{errores.categoria}</div>}
        </div>
        
        <div className="col-sm-3">
          <label className="form-label text-secondary small">Precio *</label>
          <input type="number" name="precio" value={form.precio} onChange={set} className={inp("precio")} min={0} />
          {errores.precio && <div className="invalid-feedback">{errores.precio}</div>}
        </div>
        
        <div className="col-sm-3">
          <label className="form-label text-secondary small">Descuento %</label>
          <input type="number" name="descuento" value={form.descuento} onChange={set} className="form-control form-control-sm bg-dark text-white border-secondary" min={0} max={100} />
        </div>
        
        <div className="col-sm-3">
          <label className="form-label text-secondary small">Stock *</label>
          <input type="number" name="stock" value={form.stock} onChange={set} className={inp("stock")} min={0} />
          {errores.stock && <div className="invalid-feedback">{errores.stock}</div>}
        </div>
        
        <div className="col-sm-3">
          <label className="form-label text-secondary small">Stock Crítico</label>
          <input type="number" name="stockCritico" value={form.stockCritico} onChange={set} className="form-control form-control-sm bg-dark text-white border-secondary" min={0} />
        </div>
        
        <div className="col-12">
          <label className="form-label text-secondary small">URL Imagen</label>
          <input name="imagen" value={form.imagen} onChange={set} className="form-control form-control-sm bg-dark text-white border-secondary" placeholder="https://..." />
        </div>
        
        <div className="col-12">
          <label className="form-label text-secondary small">Descripción (máx 500)</label>
          <textarea name="descripcion" value={form.descripcion} onChange={set} className={inp("descripcion")} rows={2} maxLength={500} />
          {errores.descripcion && <div className="invalid-feedback">{errores.descripcion}</div>}
        </div>
        
        <div className="col-12">
          <div className="form-check">
            <input type="checkbox" name="destacado" checked={form.destacado} onChange={set} className="form-check-input" id="chk-destacado" />
            <label htmlFor="chk-destacado" className="form-check-label text-secondary small">Producto destacado en Home</label>
          </div>
        </div>
        
        <div className="col-12 d-flex gap-2 justify-content-end mt-2">
          <button type="button" onClick={onCancelar} className="btn btn-sm btn-outline-secondary">Cancelar</button>
          <button type="submit" className="btn btn-sm" style={{ background: "#1E90FF", color: "#fff" }}>
            {modoEdicion ? "💾 Guardar cambios" : "➕ Crear producto"}
          </button>
        </div>
      </div>
    </form>
  );
}