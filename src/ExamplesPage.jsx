import { useState, useEffect, useRef } from "react";
import Chatbot from "./Chatbot";

/* ── palette (matches App.jsx exactly) ── */
const C = {
  red: "#C8102E", redHov: "#E01A38", redFaint: "rgba(200,16,46,0.06)",
  green: "#1B6B3A", greenFaint: "rgba(27,107,58,0.08)",
  bg: "#08090B", bg2: "#0C0D10", card: "#101218", card2: "#14161D",
  border: "#1B1E26", border2: "#252830",
  t1: "#F0EDEA", t2: "#9B9DA4", t3: "#5C5F68",
  slate: "#1E2028",
};

/* ── shared utilities ── */
function useInView(threshold = 0.1) {
  const ref = useRef(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setV(true); obs.disconnect(); } }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, v];
}

const PRERENDER = typeof window !== "undefined" && window.location.search.includes("prerender");
function Reveal({ children, delay = 0, y = 40, style = {} }) {
  const [ref, v] = useInView();
  const visible = v || PRERENDER;
  return <div ref={ref} style={{ ...style, opacity: visible ? 1 : 0, transform: visible ? "none" : `translateY(${y}px)`, transition: `all 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}s` }}>{children}</div>;
}

function Label({ children }) {
  return (
    <div style={{
      fontFamily: "'Inter',sans-serif", fontSize: 11, fontWeight: 700,
      color: C.red, letterSpacing: "0.22em", textTransform: "uppercase",
      marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "center", gap: 14,
    }}>
      <span style={{ width: 32, height: 2, background: C.red, display: "block" }} />
      {children}
    </div>
  );
}

function Grain() {
  return <div style={{
    position: "fixed", inset: 0, pointerEvents: "none", zIndex: 9999,
    opacity: 0.035,
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
    backgroundRepeat: "repeat",
  }} />;
}

/* ── example site data ── */
const EXAMPLES = [
  { slug: "cafe", label: "Café", description: "Interactive coffee configurator — pick your base, size, milk & extras. The site IS the ordering experience.", ready: true },
  { slug: "pizza", label: "Pizza Shop", description: "Build-your-own pizza with animated toppings. Practical, fun, and genuinely useful for ordering.", ready: true },
  { slug: "barber", label: "Barber", description: "Ticket-strip layout with a spinning barber pole that reveals prices. Old-school charm, properly built.", ready: true },
  { slug: "pub", label: "Pub", description: "Beer tap wall — click a handle, watch the pour animation, get tasting notes and price. Built for real ale pubs.", ready: true },
  { slug: "plumber", label: "Plumber", description: "Instant quote calculator with a live countdown timer. Pick the job, set urgency, get a price. Trust on sight.", ready: true },
  { slug: "salon", label: "Nail Salon", description: "Liquid glass morphism with aurora backgrounds — dark luxury aesthetic, kinetic typography, and visible 5-star reviews.", ready: true },
  { slug: "photographer", label: "Photographer", description: "Horizontal film strip you drag through — portfolio as physical film. No vertical scroll at all.", ready: true },
  { slug: "vape", label: "Vape Shop", description: "Neon arcade aesthetic with a slot machine flavour reveal. Bold, memorable, and on-brand.", ready: true },
  { slug: "indian", label: "Indian Restaurant", description: "Spice heat slider filters the menu from mild to inferno. The kind of feature that sells websites.", ready: true },
];

/* ═══════════════ NAVBAR ═══════════════ */
function Navbar({ topOffset = 0 }) {
  const [s, setS] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const h = () => setS(window.scrollY > 60);
    window.addEventListener("scroll", h); return () => window.removeEventListener("scroll", h);
  }, []);
  const navLinks = [
    { label: "Services", href: "/#services" },
    { label: "Showcase", href: "/showcase" },
    { label: "Examples", href: "/examples" },
    { label: "How It Works", href: "/#process" },
  ];
  return (
    <>
    <nav style={{
      position: "fixed", top: topOffset, left: 0, right: 0, zIndex: 200,
      padding: "0 clamp(24px,6vw,72px)", height: 76,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      background: s ? "rgba(8,9,11,0.92)" : "transparent",
      backdropFilter: s ? "blur(24px) saturate(1.4)" : "none",
      borderBottom: s ? `1px solid ${C.border}` : "1px solid transparent",
      transition: "all 0.5s cubic-bezier(0.16,1,0.3,1)",
    }}>
      <a href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{
          width: 36, height: 36, border: `2px solid ${C.red}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "'Playfair Display',Georgia,serif",
          fontSize: 15, fontWeight: 800, color: C.t1, letterSpacing: "1.5px",
        }}>AP</div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{
            fontFamily: "'Playfair Display',Georgia,serif",
            fontSize: 20, fontWeight: 800, color: C.t1,
            letterSpacing: "-0.02em",
          }}>Asher Price</span>
          <span style={{ width: 1, height: 16, background: C.border2, display: "inline-block" }} />
          <span style={{
            fontFamily: "'Inter',sans-serif", fontSize: 9, fontWeight: 600,
            color: C.t3, letterSpacing: "0.15em", textTransform: "uppercase",
          }}>AI & Web</span>
        </div>
      </a>
      <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
        {navLinks.map(t => (
          <a key={t.label} href={t.href} className="desktop-nav" style={{
            fontFamily: "'Inter',sans-serif", fontSize: 12, fontWeight: 600,
            color: t.label === "Examples" ? C.t1 : C.t2,
            textDecoration: "none", letterSpacing: "0.08em",
            textTransform: "uppercase", transition: "color 0.3s",
          }}
            onMouseEnter={e => e.target.style.color = C.t1}
            onMouseLeave={e => e.target.style.color = t.label === "Examples" ? C.t1 : C.t2}
          >{t.label}</a>
        ))}
        <a href="/#contact" className="desktop-nav" style={{
          padding: "11px 28px", background: C.red, color: "#fff",
          fontFamily: "'Inter',sans-serif", fontSize: 12, fontWeight: 700,
          letterSpacing: "0.08em", textTransform: "uppercase",
          textDecoration: "none", transition: "all 0.3s",
          boxShadow: "0 0 30px rgba(200,16,46,0.15)",
        }}
          onMouseEnter={e => { e.target.style.background = C.redHov; e.target.style.boxShadow = "0 0 40px rgba(200,16,46,0.3)"; }}
          onMouseLeave={e => { e.target.style.background = C.red; e.target.style.boxShadow = "0 0 30px rgba(200,16,46,0.15)"; }}
        >Get Started</a>
        <button className="mobile-menu-btn" onClick={() => setMenuOpen(true)} style={{
          display: "none", alignItems: "center", justifyContent: "center",
          background: "none", border: "none", cursor: "pointer", padding: 4,
        }}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <rect y="5" width="28" height="2.5" rx="1.25" fill={C.t2} />
            <rect y="12.75" width="28" height="2.5" rx="1.25" fill={C.t2} />
            <rect y="20.5" width="28" height="2.5" rx="1.25" fill={C.t2} />
          </svg>
        </button>
      </div>
    </nav>
    {menuOpen && (
      <div style={{
        position: "fixed", inset: 0, zIndex: 300,
        background: "rgba(8,9,11,0.98)", backdropFilter: "blur(20px)",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        gap: 32,
      }}>
        <button onClick={() => setMenuOpen(false)} style={{
          position: "absolute", top: 22, right: 28,
          background: "none", border: "none", cursor: "pointer", padding: 4,
        }}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <line x1="4" y1="4" x2="24" y2="24" stroke={C.t2} strokeWidth="2.5" strokeLinecap="round" />
            <line x1="24" y1="4" x2="4" y2="24" stroke={C.t2} strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </button>
        {navLinks.map(t => (
          <a key={t.label} href={t.href} onClick={() => setMenuOpen(false)} style={{
            fontFamily: "'Inter',sans-serif", fontSize: 18, fontWeight: 600,
            color: C.t2, textDecoration: "none", letterSpacing: "0.08em",
            textTransform: "uppercase", transition: "color 0.3s",
          }}>{t.label}</a>
        ))}
        <a href="/#contact" onClick={() => setMenuOpen(false)} style={{
          padding: "14px 36px", background: C.red, color: "#fff",
          fontFamily: "'Inter',sans-serif", fontSize: 14, fontWeight: 700,
          letterSpacing: "0.08em", textTransform: "uppercase",
          textDecoration: "none", marginTop: 8,
          boxShadow: "0 0 30px rgba(200,16,46,0.15)",
        }}>Get Started</a>
      </div>
    )}
    </>
  );
}

/* ═══════════════ EXAMPLE CARD ═══════════════ */
function ExampleCard({ example, index }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Reveal delay={0.08 * index}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: C.card,
          border: `1px solid ${hovered ? C.border2 : C.border}`,
          borderRadius: 0,
          overflow: "hidden",
          transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
          transform: hovered ? "translateY(-4px)" : "none",
          cursor: example.ready ? "pointer" : "default",
        }}
        onClick={() => { if (example.ready) window.location.href = `/examples/${example.slug}/index.html`; }}
      >
        {/* Preview area — live iframe thumbnail */}
        <div style={{
          height: 220,
          background: C.bg2,
          borderBottom: `1px solid ${C.border}`,
          position: "relative", overflow: "hidden",
        }}>
          {example.ready ? (
            <div style={{ width: "100%", height: "100%", position: "relative" }}>
              <iframe
                src={`/examples/${example.slug}/site.html`}
                title={`${example.label} preview`}
                style={{
                  width: "200%", height: "200%",
                  border: "none",
                  transform: "scale(0.5)",
                  transformOrigin: "top left",
                  pointerEvents: "none",
                }}
                loading="lazy"
                tabIndex={-1}
              />
              {/* Click overlay so the card click works */}
              <div style={{ position: "absolute", inset: 0, cursor: "pointer" }} />
            </div>
          ) : (
            <div style={{ textAlign: "center" }}>
              <div style={{
                width: 48, height: 48, border: `2px dashed ${C.border2}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 12px", opacity: 0.4,
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.t3} strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <path d="M21 15l-5-5L5 21" />
                </svg>
              </div>
              <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 11, color: C.t3, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                Coming Soon
              </span>
            </div>
          )}
          {/* Industry badge */}
          <div style={{
            position: "absolute", top: 12, left: 12,
            padding: "5px 12px",
            background: example.ready ? C.red : "rgba(255,255,255,0.04)",
            border: example.ready ? "none" : `1px solid ${C.border2}`,
            fontFamily: "'Inter',sans-serif", fontSize: 10, fontWeight: 700,
            color: example.ready ? "#fff" : C.t3,
            letterSpacing: "0.1em", textTransform: "uppercase",
          }}>
            {example.label}
          </div>
        </div>
        {/* Info */}
        <div style={{ padding: "20px 24px 24px" }}>
          <h3 style={{
            fontFamily: "'Playfair Display',Georgia,serif",
            fontSize: 20, fontWeight: 700, color: C.t1, marginBottom: 6,
          }}>
            {example.label}
          </h3>
          <p style={{
            fontFamily: "'Inter',sans-serif", fontSize: 13, color: C.t2,
            lineHeight: 1.6,
          }}>
            {example.description}
          </p>
          {example.ready && (
            <a href={`/examples/${example.slug}/index.html`} style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              fontFamily: "'Inter',sans-serif", fontSize: 12, fontWeight: 700,
              color: C.red, textDecoration: "none", letterSpacing: "0.08em",
              textTransform: "uppercase", marginTop: 16,
              transition: "gap 0.3s",
            }}
              onMouseEnter={e => e.target.style.gap = "12px"}
              onMouseLeave={e => e.target.style.gap = "8px"}
            >
              View the full site <span aria-hidden="true">→</span>
            </a>
          )}
        </div>
      </div>
    </Reveal>
  );
}

/* ═══════════════ ANNOUNCEMENT BAR ═══════════════ */
const BAR_HEIGHT = 38;

function AnnouncementBar({ onDismiss }) {
  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 300,
      height: BAR_HEIGHT,
      padding: "0 clamp(16px,4vw,48px)",
      background: "rgba(184,134,11,0.12)", borderBottom: "1px solid rgba(184,134,11,0.18)",
      backdropFilter: "blur(12px)",
      display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
    }}>
      <a href="/founding-local" style={{
        fontFamily: "'Inter',sans-serif", fontSize: 12, fontWeight: 600,
        color: "#B8860B", textDecoration: "none", letterSpacing: "0.02em",
        display: "inline-flex", alignItems: "center", gap: 6,
      }}>
        Founding Local: £100 setup + £50/mo — 10 of 10 places remaining
        <span aria-hidden="true" style={{ fontSize: 14 }}>→</span>
      </a>
      <button onClick={onDismiss} style={{
        background: "none", border: "none", cursor: "pointer", padding: 2,
        color: "rgba(184,134,11,0.5)", fontSize: 16, lineHeight: 1,
        position: "absolute", right: "clamp(12px,3vw,36px)", top: "50%", transform: "translateY(-50%)",
      }}>×</button>
    </div>
  );
}

/* ═══════════════ MAIN PAGE ═══════════════ */
export default function ExamplesPage() {
  const [barVisible, setBarVisible] = useState(() => {
    try { return localStorage.getItem("fl-banner-dismissed") !== "1"; } catch { return true; }
  });
  const dismissBar = () => {
    setBarVisible(false);
    try { localStorage.setItem("fl-banner-dismissed", "1"); } catch {}
  };
  return (
    <div style={{ background: C.bg, color: C.t1, minHeight: "100vh", overflowX: "hidden", paddingTop: barVisible ? BAR_HEIGHT : 0 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Playfair+Display:wght@400;600;700;800&display=swap');
        *{margin:0;padding:0;box-sizing:border-box}
        html{scroll-behavior:smooth}
        body{-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}
        ::selection{background:rgba(200,16,46,0.35);color:#fff}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-track{background:${C.bg}}
        ::-webkit-scrollbar-thumb{background:${C.border2};border-radius:2px}
        ::-webkit-scrollbar-thumb:hover{background:${C.red}}
        @media(max-width:640px){.desktop-nav{display:none !important}.mobile-menu-btn{display:flex !important}}
        @media(min-width:641px){.mobile-menu-btn{display:none !important}}
        @media(max-width:640px){.examples-grid{grid-template-columns:1fr !important}}
      `}</style>

      <Grain />
      {barVisible && <AnnouncementBar onDismiss={dismissBar} />}
      <Navbar topOffset={barVisible ? BAR_HEIGHT : 0} />

      {/* ═══ HERO ═══ */}
      <section style={{
        padding: "180px clamp(24px,6vw,72px) 100px",
        textAlign: "center",
        position: "relative",
      }}>
        <Reveal>
          <Label>Examples</Label>
          <h1 style={{
            fontFamily: "'Playfair Display',Georgia,serif",
            fontSize: "clamp(32px,5vw,56px)", fontWeight: 800,
            lineHeight: 1.1, letterSpacing: "-0.02em",
            marginBottom: 20,
          }}>
            Full website demos<br />
            <span style={{ color: C.red }}>for local businesses.</span>
          </h1>
          <p style={{
            fontFamily: "'Inter',sans-serif", fontSize: "clamp(14px,1.6vw,16px)",
            color: C.t2, maxWidth: 560, margin: "0 auto", lineHeight: 1.8,
          }}>
            These are example sites I've built to show what's possible for different kinds of local business.
            They aren't real businesses — they're designed to help you picture your own.
          </p>
        </Reveal>
      </section>

      {/* ═══ EXAMPLES GRID ═══ */}
      <section style={{
        padding: "0 clamp(24px,6vw,72px) 100px",
      }}>
        <div className="examples-grid" style={{
          maxWidth: 1100, margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: 24,
        }}>
          {EXAMPLES.map((ex, i) => <ExampleCard key={ex.slug} example={ex} index={i} />)}
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section style={{
        padding: "120px clamp(24px,6vw,72px)",
        borderTop: `1px solid ${C.border}`,
        textAlign: "center",
      }}>
        <Reveal>
          <div style={{ maxWidth: 600, margin: "0 auto" }}>
            <Label>Your Turn</Label>
            <h2 style={{
              fontFamily: "'Playfair Display',Georgia,serif",
              fontSize: "clamp(28px,4vw,44px)", fontWeight: 800,
              lineHeight: 1.15, letterSpacing: "-0.02em", marginBottom: 16,
            }}>
              Like what you see?
            </h2>
            <p style={{
              fontFamily: "'Inter',sans-serif", fontSize: 15, color: C.t2,
              lineHeight: 1.8, marginBottom: 32,
            }}>
              I'm taking on 10 Founding Local clients at £100 setup + £50/month.
              A complete website with AI tools, built from scratch for your business.
            </p>
            <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
              <a href="/founding-local" style={{
                padding: "18px 36px", background: C.red, color: "#fff",
                fontFamily: "'Inter',sans-serif", fontSize: 14, fontWeight: 700,
                letterSpacing: "0.04em", textTransform: "uppercase",
                textDecoration: "none", transition: "all 0.4s",
                boxShadow: "0 4px 30px rgba(200,16,46,0.2)",
              }}
                onMouseEnter={e => { e.target.style.background = C.redHov; e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 8px 40px rgba(200,16,46,0.3)"; }}
                onMouseLeave={e => { e.target.style.background = C.red; e.target.style.transform = "none"; e.target.style.boxShadow = "0 4px 30px rgba(200,16,46,0.2)"; }}
              >Founding Local — Learn More</a>
              <a href="/#contact" style={{
                padding: "18px 36px", background: "transparent",
                border: `1px solid ${C.red}`, color: C.t1,
                fontFamily: "'Inter',sans-serif", fontSize: 14, fontWeight: 700,
                letterSpacing: "0.04em", textTransform: "uppercase",
                textDecoration: "none", transition: "all 0.4s",
              }}
                onMouseEnter={e => { e.target.style.background = C.red; e.target.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.target.style.background = "transparent"; e.target.style.transform = "none"; }}
              >Book a Free Chat</a>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer style={{
        padding: "40px clamp(24px,6vw,72px)",
        borderTop: `1px solid ${C.border}`,
        textAlign: "center",
      }}>
        <div style={{
          fontFamily: "'Inter',sans-serif", fontSize: 12, color: C.t3,
          display: "flex", alignItems: "center", justifyContent: "center", gap: 24,
          flexWrap: "wrap",
        }}>
          <span>© {new Date().getFullYear()} Asher Price</span>
          <a href="/" style={{ color: C.t3, textDecoration: "none", transition: "color 0.3s" }}
            onMouseEnter={e => e.target.style.color = C.red}
            onMouseLeave={e => e.target.style.color = C.t3}
          >Back to main site</a>
          <a href="/showcase" style={{ color: C.t3, textDecoration: "none", transition: "color 0.3s" }}
            onMouseEnter={e => e.target.style.color = C.red}
            onMouseLeave={e => e.target.style.color = C.t3}
          >Showcase</a>
        </div>
      </footer>

      <Chatbot />
    </div>
  );
}
