import { useState, useEffect } from "react";
import Chatbot from "./Chatbot";
import { AP, Shell, SectionHeader, Eyebrow, Btn, useMobile } from "./ap-chrome";

/* ─── Demo 1: AI assistant chat ─── */
function DemoChat() {
  const [i, setI] = useState(0);
  const convo = [
    { role: "user", text: "Are you open Sunday?" },
    { role: "bot",  text: "We're open 10am–6pm Sunday. Kitchen stops at 5.",              meta: "trained on your hours" },
    { role: "user", text: "Can I book a table for 6?" },
    { role: "bot",  text: "Course — what time works? Sundays fill after 1pm.",            meta: "hand-off to booking" },
    { role: "user", text: "Do you do gluten free?" },
    { role: "bot",  text: "Yes — most of the menu has a GF option, flag it at the table and chef will sort.", meta: "knows the allergen policy" },
  ];
  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % (convo.length + 2)), 1500);
    return () => clearInterval(t);
  }, []);
  return (
    <div style={{ padding: "20px 22px", display: "grid", gap: 10, minHeight: 320 }}>
      {convo.slice(0, i).map((m, j) => (
        <div key={j} style={{
          justifySelf: m.role === "user" ? "end" : "start", maxWidth: "80%",
          padding: "10px 12px", fontSize: 14, lineHeight: 1.4,
          background: m.role === "user" ? AP.slate3 : "rgba(163,19,42,0.18)",
          color: AP.off,
          borderLeft: `2px solid ${m.role === "bot" ? AP.red : AP.brass}`,
        }}>
          {m.text}
          {m.meta && <div style={{ marginTop: 4, fontFamily: AP.mono, fontSize: 9, color: AP.dim, letterSpacing: "0.08em" }}>↳ {m.meta}</div>}
        </div>
      ))}
      {i <= convo.length && <div style={{ fontFamily: AP.mono, fontSize: 11, color: AP.dim }}><span className="ap-blink" style={{ color: AP.red }}>▍</span> typing…</div>}
    </div>
  );
}

/* ─── Demo 2: Ordering ─── */
function DemoOrder() {
  const [qty, setQty] = useState({ a: 1, b: 0, c: 2, d: 0 });
  const items = [
    { k: "a", name: "Margherita",        price: 9.50 },
    { k: "b", name: "Valleys Pepperoni", price: 11.00 },
    { k: "c", name: "Garlic Bread",      price: 4.50 },
    { k: "d", name: "Local IPA",         price: 5.50 },
  ];
  const total = items.reduce((s, it) => s + qty[it.k] * it.price, 0);
  return (
    <div style={{ padding: "16px 20px", display: "grid", gap: 10 }}>
      {items.map((it) => (
        <div key={it.k} style={{
          display: "grid", gridTemplateColumns: "1fr 80px 90px", alignItems: "center", gap: 10,
          paddingBottom: 10, borderBottom: `1px dashed ${AP.rule}`,
        }}>
          <div>
            <div style={{ fontFamily: AP.display, fontSize: 15, fontWeight: 500 }}>{it.name}</div>
            <div style={{ fontFamily: AP.mono, fontSize: 10, color: AP.dim, marginTop: 2 }}>£{it.price.toFixed(2)}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "center", fontFamily: AP.mono, fontSize: 13 }}>
            <button onClick={() => setQty((q) => ({ ...q, [it.k]: Math.max(0, q[it.k] - 1) }))} style={{
              width: 24, height: 24, background: "transparent", color: AP.off, border: `1px solid ${AP.ruleStr}`, cursor: "pointer",
            }}>–</button>
            <span style={{ width: 20, textAlign: "center" }}>{qty[it.k]}</span>
            <button onClick={() => setQty((q) => ({ ...q, [it.k]: q[it.k] + 1 }))} style={{
              width: 24, height: 24, background: AP.red, color: AP.off, border: "none", cursor: "pointer",
            }}>+</button>
          </div>
          <div style={{ textAlign: "right", fontFamily: AP.mono, fontSize: 13, color: AP.off }}>£{(qty[it.k] * it.price).toFixed(2)}</div>
        </div>
      ))}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 6, fontFamily: AP.mono, fontSize: 13, color: AP.off }}>
        <span style={{ color: AP.dim, letterSpacing: "0.12em" }}>TOTAL</span>
        <span style={{ fontFamily: AP.display, fontSize: 28, fontWeight: 600, letterSpacing: "-0.02em" }}>£{total.toFixed(2)}</span>
      </div>
      <button style={{
        marginTop: 4, padding: 12, background: AP.red, color: AP.off, border: "none",
        fontFamily: AP.mono, fontSize: 11, letterSpacing: "0.14em", cursor: "pointer",
        textAlign: "left", display: "flex", justifyContent: "space-between",
      }}><span>PAY & CHECKOUT</span><span>→</span></button>
    </div>
  );
}

/* ─── Demo 3: Booking ─── */
function DemoBooking() {
  const [slot, setSlot] = useState(2);
  const [service, setService] = useState(0);
  const services = [
    { name: "Skin fade",     mins: 30, price: 18 },
    { name: "Fade + beard",  mins: 45, price: 26 },
    { name: "Full cut",      mins: 60, price: 32 },
  ];
  const slots = ["09:00", "09:30", "10:00", "10:30", "11:00", "—", "13:00", "13:30", "14:00", "—", "15:30", "16:00"];
  return (
    <div style={{ padding: "18px 20px", display: "grid", gap: 14 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6 }}>
        {services.map((s, i) => (
          <button key={i} onClick={() => setService(i)} style={{
            padding: "12px 10px", border: `1px solid ${AP.ruleStr}`, cursor: "pointer",
            background: service === i ? AP.red : "transparent", color: AP.off, textAlign: "left",
            display: "grid", gap: 4,
          }}>
            <span style={{ fontFamily: AP.display, fontSize: 13, fontWeight: 500 }}>{s.name}</span>
            <span style={{ fontFamily: AP.mono, fontSize: 10, color: service === i ? AP.off : AP.dim, letterSpacing: "0.08em" }}>
              {s.mins} min · £{s.price}
            </span>
          </button>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <span style={{ fontFamily: AP.mono, fontSize: 10, color: AP.brass, letterSpacing: "0.16em" }}>CHOOSE A SLOT</span>
        <span style={{ fontFamily: AP.mono, fontSize: 10, color: AP.dim, letterSpacing: "0.14em" }}>TUE · 23 APR</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
        {slots.map((s, i) => (
          <button key={i} disabled={s === "—"} onClick={() => setSlot(i)} style={{
            padding: "10px 6px", border: `1px solid ${s === "—" ? "transparent" : AP.ruleStr}`,
            background: slot === i ? AP.red : (s === "—" ? "transparent" : AP.slate3),
            color: s === "—" ? AP.dim : AP.off,
            fontFamily: AP.mono, fontSize: 12, cursor: s === "—" ? "default" : "pointer",
            textDecoration: s === "—" ? "line-through" : "none",
          }}>{s}</button>
        ))}
      </div>
      <div style={{ padding: "12px 14px", background: AP.slate3, fontFamily: AP.mono, fontSize: 12,
        display: "flex", justifyContent: "space-between" }}>
        <span style={{ color: AP.brass }}>→ confirming {services[service].name} at {slots[slot]}</span>
        <span>£{services[service].price} · SMS</span>
      </div>
    </div>
  );
}

/* ─── Demo 4: Loyalty ─── */
function DemoLoyalty() {
  const [n, setN] = useState(5);
  const total = 8;
  return (
    <div style={{ padding: "18px 20px", display: "grid", gap: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <div style={{ fontFamily: AP.display, fontSize: 16, fontWeight: 500 }}>Rhymney Roasters</div>
        <div style={{ fontFamily: AP.mono, fontSize: 10, color: AP.dim, letterSpacing: "0.14em" }}>CARD № 0042</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} style={{
            aspectRatio: "1", display: "grid", placeItems: "center",
            border: `1px solid ${AP.ruleStr}`,
            background: i < n ? AP.red : "transparent",
            color: AP.off, fontFamily: AP.display, fontSize: 20, fontWeight: 600,
          }}>{i < n ? "✕" : ""}</div>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: AP.mono, fontSize: 12, color: AP.off }}>
        <span><span style={{ color: AP.dim }}>progress · </span>{n} / {total}</span>
        <button onClick={() => setN((x) => (x + 1) % (total + 1))} style={{
          padding: "8px 12px", background: "transparent", color: AP.off,
          border: `1px solid ${AP.ruleStr}`, fontFamily: AP.mono, fontSize: 11, cursor: "pointer",
          letterSpacing: "0.12em",
        }}>+ STAMP</button>
      </div>
      <div style={{ fontFamily: AP.mono, fontSize: 11, color: AP.brass, letterSpacing: "0.12em" }}>
        → free flat white at 8
      </div>
    </div>
  );
}

const DEMOS = [
  {
    n: "01", tag: "AI ASSISTANT",    welsh: "Sgwrsio",     title: "Live chat",
    lead: "Trained on your hours, menu, booking policy — handles the questions you answer a hundred times a week.",
    bullets: [
      "Answers 24/7, never sleeps, never snaps",
      "Hands off to booking, ordering or a real email when it matters",
      "Trained only on what you give it — no hallucinations, no made-up prices",
      "Works in the corner of your site or full-screen, your call",
    ],
    Demo: DemoChat,
    ctaText: "Add an assistant to your site",
  },
  {
    n: "02", tag: "ONLINE ORDERING", welsh: "Archebu",     title: "Takeaway orders",
    lead: "Customers order directly from your site. You keep every pound — no Deliveroo commission, no middleman.",
    bullets: [
      "Live total, quantity buttons, real payment via Stripe",
      "SMS or email the moment an order lands",
      "Connects to your existing till, or runs standalone",
      "Works on any phone, no app required",
    ],
    Demo: DemoOrder,
    ctaText: "See ordering on a real demo",
  },
  {
    n: "03", tag: "BOOKING SYSTEM",  welsh: "Bwcio",       title: "Appointments",
    lead: "Pick a service, pick a time, done. Works for any appointment business — barbers, salons, trades, clinics.",
    bullets: [
      "Live availability synced from your calendar",
      "Automatic SMS reminders before the appointment",
      "Cancel / reschedule links in the reminder",
      "No double-booking, ever",
    ],
    Demo: DemoBooking,
    ctaText: "See a booking demo in use",
  },
  {
    n: "04", tag: "LOYALTY CARD",    welsh: "Teyrngarwch", title: "Digital stamps",
    lead: "Replace paper cards with a tap-and-go digital version. Customers don't lose them. You see who's close to a reward.",
    bullets: [
      "Works on any phone — no app download, nothing to install",
      "One-tap stamp from your phone at the till",
      "Reward auto-fires by email or SMS when they hit the target",
      "See who's active, who's lapsed, who's close to a reward",
    ],
    Demo: DemoLoyalty,
    ctaText: "Stamp card on a real demo",
  },
];

function DemoSection({ d, mobile, alt }) {
  const bg = alt ? AP.slate2 : AP.slate;
  return (
    <section style={{
      background: bg, color: AP.off,
      padding: mobile ? "56px 22px" : "80px 36px",
      borderTop: `1px solid ${AP.rule}`,
    }}>
      <div style={{
        display: "grid",
        gridTemplateColumns: mobile ? "1fr" : "1fr 1.15fr",
        gap: mobile ? 32 : 56, alignItems: "start",
      }}>
        <div>
          <div style={{
            fontFamily: AP.mono, fontSize: 11, letterSpacing: "0.16em", color: AP.brass,
            display: "flex", gap: 12, alignItems: "baseline", flexWrap: "wrap",
          }}>
            <span>/ {d.n}</span>
            <span>·</span>
            <span>{d.tag}</span>
            <span style={{ fontFamily: AP.italic, fontStyle: "italic", fontSize: 14, letterSpacing: 0 }}>{d.welsh}</span>
          </div>
          <h2 style={{
            margin: "14px 0 0", fontFamily: AP.display, fontWeight: 500,
            fontSize: mobile ? 40 : "clamp(44px, 5vw, 72px)",
            lineHeight: 0.96, letterSpacing: "-0.035em", color: AP.off, textWrap: "balance",
          }}>{d.title}</h2>
          <p style={{
            margin: "20px 0 0", fontSize: 17, lineHeight: 1.55, color: AP.off2, maxWidth: 520, textWrap: "pretty",
          }}>{d.lead}</p>
          <ul style={{
            margin: "20px 0 0", padding: 0, listStyle: "none", display: "grid", gap: 10,
            fontSize: 15, lineHeight: 1.55, color: AP.off2,
          }}>
            {d.bullets.map((b, i) => (
              <li key={i} style={{ display: "grid", gridTemplateColumns: "22px 1fr" }}>
                <span style={{ fontFamily: AP.mono, fontSize: 12, color: AP.red, paddingTop: 2 }}>—</span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
          <div style={{ marginTop: 28 }}>
            <Btn variant="ghost" as="a" href="/#contact">{d.ctaText}</Btn>
          </div>
        </div>
        <div style={{
          border: `1px solid ${AP.ruleStr}`, background: AP.slate3,
        }}>
          <div style={{
            padding: "12px 16px", borderBottom: `1px solid ${AP.rule}`,
            display: "flex", justifyContent: "space-between", alignItems: "center",
            fontFamily: AP.mono, fontSize: 10, letterSpacing: "0.14em", color: AP.dim,
          }}>
            <span>LIVE · INTERACTIVE</span>
            <span style={{ color: AP.moss }}>● try it</span>
          </div>
          <d.Demo/>
        </div>
      </div>
    </section>
  );
}

export default function Examples() {
  const mobile = useMobile();
  return (
    <Shell active="Showcase">
      <main>
        <section style={{
          background: AP.slate, color: AP.off,
          padding: mobile ? "64px 22px 0" : "96px 36px 0",
        }}>
          <SectionHeader
            mobile={mobile}
            index="06 · SHOWCASE"
            welsh="Arddangos"
            title={<>Four working demos. <span style={{ fontFamily: AP.italic, fontStyle: "italic", color: AP.red, fontWeight: 400 }}>Try them.</span></>}
            right={<>Each one is the same feature<br/>I'd build into your site.</>}
          />
          <p style={{
            margin: "28px 0 0", fontSize: 17, lineHeight: 1.55, color: AP.off2, maxWidth: 680,
          }}>
            These aren't videos or mockups — they're real components. Click the buttons, type in the
            chat, stamp the loyalty card. Same stack I drop into client sites.
          </p>
          <div style={{
            marginTop: 32, paddingTop: 20, borderTop: `1px solid ${AP.ruleStr}`,
            display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap",
            fontFamily: AP.mono, fontSize: 11, letterSpacing: "0.14em", color: AP.dim,
          }}>
            <span>All four work standalone or bundled</span>
            <span style={{ color: AP.brass }}>→ ask about bundling for Founding Local</span>
          </div>
        </section>

        {DEMOS.map((d, i) => <DemoSection key={d.n} d={d} mobile={mobile} alt={i % 2 === 1}/>)}

        <section style={{
          background: AP.off, color: AP.slate,
          padding: mobile ? "64px 22px" : "96px 36px",
        }}>
          <div style={{ maxWidth: 820, margin: "0 auto", textAlign: "center" }}>
            <Eyebrow color={AP.redDeep}>Add one — or all four</Eyebrow>
            <h2 style={{
              margin: "18px 0 0", fontFamily: AP.display, fontWeight: 500,
              fontSize: mobile ? 44 : "clamp(48px, 6vw, 84px)",
              lineHeight: 0.95, letterSpacing: "-0.035em", color: AP.slate,
            }}>
              Want any of this on your site?<br/>
              <span style={{ fontFamily: AP.italic, fontStyle: "italic", fontWeight: 400, color: AP.red }}>
                Let's talk.
              </span>
            </h2>
            <p style={{ margin: "24px auto 32px", maxWidth: 560, fontSize: 17, lineHeight: 1.55, color: "#3b3e3a" }}>
              I'll tell you honestly whether the feature would actually earn its keep for your
              business. No hype. If it won't, I won't sell it to you.
            </p>
            <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
              <Btn as="a" href="/#contact">Book a free chat</Btn>
              <a href="/founding-local" style={{
                display: "inline-flex", alignItems: "center", justifyContent: "space-between", gap: 14,
                padding: "14px 20px", fontFamily: AP.mono, fontSize: 12, letterSpacing: "0.12em",
                textTransform: "uppercase", textDecoration: "none",
                background: "transparent", color: AP.slate, border: `1px solid ${AP.slate}`,
              }}><span>Founding Local</span><span aria-hidden>→</span></a>
            </div>
          </div>
        </section>

        <style>{`
          .ap-blink { animation: apblink 1s steps(2) infinite }
          @keyframes apblink { 50% { opacity: 0 } }
        `}</style>
      </main>
      <Chatbot />
    </Shell>
  );
}
