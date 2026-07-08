import { useEffect } from "react";

export default function Toast({ mensaje, tipo = "success", onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 2500);
    return () => clearTimeout(t);
  }, [onClose]);

  const colores = {
    success: { bg: "#000000", border: "#39FF14", color: "#39FF14" },
    error: { bg: "#000000", border: "#ff4444", color: "#ff4444" },
    info: { bg: "#000000", border: "#1E90FF", color: "#1E90FF" },
  };
  const c = colores[tipo] ?? colores.success;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        background: c.bg,
        border: `1px solid ${c.border}`,
        color: c.color,
        padding: "12px 20px",
        borderRadius: 8,
        zIndex: 9999,
        boxShadow: `0 0 20px ${c.border}44`,
        fontFamily: "sans-serif",
        fontSize: "0.9rem",
        maxWidth: 320,
        animation: "fadeInUp 0.3s ease",
      }}
    >
      {mensaje}
    </div>
  );
}
