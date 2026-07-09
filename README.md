
#  LEVEL-UP GAMER — Sistema E-Commerce & Panel Analítico

##  Descripción del Proyecto
Este repositorio contiene la solución frontend basada en **React** para la plataforma e-commerce **LEVEL-UP GAMER**, desarrollada en el marco académico del **Proyecto HEFESTOS**. El sistema implementa una arquitectura modular de componentes, persistencia reactiva de datos mediante almacenamiento local y un robusto esquema administrativo para la toma de decisiones estratégicas de negocio.

Un pilar fundamental de esta versión es su enfoque en **Aseguramiento de la Calidad (QA)** y control de fallos, implementando mecanismos preventivos para evitar la sobreventa de activos y la corrupción lógica del inventario.

---

##  Características Clave Implementadas

###  Vista Pública (E-Commerce)
*   **Catálogo Dinámico:** Filtrado adaptativo en tiempo real por categorías (incluyendo nuevas expansiones como *TCG* y *Figuras*) con contadores reactivos.
*   **Flujo Transaccional Seguro:** Carrito de compras sincronizado con el inventario simulado.
*   **Checkout Automatizado:** Formulario inteligente de contacto y despacho con autocompletado si el usuario mantiene una sesión activa.
*   **Gestión de Errores de Negocio:** Rutas dedicadas y controladas para transacciones exitosas (con desglose formal de Neto e IVA del 19%) e interfaces adaptativas para fallos del banco o quiebres de stock, eliminando el uso de códigos de error genéricos (404).

### Vista del Administrador (Back-Office)
*   **Dashboard Analítico:** Panel de control con métricas críticas e indicadores gráficos nativos en CSS/Bootstrap (Participación del mercado por categorías y estado operativo del flujo logístico).
*   **Auditoría de Clientes:** Módulo administrativo capaz de inspeccionar el historial de compras y órdenes pendientes por usuario de forma flexible.
*   **CRUD Modular Completo:** Control total e independiente sobre las bases de datos de Productos, Categorías, Órdenes y Usuarios.
*   **Motor de Reportes:** Herramientas de exportación nativa de inventarios a formato estructurado (.CSV) y generación documental de órdenes de compra en formato PDF limpio.

---

##  Arquitectura Tecnológica

*   **Frontend Library:** React (Hooks: `useState`, `useEffect`, `useCallback`, `useSearchParams`).
*   **Enrutamiento Dinámico:** React Router DOM (Esquema plano de rutas).
*   **Gestión de Estado Global:** React Context API (`CartContext`, `AuthContext`).
*   **Diseño & Estilos:** Bootstrap 5 + CSS personalizado con estética gamer minimalista y neón.
*   **Capa de Persistencia:** Base de datos simulada en JavaScript nativo integrada con `localStorage` (`db.js`).

---

##  Instrucciones de Instalación y Despliegue

Sigue estos pasos para clonar el repositorio y ejecutar el entorno de desarrollo localmente:

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/AngelBozzoT/levelupgamer-react.git


 
## Estructura del Proyecto (Árbol de Directorios)

La arquitectura del software sigue un patrón de diseño modular y limpio, separando las vistas públicas del panel administrativo y centralizando la base de datos simulada en la raíz del backend del cliente:

```text
LEVELUPGAMER-REACT/
├── public/                      # Activos públicos estáticos (Imágenes y Logotipos)
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Footer.jsx       # Pie de página global con estética gamer
│   │   │   └── Navbar.jsx       # Barra de navegación con control de sesión adaptativo
│   │   └── ui/                  # Componentes reutilizables de interfaz de usuario
│   ├── context/                 # Contextos globales de React (AuthContext, CartContext)
│   ├── data/
│   │   ├── db.js                # Capa de Persistencia (CRUD nativo en LocalStorage)
│   │   └── productos.js         # Semilla inicial de inventario y formateo de divisas
│   ├── pages/
│   │   ├── admin/               # Módulos privados de control administrativo
│   │   │   ├── DetalleBoleta.jsx
│   │   │   ├── FormCategoria.jsx
│   │   │   ├── FormProducto.jsx
│   │   │   ├── FormUsuario.jsx
│   │   │   └── Panel.jsx        # Back-Office central y Dashboard analítico
│   │   ├── BlogDetalle.jsx      # Vista extendida de artículos de la comunidad
│   │   ├── Blogs.jsx            # Muro de novedades e interacciones gamer
│   │   ├── Carrito.jsx          # Panel de confirmación de ítems seleccionados
│   │   ├── Categorias.jsx       # Separador modular de productos por categorías
│   │   ├── Checkout.jsx         # Pasarela con autocompletado y control de stock crítico
│   │   ├── CheckoutError.jsx    # Interfaz adaptativa para mitigación de fallos (QA)
│   │   ├── CheckoutExito.jsx    # Comprobante formal impreso en formato corporativo (Neto/IVA)
│   │   ├── Contacto.jsx         # Formulario de consultas institucionales
│   │   ├── Home.jsx             # Landing page principal con ofertas destacadas
│   │   ├── Login.jsx            # Autenticación y control de acceso seguro
│   │   ├── Nosotros.jsx         # Información institucional e historia corporativa
│   │   ├── Ofertas.jsx          # Liquidaciones dinámicas con cálculo de descuentos
│   │   ├── ProductoDetalle.jsx  # Ficha técnica con alertas preventivas de inventario
│   │   └── Registro.jsx         # Alta de nuevos perfiles de usuario clientes
│   ├── App.jsx                  # Enrutador principal y layouts globales de la aplicación
│   ├── index.css                # Hoja de estilos global neón-minimalista
│   └── main.jsx                 # Punto de entrada de renderizado de React en el DOM
├── .gitignore                   # Exclusiones del repositorio (node_modules, etc.)
├── .oxlintrc.json               # Configuración del linter para calidad de código
└── index.html                   # Plantilla HTML5 base