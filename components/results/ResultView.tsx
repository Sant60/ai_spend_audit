"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AuditCard from "@/components/results/AuditCard";
import RecommendationCard from "@/components/results/RecommendationCard";
import SavingsHero from "@/components/results/SavingsHero";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { loadRecentAudit, saveRecentAudit } from "@/lib/utils/localStorage";
import type { AuditResult } from "@/types/audit";

interface ResultViewProps {
  auditId: string;
}

interface LeadFormState {
  name: string;
  email: string;
  company: string;
  role: string;
  _hp: string; // honeypot — must stay hidden
}

const defaultLeadState: LeadFormState = {
  name: "",
  email: "",
  company: "",
  role: "",
  _hp: "",
};

const ResultView = ({ auditId }: ResultViewProps) => {
  const [audit, setAudit] = useState<AuditResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [leadForm, setLeadForm] = useState(defaultLeadState);
  const [leadStatus, setLeadStatus] = useState("");
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadAudit() {
      const localAudit = loadRecentAudit(auditId);

      if (localAudit) {
        setAudit(localAudit);
        setIsLoading(false);
      }

      try {
        const response = await fetch(`/api/audits/${auditId}`);

        if (!response.ok) {
          if (!localAudit) {
            setError("Couldn't find that report.");
          }
          return;
        }

        const data = (await response.json()) as { audit: AuditResult };
        setAudit(data.audit);
        saveRecentAudit(data.audit);
        setError("");
      } catch {
        if (!localAudit) {
          setError("Couldn't load that report.");
        }
      } finally {
        setIsLoading(false);
      }
    }

    void loadAudit();
  }, [auditId]);

  function updateLeadField(key: keyof LeadFormState, value: string) {
    setLeadForm((current) => ({ ...current, [key]: value }));
  }

  function handleCopyLink() {
    const url = typeof window !== "undefined" ? window.location.href : "";
    void navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleLeadSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!audit) return;

    setIsSubmittingLead(true);

    try {
      // Fire email and lead capture in parallel
      await Promise.allSettled([
        fetch("/api/send-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: leadForm.email, name: leadForm.name, audit }),
        }),
        fetch("/api/leads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ auditId: audit.id, ...leadForm }),
        }),
      ]);

      setLeadStatus("Report sent to your email. We'll be in touch.");
      setLeadForm(defaultLeadState);
    } catch {
      setLeadStatus("Couldn't save that right now. Try again.");
    } finally {
      setIsSubmittingLead(false);
    }
  }

  if (isLoading) {
    return (
      <div className="mx-auto flex min-h-[60vh] w-full max-w-5xl items-center justify-center px-4">
        <p className="border border-black bg-white px-4 py-3 text-sm text-black">
          Loading report...
        </p>
      </div>
    );
  }

  if (!audit) {
    return (
      <div className="mx-auto flex min-h-[60vh] w-full max-w-3xl flex-col items-center justify-center gap-4 px-4 text-center">
        <h1 className="text-2xl font-bold text-black">Report not found</h1>
        <p className="text-sm leading-6 text-black">
          {error || "This link may be wrong, or the report is no longer here."}
        </p>
        <Link
          href="/audit"
          className="border border-black bg-[#112a5c] px-5 py-3 text-sm font-bold text-white transition hover:bg-black"
        >
          Start Audit
        </Link>
      </div>
    );
  }

  const isHighSavings = audit.monthlySavings >= 500;
  const isOptimal = !audit.overspend && audit.monthlySavings < 100;

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6">
      <SavingsHero
        currentSpend={audit.input.monthlySpend}
        monthlySavings={audit.monthlySavings}
        annualSavings={audit.annualSavings}
        overspend={audit.overspend}
      />

      {/* HIGH-SAVINGS CREDEX CTA — shown when >$500/mo potential savings */}
      {isHighSavings && (
        <div className="border-2 border-[#112a5c] bg-[#112a5c] p-6 text-white">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/70">
                You&apos;re overpaying by {formatCurrency(audit.monthlySavings)}
                /mo
              </p>
              <h3 className="text-xl font-bold">
                Credex can get you these tools at a significant discount.
              </h3>
              <p className="max-w-xl text-sm leading-6 text-white/80">
                Credex resells discounted AI infrastructure credits — Cursor,
                Claude, ChatGPT Enterprise, and others — sourced from companies
                that overforecast. Book a free 15-minute consultation and
                we&apos;ll show you the exact discount available for your stack.
              </p>
            </div>
            <a
              href="https://credex.rocks"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center justify-center border border-white bg-white px-6 py-3 text-sm font-bold text-[#112a5c] transition hover:bg-white/90"
            >
              Book Free Consultation →
            </a>
          </div>
        </div>
      )}

      {/* ALREADY OPTIMAL — shown when <$100/mo savings or no overspend */}
      {isOptimal && (
        <div className="border border-black bg-white p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-bold text-black">
                You&apos;re spending well.
              </h3>
              <p className="mt-1 max-w-lg text-sm leading-6 text-neutral-700">
                We don&apos;t see meaningful overspend in your current setup. If
                your stack or team size changes, run a new audit. We&apos;ll
                notify you when new optimisations apply.
              </p>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                void fetch("/api/leads", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    auditId: audit.id,
                    email: fd.get("email"),
                    name: "subscriber",
                    notify: true,
                  }),
                });
                (e.target as HTMLFormElement).reset();
              }}
              className="flex shrink-0 gap-2"
            >
              <input
                type="email"
                name="email"
                placeholder="your@email.com"
                required
                className="border border-black bg-white px-3 py-2 text-sm text-black outline-none focus:border-[#112a5c]"
              />
              <button
                type="submit"
                className="border border-black bg-[#112a5c] px-4 py-2 text-sm font-bold text-white transition hover:bg-black"
              >
                Notify me
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
        <div className="grid gap-6">
          <AuditCard title="Recommendation" subtitle="">
            <RecommendationCard recommendation={audit.recommendation} />
          </AuditCard>

          <AuditCard
            title="Findings"
            subtitle="Based on plan, seats, and spend."
          >
            {audit.findings.length > 0 ? (
              <div className="grid gap-4">
                {audit.findings.map((finding) => (
                  <div
                    key={finding.title}
                    className="border border-black bg-white p-4"
                  >
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <h3 className="font-bold text-black">{finding.title}</h3>
                      <span
                        className={`border px-2.5 py-1 text-xs font-bold uppercase tracking-wide ${
                          finding.impact === "high"
                            ? "border-red-600 bg-red-600 text-white"
                            : finding.impact === "medium"
                              ? "border-amber-500 bg-amber-500 text-white"
                              : "border-black bg-[#112a5c] text-white"
                        }`}
                      >
                        {finding.impact} impact
                      </span>
                    </div>
                    <p className="text-sm leading-6 text-black">
                      {finding.detail}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm leading-6 text-black">
                No major issues found. Your plan looks well-matched to your team
                size and use case.
              </p>
            )}
          </AuditCard>

          <AuditCard
            title="AI Summary"
            subtitle="Plain-English overview of your audit."
          >
            <p className="text-sm leading-7 text-black">{audit.summary}</p>
          </AuditCard>
        </div>

        <div className="grid gap-6">
          <AuditCard title="Breakdown">
            <div className="grid gap-4 text-sm text-black">
              <div className="flex items-center justify-between gap-4">
                <span>Current tool</span>
                <span className="font-bold text-black">
                  {audit.currentToolName}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span>Current plan</span>
                <span className="font-bold text-black">
                  {audit.currentPlanName}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span>Benchmark spend</span>
                <span className="font-bold text-black">
                  {formatCurrency(audit.benchmarkSpend)}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span>Monthly savings</span>
                <span className="font-bold text-green-700">
                  {formatCurrency(audit.monthlySavings)}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span>Annual savings</span>
                <span className="font-bold text-green-700">
                  {formatCurrency(audit.annualSavings)}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span>Use case</span>
                <span className="font-bold capitalize text-black">
                  {audit.input.useCase}
                </span>
              </div>
            </div>
          </AuditCard>

          {/* Share card */}
          <AuditCard title="Share this report">
            <p className="mb-4 text-sm leading-6 text-black">
              This audit has a unique public URL. Share it with your team or on
              social media — identifying details are stripped.
            </p>
            <button
              onClick={handleCopyLink}
              className="w-full border border-black bg-white px-5 py-3 text-sm font-bold text-black transition hover:bg-neutral-100"
            >
              {copied ? "Copied!" : "Copy Shareable Link"}
            </button>
          </AuditCard>

          <AuditCard
            title="Get the full report"
            subtitle="We'll send the audit to your inbox and flag any new savings as AI pricing changes."
          >
            <form className="grid gap-4" onSubmit={handleLeadSubmit}>
              {/* Honeypot — visually hidden, must NOT be visible to users */}
              <input
                type="text"
                value={leadForm._hp}
                onChange={(e) => updateLeadField("_hp", e.target.value)}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                style={{
                  position: "absolute",
                  opacity: 0,
                  pointerEvents: "none",
                  height: 0,
                  width: 0,
                  overflow: "hidden",
                }}
              />

              <input
                type="text"
                value={leadForm.name}
                onChange={(e) => updateLeadField("name", e.target.value)}
                placeholder="Full name"
                required
                className="border border-black bg-white px-4 py-3 text-sm text-black outline-none focus:border-[#112a5c]"
              />
              <input
                type="email"
                value={leadForm.email}
                onChange={(e) => updateLeadField("email", e.target.value)}
                placeholder="Work email"
                required
                className="border border-black bg-white px-4 py-3 text-sm text-black outline-none focus:border-[#112a5c]"
              />
              <input
                type="text"
                value={leadForm.company}
                onChange={(e) => updateLeadField("company", e.target.value)}
                placeholder="Company (optional)"
                className="border border-black bg-white px-4 py-3 text-sm text-black outline-none focus:border-[#112a5c]"
              />
              <input
                type="text"
                value={leadForm.role}
                onChange={(e) => updateLeadField("role", e.target.value)}
                placeholder="Your role (optional)"
                className="border border-black bg-white px-4 py-3 text-sm text-black outline-none focus:border-[#112a5c]"
              />
              <button
                type="submit"
                disabled={isSubmittingLead}
                className="border border-black bg-[#112a5c] px-5 py-3 text-sm font-bold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmittingLead ? "Sending..." : "Send My Report"}
              </button>
              {leadStatus ? (
                <p
                  className={`text-sm leading-6 ${
                    leadStatus.includes("sent")
                      ? "text-green-700"
                      : "text-red-600"
                  }`}
                >
                  {leadStatus}
                </p>
              ) : null}
            </form>
          </AuditCard>
        </div>
      </div>

      {/* Bottom share + new audit CTA */}
      <div className="mt-4 flex flex-col items-center gap-4 border-t border-black pt-8 sm:flex-row sm:justify-between">
        <Link
          href="/audit"
          className="border border-black bg-white px-5 py-3 text-sm font-bold text-black transition hover:bg-neutral-100"
        >
          ← Audit Another Tool
        </Link>
        <p className="text-sm text-neutral-600">
          Powered by{" "}
          <a
            href="https://credex.rocks"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-black underline"
          >
            Credex
          </a>{" "}
          — discounted AI infrastructure credits for startups
        </p>
      </div>
    </div>
  );
};

export default ResultView;
