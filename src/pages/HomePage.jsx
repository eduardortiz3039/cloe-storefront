import { useState, useEffect, useRef, Suspense } from "react";
import { useTheme } from "../context/ThemeContext";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Environment, ContactShadows, useProgress } from "@react-three/drei";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ─── SOCIAL DATA (sin imágenes — agregar thumbs reales) ─────────────────────
const TIKTOK_URL = "https://www.tiktok.com/@cloeoemoda";
const IG_URL     = "https://www.instagram.com/cloeoemoda/";
const TIKTOK_HANDLE = "@cloeoemoda";
const IG_HANDLE     = "@cloeoemoda";

// ▼ REEMPLAZA null con la URL de tu imagen real
const tiktokVideos = [
  { id:1, thumb:null, caption:"Nueva colección Tote 🛍️",      views:"124K", likes:"8.2K",  url:TIKTOK_URL, product:{ name:"Bolsa Tote Camel",      price:"$2,099", url:"#/producto" } },
  { id:2, thumb:null, caption:"Hobo perfecto para el día ✨",   views:"98K",  likes:"6.1K",  url:TIKTOK_URL, product:{ name:"Bolsa Hobo Maxi",       price:"$2,299", url:"#/producto" } },
  { id:3, thumb:null, caption:"Look de oficina completo 💼",    views:"211K", likes:"14K",   url:TIKTOK_URL, product:{ name:"Porta Laptop Doble",    price:"$1,899", url:"#/producto" } },
  { id:4, thumb:null, caption:"Crossbody mini 🌸",              views:"87K",  likes:"5.4K",  url:TIKTOK_URL, product:{ name:"Bolsa Crossbody Mini",  price:"$1,499", url:"#/producto" } },
  { id:5, thumb:null, caption:"Tacones primavera 👠",           views:"155K", likes:"11K",   url:TIKTOK_URL, product:{ name:"Tacones Primavera",     price:"$1,299", url:"#/producto" } },
  { id:6, thumb:null, caption:"Maleta de cabina 🧳",            views:"76K",  likes:"4.8K",  url:TIKTOK_URL, product:{ name:"Maleta Cabina 20\"",    price:"$4,299", url:"#/producto" } },
];

const igPosts = [
  { id:1, thumb:null, caption:"Spring vibes 🌸",               likes:"2.1K", url:IG_URL, product:{ name:"Bolsa Tote Coral",        price:"$2,699", url:"#/producto" } },
  { id:2, thumb:null, caption:"Always on 🖤",                   likes:"3.4K", url:IG_URL, product:{ name:"Bolsa Hobo Negra",        price:"$2,299", url:"#/producto" } },
  { id:3, thumb:null, caption:"Mini pero mighty ✨",            likes:"1.8K", url:IG_URL, product:{ name:"Bolsa Mini Crossbody",    price:"$1,499", url:"#/producto" } },
  { id:4, thumb:null, caption:"Viaje de ensueño 🧳",            likes:"4.2K", url:IG_URL, product:{ name:"Maleta Rígida 24\"",      price:"$5,599", url:"#/producto" } },
  { id:5, thumb:null, caption:"Detalles que importan 💎",       likes:"2.9K", url:IG_URL, product:{ name:"Llavero Charm Mini",      price:"$399",   url:"#/producto" } },
  { id:6, thumb:null, caption:"Primavera en cada paso 🌷",      likes:"3.1K", url:IG_URL, product:{ name:"Flats Primavera",         price:"$899",   url:"#/producto" } },
];

// ▼ REEMPLAZA null con la URL de tu imagen real de producto
const bestSellers = [
  { id:1, name:"Bolsa Satchel Mediana",  collection:"Mascada",      price:"$2,099", oldPrice:null,    colors:["#d4c89a","#111","#8b3a3a"], img:null },
  { id:2, name:"Bolsa Hobo Maxi",        collection:"Always On",    price:"$2,299", oldPrice:null,    colors:["#c9a97a","#e8a0a0"],        img:null },
  { id:3, name:"Bolsa Tote Grande",      collection:"Ultra Ligera", price:"$1,049", oldPrice:"$1,399",colors:["#c4a060","#f0f0f0"],        img:null },
  { id:4, name:"Bolsa Crossbody Mini",   collection:"Spring 2026",  price:"$1,499", oldPrice:null,    colors:["#5090a0"],                  img:null },
];

// ▼ REEMPLAZA null con la URL de tu imagen real de categoría
const categories = [
  { label:"Bolsas",   sub:"215 estilos", img:null, tall:true  },
  { label:"Calzado",  sub:"84 estilos",  img:null, tall:false },
  { label:"Maletas",  sub:"48 estilos",  img:null, tall:false },
];

// ─── SLIDES del visor 3D ─────────────────────────────────────────────────────
const SLIDES = [
  { label:"01 — Diseño",    title:"Cada detalle\npensado",          body:"La forma no es accidental. Cada curva responde a una función, cada material a una intención." },
  { label:"02 — Materiales",title:"Construido\npara durar",         body:"Cuero de primera selección. Herrajes dorados que no pierden su brillo. Una pieza que envejece mejor con el tiempo." },
  { label:"03 — Precisión", title:"Tolerancias\nde micras",         body:"El ensamble artesanal garantiza que cada unidad salga perfecta. Sin compromisos en la calidad." },
  { label:"04 — Tacto",     title:"Se siente tan\nbien como se ve", body:"El peso, la textura, el sonido al cerrarlo. La experiencia táctil forma parte del diseño." },
  { label:"05 — Identidad", title:"Un objeto que\nte representa",   body:"No es solo una bolsa. Es una declaración de gusto, carácter y a qué le das valor." },
  { label:"06 — Origen",    title:"Hecho a mano\nen taller",        body:"Sin fábricas masivas. Producción limitada, controlada de inicio a fin por el mismo equipo." },
  { label:"07 — Tuya",      title:"Disponible\nahora",              body:"Producción limitada. Cuando se agota la edición, se agota. Sin reposición garantizada." },
];

// ─── 3D MODEL ────────────────────────────────────────────────────────────────
function Model3D({ progressRef, mouseRef }) {
  const materials = useLoader(MTLLoader, "/frames/Sitio_Suzanne.mtl");
  const obj = useLoader(OBJLoader, "/frames/Sitio_Suzanne.obj", (loader) => {
    materials.preload();
    loader.setMaterials(materials);
  });
  const groupRef  = useRef();
  const rotSmooth = useRef({ x:0, y:0 });

  useEffect(() => {
    if (!obj) return;
    const box    = new THREE.Box3().setFromObject(obj);
    const center = box.getCenter(new THREE.Vector3());
    const size   = box.getSize(new THREE.Vector3());
    obj.position.sub(center);
    obj.scale.setScalar(2.2 / Math.max(size.x, size.y, size.z));
    obj.traverse((child) => {
      if (child.isMesh) {
        const color = child.material?.color?.clone() ?? new THREE.Color(0xd4c5b0);
        child.material = new THREE.MeshPhysicalMaterial({
          color, metalness:0.15, roughness:0.4, clearcoat:0.6,
          clearcoatRoughness:0.2, envMapIntensity:1.2,
        });
        child.castShadow = child.receiveShadow = true;
      }
    });
  }, [obj]);

  useFrame(() => {
    if (!groupRef.current || !progressRef.current) return;
    const p  = progressRef.current.value;
    const mx = mouseRef?.current?.x ?? 0;
    const my = mouseRef?.current?.y ?? 0;
    rotSmooth.current.x += (my * 0.6 - rotSmooth.current.x) * 0.08;
    rotSmooth.current.y += (mx * 0.8 - rotSmooth.current.y) * 0.08;
    groupRef.current.rotation.y = p * Math.PI * 2 + rotSmooth.current.y;
    groupRef.current.rotation.x = p * (140 * Math.PI / 180) + rotSmooth.current.x;
    const zoom = 1 + 0.6 * Math.max(0, 1 - Math.abs(p - 0.5) / 0.5);
    groupRef.current.scale.setScalar(zoom);
    groupRef.current.position.y = Math.sin(p * Math.PI) * 0.2;
    const palette = [
      new THREE.Color("#c8bfb0"),
      new THREE.Color("#e8c898"),
      new THREE.Color("#c9a97a"),
      new THREE.Color("#a07d50"),
      new THREE.Color("#c8bfb0"),
    ];
    const step = 1 / (palette.length - 1);
    const seg  = Math.min(Math.floor(p / step), palette.length - 2);
    const t    = (p - seg * step) / step;
    const blended = palette[seg].clone().lerp(palette[seg + 1], t);
    groupRef.current.traverse((child) => {
      if (child.isMesh && child.material?.color)
        child.material.color.lerp(blended, 0.05);
    });
  });

  return <group ref={groupRef}><primitive object={obj}/></group>;
}

function DynamicLights({ progressRef }) {
  const l1 = useRef(), l2 = useRef();
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (l1.current) l1.current.position.set(Math.sin(t * 0.5) * 4, 2 + Math.cos(t * 0.3), 3);
    if (l2.current) l2.current.position.set(Math.cos(t * 0.4) * -3, -1, Math.sin(t * 0.6) * 3);
  });
  return (
    <>
      <ambientLight intensity={0.4}/>
      <pointLight ref={l1} intensity={60} distance={12} color="#e8c898"/>
      <pointLight ref={l2} intensity={40} distance={10} color="#c9a97a"/>
      <directionalLight position={[0,5,5]} intensity={0.8} castShadow/>
    </>
  );
}

function LoaderBar({ onReady }) {
  const { progress, active } = useProgress();
  useEffect(() => { if (!active && progress === 100) onReady(); }, [active, progress, onReady]);
  if (!active && progress === 100) return null;
  return (
    <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column",
      alignItems:"center", justifyContent:"center", gap:12,
      background:"rgba(248,247,245,0.97)", zIndex:5 }}>
      <div style={{ width:160, height:2, background:"rgba(120,120,120,0.2)", borderRadius:2, overflow:"hidden" }}>
        <div style={{ height:"100%", background:"var(--tan)", borderRadius:2, width:`${progress}%`, transition:"width .2s" }}/>
      </div>
      <span style={{ fontSize:11, fontFamily:"monospace", color:"rgba(100,100,100,0.55)" }}>
        Cargando · {Math.round(progress)}%
      </span>
    </div>
  );
}

// ─── VISOR 3D CON SCROLL ─────────────────────────────────────────────────────
function ProductViewer3D() {
  const spacerRef   = useRef(null);
  const textRef     = useRef(null);
  const progressRef = useRef({ value:0 });
  const mouseRef    = useRef({ x:0, y:0 });
  const [activeSlide, setActiveSlide] = useState(0);
  const [modelReady,  setModelReady]  = useState(false);

  useEffect(() => {
    const onMove = (e) => {
      mouseRef.current.x =  (e.clientX / window.innerWidth  - 0.5) * 2;
      mouseRef.current.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(progressRef.current, {
        value: 1, ease: "none",
        scrollTrigger: {
          trigger: spacerRef.current,
          start: "top top", end: "bottom bottom", scrub: 0.8,
          onUpdate: (self) => {
            const p      = self.progress;
            const sectF  = p * SLIDES.length;
            const si     = Math.min(SLIDES.length - 1, Math.floor(sectF));
            const localT = sectF - si;
            setActiveSlide(si);
            if (textRef.current) {
              textRef.current.style.transform = `translateY(${((0.5 - localT) * 70).toFixed(1)}px)`;
              textRef.current.style.opacity   = Math.max(0, 1 - Math.abs(localT - 0.5) * 2.8).toFixed(3);
            }
          },
        },
      });
    });
    return () => ctx.revert();
  }, []);

  const slide = SLIDES[activeSlide];

  return (
    <div ref={spacerRef} style={{ height:5000, position:"relative" }}>
      <div style={{ position:"sticky", top:0, height:"100vh",
        display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
        <div style={{ width:"100%", maxWidth:920, borderRadius:16, overflow:"hidden",
          border:"0.5px solid var(--border)", background:"var(--surface)",
          boxShadow:"0 4px 60px rgba(0,0,0,0.08)" }}>
          <div style={{ display:"flex", height:540, position:"relative" }}>

            {/* Canvas 3D */}
            <div style={{ flex:1, position:"relative", background:"var(--bg2)",
              borderRight:"0.5px solid var(--border)" }}>
              <Canvas camera={{ position:[0,0,4], fov:45 }} shadows dpr={[1,2]}
                style={{ width:"100%", height:"100%" }}>
                <DynamicLights progressRef={progressRef}/>
                <Suspense fallback={null}>
                  <Model3D progressRef={progressRef} mouseRef={mouseRef}/>
                  <ContactShadows position={[0,-1.4,0]} opacity={0.3} scale={4} blur={2} far={2}/>
                  <Environment preset="studio"/>
                </Suspense>
              </Canvas>
              {!modelReady && <LoaderBar onReady={() => setModelReady(true)}/>}
              {modelReady && (
                <span style={{ position:"absolute", top:14, left:"50%", transform:"translateX(-50%)",
                  fontSize:11, color:"rgba(100,100,100,0.4)", whiteSpace:"nowrap",
                  pointerEvents:"none", zIndex:5 }}>↓ desplaza para girar</span>
              )}
            </div>

            {/* Panel de texto */}
            <div style={{ width:"43%", display:"flex", flexDirection:"column",
              alignItems:"flex-start", justifyContent:"center",
              padding:"48px 40px", overflow:"hidden", position:"relative", background:"var(--bg)" }}>
              <div ref={textRef} style={{ willChange:"transform, opacity", width:"100%" }}>
                <span style={{ display:"block", fontSize:11, letterSpacing:"0.12em",
                  textTransform:"uppercase", color:"var(--tan)", marginBottom:14 }}>
                  {slide.label}
                </span>
                <h2 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif",
                  fontSize:"clamp(24px,2.5vw,34px)", fontWeight:300, lineHeight:1.2,
                  color:"var(--text)", margin:"0 0 16px", letterSpacing:"-0.01em" }}>
                  {slide.title.split("\n").map((line,i) => <span key={i}>{line}<br/></span>)}
                </h2>
                <p style={{ fontSize:14, color:"var(--text2)", lineHeight:1.78,
                  margin:0, maxWidth:270 }}>
                  {slide.body}
                </p>
              </div>

              {/* Dots */}
              <div style={{ position:"absolute", bottom:22, left:40, display:"flex", gap:5, alignItems:"center" }}>
                {SLIDES.map((_,i) => (
                  <div key={i} style={{ width:5, height:5, borderRadius:"50%",
                    background:"var(--tan)", transition:"opacity .3s, transform .3s",
                    opacity: i===activeSlide ? 0.8 : 0.18,
                    transform: `scale(${i===activeSlide ? 1.4 : 1})` }}/>
                ))}
              </div>

              {/* CTA */}
              <a href="#/producto" style={{ position:"absolute", bottom:22, right:40,
                fontSize:10, fontWeight:600, letterSpacing:1.5, textTransform:"uppercase",
                color:"var(--bg)", background:"var(--tan)", padding:"8px 16px",
                borderRadius:2, transition:"background .2s" }}
                onMouseEnter={e=>e.currentTarget.style.background="var(--tan-dark)"}
                onMouseLeave={e=>e.currentTarget.style.background="var(--tan)"}>
                Ver producto →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── HOOKS ───────────────────────────────────────────────────────────────────
function useAutoRotate(length, interval = 4000) {
  const [active, setActive] = useState(0);
  const timer = useRef(null);
  const reset = () => {
    clearInterval(timer.current);
    timer.current = setInterval(() => setActive(a => (a + 1) % length), interval);
  };
  useEffect(() => { reset(); return () => clearInterval(timer.current); }, [length]);
  return [active, (i) => { setActive(i); reset(); }];
}

// ─── ICONS ───────────────────────────────────────────────────────────────────
const TikTokIcon = ({ size=20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V9a8.26 8.26 0 0 0 4.84 1.55V7.12a4.85 4.85 0 0 1-1.07-.43z"/>
  </svg>
);
const IGIcon = ({ size=20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <circle cx="12" cy="12" r="4"/>
    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
  </svg>
);
const PlayIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="12" fill="rgba(0,0,0,0.5)"/>
    <polygon points="10,8 18,12 10,16" fill="white"/>
  </svg>
);

// ─── PLACEHOLDER DE IMAGEN ────────────────────────────────────────────────────
// Muestra un recuadro con instrucciones cuando img === null
function ImgSlot({ src, alt, style={}, className="" }) {
  if (src) return <img src={src} alt={alt} style={style} className={className}/>;
  return (
    <div style={{ ...style, display:"flex", flexDirection:"column", alignItems:"center",
      justifyContent:"center", background:"var(--bg3)", gap:6, flexShrink:0 }}
      className={className}>
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--text3)" strokeWidth="1.2">
        <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
        <polyline points="21,15 16,10 5,21"/>
      </svg>
      <span style={{ fontSize:10, color:"var(--text3)", letterSpacing:1, textTransform:"uppercase",
        textAlign:"center", maxWidth:120, lineHeight:1.4 }}>
        Agrega tu<br/>imagen aquí
      </span>
    </div>
  );
}

// ─── SPINNING CAROUSEL ───────────────────────────────────────────────────────
function SpinningCarousel({ items, platform, profileUrl, profileHandle }) {
  const [active, goTo] = useAutoRotate(items.length, 3500);
  const [hovered, setHovered] = useState(null);
  const isTikTok = platform === "tiktok";

  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:32 }}>
        <div style={{ display:"flex", alignItems:"center", gap:14 }}>
          <div style={{ width:48, height:48, borderRadius:"50%", background:"var(--bg3)",
            display:"flex", alignItems:"center", justifyContent:"center", color:"var(--text)" }}>
            {isTikTok ? <TikTokIcon size={22}/> : <IGIcon size={22}/>}
          </div>
          <div>
            <p style={{ fontSize:11, fontWeight:600, letterSpacing:2, textTransform:"uppercase",
              color:"var(--text3)", marginBottom:3 }}>{isTikTok ? "TikTok" : "Instagram"}</p>
            <a href={profileUrl} target="_blank" rel="noopener noreferrer"
              style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:22, fontWeight:600, color:"var(--text)" }}>
              {profileHandle}
            </a>
          </div>
        </div>
        <a href={profileUrl} target="_blank" rel="noopener noreferrer"
          style={{ display:"flex", alignItems:"center", gap:8, fontSize:11, fontWeight:600,
            letterSpacing:1.5, textTransform:"uppercase", color:"var(--text)",
            border:"1px solid var(--border)", borderRadius:2, padding:"10px 18px", transition:"all .2s" }}
          onMouseEnter={e=>{ e.currentTarget.style.background="var(--text)"; e.currentTarget.style.color="var(--bg)"; }}
          onMouseLeave={e=>{ e.currentTarget.style.background="transparent"; e.currentTarget.style.color="var(--text)"; }}>
          Ver perfil →
        </a>
      </div>

      <div style={{ display:"flex", gap:16, overflowX:"auto", paddingBottom:8, scrollbarWidth:"none" }}>
        {items.map((item, i) => {
          const isActive = i === active;
          return (
            <div key={item.id}
              onMouseEnter={() => setHovered(item.id)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => goTo(i)}
              style={{ flexShrink:0, width:isTikTok?200:240,
                transform: isActive ? "scale(1.04)" : "scale(0.96)",
                transition:"transform .5s cubic-bezier(.34,1.56,.64,1)", cursor:"pointer" }}>
              <div style={{ position:"relative", borderRadius:12, overflow:"hidden",
                aspectRatio: isTikTok?"9/16":"1/1",
                boxShadow: isActive ? "0 12px 40px rgba(0,0,0,0.25)" : "0 4px 16px rgba(0,0,0,0.1)",
                transition:"box-shadow .4s" }}>
                <ImgSlot src={item.thumb} alt={item.caption}
                  style={{ width:"100%", height:"100%", objectFit:"cover",
                    filter: isActive ? "none" : "grayscale(30%) brightness(0.85)",
                    transition:"filter .4s" }}/>
                <div style={{ position:"absolute", inset:0, background:"linear-gradient(transparent 40%,rgba(0,0,0,0.7))" }}/>
                {isTikTok && (
                  <div style={{ position:"absolute", top:"50%", left:"50%",
                    transform:"translate(-50%,-50%)", opacity: isActive?1:0.6 }}>
                    <PlayIcon/>
                  </div>
                )}
                <div style={{ position:"absolute", bottom:12, left:12, right:12, color:"white" }}>
                  <p style={{ fontSize:12, fontWeight:500, marginBottom:6, lineHeight:1.3 }}>{item.caption}</p>
                  <div style={{ display:"flex", gap:12, fontSize:11, opacity:.8 }}>
                    {isTikTok ? <><span>▶ {item.views}</span><span>♥ {item.likes}</span></> : <span>♥ {item.likes}</span>}
                  </div>
                </div>
                {isActive && (
                  <div style={{ position:"absolute", top:10, right:10, width:8, height:8,
                    borderRadius:"50%", background:"var(--tan)", boxShadow:"0 0 0 2px rgba(255,255,255,.5)" }}/>
                )}
              </div>
              <div style={{ marginTop:10, padding:"10px 12px", background:"var(--bg2)",
                borderRadius:8, border:"1px solid var(--border)",
                opacity: (isActive||hovered===item.id) ? 1 : 0,
                transform: (isActive||hovered===item.id) ? "translateY(0)" : "translateY(6px)",
                transition:"opacity .3s, transform .3s",
                pointerEvents: (isActive||hovered===item.id) ? "all" : "none" }}>
                <p style={{ fontSize:12, fontWeight:500, color:"var(--text)", marginBottom:4 }}>{item.product.name}</p>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                  <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:18, fontWeight:600, color:"var(--tan-dark)" }}>{item.product.price}</span>
                  <a href={item.product.url} style={{ fontSize:10, fontWeight:600, letterSpacing:1.5,
                    textTransform:"uppercase", color:"var(--bg)", background:"var(--text)", padding:"5px 10px", borderRadius:2 }}>Ver →</a>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Dots */}
      <div style={{ display:"flex", justifyContent:"center", gap:6, marginTop:28 }}>
        {items.map((_,i) => (
          <button key={i} onClick={() => goTo(i)}
            style={{ width: i===active?24:8, height:8, borderRadius:4,
              background: i===active?"var(--tan)":"var(--border)",
              border:"none", cursor:"pointer", padding:0,
              transition:"width .3s, background .3s" }}/>
        ))}
      </div>
    </div>
  );
}

// ─── PRODUCT CARD ─────────────────────────────────────────────────────────────
function ProductCard({ p }) {
  const [selColor, setSelColor] = useState(0);
  const [wished,   setWished]   = useState(false);
  const [added,    setAdded]    = useState(false);

  return (
    <div style={{ cursor:"pointer" }} className="p-card">
      <div style={{ position:"relative", borderRadius:6, overflow:"hidden",
        aspectRatio:"3/4", background:"var(--bg2)", marginBottom:14 }} className="p-img-wrap">
        <ImgSlot src={p.img} alt={p.name}
          style={{ width:"100%", height:"100%", objectFit:"cover", transition:"transform .5s" }}
          className="p-img"/>
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
        <button onClick={e=>{e.preventDefault();setAdded(true);setTimeout(()=>setAdded(false),2000)}}
          style={{ position:"absolute", bottom:0, left:0, right:0,
            background: added?"#22c55e":"var(--text)", color:"var(--bg)",
            fontSize:10, fontWeight:600, letterSpacing:1.5, textTransform:"uppercase",
            border:"none", cursor:"pointer", padding:11,
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
              border: selColor===i?"2px solid var(--text)":"2px solid transparent",
              outline: selColor===i?"1px solid var(--text)":"none", outlineOffset:2,
              transition:"transform .15s", transform: selColor===i?"scale(1.2)":"scale(1)" }}/>
        ))}
      </div>
      <style>{`.p-card:hover .p-wish{opacity:1!important;transform:scale(1)!important}.p-card:hover .p-quick{transform:translateY(0)!important}.p-card:hover .p-img{transform:scale(1.04)}`}</style>
    </div>
  );
}

// ─── SECTION TITLE ───────────────────────────────────────────────────────────
function SectionTitle({ eyebrow, title, subtitle, center=false }) {
  return (
    <div style={{ textAlign:center?"center":"left", marginBottom:48 }}>
      {eyebrow && <p style={{ fontSize:10, fontWeight:600, letterSpacing:3, textTransform:"uppercase", color:"var(--tan)", marginBottom:12 }}>{eyebrow}</p>}
      <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(32px,4vw,52px)", fontWeight:300, lineHeight:1.1, color:"var(--text)", marginBottom:subtitle?12:0 }}>{title}</h2>
      {subtitle && <p style={{ fontSize:14, color:"var(--text3)", lineHeight:1.8, maxWidth:480, margin:center?"0 auto":0 }}>{subtitle}</p>}
    </div>
  );
}

function Divider() {
  return <div style={{ height:1, background:"var(--border)", margin:"80px 0" }}/>;
}

// ─── HOMEPAGE ─────────────────────────────────────────────────────────────────
export default function HomePage() {
  const { dark } = useTheme();

  return (
    <main>
      <style>{`
        .hero { display:grid; grid-template-columns:1fr 1fr; min-height:90vh; }
        .hero-img { position:relative; overflow:hidden; }
        .trust-bar { display:grid; grid-template-columns:repeat(4,1fr); border-bottom:1px solid var(--border); }
        .cat-grid { display:grid; grid-template-columns:2fr 1fr 1fr; gap:16px; }
        .products-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:24px; }
        .social-section { padding:80px 48px; }
        @media(max-width:1024px){
          .hero{grid-template-columns:1fr} .hero-img{min-height:50vh}
          .trust-bar{grid-template-columns:repeat(2,1fr)}
          .cat-grid{grid-template-columns:1fr 1fr} .products-grid{grid-template-columns:repeat(2,1fr)}
          .social-section{padding:60px 28px}
        }
        @media(max-width:768px){
          .hero-text{padding:48px 28px!important} .cat-grid{grid-template-columns:1fr}
          .products-grid{grid-template-columns:repeat(2,1fr);gap:16px}
          .social-section{padding:48px 20px}
        }
      `}</style>

      {/* ── HERO ── */}
      <div className="hero">
        <div className="hero-text" style={{ background:"var(--text)", display:"flex",
          flexDirection:"column", justifyContent:"flex-end", padding:"80px 64px",
          position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", top:-120, right:-120, width:400, height:400,
            borderRadius:"50%", border:"1px solid rgba(201,169,122,.15)" }}/>
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
            <a href="#/catalogo" style={{ display:"inline-flex", alignItems:"center", gap:8,
              background:"white", color:"#111", fontSize:11, fontWeight:600, letterSpacing:2,
              textTransform:"uppercase", padding:"14px 28px", borderRadius:2, transition:"all .2s" }}
              onMouseEnter={e=>{e.currentTarget.style.background="var(--tan)";e.currentTarget.style.color="white"}}
              onMouseLeave={e=>{e.currentTarget.style.background="white";e.currentTarget.style.color="#111"}}>
              Ver colección →
            </a>
            <a href="#/new-arrivals" style={{ display:"inline-flex", alignItems:"center", gap:8,
              background:"transparent", color:"rgba(255,255,255,.6)", fontSize:11, fontWeight:600,
              letterSpacing:2, textTransform:"uppercase", padding:"14px 28px", borderRadius:2,
              border:"1px solid rgba(255,255,255,.2)", transition:"all .2s" }}
              onMouseEnter={e=>{e.currentTarget.style.color="white";e.currentTarget.style.borderColor="rgba(255,255,255,.6)"}}
              onMouseLeave={e=>{e.currentTarget.style.color="rgba(255,255,255,.6)";e.currentTarget.style.borderColor="rgba(255,255,255,.2)"}}>
              Novedades
            </a>
          </div>
        </div>

        {/* Hero image slot */}
        <div className="hero-img">
          <ImgSlot src={null} alt="Hero"
            style={{ width:"100%", height:"100%", minHeight:500, objectFit:"cover",
              filter: dark?"brightness(.85)":"brightness(1)" }}/>
          {/* Badge producto */}
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
          { icon:"🚚", title:"Envío gratis",      sub:"En compras +$1,499 MXN" },
          { icon:"↩",  title:"Devolución 30 días", sub:"Sin costo, sin preguntas" },
          { icon:"🔒", title:"Pago seguro",        sub:"Kueski Pay · MSI disponibles" },
          { icon:"📍", title:"+90 tiendas",        sub:"Encuéntranos en todo México" },
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

      {/* ── VISOR 3D ── */}
      <ProductViewer3D/>

      {/* ── BEST SELLERS ── */}
      <section style={{ padding:"80px 48px" }}>
        <SectionTitle eyebrow="Lo más popular"
          title={<>Best<em style={{fontStyle:"italic"}}> Sellers</em></>}
          subtitle="Las piezas que todas quieren. Descubre por qué."/>
        <div className="products-grid">
          {bestSellers.map(p => <ProductCard key={p.id} p={p}/>)}
        </div>
      </section>

      <Divider/>

      {/* ── TIKTOK ── */}
      <section className="social-section" style={{ background:"var(--bg2)" }}>
        <div style={{ maxWidth:1200, margin:"0 auto" }}>
          <SectionTitle
            eyebrow="Como se usa en la vida real"
            title={<>Descúbrenos en <em style={{fontStyle:"italic"}}>TikTok</em></>}
            subtitle={`Mira cómo nuestras clientas lucen sus piezas favoritas en ${TIKTOK_HANDLE}`}/>
          <SpinningCarousel items={tiktokVideos} platform="tiktok"
            profileUrl={TIKTOK_URL} profileHandle={TIKTOK_HANDLE}/>
          <div style={{ marginTop:32, padding:"14px 20px", background:"var(--bg3)",
            border:"1px solid var(--border)", borderRadius:4,
            fontSize:12, color:"var(--text3)", display:"flex", alignItems:"center", gap:10 }}>
            <TikTokIcon size={14}/>
            <span>
              <strong style={{color:"var(--text)"}}>Slot para API real:</strong>{" "}
              Conecta con TikTok Developer API para mostrar videos reales de {TIKTOK_HANDLE}.{" "}
              <a href="https://developers.tiktok.com" target="_blank" rel="noopener noreferrer"
                style={{color:"var(--tan)"}}>Ver documentación →</a>
            </span>
          </div>
        </div>
      </section>

      <Divider/>

      {/* ── CATEGORÍAS ── */}
      <section style={{ padding:"0 48px 80px" }}>
        <SectionTitle eyebrow="Explora" title={<>Encuentra tu <em style={{fontStyle:"italic"}}>estilo</em></>}/>
        <div className="cat-grid">
          {categories.map(({ label, sub, img, tall }) => (
            <a key={label} href={`#/${label.toLowerCase()}`}
              style={{ position:"relative", overflow:"hidden", borderRadius:4, cursor:"pointer",
                gridRow:tall?"span 2":"auto", aspectRatio:tall?"auto":"4/3",
                minHeight:tall?500:200, display:"block" }}>
              <ImgSlot src={img} alt={label}
                style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover" }}/>
              <div style={{ position:"absolute", inset:0, background:"linear-gradient(transparent 40%,rgba(0,0,0,0.55))" }}/>
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

      {/* ── INSTAGRAM ── */}
      <section className="social-section">
        <div style={{ maxWidth:1200, margin:"0 auto" }}>
          <SectionTitle
            eyebrow="Inspírate con nuestra comunidad"
            title={<>Síguenos en <em style={{fontStyle:"italic"}}>Instagram</em></>}
            subtitle={`Las fotos más hermosas de nuestra comunidad en ${IG_HANDLE}`}/>
          <SpinningCarousel items={igPosts} platform="instagram"
            profileUrl={IG_URL} profileHandle={IG_HANDLE}/>
          <div style={{ marginTop:32, padding:"14px 20px", background:"var(--bg2)",
            border:"1px solid var(--border)", borderRadius:4,
            fontSize:12, color:"var(--text3)", display:"flex", alignItems:"center", gap:10 }}>
            <IGIcon size={14}/>
            <span>
              <strong style={{color:"var(--text)"}}>Slot para API real:</strong>{" "}
              Conecta con Instagram Basic Display API para mostrar posts reales de {IG_HANDLE}.{" "}
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
          <div style={{ display:"flex", maxWidth:400, margin:"0 auto" }}>
            <input type="email" placeholder="tu@correo.com"
              style={{ flex:1, padding:"14px 18px", background:"rgba(255,255,255,.06)",
                border:"1px solid rgba(255,255,255,.15)", borderRight:"none",
                borderRadius:"2px 0 0 2px", color:"white", fontSize:14,
                fontFamily:"inherit", outline:"none" }}/>
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