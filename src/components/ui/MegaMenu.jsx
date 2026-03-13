// MegaMenu.jsx — se usa dentro de Navbar para los dropdowns de categorías

const FeaturedCard = ({ featured }) => (
  <div style={{ position: "relative", borderRadius: 4, overflow: "hidden",
    background: "var(--bg2)", aspectRatio: "3/4",
    maxHeight: featured.maxHeight || 240 }}>
    {featured.img
      ? <img src={featured.img} alt={featured.title}
          style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform .4s" }} />
      : <div style={{ width: "100%", height: "100%", background: "var(--bg3)",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "var(--text3)", fontSize: 13 }}>{featured.title}</div>
    }
    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0,
      background: "linear-gradient(transparent,rgba(0,0,0,.6))",
      padding: "20px 16px 16px", color: "white" }}>
      <p style={{ fontSize: 9, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase",
        opacity: .8, marginBottom: 3 }}>{featured.tag}</p>
      <p style={{ fontFamily: "var(--font-serif,Georgia,serif)", fontSize: 17,
        fontWeight: 600, lineHeight: 1.2 }}>{featured.title}</p>
    </div>
  </div>
);

const Badge = ({ badge }) => {
  if (!badge) return null;
  const styles = {
    new:  { background: "#111", color: "white" },
    sale: { background: "#b5342a", color: "white" },
    hot:  { background: "var(--tan-light)", color: "var(--tan-dark)" },
    gift: { background: "var(--tan-light)", color: "var(--tan-dark)" },
    fav:  { background: "var(--tan-light)", color: "var(--tan-dark)" },
  };
  return (
    <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1, padding: "2px 7px",
      borderRadius: 2, textTransform: "uppercase", marginLeft: "auto", flexShrink: 0,
      ...(styles[badge.type] || styles.hot) }}>
      {badge.text || "♥"}
    </span>
  );
};

const MegaColumn = ({ col }) => {
  if (col.featured) return <FeaturedCard featured={col.featured} />;
  return (
    <div>
      {col.seeAll && (
        <a href="#/catalogo"
          style={{ display: "inline-flex", alignItems: "center", gap: 8,
            fontSize: 11, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase",
            color: "var(--text)", padding: "10px 18px", border: "1px solid var(--text)",
            borderRadius: 2, marginBottom: 28, whiteSpace: "nowrap", transition: "all .2s" }}
          onMouseEnter={e => { e.currentTarget.style.background = "var(--text)"; e.currentTarget.style.color = "var(--bg)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text)"; }}>
          {col.seeAll}
        </a>
      )}
      {col.title && (
        <p style={{ fontSize: 9, fontWeight: 600, letterSpacing: 2.5, textTransform: "uppercase",
          color: "var(--tan)", marginBottom: 14, paddingBottom: 10, borderBottom: "1px solid var(--border)" }}>
          {col.title}
        </p>
      )}
      {col.special && (
        <ul style={{ listStyle: "none", marginTop: 4 }}>
          {col.special.map(item => (
            <li key={item}>
              <a href="#/catalogo"
                style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0",
                  fontFamily: "var(--font-serif,Georgia,serif)", fontSize: 16, fontStyle: "italic",
                  color: "var(--text3)", transition: "color .2s" }}
                onMouseEnter={e => e.currentTarget.style.color = "var(--text)"}
                onMouseLeave={e => e.currentTarget.style.color = "var(--text3)"}>
                <span style={{ width: 4, height: 4, borderRadius: "50%",
                  background: "var(--tan)", flexShrink: 0 }} />
                {item}
              </a>
            </li>
          ))}
        </ul>
      )}
      {col.links && (
        <ul style={{ listStyle: "none" }}>
          {col.links.map(link => (
            <li key={link.label}>
              <a href="#/catalogo"
                style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0",
                  fontSize: 13, color: "var(--text2)", transition: "color .15s, padding-left .15s" }}
                onMouseEnter={e => { e.currentTarget.style.color = "var(--text)"; e.currentTarget.style.paddingLeft = "4px"; }}
                onMouseLeave={e => { e.currentTarget.style.color = "var(--text2)"; e.currentTarget.style.paddingLeft = "0"; }}>
                {link.label}<Badge badge={link.badge} />
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default function MegaMenu({ item }) {
  if (!item?.mega) return null;
  return (
    <div style={{ position: "fixed", left: 0, right: 0, top: "var(--nav-h,64px)",
      background: "var(--bg)", borderTop: "2px solid var(--tan)",
      borderBottom: "1px solid var(--border)",
      boxShadow: "0 20px 48px rgba(0,0,0,.1)", zIndex: 200,
      animation: "menuIn .22s ease", transition: "background .35s" }}>
      <style>{`@keyframes menuIn{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 48px 44px",
        display: "grid",
        gridTemplateColumns: item.mega.style?.gridTemplateColumns || "180px 1fr 1fr 260px",
        gap: item.mega.style?.gap || 48, alignItems: "start" }}>
        {item.mega.columns.map((col, i) => <MegaColumn key={i} col={col} />)}
      </div>
    </div>
  );
}
