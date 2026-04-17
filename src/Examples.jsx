import { useState, useEffect, useRef } from "react";

const C = {
  red: "#C8102E", redHov: "#E01A38", redFaint: "rgba(200,16,46,0.06)",
  green: "#1B6B3A", greenFaint: "rgba(27,107,58,0.08)",
  bg: "#08090B", bg2: "#0C0D10", card: "#101218", card2: "#14161D",
  border: "#1B1E26", border2: "#252830",
  t1: "#F0EDEA", t2: "#9B9DA4", t3: "#5C5F68",
};

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

function Reveal({ children, delay = 0, style = {} }) {
  const [ref, v] = useInView();
  return (
    <div ref={ref} style={{
      ...style,
      opacity: v ? 1 : 0,
      transform: v ? "none" : "translateY(32px)",
      transition: `all 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
    }}>{children}</div>
  );
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
      <span style={{ width: 32, height: 2, background: C.red, display: "block" }} />
    </div>
  );
}

/* ═══════════════ DEMO CHATBOT ═══════════════ */
function formatText(text) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} style={{ color: C.t1, fontWeight: 600 }}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

function DemoChat({ config }) {
  const [messages, setMessages] = useState([]);
  const [options, setOptions] = useState([]);
  const [typing, setTyping] = useState(false);
  const [started, setStarted] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, typing]);

  function start() {
    if (started) return;
    setStarted(true);
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages([{ from: "bot", text: config.greeting }]);
      setOptions(config.firstOptions);
    }, 800);
  }

  function handleOption(opt) {
    setMessages(prev => [...prev, { from: "user", text: opt }]);
    setOptions([]);
    setTyping(true);
    const response = config.responses[opt] || config.fallback;
    setTimeout(() => {
      setTyping(false);
      setMessages(prev => [...prev, { from: "bot", text: response.text, bullets: response.bullets }]);
      if (response.options) setOptions(response.options);
    }, 700 + Math.random() * 300);
  }

  return (
    <div style={{
      background: C.bg, border: `1px solid ${C.border}`, borderRadius: 16,
      overflow: "hidden", display: "flex", flexDirection: "column",
      height: 420, boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
    }}>
      {/* Header */}
      <div style={{
        padding: "14px 18px", background: C.card, borderBottom: `1px solid ${C.border}`,
        display: "flex", alignItems: "center", gap: 12,
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: "50%",
          background: config.color, display: "flex", alignItems: "center",
          justifyContent: "center", fontSize: 16, flexShrink: 0,
        }}>{config.emoji}</div>
        <div>
          <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 13, fontWeight: 700, color: C.t1 }}>
            {config.name}
          </div>
          <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 10, color: C.green, display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.green, display: "inline-block" }} />
            Online now
          </div>
        </div>
        <div style={{
          marginLeft: "auto", fontFamily: "'Inter',sans-serif", fontSize: 10,
          color: C.t3, background: C.card2, padding: "4px 10px",
          border: `1px solid ${C.border}`, letterSpacing: "0.1em",
        }}>
          DEMO
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: "16px 14px" }}>
        {!started && (
          <div style={{ textAlign: "center", paddingTop: 60 }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>{config.emoji}</div>
            <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 13, color: C.t3, marginBottom: 20 }}>
              This is a live demo of an AI assistant<br />built for {config.businessType}.
            </p>
            <button onClick={start} style={{
              padding: "12px 28px", background: C.red, color: "#fff",
              fontFamily: "'Inter',sans-serif", fontSize: 12, fontWeight: 700,
              letterSpacing: "0.06em", textTransform: "uppercase",
              border: "none", cursor: "pointer", borderRadius: 8,
              transition: "all 0.3s",
            }}
              onMouseEnter={e => e.target.style.background = C.redHov}
              onMouseLeave={e => e.target.style.background = C.red}
            >Start Demo</button>
          </div>
        )}

        {messages.map((msg, i) => {
          const isUser = msg.from === "user";
          return (
            <div key={i} style={{
              display: "flex", justifyContent: isUser ? "flex-end" : "flex-start",
              marginBottom: 10, animation: "chatFadeIn 0.3s ease-out",
            }}>
              {!isUser && (
                <div style={{
                  width: 26, height: 26, minWidth: 26, marginRight: 8, marginTop: 2,
                  borderRadius: "50%", background: config.color,
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12,
                }}>{config.emoji}</div>
              )}
              <div style={{
                maxWidth: "80%", padding: "10px 14px",
                background: isUser ? C.red : C.card2,
                borderRadius: isUser ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                border: isUser ? "none" : `1px solid ${C.border}`,
              }}>
                <p style={{
                  fontFamily: "'Inter',sans-serif", fontSize: 12.5,
                  color: isUser ? "#fff" : C.t2, lineHeight: 1.6, margin: 0,
                }}>{formatText(msg.text)}</p>
                {msg.bullets && (
                  <div style={{ marginTop: 8 }}>
                    {msg.bullets.map((b, j) => (
                      <p key={j} style={{
                        fontFamily: "'Inter',sans-serif", fontSize: 12,
                        color: C.t2, lineHeight: 1.6, margin: "5px 0",
                      }}>{formatText(b)}</p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {typing && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, marginLeft: 34, animation: "chatFadeIn 0.3s ease-out" }}>
            <div style={{ padding: "10px 14px", background: C.card2, borderRadius: 14, border: `1px solid ${C.border}`, display: "flex", gap: 4 }}>
              {[0, 1, 2].map(i => (
                <span key={i} style={{
                  width: 5, height: 5, borderRadius: "50%", background: C.t3, display: "block",
                  animation: `typingDot 1.2s ease-in-out ${i * 0.2}s infinite`,
                }} />
              ))}
            </div>
          </div>
        )}

        {options.length > 0 && !typing && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginTop: 4, marginLeft: 34, animation: "chatFadeIn 0.3s ease-out" }}>
            {options.map((opt, i) => (
              <button key={i} onClick={() => handleOption(opt)} style={{
                padding: "7px 14px", background: "transparent",
                border: `1px solid ${C.border2}`, borderRadius: 18,
                color: C.t2, fontFamily: "'Inter',sans-serif",
                fontSize: 11.5, fontWeight: 600, cursor: "pointer",
                transition: "all 0.3s", whiteSpace: "nowrap",
              }}
                onMouseEnter={e => { e.target.style.borderColor = C.red; e.target.style.color = C.t1; e.target.style.background = C.redFaint; }}
                onMouseLeave={e => { e.target.style.borderColor = C.border2; e.target.style.color = C.t2; e.target.style.background = "transparent"; }}
              >{opt}</button>
            ))}
          </div>
        )}
      </div>

      {/* Input bar — decorative, shows this is a real interface */}
      <div style={{ padding: "10px 14px", borderTop: `1px solid ${C.border}`, background: C.card, display: "flex", gap: 8 }}>
        <div style={{
          flex: 1, background: C.bg, border: `1px solid ${C.border}`,
          color: C.t3, fontFamily: "'Inter',sans-serif", fontSize: 12,
          padding: "9px 13px", borderRadius: 8,
        }}>Type a message...</div>
        <div style={{
          width: 36, height: 36, background: config.color, borderRadius: 8,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════ CHATBOT CONFIGS ═══════════════ */
const DEMO_BOTS = [
  {
    name: "Valleys Plumbing",
    businessType: "a plumbing company",
    emoji: "🔧",
    color: "#1B6B3A",
    greeting: "Hi there! 👋 I'm the virtual assistant for Valleys Plumbing. Got a leak, a boiler issue, or a job you need quoting? I can help. What's the problem?",
    firstOptions: ["Emergency leak", "Boiler issue", "New installation", "Get a quote"],
    responses: {
      "Emergency leak": {
        text: "OK, let's get this sorted. Is the water supply turned off at the stopcock?",
        options: ["Yes, it's off", "No, I can't find it", "I don't know how"],
      },
      "Yes, it's off": {
        text: "Good — that's the right call. I'll flag this as urgent. Can I take your name and address so we can get someone out to you?",
        options: ["Give my details", "How long will it take?"],
      },
      "How long will it take?": {
        text: "For emergencies we aim to be with you within **1–2 hours** depending on location. We cover Blackwood, Caerphilly, Bargoed and the surrounding Valleys.\n\nShall I get an engineer alerted now?",
        options: ["Yes, get someone out", "Give my details"],
      },
      "Yes, get someone out": {
        text: "On it. Can I take your **name and address** so we can dispatch the nearest engineer?",
        options: ["Give my details"],
      },
      "No, I can't find it": {
        text: "Common locations:\n\n• **Under the kitchen sink** — most common\n• **Airing cupboard** near the bathroom\n• **Under the stairs** in older properties\n\nTurn it clockwise to shut off.",
        options: ["Found it, shutting it off", "Still can't find it"],
      },
      "Found it, shutting it off": {
        text: "Good. With the supply off the leak should stop. I'm alerting our emergency team — an engineer will call you shortly.",
        options: ["Give my details"],
      },
      "Still can't find it": {
        text: "No problem — tell the engineer when they call and they'll advise immediately. Can I take your name and address to get someone out now?",
        options: ["Give my details"],
      },
      "I don't know how": {
        text: "No worries — turn the handle **clockwise until it stops**. It's usually under the kitchen sink or in the airing cupboard.",
        options: ["Found it, shutting it off", "Still can't find it"],
      },
      "It's off now": {
        text: "Perfect. With the supply off the damage should stop. I'm alerting our team — an engineer will call shortly to confirm arrival time.",
        options: ["Give my details", "How long will it take?"],
      },
      "Can't find the stopcock": {
        text: "Check under the kitchen sink, in the airing cupboard, or under the stairs. If you still can't find it, I'll get an engineer to call you right now to talk you through it.",
        options: ["Found it, shutting it off", "Still can't find it"],
      },
      "Boiler issue": {
        text: "What's happening with the boiler?",
        options: ["No hot water", "No heating", "Making a noise", "Pressure dropped"],
      },
      "No hot water": {
        text: "Is the boiler display showing any error codes? Common ones are **E1**, **F28**, or a flashing light.",
        options: ["Yes, showing a code", "No error codes", "No display at all"],
      },
      "Yes, showing a code": {
        text: "What code is showing?",
        options: ["E1 or F1", "F28 or F29", "E9 overheating", "Different code"],
      },
      "E1 or F1": {
        text: "**E1/F1** is an ignition failure — the boiler can't light. Could be a faulty ignition lead, gas supply issue, or blocked flue.\n\n**Don't press reset more than twice.** It needs an engineer.",
        options: ["Book an engineer", "Pricing info"],
      },
      "F28 or F29": {
        text: "**F28/F29** is a gas supply fault. Quick checks:\n\n• Does your gas hob work?\n• Have neighbours lost gas?\n• Is your meter in credit?\n\nIf gas works elsewhere, the boiler needs an engineer.",
        options: ["Gas works elsewhere — need engineer", "Might be a supply issue"],
      },
      "Gas works elsewhere — need engineer": {
        text: "That confirms it's the boiler. I'll get an engineer booked. Can I take your name and contact number?",
        options: ["Give my details"],
      },
      "Might be a supply issue": {
        text: "If it's a gas supply issue, contact **Cadent Gas on 0800 111 999** — they handle supply faults for free. If gas is restored and the boiler still won't start, call us back.",
        options: ["Book an engineer for later", "Start over"],
      },
      "Book an engineer for later": {
        text: "No problem — I'll take your details and get you booked in once the gas supply is sorted.",
        options: ["Give my details"],
      },
      "E9 overheating": {
        text: "**E9** means the boiler has overheated and shut off as a safety measure. Could be a faulty pump, blocked heat exchanger, or low water flow.\n\n**Don't keep resetting it.** Turn it off, let it cool 30 minutes, try once. If it faults again — it needs an engineer.",
        options: ["Book an engineer", "Pricing info"],
      },
      "Different code": {
        text: "Tell me the exact code and I'll advise. Or I can get an engineer to call you who can diagnose it over the phone.",
        options: ["Book an engineer", "Give my details"],
      },
      "No error codes": {
        text: "No code but no hot water — a few things to check:\n\n• Is the boiler display on at all?\n• Is your **thermostat or timer** set correctly?\n• If you have a hot water cylinder — is it cold?",
        options: ["Thermostat seems fine", "Cylinder is cold", "Not sure — send someone"],
      },
      "Thermostat seems fine": {
        text: "In that case it's likely a boiler fault — possibly a diverter valve or heat exchanger. Needs an engineer to diagnose properly.",
        options: ["Book an engineer", "Pricing info"],
      },
      "Cylinder is cold": {
        text: "If the cylinder is cold, check your **immersion heater switch** in the airing cupboard is on. If it is, the zone valve may have failed and you'll need an engineer.",
        options: ["Book an engineer", "Give my details"],
      },
      "Not sure — send someone": {
        text: "Best to get an engineer out to take a proper look — boiler issues without obvious codes are tricky to diagnose remotely.",
        options: ["Give my details", "Pricing info"],
      },
      "No display at all": {
        text: "No display usually means a power issue. Check:\n\n• The fused spur switch on the wall near the boiler\n• Your fuse box for any tripped breakers\n\nIf power is fine everywhere else, the boiler's control board may have failed.",
        options: ["Power seems fine — still no display", "Found a tripped fuse"],
      },
      "Power seems fine — still no display": {
        text: "In that case the control board or wiring has likely failed. I'll get an engineer booked.",
        options: ["Give my details", "Pricing info"],
      },
      "Found a tripped fuse": {
        text: "Reset the fuse and try the boiler. If it trips again immediately — **leave it off**. There's an electrical fault that needs an engineer.",
        options: ["It's working now", "Keeps tripping — need engineer"],
      },
      "It's working now": {
        text: "Brilliant! 👍 Keep an eye on it — if the fuse trips again there's an underlying fault that needs looking at. We're here if you need us.",
        options: ["Start over"],
      },
      "Keeps tripping — need engineer": {
        text: "A repeatedly tripping fuse means an electrical fault in the boiler. Leave it off — I'll get an engineer out to you safely.",
        options: ["Give my details"],
      },
      "No heating": {
        text: "Are your radiators cold everywhere, or just some rooms?",
        options: ["All rooms cold", "Just some radiators", "Book an engineer"],
      },
      "All rooms cold": {
        text: "If every room is cold, the issue is central. Does the boiler look normal — no error codes, display on?",
        options: ["Boiler looks fine, no errors", "Boiler showing an error", "Boiler seems off"],
      },
      "Boiler looks fine, no errors": {
        text: "If the boiler is firing but radiators aren't heating, the likely culprits are the **pump or zone valve**. Needs an engineer to diagnose.",
        options: ["Book an engineer", "Pricing info"],
      },
      "Boiler showing an error": {
        text: "What's the error code showing?",
        options: ["E1 or F1", "F28 or F29", "E9 overheating", "Book an engineer"],
      },
      "Boiler seems off": {
        text: "Check the power switch near the boiler and your fuse box for any tripped breakers. If power is fine everywhere else, the control board may have failed.",
        options: ["Found the issue", "Still off — need engineer"],
      },
      "Found the issue": {
        text: "Glad you got it sorted! We're here if anything else comes up. 👍",
        options: ["Start over"],
      },
      "Still off — need engineer": {
        text: "No problem — I'll get an engineer booked. Can I take your name and contact number?",
        options: ["Give my details"],
      },
      "Just some radiators": {
        text: "Is the cold radiator cold at the **top**, the **bottom**, or completely cold all over?",
        options: ["Cold at the top", "Cold at the bottom", "Completely cold throughout"],
      },
      "Cold at the top": {
        text: "Cold at the top = **trapped air**. You can bleed it yourself:\n\n1. Turn heating on\n2. Find the bleed valve (small square on top of radiator)\n3. Use a radiator key, turn slowly anti-clockwise\n4. When water drips out (not air), close it\n\nWant us to come and sort it?",
        options: ["I'll try that, thanks", "Please send someone"],
      },
      "I'll try that, thanks": {
        text: "Good luck! If the boiler pressure drops afterwards, top it up to between **1 and 1.5 bar**. Give us a shout if you need anything. 👍",
        options: ["Start over"],
      },
      "Please send someone": {
        text: "No problem — happy to come and sort it. Can I take your name and contact number?",
        options: ["Give my details"],
      },
      "Cold at the bottom": {
        text: "Cold at the bottom usually means **sludge or debris** built up over time. Often needs a chemical flush or in worse cases a full power flush.",
        options: ["Book an engineer", "How much will it cost?"],
      },
      "Completely cold throughout": {
        text: "A completely cold radiator is usually a **stuck TRV (thermostatic radiator valve)** — the valve seizes over time. Easy fix.",
        options: ["Book an engineer", "Pricing info"],
      },
      "Making a noise": {
        text: "What kind of noise?",
        options: ["Banging or knocking", "Whistling or hissing", "Gurgling or bubbling", "Rumbling when heating"],
      },
      "Banging or knocking": {
        text: "Banging is usually **'kettling'** — limescale or sludge on the heat exchanger. Common in hard water areas.\n\nNot an emergency but it reduces efficiency and shortens the boiler's life. Worth sorting.",
        options: ["Book an engineer", "How much will it cost?"],
      },
      "Whistling or hissing": {
        text: "Whistling or hissing can indicate a **pressure issue or small internal leak**. I'd turn the boiler off and get an engineer out.",
        options: ["Book an engineer", "Pricing info"],
      },
      "Gurgling or bubbling": {
        text: "Gurgling usually means **trapped air in the system** — often a quick fix. Could also be low pressure or a blockage.",
        options: ["Book an engineer", "Pricing info"],
      },
      "Rumbling when heating": {
        text: "Rumbling when heating is on usually means **limescale or sludge build-up** — common in older properties. A power flush typically resolves it.",
        options: ["Get a quote for power flush", "Pricing info"],
      },
      "Get a quote for power flush": {
        text: "Power flush quotes are free — price depends on the number of radiators. Shall I get someone to call you?",
        options: ["Give my details"],
      },
      "Pressure dropped": {
        text: "Low boiler pressure is very common. Check the gauge on your boiler — it should read between **1 and 1.5 bar** when cold. Is it below that?",
        options: ["Yes, below 1 bar", "I can't find the gauge"],
      },
      "Yes, below 1 bar": {
        text: "You may be able to **repressurise it yourself** using the filling loop — a small silver or grey hose under the boiler.\n\nWant step-by-step instructions, or shall we send someone?",
        options: ["Talk me through it", "Send someone out"],
      },
      "Talk me through it": {
        text: "**Repressurising your boiler:**\n\n1. Turn boiler off and let it cool\n2. Locate the filling loop under the boiler\n3. Open both valves (you'll hear water)\n4. Watch the gauge — stop at **1.2–1.5 bar**\n5. Close both valves and restart\n\nIf pressure keeps dropping, there's likely a small leak.",
        options: ["That worked!", "Still dropping — need engineer"],
      },
      "That worked!": {
        text: "Brilliant! 👍 If it keeps dropping, that means a small leak somewhere — worth getting checked. We're here whenever you need us.",
        options: ["Start over"],
      },
      "Still dropping — need engineer": {
        text: "Repeated pressure drops usually mean a leak in the system. I'll get an engineer booked. Can I take your name and contact number?",
        options: ["Give my details"],
      },
      "Send someone out": {
        text: "No problem. Can I take your name and contact number and we'll get an engineer booked in?",
        options: ["Give my details"],
      },
      "I can't find the gauge": {
        text: "The pressure gauge is usually a **small dial or digital display** on the front of the boiler. If you can't find it, best to get an engineer out.",
        options: ["Book an engineer", "Give my details"],
      },
      "New installation": {
        text: "What are you looking to install?",
        options: ["New boiler", "Bathroom suite", "Radiators", "Full replumb"],
      },
      "New boiler": {
        text: "We install **Worcester Bosch, Vaillant, and Ideal** boilers with full Gas Safe certification. Installations typically take **1–2 days** and come with a manufacturer warranty.\n\nWant a free survey and quote?",
        options: ["Yes, free survey please", "Pricing info"],
      },
      "Yes, free survey please": {
        text: "A survey takes about 30 minutes and we'll give you a full written quote with no obligation. Can I take your name and contact number?",
        options: ["Give my details"],
      },
      "Bathroom suite": {
        text: "Are you looking for a full renovation, a new suite swap, or just individual items?",
        options: ["Full bathroom renovation", "New suite only", "Individual items"],
      },
      "Full bathroom renovation": {
        text: "A full renovation includes strip out, tiling, new suite, and all plumbing — typically **3–5 days**. We project manage the whole job.\n\nWant a free quote visit?",
        options: ["Yes, book a visit", "Give my details"],
      },
      "New suite only": {
        text: "A new suite swap (bath, basin, toilet) takes **1–2 days** if the layout stays the same. We can supply the suite or fit one you've already chosen.\n\nWant a quote?",
        options: ["Yes, book a visit", "Give my details"],
      },
      "Individual items": {
        text: "What are you looking to replace or add?",
        options: ["New toilet", "New basin", "New bath or shower", "Towel rail or radiator"],
      },
      "New toilet": {
        text: "A straightforward toilet replacement takes a couple of hours. Supply and fit from **£180**. Fit only from **£80**.\n\nShall I get a quote arranged?",
        options: ["Yes, book a visit", "Give my details"],
      },
      "New basin": {
        text: "Basin replacement takes 1–2 hours. Supply and fit from **£150**. Fit only from **£70**.\n\nWant to arrange?",
        options: ["Yes, book a visit", "Give my details"],
      },
      "New bath or shower": {
        text: "Are you replacing a bath, adding a shower, or converting bath to shower?",
        options: ["Replace bath", "Add a shower", "Bath to shower conversion"],
      },
      "Replace bath": {
        text: "Bath replacement takes half a day to a full day. Supply and fit from **£350**. Want a free visit to quote?",
        options: ["Yes, book a visit", "Give my details"],
      },
      "Add a shower": {
        text: "Electric shower (no boiler needed) or mixer/power shower (better flow, uses your boiler)?",
        options: ["Electric shower", "Mixer or power shower"],
      },
      "Electric shower": {
        text: "Electric shower supply and fit from **£250** including consumer unit connection. Usually done in half a day.\n\nWant a quote?",
        options: ["Yes, book a visit", "Give my details"],
      },
      "Mixer or power shower": {
        text: "Mixer shower supply and fit from **£300**. We check your boiler pressure and flow rate first to make sure it'll perform properly.\n\nFree quote?",
        options: ["Yes, book a visit", "Give my details"],
      },
      "Bath to shower conversion": {
        text: "Typically takes **1–2 days** including waterproofing and tiling. From **£600** depending on the finish.\n\nFree quote visit?",
        options: ["Yes, book a visit", "Give my details"],
      },
      "Towel rail or radiator": {
        text: "Towel rail installation from **£120** supply and fit. Radiator replacement from **£100** fit only. Both take a couple of hours.\n\nWant to get one booked?",
        options: ["Yes, book a visit", "Give my details"],
      },
      "Radiators": {
        text: "Looking to add new radiators, replace existing ones, or having a problem with current ones?",
        options: ["Add new radiators", "Replace existing", "Problem with radiators"],
      },
      "Add new radiators": {
        text: "Adding radiators involves running new pipework — price depends on number of radiators and difficulty of the run. Best to visit and quote properly.\n\nFree quote visit?",
        options: ["Yes, book a visit", "Give my details"],
      },
      "Replace existing": {
        text: "How many radiators are you looking to replace?",
        options: ["1–2 radiators", "3–5 radiators", "More than 5"],
      },
      "1–2 radiators": {
        text: "1–2 radiators done in half a day. From **£100 per radiator** fitted. Want to book it in?",
        options: ["Give my details"],
      },
      "3–5 radiators": {
        text: "A full day job. Best to do a quick visit to quote accurately — free and no obligation. Shall I arrange one?",
        options: ["Yes, book a visit", "Give my details"],
      },
      "More than 5": {
        text: "For a larger job like this a quote visit is the right approach — free with no obligation. Shall I arrange one?",
        options: ["Yes, book a visit", "Give my details"],
      },
      "Problem with radiators": {
        text: "What's the problem?",
        options: ["Cold at the top", "Cold at the bottom", "Completely cold throughout", "Leaking radiator"],
      },
      "Leaking radiator": {
        text: "Where's the leak coming from?",
        options: ["From the valve", "From the bleed point", "From the radiator body"],
      },
      "From the valve": {
        text: "Valve leaks are usually a worn olive or compression fitting — a quick fix. Turn off both radiator valves to isolate it for now. I'll get a plumber out.",
        options: ["Give my details"],
      },
      "From the bleed point": {
        text: "Try tightening the bleed screw clockwise with a radiator key. If it keeps leaking, the bleed valve needs replacing — quick job for an engineer.",
        options: ["That fixed it!", "Still leaking — send someone"],
      },
      "That fixed it!": {
        text: "Brilliant! 👍 If the boiler pressure has dropped, top it up to 1–1.5 bar. Give us a shout if anything else comes up.",
        options: ["Start over"],
      },
      "Still leaking — send someone": {
        text: "No problem — I'll get a plumber booked. Can I take your name and contact number?",
        options: ["Give my details"],
      },
      "From the radiator body": {
        text: "A leak from the radiator body usually means it's corroded through — needs replacing. Turn off both valves to isolate it and I'll get an engineer out.",
        options: ["Give my details", "Pricing info"],
      },
      "Full replumb": {
        text: "A full replumb is a significant job — usually done during renovations or in older properties with lead or corroding pipework. Typically **3–5 days** depending on property size.\n\nFree survey visit?",
        options: ["Yes, book a visit", "Give my details"],
      },
      "Get a quote": {
        text: "All quotes are **free with no obligation**. What's the job?",
        options: ["Boiler replacement", "Bathroom installation", "Leak repair", "Other plumbing work"],
      },
      "Boiler replacement": {
        text: "We install **Worcester Bosch, Vaillant, and Ideal** boilers. Prices start from **£1,800 supply and fit** with manufacturer warranty. Want a free survey?",
        options: ["Yes, free survey please", "Give my details"],
      },
      "Bathroom installation": {
        text: "Full renovation or plumbing-only on an existing fit-out?",
        options: ["Full renovation", "Plumbing only"],
      },
      "Full renovation": {
        text: "Full bathroom renovation includes strip out, tiling, new suite, and all plumbing — typically **3–5 days**. We project manage the whole job.\n\nFree quote visit?",
        options: ["Yes, book a visit", "Give my details"],
      },
      "Plumbing only": {
        text: "Plumbing-only on an existing bathroom typically takes a day. Best to visit and quote — free with no obligation. Shall I arrange?",
        options: ["Yes, book a visit", "Give my details"],
      },
      "Leak repair": {
        text: "Where's the leak?",
        options: ["Burst pipe", "Dripping tap", "Leaking radiator", "Toilet or cistern"],
      },
      "Burst pipe": {
        text: "**Shut off the stopcock immediately** if you haven't already — turn clockwise. This is an emergency and we'll get someone out as fast as possible.\n\nIs the water off?",
        options: ["Yes, water's off", "I can't find the stopcock"],
      },
      "Yes, water's off": {
        text: "Good — with the water off the damage should stop spreading. I'm flagging this as urgent. Can I take your name and address?",
        options: ["Give my details"],
      },
      "I can't find the stopcock": {
        text: "Check under the kitchen sink, in the airing cupboard, or under the stairs. Turn clockwise to close. I'll get an engineer to call you right now.",
        options: ["Found it, shutting it off", "Still can't find it"],
      },
      "Dripping tap": {
        text: "A dripping tap is usually a worn washer or O-ring — straightforward fix. From **£60** including parts.\n\nWant to get it booked?",
        options: ["Give my details"],
      },
      "Toilet or cistern": {
        text: "What's the toilet doing?",
        options: ["Running constantly", "Not flushing properly", "Leaking at base", "Cistern not refilling"],
      },
      "Running constantly": {
        text: "Almost always a **faulty fill valve or flapper valve** — easy and inexpensive fix. Also wasting a lot of water on your bill.\n\nWant to get it sorted?",
        options: ["Give my details"],
      },
      "Not flushing properly": {
        text: "Usually a **low water level** in the cistern or a worn flush valve. Both quick fixes. Shall I get a plumber booked?",
        options: ["Give my details"],
      },
      "Leaking at base": {
        text: "Leaking at the base usually means the **wax pan seal** has failed. Needs replacing before it causes floor damage — worth sorting soon.",
        options: ["Give my details"],
      },
      "Cistern not refilling": {
        text: "Almost always a **faulty fill valve** — quick and inexpensive repair. Want to get it sorted?",
        options: ["Give my details"],
      },
      "Other plumbing work": {
        text: "Tell me a bit more about what you need and I'll make sure the right person calls you back.",
        options: ["Give my details"],
      },
      "Yes, book a visit": {
        text: "All quote visits are **free with no obligation**. Can I take your name and contact number and we'll arrange a convenient time?",
        options: ["Give my details"],
      },
      "Book an engineer": {
        text: "Can I take your name and contact number? An engineer will call to confirm a time that suits.",
        options: ["Give my details"],
      },
      "How much will it cost?": {
        text: "All jobs are **quoted upfront before any work starts** — no hidden charges. Emergency call-outs from **£75**. Diagnostic visits **£60**, deducted from the repair cost if you go ahead.\n\nWant to get someone booked?",
        options: ["Book an engineer", "Give my details"],
      },
      "Pricing info": {
        text: "All work is quoted upfront — **no hidden call-out fees**. Emergency callouts from **£75**, standard jobs quoted before work begins.\n\nShall I get someone to call you?",
        options: ["Yes please", "Not right now"],
      },
      "Yes please": {
        text: "**Perfect.** Leave your name and number and we'll call back within the hour. 📞",
        options: [],
      },
      "Not right now": {
        text: "No problem — we're here whenever you need us. You can also call us directly any time. 👍",
        options: ["Start over"],
      },
      "Give my details": {
        text: "**Perfect.** Leave your name and contact number below and we'll call you back within the hour during business hours, or first thing in the morning if out of hours. 📞",
        options: [],
      },
      "No, that's great": {
        text: "Glad we could help! We're here 24/7 for emergencies. Take care. 👍",
        options: ["Start over"],
      },
      "Start over": {
        text: "Of course! What can I help you with?",
        options: ["Emergency leak", "Boiler issue", "New installation", "Get a quote"],
      },
    },
    fallback: {
      text: "I'm not sure I caught that — but I'm here to help! What's the issue you're dealing with?",
      options: ["Emergency leak", "Boiler issue", "New installation", "Get a quote"],
    },
  },
  {
    name: "The Red Dragon Kitchen",
    businessType: "a restaurant",
    emoji: "🍽️",
    color: "#C8102E",
    greeting: "Welcome to The Red Dragon Kitchen! 🐉 We serve modern Welsh cuisine right in the heart of the Valleys. Looking to book a table, or can I tell you about our menu?",
    firstOptions: ["Book a table", "View menu", "Opening hours", "Private dining"],
    responses: {
      "Book a table": {
        text: "Lovely! 🍷 How many people will be dining?",
        options: ["Just 2", "3–4 people", "5–6 people", "Larger group"],
      },
      "Just 2": {
        text: "A table for two — perfect. Do you have a date in mind?",
        options: ["This weekend", "Next week", "I'll check and come back"],
      },
      "3–4 people": {
        text: "A table for 3–4 — no problem. What date were you thinking?",
        options: ["This weekend", "Next week", "I'll check and come back"],
      },
      "This weekend": {
        text: "We have availability **Saturday from 6pm** and **Sunday from 1pm** (lunch) or **6pm** (dinner). Which works best?",
        options: ["Saturday 6pm", "Sunday lunch", "Sunday 6pm"],
      },
      "Saturday 6pm": {
        text: "**Saturday at 6pm** — I can hold that for 15 minutes while you confirm. Can I take your name and a contact number?",
        options: ["Confirm the booking"],
      },
      "Confirm the booking": {
        text: "**Booking confirmed!** 🎉 You'll receive a confirmation text shortly. We look forward to seeing you. If anything changes, just reply to the text or message us here.",
        options: ["What should I know before I arrive?"],
      },
      "What should I know before I arrive?": {
        text: "A few things:\n\n• **Parking** — free car park 2 minutes walk away\n• **Dress code** — smart casual\n• **Allergies** — let us know in advance and our chef will accommodate\n• **Running late?** — just message here and we'll hold your table for 20 minutes",
        options: ["Great, see you then!"],
      },
      "Great, see you then!": {
        text: "Can't wait! 🐉 See you Saturday. Enjoy your evening.",
        options: [],
      },
      "View menu": {
        text: "Our menu changes with the seasons, but here's what we're proud of right now:\n\n**Starters**\n• Leek & potato soup, crusty bread\n• Smoked salmon, lemon cream, capers\n\n**Mains**\n• Welsh lamb rump, rosemary jus, seasonal veg\n• Pan-roasted sea bass, samphire, butter sauce\n• Wild mushroom risotto (v)\n\n**Desserts**\n• Bara brith bread & butter pudding\n• Salted caramel tart",
        options: ["Book a table", "Allergen info", "Opening hours"],
      },
      "Allergen info": {
        text: "We take allergies seriously. Our kitchen handles **nuts, gluten, dairy, and shellfish**. Please let us know your requirements when booking and the chef will advise or adapt dishes where possible.",
        options: ["Book a table", "Opening hours"],
      },
      "Opening hours": {
        text: "We're open:\n\n• **Tuesday–Friday** — 12pm–3pm (lunch) & 6pm–10pm (dinner)\n• **Saturday** — 12pm–10pm (all day)\n• **Sunday** — 12pm–5pm (Sunday lunch only)\n• **Monday** — Closed",
        options: ["Book a table", "View menu"],
      },
      "Private dining": {
        text: "We have a **private dining room** for up to 20 guests — perfect for birthdays, anniversaries, corporate dinners, or any special occasion. 🥂\n\nWe can arrange set menus, bespoke decorations, and drinks packages.",
        options: ["Enquire about private dining", "Pricing for private dining"],
      },
      "Pricing for private dining": {
        text: "Private dining starts from **£35 per head** for a set menu, with drinks packages from **£20pp**. Exclusive room hire is available for larger bookings.\n\nShall I pass your details to our events team?",
        options: ["Yes, get in touch", "I'll think about it"],
      },
      "Yes, get in touch": {
        text: "**Perfect!** Leave your name and number below and our events team will call you within 24 hours. 🍾",
        options: [],
      },
      "Next week": {
        text: "We have good availability next week. What day suits you best?",
        options: ["Monday–Wednesday", "Thursday–Friday", "Weekend"],
      },
      "I'll check and come back": {
        text: "No problem — we're here whenever you're ready. You can also call us directly to reserve. 😊",
        options: ["View menu", "Opening hours"],
      },
      "Sunday lunch": {
        text: "**Sunday lunch at 1pm** — our most popular sitting! We do a traditional 3-course Sunday lunch. Can I take your name to hold the table?",
        options: ["Confirm the booking"],
      },
      "Sunday 6pm": {
        text: "**Sunday evening at 6pm** — lovely. Can I take your name and a contact number to confirm?",
        options: ["Confirm the booking"],
      },
      "5–6 people": {
        text: "A table for 5–6 — great. What date were you thinking?",
        options: ["This weekend", "Next week", "I'll check and come back"],
      },
      "Larger group": {
        text: "For groups of 7 or more, we'd recommend our **private dining room** which seats up to 20. Want to know more?",
        options: ["Private dining", "Book a standard table instead"],
      },
      "Book a standard table instead": {
        text: "Of course — how many people exactly?",
        options: ["7 people", "8 people", "9–10 people"],
      },
      "7 people": {
        text: "We can accommodate 7 — what date were you thinking?",
        options: ["This weekend", "Next week"],
      },
      "8 people": {
        text: "8 is manageable! What date were you thinking?",
        options: ["This weekend", "Next week"],
      },
      "9–10 people": {
        text: "For 9–10, the **private dining room** is really the best option — it gives your group the full experience. Want me to pass your details to our events team?",
        options: ["Yes, get in touch", "Private dining"],
      },
      "Enquire about private dining": {
        text: "Great — I'll pass your details to our events team. Can I take your name and a contact number?",
        options: ["Leave my details"],
      },
      "Leave my details": {
        text: "**Brilliant!** Someone will be in touch within 24 hours to discuss your event. We look forward to hosting you. 🥂",
        options: [],
      },
      "I'll think about it": {
        text: "Of course — no pressure. We're here whenever you're ready. 😊",
        options: ["Book a table", "View menu"],
      },
      "Monday–Wednesday": {
        text: "Plenty of availability Monday to Wednesday. What time suits — **lunch (12pm)** or **dinner (6pm)**?",
        options: ["Lunch", "Dinner"],
      },
      "Thursday–Friday": {
        text: "Thursday and Friday get busy — I'd recommend booking ahead. What time — **lunch** or **dinner**?",
        options: ["Lunch", "Dinner"],
      },
      "Weekend": {
        text: "Weekends are popular! We have availability **Saturday from 6pm** and **Sunday lunch from 1pm**. Which works?",
        options: ["Saturday 6pm", "Sunday lunch"],
      },
      "Lunch": {
        text: "Lunch runs **12pm–3pm** Tuesday to Saturday. Shall I pencil you in?",
        options: ["Confirm the booking"],
      },
      "Dinner": {
        text: "Dinner runs **6pm–10pm** Tuesday to Saturday. Shall I confirm the booking?",
        options: ["Confirm the booking"],
      },
    },
    fallback: {
      text: "I didn't quite catch that — but I'm happy to help! What can I do for you?",
      options: ["Book a table", "View menu", "Opening hours", "Private dining"],
    },
  },
  {
    name: "Bloom Beauty",
    businessType: "a beauty salon",
    emoji: "💅",
    color: "#7C3AED",
    greeting: "Hey, welcome to Bloom Beauty! 💜 I can help you book an appointment, check our treatments, or answer any questions. What can I do for you today?",
    firstOptions: ["Book appointment", "Treatments & prices", "Opening hours", "Gift vouchers"],
    responses: {
      "Book appointment": {
        text: "Love it! 💜 What treatment are you looking to book?",
        options: ["Nails", "Lashes & brows", "Facials", "Waxing & threading"],
      },
      "Nails": {
        text: "Gorgeous choice! 💅 Which nail treatment?",
        options: ["Gel manicure", "Acrylic set", "Pedicure", "Nail art"],
      },
      "Gel manicure": {
        text: "Our **gel manicure** takes around 45 minutes and lasts 2–3 weeks. Price: **£28**.\n\nWhen would you like to come in?",
        options: ["This week", "Next week", "I'm flexible"],
      },
      "This week": {
        text: "We have availability:\n\n• **Wednesday 2pm**\n• **Thursday 11am or 4pm**\n• **Friday 10am**\n\nWhich works for you?",
        options: ["Wednesday 2pm", "Thursday 11am", "Thursday 4pm", "Friday 10am"],
      },
      "Wednesday 2pm": {
        text: "**Wednesday at 2pm** — booked! 🎉 I'll send a confirmation to your number. We just ask for **24 hours notice** if you need to cancel. See you then! 💜",
        options: ["What should I know before I come?"],
      },
      "What should I know before I come?": {
        text: "A couple of things:\n\n• Come with **clean, bare nails** if possible\n• If you have gel or acrylics on already, let us know — we'll factor in removal time\n• **Parking** — there's free parking directly outside\n• **Running late?** Just message us here",
        options: ["Perfect, see you then!"],
      },
      "Perfect, see you then!": {
        text: "Can't wait to see you! 💅✨",
        options: [],
      },
      "Acrylic set": {
        text: "A full **acrylic set** takes around 90 minutes. Price: **£45**. Infills are **£30**.\n\nWould you like to book?",
        options: ["This week", "Next week"],
      },
      "Pedicure": {
        text: "Treat your feet! 🦶 Our **luxury pedicure** includes soak, scrub, cuticle care and polish. 45 minutes — **£32**.\n\nWhen suits you?",
        options: ["This week", "Next week"],
      },
      "Nail art": {
        text: "We love nail art! Prices start from **£5** added to any nail treatment depending on complexity. Have a look at our Instagram for inspo and let us know what you're thinking 🎨",
        options: ["Book appointment", "Treatments & prices"],
      },
      "Lashes & brows": {
        text: "Which treatment?",
        options: ["Lash lift & tint", "Brow lamination", "Lash extensions", "Brow tint & shape"],
      },
      "Lash lift & tint": {
        text: "Our **lash lift & tint** takes 45 minutes and the results last 6–8 weeks. Price: **£45**.\n\nIt's one of our most popular treatments — shall I book you in?",
        options: ["Yes, book me in", "Tell me more first"],
      },
      "Tell me more first": {
        text: "A lash lift curls your natural lashes from the root — no extensions needed. The tint darkens them so they look full and defined without mascara. Perfect for low-maintenance glam. 😍\n\nReady to book?",
        options: ["Yes, book me in", "What else do you offer?"],
      },
      "Yes, book me in": {
        text: "Amazing! When would you like to come in?",
        options: ["This week", "Next week", "I'm flexible"],
      },
      "What else do you offer?": {
        text: "Loads! Here's a quick overview:\n\n💅 **Nails** — gel, acrylic, pedicure, nail art\n👁️ **Lashes & brows** — lash lift, brow lamination, extensions\n✨ **Facials** — classic, anti-ageing, express\n🧖 **Waxing** — legs, brows, lip, full body\n🎁 **Gift vouchers** — any amount",
        options: ["Book appointment", "Treatments & prices"],
      },
      "Brow lamination": {
        text: "**Brow lamination** gives you fluffy, defined brows that last 6–8 weeks. Often combined with a tint and shape for the full look. Price: **£35**.\n\nShall I book you in?",
        options: ["Yes, book me in"],
      },
      "Lash extensions": {
        text: "We offer **classic, hybrid, and volume** lash sets. Prices from **£55**. A full set takes 90–120 minutes.\n\nInfills are recommended every 2–3 weeks from **£35**.\n\nInterested?",
        options: ["Yes, book me in", "What's the difference between classic and volume?"],
      },
      "What's the difference between classic and volume?": {
        text: "**Classic** — one extension per natural lash. Natural, defined look.\n\n**Hybrid** — mix of classic and volume. Fuller without being dramatic.\n\n**Volume** — multiple thin extensions per lash. Maximum drama and fullness. 🔥",
        options: ["Yes, book me in", "I need to think about it"],
      },
      "I need to think about it": {
        text: "No rush at all! Come back any time — we're always here. 💜",
        options: ["Treatments & prices", "Opening hours"],
      },
      "Brow tint & shape": {
        text: "A **brow tint and shape** takes 30 minutes and makes a huge difference. Price: **£18**.\n\nShall I book you in?",
        options: ["Yes, book me in"],
      },
      "Facials": {
        text: "Which facial?",
        options: ["Classic facial", "Anti-ageing facial", "Express facial"],
      },
      "Classic facial": {
        text: "Our **classic facial** is 60 minutes of deep cleanse, exfoliation, steam, extraction, and mask. Perfect for a skin reset. Price: **£55**.",
        options: ["Book me in", "What skin types is it for?"],
      },
      "What skin types is it for?": {
        text: "Suitable for **all skin types** — our therapists will tailor the treatment to your skin on the day. If you have any sensitivities, just let us know when booking.",
        options: ["Book me in"],
      },
      "Book me in": {
        text: "When would you like to come in?",
        options: ["This week", "Next week", "I'm flexible"],
      },
      "Anti-ageing facial": {
        text: "Our **anti-ageing facial** uses microcurrent technology and specialist serums to firm, lift and hydrate. 75 minutes — **£75**.\n\nResults improve with regular treatments.",
        options: ["Book me in", "Tell me more"],
      },
      "Tell me more": {
        text: "Microcurrent sends tiny electrical pulses through the skin to stimulate collagen and tighten muscles — often called a **non-surgical facelift**. No downtime, immediate results. 🌟",
        options: ["Book me in"],
      },
      "Express facial": {
        text: "Short on time? Our **express facial** is 30 minutes — quick cleanse, tone, mask, and glow. Perfect for a pick-me-up before a big night. Price: **£32**.",
        options: ["Book me in"],
      },
      "Waxing & threading": {
        text: "What area would you like?",
        options: ["Legs", "Brow wax/thread", "Lip & chin", "Full body"],
      },
      "Legs": {
        text: "We offer **half leg (£20)**, **three-quarter leg (£28)**, and **full leg wax (£35)**. Shall I book you in?",
        options: ["Book me in"],
      },
      "Brow wax/thread": {
        text: "Brow wax or thread: **£10**. Combined with a tint: **£18**. Quick and tidy — 15 minutes.",
        options: ["Book me in"],
      },
      "Lip & chin": {
        text: "Lip wax: **£8**. Chin wax: **£8**. Both together: **£14**. Quick 15-minute treatment.",
        options: ["Book me in"],
      },
      "Full body": {
        text: "Full body wax takes around 90 minutes. Price: **£90**. We recommend booking in advance as this fills up fast!",
        options: ["Book me in"],
      },
      "Treatments & prices": {
        text: "Here's a quick price guide:\n\n💅 **Gel manicure** — £28 | **Acrylic set** — £45\n👁️ **Lash lift & tint** — £45 | **Brow lamination** — £35\n✨ **Classic facial** — £55 | **Express facial** — £32\n🧖 **Half leg wax** — £20 | **Full leg** — £35\n\nAll treatments include a free consultation. 💜",
        options: ["Book appointment", "Opening hours", "Gift vouchers"],
      },
      "Opening hours": {
        text: "We're open:\n\n• **Monday** — Closed\n• **Tuesday–Friday** — 9am–7pm\n• **Saturday** — 9am–6pm\n• **Sunday** — 10am–4pm\n\nLast appointments 45 mins before closing.",
        options: ["Book appointment", "Treatments & prices"],
      },
      "Gift vouchers": {
        text: "Gift vouchers are available for **any amount** — perfect for birthdays, Mother's Day, or just because! 🎁\n\nWe can email a digital voucher or post a physical card. Valid for 12 months.",
        options: ["Buy a gift voucher", "Book appointment"],
      },
      "Buy a gift voucher": {
        text: "**Brilliant!** Just let us know the amount and whether you'd like it digital or posted, and we'll sort it for you. Drop us your details below.",
        options: [],
      },
      "Thursday 11am": {
        text: "**Thursday at 11am** — booked! 🎉 We'll send a confirmation text. See you then! 💜",
        options: ["What should I know before I come?"],
      },
      "Thursday 4pm": {
        text: "**Thursday at 4pm** — perfect! Confirmation text on its way. See you then! 💜",
        options: ["What should I know before I come?"],
      },
      "Friday 10am": {
        text: "**Friday at 10am** — lovely! Confirmation coming your way. See you Friday! 💜",
        options: ["What should I know before I come?"],
      },
      "Next week": {
        text: "Next week has great availability. What day works for you?",
        options: ["Monday or Tuesday", "Wednesday or Thursday", "Friday or Saturday"],
      },
      "I'm flexible": {
        text: "Brilliant — our earliest opening is **Tuesday 9am**. Or if you tell me your ideal day and time, I'll check what's free.",
        options: ["Tuesday morning", "Midweek afternoon", "Weekend"],
      },
      "Tuesday morning": {
        text: "**Tuesday 10am** — I can pencil that in. Shall I confirm?",
        options: ["Yes, confirm", "Choose a different time"],
      },
      "Yes, confirm": {
        text: "**Confirmed!** 💜 We'll text you a reminder the day before. Can't wait to see you!",
        options: [],
      },
      "Choose a different time": {
        text: "No problem — what time works better for you?",
        options: ["This week", "Next week"],
      },
      "Midweek afternoon": {
        text: "We have **Wednesday 3pm** and **Thursday 2pm** free. Which would you prefer?",
        options: ["Wednesday 3pm", "Thursday 2pm"],
      },
      "Wednesday 3pm": {
        text: "**Wednesday at 3pm** — perfect! Confirmed. See you then! 💜",
        options: [],
      },
      "Thursday 2pm": {
        text: "**Thursday at 2pm** — booked! Confirmation text on its way. 💜",
        options: [],
      },
      "Weekend": {
        text: "Saturday is popular — we have **Saturday 10am** and **11:30am** free this week. Sunday we have **10am** available.",
        options: ["Saturday 10am", "Saturday 11:30am", "Sunday 10am"],
      },
      "Saturday 10am": {
        text: "**Saturday at 10am** — perfect start to the weekend! Confirmed. 💜",
        options: [],
      },
      "Saturday 11:30am": {
        text: "**Saturday 11:30am** — brilliant. Confirmed and we'll send a reminder! 💜",
        options: [],
      },
      "Sunday 10am": {
        text: "**Sunday 10am** — lovely. Confirmed! See you Sunday. 💜",
        options: [],
      },
      "Monday or Tuesday": {
        text: "We're closed Mondays. **Tuesday** we have 10am, 1pm, and 4pm free. What works?",
        options: ["Tuesday 10am", "Tuesday 1pm", "Tuesday 4pm"],
      },
      "Wednesday or Thursday": {
        text: "Both days wide open next week! What time suits — morning, afternoon, or evening?",
        options: ["Morning (9–12)", "Afternoon (12–4)", "Evening (4–7)"],
      },
      "Friday or Saturday": {
        text: "Both filling up — shall I check what's available?",
        options: ["Friday availability", "Saturday availability"],
      },
      "Tuesday 10am": { text: "**Tuesday 10am — confirmed!** 💜 See you then.", options: [] },
      "Tuesday 1pm": { text: "**Tuesday 1pm — confirmed!** 💜 See you then.", options: [] },
      "Tuesday 4pm": { text: "**Tuesday 4pm — confirmed!** 💜 See you then.", options: [] },
      "Morning (9–12)": { text: "**9am or 10:30am next Wednesday** — which works better?", options: ["9am", "10:30am"] },
      "9am": { text: "**9am confirmed!** 💜 See you then.", options: [] },
      "10:30am": { text: "**10:30am confirmed!** 💜 See you then.", options: [] },
      "Afternoon (12–4)": { text: "**1pm or 2:30pm** both free. Which do you prefer?", options: ["1pm", "2:30pm"] },
      "1pm": { text: "**1pm confirmed!** 💜 Looking forward to seeing you.", options: [] },
      "2:30pm": { text: "**2:30pm confirmed!** 💜 See you then.", options: [] },
      "Evening (4–7)": { text: "**5pm Thursday** is available. Shall I confirm?", options: ["Yes, confirm"] },
      "Friday availability": { text: "**Friday 11am and 3pm** next week. Which suits?", options: ["Friday 11am", "Friday 3pm"] },
      "Saturday availability": { text: "**Saturday 9:30am and 12pm** available. Which works?", options: ["Saturday 9:30am", "Saturday 12pm"] },
      "Friday 11am": { text: "**Friday 11am — confirmed!** 💜", options: [] },
      "Friday 3pm": { text: "**Friday 3pm — confirmed!** 💜", options: [] },
      "Saturday 9:30am": { text: "**Saturday 9:30am — confirmed!** 💜", options: [] },
      "Saturday 12pm": { text: "**Saturday 12pm — confirmed!** 💜", options: [] },
    },
    fallback: {
      text: "I'm not sure I caught that — but I'm here to help! What can I do for you? 💜",
      options: ["Book appointment", "Treatments & prices", "Opening hours", "Gift vouchers"],
    },
  },
];

/* ═══════════════ AUTOMATION FLOW ═══════════════ */
function FlowArrow() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "4px 0", flexShrink: 0 }}>
      <div style={{ width: 1, height: 16, background: C.border2 }} />
      <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
        <path d="M6 8L0 0H12L6 8Z" fill={C.border2} />
      </svg>
    </div>
  );
}

function FlowNode({ icon, label, sub, highlight }) {
  return (
    <div style={{
      background: highlight ? `rgba(200,16,46,0.08)` : C.card2,
      border: `1px solid ${highlight ? C.red : C.border}`,
      padding: "12px 18px", display: "flex", alignItems: "center", gap: 12,
      position: "relative",
    }}>
      <span style={{ fontSize: 18, flexShrink: 0 }}>{icon}</span>
      <div>
        <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 12.5, fontWeight: 600, color: highlight ? C.t1 : C.t2 }}>{label}</div>
        {sub && <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 11, color: C.t3, marginTop: 2 }}>{sub}</div>}
      </div>
    </div>
  );
}

const FLOWS = [
  {
    title: "Lead Capture",
    desc: "A prospect messages on Facebook. The AI qualifies them, collects their details, and pings you instantly — while you're doing anything else.",
    nodes: [
      { icon: "💬", label: "Customer messages on Facebook", sub: "\"Do you do free quotes?\"" },
      { icon: "🤖", label: "AI responds instantly", sub: "Qualifies their need, collects name & number", highlight: true },
      { icon: "✅", label: "Lead details captured", sub: "Name, contact, job type stored automatically" },
      { icon: "📱", label: "You get a WhatsApp notification", sub: "\"New lead: Sarah Jones — kitchen refit, Caerphilly\"", highlight: true },
    ],
  },
  {
    title: "Booking Automation",
    desc: "A customer books an appointment at 11pm on a Sunday. The AI handles it, confirms the slot, and updates your calendar — no input needed from you.",
    nodes: [
      { icon: "📅", label: "Customer requests a booking", sub: "Via website chat, WhatsApp, or Facebook" },
      { icon: "🤖", label: "AI checks availability", sub: "Reads your live calendar in real time", highlight: true },
      { icon: "✅", label: "Slot confirmed & customer notified", sub: "Confirmation sent automatically" },
      { icon: "📆", label: "Calendar updated", sub: "Booking added — no double-bookings possible", highlight: true },
    ],
  },
  {
    title: "Follow-Up & Reviews",
    desc: "Job done. The automation takes over — invoice, follow-up, and a review request all go out on their own schedule without you lifting a finger.",
    nodes: [
      { icon: "🔧", label: "Job marked as complete", sub: "You update one field in your system" },
      { icon: "📧", label: "Invoice sent automatically", sub: "Branded, itemised PDF to the customer", highlight: true },
      { icon: "📬", label: "Follow-up email — 3 days later", sub: "\"Happy with everything? Any questions?\"" },
      { icon: "⭐", label: "Review request — 7 days later", sub: "Google or Facebook link, friendly tone", highlight: true },
    ],
  },
];

function AutomationFlow({ flow }) {
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, padding: "clamp(24px,3vw,36px)", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${C.red}, ${C.green})` }} />
      <div style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: 18, fontWeight: 700, color: C.t1, marginBottom: 8 }}>
        {flow.title}
      </div>
      <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 13, color: C.t3, lineHeight: 1.6, margin: "0 0 24px 0" }}>
        {flow.desc}
      </p>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {flow.nodes.map((node, i) => (
          <div key={i}>
            <FlowNode {...node} />
            {i < flow.nodes.length - 1 && <FlowArrow />}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════ WEBSITE SHOWCASE ═══════════════ */
function WebsiteCard({ name, type, tags, status, href, preview }) {
  return (
    <div style={{
      background: C.card, border: `1px solid ${C.border}`,
      overflow: "hidden", position: "relative",
      transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = C.border2; e.currentTarget.style.transform = "translateY(-4px)"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.transform = "none"; }}
    >
      {/* Mock browser chrome */}
      <div style={{ background: C.card2, borderBottom: `1px solid ${C.border}`, padding: "10px 14px", display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ display: "flex", gap: 5 }}>
          {["#ff5f57", "#febc2e", "#28c840"].map((col, i) => (
            <div key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: col, opacity: 0.7 }} />
          ))}
        </div>
        <div style={{
          flex: 1, background: C.bg, border: `1px solid ${C.border}`, borderRadius: 4,
          padding: "3px 10px", fontFamily: "'Inter',sans-serif", fontSize: 10, color: C.t3,
        }}>
          {href ? href.replace("https://", "") : "coming soon..."}
        </div>
      </div>

      {/* Preview area */}
      <div style={{
        height: 200, background: `linear-gradient(135deg, ${C.bg2} 0%, ${C.card2} 100%)`,
        display: "flex", alignItems: "center", justifyContent: "center",
        position: "relative", overflow: "hidden",
      }}>
        {preview ? (
          <>
            <img src={preview} alt={`${name} preview`} style={{
              position: "absolute", inset: 0, width: "100%", height: "100%",
              objectFit: "cover", objectPosition: "top",
            }} />
            <div style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(to bottom, rgba(8,9,11,0) 40%, rgba(8,9,11,0.85) 100%)",
            }} />
            <div style={{
              position: "absolute", left: 16, bottom: 12, right: 16,
            }}>
              <div style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: 18, fontWeight: 800, color: C.t1, marginBottom: 2 }}>{name}</div>
              <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 10, color: C.t2, letterSpacing: "0.12em", textTransform: "uppercase" }}>{type}</div>
            </div>
          </>
        ) : (
          <>
            <div style={{
              position: "absolute", inset: 0,
              backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(27,30,38,0.4) 40px, rgba(27,30,38,0.4) 41px), repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(27,30,38,0.4) 40px, rgba(27,30,38,0.4) 41px)`,
            }} />
            {status === "coming-soon" ? (
              <div style={{ textAlign: "center", position: "relative" }}>
                <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 11, fontWeight: 700, color: C.red, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 8 }}>Coming Soon</div>
                <div style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: 20, fontWeight: 700, color: C.t3 }}>{name}</div>
              </div>
            ) : (
              <div style={{ textAlign: "center", position: "relative" }}>
                <div style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: 22, fontWeight: 800, color: C.t1, marginBottom: 6 }}>{name}</div>
                <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 11, color: C.t3, letterSpacing: "0.1em" }}>{type}</div>
              </div>
            )}
          </>
        )}
      </div>

      <div style={{ padding: "20px 20px" }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
          {tags.map((tag, i) => (
            <span key={i} style={{
              fontFamily: "'Inter',sans-serif", fontSize: 10, fontWeight: 600,
              color: C.t3, background: C.bg, border: `1px solid ${C.border}`,
              padding: "3px 10px", letterSpacing: "0.08em",
            }}>{tag}</span>
          ))}
        </div>
        {href ? (
          <a href={href} target="_blank" rel="noopener noreferrer" style={{
            display: "flex", alignItems: "center", gap: 8,
            fontFamily: "'Inter',sans-serif", fontSize: 12, fontWeight: 700,
            color: C.red, textDecoration: "none", letterSpacing: "0.06em", textTransform: "uppercase",
            transition: "gap 0.3s",
          }}
            onMouseEnter={e => e.currentTarget.style.gap = "12px"}
            onMouseLeave={e => e.currentTarget.style.gap = "8px"}
          >
            View Live Site
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
            </svg>
          </a>
        ) : (
          <span style={{
            fontFamily: "'Inter',sans-serif", fontSize: 12, fontWeight: 700,
            color: C.t3, letterSpacing: "0.06em", textTransform: "uppercase",
          }}>In Progress</span>
        )}
      </div>
    </div>
  );
}

/* ═══════════════ CUSTOM TOOLS ═══════════════ */
function ToolShell({ title, subtitle, accent, children, footer }) {
  return (
    <div style={{
      background: C.bg, border: `1px solid ${C.border}`, borderRadius: 16,
      overflow: "hidden", display: "flex", flexDirection: "column",
      minHeight: 480, boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
    }}>
      <div style={{
        padding: "14px 18px", background: C.card, borderBottom: `1px solid ${C.border}`,
        display: "flex", alignItems: "center", gap: 12,
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: 8, background: accent,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "'Playfair Display',Georgia,serif", fontWeight: 800, color: "#fff", fontSize: 14,
        }}>{title.charAt(0)}</div>
        <div>
          <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 13, fontWeight: 700, color: C.t1 }}>{title}</div>
          <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 10, color: C.t3 }}>{subtitle}</div>
        </div>
        <div style={{
          marginLeft: "auto", fontFamily: "'Inter',sans-serif", fontSize: 10,
          color: C.t3, background: C.card2, padding: "4px 10px",
          border: `1px solid ${C.border}`, letterSpacing: "0.1em",
        }}>DEMO</div>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>{children}</div>
      {footer && (
        <div style={{
          padding: "10px 14px", borderTop: `1px solid ${C.border}`,
          background: C.card, fontFamily: "'Inter',sans-serif",
          fontSize: 10, color: C.t3, textAlign: "center", letterSpacing: "0.08em",
        }}>{footer}</div>
      )}
    </div>
  );
}

/* ── Online Ordering ── */
const MENU = [
  { id: 1, name: "Mixed Kebab", desc: "Lamb & chicken, salad, sauce", price: 8.5 },
  { id: 2, name: "Chicken Shish", desc: "Grilled fillet, rice, pitta", price: 9.0 },
  { id: 3, name: "Large Donner", desc: "Chips, salad, chilli sauce", price: 7.5 },
  { id: 4, name: "Veggie Wrap", desc: "Halloumi, salad, garlic sauce", price: 6.5 },
  { id: 5, name: "Chips & Cheese", desc: "Loaded, with gravy option", price: 4.0 },
];
function OrderingDemo() {
  const [cart, setCart] = useState({});
  const [placed, setPlaced] = useState(false);
  const add = (id) => setCart(c => ({ ...c, [id]: (c[id] || 0) + 1 }));
  const sub = (id) => setCart(c => {
    const next = { ...c, [id]: Math.max(0, (c[id] || 0) - 1) };
    if (next[id] === 0) delete next[id];
    return next;
  });
  const total = Object.entries(cart).reduce((sum, [id, qty]) => {
    const item = MENU.find(m => m.id === Number(id));
    return sum + (item ? item.price * qty : 0);
  }, 0);
  const count = Object.values(cart).reduce((a, b) => a + b, 0);

  if (placed) {
    return (
      <ToolShell title="Valley Kebabs" subtitle="Blackwood · Online Ordering" accent="#C8102E" footer="Built by Asher Price">
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32, textAlign: "center" }}>
          <div style={{ fontSize: 42, marginBottom: 16 }}>✓</div>
          <h3 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: 22, color: C.t1, marginBottom: 8 }}>Order placed</h3>
          <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 13, color: C.t2, lineHeight: 1.6, marginBottom: 20 }}>
            Ready for collection in <strong style={{ color: C.red }}>15 mins</strong>.<br />Confirmation sent to your phone.
          </p>
          <button onClick={() => { setCart({}); setPlaced(false); }} style={{
            padding: "10px 22px", background: "transparent", color: C.t2,
            fontFamily: "'Inter',sans-serif", fontSize: 11, fontWeight: 600,
            border: `1px solid ${C.border2}`, cursor: "pointer", letterSpacing: "0.08em", textTransform: "uppercase",
          }}>Start again</button>
        </div>
      </ToolShell>
    );
  }

  return (
    <ToolShell title="Valley Kebabs" subtitle="Blackwood · Online Ordering" accent="#C8102E" footer="Built by Asher Price">
      <div style={{ flex: 1, overflowY: "auto", padding: "12px 14px" }}>
        {MENU.map(item => (
          <div key={item.id} style={{
            display: "flex", alignItems: "center", gap: 12, padding: "10px 0",
            borderBottom: `1px solid ${C.border}`,
          }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 13, fontWeight: 600, color: C.t1 }}>{item.name}</div>
              <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 11, color: C.t3, marginTop: 2 }}>{item.desc}</div>
              <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 12, color: C.red, fontWeight: 700, marginTop: 4 }}>£{item.price.toFixed(2)}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <button onClick={() => sub(item.id)} disabled={!cart[item.id]} style={{
                width: 26, height: 26, borderRadius: 6, border: `1px solid ${C.border2}`,
                background: C.card, color: C.t2, cursor: cart[item.id] ? "pointer" : "default",
                fontSize: 14, opacity: cart[item.id] ? 1 : 0.3,
              }}>−</button>
              <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 13, fontWeight: 700, color: C.t1, minWidth: 16, textAlign: "center" }}>{cart[item.id] || 0}</span>
              <button onClick={() => add(item.id)} style={{
                width: 26, height: 26, borderRadius: 6, border: "none",
                background: C.red, color: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 700,
              }}>+</button>
            </div>
          </div>
        ))}
      </div>
      <div style={{ padding: 12, borderTop: `1px solid ${C.border}`, background: C.card }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
          <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 12, color: C.t2 }}>{count} item{count !== 1 ? "s" : ""}</span>
          <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 16, fontWeight: 700, color: C.t1 }}>£{total.toFixed(2)}</span>
        </div>
        <button onClick={() => count && setPlaced(true)} disabled={!count} style={{
          width: "100%", padding: "12px", background: count ? C.red : C.border,
          color: count ? "#fff" : C.t3, border: "none", borderRadius: 8,
          fontFamily: "'Inter',sans-serif", fontSize: 12, fontWeight: 700,
          letterSpacing: "0.1em", textTransform: "uppercase", cursor: count ? "pointer" : "default",
        }}>{count ? "Place order" : "Add items to order"}</button>
      </div>
    </ToolShell>
  );
}

/* ── Booking System ── */
const BARBERS = [
  { id: "dai", name: "Dai", role: "Senior barber" },
  { id: "ryan", name: "Ryan", role: "Skin fades" },
  { id: "luke", name: "Luke", role: "Beards & cuts" },
];
const SERVICES = [
  { id: "cut", name: "Haircut", dur: "30 min", price: 14 },
  { id: "beard", name: "Beard trim", dur: "15 min", price: 8 },
  { id: "both", name: "Cut + beard", dur: "45 min", price: 20 },
];
function BookingDemo() {
  const [step, setStep] = useState(1);
  const [service, setService] = useState(null);
  const [barber, setBarber] = useState(null);
  const [day, setDay] = useState(null);
  const [time, setTime] = useState(null);

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d, i) => ({
    label: d, date: 15 + i, full: i === 2,
  }));
  const times = ["09:30", "10:15", "11:00", "11:45", "13:00", "14:30", "15:15", "16:00"];

  const reset = () => { setStep(1); setService(null); setBarber(null); setDay(null); setTime(null); };

  const btnBase = {
    fontFamily: "'Inter',sans-serif", fontSize: 12, padding: "10px 14px",
    border: `1px solid ${C.border2}`, background: C.card, color: C.t1,
    cursor: "pointer", borderRadius: 8, transition: "all 0.2s", textAlign: "left",
  };
  const btnActive = { borderColor: "#4A90E2", background: "rgba(74,144,226,0.1)" };

  return (
    <ToolShell title="Blackwood Barbers" subtitle="Blackwood · Booking" accent="#4A90E2" footer="Built by Asher Price">
      <div style={{ padding: "14px 16px", borderBottom: `1px solid ${C.border}`, display: "flex", gap: 8, alignItems: "center", fontSize: 10, fontFamily: "'Inter',sans-serif", letterSpacing: "0.08em", textTransform: "uppercase" }}>
        {["Service", "Barber", "Time", "Confirm"].map((s, i) => (
          <div key={i} style={{ flex: 1, color: step > i ? "#4A90E2" : C.t3, textAlign: "center", fontWeight: 700 }}>
            {step > i + 1 ? "✓ " : ""}{s}
          </div>
        ))}
      </div>

      <div style={{ flex: 1, padding: 16, overflowY: "auto" }}>
        {step === 1 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 11, color: C.t3, marginBottom: 4, letterSpacing: "0.08em", textTransform: "uppercase" }}>Pick a service</div>
            {SERVICES.map(s => (
              <button key={s.id} onClick={() => { setService(s); setStep(2); }} style={{ ...btnBase, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: 700 }}>{s.name}</div>
                  <div style={{ color: C.t3, fontSize: 11, marginTop: 2 }}>{s.dur}</div>
                </div>
                <div style={{ color: "#4A90E2", fontWeight: 700 }}>£{s.price}</div>
              </button>
            ))}
          </div>
        )}

        {step === 2 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 11, color: C.t3, marginBottom: 4, letterSpacing: "0.08em", textTransform: "uppercase" }}>Choose your barber</div>
            {BARBERS.map(b => (
              <button key={b.id} onClick={() => { setBarber(b); setStep(3); }} style={{ ...btnBase, display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#4A90E2", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 14 }}>{b.name.charAt(0)}</div>
                <div>
                  <div style={{ fontWeight: 700 }}>{b.name}</div>
                  <div style={{ color: C.t3, fontSize: 11, marginTop: 2 }}>{b.role}</div>
                </div>
              </button>
            ))}
          </div>
        )}

        {step === 3 && (
          <div>
            <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 11, color: C.t3, marginBottom: 8, letterSpacing: "0.08em", textTransform: "uppercase" }}>Pick a day</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 4, marginBottom: 14 }}>
              {days.map(d => (
                <button key={d.date} disabled={d.full} onClick={() => setDay(d)} style={{
                  ...btnBase, padding: "8px 4px", textAlign: "center",
                  ...(day?.date === d.date ? btnActive : {}),
                  opacity: d.full ? 0.3 : 1, cursor: d.full ? "default" : "pointer",
                }}>
                  <div style={{ fontSize: 10, color: C.t3 }}>{d.label}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, marginTop: 2 }}>{d.date}</div>
                  {d.full && <div style={{ fontSize: 9, color: C.red, marginTop: 2 }}>FULL</div>}
                </button>
              ))}
            </div>
            {day && (
              <>
                <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 11, color: C.t3, marginBottom: 8, letterSpacing: "0.08em", textTransform: "uppercase" }}>Available slots</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 6 }}>
                  {times.map(t => (
                    <button key={t} onClick={() => { setTime(t); setStep(4); }} style={{ ...btnBase, padding: "8px", textAlign: "center", fontSize: 12, fontWeight: 600 }}>{t}</button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {step === 4 && (
          <div style={{ textAlign: "center", paddingTop: 20 }}>
            <div style={{ fontSize: 38, marginBottom: 12, color: "#4A90E2" }}>✓</div>
            <h3 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: 20, color: C.t1, marginBottom: 14 }}>Booking confirmed</h3>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: 14, textAlign: "left", fontFamily: "'Inter',sans-serif", fontSize: 12, color: C.t2, lineHeight: 2, marginBottom: 16 }}>
              <div><span style={{ color: C.t3 }}>Service:</span> <strong style={{ color: C.t1 }}>{service.name}</strong></div>
              <div><span style={{ color: C.t3 }}>Barber:</span> <strong style={{ color: C.t1 }}>{barber.name}</strong></div>
              <div><span style={{ color: C.t3 }}>When:</span> <strong style={{ color: C.t1 }}>{day.label} {day.date}th, {time}</strong></div>
              <div><span style={{ color: C.t3 }}>Total:</span> <strong style={{ color: "#4A90E2" }}>£{service.price}</strong></div>
            </div>
            <button onClick={reset} style={{ ...btnBase, padding: "8px 18px", fontSize: 11, textAlign: "center" }}>Book another</button>
          </div>
        )}
      </div>
    </ToolShell>
  );
}

/* ── Loyalty Stamp Card ── */
function LoyaltyDemo() {
  const [stamps, setStamps] = useState(0);
  const [redeemed, setRedeemed] = useState(false);
  const target = 10;

  const tap = () => {
    if (redeemed) { setRedeemed(false); setStamps(0); return; }
    if (stamps + 1 >= target) { setStamps(target); setRedeemed(true); return; }
    setStamps(s => s + 1);
  };

  return (
    <ToolShell title="Blackwood Cafe" subtitle="Blackwood · Loyalty Card" accent="#8B5A2B" footer="Built by Asher Price">
      <div style={{ flex: 1, padding: 20, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 11, color: C.t3, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 6 }}>Buy 9, get your 10th free</div>
        <h3 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: 22, color: C.t1, marginBottom: 20 }}>Coffee Card</h3>

        <div style={{
          background: "linear-gradient(135deg, #3a2817, #5a3a22)",
          border: `1px solid #8B5A2B`, borderRadius: 12, padding: 18,
          width: "100%", maxWidth: 300, boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
        }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 8 }}>
            {Array.from({ length: target }).map((_, i) => {
              const filled = i < stamps;
              const isFree = i === target - 1;
              return (
                <div key={i} style={{
                  aspectRatio: "1", borderRadius: "50%",
                  border: `2px ${isFree ? "solid" : "dashed"} ${isFree ? "#D4A762" : "rgba(212,167,98,0.4)"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: filled ? (isFree ? "#D4A762" : "#8B5A2B") : "transparent",
                  transition: "all 0.3s",
                  fontSize: 14,
                }}>
                  {filled ? (isFree ? "★" : "☕") : (isFree ? <span style={{ fontSize: 8, color: "#D4A762", fontWeight: 700 }}>FREE</span> : "")}
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: 14, fontFamily: "'Inter',sans-serif", fontSize: 11, color: "#D4A762", textAlign: "center", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            {stamps} / {target} stamps
          </div>
        </div>

        {redeemed ? (
          <div style={{ marginTop: 20, textAlign: "center" }}>
            <div style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: 18, color: "#D4A762", marginBottom: 6 }}>Free coffee unlocked</div>
            <div style={{ fontFamily: "'Inter',sans-serif", fontSize: 11, color: C.t3, marginBottom: 14 }}>Show this to the barista</div>
            <button onClick={tap} style={{
              padding: "12px 28px", background: "#8B5A2B", color: "#fff", border: "none",
              fontFamily: "'Inter',sans-serif", fontSize: 11, fontWeight: 700,
              letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", borderRadius: 8,
            }}>Redeem & reset</button>
          </div>
        ) : (
          <button onClick={tap} style={{
            marginTop: 20, padding: "12px 28px", background: "#8B5A2B", color: "#fff", border: "none",
            fontFamily: "'Inter',sans-serif", fontSize: 11, fontWeight: 700,
            letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", borderRadius: 8,
          }}>+ Add stamp (tap to try)</button>
        )}
      </div>
    </ToolShell>
  );
}

const CUSTOM_TOOLS = [
  { title: "Online Ordering", desc: "Takeaway, cafe, pizzeria — customers order from their phone, you get the ticket.", Component: OrderingDemo },
  { title: "Booking System", desc: "Barbers, salons, trades — pick a service, pick a time, done. No double bookings.", Component: BookingDemo },
  { title: "Digital Loyalty", desc: "Replace paper stamp cards. Customers collect stamps in-app, come back more often.", Component: LoyaltyDemo },
];

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
      padding: "0 clamp(24px,6vw,72px)", height: 72,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      background: s ? "rgba(8,9,11,0.92)" : "rgba(8,9,11,0.7)",
      backdropFilter: "blur(24px) saturate(1.4)",
      borderBottom: `1px solid ${s ? C.border : "transparent"}`,
      transition: "all 0.5s cubic-bezier(0.16,1,0.3,1)",
    }}>
      <a href="/" style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none" }}>
        <div style={{
          width: 32, height: 32, border: `2px solid ${C.red}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "'Playfair Display',Georgia,serif",
          fontSize: 13, fontWeight: 800, color: C.t1, letterSpacing: "1.5px",
        }}>AP</div>
        <span style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: 18, fontWeight: 800, color: C.t1, letterSpacing: "-0.02em" }}>
          Asher Price
        </span>
      </a>
      <a href="/#contact" style={{
        padding: "10px 24px", background: C.red, color: "#fff",
        fontFamily: "'Inter',sans-serif", fontSize: 12, fontWeight: 700,
        letterSpacing: "0.08em", textTransform: "uppercase",
        textDecoration: "none", transition: "all 0.3s",
      }}
        onMouseEnter={e => e.target.style.background = C.redHov}
        onMouseLeave={e => e.target.style.background = C.red}
      >Get Started</a>
    </nav>
  );
}

/* ═══════════════ MAIN PAGE ═══════════════ */
export default function Examples() {
  return (
    <div style={{ background: C.bg, color: C.t1, minHeight: "100vh", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Playfair+Display:wght@400;600;700;800&display=swap');
        *{margin:0;padding:0;box-sizing:border-box}
        html{scroll-behavior:smooth}
        body{-webkit-font-smoothing:antialiased}
        ::selection{background:rgba(200,16,46,0.35);color:#fff}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-track{background:#08090B}
        ::-webkit-scrollbar-thumb{background:#252830;border-radius:2px}
        ::-webkit-scrollbar-thumb:hover{background:#C8102E}
        @keyframes chatFadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
        @keyframes typingDot{0%,60%,100%{opacity:0.3;transform:translateY(0)}30%{opacity:1;transform:translateY(-4px)}}
      `}</style>

      <Navbar />

      {/* ── Hero ── */}
      <section style={{
        padding: "160px clamp(24px,6vw,72px) 100px",
        textAlign: "center", position: "relative",
        borderBottom: `1px solid ${C.border}`,
      }}>
        <div style={{
          position: "absolute", left: "50%", top: 0, width: 1, height: 80,
          background: `linear-gradient(to bottom, ${C.red}, transparent)`,
          transform: "translateX(-50%)",
        }} />
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <Label>Showcase</Label>
          <h1 style={{
            fontFamily: "'Playfair Display',Georgia,serif",
            fontSize: "clamp(38px,6vw,72px)", fontWeight: 800,
            color: C.t1, margin: "0 0 24px 0", letterSpacing: "-0.03em", lineHeight: 1.05,
          }}>
            See what's possible<br />
            <span style={{
              background: `linear-gradient(135deg, ${C.red}, #E84460)`,
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>for your business.</span>
          </h1>
          <p style={{
            fontFamily: "'Inter',sans-serif", fontSize: "clamp(15px,1.8vw,18px)",
            color: C.t2, lineHeight: 1.8, maxWidth: 520, margin: "0 auto 40px",
          }}>
            Live demos. Real builds. This is what I do for businesses across the Valleys — and what I can do for yours.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            {[
              { label: "AI Assistants", href: "#assistants" },
              { label: "Custom Tools", href: "#custom-tools" },
              { label: "Websites", href: "#websites" },
              { label: "Automation", href: "#automation" },
            ].map((tag, i) => (
              <a key={i} href={tag.href} style={{
                fontFamily: "'Inter',sans-serif", fontSize: 12, fontWeight: 600,
                color: i === 0 ? C.red : C.t3, border: `1px solid ${i === 0 ? C.red : C.border}`,
                padding: "6px 16px", letterSpacing: "0.06em", textDecoration: "none",
                cursor: "pointer", transition: "all 0.3s",
              }}
                onMouseEnter={e => { e.target.style.color = C.red; e.target.style.borderColor = C.red; }}
                onMouseLeave={e => { e.target.style.color = i === 0 ? C.red : C.t3; e.target.style.borderColor = i === 0 ? C.red : C.border; }}
              >{tag.label}</a>
            ))}
          </div>
        </div>
      </section>

      {/* ── AI Assistant Demos ── */}
      <section id="assistants" style={{ padding: "100px clamp(24px,6vw,72px)", scrollMarginTop: 72 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 64 }}>
              <Label>Live AI Assistant Demos</Label>
              <h2 style={{
                fontFamily: "'Playfair Display',Georgia,serif",
                fontSize: "clamp(28px,4vw,48px)", fontWeight: 800,
                color: C.t1, margin: "0 0 20px 0", letterSpacing: "-0.025em",
              }}>
                This is what your customers<br />
                <span style={{ color: C.red }}>would actually see.</span>
              </h2>
              <p style={{
                fontFamily: "'Inter',sans-serif", fontSize: 15, color: C.t2,
                lineHeight: 1.7, maxWidth: 500, margin: "0 auto",
              }}>
                Three industries, three live demos. Each assistant is trained on that business — click Start Demo and try it yourself.
              </p>
            </div>
          </Reveal>
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", gap: 24,
          }}>
            {DEMO_BOTS.map((config, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div>
                  <div style={{
                    fontFamily: "'Inter',sans-serif", fontSize: 11, fontWeight: 700,
                    color: C.t3, letterSpacing: "0.15em", textTransform: "uppercase",
                    marginBottom: 12, paddingLeft: 4,
                  }}>{config.businessType.replace("a ", "").replace("an ", "")} — demo</div>
                  <DemoChat config={config} />
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.2}>
            <p style={{
              fontFamily: "'Inter',sans-serif", fontSize: 13, color: C.t3,
              textAlign: "center", marginTop: 40, lineHeight: 1.7,
            }}>
              Every assistant is built specifically for your business — your services, your prices, your tone of voice.<br />
              These demos are simplified. Real builds go deeper.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── Custom Tools ── */}
      <section id="custom-tools" style={{ padding: "100px clamp(24px,6vw,72px)", borderTop: `1px solid ${C.border}`, scrollMarginTop: 72 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 64 }}>
              <Label>Custom Tools</Label>
              <h2 style={{
                fontFamily: "'Playfair Display',Georgia,serif",
                fontSize: "clamp(28px,4vw,48px)", fontWeight: 800,
                color: C.t1, margin: "0 0 20px 0", letterSpacing: "-0.025em",
              }}>
                Not just a website —<br />
                <span style={{ color: C.red }}>tools that do the work.</span>
              </h2>
              <p style={{
                fontFamily: "'Inter',sans-serif", fontSize: 15, color: C.t2,
                lineHeight: 1.7, maxWidth: 540, margin: "0 auto",
              }}>
                Why pay for an app nobody downloads? These live in your website — customers use them straight from the link. No App Store, no installs, no fuss. Try each one below.
              </p>
            </div>
          </Reveal>
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", gap: 24,
          }}>
            {CUSTOM_TOOLS.map((tool, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div>
                  <div style={{
                    fontFamily: "'Inter',sans-serif", fontSize: 11, fontWeight: 700,
                    color: C.t3, letterSpacing: "0.15em", textTransform: "uppercase",
                    marginBottom: 12, paddingLeft: 4,
                  }}>{tool.title}</div>
                  <tool.Component />
                  <p style={{
                    fontFamily: "'Inter',sans-serif", fontSize: 12, color: C.t3,
                    lineHeight: 1.6, marginTop: 14, paddingLeft: 4,
                  }}>{tool.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.2}>
            <p style={{
              fontFamily: "'Inter',sans-serif", fontSize: 13, color: C.t3,
              textAlign: "center", marginTop: 40, lineHeight: 1.7,
            }}>
              These are demos — fully functional, but simplified. Real builds connect to your till, your calendar, your stock, and your customers.<br />
              Priced as one-off builds on top of your website. Ask about <strong style={{ color: C.t1 }}>Custom Tools</strong> when we talk.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── Website Work ── */}
      <section id="websites" style={{ padding: "100px clamp(24px,6vw,72px)", borderTop: `1px solid ${C.border}`, scrollMarginTop: 72 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 64 }}>
              <Label>Website Work</Label>
              <h2 style={{
                fontFamily: "'Playfair Display',Georgia,serif",
                fontSize: "clamp(28px,4vw,48px)", fontWeight: 800,
                color: C.t1, margin: "0 0 20px 0", letterSpacing: "-0.025em",
              }}>
                Bespoke sites.<br />
                <span style={{ color: C.red }}>No templates. Ever.</span>
              </h2>
              <p style={{
                fontFamily: "'Inter',sans-serif", fontSize: 15, color: C.t2,
                lineHeight: 1.7, maxWidth: 480, margin: "0 auto",
              }}>
                Every build is custom to the business — fast, mobile-first, and designed to convert visitors into paying customers.
              </p>
            </div>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 24 }}>
            <Reveal delay={0.1}>
              <WebsiteCard
                name="Aubrey Watson Funeral Directors"
                type="Funeral Services"
                tags={["Bespoke Build", "Lead Gen", "Mobile-First"]}
                status="coming-soon"
              />
            </Reveal>
            <Reveal delay={0.2}>
              <WebsiteCard
                name="Westgate Bar"
                type="Hospitality + Bar"
                tags={["Bespoke Build", "Map", "Events"]}
                status="live"
                href="https://westgateblackwood.co.uk"
                preview="/showcase/westgate-preview.png"
              />
            </Reveal>
            <Reveal delay={0.3}>
              <WebsiteCard
                name="Asher Price"
                type="AI & Web Agency"
                tags={["Bespoke Build", "AI Assistant", "Cloudflare Pages"]}
                status="live"
                href="https://asherprice.co.uk"
                preview="/showcase/asherprice-preview.png"
              />
            </Reveal>
          </div>
          <Reveal delay={0.2}>
            <div style={{
              marginTop: 32, padding: "20px 28px", background: C.card,
              border: `1px solid ${C.border}`, display: "flex", alignItems: "center",
              gap: 16, flexWrap: "wrap",
            }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.red, flexShrink: 0 }} />
              <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 13, color: C.t2, lineHeight: 1.6, margin: 0 }}>
                <strong style={{ color: C.t1 }}>Aubrey Watson Funeral Directors is currently in build.</strong> It'll be added here as a live example as soon as it launches. Check back soon.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Automation Flows ── */}
      <section id="automation" style={{ padding: "100px clamp(24px,6vw,72px)", borderTop: `1px solid ${C.border}`, scrollMarginTop: 72 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 64 }}>
              <Label>Automation</Label>
              <h2 style={{
                fontFamily: "'Playfair Display',Georgia,serif",
                fontSize: "clamp(28px,4vw,48px)", fontWeight: 800,
                color: C.t1, margin: "0 0 20px 0", letterSpacing: "-0.025em",
              }}>
                Stop doing the same<br />
                <span style={{ color: C.red }}>task twice.</span>
              </h2>
              <p style={{
                fontFamily: "'Inter',sans-serif", fontSize: 15, color: C.t2,
                lineHeight: 1.7, maxWidth: 500, margin: "0 auto",
              }}>
                These are real automations built for local businesses. Each one runs silently in the background while you get on with the job.
              </p>
            </div>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 24 }}>
            {FLOWS.map((flow, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <AutomationFlow flow={flow} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{
        padding: "100px clamp(24px,6vw,72px)",
        borderTop: `1px solid ${C.border}`,
        textAlign: "center", position: "relative",
      }}>
        <div style={{
          position: "absolute", left: "50%", top: 0, width: 1, height: 80,
          background: `linear-gradient(to bottom, ${C.red}, transparent)`,
          transform: "translateX(-50%)",
        }} />
        <Reveal>
          <div style={{ maxWidth: 600, margin: "0 auto" }}>
            <Label>Your Turn</Label>
            <h2 style={{
              fontFamily: "'Playfair Display',Georgia,serif",
              fontSize: "clamp(28px,4vw,48px)", fontWeight: 800,
              color: C.t1, margin: "0 0 20px 0", letterSpacing: "-0.025em",
            }}>
              What could this look like<br />
              <span style={{ color: C.red }}>for your business?</span>
            </h2>
            <p style={{
              fontFamily: "'Inter',sans-serif", fontSize: 16, color: C.t2,
              lineHeight: 1.75, marginBottom: 40,
            }}>
              Free conversation. No pitch, no pressure. I'll tell you exactly what would work for your business — and what wouldn't.
            </p>
            <a href="/#contact" style={{
              display: "inline-block", padding: "18px 48px",
              background: C.red, color: "#fff",
              fontFamily: "'Inter',sans-serif", fontSize: 14, fontWeight: 700,
              letterSpacing: "0.06em", textTransform: "uppercase",
              textDecoration: "none", transition: "all 0.4s",
              boxShadow: "0 4px 30px rgba(200,16,46,0.2)",
            }}
              onMouseEnter={e => { e.target.style.background = C.redHov; e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 8px 40px rgba(200,16,46,0.3)"; }}
              onMouseLeave={e => { e.target.style.background = C.red; e.target.style.transform = "none"; e.target.style.boxShadow = "0 4px 30px rgba(200,16,46,0.2)"; }}
            >Let's Talk — It's Free</a>
          </div>
        </Reveal>
      </section>

      {/* ── Footer ── */}
      <footer style={{ padding: "40px clamp(24px,6vw,72px)", borderTop: `1px solid ${C.border}` }}>
        <div style={{
          maxWidth: 1100, margin: "0 auto",
          display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16,
        }}>
          <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 12, color: C.t3 }}>© 2026 Asher Price · Blackwood, South Wales</span>
          <a href="/" style={{ fontFamily: "'Inter',sans-serif", fontSize: 12, color: C.t3, textDecoration: "none", transition: "color 0.3s" }}
            onMouseEnter={e => e.target.style.color = C.red}
            onMouseLeave={e => e.target.style.color = C.t3}
          >← Back to main site</a>
        </div>
      </footer>
    </div>
  );
}
