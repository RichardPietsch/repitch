'use client';

import { FormEvent, useState } from 'react';

export default function HomePage() {
  const [testEmailTo, setTestEmailTo] = useState('');
  const [sendingTestEmail, setSendingTestEmail] = useState(false);
  const [emailResult, setEmailResult] = useState<string | null>(null);

  const sendTestEmail = async (event: FormEvent) => {
    event.preventDefault();
    setSendingTestEmail(true);
    setEmailResult(null);

    try {
      const response = await fetch('/api/email/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ to: testEmailTo })
      });

      const data = (await response.json()) as { ok: boolean; error?: string; messageId?: string };

      if (!response.ok || !data.ok) {
        setEmailResult(`❌ Test email failed: ${data.error ?? 'Unknown error'}`);
        return;
      }

      setEmailResult(`✅ Test email sent successfully (messageId: ${data.messageId ?? 'n/a'})`);
    } catch (error) {
      setEmailResult(`❌ Test email failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setSendingTestEmail(false);
    }
  };

  return (
    <main className="mx-auto min-h-screen max-w-3xl p-6 md:p-10">
      <header className="mb-8">
        <p className="text-sm font-medium uppercase tracking-wide text-blue-700">Repitch</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Create a new pitch feedback round</h1>
        <p className="mt-3 text-slate-600">
          This is the initial frontend scaffold. Fill in pitch metadata and participant emails in the next implementation step.
        </p>
      </header>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <form className="grid gap-4" aria-label="pitch metadata form">
          <label className="grid gap-1">
            <span className="text-sm font-medium text-slate-700">Pitch title</span>
            <input
              className="rounded-md border border-slate-300 px-3 py-2"
              placeholder="e.g. Q2 GTM Pitch"
              type="text"
            />
          </label>

          <label className="grid gap-1">
            <span className="text-sm font-medium text-slate-700">Short context</span>
            <textarea
              className="min-h-24 rounded-md border border-slate-300 px-3 py-2"
              placeholder="What was the pitch about?"
            />
          </label>

          <label className="grid gap-1">
            <span className="text-sm font-medium text-slate-700">Response deadline</span>
            <input className="rounded-md border border-slate-300 px-3 py-2" type="datetime-local" />
          </label>

          <label className="grid gap-1">
            <span className="text-sm font-medium text-slate-700">Participant emails</span>
            <textarea
              className="min-h-24 rounded-md border border-slate-300 px-3 py-2"
              placeholder="one@email.com, two@email.com"
            />
          </label>

          <button
            className="mt-2 w-fit rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
            disabled
            type="button"
          >
            Send invite links (coming next)
          </button>
        </form>
      </section>

      <section className="mt-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">SMTP test</h2>
        <p className="mt-1 text-sm text-slate-600">
          Send a test message first to confirm SMTP setup. You can set a fallback recipient with TEST_EMAIL_TO in your environment.
        </p>

        <form className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end" onSubmit={sendTestEmail}>
          <label className="grid flex-1 gap-1">
            <span className="text-sm font-medium text-slate-700">Recipient email</span>
            <input
              className="rounded-md border border-slate-300 px-3 py-2"
              onChange={(event) => setTestEmailTo(event.target.value)}
              placeholder="recipient@example.com"
              type="email"
              value={testEmailTo}
            />
          </label>
          <button
            className="w-fit rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
            disabled={sendingTestEmail}
            type="submit"
          >
            {sendingTestEmail ? 'Sending…' : 'Send test email'}
          </button>
        </form>

        {emailResult ? <p className="mt-3 text-sm text-slate-700">{emailResult}</p> : null}
      </section>
    </main>
  );
}
