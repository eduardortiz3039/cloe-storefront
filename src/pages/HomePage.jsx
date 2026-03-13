import { useState, useEffect, useRef } from "react";
import { useTheme } from "../context/ThemeContext";

// ─── MOCK DATA ──────────────────────────────────────────────────────
const TIKTOK_HANDLE  = "@cloeoemoda";
const IG_HANDLE      = "@cloeoemoda";
const TIKTOK_URL     = "https://www.tiktok.com/@cloeoemoda";
const IG_URL         = "https://www.instagram.com/cloeoemoda/";

const tiktokVideos = [
  { id:1, thumb:"https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400&q=80", caption:"Nueva colección Tote 🛍️", views:"124K", likes:"8.2K", url:TIKTOK_URL,
    product:{ name:"Bolsa Tote Camel", price:"$2,099", url:"#producto-1" } },
  { id:2, thumb:"https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=80", caption:"Hobo perfecto para el día ✨", views:"98K", likes:"6.1K", url:TIKTOK_URL,
    product:{ name:"Bolsa Hobo Maxi", price:"$2,299", url:"#producto-2" } },
  { id:3, thumb:"https://images.unsplash.com/photo-1544816155-12df9643f363?w=400&q=80", caption:"Look de oficina completo 💼", views:"211K", likes:"14K", url:TIKTOK_URL,
    product:{ name:"Porta Laptop Doble", price:"$1,899", url:"#producto-3" } },
  { id:4, thumb:"https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&q=80", caption:"Crossbody mini 🌸", views:"87K", likes:"5.4K", url:TIKTOK_URL,
    product:{ name:"Bolsa Crossbody Mini", price:"$1,499", url:"#producto-4" } },
  { id:5, thumb:"https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&q=80", caption:"Tacones primavera 👠", views:"155K", likes:"11K", url:TIKTOK_URL,
    product:{ name:"Tacones Primavera", price:"$1,299", url:"#producto-5" } },
  { id:6, thumb:"https://images.unsplash.com/photo-1612817288484-6f916006741a?w=400&q=80", caption:"Maleta de cabina 🧳", views:"76K", likes:"4.8K", url:TIKTOK_URL,
    product:{ name:"Maleta Cabina 20\"", price:"$4,299", url:"#producto-6" } },
];

const igPosts = [
  { id:1, thumb:"https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=80", caption:"Spring vibes 🌸", likes:"2.1K", url:IG_URL,
    product:{ name:"Bolsa Tote Coral", price:"$2,699", url:"#ig-1" } },
  { id:2, thumb:"https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400&q=80", caption:"Always on 🖤", likes:"3.4K", url:IG_URL,
    product:{ name:"Bolsa Hobo Negra", price:"$2,299", url:"#ig-2" } },
  { id:3, thumb:"https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&q=80", caption:"Mini pero mighty ✨", likes:"1.8K", url:IG_URL,
    product:{ name:"Bolsa Mini Crossbody", price:"$1,499", url:"#ig-3" } },
  { id:4, thumb:"https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?w=400&q=80", caption:"Viaje de ensueño 🧳", likes:"4.2K", url:IG_URL,
    product:{ name:"Maleta Rígida 24\"", price:"$5,599", url:"#ig-4" } },
  { id:5, thumb:"https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=400&q=80", caption:"Detalles que importan 💎", likes:"2.9K", url:IG_URL,
    product:{ name:"Llavero Charm Mini", price:"$399", url:"#ig-5" } },
  { id:6, thumb:"https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&q=80", caption:"Primavera en cada paso 🌷", likes:"3.1K", url:IG_URL,
    product:{ name:"Flats Primavera", price:"$899", url:"#ig-6" } },
];

const bestSellers = [
  { id:1, name:"Bolsa Satchel Mediana", collection:"Mascada", price:"$2,099", oldPrice:null, colors:["#d4c89a","#111","#8b3a3a"], img:"https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&q=80" },
  { id:2, name:"Bolsa Hobo Maxi", collection:"Always On", price:"$2,299", oldPrice:null, colors:["#c9a97a","#e8a0a0"], img:"https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80" },
  { id:3, name:"Bolsa Tote Grande", collection:"Ultra Ligera", price:"$1,049", oldPrice:"$1,399", colors:["#c4a060","#f0f0f0"], img:"https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&q=80" },
  { id:4, name:"Bolsa Crossbody Mini", collection:"Spring 2026", price:"$1,499", oldPrice:null, colors:["#5090a0"], img:"https://images.unsplash.com/photo-1612817288484-6f916006741a?w=600&q=80" },
];

// ─── HOOKS ──────────────────────────────────────────────────────────
function useAutoRotate(length, interval = 4000) {
  const [active, setActive] = useState(0);
  const timer = useRef(null);
  const reset = () => {
    clearInterval(timer.current);
    timer.current = setInterval(() => setActive(a => (a + 1) % length), interval);
  };
  useEffect(() => { reset(); return () => clearInterval(timer.current); }, [length]);
  const go = (i) => { setActive(i); reset(); };
  return [active, go];
}

// ─── TikTok Icon ────────────────────────────────────────────────────
const TikTokIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V9a8.26 8.26 0 0 0 4.84 1.55V7.12a4.85 4.85 0 0 1-1.07-.43z"/>
  </svg>
);

const IGIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <circle cx="12" cy="12" r="4"/>
    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
  </svg>
);

const PlayIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
    <circle cx="12" cy="12" r="12" fill="rgba(0,0,0,0.5)"/>
    <polygon points="10,8 18,12 10,16" fill="white"/>
  </svg>
);

// ─── SPINNING CAROUSEL ──────────────────────────────────────────────
function SpinningCarousel({ items, platform, profileUrl, profileHandle }) {
  const [active, goTo] = useAutoRotate(items.length, 3500);
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const isTikTok = platform === "tiktok";

  return (
    <div style={{ position:"relative" }}>
      {/* Platform header */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:32 }}>
        <div style={{ display:"flex", alignItems:"center", gap:14 }}>
          <div style={{ width:48, height:48, borderRadius:"50%", background:"var(--bg3)",
            display:"flex", alignItems:"center", justifyContent:"center", color:"var(--text)" }}>
            {isTikTok ? <TikTokIcon size={22}/> : <IGIcon size={22}/>}
          </div>
          <div>
            <p style={{ fontSize:11, fontWeight:600, letterSpacing:2, textTransform:"uppercase", color:"var(--text3)", marginBottom:3 }}>
              {isTikTok ? "TikTok" : "Instagram"}
            </p>
            <a href={profileUrl} target="_blank" rel="noopener noreferrer"
              style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:22, fontWeight:600, color:"var(--text)" }}>
              {profileHandle}
            </a>
          </div>
        </div>
        <a href={profileUrl} target="_blank" rel="noopener noreferrer"
          style={{ display:"flex", alignItems:"center", gap:8, fontSize:11, fontWeight:600,
            letterSpacing:1.5, textTransform:"uppercase", color:"var(--text)",
            border:"1px solid var(--border)", borderRadius:2, padding:"10px 18px",
            transition:"all .2s" }}
          onMouseEnter={e=>{ e.currentTarget.style.background="var(--text)"; e.currentTarget.style.color="var(--bg)"; }}
          onMouseLeave={e=>{ e.currentTarget.style.background="transparent"; e.currentTarget.style.color="var(--text)"; }}>
          Ver perfil →
        </a>
      </div>

      {/* Carousel track */}
      <div style={{ display:"flex", gap:16, overflowX:"auto", scrollBehavior:"smooth",
        paddingBottom:8, scrollbarWidth:"none" }}>
        <style>{`.carousel-track::-webkit-scrollbar{display:none}`}</style>

        {items.map((item, i) => {
          const isActive = i === active;
          return (
            <div key={item.id}
              onMouseEnter={() => setHoveredProduct(item.id)}
              onMouseLeave={() => setHoveredProduct(null)}
              style={{ flexShrink:0, width:isTikTok?200:240,
                transform: isActive ? "scale(1.04)" : "scale(0.96)",
                transition:"transform .5s cubic-bezier(.34,1.56,.64,1)",
                cursor:"pointer" }}
              onClick={() => goTo(i)}>

              {/* Video/post card */}
              <div style={{ position:"relative", borderRadius:12, overflow:"hidden",
                aspectRatio: isTikTok ? "9/16" : "1/1",
                boxShadow: isActive ? "0 12px 40px rgba(0,0,0,0.25)" : "0 4px 16px rgba(0,0,0,0.1)",
                transition:"box-shadow .4s" }}>
                <img src={item.thumb} alt={item.caption}
                  style={{ width:"100%", height:"100%", objectFit:"cover",
                    filter: isActive ? "none" : "grayscale(30%) brightness(0.85)",
                    transition:"filter .4s" }}/>

                {/* Overlay */}
                <div style={{ position:"absolute", inset:0,
                  background:"linear-gradient(transparent 40%, rgba(0,0,0,0.7))" }}/>

                {/* Play icon for TikTok */}
                {isTikTok && (
                  <div style={{ position:"absolute", top:"50%", left:"50%",
                    transform:"translate(-50%,-50%)", opacity: isActive ? 1 : 0.6 }}>
                    <PlayIcon/>
                  </div>
                )}

                {/* Stats */}
                <div style={{ position:"absolute", bottom:12, left:12, right:12, color:"white" }}>
                  <p style={{ fontSize:12, fontWeight:500, marginBottom:6, lineHeight:1.3 }}>{item.caption}</p>
                  <div style={{ display:"flex", gap:12, fontSize:11, opacity:.8 }}>
                    {isTikTok
                      ? <><span>▶ {item.views}</span><span>♥ {item.likes}</span></>
                      : <span>♥ {item.likes}</span>
                    }
                  </div>
                </div>

                {/* Active indicator */}
                {isActive && (
                  <div style={{ position:"absolute", top:10, right:10,
                    width:8, height:8, borderRadius:"50%", background:"var(--tan)",
                    boxShadow:"0 0 0 2px rgba(255,255,255,.5)" }}/>
                )}
              </div>

              {/* Mini product card — shows on hover or active */}
              <div style={{
                marginTop:10, padding:"10px 12px",
                background:"var(--bg2)", borderRadius:8,
                border:"1px solid var(--border)",
                opacity: (isActive || hoveredProduct===item.id) ? 1 : 0,
                transform: (isActive || hoveredProduct===item.id) ? "translateY(0)" : "translateY(6px)",
                transition:"opacity .3s, transform .3s",
                pointerEvents: (isActive || hoveredProduct===item.id) ? "all" : "none",
              }}>
                <p style={{ fontSize:12, fontWeight:500, color:"var(--text)", marginBottom:4, letterSpacing:.3 }}>{item.product.name}</p>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                  <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:18, fontWeight:600, color:"var(--tan-dark)" }}>{item.product.price}</span>
                  <a href={item.product.url}
                    style={{ fontSize:10, fontWeight:600, letterSpacing:1.5, textTransform:"uppercase",
                      color:"var(--bg)", background:"var(--text)", padding:"5px 10px", borderRadius:2 }}>
                    Ver →
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Dots */}
      <div style={{ display:"flex", justifyContent:"center", gap:8, marginTop:20 }}>
        {items.map((_,i) => (
          <button key={i} onClick={() => goTo(i)}
            style={{ width: i===active?24:8, height:8, borderRadius:4, border:"none",
              background: i===active ? "var(--tan)" : "var(--border)",
              cursor:"pointer", transition:"all .3s", padding:0 }}/>
        ))}
      </div>
    </div>
  );
}

// ─── BEST SELLER CARD ───────────────────────────────────────────────
function ProductCard({ p }) {
  const [selColor, setSelColor] = useState(0);
  const [wished, setWished] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAdd = (e) => {
    e.preventDefault();
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div style={{ cursor:"pointer" }} className="p-card">
      <div style={{ position:"relative", borderRadius:6, overflow:"hidden",
        aspectRatio:"3/4", background:"var(--bg2)", marginBottom:14 }} className="p-img-wrap">
        <img src={p.img} alt={p.name} style={{ width:"100%", height:"100%", objectFit:"cover",
          transition:"transform .5s ease" }} className="p-img"/>

        {p.oldPrice && (
          <div style={{ position:"absolute", top:12, left:12, background:"#b5342a", color:"white",
            fontSize:9, fontWeight:700, letterSpacing:1.5, padding:"3px 8px", borderRadius:2 }}>SALE</div>
        )}

        <button onClick={e=>{e.preventDefault();setWished(v=>!v)}}
          style={{ position:"absolute", top:12, right:12, width:34, height:34, borderRadius:"50%",
            background:"rgba(255,255,255,.9)", border:"none", cursor:"pointer",
            display:"flex", alignItems:"center", justifyContent:"center",
            opacity:0, transition:"opacity .2s, transform .2s", transform:"scale(.8)" }} className="p-wish">
          <svg width="14" height="14" viewBox="0 0 24 24" fill={wished?"#b5342a":"none"}
            stroke={wished?"#b5342a":"currentColor"} strokeWidth="1.5">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>

        <button onClick={handleAdd}
          style={{ position:"absolute", bottom:0, left:0, right:0,
            background: added ? "#22c55e" : "var(--text)",
            color:"var(--bg)", fontSize:10, fontWeight:600, letterSpacing:1.5,
            textTransform:"uppercase", border:"none", cursor:"pointer", padding:11,
            transform:"translateY(100%)", transition:"transform .25s, background .2s" }} className="p-quick">
          {added ? "✓ Agregado" : "+ Agregar al carrito"}
        </button>
      </div>

      <div style={{ fontSize:13.5, fontWeight:500, color:"var(--text)", marginBottom:3 }}>{p.name}</div>
      <div style={{ fontSize:12, color:"var(--text3)", marginBottom:8 }}>{p.collection}</div>
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
        <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:22, fontWeight:600, color:"var(--text)" }}>{p.price}</span>
        {p.oldPrice && <span style={{ fontSize:13, color:"var(--text3)", textDecoration:"line-through" }}>{p.oldPrice}</span>}
      </div>
      <div style={{ display:"flex", gap:5 }}>
        {p.colors.map((c,i) => (
          <div key={i} onClick={()=>setSelColor(i)}
            style={{ width:11, height:11, borderRadius:"50%", background:c, cursor:"pointer",
              border: selColor===i ? "2px solid var(--text)" : "2px solid transparent",
              outline: selColor===i ? "1px solid var(--text)" : "none", outlineOffset:2,
              transition:"transform .15s", transform: selColor===i?"scale(1.2)":"scale(1)" }}/>
        ))}
      </div>

      <style>{`
        .p-card:hover .p-wish { opacity:1 !important; transform:scale(1) !important; }
        .p-card:hover .p-quick { transform:translateY(0) !important; }
        .p-card:hover .p-img { transform:scale(1.04); }
      `}</style>
    </div>
  );
}

// ─── SECTION TITLE ──────────────────────────────────────────────────
function SectionTitle({ eyebrow, title, subtitle, center=false }) {
  return (
    <div style={{ textAlign: center?"center":"left", marginBottom:48 }}>
      {eyebrow && <p style={{ fontSize:10, fontWeight:600, letterSpacing:3, textTransform:"uppercase",
        color:"var(--tan)", marginBottom:12 }}>{eyebrow}</p>}
      <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(32px,4vw,52px)",
        fontWeight:300, lineHeight:1.1, color:"var(--text)", marginBottom: subtitle?12:0 }}>
        {title}
      </h2>
      {subtitle && <p style={{ fontSize:14, color:"var(--text3)", lineHeight:1.8, maxWidth:480,
        margin: center?"0 auto":0 }}>{subtitle}</p>}
    </div>
  );
}

// ─── DIVIDER ────────────────────────────────────────────────────────
function Divider() {
  return <div style={{ height:1, background:"var(--border)", margin:"80px 0" }}/>;
}

// ─── HOMEPAGE ───────────────────────────────────────────────────────
export default function HomePage() {
  const { dark } = useTheme();

  return (
    <main>
      <style>{`
        /* Hero */
        .hero { display:grid; grid-template-columns:1fr 1fr; min-height:90vh; }
        .hero-text { background:var(--text); display:flex; flex-direction:column; justify-content:flex-end; padding:80px 64px; position:relative; overflow:hidden; }
        .hero-img { position:relative; overflow:hidden; }
        .hero-img img { width:100%; height:100%; object-fit:cover; filter:${dark?"brightness(.85)":"brightness(1)"}; transition:transform 6s ease; }
        .hero-img:hover img { transform:scale(1.04); }

        /* Trust bar */
        .trust-bar { display:grid; grid-template-columns:repeat(4,1fr); border-bottom:1px solid var(--border); }
        .trust-item { display:flex; align-items:center; gap:12; padding:20px 32px; border-right:1px solid var(--border); }
        .trust-item:last-child { border-right:none; }

        /* Categories */
        .cat-grid { display:grid; grid-template-columns:2fr 1fr 1fr; gap:16px; }
        .cat-card { position:relative; overflow:hidden; border-radius:4px; cursor:pointer; }
        .cat-card img { width:100%; height:100%; object-fit:cover; transition:transform .5s ease; }
        .cat-card:hover img { transform:scale(1.05); }

        /* Social sections */
        .social-section { padding:80px 48px; }

        /* Products */
        .products-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:24px; }

        @media (max-width:1024px) {
          .hero { grid-template-columns:1fr; }
          .hero-img { min-height:50vh; }
          .trust-bar { grid-template-columns:repeat(2,1fr); }
          .cat-grid { grid-template-columns:1fr 1fr; }
          .products-grid { grid-template-columns:repeat(2,1fr); }
          .social-section { padding:60px 28px; }
        }
        @media (max-width:768px) {
          .hero-text { padding:48px 28px; }
          .trust-bar { grid-template-columns:1fr 1fr; }
          .cat-grid { grid-template-columns:1fr; }
          .products-grid { grid-template-columns:repeat(2,1fr); gap:16px; }
          .social-section { padding:48px 20px; }
        }
      `}</style>

      {/* ── HERO ── */}
      <div className="hero">
        <div className="hero-text">
          {/* decorative circle */}
          <div style={{ position:"absolute", top:-120, right:-120, width:400, height:400,
            borderRadius:"50%", border:"1px solid rgba(201,169,122,.15)" }}/>
          <div style={{ position:"absolute", top:-60, right:-60, width:250, height:250,
            borderRadius:"50%", border:"1px solid rgba(201,169,122,.08)" }}/>

          <p style={{ fontSize:10, fontWeight:600, letterSpacing:4, textTransform:"uppercase",
            color:"var(--tan)", marginBottom:16, position:"relative", zIndex:1 }}>
            Colección Spring 2026
          </p>
          <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(44px,6vw,80px)",
            fontWeight:300, lineHeight:1.05, color:"white", marginBottom:16, position:"relative", zIndex:1 }}>
            Tu estilo,<br/><em style={{ fontStyle:"italic", color:"var(--tan-light,#e8d8c0)" }}>tu mundo.</em>
          </h1>
          <p style={{ fontSize:14, color:"rgba(255,255,255,.45)", lineHeight:1.8,
            maxWidth:380, marginBottom:40, position:"relative", zIndex:1 }}>
            Bolsas, calzado y accesorios diseñados para acompañarte en cada momento del día.
          </p>
          <div style={{ display:"flex", gap:12, position:"relative", zIndex:1 }}>
            <a href="#bolsas" style={{ display:"inline-flex", alignItems:"center", gap:8,
              background:"white", color:"#111", fontSize:11, fontWeight:600, letterSpacing:2,
              textTransform:"uppercase", padding:"14px 28px", borderRadius:2,
              transition:"all .2s" }}
              onMouseEnter={e=>{e.currentTarget.style.background="var(--tan)";e.currentTarget.style.color="white"}}
              onMouseLeave={e=>{e.currentTarget.style.background="white";e.currentTarget.style.color="#111"}}>
              Ver colección →
            </a>
            <a href="#novedades" style={{ display:"inline-flex", alignItems:"center", gap:8,
              background:"transparent", color:"rgba(255,255,255,.6)", fontSize:11, fontWeight:600,
              letterSpacing:2, textTransform:"uppercase", padding:"14px 28px", borderRadius:2,
              border:"1px solid rgba(255,255,255,.2)", transition:"all .2s" }}
              onMouseEnter={e=>{e.currentTarget.style.color="white";e.currentTarget.style.borderColor="rgba(255,255,255,.6)"}}
              onMouseLeave={e=>{e.currentTarget.style.color="rgba(255,255,255,.6)";e.currentTarget.style.borderColor="rgba(255,255,255,.2)"}}>
              Novedades
            </a>
          </div>
        </div>
        <div className="hero-img">
          <img src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=1200&q=90" alt="Hero"/>
          <div style={{ position:"absolute", bottom:32, right:32,
            background:"rgba(255,255,255,.95)", backdropFilter:"blur(8px)",
            borderRadius:4, padding:"16px 20px", minWidth:180 }}>
            <p style={{ fontSize:9, fontWeight:600, letterSpacing:2, textTransform:"uppercase",
              color:"var(--tan)", marginBottom:4 }}>Más vendida</p>
            <p style={{ fontSize:14, fontWeight:500, color:"#111", marginBottom:4 }}>Bolsa Satchel Mascada</p>
            <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:20, fontWeight:600, color:"#111" }}>$2,099</p>
          </div>
        </div>
      </div>

      {/* ── TRUST BAR ── */}
      <div className="trust-bar">
        {[
          { icon:"🚚", title:"Envío gratis", sub:"En compras +$1,499 MXN" },
          { icon:"↩", title:"Devolución 30 días", sub:"Sin costo, sin preguntas" },
          { icon:"🔒", title:"Pago seguro", sub:"Kueski Pay · MSI disponibles" },
          { icon:"📍", title:"+90 tiendas", sub:"Encuéntranos en todo México" },
        ].map(({ icon, title, sub }) => (
          <div key={title} style={{ display:"flex", alignItems:"center", gap:16,
            padding:"20px 32px", borderRight:"1px solid var(--border)" }}>
            <span style={{ fontSize:22 }}>{icon}</span>
            <div>
              <p style={{ fontSize:12, fontWeight:600, color:"var(--text)", marginBottom:2 }}>{title}</p>
              <p style={{ fontSize:11, color:"var(--text3)" }}>{sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── BEST SELLERS ── */}
      <section style={{ padding:"80px 48px" }}>
        <SectionTitle eyebrow="Lo más popular" title={<>Best<em style={{fontStyle:"italic"}}> Sellers</em></>}
          subtitle="Las piezas que todas quieren. Descubre por qué."/>
        <div className="products-grid">
          {bestSellers.map(p => <ProductCard key={p.id} p={p}/>)}
        </div>
      </section>

      <Divider/>

      {/* ── TIKTOK SECTION ── */}
      <section className="social-section" style={{ background:"var(--bg2)" }}>
        <div style={{ maxWidth:1200, margin:"0 auto" }}>
          <SectionTitle
            eyebrow="Como se usa en la vida real"
            title={<>Descúbrenos en <em style={{fontStyle:"italic"}}>TikTok</em></>}
            subtitle={`Mira cómo nuestras clientas lucen sus piezas favoritas en ${TIKTOK_HANDLE}`}
          />
          <SpinningCarousel items={tiktokVideos} platform="tiktok"
            profileUrl={TIKTOK_URL} profileHandle={TIKTOK_HANDLE}/>

          {/* API placeholder notice */}
          <div style={{ marginTop:32, padding:"14px 20px", background:"var(--bg3)",
            border:"1px solid var(--border)", borderRadius:4,
            fontSize:12, color:"var(--text3)", display:"flex", alignItems:"center", gap:10 }}>
            <TikTokIcon size={14}/>
            <span>
              <strong style={{color:"var(--text)"}}>Slot para API real:</strong>{" "}
              Conecta el feed de {TIKTOK_HANDLE} con TikTok Developer API para mostrar videos reales.{" "}
              <a href="https://developers.tiktok.com" target="_blank" rel="noopener noreferrer"
                style={{color:"var(--tan)"}}>Ver documentación →</a>
            </span>
          </div>
        </div>
      </section>

      <Divider/>

      {/* ── CATEGORIES ── */}
      <section style={{ padding:"0 48px 80px" }}>
        <SectionTitle eyebrow="Explora" title={<>Encuentra tu <em style={{fontStyle:"italic"}}>estilo</em></>}/>
        <div className="cat-grid">
          {[
            { label:"Bolsas", sub:"215 estilos", img:"https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=80", tall:true },
            { label:"Calzado", sub:"84 estilos", img:"https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&q=80" },
            { label:"Maletas", sub:"48 estilos", img:"https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?w=600&q=80" },
          ].map(({ label, sub, img, tall }) => (
            <a key={label} href={`#${label.toLowerCase()}`}
              style={{ position:"relative", overflow:"hidden", borderRadius:4, cursor:"pointer",
                gridRow: tall?"span 2":"auto", aspectRatio: tall?"auto":"4/3",
                minHeight: tall?500:200, display:"block" }}
              className="cat-card">
              <img src={img} alt={label} style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",transition:"transform .5s"}}
                onMouseEnter={e=>e.target.style.transform="scale(1.05)"}
                onMouseLeave={e=>e.target.style.transform="scale(1)"}/>
              <div style={{ position:"absolute", inset:0,
                background:"linear-gradient(transparent 40%,rgba(0,0,0,0.55))" }}/>
              <div style={{ position:"absolute", bottom:24, left:24, color:"white" }}>
                <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:32, fontWeight:600, marginBottom:4 }}>{label}</p>
                <p style={{ fontSize:11, opacity:.7, letterSpacing:1 }}>{sub}</p>
                <div style={{ marginTop:10, fontSize:11, fontWeight:600, letterSpacing:1.5,
                  textTransform:"uppercase", display:"flex", alignItems:"center", gap:6 }}>
                  Ver todo <span>→</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      <Divider/>

      {/* ── INSTAGRAM SECTION ── */}
      <section className="social-section">
        <div style={{ maxWidth:1200, margin:"0 auto" }}>
          <SectionTitle
            eyebrow="Inspírate con nuestra comunidad"
            title={<>Síguenos en <em style={{fontStyle:"italic"}}>Instagram</em></>}
            subtitle={`Las fotos más hermosas de nuestra comunidad en ${IG_HANDLE}`}
          />
          <SpinningCarousel items={igPosts} platform="instagram"
            profileUrl={IG_URL} profileHandle={IG_HANDLE}/>

          {/* API placeholder */}
          <div style={{ marginTop:32, padding:"14px 20px", background:"var(--bg2)",
            border:"1px solid var(--border)", borderRadius:4,
            fontSize:12, color:"var(--text3)", display:"flex", alignItems:"center", gap:10 }}>
            <IGIcon size={14}/>
            <span>
              <strong style={{color:"var(--text)"}}>Slot para API real:</strong>{" "}
              Conecta el feed de {IG_HANDLE} con Instagram Basic Display API para mostrar posts reales.{" "}
              <a href="https://developers.facebook.com/docs/instagram-basic-display-api" target="_blank" rel="noopener noreferrer"
                style={{color:"var(--tan)"}}>Ver documentación →</a>
            </span>
          </div>
        </div>
      </section>

      <Divider/>

      {/* ── NEWSLETTER ── */}
      <section style={{ background:"var(--text)", padding:"80px 48px", textAlign:"center", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:-100, left:-100, width:400, height:400,
          borderRadius:"50%", border:"1px solid rgba(201,169,122,.1)" }}/>
        <div style={{ position:"absolute", bottom:-80, right:-80, width:300, height:300,
          borderRadius:"50%", border:"1px solid rgba(201,169,122,.07)" }}/>
        <div style={{ position:"relative", zIndex:1, maxWidth:520, margin:"0 auto" }}>
          <p style={{ fontSize:10, fontWeight:600, letterSpacing:3, textTransform:"uppercase",
            color:"var(--tan)", marginBottom:16 }}>Club CLOE</p>
          <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(32px,4vw,48px)",
            fontWeight:300, color:"white", marginBottom:12 }}>
            Sé la primera en <em style={{fontStyle:"italic"}}>enterarse.</em>
          </h2>
          <p style={{ fontSize:14, color:"rgba(255,255,255,.45)", marginBottom:36, lineHeight:1.7 }}>
            Preventas exclusivas, descuentos y novedades directo a tu correo.
          </p>
          <div style={{ display:"flex", gap:0, maxWidth:400, margin:"0 auto" }}>
            <input type="email" placeholder="tu@correo.com"
              style={{ flex:1, padding:"14px 18px", background:"rgba(255,255,255,.06)",
                border:"1px solid rgba(255,255,255,.15)", borderRight:"none",
                borderRadius:"2px 0 0 2px", color:"white", fontSize:14, fontFamily:"inherit",
                outline:"none" }}/>
            <button style={{ padding:"14px 24px", background:"var(--tan)", color:"white",
              border:"none", borderRadius:"0 2px 2px 0", fontSize:11, fontWeight:600,
              letterSpacing:1.5, textTransform:"uppercase", cursor:"pointer",
              transition:"background .2s", fontFamily:"inherit" }}
              onMouseEnter={e=>e.currentTarget.style.background="var(--tan-dark,#a07d50)"}
              onMouseLeave={e=>e.currentTarget.style.background="var(--tan)"}>
              Suscribirme
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
