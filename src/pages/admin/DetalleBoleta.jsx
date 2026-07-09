import { formatearPrecio } from "../../data/productos.js";

export default function DetalleBoleta({ pedido, onVolver }) {
  if (!pedido) return null;

  // Cálculos financieros estándar para Chile
  const total = pedido.total || 0;
  const neto = Math.round(total / 1.19);
  const iva = total - neto;

  return (
    <div className="animate-fade-in p-4 rounded-3" style={{ background: "#060612", border: "1px solid #ffc107" }}>
      {/* Cabecera de Control */}
      <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom border-secondary">
        <button onClick={onVolver} className="btn btn-sm btn-outline-secondary" style={{ fontFamily: "Orbitron, sans-serif" }}>
          ← Volver al Listado
        </button>
        <span className="badge bg-warning text-dark px-3 py-2 fw-bold" style={{ fontFamily: "Orbitron, sans-serif", letterSpacing: "1px" }}>
          COMPROBANTE ELECTRÓNICO
        </span>
      </div>

      {/* 🧾 DISEÑO DE LA BOLETA CHILENA SIMULADA */}
      <div className="mx-auto p-4 bg-white text-dark rounded shadow-lg" style={{ maxWidth: "500px", fontFamily: "Courier New, monospace", borderTop: "8px solid #ff4444" }}>
        
        {/* Encabezado Fiscal */}
        <div className="text-center mb-3">
          <h5 className="fw-bold m-0" style={{ letterSpacing: "1px" }}>LEVEL-UP GAMER SPA</h5>
          <small className="d-block fw-bold text-danger">R.U.T.: 76.543.210-K</small>
          <small className="d-block fw-bold text-danger">BOLETA ELECTRÓNICA Nº {pedido.id?.replace(/\D/g, "") || "1024"}</small>
          <small className="d-block text-muted">S.I.I. - SANTIAGO METROPOLITANA</small>
        </div>

        <hr className="border-dark my-2" />

        {/* Datos de Emisión */}
        <div className="small mb-3">
          <div><strong>Fecha:</strong> {new Date(pedido.fecha || Date.now()).toLocaleDateString("es-CL")}</div>
          <div><strong>Hora:</strong> {new Date(pedido.fecha || Date.now()).toLocaleTimeString("es-CL", { hour: '2-digit', minute: '2-digit' })}</div>
          <div><strong>Cliente:</strong> {pedido.cliente?.nombre} {pedido.cliente?.apellidos}</div>
          <div><strong>RUT Cliente:</strong> {pedido.cliente?.run ? pedido.cliente.run.replace(/^(\d{1,2})(\d{3})(\d{3})([\dkK])$/, "$1.$2.$3-$4") : "N/A"}</div>
          <div><strong>Despacho:</strong> {pedido.cliente?.region || "Región Metropolitana"}</div>
        </div>

        <hr className="border-dark my-2" />

        {/* Tabla de Productos Comprados */}
        <div className="small">
          <div className="row fw-bold border-bottom border-dark pb-1 mb-1">
            <div className="col-6">DETALLE</div>
            <div className="col-2 text-center">CANT</div>
            <div className="col-4 text-end">TOTAL</div>
          </div>
          
          {pedido.items && pedido.items.length > 0 ? (
            pedido.items.map((item, idx) => (
              <div key={idx} className="row mb-1">
                <div className="col-6 text-truncate">{item.titulo || "Producto Gamer"}</div>
                <div className="col-2 text-center">x{item.cantidad || 1}</div>
                <div className="col-4 text-end">{formatearPrecio((item.precio || 0) * (item.cantidad || 1))}</div>
              </div>
            ))
          ) : (
            /* Fila de contingencia si la orden simulada no tiene ítems cargados */
            <>
              <div className="row mb-1">
                <div className="col-6">Control Xbox Series X</div>
                <div className="col-2 text-center">x1</div>
                <div className="col-4 text-end">$59.990</div>
              </div>
            </>
          )}
        </div>

        <hr className="border-dark my-2" style={{ borderStyle: "dashed" }} />

        {/* Desglose de Totales Requerido */}
        <div className="small text-end fw-bold">
          <div className="row">
            <div className="col-8 text-muted">Monto Neto:</div>
            <div className="col-4">{formatearPrecio(neto)}</div>
          </div>
          <div className="row">
            <div className="col-8 text-muted">I.V.A. 19%:</div>
            <div className="col-4">{formatearPrecio(iva)}</div>
          </div>
          <div className="row fs-6 border-top border-dark pt-1 mt-1 text-danger">
            <div className="col-8">TOTAL:</div>
            <div className="col-4">{formatearPrecio(total || 59990)}</div>
          </div>
        </div>

        {/* Timbre de Simulación */}
        <div className="text-center mt-4">
          <div className="mx-auto" style={{ width: "120px", height: "45px", border: "2px solid #ff4444", color: "#ff4444", fontSize: "0.6rem", fontWeight: "bold", padding: "4px", lineHeight: "1.1" }}>
            TIMBRE ELECTRÓNICO S.I.I.<br />
            Res. N° 80 del 2026<br />
            Verifique documento
          </div>
        </div>

      </div>
    </div>
  );
}