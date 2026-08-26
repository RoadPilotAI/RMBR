import { canTransition, assertTransition } from '../../../src/domain/tasks/taskStateMachine';

describe('taskStateMachine', () => {
  describe('canTransition', () => {
    it('allows inbox → planned', () => {
      expect(canTransition('inbox', 'planned')).toBe(true);
    });

    it('allows planned → in_progress', () => {
      expect(canTransition('planned', 'in_progress')).toBe(true);
    });

    it('allows in_progress → done', () => {
      expect(canTransition('in_progress', 'done')).toBe(true);
    });

    it('allows in_progress → waiting', () => {
      expect(canTransition('in_progress', 'waiting')).toBe(true);
    });

    it('disallows done → planned', () => {
      expect(canTransition('done', 'planned')).toBe(false);
    });

    it('disallows cancelled → in_progress', () => {
      expect(canTransition('cancelled', 'in_progress')).toBe(false);
    });

    it('disallows inbox → done directly', () => {
      expect(canTransition('inbox', 'done')).toBe(false);
    });

    it('disallows done → cancelled (terminal)', () => {
      expect(canTransition('done', 'cancelled')).toBe(false);
    });
  });

  describe('assertTransition', () => {
    it('does not throw for a valid transition', () => {
      expect(() => assertTransition('planned', 'ready')).not.toThrow();
    });

    it('throws for an invalid transition', () => {
      expect(() => assertTransition('done', 'inbox')).toThrow(/invalid task transition/i);
    });
  });
});
