import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { PedidosDB } from "../data/db.js";
import { formatearPrecio } from "../data/productos.js";

export default function CheckoutExito() {
  const [params] = useSearchParams();
  const pedido = PedidosDB.buscarPorId(params.get("id"));
  
  const [enviandoCorreo, setEnviandoCorreo] = useState(false);
  const [correoEnviado, setCorreoEnviado] = useState(false);

  const handleImprimir = () => {
    window.print();
  };

  const handleEnviarCorreo = () => {
    if (!pedido?.cliente?.correo) return;
    
    setEnviandoCorreo(true);
    setTimeout(() => {
      setEnviandoCorreo(false);
      setCorreoEnviado(true);
      setTimeout(() => setCorreoEnviado(false), 5000);
    }, 2000);
  };

  // Cálculos financieros dinámicos basados en la imagen corporativa
  const total = pedido?.total || 0;
  const neto = Math.round(total / 1.19);
  const iva = total - neto;

  return (
    <div className="container py-5 text-center">
      
      {/* ── 🖨️ ESTILOS CSS INYECTADOS ADAPTADOS AL FORMATO CORPORATIVO ── */}
      <style>{`
        /* Estilos en Pantalla (Modo Oscuro Cyberpunk para mantener la estética del sitio) */
        .factura-corporativa {
          background: #ffffff !important;
          color: #212529 !important;
          font-family: 'Segoe UI', Arial, sans-serif;
          border-top: 8px solid #3b5998 !important;
        }
        .factura-corporativa th {
          background-color: #3b5998 !important;
          color: #ffffff !important;
          font-size: 0.85rem;
          text-transform: uppercase;
        }
        .factura-header-title {
          color: #3b5998;
          font-family: 'Orbitron', sans-serif;
          font-weight: 700;
        }
        .seccion-azul {
          background-color: #3b5998 !important;
          color: #ffffff !important;
          font-weight: bold;
          font-size: 0.85rem;
          padding: 4px 8px;
        }

        /* Reglas de Impresión Limpia Nativas */
        @media print {
          nav, footer, .btn, button, a, p.lead, h1.cyber-title, .alert, .no-print {
            display: none !important;
          }
          body, main, html, .container {
            background: #ffffff !important;
            color: #000000 !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .factura-corporativa {
            display: block !important;
            border: 1px solid #dee2e6 !important;
            border-top: 8px solid #3b5998 !important;
            padding: 20px !important;
            box-shadow: none !important;
            width: 100% !important;
            max-width: 100% !important;
          }
          .factura-corporativa th {
            background-color: #3b5998 !important;
            color: #ffffff !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .seccion-azul {
            background-color: #3b5998 !important;
            color: #ffffff !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
      `}</style>

      <div style={{ maxWidth: 750, margin: "0 auto" }}>
        
        {/* Encabezado interactivo de la página */}
        <div className="no-print">
          <div style={{ fontSize: "4rem", marginBottom: 12, animation: "pulse 1s ease" }}>🎉</div>
          <h1 className="cyber-title" style={{ fontFamily: "Orbitron, sans-serif", color: "#39FF14", fontSize: "2rem" }}>
            ¡COMPRA PROCESADA!
          </h1>
          <p className="text-secondary mb-4 lead">
            Tu comprobante ha sido generado con el estándar de orden de compra corporativo.
          </p>

          {correoEnviado && (
            <div className="alert alert-success text-start mb-4 py-2 small" style={{ border: "1px solid #39FF14" }}>
              ✅ ¡Documento digital despachado a <strong>{pedido?.cliente?.correo}</strong>!
            </div>
          )}
        </div>

        {pedido && (
          <>
            {/* ── 📄 INICIO DE LA ORDEN DE COMPRA DISEÑO DE TU IMAGEN ── */}
            <div id="boleta-imprimible" className="factura-corporativa rounded-3 p-4 mb-4 text-start shadow-lg bg-white text-dark">
              
              {/* Bloque Superior: Datos Empresa vs Datos Documento */}
              <div className="row mb-4">
                <div className="col-7">
                  <h4 className="factura-header-title m-0">LEVEL-UP GAMER</h4>
                  <small className="text-muted d-block fw-bold">Soluciones Tecnológicas Gamer SpA</small>
                  <div className="text-secondary small mt-2" style={{ fontSize: "0.8rem", lineHeight: "1.3" }}>
                    <strong>Rut:</strong> 76.543.210-K<br />
                    <strong>Dirección:</strong> Av. Ejército Libertador 441, Santiago<br />
                    <strong>Teléfono:</strong> +56 2 2345 6789<br />
                    <strong>Correo:</strong> contacto@levelupgamer.cl<br />
                    <strong>Sitio Web:</strong> www.levelupgamer.cl
                  </div>
                </div>
                <div className="col-5 text-end">
                  <h3 className="fw-bold text-uppercase m-0" style={{ color: "#3b5998", letterSpacing: "1px" }}>ORDEN DE COMPRA</h3>
                  <div className="mt-2 p-2 border border-secondary rounded text-center d-inline-block" style={{ minWidth: "180px", background: "#f8f9fa" }}>
                    <div className="small text-muted"><strong>Fecha:</strong> {new Date(pedido.fecha).toLocaleDateString("es-CL")}</div>
                    <hr className="my-1" />
                    <div className="small text-danger fw-bold">N° {pedido.id?.replace(/\D/g, "") || "123456"}</div>
                  </div>
                </div>
              </div>

              {/* Bloque SEÑORES (Datos del Cliente Comprador) */}
              <div className="mb-4">
                <div className="seccion-azul text-uppercase">SEÑORES:</div>
                <div className="p-2 border border-top-0 rounded-bottom bg-light text-dark" style={{ fontSize: "0.85rem", lineHeight: "1.4" }}>
                  <div><strong>Nombre / Razón Social:</strong> {pedido.cliente?.nombre} {pedido.cliente?.apellidos}</div>
                  <div><strong>Contacto / Correo:</strong> {pedido.cliente?.correo || "No registrado"}</div>
                  <div><strong>Destino de Entrega:</strong> {pedido.envio?.direccion}, {pedido.envio?.comuna}, {pedido.envio?.region}</div>
                  <div><strong>Método de Pago Seleccionado:</strong> <span className="badge bg-dark text-uppercase">{pedido.metodoPago || "Débito"}</span></div>
                </div>
              </div>

              {/* Tabla Principal del Detalle Fiel a la Imagen */}
              <div className="table-responsive mb-3">
                <table className="table table-bordered table-sm align-middle m-0" style={{ fontSize: "0.85rem" }}>
                  <thead>
                    <tr>
                      <th style={{ width: "15%" }} className="text-center">ARTÍCULO #</th>
                      <th style={{ width: "45%" }}>DESCRIPCIÓN</th>
                      <th style={{ width: "10%" }} className="text-center">CANT</th>
                      <th style={{ width: "15%" }} className="text-end">PRECIO UNIT.</th>
                      <th style={{ width: "15%" }} className="text-end">TOTAL</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pedido.items.map((item, index) => (
                      <tr key={index}>
                        <td className="text-center text-muted font-monospace" style={{ fontSize: "0.75rem" }}>
                          {item.codigo || `PROD-0${index + 1}`}
                        </td>
                        <td className="fw-bold text-truncate" style={{ maxWidth: "250px" }}>
                          {item.titulo}
                        </td>
                        <td className="text-center">{item.cantidad}</td>
                        <td className="text-end">{formatearPrecio(item.precio)}</td>
                        <td className="text-end fw-bold">{formatearPrecio(item.precio * item.cantidad)}</td>
                      </tr>
                    ))}
                    {/* Filas vacías decorativas para simular la grilla contable de tu imagen */}
                    {[...Array(Math.max(1, 3 - pedido.items.length))].map((_, i) => (
                      <tr key={`v-${i}`} style={{ height: "26px" }}>
                        <td></td><td></td><td></td><td></td><td></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Sección Inferior de Comentarios e Instrucciones junto al Bloque Contable */}
              <div className="row align-items-start">
                <div className="col-6">
                  <div className="border rounded p-2 bg-light text-muted" style={{ fontSize: "0.75rem", minHeight: "90px" }}>
                    <strong>Comentarios o instrucciones especiales:</strong><br />
                    El despacho tecnológico se procesará dentro de las próximas 48 horas hábiles. Comprobante electrónico válido para validar garantía legal de hardware en sucursales.
                  </div>
                </div>
                <div className="col-6 ms-auto">
                  <table className="table table-bordered table-sm m-0 text-dark" style={{ fontSize: "0.85rem", fontWeight: "600" }}>
                    <tbody>
                      <tr>
                        <td className="text-muted bg-light" style={{ width: "60%" }}>NETO:</td>
                        <td className="text-end" style={{ width: "40%" }}>{formatearPrecio(neto)}</td>
                      </tr>
                      <tr>
                        <td className="text-muted bg-light">I.V.A. 19%:</td>
                        <td className="text-end">{formatearPrecio(iva)}</td>
                      </tr>
                      <tr style={{ fontSize: "0.95rem" }}>
                        <td className="text-white bg-primary">TOTAL:</td>
                        <td className="text-end text-primary fw-bold bg-light">{formatearPrecio(total)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
            {/* ── 📄 FIN DE LA ORDEN DE COMPRA ── */}

            {/* Panel Control de Operaciones inferior */}
            <div className="d-flex gap-2 justify-content-center mb-4 no-print">
              <button onClick={handleImprimir} className="btn btn-sm btn-danger px-4 py-2" style={{ fontFamily: "Orbitron, sans-serif", fontWeight: 600 }}>
                📄 Imprimir Orden en PDF
              </button>
              <button onClick={handleEnviarCorreo} disabled={enviandoCorreo} className="btn btn-sm btn-success px-4 py-2" style={{ fontFamily: "Orbitron, sans-serif", fontWeight: 600 }}>
                {enviandoCorreo ? "⏳ Despachando..." : "✉️ Enviar por Correo"}
              </button>
            </div>
          </>
        )}

        <div className="d-flex gap-3 justify-content-center flex-wrap no-print mt-2">
          <Link to="/" className="btn btn-sm btn-primary px-4 py-2" style={{ fontFamily: "Orbitron, sans-serif", fontWeight: 700 }}>
            Volver al Home
          </Link>
          <Link to="/productos" className="btn btn-sm btn-outline-light px-4 py-2" style={{ fontFamily: "Orbitron, sans-serif" }}>
            Seguir comprando
          </Link>
        </div>
      </div>
    </div>
  );
}