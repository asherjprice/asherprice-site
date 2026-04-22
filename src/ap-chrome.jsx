/* Shared chrome + tokens for every page — Workshop Ledger.
   Single source of truth for Announcement, Nav, Footer, MobileMenu,
   Monogram, Eyebrow, SectionHeader, Btn, AP palette, useMobile. */

import { useState, useEffect } from "react";

export const AP = {
  slate:   "#15171B",
  slate2:  "#1B1E22",
  slate3:  "#23262B",
  rule:    "rgba(232,228,219,0.12)",
  ruleStr: "rgba(232,228,219,0.22)",
  off:     "#E8E4DB",
  off2:    "#D6D1C4",
  red:     "#A3132A",
  redDeep: "#7A0E20",
  moss:    "#7A8564",
  brass:   "#B79862",
  dim:     "#7E8086",
  display: "'Space Grotesk', system-ui, sans-serif",
  mono:    "'JetBrains Mono', ui-monospace, monospace",
  italic:  "'Fraunces', Georgia, serif",
  body:    "'Inter Tight', system-ui, sans-serif",
};

export function useMobile() {
  const [m, setM] = useState(
    typeof window !== "undefined" && window.matchMedia("(max-width: 640px)").matches
  );
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const h = (e) => setM(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);
  return m;
}

export function useBodyStyles() {
  useEffect(() => {
    document.body.style.background = AP.slate;
    document.body.style.color = AP.off;
    document.body.style.margin = "0";
    document.body.style.fontFamily = AP.body;
    document.documentElement.style.scrollBehavior = "smooth";
  }, []);
}

export function Eyebrow({ children, color = AP.brass, line = true, width = 28 }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 10,
      fontFamily: AP.mono, fontSize: 11, letterSpacing: "0.16em", color,
      textTransform: "uppercase",
    }}>
      {line && <span style={{ width, height: 1, background: color }} />}
      <span>{children}</span>
    </div>
  );
}

export function SectionHeader({ index, welsh, title, right, invert = false, mobile }) {
  const fg = invert ? AP.slate : AP.off;
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: mobile ? "1fr" : "auto 1fr auto",
      alignItems: "end", gap: mobile ? 14 : 32,
      padding: "0 0 22px", borderBottom: `2px solid ${fg}`,
    }}>
      <div style={{ display: "grid", gap: 6 }}>
        <div style={{ fontFamily: AP.mono, fontSize: 11, letterSpacing: "0.18em", color: AP.red }}>
          // {index}
        </div>
        <div style={{ fontFamily: AP.italic, fontStyle: "italic", fontSize: 16, color: AP.brass }}>
          {welsh}
        </div>
      </div>
      <h2 style={{
        margin: 0, fontFamily: AP.display, fontWeight: 500,
        fontSize: mobile ? 40 : 72, lineHeight: 0.96,
        letterSpacing: "-0.035em", color: fg, textWrap: "balance",
      }}>{title}</h2>
      {right && (
        <div style={{
          fontFamily: AP.mono, fontSize: 11, color: fg, letterSpacing: "0.02em",
          textAlign: mobile ? "left" : "right", lineHeight: 1.55, opacity: 0.75,
        }}>{right}</div>
      )}
    </div>
  );
}

export function Btn({ children, variant = "solid", as = "button", href, icon = "→", small, full, onClick, target, rel }) {
  const base = {
    display: "inline-flex", alignItems: "center", justifyContent: "space-between", gap: 14,
    padding: small ? "10px 14px" : "14px 20px",
    fontFamily: AP.mono, fontSize: small ? 11 : 12, letterSpacing: "0.12em",
    textTransform: "uppercase", border: "none", cursor: "pointer",
    width: full ? "100%" : "auto", textDecoration: "none",
  };
  const variants = {
    solid:  { ...base, background: AP.red, color: AP.off },
    ghost:  { ...base, background: "transparent", color: AP.off, border: `1px solid ${AP.off}` },
    light:  { ...base, background: AP.off, color: AP.slate },
  };
  const style = variants[variant] || variants.solid;
  if (as === "a") {
    return (
      <a href={href} style={style} onClick={onClick} target={target} rel={rel}>
        <span>{children}</span><span aria-hidden>{icon}</span>
      </a>
    );
  }
  return (
    <button style={style} onClick={onClick}>
      <span>{children}</span><span aria-hidden>{icon}</span>
    </button>
  );
}

export function Monogram({ size = 44, color = AP.red, fg = AP.off }) {
  return (
    <div style={{
      width: size, height: size, background: color, color: fg,
      display: "grid", placeItems: "center",
      fontFamily: AP.display, fontWeight: 700, letterSpacing: "-0.04em",
      fontSize: size * 0.42,
    }}>AP</div>
  );
}

export function Announcement({ mobile }) {
  return (
    <a href="/founding-local" style={{
      display: "flex", alignItems: "center",
      height: 38, padding: mobile ? "0 14px" : "0 28px", gap: mobile ? 10 : 22,
      borderBottom: `1px solid ${AP.rule}`,
      fontFamily: AP.mono, fontSize: mobile ? 10 : 11, color: AP.off, letterSpacing: "0.04em",
      background: AP.slate2, position: "relative", zIndex: 5,
      overflow: "hidden", whiteSpace: "nowrap", textDecoration: "none",
    }}>
      <span style={{ color: AP.brass }}>◆</span>
      <span>FOUNDING_LOCAL</span>
      <span style={{ color: AP.dim }}>//</span>
      <span>£100 setup</span>
      <span style={{ color: AP.dim }}>·</span>
      <span>£50/mo</span>
      <span style={{ color: AP.dim }}>//</span>
      <span style={{ color: AP.red }}>10 of 10 places remaining</span>
      {!mobile && (
        <span style={{ marginLeft: "auto", color: AP.dim, display: "flex", gap: 18 }}>
          <span>Blackwood · NP12</span>
          <span>[apply →]</span>
        </span>
      )}
    </a>
  );
}

export function Nav({ mobile, onMenuOpen, active }) {
  const items = [
    { label: "Services",     href: "/#services" },
    { label: "Showcase",     href: "/showcase" },
    { label: "Examples",     href: "/examples" },
    { label: "How it works", href: "/#how-it-works" },
  ];
  return (
    <nav style={{
      height: mobile ? 64 : 78, display: "flex", alignItems: "center",
      padding: mobile ? "0 16px" : "0 28px",
      borderBottom: `1px solid ${AP.rule}`, position: "sticky", top: 0,
      background: `${AP.slate}ee`, backdropFilter: "blur(8px)", zIndex: 10,
    }}>
      <a href="/" style={{ display: "flex", alignItems: "center", gap: 14, textDecoration: "none", color: AP.off }}>
        <Monogram />
        <div style={{ lineHeight: 1.15 }}>
          <div style={{ fontFamily: AP.display, fontWeight: 600, fontSize: 18, letterSpacing: "-0.01em" }}>Asher Price</div>
          {!mobile && (
            <div style={{ fontFamily: AP.mono, fontSize: 10, color: AP.dim, letterSpacing: "0.08em" }}>
              / solo studio / blackwood, cymru
            </div>
          )}
        </div>
      </a>
      {mobile ? (
        <button onClick={onMenuOpen} style={{
          marginLeft: "auto", width: 40, height: 40, background: "transparent",
          border: `1px solid ${AP.ruleStr}`, color: AP.off, cursor: "pointer",
          display: "inline-flex", alignItems: "center", justifyContent: "center", padding: 0,
        }} aria-label="Open menu">
          <svg width="18" height="12" viewBox="0 0 18 12" fill="none">
            <line x1="0" y1="1" x2="18" y2="1" stroke="currentColor" strokeWidth="1.4"/>
            <line x1="0" y1="6" x2="18" y2="6" stroke="currentColor" strokeWidth="1.4"/>
            <line x1="0" y1="11" x2="18" y2="11" stroke="currentColor" strokeWidth="1.4"/>
          </svg>
        </button>
      ) : (
        <div style={{
          marginLeft: "auto", display: "flex", gap: 26, alignItems: "center",
          fontFamily: AP.mono, fontSize: 12, color: AP.off,
        }}>
          {items.map((x, i) => (
            <a key={x.label} href={x.href} style={{
              color: active === x.label ? AP.red : AP.off,
              textDecoration: "none", display: "flex", gap: 8, alignItems: "baseline",
            }}>
              <span style={{ color: active === x.label ? AP.red : AP.dim, fontSize: 10 }}>{String(i + 1).padStart(2, "0")}</span>
              <span>{x.label}</span>
            </a>
          ))}
          <a href="/#contact" style={{ textDecoration: "none" }}>
            <Btn small>05 · Get started</Btn>
          </a>
        </div>
      )}
    </nav>
  );
}

export function MobileMenu({ onClose }) {
  const links = [
    { label: "Services",       href: "/#services" },
    { label: "Showcase",       href: "/showcase" },
    { label: "Examples",       href: "/examples" },
    { label: "How it works",   href: "/#how-it-works" },
    { label: "Founding Local", href: "/founding-local" },
    { label: "Get started",    href: "/#contact" },
  ];
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 300,
      background: `${AP.slate}f5`, backdropFilter: "blur(20px)",
      display: "flex", flexDirection: "column",
      padding: "22px",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 48 }}>
        <Monogram size={36}/>
        <button onClick={onClose} style={{
          width: 40, height: 40, background: "transparent",
          border: `1px solid ${AP.ruleStr}`, color: AP.off, cursor: "pointer",
          display: "inline-flex", alignItems: "center", justifyContent: "center", padding: 0,
        }} aria-label="Close menu">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <line x1="2" y1="2" x2="14" y2="14" stroke="currentColor" strokeWidth="1.6"/>
            <line x1="14" y1="2" x2="2" y2="14" stroke="currentColor" strokeWidth="1.6"/>
          </svg>
        </button>
      </div>
      <div style={{ display: "grid", gap: 4, borderTop: `1px solid ${AP.rule}` }}>
        {links.map((x, i) => (
          <a key={x.label} href={x.href} onClick={onClose} style={{
            display: "flex", alignItems: "baseline", gap: 14,
            padding: "22px 0", borderBottom: `1px solid ${AP.rule}`,
            color: AP.off, textDecoration: "none",
            fontFamily: AP.display, fontSize: 28, fontWeight: 500, letterSpacing: "-0.02em",
          }}>
            <span style={{ fontFamily: AP.mono, fontSize: 11, color: AP.brass, letterSpacing: "0.14em" }}>
              {String(i + 1).padStart(2, "0")}
            </span>
            <span>{x.label}</span>
          </a>
        ))}
      </div>
      <div style={{ marginTop: "auto", paddingTop: 32,
        fontFamily: AP.mono, fontSize: 11, color: AP.dim, letterSpacing: "0.08em" }}>
        hello@asherprice.co.uk · Blackwood, NP12
      </div>
    </div>
  );
}

export function Footer({ mobile }) {
  return (
    <footer style={{
      background: AP.slate, color: AP.off,
      padding: mobile ? "40px 22px 22px" : "72px 28px 28px",
      borderTop: `1px solid ${AP.rule}`, display: "grid", gap: 40,
    }}>
      <div style={{ display: "grid",
        gridTemplateColumns: mobile ? "1fr" : "1fr 1fr 1fr 1fr",
        gap: mobile ? 28 : 40, alignItems: "start" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <Monogram size={56} />
            <div>
              <div style={{ fontFamily: AP.display, fontWeight: 600, fontSize: 22, letterSpacing: "-0.01em" }}>Asher Price</div>
              <div style={{ fontFamily: AP.mono, fontSize: 10, color: AP.dim, letterSpacing: "0.08em", marginTop: 2 }}>/ solo / est. mmxxiv</div>
            </div>
          </div>
          <p style={{ margin: "20px 0 0", maxWidth: 280, fontSize: 14, lineHeight: 1.55, color: AP.off2 }}>
            Websites, AI assistants and automation for local businesses across the South Wales Valleys.
          </p>
        </div>
        <div>
          <Eyebrow>Navigate</Eyebrow>
          <div style={{ marginTop: 16, display: "grid", gap: 10, fontFamily: AP.mono, fontSize: 13 }}>
            {[
              ["Services", "/#services"],
              ["Showcase", "/showcase"],
              ["Examples", "/examples"],
              ["How it works", "/#how-it-works"],
              ["Founding Local", "/founding-local"],
              ["Why a website?", "/why-a-website.html"],
              ["Get started", "/#contact"],
            ].map(([label, href]) => (
              <a key={label} href={href} style={{ color: AP.off, textDecoration: "none" }}>— {label}</a>
            ))}
          </div>
        </div>
        <div>
          <Eyebrow>Contact</Eyebrow>
          <div style={{ marginTop: 16, display: "grid", gap: 10, fontFamily: AP.mono, fontSize: 13 }}>
            <a href="mailto:hello@asherprice.co.uk" style={{ color: AP.off, textDecoration: "none" }}>hello@asherprice.co.uk</a>
            <a href="https://www.facebook.com/asherprice.uk/" target="_blank" rel="noopener" style={{ color: AP.off, textDecoration: "none" }}>Facebook →</a>
            <div style={{ color: AP.dim }}>Blackwood, NP12<br/>South Wales</div>
          </div>
        </div>
        <div style={{ border: `1px solid ${AP.ruleStr}`, padding: "18px 18px 20px", position: "relative" }}>
          <div style={{ position: "absolute", top: -10, left: 16, background: AP.slate, padding: "0 8px",
            fontFamily: AP.mono, fontSize: 10, letterSpacing: "0.16em", color: AP.brass }}>STATUS</div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 4 }}>
            <span style={{ width: 8, height: 8, background: AP.moss, boxShadow: `0 0 0 3px ${AP.moss}33` }}/>
            <span style={{ fontFamily: AP.mono, fontSize: 12, color: AP.off }}>Accepting work</span>
          </div>
          <p style={{ margin: "12px 0 0", fontSize: 13, lineHeight: 1.5, color: AP.off2 }}>
            Founding Local is open. I usually reply within a day.
          </p>
        </div>
      </div>

      <div style={{
        display: "flex",
        flexDirection: mobile ? "column" : "row",
        justifyContent: "space-between",
        alignItems: mobile ? "flex-start" : "center",
        gap: mobile ? 12 : 0,
        paddingTop: 22, borderTop: `1px solid ${AP.rule}`,
        fontFamily: AP.mono, fontSize: 11, color: AP.dim, letterSpacing: "0.04em",
      }}>
        <span>© 2026 Asher Price · Blackwood, South Wales</span>
        <span style={{ fontFamily: AP.italic, fontStyle: "italic", color: AP.brass, fontSize: 14 }}>
          Gwneud pethau bychain.
        </span>
        <span><a href="/privacy-policy" style={{ color: AP.dim }}>Privacy policy</a></span>
      </div>
    </footer>
  );
}

export function Shell({ active, children }) {
  const mobile = useMobile();
  const [menuOpen, setMenuOpen] = useState(false);
  useBodyStyles();
  return (
    <>
      <Announcement mobile={mobile}/>
      <Nav mobile={mobile} active={active} onMenuOpen={() => setMenuOpen(true)}/>
      {children}
      <Footer mobile={mobile}/>
      {menuOpen && <MobileMenu onClose={() => setMenuOpen(false)}/>}
    </>
  );
}
