import { SITE_CONFIG } from "@/lib/data";

export interface InquiryEmailPayload {
  domain_name?: string;
  buyer_name: string;
  buyer_email: string;
  buyer_phone?: string;
  offer_amount?: number;
  notes?: string;
  type?: string;
}

/**
 * Sends a broker notification email when an inquiry or offer is submitted.
 * Uses Resend API via native fetch (no extra npm packages required).
 *
 * Configured via environment variables:
 * - RESEND_API_KEY: Resend API key (starts with "re_")
 * - ADMIN_NOTIFICATION_EMAIL: Recipient email (defaults to sisorasales@gmail.com)
 * - RESEND_FROM_EMAIL: Sender email (defaults to "Sisora Inquiries <onboarding@resend.dev>")
 */
function getCleanApiKey(): string | undefined {
  const raw = process.env.RESEND_API_KEY;
  if (!raw) return undefined;
  const cleaned = raw.trim().replace(/^["']|["']$/g, "").trim();
  return cleaned || undefined;
}

export async function sendInquiryNotificationEmail(payload: InquiryEmailPayload) {
  const apiKey = getCleanApiKey();
  const rawToEmail = process.env.ADMIN_NOTIFICATION_EMAIL || SITE_CONFIG.contact.email || "sisorasales@gmail.com";
  const toEmail = rawToEmail.replace(/["']/g, "").trim();
  const fromEmail = (process.env.RESEND_FROM_EMAIL || "Sisora Inquiries <onboarding@resend.dev>").replace(/^["']|["']$/g, "").trim();

  const domain = payload.domain_name || "Domain Asset";
  const amountStr =
    payload.offer_amount && payload.offer_amount > 1
      ? `$${Number(payload.offer_amount).toLocaleString()} USD`
      : "Make Offer / Acquisition Inquiry";

  const subject = `[New Inquiry] ${domain} from ${payload.buyer_name}`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f7f7f8; margin: 0; padding: 24px; color: #111; }
    .container { max-width: 580px; margin: 0 auto; background: #ffffff; border: 1px solid #e5e5e5; border-radius: 16px; overflow: hidden; }
    .header { background: #000000; color: #ffffff; padding: 24px; text-align: left; }
    .header h1 { margin: 0; font-size: 18px; font-weight: 700; letter-spacing: -0.02em; }
    .header p { margin: 4px 0 0 0; font-size: 12px; color: #a3a3a3; }
    .content { padding: 28px 24px; }
    .pill { display: inline-block; background: #f0f0f0; border-radius: 9999px; padding: 4px 12px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #525252; margin-bottom: 16px; }
    .highlight-card { background: #fafafa; border: 1px solid #eaeaea; border-radius: 12px; padding: 18px; margin: 16px 0; }
    .highlight-label { font-size: 11px; text-transform: uppercase; font-weight: 700; color: #737373; letter-spacing: 0.05em; }
    .highlight-val { font-size: 22px; font-weight: 800; color: #000000; margin-top: 4px; }
    .field-row { margin-bottom: 14px; }
    .field-label { font-size: 11px; font-weight: 700; text-transform: uppercase; color: #888888; letter-spacing: 0.04em; }
    .field-value { font-size: 14px; font-weight: 600; color: #111111; margin-top: 2px; }
    .notes-box { background: #fdfdfd; border-left: 3px solid #000000; padding: 12px 16px; font-size: 13px; color: #333333; line-height: 1.5; margin-top: 6px; }
    .footer { padding: 20px 24px; background: #fafafa; border-top: 1px solid #eeeeee; font-size: 11px; color: #737373; text-align: center; }
    .reply-banner { background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 10px; padding: 12px; margin-top: 20px; font-size: 12px; color: #1e40af; text-align: center; font-weight: 600; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>SISORA Premium Domain Brokerage</h1>
      <p>New acquisition inquiry received</p>
    </div>
    <div class="content">
      <div class="pill">Deal Pipeline Notification</div>
      
      <div class="highlight-card">
        <div class="highlight-label">Target Asset</div>
        <div class="highlight-val">${domain}</div>
        <div style="font-size: 12px; color: #666; margin-top: 4px;">Status / Offer: <strong>${amountStr}</strong></div>
      </div>

      <div class="field-row">
        <div class="field-label">Buyer Full Name</div>
        <div class="field-value">${payload.buyer_name}</div>
      </div>

      <div class="field-row">
        <div class="field-label">Buyer Email Address</div>
        <div class="field-value"><a href="mailto:${payload.buyer_email}" style="color: #000; text-decoration: underline;">${payload.buyer_email}</a></div>
      </div>

      ${
        payload.buyer_phone
          ? `
      <div class="field-row">
        <div class="field-label">Phone / Telegram</div>
        <div class="field-value">${payload.buyer_phone}</div>
      </div>`
          : ""
      }

      ${
        payload.notes
          ? `
      <div class="field-row">
        <div class="field-label">Message / Details</div>
        <div class="notes-box">${payload.notes.replace(/\n/g, "<br>")}</div>
      </div>`
          : ""
      }

      <div class="reply-banner">
        💡 <strong>Direct Reply Enabled:</strong> Simply hit <strong>&ldquo;Reply&rdquo;</strong> in your email client to reply directly to <u>${payload.buyer_email}</u>.
      </div>
    </div>
    <div class="footer">
      SISORA Brokerage Admin Notification &bull; Delivered to ${toEmail}
    </div>
  </div>
</body>
</html>
  `.trim();

  // If no RESEND_API_KEY is configured, log for development / verification
  if (!apiKey) {
    console.warn(
      `[Email Dispatch] RESEND_API_KEY is not set. Inquiry for "${domain}" from "${payload.buyer_email}" recorded in database and visible in /admin/offers.`
    );
    return {
      sent: false,
      reason: "RESEND_API_KEY_NOT_CONFIGURED",
      info: "Inquiry saved to database and visible in admin panel.",
    };
  }

  const recipients = toEmail
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean);

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: recipients,
        reply_to: payload.buyer_email,
        subject,
        html,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      console.error("[Email Dispatch Error]", data);

      // Auto-fallback for Resend Sandbox restriction:
      // If Resend only allows sending to the account owner's email, automatically deliver there
      // so no inquiries are missed while domain verification is pending!
      const match = data?.message?.match(/your own email address \(([^)]+)\)/i);
      const allowedOwnerEmail = match ? match[1].trim() : null;
      if (allowedOwnerEmail && !recipients.every((r) => r.toLowerCase() === allowedOwnerEmail.toLowerCase())) {
        console.warn(`[Email Dispatch Sandbox Fallback] Resend sandbox restricted to ${allowedOwnerEmail}. Retrying dispatch...`);
        try {
          const fallbackRes = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              from: fromEmail,
              to: [allowedOwnerEmail],
              reply_to: payload.buyer_email,
              subject: `${subject} [Sisora Alert to ${allowedOwnerEmail}]`,
              html,
            }),
          });
          const fallbackData = await fallbackRes.json();
          if (fallbackRes.ok) {
            return {
              sent: true,
              data: fallbackData,
              note: `Delivered to Resend verified account (${allowedOwnerEmail}). Verify sisora.si in resend.com/domains to enable multi-recipient delivery.`,
            };
          }
        } catch (fallbackErr) {
          console.error("[Email Dispatch Fallback Error]", fallbackErr);
        }
      }

      return { sent: false, error: data };
    }

    return { sent: true, data };
  } catch (err) {
    console.error("[Email Dispatch Exception]", err);
    return { sent: false, error: err };
  }
}

export async function sendDirectReplyEmail(payload: {
  to: string;
  subject: string;
  body: string;
  domain_name?: string;
}) {
  const apiKey = getCleanApiKey();
  if (!apiKey) {
    return {
      sent: false,
      error: "RESEND_API_KEY is not configured in Vercel. You can still use the 'Open in Gmail' or 'Copy' button!",
    };
  }

  const fromEmail = (process.env.RESEND_FROM_EMAIL || "Sisora Brokerage <onboarding@resend.dev>").replace(/^["']|["']$/g, "").trim();
  const replyTo = (process.env.ADMIN_NOTIFICATION_EMAIL || "sisorasales@gmail.com").replace(/["']/g, "").trim();

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [payload.to],
        reply_to: replyTo,
        subject: payload.subject,
        text: payload.body,
        html: `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #111; line-height: 1.6;">
          <div style="margin-bottom: 20px; font-weight: bold; font-size: 16px;">SISORA Premium Domain Brokerage</div>
          <div style="white-space: pre-wrap; font-size: 14px; color: #222;">${payload.body.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div>
          <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
          <div style="font-size: 11px; color: #888;">
            SISORA Brokerage Desk &bull; Contact: <a href="mailto:${replyTo}" style="color: #444;">${replyTo}</a> &bull; <a href="https://sisora.si" style="color: #444;">sisora.si</a>
          </div>
        </div>`,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      if (data?.message?.includes("You can only send testing emails to your own email address")) {
        return {
          sent: false,
          error:
            "Resend Sandbox Restriction: Because your account is sending from 'onboarding@resend.dev', Resend only allows sending to your account owner email (not to external buyers yet). Please verify your domain (e.g. sisora.si) at resend.com/domains to unlock direct sending, or click 'Open in Gmail' to reply right now!",
        };
      }
      return { sent: false, error: data?.message || "Failed to send email via Resend" };
    }
    return { sent: true, data };
  } catch (err) {
    return { sent: false, error: err instanceof Error ? err.message : "Failed to dispatch email" };
  }
}

