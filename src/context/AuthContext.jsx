import { createContext, useContext, useState } from "react";
import { SesionDB, UsuariosDB } from "../data/db.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => SesionDB.obtener());

  const login = (correo, password) => {
    const u = UsuariosDB.autenticar(correo, password);
    if (!u) throw new Error("Correo o contraseña incorrectos.");
    const { password: _p, ...sinPassword } = u;
    SesionDB.guardar(sinPassword);
    setUsuario(sinPassword);
    return sinPassword;
  };

  const logout = () => {
    SesionDB.cerrar();
    setUsuario(null);
  };

  const esAdmin = usuario?.perfil === "Administrador";

  return (
    <AuthContext.Provider value={{ usuario, login, logout, esAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
};
