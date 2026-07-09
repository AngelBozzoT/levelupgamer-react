import { useState, useEffect } from "react";

export default function FormUsuario({ inicial, onGuardar, onCancelar, modoEdicion }) {
  const [form, setForm] = useState(inicial);
  const [errores, setErrores] = useState({});

  useEffect(() => setForm(inicial), [inicial]);

  const set = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    if (errores[e.target.name]) setErrores((er) => ({ ...er, [e.target.name]: "" }));
  };

  const validarRun = (run) => /^[0-9]{6,8}[0-9kK]$/.test(run.trim());
  const validarCorreo = (c) => {
    const d = c.split("@")[1]?.toLowerCase();
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c) && ["inacap.cl", "profesor.inacap.cl", "gmail.com"].includes(d);
  };

  const validar = () => {
    const e = {};
    if (!validarRun(form.run)) e.run = "RUN inválido. Sin puntos ni guion (Ej: 19011022K)";
    if (!form.nombre.trim() || form.nombre.length > 50) e.nombre = "Requerido (máx 50)";
    if (!form.apellidos.trim() || form.apellidos.length > 100) e.apellidos = "Requerido (máx 100)";
    if (!validarCorreo(form.correo)) e.correo = "Solo @inacap.cl, @profesor.inacap.cl o @gmail.com";
    if (!modoEdicion && (form.password.length < 4 || form.password.length > 10)) e.password = "Entre 4 y 10 caracteres";
    if (!form.perfil) e.perfil = "Selecciona un rol";
    if (!form.region.trim()) e.region = "Región requerida";
    if (!form.comuna.trim()) e.comuna = "Comuna requerida";
    if (!form.direccion.trim() || form.direccion.length > 300) e.direccion = "Requerida (máx 300)";
    if (form.fechaNacimiento) {
      const p = form.fechaNacimiento.split("-");
      const hoy = new Date();
      let edad = hoy.getFullYear() - Number(p[0]);
      if (hoy.getMonth() < Number(p[1]) - 1 || (hoy.getMonth() === Number(p[1]) - 1 && hoy.getDate() < Number(p[2]))) edad--;
      if (edad < 18) e.fechaNacimiento = "Debe ser mayor de 18 años";
    }
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const e2 = validar();
    if (Object.keys(e2).length > 0) { setErrores(e2); return; }
    onGuardar(form);
  };

  const inp = (campo) => "form-control form-control-sm bg-dark text-white border-secondary" + (errores[campo] ? " is-invalid" : "");

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="row g-3">
        <div className="col-sm-4">
          <label className="form-label text-secondary small">RUN * (sin puntos/guion)</label>
          <input name="run" value={form.run} onChange={set} className={inp("run")} disabled={modoEdicion} maxLength={9} placeholder="19011022K" />
          {errores.run && <div className="invalid-feedback">{errores.run}</div>}
        </div>
        <div className="col-sm-4">
          <label className="form-label text-secondary small">Nombre *</label>
          <input name="nombre" value={form.nombre} onChange={set} className={inp("nombre")} maxLength={50} />
          {errores.nombre && <div className="invalid-feedback">{errores.nombre}</div>}
        </div>
        <div className="col-sm-4">
          <label className="form-label text-secondary small">Apellidos *</label>
          <input name="apellidos" value={form.apellidos} onChange={set} className={inp("apellidos")} maxLength={100} />
          {errores.apellidos && <div className="invalid-feedback">{errores.apellidos}</div>}
        </div>
        <div className="col-sm-6">
          <label className="form-label text-secondary small">Correo *</label>
          <input type="email" name="correo" value={form.correo} onChange={set} className={inp("correo")} maxLength={100} />
          {errores.correo && <div className="invalid-feedback">{errores.correo}</div>}
        </div>
        <div className="col-sm-3">
          <label className="form-label text-secondary small">{modoEdicion ? "Nueva contraseña" : "Contraseña *"}</label>
          <input type="password" name="password" value={form.password} onChange={set} className={inp("password")} maxLength={10} placeholder={modoEdicion ? "Dejar vacío = sin cambio" : ""} />
          {errores.password && <div className="invalid-feedback">{errores.password}</div>}
        </div>
        <div className="col-sm-3">
          <label className="form-label text-secondary small">Perfil *</label>
          <select name="perfil" value={form.perfil} onChange={set} className={"form-select form-select-sm bg-dark text-white border-secondary" + (errores.perfil ? " is-invalid" : "")}>
            {["Administrador", "Vendedor", "Cliente"].map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
          {errores.perfil && <div className="invalid-feedback">{errores.perfil}</div>}
        </div>
        <div className="col-sm-4">
          <label className="form-label text-secondary small">Fecha Nacimiento</label>
          <input type="date" name="fechaNacimiento" value={form.fechaNacimiento} onChange={set} className={inp("fechaNacimiento")} />
          {errores.fechaNacimiento && <div className="invalid-feedback">{errores.fechaNacimiento}</div>}
        </div>
        <div className="col-sm-4">
          <label className="form-label text-secondary small">Región *</label>
          <input name="region" value={form.region} onChange={set} className={inp("region")} placeholder="Ej: Región Metropolitana" />
          {errores.region && <div className="invalid-feedback">{errores.region}</div>}
        </div>
        <div className="col-sm-4">
          <label className="form-label text-secondary small">Comuna *</label>
          <input name="comuna" value={form.comuna} onChange={set} className={inp("comuna")} placeholder="Ej: Santiago" />
          {errores.comuna && <div className="invalid-feedback">{errores.comuna}</div>}
        </div>
        <div className="col-12">
          <label className="form-label text-secondary small">Dirección *</label>
          <input name="direccion" value={form.direccion} onChange={set} className={inp("direccion")} maxLength={300} />
          {errores.direccion && <div className="invalid-feedback">{errores.direccion}</div>}
        </div>
        <div className="col-12 d-flex gap-2 justify-content-end mt-2">
          <button type="button" onClick={onCancelar} className="btn btn-sm btn-outline-secondary">Cancelar</button>
          <button type="submit" className="btn btn-sm" style={{ background: "#1E90FF", color: "#fff" }}>
            {modoEdicion ? "💾 Guardar cambios" : "➕ Crear usuario"}
          </button>
        </div>
      </div>
    </form>
  );
}