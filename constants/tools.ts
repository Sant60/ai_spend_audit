import type { ToolOption, UseCase } from "@/types/tool";

export const TOOL_OPTIONS: ToolOption[] = [
  {
    id: "chatgpt",
    name: "ChatGPT",
    description: "Flexible for general purpose drafting, analysis, and quick team help.",
    bestFor: ["general", "research", "writing"],
    plans: [
      { id: "plus", name: "Plus", monthlyPrice: 20, kind: "individual" },
      { id: "team", name: "Team", monthlyPrice: 30, kind: "team" },
      { id: "enterprise", name: "Enterprise", monthlyPrice: 60, kind: "enterprise" },
    ],
  },
  {
    id: "claude",
    name: "Claude",
    description: "Strong fit for writing-heavy, research-heavy, and long-form workflows.",
    bestFor: ["writing", "research", "general"],
    plans: [
      { id: "pro", name: "Pro", monthlyPrice: 20, kind: "individual" },
      { id: "team", name: "Team", monthlyPrice: 30, kind: "team" },
    ],
  },
  {
    id: "cursor",
    name: "Cursor",
    description: "Good fit for coding teams that need AI inside the editor.",
    bestFor: ["coding"],
    plans: [
      { id: "pro", name: "Pro", monthlyPrice: 20, kind: "individual" },
      { id: "business", name: "Business", monthlyPrice: 40, kind: "team" },
    ],
  },
  {
    id: "gemini",
    name: "Gemini",
    description: "Useful for broad office workflows when teams are already in Google Workspace.",
    bestFor: ["general", "research", "support"],
    plans: [
      { id: "advanced", name: "Advanced", monthlyPrice: 20, kind: "individual" },
      { id: "business", name: "Business", monthlyPrice: 30, kind: "team" },
    ],
  },
];

export const USE_CASE_OPTIONS: { value: UseCase; label: string }[] = [
  { value: "coding", label: "Coding" },
  { value: "writing", label: "Writing" },
  { value: "research", label: "Research" },
  { value: "support", label: "Customer support" },
  { value: "general", label: "General team use" },
];
