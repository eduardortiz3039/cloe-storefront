import { useState, useEffect } from "react";
import { ThemeProvider } from "./context/ThemeContext";
import { CartProvider } from "./context/CartContext";
import { useRoute } from "./hooks/useRoute";
import Navbar        from "./components/Navbar";
import Footer        from "./components/Footer";
import HomePage      from "./pages/HomePage";
import CatalogPage   from "./pages/CatalogPage";
import ProductPage   from "./pages/ProductPage";
import LoginPage     from "./pages/LoginPage";
import CartPage      from "./pages/CartPage";
import CheckoutPage  from "./pages/CheckoutPage";

function PageWrapper({ children }) {
  useEffect(() => { window.scrollTo(0, 0); }, [children]);
  return <>{children}</>;
}

function Router() {
  const { route } = useRoute();
  if (route === "#/catalogo" || route === "#/bolsas") return <CatalogPage/>;
  if (route === "#/producto")                         return <ProductPage/>;
  if (route === "#/login" || route === "#/cuenta")    return <LoginPage/>;
  if (route === "#/carrito")                          return <CartPage/>;
  if (route === "#/checkout")                         return <CheckoutPage/>;
  return <HomePage/>;
}

export default function App() {
  return (
    <ThemeProvider>
      <CartProvider>
        <Navbar/>
        <PageWrapper><Router/></PageWrapper>
        <Footer/>
      </CartProvider>
    </ThemeProvider>
  );
}