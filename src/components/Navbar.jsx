import { useState, useEffect, useRef, useCallback } from "react";
import { useTheme } from "../context/ThemeContext";

const LOGO_SRC = "/Logo_CLOE_t.png";

// ─── ANNOUNCEMENT BAR ──────────────────────────────────────────────
const MESSAGES = [
  <>25% de descuento para Nuevos Usuarios · Código <strong style={{color:"white"}}>KUESKINUEVO25</strong> · Vigencia 31 marzo 2026</>,
  <>Hasta 3 MSI en compras mayores a <strong style={{color:"white"}}>$2,500 MXN</strong> y 6 MSI en compras mayores a $3,500 MXN</>,
  <>Envío gratis en compras mayores a <strong style={{color:"white"}}>$1,499 MXN</strong> · Vigencia 31 marzo 2026</>,
];
const AnnouncementBar = () => (
  <div style={{ background:"#111110", color:"rgba(255,255,255,0.7)", fontSize:11, letterSpacing:1.8, padding:"9px 0", overflow:"hidden", whiteSpace:"nowrap" }}>
    <div style={{ display:"inline-block", animation:"marquee 38s linear infinite" }}>
      {[...MESSAGES,...MESSAGES].map((m,i) => <span key={i} style={{ display:"inline-block", padding:"0 48px" }}>{m}</span>)}
    </div>
    <style>{`@keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}`}</style>
  </div>
);

// ─── NAV DATA — 8 categorías según diagrama ─────────────────────────
const NAV_DATA = [
  {
    id:"new-arrivals", label:"New Arrivals",
    mega:{ cols:"220px 1fr 200px", items:[
      { type:"links", title:"Categorías", links:["Bolsos","Billeteras","Calzado","Equipaje"] },
      { type:"featured", img:"https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&q=80", tag:"Recién llegado", title:"Spring 2026" },
    ]},
  },
  {
    id:"bolsa", label:"Bolsa",
    mega:{ cols:"1fr 1fr 200px", items:[
      { type:"grouped", groups:[
        { title:null, links:["Nueva colección","Colaboraciones"] },
        { title:"Tipos de bolsa", subgroups:[
          { label:"Funcional", links:["Mochilas","Porta laptops","Pañaleras"] },
          { label:"Girls",     links:["Bolsas","Mochilas","Lonchera","Portalápiz"] },
          { label:"Tendencias",links:["Denim","Jacquard","Suede"] },
        ]},
      ]},
      { type:"featured", img:"https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=500&q=80", tag:"Más vendida", title:"Tote Grande" },
    ]},
  },
  {
    id:"calzado", label:"Calzado",
    mega:{ cols:"220px 1fr 200px", items:[
      { type:"links", title:"Categorías", links:["Botas y botines","Zapatillas","Flats","Sneakers","Sandalias","Tallas únicas"] },
      { type:"featured", img:"https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500&q=80", tag:"Spring 2026", title:"Colección primavera" },
    ]},
  },
  {
    id:"equipaje", label:"Equipaje",
    mega:{ cols:"1fr 1fr 200px", items:[
      { type:"links", title:"Maletas", links:["Carry On","Check-in","Backpacks","Set de maletas","Duffle bags"] },
      { type:"grouped", groups:[
        { title:"Por tipo de viaje", subgroups:[
          { label:null, links:["Viaje Corto","Viaje Largo","Viaje de negocios","Aventura"] },
        ]},
      ]},
      { type:"featured", img:"https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?w=500&q=80", tag:"Nuevas", title:"Maletas rígidas 2026" },
    ]},
  },
  {
    id:"caballeros", label:"Caballeros",
    mega:{ cols:"220px 1fr 200px", items:[
      { type:"links", title:"Categorías", links:["Carteras","Backpacks","Porta Laptops"] },
      { type:"featured", img:"https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80", tag:"Para él", title:"Colección Caballeros" },
    ]},
  },
  {
    id:"accesorios", label:"Accesorios",
    mega:{ cols:"220px 1fr 200px", items:[
      { type:"links", title:"Categorías", links:["Carteras","Relojes","Lentes","Cosmetiqueras"] },
      { type:"featured", img:"https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=500&q=80", tag:"Personaliza tu look", title:"Accesorios" },
    ]},
  },
  { id:"gift-card",  label:"Gift Card", href:"#/gift-card" },   // sin sub-menú
  { id:"sale",       label:"SALE",      href:"#/sale", sale:true }, // sin sub-menú
];

// ─── SEARCH DATA ─────────────────────────────────────────────────────
const SEARCH_PRODUCTS = [
  {name:"Bolsa Tote Grande Camel",price:"$2,099"},{name:"Bolsa Hobo Maxi Azul",price:"$2,299"},
  {name:"Bolsa Crossbody Mini",price:"$1,499"},{name:"Maleta Cabina 20\"",price:"$4,299"},
  {name:"Porta Laptop Doble",price:"$1,899"},{name:"Mochila Mediana",price:"$2,299"},
  {name:"Tacones Primavera",price:"$1,299"},{name:"Llavero Charm Mini",price:"$399"},
];
const QUICK_LINKS   = ["Bolsas tote","Bolsas hobo","Calzado","Maletas","Mochilas","Accesorios"];
const TRENDING      = ["Bolsa tote coral","Hobo azul marino","Maleta de cabina","Porta laptop"];

// ─── ICONS ───────────────────────────────────────────────────────────
const SearchIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>;
const UserIcon   = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const HeartIcon  = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>;
const BagIcon    = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>;
const CloseIcon  = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const ArrowIcon  = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M5 12h14M12 5l7 7-7 7"/></svg>;
const ChevIcon   = ({open}) => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{transition:"transform .3s",transform:open?"rotate(180deg)":"none"}}><path d="m6 9 6 6 6-6"/></svg>;
const MoonIcon   = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>;
const SunIcon    = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>;

// ─── MEGA MENU RENDERER ──────────────────────────────────────────────
function MegaMenuPanel({ item }) {
  if (!item?.mega) return null;
  const { cols, items } = item.mega;

  const renderItem = (it, i) => {
    if (it.type === "featured") return (
      <div key={i} style={{ position:"relative", borderRadius:4, overflow:"hidden", aspectRatio:"3/4", maxHeight:260, background:"var(--bg2)" }}>
        <img src={it.img} alt={it.title} style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
        <div style={{ position:"absolute", bottom:0, left:0, right:0, background:"linear-gradient(transparent,rgba(0,0,0,.65))", padding:"20px 14px 14px", color:"white" }}>
          <p style={{ fontSize:9, fontWeight:600, letterSpacing:2, textTransform:"uppercase", opacity:.8, marginBottom:3 }}>{it.tag}</p>
          <p style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:16, fontWeight:600 }}>{it.title}</p>
        </div>
      </div>
    );

    if (it.type === "links") return (
      <div key={i}>
        {it.title && <p style={{ fontSize:9.5, fontWeight:600, letterSpacing:2.5, textTransform:"uppercase", color:"var(--tan)", marginBottom:14, paddingBottom:10, borderBottom:"1px solid var(--border)" }}>{it.title}</p>}
        <ul style={{ listStyle:"none" }}>
          {it.links.map(link => (
            <li key={link}>
              <a href="#/catalogo" style={{ display:"block", padding:"7px 0", fontSize:13.5, color:"var(--text2)", borderBottom:"1px solid var(--border)", transition:"color .15s, padding-left .15s" }}
                onMouseEnter={e=>{e.currentTarget.style.color="var(--text)";e.currentTarget.style.paddingLeft="6px"}}
                onMouseLeave={e=>{e.currentTarget.style.color="var(--text2)";e.currentTarget.style.paddingLeft="0"}}>
                {link}
              </a>
            </li>
          ))}
        </ul>
      </div>
    );

    if (it.type === "grouped") return (
      <div key={i} style={{ display:"flex", flexDirection:"column", gap:20 }}>
        {it.groups.map((g, gi) => (
          <div key={gi}>
            {g.title && <p style={{ fontSize:9.5, fontWeight:600, letterSpacing:2.5, textTransform:"uppercase", color:"var(--tan)", marginBottom:12, paddingBottom:8, borderBottom:"1px solid var(--border)" }}>{g.title}</p>}
            {/* Flat links */}
            {g.links && g.links.map(l => (
              <a key={l} href="#/catalogo" style={{ display:"block", padding:"6px 0", fontSize:13.5, color:"var(--text2)", transition:"color .15s, padding-left .15s" }}
                onMouseEnter={e=>{e.currentTarget.style.color="var(--text)";e.currentTarget.style.paddingLeft="6px"}}
                onMouseLeave={e=>{e.currentTarget.style.color="var(--text2)";e.currentTarget.style.paddingLeft="0"}}>
                {l}
              </a>
            ))}
            {/* Subgroups con indent */}
            {g.subgroups && g.subgroups.map((sg, sgi) => (
              <div key={sgi} style={{ marginBottom:8 }}>
                {sg.label && <p style={{ fontSize:12, fontWeight:600, color:"var(--text)", marginBottom:4, marginTop:4 }}>— {sg.label}</p>}
                {sg.links.map(l => (
                  <a key={l} href="#/catalogo" style={{ display:"block", padding:"5px 0 5px 14px", fontSize:13, color:"var(--text2)", borderLeft:"2px solid var(--border)", transition:"color .15s, border-color .15s" }}
                    onMouseEnter={e=>{e.currentTarget.style.color="var(--tan)";e.currentTarget.style.borderLeftColor="var(--tan)"}}
                    onMouseLeave={e=>{e.currentTarget.style.color="var(--text2)";e.currentTarget.style.borderLeftColor="var(--border)"}}>
                    {l}
                  </a>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    );

    return null;
  };

  return (
    <div style={{ position:"absolute", left:0, right:0,
      top:"100%",
      background:"var(--bg)", borderTop:"2px solid var(--tan)", borderBottom:"1px solid var(--border)",
      boxShadow:"0 20px 48px rgba(0,0,0,.1)", zIndex:200,
      animation:"menuIn .2s ease", transition:"background .35s" }}>
      <style>{`@keyframes menuIn{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <div style={{ maxWidth:1100, margin:"0 auto", padding:"36px 48px 40px",
        display:"grid", gridTemplateColumns: cols, gap:40, alignItems:"start" }}>
        {items.map(renderItem)}
      </div>
    </div>
  );
}

// ─── SEARCH OVERLAY ──────────────────────────────────────────────────
function SearchOverlay({ open, onClose }) {
  const { dark } = useTheme();
  const inputRef = useRef(null);
  const timer    = useRef(null);
  const [query,    setQuery]    = useState("");
  const [results,  setResults]  = useState([]);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 280);
    else { setQuery(""); setResults([]); setSearched(false); }
  }, [open]);

  useEffect(() => {
    const fn = e => { if(e.key==="Escape") onClose(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onClose]);

  const search = useCallback(val => {
    setQuery(val);
    clearTimeout(timer.current);
    const q = val.trim().toLowerCase();
    if (!q) { setSearched(false); setResults([]); return; }
    timer.current = setTimeout(() => {
      setResults(SEARCH_PRODUCTS.filter(p => p.name.toLowerCase().includes(q)).slice(0,4));
      setSearched(true);
    }, 140);
  }, []);

  const cardGrads = [
    "linear-gradient(135deg,#e8ddd0,#c4a880)",
    "linear-gradient(135deg,#d0d0d0,#888)",
    "linear-gradient(135deg,#d0e0d8,#80b0a0)",
    "linear-gradient(135deg,#e8d8d0,#c09080)",
  ];

  return (
    <div style={{ position:"fixed", inset:0, zIndex:600, pointerEvents:open?"all":"none", opacity:open?1:0, transition:"opacity .25s" }}>
      <div onClick={onClose} style={{ position:"absolute", inset:0, background:"rgba(0,0,0,.5)", backdropFilter:"blur(4px)" }}/>
      <div style={{ position:"absolute", top:0, left:0, right:0, background:"var(--bg)",
        borderBottom:"2px solid var(--tan)", padding:"28px 48px 36px",
        boxShadow:"0 20px 60px rgba(0,0,0,.15)",
        transform:open?"translateY(0)":"translateY(-100%)",
        transition:"transform .35s cubic-bezier(.4,0,.2,1), background .35s" }}>

        {/* Input row */}
        <div style={{ display:"flex", alignItems:"center", gap:20, marginBottom:32 }}>
          <img src={LOGO_SRC} alt="CLOE" style={{ height:26, flexShrink:0, filter: dark?"none":"invert(1)", transition:"filter .35s" }}/>
          <div style={{ flex:1, position:"relative" }}>
            <input ref={inputRef} value={query} onChange={e=>search(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&onClose()}
              placeholder="¿Qué estás buscando hoy?"
              style={{ width:"100%", background:"transparent", border:"none",
                borderBottom:"2px solid var(--border)", padding:"10px 40px 10px 0",
                fontSize:"clamp(20px,3vw,34px)", fontWeight:300, color:"var(--text)",
                outline:"none", caretColor:"var(--tan)", fontFamily:"inherit", transition:"border-color .25s" }}
              onFocus={e=>e.target.style.borderBottomColor="var(--tan)"}
              onBlur={e=>e.target.style.borderBottomColor="var(--border)"}/>
            <span style={{ position:"absolute", right:0, top:"50%", transform:"translateY(-50%)", color:"var(--tan)" }}><SearchIcon/></span>
          </div>
          <button onClick={onClose} style={{ background:"none", border:"none", cursor:"pointer",
            color:"var(--text3)", width:36, height:36, display:"flex", alignItems:"center",
            justifyContent:"center", borderRadius:"50%", transition:"background .2s" }}
            onMouseEnter={e=>e.currentTarget.style.background="var(--bg2)"}
            onMouseLeave={e=>e.currentTarget.style.background="none"}>
            <CloseIcon/>
          </button>
        </div>

        {/* Body */}
        {!searched ? (
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:48 }}>
            <div>
              <p style={{ fontSize:9.5, fontWeight:600, letterSpacing:2.5, textTransform:"uppercase", color:"var(--tan)", marginBottom:14, paddingBottom:10, borderBottom:"1px solid var(--border)" }}>Categorías rápidas</p>
              <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                {QUICK_LINKS.map(t => (
                  <button key={t} onClick={()=>search(t)}
                    style={{ background:"var(--bg2)", border:"1px solid var(--border)", borderRadius:20,
                      padding:"7px 16px", fontSize:12.5, color:"var(--text2)", cursor:"pointer",
                      fontFamily:"inherit", transition:"all .2s" }}
                    onMouseEnter={e=>{e.currentTarget.style.background="var(--tan-light)";e.currentTarget.style.borderColor="var(--tan)"}}
                    onMouseLeave={e=>{e.currentTarget.style.background="var(--bg2)";e.currentTarget.style.borderColor="var(--border)"}}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p style={{ fontSize:9.5, fontWeight:600, letterSpacing:2.5, textTransform:"uppercase", color:"var(--tan)", marginBottom:14, paddingBottom:10, borderBottom:"1px solid var(--border)" }}>Lo más buscado</p>
              {TRENDING.map((n,i) => (
                <button key={i} onClick={()=>search(n)}
                  style={{ display:"flex", alignItems:"center", gap:14, width:"100%",
                    padding:"10px 0", background:"none", border:"none",
                    borderBottom:"1px solid var(--border)", cursor:"pointer",
                    fontFamily:"inherit", textAlign:"left", transition:"padding-left .15s" }}
                  onMouseEnter={e=>e.currentTarget.style.paddingLeft="6px"}
                  onMouseLeave={e=>e.currentTarget.style.paddingLeft="0"}>
                  <span style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:18, fontWeight:600, color:"var(--tan)", width:20, textAlign:"center" }}>{i+1}</span>
                  <span style={{ fontSize:13.5, color:"var(--text2)", flex:1 }}>{n}</span>
                  <span style={{ color:"var(--text3)" }}><ArrowIcon/></span>
                </button>
              ))}
            </div>
          </div>
        ) : results.length > 0 ? (
          <div>
            <p style={{ fontSize:9.5, fontWeight:600, letterSpacing:2.5, textTransform:"uppercase", color:"var(--tan)", marginBottom:16, paddingBottom:10, borderBottom:"1px solid var(--border)" }}>Resultados para "{query}"</p>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16 }}>
              {results.map((p,i) => (
                <a key={i} href="#/catalogo" onClick={onClose} style={{ cursor:"pointer" }}>
                  <div style={{ aspectRatio:"3/4", borderRadius:4, background:cardGrads[i], marginBottom:10 }}/>
                  <p style={{ fontSize:12.5, fontWeight:500, color:"var(--text)", marginBottom:3 }}>{p.name}</p>
                  <p style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:17, fontWeight:600, color:"var(--tan-dark)" }}>{p.price}</p>
                </a>
              ))}
            </div>
          </div>
        ) : (
          <p style={{ textAlign:"center", padding:"24px 0", fontSize:14, color:"var(--text3)" }}>
            Sin resultados para "<strong style={{color:"var(--text)"}}>{query}</strong>". Intenta otro término.
          </p>
        )}
      </div>
    </div>
  );
}

// ─── MOBILE ITEM ─────────────────────────────────────────────────────
function MobileNavItem({ item, isOpen, onToggle }) {
  const allLinks = item.mega
    ? item.mega.items.flatMap(it => {
        if (it.type === "links")   return it.links;
        if (it.type === "grouped") return it.groups.flatMap(g => [
          ...(g.links||[]),
          ...(g.subgroups||[]).flatMap(sg => sg.links),
        ]);
        return [];
      })
    : [];

  return (
    <li style={{ borderBottom:"1px solid var(--border)" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 24px" }}>
        <a href={item.href || `#/${item.id}`}
          onClick={e => { if (item.mega) { e.preventDefault(); onToggle(); } }}
          style={{ flex:1, display:"inline-flex", alignItems:"center", padding:"16px 0",
            fontSize:11, fontWeight:600, letterSpacing:2.5, textTransform:"uppercase",
            color: item.sale ? "#b5342a" : "var(--text)" }}>
          {item.label}
        </a>
        {item.mega && <span style={{ color:"var(--tan)" }}><ChevIcon open={isOpen}/></span>}
      </div>
      {item.mega && (
        <div style={{ height:isOpen?"auto":0, overflow:"hidden", transition:"height .35s cubic-bezier(.4,0,.2,1)" }}>
          <div style={{ padding:"4px 24px 20px" }}>
            {allLinks.map((l,i) => (
              <a key={i} href="#/catalogo"
                style={{ display:"block", padding:"9px 0", fontSize:14,
                  color:"var(--text2)", borderBottom:"1px solid var(--border)" }}>
                {l}
              </a>
            ))}
          </div>
        </div>
      )}
    </li>
  );
}

// ─── NAVBAR ──────────────────────────────────────────────────────────
export default function Navbar() {
  const { dark, toggle } = useTheme();
  const logoFilter = dark ? "none" : "invert(1)";
  const [activeId,   setActiveId]   = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileItem, setMobileItem] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const fn = e => { if ((e.metaKey||e.ctrlKey) && e.key==="k") { e.preventDefault(); setSearchOpen(true); } };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, []);

  useEffect(() => {
    document.body.style.overflow = (mobileOpen||searchOpen) ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen, searchOpen]);

  return (
    <>
      <AnnouncementBar/>

      <nav onMouseLeave={() => setActiveId(null)}
        style={{ background:"var(--bg)", borderBottom:"1px solid var(--border)",
          display:"flex", alignItems:"center", padding:"0 48px",
          height:"var(--nav-h,64px)", position:"sticky", top:0, zIndex:300, overflow:"visible",
          transition:"background .35s, border-color .35s" }}>

        {/* Logo */}
        <a href="#/" style={{ display:"flex", alignItems:"center", flexShrink:0, marginRight:40 }}>
          <img src={LOGO_SRC} alt="CLOE" style={{ height:30, filter:logoFilter, transition:"filter .35s" }}/>
        </a>

        {/* Desktop links */}
        <ul style={{ display:"flex", listStyle:"none", flex:1 }} className="nav-links-d">
          {NAV_DATA.map(item => (
            <li key={item.id} style={{ position:"relative" }}
              onMouseEnter={() => setActiveId(item.mega ? item.id : null)}
              onClick={() => setActiveId(null)}>
              <a href={item.href || `#/${item.id}`}
                onClick={e => item.mega && e.preventDefault()}
                style={{ display:"inline-flex", alignItems:"center", padding:"0 13px",
                  lineHeight:"var(--nav-h,64px)", fontSize:11, fontWeight:500,
                  letterSpacing:1.6, textTransform:"uppercase", position:"relative",
                  color: item.sale ? "#b5342a" : activeId===item.id ? "var(--tan)" : "var(--text)",
                  transition:"color .2s" }}>
                {item.label}
                <span style={{ position:"absolute", bottom:0, left:13, right:13, height:1,
                  background:"var(--tan)", transformOrigin:"left",
                  transform: activeId===item.id ? "scaleX(1)" : "scaleX(0)",
                  transition:"transform .25s ease" }}/>
              </a>
              
            </li>
          ))}
        </ul>

        {/* Mega menú — anclado al nav */}
        {activeId && <MegaMenuPanel item={NAV_DATA.find(i => i.id === activeId)}/>}

        {/* Desktop icons */}
        <div style={{ display:"flex", gap:12, alignItems:"center", marginLeft:"auto", flexShrink:0 }} className="nav-icons-d">
          {/* Search pill */}
          <button onClick={() => setSearchOpen(true)}
            style={{ display:"flex", alignItems:"center", gap:8, background:"var(--bg2)",
              border:"1px solid var(--border)", borderRadius:2, padding:"6px 14px",
              fontSize:12, color:"var(--text3)", cursor:"pointer", fontFamily:"inherit",
              transition:"border-color .2s" }}
            onMouseEnter={e=>e.currentTarget.style.borderColor="var(--tan)"}
            onMouseLeave={e=>e.currentTarget.style.borderColor="var(--border)"}>
            <SearchIcon/> Buscar
            <kbd style={{ background:"var(--bg3)", border:"1px solid var(--border)", borderRadius:3,
              padding:"1px 5px", fontFamily:"inherit", fontSize:9, color:"var(--text3)" }}>⌘K</kbd>
          </button>
          {/* Dark toggle */}
          <button onClick={toggle}
            style={{ display:"flex", alignItems:"center", gap:6, background:"var(--bg2)",
              border:"1px solid var(--border)", borderRadius:20, padding:"5px 10px",
              color:"var(--text)", fontSize:11, cursor:"pointer", fontFamily:"inherit",
              transition:"all .2s" }}>
            {dark ? <SunIcon/> : <MoonIcon/>}
            <span>{dark?"Claro":"Oscuro"}</span>
          </button>
          <a href="#/cuenta" title="Cuenta" style={{ color:"var(--text)", padding:4, display:"flex" }}><UserIcon/></a>
          <a href="#" title="Favoritos"     style={{ color:"var(--text)", padding:4, display:"flex" }}><HeartIcon/></a>
          <a href="#" title="Carrito"       style={{ color:"var(--text)", padding:4, display:"flex" }}><BagIcon/></a>
        </div>

        {/* Hamburger */}
        <button onClick={() => setMobileOpen(v=>!v)} className="hamburger-btn"
          style={{ display:"none", flexDirection:"column", justifyContent:"center",
            gap:5, width:36, height:36, background:"none", border:"none", cursor:"pointer",
            marginLeft:"auto", padding:4 }}>
          {[0,1,2].map(i => (
            <span key={i} style={{ display:"block", height:1.5, background:"var(--text)",
              transition:"transform .3s, opacity .3s", transformOrigin:"center",
              transform: mobileOpen
                ? i===0 ? "translateY(6.5px) rotate(45deg)"
                : i===1 ? "scaleX(0)" : "translateY(-6.5px) rotate(-45deg)"
                : "none",
              opacity: mobileOpen && i===1 ? 0 : 1 }}/>
          ))}
        </button>

        <style>{`
          @media(max-width:1100px){.nav-links-d li a{padding:0 9px!important;font-size:10px!important;letter-spacing:1.2px!important}}
          @media(max-width:768px){.nav-links-d{display:none!important}.nav-icons-d{display:none!important}.hamburger-btn{display:flex!important}}
        `}</style>
      </nav>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)}/>

      {mobileOpen && <div onClick={() => setMobileOpen(false)} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.25)", zIndex:240 }}/>}

      {/* Mobile drawer */}
      <div style={{ position:"fixed", top:"calc(var(--nav-h,64px) + 35px)", left:0, right:0, bottom:0,
        background:"var(--bg)", zIndex:250, overflowY:"auto",
        borderTop:"2px solid var(--tan)",
        transform: mobileOpen ? "translateX(0)" : "translateX(-100%)",
        transition:"transform .35s cubic-bezier(.4,0,.2,1), background .35s" }}>
        <div onClick={() => { setSearchOpen(true); setMobileOpen(false); }}
          style={{ display:"flex", alignItems:"center", gap:10, margin:"20px 24px 12px",
            background:"var(--bg2)", border:"1px solid var(--border)", borderRadius:2,
            padding:"10px 16px", fontSize:13, color:"var(--text3)", cursor:"pointer" }}>
          <SearchIcon/> Buscar productos…
        </div>
        <ul style={{ listStyle:"none", padding:"0 0 40px" }}>
          {NAV_DATA.map(item => (
            <MobileNavItem key={item.id} item={item}
              isOpen={mobileItem === item.id}
              onToggle={() => setMobileItem(p => p===item.id ? null : item.id)}/>
          ))}
        </ul>
        <div style={{ display:"flex", borderTop:"1px solid var(--border)" }}>
          {[["#/cuenta",UserIcon,"Cuenta"],["#",HeartIcon,"Favoritos"],["#",BagIcon,"Carrito"]].map(([href,Icon,label]) => (
            <a key={label} href={href}
              style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center",
                padding:"18px 0", color:"var(--text)", borderRight:"1px solid var(--border)",
                fontSize:11, gap:8, letterSpacing:1, textTransform:"uppercase" }}>
              <Icon size={16}/><span>{label}</span>
            </a>
          ))}
        </div>
      </div>
    </>
  );
}