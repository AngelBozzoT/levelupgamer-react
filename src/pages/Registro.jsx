import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UsuariosDB } from "../data/db.js";

const DOMINIOS_VALIDOS = ["inacap.cl", "profesor.inacap.cl", "gmail.com"];

function validarRun(run) {
  const limpio = run.trim();
  return /^[0-9]{6,8}[0-9kK]$/.test(limpio);
}

function validarCorreo(correo) {
  const dominio = correo.split("@")[1]?.toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo) && DOMINIOS_VALIDOS.includes(dominio);
}

export default function Registro() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    run: "", nombre: "", apellidos: "", correo: "",
    password: "", fechaNacimiento: "", region: "", comuna: "", direccion: "",
  });
  const [errores, setErrores] = useState({});
  const [exito, setExito] = useState(false);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    if (errores[e.target.name]) setErrores((er) => ({ ...er, [e.target.name]: "" }));
  };

  const validar = () => {
    const e = {};
    if (!validarRun(form.run)) e.run = "RUN inválido. Sin puntos ni guion (Ej: 19011022K)";
    if (!form.nombre.trim() || form.nombre.length > 50) e.nombre = "Nombre requerido (máx 50 caracteres)";
    if (!form.apellidos.trim() || form.apellidos.length > 100) e.apellidos = "Apellidos requeridos (máx 100)";
    if (!validarCorreo(form.correo)) e.correo = "Solo @inacap.cl, @profesor.inacap.cl o @gmail.com";
    if (form.password.length < 4 || form.password.length > 10) e.password = "Contraseña: entre 4 y 10 caracteres";
    if (form.fechaNacimiento) {
      const partes = form.fechaNacimiento.split("-");
      const hoy = new Date();
      let edad = hoy.getFullYear() - Number(partes[0]);
      if (hoy.getMonth() < Number(partes[1]) - 1 || (hoy.getMonth() === Number(partes[1]) - 1 && hoy.getDate() < Number(partes[2]))) edad--;
      if (edad < 18) e.fechaNacimiento = "Debes ser mayor de 18 años";
    }
    if (!form.region) e.region = "Selecciona una región";
    if (!form.comuna.trim()) e.comuna = "Ingresa la comuna";
    if (!form.direccion.trim() || form.direccion.length > 300) e.direccion = "Dirección requerida (máx 300)";
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const e2 = validar();
    if (Object.keys(e2).length > 0) { setErrores(e2); return; }
    try {
      UsuariosDB.crear({ ...form, perfil: "Cliente" });
      setExito(true);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setErrores({ run: err.message });
    }
  };

  const inputCls = (campo) => "form-control bg-dark text-white border-secondary" + (errores[campo] ? " is-invalid" : "");

  if (exito) return (
    <div className="container py-5 text-center">
      <div style={{ fontSize: "4rem" }}>✅</div>
      <h2 style={{ color: "#39FF14", fontFamily: "Orbitron, sans-serif" }}>¡Registro exitoso!</h2>
      <p className="text-secondary">Redirigiendo al login...</p>
    </div>
  );

  return (
    <div className="container py-5 d-flex justify-content-center">
      <div className="rounded-3 p-4 p-md-5 w-100" style={{ maxWidth: 560, background: "#0d0d21", border: "1px solid #1E90FF33" }}>
        <h2 className="text-center mb-1" style={{ fontFamily: "Orbitron, sans-serif", color: "#1E90FF" }}>CREAR CUENTA</h2>
        <p className="text-secondary text-center mb-4 small">Únete a Level-Up Gamer</p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="row g-3">
            <div className="col-12">
              <label className="form-label text-secondary small">RUN * (sin puntos ni guion)</label>
              <input name="run" value={form.run} onChange={handleChange} className={inputCls("run")} placeholder="Ej: 19011022K" maxLength={9} />
              {errores.run && <div className="invalid-feedback">{errores.run}</div>}
            </div>
            <div className="col-sm-6">
              <label className="form-label text-secondary small">Nombre *</label>
              <input name="nombre" value={form.nombre} onChange={handleChange} className={inputCls("nombre")} maxLength={50} />
              {errores.nombre && <div className="invalid-feedback">{errores.nombre}</div>}
            </div>
            <div className="col-sm-6">
              <label className="form-label text-secondary small">Apellidos *</label>
              <input name="apellidos" value={form.apellidos} onChange={handleChange} className={inputCls("apellidos")} maxLength={100} />
              {errores.apellidos && <div className="invalid-feedback">{errores.apellidos}</div>}
            </div>
            <div className="col-12">
              <label className="form-label text-secondary small">Correo * (@inacap.cl, @profesor.inacap.cl o @gmail.com)</label>
              <input type="email" name="correo" value={form.correo} onChange={handleChange} className={inputCls("correo")} maxLength={100} />
              {errores.correo && <div className="invalid-feedback">{errores.correo}</div>}
            </div>
            <div className="col-sm-6">
              <label className="form-label text-secondary small">Contraseña * (4-10 caracteres)</label>
              <input type="password" name="password" value={form.password} onChange={handleChange} className={inputCls("password")} maxLength={10} />
              {errores.password && <div className="invalid-feedback">{errores.password}</div>}
            </div>
            <div className="col-sm-6">
              <label className="form-label text-secondary small">Fecha de Nacimiento</label>
              <input type="date" name="fechaNacimiento" value={form.fechaNacimiento} onChange={handleChange} className={inputCls("fechaNacimiento")} />
              {errores.fechaNacimiento && <div className="invalid-feedback">{errores.fechaNacimiento}</div>}
            </div>
            <div className="col-sm-6">
              <label className="form-label text-secondary small">Región *</label>
              <input name="region" value={form.region} onChange={handleChange} className={inputCls("region")} placeholder="Ej: Región Metropolitana" />
              {errores.region && <div className="invalid-feedback">{errores.region}</div>}
            </div>
            <div className="col-sm-6">
              <label className="form-label text-secondary small">Comuna *</label>
              <input name="comuna" value={form.comuna} onChange={handleChange} className={inputCls("comuna")} placeholder="Ej: Santiago" />
              {errores.comuna && <div className="invalid-feedback">{errores.comuna}</div>}
            </div>
            <div className="col-12">
              <label className="form-label text-secondary small">Dirección de Despacho *</label>
              <input name="direccion" value={form.direccion} onChange={handleChange} className={inputCls("direccion")} maxLength={300} placeholder="Calle, número, depto..." />
              {errores.direccion && <div className="invalid-feedback">{errores.direccion}</div>}
            </div>
          </div>

          <button type="submit" className="btn w-100 py-2 fw-bold mt-4"
            style={{ background: "transparent", border: "2px solid #39FF14", color: "#39FF14" }}>
            REGISTRARSE
          </button>
        </form>
        <p className="text-secondary text-center mt-3 small">
          ¿Ya tienes cuenta? <Link to="/login" style={{ color: "#1E90FF" }}>Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
}
