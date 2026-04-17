import { useState, useRef, useEffect } from "react";

const C = {
  red: "#C8102E", redHov: "#E01A38",
  bg: "#08090B", card: "#101218", card2: "#14161D",
  border: "#1B1E26", border2: "#252830",
  t1: "#F0EDEA", t2: "#9B9DA4", t3: "#5C5F68",
};

/* ── Knowledge base ── */
const RESPONSES = {
  greeting: {
    text: "Hi! I'm AP — Asher's virtual assistant. I can help you with anything about our services, pricing, or show you what we've built. What would you like to know?",
    options: ["Services", "Founding Local", "See examples", "Pricing", "Get in touch"],
  },
  services: {
    text: "Here's what I build for local businesses — everything bespoke, nothing off the shelf:",
    bullets: [
      "🌐 **Websites** — Fast, mobile-first, built from scratch. I've built 60+ demos and have a live client (The Westgate Bar).",
      "🤖 **AI Assistants** — Trained on your business. They answer enquiries, book appointments, and work 24/7. Like me, but for your customers.",
      "🛒 **Online Ordering** — Customers order directly from your site. No Deliveroo commission, no middleman.",
      "📅 **Booking Systems** — Pick a service, pick a time, done. Works for barbers, salons, trades — anyone with appointments.",
      "⭐ **Digital Loyalty Cards** — Replace paper stamp cards. Customers collect digitally, you keep them coming back.",
      "⚡ **Automation** — Invoicing, follow-ups, lead capture. If you do it twice, I can automate it.",
    ],
    followUp: "Want details on any of these? Or see live demos on the Showcase page.",
    options: ["Websites", "AI Assistants", "Ordering & Booking", "Founding Local", "See examples", "Get in touch"],
  },
  websites: {
    text: "Every site is designed and coded from scratch — no WordPress, no templates, no themes. Built to be fast, mobile-first, and optimised for Google.\n\nI've built 60+ demo sites across every industry you can think of — cafés, barbers, pubs, plumbers, nail salons, photographers, and more. Plus a live client site for **The Westgate Bar** in Abertillery.\n\nAverage build time is 1–2 weeks. I handle design, build, hosting, domain, and DNS.",
    options: ["See examples", "Founding Local", "Pricing", "Get in touch"],
  },
  "ai assistants": {
    text: "AI assistants trained on your business — your services, your prices, your tone. They answer customer questions 24/7, capture leads, and can book appointments.\n\nThey can live on your website, your Facebook page, or WhatsApp. You're chatting with one right now — imagine this for your business, trained on what you actually do.",
    options: ["See showcase", "Pricing", "Get in touch", "Back to services"],
  },
  "ordering & booking": {
    text: "Two of the most popular add-ons:\n\n**Online Ordering** — customers browse your menu, build their order, and submit it. No commission fees like Deliveroo or Just Eat. It lives on your own website.\n\n**Booking Systems** — customers pick a service, choose a time, and book instantly. Works for barbers, salons, trades, anyone with appointments.\n\nBoth are available as add-ons to any website. You can try live demos on our Showcase page.",
    options: ["See showcase", "Pricing", "Get in touch", "Back to services"],
  },
  "loyalty cards": {
    text: "Digital loyalty cards that replace paper stamp cards. Your customers collect stamps on their phone — no app download needed, it works from your website.\n\nYou control the rewards, track who's coming back, and it costs a fraction of a printed card run. Available as an add-on.",
    options: ["See showcase", "Pricing", "Get in touch", "Back to services"],
  },
  "founding local": {
    text: "**Founding Local** is my launch offer — 10 places only.\n\n**£100 setup + £50/month**, locked in for life. The price never goes up.\n\nWhat's included:\n• Custom website built from scratch\n• Hosting on fast UK servers\n• Your own .co.uk domain\n• One free update every month\n• Uptime monitoring\n• Monthly check-in call\n\nIt's for local businesses in Blackwood and the Valleys. Once the 10 are filled, it closes permanently and standard rates apply (from £300+ setup, £80+/month).",
    options: ["Who's it for?", "See examples", "Claim a place", "Back to services"],
  },
  "who's it for?": {
    text: "Founding Local is built for small local businesses — the kind that are all over the Valleys:\n\n• Cafés & coffee shops\n• Barbers & salons\n• Pubs & bars\n• Trades (plumbers, electricians, roofers)\n• Takeaways & restaurants\n• Florists, beauticians, local professionals\n\nIf you run a local business and don't have a proper website (or have one that's not working for you), this is for you.",
    options: ["Founding Local", "See examples", "Get in touch"],
  },
  "see examples": {
    text: "I've got 9 full interactive website demos you can browse — each one built for a different type of local business:\n\n• **Café** — coffee configurator with animated cup\n• **Pizza shop** — build-your-own pizza with live toppings\n• **Barber** — ticket-strip layout with spinning barber pole\n• **Pub** — beer tap wall with pour animation\n• **Plumber** — instant quote calculator\n• **Nail salon** — liquid glass design with colour try-on\n• **Photographer** — horizontal film strip portfolio\n• **Vape shop** — neon arcade with slot machine reveal\n• **Indian restaurant** — spice heat slider menu\n\nCheck them out at **asherprice.co.uk/examples** — or I can tell you more about any specific one.",
    options: ["Founding Local", "Pricing", "Get in touch"],
  },
  "see showcase": {
    text: "The Showcase page has live demos of individual features you can add to any website:\n\n• **AI Chatbot** — like this one, but trained on your business\n• **Online Ordering** — browse menu, build order, submit\n• **Booking System** — pick service, pick time, done\n• **Digital Loyalty Card** — collect stamps, earn rewards\n\nAll working, all interactive. Try them at **asherprice.co.uk/showcase**.",
    options: ["Services", "Founding Local", "Get in touch"],
  },
  "the westgate": {
    text: "The Westgate Bar in Abertillery is my first live client — a real, paying customer with a website I built and maintain.\n\nIt's proof this isn't just demos — I build and run real sites for real businesses. Their site is live and getting customers through the door.",
    options: ["See examples", "Founding Local", "Get in touch"],
  },
  "how it works": {
    text: "Four steps, no fuss:",
    bullets: [
      "**1. Drop me a message** — email or Facebook. A quick chat about your business — what you do, who you serve, what you need. No jargon.",
      "**2. I design and build** — a working draft within 1–2 weeks. You'll see it before anyone else does.",
      "**3. You review** — we tweak until it's right. Colours, wording, layout — it's your business, it has to feel like yours.",
      "**4. Go live** — £100 setup, then £50/month from month two. Your site is live, monitored, and maintained.",
    ],
    followUp: "That's for Founding Local. For custom projects, the process is similar but pricing is quoted individually.",
    options: ["Founding Local", "Pricing", "Get in touch"],
  },
  pricing: {
    text: "**Founding Local** (first 10 clients):\n• £100 one-off setup\n• £50/month — locked in for life\n• Includes website, hosting, domain, monthly update, monitoring, and check-in call\n\n**Standard rates** (after Founding Local fills):\n• From £300+ setup\n• From £80+/month\n\n**Add-ons** (available for any client):\n• AI chatbot assistant\n• Online ordering system\n• Booking system\n• Digital loyalty cards\n• Social media content\n\nNo 12-month lock-ins. Just 1 month's notice to cancel. The initial chat is always free.",
    options: ["Founding Local", "Get in touch", "Services"],
  },
  "back to services": {
    redirect: "services",
  },
  "claim a place": {
    text: "Nice one! You can claim a Founding Local place two ways:\n\n📧 **Email** — hello@asherprice.co.uk (subject: Founding Local)\n💬 **Facebook** — facebook.com/asherprice.uk\n\nOr drop your details below and I'll pass them to Asher. He'll get back to you within 24 hours.",
    showForm: true,
  },
  "get in touch": {
    text: "You can reach Asher directly:\n\n📧 **Email** — hello@asherprice.co.uk\n💬 **Facebook** — facebook.com/asherprice.uk\n\nOr drop your details below and he'll get back to you within 24 hours. No obligation, no pressure.",
    showForm: true,
  },
  fallback: {
    text: "I'm not sure about that one — but here's what I can help with:",
    options: ["Services", "Founding Local", "See examples", "Pricing", "Get in touch"],
  },
};

/* ── Intent matching ── */
const INTENTS = [
  { key: "founding local", patterns: [
    "founding local", "founding", "£100", "£50", "100 setup", "50 a month",
    "50/month", "launch offer", "first 10", "10 places", "places remaining",
    "founding deal", "special offer", "founding rate",
  ]},
  { key: "claim a place", patterns: [
    "claim", "sign up", "sign me up", "interested", "join", "reserve",
    "want a place", "get a place", "secure", "apply",
  ]},
  { key: "get in touch", patterns: [
    "contact", "get in touch", "reach", "speak", "talk", "call", "phone", "email",
    "message", "enquir", "inquir", "consultation", "free chat", "arrange",
    "meet", "appointment", "quote",
    "how can i", "how do i", "get started", "reach out", "drop a message",
    "want to work", "hire", "need help",
  ]},
  { key: "see examples", patterns: [
    "example", "demo", "demos", "portfolio", "show me", "see what you",
    "what have you built", "sample", "preview", "mock",
    "cafe", "barber", "pub", "plumber", "salon", "pizza",
    "photographer", "vape", "indian", "restaurant",
  ]},
  { key: "see showcase", patterns: [
    "showcase", "features", "chatbot demo", "ordering demo", "booking demo",
    "loyalty demo", "try it", "live demo",
  ]},
  { key: "the westgate", patterns: [
    "westgate", "client", "live site", "real site", "real client",
    "abertillery", "who have you built for",
  ]},
  { key: "services", patterns: [
    "services", "what do you do", "what do you offer", "what can you",
    "what you do", "offerings", "help with", "provide", "do you do",
    "tell me about", "what's available", "full package",
  ]},
  { key: "websites", patterns: [
    "website", "web site", "landing page", "web design", "web dev",
    "build a site", "build me a", "new site", "redesign",
  ]},
  { key: "ai assistants", patterns: [
    "chatbot", "chat bot", "bot", "ai assistant", "virtual assistant",
    "live chat", "customer support bot", "whatsapp",
  ]},
  { key: "ordering & booking", patterns: [
    "ordering", "online order", "takeaway", "booking system", "appointments",
    "book online", "schedule", "just eat", "deliveroo", "order system",
  ]},
  { key: "loyalty cards", patterns: [
    "loyalty", "stamp card", "loyalty card", "rewards", "points card",
    "digital stamps", "repeat customers",
  ]},
  { key: "how it works", patterns: [
    "how does it work", "how it work", "how do you work", "process",
    "what's the process", "what happens", "steps", "how long", "timeline",
    "turnaround", "how quick", "how fast", "what to expect",
  ]},
  { key: "pricing", patterns: [
    "price", "pricing", "cost", "how much", "expensive", "cheap", "afford",
    "budget", "rates", "fees", "pay", "charge", "package", "money",
    "investment", "worth", "value",
  ]},
  { key: "who's it for?", patterns: [
    "who is it for", "who's it for", "what kind of business", "what type",
    "is it for me", "my business", "suitable", "right for",
  ]},
  { key: "greeting", patterns: [
    "hello", "hi ", "hey", "hiya", "morning", "afternoon", "evening",
    "alright", "sup", "yo ",
  ]},
];

function matchIntent(text) {
  const lower = text.toLowerCase().trim();
  let bestMatch = null;
  let bestScore = 0;

  for (const intent of INTENTS) {
    let score = 0;
    for (const pattern of intent.patterns) {
      if (lower.includes(pattern)) {
        // Longer pattern matches are more specific = higher score
        score += pattern.length;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = intent.key;
    }
  }

  return bestMatch;
}

/* ── Simple markdown-like bold ── */
function formatText(text) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} style={{ color: C.t1, fontWeight: 600 }}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

/* ── Chat bubble ── */
function Bubble({ msg }) {
  const isUser = msg.from === "user";
  return (
    <div style={{
      display: "flex", justifyContent: isUser ? "flex-end" : "flex-start",
      marginBottom: 12, animation: "chatFadeIn 0.3s ease-out",
    }}>
      {!isUser && (
        <div style={{
          width: 28, height: 28, minWidth: 28, marginRight: 8, marginTop: 2,
          border: `1.5px solid ${C.red}`, display: "flex", alignItems: "center",
          justifyContent: "center", fontFamily: "'Playfair Display',Georgia,serif",
          fontSize: 10, fontWeight: 800, color: C.t1, letterSpacing: "1px",
          borderRadius: "50%",
        }}>AP</div>
      )}
      <div style={{
        maxWidth: "82%", padding: "12px 16px",
        background: isUser ? C.red : C.card2,
        borderRadius: isUser ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
        border: isUser ? "none" : `1px solid ${C.border}`,
      }}>
        <p style={{
          fontFamily: "'Inter',sans-serif", fontSize: 13, color: isUser ? "#fff" : C.t2,
          lineHeight: 1.6, margin: 0, whiteSpace: "pre-wrap",
        }}>{formatText(msg.text)}</p>
        {msg.bullets && (
          <div style={{ marginTop: 10 }}>
            {msg.bullets.map((b, i) => (
              <p key={i} style={{
                fontFamily: "'Inter',sans-serif", fontSize: 12.5, color: C.t2,
                lineHeight: 1.6, margin: "6px 0", paddingLeft: 4,
              }}>{formatText(b)}</p>
            ))}
          </div>
        )}
        {msg.followUp && (
          <p style={{
            fontFamily: "'Inter',sans-serif", fontSize: 13, color: C.t2,
            lineHeight: 1.6, margin: "10px 0 0 0",
          }}>{msg.followUp}</p>
        )}
      </div>
    </div>
  );
}

/* ── Contact form inside chat ── */
function ChatForm({ onSubmit }) {
  const [form, setForm] = useState({ name: "", contact: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const inputStyle = {
    background: C.bg, border: `1px solid ${C.border}`, color: C.t1,
    fontFamily: "'Inter',sans-serif", fontSize: 13, padding: "10px 14px",
    outline: "none", width: "100%", boxSizing: "border-box",
    borderRadius: 6, transition: "border-color 0.3s",
  };

  if (submitted) {
    return (
      <div style={{
        padding: "20px 16px", background: C.card2, borderRadius: 12,
        border: `1px solid ${C.border}`, textAlign: "center", margin: "8px 0 8px 36px",
        animation: "chatFadeIn 0.3s ease-out",
      }}>
        <div style={{ fontSize: 24, marginBottom: 8, color: "#1B6B3A" }}>✓</div>
        <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 13, color: C.t1, margin: 0, fontWeight: 600 }}>
          Message sent — diolch!
        </p>
        <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 12, color: C.t2, margin: "4px 0 0 0" }}>
          Asher will get back to you within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <div style={{
      padding: 16, background: C.card2, borderRadius: 12,
      border: `1px solid ${C.border}`, margin: "8px 0 8px 36px",
      display: "flex", flexDirection: "column", gap: 10,
      animation: "chatFadeIn 0.3s ease-out",
    }}>
      <input placeholder="Your name" style={inputStyle} value={form.name}
        onChange={e => setForm({ ...form, name: e.target.value })}
        onFocus={e => e.target.style.borderColor = C.red}
        onBlur={e => e.target.style.borderColor = C.border} />
      <input placeholder="Email or phone" style={inputStyle} value={form.contact}
        onChange={e => setForm({ ...form, contact: e.target.value })}
        onFocus={e => e.target.style.borderColor = C.red}
        onBlur={e => e.target.style.borderColor = C.border} />
      <textarea placeholder="Tell us about your business..." rows={3}
        style={{ ...inputStyle, resize: "vertical" }} value={form.message}
        onChange={e => setForm({ ...form, message: e.target.value })}
        onFocus={e => e.target.style.borderColor = C.red}
        onBlur={e => e.target.style.borderColor = C.border} />
      <button onClick={() => {
        if (form.name && form.contact) {
          setSubmitted(true);
          onSubmit(form);
        }
      }} style={{
        padding: "12px 20px", background: C.red, color: "#fff",
        fontFamily: "'Inter',sans-serif", fontSize: 12, fontWeight: 700,
        letterSpacing: "0.06em", textTransform: "uppercase",
        border: "none", cursor: "pointer", borderRadius: 6,
        transition: "all 0.3s", opacity: form.name && form.contact ? 1 : 0.5,
      }}
        onMouseEnter={e => e.target.style.background = C.redHov}
        onMouseLeave={e => e.target.style.background = C.red}
      >Send Message</button>
    </div>
  );
}

/* ── Analytics logging ── */
function logInteraction(type, data) {
  try {
    const logs = JSON.parse(localStorage.getItem("ap_chat_logs") || "[]");
    logs.push({
      type,
      ...data,
      timestamp: new Date().toISOString(),
      session: sessionId,
    });
    localStorage.setItem("ap_chat_logs", JSON.stringify(logs));
  } catch (e) { /* storage full or unavailable — fail silently */ }
}

const sessionId = typeof crypto !== "undefined"
  ? crypto.randomUUID?.() || Math.random().toString(36).slice(2)
  : Math.random().toString(36).slice(2);

/* ═══════════════ CHATBOT WIDGET ═══════════════ */
export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [options, setOptions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (open && !initialized.current) {
      initialized.current = true;
      addBotMessage("greeting");
    }
  }, [open]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, showForm, typing]);

  function addBotMessage(key) {
    let data = RESPONSES[key] || RESPONSES.fallback;
    if (data.redirect) {
      data = RESPONSES[data.redirect];
    }

    setTyping(true);
    setOptions([]);
    setShowForm(false);

    setTimeout(() => {
      setTyping(false);
      setMessages(prev => [...prev, {
        from: "bot", text: data.text,
        bullets: data.bullets, followUp: data.followUp,
      }]);
      if (data.options) setOptions(data.options);
      if (data.showForm) setShowForm(true);
    }, 600 + Math.random() * 400);
  }

  function handleTextInput() {
    if (!input.trim()) return;
    const text = input.trim();
    setInput("");
    setMessages(prev => [...prev, { from: "user", text }]);

    const match = matchIntent(text);
    logInteraction("message", {
      input: text,
      matchedIntent: match || "fallback",
      missed: !match,
    });
    addBotMessage(match || "fallback");
  }

  function handleOption(opt) {
    setMessages(prev => [...prev, { from: "user", text: opt }]);
    logInteraction("button", { option: opt });
    const key = opt.toLowerCase();
    addBotMessage(key);
  }

  function handleFormSubmit(form) {
    logInteraction("lead", form);
    fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: form.name, contact: form.contact, message: form.message, source: "chatbot" }),
    }).catch(() => {});
  }

  return (
    <>
      <style>{`
        @keyframes chatFadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
        @keyframes chatPulse{0%,100%{box-shadow:0 4px 24px rgba(200,16,46,0.25)}50%{box-shadow:0 4px 32px rgba(200,16,46,0.45)}}
        @keyframes typingDot{0%,60%,100%{opacity:0.3;transform:translateY(0)}30%{opacity:1;transform:translateY(-4px)}}
      `}</style>

      {/* Chat window */}
      {open && (
        <div style={{
          position: "fixed", bottom: 100, right: 24, zIndex: 10000,
          width: 380, maxWidth: "calc(100vw - 48px)", height: 520, maxHeight: "70vh",
          background: C.bg, border: `1px solid ${C.border}`,
          borderRadius: 16, overflow: "hidden",
          display: "flex", flexDirection: "column",
          boxShadow: "0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(200,16,46,0.08)",
          animation: "chatFadeIn 0.3s ease-out",
        }}>
          {/* Header */}
          <div style={{
            padding: "16px 20px", background: C.card,
            borderBottom: `1px solid ${C.border}`,
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{
                width: 32, height: 32, border: `1.5px solid ${C.red}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "'Playfair Display',Georgia,serif",
                fontSize: 11, fontWeight: 800, color: C.t1, letterSpacing: "1px",
                borderRadius: "50%",
              }}>AP</div>
              <div>
                <div style={{
                  fontFamily: "'Inter',sans-serif", fontSize: 13, fontWeight: 700, color: C.t1,
                }}>Asher Price</div>
                <div style={{
                  fontFamily: "'Inter',sans-serif", fontSize: 10, color: "#1B6B3A",
                  display: "flex", alignItems: "center", gap: 5,
                }}>
                  <span style={{
                    width: 6, height: 6, borderRadius: "50%",
                    background: "#1B6B3A", display: "inline-block",
                  }} />
                  Online now
                </div>
              </div>
            </div>
            <button onClick={() => setOpen(false)} style={{
              background: "none", border: "none", color: C.t3, cursor: "pointer",
              fontSize: 20, padding: 4, lineHeight: 1, transition: "color 0.3s",
            }}
              onMouseEnter={e => e.target.style.color = C.t1}
              onMouseLeave={e => e.target.style.color = C.t3}
            >×</button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} style={{
            flex: 1, overflowY: "auto", padding: "20px 16px",
            scrollBehavior: "smooth",
          }}>
            {messages.map((msg, i) => <Bubble key={i} msg={msg} />)}

            {/* Typing indicator */}
            {typing && (
              <div style={{
                display: "flex", alignItems: "center", gap: 8,
                marginBottom: 12, marginLeft: 36,
                animation: "chatFadeIn 0.3s ease-out",
              }}>
                <div style={{
                  padding: "10px 16px", background: C.card2, borderRadius: 16,
                  border: `1px solid ${C.border}`, display: "flex", gap: 5,
                }}>
                  {[0, 1, 2].map(i => (
                    <span key={i} style={{
                      width: 6, height: 6, borderRadius: "50%",
                      background: C.t3, display: "block",
                      animation: `typingDot 1.2s ease-in-out ${i * 0.2}s infinite`,
                    }} />
                  ))}
                </div>
              </div>
            )}

            {/* Contact form */}
            {showForm && !typing && <ChatForm onSubmit={handleFormSubmit} />}

            {/* Quick reply options */}
            {options.length > 0 && !typing && (
              <div style={{
                display: "flex", flexWrap: "wrap", gap: 8,
                marginTop: 4, marginLeft: 36,
                animation: "chatFadeIn 0.3s ease-out",
              }}>
                {options.map((opt, i) => (
                  <button key={i} onClick={() => handleOption(opt)} style={{
                    padding: "8px 16px", background: "transparent",
                    border: `1px solid ${C.border2}`, borderRadius: 20,
                    color: C.t2, fontFamily: "'Inter',sans-serif",
                    fontSize: 12, fontWeight: 600, cursor: "pointer",
                    transition: "all 0.3s", whiteSpace: "nowrap",
                  }}
                    onMouseEnter={e => {
                      e.target.style.borderColor = C.red;
                      e.target.style.color = C.t1;
                      e.target.style.background = "rgba(200,16,46,0.08)";
                    }}
                    onMouseLeave={e => {
                      e.target.style.borderColor = C.border2;
                      e.target.style.color = C.t2;
                      e.target.style.background = "transparent";
                    }}
                  >{opt}</button>
                ))}
              </div>
            )}
          </div>

          {/* Text input */}
          <div style={{
            padding: "12px 16px", borderTop: `1px solid ${C.border}`,
            background: C.card, display: "flex", gap: 10,
          }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleTextInput()}
              placeholder="Type a message..."
              style={{
                flex: 1, background: C.bg, border: `1px solid ${C.border}`,
                color: C.t1, fontFamily: "'Inter',sans-serif", fontSize: 13,
                padding: "10px 14px", outline: "none", borderRadius: 8,
                transition: "border-color 0.3s",
              }}
              onFocus={e => e.target.style.borderColor = C.red}
              onBlur={e => e.target.style.borderColor = C.border}
            />
            <button onClick={handleTextInput} style={{
              width: 40, height: 40, background: C.red, border: "none",
              borderRadius: 8, cursor: "pointer", display: "flex",
              alignItems: "center", justifyContent: "center",
              transition: "background 0.3s", flexShrink: 0,
            }}
              onMouseEnter={e => e.target.style.background = C.redHov}
              onMouseLeave={e => e.target.style.background = C.red}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* FAB button */}
      <button onClick={() => setOpen(!open)} style={{
        position: "fixed", bottom: 24, right: 24, zIndex: 10001,
        width: 60, height: 60, borderRadius: "50%",
        background: C.red, border: "none", cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
        animation: open ? "none" : "chatPulse 3s ease-in-out infinite",
        boxShadow: "0 4px 24px rgba(200,16,46,0.3)",
        transform: open ? "rotate(0deg)" : "rotate(0deg)",
      }}
        onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.08)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(200,16,46,0.4)"; }}
        onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 4px 24px rgba(200,16,46,0.3)"; }}
      >
        {open ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}
      </button>
    </>
  );
}
