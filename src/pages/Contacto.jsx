import { useState } from "react";

const DOMINIOS_VALIDOS = ["inacap.cl", "profesor.inacap.cl", "gmail.com"];

function validarCorreo(correo) {
  const dominio = correo.split("@")[1]?.toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo) && DOMINIOS_VALIDOS.includes(dominio);
}

export default function Contacto() {
  const [form, setForm] = useState({ nombre: "", correo: "", comentario: "" });
  const [errores, setErrores] = useState({});
  const [enviado, setEnviado] = useState(false);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    if (errores[e.target.name]) setErrores((er) => ({ ...er, [e.target.name]: "" }));
  };

  const validar = () => {
    const e = {};
    if (!form.nombre.trim() || form.nombre.length > 100)
      e.nombre = "Nombre requerido (máx 100 caracteres)";
    if (!validarCorreo(form.correo))
      e.correo = "Solo @inacap.cl, @profesor.inacap.cl o @gmail.com";
    if (!form.comentario.trim())
      e.comentario = "El mensaje es requerido";
    else if (form.comentario.length > 500)
      e.comentario = "El mensaje no puede superar los 500 caracteres";
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const e2 = validar();
    if (Object.keys(e2).length > 0) { setErrores(e2); return; }
    setEnviado(true);
    setForm({ nombre: "", correo: "", comentario: "" });
  };

  const inputCls = (campo) =>
    "form-control bg-dark text-white border-secondary" + (errores[campo] ? " is-invalid" : "");

  return (
    <div>
      {/* Header */}
      <div className="py-5 text-center" style={{ background: "linear-gradient(135deg, #05050f, #0d0d25)", borderBottom: "1px solid #1E90FF22" }}>
        <div className="container py-3">
          <h1 style={{ fontFamily: "Orbitron, sans-serif", color: "#fff", fontSize: "clamp(2rem,5vw,3rem)" }}>
            CONTACTO
          </h1>
          <p className="text-secondary lead mb-0">¿Tienes dudas? Escríbenos</p>
        </div>
      </div>

      <div className="container py-5">
        <div className="row g-4 justify-content-center">

          {/* Info de contacto */}
          <div className="col-md-4">
            <div className="rounded-3 p-4 h-100" style={{ background: "#07070c", border: "1px solid #1E90FF22" }}>
              <h5 className="text-white fw-bold mb-4" style={{ fontFamily: "Orbitron, sans-serif", fontSize: "0.95rem" }}>
                INFORMACIÓN
              </h5>
              {[
                { emoji: "📞", label: "Teléfono", valor: "+56 2 2345 6789", color: "#1E90FF" },
                { emoji: "📧", label: "Email", valor: "contacto@levelupgamer.cl", color: "#39FF14" },
                { emoji: "📍", label: "Ubicación", valor: "Santiago, Chile", color: "#1E90FF" },
                { emoji: "🕐", label: "Horario", valor: "Lun–Vie 9:00–18:00", color: "#39FF14" },
              ].map((item) => (
                <div key={item.label} className="d-flex align-items-start gap-3 mb-4">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{ width: 44, height: 44, background: `${item.color}15`, border: `1px solid ${item.color}44`, fontSize: "1.1rem" }}
                  >
                    {item.emoji}
                  </div>
                  <div>
                    <p className="text-secondary mb-0" style={{ fontSize: "0.75rem" }}>{item.label}</p>
                    <p className="text-light mb-0" style={{ fontSize: "0.9rem" }}>{item.valor}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Formulario */}
          <div className="col-md-7">
            <div className="rounded-3 p-4 p-md-5" style={{ background: "#07070c", border: "1px solid #1E90FF22" }}>
              <h5 className="text-white fw-bold mb-4" style={{ fontFamily: "Orbitron, sans-serif", fontSize: "0.95rem" }}>
                ENVÍANOS UN MENSAJE
              </h5>

              {enviado && (
                <div className="alert alert-success d-flex align-items-center gap-2 mb-4">
                  ✅ ¡Mensaje enviado con éxito! Te responderemos pronto.
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                <div className="mb-3">
                  <label className="form-label text-secondary small">Nombre Completo *</label>
                  <input
                    name="nombre"
                    value={form.nombre}
                    onChange={handleChange}
                    className={inputCls("nombre")}
                    placeholder="Tu nombre completo"
                    maxLength={100}
                  />
                  {errores.nombre && <div className="invalid-feedback">{errores.nombre}</div>}
                </div>

                <div className="mb-3">
                  <label className="form-label text-secondary small">
                    Correo Electrónico * <span className="text-muted">(solo @inacap.cl, @profesor.inacap.cl o @gmail.com)</span>
                  </label>
                  <input
                    type="email"
                    name="correo"
                    value={form.correo}
                    onChange={handleChange}
                    className={inputCls("correo")}
                    placeholder="tu@correo.cl"
                    maxLength={100}
                  />
                  {errores.correo && <div className="invalid-feedback">{errores.correo}</div>}
                </div>

                <div className="mb-4">
                  <label className="form-label text-secondary small d-flex justify-content-between">
                    <span>Mensaje * </span>
                    <span className={form.comentario.length > 450 ? "text-warning" : "text-secondary"}>
                      {form.comentario.length}/500
                    </span>
                  </label>
                  <textarea
                    name="comentario"
                    value={form.comentario}
                    onChange={handleChange}
                    className={inputCls("comentario")}
                    rows={5}
                    placeholder="Cuéntanos en qué podemos ayudarte..."
                    maxLength={500}
                  />
                  {errores.comentario && <div className="invalid-feedback">{errores.comentario}</div>}
                </div>

                <button
                  type="submit"
                  className="btn w-100 fw-bold py-2"
                  style={{ background: "transparent", border: "2px solid #39FF14", color: "#39FF14" }}
                >
                  ENVIAR MENSAJE
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
