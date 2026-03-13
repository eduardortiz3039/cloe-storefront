import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import ThemeToggle from "./ui/ThemeToggle";
import SearchOverlay from "./ui/SearchOverlay";
import MegaMenu from "./ui/MegaMenu";
import { SearchIcon, UserIcon, HeartIcon, BagIcon, ChevronIcon } from "./ui/Icons";

const LOGO_SRC = "/Logo_CLOE_t.png";

// ─── NAV DATA ───────────────────────────────────────────────────────
const NAV_DATA = [
  { id: "novedades", label: "Novedades", mega: { style: { gridTemplateColumns: "200px 1fr 280px", gap: "48px" }, columns: [
    { title: "Explorar", links: [{ label: "Recién llegado", badge: { text: "New", type: "new" } }, { label: "Más vendidos", badge: { text: "Top", type: "hot" } }, { label: "Colección Spring" }, { label: "Ediciones limitadas" }] },
    { title: "Por categoría", links: [{ label: "Bolsas nuevas" }, { label: "Calzado nuevo" }, { label: "Maletas nuevas" }, { label: "Accesorios nuevos" }] },
    { featured: { img: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=80", tag: "Tendencia", title: "Colores de temporada" } },
  ]}},
  { id: "bolsas", label: "Bolsas", mega: { columns: [
    { seeAll: "Ver todas →", title: "Colecciones", special: ["Ultra Ligera", "Always On", "Colaboraciones", "Tendencias"] },
    { title: "Por tipo", links: [{ label: "Tote — bolsa de hombro grande" }, { label: "Hobo — bolsa suave estructurada" }, { label: "Crossbody — cuerpo cruzado" }, { label: "Satchel — maletín con asa" }, { label: "Mochila" }, { label: "Porta laptop" }] },
    { title: "Por ocasión", links: [{ label: "Para la oficina" }, { label: "Para el día a día" }, { label: "Para salidas nocturnas" }, { label: "Para viaje" }, { label: "Para mamá — pañaleras", badge: { type: "fav" } }, { label: "Para niñas" }] },
    { featured: { img: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400&q=80", tag: "Más vendida", title: "Tote Grande — desde $1,399", maxHeight: "260px" } },
  ]}},
  { id: "calzado", label: "Calzado", mega: { style: { gridTemplateColumns: "180px 1fr 1fr 260px" }, columns: [
    { seeAll: "Ver todo →" },
    { title: "Estilo", links: [{ label: "Flats — zapato plano" }, { label: "Tacones bajos" }, { label: "Tacones altos" }, { label: "Sandalias" }, { label: "Botines" }] },
    { title: "Ocasión", links: [{ label: "Casuales" }, { label: "Trabajo" }, { label: "Fiesta" }] },
    { featured: { img: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&q=80", tag: "Spring 2026", title: "Colección primavera", maxHeight: "220px" } },
  ]}},
  { id: "maletas", label: "Maletas & Viaje", mega: { style: { gridTemplateColumns: "180px 1fr 1fr 260px" }, columns: [
    { seeAll: "Ver todo →" },
    { title: "Por tamaño", links: [{ label: "Carry-on — cabina 20\"" }, { label: "Mediana 24\"" }, { label: "Grande 28\"" }, { label: "Set de maletas" }] },
    { title: "Accesorios de viaje", links: [{ label: "Bolsas tote de viaje" }, { label: "Organizadores" }, { label: "Porta documentos" }] },
    { featured: { img: "https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?w=400&q=80", tag: "Nuevas", title: "Maletas rígidas 2026", maxHeight: "220px" } },
  ]}},
  { id: "accesorios", label: "Accesorios", mega: { style: { gridTemplateColumns: "200px 1fr 260px", gap: "48px" }, columns: [
    { seeAll: "Ver todo →" },
    { title: "Categorías", links: [{ label: "Llaveros & Charms" }, { label: "Carteras & Monederos" }, { label: "Cinturones" }, { label: "Pañoletas" }, { label: "Gift Cards", badge: { type: "gift" } }] },
    { featured: { img: "https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=400&q=80", tag: "Personaliza tu bolsa", title: "Charms & Llaveros", maxHeight: "200px" } },
  ]}},
  { id: "para-el", label: "Para él" },
  { id: "sale", label: "Sale", sale: true },
];

// ─── ANNOUNCEMENT BAR ───────────────────────────────────────────────
const ANNOUNCE_MSGS = [
  <>25% de descuento · Código <strong style={{ color: "white" }}>KUESKINUEVO25</strong> · hasta 31 de marzo 2026</>,
  <>Hasta 3 MSI en compras mayores a <strong style={{ color: "white" }}>$2,500 MXN</strong></>,
  <>Envío gratis en compras mayores a <strong style={{ color: "white" }}>$1,499 MXN</strong></>,
];

function AnnouncementBar() {
  return (
    <div style={{ background: "#111110", color: "rgba(255,255,255,.7)",
      fontSize: 11, letterSpacing: 1.8, padding: "9px 0",
      overflow: "hidden", whiteSpace: "nowrap" }}>
      <div style={{ display: "inline-block", animation: "marquee 38s linear infinite" }}>
        {[...ANNOUNCE_MSGS, ...ANNOUNCE_MSGS].map((msg, i) => (
          <span key={i} style={{ display: "inline-block", padding: "0 48px" }}>{msg}</span>
        ))}
      </div>
      <style>{`@keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}`}</style>
    </div>
  );
}

// ─── MOBILE ITEM ────────────────────────────────────────────────────
function MobileItem({ item, isOpen, onToggle }) {
  const allLinks = item.mega
    ? item.mega.columns.flatMap(col => [
        ...(col.special || []).map(s => ({ label: s })),
        ...(col.links   || []),
      ])
    : [];

  return (
    <li style={{ borderBottom: "1px solid var(--border)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px" }}>
        <a href={item.mega ? undefined : `#/${item.id}`}
          onClick={e => { if (item.mega) { e.preventDefault(); onToggle(); } }}
          style={{ display: "inline-flex", alignItems: "center", padding: "16px 0", flex: 1,
            fontSize: 11, fontWeight: 600, letterSpacing: 2.5, textTransform: "uppercase",
            color: item.sale ? "#b5342a" : "var(--text)" }}>
          {item.label}
        </a>
        {item.mega && (
          <span style={{ color: "var(--tan)" }}>
            <ChevronIcon open={isOpen} />
          </span>
        )}
      </div>
      {item.mega && (
        <div style={{ height: isOpen ? "auto" : 0, overflow: "hidden",
          transition: "height .35s cubic-bezier(.4,0,.2,1)" }}>
          <div style={{ padding: "4px 24px 20px" }}>
            <a href="#/catalogo"
              style={{ display: "inline-flex", fontSize: 10, fontWeight: 600, letterSpacing: 2,
                textTransform: "uppercase", color: "var(--text)", padding: "8px 14px",
                border: "1px solid var(--text)", borderRadius: 2, marginBottom: 16 }}>
              Ver todo →
            </a>
            {allLinks.map((link, i) => (
              <a key={i} href="#/catalogo"
                style={{ display: "block", padding: "9px 0", fontSize: 14,
                  color: "var(--text2)", borderBottom: "1px solid var(--border)" }}>
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </li>
  );
}

// ─── NAVBAR ─────────────────────────────────────────────────────────
export default function Navbar() {
  const { dark } = useTheme();
  const logoFilter     = dark ? "none" : "invert(1)";
  const [activeItem,   setActiveItem]   = useState(null);
  const [mobileOpen,   setMobileOpen]   = useState(false);
  const [openMobileItem, setOpenMobileItem] = useState(null);
  const [searchOpen,   setSearchOpen]   = useState(false);

  // ⌘K shortcut
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault(); setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Scroll lock
  useEffect(() => {
    document.body.style.overflow = (mobileOpen || searchOpen) ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen, searchOpen]);

  // Close mobile on resize
  useEffect(() => {
    const h = () => { if (window.innerWidth > 768) setMobileOpen(false); };
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);

  return (
    <>
      <AnnouncementBar />

      <nav
        style={{ background: "var(--bg)", borderBottom: "1px solid var(--border)",
          display: "flex", alignItems: "center", padding: "0 48px",
          height: "var(--nav-h,64px)", position: "sticky", top: 0, zIndex: 300,
          transition: "background .35s, border-color .35s" }}
        onMouseLeave={() => setActiveItem(null)}>

        {/* LOGO */}
        <a href="#/" style={{ display: "flex", alignItems: "center", flexShrink: 0, marginRight: 48 }}>
          <img src={LOGO_SRC} alt="CLOE"
            style={{ height: 32, width: "auto", objectFit: "contain",
              filter: logoFilter, transition: "filter .35s" }} />
        </a>

        {/* DESKTOP LINKS */}
        <ul style={{ display: "flex", listStyle: "none", flex: 1, justifyContent: "center" }}
          className="nav-links-desktop">
          {NAV_DATA.map(item => (
            <li key={item.id} style={{ position: "relative" }}
              onMouseEnter={() => setActiveItem(item.id)}
              onClick={() => setActiveItem(null)}>
              <a href={item.mega ? undefined : `#/${item.id}`}
                onClick={e => item.mega && e.preventDefault()}
                style={{ display: "inline-flex", alignItems: "center",
                  padding: "0 16px", lineHeight: "var(--nav-h,64px)",
                  fontSize: 11, fontWeight: 500, letterSpacing: 1.8,
                  textTransform: "uppercase",
                  color: item.sale ? "#b5342a" : activeItem === item.id ? "var(--tan)" : "var(--text)",
                  transition: "color .2s", position: "relative" }}>
                {item.label}
                {/* underline indicator */}
                <span style={{ position: "absolute", bottom: 0, left: 16, right: 16,
                  height: 1, background: "var(--tan)",
                  transform: activeItem === item.id ? "scaleX(1)" : "scaleX(0)",
                  transition: "transform .25s ease", transformOrigin: "left" }} />
              </a>
              {activeItem === item.id && <MegaMenu item={item} />}
            </li>
          ))}
        </ul>

        {/* DESKTOP ICONS */}
        <div style={{ display: "flex", gap: 14, alignItems: "center",
          marginLeft: "auto", flexShrink: 0 }} className="nav-icons-desktop">
          <button onClick={() => setSearchOpen(true)}
            style={{ display: "flex", alignItems: "center", gap: 8,
              background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 2,
              padding: "6px 14px", fontSize: 12, color: "var(--text3)",
              cursor: "pointer", transition: "border-color .2s", fontFamily: "inherit" }}
            onMouseEnter={e => e.currentTarget.style.borderColor = "var(--tan)"}
            onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}>
            <SearchIcon size={13} />
            <span>Buscar</span>
            <kbd style={{ background: "var(--bg3)", border: "1px solid var(--border)",
              borderRadius: 3, padding: "1px 5px", fontFamily: "inherit", fontSize: 9,
              color: "var(--text3)" }}>⌘K</kbd>
          </button>
          <ThemeToggle />
          <a href="#/cuenta" title="Cuenta"
            style={{ color: "var(--text)", padding: 4, display: "flex", transition: "opacity .2s" }}
            onMouseEnter={e => e.currentTarget.style.opacity = ".5"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
            <UserIcon />
          </a>
          <a href="#" title="Favoritos"
            style={{ color: "var(--text)", padding: 4, display: "flex", transition: "opacity .2s" }}
            onMouseEnter={e => e.currentTarget.style.opacity = ".5"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
            <HeartIcon />
          </a>
          <a href="#" title="Carrito"
            style={{ color: "var(--text)", padding: 4, display: "flex", transition: "opacity .2s" }}
            onMouseEnter={e => e.currentTarget.style.opacity = ".5"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
            <BagIcon />
          </a>
        </div>

        {/* HAMBURGER */}
        <button onClick={() => setMobileOpen(v => !v)}
          aria-label="Menú" className="hamburger-btn"
          style={{ display: "none", flexDirection: "column", justifyContent: "center",
            gap: 5, width: 36, height: 36, background: "none", border: "none",
            cursor: "pointer", marginLeft: "auto", padding: 4 }}>
          {[0, 1, 2].map(i => (
            <span key={i} style={{ display: "block", height: 1.5, background: "var(--text)",
              transition: "transform .3s, opacity .3s", transformOrigin: "center",
              transform: mobileOpen
                ? i === 0 ? "translateY(6.5px) rotate(45deg)"
                : i === 1 ? "scaleX(0)" : "translateY(-6.5px) rotate(-45deg)"
                : "none",
              opacity: mobileOpen && i === 1 ? 0 : 1 }} />
          ))}
        </button>

        <style>{`
          @media(max-width:1024px){
            nav { padding:0 28px !important; }
            .nav-links-desktop li a { padding:0 10px !important; font-size:10px !important; }
          }
          @media(max-width:768px){
            .nav-links-desktop { display:none !important; }
            .nav-icons-desktop { display:none !important; }
            .hamburger-btn { display:flex !important; }
          }
        `}</style>
      </nav>

      {/* SEARCH OVERLAY */}
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* MOBILE BACKDROP */}
      {mobileOpen && (
        <div onClick={() => setMobileOpen(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.25)", zIndex: 240 }} />
      )}

      {/* MOBILE DRAWER */}
      <div style={{ display: "block", position: "fixed",
        top: "calc(var(--nav-h,64px) + var(--announce-h,35px))",
        left: 0, right: 0, bottom: 0,
        background: "var(--bg)", zIndex: 250, overflowY: "auto",
        borderTop: "2px solid var(--tan)",
        transform: mobileOpen ? "translateX(0)" : "translateX(-100%)",
        transition: "transform .35s cubic-bezier(.4,0,.2,1), background .35s" }}>
        {/* Mobile search trigger */}
        <div onClick={() => { setSearchOpen(true); setMobileOpen(false); }}
          style={{ display: "flex", alignItems: "center", gap: 10,
            margin: "24px 24px 16px", background: "var(--bg2)",
            border: "1px solid var(--border)", borderRadius: 2,
            padding: "10px 16px", fontSize: 13, color: "var(--text3)", cursor: "pointer" }}>
          <SearchIcon size={14} /> Buscar productos…
        </div>

        <ul style={{ listStyle: "none", padding: "0 0 40px" }}>
          {NAV_DATA.map(item => (
            <MobileItem key={item.id} item={item}
              isOpen={openMobileItem === item.id}
              onToggle={() => setOpenMobileItem(prev => prev === item.id ? null : item.id)} />
          ))}
        </ul>

        {/* Bottom icons */}
        <div style={{ display: "flex", borderTop: "1px solid var(--border)" }}>
          {[{ href: "#/cuenta", Icon: UserIcon, label: "Cuenta" },
            { href: "#", Icon: HeartIcon, label: "Favoritos" },
            { href: "#", Icon: BagIcon, label: "Carrito" }].map(({ href, Icon, label }) => (
            <a key={label} href={href}
              style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
                padding: "20px 0", color: "var(--text)", borderRight: "1px solid var(--border)",
                fontSize: 11, gap: 8, letterSpacing: 1, textTransform: "uppercase" }}>
              <Icon size={16} /><span>{label}</span>
            </a>
          ))}
        </div>
      </div>
    </>
  );
}
