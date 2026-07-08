import { Link } from "react-router-dom";

export const ARTICULOS_BLOG = [
  {
    id: "armado-pc",
    titulo: "Cómo armar tu PC Gamer ideal en Chile",
    categoria: "GUÍAS DE ARMADO",
    fecha: "14 JUL 2026",
    resumen: "Todo lo que necesitas saber para construir tu primera PC gamer desde cero, con presupuesto y componentes disponibles en el mercado chileno.",
    imagen: "https://todoclick.cl/modules/smartblog/images/3-large_default.jpg",
    colorCategoria: "#1E90FF",
    colorBorde: "rgba(30,144,255,0.2)",
    colorGlow: "rgba(30,144,255,0.25)",
    contenido: [
      { subtitulo: "1. Define tu presupuesto y prioridades", texto: "La regla de oro es invertir la mayor parte del presupuesto en la tarjeta gráfica y el procesador. Un error común es comprar una fuente de poder barata o de mala calidad, lo que puede dañar el resto de los componentes a largo plazo." },
      { subtitulo: "2. Componentes esenciales", texto: "Necesitarás procesador, placa madre compatible, memoria RAM en configuración Dual Channel, SSD NVMe, tarjeta gráfica, fuente de poder certificada y un gabinete con buen flujo de aire." },
      { subtitulo: "3. Periféricos que marcan la diferencia", texto: "Un mouse con sensor óptico de alta precisión, un teclado mecánico con switches adecuados y una silla ergonómica son inversiones que mejoran tu rendimiento en sesiones largas." },
      { subtitulo: "4. Ensamblaje y pruebas", texto: "Sigue el manual de tu placa madre, ten cuidado con la electricidad estática y realiza pruebas de estrés antes de instalar tus juegos para asegurarte de que todo funcione de manera estable." },
    ],
  },
  {
    id: "lanzamientos-hardware",
    titulo: "Los mejores lanzamientos de hardware gaming",
    categoria: "NOTICIAS",
    fecha: "31 MAY 2026",
    resumen: "Repaso de los lanzamientos más importantes de tarjetas gráficas, procesadores y periféricos que marcaron el 2026 para los gamers.",
    imagen: "https://www.hd-tecnologia.com/imagenes/articulos/2026/01/Las-NVIDIA-RTX-60-se-harian-esperar-y-recien-llegaria-al-mercado-en-2027.jpg",
    colorCategoria: "#39FF14",
    colorBorde: "rgba(57,255,20,0.2)",
    colorGlow: "rgba(57,255,20,0.25)",
    contenido: [
      { subtitulo: "Nuevas arquitecturas de tarjetas gráficas", texto: "Las últimas generaciones de GPU apuestan fuertemente por el trazado de rayos en tiempo real y técnicas de escalado por inteligencia artificial, permitiendo alcanzar tasas de cuadros muy superiores." },
      { subtitulo: "Procesadores más eficientes", texto: "Los fabricantes continúan optimizando sus arquitecturas para ofrecer más núcleos y mayor frecuencia, manteniendo bajo control el consumo energético y la temperatura." },
      { subtitulo: "Periféricos que vale la pena considerar", texto: "Mouses con sensores cada vez más precisos, teclados con switches personalizables y auriculares con audio espacial inmersivo se han vuelto estándares para cualquier setup competitivo." },
    ],
  },
  {
    id: "optimizacion-ram",
    titulo: "Guía completa: Optimización de memoria RAM",
    categoria: "HARDWARE",
    fecha: "18 ABR 2026",
    resumen: "La RAM es uno de los componentes más subestimados. Aprende a configurarla correctamente para sacar el máximo rendimiento de tu PC gamer.",
    imagen: "https://cdnx.jumpseller.com/fullredes/image/63451853/cv0n7vh0_8949fefc_thumbnail_4096.jpg?1747253773",
    colorCategoria: "#a020f0",
    colorBorde: "rgba(160,32,240,0.2)",
    colorGlow: "rgba(160,32,240,0.25)",
    contenido: [
      { subtitulo: "¿Por qué importa el Dual Channel?", texto: "Instalar tus módulos de RAM en configuración Dual Channel prácticamente duplica el ancho de banda disponible, lo que se traduce en mejoras notables, especialmente en procesadores con gráficos integrados." },
      { subtitulo: "Activando el XMP/EXPO en la BIOS", texto: "De fábrica, los módulos suelen funcionar a frecuencias conservadoras. Activar el perfil XMP (Intel) o EXPO (AMD) permite que la memoria alcance la frecuencia anunciada por el fabricante." },
      { subtitulo: "Cantidad recomendada según tu uso", texto: "Para gaming actual, 16 GB siguen siendo un mínimo razonable, mientras que 32 GB se han vuelto el estándar recomendado si además realizas streaming o edición de video." },
      { subtitulo: "Errores comunes a evitar", texto: "Mezclar módulos de distintas marcas, velocidades o capacidades puede generar inestabilidad. Verifica siempre la lista QVL de tu placa madre antes de comprar." },
    ],
  },
];

export default function Blogs() {
  return (
    <div>
      {/* Header */}
      <div className="py-5 text-center" style={{ background: "linear-gradient(135deg, #05050f, #0d0d25)", borderBottom: "1px solid #1E90FF22" }}>
        <div className="container py-3">
          <h1 style={{ fontFamily: "Orbitron, sans-serif", color: "#fff", fontSize: "clamp(2rem,5vw,3rem)" }}>
            BLOG GAMER
          </h1>
          <p className="text-secondary lead mb-0">Guías, noticias y análisis del mundo gaming</p>
        </div>
      </div>

      <div className="container py-5">
        <div className="row g-4">
          {ARTICULOS_BLOG.map((art) => (
            <div key={art.id} className="col-md-6 col-lg-4">
              <div className="rounded-3 overflow-hidden h-100 d-flex flex-column"
                style={{ background: "#07070c", border: `1px solid ${art.colorBorde}`, transition: "box-shadow 0.3s" }}
                onMouseEnter={(e) => e.currentTarget.style.boxShadow = `0 0 20px ${art.colorGlow}`}
                onMouseLeave={(e) => e.currentTarget.style.boxShadow = "none"}>

                {/* Imagen */}
                <div style={{ height: 200, background: "#fff", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <img src={art.imagen} alt={art.titulo}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    onError={(e) => { e.target.src = "https://via.placeholder.com/400x200?text=Blog"; }} />
                </div>

                {/* Contenido */}
                <div className="p-4 d-flex flex-column flex-grow-1">
                  <span className="badge mb-2 align-self-start"
                    style={{ background: "transparent", border: `1px solid ${art.colorCategoria}`, color: art.colorCategoria, fontSize: "0.7rem" }}>
                    {art.categoria}
                  </span>
                  <h5 className="text-white mb-2" style={{ fontFamily: "Orbitron, sans-serif", fontSize: "0.95rem", lineHeight: 1.4 }}>
                    {art.titulo}
                  </h5>
                  <p className="text-secondary small mb-3 flex-grow-1">{art.resumen}</p>
                  <div className="d-flex justify-content-between align-items-center mt-auto pt-2"
                    style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                    <span className="text-secondary" style={{ fontSize: "0.75rem" }}>{art.fecha}</span>
                    <Link to={`/blogs/${art.id}`} style={{ color: art.colorCategoria, fontSize: "0.85rem", fontWeight: 700, textDecoration: "none" }}>
                      LEER →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
