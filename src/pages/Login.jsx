import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ correo: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (!form.correo || !form.password) { setError("Completa todos los campos."); return; }
    if (form.password.length < 4 || form.password.length > 10) {
      setError("La contraseña debe tener entre 4 y 10 caracteres."); return;
    }
    try {
      const usuario = login(form.correo, form.password);
      navigate(usuario.perfil === "Administrador" ? "/admin" : "/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container py-5 d-flex justify-content-center">
      <div className="rounded-3 p-4 p-md-5 w-100" style={{ maxWidth: 480, background: "#0d0d21", border: "1px solid #1E90FF33" }}>
        <h2 className="text-center mb-1" style={{ fontFamily: "Orbitron, sans-serif", color: "#1E90FF" }}>INICIAR SESIÓN</h2>
        <p className="text-secondary text-center mb-4 small">Ingresa a tu cuenta Level-Up Gamer</p>

        {error && <div className="alert alert-danger py-2 small">{error}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <label className="form-label text-secondary small">Correo Electrónico</label>
            <input type="email" className="form-control bg-dark text-white border-secondary"
              value={form.correo} onChange={(e) => setForm((f) => ({ ...f, correo: e.target.value }))}
              placeholder="tu@correo.cl" maxLength={100} />
          </div>
          <div className="mb-4">
            <label className="form-label text-secondary small">Contraseña (4–10 caracteres)</label>
            <input type="password" className="form-control bg-dark text-white border-secondary"
              value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              maxLength={10} />
          </div>
          <button type="submit" className="btn w-100 py-2 fw-bold"
            style={{ background: "transparent", border: "2px solid #39FF14", color: "#39FF14" }}>
            INGRESAR
          </button>
        </form>

        <p className="text-secondary text-center mt-4 small">
          ¿No tienes cuenta? <Link to="/registro" style={{ color: "#1E90FF" }}>Regístrate aquí</Link>
        </p>

        {/* Usuarios de prueba */}
        <div className="mt-4 p-3 rounded-2" style={{ background: "#05050f", border: "1px solid #333", fontSize: "0.75rem" }}>
          <p className="text-secondary mb-1 fw-bold">Cuentas de prueba:</p>
          <p className="text-secondary mb-0">Admin: camila.soto@gmail.com / admin1</p>
          <p className="text-secondary mb-0">Cliente: javiera.munoz@gmail.com / cli1</p>
        </div>
      </div>
    </div>
  );
}
