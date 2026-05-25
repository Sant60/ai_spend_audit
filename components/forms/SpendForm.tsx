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
  }

  function validateForm() {
    if (!formData.toolId || !formData.currentPlanId || !formData.useCase) {
      return "Fill out every field.";
    }

    if (
      formData.monthlySpend <= 0 ||
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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
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

  return (
    <div className="shadow inset-shadow-sm inset-shadow-black bg-white p-6 sm:p-8">
      <div className="mb-8 space-y-2">
        <h2 className="text-2xl font-bold text-black">
          Enter your current setup
        </h2>
        <p className="text-sm leading-6 text-black">
          One tool is enough. We&apos;ll flag overpriced plans, extra seats, and
          easy savings.
        </p>
      </div>

      <form className="grid gap-5" onSubmit={handleSubmit}>
        <ToolSelector value={formData.toolId} onChange={handleToolChange} />

        <label className="flex flex-col gap-2">
          <span className="text-sm font-bold text-black">Current plan</span>
          <select
            value={formData.currentPlanId}
            onChange={(event) =>
              updateField("currentPlanId", event.target.value)
            }
            className="border border-black bg-white px-4 py-3 text-sm text-black outline-none focus:border-[#112a5c]"
          >
            {selectedTool.plans.map((plan) => (
              <option key={plan.id} value={plan.id}>
                {plan.name} (${plan.monthlyPrice}/seat)
              </option>
            ))}
          </select>
        </label>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-bold text-black">Monthly spend</span>
            <input
              type="number"
              min="1"
              value={formData.monthlySpend}
              onChange={(event) =>
                updateField("monthlySpend", Number(event.target.value))
              }
              className="border border-black bg-white px-4 py-3 text-sm text-black outline-none focus:border-[#112a5c]"
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
              className="border border-black bg-white px-4 py-3 text-sm text-black outline-none focus:border-[#112a5c]"
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
              className="border border-black bg-white px-4 py-3 text-sm text-black outline-none focus:border-[#112a5c]"
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
              className="border border-black bg-white px-4 py-3 text-sm text-black outline-none focus:border-[#112a5c]"
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
          <p className="border border-black bg-white px-4 py-3 text-sm font-bold text-black">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 inline-flex items-center justify-center border border-black bg-[#112a5c] px-5 py-3 text-sm font-bold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:bg-[#112a5c]"
        >
          {isSubmitting ? "Building report..." : "Generate Report"}
        </button>
      </form>
    </div>
  );
};

export default SpendForm;
