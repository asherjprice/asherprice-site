import { useState, useEffect, useRef } from "react";
import Chatbot from "./Chatbot";

/* ── UPDATE THIS NUMBER WHEN PLACES ARE TAKEN ── */
const PLACES_REMAINING = 10;

/* ── palette ── */
const C = {
  red: "#C8102E", redHov: "#E01A38", redFaint: "rgba(200,16,46,0.06)",
  green: "#1B6B3A", greenFaint: "rgba(27,107,58,0.08)",
  bg: "#08090B", bg2: "#0C0D10", card: "#101218", card2: "#14161D",
  border: "#1B1E26", border2: "#252830",
  t1: "#F0EDEA", t2: "#9B9DA4", t3: "#5C5F68",
  amber: "#B8860B", amberFaint: "rgba(184,134,11,0.08)", amberBorder: "rgba(184,134,11,0.25)",
};

/* ── utilities ── */
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
    position: "fixed", inset: 0, pointerEvents: "none", zIndex: 9999, opacity: 0.035,
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
    backgroundRepeat: "repeat",
  }} />;
}

/* ── navbar ── */
function Navbar() {
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
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
      padding: "0 clamp(24px,6vw,72px)", height: 76,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      background: s ? "rgba(8,9,11,0.92)" : "rgba(8,9,11,0.7)",
      backdropFilter: "blur(24px) saturate(1.4)",
      borderBottom: `1px solid ${s ? C.border : "transparent"}`,
      transition: "all 0.5s cubic-bezier(0.16,1,0.3,1)",
    }}>
      <a href="/" style={{ display: "flex", alignItems: "center", gap: 14, textDecoration: "none" }}>
        <div style={{
          width: 36, height: 36, border: `2px solid ${C.red}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "'Playfair Display',Georgia,serif",
          fontSize: 15, fontWeight: 800, color: C.t1, letterSpacing: "1.5px",
        }}>AP</div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: 20, fontWeight: 800, color: C.t1, letterSpacing: "-0.02em" }}>
            Asher Price
          </span>
          <span style={{ width: 1, height: 16, background: C.border2, display: "inline-block" }} />
          <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 9, fontWeight: 600, color: C.t3, letterSpacing: "0.15em", textTransform: "uppercase" }}>AI & Web</span>
        </div>
      </a>
      <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
        {navLinks.map(t => (
          <a key={t.label} href={t.href} className="desktop-nav" style={{
            fontFamily: "'Inter',sans-serif", fontSize: 12, fontWeight: 600,
            color: C.t2, textDecoration: "none", letterSpacing: "0.08em",
            textTransform: "uppercase", transition: "color 0.3s",
          }}
            onMouseEnter={e => e.target.style.color = C.t1}
            onMouseLeave={e => e.target.style.color = C.t2}
          >{t.label}</a>
        ))}
        <a href="#contact" className="desktop-nav" style={{
          padding: "11px 28px", background: C.red, color: "#fff",
          fontFamily: "'Inter',sans-serif", fontSize: 12, fontWeight: 700,
          letterSpacing: "0.08em", textTransform: "uppercase",
          textDecoration: "none", transition: "all 0.3s",
          boxShadow: "0 0 30px rgba(200,16,46,0.15)",
        }}
          onMouseEnter={e => { e.target.style.background = C.redHov; e.target.style.boxShadow = "0 0 40px rgba(200,16,46,0.3)"; }}
          onMouseLeave={e => { e.target.style.background = C.red; e.target.style.boxShadow = "0 0 30px rgba(200,16,46,0.15)"; }}
        >Claim a Place</a>
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
        <a href="#contact" onClick={() => setMenuOpen(false)} style={{
          padding: "14px 36px", background: C.red, color: "#fff",
          fontFamily: "'Inter',sans-serif", fontSize: 14, fontWeight: 700,
          letterSpacing: "0.08em", textTransform: "uppercase",
          textDecoration: "none", marginTop: 8,
          boxShadow: "0 0 30px rgba(200,16,46,0.15)",
        }}>Claim a Place</a>
      </div>
    )}
    </>
  );
}

/* ── FAQ accordion ── */
const FAQS = [
  {
    q: "What if I want to cancel?",
    a: "You can cancel anytime. No lock-in, no exit fees. If you cancel, your site comes down at the end of the paid month. I'll export your content and hand it over if you want to take it elsewhere.",
  },
  {
    q: "Do I own the website?",
    a: "You own all the content — text, images, branding. The hosting and code are part of the service, like renting a shop unit. If you leave, I'll give you everything you need to rebuild elsewhere, or I can hand over the code for a one-off fee.",
  },
  {
    q: "What counts as an 'update'?",
    a: "One update per month means a reasonable change — new menu, updated prices, a new photo gallery, seasonal banner, that sort of thing. Not a full redesign. If you need more than one change a month, I can arrange that separately.",
  },
  {
    q: "What if I need something more complex later?",
    a: "AI assistants, booking systems, loyalty cards, online ordering — all available as paid add-ons. I'll talk you through what makes sense for your business once the website is earning its keep. No pressure to add anything.",
  },
  {
    q: "Why so cheap?",
    a: "I'm building my portfolio. The first 10 clients get honest pricing in exchange for honest feedback and a testimonial. After the 10 are filled, Founding Local closes permanently and standard rates apply.",
  },
  {
    q: "How long does it take?",
    a: "Most sites go live within 1–2 weeks of your first message. You'll see a draft before anything goes public, and I tweak until you're happy with it.",
  },
];

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{
      borderBottom: `1px solid ${C.border}`,
    }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%", padding: "24px 0", background: "none", border: "none",
          cursor: "pointer", display: "flex", justifyContent: "space-between",
          alignItems: "center", gap: 16, textAlign: "left",
        }}
      >
        <span style={{
          fontFamily: "'Inter',sans-serif", fontSize: "clamp(14px,1.6vw,16px)",
          fontWeight: 600, color: C.t1, lineHeight: 1.5,
        }}>{q}</span>
        <span style={{
          fontFamily: "'Inter',sans-serif", fontSize: 20, color: C.t3,
          flexShrink: 0, transition: "transform 0.3s",
          transform: open ? "rotate(45deg)" : "none",
        }}>+</span>
      </button>
      <div style={{
        maxHeight: open ? 300 : 0, overflow: "hidden",
        transition: "max-height 0.4s cubic-bezier(0.16,1,0.3,1)",
      }}>
        <p style={{
          fontFamily: "'Inter',sans-serif", fontSize: 14, color: C.t2,
          lineHeight: 1.8, paddingBottom: 24,
        }}>{a}</p>
      </div>
    </div>
  );
}

/* ── what's included cards ── */
const INCLUDED = [
  { icon: "◇", title: "Custom website", desc: "Designed and built from scratch for your business. Not a template, not a theme — yours." },
  { icon: "▲", title: "Hosting on fast UK servers", desc: "Your site runs on Cloudflare's global network. Fast everywhere, especially locally." },
  { icon: "◎", title: "Your own domain", desc: "yourbusiness.co.uk — registered and configured. Included in the monthly cost." },
  { icon: "↻", title: "One free update every month", desc: "New menu? Updated prices? Seasonal banner? One change per month, on me." },
  { icon: "◈", title: "Uptime monitoring", desc: "I'll know if your site goes down before you do. Automatic alerts, fast fixes." },
  { icon: "☎", title: "Monthly check-in call", desc: "A quick call each month. How's the site working? Anything need changing? Keeping it personal." },
];

/* ── industries (linked to examples where available) ── */
const INDUSTRIES = [
  { label: "Cafés", slug: "cafe" },
  { label: "Barbers", slug: "barber" },
  { label: "Trades", slug: "plumber" },
  { label: "Pubs", slug: "pub" },
  { label: "Salons", slug: "salon" },
  { label: "Takeaways", slug: "pizza" },
];

/* ═══════════════ MAIN PAGE ═══════════════ */
export default function FoundingLocal() {
  return (
    <div style={{ background: C.bg, color: C.t1, minHeight: "100vh", overflowX: "hidden" }}>
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
        @media(max-width:640px){.included-grid{grid-template-columns:1fr !important}}
        @media(max-width:640px){.comparison-grid{grid-template-columns:1fr !important}}
        @media(max-width:640px){.steps-grid{grid-template-columns:1fr !important}}
        @media(max-width:640px){.cta-buttons{flex-direction:column !important;align-items:stretch !important}}
      `}</style>

      <Grain />
      <Navbar />

      {/* ═══ HERO ═══ */}
      <section style={{
        padding: "160px clamp(24px,6vw,72px) 100px",
        textAlign: "center", maxWidth: 720, margin: "0 auto",
      }}>
        <Reveal>
          <Label>Founding Local</Label>
          <h1 style={{
            fontFamily: "'Playfair Display',Georgia,serif",
            fontSize: "clamp(32px,5vw,52px)", fontWeight: 800,
            lineHeight: 1.12, letterSpacing: "-0.02em", marginBottom: 20,
          }}>
            10 places. Honest pricing.<br />
            <span style={{ color: C.red }}>Real results.</span>
          </h1>
          <p style={{
            fontFamily: "'Inter',sans-serif", fontSize: "clamp(15px,1.8vw,17px)",
            color: C.t2, lineHeight: 1.8, maxWidth: 540, margin: "0 auto 28px",
          }}>
            A properly built website, hosted and maintained, for £100 setup and £50/month.
            For the first 10 local businesses in Blackwood and the Valleys.
            I've already built 60+ demo sites and have a live client — this is what I do.
          </p>

          {/* Scarcity badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 10,
            padding: "10px 22px", borderRadius: 40,
            background: C.amberFaint, border: `1px solid ${C.amberBorder}`,
            marginBottom: 36,
          }}>
            <span style={{
              width: 8, height: 8, borderRadius: "50%", background: C.amber,
              boxShadow: `0 0 8px ${C.amber}`,
            }} />
            <span style={{
              fontFamily: "'Inter',sans-serif", fontSize: 13, fontWeight: 600,
              color: C.amber, letterSpacing: "0.02em",
            }}>
              {PLACES_REMAINING} of 10 places remaining
            </span>
          </div>

          {/* CTAs */}
          <div className="cta-buttons" style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <a href="#contact" style={{
              padding: "16px 32px", background: C.red, color: "#fff",
              fontFamily: "'Inter',sans-serif", fontSize: 14, fontWeight: 700,
              letterSpacing: "0.04em", textTransform: "uppercase",
              textDecoration: "none", transition: "all 0.4s",
              boxShadow: "0 4px 30px rgba(200,16,46,0.2)",
            }}
              onMouseEnter={e => { e.target.style.background = C.redHov; e.target.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.target.style.background = C.red; e.target.style.transform = "none"; }}
            >Claim a Place</a>
            <a href="/examples" style={{
              padding: "16px 32px", background: "transparent",
              border: `1px solid ${C.border2}`, color: C.t1,
              fontFamily: "'Inter',sans-serif", fontSize: 14, fontWeight: 700,
              letterSpacing: "0.04em", textTransform: "uppercase",
              textDecoration: "none", transition: "all 0.4s",
            }}
              onMouseEnter={e => { e.target.style.borderColor = C.t2; e.target.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.target.style.borderColor = C.border2; e.target.style.transform = "none"; }}
            >See Examples</a>
          </div>
        </Reveal>
      </section>

      {/* ═══ WHAT'S INCLUDED ═══ */}
      <section style={{ padding: "100px clamp(24px,6vw,72px)", borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <Label>What's Included</Label>
              <h2 style={{
                fontFamily: "'Playfair Display',Georgia,serif",
                fontSize: "clamp(26px,4vw,40px)", fontWeight: 800,
                lineHeight: 1.15, letterSpacing: "-0.02em",
              }}>
                Everything you need.<br />Nothing you don't.
              </h2>
            </div>
          </Reveal>
          <div className="included-grid" style={{
            display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1,
            background: C.border,
          }}>
            {INCLUDED.map((item, i) => (
              <Reveal key={i} delay={0.05 * i}>
                <div style={{
                  background: C.bg, padding: "32px 28px",
                  minHeight: 180, display: "flex", flexDirection: "column",
                }}>
                  <span style={{
                    fontFamily: "'Inter',sans-serif", fontSize: 18, color: C.t3,
                    marginBottom: 14, display: "block",
                  }}>{item.icon}</span>
                  <h3 style={{
                    fontFamily: "'Inter',sans-serif", fontSize: 15, fontWeight: 700,
                    color: C.t1, marginBottom: 8,
                  }}>{item.title}</h3>
                  <p style={{
                    fontFamily: "'Inter',sans-serif", fontSize: 13, color: C.t2,
                    lineHeight: 1.7, flex: 1,
                  }}>{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ WHAT'S NOT INCLUDED ═══ */}
      <section style={{ padding: "100px clamp(24px,6vw,72px)", borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
          <Reveal>
            <Label>Intentionally Simple</Label>
            <h2 style={{
              fontFamily: "'Playfair Display',Georgia,serif",
              fontSize: "clamp(26px,4vw,40px)", fontWeight: 800,
              lineHeight: 1.15, letterSpacing: "-0.02em", marginBottom: 24,
            }}>
              What's not included —<br />
              <span style={{ color: C.t2 }}>and why that's a good thing.</span>
            </h2>
            <p style={{
              fontFamily: "'Inter',sans-serif", fontSize: "clamp(14px,1.6vw,16px)",
              color: C.t2, lineHeight: 1.9, marginBottom: 16,
            }}>
              Founding Local is a website done properly. Nothing more, nothing less.
              AI assistants, booking systems, loyalty cards, online ordering — all available
              as paid add-ons later, once your website is earning its keep.
            </p>
            <p style={{
              fontFamily: "'Inter',sans-serif", fontSize: "clamp(14px,1.6vw,16px)",
              color: C.t1, lineHeight: 1.9, fontWeight: 500,
            }}>
              Keep it simple. Add what you need when you need it.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ═══ COMPARISON ═══ */}
      <section style={{ padding: "100px clamp(24px,6vw,72px)", borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <Label>Pricing</Label>
              <h2 style={{
                fontFamily: "'Playfair Display',Georgia,serif",
                fontSize: "clamp(26px,4vw,40px)", fontWeight: 800,
                lineHeight: 1.15, letterSpacing: "-0.02em",
              }}>
                Founding Local vs. standard rates.
              </h2>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="comparison-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, background: C.border }}>
              {/* Founding Local column */}
              <div style={{ background: C.bg, padding: "36px 28px" }}>
                <div style={{
                  display: "inline-flex", padding: "5px 14px", marginBottom: 20,
                  background: C.amberFaint, border: `1px solid ${C.amberBorder}`,
                  borderRadius: 20,
                }}>
                  <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 10, fontWeight: 700, color: C.amber, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                    First 10 only
                  </span>
                </div>
                <h3 style={{
                  fontFamily: "'Playfair Display',Georgia,serif", fontSize: 22, fontWeight: 800,
                  color: C.t1, marginBottom: 24,
                }}>Founding Local</h3>
                <div style={{ marginBottom: 12 }}>
                  <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 32, fontWeight: 800, color: C.t1 }}>£100</span>
                  <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 14, color: C.t3, marginLeft: 8 }}>setup</span>
                </div>
                <div style={{ marginBottom: 24 }}>
                  <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 32, fontWeight: 800, color: C.t1 }}>£50</span>
                  <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 14, color: C.t3, marginLeft: 8 }}>/month</span>
                </div>
                <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 13, color: C.green, lineHeight: 1.7, fontWeight: 500 }}>
                  Locked in for life. The price never goes up.
                </p>
              </div>
              {/* Standard column */}
              <div style={{ background: C.bg, padding: "36px 28px" }}>
                <div style={{
                  display: "inline-flex", padding: "5px 14px", marginBottom: 20,
                  border: `1px solid ${C.border2}`, borderRadius: 20,
                }}>
                  <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 10, fontWeight: 700, color: C.t3, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                    Everyone after
                  </span>
                </div>
                <h3 style={{
                  fontFamily: "'Playfair Display',Georgia,serif", fontSize: 22, fontWeight: 800,
                  color: C.t2, marginBottom: 24,
                }}>Standard Rates</h3>
                <div style={{ marginBottom: 12 }}>
                  <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 32, fontWeight: 800, color: C.t3 }}>£300+</span>
                  <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 14, color: C.t3, marginLeft: 8 }}>setup</span>
                </div>
                <div style={{ marginBottom: 24 }}>
                  <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 32, fontWeight: 800, color: C.t3 }}>£80+</span>
                  <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 14, color: C.t3, marginLeft: 8 }}>/month</span>
                </div>
                <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 13, color: C.t3, lineHeight: 1.7 }}>
                  Fair pricing, but not this pricing.
                </p>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <p style={{
              fontFamily: "'Inter',sans-serif", fontSize: 13, color: C.t3,
              textAlign: "center", marginTop: 20, lineHeight: 1.7, fontStyle: "italic",
            }}>
              The 10 Founding Local clients keep £50/month for as long as they stay. The price never goes up for them.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ═══ WHO THIS IS FOR ═══ */}
      <section style={{ padding: "100px clamp(24px,6vw,72px)", borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <Reveal>
            <Label>Who It's For</Label>
            <h2 style={{
              fontFamily: "'Playfair Display',Georgia,serif",
              fontSize: "clamp(26px,4vw,40px)", fontWeight: 800,
              lineHeight: 1.15, letterSpacing: "-0.02em", marginBottom: 40,
            }}>
              Built for local businesses<br />like these.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div style={{
              display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 12,
              marginBottom: 36,
            }}>
              {INDUSTRIES.map(ind => (
                <a key={ind.label} href={`/examples/${ind.slug}/index.html`} style={{
                  padding: "10px 22px", border: `1px solid ${C.border2}`,
                  fontFamily: "'Inter',sans-serif", fontSize: 13, fontWeight: 500,
                  color: C.t2, letterSpacing: "0.02em", textDecoration: "none",
                  transition: "all 0.3s",
                }}
                  onMouseEnter={e => { e.target.style.borderColor = C.red; e.target.style.color = C.t1; }}
                  onMouseLeave={e => { e.target.style.borderColor = C.border2; e.target.style.color = C.t2; }}
                >{ind.label}</a>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <a href="/examples" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              fontFamily: "'Inter',sans-serif", fontSize: 12, fontWeight: 700,
              color: C.red, textDecoration: "none", letterSpacing: "0.08em",
              textTransform: "uppercase", transition: "gap 0.3s",
            }}
              onMouseEnter={e => e.currentTarget.style.gap = "12px"}
              onMouseLeave={e => e.currentTarget.style.gap = "8px"}
            >
              See what a finished site looks like <span aria-hidden="true">→</span>
            </a>
          </Reveal>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section style={{ padding: "100px clamp(24px,6vw,72px)", borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <Label>How It Works</Label>
              <h2 style={{
                fontFamily: "'Playfair Display',Georgia,serif",
                fontSize: "clamp(26px,4vw,40px)", fontWeight: 800,
                lineHeight: 1.15, letterSpacing: "-0.02em",
              }}>
                Four steps. No fuss.
              </h2>
            </div>
          </Reveal>
          <div className="steps-grid" style={{
            display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24,
          }}>
            {[
              { n: "01", title: "Drop me a message", desc: "Email me or message me on Facebook. A quick chat about your business — what you do, who you serve, what you need. No jargon, no sales pitch." },
              { n: "02", title: "I design and build", desc: "I'll have a working draft within 1–2 weeks. You'll see it before anyone else does." },
              { n: "03", title: "You review", desc: "I tweak until it's right. Colours, wording, layout — it's your business, it has to feel like yours." },
              { n: "04", title: "Go live", desc: "£100 setup, then £50/month from month two. Your site is live, monitored, and maintained." },
            ].map((step, i) => (
              <Reveal key={i} delay={0.08 * i}>
                <div style={{ padding: "28px 0" }}>
                  <span style={{
                    fontFamily: "'Playfair Display',Georgia,serif", fontSize: 36, fontWeight: 800,
                    color: C.border2, display: "block", marginBottom: 12,
                  }}>{step.n}</span>
                  <h3 style={{
                    fontFamily: "'Inter',sans-serif", fontSize: 16, fontWeight: 700,
                    color: C.t1, marginBottom: 8,
                  }}>{step.title}</h3>
                  <p style={{
                    fontFamily: "'Inter',sans-serif", fontSize: 14, color: C.t2,
                    lineHeight: 1.8,
                  }}>{step.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section style={{ padding: "100px clamp(24px,6vw,72px)", borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <Label>Questions</Label>
              <h2 style={{
                fontFamily: "'Playfair Display',Georgia,serif",
                fontSize: "clamp(26px,4vw,40px)", fontWeight: 800,
                lineHeight: 1.15, letterSpacing: "-0.02em",
              }}>
                Straight answers.
              </h2>
            </div>
          </Reveal>
          <div style={{ borderTop: `1px solid ${C.border}` }}>
            {FAQS.map((faq, i) => (
              <Reveal key={i} delay={0.05 * i}>
                <FaqItem q={faq.q} a={faq.a} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FINAL CTA ═══ */}
      <section id="contact" style={{
        padding: "120px clamp(24px,6vw,72px)",
        borderTop: `1px solid ${C.border}`,
        textAlign: "center",
      }}>
        <Reveal>
          <div style={{ maxWidth: 500, margin: "0 auto" }}>
            {/* Scarcity badge */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              padding: "10px 22px", borderRadius: 40,
              background: C.amberFaint, border: `1px solid ${C.amberBorder}`,
              marginBottom: 28,
            }}>
              <span style={{
                width: 8, height: 8, borderRadius: "50%", background: C.amber,
                boxShadow: `0 0 8px ${C.amber}`,
              }} />
              <span style={{
                fontFamily: "'Inter',sans-serif", fontSize: 13, fontWeight: 600,
                color: C.amber, letterSpacing: "0.02em",
              }}>
                {PLACES_REMAINING} of 10 places remaining
              </span>
            </div>

            <h2 style={{
              fontFamily: "'Playfair Display',Georgia,serif",
              fontSize: "clamp(26px,4vw,40px)", fontWeight: 800,
              lineHeight: 1.15, letterSpacing: "-0.02em", marginBottom: 28,
            }}>
              Ready to claim<br />your place?
            </h2>

            <div className="cta-buttons" style={{
              display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap",
              marginBottom: 24,
            }}>
              <a href="mailto:hello@asherprice.co.uk?subject=Founding%20Local%20%E2%80%94%20interested" style={{
                padding: "16px 32px", background: C.red, color: "#fff",
                fontFamily: "'Inter',sans-serif", fontSize: 14, fontWeight: 700,
                letterSpacing: "0.04em", textTransform: "uppercase",
                textDecoration: "none", transition: "all 0.4s",
                boxShadow: "0 4px 30px rgba(200,16,46,0.2)",
                display: "inline-flex", alignItems: "center", gap: 8,
              }}
                onMouseEnter={e => { e.target.style.background = C.redHov; e.target.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.target.style.background = C.red; e.target.style.transform = "none"; }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}>
                  <rect x="2" y="4" width="20" height="16" rx="2" /><path d="M22 4L12 13 2 4" />
                </svg>
                Email Me
              </a>
              <a href="https://www.facebook.com/asherprice.uk/" target="_blank" rel="noopener" style={{
                padding: "16px 32px", background: "transparent",
                border: `1px solid ${C.border2}`, color: C.t1,
                fontFamily: "'Inter',sans-serif", fontSize: 14, fontWeight: 700,
                letterSpacing: "0.04em", textTransform: "uppercase",
                textDecoration: "none", transition: "all 0.4s",
                display: "inline-flex", alignItems: "center", gap: 8,
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = C.t2; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.border2; e.currentTarget.style.transform = "none"; }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
                  <path d="M13.5 21v-7.5h2.5l.4-3h-2.9V8.6c0-.87.24-1.46 1.49-1.46H17V4.46C16.74 4.42 15.82 4.34 14.75 4.34c-2.23 0-3.75 1.36-3.75 3.86V10.5H8.5v3H11V21h2.5z"/>
                </svg>
                Message on Facebook
              </a>
            </div>

            <p style={{
              fontFamily: "'Inter',sans-serif", fontSize: 13, color: C.t3,
              lineHeight: 1.7,
            }}>
              First come, first served. No pressure, no hard sell —<br />just a quick chat to see if it's a fit.
            </p>
          </div>
        </Reveal>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer style={{
        padding: "48px clamp(24px,6vw,72px)",
        borderTop: `1px solid ${C.border}`,
      }}>
        <div style={{
          maxWidth: 1100, margin: "0 auto",
          display: "flex", justifyContent: "space-between",
          alignItems: "center", flexWrap: "wrap", gap: 20,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{
              width: 22, height: 22, border: `1.5px solid ${C.red}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "'Playfair Display',Georgia,serif",
              fontSize: 9, fontWeight: 800, color: C.t2, letterSpacing: "1px",
              opacity: 0.6,
            }}>AP</div>
            <span style={{
              fontFamily: "'Inter',sans-serif", fontSize: 12,
              color: C.t3, letterSpacing: "0.04em",
            }}>© 2026 Asher Price · Blackwood, South Wales</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <a href="https://www.facebook.com/asherprice.uk/" target="_blank" rel="noopener" style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              fontFamily: "'Inter',sans-serif", fontSize: 12,
              color: C.t3, textDecoration: "none", letterSpacing: "0.04em",
              transition: "color 0.3s",
            }}
              onMouseEnter={e => e.currentTarget.style.color = C.red}
              onMouseLeave={e => e.currentTarget.style.color = C.t3}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M13.5 21v-7.5h2.5l.4-3h-2.9V8.6c0-.87.24-1.46 1.49-1.46H17V4.46C16.74 4.42 15.82 4.34 14.75 4.34c-2.23 0-3.75 1.36-3.75 3.86V10.5H8.5v3H11V21h2.5z"/>
              </svg>
              Facebook
            </a>
            <a href="mailto:hello@asherprice.co.uk" style={{
              fontFamily: "'Inter',sans-serif", fontSize: 12,
              color: C.t3, textDecoration: "none", letterSpacing: "0.04em",
              transition: "color 0.3s",
            }}
              onMouseEnter={e => e.target.style.color = C.red}
              onMouseLeave={e => e.target.style.color = C.t3}
            >hello@asherprice.co.uk</a>
          </div>
        </div>
      </footer>

      <Chatbot />
    </div>
  );
}
