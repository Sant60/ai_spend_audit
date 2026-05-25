import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-10 sm:px-6">
      <section className="grid gap-8 border-black bg-white px-6 py-10 sm:px-10 lg:grid-cols-[1.3fr_0.8fr] lg:items-center">
        <div className="space-y-6">
          <span className="inline-flex border border-black bg-white px-3 py-1 text-xs font-bold uppercase tracking-wide text-black">
            Built for Credex
          </span>
          <div className="space-y-4">
            <h1 className="max-w-3xl text-4xl font-bold leading-tight text-black sm:text-5xl">
              See where your AI spend starts getting sloppy.
            </h1>
            <p className="max-w-2xl text-base leading-8 text-black">
              Add one tool, check the plan against team size, and get a clear
              recommendation.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/audit"
              className="inline-flex items-center justify-center border border-black px-5 py-3 text-sm font-bold text-white transition "
            >
              Start Audit
            </Link>
          </div>
        </div>

        <div className="border-1 border-black bg-[#112a5c] p-6 text-white">
          <p className="text-sm font-bold uppercase tracking-wide text-white">
            Example
          </p>
          <div className="mt-6 grid gap-4">
            <div className="border border-white bg-[#112a5c] p-4">
              <p className="text-sm text-white">Current stack</p>
              <p className="mt-2 text-xl font-bold">ChatGPT Team, 3 seats</p>
              <p className="mt-1 text-sm text-white">$90/month</p>
            </div>
            <div className="border border-white bg-white p-4 text-black">
              <p className="text-sm font-bold uppercase tracking-wide">
                Recommendation
              </p>
              <p className="mt-2 text-xl font-bold">Move to ChatGPT Plus</p>
              <p className="mt-1 text-sm">Save about $30/month</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
