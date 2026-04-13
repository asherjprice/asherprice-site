import { EmailMessage } from "cloudflare:email";

function buildMimeEmail(from, to, subject, html) {
  const boundary = "----=_Part_" + Date.now();
  return [
    `From: ${from}`,
    `To: ${to}`,
    `Subject: ${subject}`,
    `MIME-Version: 1.0`,
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    ``,
    `--${boundary}`,
    `Content-Type: text/html; charset=utf-8`,
    `Content-Transfer-Encoding: 7bit`,
    ``,
    html,
    ``,
    `--${boundary}--`,
  ].join("\r\n");
}

export default {
  async fetch(request, env) {
    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    const authHeader = request.headers.get("X-Auth-Key");
    if (!authHeader || authHeader !== env.AUTH_KEY) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { from, to, subject, html } = await request.json();

    const mimeEmail = buildMimeEmail(from, to, subject, html);
    const msg = new EmailMessage(from, to, new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode(mimeEmail));
        controller.close();
      },
    }));

    await env.SEND_EMAIL.send(msg);
    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
    });
  },
};
