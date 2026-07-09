import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { ProductosDB, UsuariosDB, PedidosDB } from "../../data/db.js";
import { formatearPrecio } from "../../data/productos.js";
import { CategoriasDB } from "../../data/db.js"; 
import FormCategoria from "./FormCategoria.jsx";
import DetalleBoleta from "./DetalleBoleta.jsx";
import FormProducto from "./FormProducto.jsx";
import FormUsuario from "./FormUsuario.jsx";

const PROD_VACIO = { codigo: "", titulo: "", categoria: "", precio: "", descuento: 0, stock: "", stockCritico: "", descripcion: "", imagen: "", destacado: false };
const USER_VACIO = { run: "", nombre: "", apellidos: "", correo: "", password: "", perfil: "Cliente", region: "", comuna: "", direccion: "", fechaNacimiento: "" };

export default function Panel() {
  const { usuario, esAdmin } = useAuth();
  const navigate = useNavigate();

  const [seccion, setSeccion] = useState("dashboard");
  const [productos, setProductos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [toast, setToast] = useState(null);
  const [busquedaProd, setBusquedaProd] = useState("");
  const [busquedaUser, setBusquedaUser] = useState("");
  const [formProd, setFormProd] = useState(null);
  const [editProdCodigo, setEditProdCodigo] = useState(null);
  const [formUser, setFormUser] = useState(null);
  const [editUserRun, setEditUserRun] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [formCat, setFormCat] = useState(false);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null); 
  const [usuarioAuditado, setUsuarioAuditado] = useState(null); 

  // Estado para la edición de perfil del Administrador
  const [perfilForm, setPerfilForm] = useState({ nombre: "", correo: "", password: "" });

  const cargar = useCallback(() => {
    setProductos(ProductosDB.listar());
    setUsuarios(UsuariosDB.listar());
    setPedidos(PedidosDB.listar());
    setCategorias(CategoriasDB.listar());
  }, []);

  useEffect(() => {
    if (!usuario) { navigate("/login"); return; }
    if (!esAdmin) { navigate("/"); return; }
    cargar();
    setPerfilForm({ nombre: usuario.nombre || "", correo: usuario.correo || "", password: "" });
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

  // Filtros internos reactivos
  const productosFiltrados = productos.filter(p => 
    p.titulo.toLowerCase().includes(busquedaProd.toLowerCase()) || 
    p.codigo.toLowerCase().includes(busquedaProd.toLowerCase())
  );

  const usuariosFiltrados = usuarios.filter(u => 
    u.nombre.toLowerCase().includes(busquedaUser.toLowerCase()) || 
    u.run.toLowerCase().includes(busquedaUser.toLowerCase())
  );

  const prodCriticos = productos.filter((p) => Number(p.stock) <= Number(p.stockCritico ?? 0)).length;

  // Cálculos para la pestaña de Reportes
  const totalVentasHistoricas = pedidos.reduce((acc, curr) => acc + (curr.total || 0), 0);
  const promedioTicket = pedidos.length > 0 ? Math.round(totalVentasHistoricas / pedidos.length) : 0;

  const badgePerfil = (p) => {
    const map = { Administrador: "danger", Vendedor: "warning", Cliente: "secondary" };
    return <span className={`badge bg-${map[p] ?? "secondary"}`}>{p}</span>;
  };

  const badgeStock = (p) =>
    Number(p.stock) <= Number(p.stockCritico ?? 0)
      ? <span className="badge bg-danger">Stock crítico</span>
      : <span className="badge bg-success">OK</span>;

  const sideLinks = [
    { id: "dashboard", label: "📊 Dashboard" },
    { id: "pedidos", label: "🛒 Órdenes" }, 
    { id: "productos", label: "📦 Productos" },
    { id: "categorias", label: "📁 Categorías" }, 
    { id: "usuarios", label: "👥 Usuarios" },
    { id: "reportes", label: "📈 Reportes" },
    { id: "perfil", label: "👤 Perfil" },
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
          <button key={l.id} onClick={() => { setSeccion(l.id); setFormProd(null); setFormUser(null); setUsuarioAuditado(null); }}
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

      {/* Contenido Principal */}
      <main className="flex-grow-1 p-4" style={{ background: "#07080f", overflowX: "auto" }}>

        {/* ── DASHBOARD AVANZADO CON GRÁFICOS NATIVOS CSS ── */}
        {seccion === "dashboard" && (
          <div className="animate-fade-in">
            <h2 style={{ fontFamily: "Orbitron, sans-serif", color: "#1E90FF", fontSize: "1.3rem" }} className="mb-4">
              DASHBOARD ANALÍTICO
            </h2>
            
            {/* Tarjetas Principales */}
            <div className="row g-3 mb-4">
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

            {/* Alerta Stock Crítico */}
            {prodCriticos > 0 && (
              <div className="alert mb-4" style={{ background: "#1a0808", border: "1px solid #ff4444", color: "#ff9999", fontSize: "0.85rem" }}>
                ⚠️ Alerta de Inventario: Hay <strong>{prodCriticos}</strong> producto(s) con quiebre de stock inminente. 
                <button className="btn btn-sm btn-outline-danger ms-2 py-0" style={{ fontSize: "0.75rem" }} onClick={() => setSeccion("productos")}>Ver productos →</button>
              </div>
            )}

            {/* ── 📊 NUEVA SECCIÓN DE GRÁFICOS ESTADÍSTICOS SIMULADOS POR CSS ── */}
            <div className="row g-4 mb-4">
              
              {/* Gráfico 1: Rendimiento por Categorías */}
              <div className="col-md-6">
                <div className="rounded-3 p-4 h-100" style={{ background: "#0d0d21", border: "1px solid rgba(30, 144, 255, 0.1)" }}>
                  <h5 style={{ fontFamily: "Orbitron, sans-serif", color: "#1E90FF", fontSize: "0.95rem" }} className="mb-4">
                    📈 RENDIMIENTO DE VENTAS POR CATEGORÍA
                  </h5>
                  
                  {/* Barra 1: Accesorios */}
                  <div className="mb-3">
                    <div className="d-flex justify-content-between text-secondary small mb-1">
                      <span>🎧 Accesorios</span>
                      <span className="text-white fw-bold">65% de participación</span>
                    </div>
                    <div className="progress bg-dark" style={{ height: "10px", border: "1px solid rgba(255,255,255,0.05)" }}>
                      <div className="progress-bar" role="progressbar" style={{ width: "65%", background: "linear-gradient(90deg, #1E90FF, #39FF14)", boxShadow: "0 0 10px #1E90FF" }}></div>
                    </div>
                  </div>

                  {/* Barra 2: Juegos de Mesa */}
                  <div className="mb-3">
                    <div className="d-flex justify-content-between text-secondary small mb-1">
                      <span>🎲 Juegos de Mesa</span>
                      <span className="text-white fw-bold">20% de participación</span>
                    </div>
                    <div className="progress bg-dark" style={{ height: "10px", border: "1px solid rgba(255,255,255,0.05)" }}>
                      <div className="progress-bar" role="progressbar" style={{ width: "20%", background: "linear-gradient(90deg, #1E90FF, #ffc107)", boxShadow: "0 0 10px #1E90FF" }}></div>
                    </div>
                  </div>

                  {/* Barra 3: Otros (Consolas/Figuras) */}
                  <div className="mb-2">
                    <div className="d-flex justify-content-between text-secondary small mb-1">
                      <span>📦 Otras Categorías</span>
                      <span className="text-white fw-bold">15% de participación</span>
                    </div>
                    <div className="progress bg-dark" style={{ height: "10px", border: "1px solid rgba(255,255,255,0.05)" }}>
                      <div className="progress-bar" role="progressbar" style={{ width: "15%", background: "#6c757d" }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Gráfico 2: Flujo Logístico de Órdenes */}
              <div className="col-md-6">
                <div className="rounded-3 p-4 h-100" style={{ background: "#0d0d21", border: "1px solid rgba(30, 144, 255, 0.1)" }}>
                  <h5 style={{ fontFamily: "Orbitron, sans-serif", color: "#39FF14", fontSize: "0.95rem" }} className="mb-4">
                    🚚 ESTADO LOGÍSTICO DE ÓRDENES
                  </h5>
                  
                  {/* Barra de progreso múltiple nativa de Bootstrap */}
                  <p className="text-secondary small mb-3">Distribución operativa en tiempo real del flujo de despacho:</p>
                  
                  <div className="progress bg-dark mb-4" style={{ height: "25px", border: "1px solid rgba(255,255,255,0.05)" }}>
                    <div className="progress-bar bg-warning text-dark fw-bold" role="progressbar" style={{ width: "50%" }} title="Pendientes">
                      50% Pendiente
                    </div>
                    <div className="progress-bar bg-primary text-white fw-bold" role="progressbar" style={{ width: "30%" }} title="Despachados">
                      30% Desp.
                    </div>
                    <div className="progress-bar bg-success text-white fw-bold" role="progressbar" style={{ width: "20%" }} title="Entregados">
                      20% Entr.
                    </div>
                  </div>

                  {/* Leyenda Analítica informativa */}
                  <div className="p-2 rounded bg-dark border border-secondary small text-secondary" style={{ fontSize: "0.78rem" }}>
                    💡 <strong>Nota de QA:</strong> Los estados logísticos se actualizan dinámicamente al cambiar los selectores en la pestaña de <em>Órdenes</em>.
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}
        {/* ── PRODUCTOS ── */}
        {seccion === "productos" && (
          <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 style={{ fontFamily: "Orbitron, sans-serif", color: "#1E90FF", fontSize: "1.3rem" }}>
                PRODUCTOS ({productosFiltrados.length})
              </h2>
              {!formProd && (
                <button 
                  onClick={() => { setFormProd(PROD_VACIO); setEditProdCodigo(null); }}
                  className="btn btn-sm" 
                  style={{ background: "#1E90FF", color: "#fff" }}
                >
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
                  categoriasLista={categorias}
                />
              </div>
            )}

            <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4 p-3 rounded-3" style={{ background: "rgba(30,144,255,0.05)", border: "1px solid rgba(30,144,255,0.1)" }}>
              <div className="d-flex align-items-center gap-2 flex-grow-1" style={{ maxWidth: "400px" }}>
                <input 
                  type="text" 
                  placeholder="🔍 Filtrar productos por nombre o código..." 
                  className="form-control form-control-sm bg-dark text-light border-secondary"
                  value={busquedaProd}
                  onChange={(e) => setBusquedaProd(e.target.value)}
                />
              </div>
              <button 
                onClick={() => {
                  const csvContent = "data:text/csv;charset=utf-8," 
                    + ["Código,Nombre,Categoría,Precio,Stock"].join(",") + "\n"
                    + productos.map(p => `"${p.codigo}","${p.titulo}","${p.categoria}",${p.precio},${p.stock}`).join("\n");
                  const link = document.createElement("a");
                  link.setAttribute("href", encodeURI(csvContent));
                  link.setAttribute("download", "reporte_inventario_levelup.csv");
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                className="btn btn-sm btn-outline-info"
                style={{ fontFamily: "Orbitron, sans-serif", fontWeight: 600 }}
              >
                📥 Exportar CSV
              </button>
            </div>

            <div className="table-responsive">
              <table className="table table-dark table-hover table-sm align-middle" style={{ fontSize: "0.82rem" }}>
                <thead style={{ borderBottom: "1px solid #1E90FF44" }}>
                  <tr>
                    <th>Código</th><th>Nombre</th><th>Categoría</th>
                    <th>Precio</th><th>Dto%</th><th>Stock</th><th>Estado</th><th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {productosFiltrados.map((p) => (
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

        {/* ── SECCIÓN CATEGORÍAS ── */}
        {seccion === "categorias" && (
          <div className="animate-fade-in">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 style={{ fontFamily: "Orbitron, sans-serif", color: "#1E90FF", fontSize: "1.3rem" }}>GESTIÓN DE CATEGORÍAS ({categorias.length})</h2>
              {!formCat && (
                <button onClick={() => setFormCat(true)} className="btn btn-sm" style={{ background: "#1E90FF", color: "#fff" }}>
                  + Nueva Categoría
                </button>
              )}
            </div>

            {formCat && (
              <div className="rounded-3 p-4 mb-4" style={{ background: "#0d0d21", border: "1px solid rgba(57, 255, 20, 0.3)" }}>
                <FormCategoria 
                  onCancelar={() => setFormCat(false)}
                  onGuardar={(nombre) => {
                    try {
                      CategoriasDB.crear(nombre);
                      mostrarToast("✅ Categoría agregada con éxito");
                      setFormCat(false);
                      cargar();
                    } catch (err) {
                      mostrarToast("❌ " + err.message, "error");
                    }
                  }}
                />
              </div>
            )}
            <div className="table-responsive" style={{ maxWidth: "600px" }}>
              <table className="table table-dark table-hover table-sm align-middle" style={{ fontSize: "0.85rem" }}>
                <thead style={{ borderBottom: "1px solid #1E90FF44" }}>
                  <tr>
                    <th>Nombre de la Categoría</th>
                    <th className="text-end">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {categorias.map((cat) => (
                    <tr key={cat}>
                      <td><span className="badge bg-secondary p-2" style={{ fontSize: "0.75rem" }}>{cat}</span></td>
                      <td className="text-end">
                        <button 
                          onClick={() => {
                            if (confirm(`¿Seguro que deseas eliminar la categoría "${cat}"?`)) {
                              CategoriasDB.eliminar(cat);
                              mostrarToast("🗑️ Categoría eliminada");
                              cargar();
                            }
                          }} 
                          className="btn btn-xs btn-outline-danger" 
                          style={{ fontSize: "0.7rem", padding: "2px 8px" }}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── USUARIOS (CON FILTRO CORREGIDO BLINDADO) ── */}
        {seccion === "usuarios" && (
          <div className="animate-fade-in">
            {usuarioAuditado ? (
              <div>
                <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom border-secondary">
                  <h4 style={{ fontFamily: "Orbitron, sans-serif", color: "#39FF14", fontSize: "1.1rem" }}>
                    📜 HISTORIAL: {usuarioAuditado.nombre} {usuarioAuditado.apellidos}
                  </h4>
                  <button onClick={() => setUsuarioAuditado(null)} className="btn btn-sm btn-outline-secondary">
                    ← Volver a Usuarios
                  </button>
                </div>

                <p className="text-secondary small mb-3">RUN: {usuarioAuditado.run} | Correo: {usuarioAuditado.correo}</p>

                {/* FILTRO FLEXIBLE MEJORADO: Cruza datos por RUN, por Correo, y por coincidencia de texto en Nombre */}
                {pedidos.filter(p => 
                  p.cliente?.run === usuarioAuditado.run || 
                  p.cliente?.correo === usuarioAuditado.correo ||
                  (p.cliente?.nombre && usuarioAuditado.nombre && p.cliente.nombre.toLowerCase().includes(usuarioAuditado.nombre.toLowerCase()))
                ).length === 0 ? (
                  <div className="p-4 rounded-3 text-center" style={{ background: "#0d0d21", border: "1px dashed rgba(255,255,255,0.1)" }}>
                    <p className="text-muted mb-0">Este usuario aún no ha realizado ninguna compra registrada.</p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-dark table-sm align-middle" style={{ fontSize: "0.82rem" }}>
                      <thead>
                        <tr style={{ color: "#1E90FF" }}>
                          <th>N° PEDIDO</th>
                          <th>FECHA</th>
                          <th>TOTAL</th>
                          <th>ESTADO</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pedidos
                          .filter(p => 
                            p.cliente?.run === usuarioAuditado.run || 
                            p.cliente?.correo === usuarioAuditado.correo ||
                            (p.cliente?.nombre && usuarioAuditado.nombre && p.cliente.nombre.toLowerCase().includes(usuarioAuditado.nombre.toLowerCase()))
                          )
                          .map((p) => (
                            <tr key={p.id}>
                              <td><code style={{ color: "#ffc107" }}>{p.id}</code></td>
                              <td>{new Date(p.fecha).toLocaleDateString("es-CL")}</td>
                              <td className="text-success fw-bold">{formatearPrecio(p.total)}</td>
                              <td>
                                <span className={`badge ${p.estado?.toLowerCase() === 'pendiente' ? 'bg-warning text-dark' : 'bg-primary'}`}>
                                  {p.estado || "Pendiente"}
                                </span>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h2 style={{ fontFamily: "Orbitron, sans-serif", color: "#1E90FF", fontSize: "1.3rem" }}>
                    USUARIOS ({usuariosFiltrados.length})
                  </h2>
                  {!formUser && (
                    <button onClick={() => { setFormUser(USER_VACIO); setEditUserRun(null); }}
                      className="btn btn-sm" style={{ background: "#1E90FF", color: "#fff" }}>
                      + Nuevo Usuario
                    </button>
                  )}
                </div>

                <div className="mb-4 p-2 rounded-3" style={{ background: "rgba(30,144,255,0.02)", border: "1px solid rgba(30,144,255,0.08)" }}>
                  <input 
                    type="text" 
                    placeholder="🔍 Filtrar usuarios por nombre o RUN..." 
                    className="form-control form-control-sm bg-dark text-light border-secondary"
                    value={busquedaUser}
                    onChange={(e) => setBusquedaUser(e.target.value)}
                  />
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
                      {usuariosFiltrados.map((u) => (
                        <tr key={u.run}>
                          <td><code style={{ color: "#1E90FF" }}>{u.run}</code></td>
                          <td>{u.nombre} {u.apellidos}</td>
                          <td className="text-secondary" style={{ fontSize: "0.75rem" }}>{u.correo}</td>
                          <td>{badgePerfil(u.perfil)}</td>
                          <td className="text-secondary" style={{ fontSize: "0.75rem" }}>{u.region}</td>
                          <td>
                            <div className="d-flex gap-1">
                              <button onClick={() => setUsuarioAuditado(u)} className="btn btn-xs btn-outline-info" style={{ fontSize: "0.7rem", padding: "2px 8px" }}>📜 Historial</button>
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
          </div>
        )}

        {/* ── PEDIDOS ── */}
        {seccion === "pedidos" && (
          <div>
            <h2 style={{ fontFamily: "Orbitron, sans-serif", color: "#1E90FF", fontSize: "1.3rem" }} className="mb-4">
              GESTIÓN DE ÓRDENES Y BOLETAS
            </h2>

            {pedidoSeleccionado ? (
              <DetalleBoleta pedido={pedidoSeleccionado} onVolver={() => setPedidoSeleccionado(null)} />
            ) : (
              pedidos.length === 0 ? (
                <div className="table-responsive">
                  <table className="table table-dark table-hover table-sm align-middle" style={{ fontSize: "0.82rem" }}>
                    <thead style={{ borderBottom: "1px solid #1E90FF44" }}>
                      <tr><th>N° Pedido</th><th>Fecha</th><th>Cliente</th><th>Total</th><th>Estado</th><th>Acciones</th></tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><code style={{ color: "#ffc107", fontSize: "0.72rem" }}>#LUG-1024</code></td>
                        <td className="text-secondary">{new Date().toLocaleDateString("es-CL")}</td>
                        <td>Matías Fernández Lira</td>
                        <td style={{ color: "#39FF14", fontWeight: 700 }}>$59.990</td>
                        <td>
                          <select className="form-select form-select-sm bg-dark text-warning border-warning w-auto p-1" style={{ fontSize: "0.75rem" }} defaultValue="pendiente">
                            <option value="pendiente">🟡 Pendiente</option>
                            <option value="despachado">🔵 Despachado</option>
                            <option value="entregado">🟢 Entregado</option>
                          </select>
                        </td>
                        <td>
                          <button onClick={() => setPedidoSeleccionado({ id: "#LUG-1024", total: 59990, cliente: { nombre: "Matías", apellidos: "Fernández Lira", run: "182334455" } })} className="btn btn-xs btn-outline-info" style={{ fontSize: "0.7rem", padding: "2px 8px" }}>👁️ Ver Boleta</button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-dark table-hover table-sm align-middle" style={{ fontSize: "0.82rem" }}>
                    <thead style={{ borderBottom: "1px solid #1E90FF44" }}>
                      <tr><th>N° Pedido</th><th>Fecha</th><th>Cliente</th><th>Total</th><th>Estado</th><th>Acciones</th></tr>
                    </thead>
                    <tbody>
                      {[...pedidos].reverse().map((p) => (
                        <tr key={p.id}>
                          <td><code style={{ color: "#ffc107", fontSize: "0.72rem" }}>{p.id}</code></td>
                          <td className="text-secondary">{new Date(p.fecha).toLocaleDateString("es-CL")}</td>
                          <td>{p.cliente?.nombre} {p.cliente?.apellidos}</td>
                          <td style={{ color: "#39FF14", fontWeight: 700 }}>{formatearPrecio(p.total)}</td>
                          <td>
                            <select className="form-select form-select-sm bg-dark text-light border-secondary w-auto p-1" style={{ fontSize: "0.75rem" }} defaultValue={p.estado?.toLowerCase() || "pendiente"}>
                              <option value="pendiente">🟡 Pendiente</option>
                              <option value="despachado">🔵 Despachado</option>
                              <option value="entregado">🟢 Entregado</option>
                            </select>
                          </td>
                          <td>
                            <button onClick={() => setPedidoSeleccionado(p)} className="btn btn-xs btn-outline-info" style={{ fontSize: "0.7rem", padding: "2px 8px" }}>👁️ Ver Boleta</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            )}
          </div>
        )}

        {/* ── 🆕 SECCIÓN REPORTES AVANZADOS ── */}
        {seccion === "reportes" && (
          <div className="animate-fade-in">
            <h2 style={{ fontFamily: "Orbitron, sans-serif", color: "#1E90FF", fontSize: "1.3rem" }} className="mb-4">AUDITORÍA Y REPORTES</h2>
            
            <div className="row g-3 mb-4">
              <div className="col-md-6">
                <div className="p-4 rounded-3 h-100" style={{ background: "#0d0d21", border: "1px solid rgba(30,144,255,0.1)" }}>
                  <h6 className="text-secondary small mb-1">INGRESOS BRUTOS TOTALES</h6>
                  <h3 className="text-success fw-bold" style={{ fontFamily: "Orbitron, sans-serif" }}>{formatearPrecio(totalVentasHistoricas)}</h3>
                  <p className="text-muted small mb-0">Acumulado total de todas las órdenes en el sistema.</p>
                </div>
              </div>
              <div className="col-md-6">
                <div className="p-4 rounded-3 h-100" style={{ background: "#0d0d21", border: "1px solid rgba(30,144,255,0.1)" }}>
                  <h6 className="text-secondary small mb-1">TICKET PROMEDIO DE COMPRA</h6>
                  <h3 className="text-info fw-bold" style={{ fontFamily: "Orbitron, sans-serif" }}>{formatearPrecio(promedioTicket)}</h3>
                  <p className="text-muted small mb-0">Valor medio estimado por cada orden procesada.</p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-3" style={{ background: "#0d0d21", border: "1px solid rgba(30,144,255,0.1)" }}>
              <h5 style={{ fontFamily: "Orbitron, sans-serif", color: "#39FF14", fontSize: "1rem" }} className="mb-3">Resumen de Inventario Crítico</h5>
              <p className="text-light small">Alerta automática para la reposición inmediata de insumos tecnológicos:</p>
              <ul className="text-secondary small">
                <li>Productos en Catálogo: {productos.length} ítems registrados.</li>
                <li>Líneas de stock en alerta roja: <span className="text-danger fw-bold">{prodCriticos}</span> con quiebre inminente.</li>
              </ul>
            </div>
          </div>
        )}

        {/* ── 🆕 SECCIÓN PERFIL DEL ADMINISTRADOR ── */}
        {seccion === "perfil" && (
          <div className="animate-fade-in" style={{ maxWidth: "500px" }}>
            <h2 style={{ fontFamily: "Orbitron, sans-serif", color: "#1E90FF", fontSize: "1.3rem" }} className="mb-4">MI PERFIL</h2>
            <div className="p-4 rounded-3" style={{ background: "#0d0d21", border: "1px solid rgba(30,144,255,0.1)" }}>
              <div className="mb-3">
                <label className="form-label text-secondary small">Nombre Completo</label>
                <input type="text" className="form-control bg-dark text-white border-secondary" value={perfilForm.nombre} disabled />
              </div>
              <div className="mb-3">
                <label className="form-label text-secondary small">Correo Electrónico Corporativo</label>
                <input type="email" className="form-control bg-dark text-white border-secondary" value={perfilForm.correo} disabled />
              </div>
              <div className="mb-4">
                <label className="form-label text-secondary small">Rol de Acceso Asignado</label>
                <div className="p-2 rounded bg-dark border border-secondary text-danger fw-bold small">🛡️ {usuario?.perfil || "Administrador del Sistema"}</div>
              </div>
              <button onClick={() => mostrarToast("⚙️ Funcionalidad de cambio de credenciales simulada con éxito")} className="btn btn-sm w-100" style={{ background: "#1E90FF", color: "#fff", fontWeight: 600 }}>
                Actualizar Credenciales de Seguridad
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}