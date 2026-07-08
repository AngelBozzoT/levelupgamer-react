import { useState, useEffect } from "react";
import { ProductosDB } from "../data/db.js";
import { formatearPrecio, calcularPrecioConDescuento } from "../data/productos.js";
import ProductCard from "../components/ui/ProductCard.jsx";

export default function Ofertas() {
  const [enOferta, setEnOferta] = useState([]);

  useEffect(() => {
    setEnOferta(ProductosDB.enOferta().sort((a, b) => b.descuento - a.descuento));
  }, []);

  const ahorro = enOferta.reduce((acc, p) => {
    return acc + (p.precio - calcularPrecioConDescuento(p.precio, p.descuento));
  }, 0);

  return (
    <div>
      {/* Banner hero */}
      <div className="py-5 text-center" style={{ background: "linear-gradient(135deg, #1a0500, #0d0d21)", borderBottom: "1px solid #ffc10733" }}>
        <div className="container">
          <div className="mb-2" style={{ fontSize: "3rem" }}>🔥</div>
          <h1 style={{ fontFamily: "Orbitron, sans-serif", color: "#ffc107", fontSize: "clamp(1.8rem,5vw,3rem)" }}>
            OFERTAS ESPECIALES
          </h1>
          <p className="text-secondary mb-3">Descuentos exclusivos por tiempo limitado</p>
          {enOferta.length > 0 && (
            <span className="badge bg-warning text-dark px-3 py-2" style={{ fontSize: "0.95rem" }}>
              ¡Ahorra hasta {formatearPrecio(ahorro)} en total!
            </span>
          )}
        </div>
      </div>

      <div className="container py-5">
        {enOferta.length === 0 ? (
          <div className="text-center py-5">
            <p style={{ fontSize: "3rem" }}>😔</p>
            <p className="text-secondary">No hay productos en oferta en este momento.</p>
          </div>
        ) : (
          <>
            <p className="text-secondary mb-4">
              {enOferta.length} producto{enOferta.length !== 1 ? "s" : ""} en oferta
            </p>

            {/* Tarjeta especial de oferta destacada */}
            {enOferta[0] && (
              <div className="row mb-5">
                <div className="col-12">
                  <div className="rounded-3 p-4 p-md-5 d-flex flex-column flex-md-row align-items-center gap-4"
                    style={{ background: "linear-gradient(135deg, #1a0900, #0d0d21)", border: "1px solid #ffc10744" }}>
                    <div className="rounded-3 p-3 flex-shrink-0" style={{ background: "#fff", width: 180, height: 180, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <img src={enOferta[0].imagen} alt={enOferta[0].titulo} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
                    </div>
                    <div className="flex-grow-1">
                      <span className="badge bg-danger mb-2">🔥 OFERTA DEL DÍA -{enOferta[0].descuento}%</span>
                      <h2 className="text-white" style={{ fontFamily: "Orbitron, sans-serif" }}>{enOferta[0].titulo}</h2>
                      <p className="text-secondary">{enOferta[0].descripcion}</p>
                      <div className="d-flex align-items-baseline gap-3">
                        <span className="text-secondary text-decoration-line-through">{formatearPrecio(enOferta[0].precio)}</span>
                        <span style={{ color: "#39FF14", fontFamily: "Orbitron, sans-serif", fontSize: "1.8rem", fontWeight: 700 }}>
                          {formatearPrecio(calcularPrecioConDescuento(enOferta[0].precio, enOferta[0].descuento))}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Grid de todas las ofertas */}
            <div className="row g-4">
              {enOferta.map((p) => (
                <div key={p.codigo} className="col-sm-6 col-md-4 col-lg-3">
                  <ProductCard producto={p} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
