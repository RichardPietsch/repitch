export default function HomePage() {
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
    </main>
  );
}
