export type UseCase =
  | "coding"
  | "writing"
  | "data"
  | "research"
  | "mixed"
  | "general";

export type PlanKind = "individual" | "team" | "enterprise";

export interface ToolPlan {
  id: string;
  name: string;
  monthlyPrice: number;
  kind: PlanKind;
}

export interface ToolOption {
  id: string;
  name: string;
  description: string;
  bestFor: UseCase[];
  plans: ToolPlan[];
}
