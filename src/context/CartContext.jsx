import { createContext, useContext, useState, useCallback } from "react";
import { CarritoDB, ProductosDB } from "../data/db.js";
import { formatearPrecio, calcularPrecioConDescuento } from "../data/productos.js";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => CarritoDB.obtener());

  const refrescar = useCallback(() => setItems(CarritoDB.obtener()), []);

  const agregar = useCallback((codigo, cantidad = 1) => {
    CarritoDB.agregar(codigo, cantidad);
    refrescar();
  }, [refrescar]);

  const actualizar = useCallback((codigo, cantidad) => {
    CarritoDB.actualizar(codigo, cantidad);
    refrescar();
  }, [refrescar]);

  const eliminar = useCallback((codigo) => {
    CarritoDB.eliminar(codigo);
    refrescar();
  }, [refrescar]);

  const vaciar = useCallback(() => {
    CarritoDB.vaciar();
    refrescar();
  }, [refrescar]);

  // Enriquecer cada item con los datos del producto
  const itemsEnriquecidos = items.map((item) => {
    const prod = ProductosDB.buscarPorCodigo(item.codigo);
    if (!prod) return null;
    const precioFinal = calcularPrecioConDescuento(prod.precio, prod.descuento);
    return { ...item, producto: prod, precioFinal, subtotal: precioFinal * item.cantidad };
  }).filter(Boolean);

  const cantidadTotal = items.reduce((acc, i) => acc + i.cantidad, 0);
  const total = itemsEnriquecidos.reduce((acc, i) => acc + i.subtotal, 0);

  return (
    <CartContext.Provider value={{
      items: itemsEnriquecidos,
      cantidadTotal,
      total,
      totalFormateado: formatearPrecio(total),
      agregar,
      actualizar,
      eliminar,
      vaciar,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de CartProvider");
  return ctx;
};
