const C = {
  red: "#C8102E", bg: "#08090B", card: "#101218",
  border: "#1B1E26", t1: "#F0EDEA", t2: "#9B9DA4", t3: "#5C5F68",
};

const sectionStyle = { marginBottom: 32 };
const h2Style = {
  fontFamily: "'Playfair Display',Georgia,serif",
  fontSize: 20, fontWeight: 700, color: C.t1, marginBottom: 12,
};
const pStyle = {
  fontFamily: "'Inter',sans-serif", fontSize: 14,
  color: C.t2, lineHeight: 1.7, marginBottom: 10,
};

export default function PrivacyPolicy() {
  return (
    <div style={{ background: C.bg, minHeight: "100vh" }}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Playfair+Display:wght@700;800&display=swap" rel="stylesheet" />

      {/* Nav */}
      <nav style={{
        padding: "20px clamp(24px,6vw,72px)",
        borderBottom: `1px solid ${C.border}`,
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <a href="/" style={{
          fontFamily: "'Playfair Display',Georgia,serif",
          fontSize: 18, fontWeight: 800, color: C.t1, textDecoration: "none",
        }}>Asher Price</a>
        <a href="/" style={{
          fontFamily: "'Inter',sans-serif", fontSize: 13,
          color: C.t3, textDecoration: "none",
        }}>← Back to home</a>
      </nav>

      {/* Content */}
      <main style={{
        maxWidth: 720, margin: "0 auto",
        padding: "60px clamp(24px,6vw,72px) 100px",
      }}>
        <h1 style={{
          fontFamily: "'Playfair Display',Georgia,serif",
          fontSize: "clamp(28px,4vw,36px)", fontWeight: 800,
          color: C.t1, marginBottom: 8,
        }}>Privacy Policy</h1>
        <p style={{ ...pStyle, marginBottom: 40 }}>Last updated: 20 April 2026</p>

        <div style={sectionStyle}>
          <h2 style={h2Style}>Who I am</h2>
          <p style={pStyle}>
            I'm Asher Price, a web designer based in Blackwood, South Wales. I operate under the trading name "Asher Price" and can be contacted at hello@asherprice.co.uk.
          </p>
        </div>

        <div style={sectionStyle}>
          <h2 style={h2Style}>What data I collect</h2>
          <p style={pStyle}>When you contact me through my website, email, or phone, I may collect:</p>
          <ul style={{ ...pStyle, paddingLeft: 20 }}>
            <li>Your name</li>
            <li>Email address</li>
            <li>Phone number (if provided)</li>
            <li>Business name and details</li>
            <li>Any information you include in your message</li>
          </ul>
          <p style={pStyle}>
            I do not use cookies for tracking. I do not use Google Analytics or any third-party analytics tools on this website.
          </p>
        </div>

        <div style={sectionStyle}>
          <h2 style={h2Style}>Why I collect it</h2>
          <p style={pStyle}>I use your information solely to:</p>
          <ul style={{ ...pStyle, paddingLeft: 20 }}>
            <li>Respond to your enquiry</li>
            <li>Provide web design services you've requested</li>
            <li>Send invoices and service-related communications</li>
          </ul>
          <p style={pStyle}>
            I will never sell, share, or pass your data to third parties for marketing purposes.
          </p>
        </div>

        <div style={sectionStyle}>
          <h2 style={h2Style}>How long I keep it</h2>
          <p style={pStyle}>
            I keep your contact details for as long as we have an active business relationship. If you ask me to delete your data, I will do so within 30 days.
          </p>
        </div>

        <div style={sectionStyle}>
          <h2 style={h2Style}>Your rights</h2>
          <p style={pStyle}>Under UK GDPR, you have the right to:</p>
          <ul style={{ ...pStyle, paddingLeft: 20 }}>
            <li>Request a copy of your personal data</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Withdraw consent at any time</li>
          </ul>
          <p style={pStyle}>
            To exercise any of these rights, email me at hello@asherprice.co.uk.
          </p>
        </div>

        <div style={sectionStyle}>
          <h2 style={h2Style}>Third-party services</h2>
          <p style={pStyle}>
            This website is hosted on Cloudflare Pages. Cloudflare may collect basic server logs (IP address, page visited) as part of their infrastructure. See Cloudflare's privacy policy for details.
          </p>
          <p style={pStyle}>
            Client websites I build are also hosted on Cloudflare Pages unless otherwise agreed. The same Cloudflare hosting terms apply.
          </p>
        </div>

        <div style={sectionStyle}>
          <h2 style={h2Style}>Changes to this policy</h2>
          <p style={pStyle}>
            I may update this policy from time to time. Any changes will be posted on this page with an updated date.
          </p>
        </div>

        <div style={sectionStyle}>
          <h2 style={h2Style}>Contact</h2>
          <p style={pStyle}>
            If you have questions about this privacy policy, contact me at hello@asherprice.co.uk.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer style={{ padding: "48px clamp(24px,6vw,72px)", borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
          <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 12, color: C.t3 }}>
            © 2026 Asher Price · Blackwood, South Wales
          </span>
        </div>
      </footer>
    </div>
  );
}
