import { useState, useRef, useCallback, useEffect } from "react";
import { useTheme } from "../../context/ThemeContext";
import { SearchIcon, CloseIcon, ArrowIcon } from "./Icons";

const LOGO_SRC = "/Logo_CLOE_t.png";

const products = [
  { name: "Bolsa Tote Grande Camel",  price: "$2,099" },
  { name: "Bolsa Tote Coral Viaje",   price: "$2,699" },
  { name: "Bolsa Hobo Maxi Azul",     price: "$2,299" },
  { name: "Bolsa Crossbody Mini",     price: "$1,499" },
  { name: "Bolsa Drawstring Charm",   price: "$1,899" },
  { name: "Maleta Rígida 24\"",       price: "$5,599" },
  { name: "Maleta Cabina 20\"",       price: "$4,299" },
  { name: "Porta Laptop Doble",       price: "$1,899" },
  { name: "Mochila Mediana Mascada",  price: "$2,299" },
  { name: "Tacones Primavera Rosa",   price: "$1,299" },
  { name: "Flats Casuales Camel",     price: "$899" },
  { name: "Llavero Charm Mini",       price: "$399" },
];

const quickLinks = ["Bolsas tote", "Bolsas hobo", "Calzado", "Maletas", "Mochilas", "Accesorios", "Crossbody", "Ofertas"];
const trending   = ["Bolsa tote coral", "Hobo azul marino", "Maleta de cabina", "Bolsa ultra ligera", "Porta laptop"];

function highlight(text, query) {
  if (!query) return text;
  const regex = new RegExp(`(${query})`, "gi");
  return text.split(regex).map((part, i) =>
    regex.test(part)
      ? <span key={i} style={{ color: "var(--tan)", fontWeight: 600 }}>{part}</span>
      : part
  );
}

export default function SearchOverlay({ open, onClose }) {
  const { dark } = useTheme();
  const logoFilter = dark ? "none" : "invert(1)";
  const inputRef   = useRef(null);
  const timerRef   = useRef(null);
  const [query,       setQuery]       = useState("");
  const [liveResults, setLiveResults] = useState([]);
  const [searched,    setSearched]    = useState(false);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300);
    else { setQuery(""); setLiveResults([]); setSearched(false); }
  }, [open]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const handleSearch = useCallback((val) => {
    setQuery(val);
    clearTimeout(timerRef.current);
    const q = val.trim().toLowerCase();
    if (!q) { setSearched(false); setLiveResults([]); return; }
    timerRef.current = setTimeout(() => {
      setLiveResults(products.filter(p => p.name.toLowerCase().includes(q)).slice(0, 4));
      setSearched(true);
    }, 150);
  }, []);

  const fill = (term) => { setQuery(term); handleSearch(term); inputRef.current?.focus(); };

  const sectionLabel = (text) => (
    <p style={{ fontSize: 9.5, fontWeight: 600, letterSpacing: 2.5, textTransform: "uppercase",
      color: "var(--tan)", marginBottom: 16, paddingBottom: 10, borderBottom: "1px solid var(--border)" }}>
      {text}
    </p>
  );

  const cardGrads = [
    "linear-gradient(135deg,#e8ddd0,#c4a880)",
    "linear-gradient(135deg,#d0d0d0,#888)",
    "linear-gradient(135deg,#d0e0d8,#80b0a0)",
    "linear-gradient(135deg,#e8d8d0,#c09080)",
  ];

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 600,
      pointerEvents: open ? "all" : "none",
      opacity: open ? 1 : 0, transition: "opacity .25s" }}>

      {/* Backdrop */}
      <div onClick={onClose}
        style={{ position: "absolute", inset: 0,
          background: "rgba(0,0,0,.55)", backdropFilter: "blur(4px)" }} />

      {/* Panel */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0,
        background: "var(--bg)", borderBottom: "2px solid var(--tan)",
        padding: "28px 48px 36px",
        boxShadow: "0 20px 60px rgba(0,0,0,.15)",
        transform: open ? "translateY(0)" : "translateY(-100%)",
        transition: "transform .35s cubic-bezier(.4,0,.2,1), background .35s" }}>

        {/* Top row */}
        <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 32 }}>
          <img src={LOGO_SRC} alt="CLOE"
            style={{ height: 26, flexShrink: 0, filter: logoFilter, transition: "filter .35s" }} />

          <div style={{ flex: 1, position: "relative" }}>
            <input ref={inputRef} value={query}
              onChange={e => handleSearch(e.target.value)}
              onKeyDown={e => e.key === "Enter" && onClose()}
              placeholder="¿Qué estás buscando hoy?"
              style={{ width: "100%", background: "transparent", border: "none",
                borderBottom: "2px solid var(--border)", padding: "10px 40px 10px 0",
                fontSize: "clamp(20px,3vw,34px)", fontWeight: 300, color: "var(--text)",
                outline: "none", caretColor: "var(--tan)", fontFamily: "inherit",
                transition: "border-color .25s" }}
              onFocus={e => e.target.style.borderBottomColor = "var(--tan)"}
              onBlur={e => e.target.style.borderBottomColor = "var(--border)"}/>
            <span style={{ position: "absolute", right: 0, top: "50%",
              transform: "translateY(-50%)", color: "var(--tan)" }}>
              <SearchIcon size={18} />
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 6,
            fontSize: 10, color: "var(--text3)", flexShrink: 0 }}>
            <kbd style={{ background: "var(--bg2)", border: "1px solid var(--border)",
              borderRadius: 3, padding: "2px 7px", fontFamily: "inherit", fontSize: 10 }}>ESC</kbd>
            para cerrar
          </div>

          <button onClick={onClose}
            style={{ background: "none", border: "none", cursor: "pointer",
              color: "var(--text3)", width: 36, height: 36, display: "flex",
              alignItems: "center", justifyContent: "center", borderRadius: "50%",
              transition: "background .2s" }}
            onMouseEnter={e => e.currentTarget.style.background = "var(--bg2)"}
            onMouseLeave={e => e.currentTarget.style.background = "none"}>
            <CloseIcon size={16} />
          </button>
        </div>

        {/* Body */}
        {!searched ? (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48 }}>
            {/* Quick links */}
            <div>
              {sectionLabel("Buscar por categoría")}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {quickLinks.map(term => (
                  <button key={term} onClick={() => fill(term)}
                    style={{ background: "var(--bg2)", border: "1px solid var(--border)",
                      borderRadius: 20, padding: "7px 16px", fontSize: 12.5,
                      color: "var(--text2)", cursor: "pointer", fontFamily: "inherit",
                      transition: "all .2s" }}
                    onMouseEnter={e => { e.currentTarget.style.background = "var(--tan-light)"; e.currentTarget.style.borderColor = "var(--tan)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "var(--bg2)"; e.currentTarget.style.borderColor = "var(--border)"; }}>
                    {term}
                  </button>
                ))}
              </div>
            </div>

            {/* Trending */}
            <div>
              {sectionLabel("Lo más buscado ahora")}
              {trending.map((name, i) => (
                <button key={i} onClick={() => fill(name)}
                  style={{ display: "flex", alignItems: "center", gap: 14, width: "100%",
                    padding: "10px 0", background: "none", border: "none",
                    borderBottom: "1px solid var(--border)", cursor: "pointer",
                    fontFamily: "inherit", textAlign: "left", transition: "padding-left .15s" }}
                  onMouseEnter={e => e.currentTarget.style.paddingLeft = "6px"}
                  onMouseLeave={e => e.currentTarget.style.paddingLeft = "0"}>
                  <span style={{ fontFamily: "var(--font-serif)", fontSize: 18, fontWeight: 600,
                    color: "var(--tan)", width: 20, textAlign: "center" }}>{i + 1}</span>
                  <span style={{ fontSize: 13.5, color: "var(--text2)", flex: 1 }}>{name}</span>
                  <span style={{ color: "var(--text3)" }}><ArrowIcon size={13} /></span>
                </button>
              ))}
            </div>
          </div>

        ) : liveResults.length > 0 ? (
          <div>
            {sectionLabel(`Resultados para "${query}"`)}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginTop: 12 }}>
              {liveResults.map((p, i) => (
                <a key={i} href="#/catalogo" onClick={onClose}
                  style={{ cursor: "pointer", textDecoration: "none" }}>
                  <div style={{ aspectRatio: "3/4", borderRadius: 4, background: cardGrads[i],
                    marginBottom: 10 }} />
                  <p style={{ fontSize: 12.5, fontWeight: 500, color: "var(--text)", marginBottom: 3 }}>
                    {highlight(p.name, query)}
                  </p>
                  <p style={{ fontFamily: "var(--font-serif)", fontSize: 17, fontWeight: 600,
                    color: "var(--tan-dark)" }}>{p.price}</p>
                </a>
              ))}
            </div>
          </div>

        ) : (
          <div style={{ textAlign: "center", padding: "24px 0", color: "var(--text3)", fontSize: 14 }}>
            No encontramos resultados para{" "}
            "<strong style={{ color: "var(--text)" }}>{query}</strong>".
            <br />
            <span style={{ fontSize: 12 }}>Intenta con otro término o explora las categorías.</span>
          </div>
        )}
      </div>
    </div>
  );
}
