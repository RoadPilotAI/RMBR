export type ContextType = 'work' | 'home' | 'personal' | 'custom';

export interface AppContext {
  id: string;
  name: string;
  type: ContextType;
  createdAt: string;
}
