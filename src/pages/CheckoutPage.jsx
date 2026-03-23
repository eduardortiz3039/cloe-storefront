import { useState } from "react";
import { useCart } from "../context/CartContext";

// ─── PRODUCTOS DEMO para simulador (cuando el carrito está vacío) ────────────
const DEMO_ITEMS = [
  {
    key:        "demo-1",
    id:         "demo-1",
    name:       "Bolsa Satchel Clásica",
    collection: "Mascada",
    price:      3499,
    qty:        1,
    colorName:  "Negro",
    color:      "#111111",
    img:        null,
  },
];
const UPSELL = [
  { id:"u1", name:"Llavero Charm Dorado",   price:399,  img:"/images/productos/detalle-foto-1.jpg",  tag:"Complemento perfecto" },
  { id:"u2", name:"Cosmetiquera Mediana",    price:699,  img:"/images/productos/detalle-foto-2.jpg",  tag:"Lo más pedido" },
  { id:"u3", name:"Cartera Slim Camel",      price:849,  img:"/images/productos/detalle-foto-3.jpg",  tag:"Nueva entrada" },
  { id:"u4", name:"Pañoleta Seda Mascada",   price:549,  img:"/images/productos/detalle-foto-4.jpg",  tag:"Tendencia" },
];

// ─── ICONS ───────────────────────────────────────────────────────────────────
const TruckIcon   = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>;
const CardIcon    = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>;
const CheckIcon   = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>;
const UserIcon    = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const MapIcon     = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>;
const GiftIcon    = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>;
const ReviewIcon  = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const ShieldIcon  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
const EditIcon    = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
const StarIcon    = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--tan)" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
const ChevronR    = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg>;
const ChevronL    = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>;

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const fmx = (n) => n.toLocaleString("es-MX", { minimumFractionDigits:2 });
const Input = ({ label, placeholder, value, onChange, half }) => (
  <div style={{ gridColumn: half ? "auto" : "1/-1" }}>
    <label style={{ display:"block", fontSize:12, fontWeight:500,
      color:"var(--text2)", marginBottom:6 }}>{label}</label>
    <input value={value} onChange={e=>onChange(e.target.value)}
      placeholder={placeholder}
      style={{ width:"100%", padding:"11px 14px", background:"var(--bg)",
        border:"1px solid var(--border)", borderRadius:6, fontSize:14,
        color:"var(--text)", fontFamily:"inherit", outline:"none",
        transition:"border-color .2s" }}
      onFocus={e=>e.target.style.borderColor="var(--tan)"}
      onBlur={e=>e.target.style.borderColor="var(--border)"}/>
  </div>
);

// ─── STEP INDICATOR ──────────────────────────────────────────────────────────
function StepBar({ step }) {
  const steps = [
    { n:1, label:"Envío",    Icon:TruckIcon },
    { n:2, label:"Pago",     Icon:CardIcon  },
    { n:3, label:"Confirmar",Icon:CheckIcon },
  ];
  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center",
      gap:0, marginBottom:40 }}>
      {steps.map(({ n, label, Icon }, i) => {
        const done    = step > n;
        const active  = step === n;
        const pending = step < n;
        return (
          <div key={n} style={{ display:"flex", alignItems:"center" }}>
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:8 }}>
              <div style={{ width:48, height:48, borderRadius:"50%", display:"flex",
                alignItems:"center", justifyContent:"center",
                background: done||active ? "var(--text)" : "var(--bg2)",
                border: pending ? "1.5px solid var(--border)" : "none",
                color: done||active ? "var(--bg)" : "var(--text3)",
                transition:"all .3s" }}>
                {done ? <CheckIcon/> : <Icon/>}
              </div>
              <span style={{ fontSize:12, fontWeight: active?600:400,
                color: active ? "var(--text)" : "var(--text3)", letterSpacing:.3 }}>
                {label}
              </span>
            </div>
            {i < steps.length-1 && (
              <div style={{ width:80, height:1.5, margin:"0 8px",
                marginBottom:24,
                background: step > n ? "var(--tan)" : "var(--border)",
                transition:"background .3s" }}/>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── RESUMEN SIDEBAR ──────────────────────────────────────────────────────────
function Sidebar({ items, subtotal, envio, total, cashbackMonto, cashbackAplicado, envioExtra }) {
  return (
    <div style={{ background:"var(--bg)", border:"1px solid var(--border)",
      borderRadius:12, padding:"24px", position:"sticky", top:90 }}>
      <h3 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif",
        fontSize:20, fontWeight:600, color:"var(--text)", marginBottom:20 }}>
        Resumen del Pedido
      </h3>

      {/* Items */}
      <div style={{ display:"flex", flexDirection:"column", gap:14, marginBottom:20,
        paddingBottom:20, borderBottom:"1px solid var(--border)" }}>
        {items.map(item => (
          <div key={item.key} style={{ display:"flex", gap:12, alignItems:"center" }}>
            <div style={{ width:56, height:64, borderRadius:6, overflow:"hidden",
              background:"var(--bg2)", flexShrink:0, position:"relative" }}>
              {item.img
                ? <img src={item.img} alt={item.name}
                    style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
                : <div style={{ width:"100%", height:"100%", background:"var(--bg3)" }}/>
              }
              <span style={{ position:"absolute", top:-6, right:-6, width:18, height:18,
                borderRadius:"50%", background:"var(--tan)", color:"white",
                fontSize:10, fontWeight:700, display:"flex", alignItems:"center",
                justifyContent:"center", border:"1.5px solid var(--bg)" }}>
                {item.qty}
              </span>
            </div>
            <div style={{ flex:1 }}>
              <p style={{ fontSize:13, fontWeight:500, color:"var(--text)", marginBottom:2 }}>{item.name}</p>
              <p style={{ fontSize:11, color:"var(--text3)" }}>{item.collection}</p>
            </div>
            <p style={{ fontFamily:"'Cormorant Garamond',Georgia,serif",
              fontSize:17, fontWeight:600, color:"var(--text)" }}>
              ${fmx(item.price * item.qty)}
            </p>
          </div>
        ))}
      </div>

      {/* Desglose */}
      <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:16 }}>
        <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, color:"var(--text2)" }}>
          <span>Subtotal ({items.reduce((a,i)=>a+i.qty,0)} artículos)</span>
          <span>${fmx(subtotal)}</span>
        </div>
        <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, color:"var(--text2)" }}>
          <span>Envío</span>
          <span style={{ color: envio===0?"#22c55e":"var(--text2)" }}>
            {envio===0 ? "¡Gratis!" : `$${fmx(envio)}`}
          </span>
        </div>
        {envioExtra > 0 && (
          <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, color:"var(--text2)" }}>
            <span>Envío express</span>
            <span>${fmx(envioExtra)}</span>
          </div>
        )}
        {cashbackAplicado && cashbackMonto > 0 && (
          <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, color:"#22c55e" }}>
            <span>Saldo aplicado</span>
            <span>−${fmx(cashbackMonto)}</span>
          </div>
        )}
      </div>

      <div style={{ borderTop:"1px solid var(--border)", paddingTop:14, marginBottom:20,
        display:"flex", justifyContent:"space-between", alignItems:"baseline" }}>
        <span style={{ fontSize:14, fontWeight:600, color:"var(--text)" }}>Total</span>
        <span style={{ fontFamily:"'Cormorant Garamond',Georgia,serif",
          fontSize:26, fontWeight:600, color:"var(--text)" }}>
          ${fmx(total + envioExtra)} MXN
        </span>
      </div>

      {/* Trust */}
      <div style={{ background:"var(--bg2)", borderRadius:8, padding:"14px 16px",
        display:"flex", flexDirection:"column", gap:10, marginBottom:14 }}>
        {[
          { Icon:TruckIcon, t:"Envío Seguro", s:"Rastreo incluido" },
          { Icon:ShieldIcon, t:"Pago Protegido", s:"Transacción segura" },
          { Icon:()=><span style={{fontSize:14}}>↩</span>, t:"Devoluciones", s:"30 días" },
        ].map(({ Icon, t, s }) => (
          <div key={t} style={{ display:"flex", alignItems:"center", gap:10 }}>
            <span style={{ color:"var(--text3)" }}><Icon/></span>
            <div>
              <p style={{ fontSize:12, fontWeight:600, color:"var(--text)" }}>{t}</p>
              <p style={{ fontSize:11, color:"var(--text3)" }}>{s}</p>
            </div>
          </div>
        ))}
      </div>

      <div style={{ fontSize:11, color:"var(--text3)", lineHeight:1.8 }}>
        <p>¿Cómo usar un código <a href="#" style={{color:"var(--tan)"}}>Kueski</a> o <a href="#" style={{color:"var(--tan)"}}>Bansefi</a>?{" "}<a href="#" style={{color:"var(--text2)",textDecoration:"underline"}}>Saber más</a></p>
        <p style={{marginTop:4}}>¿Cómo usar tu bono de fidelidad?{" "}<a href="#" style={{color:"var(--text2)",textDecoration:"underline"}}>Saber más</a></p>
      </div>

      <div style={{ marginTop:16, display:"flex", flexDirection:"column", gap:5 }}>
        {["Compra 100% segura","Devolución gratis en 30 días","Garantía de autenticidad"].map(t => (
          <div key={t} style={{ display:"flex", alignItems:"center", gap:8, fontSize:12, color:"var(--text2)" }}>
            <span style={{ color:"#22c55e" }}><CheckIcon/></span> {t}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── PASO 1: ENVÍO ────────────────────────────────────────────────────────────
function StepEnvio({ data, setData, onNext }) {
  const [metodoEnvio, setMetodoEnvio] = useState("estandar");
  const [notif, setNotif] = useState({ email:true, whatsapp:false });
  const [regalo, setRegalo] = useState(null); // null | "bolsa" | "caja"

  const handleNext = () => {
    if (!data.nombre||!data.apellidos||!data.email||!data.telefono||!data.calle||!data.ciudad||!data.estado||!data.cp) {
      alert("Por favor completa todos los campos requeridos.");
      return;
    }
    onNext({ metodoEnvio, notif, regalo });
  };

  const card = (selected, onClick, children) => (
    <div onClick={onClick}
      style={{ border:`1.5px solid ${selected?"var(--text)":"var(--border)"}`,
        borderRadius:8, padding:"14px 18px", cursor:"pointer",
        background: selected ? "var(--bg2)" : "var(--bg)",
        transition:"all .2s", display:"flex", alignItems:"center",
        justifyContent:"space-between" }}>
      <div style={{ display:"flex", alignItems:"center", gap:12 }}>
        <div style={{ width:18, height:18, borderRadius:"50%",
          border:`2px solid ${selected?"var(--text)":"var(--border)"}`,
          display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
          {selected && <div style={{ width:8, height:8, borderRadius:"50%", background:"var(--text)" }}/>}
        </div>
        {children}
      </div>
    </div>
  );

  const checkbox = (checked, onClick, children) => (
    <div onClick={onClick}
      style={{ border:`1px solid ${checked?"var(--tan)":"var(--border)"}`,
        borderRadius:8, padding:"12px 16px", cursor:"pointer",
        background: checked ? "var(--tan-light)" : "var(--bg)",
        transition:"all .2s", display:"flex", alignItems:"center", gap:12 }}>
      <div style={{ width:20, height:20, borderRadius:4, flexShrink:0,
        border: checked ? "none" : "1.5px solid var(--border)",
        background: checked ? "var(--tan)" : "transparent",
        display:"flex", alignItems:"center", justifyContent:"center", color:"white" }}>
        {checked && <CheckIcon/>}
      </div>
      {children}
    </div>
  );

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>

      {/* Información de contacto */}
      <div style={{ background:"var(--bg)", border:"1px solid var(--border)",
        borderRadius:12, padding:"24px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
          <div style={{ width:36, height:36, borderRadius:8, background:"var(--text)",
            display:"flex", alignItems:"center", justifyContent:"center", color:"var(--bg)" }}>
            <UserIcon/>
          </div>
          <h2 style={{ fontSize:16, fontWeight:600, color:"var(--text)" }}>Información de Contacto</h2>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
          <Input label="Nombre *"              placeholder="Juan"               value={data.nombre}    onChange={v=>setData({...data,nombre:v})}    half/>
          <Input label="Apellidos *"           placeholder="Pérez García"       value={data.apellidos} onChange={v=>setData({...data,apellidos:v})} half/>
          <Input label="Correo Electrónico *"  placeholder="correo@ejemplo.com" value={data.email}     onChange={v=>setData({...data,email:v})}/>
          <Input label="Teléfono *"            placeholder="+52 55 1234 5678"   value={data.telefono}  onChange={v=>setData({...data,telefono:v})}/>
        </div>
      </div>

      {/* Dirección */}
      <div style={{ background:"var(--bg)", border:"1px solid var(--border)",
        borderRadius:12, padding:"24px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
          <div style={{ width:36, height:36, borderRadius:8, background:"var(--text)",
            display:"flex", alignItems:"center", justifyContent:"center", color:"var(--bg)" }}>
            <MapIcon/>
          </div>
          <h2 style={{ fontSize:16, fontWeight:600, color:"var(--text)" }}>Dirección de Envío</h2>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
          <Input label="Calle y Número *" placeholder="Av. Reforma 123" value={data.calle}  onChange={v=>setData({...data,calle:v})}/>
          <Input label="Ciudad *"         placeholder="Ciudad de México" value={data.ciudad} onChange={v=>setData({...data,ciudad:v})} half/>
          <Input label="Estado *"         placeholder="CDMX"             value={data.estado} onChange={v=>setData({...data,estado:v})} half/>
          <Input label="Código Postal *"  placeholder="01234"            value={data.cp}     onChange={v=>setData({...data,cp:v})}     half/>
          <Input label="País"             placeholder="México"           value={data.pais||"México"} onChange={v=>setData({...data,pais:v})} half/>
        </div>
      </div>

      {/* Método de envío */}
      <div style={{ background:"var(--bg)", border:"1px solid var(--border)",
        borderRadius:12, padding:"24px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
          <div style={{ width:36, height:36, borderRadius:8, background:"var(--text)",
            display:"flex", alignItems:"center", justifyContent:"center", color:"var(--bg)" }}>
            <TruckIcon/>
          </div>
          <h2 style={{ fontSize:16, fontWeight:600, color:"var(--text)" }}>Método de Envío</h2>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {card(metodoEnvio==="estandar", ()=>setMetodoEnvio("estandar"),
            <div>
              <p style={{ fontSize:14, fontWeight:500, color:"var(--text)" }}>Envío Estándar</p>
              <p style={{ fontSize:12, color:"var(--text3)" }}>5-7 días hábiles</p>
            </div>
          )}
          <div style={{ border:`1.5px solid ${metodoEnvio==="express"?"var(--text)":"var(--border)"}`,
            borderRadius:8, padding:"14px 18px", cursor:"pointer",
            background: metodoEnvio==="express" ? "var(--bg2)" : "var(--bg)",
            transition:"all .2s", display:"flex", alignItems:"center", justifyContent:"space-between" }}
            onClick={()=>setMetodoEnvio("express")}>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ width:18, height:18, borderRadius:"50%",
                border:`2px solid ${metodoEnvio==="express"?"var(--text)":"var(--border)"}`,
                display:"flex", alignItems:"center", justifyContent:"center" }}>
                {metodoEnvio==="express" && <div style={{ width:8, height:8, borderRadius:"50%", background:"var(--text)" }}/>}
              </div>
              <div>
                <p style={{ fontSize:14, fontWeight:500, color:"var(--text)" }}>Envío Express</p>
                <p style={{ fontSize:12, color:"var(--text3)" }}>1-2 días hábiles</p>
              </div>
            </div>
            <span style={{ fontSize:14, fontWeight:600, color:"var(--text)" }}>$299</span>
          </div>
        </div>
      </div>

      {/* Notificaciones */}
      <div style={{ background:"var(--bg)", border:"1px solid var(--border)",
        borderRadius:12, padding:"24px" }}>
        <p style={{ fontSize:14, fontWeight:600, color:"var(--text)", marginBottom:14 }}>
          ¿Por qué medio deseas recibir notificaciones del estatus de tu pedido?
        </p>
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {checkbox(notif.email, ()=>setNotif({...notif,email:!notif.email}),
            <div>
              <p style={{ fontSize:14, fontWeight:500, color:"var(--text)" }}>Correo Electrónico</p>
              <p style={{ fontSize:12, color:"var(--text3)" }}>Recibirás actualizaciones por email</p>
            </div>
          )}
          {checkbox(notif.whatsapp, ()=>setNotif({...notif,whatsapp:!notif.whatsapp}),
            <div>
              <p style={{ fontSize:14, fontWeight:500, color:"var(--text)" }}>WhatsApp</p>
              <p style={{ fontSize:12, color:"var(--text3)" }}>Recibirás actualizaciones por WhatsApp</p>
            </div>
          )}
        </div>
      </div>

      {/* Empaque de regalo */}
      <div style={{ background:"var(--bg)", border:"1px solid var(--border)",
        borderRadius:12, padding:"24px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
          <div style={{ width:36, height:36, borderRadius:8, background:"var(--text)",
            display:"flex", alignItems:"center", justifyContent:"center", color:"var(--bg)" }}>
            <GiftIcon/>
          </div>
          <div>
            <h2 style={{ fontSize:16, fontWeight:600, color:"var(--text)" }}>Empaques de Regalo</h2>
            <span style={{ fontSize:12, color:"var(--text3)" }}>Opcional</span>
          </div>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
          {[
            { key:"bolsa", label:"Bolsa Grande", price:50,  icon:"🛍" },
            { key:"caja",  label:"Caja Grande",  price:250, icon:"🎁" },
          ].map(({ key, label, price, icon }) => (
            <div key={key}
              onClick={()=>setRegalo(regalo===key ? null : key)}
              style={{ border:`1.5px solid ${regalo===key?"var(--tan)":"var(--border)"}`,
                borderRadius:8, padding:"16px", cursor:"pointer",
                background: regalo===key ? "var(--tan-light)" : "var(--bg2)",
                transition:"all .2s", textAlign:"center" }}>
              <p style={{ fontSize:24, marginBottom:6 }}>{icon}</p>
              <p style={{ fontSize:13, fontWeight:500, color:"var(--text)", marginBottom:4 }}>{label}</p>
              <p style={{ fontFamily:"'Cormorant Garamond',Georgia,serif",
                fontSize:19, fontWeight:600, color:"var(--text)" }}>${price}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <button onClick={handleNext}
        style={{ width:"100%", padding:"16px", background:"var(--text)", color:"var(--bg)",
          border:"none", borderRadius:8, fontSize:12, fontWeight:600,
          letterSpacing:2, textTransform:"uppercase", cursor:"pointer",
          fontFamily:"inherit", display:"flex", alignItems:"center",
          justifyContent:"center", gap:10, transition:"background .2s" }}
        onMouseEnter={e=>e.currentTarget.style.background="var(--tan)"}
        onMouseLeave={e=>e.currentTarget.style.background="var(--text)"}>
        Continuar <ChevronR/>
      </button>
    </div>
  );
}

// ─── PASO 2: PAGO ─────────────────────────────────────────────────────────────
function StepPago({ onNext, onBack }) {
  const [metodo, setMetodo] = useState("tarjeta");
  const [card, setCard] = useState({ num:"", exp:"", cvv:"", nombre:"" });
  const [err, setErr] = useState({});

  const validate = () => {
    const e = {};
    if (metodo==="tarjeta") {
      if (card.num.replace(/\s/g,"").length < 16) e.num = "Número inválido";
      if (card.exp.length < 5) e.exp = "Fecha inválida";
      if (card.cvv.length < 3) e.cvv = "CVV inválido";
      if (!card.nombre.trim()) e.nombre = "Requerido";
    }
    setErr(e);
    return Object.keys(e).length === 0;
  };

  const formatCard = v => v.replace(/\D/g,"").slice(0,16).replace(/(\d{4})/g,"$1 ").trim();
  const formatExp  = v => {
    const d = v.replace(/\D/g,"").slice(0,4);
    return d.length > 2 ? `${d.slice(0,2)}/${d.slice(2)}` : d;
  };

  const payMethod = (key, label) => (
    <div onClick={()=>setMetodo(key)}
      style={{ border:`1.5px solid ${metodo===key?"var(--text)":"var(--border)"}`,
        borderRadius:8, padding:"14px 18px", cursor:"pointer",
        background: metodo===key ? "var(--bg2)" : "var(--bg)",
        transition:"all .2s", display:"flex", alignItems:"center", gap:12 }}>
      <div style={{ width:18, height:18, borderRadius:"50%",
        border:`2px solid ${metodo===key?"var(--text)":"var(--border)"}`,
        display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
        {metodo===key && <div style={{ width:8, height:8, borderRadius:"50%", background:"var(--text)" }}/>}
      </div>
      <span style={{ fontSize:14, fontWeight:500, color:"var(--text)" }}>{label}</span>
    </div>
  );

  const field = (label, ph, value, onChange, errKey, half) => (
    <div style={{ gridColumn: half?"auto":"1/-1" }}>
      <label style={{ display:"block", fontSize:12, fontWeight:500, color:"var(--text2)", marginBottom:6 }}>{label}</label>
      <input value={value} onChange={e=>onChange(e.target.value)}
        placeholder={ph}
        style={{ width:"100%", padding:"11px 14px", background:"var(--bg)",
          border:`1px solid ${err[errKey]?"#b5342a":"var(--border)"}`,
          borderRadius:6, fontSize:14, color:"var(--text)",
          fontFamily:"inherit", outline:"none", transition:"border-color .2s" }}
        onFocus={e=>e.target.style.borderColor="var(--tan)"}
        onBlur={e=>e.target.style.borderColor=err[errKey]?"#b5342a":"var(--border)"}/>
      {err[errKey] && <p style={{ fontSize:11, color:"#b5342a", marginTop:4 }}>{err[errKey]}</p>}
    </div>
  );

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      <div style={{ background:"var(--bg)", border:"1px solid var(--border)",
        borderRadius:12, padding:"24px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
          <div style={{ width:36, height:36, borderRadius:8, background:"var(--text)",
            display:"flex", alignItems:"center", justifyContent:"center", color:"var(--bg)" }}>
            <CardIcon/>
          </div>
          <h2 style={{ fontSize:16, fontWeight:600, color:"var(--text)" }}>Método de Pago</h2>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:20 }}>
          {payMethod("tarjeta","Tarjeta de Crédito o Débito")}
          {payMethod("paypal","PayPal")}
          {payMethod("oxxo","OXXO")}
          {payMethod("kueski","Kueski Pay — hasta 12 MSI")}
        </div>

        {metodo==="tarjeta" && (
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
            {field("Número de Tarjeta *","1234 5678 9012 3456",card.num,v=>setCard({...card,num:formatCard(v)}),"num")}
            {field("Vencimiento *","MM/AA",card.exp,v=>setCard({...card,exp:formatExp(v)}),"exp",true)}
            {field("CVV *","123",card.cvv,v=>setCard({...card,cvv:v.replace(/\D/g,"").slice(0,4)}),"cvv",true)}
            {field("Nombre en la Tarjeta *","Juan Pérez",card.nombre,v=>setCard({...card,nombre:v}),"nombre")}
            <div style={{ gridColumn:"1/-1", display:"flex", alignItems:"center", gap:8,
              color:"#22c55e", fontSize:12 }}>
              <CheckIcon/> Pago 100% seguro y encriptado
            </div>
          </div>
        )}
        {metodo==="paypal" && (
          <div style={{ padding:"20px", background:"var(--bg2)", borderRadius:8, textAlign:"center" }}>
            <p style={{ fontSize:14, color:"var(--text2)" }}>Serás redirigido a PayPal para completar el pago.</p>
          </div>
        )}
        {metodo==="oxxo" && (
          <div style={{ padding:"20px", background:"var(--bg2)", borderRadius:8 }}>
            <p style={{ fontSize:14, color:"var(--text2)", marginBottom:6 }}>Recibirás una referencia de pago por email.</p>
            <p style={{ fontSize:12, color:"var(--text3)" }}>El pedido se confirma al recibir el pago (hasta 48 hrs).</p>
          </div>
        )}
        {metodo==="kueski" && (
          <div style={{ padding:"20px", background:"var(--bg2)", borderRadius:8 }}>
            <p style={{ fontSize:14, color:"var(--text2)", marginBottom:6 }}>Financiamiento sin tarjeta de crédito.</p>
            <p style={{ fontSize:12, color:"var(--text3)" }}>Serás redirigido a Kueski para completar tu solicitud.</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 2fr", gap:12 }}>
        <button onClick={onBack}
          style={{ padding:"14px", background:"var(--bg2)", color:"var(--text)",
            border:"1px solid var(--border)", borderRadius:8, fontSize:12, fontWeight:600,
            letterSpacing:1.5, textTransform:"uppercase", cursor:"pointer",
            fontFamily:"inherit", display:"flex", alignItems:"center",
            justifyContent:"center", gap:8 }}>
          <ChevronL/> Anterior
        </button>
        <button onClick={()=>{ if(validate()) onNext({ metodo, card }); }}
          style={{ padding:"14px", background:"var(--text)", color:"var(--bg)",
            border:"none", borderRadius:8, fontSize:12, fontWeight:600,
            letterSpacing:2, textTransform:"uppercase", cursor:"pointer",
            fontFamily:"inherit", display:"flex", alignItems:"center",
            justifyContent:"center", gap:10, transition:"background .2s" }}
          onMouseEnter={e=>e.currentTarget.style.background="var(--tan)"}
          onMouseLeave={e=>e.currentTarget.style.background="var(--text)"}>
          Continuar <ChevronR/>
        </button>
      </div>
    </div>
  );
}

// ─── PASO 3: CONFIRMAR ────────────────────────────────────────────────────────
function StepConfirmar({ envioData, pagoData, onBack, onConfirm }) {
  const { items } = useCart();

  const Section = ({ title, children, onEdit }) => (
    <div style={{ paddingBottom:20, marginBottom:20, borderBottom:"1px solid var(--border)" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
        <h3 style={{ fontSize:14, fontWeight:600, color:"var(--text)" }}>{title}</h3>
        {onEdit && (
          <button onClick={onEdit}
            style={{ background:"none", border:"none", cursor:"pointer",
              display:"flex", alignItems:"center", gap:5, fontSize:12,
              color:"var(--text3)", fontFamily:"inherit", transition:"color .2s" }}
            onMouseEnter={e=>e.currentTarget.style.color="var(--text)"}
            onMouseLeave={e=>e.currentTarget.style.color="var(--text3)"}>
            <EditIcon/> Editar
          </button>
        )}
      </div>
      {children}
    </div>
  );

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      <div style={{ background:"var(--bg)", border:"1px solid var(--border)",
        borderRadius:12, padding:"24px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:24 }}>
          <div style={{ width:36, height:36, borderRadius:8, background:"var(--text)",
            display:"flex", alignItems:"center", justifyContent:"center", color:"var(--bg)" }}>
            <ReviewIcon/>
          </div>
          <h2 style={{ fontSize:16, fontWeight:600, color:"var(--text)" }}>Revisa tu Pedido</h2>
        </div>

        <Section title="Información de Envío" onEdit={()=>{}}>
          <div style={{ fontSize:13, color:"var(--text2)", lineHeight:1.9 }}>
            <p>{envioData.nombre} {envioData.apellidos}</p>
            <p>{envioData.email}</p>
            <p>{envioData.telefono}</p>
            <p>{envioData.calle}</p>
            <p>{envioData.ciudad}, {envioData.estado} {envioData.cp}</p>
            <p>{envioData.pais||"México"}</p>
          </div>
        </Section>

        <Section title="Método de Envío">
          <p style={{ fontSize:13, color:"var(--text2)" }}>
            {envioData.metodoEnvio==="express" ? "Envío Express (1-2 días)" : "Envío Estándar (5-7 días)"}
          </p>
          {envioData.notif && (
            <p style={{ fontSize:12, color:"var(--text3)", marginTop:4 }}>
              Notificaciones:{" "}
              {[envioData.notif.email&&"Email", envioData.notif.whatsapp&&"WhatsApp"]
                .filter(Boolean).join(", ")}
            </p>
          )}
        </Section>

        <Section title="Método de Pago" onEdit={()=>{}}>
          <p style={{ fontSize:13, color:"var(--text2)" }}>
            {pagoData.metodo==="tarjeta" ? "Tarjeta de Crédito/Débito" :
             pagoData.metodo==="paypal"  ? "PayPal" :
             pagoData.metodo==="oxxo"    ? "OXXO"   : "Kueski Pay"}
          </p>
        </Section>

        <Section title={`Productos (${items.length})`}>
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            {items.map(item => (
              <div key={item.key} style={{ display:"flex", gap:12, alignItems:"center" }}>
                <div style={{ width:52, height:60, borderRadius:6, overflow:"hidden",
                  background:"var(--bg2)", flexShrink:0 }}>
                  {item.img && <img src={item.img} alt={item.name}
                    style={{ width:"100%", height:"100%", objectFit:"cover" }}/>}
                </div>
                <div style={{ flex:1 }}>
                  <p style={{ fontSize:13, fontWeight:500, color:"var(--text)" }}>{item.name}</p>
                  <p style={{ fontSize:12, color:"var(--text3)" }}>
                    {item.colorName||item.color||""} × {item.qty}
                  </p>
                </div>
                <p style={{ fontFamily:"'Cormorant Garamond',Georgia,serif",
                  fontSize:17, fontWeight:600, color:"var(--text)" }}>
                  ${fmx(item.price * item.qty)}
                </p>
              </div>
            ))}
          </div>
        </Section>
      </div>

      {/* Navigation */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 2fr", gap:12 }}>
        <button onClick={onBack}
          style={{ padding:"14px", background:"var(--bg2)", color:"var(--text)",
            border:"1px solid var(--border)", borderRadius:8, fontSize:12, fontWeight:600,
            letterSpacing:1.5, textTransform:"uppercase", cursor:"pointer",
            fontFamily:"inherit", display:"flex", alignItems:"center",
            justifyContent:"center", gap:8 }}>
          <ChevronL/> Anterior
        </button>
        <button onClick={onConfirm}
          style={{ padding:"14px", background:"#22c55e", color:"white",
            border:"none", borderRadius:8, fontSize:12, fontWeight:600,
            letterSpacing:2, textTransform:"uppercase", cursor:"pointer",
            fontFamily:"inherit", display:"flex", alignItems:"center",
            justifyContent:"center", gap:10, transition:"background .2s" }}
          onMouseEnter={e=>e.currentTarget.style.background="#16a34a"}
          onMouseLeave={e=>e.currentTarget.style.background="#22c55e"}>
          <CheckIcon/> Confirmar Pedido
        </button>
      </div>
    </div>
  );
}

// ─── UPSELL POST-COMPRA ───────────────────────────────────────────────────────
function UpsellScreen({ orderNum, onDone }) {
  const [added, setAdded] = useState({});
  const [done,  setDone]  = useState(false);

  if (done) return (
    <div style={{ textAlign:"center", padding:"80px 24px",
      maxWidth:560, margin:"0 auto" }}>
      <div style={{ width:80, height:80, borderRadius:"50%", background:"#22c55e",
        display:"flex", alignItems:"center", justifyContent:"center",
        margin:"0 auto 24px", color:"white" }}>
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      </div>
      <h1 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif",
        fontSize:"clamp(28px,4vw,42px)", fontWeight:300, color:"var(--text)", marginBottom:12 }}>
        ¡Pedido confirmado!
      </h1>
      <p style={{ fontSize:14, color:"var(--text3)", marginBottom:8, lineHeight:1.7 }}>
        Tu pedido <strong style={{ color:"var(--tan)" }}>#{orderNum}</strong> ha sido recibido.
      </p>
      <p style={{ fontSize:13, color:"var(--text3)", marginBottom:36, lineHeight:1.7 }}>
        Recibirás un correo con los detalles y número de rastreo en cuanto se prepare tu envío.
      </p>
      <a href="#/" style={{ display:"inline-flex", alignItems:"center", gap:8,
        background:"var(--text)", color:"var(--bg)", fontSize:11, fontWeight:600,
        letterSpacing:2, textTransform:"uppercase", padding:"14px 28px",
        borderRadius:2, transition:"background .2s" }}
        onMouseEnter={e=>e.currentTarget.style.background="var(--tan)"}
        onMouseLeave={e=>e.currentTarget.style.background="var(--text)"}>
        Volver al inicio →
      </a>
    </div>
  );

  return (
    <div style={{ maxWidth:680, margin:"0 auto", padding:"48px 24px" }}>
      {/* Confirmación top */}
      <div style={{ textAlign:"center", marginBottom:48 }}>
        <div style={{ width:64, height:64, borderRadius:"50%", background:"#22c55e",
          display:"flex", alignItems:"center", justifyContent:"center",
          margin:"0 auto 16px", color:"white" }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <h1 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif",
          fontSize:"clamp(24px,3vw,36px)", fontWeight:300, color:"var(--text)", marginBottom:8 }}>
          ¡Listo! Tu pedido está en camino.
        </h1>
        <p style={{ fontSize:13, color:"var(--text3)" }}>
          Pedido <strong style={{ color:"var(--tan)" }}>#{orderNum}</strong>
        </p>
      </div>

      {/* Upsell */}
      <div style={{ background:"var(--bg2)", border:"1px solid var(--border)",
        borderRadius:16, padding:"28px 24px", marginBottom:32 }}>
        <div style={{ textAlign:"center", marginBottom:28 }}>
          <p style={{ fontSize:11, fontWeight:600, letterSpacing:3, textTransform:"uppercase",
            color:"var(--tan)", marginBottom:8 }}>Antes de irte</p>
          <h2 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif",
            fontSize:"clamp(22px,3vw,32px)", fontWeight:300, color:"var(--text)", marginBottom:8 }}>
            ¿Algo para completar tu <em style={{fontStyle:"italic"}}>outfit</em>?
          </h2>
          <p style={{ fontSize:13, color:"var(--text3)" }}>
            Complementos que combinan perfectamente con tu compra.
          </p>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:14 }}>
          {UPSELL.map(p => (
            <div key={p.id}
              style={{ background:"var(--bg)", border:`1.5px solid ${added[p.id]?"var(--tan)":"var(--border)"}`,
                borderRadius:10, overflow:"hidden", transition:"all .2s" }}>
              {/* Imagen */}
              <div style={{ aspectRatio:"4/3", overflow:"hidden", background:"var(--bg3)", position:"relative" }}>
                {p.img
                  ? <img src={p.img} alt={p.name}
                      style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
                  : <div style={{ width:"100%", height:"100%", background:"var(--bg3)",
                      display:"flex", alignItems:"center", justifyContent:"center" }}>
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--text3)" strokeWidth="1.2">
                        <rect x="3" y="3" width="18" height="18" rx="2"/>
                        <circle cx="8.5" cy="8.5" r="1.5"/>
                        <polyline points="21,15 16,10 5,21"/>
                      </svg>
                    </div>
                }
                <span style={{ position:"absolute", top:8, left:8,
                  background:"var(--tan)", color:"white",
                  fontSize:9, fontWeight:700, letterSpacing:1, padding:"3px 8px",
                  borderRadius:2, textTransform:"uppercase" }}>
                  {p.tag}
                </span>
              </div>
              {/* Info */}
              <div style={{ padding:"12px 14px" }}>
                <p style={{ fontSize:13, fontWeight:500, color:"var(--text)", marginBottom:4 }}>{p.name}</p>
                <div style={{ display:"flex", gap:4, marginBottom:10 }}>
                  {[1,2,3,4,5].map(i=><StarIcon key={i}/>)}
                </div>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                  <span style={{ fontFamily:"'Cormorant Garamond',Georgia,serif",
                    fontSize:20, fontWeight:600, color:"var(--text)" }}>
                    ${fmx(p.price)}
                  </span>
                  <button
                    onClick={()=>setAdded(a=>({...a,[p.id]:!a[p.id]}))}
                    style={{ fontSize:10, fontWeight:700, letterSpacing:1.5, textTransform:"uppercase",
                      padding:"7px 12px", borderRadius:4, border:"none", cursor:"pointer",
                      fontFamily:"inherit", transition:"all .2s",
                      background: added[p.id] ? "#22c55e" : "var(--text)",
                      color: "white" }}>
                    {added[p.id] ? "✓ Agregado" : "+ Agregar"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Botones */}
      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {Object.values(added).some(Boolean) && (
          <button
            style={{ width:"100%", padding:"15px", background:"var(--tan)", color:"white",
              border:"none", borderRadius:8, fontSize:12, fontWeight:600,
              letterSpacing:2, textTransform:"uppercase", cursor:"pointer",
              fontFamily:"inherit", transition:"background .2s" }}
            onMouseEnter={e=>e.currentTarget.style.background="var(--tan-dark)"}
            onMouseLeave={e=>e.currentTarget.style.background="var(--tan)"}>
            Agregar al pedido →
          </button>
        )}
        <button onClick={()=>setDone(true)}
          style={{ width:"100%", padding:"13px", background:"transparent", color:"var(--text3)",
            border:"1px solid var(--border)", borderRadius:8, fontSize:12, fontWeight:500,
            cursor:"pointer", fontFamily:"inherit", transition:"all .2s" }}
          onMouseEnter={e=>{ e.currentTarget.style.color="var(--text)"; e.currentTarget.style.borderColor="var(--text)"; }}
          onMouseLeave={e=>{ e.currentTarget.style.color="var(--text3)"; e.currentTarget.style.borderColor="var(--border)"; }}>
          No gracias, terminar
        </button>
      </div>
    </div>
  );
}

// ─── CHECKOUT PAGE ────────────────────────────────────────────────────────────
export default function CheckoutPage() {
  const cart = useCart();

  // ── Simulador: si el carrito está vacío, usar productos demo ──
  const isDemo  = cart.items.length === 0;
  const items   = isDemo ? DEMO_ITEMS : cart.items;
  const subtotal = items.reduce((a, i) => a + i.price * i.qty, 0);
  const envioBase = subtotal >= 1499 ? 0 : 149;
  const cashbackMonto   = isDemo ? 0 : cart.cashbackMonto;
  const cashbackAplicado = isDemo ? false : cart.cashbackAplicado;
  const [step,      setStep]      = useState(1);
  const [envioData, setEnvioData] = useState({
    nombre:"", apellidos:"", email:"", telefono:"",
    calle:"", ciudad:"", estado:"", cp:"", pais:"México"
  });
  const [pagoData,  setPagoData]  = useState({});
  const [extraEnvio, setExtraEnvio] = useState(0);
  const [orderDone, setOrderDone] = useState(false);
  const [orderNum,  setOrderNum]  = useState("");

  const total = subtotal + envioBase + extraEnvio - cashbackMonto;

  const handleEnvioNext = ({ metodoEnvio, notif, regalo }) => {
    const extra = metodoEnvio === "express" ? 299 : 0;
    setExtraEnvio(extra);
    setEnvioData(prev => ({ ...prev, metodoEnvio, notif, regalo }));
    setStep(2);
    window.scrollTo(0, 0);
  };

  const handlePagoNext = (data) => {
    setPagoData(data);
    setStep(3);
    window.scrollTo(0, 0);
  };

  const handleConfirm = () => {
    const num = Math.floor(Math.random() * 900000 + 100000).toString();
    setOrderNum(num);
    if (!isDemo) cart.clearCart();
    setOrderDone(true);
    window.scrollTo(0, 0);
  };

  if (orderDone) return <UpsellScreen orderNum={orderNum} onDone={() => { window.location.hash = "#/"; }}/>;

  return (
    <main style={{ minHeight:"100vh", background:"var(--bg2)", padding:"40px 24px 80px" }}>
      <style>{`
        .checkout-layout { display:grid; grid-template-columns:1fr 380px; gap:32px; max-width:1100px; margin:0 auto; }
        @media(max-width:900px){ .checkout-layout { grid-template-columns:1fr; } }
      `}</style>

      {/* Banner simulador */}
      {isDemo && (
        <div style={{ maxWidth:1100, margin:"0 auto 20px", padding:"10px 18px",
          background:"var(--tan-light)", border:"1px solid var(--tan)",
          borderRadius:8, fontSize:12, color:"var(--text2)",
          display:"flex", alignItems:"center", gap:8 }}>
          <span>🧪</span>
          <span>Modo simulador — los datos son de prueba, no se procesará ningún pago real.</span>
        </div>
      )}

      {/* Título */}
      <div style={{ textAlign:"center", marginBottom:32 }}>
        <h1 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif",
          fontSize:"clamp(28px,4vw,42px)", fontWeight:300, color:"var(--text)", marginBottom:24 }}>
          Finalizar Compra
        </h1>
        <StepBar step={step}/>
      </div>

      <div className="checkout-layout">
        <div>
          {step === 1 && (
            <StepEnvio data={envioData} setData={setEnvioData} onNext={handleEnvioNext}/>
          )}
          {step === 2 && (
            <StepPago onNext={handlePagoNext} onBack={() => setStep(1)}/>
          )}
          {step === 3 && (
            <StepConfirmar
              envioData={envioData}
              pagoData={pagoData}
              onBack={() => setStep(2)}
              onConfirm={handleConfirm}/>
          )}
        </div>
        <div>
          <Sidebar
            items={items}
            subtotal={subtotal}
            envio={envioBase}
            total={total}
            cashbackMonto={cashbackMonto}
            cashbackAplicado={cashbackAplicado}
            envioExtra={extraEnvio}/>
        </div>
      </div>
    </main>
  );
}