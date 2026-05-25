import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
      <section className="grid gap-12 shadow inset-shadow-sm inset-shadow-black bg-white px-6 py-12 sm:px-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
        {/* LEFT SECTION */}
        <div className="space-y-8">
          <span className="inline-flex border border-black px-3 py-1 text-xs font-bold uppercase tracking-wide text-black">
            Built for Credex
          </span>

          <div className="space-y-5">
            <h1 className="max-w-3xl text-4xl font-bold leading-tight text-black sm:text-5xl">
              Find out if your team is overspending on AI tools.
            </h1>

            <p className="max-w-xl text-base leading-7 text-neutral-700">
              Add your current AI stack, compare plans against team size, and
              get simple recommendations with estimated savings.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <Link
              href="/audit"
              className="inline-flex items-center justify-center bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800"
            >
              Start Audit
            </Link>
          </div>

          {/* SMALL TRUST SECTION */}
          <div className="border-l-2 border-black pl-4">
            <p className="text-sm text-neutral-700">
              Designed for small teams using ChatGPT, Claude, Cursor, Copilot,
              and other AI subscriptions.
            </p>
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="border border-black bg-[#112a5c] p-6 text-white">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/80">
            Example Audit
          </p>

          <div className="mt-6 grid gap-4">
            {/* CURRENT STACK */}
            <div className="border border-white/30 bg-[#17346f] p-5">
              <p className="text-sm text-white/70">Current setup</p>

              <div className="mt-4 space-y-4">
                <div>
                  <p className="text-lg font-semibold">
                    ChatGPT Team (3 users)
                  </p>

                  <p className="text-sm text-white/70">$90/month</p>
                </div>

                <div>
                  <p className="text-lg font-semibold">Cursor Pro (2 users)</p>

                  <p className="text-sm text-white/70">$40/month</p>
                </div>
              </div>

              <div className="mt-5 border-t border-white/20 pt-4">
                <p className="text-sm text-white/80">Total spend: $130/month</p>
              </div>
            </div>

            {/* RECOMMENDATION */}
            <div className="bg-white p-5 text-black">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-500">
                Recommendation
              </p>

              <p className="mt-3 text-2xl font-bold leading-snug">
                Switch 2 users to ChatGPT Plus
              </p>

              <p className="mt-3 text-sm leading-6 text-neutral-700">
                Your current setup looks slightly oversized for a small team. A
                mixed setup would likely reduce monthly costs without affecting
                usage much.
              </p>

              <div className="mt-5 border-t border-neutral-200 pt-4">
                <p className="text-sm font-semibold">
                  Estimated savings: ~$32/month
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
