import { TOOL_OPTIONS } from "@/constants/tools";

export function findToolById(toolId: string) {
  return TOOL_OPTIONS.find((tool) => tool.id === toolId);
}

export function findPlanById(toolId: string, planId: string) {
  return findToolById(toolId)?.plans.find((plan) => plan.id === planId);
}
