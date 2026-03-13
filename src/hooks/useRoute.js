import { useState, useEffect } from "react";

/**
 * Router hash simple sin react-router-dom.
 * En producción reemplazar por useNavigate() de react-router-dom.
 *
 * Rutas disponibles:
 *   #/           → HomePage
 *   #/catalogo   → CatalogPage
 *   #/producto   → ProductPage
 *   #/login      → LoginPage
 */
export function useRoute() {
  const [route, setRoute] = useState(() => window.location.hash || "#/");

  useEffect(() => {
    const onHash = () => setRoute(window.location.hash || "#/");
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const navigate = (path) => {
    window.location.hash = path;
  };

  return { route, navigate };
}
