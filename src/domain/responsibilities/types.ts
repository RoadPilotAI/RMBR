export interface Responsibility {
  id: string;
  contextId: string;
  name: string;
  description: string | null;
  definitionOfDone: string | null;
  monitoringRule: string | null;
  recurrenceRule: string | null;
  defaultLeadTime: number | null;
  expectedDuration: number | null;
  requiredLocation: string | null;
  active: boolean;
  nextReviewAt: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}
