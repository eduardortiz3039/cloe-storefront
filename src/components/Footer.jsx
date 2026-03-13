import { useTheme } from "../context/ThemeContext";
import { TikTokIcon, IGIcon, FBIcon } from "./ui/Icons";

const FOOTER_LINKS = [
  { title: "Categorías",  links: ["Bolsas", "Calzado", "Maletas & Viaje", "Accesorios", "Para él", "Sale"] },
  { title: "Colecciones", links: ["Always On", "Ultra Ligera", "Spring 2026", "Colaboraciones", "Ediciones Limitadas"] },
  { title: "Ayuda",       links: ["Preguntas frecuentes", "Guía de tallas", "Rastrear pedido", "Devoluciones", "Garantía"] },
  { title: "Empresa",     links: ["Nuestra historia", "Trabaja con nosotros", "Prensa", "Tiendas físicas"] },
];

const SOCIAL = [
  { Icon: TikTokIcon, href: "https://www.tiktok.com/@cloeoemoda",     label: "TikTok" },
  { Icon: IGIcon,     href: "https://www.instagram.com/cloeoemoda/",  label: "Instagram" },
  { Icon: FBIcon,     href: "#",                                       label: "Facebook" },
];

export default function Footer() {
  return (
    <>
      {/* Newsletter strip */}
      <div style={{ background: "var(--tan)", padding: "32px 48px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          gap: 24, flexWrap: "wrap" }}>
          <div>
            <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: 3,
              textTransform: "uppercase", color: "rgba(255,255,255,.7)", marginBottom: 4 }}>
              Club CLOE
            </p>
            <p style={{ fontFamily: "var(--font-serif,Georgia,serif)", fontSize: 24,
              fontWeight: 300, color: "white" }}>
              Recibe preventas y ofertas exclusivas.
            </p>
          </div>
          <div style={{ display: "flex" }}>
            <input type="email" placeholder="tu@correo.com"
              style={{ padding: "11px 16px", background: "rgba(255,255,255,.15)",
                border: "1px solid rgba(255,255,255,.3)", borderRight: "none",
                borderRadius: "2px 0 0 2px", color: "white", fontSize: 13,
                fontFamily: "inherit", outline: "none", width: 220 }} />
            <button style={{ padding: "11px 20px", background: "#111110", color: "white",
              border: "none", borderRadius: "0 2px 2px 0", fontSize: 10, fontWeight: 600,
              letterSpacing: 1.5, textTransform: "uppercase", fontFamily: "inherit" }}>
              Suscribirme
            </button>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <footer style={{ background: "#0a0a0a", color: "rgba(255,255,255,.6)",
        padding: "64px 48px 40px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>

          {/* Top: logo + social */}
          <div style={{ display: "flex", alignItems: "flex-start",
            justifyContent: "space-between", marginBottom: 56, flexWrap: "wrap", gap: 24 }}>
            <div>
              <img src="/Logo_CLOE_t.png" alt="CLOE"
                style={{ height: 28, filter: "none", marginBottom: 12 }} />
              <p style={{ fontSize: 12, lineHeight: 1.8, maxWidth: 280 }}>
                Moda mexicana diseñada para acompañarte en cada momento del día.
              </p>
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              {SOCIAL.map(({ Icon, href, label }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" title={label}
                  style={{ width: 38, height: 38, borderRadius: "50%",
                    background: "rgba(255,255,255,.07)", border: "1px solid rgba(255,255,255,.1)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "rgba(255,255,255,.6)", transition: "all .2s" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "var(--tan)"; e.currentTarget.style.color = "white"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,.07)"; e.currentTarget.style.color = "rgba(255,255,255,.6)"; }}>
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Links grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 32, marginBottom: 48 }}>
            {FOOTER_LINKS.map(({ title, links }) => (
              <div key={title}>
                <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: 2.5,
                  textTransform: "uppercase", color: "rgba(255,255,255,.4)", marginBottom: 16 }}>
                  {title}
                </p>
                <ul style={{ listStyle: "none" }}>
                  {links.map(l => (
                    <li key={l} style={{ marginBottom: 8 }}>
                      <a href="#" style={{ fontSize: 13, color: "rgba(255,255,255,.5)", transition: "color .2s" }}
                        onMouseEnter={e => e.target.style.color = "white"}
                        onMouseLeave={e => e.target.style.color = "rgba(255,255,255,.5)"}>
                        {l}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div style={{ borderTop: "1px solid rgba(255,255,255,.08)", paddingTop: 24,
            display: "flex", alignItems: "center", justifyContent: "space-between",
            flexWrap: "wrap", gap: 12 }}>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,.3)" }}>
              © 2026 CLOE. Todos los derechos reservados.
            </p>
            <div style={{ display: "flex", gap: 16 }}>
              {["Aviso de privacidad", "Términos y condiciones", "Cookies"].map(l => (
                <a key={l} href="#" style={{ fontSize: 11, color: "rgba(255,255,255,.3)", transition: "color .2s" }}
                  onMouseEnter={e => e.target.style.color = "rgba(255,255,255,.6)"}
                  onMouseLeave={e => e.target.style.color = "rgba(255,255,255,.3)"}>
                  {l}
                </a>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {["Visa", "MC", "AMEX", "Kueski", "Aplazo"].map(m => (
                <span key={m} style={{ fontSize: 9, fontWeight: 600, letterSpacing: 1,
                  color: "rgba(255,255,255,.4)", background: "rgba(255,255,255,.06)",
                  border: "1px solid rgba(255,255,255,.1)", borderRadius: 2,
                  padding: "3px 7px", textTransform: "uppercase" }}>{m}</span>
              ))}
            </div>
          </div>
        </div>

        <style>{`
          @media(max-width:768px){
            footer { padding:48px 24px 32px !important; }
            footer > div > div:nth-child(3) { grid-template-columns:1fr 1fr !important; }
          }
        `}</style>
      </footer>
    </>
  );
}
