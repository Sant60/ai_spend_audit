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
}

const defaultLeadState: LeadFormState = {
  name: "",
  email: "",
  company: "",
};

const ResultView = ({ auditId }: ResultViewProps) => {
  const [audit, setAudit] = useState<AuditResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [leadForm, setLeadForm] = useState(defaultLeadState);
  const [leadStatus, setLeadStatus] = useState("");
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);

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

  async function handleLeadSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!audit) {
      return;
    }

    setLeadStatus("");
    setIsSubmittingLead(true);

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          auditId: audit.id,
          ...leadForm,
        }),
      });

      const data = (await response.json()) as {
        success?: boolean;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(data.error ?? "Couldn't save that right now.");
      }

      setLeadStatus("Saved. We'll send it over.");
      setLeadForm(defaultLeadState);
    } catch (submitError) {
      setLeadStatus(
        submitError instanceof Error
          ? submitError.message
          : "Couldn't save that right now.",
      );
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

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6">
      <SavingsHero
        currentSpend={audit.input.monthlySpend}
        monthlySavings={audit.monthlySavings}
        annualSavings={audit.annualSavings}
        overspend={audit.overspend}
      />

      <div className="grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
        <div className="grid gap-6">
          <AuditCard
            title="Recommendation"
            subtitle="The clearest way to cut cost without changing how the team works."
          >
            <RecommendationCard recommendation={audit.recommendation} />
          </AuditCard>

          <AuditCard
            title="What looks off"
            subtitle="A few plain-English checks based on plan, seats, and spend."
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
                      <span className="border border-black bg-[#112a5c] px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-white">
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
                Nothing stands out as a big waste here. The current plan is
                pretty close to what this team likely needs.
              </p>
            )}
          </AuditCard>

          <AuditCard title="Summary" subtitle="A quick read on the overall setup.">
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
                <span>Use case</span>
                <span className="font-bold capitalize text-black">
                  {audit.input.useCase}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span>Shareable URL</span>
                <span className="font-bold text-black">/result/{audit.id}</span>
              </div>
            </div>
          </AuditCard>

          <AuditCard
            title="Want a deeper review?"
            subtitle="Leave your details and we'll send this report over."
          >
            <form className="grid gap-4" onSubmit={handleLeadSubmit}>
              <input
                type="text"
                value={leadForm.name}
                onChange={(event) =>
                  updateLeadField("name", event.target.value)
                }
                placeholder="Full name"
                className="border border-black bg-white px-4 py-3 text-sm text-black outline-none focus:border-[#112a5c]"
              />
              <input
                type="email"
                value={leadForm.email}
                onChange={(event) =>
                  updateLeadField("email", event.target.value)
                }
                placeholder="Email"
                className="border border-black bg-white px-4 py-3 text-sm text-black outline-none focus:border-[#112a5c]"
              />
              <input
                type="text"
                value={leadForm.company}
                onChange={(event) =>
                  updateLeadField("company", event.target.value)
                }
                placeholder="Company"
                className="border border-black bg-white px-4 py-3 text-sm text-black outline-none focus:border-[#112a5c]"
              />
              <button
                type="submit"
                disabled={isSubmittingLead}
                className="border border-black bg-[#112a5c] px-5 py-3 text-sm font-bold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:bg-[#112a5c]"
              >
                {isSubmittingLead
                  ? "Sending..."
                  : "Save My Report"}
              </button>
              {leadStatus ? (
                <p className="text-sm leading-6 text-black">{leadStatus}</p>
              ) : null}
            </form>
          </AuditCard>
        </div>
      </div>
    </div>
  );
};

export default ResultView;
