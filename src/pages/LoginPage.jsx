import { useState } from "react";
import { useTheme } from "../context/ThemeContext";

const EyeIcon   = ({ open }) => open
  ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
  : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>;

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

const FBIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

function Input({ label, type="text", value, onChange, error, placeholder, right }) {
  return (
    <div style={{ marginBottom:16 }}>
      {label && <label style={{ display:"block", fontSize:11, fontWeight:600, letterSpacing:1.5,
        textTransform:"uppercase", color:"var(--text2)", marginBottom:6 }}>{label}</label>}
      <div style={{ position:"relative" }}>
        <input type={type} value={value} onChange={e=>onChange(e.target.value)}
          placeholder={placeholder || ""}
          style={{ width:"100%", padding: right ? "11px 42px 11px 14px" : "11px 14px",
            background:"var(--bg2)", border:`1px solid ${error?"#b5342a":value?"var(--tan)":"var(--border)"}`,
            borderRadius:2, fontSize:14, color:"var(--text)", outline:"none",
            fontFamily:"inherit", transition:"border-color .2s" }}/>
        {right && <span style={{ position:"absolute", right:12, top:"50%",
          transform:"translateY(-50%)", cursor:"pointer", color:"var(--text3)" }}>{right}</span>}
      </div>
      {error && <p style={{ fontSize:11, color:"#b5342a", marginTop:4 }}>{error}</p>}
    </div>
  );
}

function PasswordStrength({ password }) {
  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];
  const score = checks.filter(Boolean).length;
  const colors = ["var(--border)","#b5342a","#e0902a","var(--tan)","#22c55e"];
  const labels = ["","Débil","Regular","Buena","Fuerte"];
  return (
    <div style={{ marginBottom:16 }}>
      <div style={{ display:"flex", gap:4, marginBottom:4 }}>
        {[0,1,2,3].map(i => (
          <div key={i} style={{ flex:1, height:3, borderRadius:2,
            background: i < score ? colors[score] : "var(--border)",
            transition:"background .3s" }}/>
        ))}
      </div>
      {password && <p style={{ fontSize:11, color: colors[score] }}>{labels[score]}</p>}
    </div>
  );
}

export default function LoginPage() {
  const { dark } = useTheme();
  const [tab,      setTab]      = useState("login"); // login | register
  const [step,     setStep]     = useState(1);       // register steps 1-3
  const [showPwd,  setShowPwd]  = useState(false);
  const [done,     setDone]     = useState(false);

  // Login fields
  const [lEmail,   setLEmail]   = useState("");
  const [lPwd,     setLPwd]     = useState("");
  const [lErr,     setLErr]     = useState({});

  // Register fields
  const [rName,    setRName]    = useState("");
  const [rEmail,   setREmail]   = useState("");
  const [rPhone,   setRPhone]   = useState("");
  const [rPwd,     setRPwd]     = useState("");
  const [rPwd2,    setRPwd2]    = useState("");
  const [rTerms,   setRTerms]   = useState(false);
  const [rErr,     setRErr]     = useState({});

  const handleLogin = () => {
    const e = {};
    if (!lEmail.includes("@")) e.email = "Email inválido";
    if (lPwd.length < 6) e.pwd = "Mínimo 6 caracteres";
    setLErr(e);
    if (!Object.keys(e).length) setDone(true);
  };

  const handleNext = () => {
    if (step === 1) {
      const e = {};
      if (!rName.trim()) e.name = "Nombre requerido";
      if (!rEmail.includes("@")) e.email = "Email inválido";
      setRErr(e);
      if (!Object.keys(e).length) setStep(2);
    } else if (step === 2) {
      const e = {};
      if (rPwd.length < 8) e.pwd = "Mínimo 8 caracteres";
      if (rPwd !== rPwd2) e.pwd2 = "Las contraseñas no coinciden";
      if (!rTerms) e.terms = "Debes aceptar los términos";
      setRErr(e);
      if (!Object.keys(e).length) setStep(3);
    }
  };

  const benefits = [
    { icon:"📦", t:"Historial de pedidos", s:"Revisa y rastrea todos tus pedidos fácilmente." },
    { icon:"♥", t:"Lista de deseos",      s:"Guarda tus piezas favoritas para después." },
    { icon:"🎁", t:"Preventas exclusivas", s:"Accede antes que nadie a nuevos lanzamientos." },
    { icon:"🎂", t:"Descuento cumpleaños", s:"Un regalo especial en tu día." },
  ];

  return (
    <div style={{ display:"grid", gridTemplateColumns:"420px 1fr", minHeight:"calc(100vh - 99px)" }}>
      <style>{`
        .login-layout{display:grid;grid-template-columns:420px 1fr;min-height:calc(100vh - 99px)}
        @media(max-width:900px){.login-layout{grid-template-columns:1fr}.login-panel{display:none!important}}
        .tab-btn{flex:1;padding:12px 0;background:none;border:none;border-bottom:2px solid transparent;cursor:pointer;font-size:12px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;transition:all .2s;font-family:inherit}
        .tab-btn.active{border-bottom-color:var(--tan);color:var(--tan)}
        .tab-btn:not(.active){color:var(--text3)}
        .step-dot{width:8px;height:8px;border-radius:50%;transition:all .3s}
        .social-btn{display:flex;align-items:center;justify-content:center;gap:10px;width:100%;padding:11px;border:1px solid var(--border);border-radius:2px;background:var(--bg2);cursor:pointer;font-size:13px;color:var(--text);font-family:inherit;transition:border-color .2s}
        .social-btn:hover{border-color:var(--tan)}
      `}</style>

      {/* ── LEFT PANEL (benefits) ── */}
      <div className="login-panel" style={{ background:"var(--text)", padding:"64px 48px",
        display:"flex", flexDirection:"column", justifyContent:"center" }}>
        <div style={{ marginBottom:48 }}>
          <p style={{ fontSize:10, fontWeight:600, letterSpacing:3, textTransform:"uppercase",
            color:"var(--tan)", marginBottom:12 }}>Tu cuenta CLOE</p>
          <h2 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:"clamp(28px,3vw,42px)",
            fontWeight:300, lineHeight:1.1, color:"white" }}>
            Todo lo que<br/>necesitas, <em style={{ fontStyle:"italic", color:"var(--tan-light,#e8d8c0)" }}>en un solo lugar.</em>
          </h2>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:28 }}>
          {benefits.map(({ icon, t, s }) => (
            <div key={t} style={{ display:"flex", gap:16 }}>
              <div style={{ width:44, height:44, borderRadius:"50%",
                background:"rgba(201,169,122,.15)", flexShrink:0,
                display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>
                {icon}
              </div>
              <div>
                <p style={{ fontSize:13, fontWeight:600, color:"white", marginBottom:3 }}>{t}</p>
                <p style={{ fontSize:12, color:"rgba(255,255,255,.45)", lineHeight:1.6 }}>{s}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── RIGHT PANEL (form) ── */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"center",
        padding:"48px 32px", background:"var(--bg)" }}>
        <div style={{ width:"100%", maxWidth:420 }}>

          {done ? (
            /* SUCCESS */
            <div style={{ textAlign:"center" }}>
              <div style={{ width:72, height:72, borderRadius:"50%", background:"#22c55e",
                display:"flex", alignItems:"center", justifyContent:"center",
                margin:"0 auto 24px", fontSize:32 }}>🎉</div>
              <h2 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:32,
                fontWeight:300, color:"var(--text)", marginBottom:8 }}>¡Bienvenida de vuelta!</h2>
              <p style={{ fontSize:13, color:"var(--text3)", marginBottom:32 }}>
                Iniciaste sesión correctamente.
              </p>
              <a href="/" style={{ display:"inline-block", padding:"12px 28px",
                background:"var(--tan)", color:"white", borderRadius:2,
                fontSize:11, fontWeight:600, letterSpacing:2, textTransform:"uppercase" }}>
                Ir al inicio →
              </a>
            </div>
          ) : step === 3 ? (
            /* REGISTER SUCCESS */
            <div style={{ textAlign:"center" }}>
              <div style={{ width:72, height:72, borderRadius:"50%", background:"var(--tan)",
                display:"flex", alignItems:"center", justifyContent:"center",
                margin:"0 auto 24px", fontSize:32 }}>✓</div>
              <h2 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:32,
                fontWeight:300, color:"var(--text)", marginBottom:8 }}>¡Cuenta creada!</h2>
              <p style={{ fontSize:13, color:"var(--text3)", marginBottom:8 }}>
                Hola <strong style={{ color:"var(--text)" }}>{rName}</strong>, bienvenida a CLOE.
              </p>
              <p style={{ fontSize:12, color:"var(--text3)", marginBottom:32 }}>
                Como regalo de bienvenida tienes{" "}
                <strong style={{ color:"var(--tan)" }}>10% de descuento</strong> en tu primera compra.
              </p>
              <a href="/" style={{ display:"inline-block", padding:"12px 28px",
                background:"var(--tan)", color:"white", borderRadius:2,
                fontSize:11, fontWeight:600, letterSpacing:2, textTransform:"uppercase" }}>
                Explorar colección →
              </a>
            </div>
          ) : (
            <>
              {/* TABS */}
              <div style={{ display:"flex", marginBottom:32, borderBottom:"1px solid var(--border)" }}>
                <button className={`tab-btn${tab==="login"?" active":""}`} onClick={()=>{setTab("login");setStep(1)}}>
                  Iniciar sesión
                </button>
                <button className={`tab-btn${tab==="register"?" active":""}`} onClick={()=>{setTab("register");setStep(1)}}>
                  Crear cuenta
                </button>
              </div>

              {tab === "login" ? (
                <>
                  {/* Social */}
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:20 }}>
                    <button className="social-btn"><GoogleIcon/> Google</button>
                    <button className="social-btn"><FBIcon/> Facebook</button>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
                    <div style={{ flex:1, height:1, background:"var(--border)" }}/>
                    <span style={{ fontSize:11, color:"var(--text3)", letterSpacing:1 }}>O CONTINÚA CON</span>
                    <div style={{ flex:1, height:1, background:"var(--border)" }}/>
                  </div>

                  <Input label="Correo electrónico" type="email" value={lEmail}
                    onChange={setLEmail} error={lErr.email} placeholder="tu@correo.com"/>
                  <Input label="Contraseña" type={showPwd?"text":"password"} value={lPwd}
                    onChange={setLPwd} error={lErr.pwd} placeholder="••••••••"
                    right={<span onClick={()=>setShowPwd(v=>!v)}><EyeIcon open={showPwd}/></span>}/>

                  <div style={{ textAlign:"right", marginTop:-8, marginBottom:20 }}>
                    <a href="#" style={{ fontSize:12, color:"var(--tan)" }}>¿Olvidaste tu contraseña?</a>
                  </div>

                  <button onClick={handleLogin}
                    style={{ width:"100%", padding:"14px", background:"var(--text)", color:"var(--bg)",
                      border:"none", borderRadius:2, fontSize:11, fontWeight:600, letterSpacing:2,
                      textTransform:"uppercase", cursor:"pointer", fontFamily:"inherit" }}>
                    Iniciar sesión →
                  </button>
                </>
              ) : (
                <>
                  {/* Step indicator */}
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:28 }}>
                    {[1,2].map(s => (
                      <div key={s} style={{ display:"flex", alignItems:"center", gap:8 }}>
                        <div className="step-dot"
                          style={{ background: s <= step ? "var(--tan)" : "var(--border)",
                            width: s === step ? 24 : 8, borderRadius:4 }}/>
                        {s < 2 && <div style={{ flex:1, height:1, width:40, background:"var(--border)" }}/>}
                      </div>
                    ))}
                    <span style={{ fontSize:11, color:"var(--text3)", marginLeft:8 }}>
                      Paso {step} de 2
                    </span>
                  </div>

                  {step === 1 && (
                    <>
                      <Input label="Nombre completo" value={rName} onChange={setRName}
                        error={rErr.name} placeholder="Tu nombre"/>
                      <Input label="Correo electrónico" type="email" value={rEmail}
                        onChange={setREmail} error={rErr.email} placeholder="tu@correo.com"/>
                      <Input label="Teléfono (opcional)" type="tel" value={rPhone}
                        onChange={setRPhone} placeholder="+52 55 1234 5678"/>
                    </>
                  )}

                  {step === 2 && (
                    <>
                      <Input label="Contraseña" type={showPwd?"text":"password"} value={rPwd}
                        onChange={setRPwd} error={rErr.pwd} placeholder="Mín. 8 caracteres"
                        right={<span onClick={()=>setShowPwd(v=>!v)}><EyeIcon open={showPwd}/></span>}/>
                      <PasswordStrength password={rPwd}/>
                      <Input label="Confirmar contraseña" type="password" value={rPwd2}
                        onChange={setRPwd2} error={rErr.pwd2} placeholder="Repite tu contraseña"/>

                      <label style={{ display:"flex", alignItems:"flex-start", gap:10,
                        cursor:"pointer", marginBottom:16 }}>
                        <div onClick={()=>setRTerms(v=>!v)}
                          style={{ width:16, height:16, borderRadius:2, flexShrink:0, marginTop:2,
                            border: rErr.terms ? "1.5px solid #b5342a" : rTerms ? "none" : "1.5px solid var(--border)",
                            background: rTerms ? "var(--tan)" : "transparent",
                            display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>
                          {rTerms && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
                        </div>
                        <span style={{ fontSize:12, color:"var(--text2)", lineHeight:1.6 }}>
                          Acepto los <a href="#" style={{ color:"var(--tan)" }}>términos y condiciones</a> y el <a href="#" style={{ color:"var(--tan)" }}>aviso de privacidad</a>.
                        </span>
                      </label>
                      {rErr.terms && <p style={{ fontSize:11, color:"#b5342a", marginTop:-8, marginBottom:8 }}>{rErr.terms}</p>}
                    </>
                  )}

                  <button onClick={handleNext}
                    style={{ width:"100%", padding:"14px", background:"var(--text)", color:"var(--bg)",
                      border:"none", borderRadius:2, fontSize:11, fontWeight:600, letterSpacing:2,
                      textTransform:"uppercase", cursor:"pointer", fontFamily:"inherit" }}>
                    {step === 1 ? "Continuar →" : "Crear mi cuenta →"}
                  </button>

                  {step === 2 && (
                    <button onClick={() => setStep(1)}
                      style={{ width:"100%", padding:"10px", background:"none", border:"none",
                        fontSize:12, color:"var(--text3)", cursor:"pointer", marginTop:8, fontFamily:"inherit" }}>
                      ← Volver
                    </button>
                  )}
                </>
              )}

              <p style={{ textAlign:"center", fontSize:12, color:"var(--text3)", marginTop:24 }}>
                {tab === "login"
                  ? <>¿Sin cuenta? <button onClick={()=>setTab("register")} style={{background:"none",border:"none",cursor:"pointer",color:"var(--tan)",fontFamily:"inherit",fontSize:12,fontWeight:600}}>Regístrate gratis →</button></>
                  : <>¿Ya tienes cuenta? <button onClick={()=>setTab("login")} style={{background:"none",border:"none",cursor:"pointer",color:"var(--tan)",fontFamily:"inherit",fontSize:12,fontWeight:600}}>Iniciar sesión →</button></>
                }
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
