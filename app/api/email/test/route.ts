import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

type TestEmailPayload = {
  to?: string;
};

function parseBoolean(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined) {
    return fallback;
  }

  return value.toLowerCase() === 'true';
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as TestEmailPayload;
    const to = payload.to?.trim() || process.env.TEST_EMAIL_TO;

    if (!to) {
      return NextResponse.json(
        { ok: false, error: 'Missing recipient. Provide "to" in request body or set TEST_EMAIL_TO.' },
        { status: 400 }
      );
    }

    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT ?? 587);
    const secure = parseBoolean(process.env.SMTP_SECURE, false);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASSWORD;
    const from = process.env.SMTP_FROM;

    if (!host || !from) {
      return NextResponse.json(
        { ok: false, error: 'SMTP_HOST and SMTP_FROM must be configured.' },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: user && pass ? { user, pass } : undefined
    });

    const info = await transporter.sendMail({
      from,
      to,
      subject: 'Repitch SMTP test email',
      text: 'This is a test email from Repitch. If you received this, SMTP sending works.',
      html: '<p>This is a test email from <strong>Repitch</strong>. If you received this, SMTP sending works.</p>'
    });

    return NextResponse.json({
      ok: true,
      messageId: info.messageId,
      accepted: info.accepted
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : 'Unknown SMTP error'
      },
      { status: 500 }
    );
  }
}
