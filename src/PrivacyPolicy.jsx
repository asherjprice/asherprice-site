import { AP, Shell, SectionHeader, useMobile } from "./ap-chrome";

const SECTIONS = [
  {
    n: "01",
    title: "Who I am",
    body: [
      `I'm Asher Price, a web designer based in Blackwood, South Wales. I operate under the trading name "Asher Price" and can be contacted at hello@asherprice.co.uk.`,
    ],
  },
  {
    n: "02",
    title: "What data I collect",
    body: [
      `When you contact me through my website, email, or phone, I may collect:`,
    ],
    list: ["Your name", "Email address", "Phone number (if provided)", "Business name and details", "Any information you include in your message"],
    after: `I do not use cookies for tracking. I do not use Google Analytics or any third-party analytics tools on this website.`,
  },
  {
    n: "03",
    title: "Why I collect it",
    body: [`I use your information solely to:`],
    list: ["Respond to your enquiry", "Provide web design services you've requested", "Send invoices and service-related communications"],
    after: `I will never sell, share, or pass your data to third parties for marketing purposes.`,
  },
  {
    n: "04",
    title: "How long I keep it",
    body: [`I keep your contact details for as long as we have an active business relationship. If you ask me to delete your data, I will do so within 30 days.`],
  },
  {
    n: "05",
    title: "Your rights",
    body: [`Under UK GDPR, you have the right to:`],
    list: ["Request a copy of your personal data", "Request correction of inaccurate data", "Request deletion of your data", "Withdraw consent at any time"],
    after: `To exercise any of these rights, email me at hello@asherprice.co.uk.`,
  },
  {
    n: "06",
    title: "Third-party services",
    body: [
      `This website is hosted on Cloudflare Pages. Cloudflare may collect basic server logs (IP address, page visited) as part of their infrastructure. See Cloudflare's privacy policy for details.`,
      `Client websites I build are also hosted on Cloudflare Pages unless otherwise agreed. The same Cloudflare hosting terms apply.`,
    ],
  },
  {
    n: "07",
    title: "Changes to this policy",
    body: [`I may update this policy from time to time. Any changes will be posted on this page with an updated date.`],
  },
  {
    n: "08",
    title: "Contact",
    body: [`If you have questions about this privacy policy, contact me at hello@asherprice.co.uk.`],
  },
];

export default function PrivacyPolicy() {
  const mobile = useMobile();
  return (
    <Shell>
      <main style={{
        background: AP.slate, color: AP.off,
        padding: mobile ? "64px 22px 96px" : "96px 36px 128px",
      }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <SectionHeader
            mobile={mobile}
            index="01 · LEGAL"
            welsh="Preifatrwydd"
            title={<>Privacy <span style={{ fontFamily: AP.italic, fontStyle: "italic", color: AP.red, fontWeight: 400 }}>policy</span>.</>}
            right={<>Plain-language version of the usual legal page.<br/>Last updated 20 April 2026.</>}
          />

          <div style={{ marginTop: 48, display: "grid", gap: 0 }}>
            {SECTIONS.map((s) => (
              <section key={s.n} style={{
                padding: "32px 0",
                borderBottom: `1px solid ${AP.rule}`,
                display: "grid",
                gridTemplateColumns: mobile ? "1fr" : "80px 1fr",
                gap: mobile ? 14 : 32,
                alignItems: "start",
              }}>
                <div style={{
                  fontFamily: AP.mono, fontSize: 13, letterSpacing: "0.16em",
                  color: AP.red,
                }}>// {s.n}</div>
                <div>
                  <h2 style={{
                    margin: "0 0 18px", fontFamily: AP.display, fontWeight: 500,
                    fontSize: mobile ? 26 : 34, letterSpacing: "-0.025em",
                    color: AP.off,
                  }}>{s.title}</h2>
                  {s.body.map((p, i) => (
                    <p key={i} style={{
                      margin: "0 0 14px", fontSize: 16, lineHeight: 1.65,
                      color: AP.off2, textWrap: "pretty", maxWidth: 640,
                    }}>{p}</p>
                  ))}
                  {s.list && (
                    <ul style={{
                      margin: "8px 0 14px", padding: 0, listStyle: "none",
                      display: "grid", gap: 8, fontSize: 15, lineHeight: 1.55,
                      color: AP.off2,
                    }}>
                      {s.list.map((li, i) => (
                        <li key={i} style={{ display: "grid", gridTemplateColumns: "18px 1fr" }}>
                          <span style={{ color: AP.brass }}>—</span>
                          <span>{li}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {s.after && (
                    <p style={{
                      margin: "0", fontSize: 16, lineHeight: 1.65,
                      color: AP.off2, textWrap: "pretty", maxWidth: 640,
                    }}>{s.after}</p>
                  )}
                </div>
              </section>
            ))}
          </div>
        </div>
      </main>
    </Shell>
  );
}
