import type { ToolOption, UseCase } from "@/types/tool";

export const TOOL_OPTIONS: ToolOption[] = [
  {
    id: "cursor",
    name: "Cursor",
    description: "AI-first code editor for coding teams that want AI inside the editor.",
    bestFor: ["coding"],
    plans: [
      { id: "hobby", name: "Hobby", monthlyPrice: 0, kind: "individual" },
      { id: "pro", name: "Pro", monthlyPrice: 20, kind: "individual" },
      { id: "business", name: "Business", monthlyPrice: 40, kind: "team" },
      { id: "enterprise", name: "Enterprise", monthlyPrice: 100, kind: "enterprise" },
    ],
  },
  {
    id: "copilot",
    name: "GitHub Copilot",
    description: "AI pair programmer integrated into VS Code, JetBrains, and more.",
    bestFor: ["coding"],
    plans: [
      { id: "individual", name: "Individual", monthlyPrice: 10, kind: "individual" },
      { id: "business", name: "Business", monthlyPrice: 19, kind: "team" },
      { id: "enterprise", name: "Enterprise", monthlyPrice: 39, kind: "enterprise" },
    ],
  },
  {
    id: "claude",
    name: "Claude",
    description: "Strong fit for writing-heavy, research-heavy, and long-form workflows.",
    bestFor: ["writing", "research", "general"],
    plans: [
      { id: "free", name: "Free", monthlyPrice: 0, kind: "individual" },
      { id: "pro", name: "Pro", monthlyPrice: 20, kind: "individual" },
      { id: "max", name: "Max", monthlyPrice: 100, kind: "individual" },
      { id: "team", name: "Team", monthlyPrice: 30, kind: "team" },
      { id: "enterprise", name: "Enterprise", monthlyPrice: 60, kind: "enterprise" },
      { id: "api", name: "API Direct", monthlyPrice: 50, kind: "individual" },
    ],
  },
  {
    id: "chatgpt",
    name: "ChatGPT",
    description: "Flexible for general purpose drafting, analysis, and quick team help.",
    bestFor: ["general", "research", "writing"],
    plans: [
      { id: "free", name: "Free", monthlyPrice: 0, kind: "individual" },
      { id: "plus", name: "Plus", monthlyPrice: 20, kind: "individual" },
      { id: "team", name: "Team", monthlyPrice: 30, kind: "team" },
      { id: "enterprise", name: "Enterprise", monthlyPrice: 60, kind: "enterprise" },
      { id: "api", name: "API Direct", monthlyPrice: 50, kind: "individual" },
    ],
  },
  {
    id: "anthropic_api",
    name: "Anthropic API",
    description: "Direct API access to Claude models — pay per token.",
    bestFor: ["coding", "data", "general"],
    plans: [
      { id: "payg", name: "Pay-as-you-go", monthlyPrice: 50, kind: "individual" },
    ],
  },
  {
    id: "openai_api",
    name: "OpenAI API",
    description: "Direct API access to GPT models — pay per token.",
    bestFor: ["coding", "data", "general"],
    plans: [
      { id: "payg", name: "Pay-as-you-go", monthlyPrice: 50, kind: "individual" },
    ],
  },
  {
    id: "gemini",
    name: "Gemini",
    description: "Useful for broad office workflows when teams are already in Google Workspace.",
    bestFor: ["general", "research", "data"],
    plans: [
      { id: "ai_premium", name: "AI Premium (Google One)", monthlyPrice: 20, kind: "individual" },
      { id: "workspace", name: "Workspace Add-on", monthlyPrice: 30, kind: "team" },
      { id: "api", name: "API Direct", monthlyPrice: 50, kind: "individual" },
    ],
  },
  {
    id: "windsurf",
    name: "Windsurf",
    description: "AI-powered IDE by Codeium with deep codebase understanding.",
    bestFor: ["coding"],
    plans: [
      { id: "free", name: "Free", monthlyPrice: 0, kind: "individual" },
      { id: "pro", name: "Pro", monthlyPrice: 15, kind: "individual" },
      { id: "teams", name: "Teams", monthlyPrice: 35, kind: "team" },
    ],
  },
];

export const USE_CASE_OPTIONS: { value: UseCase; label: string }[] = [
  { value: "coding", label: "Coding / Engineering" },
  { value: "writing", label: "Writing / Content" },
  { value: "data", label: "Data / Analytics" },
  { value: "research", label: "Research" },
  { value: "mixed", label: "Mixed Use" },
  { value: "general", label: "General Team Use" },
];
