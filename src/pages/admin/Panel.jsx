import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { ProductosDB, UsuariosDB, PedidosDB } from "../../data/db.js";
import { CATEGORIAS, formatearPrecio } from "../../data/productos.js";

/* ─── Formulario de Producto ─── */
const PROD_VACIO = { codigo: "", titulo: "", categoria: "", precio: "", descuento: 0, stock: "", stockCritico: "", descripcion: "", imagen: "", destacado: false };

function FormProducto({ inicial, onGuardar, onCancelar, modoEdicion }) {
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
        <div className="col-sm-6">
          <label className="form-label text-secondary small">Categoría *</label>
          <select name="categoria" value={form.categoria} onChange={set} className={"form-select form-select-sm bg-dark text-white border-secondary" + (errores.categoria ? " is-invalid" : "")}>
            <option value="">Seleccionar...</option>
            {CATEGORIAS.map((c) => <option key={c} value={c}>{c}</option>)}
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

/* ─── Formulario de Usuario ─── */
const USER_VACIO = { run: "", nombre: "", apellidos: "", correo: "", password: "", perfil: "Cliente", region: "", comuna: "", direccion: "", fechaNacimiento: "" };

function FormUsuario({ inicial, onGuardar, onCancelar, modoEdicion }) {
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

/* ─── Panel Principal ─── */
export default function Panel() {
  const { usuario, esAdmin } = useAuth();
  const navigate = useNavigate();

  const [seccion, setSeccion] = useState("dashboard");
  const [productos, setProductos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [toast, setToast] = useState(null);

  // Estado de formularios
  const [formProd, setFormProd] = useState(null); // null = oculto, objeto = abierto
  const [editProdCodigo, setEditProdCodigo] = useState(null);
  const [formUser, setFormUser] = useState(null);
  const [editUserRun, setEditUserRun] = useState(null);

  const cargar = useCallback(() => {
    setProductos(ProductosDB.listar());
    setUsuarios(UsuariosDB.listar());
    setPedidos(PedidosDB.listar());
  }, []);

  useEffect(() => {
    if (!usuario) { navigate("/login"); return; }
    if (!esAdmin) { navigate("/"); return; }
    cargar();
  }, [usuario, esAdmin, navigate, cargar]);

  const mostrarToast = (msg, tipo = "success") => {
    setToast({ msg, tipo });
    setTimeout(() => setToast(null), 2500);
  };

  /* ─── CRUD Productos ─── */
  const handleGuardarProducto = (datos) => {
    try {
      if (editProdCodigo) {
        ProductosDB.actualizar(editProdCodigo, datos);
        mostrarToast("✅ Producto actualizado");
      } else {
        ProductosDB.crear(datos);
        mostrarToast("✅ Producto creado");
      }
      setFormProd(null);
      setEditProdCodigo(null);
      cargar();
    } catch (err) {
      mostrarToast("❌ " + err.message, "error");
    }
  };

  const handleEditarProducto = (p) => {
    setFormProd({ ...p, precio: p.precio.toString(), stock: p.stock.toString(), stockCritico: (p.stockCritico || 0).toString(), descuento: p.descuento || 0 });
    setEditProdCodigo(p.codigo);
  };

  const handleEliminarProducto = (codigo) => {
    if (!confirm(`¿Eliminar el producto ${codigo}? Esta acción no se puede deshacer.`)) return;
    ProductosDB.eliminar(codigo);
    mostrarToast("🗑 Producto eliminado");
    cargar();
  };

  /* ─── CRUD Usuarios ─── */
  const handleGuardarUsuario = (datos) => {
    try {
      if (editUserRun) {
        const actualizacion = { ...datos };
        if (!actualizacion.password) delete actualizacion.password;
        UsuariosDB.actualizar(editUserRun, actualizacion);
        mostrarToast("✅ Usuario actualizado");
      } else {
        UsuariosDB.crear(datos);
        mostrarToast("✅ Usuario creado");
      }
      setFormUser(null);
      setEditUserRun(null);
      cargar();
    } catch (err) {
      mostrarToast("❌ " + err.message, "error");
    }
  };

  const handleEditarUsuario = (u) => {
    setFormUser({ ...u, password: "" });
    setEditUserRun(u.run);
  };

  const handleEliminarUsuario = (run) => {
    if (run === usuario?.run) { mostrarToast("❌ No puedes eliminarte a ti mismo", "error"); return; }
    if (!confirm(`¿Eliminar al usuario con RUN ${run}?`)) return;
    UsuariosDB.eliminar(run);
    mostrarToast("🗑 Usuario eliminado");
    cargar();
  };

  /* ─── Stats dashboard ─── */
  const prodCriticos = productos.filter((p) => Number(p.stock) <= Number(p.stockCritico ?? 0)).length;

  const badgePerfil = (p) => {
    const map = { Administrador: "danger", Vendedor: "warning", Cliente: "secondary" };
    return <span className={`badge bg-${map[p] ?? "secondary"}`}>{p}</span>;
  };

  const badgeStock = (p) =>
    Number(p.stock) <= Number(p.stockCritico ?? 0)
      ? <span className="badge bg-danger">Stock crítico</span>
      : <span className="badge bg-success">OK</span>;

  /* ─── Render ─── */
  const sideLinks = [
    { id: "dashboard", label: "📊 Dashboard" },
    { id: "productos", label: "📦 Productos" },
    { id: "usuarios", label: "👥 Usuarios" },
    { id: "pedidos", label: "🛒 Pedidos" },
  ];

  return (
    <div className="d-flex" style={{ minHeight: "calc(100vh - 60px)" }}>

      {/* Toast */}
      {toast && (
        <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 9999, background: toast.tipo === "error" ? "#1a0808" : "#0d1f0d", border: `1px solid ${toast.tipo === "error" ? "#ff4444" : "#39FF14"}`, color: toast.tipo === "error" ? "#ff4444" : "#39FF14", padding: "12px 20px", borderRadius: 8, fontSize: "0.9rem" }}>
          {toast.msg}
        </div>
      )}

      {/* Sidebar */}
      <nav className="d-flex flex-column p-3 flex-shrink-0" style={{ width: 220, background: "#05050f", borderRight: "1px solid #1E90FF22", minHeight: "100%" }}>
        <div className="mb-4 text-center">
          <p style={{ color: "#39FF14", fontFamily: "Orbitron, sans-serif", fontSize: "0.75rem", letterSpacing: 1, marginBottom: 4 }}>⚡ PANEL ADMIN</p>
          <p className="text-secondary mb-0" style={{ fontSize: "0.75rem" }}>{usuario?.nombre}</p>
        </div>
        {sideLinks.map((l) => (
          <button key={l.id} onClick={() => { setSeccion(l.id); setFormProd(null); setFormUser(null); }}
            className={"btn btn-sm text-start mb-1 " + (seccion === l.id ? "btn-primary" : "btn-outline-secondary text-light")}
            style={{ fontSize: "0.85rem" }}>
            {l.label}
          </button>
        ))}
        <hr style={{ borderColor: "#1E90FF22" }} />
        <button onClick={() => navigate("/")} className="btn btn-sm btn-outline-secondary text-light text-start" style={{ fontSize: "0.8rem" }}>
          ← Volver al sitio
        </button>
      </nav>

      {/* Contenido */}
      <main className="flex-grow-1 p-4" style={{ background: "#07080f", overflowX: "auto" }}>

        {/* ── DASHBOARD ── */}
        {seccion === "dashboard" && (
          <div>
            <h2 style={{ fontFamily: "Orbitron, sans-serif", color: "#1E90FF", fontSize: "1.3rem" }} className="mb-4">DASHBOARD</h2>
            <div className="row g-3 mb-5">
              {[
                { label: "Productos", valor: productos.length, color: "#1E90FF", emoji: "📦" },
                { label: "Usuarios", valor: usuarios.length, color: "#39FF14", emoji: "👥" },
                { label: "Pedidos", valor: pedidos.length, color: "#ffc107", emoji: "🛒" },
                { label: "Stock Crítico", valor: prodCriticos, color: "#ff4444", emoji: "⚠️" },
              ].map((s) => (
                <div key={s.label} className="col-6 col-md-3">
                  <div className="rounded-3 p-3 text-center h-100" style={{ background: "#0d0d21", border: `1px solid ${s.color}33` }}>
                    <div style={{ fontSize: "2rem" }}>{s.emoji}</div>
                    <div style={{ fontFamily: "Orbitron, sans-serif", color: s.color, fontSize: "1.8rem", fontWeight: 700 }}>{s.valor}</div>
                    <div className="text-secondary small">{s.label}</div>
                  </div>
                </div>
              ))}
            </div>

            {prodCriticos > 0 && (
              <div className="alert" style={{ background: "#1a0808", border: "1px solid #ff4444", color: "#ff9999" }}>
                ⚠️ Hay <strong>{prodCriticos}</strong> producto(s) con stock crítico. <button className="btn btn-sm btn-outline-danger ms-2" onClick={() => setSeccion("productos")}>Ver productos →</button>
              </div>
            )}
          </div>
        )}

        {/* ── PRODUCTOS ── */}
        {seccion === "productos" && (
          <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 style={{ fontFamily: "Orbitron, sans-serif", color: "#1E90FF", fontSize: "1.3rem" }}>PRODUCTOS ({productos.length})</h2>
              {!formProd && (
                <button onClick={() => { setFormProd(PROD_VACIO); setEditProdCodigo(null); }}
                  className="btn btn-sm" style={{ background: "#1E90FF", color: "#fff" }}>
                  + Nuevo Producto
                </button>
              )}
            </div>

            {formProd && (
              <div className="rounded-3 p-4 mb-4" style={{ background: "#0d0d21", border: `1px solid ${editProdCodigo ? "#ffc107" : "#39FF14"}44` }}>
                <h6 className="mb-3" style={{ color: editProdCodigo ? "#ffc107" : "#39FF14", fontFamily: "Orbitron, sans-serif", fontSize: "0.85rem" }}>
                  {editProdCodigo ? `✏️ EDITANDO: ${editProdCodigo}` : "➕ NUEVO PRODUCTO"}
                </h6>
                <FormProducto
                  inicial={formProd}
                  modoEdicion={!!editProdCodigo}
                  onGuardar={handleGuardarProducto}
                  onCancelar={() => { setFormProd(null); setEditProdCodigo(null); }}
                />
              </div>
            )}

            <div className="table-responsive">
              <table className="table table-dark table-hover table-sm align-middle" style={{ fontSize: "0.82rem" }}>
                <thead style={{ borderBottom: "1px solid #1E90FF44" }}>
                  <tr>
                    <th>Código</th><th>Nombre</th><th>Categoría</th>
                    <th>Precio</th><th>Dto%</th><th>Stock</th><th>Estado</th><th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {productos.map((p) => (
                    <tr key={p.codigo}>
                      <td><code style={{ color: "#1E90FF" }}>{p.codigo}</code></td>
                      <td>{p.titulo}</td>
                      <td><span className="badge bg-secondary" style={{ fontSize: "0.7rem" }}>{p.categoria}</span></td>
                      <td>{formatearPrecio(p.precio)}</td>
                      <td>{p.descuento > 0 ? <span className="badge bg-danger">{p.descuento}%</span> : <span className="text-secondary">—</span>}</td>
                      <td>{p.stock}</td>
                      <td>{badgeStock(p)}</td>
                      <td>
                        <div className="d-flex gap-1">
                          <button onClick={() => handleEditarProducto(p)} className="btn btn-xs btn-outline-warning" style={{ fontSize: "0.7rem", padding: "2px 8px" }}>Editar</button>
                          <button onClick={() => handleEliminarProducto(p.codigo)} className="btn btn-xs btn-outline-danger" style={{ fontSize: "0.7rem", padding: "2px 8px" }}>Eliminar</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── USUARIOS ── */}
        {seccion === "usuarios" && (
          <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 style={{ fontFamily: "Orbitron, sans-serif", color: "#1E90FF", fontSize: "1.3rem" }}>USUARIOS ({usuarios.length})</h2>
              {!formUser && (
                <button onClick={() => { setFormUser(USER_VACIO); setEditUserRun(null); }}
                  className="btn btn-sm" style={{ background: "#1E90FF", color: "#fff" }}>
                  + Nuevo Usuario
                </button>
              )}
            </div>

            {formUser && (
              <div className="rounded-3 p-4 mb-4" style={{ background: "#0d0d21", border: `1px solid ${editUserRun ? "#ffc107" : "#39FF14"}44` }}>
                <h6 className="mb-3" style={{ color: editUserRun ? "#ffc107" : "#39FF14", fontFamily: "Orbitron, sans-serif", fontSize: "0.85rem" }}>
                  {editUserRun ? `✏️ EDITANDO: ${editUserRun}` : "➕ NUEVO USUARIO"}
                </h6>
                <FormUsuario
                  inicial={formUser}
                  modoEdicion={!!editUserRun}
                  onGuardar={handleGuardarUsuario}
                  onCancelar={() => { setFormUser(null); setEditUserRun(null); }}
                />
              </div>
            )}

            <div className="table-responsive">
              <table className="table table-dark table-hover table-sm align-middle" style={{ fontSize: "0.82rem" }}>
                <thead style={{ borderBottom: "1px solid #1E90FF44" }}>
                  <tr><th>RUN</th><th>Nombre</th><th>Correo</th><th>Perfil</th><th>Región</th><th>Acciones</th></tr>
                </thead>
                <tbody>
                  {usuarios.map((u) => (
                    <tr key={u.run}>
                      <td><code style={{ color: "#1E90FF" }}>{u.run}</code></td>
                      <td>{u.nombre} {u.apellidos}</td>
                      <td className="text-secondary" style={{ fontSize: "0.75rem" }}>{u.correo}</td>
                      <td>{badgePerfil(u.perfil)}</td>
                      <td className="text-secondary" style={{ fontSize: "0.75rem" }}>{u.region}</td>
                      <td>
                        <div className="d-flex gap-1">
                          <button onClick={() => handleEditarUsuario(u)} className="btn btn-xs btn-outline-warning" style={{ fontSize: "0.7rem", padding: "2px 8px" }}>Editar</button>
                          <button onClick={() => handleEliminarUsuario(u.run)} className="btn btn-xs btn-outline-danger" style={{ fontSize: "0.7rem", padding: "2px 8px" }}>Eliminar</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── PEDIDOS ── */}
        {seccion === "pedidos" && (
          <div>
            <h2 style={{ fontFamily: "Orbitron, sans-serif", color: "#1E90FF", fontSize: "1.3rem" }} className="mb-4">
              PEDIDOS ({pedidos.length})
            </h2>
            {pedidos.length === 0 ? (
              <p className="text-secondary">Aún no hay pedidos registrados.</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-dark table-hover table-sm align-middle" style={{ fontSize: "0.82rem" }}>
                  <thead style={{ borderBottom: "1px solid #1E90FF44" }}>
                    <tr><th>N° Pedido</th><th>Fecha</th><th>Cliente</th><th>Total</th><th>Estado</th><th>Items</th></tr>
                  </thead>
                  <tbody>
                    {[...pedidos].reverse().map((p) => (
                      <tr key={p.id}>
                        <td><code style={{ color: "#ffc107", fontSize: "0.72rem" }}>{p.id}</code></td>
                        <td className="text-secondary">{new Date(p.fecha).toLocaleDateString("es-CL")}</td>
                        <td>{p.cliente?.nombre} {p.cliente?.apellidos}</td>
                        <td style={{ color: "#39FF14", fontWeight: 700 }}>{formatearPrecio(p.total)}</td>
                        <td><span className="badge bg-success">{p.estado}</span></td>
                        <td className="text-secondary">{p.items?.length || 0} producto(s)</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

      </main>
    </div>
  );
}
