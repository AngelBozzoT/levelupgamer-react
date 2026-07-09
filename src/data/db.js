/**
 * db.js — Capa de Persistencia (localStorage)
 * Actúa como base de datos simulada para productos, usuarios y pedidos.
 * Provee funciones CRUD completas para cada entidad.
 */

import { CATALOGO_SEMILLA } from "./productos.js";

// ─── Claves de almacenamiento ────────────────────────────────────────────────
const KEYS = {
  PRODUCTOS: "levelup_productos",
  USUARIOS: "levelup_usuarios",
  PEDIDOS: "levelup_pedidos",
  CARRITO: "levelup_carrito",
  SESION: "levelup_sesion",
};

// ─── Helpers genéricos ───────────────────────────────────────────────────────
const leer = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? null;
  } catch {
    return null;
  }
};

const escribir = (key, valor) => {
  localStorage.setItem(key, JSON.stringify(valor));
};

// ─── Semillas: inicializar datos si no existen ───────────────────────────────
export const inicializarDB = () => {
  if (!leer(KEYS.PRODUCTOS)) escribir(KEYS.PRODUCTOS, CATALOGO_SEMILLA);
  if (!leer(KEYS.USUARIOS)) escribir(KEYS.USUARIOS, USUARIOS_SEMILLA);
  if (!leer(KEYS.PEDIDOS)) escribir(KEYS.PEDIDOS, []);
  if (!leer(KEYS.CARRITO)) escribir(KEYS.CARRITO, []);
};

// ─── CRUD: Productos ─────────────────────────────────────────────────────────
export const ProductosDB = {
  listar: () => leer(KEYS.PRODUCTOS) ?? [],

  buscarPorCodigo: (codigo) =>
    (leer(KEYS.PRODUCTOS) ?? []).find((p) => p.codigo === codigo) ?? null,

  crear: (producto) => {
    const lista = leer(KEYS.PRODUCTOS) ?? [];
    if (lista.find((p) => p.codigo === producto.codigo))
      throw new Error(`El código ${producto.codigo} ya existe.`);
    lista.push({ ...producto });
    escribir(KEYS.PRODUCTOS, lista);
    return producto;
  },

  actualizar: (codigo, datos) => {
    const lista = leer(KEYS.PRODUCTOS) ?? [];
    const idx = lista.findIndex((p) => p.codigo === codigo);
    if (idx === -1) throw new Error(`Producto ${codigo} no encontrado.`);
    lista[idx] = { ...lista[idx], ...datos, codigo };
    escribir(KEYS.PRODUCTOS, lista);
    return lista[idx];
  },

  eliminar: (codigo) => {
    const lista = (leer(KEYS.PRODUCTOS) ?? []).filter(
      (p) => p.codigo !== codigo
    );
    escribir(KEYS.PRODUCTOS, lista);
  },

  buscar: (termino) => {
    const t = termino.toLowerCase();
    return (leer(KEYS.PRODUCTOS) ?? []).filter(
      (p) =>
        p.titulo.toLowerCase().includes(t) ||
        p.categoria.toLowerCase().includes(t) ||
        p.descripcion.toLowerCase().includes(t)
    );
  },

  porCategoria: (categoria) =>
    (leer(KEYS.PRODUCTOS) ?? []).filter((p) => p.categoria === categoria),

  enOferta: () =>
    (leer(KEYS.PRODUCTOS) ?? []).filter((p) => p.descuento > 0),

  stockCritico: () =>
    (leer(KEYS.PRODUCTOS) ?? []).filter(
      (p) => Number(p.stock) <= Number(p.stockCritico ?? 0)
    ),
};

// ─── CRUD: Usuarios ──────────────────────────────────────────────────────────
export const UsuariosDB = {
  listar: () => leer(KEYS.USUARIOS) ?? [],

  buscarPorRun: (run) =>
    (leer(KEYS.USUARIOS) ?? []).find((u) => u.run === run) ?? null,

  buscarPorCorreo: (correo) =>
    (leer(KEYS.USUARIOS) ?? []).find(
      (u) => u.correo.toLowerCase() === correo.toLowerCase()
    ) ?? null,

  crear: (usuario) => {
    const lista = leer(KEYS.USUARIOS) ?? [];
    if (lista.find((u) => u.run === usuario.run))
      throw new Error(`El RUN ${usuario.run} ya está registrado.`);
    lista.push({ ...usuario });
    escribir(KEYS.USUARIOS, lista);
    return usuario;
  },

  actualizar: (run, datos) => {
    const lista = leer(KEYS.USUARIOS) ?? [];
    const idx = lista.findIndex((u) => u.run === run);
    if (idx === -1) throw new Error(`Usuario ${run} no encontrado.`);
    lista[idx] = { ...lista[idx], ...datos, run };
    escribir(KEYS.USUARIOS, lista);
    return lista[idx];
  },

  eliminar: (run) => {
    const lista = (leer(KEYS.USUARIOS) ?? []).filter((u) => u.run !== run);
    escribir(KEYS.USUARIOS, lista);
  },

  autenticar: (correo, password) => {
    const usuario = UsuariosDB.buscarPorCorreo(correo);
    if (!usuario || usuario.password !== password) return null;
    return usuario;
  },
};

// ─── CRUD: Carrito ───────────────────────────────────────────────────────────
export const CarritoDB = {
  obtener: () => leer(KEYS.CARRITO) ?? [],

  guardar: (items) => escribir(KEYS.CARRITO, items),

  agregar: (codigo, cantidad = 1) => {
    const carrito = leer(KEYS.CARRITO) ?? [];
    const existente = carrito.find((i) => i.codigo === codigo);
    if (existente) {
      existente.cantidad += cantidad;
    } else {
      carrito.push({ codigo, cantidad });
    }
    escribir(KEYS.CARRITO, carrito);
    return carrito;
  },

  actualizar: (codigo, cantidad) => {
    const carrito = (leer(KEYS.CARRITO) ?? []).map((i) =>
      i.codigo === codigo ? { ...i, cantidad } : i
    );
    const filtrado = carrito.filter((i) => i.cantidad > 0);
    escribir(KEYS.CARRITO, filtrado);
    return filtrado;
  },

  eliminar: (codigo) => {
    const carrito = (leer(KEYS.CARRITO) ?? []).filter(
      (i) => i.codigo !== codigo
    );
    escribir(KEYS.CARRITO, carrito);
    return carrito;
  },

  vaciar: () => escribir(KEYS.CARRITO, []),

  total: () => {
    const carrito = leer(KEYS.CARRITO) ?? [];
    const productos = leer(KEYS.PRODUCTOS) ?? [];
    return carrito.reduce((acc, item) => {
      const prod = productos.find((p) => p.codigo === item.codigo);
      if (!prod) return acc;
      const precio = prod.descuento > 0
        ? Math.round(prod.precio * (1 - prod.descuento / 100))
        : prod.precio;
      return acc + precio * item.cantidad;
    }, 0);
  },

  cantidadTotal: () =>
    (leer(KEYS.CARRITO) ?? []).reduce((acc, i) => acc + i.cantidad, 0),
};

// ─── CRUD: Pedidos ───────────────────────────────────────────────────────────
export const PedidosDB = {
  listar: () => leer(KEYS.PEDIDOS) ?? [],

  crear: (datosPedido) => {
    const pedidos = leer(KEYS.PEDIDOS) ?? [];
    const pedido = {
      id: `PED-${Date.now()}`,
      fecha: new Date().toISOString(),
      estado: "Procesando",
      ...datosPedido,
    };
    pedidos.push(pedido);
    escribir(KEYS.PEDIDOS, pedidos);
    return pedido;
  },

  buscarPorId: (id) =>
    (leer(KEYS.PEDIDOS) ?? []).find((p) => p.id === id) ?? null,
};

// ─── Sesión ──────────────────────────────────────────────────────────────────
export const SesionDB = {
  obtener: () => leer(KEYS.SESION),
  guardar: (usuario) => escribir(KEYS.SESION, usuario),
  cerrar: () => localStorage.removeItem(KEYS.SESION),
};

// ─── Datos semilla de usuarios ───────────────────────────────────────────────
const USUARIOS_SEMILLA = [
  {
    run: "191102203",
    nombre: "Camila",
    apellidos: "Soto Reyes",
    correo: "camila.soto@gmail.com",
    password: "admin1",
    perfil: "Administrador",
    region: "Región Metropolitana",
    comuna: "Santiago",
    direccion: "Av. Libertador Bernardo O'Higgins 1234",
    fechaNacimiento: "1995-03-12",
  },
  {
    run: "182334455",
    nombre: "Matías",
    apellidos: "Fernández Lira",
    correo: "matias.fernandez@inacap.cl",
    password: "vend1",
    perfil: "Vendedor",
    region: "Valparaíso",
    comuna: "Viña del Mar",
    direccion: "Calle 5 Norte 456",
    fechaNacimiento: "1999-07-22",
  },
  {
    run: "203445566",
    nombre: "Javiera",
    apellidos: "Muñoz Pardo",
    correo: "javiera.munoz@gmail.com",
    password: "cli1",
    perfil: "Cliente",
    region: "Biobío",
    comuna: "Concepción",
    direccion: "Pasaje Los Aromos 789",
    fechaNacimiento: "",
  },
];

export const CategoriasDB = {
  listar: () => {
    const datos = localStorage.getItem("levelup_categorias");
    if (!datos) {
      // Si está vacío, cargamos las categorías iniciales por defecto de tu semilla
      const iniciales = ["Juegos de Mesa", "Accesorios", "Consolas", "Computadores Gamers", "Sillas Gamers", "Mouse", "Mousepad", "Poleras Personalizadas"];
      localStorage.setItem("levelup_categorias", JSON.stringify(iniciales));
      return iniciales;
    }
    return JSON.parse(datos);
  },
  crear: (nuevaCategoria) => {
    const actuales = CategoriasDB.listar();
    if (actuales.map(c => c.toLowerCase()).includes(nuevaCategoria.toLowerCase())) {
      throw new Error("La categoría ya existe");
    }
    actuales.push(nuevaCategoria);
    localStorage.setItem("levelup_categorias", JSON.stringify(actuales));
    return actuales;
  },
  eliminar: (categoriaAEliminar) => {
    let actuales = CategoriasDB.listar();
    actuales = actuales.filter(c => c !== categoriaAEliminar);
    localStorage.setItem("levelup_categorias", JSON.stringify(actuales));
    return actuales;
  }
};