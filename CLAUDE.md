# CLAUDE.md — RMBR Repository Instructions

## Mission

RMBR is an iPhone-first external executive-function system. Its job is to help the user fully own responsibilities without a spouse, manager, coworker, or other person having to remember, prompt, monitor, or follow up for them.

When making product or implementation decisions, prefer the choice that reduces dependence on another human being as the user's reminder system.

## Required reading before work

Before implementing or changing a feature:

1. Read `docs/PRODUCT_HANDOFF.md`.
2. Read the relevant section of `docs/IMPLEMENTATION_PLAN.md`.
3. Inspect the current repository architecture before creating new services or abstractions.
4. Check open GitHub issues and existing tests.
5. State any architecture change before making a substantial one.

## Product doctrine

1. **The system compensates before another person does.**
2. **A responsibility persists even when today's task is complete.**
3. **Every commitment should resolve to a concrete next action.**
4. **A dismissed reminder must not silently become a forgotten responsibility.**
5. **Scheduling must respect real availability, transition time, context, and effort—not theoretical empty calendar space.**
6. **Work, home, and personal contexts stay logically separate while sharing one planning engine.**
7. **Failure should trigger recovery, not shame.**
8. **Core reliability must not depend on generative AI.**
9. **The app should preserve context so future-you does not have to reconstruct why a task exists.**
10. **Do not build features that merely digitize another person's cognitive load.**

## Technical direction

- React Native
- Expo
- TypeScript
- iPhone first
- Local-first architecture
- SQLite as initial source of truth
- `.ics` calendar feed ingestion first
- Expo Notifications for local notification scheduling/actions
- Expo Background Task only for best-effort refresh work; do not assume exact execution
- Expo Calendar may be added later for device-calendar integration
- AI may assist capture/decomposition later, but deterministic business logic remains authoritative

Use the latest stable Expo SDK compatible with required packages at project initialization. Do not pin an old SDK merely because it appears in an example.

## Architecture rules

- Do not place business logic in React components.
- Keep domain logic framework-independent where practical.
- Calendar ingestion must be behind an adapter.
- Notification scheduling must be behind a service interface.
- Persistence must be behind repositories/data-access modules.
- Scheduling/planning logic must be unit-testable without rendering UI.
- Time-zone handling must be explicit.
- All date/time data stored internally must have a documented representation.
- Calendar source URLs are secrets and must never appear in source, tests, logs, screenshots, fixtures, crash reports, or commits.
- Never log sensitive calendar event details by default.
- Prefer minimal dependencies. Explain significant new dependencies in PR/commit notes.
- Add migrations for schema changes; never silently destroy user data.

## ADHD-first UX constraints

Assume the user may:

- forget to open the app;
- forget an intention at the exact moment it matters;
- underestimate or lose awareness of elapsed time;
- lose task context;
- struggle to initiate a vague task;
- be pulled away by interruptions;
- have difficulty resuming after interruption;
- hyperfocus and miss transitions;
- become overwhelmed by long overdue lists;
- reflexively dismiss notifications;
- experience strong emotional reactions to repeated misses;
- prioritize what feels immediate over what is actually important.

Therefore:

- never make the user remember to check the thing that helps them remember;
- do not use shame language;
- do not present huge undifferentiated overdue lists;
- do not allow passive notification dismissal to count as resolution;
- preserve task context;
- surface a recommended next action;
- externalize time with countdowns, start times, leave times, and transition warnings;
- make plan repair a first-class workflow.

## Coding workflow

For each GitHub issue:

1. Restate the acceptance criteria briefly.
2. Inspect relevant existing code.
3. Implement the smallest coherent change.
4. Add/update tests.
5. Run formatting, lint, typecheck, and tests.
6. Test device-specific behavior on a physical iPhone when required.
7. Update documentation if behavior or architecture changes.
8. Do not declare completion with known failing checks.

## GitHub workflow

Recommended:

- `main` = stable usable state
- short-lived feature branches
- one focused issue per meaningful change
- PRs even for solo development when practical
- GitHub Actions for install, lint, typecheck, and unit tests

Do not add heavyweight project-management ceremony.

## Security

Treat the following as sensitive:

- `.ics` subscription URLs
- calendar event contents
- work schedule details
- personal commitments
- health/routine information
- location information
- notification contents that could reveal sensitive context

Use secure device storage for secrets where appropriate. Do not commit secrets. Provide `.env.example` only with placeholders.

## Non-goals for MVP

Do not build these unless an issue explicitly adds them:

- spouse portal
- manager portal
- social features
- public accounts
- multi-user collaboration
- cloud sync
- gamification
- AI chatbot
- complex analytics
- Android-specific optimization
- full App Store production polish

## Definition of done for feature logic

A feature is not done because the screen renders.

It is done when:

- the underlying domain state is correct;
- edge cases are handled;
- persistence works;
- notification/calendar behavior has been tested where relevant;
- failure/recovery paths exist;
- tests cover important deterministic logic;
- the behavior supports the product doctrine.
