"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import ToolSelector from "@/components/forms/ToolSelector";
import { TOOL_OPTIONS, USE_CASE_OPTIONS } from "@/constants/tools";
import {
  clearAuditDraft,
  loadAuditDraft,
  saveAuditDraft,
  saveRecentAudit,
} from "@/lib/utils/localStorage";
import type { AuditFormInput, AuditResult } from "@/types/audit";

const defaultFormState: AuditFormInput = {
  toolId: "chatgpt",
  currentPlanId: "plus",
  monthlySpend: 60,
  seats: 3,
  teamSize: 3,
  useCase: "general",
};

const SpendForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<AuditFormInput>(() => {
    return loadAuditDraft() ?? defaultFormState;
  });
  const [honeypot, setHoneypot] = useState(""); // bot trap
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedTool = useMemo(
    () =>
      TOOL_OPTIONS.find((tool) => tool.id === formData.toolId) ??
      TOOL_OPTIONS[0],
    [formData.toolId],
  );

  useEffect(() => {
    saveAuditDraft(formData);
  }, [formData]);

  function updateField<Key extends keyof AuditFormInput>(
    key: Key,
    value: AuditFormInput[Key],
  ) {
    setFormData((current) => ({ ...current, [key]: value }));
  }

  function handleToolChange(toolId: string) {
    const tool = TOOL_OPTIONS.find((item) => item.id === toolId);
    updateField("toolId", toolId);
    updateField("currentPlanId", tool?.plans[0]?.id ?? "");
    // Set default monthly spend from plan price
    const firstPlan = tool?.plans[0];
    if (firstPlan && firstPlan.monthlyPrice > 0) {
      updateField("monthlySpend", firstPlan.monthlyPrice * formData.seats);
    }
  }

  function validateForm() {
    if (!formData.toolId || !formData.currentPlanId || !formData.useCase) {
      return "Fill out every field.";
    }
    if (
      formData.monthlySpend < 0 ||
      formData.seats <= 0 ||
      formData.teamSize <= 0
    ) {
      return "Enter valid numbers for spend, seats, and team size.";
    }
    return "";
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/audits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, _hp: honeypot }),
      });

      const data = (await response.json()) as {
        audit?: AuditResult;
        error?: string;
      };

      if (!response.ok || !data.audit) {
        throw new Error(data.error ?? "Couldn't generate report.");
      }

      saveRecentAudit(data.audit);
      clearAuditDraft();
      router.push(data.audit.shareUrl);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Couldn't generate report.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const selectedPlan = selectedTool.plans.find(
    (p) => p.id === formData.currentPlanId,
  );

  return (
    <div className="shadow inset-shadow-sm inset-shadow-black rounded-[20] bg-white p-6 sm:p-8">
      <div className="mb-8 space-y-2">
        <h2 className="text-center text-2xl font-bold text-black">
          Enter your current setup
        </h2>
        <p className="text-center text-sm text-neutral-500">
          Takes 60 seconds. No login required.
        </p>
      </div>

      <form className="grid gap-5" onSubmit={handleSubmit}>
        {/* Honeypot — hidden from real users, bots fill it */}
        <input
          type="text"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
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

        <ToolSelector value={formData.toolId} onChange={handleToolChange} />

        <label className="flex flex-col gap-2">
          <span className="text-sm font-bold text-black">Current plan</span>
          <select
            value={formData.currentPlanId}
            onChange={(event) =>
              updateField("currentPlanId", event.target.value)
            }
            className="shadow inset-shadow-sm inset-shadow-black rounded-[5] border border-black bg-white px-4 py-3 text-sm text-black outline-none focus:border-[#112a5c]"
          >
            {selectedTool.plans.map((plan) => (
              <option key={plan.id} value={plan.id}>
                {plan.name}
                {plan.monthlyPrice > 0
                  ? ` ($${plan.monthlyPrice}/seat)`
                  : " (Free)"}
              </option>
            ))}
          </select>
        </label>

        {selectedPlan && selectedPlan.id === "payg" && (
          <p className="rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
            API/pay-as-you-go plans are usage-based. Enter your average monthly
            bill below.
          </p>
        )}

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-bold text-black">
              Monthly spend ($)
            </span>
            <input
              type="number"
              min="0"
              value={formData.monthlySpend}
              onChange={(event) =>
                updateField("monthlySpend", Number(event.target.value))
              }
              className="shadow inset-shadow-sm inset-shadow-black rounded-[5] border border-black bg-white px-4 py-3 text-sm text-black outline-none focus:border-[#112a5c]"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-bold text-black">Paid seats</span>
            <input
              type="number"
              min="1"
              value={formData.seats}
              onChange={(event) =>
                updateField("seats", Number(event.target.value))
              }
              className="shadow inset-shadow-sm inset-shadow-black rounded-[5] border border-black bg-white px-4 py-3 text-sm text-black outline-none focus:border-[#112a5c]"
            />
          </label>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-bold text-black">Team size</span>
            <input
              type="number"
              min="1"
              value={formData.teamSize}
              onChange={(event) =>
                updateField("teamSize", Number(event.target.value))
              }
              className="shadow inset-shadow-sm inset-shadow-black rounded-[5] border border-black bg-white px-4 py-3 text-sm text-black outline-none focus:border-[#112a5c]"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-bold text-black">Main use case</span>
            <select
              value={formData.useCase}
              onChange={(event) =>
                updateField(
                  "useCase",
                  event.target.value as AuditFormInput["useCase"],
                )
              }
              className="shadow inset-shadow-sm inset-shadow-black rounded-[5] border border-black bg-white px-4 py-3 text-sm text-black outline-none focus:border-[#112a5c]"
            >
              {USE_CASE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {error ? (
          <p className="border border-red-500 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 inline-flex items-center justify-center border border-black bg-[#112a5c] px-5 py-3 text-sm font-bold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Building report..." : "Generate Audit Report →"}
        </button>

        <p className="text-center text-xs text-neutral-400">
          Free. No login required. Your data isn&apos;t sold.
        </p>
      </form>
    </div>
  );
};

export default SpendForm;
