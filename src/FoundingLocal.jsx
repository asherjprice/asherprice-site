import { useState } from "react";
import Chatbot from "./Chatbot";
import { AP, Shell, SectionHeader, Eyebrow, Btn, useMobile } from "./ap-chrome";

const INCLUDED = [
  { n: "01", title: "Custom website",              body: "Designed and built from scratch for your business. Not a template, not a theme — yours." },
  { n: "02", title: "Hosting on fast UK servers",  body: "Your site runs on Cloudflare's global network. Fast everywhere, especially locally." },
  { n: "03", title: "Your own domain",             body: "yourbusiness.co.uk — registered and configured. Included in the monthly cost." },
  { n: "04", title: "One free update every month", body: "New menu? Updated prices? Seasonal banner? One change per month, on me." },
  { n: "05", title: "Uptime monitoring",           body: "I'll know if your site goes down before you do. Automatic alerts, fast fixes." },
  { n: "06", title: "Monthly check-in call",       body: "A quick call each month. How's the site working? Anything need changing? Keeping it personal." },
];

const NOT_INCLUDED = [
  "AI assistants, booking systems, online ordering, loyalty cards (available as paid add-ons)",
  "Complex e-commerce with hundreds of products",
  "Ongoing content writing, photography, or copy rewrites",
  "Paid advertising campaigns (Facebook Ads, Google Ads)",
];

const STEPS = [
  { n: "01", welsh: "Sgwrs",   title: "Chat",        body: "Free, no-pressure conversation. Tell me about your business. I'll ask what you actually need.", tag: "usually 20 min" },
  { n: "02", welsh: "Brîff",   title: "Brief",       body: "I send a plain-English outline of what I'll build. You say yes, adjust, or walk away.",        tag: "next day"        },
  { n: "03", welsh: "Adeilad", title: "Build",       body: "I design and build. You see drafts throughout. One round of revisions included.",             tag: "5–14 days"       },
  { n: "04", welsh: "Lansio",  title: "Go live",     body: "£100 setup. £50/mo from month two. Site is live, monitored, maintained. Locked in for life.", tag: "same-day cutover" },
];

const INDUSTRIES = [
  { label: "Cafés",       slug: "cafe" },
  { label: "Barbers",     slug: "barber" },
  { label: "Pubs",        slug: "pub" },
  { label: "Trades",      slug: "plumber" },
  { label: "Salons",      slug: "salon" },
  { label: "Takeaways",   slug: "pizza" },
  { label: "Photography", slug: "photographer" },
  { label: "Retail",      slug: "vape" },
  { label: "Restaurants", slug: "indian" },
];

const FAQS = [
  { q: "What if I want to cancel?",                          a: "You can cancel anytime. No lock-in, no exit fees. If you cancel, your site comes down at the end of the paid month. I'll export your content and hand it over if you want to take it elsewhere." },
  { q: "Do I own the website?",                              a: "You own all the content — text, images, branding. The hosting and code are part of the service, like renting a shop unit. If you leave, I'll give you everything you need to rebuild elsewhere, or I can hand over the code for a one-off fee." },
  { q: "What counts as an 'update'?",                        a: "One update per month means a reasonable change — new menu, updated prices, a new photo gallery, seasonal banner, that sort of thing. Not a full redesign. If you need more than one change a month, I can arrange that separately." },
  { q: "What if I need something more complex later?",       a: "AI assistants, booking systems, loyalty cards, online ordering — all available as paid add-ons. I'll talk you through what makes sense for your business once the website is earning its keep. No pressure to add anything." },
  { q: "Why so cheap?",                                      a: "I'm building my portfolio. The first 10 clients get honest pricing in exchange for honest feedback and a testimonial. After the 10 are filled, Founding Local closes permanently and standard rates apply." },
  { q: "How long does it take?",                             a: "Most sites go live within 1–2 weeks of your first message. You'll see a draft before anything goes public, and I tweak until you're happy with it." },
];

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: `1px solid ${AP.rule}` }}>
      <button onClick={() => setOpen(!open)} style={{
        width: "100%", padding: "24px 0", background: "transparent", border: "none", cursor: "pointer",
        display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, textAlign: "left",
      }}>
        <span style={{
          fontFamily: AP.display, fontSize: "clamp(18px, 2vw, 22px)", fontWeight: 500,
          color: AP.off, letterSpacing: "-0.01em",
        }}>{q}</span>
        <span style={{
          fontFamily: AP.mono, fontSize: 22, color: open ? AP.red : AP.dim,
          flexShrink: 0, transition: "color 0.2s",
        }}>{open ? "–" : "+"}</span>
      </button>
      <div style={{
        maxHeight: open ? 320 : 0, overflow: "hidden",
        transition: "max-height 0.4s cubic-bezier(0.16,1,0.3,1)",
      }}>
        <p style={{
          margin: 0, paddingBottom: 24, maxWidth: 720,
          fontSize: 16, lineHeight: 1.65, color: AP.off2, textWrap: "pretty",
        }}>{a}</p>
      </div>
    </div>
  );
}

export default function FoundingLocal() {
  const mobile = useMobile();
  return (
    <Shell>
      <main>
        {/* ─── Hero ─── */}
        <section style={{
          background: AP.off, color: AP.slate,
          padding: mobile ? "64px 22px" : "96px 36px 80px",
          position: "relative",
        }}>
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            paddingBottom: 16, borderBottom: `2px solid ${AP.slate}`,
            fontFamily: AP.mono, fontSize: 11, letterSpacing: "0.18em", color: AP.redDeep,
          }}>
            <span>/ 01 · FOUNDING LOCAL · <span style={{ fontFamily: AP.italic, fontStyle: "italic", letterSpacing: 0, fontSize: 14 }}>Lleol</span></span>
            <span style={{ color: AP.slate, letterSpacing: "0.14em" }}>VALID · PLACES REMAINING · 10 / 10</span>
          </div>

          <div style={{
            marginTop: 36, display: "grid",
            gridTemplateColumns: mobile ? "1fr" : "1.1fr 1fr",
            gap: mobile ? 40 : 56, alignItems: "start",
          }}>
            <div>
              <h1 style={{
                margin: 0, fontFamily: AP.display, fontWeight: 500,
                fontSize: mobile ? 56 : "clamp(72px, 8vw, 132px)",
                lineHeight: 0.9, letterSpacing: "-0.04em", color: AP.slate, textWrap: "balance",
              }}>
                A proper website.<br/>
                <span style={{ color: AP.red }}>£100</span> setup.<br/>
                <span style={{ fontFamily: AP.italic, fontStyle: "italic", fontWeight: 400 }}>£50 / month.</span>
              </h1>
              <p style={{ margin: "32px 0 0", fontSize: 19, lineHeight: 1.55, color: "#3b3e3a", maxWidth: 560, textWrap: "pretty" }}>
                The first 10 local businesses in Blackwood and the Valleys get a custom site,
                hosted, maintained and monitored — at prices that don't return. The rate is
                <em style={{ fontFamily: AP.italic }}> locked in for life</em>.
              </p>
              <p style={{ margin: "16px 0 0", fontSize: 15, lineHeight: 1.6, color: "#3b3e3a", maxWidth: 560 }}>
                Why? I'm building my portfolio. You're getting my best work at early-stage pricing.
                Straight trade.
              </p>
            </div>

            {/* Ticket stub */}
            <div style={{
              border: `1.5px solid ${AP.slate}`, padding: "24px 26px",
              position: "relative", background: "#F3EEE2",
            }}>
              <div style={{
                position: "absolute", top: -10, left: 20, padding: "0 8px",
                background: "#F3EEE2",
                fontFamily: AP.mono, fontSize: 10, letterSpacing: "0.16em", color: AP.redDeep,
              }}>WHAT YOU GET</div>
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
                    paddingBottom: 10,
                    borderBottom: i < 5 ? `1px dashed rgba(21,23,27,0.25)` : "none",
                  }}>
                    <span style={{ fontFamily: AP.mono, fontSize: 11, color: AP.redDeep, paddingTop: 2 }}>{String(i + 1).padStart(2, "0")}</span>
                    <span style={{ color: AP.slate }}>{x}</span>
                  </li>
                ))}
              </ul>
              <div style={{
                marginTop: 20, paddingTop: 14, borderTop: `2px solid ${AP.slate}`,
                display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10,
              }}>
                <a href="#included" style={{
                  display: "inline-flex", alignItems: "center", justifyContent: "space-between", gap: 14,
                  padding: "14px 20px", fontFamily: AP.mono, fontSize: 12, letterSpacing: "0.12em",
                  textTransform: "uppercase", textDecoration: "none",
                  background: "transparent", color: AP.slate, border: `1px solid ${AP.slate}`,
                }}><span>Read more</span><span aria-hidden>↓</span></a>
                <Btn as="a" href="/#contact">Claim a place</Btn>
              </div>
            </div>
          </div>

          {/* 10 places grid */}
          <div style={{
            marginTop: 48, paddingTop: 22, borderTop: `1px solid rgba(21,23,27,0.2)`,
            display: "grid",
            gridTemplateColumns: mobile ? "1fr" : "auto 1fr",
            gap: mobile ? 20 : 32, alignItems: "center",
          }}>
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

        {/* ─── What's included ─── */}
        <section id="included" style={{
          background: AP.slate, color: AP.off,
          padding: mobile ? "64px 22px" : "96px 36px",
        }}>
          <SectionHeader
            mobile={mobile}
            index="02 · WHAT'S INCLUDED"
            welsh="Beth sy'n dod"
            title={<>Everything you need.<br/><span style={{ fontFamily: AP.italic, fontStyle: "italic", color: AP.red, fontWeight: 400 }}>Nothing you don't.</span></>}
            right={<>Six things, one pair of hands,<br/>one monthly bill.</>}
          />
          <div style={{
            marginTop: 40,
            display: "grid",
            gridTemplateColumns: mobile ? "1fr" : "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 16,
          }}>
            {INCLUDED.map((x) => (
              <div key={x.n} style={{
                border: `1px solid ${AP.ruleStr}`, background: AP.slate2,
                padding: "24px 26px",
                display: "grid", gap: 12,
              }}>
                <div style={{ fontFamily: AP.mono, fontSize: 11, letterSpacing: "0.16em", color: AP.brass }}>/ {x.n}</div>
                <h3 style={{
                  margin: 0, fontFamily: AP.display, fontWeight: 500, fontSize: 24,
                  letterSpacing: "-0.02em", color: AP.off,
                }}>{x.title}</h3>
                <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: AP.off2, textWrap: "pretty" }}>{x.body}</p>
              </div>
            ))}
          </div>

          <div style={{
            marginTop: 56, paddingTop: 32, borderTop: `1px solid ${AP.ruleStr}`,
            display: "grid",
            gridTemplateColumns: mobile ? "1fr" : "200px 1fr",
            gap: 32,
          }}>
            <Eyebrow>What's not</Eyebrow>
            <div>
              <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "grid", gap: 12, fontSize: 15, color: AP.off2 }}>
                {NOT_INCLUDED.map((x, i) => (
                  <li key={i} style={{ display: "grid", gridTemplateColumns: "18px 1fr", lineHeight: 1.55 }}>
                    <span style={{ color: AP.brass }}>—</span>
                    <span>{x}</span>
                  </li>
                ))}
              </ul>
              <p style={{ margin: "18px 0 0", fontSize: 13, color: AP.dim, fontStyle: "italic" }}>
                If you want any of the above, we can talk about it separately. I'd rather undersell
                than oversell — the offer is what's in the ticket above, not more.
              </p>
            </div>
          </div>
        </section>

        {/* ─── Process ─── */}
        <section style={{
          background: AP.off, color: AP.slate,
          padding: mobile ? "64px 22px" : "96px 36px",
        }}>
          <SectionHeader
            mobile={mobile} invert
            index="03 · HOW IT WORKS"
            welsh="Sut mae'n gweithio"
            title={<>Four steps. <span style={{ fontFamily: AP.italic, fontStyle: "italic", color: AP.red, fontWeight: 400 }}>Start to live</span> in under two weeks.</>}
            right={<>No agency handoffs,<br/>no project manager layer.</>}
          />
          <div style={{
            marginTop: 40, position: "relative",
            display: "grid",
            gridTemplateColumns: mobile ? "1fr" : "repeat(4, 1fr)",
            borderTop: `1px solid ${AP.slate}`,
          }}>
            {!mobile && (
              <div style={{
                position: "absolute", top: 48, left: "12.5%", right: "12.5%", height: 1,
                borderTop: `1px dashed ${AP.slate}`, opacity: 0.5,
              }}/>
            )}
            {STEPS.map((s, i) => (
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
                <h3 style={{ margin: "6px 0 0", fontFamily: AP.display, fontSize: 32, fontWeight: 600, letterSpacing: "-0.025em", lineHeight: 1 }}>{s.title}</h3>
                <p style={{ margin: "14px 0 18px", fontSize: 15, lineHeight: 1.55, color: "#3b3e3a", maxWidth: 260 }}>{s.body}</p>
                <div style={{ borderTop: `1px solid rgba(21,23,27,0.15)`, paddingTop: 10, fontFamily: AP.mono, fontSize: 11, letterSpacing: "0.08em", color: "#3b3e3a" }}>→ {s.tag}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── Industries ─── */}
        <section style={{
          background: AP.slate, color: AP.off,
          padding: mobile ? "64px 22px" : "96px 36px",
        }}>
          <SectionHeader
            mobile={mobile}
            index="04 · WHO IT'S FOR"
            welsh="I bwy"
            title={<>Any local business.<br/><span style={{ fontFamily: AP.italic, fontStyle: "italic", color: AP.red, fontWeight: 400 }}>Especially yours.</span></>}
            right={<>See an example site for your industry —<br/>or ask and I'll build a mockup.</>}
          />
          <div style={{
            marginTop: 40, display: "grid",
            gridTemplateColumns: mobile ? "repeat(2, 1fr)" : "repeat(3, 1fr)",
            gap: 2,
          }}>
            {INDUSTRIES.map((x, i) => (
              <a key={x.slug} href={`/examples/${x.slug}/index.html`} style={{
                background: AP.slate2, padding: "24px 26px",
                display: "grid", gap: 10,
                fontFamily: AP.display, fontSize: 22, fontWeight: 500,
                letterSpacing: "-0.02em", color: AP.off, textDecoration: "none",
                borderBottom: `2px solid transparent`, transition: "border-color 160ms",
              }}
                onMouseEnter={(e) => e.currentTarget.style.borderBottomColor = AP.red}
                onMouseLeave={(e) => e.currentTarget.style.borderBottomColor = "transparent"}
              >
                <span style={{ fontFamily: AP.mono, fontSize: 10, letterSpacing: "0.16em", color: AP.brass }}>{String(i + 1).padStart(2, "0")} · {x.label.toUpperCase()}</span>
                <span>{x.label}</span>
                <span style={{ fontFamily: AP.mono, fontSize: 11, color: AP.dim, letterSpacing: "0.04em" }}>→ see the demo</span>
              </a>
            ))}
          </div>
        </section>

        {/* ─── FAQ ─── */}
        <section style={{
          background: AP.slate, color: AP.off,
          padding: mobile ? "64px 22px" : "96px 36px",
          borderTop: `1px solid ${AP.rule}`,
        }}>
          <SectionHeader
            mobile={mobile}
            index="05 · FAQ"
            welsh="Cwestiynau"
            title={<>Straight answers. <span style={{ fontFamily: AP.italic, fontStyle: "italic", color: AP.red, fontWeight: 400 }}>No small print.</span></>}
            right={<>Still got a question?<br/>hello@asherprice.co.uk</>}
          />
          <div style={{ marginTop: 40, maxWidth: 900 }}>
            {FAQS.map((f, i) => <FaqItem key={i} q={f.q} a={f.a}/>)}
          </div>
        </section>

        {/* ─── Final CTA ─── */}
        <section style={{
          background: AP.off, color: AP.slate,
          padding: mobile ? "64px 22px" : "96px 36px",
        }}>
          <div style={{ maxWidth: 820, margin: "0 auto", textAlign: "center" }}>
            <Eyebrow color={AP.redDeep}>One of ten</Eyebrow>
            <h2 style={{
              margin: "18px 0 0", fontFamily: AP.display, fontWeight: 500,
              fontSize: mobile ? 48 : "clamp(56px, 7vw, 100px)",
              lineHeight: 0.92, letterSpacing: "-0.04em", color: AP.slate,
            }}>
              Claim your place.<br/>
              <span style={{ fontFamily: AP.italic, fontStyle: "italic", fontWeight: 400, color: AP.red }}>
                Locked in for life.
              </span>
            </h2>
            <p style={{ margin: "28px auto 36px", maxWidth: 560, fontSize: 18, lineHeight: 1.55, color: "#3b3e3a" }}>
              Free chat first. Tell me about your business. I'll tell you honestly whether
              Founding Local is right for you — even if the answer is "not yet."
            </p>
            <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
              <Btn as="a" href="/#contact">Book a free chat</Btn>
              <a href="mailto:hello@asherprice.co.uk?subject=Founding%20Local%20%E2%80%94%20interested" style={{
                display: "inline-flex", alignItems: "center", justifyContent: "space-between", gap: 14,
                padding: "14px 20px", fontFamily: AP.mono, fontSize: 12, letterSpacing: "0.12em",
                textTransform: "uppercase", textDecoration: "none",
                background: "transparent", color: AP.slate, border: `1px solid ${AP.slate}`,
              }}><span>Email hello@asherprice.co.uk</span><span aria-hidden>↗</span></a>
            </div>
          </div>
        </section>
      </main>
      <Chatbot />
    </Shell>
  );
}
