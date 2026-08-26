export type PlanningBlockStatus = 'proposed' | 'confirmed' | 'conflict' | 'cancelled';
export type PlanningBlockSource = 'user' | 'system';

export interface PlanningBlock {
  id: string;
  taskId: string;
  startAt: string;
  endAt: string;
  status: PlanningBlockStatus;
  source: PlanningBlockSource;
  createdAt: string;
  updatedAt: string;
}

export interface PlanConflict {
  planningBlockId: string;
  calendarEventId: string;
  detectedAt: string;
  resolvedAt: string | null;
}
