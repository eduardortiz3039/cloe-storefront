import { useEffect } from "react";
import { ThemeProvider } from "./context/ThemeContext";
import { useRoute } from "./hooks/useRoute";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage    from "./pages/HomePage";
import CatalogPage from "./pages/CatalogPage";
import ProductPage from "./pages/ProductPage";
import LoginPage   from "./pages/LoginPage";

function PageWrapper({ children }) {
  useEffect(() => { window.scrollTo(0, 0); }, [children]);
  return <>{children}</>;
}

const DEMO_TABS = [
  ["Inicio",    "#/"],
  ["Catálogo",  "#/catalogo"],
  ["Producto",  "#/producto"],
  ["Login",     "#/login"],
];

function DemoNav() {
  const { route } = useRoute();
  return (
    <nav style={{ position:"fixed", bottom:20, left:"50%", transform:"translateX(-50%)",
      display:"flex", gap:6, background:"var(--bg)", border:"1px solid var(--border)",
      borderRadius:24, padding:"6px 8px", boxShadow:"0 4px 24px rgba(0,0,0,.12)", zIndex:9999 }}>
      {DEMO_TABS.map(([label, hash]) => {
        const active = route === hash || (hash === "#/" && (route === "#/" || route === ""));
        return (
          <a key={hash} href={hash}
            style={{ fontSize:11, fontWeight:600, letterSpacing:1.2, textTransform:"uppercase",
              padding:"7px 14px", borderRadius:18, whiteSpace:"nowrap",
              background: active ? "var(--text)" : "transparent",
              color: active ? "var(--bg)" : "var(--text3)",
              transition:"all .2s" }}>
            {label}
          </a>
        );
      })}
    </nav>
  );
}

function Router() {
  const { route } = useRoute();
  if (route === "#/catalogo" || route === "#/bolsas") return <CatalogPage />;
  if (route === "#/producto")                         return <ProductPage />;
  if (route === "#/login" || route === "#/cuenta")    return <LoginPage />;
  return <HomePage />;
}

export default function App() {
  return (
    <ThemeProvider>
      <Navbar />
      <PageWrapper><Router /></PageWrapper>
      <Footer />
      <DemoNav />   {/* ← quitar en producción */}
    </ThemeProvider>
  );
}
