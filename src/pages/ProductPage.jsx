import { useState } from "react";
import { useTheme } from "../context/ThemeContext";

const PRODUCT = {
  name: "Bolsa Drawstring con Charm",
  tagline: "Ligera. Icónica. Siempre lista.",
  collection: "Always On",
  price: 1899,
  rating: 4.8,
  reviews: 124,
  description: "Diseñada para acompañarte sin esfuerzo desde la mañana hasta la noche. Confeccionada en piel vegana de alta calidad, con herrajes dorados que no pierden su brillo. El charm intercambiable la hace única — tan única como tú.",
  images: [
    "https://images.unsplash.com/photo-1559563458-527698bf5295?w=800&q=85",
    "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=85",
    "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=85",
    "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=85",
  ],
  colors: [
    { name:"Camel", hex:"#c4a060" },
    { name:"Negro", hex:"#111111" },
    { name:"Coral", hex:"#e8927a" },
    { name:"Nude",  hex:"#e8d5c0" },
  ],
  dimensions: [
    { label:"Alto",   val:"28 cm" },
    { label:"Ancho",  val:"32 cm" },
    { label:"Fondo",  val:"12 cm" },
    { label:"Asa",    val:"60 cm" },
  ],
  features: ["Piel vegana premium","Herrajes dorados","Charm intercambiable","Cierre magnético","Bolsillo interior con zipper","Forro satinado"],
  related: [
    { name:"Bolsa Hobo Maxi", price:2299, img:"https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=80" },
    { name:"Bolsa Tote Grande", price:1049, img:"https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&q=80" },
    { name:"Bolsa Crossbody Mini", price:1499, img:"https://images.unsplash.com/photo-1612817288484-6f916006741a?w=400&q=80" },
    { name:"Porta Laptop Doble", price:1899, img:"https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80" },
  ],
  reviews_data: [
    { name:"Mariana G.", rating:5, date:"Marzo 2026", text:"La bolsa es hermosa, el cuero se siente de muy buena calidad. Los herrajes dorados son elegantes y el charm le da un toque especial. ¡Ya la compré en dos colores!" },
    { name:"Sofía R.", rating:5, date:"Febrero 2026", text:"Súper ligera y espaciosa. Cabe mi laptop de 13\", agenda, y todavía me sobra espacio. El envío llegó rapidísimo y muy bien empaquetado." },
    { name:"Fernanda L.", rating:4, date:"Enero 2026", text:"Muy bonita y resistente. Le doy 4 estrellas porque me hubiera gustado que viniera con más colores de charm, pero en general estoy muy satisfecha." },
  ],
};

// ─── STARS ──────────────────────────────────────────────────────────
const Stars = ({ rating, size = 14 }) => (
  <div style={{ display:"flex", gap:2 }}>
    {[1,2,3,4,5].map(i => (
      <svg key={i} width={size} height={size} viewBox="0 0 24 24"
        fill={i <= Math.round(rating) ? "var(--tan)" : "var(--border)"} stroke="none">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    ))}
  </div>
);

// ─── ACCORDION ──────────────────────────────────────────────────────
function Accordion({ title, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom:"1px solid var(--border)" }}>
      <button onClick={() => setOpen(v=>!v)}
        style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
          width:"100%", padding:"16px 0", background:"none", border:"none",
          cursor:"pointer", fontSize:13, fontWeight:500, color:"var(--text)",
          fontFamily:"inherit", letterSpacing:.3 }}>
        {title}
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          style={{ transition:"transform .3s", transform:open?"rotate(180deg)":"none", flexShrink:0 }}>
          <path d="m6 9 6 6 6-6"/>
        </svg>
      </button>
      <div style={{ height: open ? "auto" : 0, overflow:"hidden", transition:"height .3s" }}>
        <div style={{ paddingBottom:16 }}>{children}</div>
      </div>
    </div>
  );
}

export default function ProductPage() {
  const { dark } = useTheme();
  const [selImg,   setSelImg]   = useState(0);
  const [selColor, setSelColor] = useState(0);
  const [qty,      setQty]      = useState(1);
  const [wished,   setWished]   = useState(false);
  const [added,    setAdded]    = useState(false);
  const [zoom,     setZoom]     = useState(false);

  const handleAdd = () => {
    setAdded(true);
    setTimeout(() => setAdded(false), 3000);
  };

  const kueskiInstall = Math.ceil(PRODUCT.price / 3);

  return (
    <div style={{ maxWidth:1280, margin:"0 auto", padding:"48px 48px 80px" }}>
      <style>{`
        .prod-layout{display:grid;grid-template-columns:1fr 1fr;gap:64px;align-items:start}
        .thumb-strip{display:flex;flex-direction:column;gap:10px}
        .thumb-btn{width:72px;height:88px;border-radius:4px;overflow:hidden;cursor:pointer;flex-shrink:0;transition:opacity .2s}
        .img-main{border-radius:6px;overflow:hidden;position:relative;cursor:zoom-in;aspect-ratio:3/4;background:var(--bg2)}
        .img-main img{width:100%;height:100%;object-fit:cover;transition:transform .5s}
        .img-main:hover img{transform:scale(1.04)}
        .related-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:20px}
        @media(max-width:900px){.prod-layout{grid-template-columns:1fr;gap:32px}.thumb-strip{flex-direction:row}.related-grid{grid-template-columns:1fr 1fr}}
        @media(max-width:600px){.prod-layout{padding:0 16px}.thumb-btn{width:56px;height:68px}.related-grid{grid-template-columns:1fr 1fr;gap:12px}}
      `}</style>

      {/* Breadcrumb */}
      <div style={{ display:"flex", gap:8, fontSize:11, color:"var(--text3)", marginBottom:32, letterSpacing:.5 }}>
        {["Inicio","Bolsas","Always On"].map((c,i,arr) => (
          <span key={c} style={{ display:"flex", alignItems:"center", gap:8 }}>
            <a href="#" style={{ color: i===arr.length-1?"var(--text)":"var(--text3)", transition:"color .2s" }}
              onMouseEnter={e=>e.target.style.color="var(--text)"}
              onMouseLeave={e=>e.target.style.color=i===arr.length-1?"var(--text)":"var(--text3)"}>
              {c}
            </a>
            {i < arr.length-1 && <span style={{ opacity:.4 }}>/</span>}
          </span>
        ))}
      </div>

      <div className="prod-layout">
        {/* ── GALLERY ── */}
        <div style={{ display:"grid", gridTemplateColumns:"72px 1fr", gap:14 }}>
          <div className="thumb-strip">
            {PRODUCT.images.map((img,i) => (
              <button key={i} className="thumb-btn"
                style={{ border: selImg===i ? "2px solid var(--tan)" : "2px solid var(--border)" }}
                onClick={() => setSelImg(i)}>
                <img src={img} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
              </button>
            ))}
          </div>
          <div className="img-main" onClick={() => setZoom(true)}>
            <img src={PRODUCT.images[selImg]} alt={PRODUCT.name}/>
            {PRODUCT.images[selImg] && (
              <div style={{ position:"absolute", top:12, right:12, background:"rgba(255,255,255,.85)",
                borderRadius:"50%", width:32, height:32, display:"flex", alignItems:"center",
                justifyContent:"center", color:"#111" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
              </div>
            )}
          </div>
        </div>

        {/* ── INFO ── */}
        <div>
          {/* Badge */}
          <div style={{ display:"flex", gap:8, marginBottom:14 }}>
            <span style={{ fontSize:10, fontWeight:600, letterSpacing:2, textTransform:"uppercase",
              color:"var(--tan)", background:"var(--tan-light)", padding:"3px 10px", borderRadius:2 }}>
              {PRODUCT.collection}
            </span>
          </div>

          <h1 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:"clamp(28px,3vw,40px)",
            fontWeight:300, lineHeight:1.1, color:"var(--text)", marginBottom:8 }}>
            {PRODUCT.name}
          </h1>
          <p style={{ fontSize:13, color:"var(--text3)", fontStyle:"italic", marginBottom:16 }}>{PRODUCT.tagline}</p>

          {/* Rating */}
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:24,
            paddingBottom:24, borderBottom:"1px solid var(--border)" }}>
            <Stars rating={PRODUCT.rating}/>
            <span style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:20, fontWeight:600, color:"var(--text)" }}>{PRODUCT.rating}</span>
            <a href="#reviews" style={{ fontSize:12, color:"var(--text3)", textDecoration:"underline" }}>
              {PRODUCT.reviews} reseñas
            </a>
          </div>

          {/* Price */}
          <div style={{ marginBottom:20 }}>
            <span style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:"clamp(32px,3vw,44px)",
              fontWeight:600, color:"var(--text)" }}>
              ${PRODUCT.price.toLocaleString()}
            </span>
            <div style={{ fontSize:11, color:"var(--text3)", marginTop:4 }}>
              ó 3 pagos de{" "}
              <strong style={{ color:"var(--tan)" }}>${kueskiInstall.toLocaleString()}</strong>{" "}
              sin intereses con Kueski Pay
            </div>
          </div>

          {/* Colors */}
          <div style={{ marginBottom:20 }}>
            <p style={{ fontSize:11, fontWeight:600, letterSpacing:1.5, textTransform:"uppercase",
              color:"var(--text2)", marginBottom:10 }}>
              Color: <span style={{ fontWeight:400, color:"var(--text3)" }}>{PRODUCT.colors[selColor].name}</span>
            </p>
            <div style={{ display:"flex", gap:10 }}>
              {PRODUCT.colors.map((c,i) => (
                <button key={i} onClick={() => setSelColor(i)}
                  style={{ width:28, height:28, borderRadius:"50%", background:c.hex,
                    border: selColor===i ? "2px solid var(--tan)" : "2px solid transparent",
                    outline: selColor===i ? "2px solid var(--tan)" : "none", outlineOffset:2,
                    cursor:"pointer", transition:"transform .15s",
                    transform: selColor===i?"scale(1.15)":"scale(1)" }}
                  title={c.name}/>
              ))}
            </div>
          </div>

          {/* Qty + Add */}
          <div style={{ display:"flex", gap:12, marginBottom:16 }}>
            <div style={{ display:"flex", alignItems:"center", border:"1px solid var(--border)",
              borderRadius:2, overflow:"hidden" }}>
              <button onClick={() => setQty(q => Math.max(1,q-1))}
                style={{ width:40, height:48, background:"none", border:"none",
                  cursor:"pointer", color:"var(--text)", fontSize:18 }}>-</button>
              <span style={{ width:36, textAlign:"center", fontSize:14, color:"var(--text)" }}>{qty}</span>
              <button onClick={() => setQty(q => q+1)}
                style={{ width:40, height:48, background:"none", border:"none",
                  cursor:"pointer", color:"var(--text)", fontSize:18 }}>+</button>
            </div>

            <button onClick={handleAdd} style={{ flex:1, padding:"14px 24px",
              background: added ? "#22c55e" : "var(--text)", color:"var(--bg)",
              border:"none", borderRadius:2, fontSize:11, fontWeight:600,
              letterSpacing:2, textTransform:"uppercase", cursor:"pointer",
              transition:"background .3s", fontFamily:"inherit" }}>
              {added ? "✓ En tu carrito" : "Agregar al carrito"}
            </button>

            <button onClick={() => setWished(v=>!v)}
              style={{ width:50, height:50, border:"1px solid var(--border)", borderRadius:2,
                background:"none", cursor:"pointer", display:"flex", alignItems:"center",
                justifyContent:"center", flexShrink:0 }}>
              <svg width="18" height="18" viewBox="0 0 24 24"
                fill={wished?"#b5342a":"none"} stroke={wished?"#b5342a":"var(--text)"} strokeWidth="1.5">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </button>
          </div>

          {/* Buy now */}
          <button style={{ width:"100%", padding:"14px 24px", background:"var(--tan)", color:"white",
            border:"none", borderRadius:2, fontSize:11, fontWeight:600, letterSpacing:2,
            textTransform:"uppercase", cursor:"pointer", fontFamily:"inherit", marginBottom:24 }}>
            Comprar ahora
          </button>

          {/* Trust mini */}
          <div style={{ display:"flex", gap:16, padding:"14px 0", borderTop:"1px solid var(--border)",
            borderBottom:"1px solid var(--border)", marginBottom:24 }}>
            {[{i:"🚚",t:"Envío gratis"},{i:"↩",t:"30 días"},{i:"🔒",t:"Pago seguro"}].map(({ i, t }) => (
              <div key={t} style={{ display:"flex", alignItems:"center", gap:6, fontSize:11, color:"var(--text2)", flex:1 }}>
                <span>{i}</span>{t}
              </div>
            ))}
          </div>

          {/* Accordions */}
          <Accordion title="Descripción">
            <p style={{ fontSize:13, color:"var(--text2)", lineHeight:1.8 }}>{PRODUCT.description}</p>
          </Accordion>
          <Accordion title="Características">
            <ul style={{ paddingLeft:0, listStyle:"none" }}>
              {PRODUCT.features.map(f => (
                <li key={f} style={{ display:"flex", alignItems:"center", gap:8,
                  padding:"5px 0", fontSize:13, color:"var(--text2)" }}>
                  <span style={{ width:4, height:4, borderRadius:"50%", background:"var(--tan)", flexShrink:0 }}/>
                  {f}
                </li>
              ))}
            </ul>
          </Accordion>
          <Accordion title="Dimensiones">
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              {PRODUCT.dimensions.map(({ label, val }) => (
                <div key={label} style={{ background:"var(--bg2)", borderRadius:4, padding:"12px 14px",
                  border:"1px solid var(--border)" }}>
                  <p style={{ fontSize:10, fontWeight:600, letterSpacing:1.5, textTransform:"uppercase",
                    color:"var(--text3)", marginBottom:4 }}>{label}</p>
                  <p style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:22, fontWeight:600, color:"var(--text)" }}>{val}</p>
                </div>
              ))}
            </div>
          </Accordion>
        </div>
      </div>

      {/* ── REVIEWS ── */}
      <div id="reviews" style={{ marginTop:80, paddingTop:48, borderTop:"1px solid var(--border)" }}>
        <div style={{ display:"flex", alignItems:"baseline", gap:16, marginBottom:40 }}>
          <span style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:64, fontWeight:300, color:"var(--text)", lineHeight:1 }}>{PRODUCT.rating}</span>
          <div>
            <Stars rating={PRODUCT.rating} size={18}/>
            <p style={{ fontSize:12, color:"var(--text3)", marginTop:4 }}>{PRODUCT.reviews} reseñas verificadas</p>
          </div>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:20 }}>
          {PRODUCT.reviews_data.map((r,i) => (
            <div key={i} style={{ background:"var(--bg2)", border:"1px solid var(--border)",
              borderRadius:6, padding:"20px 22px" }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:12 }}>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <div style={{ width:36, height:36, borderRadius:"50%", background:"var(--tan-light)",
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontSize:13, fontWeight:600, color:"var(--tan-dark,#a07d50)" }}>
                    {r.name[0]}
                  </div>
                  <div>
                    <p style={{ fontSize:13, fontWeight:500, color:"var(--text)" }}>{r.name}</p>
                    <p style={{ fontSize:11, color:"var(--text3)" }}>{r.date}</p>
                  </div>
                </div>
                <Stars rating={r.rating} size={12}/>
              </div>
              <p style={{ fontSize:13, color:"var(--text2)", lineHeight:1.7 }}>{r.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── RELATED ── */}
      <div style={{ marginTop:80, paddingTop:48, borderTop:"1px solid var(--border)" }}>
        <p style={{ fontSize:10, fontWeight:600, letterSpacing:3, textTransform:"uppercase",
          color:"var(--tan)", marginBottom:12 }}>También te puede gustar</p>
        <h2 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:"clamp(24px,3vw,36px)",
          fontWeight:300, color:"var(--text)", marginBottom:32 }}>Completa tu look</h2>
        <div className="related-grid">
          {PRODUCT.related.map((p,i) => (
            <a key={i} href="#" style={{ cursor:"pointer" }} className="rel-card">
              <div style={{ borderRadius:6, overflow:"hidden", aspectRatio:"3/4",
                background:"var(--bg2)", marginBottom:10 }}>
                <img src={p.img} alt={p.name}
                  style={{ width:"100%", height:"100%", objectFit:"cover", transition:"transform .4s" }}
                  className="rel-img"/>
              </div>
              <p style={{ fontSize:13, fontWeight:500, color:"var(--text)", marginBottom:3 }}>{p.name}</p>
              <p style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:19, fontWeight:600, color:"var(--text)" }}>${p.price.toLocaleString()}</p>
            </a>
          ))}
        </div>
      </div>
      <style>{`.rel-card:hover .rel-img{transform:scale(1.05)}`}</style>

      {/* Zoom overlay */}
      {zoom && (
        <div onClick={() => setZoom(false)}
          style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.9)", zIndex:1000,
            display:"flex", alignItems:"center", justifyContent:"center", cursor:"zoom-out" }}>
          <img src={PRODUCT.images[selImg]} alt=""
            style={{ maxWidth:"90vw", maxHeight:"90vh", objectFit:"contain", borderRadius:4 }}/>
        </div>
      )}
    </div>
  );
}
