import "server-only";

/**
 * Transactional email via Resend's HTTP API (no SDK dependency).
 *
 * Config-driven like the rest of the app: with no RESEND_API_KEY the
 * message is logged to the server console instead of sent, so local dev
 * works with zero setup and production goes live via env vars alone.
 */

export const isEmailConfigured = Boolean(process.env.RESEND_API_KEY);

const FROM = process.env.EMAIL_FROM ?? "MEHRAB <onboarding@resend.dev>";

/**
 * Where customer replies go. The From address must live on a domain we can
 * authenticate (SPF/DKIM), but that domain need not receive mail — replies
 * are routed here instead, e.g. a Gmail inbox.
 */
const REPLY_TO = process.env.EMAIL_REPLY_TO;

export interface EmailResult {
  ok: boolean;
  id?: string;
  error?: string;
}

export async function sendEmail(input: {
  to: string;
  subject: string;
  html: string;
  /** Overrides EMAIL_REPLY_TO for this message. */
  replyTo?: string;
}): Promise<EmailResult> {
  if (!isEmailConfigured) {
    console.info(
      `[email:dev] would send "${input.subject}" to ${input.to} (set RESEND_API_KEY to send for real)`
    );
    return { ok: true, id: "dev-logged" };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM,
        to: [input.to],
        subject: input.subject,
        html: input.html,
        ...(input.replyTo ?? REPLY_TO
          ? { reply_to: input.replyTo ?? REPLY_TO }
          : {}),
      }),
    });

    const body = (await res.json()) as { id?: string; message?: string };
    if (!res.ok) {
      console.error(`[email] Resend ${res.status}: ${body.message}`);
      return { ok: false, error: body.message ?? `HTTP ${res.status}` };
    }
    console.info(`[email] sent "${input.subject}" to ${input.to} (${body.id})`);
    return { ok: true, id: body.id };
  } catch (err) {
    console.error("[email] send failed", err);
    return { ok: false, error: "Network error" };
  }
}
