import { useState, useRef, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";

// ─── DATA ───────────────────────────────────────────────────────────
const ALL_PRODUCTS = [
  { id:1,  name:"Bolsa Satchel Mediana",     collection:"Mascada",      price:2099, img:"https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&q=80", colors:["#d4c89a","#111","#8b3a3a"], tag:null,    category:"Satchel",    occasion:"Trabajo", size:"Mediana" },
  { id:2,  name:"Bolsa Hobo Maxi Azul",      collection:"Always On",    price:2299, img:"https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80", colors:["#c9a97a","#4a6fa5"], tag:"New",   category:"Hobo",       occasion:"Diario",  size:"Grande" },
  { id:3,  name:"Bolsa Tote Grande",         collection:"Ultra Ligera", price:1049, oldPrice:1399, img:"https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&q=80", colors:["#c4a060","#f5f0e8"], tag:"Sale",  category:"Tote",       occasion:"Diario",  size:"Grande" },
  { id:4,  name:"Bolsa Crossbody Mini",      collection:"Spring 2026",  price:1499, img:"https://images.unsplash.com/photo-1612817288484-6f916006741a?w=600&q=80", colors:["#5090a0"], tag:null,    category:"Crossbody",  occasion:"Noche",   size:"Mini" },
  { id:5,  name:"Mochila Mediana Mascada",   collection:"Mascada",      price:2299, img:"https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=600&q=80", colors:["#a07d50","#111"], tag:"New",   category:"Mochila",    occasion:"Diario",  size:"Mediana" },
  { id:6,  name:"Bolsa Drawstring Charm",    collection:"Always On",    price:1899, img:"https://images.unsplash.com/photo-1559563458-527698bf5295?w=600&q=80", colors:["#d4c89a","#c9a97a"], tag:null,    category:"Tote",       occasion:"Trabajo", size:"Pequeña" },
  { id:7,  name:"Porta Laptop Doble",        collection:"Urbana",       price:1899, img:"https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80", colors:["#111","#333"], tag:null,    category:"Satchel",    occasion:"Trabajo", size:"Mediana" },
  { id:8,  name:"Bolsa Hobo Coral",          collection:"Spring 2026",  price:2699, img:"https://images.unsplash.com/photo-1566150905458-1bf1ac880f48?w=600&q=80", colors:["#e8927a","#f0d4c0"], tag:"New",   category:"Hobo",       occasion:"Noche",   size:"Grande" },
];

const FILTER_CATEGORIES = ["Tote","Hobo","Crossbody","Satchel","Mochila"];
const FILTER_OCCASIONS   = ["Trabajo","Diario","Noche","Viaje"];
const FILTER_SIZES       = ["Mini","Pequeña","Mediana","Grande"];
const FILTER_COLLECTIONS = ["Always On","Ultra Ligera","Mascada","Spring 2026","Urbana"];
const SORT_OPTIONS = [
  { val:"featured", label:"Destacados" },
  { val:"price-asc", label:"Precio: menor a mayor" },
  { val:"price-desc", label:"Precio: mayor a menor" },
  { val:"new", label:"Más nuevos" },
];

// ─── ICONS ──────────────────────────────────────────────────────────
const ChevIcon = ({ open }) => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    style={{ transition:"transform .3s", transform: open?"rotate(180deg)":"none", flexShrink:0 }}>
    <path d="m6 9 6 6 6-6"/>
  </svg>
);
const CloseSmIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const GridIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
    <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
  </svg>
);
const ListIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
    <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
  </svg>
);
const HeartIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);

// ─── FILTER GROUP ───────────────────────────────────────────────────
function FilterGroup({ title, children }) {
  const [open, setOpen] = useState(true);
  const ref = useRef(null);
  const [h, setH] = useState("auto");
  useEffect(() => { if (ref.current) setH(open ? ref.current.scrollHeight : 0); }, [open]);

  return (
    <div style={{ borderBottom:"1px solid var(--border)", paddingBottom: open ? 16 : 0 }}>
      <button onClick={() => setOpen(v => !v)}
        style={{ display:"flex", alignItems:"center", justifyContent:"space-between", width:"100%",
          background:"none", border:"none", cursor:"pointer", padding:"14px 0 10px",
          fontSize:10, fontWeight:600, letterSpacing:2.5, textTransform:"uppercase",
          color:"var(--text)", fontFamily:"inherit" }}>
        {title} <ChevIcon open={open}/>
      </button>
      <div ref={ref} style={{ height: open ? "auto" : 0, overflow:"hidden",
        transition:"height .3s cubic-bezier(.4,0,.2,1)" }}>
        {children}
      </div>
    </div>
  );
}

// ─── CHECKBOX ───────────────────────────────────────────────────────
function CheckItem({ label, checked, onChange, count }) {
  return (
    <label style={{ display:"flex", alignItems:"center", gap:10, padding:"5px 0",
      cursor:"pointer", fontSize:13, color: checked ? "var(--text)" : "var(--text2)" }}>
      <div onClick={onChange} style={{ width:16, height:16, borderRadius:2, flexShrink:0,
        border: checked ? "none" : "1.5px solid var(--border)",
        background: checked ? "var(--tan)" : "transparent",
        display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer",
        transition:"all .15s" }}>
        {checked && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
      </div>
      <span style={{ flex:1 }}>{label}</span>
      {count !== undefined && <span style={{ fontSize:11, color:"var(--text3)" }}>{count}</span>}
    </label>
  );
}

// ─── PRICE RANGE ────────────────────────────────────────────────────
function PriceRange({ min, max, value, onChange }) {
  const [dragging, setDragging] = useState(null);
  const trackRef = useRef(null);

  const getPercent = (v) => ((v - min) / (max - min)) * 100;

  const handleMouseDown = (thumb) => (e) => {
    e.preventDefault();
    setDragging(thumb);
  };

  useEffect(() => {
    const move = (e) => {
      if (!dragging || !trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const raw = Math.round(min + pct * (max - min));
      if (dragging === "lo") onChange([Math.min(raw, value[1] - 100), value[1]]);
      else onChange([value[0], Math.max(raw, value[0] + 100)]);
    };
    const up = () => setDragging(null);
    if (dragging) { window.addEventListener("mousemove", move); window.addEventListener("mouseup", up); }
    return () => { window.removeEventListener("mousemove", move); window.removeEventListener("mouseup", up); };
  }, [dragging, value, min, max, onChange]);

  const lo = getPercent(value[0]);
  const hi = getPercent(value[1]);

  return (
    <div style={{ padding:"4px 0 12px" }}>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:16,
        fontSize:13, color:"var(--text2)" }}>
        <span>${value[0].toLocaleString()}</span>
        <span>${value[1].toLocaleString()}</span>
      </div>
      <div ref={trackRef} style={{ position:"relative", height:4, background:"var(--bg3)",
        borderRadius:2, cursor:"pointer", margin:"0 8px" }}>
        <div style={{ position:"absolute", left:`${lo}%`, right:`${100-hi}%`, top:0, bottom:0,
          background:"var(--tan)", borderRadius:2 }}/>
        {[{ key:"lo", val:lo }, { key:"hi", val:hi }].map(({ key, val }) => (
          <div key={key} onMouseDown={handleMouseDown(key)}
            style={{ position:"absolute", top:"50%", left:`${val}%`,
              width:16, height:16, borderRadius:"50%", background:"white",
              border:"2px solid var(--tan)", transform:"translate(-50%,-50%)",
              cursor:"grab", boxShadow:"0 1px 4px rgba(0,0,0,.15)",
              transition: dragging === key ? "none" : "left .1s" }}/>
        ))}
      </div>
    </div>
  );
}

// ─── PRODUCT CARD ────────────────────────────────────────────────────
function ProdCard({ p, cols }) {
  const [selColor, setSelColor] = useState(0);
  const [wished, setWished] = useState(false);
  const [added, setAdded] = useState(false);

  return (
    <div style={{ cursor:"pointer" }} className="pc-wrap">
      <div style={{ position:"relative", borderRadius:6, overflow:"hidden",
        aspectRatio: cols === 4 ? "3/4" : "4/3",
        background:"var(--bg2)", marginBottom:12 }}>
        <img src={p.img} alt={p.name}
          style={{ width:"100%", height:"100%", objectFit:"cover", transition:"transform .5s" }}
          className="pc-img"/>
        {p.tag && (
          <div style={{ position:"absolute", top:10, left:10,
            background: p.tag === "Sale" ? "#b5342a" : p.tag === "New" ? "#111" : "var(--tan)",
            color:"white", fontSize:9, fontWeight:700, letterSpacing:1.5,
            padding:"3px 8px", borderRadius:2 }}>{p.tag}</div>
        )}
        <button onClick={e=>{e.stopPropagation();setWished(v=>!v)}}
          className="pc-wish"
          style={{ position:"absolute", top:10, right:10, width:32, height:32,
            borderRadius:"50%", background:"rgba(255,255,255,.9)", border:"none",
            cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center",
            opacity:0, transition:"opacity .2s", transform:"scale(.8)" }}>
          <svg width="14" height="14" viewBox="0 0 24 24"
            fill={wished?"#b5342a":"none"} stroke={wished?"#b5342a":"currentColor"} strokeWidth="1.5">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>
        <button onClick={e=>{e.stopPropagation();setAdded(true);setTimeout(()=>setAdded(false),2000)}}
          className="pc-cart"
          style={{ position:"absolute", bottom:0, left:0, right:0,
            background: added ? "#22c55e" : "var(--text)", color:"var(--bg)",
            fontSize:10, fontWeight:600, letterSpacing:1.5, textTransform:"uppercase",
            border:"none", cursor:"pointer", padding:10, transform:"translateY(100%)",
            transition:"transform .25s, background .2s", fontFamily:"inherit" }}>
          {added ? "✓ Agregado" : "+ Agregar"}
        </button>
      </div>
      <div style={{ fontSize:13, fontWeight:500, color:"var(--text)", marginBottom:2 }}>{p.name}</div>
      <div style={{ fontSize:11, color:"var(--text3)", marginBottom:6 }}>{p.collection}</div>
      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
        <span style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:20, fontWeight:600, color:"var(--text)" }}>{`$${p.price.toLocaleString()}`}</span>
        {p.oldPrice && <span style={{ fontSize:12, color:"var(--text3)", textDecoration:"line-through" }}>{`$${p.oldPrice.toLocaleString()}`}</span>}
      </div>
      <div style={{ display:"flex", gap:5 }}>
        {p.colors.map((c,i) => (
          <div key={i} onClick={()=>setSelColor(i)}
            style={{ width:11, height:11, borderRadius:"50%", background:c, cursor:"pointer",
              border: selColor===i ? "2px solid var(--text)" : "2px solid transparent",
              outline: selColor===i ? "1px solid var(--text)" : "none", outlineOffset:1,
              transition:"transform .15s", transform: selColor===i?"scale(1.2)":"scale(1)" }}/>
        ))}
      </div>
      <style>{`.pc-wrap:hover .pc-wish{opacity:1!important;transform:scale(1)!important}.pc-wrap:hover .pc-cart{transform:translateY(0)!important}.pc-wrap:hover .pc-img{transform:scale(1.04)}`}</style>
    </div>
  );
}

// ─── CATALOG PAGE ───────────────────────────────────────────────────
export default function CatalogPage() {
  const { dark } = useTheme();
  const [cats,      setCats]      = useState([]);
  const [occasions, setOccasions] = useState([]);
  const [sizes,     setSizes]     = useState([]);
  const [colls,     setColls]     = useState([]);
  const [price,     setPrice]     = useState([399, 6000]);
  const [sort,      setSort]      = useState("featured");
  const [cols,      setCols]      = useState(4);
  const [sideOpen,  setSideOpen]  = useState(true);

  const toggle = (arr, setArr, val) =>
    setArr(arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]);

  const activeFilters = [
    ...cats.map(v => ({ label:v, clear:()=>toggle(cats,setCats,v) })),
    ...occasions.map(v => ({ label:v, clear:()=>toggle(occasions,setOccasions,v) })),
    ...sizes.map(v => ({ label:v, clear:()=>toggle(sizes,setSizes,v) })),
    ...colls.map(v => ({ label:v, clear:()=>toggle(colls,setColls,v) })),
  ];

  const clearAll = () => { setCats([]); setOccasions([]); setSizes([]); setColls([]); setPrice([399,6000]); };

  let filtered = ALL_PRODUCTS.filter(p => {
    if (cats.length      && !cats.includes(p.category))   return false;
    if (occasions.length && !occasions.includes(p.occasion)) return false;
    if (sizes.length     && !sizes.includes(p.size))      return false;
    if (colls.length     && !colls.includes(p.collection)) return false;
    if (p.price < price[0] || p.price > price[1])         return false;
    return true;
  });

  if (sort === "price-asc")  filtered = [...filtered].sort((a,b) => a.price - b.price);
  if (sort === "price-desc") filtered = [...filtered].sort((a,b) => b.price - a.price);
  if (sort === "new")        filtered = filtered.filter(p => p.tag === "New").concat(filtered.filter(p => p.tag !== "New"));

  return (
    <div>
      <style>{`
        .cat-banner { background:var(--text); color:var(--bg); padding:56px 48px 48px; position:relative; overflow:hidden; }
        .cat-layout { display:grid; grid-template-columns:${sideOpen?"260px 1fr":"1fr"}; gap:0; align-items:start; min-height:80vh; transition:grid-template-columns .3s; }
        .sidebar { border-right:1px solid var(--border); padding:32px 24px; position:sticky; top:64px; max-height:calc(100vh - 64px); overflow-y:auto; transition:background .35s; }
        .sidebar::-webkit-scrollbar { width:3px; }
        .sidebar::-webkit-scrollbar-thumb { background:var(--border); }
        .catalog-main { padding:28px 32px; }
        .toolbar { display:flex; align-items:center; gap:12px; margin-bottom:24px; flex-wrap:wrap; }
        .prod-grid-4 { display:grid; grid-template-columns:repeat(${cols},1fr); gap:24px; }
        @media(max-width:1024px){.cat-layout{grid-template-columns:1fr}.sidebar{display:none}.prod-grid-4{grid-template-columns:repeat(2,1fr)}}
        @media(max-width:600px){.prod-grid-4{grid-template-columns:1fr 1fr;gap:14px}.catalog-main{padding:16px 16px}.cat-banner{padding:40px 24px 32px}}
      `}</style>

      {/* Banner */}
      <div className="cat-banner">
        <div style={{ position:"absolute", top:-60, right:-60, width:240, height:240,
          borderRadius:"50%", border:"1px solid rgba(201,169,122,.15)" }}/>
        <p style={{ fontSize:10, fontWeight:600, letterSpacing:3, textTransform:"uppercase",
          color:"var(--tan)", marginBottom:10 }}>Colección completa</p>
        <h1 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:"clamp(36px,5vw,64px)",
          fontWeight:300, lineHeight:1.05, marginBottom:10 }}>
          Bolsas
        </h1>
        <p style={{ fontSize:13, opacity:.5, letterSpacing:.5 }}>{filtered.length} estilos disponibles</p>
      </div>

      {/* Active filters chips */}
      {activeFilters.length > 0 && (
        <div style={{ display:"flex", gap:8, flexWrap:"wrap", padding:"14px 32px",
          borderBottom:"1px solid var(--border)", background:"var(--bg2)", alignItems:"center" }}>
          <span style={{ fontSize:10, fontWeight:600, letterSpacing:2, textTransform:"uppercase",
            color:"var(--text3)", marginRight:4 }}>Filtros:</span>
          {activeFilters.map(({ label, clear }) => (
            <button key={label} onClick={clear}
              style={{ display:"inline-flex", alignItems:"center", gap:6, background:"var(--text)",
                color:"var(--bg)", fontSize:11, padding:"5px 10px", borderRadius:2,
                border:"none", cursor:"pointer", fontFamily:"inherit" }}>
              {label} <CloseSmIcon/>
            </button>
          ))}
          <button onClick={clearAll}
            style={{ fontSize:11, color:"var(--text3)", background:"none", border:"none",
              cursor:"pointer", textDecoration:"underline", fontFamily:"inherit", marginLeft:4 }}>
            Limpiar todo
          </button>
        </div>
      )}

      <div className="cat-layout">
        {/* SIDEBAR */}
        {sideOpen && (
          <aside className="sidebar">
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:24 }}>
              <p style={{ fontSize:10, fontWeight:600, letterSpacing:2.5, textTransform:"uppercase", color:"var(--text)" }}>Filtros</p>
              <button onClick={() => setSideOpen(false)}
                style={{ background:"none", border:"none", cursor:"pointer", color:"var(--text3)",
                  fontSize:11, fontFamily:"inherit" }}>Ocultar</button>
            </div>

            <FilterGroup title="Tipo de bolsa">
              {FILTER_CATEGORIES.map(v => (
                <CheckItem key={v} label={v} checked={cats.includes(v)}
                  onChange={() => toggle(cats,setCats,v)}
                  count={ALL_PRODUCTS.filter(p=>p.category===v).length}/>
              ))}
            </FilterGroup>

            <FilterGroup title="Precio">
              <PriceRange min={399} max={6000} value={price} onChange={setPrice}/>
            </FilterGroup>

            <FilterGroup title="Ocasión">
              {FILTER_OCCASIONS.map(v => (
                <CheckItem key={v} label={v} checked={occasions.includes(v)}
                  onChange={() => toggle(occasions,setOccasions,v)}/>
              ))}
            </FilterGroup>

            <FilterGroup title="Tamaño">
              {FILTER_SIZES.map(v => (
                <CheckItem key={v} label={v} checked={sizes.includes(v)}
                  onChange={() => toggle(sizes,setSizes,v)}/>
              ))}
            </FilterGroup>

            <FilterGroup title="Colección">
              {FILTER_COLLECTIONS.map(v => (
                <CheckItem key={v} label={v} checked={colls.includes(v)}
                  onChange={() => toggle(colls,setColls,v)}/>
              ))}
            </FilterGroup>
          </aside>
        )}

        {/* MAIN */}
        <div className="catalog-main">
          {/* Toolbar */}
          <div className="toolbar">
            {!sideOpen && (
              <button onClick={() => setSideOpen(true)}
                style={{ display:"flex", alignItems:"center", gap:6, background:"none",
                  border:"1px solid var(--border)", borderRadius:2, padding:"7px 14px",
                  fontSize:11, color:"var(--text)", cursor:"pointer", fontFamily:"inherit" }}>
                ☰ Filtros
              </button>
            )}
            <span style={{ fontSize:12, color:"var(--text3)", flex:1 }}>
              {filtered.length} resultado{filtered.length !== 1 ? "s" : ""}
            </span>
            <select value={sort} onChange={e=>setSort(e.target.value)}
              style={{ background:"var(--bg2)", border:"1px solid var(--border)", borderRadius:2,
                padding:"7px 12px", fontSize:12, color:"var(--text)", fontFamily:"inherit",
                outline:"none", cursor:"pointer" }}>
              {SORT_OPTIONS.map(o => <option key={o.val} value={o.val}>{o.label}</option>)}
            </select>
            <div style={{ display:"flex", gap:4 }}>
              {[4,3].map(n => (
                <button key={n} onClick={()=>setCols(n)}
                  style={{ width:32, height:32, display:"flex", alignItems:"center",
                    justifyContent:"center", background: cols===n ? "var(--text)" : "var(--bg2)",
                    color: cols===n ? "var(--bg)" : "var(--text3)", border:"1px solid var(--border)",
                    borderRadius:2, cursor:"pointer" }}>
                  {n === 4 ? <GridIcon/> : <ListIcon/>}
                </button>
              ))}
            </div>
          </div>

          {/* Grid */}
          {filtered.length === 0 ? (
            <div style={{ textAlign:"center", padding:"80px 0", color:"var(--text3)" }}>
              <p style={{ fontSize:14, marginBottom:8 }}>Sin resultados para esos filtros.</p>
              <button onClick={clearAll}
                style={{ fontSize:11, fontWeight:600, letterSpacing:1.5, textTransform:"uppercase",
                  color:"var(--bg)", background:"var(--text)", border:"none", borderRadius:2,
                  padding:"10px 20px", cursor:"pointer", fontFamily:"inherit" }}>
                Limpiar filtros
              </button>
            </div>
          ) : (
            <div className="prod-grid-4">
              {filtered.map(p => <ProdCard key={p.id} p={p} cols={cols}/>)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
