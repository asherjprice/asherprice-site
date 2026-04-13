import { useState, useEffect, useRef, useCallback } from "react";
import Chatbot from "./Chatbot";

/* ── palette ── */
const C = {
  red: "#C8102E", redHov: "#E01A38", redFaint: "rgba(200,16,46,0.06)",
  green: "#1B6B3A", greenFaint: "rgba(27,107,58,0.08)",
  bg: "#08090B", bg2: "#0C0D10", card: "#101218", card2: "#14161D",
  border: "#1B1E26", border2: "#252830",
  t1: "#F0EDEA", t2: "#9B9DA4", t3: "#5C5F68",
  slate: "#1E2028",
};

/* ── intersection observer hook ── */
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

function Reveal({ children, delay = 0, y = 40, style = {} }) {
  const [ref, v] = useInView();
  return <div ref={ref} style={{ ...style, opacity: v ? 1 : 0, transform: v ? "none" : `translateY(${y}px)`, transition: `all 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}s` }}>{children}</div>;
}

/* ── animated counter ── */
function Counter({ end, suffix = "", duration = 2000 }) {
  const [val, setVal] = useState(0);
  const [ref, v] = useInView();
  useEffect(() => {
    if (!v) return;
    let start = 0; const step = end / (duration / 16);
    const id = setInterval(() => { start += step; if (start >= end) { setVal(end); clearInterval(id); } else setVal(Math.floor(start)); }, 16);
    return () => clearInterval(id);
  }, [v, end, duration]);
  return <span ref={ref}>{val}{suffix}</span>;
}

/* ── floating particles ── */
function Particles() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const c = canvasRef.current; if (!c) return;
    const ctx = c.getContext("2d");
    let w = c.width = window.innerWidth, h = c.height = window.innerHeight;
    const particles = Array.from({ length: 40 }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.5 + 0.5, o: Math.random() * 0.3 + 0.05,
    }));
    let raf;
    function draw() {
      ctx.clearRect(0, 0, w, h);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200,16,46,${p.o})`; ctx.fill();
      });
      // draw lines between close particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x, dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            ctx.beginPath(); ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(200,16,46,${0.04 * (1 - dist / 150)})`;
            ctx.lineWidth = 0.5; ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    }
    draw();
    const resize = () => { w = c.width = window.innerWidth; h = c.height = window.innerHeight; };
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, pointerEvents: "none" }} />;
}

/* ── noise/grain overlay ── */
function Grain() {
  return <div style={{
    position: "fixed", inset: 0, pointerEvents: "none", zIndex: 9999,
    opacity: 0.035,
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
    backgroundRepeat: "repeat",
  }} />;
}

/* ── dragon mark ── */
function Dragon({ size = 32, color = C.red, style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" style={style}>
      <path d="M50 2L61 28L90 8L72 35L98 50L72 65L90 92L61 72L50 98L39 72L10 92L28 65L2 50L28 35L10 8L39 28Z"
        fill={color} />
    </svg>
  );
}

/* ── section label ── */
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

/* ═══════════════ NAVBAR ═══════════════ */
function Navbar() {
  const [s, setS] = useState(false);
  useEffect(() => {
    const h = () => setS(window.scrollY > 60);
    window.addEventListener("scroll", h); return () => window.removeEventListener("scroll", h);
  }, []);
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
      padding: "0 clamp(24px,6vw,72px)", height: 76,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      background: s ? "rgba(8,9,11,0.92)" : "transparent",
      backdropFilter: s ? "blur(24px) saturate(1.4)" : "none",
      borderBottom: s ? `1px solid ${C.border}` : "1px solid transparent",
      transition: "all 0.5s cubic-bezier(0.16,1,0.3,1)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
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
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
        {[{ label: "What We Do", href: "#services" }, { label: "Our Approach", href: "#process" }].map(t => (
          <a key={t.label} href={t.href} style={{
            fontFamily: "'Inter',sans-serif", fontSize: 12, fontWeight: 600,
            color: C.t2, textDecoration: "none", letterSpacing: "0.08em",
            textTransform: "uppercase", transition: "color 0.3s",
            display: window.innerWidth < 640 ? "none" : "block",
          }}
            onMouseEnter={e => e.target.style.color = C.t1}
            onMouseLeave={e => e.target.style.color = C.t2}
          >{t.label}</a>
        ))}
        <a href="#contact" style={{
          padding: "11px 28px", background: C.red, color: "#fff",
          fontFamily: "'Inter',sans-serif", fontSize: 12, fontWeight: 700,
          letterSpacing: "0.08em", textTransform: "uppercase",
          textDecoration: "none", transition: "all 0.3s",
          boxShadow: "0 0 30px rgba(200,16,46,0.15)",
        }}
          onMouseEnter={e => { e.target.style.background = C.redHov; e.target.style.boxShadow = "0 0 40px rgba(200,16,46,0.3)"; }}
          onMouseLeave={e => { e.target.style.background = C.red; e.target.style.boxShadow = "0 0 30px rgba(200,16,46,0.15)"; }}
        >Get Started</a>
      </div>
    </nav>
  );
}

/* ═══════════════ HERO ═══════════════ */
function Hero() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setTimeout(() => setLoaded(true), 200); }, []);
  const a = (d) => ({
    opacity: loaded ? 1 : 0,
    transform: loaded ? "none" : "translateY(35px)",
    transition: `all 1s cubic-bezier(0.16,1,0.3,1) ${d}s`,
  });
  return (
    <section style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      justifyContent: "center", alignItems: "center",
      position: "relative", overflow: "hidden",
      padding: "140px clamp(24px,6vw,72px) 100px",
    }}>
      <Particles />
      {/* Large faded dragon watermark */}
      <div style={{ position: "absolute", right: "-5%", top: "15%", opacity: 0.018, transform: "rotate(12deg)" }}>
        <Dragon size={600} color={C.red} />
      </div>

      <div style={{ position: "relative", maxWidth: 820, textAlign: "center" }}>
        <div style={a(0.3)}>
          <Label>Blackwood, South Wales</Label>
        </div>
        <h1 style={{
          fontFamily: "'Playfair Display',Georgia,serif",
          fontSize: "clamp(44px,8vw,92px)", fontWeight: 800,
          lineHeight: 1.02, color: C.t1, margin: "0 0 12px 0",
          letterSpacing: "-0.03em", ...a(0.5),
        }}>
          Your business,
        </h1>
        <h1 style={{
          fontFamily: "'Playfair Display',Georgia,serif",
          fontSize: "clamp(44px,8vw,92px)", fontWeight: 800,
          lineHeight: 1.02, margin: "0 0 40px 0",
          letterSpacing: "-0.03em",
          background: `linear-gradient(135deg, ${C.red} 0%, #E84460 50%, ${C.red} 100%)`,
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          ...a(0.65),
        }}>
          supercharged.
        </h1>
        <p style={{
          fontFamily: "'Inter',sans-serif",
          fontSize: "clamp(15px,1.8vw,19px)", color: C.t2,
          lineHeight: 1.8, maxWidth: 540, margin: "0 auto 52px auto",
          fontWeight: 400, ...a(0.8),
        }}>
          AI-powered websites, chatbots, and automation
          for businesses across South Wales. Professional
          results, personal service, honest advice.
        </p>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center", ...a(0.95) }}>
          <a href="#services" style={{
            padding: "18px 40px", background: C.red, color: "#fff",
            fontFamily: "'Inter',sans-serif", fontSize: 14, fontWeight: 700,
            letterSpacing: "0.04em", textDecoration: "none",
            textTransform: "uppercase", transition: "all 0.4s",
            boxShadow: "0 4px 30px rgba(200,16,46,0.2)",
            position: "relative", overflow: "hidden",
          }}
            onMouseEnter={e => { e.target.style.background = C.redHov; e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 8px 40px rgba(200,16,46,0.3)"; }}
            onMouseLeave={e => { e.target.style.background = C.red; e.target.style.transform = "none"; e.target.style.boxShadow = "0 4px 30px rgba(200,16,46,0.2)"; }}
          >See What We Do</a>
          <a href="#contact" style={{
            padding: "18px 40px", background: "transparent",
            border: `1px solid ${C.border2}`, color: C.t1,
            fontFamily: "'Inter',sans-serif", fontSize: 14, fontWeight: 600,
            letterSpacing: "0.04em", textDecoration: "none",
            textTransform: "uppercase", transition: "all 0.4s",
          }}
            onMouseEnter={e => { e.target.style.borderColor = C.t2; e.target.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { e.target.style.borderColor = C.border2; e.target.style.transform = "none"; }}
          >Book a Free Chat</a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{
        position: "absolute", bottom: 40,
        left: "50%", transform: "translateX(-50%)",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
        ...a(1.3),
      }}>
        <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 10, color: C.t3, letterSpacing: "0.15em", textTransform: "uppercase" }}>Scroll</span>
        <div style={{
          width: 1, height: 40,
          background: `linear-gradient(to bottom, ${C.red}, transparent)`,
          animation: "scrollPulse 2s ease-in-out infinite",
        }} />
      </div>
    </section>
  );
}

/* ═══════════════ MARQUEE ═══════════════ */
function Marquee() {
  const items = ["Websites", "AI Chatbots", "Automation", "Social Media", "Lead Generation", "24/7 Support"];
  return (
    <div style={{
      borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`,
      padding: "20px 0", overflow: "hidden", position: "relative",
    }}>
      <div style={{
        display: "flex", gap: 60, animation: "marquee 25s linear infinite",
        whiteSpace: "nowrap", width: "max-content",
      }}>
        {[...items, ...items, ...items].map((item, i) => (
          <span key={i} style={{
            fontFamily: "'Playfair Display',Georgia,serif",
            fontSize: 18, fontWeight: 600,
            color: i % 2 === 0 ? C.t3 : C.red,
            display: "flex", alignItems: "center", gap: 16,
          }}>
            <span style={{ width: 6, height: 6, background: C.red, transform: "rotate(45deg)", display: "block", opacity: 0.4 }} />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════ SERVICES ═══════════════ */
const services = [
  { icon: "01", title: "Websites", desc: "Fast, mobile-first websites that turn visitors into paying customers. No templates — every build is bespoke to your business.", accent: C.red },
  { icon: "02", title: "AI Chatbots", desc: "Intelligent assistants trained on your business. They answer enquiries, book appointments, and capture leads — all while you sleep.", accent: C.red },
  { icon: "03", title: "Automation", desc: "Automated booking, invoicing, follow-ups, and lead capture. Stop doing the same task twice and focus on what pays.", accent: C.red },
  { icon: "04", title: "Social & Content", desc: "Consistent, on-brand social media content created and scheduled by AI. Your feeds stay active without eating your evenings.", accent: C.green },
];

function Services() {
  return (
    <section id="services" style={{ padding: "140px clamp(24px,6vw,72px)", position: "relative" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
      <Reveal>
        <div style={{ textAlign: "center" }}>
        <Label>What We Do</Label>
        <h2 style={{
          fontFamily: "'Playfair Display',Georgia,serif",
          fontSize: "clamp(32px,5vw,56px)", fontWeight: 800,
          color: C.t1, margin: "0 0 20px 0", letterSpacing: "-0.025em", lineHeight: 1.1,
        }}>
          The full package.<br />
          <span style={{ color: C.t3 }}>Nothing missing.</span>
        </h2>
        <p style={{
          fontFamily: "'Inter',sans-serif", fontSize: 16, color: C.t2,
          lineHeight: 1.7, maxWidth: 480, margin: "0 auto 72px auto",
        }}>
          Everything a modern business needs to compete online —
          built, managed, and maintained by one person you can actually talk to.
        </p>
        </div>
      </Reveal>
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 2,
      }}>
        {services.map((s, i) => (
          <Reveal key={i} delay={i * 0.1}>
            <div style={{
              background: C.card, padding: "clamp(32px,3vw,48px)",
              height: "100%", position: "relative", overflow: "hidden",
              transition: "all 0.5s cubic-bezier(0.16,1,0.3,1)",
              cursor: "default", borderBottom: `3px solid transparent`,
            }}
              onMouseEnter={e => {
                e.currentTarget.style.background = C.card2;
                e.currentTarget.style.borderBottomColor = s.accent;
                e.currentTarget.style.transform = "translateY(-4px)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = C.card;
                e.currentTarget.style.borderBottomColor = "transparent";
                e.currentTarget.style.transform = "none";
              }}
            >
              {/* Big faded number */}
              <span style={{
                position: "absolute", top: -10, right: 12,
                fontFamily: "'Playfair Display',Georgia,serif",
                fontSize: 120, fontWeight: 800,
                color: "rgba(200,16,46,0.04)",
                lineHeight: 1, pointerEvents: "none",
              }}>{s.icon}</span>
              <div style={{
                width: 40, height: 3, background: s.accent,
                marginBottom: 28, transition: "width 0.4s",
              }} />
              <h3 style={{
                fontFamily: "'Playfair Display',Georgia,serif",
                fontSize: 24, fontWeight: 700, color: C.t1,
                margin: "0 0 14px 0", position: "relative",
              }}>{s.title}</h3>
              <p style={{
                fontFamily: "'Inter',sans-serif", fontSize: 14,
                color: C.t2, lineHeight: 1.75, margin: 0, position: "relative",
              }}>{s.desc}</p>
            </div>
          </Reveal>
        ))}
      </div>
      </div>
    </section>
  );
}

/* ═══════════════ STATS ═══════════════ */
function Stats() {
  return (
    <section style={{
      padding: "80px clamp(24px,6vw,72px)",
      borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`,
      background: `linear-gradient(135deg, ${C.bg} 0%, ${C.bg2} 100%)`,
    }}>
      <div style={{
        maxWidth: 1100, margin: "0 auto",
        display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))",
        gap: 40, textAlign: "center",
      }}>
        {[
          { end: 24, suffix: "/7", label: "Your AI never clocks off", color: C.red },
          { end: 5, suffix: " days", label: "Average build time", color: C.red },
          { end: 0, suffix: "£", label: "For an initial chat", color: C.green, prefix: "£" },
          { end: 100, suffix: "%", label: "Locally owned & run", color: C.red },
        ].map((s, i) => (
          <Reveal key={i} delay={i * 0.1}>
            <div>
              <div style={{
                fontFamily: "'Playfair Display',Georgia,serif",
                fontSize: "clamp(36px,5vw,52px)", fontWeight: 800,
                color: s.color, lineHeight: 1, marginBottom: 8,
              }}>
                {s.prefix || ""}{s.end > 0 ? <Counter end={s.end} suffix={s.suffix} /> : `0${s.suffix}`}
              </div>
              <div style={{
                fontFamily: "'Inter',sans-serif", fontSize: 12,
                color: C.t2, letterSpacing: "0.06em", fontWeight: 500,
              }}>{s.label}</div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ═══════════════ PROCESS ═══════════════ */
const steps = [
  { n: "01", t: "Chat", d: "A free, no-pressure conversation. Tell me about your business — I'll tell you exactly what would help and what wouldn't." },
  { n: "02", t: "Build", d: "I build your website, chatbot, or automation system. You'll see progress throughout with regular updates at every stage." },
  { n: "03", t: "Launch", d: "We go live. I handle the technical setup, DNS, hosting — everything. You just watch it start working." },
  { n: "04", t: "Grow", d: "Ongoing support, updates, and improvements. Your monthly retainer keeps everything running and evolving." },
];

function Process() {
  return (
    <section id="process" style={{ padding: "140px clamp(24px,6vw,72px)", position: "relative" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
      <Reveal>
        <div style={{ textAlign: "center", marginBottom: 80 }}>
        <Label>Our Approach</Label>
        <h2 style={{
          fontFamily: "'Playfair Display',Georgia,serif",
          fontSize: "clamp(32px,5vw,56px)", fontWeight: 800,
          color: C.t1, margin: 0, letterSpacing: "-0.025em", lineHeight: 1.1,
        }}>Four steps to<br /><span style={{ color: C.red }}>better business.</span></h2>
        </div>
      </Reveal>
      <div className="process-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
        {steps.map((s, i) => (
          <Reveal key={i} delay={i * 0.12}>
            <div style={{
              background: C.card, padding: "clamp(28px,3vw,40px)",
              position: "relative", overflow: "hidden",
              borderTop: `3px solid ${C.red}`,
              transition: "all 0.5s cubic-bezier(0.16,1,0.3,1)",
            }}
              onMouseEnter={e => { e.currentTarget.style.background = C.card2; e.currentTarget.style.transform = "translateY(-4px)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = C.card; e.currentTarget.style.transform = "none"; }}
            >
              <span style={{
                position: "absolute", top: -10, right: 12,
                fontFamily: "'Playfair Display',Georgia,serif",
                fontSize: 100, fontWeight: 800,
                color: "rgba(200,16,46,0.04)",
                lineHeight: 1, pointerEvents: "none",
              }}>{s.n}</span>
              <h3 style={{
                fontFamily: "'Playfair Display',Georgia,serif",
                fontSize: 24, fontWeight: 700, color: C.t1,
                margin: "0 0 12px 0", position: "relative",
              }}>{s.t}</h3>
              <p style={{
                fontFamily: "'Inter',sans-serif", fontSize: 14,
                color: C.t2, lineHeight: 1.75, margin: 0, position: "relative",
              }}>{s.d}</p>
            </div>
          </Reveal>
        ))}
      </div>
      </div>
    </section>
  );
}

/* ═══════════════ WHY LOCAL ═══════════════ */
function WhyLocal() {
  return (
    <section style={{
      padding: "140px clamp(24px,6vw,72px)",
      borderTop: `1px solid ${C.border}`,
      position: "relative", overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", right: "-3%", top: "50%", transform: "translateY(-50%) rotate(15deg)",
        opacity: 0.015,
      }}>
        <Dragon size={500} color={C.red} />
      </div>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
          <Label>Why Local Matters</Label>
          <h2 style={{
            fontFamily: "'Playfair Display',Georgia,serif",
            fontSize: "clamp(32px,4.5vw,52px)", fontWeight: 800,
            color: C.t1, margin: "0 0 28px 0",
            letterSpacing: "-0.025em", lineHeight: 1.08,
          }}>
            A local partner who understands<br />
            <span style={{ color: C.red }}>your business.</span>
          </h2>
          <p style={{
            fontFamily: "'Inter',sans-serif", fontSize: 16,
            color: C.t2, lineHeight: 1.85, maxWidth: 560, margin: "0 auto",
          }}>
            Based in Blackwood, I work with businesses across the Valleys
            and beyond. I take the time to understand your goals and build
            solutions that genuinely fit.
          </p>
          </div>
        </Reveal>
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
          gap: 24, alignItems: "start",
        }}>
          <Reveal delay={0.1}>
            <div style={{
              background: C.card, padding: "clamp(32px,4vw,48px)",
              position: "relative", overflow: "hidden", textAlign: "center",
            }}>
              <div style={{
                position: "absolute", top: 0, left: 0, right: 0, height: 3,
                background: `linear-gradient(90deg, ${C.red}, ${C.green})`,
              }} />
              <div style={{
                fontFamily: "'Playfair Display',Georgia,serif",
                fontSize: 22, fontWeight: 700, color: C.t1,
                marginBottom: 32, lineHeight: 1.3,
              }}>
                What working with us<br />
                <span style={{ color: C.red }}>looks like:</span>
              </div>
              {[
                "Direct access — a real person, same day.",
                "Face-to-face meetings whenever you need.",
                "Flexible terms — no long contracts or hidden fees.",
                "Fair, transparent pricing.",
                "Everything explained in plain English.",
              ].map((item, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "flex-start", gap: 14,
                  marginBottom: i < 4 ? 18 : 0, textAlign: "left",
                }}>
                  <span style={{
                    width: 20, height: 20, minWidth: 20,
                    border: `1.5px solid ${C.red}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 11, color: C.red, marginTop: 1,
                  }}>✓</span>
                  <span style={{
                    fontFamily: "'Inter',sans-serif", fontSize: 14.5,
                    color: C.t2, lineHeight: 1.5,
                  }}>{item}</span>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <div style={{
              background: C.card, padding: "clamp(32px,4vw,48px)",
              position: "relative", overflow: "hidden",
              borderTop: `3px solid ${C.red}`,
            }}>
              <p style={{
                fontFamily: "'Inter',sans-serif", fontSize: 15,
                color: C.t2, lineHeight: 1.85, margin: "0 0 24px 0",
              }}>
                "I take the time to sit down with you, understand your goals,
                and build solutions that genuinely fit — not off-the-shelf
                packages that miss the mark."
              </p>
              <p style={{
                fontFamily: "'Inter',sans-serif", fontSize: 13,
                color: C.t3, lineHeight: 1.7, margin: 0, fontStyle: "italic",
              }}>
                Serving businesses across Blackwood, Caerphilly, Bargoed,
                Ystrad Mynach, Risca, Newbridge, Pontllanfraith, and the wider Valleys.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════ CONTACT ═══════════════ */
function Contact() {
  const [sent, setSent] = useState(false);
  const [focused, setFocused] = useState(null);
  const inputStyle = (name) => ({
    background: C.card, border: `1px solid ${focused === name ? C.red : C.border}`,
    color: C.t1, fontFamily: "'Inter',sans-serif",
    fontSize: 15, padding: "18px 22px", outline: "none",
    transition: "all 0.3s", width: "100%", boxSizing: "border-box",
    boxShadow: focused === name ? `0 0 20px ${C.redFaint}` : "none",
  });
  return (
    <section id="contact" style={{
      padding: "140px clamp(24px,6vw,72px)",
      borderTop: `1px solid ${C.border}`,
      position: "relative",
    }}>
      <div style={{
        position: "absolute", left: "50%", top: 0, width: 1, height: 80,
        background: `linear-gradient(to bottom, ${C.red}, transparent)`,
        transform: "translateX(-50%)",
      }} />
      <div style={{ maxWidth: 560, margin: "0 auto", textAlign: "center" }}>
        <Reveal>
          <Label>Get Started</Label>
          <h2 style={{
            fontFamily: "'Playfair Display',Georgia,serif",
            fontSize: "clamp(32px,5vw,52px)", fontWeight: 800,
            color: C.t1, margin: "0 0 16px 0", letterSpacing: "-0.025em",
          }}>Let's talk<span style={{ color: C.red }}>.</span></h2>
          <p style={{
            fontFamily: "'Inter',sans-serif", fontSize: 16,
            color: C.t2, lineHeight: 1.7, marginBottom: 56,
          }}>
            Free, no-obligation conversation. Tell me what your business needs
            and I'll give you an honest answer — even if it's "you don't need me."
          </p>
        </Reveal>
        <Reveal delay={0.15}>
          {!sent ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 16, textAlign: "left" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <input placeholder="Your name" style={inputStyle("name")}
                  onFocus={() => setFocused("name")} onBlur={() => setFocused(null)} />
                <input placeholder="Business name" style={inputStyle("biz")}
                  onFocus={() => setFocused("biz")} onBlur={() => setFocused(null)} />
              </div>
              <input placeholder="Email or phone number" style={inputStyle("email")}
                onFocus={() => setFocused("email")} onBlur={() => setFocused(null)} />
              <textarea placeholder="Tell me about your business and what you need..." rows={5}
                style={{ ...inputStyle("msg"), resize: "vertical" }}
                onFocus={() => setFocused("msg")} onBlur={() => setFocused(null)} />
              <button onClick={() => setSent(true)} style={{
                padding: "20px 40px", background: C.red, color: "#fff",
                fontFamily: "'Inter',sans-serif", fontSize: 14, fontWeight: 700,
                letterSpacing: "0.06em", textTransform: "uppercase",
                border: "none", cursor: "pointer", marginTop: 8,
                transition: "all 0.4s",
                boxShadow: "0 4px 30px rgba(200,16,46,0.2)",
              }}
                onMouseEnter={e => { e.target.style.background = C.redHov; e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 8px 40px rgba(200,16,46,0.3)"; }}
                onMouseLeave={e => { e.target.style.background = C.red; e.target.style.transform = "none"; e.target.style.boxShadow = "0 4px 30px rgba(200,16,46,0.2)"; }}
              >Send Message</button>
            </div>
          ) : (
            <div style={{
              padding: 56, background: C.card,
              border: `1px solid ${C.border}`,
              position: "relative", overflow: "hidden",
            }}>
              <div style={{
                position: "absolute", top: 0, left: 0, right: 0, height: 3,
                background: C.green,
              }} />
              <div style={{ fontSize: 36, marginBottom: 20, color: C.green }}>✓</div>
              <p style={{
                fontFamily: "'Playfair Display',Georgia,serif",
                fontSize: 24, color: C.t1, margin: "0 0 8px 0", fontWeight: 700,
              }}>Message received — diolch!</p>
              <p style={{
                fontFamily: "'Inter',sans-serif", fontSize: 15,
                color: C.t2, margin: 0,
              }}>I'll get back to you within 24 hours.</p>
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}

/* ═══════════════ FOOTER ═══════════════ */
function Footer() {
  return (
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
      <a href="mailto:hello@asherprice.co.uk" style={{
        fontFamily: "'Inter',sans-serif", fontSize: 12,
        color: C.t3, textDecoration: "none", letterSpacing: "0.04em",
        transition: "color 0.3s",
      }}
        onMouseEnter={e => e.target.style.color = C.red}
        onMouseLeave={e => e.target.style.color = C.t3}
      >hello@asherprice.co.uk</a>
      </div>
    </footer>
  );
}

/* ═══════════════ APP ═══════════════ */
export default function App() {
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
        input::placeholder,textarea::placeholder{color:${C.t3}}
        @keyframes marquee{0%{transform:translateX(0)}100%{transform:translateX(-33.33%)}}
        @keyframes scrollPulse{0%,100%{opacity:0.3;transform:scaleY(1)}50%{opacity:1;transform:scaleY(1.2)}}
        @media(max-width:640px){.process-grid{grid-template-columns:1fr !important}}
      `}</style>
      <Grain />
      <Navbar />
      <Hero />
      <Marquee />
      <Services />
      <Stats />
      <Process />
      <WhyLocal />
      <Contact />
      <Footer />
      <Chatbot />
    </div>
  );
}
