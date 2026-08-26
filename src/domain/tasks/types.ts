export type TaskStatus =
  | 'inbox'
  | 'planned'
  | 'ready'
  | 'in_progress'
  | 'waiting'
  | 'blocked'
  | 'done'
  | 'cancelled';

export interface Task {
  id: string;
  responsibilityId: string | null;
  contextId: string;
  title: string;
  contextPacket: TaskContextPacket | null;
  status: TaskStatus;
  doAt: string | null;
  dueAt: string | null;
  startBy: string | null;
  estimatedDuration: number | null;
  actualDuration: number | null;
  requiredLocation: string | null;
  waitingFor: WaitingMetadata | null;
  blockedBy: BlockedMetadata | null;
  completedAt: string | null;
  cancelledAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TaskContextPacket {
  why: string | null;
  personOrOrg: string | null;
  expectedOutcome: string | null;
  nextStepAfter: string | null;
  sourceNote: string | null;
}

export interface WaitingMetadata {
  waitingFor: string;
  expectedResponseAt: string | null;
  followUpAction: string | null;
}

export interface BlockedMetadata {
  blocker: string;
  nextActionToUnblock: string | null;
  reviewAt: string | null;
}

export const VALID_TRANSITIONS: Record<TaskStatus, TaskStatus[]> = {
  inbox: ['planned', 'ready', 'cancelled'],
  planned: ['ready', 'in_progress', 'waiting', 'blocked', 'cancelled'],
  ready: ['in_progress', 'waiting', 'blocked', 'cancelled'],
  in_progress: ['done', 'waiting', 'blocked', 'planned', 'cancelled'],
  waiting: ['planned', 'ready', 'in_progress', 'done', 'cancelled'],
  blocked: ['planned', 'ready', 'cancelled'],
  done: [],
  cancelled: [],
};
