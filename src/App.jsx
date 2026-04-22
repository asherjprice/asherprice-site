/* ─────────────────────────────────────────────────────────────────────────
   Asher Price — Workshop Ledger
   Drop-in replacement for src/App.jsx

   React 19 + Vite 8. Pure inline styles. No CSS framework.

   Before running, make sure index.html (or your root HTML) includes the
   Google Fonts link — or add this to main.jsx / index.html <head>:

     <link rel="preconnect" href="https://fonts.googleapis.com">
     <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
     <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..900;1,9..144,300..900&family=Inter+Tight:wght@300;400;500;600;700&family=JetBrains+Mono:wght@300;400;500;600&family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet">
   ───────────────────────────────────────────────────────────────────────── */

import { useState, useEffect } from "react";
import Chatbot from "./Chatbot";

/* ───────── tokens ───────── */
const AP = {
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

/* Responsive hook — mobile breakpoint at 640px */
function useMobile() {
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

/* ───────── primitives ───────── */
function Eyebrow({ children, color = AP.brass, line = true, width = 28 }) {
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

function SectionHeader({ index, welsh, title, right, invert = false, mobile }) {
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

function Btn({ children, variant = "solid", as = "button", href, icon = "→", small, full, onClick, target, rel }) {
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
  if (as === "a") return <a href={href} style={style} onClick={onClick} target={target} rel={rel}><span>{children}</span><span aria-hidden>{icon}</span></a>;
  return <button style={style} onClick={onClick}><span>{children}</span><span aria-hidden>{icon}</span></button>;
}

function Monogram({ size = 44, color = AP.red, fg = AP.off }) {
  return (
    <div style={{
      width: size, height: size, background: color, color: fg,
      display: "grid", placeItems: "center",
      fontFamily: AP.display, fontWeight: 700, letterSpacing: "-0.04em",
      fontSize: size * 0.42,
    }}>AP</div>
  );
}

/* ───────── 01 · Announcement ───────── */
function Announcement({ mobile }) {
  return (
    <div style={{
      height: 38, display: "flex", alignItems: "center",
      padding: mobile ? "0 14px" : "0 28px", gap: mobile ? 10 : 22,
      borderBottom: `1px solid ${AP.rule}`,
      fontFamily: AP.mono, fontSize: mobile ? 10 : 11, color: AP.off, letterSpacing: "0.04em",
      background: AP.slate2, position: "relative", zIndex: 5,
      overflow: "hidden", whiteSpace: "nowrap",
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
    </div>
  );
}

/* ───────── 02 · Nav ───────── */
function Nav({ mobile, onMenuOpen }) {
  const items = [
    { label: "Services",     href: "#services" },
    { label: "Showcase",     href: "/showcase" },
    { label: "Examples",     href: "/examples" },
    { label: "How it works", href: "#how-it-works" },
  ];
  return (
    <nav style={{
      height: mobile ? 64 : 78, display: "flex", alignItems: "center",
      padding: mobile ? "0 16px" : "0 28px",
      borderBottom: `1px solid ${AP.rule}`, position: "sticky", top: 0,
      background: `${AP.slate}ee`, backdropFilter: "blur(8px)", zIndex: 10,
    }}>
      <a href="#top" style={{ display: "flex", alignItems: "center", gap: 14, textDecoration: "none", color: AP.off }}>
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
              color: AP.off, textDecoration: "none", display: "flex", gap: 8, alignItems: "baseline",
            }}>
              <span style={{ color: AP.dim, fontSize: 10 }}>{String(i + 1).padStart(2, "0")}</span>
              <span>{x.label}</span>
            </a>
          ))}
          <a href="#contact" style={{ textDecoration: "none" }}>
            <Btn small>05 · Get started</Btn>
          </a>
        </div>
      )}
    </nav>
  );
}

/* ───────── 03 · Hero + proof strip ───────── */
function Hero({ mobile }) {
  return (
    <section id="top" style={{
      position: "relative", background: AP.slate, color: AP.off,
      borderBottom: `1px solid ${AP.rule}`, overflow: "hidden",
    }}>
      {/* Ruled paper */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: `repeating-linear-gradient(to bottom, transparent 0, transparent 47px, rgba(232,228,219,0.035) 47px, rgba(232,228,219,0.035) 48px)`,
      }}/>
      <div style={{
        position: "relative",
        display: "grid",
        gridTemplateColumns: mobile ? "1fr" : "1.25fr 1fr",
        minHeight: mobile ? 0 : 720,
      }}>
        {/* LEFT */}
        <div style={{
          padding: mobile ? "40px 22px 28px" : "56px 36px 36px",
          borderRight: mobile ? "none" : `1px solid ${AP.rule}`,
          borderBottom: mobile ? `1px solid ${AP.rule}` : "none",
          display: "flex", flexDirection: "column", justifyContent: "space-between",
        }}>
          <div style={{
            display: "flex", justifyContent: "space-between", flexWrap: "wrap",
            gap: mobile ? 8 : 0,
            fontFamily: AP.mono, fontSize: mobile ? 9 : 11, letterSpacing: "0.14em", color: AP.dim,
          }}>
            <span>№ 001 / HERO</span>
            <span>LAT 51.6656° N · LON 3.1905° W</span>
          </div>

          <div style={{
            fontFamily: AP.display, fontWeight: 700,
            fontSize: mobile ? 180 : "clamp(220px, 28vw, 400px)",
            lineHeight: 0.82, letterSpacing: "-0.05em", color: AP.off,
            marginLeft: mobile ? -6 : -14,
            marginTop: 14, marginBottom: mobile ? 24 : 14,
          }}>
            A<span style={{ color: AP.red }}>/</span>P
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: mobile ? "1fr 1fr" : "repeat(4, 1fr)",
            borderTop: `1px solid ${AP.ruleStr}`,
          }}>
            {[
              ["01",   "LIVE CLIENT",  "Site in the wild"],
              ["09",   "DEMOS",        "Full website builds"],
              ["60+",  "MOCKUPS",      "In the drawer"],
              ["£100", "START",        "Founding Local"],
            ].map((x, i, arr) => (
              <div key={i} style={{
                padding: "18px 18px 4px",
                borderRight: mobile
                  ? (i % 2 === 0 ? `1px solid ${AP.ruleStr}` : "none")
                  : (i < arr.length - 1 ? `1px solid ${AP.ruleStr}` : "none"),
                borderBottom: mobile && i < 2 ? `1px solid ${AP.ruleStr}` : "none",
              }}>
                <div style={{
                  fontFamily: AP.display, fontWeight: 600,
                  fontSize: mobile ? 32 : 44,
                  letterSpacing: "-0.03em", lineHeight: 1, color: AP.off,
                }}>{x[0]}</div>
                <div style={{ fontFamily: AP.mono, fontSize: 10, letterSpacing: "0.14em", color: AP.brass, marginTop: 12 }}>{x[1]}</div>
                <div style={{ fontSize: 13, color: AP.dim, marginTop: 4 }}>{x[2]}</div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div style={{
          padding: mobile ? "36px 22px 40px" : "56px 40px 40px",
          display: "flex", flexDirection: "column",
          gap: mobile ? 20 : 22, justifyContent: "center",
        }}>
          <Eyebrow>Blackwood, South Wales</Eyebrow>

          <h1 style={{
            margin: 0, fontFamily: AP.display, fontWeight: 500,
            fontSize: mobile ? 44 : "clamp(48px, 5.2vw, 84px)",
            lineHeight: 0.95, letterSpacing: "-0.035em",
            textWrap: "balance", color: AP.off,
          }}>
            Websites and{" "}
            <span style={{ fontFamily: AP.italic, fontStyle: "italic", fontWeight: 400, color: AP.red }}>
              quiet little robots
            </span>{" "}
            for businesses in the Valleys.
          </h1>

          <p style={{ margin: 0, maxWidth: 520, fontSize: 17, lineHeight: 1.55, color: AP.off2, textWrap: "pretty" }}>
            AI-powered websites, assistants, and automation for businesses across South Wales.
            Professional results, personal service, honest advice.
          </p>

          <div style={{
            border: `1px solid ${AP.ruleStr}`, background: "rgba(0,0,0,0.3)",
            fontFamily: AP.mono, fontSize: 13, lineHeight: 1.65, padding: "14px 18px", marginTop: 4,
          }}>
            <div style={{ color: AP.dim, fontSize: 10, letterSpacing: "0.14em", marginBottom: 8 }}>
              ~/asherprice/status.md
            </div>
            <div><span style={{ color: AP.brass }}>accepting</span>: <span style={{ color: AP.off }}>new briefs · Founding Local</span></div>
            <div><span style={{ color: AP.brass }}>current</span>: <span style={{ color: AP.off }}>The Westgate Bar, Blackwood</span></div>
            <div><span style={{ color: AP.brass }}>reply_time</span>: <span style={{ color: AP.off }}>within 24 hours, usually same day</span></div>
            <div style={{ marginTop: 8, color: AP.moss }}>
              → places remaining: <span style={{ color: AP.off }}>10 of 10</span>{" "}
              <span className="ap-blink" style={{ color: AP.red }}>▍</span>
            </div>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: mobile ? "1fr" : "1.2fr 1fr 1fr",
            gap: 10, marginTop: 6,
          }}>
            <Btn as="a" href="#founding">From £100 — See the Deal</Btn>
            <Btn variant="ghost" as="a" href="#examples">See example sites</Btn>
            <Btn variant="ghost" as="a" href="#contact">Book a free chat</Btn>
          </div>
        </div>
      </div>

      <style>{`
        .ap-blink { animation: apblink 1s steps(2) infinite }
        @keyframes apblink { 50% { opacity: 0 } }
      `}</style>
    </section>
  );
}

/* ───────── 05 · Services ───────── */
const SERVICES_DATA = [
  { n: "01", title: "Websites",        welsh: "Gwefannau",    body: "Bespoke, mobile-first, built to convert. No templates.",                                      stat: ["5–14", "days typical"], link: { href: "/why-a-website.html", label: "Why a business needs one" } },
  { n: "02", title: "AI Assistants",   welsh: "Cynorthwywyr", body: "Trained on your business. Answer enquiries and capture leads 24/7.",                         stat: ["24 / 7", "on the clock"]   },
  { n: "03", title: "Online Ordering", welsh: "Archebu",      body: "Customers order from your site. No Deliveroo commission.",                                    stat: ["0 %",    "commission"]       },
  { n: "04", title: "Booking Systems", welsh: "Bwcio",        body: "Pick a service, pick a time, done. Works for any appointment business.",                      stat: ["SMS",    "reminders in"]    },
  { n: "05", title: "Loyalty Cards",   welsh: "Teyrngarwch",  body: "Digital stamp cards from your website. No app download needed.",                              stat: ["NO APP", "needed"]           },
  { n: "06", title: "Automation",      welsh: "Awtomeiddio",  body: "Invoicing, follow-ups, lead capture — if you do it twice, I automate it.",                    stat: ["÷ 2",    "repeat tasks"]     },
];

function ServiceIcon({ kind }) {
  const s = { width: 30, height: 30, stroke: "currentColor", strokeWidth: 1.4, fill: "none", strokeLinecap: "square" };
  switch (kind) {
    case 0: return <svg viewBox="0 0 30 30" style={s}><rect x="3" y="5" width="24" height="20"/><line x1="3" y1="10" x2="27" y2="10"/><line x1="6" y1="7.5" x2="8" y2="7.5"/></svg>;
    case 1: return <svg viewBox="0 0 30 30" style={s}><circle cx="15" cy="14" r="10"/><path d="M10 13c1.5-2 3.5-2 5 0s3.5 2 5 0"/><path d="M8 26l3-4"/></svg>;
    case 2: return <svg viewBox="0 0 30 30" style={s}><path d="M4 9h22l-2 13H6z"/><path d="M10 5v4M20 5v4"/><circle cx="12" cy="16" r="0.9" fill="currentColor"/><circle cx="18" cy="16" r="0.9" fill="currentColor"/></svg>;
    case 3: return <svg viewBox="0 0 30 30" style={s}><rect x="4" y="6" width="22" height="19"/><line x1="4" y1="12" x2="26" y2="12"/><rect x="8" y="16" width="4" height="4"/><line x1="15" y1="17" x2="22" y2="17"/><line x1="15" y1="20" x2="22" y2="20"/></svg>;
    case 4: return <svg viewBox="0 0 30 30" style={s}><rect x="5" y="7" width="20" height="16"/><path d="M9 11h12M9 15h12M9 19h8"/></svg>;
    case 5: return <svg viewBox="0 0 30 30" style={s}><circle cx="15" cy="15" r="10"/><path d="M15 9v6l4 2"/></svg>;
    default: return null;
  }
}

function ServiceRow({ item, i, open, onToggle, mobile }) {
  return (
    <div onClick={onToggle} style={{
      position: "relative", cursor: "pointer",
      borderBottom: `1px solid ${AP.ruleStr}`,
      background: open ? "rgba(163,19,42,0.06)" : "transparent",
      transition: "background 160ms ease",
    }}>
      {open && <span style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 4, background: AP.red }}/>}
      <div style={{
        display: "grid",
        gridTemplateColumns: mobile ? "1fr" : "72px 1.2fr 2fr 170px 48px",
        alignItems: "center", gap: mobile ? 8 : 0,
        padding: mobile ? "22px 22px" : "24px 36px",
        position: "relative",
      }}>
        <div style={{ fontFamily: AP.mono, fontSize: mobile ? 11 : 13, letterSpacing: "0.12em", color: AP.dim }}>{item.n}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 14, color: AP.off }}>
          <ServiceIcon kind={i}/>
          <div style={{ fontFamily: AP.display, fontSize: mobile ? 24 : 28, fontWeight: 600, letterSpacing: "-0.02em" }}>{item.title}</div>
        </div>
        <div style={{ fontSize: mobile ? 14 : 15, lineHeight: 1.55, color: AP.off2, maxWidth: mobile ? "none" : 520, textWrap: "pretty" }}>{item.body}</div>
        <div style={{
          justifySelf: mobile ? "start" : "end",
          fontFamily: AP.italic, fontStyle: "italic", fontSize: 18, color: AP.brass,
        }}>{item.welsh}</div>
        <div style={{
          position: mobile ? "absolute" : "static",
          top: mobile ? 22 : "auto", right: mobile ? 22 : "auto",
          justifySelf: mobile ? "auto" : "end",
          fontFamily: AP.mono, fontSize: 16, color: open ? AP.red : AP.dim,
        }}>{open ? "–" : "+"}</div>
      </div>

      {open && (
        <div style={{
          padding: mobile ? "0 22px 22px" : "0 36px 28px 108px",
          display: "grid",
          gridTemplateColumns: mobile ? "1fr" : "1fr 1fr 1fr",
          gap: mobile ? 16 : 24,
          borderTop: `1px dashed ${AP.rule}`, marginTop: -2, paddingTop: 22,
        }}>
          <div>
            <Eyebrow width={18}>Includes</Eyebrow>
            <ul style={{ margin: "12px 0 0", padding: 0, listStyle: "none", display: "grid", gap: 8, fontSize: 14, color: AP.off2 }}>
              <li>— Full custom design + build</li>
              <li>— Hosting, domain, analytics</li>
              <li>— One round of revisions</li>
            </ul>
          </div>
          <div>
            <Eyebrow width={18}>Stat</Eyebrow>
            <div style={{ marginTop: 10 }}>
              <div style={{ fontFamily: AP.display, fontWeight: 600, fontSize: 42, letterSpacing: "-0.025em", color: AP.off }}>{item.stat[0]}</div>
              <div style={{ fontFamily: AP.mono, fontSize: 11, color: AP.dim, letterSpacing: "0.08em", marginTop: 4 }}>{item.stat[1]}</div>
            </div>
          </div>
          <div style={{ alignSelf: "end", display: "grid", gap: 10 }}>
            <Btn variant="ghost" small as="a" href="#showcase">See a live demo</Btn>
            {item.link && (
              <a href={item.link.href} style={{
                fontFamily: AP.mono, fontSize: 11, color: AP.brass, letterSpacing: "0.04em",
                textDecoration: "none",
              }}>→ {item.link.label}</a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Services({ mobile }) {
  const [open, setOpen] = useState(0);
  return (
    <section id="services" style={{ background: AP.slate, color: AP.off, padding: mobile ? "64px 0 0" : "96px 0 0" }}>
      <div style={{ padding: mobile ? "0 22px" : "0 36px" }}>
        <SectionHeader
          mobile={mobile}
          index="02 · SERVICES"
          welsh="Gwasanaethau"
          title="Six things. One pair of hands."
          right={<>Scope scales with the bill.<br/>Pick one, or pick all six.</>}
        />
      </div>
      <div style={{ marginTop: 24, borderTop: `1px solid ${AP.ruleStr}` }}>
        {SERVICES_DATA.map((item, i) => (
          <ServiceRow key={i} item={item} i={i} open={open === i} mobile={mobile}
            onToggle={() => setOpen(open === i ? -1 : i)} />
        ))}
      </div>
      <div style={{
        padding: mobile ? "14px 22px" : "20px 36px",
        background: AP.slate2,
        display: "flex",
        flexDirection: mobile ? "column" : "row",
        justifyContent: "space-between",
        alignItems: mobile ? "flex-start" : "center",
        gap: mobile ? 4 : 0,
        fontFamily: AP.mono, fontSize: 11, letterSpacing: "0.14em", color: AP.off2,
      }}>
        <span>Every project quoted per brief — no off-the-shelf packages.</span>
        <span style={{ color: AP.brass }}>start the conversation →</span>
      </div>
    </section>
  );
}

/* ───────── 06 · Process ───────── */
const PROCESS_STEPS = [
  { n: "01", welsh: "Sgwrs",   title: "Chat",   body: "Free, no-pressure conversation about your business.",          tag: "usually 20 min" },
  { n: "02", welsh: "Adeilad", title: "Build",  body: "I design and build. You see progress throughout.",              tag: "5–14 days"       },
  { n: "03", welsh: "Lansio",  title: "Launch", body: "I handle DNS, hosting — everything. You watch it go live.",     tag: "same-day cutover" },
  { n: "04", welsh: "Tyfu",    title: "Grow",   body: "Ongoing support, updates, and improvements.",                   tag: "monthly, month-to-month" },
];

function Process({ mobile }) {
  return (
    <section id="how-it-works" style={{ background: AP.off, color: AP.slate, padding: mobile ? "64px 22px" : "96px 36px" }}>
      <SectionHeader
        mobile={mobile} invert
        index="03 · HOW IT WORKS"
        welsh="Sut mae'n gweithio"
        title={<span style={{ fontSize: mobile ? 32 : undefined }}>Four steps. No big reveal at&nbsp;the&nbsp;end.</span>}
        right={<>From first chat to live site:<br/>usually 2–3 weeks.</>}
      />
      <div style={{
        marginTop: 40, position: "relative",
        display: "grid", gridTemplateColumns: mobile ? "1fr" : "repeat(4, 1fr)",
        borderTop: `1px solid ${AP.slate}`,
      }}>
        {!mobile && (
          <div style={{
            position: "absolute", top: 48, left: "12.5%", right: "12.5%", height: 1,
            borderTop: `1px dashed ${AP.slate}`, opacity: 0.5,
          }}/>
        )}
        {PROCESS_STEPS.map((s, i) => (
          <div key={i} style={{
            padding: mobile ? "22px 0" : "28px 24px 32px",
            borderRight: !mobile && i < 3 ? `1px solid rgba(21,23,27,0.2)` : "none",
            borderBottom: mobile && i < 3 ? `1px solid rgba(21,23,27,0.2)` : "none",
            position: "relative",
          }}>
            <div style={{
              width: 36, height: 36, background: AP.slate, color: AP.off,
              display: "grid", placeItems: "center",
              fontFamily: AP.mono, fontSize: 12, letterSpacing: "0.04em",
              position: "relative", zIndex: 2,
            }}>{s.n}</div>
            <div style={{ marginTop: 20, fontFamily: AP.italic, fontStyle: "italic", fontSize: 14, color: AP.redDeep }}>{s.welsh}</div>
            <h3 style={{ margin: "6px 0 0", fontFamily: AP.display, fontSize: 40, fontWeight: 600, letterSpacing: "-0.025em", lineHeight: 1 }}>{s.title}</h3>
            <p style={{ margin: "14px 0 18px", fontSize: 15, lineHeight: 1.55, color: "#3b3e3a", maxWidth: 260 }}>{s.body}</p>
            <div style={{ borderTop: `1px solid rgba(21,23,27,0.15)`, paddingTop: 10, fontFamily: AP.mono, fontSize: 11, letterSpacing: "0.08em", color: "#3b3e3a" }}>→ {s.tag}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ───────── 07 · Why ───────── */
const WHY_DATA = [
  { n: "01", welsh: "Un person",           title: "One person, not a department.",       body: "You deal with me from first chat to finished site and every update after. No handoffs, no account managers, no repeating yourself to someone new.", wide: true  },
  { n: "02", welsh: "Wedi ei wneud yma",   title: "Built in Blackwood, not outsourced.", body: "I'm based in the Valleys. If you need me, I'm a text or a short drive away — not a support ticket in a queue.",                                     wide: false },
  { n: "03", welsh: "Cyflym a gonest",     title: "Fast turnaround, honest timelines.",  body: "Most sites go live within 1–2 weeks. If something needs fixing, it's done same day or next — not buried in a backlog.",                              wide: false },
  { n: "04", welsh: "Dim cloi",            title: "No lock-in, no surprises.",           body: "Month-to-month. Fixed pricing agreed upfront. 1 month's notice to cancel. I keep clients by doing good work, not with contracts.",                   wide: true  },
];

function Why({ mobile }) {
  return (
    <section id="why" style={{ background: AP.slate, color: AP.off, padding: mobile ? "64px 22px" : "96px 36px" }}>
      <SectionHeader
        mobile={mobile}
        index="04 · WHY WORK WITH ME"
        welsh="Pam fi?"
        title={<>The actual difference.<br/>Not the sales-deck version.</>}
        right={<>Four reasons I'd pick<br/>a solo designer myself.</>}
      />
      <div style={{
        marginTop: 40,
        display: "grid",
        gridTemplateColumns: mobile ? "1fr" : "2fr 1fr 1fr 2fr",
        gap: 16,
      }}>
        {WHY_DATA.map((item, i) => (
          <div key={i} style={{
            border: `1px solid ${AP.ruleStr}`, padding: "28px 28px 26px",
            display: "flex", flexDirection: "column", gap: 12, position: "relative",
            background: AP.slate2, minHeight: 280,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline",
              fontFamily: AP.mono, fontSize: 11, letterSpacing: "0.16em", color: AP.brass }}>
              <span>/ {item.n}</span>
              <span style={{ fontFamily: AP.italic, fontStyle: "italic", fontSize: 15, letterSpacing: 0 }}>{item.welsh}</span>
            </div>
            <h3 style={{ margin: "6px 0 0", fontFamily: AP.display, fontWeight: 500,
              fontSize: item.wide ? 36 : 28, lineHeight: 1.02, letterSpacing: "-0.025em",
              color: AP.off, textWrap: "balance" }}>{item.title}</h3>
            <p style={{ margin: 0, fontSize: 15, lineHeight: 1.55, color: AP.off2, textWrap: "pretty" }}>{item.body}</p>
          </div>
        ))}
      </div>

      <blockquote style={{
        margin: "48px 0 0", padding: "36px 0 0",
        borderTop: `1px solid ${AP.ruleStr}`,
        display: "grid",
        gridTemplateColumns: mobile ? "1fr" : "160px 1fr 200px",
        gap: mobile ? 16 : 32, alignItems: "start",
      }}>
        <Eyebrow>Working principle</Eyebrow>
        <p style={{
          margin: 0, fontFamily: AP.italic, fontStyle: "italic", fontWeight: 400,
          fontSize: mobile ? 22 : 36, lineHeight: 1.2, letterSpacing: "-0.01em",
          color: AP.off, textWrap: "balance",
        }}>
          "I'd rather <span style={{ color: AP.red }}>under-promise and over-deliver</span> than sell you a package you don't need."
        </p>
        <div style={{
          fontFamily: AP.mono, fontSize: 11, color: AP.dim, letterSpacing: "0.14em",
          textAlign: mobile ? "left" : "right", paddingTop: mobile ? 0 : 10,
        }}>— Asher P.<br/>Blackwood, 2026</div>
      </blockquote>
    </section>
  );
}

/* ───────── 08 · Examples ───────── */
const EXAMPLES_DATA = [
  { slug: "vape",    tag: "VAPE SHOP",         welsh: "Siop Anwedd",     title: "Flavour Vapour",    meta: "Neon UI · flavour picker · stock" },
  { slug: "indian",  tag: "INDIAN RESTAURANT", welsh: "Bwyty Indiaidd",  title: "Jaipur House",      meta: "Spice slider · menu · takeaway" },
  { slug: "pizza",   tag: "PIZZA",             welsh: "Pitsa",           title: "Papa Nello's",      meta: "Build-your-own · delivery · SMS" },
  { slug: "salon",   tag: "NAIL SALON",        welsh: "Ewinedd",         title: "Lux Nails",         meta: "Booking · reviews · loyalty" },
  { slug: "plumber", tag: "PLUMBER",           welsh: "Plymwr",          title: "Emrys Plumbing",    meta: "Live quote · AI triage · 24h" },
  { slug: "barber",  tag: "BARBER",            welsh: "Barbwr",          title: "Dai's Chair",       meta: "Ticket-strip booking · gallery" },
];

function MiniSite({ ex }) {
  return (
    <div style={{ width: "100%", aspectRatio: "4 / 3", background: AP.slate3,
      position: "relative", overflow: "hidden", borderBottom: `1px solid ${AP.ruleStr}` }}>
      <div style={{ height: 22, background: "rgba(0,0,0,0.35)", display: "flex", alignItems: "center",
        gap: 5, padding: "0 10px", borderBottom: `1px solid rgba(255,255,255,0.06)`,
        position: "absolute", top: 0, left: 0, right: 0, zIndex: 2 }}>
        <span style={{ width: 7, height: 7, background: "#ff5f57", borderRadius: 10 }}/>
        <span style={{ width: 7, height: 7, background: "#febc2e", borderRadius: 10 }}/>
        <span style={{ width: 7, height: 7, background: "#28c840", borderRadius: 10 }}/>
        <span style={{ marginLeft: 10, fontFamily: AP.mono, fontSize: 9, color: "rgba(232,228,219,0.6)" }}>
          {`asherprice.co.uk/examples/${ex.slug}`}
        </span>
      </div>
      <img src={`/examples-screenshots/${ex.slug}.jpg`} alt={`${ex.title} demo site`}
        loading="lazy" style={{
          width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center",
          display: "block",
        }}/>
    </div>
  );
}

function Examples({ mobile }) {
  return (
    <section id="examples" style={{ background: AP.slate, color: AP.off, padding: mobile ? "64px 22px" : "96px 36px" }}>
      <SectionHeader
        mobile={mobile}
        index="05 · EXAMPLES"
        welsh="Enghreifftiau"
        title={<>Not templates. <span style={{ fontFamily: AP.italic, fontStyle: "italic", color: AP.red, fontWeight: 400 }}>Real</span> websites.</>}
        right={<>Every site is designed and built bespoke.<br/>Click through and use them yourself.</>}
      />
      <div style={{ marginTop: 40, display: "grid",
        gridTemplateColumns: mobile ? "1fr" : "repeat(3, 1fr)", gap: 16 }}>
        {EXAMPLES_DATA.map((ex, i) => (
          <a key={i} href={`/examples/${ex.slug}/index.html`} style={{ display: "block", textDecoration: "none", color: "inherit",
            border: `1px solid ${AP.ruleStr}`, background: AP.slate2 }}>
            <MiniSite ex={ex}/>
            <div style={{ padding: "18px 20px", display: "grid", gap: 6 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline",
                fontFamily: AP.mono, fontSize: 10, letterSpacing: "0.16em", color: AP.brass }}>
                <span>№ {String(i + 1).padStart(2, "0")} · {ex.tag}</span>
                <span style={{ fontFamily: AP.italic, fontStyle: "italic", fontSize: 14, letterSpacing: 0 }}>{ex.welsh}</span>
              </div>
              <div style={{ fontFamily: AP.display, fontSize: 22, fontWeight: 600, letterSpacing: "-0.02em", color: AP.off }}>{ex.title}</div>
              <div style={{ fontFamily: AP.mono, fontSize: 11, color: AP.dim, letterSpacing: "0.04em" }}>→ {ex.meta}</div>
            </div>
          </a>
        ))}
      </div>
      <div style={{ marginTop: 32, display: "flex", justifyContent: "space-between", alignItems: "center",
        paddingTop: 20, borderTop: `1px solid ${AP.ruleStr}` }}>
        <div style={{ fontFamily: AP.mono, fontSize: 11, letterSpacing: "0.14em", color: AP.dim }}>Showing 6 of 9</div>
        <Btn variant="ghost" small as="a" href="/examples">See all 9 examples</Btn>
      </div>
    </section>
  );
}

/* ───────── 09 · Showcase interactive demos ───────── */
function ShowcaseChat() {
  const [i, setI] = useState(0);
  const convo = [
    { role: "user", text: "Are you open Sunday?" },
    { role: "bot",  text: "We're open 10am–6pm Sunday. Kitchen stops at 5.",  meta: "trained on your hours" },
    { role: "user", text: "Can I book a table for 6?" },
    { role: "bot",  text: "Course — what time works? Sundays fill after 1pm.", meta: "hand-off to booking" },
  ];
  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % (convo.length + 2)), 1500);
    return () => clearInterval(t);
  }, []);
  return (
    <div style={{ padding: "16px 18px", display: "grid", gap: 10, minHeight: 240 }}>
      {convo.slice(0, i).map((m, j) => (
        <div key={j} style={{
          justifySelf: m.role === "user" ? "end" : "start", maxWidth: "80%",
          padding: "10px 12px", fontSize: 13, lineHeight: 1.4,
          background: m.role === "user" ? AP.slate3 : "rgba(163,19,42,0.18)",
          color: AP.off,
          borderLeft: m.role === "bot" ? `2px solid ${AP.red}` : `2px solid ${AP.brass}`,
        }}>
          {m.text}
          {m.meta && <div style={{ marginTop: 4, fontFamily: AP.mono, fontSize: 9, color: AP.dim, letterSpacing: "0.08em" }}>↳ {m.meta}</div>}
        </div>
      ))}
      {i <= convo.length && <div style={{ fontFamily: AP.mono, fontSize: 11, color: AP.dim }}><span className="ap-blink" style={{ color: AP.red }}>▍</span> typing…</div>}
    </div>
  );
}

function ShowcaseOrder() {
  const [qty, setQty] = useState({ a: 1, b: 0, c: 2 });
  const items = [
    { k: "a", name: "Margherita",       price: 9.5  },
    { k: "b", name: "Valleys Pepperoni", price: 11.0 },
    { k: "c", name: "Garlic Bread",      price: 4.5  },
  ];
  const total = items.reduce((s, it) => s + qty[it.k] * it.price, 0);
  return (
    <div style={{ padding: "12px 16px", display: "grid", gap: 8 }}>
      {items.map((it) => (
        <div key={it.k} style={{
          display: "grid", gridTemplateColumns: "1fr 60px 90px", alignItems: "center", gap: 10,
          paddingBottom: 8, borderBottom: `1px dashed ${AP.rule}`,
        }}>
          <div>
            <div style={{ fontFamily: AP.display, fontSize: 14, fontWeight: 500 }}>{it.name}</div>
            <div style={{ fontFamily: AP.mono, fontSize: 10, color: AP.dim, marginTop: 2 }}>£{it.price.toFixed(2)}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "center", fontFamily: AP.mono, fontSize: 13 }}>
            <button onClick={() => setQty((q) => ({ ...q, [it.k]: Math.max(0, q[it.k] - 1) }))} style={{
              width: 22, height: 22, background: "transparent", color: AP.off, border: `1px solid ${AP.ruleStr}`, cursor: "pointer",
            }}>–</button>
            <span style={{ width: 18, textAlign: "center" }}>{qty[it.k]}</span>
            <button onClick={() => setQty((q) => ({ ...q, [it.k]: q[it.k] + 1 }))} style={{
              width: 22, height: 22, background: AP.red, color: AP.off, border: "none", cursor: "pointer",
            }}>+</button>
          </div>
          <div style={{ textAlign: "right", fontFamily: AP.mono, fontSize: 13, color: AP.off }}>£{(qty[it.k] * it.price).toFixed(2)}</div>
        </div>
      ))}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 6, fontFamily: AP.mono, fontSize: 13, color: AP.off }}>
        <span style={{ color: AP.dim, letterSpacing: "0.12em" }}>TOTAL</span>
        <span style={{ fontFamily: AP.display, fontSize: 22, fontWeight: 600, letterSpacing: "-0.02em" }}>£{total.toFixed(2)}</span>
      </div>
      <button style={{
        padding: 10, background: AP.red, color: AP.off, border: "none",
        fontFamily: AP.mono, fontSize: 11, letterSpacing: "0.14em", cursor: "pointer",
        textAlign: "left", display: "flex", justifyContent: "space-between",
      }}><span>CHECKOUT</span><span>→</span></button>
    </div>
  );
}

function ShowcaseBooking() {
  const [slot, setSlot] = useState(2);
  const slots = ["09:00", "09:30", "10:00", "10:30", "11:00", "—", "13:00", "13:30", "14:00", "—", "15:30", "16:00"];
  return (
    <div style={{ padding: "14px 16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
        <div style={{ fontFamily: AP.display, fontSize: 14, fontWeight: 500 }}>Skin fade · 30 min · £18</div>
        <div style={{ fontFamily: AP.mono, fontSize: 10, color: AP.dim, letterSpacing: "0.14em" }}>TUE · 23 APR</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
        {slots.map((s, i) => (
          <button key={i} disabled={s === "—"} onClick={() => setSlot(i)} style={{
            padding: "8px 6px", border: `1px solid ${s === "—" ? "transparent" : AP.ruleStr}`,
            background: slot === i ? AP.red : (s === "—" ? "transparent" : AP.slate3),
            color: s === "—" ? AP.dim : AP.off,
            fontFamily: AP.mono, fontSize: 12, cursor: s === "—" ? "default" : "pointer",
            textDecoration: s === "—" ? "line-through" : "none",
          }}>{s}</button>
        ))}
      </div>
      <div style={{ marginTop: 12, padding: "10px 12px", background: AP.slate3, fontFamily: AP.mono, fontSize: 12,
        display: "flex", justifyContent: "space-between" }}>
        <span style={{ color: AP.brass }}>→ confirming {slots[slot]}</span>
        <span>£18 · SMS reminder</span>
      </div>
    </div>
  );
}

function ShowcaseLoyalty() {
  const [n, setN] = useState(5);
  const total = 8;
  return (
    <div style={{ padding: "14px 16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
        <div style={{ fontFamily: AP.display, fontSize: 14, fontWeight: 500 }}>Cwm Coffee Co.</div>
        <div style={{ fontFamily: AP.mono, fontSize: 10, color: AP.dim, letterSpacing: "0.14em" }}>CARD № 0042</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} style={{
            aspectRatio: "1", display: "grid", placeItems: "center",
            border: `1px solid ${AP.ruleStr}`,
            background: i < n ? AP.red : "transparent",
            color: AP.off, fontFamily: AP.display, fontSize: 18, fontWeight: 600,
          }}>{i < n ? "✕" : ""}</div>
        ))}
      </div>
      <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: AP.mono, fontSize: 12, color: AP.off }}>
        <span><span style={{ color: AP.dim }}>progress · </span>{n} / {total}</span>
        <button onClick={() => setN((x) => (x + 1) % (total + 1))} style={{
          padding: "6px 10px", background: "transparent", color: AP.off,
          border: `1px solid ${AP.ruleStr}`, fontFamily: AP.mono, fontSize: 11, cursor: "pointer",
          letterSpacing: "0.1em",
        }}>+ STAMP</button>
      </div>
      <div style={{ marginTop: 8, fontFamily: AP.mono, fontSize: 10, color: AP.brass, letterSpacing: "0.12em" }}>→ free flat white at 8</div>
    </div>
  );
}

const SHOWCASE_DATA = [
  { n: "01", tag: "AI ASSISTANT",    welsh: "Sgwrsio",  title: "Live Chat",       sub: "Trained on your business. Answers 24/7.",     Demo: ShowcaseChat },
  { n: "02", tag: "ONLINE ORDERING", welsh: "Archebu",  title: "Takeaway Orders", sub: "Customers order from their phone.",           Demo: ShowcaseOrder },
  { n: "03", tag: "BOOKING SYSTEM",  welsh: "Bwcio",    title: "Appointments",    sub: "Pick service, pick time, done.",              Demo: ShowcaseBooking },
  { n: "04", tag: "LOYALTY CARD",    welsh: "Stampiau", title: "Digital Stamps",  sub: "Replace paper cards. Keep them coming back.", Demo: ShowcaseLoyalty },
];

function Showcase({ mobile }) {
  return (
    <section id="showcase" style={{ background: AP.slate, color: AP.off, padding: mobile ? "64px 22px" : "96px 36px" }}>
      <SectionHeader
        mobile={mobile}
        index="06 · SHOWCASE"
        welsh="Arddangos"
        title={<>Don't just take my word. <span style={{ fontFamily: AP.italic, fontStyle: "italic", color: AP.red, fontWeight: 400 }}>Try</span> the demos.</>}
        right={<>Live showcase of what I build<br/>for local businesses.</>}
      />
      <div style={{ marginTop: 40, display: "grid",
        gridTemplateColumns: mobile ? "1fr" : "repeat(4, 1fr)", gap: 16 }}>
        {SHOWCASE_DATA.map((item, i) => (
          <div key={i} style={{
            border: `1px solid ${AP.ruleStr}`, background: AP.slate2,
            display: "grid", gridTemplateRows: "auto 1fr auto",
          }}>
            <div style={{ padding: "16px 18px", borderBottom: `1px solid ${AP.rule}`,
              display: "flex", justifyContent: "space-between", alignItems: "baseline",
              fontFamily: AP.mono, fontSize: 10, letterSpacing: "0.16em", color: AP.brass }}>
              <span>/ {item.n} · {item.tag}</span>
              <span style={{ fontFamily: AP.italic, fontStyle: "italic", fontSize: 14, letterSpacing: 0 }}>{item.welsh}</span>
            </div>
            <div>
              <div style={{ padding: "18px 18px 0" }}>
                <h3 style={{ margin: 0, fontFamily: AP.display, fontSize: 24, fontWeight: 600, letterSpacing: "-0.02em", color: AP.off }}>{item.title}</h3>
                <p style={{ margin: "6px 0 14px", fontSize: 13, color: AP.off2, lineHeight: 1.45 }}>{item.sub}</p>
              </div>
              <item.Demo/>
            </div>
            <a href="/showcase" style={{ padding: "12px 18px", borderTop: `1px solid ${AP.rule}`,
              display: "flex", justifyContent: "space-between", alignItems: "center",
              fontFamily: AP.mono, fontSize: 10, letterSpacing: "0.14em", color: AP.dim,
              textDecoration: "none" }}>
              <span>LIVE · interactive</span>
              <span style={{ color: AP.off }}>open full demo →</span>
            </a>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 32, display: "flex", justifyContent: "flex-end",
        paddingTop: 20, borderTop: `1px solid ${AP.ruleStr}` }}>
        <Btn variant="ghost" small as="a" href="/showcase">See the full showcase</Btn>
      </div>
    </section>
  );
}

/* ───────── 10 · Founding Local ───────── */
function Founding({ mobile }) {
  return (
    <section id="founding" style={{
      background: AP.off, color: AP.slate,
      padding: mobile ? "64px 22px" : "96px 36px",
      position: "relative", overflow: "hidden",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
        paddingBottom: 16, borderBottom: `2px solid ${AP.slate}`,
        fontFamily: AP.mono, fontSize: 11, letterSpacing: "0.18em", color: AP.redDeep }}>
        <span>/ 07 · FOUNDING LOCAL · <span style={{ fontFamily: AP.italic, fontStyle: "italic", letterSpacing: 0, fontSize: 14 }}>Lleol</span></span>
        <span style={{ color: AP.slate, letterSpacing: "0.14em" }}>VALID · PLACES REMAINING · 10 / 10</span>
      </div>

      <div style={{ marginTop: 36, display: "grid",
        gridTemplateColumns: mobile ? "1fr" : "1.1fr 1fr",
        gap: mobile ? 32 : 48, alignItems: "start" }}>
        <div>
          <h2 style={{ margin: 0, fontFamily: AP.display, fontWeight: 500,
            fontSize: mobile ? 52 : "clamp(56px, 6.8vw, 108px)",
            lineHeight: 0.92, letterSpacing: "-0.04em", color: AP.slate, textWrap: "balance" }}>
            Founding Local.<br/>
            <span style={{ color: AP.red }}>£100</span> setup.<br/>
            <span style={{ fontFamily: AP.italic, fontStyle: "italic", fontWeight: 400 }}>£50 / month.</span>
          </h2>
          <p style={{ margin: "28px 0 0", fontSize: 18, lineHeight: 1.5, color: "#3b3e3a", maxWidth: 560, textWrap: "pretty" }}>
            A properly built website, hosted and maintained, for the first 10 local businesses in Blackwood and the Valleys. The price is <em style={{ fontFamily: AP.italic }}>locked in for life</em>.
          </p>
        </div>

        <div style={{ border: `1.5px solid ${AP.slate}`, padding: "24px 26px",
          position: "relative", background: "#F3EEE2" }}>
          <div style={{ position: "absolute", top: -10, left: 20, padding: "0 8px",
            background: "#F3EEE2", fontFamily: AP.mono, fontSize: 10, letterSpacing: "0.16em", color: AP.redDeep }}>
            WHAT YOU GET
          </div>
          <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "grid", gap: 12, fontSize: 15 }}>
            {[
              "Custom site, designed and built for you",
              "Your own domain and hosting",
              "Monthly update window",
              "Uptime monitoring",
              "Quarterly check-in call",
              "No lock-in — cancel any time",
            ].map((x, i) => (
              <li key={i} style={{
                display: "grid", gridTemplateColumns: "22px 1fr",
                paddingBottom: 10, borderBottom: i < 5 ? `1px dashed rgba(21,23,27,0.25)` : "none",
              }}>
                <span style={{ fontFamily: AP.mono, fontSize: 11, color: AP.redDeep, paddingTop: 2 }}>{String(i + 1).padStart(2, "0")}</span>
                <span style={{ color: AP.slate }}>{x}</span>
              </li>
            ))}
          </ul>
          <div style={{ marginTop: 20, paddingTop: 14, borderTop: `2px solid ${AP.slate}`,
            display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <Btn variant="light" as="a" href="/founding-local">Learn more</Btn>
            <Btn as="a" href="#contact">Claim a place</Btn>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 56, paddingTop: 22, borderTop: `1px solid rgba(21,23,27,0.2)`,
        display: "grid",
        gridTemplateColumns: mobile ? "1fr" : "auto 1fr",
        gap: mobile ? 20 : 32, alignItems: "center" }}>
        <div style={{ fontFamily: AP.mono, fontSize: 10, letterSpacing: "0.16em", color: AP.redDeep }}>
          PLACES<br/>REMAINING
        </div>
        <div style={{ display: "grid",
          gridTemplateColumns: mobile ? "repeat(5, 1fr)" : "repeat(10, 1fr)",
          gap: 8 }}>
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} style={{
              aspectRatio: "4 / 5", border: `1.5px solid ${AP.slate}`,
              display: "grid", placeItems: "center",
              fontFamily: AP.display, fontWeight: 600,
              fontSize: mobile ? 20 : 32, letterSpacing: "-0.03em", color: AP.slate,
            }}>{String(i + 1).padStart(2, "0")}</div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────── 11 · Client proof ───────── */
function ClientProof({ mobile }) {
  return (
    <section id="clients" style={{ background: AP.slate, color: AP.off, padding: mobile ? "64px 22px" : "96px 36px" }}>
      <SectionHeader
        mobile={mobile}
        index="08 · LIVE WORK"
        welsh="Gwaith byw"
        title={<>Not just demos. <span style={{ fontFamily: AP.italic, fontStyle: "italic", color: AP.red, fontWeight: 400 }}>Real</span> businesses.</>}
        right={<>First live client. More launching<br/>soon through Founding Local.</>}
      />
      <div style={{ marginTop: 40, display: "grid",
        gridTemplateColumns: mobile ? "1fr" : "2fr 1fr", gap: 16 }}>
        <article style={{ border: `1px solid ${AP.ruleStr}`, background: AP.slate2,
          display: "grid", gridTemplateRows: "auto 1fr auto" }}>
          <div style={{ aspectRatio: "21 / 9", position: "relative",
            overflow: "hidden", borderBottom: `1px solid ${AP.rule}` }}>
            <img src="/westgate-hero.jpg" alt="The Westgate Bar, Blackwood"
              loading="lazy" style={{
                position: "absolute", inset: 0, width: "100%", height: "100%",
                objectFit: "cover", objectPosition: "center",
              }}/>
            <div style={{ position: "absolute", inset: 0,
              background: "linear-gradient(180deg, rgba(21,23,27,0.25) 0%, rgba(21,23,27,0.55) 55%, rgba(21,23,27,0.92) 100%)",
            }}/>
            <div style={{ position: "absolute", top: 18, left: 22,
              fontFamily: AP.mono, fontSize: 10, color: AP.off, letterSpacing: "0.18em" }}>
              westgateblackwood.co.uk — LIVE
            </div>
            <div style={{ position: "absolute", bottom: 22, left: 22, right: 22,
              display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
              <h3 style={{ margin: 0, fontFamily: AP.display, fontWeight: 500,
                fontSize: mobile ? 32 : 56, lineHeight: 0.9, letterSpacing: "-0.035em",
                color: AP.off, textWrap: "balance", maxWidth: "70%" }}>
                The Westgate Bar<br/>
                <span style={{ fontFamily: AP.italic, fontStyle: "italic", fontWeight: 400, color: AP.red }}>Blackwood · 2026</span>
              </h3>
              <div style={{ fontFamily: AP.mono, fontSize: 10, letterSpacing: "0.14em", color: AP.off,
                textAlign: "right", lineHeight: 1.7 }}>
                LIVE SINCE APR · 2026<br/>CUSTOM WEBSITE<br/>BUILT & MAINTAINED BY AP
              </div>
            </div>
          </div>
          <div style={{ padding: "24px 24px 28px", display: "grid", gap: 18 }}>
            <div style={{ display: "grid",
              gridTemplateColumns: mobile ? "1fr 1fr" : "repeat(4, 1fr)",
              gap: mobile ? 14 : 20, borderBottom: `1px solid ${AP.rule}`, paddingBottom: 20 }}>
              {[
                ["SECTOR", "Pub · food"],
                ["BRIEF", "Website + menus"],
                ["BUILT IN", "5 days"],
                ["STATUS", "Live, maintained"],
              ].map((x, i) => (
                <div key={i}>
                  <div style={{ fontFamily: AP.mono, fontSize: 10, letterSpacing: "0.18em", color: AP.brass }}>{x[0]}</div>
                  <div style={{ fontFamily: AP.display, fontSize: 18, fontWeight: 500, color: AP.off, marginTop: 6, letterSpacing: "-0.01em" }}>{x[1]}</div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Btn variant="ghost" small as="a" href="https://westgateblackwood.co.uk" icon="↗" target="_blank" rel="noopener">Visit westgateblackwood.co.uk</Btn>
            </div>
          </div>
        </article>

        <aside style={{ border: `1px dashed ${AP.ruleStr}`, padding: "28px 26px",
          display: "flex", flexDirection: "column", gap: 18, background: "rgba(255,255,255,0.015)" }}>
          <Eyebrow color={AP.brass}>Next up</Eyebrow>
          <h3 style={{ margin: 0, fontFamily: AP.display, fontSize: 30, lineHeight: 1.02,
            fontWeight: 500, letterSpacing: "-0.025em", color: AP.off, textWrap: "balance" }}>
            Founding Local is open.
          </h3>
          <div style={{ borderTop: `1px solid ${AP.rule}`, paddingTop: 14, display: "grid", gap: 14 }}>
            <div style={{
              fontFamily: AP.display, fontSize: 44, fontWeight: 600,
              letterSpacing: "-0.03em", lineHeight: 1, color: AP.off,
            }}>10 / 10</div>
            <div style={{ fontFamily: AP.mono, fontSize: 11, color: AP.brass, letterSpacing: "0.14em" }}>
              PLACES STILL AVAILABLE
            </div>
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.55, color: AP.off2 }}>
              £100 setup, £50/mo, locked in for life. You could be next — the chat is always free.
            </p>
          </div>
          <div style={{ marginTop: "auto", paddingTop: 4 }}>
            <Btn variant="ghost" small as="a" href="#founding">Be the next one</Btn>
          </div>
        </aside>
      </div>
    </section>
  );
}

/* ───────── 12 · Contact ───────── */
function Field({ label, name, type = "text", required, span = 1, as = "input", placeholder }) {
  const [focused, setFocused] = useState(false);
  const Tag = as;
  return (
    <div style={{ gridColumn: `span ${span}` }}>
      <label style={{
        display: "flex", justifyContent: "space-between", alignItems: "baseline",
        fontFamily: AP.mono, fontSize: 10, letterSpacing: "0.18em",
        color: focused ? AP.red : AP.brass, marginBottom: 8,
        transition: "color 160ms",
      }}>
        <span>{label}</span>
        {required
          ? <span style={{ color: AP.red }}>REQUIRED *</span>
          : <span style={{ color: AP.dim, letterSpacing: "0.14em" }}>OPTIONAL</span>}
      </label>
      <Tag
        name={name} type={type} placeholder={placeholder || "— type here"} required={required}
        rows={as === "textarea" ? 5 : undefined}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: "100%", boxSizing: "border-box",
          background: AP.slate, color: AP.off,
          border: `1px solid ${focused ? AP.red : AP.ruleStr}`,
          padding: as === "textarea" ? "14px 16px" : "14px 16px",
          fontFamily: as === "textarea" ? AP.body : AP.display,
          fontSize: as === "textarea" ? 15 : 18, letterSpacing: "-0.01em",
          outline: "none", resize: as === "textarea" ? "vertical" : "none",
          lineHeight: 1.4,
          transition: "border-color 160ms, background 160ms",
        }}
      />
    </div>
  );
}

function Contact({ mobile }) {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (sending) return;
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = (data.get("name") || "").toString().trim();
    const biz = (data.get("biz") || "").toString().trim();
    const email = (data.get("email") || "").toString().trim();
    const phone = (data.get("phone") || "").toString().trim();
    const website = (data.get("site") || "").toString().trim();
    const message = (data.get("msg") || "").toString().trim();
    if (!name || (!email && !phone)) return;
    setSending(true);
    try {
      const contact = [email, phone].filter(Boolean).join(" | ");
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, business: biz, contact, website, message, source: "form" }),
      });
      if (!res.ok) throw new Error("Request failed");
      setSent(true);
    } catch {
      setSending(false);
      alert("Something went wrong. Please try again or email hello@asherprice.co.uk directly.");
    }
  };
  return (
    <section id="contact" style={{ background: AP.slate, color: AP.off, padding: mobile ? "64px 22px" : "96px 36px" }}>
      <SectionHeader
        mobile={mobile}
        index="09 · CONTACT"
        welsh="Cysylltu"
        title={<>Let's <span style={{ fontFamily: AP.italic, fontStyle: "italic", color: AP.red, fontWeight: 400 }}>talk</span>.</>}
        right={<>Free, no-obligation conversation.<br/>I'll reply within 24 hours.</>}
      />
      <div style={{ marginTop: 40, display: "grid",
        gridTemplateColumns: mobile ? "1fr" : "1fr 1.4fr",
        gap: mobile ? 32 : 48 }}>
        <aside style={{ borderTop: `1px solid ${AP.ruleStr}`, paddingTop: 24 }}>
          <p style={{ margin: 0, fontSize: 18, lineHeight: 1.5, color: AP.off2, textWrap: "pretty" }}>
            Tell me what your business needs and I'll give you an honest answer —
            <em style={{ fontFamily: AP.italic }}> even if it's "you don't need me."</em>
          </p>
          <div style={{ marginTop: 28, display: "grid", gap: 14, fontFamily: AP.mono, fontSize: 13 }}>
            <div><span style={{ color: AP.brass, letterSpacing: "0.16em", fontSize: 10 }}>EMAIL</span><br/>
              <a href="mailto:hello@asherprice.co.uk" style={{ color: AP.off, textDecoration: "none" }}>hello@asherprice.co.uk</a>
            </div>
            <div><span style={{ color: AP.brass, letterSpacing: "0.16em", fontSize: 10 }}>FACEBOOK</span><br/>
              <a href="https://www.facebook.com/asherprice.uk/" target="_blank" rel="noopener" style={{ color: AP.off, textDecoration: "none" }}>/asherprice.uk →</a>
            </div>
            <div><span style={{ color: AP.brass, letterSpacing: "0.16em", fontSize: 10 }}>STUDIO</span><br/>
              <span style={{ color: AP.off }}>Blackwood, NP12<br/>South Wales</span>
            </div>
          </div>
          <div style={{ marginTop: 28, padding: "14px 16px", border: `1px solid ${AP.ruleStr}`,
            fontFamily: AP.mono, fontSize: 12, color: AP.off, lineHeight: 1.55 }}>
            <span style={{ color: AP.moss }}>● </span>
            Founding Local is open — 10 places available.
          </div>
        </aside>

        {sent ? (
          <div style={{ borderTop: `1px solid ${AP.ruleStr}`, paddingTop: 24,
            display: "flex", flexDirection: "column", justifyContent: "center", gap: 18 }}>
            <Eyebrow color={AP.moss}>Message received</Eyebrow>
            <h3 style={{ margin: 0, fontFamily: AP.display, fontSize: mobile ? 40 : 56,
              lineHeight: 0.95, fontWeight: 500, letterSpacing: "-0.035em", color: AP.off }}>
              Message received — <span style={{ fontFamily: AP.italic, fontStyle: "italic", color: AP.red, fontWeight: 400 }}>diolch</span>.
            </h3>
            <p style={{ margin: 0, fontSize: 17, lineHeight: 1.5, color: AP.off2, maxWidth: 560 }}>
              I'll get back to you within 24 hours — usually the same day. If it's urgent, ping me on Facebook or drop me a text.
            </p>
            <div><Btn variant="ghost" small onClick={() => setSent(false)}>Send another</Btn></div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{
            position: "relative",
            background: AP.slate2,
            border: `1px solid ${AP.ruleStr}`,
            padding: mobile ? "24px 22px 22px" : "36px 36px 28px",
          }}>
            <div style={{
              position: "absolute", top: -10, left: 20, padding: "0 10px",
              background: AP.slate2,
              fontFamily: AP.mono, fontSize: 10, letterSpacing: "0.18em", color: AP.brass,
            }}>
              ENQUIRY · FORM
            </div>
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "baseline",
              paddingBottom: 20, marginBottom: 24,
              borderBottom: `1px solid ${AP.rule}`,
              fontFamily: AP.mono, fontSize: 10, letterSpacing: "0.16em", color: AP.dim,
            }}>
              <span>Fill in what applies — minimum: name + email <span style={{ color: AP.red }}>*</span></span>
              <span style={{ color: AP.moss }}>● ACCEPTING BRIEFS</span>
            </div>
            <div style={{ display: "grid",
              gridTemplateColumns: mobile ? "1fr" : "1fr 1fr",
              gap: mobile ? 20 : "24px 28px" }}>
              <Field label="Your name"     name="name"  required />
              <Field label="Business name" name="biz"   required />
              <Field label="Email"         name="email" type="email" required />
              <Field label="Phone"         name="phone" type="tel" />
              <Field label="Website or Facebook page" name="site" span={mobile ? 1 : 2} placeholder="https://…" />
              <Field label="Tell me about your business and what you need" name="msg" as="textarea" span={mobile ? 1 : 2} required />
            </div>
            <div style={{ marginTop: 28,
              display: "flex",
              flexDirection: mobile ? "column" : "row",
              justifyContent: "space-between",
              alignItems: mobile ? "stretch" : "center",
              gap: mobile ? 14 : 0,
              paddingTop: 20, borderTop: `1px dashed ${AP.rule}` }}>
              <div style={{ fontFamily: AP.mono, fontSize: 11, color: AP.dim, letterSpacing: "0.04em", lineHeight: 1.6 }}>
                No newsletter. No follow-up spam.<br/>Just a reply from me, usually same day.
              </div>
              <button type="submit" disabled={sending} style={{
                padding: "16px 24px", background: AP.red, color: AP.off, border: "none",
                fontFamily: AP.mono, fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase",
                cursor: sending ? "default" : "pointer", opacity: sending ? 0.7 : 1,
                display: "inline-flex", alignItems: "center", gap: 14, justifyContent: "space-between",
                minWidth: mobile ? "auto" : 220,
              }}>
                <span>{sending ? "Sending…" : "Send message"}</span>
                <span>→</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}

/* ───────── 13 · Footer ───────── */
function Footer({ mobile }) {
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
              <div style={{ fontFamily: AP.mono, fontSize: 10, color: AP.dim, letterSpacing: "0.08em", marginTop: 2 }}>/ solo / est. 2026</div>
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
              ["Services", "#services"],
              ["Showcase", "/showcase"],
              ["Examples", "/examples"],
              ["How it works", "#how-it-works"],
              ["Founding Local", "/founding-local"],
              ["Why a website?", "/why-a-website.html"],
              ["Get started", "#contact"],
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

/* ───────── 14 · Placeholder chatbot widget (used only if you don't import ./Chatbot) ───────── */
// Uncomment `<ChatbotWidget />` in App and delete `import Chatbot from "./Chatbot"` to use this placeholder.
// eslint-disable-next-line no-unused-vars
function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: "fixed", bottom: 22, right: 22, zIndex: 50, fontFamily: AP.mono }}>
      {open && (
        <div style={{ width: 320, marginBottom: 12, background: AP.slate2, color: AP.off,
          border: `1px solid ${AP.ruleStr}`, boxShadow: "0 24px 60px rgba(0,0,0,0.5)" }}>
          <div style={{ padding: "12px 14px", borderBottom: `1px solid ${AP.rule}`,
            display: "flex", alignItems: "center", gap: 10, fontSize: 11, letterSpacing: "0.14em" }}>
            <span style={{ width: 8, height: 8, background: AP.moss }}/>
            <span>ASK_AP · chatbot demo</span>
            <span style={{ marginLeft: "auto", cursor: "pointer", color: AP.dim }} onClick={() => setOpen(false)}>×</span>
          </div>
          <div style={{ padding: 14, display: "grid", gap: 10, fontSize: 13, lineHeight: 1.5 }}>
            <div style={{ color: AP.dim, fontSize: 10, letterSpacing: "0.12em" }}>AP · now</div>
            <div style={{ padding: "10px 12px", background: AP.slate3, maxWidth: "88%" }}>
              Shw mae. What can I build for you today? Try asking about pricing, timelines, or the Founding Local deal.
            </div>
          </div>
          <div style={{ padding: "10px 12px", borderTop: `1px solid ${AP.rule}`, fontSize: 12, color: AP.dim }}>
            <span style={{ color: AP.red }}>▍</span> type a question…
          </div>
        </div>
      )}
      <button onClick={() => setOpen((o) => !o)} style={{
        width: 56, height: 56, background: AP.red, color: AP.off, border: "none",
        display: "grid", placeItems: "center", cursor: "pointer",
        boxShadow: "0 12px 30px rgba(163,19,42,0.4)",
      }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M4 5h16v11H9l-5 4V5z"/>
        </svg>
      </button>
    </div>
  );
}

/* ───────── Mobile menu overlay ───────── */
function MobileMenu({ onClose }) {
  const links = [
    { label: "Services",     href: "#services" },
    { label: "Showcase",     href: "/showcase" },
    { label: "Examples",     href: "/examples" },
    { label: "How it works", href: "#how-it-works" },
    { label: "Founding Local", href: "#founding" },
    { label: "Get started",  href: "#contact" },
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

/* ───────── Root ───────── */
export default function App() {
  const mobile = useMobile();
  const [menuOpen, setMenuOpen] = useState(false);
  // Apply base body styles once
  useEffect(() => {
    document.body.style.background = AP.slate;
    document.body.style.color = AP.off;
    document.body.style.margin = "0";
    document.body.style.fontFamily = AP.body;
    document.documentElement.style.scrollBehavior = "smooth";
  }, []);
  return (
    <>
      <Announcement mobile={mobile}/>
      <Nav mobile={mobile} onMenuOpen={() => setMenuOpen(true)}/>
      <main>
        <Hero mobile={mobile}/>
        <Services mobile={mobile}/>
        <Process mobile={mobile}/>
        <Why mobile={mobile}/>
        <Examples mobile={mobile}/>
        <Showcase mobile={mobile}/>
        <Founding mobile={mobile}/>
        <ClientProof mobile={mobile}/>
        <Contact mobile={mobile}/>
      </main>
      <Footer mobile={mobile}/>
      <Chatbot />
      {menuOpen && <MobileMenu onClose={() => setMenuOpen(false)}/>}
    </>
  );
}
