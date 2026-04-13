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
    text: "Hi! 👋 I'm AP — Asher's virtual assistant. I can tell you about our services, how we work, or help you get in touch. What are you interested in?",
    options: ["Services", "How it works", "Pricing", "Get in touch"],
  },
  services: {
    text: "We offer four core services — all powered by AI and built bespoke for your business:",
    bullets: [
      "🌐 **Websites** — Fast, mobile-first sites that turn visitors into customers. No templates.",
      "🤖 **AI Chatbots** — Intelligent assistants trained on your business. They answer enquiries, book appointments, and capture leads 24/7.",
      "⚡ **Automation** — Automated booking, invoicing, follow-ups, and lead capture. Stop doing the same task twice.",
      "📱 **Social & Content** — AI-created and scheduled social media content to keep your feeds active.",
    ],
    followUp: "Want to know more about any of these?",
    options: ["Websites", "AI Chatbots", "Automation", "Social & Content", "Pricing", "Get in touch"],
  },
  websites: {
    text: "Every website we build is bespoke — no WordPress templates or cookie-cutter designs. We build fast, mobile-first sites optimised for Google, designed to convert visitors into paying customers. Average build time is about 5 days, and we handle everything: design, development, hosting, and DNS.",
    options: ["Pricing", "How it works", "Get in touch", "Back to services"],
  },
  "ai chatbots": {
    text: "Our AI chatbots are trained specifically on your business — your services, your FAQs, your tone of voice. They handle enquiries, book appointments, capture leads, and work 24/7 without a break. They can be added to your website, Facebook page, or WhatsApp.",
    options: ["Pricing", "How it works", "Get in touch", "Back to services"],
  },
  automation: {
    text: "We automate the repetitive stuff that eats your time — appointment booking, invoice generation, follow-up emails, lead capture forms, and more. If you're doing the same task twice, we can probably automate it. This frees you up to focus on what actually makes money.",
    options: ["Pricing", "How it works", "Get in touch", "Back to services"],
  },
  "social & content": {
    text: "We use AI to create consistent, on-brand social media content — posts, captions, and scheduling — so your feeds stay active without eating your evenings. Everything is tailored to your brand voice and audience.",
    options: ["Pricing", "How it works", "Get in touch", "Back to services"],
  },
  "how it works": {
    text: "Our process is simple — four steps:",
    bullets: [
      "**1. Chat** — A free, no-pressure conversation. Tell us about your business and we'll tell you exactly what would help.",
      "**2. Build** — We build your website, chatbot, or automation. You see progress throughout — no disappearing for weeks.",
      "**3. Launch** — We go live. We handle all the technical setup — DNS, hosting, everything.",
      "**4. Grow** — Ongoing support, updates, and improvements. Your monthly retainer keeps everything running.",
    ],
    options: ["Pricing", "Services", "Get in touch"],
  },
  pricing: {
    text: "We don't do one-size-fits-all pricing — every business is different. What I can tell you is:\n\n• The initial chat is always **free** — no obligation\n• No hidden fees or 12-month lock-in contracts\n• Pricing that respects your margins — we're not a London agency\n• Most projects start with a one-off build fee + optional monthly retainer\n\nThe best way to get a quote is to have a quick chat with Asher directly.",
    options: ["Get in touch", "Services", "How it works"],
  },
  "back to services": {
    redirect: "services",
  },
  "get in touch": {
    text: "Great! Drop your details below and Asher will get back to you within 24 hours. Or you can email directly at **hello@asherprice.co.uk**.",
    showForm: true,
  },
  fallback: {
    text: "I'm not quite sure what you mean — but I'm here to help! Here's what I can tell you about:",
    options: ["Services", "How it works", "Pricing", "Get in touch"],
  },
};

/* ── Intent matching ── */
const INTENTS = [
  { key: "get in touch", patterns: [
    "contact", "get in touch", "reach", "speak", "talk", "call", "phone", "email",
    "message", "enquir", "inquir", "book", "consultation", "free chat", "arrange",
    "meet", "appointment", "quote", "interested", "sign up", "start",
    "how can i", "how do i", "get started", "reach out", "drop a message",
    "want to work", "hire", "need help",
  ]},
  { key: "services", patterns: [
    "services", "what do you do", "what do you offer", "what can you",
    "what you do", "offerings", "help with", "provide", "do you do",
    "tell me about", "what's available", "full package",
  ]},
  { key: "websites", patterns: [
    "website", "web site", "site", "landing page", "web design", "web dev",
    "build a site", "build me a", "new site", "redesign",
  ]},
  { key: "ai chatbots", patterns: [
    "chatbot", "chat bot", "bot", "ai assistant", "virtual assistant",
    "live chat", "customer support bot", "whatsapp",
  ]},
  { key: "automation", patterns: [
    "automat", "workflow", "invoice", "booking system", "follow up",
    "lead capture", "crm", "repetitive", "save time", "streamline",
  ]},
  { key: "social & content", patterns: [
    "social media", "social", "content", "instagram", "facebook", "tiktok",
    "posting", "schedule", "feed", "marketing",
  ]},
  { key: "how it works", patterns: [
    "how does it work", "how it work", "how do you work", "process",
    "what's the process", "what happens", "steps", "how long", "timeline",
    "turnaround", "how quick", "how fast", "what to expect",
  ]},
  { key: "pricing", patterns: [
    "price", "pricing", "cost", "how much", "expensive", "cheap", "afford",
    "budget", "rates", "fees", "pay", "charge", "package", "plan", "money",
    "investment", "worth", "value",
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
