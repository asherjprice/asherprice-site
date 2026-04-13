const RATE_LIMIT_WINDOW = 60 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
const ipSubmissions = new Map();

const EMAIL_WORKER_URL = "https://asherprice-email.asherjprice.workers.dev";

function cleanupExpired() {
  const now = Date.now();
  for (const [ip, entries] of ipSubmissions) {
    const valid = entries.filter((t) => now - t < RATE_LIMIT_WINDOW);
    if (valid.length === 0) ipSubmissions.delete(ip);
    else ipSubmissions.set(ip, valid);
  }
}

function isRateLimited(ip) {
  cleanupExpired();
  const now = Date.now();
  const entries = (ipSubmissions.get(ip) || []).filter(
    (t) => now - t < RATE_LIMIT_WINDOW
  );
  if (entries.length >= RATE_LIMIT_MAX) return true;
  entries.push(now);
  ipSubmissions.set(ip, entries);
  return false;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

export async function onRequestPost(context) {
  const { request, env } = context;

  const ip = request.headers.get("CF-Connecting-IP") || "unknown";
  if (isRateLimited(ip)) {
    return json({ success: false, error: "Too many requests. Please try again later." }, 429);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ success: false, error: "Invalid JSON body." }, 400);
  }

  const { name, business, contact, website, message, source } = body;

  if (!name || !name.trim()) {
    return json({ success: false, error: "Name is required." }, 400);
  }
  if (!contact || !contact.trim()) {
    return json({ success: false, error: "Contact information is required." }, 400);
  }

  const sourceLabel = source === "chatbot" ? "Chatbot" : "Contact Form";
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; background: #08090B; color: #F0EDEA; padding: 32px; border-radius: 8px;">
      <h2 style="margin: 0 0 4px; font-size: 20px; color: #F0EDEA;">New Enquiry</h2>
      <p style="margin: 0 0 24px; font-size: 13px; color: #888;">via ${sourceLabel}</p>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; color: #888; width: 100px; vertical-align: top;">Name</td>
          <td style="padding: 8px 0; color: #F0EDEA;">${escapeHtml(name)}</td>
        </tr>
        ${business ? `<tr>
          <td style="padding: 8px 0; color: #888; vertical-align: top;">Business</td>
          <td style="padding: 8px 0; color: #F0EDEA;">${escapeHtml(business)}</td>
        </tr>` : ""}
        <tr>
          <td style="padding: 8px 0; color: #888; vertical-align: top;">Contact</td>
          <td style="padding: 8px 0; color: #F0EDEA;">${escapeHtml(contact)}</td>
        </tr>
        ${website ? `<tr>
          <td style="padding: 8px 0; color: #888; vertical-align: top;">Website</td>
          <td style="padding: 8px 0; color: #F0EDEA;">${escapeHtml(website)}</td>
        </tr>` : ""}
        ${message ? `<tr>
          <td style="padding: 8px 0; color: #888; vertical-align: top;">Message</td>
          <td style="padding: 8px 0; color: #F0EDEA; white-space: pre-wrap;">${escapeHtml(message)}</td>
        </tr>` : ""}
      </table>
    </div>
  `.trim();

  try {
    const emailRes = await fetch(EMAIL_WORKER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Auth-Key": env.EMAIL_AUTH_KEY,
      },
      body: JSON.stringify({
        from: "AP Website <notifications@asherprice.co.uk>",
        to: "asherjprice@gmail.com",
        subject: `New enquiry from ${name.trim()}`,
        html,
      }),
    });

    if (!emailRes.ok) {
      console.error("Email worker error:", await emailRes.text());
    }
  } catch (err) {
    console.error("Email send error:", err);
  }

  return json({ success: true });
}
