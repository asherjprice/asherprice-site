import Chatbot from "./Chatbot";
import { AP, Shell, SectionHeader, Eyebrow, Btn, useMobile } from "./ap-chrome";

const EXAMPLES = [
  { slug: "vape",         tag: "VAPE SHOP",         welsh: "Siop Anwedd",    title: "Flavour Vapour",           meta: "Neon UI · flavour picker · stock",     description: "Neon-arcade aesthetic with a slot-machine flavour reveal. Bold, memorable, on-brand for the industry." },
  { slug: "indian",       tag: "INDIAN RESTAURANT", welsh: "Bwyty Indiaidd", title: "Jaipur House",             meta: "Spice slider · menu · takeaway",       description: "Spice-heat slider filters the menu from mild to inferno. The kind of feature that genuinely helps customers order — and sells websites." },
  { slug: "pizza",        tag: "PIZZA",             welsh: "Pitsa",          title: "Papa Nello's Pizza",       meta: "Build-your-own · delivery · SMS",      description: "Build-your-own pizza with animated toppings and a live total. Practical, fun, genuinely useful for ordering." },
  { slug: "salon",        tag: "NAIL SALON",        welsh: "Ewinedd",        title: "Lux Nails",                meta: "Booking · reviews · loyalty",          description: "Liquid-glass morphism with aurora backgrounds. Dark-luxury aesthetic, kinetic typography, 5-star reviews visible up front." },
  { slug: "plumber",      tag: "PLUMBER",           welsh: "Plymwr",         title: "Emrys Plumbing",           meta: "Live quote · AI triage · 24h",         description: "Instant quote calculator with a live countdown timer. Pick the job, set urgency, get a price. Trust on sight." },
  { slug: "barber",       tag: "BARBER",            welsh: "Barbwr",         title: "Dai's Chair",              meta: "Ticket-strip booking · gallery",       description: "Ticket-strip layout with a spinning barber pole that reveals prices. Old-school charm, properly built." },
  { slug: "photographer", tag: "PHOTOGRAPHER",      welsh: "Ffotograffydd",  title: "Huw Griffiths Photography", meta: "Portfolio · enquiries",               description: "Horizontal film strip you drag through — portfolio as physical film. No vertical scroll at all." },
  { slug: "cafe",         tag: "CAFÉ",              welsh: "Caffi",          title: "Cwm Coffee Co.",           meta: "Ordering · menu · loyalty",            description: "Interactive coffee configurator — pick your base, size, milk and extras. The site is the ordering experience." },
  { slug: "pub",          tag: "PUB",               welsh: "Tafarn",         title: "The Colliers Arms",        meta: "Events · menu · bookings",             description: "Beer-tap wall — click a handle, watch the pour animation, get tasting notes and price. Built for real-ale pubs." },
];

function ExampleCard({ ex, i, mobile }) {
  return (
    <article style={{
      border: `1px solid ${AP.ruleStr}`, background: AP.slate2,
      display: "grid", gridTemplateRows: "auto auto",
    }}>
      <a href={`/examples/${ex.slug}/index.html`} style={{ display: "block", textDecoration: "none" }}>
        <div style={{
          width: "100%", aspectRatio: "4 / 3", background: AP.slate3,
          position: "relative", overflow: "hidden", borderBottom: `1px solid ${AP.ruleStr}`,
        }}>
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, zIndex: 2,
            height: 22, background: "rgba(0,0,0,0.35)",
            display: "flex", alignItems: "center", gap: 5, padding: "0 10px",
            borderBottom: `1px solid rgba(255,255,255,0.06)`,
          }}>
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
      </a>
      <div style={{ padding: "20px 22px 24px", display: "grid", gap: 8 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline",
          fontFamily: AP.mono, fontSize: 10, letterSpacing: "0.16em", color: AP.brass }}>
          <span>№ {String(i + 1).padStart(2, "0")} · {ex.tag}</span>
          <span style={{ fontFamily: AP.italic, fontStyle: "italic", fontSize: 14, letterSpacing: 0 }}>{ex.welsh}</span>
        </div>
        <a href={`/examples/${ex.slug}/index.html`} style={{
          fontFamily: AP.display, fontSize: 24, fontWeight: 600, letterSpacing: "-0.02em",
          color: AP.off, textDecoration: "none",
        }}>{ex.title}</a>
        <div style={{ fontFamily: AP.mono, fontSize: 11, color: AP.dim, letterSpacing: "0.04em" }}>→ {ex.meta}</div>
        <p style={{ margin: "6px 0 0", fontSize: 14, lineHeight: 1.55, color: AP.off2, textWrap: "pretty" }}>
          {ex.description}
        </p>
        <div style={{ marginTop: 8 }}>
          <Btn variant="ghost" small as="a" href={`/examples/${ex.slug}/index.html`}>Open the site</Btn>
        </div>
      </div>
    </article>
  );
}

export default function ExamplesPage() {
  const mobile = useMobile();
  return (
    <Shell active="Examples">
      <main>
        <section style={{
          background: AP.slate, color: AP.off,
          padding: mobile ? "56px 22px 0" : "80px 36px 0",
        }}>
          <SectionHeader
            mobile={mobile}
            index="05 · EXAMPLES"
            welsh="Enghreifftiau"
            title={<>Nine example sites. <span style={{ fontFamily: AP.italic, fontStyle: "italic", color: AP.red, fontWeight: 400 }}>Real</span> code.</>}
            right={<>Each demo is a working site — click through,<br/>try the features, picture your own.</>}
          />
          <div style={{
            marginTop: 24, paddingTop: 20, borderTop: `1px solid ${AP.ruleStr}`,
            display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12,
            fontFamily: AP.mono, fontSize: 11, letterSpacing: "0.14em", color: AP.dim,
          }}>
            <span>Built from scratch. No templates, no page-builders.</span>
            <span style={{ color: AP.brass }}>→ your industry not shown? I've built 60+ mockups</span>
          </div>
        </section>

        <section style={{
          background: AP.slate, color: AP.off,
          padding: mobile ? "40px 22px 64px" : "64px 36px 96px",
        }}>
          <div style={{ display: "grid",
            gridTemplateColumns: mobile ? "1fr" : "repeat(auto-fit, minmax(320px, 1fr))",
            gap: 16 }}>
            {EXAMPLES.map((ex, i) => <ExampleCard key={ex.slug} ex={ex} i={i} mobile={mobile}/>)}
          </div>
        </section>

        <section style={{
          background: AP.off, color: AP.slate,
          padding: mobile ? "64px 22px" : "96px 36px",
        }}>
          <div style={{ maxWidth: 820, margin: "0 auto", textAlign: "center" }}>
            <Eyebrow color={AP.redDeep}>Your turn</Eyebrow>
            <h2 style={{
              margin: "18px 0 0", fontFamily: AP.display, fontWeight: 500,
              fontSize: mobile ? 44 : "clamp(48px, 6vw, 84px)",
              lineHeight: 0.95, letterSpacing: "-0.035em", color: AP.slate,
            }}>
              Like what you see?<br/>
              <span style={{ fontFamily: AP.italic, fontStyle: "italic", fontWeight: 400, color: AP.red }}>
                Let's build yours.
              </span>
            </h2>
            <p style={{ margin: "24px auto 0", maxWidth: 560, fontSize: 17, lineHeight: 1.55, color: "#3b3e3a" }}>
              10 Founding Local places open — £100 setup, £50/mo, price locked in for life.
              A proper website for your business, built bespoke, launched in under two weeks.
            </p>
            <div style={{
              marginTop: 32, display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap",
            }}>
              <a href="/founding-local" style={{
                display: "inline-flex", alignItems: "center", justifyContent: "space-between", gap: 14,
                padding: "14px 20px", fontFamily: AP.mono, fontSize: 12, letterSpacing: "0.12em",
                textTransform: "uppercase", textDecoration: "none",
                background: "transparent", color: AP.slate, border: `1px solid ${AP.slate}`,
              }}>
                <span>Founding Local</span><span aria-hidden>→</span>
              </a>
              <Btn as="a" href="/#contact">Book a free chat</Btn>
            </div>
          </div>
        </section>
      </main>
      <Chatbot />
    </Shell>
  );
}
