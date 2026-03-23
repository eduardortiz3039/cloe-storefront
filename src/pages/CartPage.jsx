import { useState } from "react";
import { useCart } from "../context/CartContext";

// ─── ICONS ───────────────────────────────────────────────────────────────────
const TrashIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14H6L5 6"/>
    <path d="M10 11v6M14 11v6"/>
    <path d="M9 6V4h6v2"/>
  </svg>
);
const ChevronIcon = ({ dir = "right" }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    style={{ transform: dir === "left" ? "rotate(180deg)" : "none" }}>
    <path d="m9 18 6-6-6-6"/>
  </svg>
);
const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const WalletIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M20 12V8H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14v4"/>
    <path d="M4 6v13a2 2 0 0 0 2 2h14v-4"/>
    <circle cx="18" cy="12" r="1" fill="currentColor"/>
  </svg>
);
const TagIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
    <line x1="7" y1="7" x2="7.01" y2="7"/>
  </svg>
);
const ShieldIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);
const TruckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
    <circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
  </svg>
);

// ─── ITEM DEL CARRITO ─────────────────────────────────────────────────────────
function CartItem({ item }) {
  const { updateQty, removeItem } = useCart();

  return (
    <div style={{ display:"grid", gridTemplateColumns:"80px 1fr auto",
      gap:16, padding:"20px 0", borderBottom:"1px solid var(--border)",
      alignItems:"start" }}>

      {/* Imagen */}
      <div style={{ width:80, height:100, borderRadius:6, overflow:"hidden",
        background:"var(--bg2)", flexShrink:0 }}>
        {item.img
          ? <img src={item.img} alt={item.name}
              style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
          : <div style={{ width:"100%", height:"100%", display:"flex",
              alignItems:"center", justifyContent:"center" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                stroke="var(--text3)" strokeWidth="1.2">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21,15 16,10 5,21"/>
              </svg>
            </div>
        }
      </div>

      {/* Info */}
      <div>
        <p style={{ fontSize:14, fontWeight:500, color:"var(--text)", marginBottom:3 }}>
          {item.name}
        </p>
        <p style={{ fontSize:12, color:"var(--text3)", marginBottom:6 }}>
          {item.collection}
        </p>
        {item.color && (
          <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:10 }}>
            <div style={{ width:12, height:12, borderRadius:"50%",
              background:item.color, border:"1px solid var(--border)" }}/>
            <span style={{ fontSize:11, color:"var(--text3)" }}>{item.colorName || item.color}</span>
          </div>
        )}

        {/* Qty */}
        <div style={{ display:"inline-flex", alignItems:"center",
          border:"1px solid var(--border)", borderRadius:2, overflow:"hidden" }}>
          <button onClick={() => updateQty(item.key, item.qty - 1)}
            style={{ width:32, height:32, background:"none", border:"none",
              cursor:"pointer", fontSize:16, color:"var(--text)", transition:"background .15s" }}
            onMouseEnter={e=>e.currentTarget.style.background="var(--bg2)"}
            onMouseLeave={e=>e.currentTarget.style.background="none"}>
            −
          </button>
          <span style={{ width:32, textAlign:"center", fontSize:13,
            color:"var(--text)", borderLeft:"1px solid var(--border)",
            borderRight:"1px solid var(--border)", lineHeight:"32px" }}>
            {item.qty}
          </span>
          <button onClick={() => updateQty(item.key, item.qty + 1)}
            style={{ width:32, height:32, background:"none", border:"none",
              cursor:"pointer", fontSize:16, color:"var(--text)", transition:"background .15s" }}
            onMouseEnter={e=>e.currentTarget.style.background="var(--bg2)"}
            onMouseLeave={e=>e.currentTarget.style.background="none"}>
            +
          </button>
        </div>
      </div>

      {/* Precio + eliminar */}
      <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:12 }}>
        <div style={{ textAlign:"right" }}>
          <p style={{ fontFamily:"'Cormorant Garamond',Georgia,serif",
            fontSize:22, fontWeight:600, color:"var(--text)" }}>
            ${(item.price * item.qty).toLocaleString()}
          </p>
          {item.qty > 1 && (
            <p style={{ fontSize:11, color:"var(--text3)" }}>
              ${item.price.toLocaleString()} c/u
            </p>
          )}
        </div>
        <button onClick={() => removeItem(item.key)}
          style={{ background:"none", border:"none", cursor:"pointer",
            color:"var(--text3)", display:"flex", alignItems:"center", gap:5,
            fontSize:11, transition:"color .2s", padding:0 }}
          onMouseEnter={e=>e.currentTarget.style.color="#b5342a"}
          onMouseLeave={e=>e.currentTarget.style.color="var(--text3)"}>
          <TrashIcon/> Eliminar
        </button>
      </div>
    </div>
  );
}

// ─── BANNER CASHBACK ──────────────────────────────────────────────────────────
function CashbackBanner() {
  const { cashbackDisponible, cashbackAplicado, setCashbackAplicado, cashbackMonto } = useCart();
  const [animating, setAnimating] = useState(false);

  const toggle = () => {
    setAnimating(true);
    setTimeout(() => { setCashbackAplicado(v => !v); setAnimating(false); }, 300);
  };

  return (
    <div style={{ borderRadius:8, overflow:"hidden",
      border:`1.5px solid ${cashbackAplicado ? "var(--tan)" : "var(--border)"}`,
      transition:"border-color .3s", marginBottom:20 }}>

      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", gap:14, padding:"16px 18px",
        background: cashbackAplicado ? "var(--tan-light)" : "var(--bg2)",
        transition:"background .3s" }}>
        <div style={{ width:42, height:42, borderRadius:"50%",
          background: cashbackAplicado ? "var(--tan)" : "var(--bg3)",
          display:"flex", alignItems:"center", justifyContent:"center",
          flexShrink:0, transition:"background .3s",
          color: cashbackAplicado ? "white" : "var(--text3)" }}>
          <WalletIcon/>
        </div>
        <div style={{ flex:1 }}>
          <p style={{ fontSize:13, fontWeight:600, color:"var(--text)", marginBottom:2 }}>
            Saldo a favor en tu cuenta
          </p>
          <p style={{ fontSize:12, color:"var(--text3)" }}>
            Tienes{" "}
            <strong style={{ color:"var(--tan)",
              fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:16 }}>
              ${cashbackDisponible.toLocaleString("es-MX", { minimumFractionDigits:2 })}
            </strong>
            {" "}disponibles
          </p>
        </div>

        {/* Toggle */}
        <button onClick={toggle}
          style={{ width:48, height:26, borderRadius:13, border:"none", cursor:"pointer",
            background: cashbackAplicado ? "var(--tan)" : "var(--border)",
            position:"relative", transition:"background .3s", flexShrink:0 }}>
          <span style={{ position:"absolute", top:3,
            left: cashbackAplicado ? "calc(100% - 22px)" : "3px",
            width:20, height:20, borderRadius:"50%", background:"white",
            transition:"left .3s", boxShadow:"0 1px 4px rgba(0,0,0,.2)",
            display:"flex", alignItems:"center", justifyContent:"center" }}>
            {cashbackAplicado && <CheckIcon/>}
          </span>
        </button>
      </div>

      {/* Detalle cuando está aplicado */}
      {cashbackAplicado && (
        <div style={{ padding:"12px 18px", background:"var(--bg)",
          borderTop:"1px dashed var(--tan)", animation:"fadeSlideDown .3s ease" }}>
          <style>{`@keyframes fadeSlideDown{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}`}</style>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <span style={{ width:20, height:20, borderRadius:"50%", background:"var(--tan)",
                display:"flex", alignItems:"center", justifyContent:"center", color:"white", flexShrink:0 }}>
                <CheckIcon/>
              </span>
              <span style={{ fontSize:13, color:"var(--text2)" }}>
                Saldo aplicado al total
              </span>
            </div>
            <span style={{ fontFamily:"'Cormorant Garamond',Georgia,serif",
              fontSize:20, fontWeight:600, color:"#22c55e" }}>
              −${cashbackMonto.toLocaleString("es-MX", { minimumFractionDigits:2 })}
            </span>
          </div>
          <p style={{ fontSize:11, color:"var(--text3)", marginTop:8, paddingLeft:28 }}>
            Saldo restante después de esta compra:{" "}
            <strong style={{ color:"var(--text2)" }}>
              ${(cashbackDisponible - cashbackMonto).toLocaleString("es-MX", { minimumFractionDigits:2 })}
            </strong>
          </p>
        </div>
      )}

      {/* Prompt cuando no está aplicado */}
      {!cashbackAplicado && (
        <div style={{ padding:"10px 18px", background:"var(--bg)",
          borderTop:"1px solid var(--border)" }}>
          <p style={{ fontSize:12, color:"var(--text3)" }}>
            Activa el saldo para descontarlo automáticamente de tu total.
          </p>
        </div>
      )}
    </div>
  );
}

// ─── RESUMEN DEL PEDIDO ───────────────────────────────────────────────────────
function OrderSummary({ onCheckout }) {
  const { subtotal, envio, total, cashbackAplicado, cashbackMonto, items } = useCart();
  const [cupon, setCupon]     = useState("");
  const [cuponOk, setCuponOk] = useState(false);
  const [cuponErr,setCuponErr]= useState(false);

  const applyCupon = () => {
    if (cupon.toUpperCase() === "KUESKINUEVO25") { setCuponOk(true); setCuponErr(false); }
    else { setCuponErr(true); setCuponOk(false); }
  };

  const fmx = (n) => n.toLocaleString("es-MX", { minimumFractionDigits:2 });

  return (
    <div style={{ background:"var(--bg2)", borderRadius:10,
      border:"1px solid var(--border)", padding:"24px 24px 20px", position:"sticky", top:90 }}>

      <h2 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif",
        fontSize:22, fontWeight:600, color:"var(--text)", marginBottom:20 }}>
        Resumen del pedido
      </h2>

      {/* Cashback */}
      <CashbackBanner/>

      {/* Cupón */}
      <div style={{ marginBottom:20 }}>
        <p style={{ fontSize:11, fontWeight:600, letterSpacing:1.5,
          textTransform:"uppercase", color:"var(--text3)", marginBottom:8,
          display:"flex", alignItems:"center", gap:6 }}>
          <TagIcon/> Código de descuento
        </p>
        <div style={{ display:"flex", gap:0 }}>
          <input value={cupon} onChange={e=>{ setCupon(e.target.value); setCuponOk(false); setCuponErr(false); }}
            placeholder="Ej. KUESKINUEVO25"
            style={{ flex:1, padding:"9px 12px",
              background:"var(--bg)", border:"1px solid var(--border)",
              borderRight:"none", borderRadius:"2px 0 0 2px",
              fontSize:13, color:"var(--text)", fontFamily:"inherit", outline:"none" }}/>
          <button onClick={applyCupon}
            style={{ padding:"9px 16px", background:"var(--text)", color:"var(--bg)",
              border:"none", borderRadius:"0 2px 2px 0", fontSize:11, fontWeight:600,
              letterSpacing:1.5, textTransform:"uppercase", cursor:"pointer",
              fontFamily:"inherit" }}>
            Aplicar
          </button>
        </div>
        {cuponOk  && <p style={{ fontSize:12, color:"#22c55e", marginTop:5 }}>✓ Cupón aplicado — 25% de descuento</p>}
        {cuponErr && <p style={{ fontSize:12, color:"#b5342a", marginTop:5 }}>Cupón no válido o expirado</p>}
      </div>

      {/* Desglose */}
      <div style={{ borderTop:"1px solid var(--border)", paddingTop:16,
        display:"flex", flexDirection:"column", gap:10 }}>
        <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, color:"var(--text2)" }}>
          <span>Subtotal ({items.reduce((a,i)=>a+i.qty,0)} artículos)</span>
          <span>${fmx(subtotal)}</span>
        </div>
        <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, color:"var(--text2)" }}>
          <span style={{ display:"flex", alignItems:"center", gap:5 }}>
            <TruckIcon/> Envío
          </span>
          <span style={{ color: envio === 0 ? "#22c55e" : "var(--text2)" }}>
            {envio === 0 ? "Gratis ✓" : `$${fmx(envio)}`}
          </span>
        </div>
        {cashbackAplicado && (
          <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, color:"#22c55e" }}>
            <span>Saldo a favor aplicado</span>
            <span>−${fmx(cashbackMonto)}</span>
          </div>
        )}
        {cuponOk && (
          <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, color:"#22c55e" }}>
            <span>Descuento KUESKINUEVO25</span>
            <span>−${fmx(subtotal * 0.25)}</span>
          </div>
        )}
        {envio > 0 && (
          <p style={{ fontSize:11, color:"var(--tan)", background:"var(--tan-light)",
            padding:"8px 10px", borderRadius:4 }}>
            Te faltan <strong>${fmx(1499 - subtotal)}</strong> para envío gratis
          </p>
        )}
      </div>

      {/* Total */}
      <div style={{ borderTop:"1px solid var(--border)", marginTop:16, paddingTop:16,
        display:"flex", justifyContent:"space-between", alignItems:"baseline" }}>
        <span style={{ fontSize:13, fontWeight:600, color:"var(--text)" }}>Total</span>
        <span style={{ fontFamily:"'Cormorant Garamond',Georgia,serif",
          fontSize:30, fontWeight:600, color:"var(--text)" }}>
          ${fmx(total - (cuponOk ? subtotal * 0.25 : 0))}
        </span>
      </div>

      <p style={{ fontSize:11, color:"var(--text3)", textAlign:"right", marginBottom:20 }}>
        MXN · Impuestos incluidos
      </p>

      {/* Botón checkout */}
      <button onClick={onCheckout}
        style={{ width:"100%", padding:"15px", background:"var(--text)", color:"var(--bg)",
          border:"none", borderRadius:2, fontSize:11, fontWeight:600,
          letterSpacing:2, textTransform:"uppercase", cursor:"pointer",
          fontFamily:"inherit", transition:"background .2s, transform .15s",
          display:"flex", alignItems:"center", justifyContent:"center", gap:10 }}
        onMouseEnter={e=>{ e.currentTarget.style.background="var(--tan)"; }}
        onMouseLeave={e=>{ e.currentTarget.style.background="var(--text)"; }}>
        Continuar al pago <ChevronIcon/>
      </button>

      {/* Trust */}
      <div style={{ display:"flex", justifyContent:"center", gap:20, marginTop:16 }}>
        {[
          { icon:<ShieldIcon/>, label:"Pago seguro" },
          { icon:"💳", label:"3 MSI" },
          { icon:"↩", label:"30 días" },
        ].map(({ icon, label }) => (
          <div key={label} style={{ display:"flex", alignItems:"center", gap:5,
            fontSize:11, color:"var(--text3)" }}>
            <span>{icon}</span>{label}
          </div>
        ))}
      </div>

      {/* Métodos de pago */}
      <div style={{ display:"flex", justifyContent:"center", gap:8, marginTop:14, flexWrap:"wrap" }}>
        {["Visa","MC","AMEX","Kueski","Aplazo","OXXO"].map(m => (
          <span key={m} style={{ fontSize:9, fontWeight:600, letterSpacing:1,
            color:"var(--text3)", background:"var(--bg)",
            border:"1px solid var(--border)", borderRadius:2,
            padding:"3px 8px", textTransform:"uppercase" }}>{m}</span>
        ))}
      </div>
    </div>
  );
}

// ─── CARRITO VACÍO ────────────────────────────────────────────────────────────
function EmptyCart() {
  return (
    <div style={{ textAlign:"center", padding:"80px 24px" }}>
      <div style={{ width:80, height:80, borderRadius:"50%", background:"var(--bg2)",
        display:"flex", alignItems:"center", justifyContent:"center",
        margin:"0 auto 24px" }}>
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none"
          stroke="var(--text3)" strokeWidth="1.2">
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
          <line x1="3" y1="6" x2="21" y2="6"/>
          <path d="M16 10a4 4 0 0 1-8 0"/>
        </svg>
      </div>
      <h2 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif",
        fontSize:32, fontWeight:300, color:"var(--text)", marginBottom:10 }}>
        Tu carrito está vacío
      </h2>
      <p style={{ fontSize:14, color:"var(--text3)", marginBottom:32, lineHeight:1.7 }}>
        Explora nuestra colección y encuentra la pieza perfecta para ti.
      </p>
      <a href="#/catalogo" style={{ display:"inline-flex", alignItems:"center", gap:8,
        background:"var(--text)", color:"var(--bg)", fontSize:11, fontWeight:600,
        letterSpacing:2, textTransform:"uppercase", padding:"14px 28px",
        borderRadius:2, transition:"background .2s" }}
        onMouseEnter={e=>e.currentTarget.style.background="var(--tan)"}
        onMouseLeave={e=>e.currentTarget.style.background="var(--text)"}>
        Ver colección →
      </a>
    </div>
  );
}

// ─── PÁGINA PRINCIPAL ─────────────────────────────────────────────────────────
export default function CartPage() {
  const { items, clearCart } = useCart();

  const handleCheckout = () => {
    window.location.hash = "#/checkout";
  };

  return (
    <main style={{ minHeight:"80vh", padding:"48px 48px 80px",
      maxWidth:1200, margin:"0 auto" }}>
      <style>{`
        @media(max-width:900px){
          .cart-layout { grid-template-columns:1fr !important; }
          .cart-summary { position:static !important; }
        }
        @media(max-width:600px){
          main { padding:32px 20px 60px !important; }
        }
      `}</style>

      {/* Breadcrumb */}
      <div style={{ display:"flex", alignItems:"center", gap:8,
        fontSize:11, color:"var(--text3)", marginBottom:32, letterSpacing:.5 }}>
        <a href="#/" style={{ transition:"color .2s" }}
          onMouseEnter={e=>e.target.style.color="var(--text)"}
          onMouseLeave={e=>e.target.style.color="var(--text3)"}>Inicio</a>
        <span>/</span>
        <span style={{ color:"var(--text)" }}>Carrito</span>
      </div>

      <div style={{ display:"flex", alignItems:"baseline",
        justifyContent:"space-between", marginBottom:32, flexWrap:"wrap", gap:12 }}>
        <h1 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif",
          fontSize:"clamp(28px,4vw,44px)", fontWeight:300, color:"var(--text)" }}>
          Mi carrito
          {items.length > 0 && (
            <span style={{ fontSize:16, color:"var(--text3)", fontFamily:"inherit",
              fontWeight:300, marginLeft:12 }}>
              ({items.reduce((a,i)=>a+i.qty,0)} artículos)
            </span>
          )}
        </h1>
        {items.length > 0 && (
          <button onClick={clearCart}
            style={{ background:"none", border:"none", cursor:"pointer",
              fontSize:12, color:"var(--text3)", fontFamily:"inherit",
              display:"flex", alignItems:"center", gap:5, transition:"color .2s" }}
            onMouseEnter={e=>e.currentTarget.style.color="#b5342a"}
            onMouseLeave={e=>e.currentTarget.style.color="var(--text3)"}>
            <TrashIcon/> Vaciar carrito
          </button>
        )}
      </div>

      {items.length === 0 ? <EmptyCart/> : (
        <div className="cart-layout"
          style={{ display:"grid", gridTemplateColumns:"1fr 380px", gap:40, alignItems:"start" }}>

          {/* ── Lista de productos ── */}
          <div>
            {/* Progreso envío gratis */}
            {(() => {
              const subtotal = items.reduce((a,i)=>a+i.price*i.qty,0);
              const pct = Math.min(100, (subtotal / 1499) * 100);
              return (
                <div style={{ background:"var(--bg2)", border:"1px solid var(--border)",
                  borderRadius:8, padding:"14px 18px", marginBottom:24 }}>
                  <div style={{ display:"flex", justifyContent:"space-between",
                    alignItems:"center", marginBottom:8 }}>
                    <span style={{ fontSize:12, display:"flex", alignItems:"center",
                      gap:6, color:"var(--text2)" }}>
                      <TruckIcon/>
                      {pct >= 100
                        ? <strong style={{ color:"#22c55e" }}>¡Envío gratis desbloqueado! 🎉</strong>
                        : <>Te faltan <strong style={{color:"var(--tan)"}}>
                            ${(1499 - subtotal).toLocaleString("es-MX", {minimumFractionDigits:2})}
                          </strong> para envío gratis</>
                      }
                    </span>
                    <span style={{ fontSize:11, color:"var(--text3)" }}>
                      ${subtotal.toLocaleString("es-MX", {minimumFractionDigits:2})} / $1,499
                    </span>
                  </div>
                  <div style={{ height:4, background:"var(--bg3)", borderRadius:2, overflow:"hidden" }}>
                    <div style={{ height:"100%", borderRadius:2, transition:"width .5s ease",
                      width:`${pct}%`,
                      background: pct >= 100 ? "#22c55e" : "var(--tan)" }}/>
                  </div>
                </div>
              );
            })()}

            {/* Items */}
            {items.map(item => <CartItem key={item.key} item={item}/>)}

            {/* Seguir comprando */}
            <div style={{ marginTop:24 }}>
              <a href="#/catalogo"
                style={{ display:"inline-flex", alignItems:"center", gap:8,
                  fontSize:12, color:"var(--text3)", fontFamily:"inherit",
                  transition:"color .2s" }}
                onMouseEnter={e=>e.currentTarget.style.color="var(--text)"}
                onMouseLeave={e=>e.currentTarget.style.color="var(--text3)"}>
                <ChevronIcon dir="left"/> Seguir comprando
              </a>
            </div>
          </div>

          {/* ── Resumen ── */}
          <div className="cart-summary">
            <OrderSummary onCheckout={handleCheckout}/>
          </div>
        </div>
      )}
    </main>
  );
}