import { NextResponse } from "next/server";

type Payload = {
  name?: string;
  email?: string;
  company?: string;
  role?: string;
  message?: string;
  interests?: string[];
};

// Receives the contact form. Set CONTACT_WEBHOOK_URL (e.g. a Formspree,
// HubSpot, Zapier, or Slack webhook) to forward submissions somewhere real.
export async function POST(request: Request) {
  let body: Payload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const missing = (["name", "email", "company", "message"] as const).filter((k) => !body[k]?.trim());
  if (missing.length > 0 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email ?? "")) {
    return NextResponse.json({ error: "Missing or invalid fields.", fields: missing }, { status: 400 });
  }

  const submission = {
    name: body.name!.trim(),
    email: body.email!.trim(),
    company: body.company!.trim(),
    role: body.role?.trim() ?? "",
    message: body.message!.trim(),
    interests: Array.isArray(body.interests) ? body.interests.slice(0, 10) : [],
    receivedAt: new Date().toISOString(),
  };

  const webhook = process.env.CONTACT_WEBHOOK_URL;
  if (!webhook) {
    console.info("[contact] CONTACT_WEBHOOK_URL not set; submission logged only:", submission);
    return NextResponse.json({ ok: true });
  }

  const res = await fetch(webhook, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(submission),
  });

  if (!res.ok) {
    console.error("[contact] webhook failed", res.status);
    return NextResponse.json({ error: "Could not deliver message." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
