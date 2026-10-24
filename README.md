# RMBR

**An iPhone-first external executive-function system for following through on responsibilities.**

> **Development status:** Early-stage application. Calendar-feed ingestion, local storage, rule-based reminders, and domain foundations exist in the repository. The complete responsibility-management experience is not implemented yet.

RMBR is intended to help people who experience ADHD-related or other executive-function challenges move from *intending* to do something to *actually handling it*, without requiring a spouse, colleague, or manager to become their reminder and follow-up system.

The central measure of success isn't how many boxes a user checks. It's whether they can reliably own commitments—and whether other people need to prompt them less often.

## The problem RMBR addresses

A traditional to-do app captures a task after someone has already identified it. It often leaves the hardest work to the user: remembering the right moment, finding time, retaining context, starting, resuming after interruption, following up, and repairing plans when circumstances change.

RMBR aims to support the complete chain from **responsibility → actionable task → realistic plan → timely cue → resolution or recovery**.

It is not intended to be a clinical treatment, a shame-based productivity scorecard, a generic AI chatbot, or a portal for other people to manage the user's commitments.

## Product principles

1. **The system compensates before another person does.** Important follow-up should come from RMBR rather than defaulting to human reminders.
2. **Responsibilities persist.** Finishing one task doesn't erase the ongoing responsibility that generated it.
3. **Every commitment needs a next action.** Vague intentions should become executable steps.
4. **Dismissal is not completion.** An ignored notification must not silently close the underlying obligation.
5. **Real-world time matters.** Do time, due time, preparation, transitions, and conflicts are different things.
6. **Context should survive interruption.** The app should preserve why something matters and what happens next.
7. **Recovery beats blame.** When a plan fails, offer a practical way forward without shame.
8. **Core reliability must not rely on generative AI.** Task state, recurrence, time calculations, and reminder rules must be deterministic.
9. **One planning system, multiple contexts.** Work, home, and personal commitments remain distinguishable.

## Product model

| Concept | Purpose |
| --- | --- |
| **Context** | Work, home, personal, or custom area of life. |
| **Responsibility** | Persistent ownership of an outcome, such as maintaining vehicle registration. |
| **Task** | A concrete action that advances a responsibility or stands alone. |
| **Planning block** | A proposed or confirmed time to do work. |
| **Calendar source/event** | An external commitment that constrains availability. |
| **Reminder** | A prompt connected to an action, deadline, transition, or follow-up. |
| **Needs Attention** | Unresolved, at-risk, interrupted, or displaced commitments requiring a decision. |

The task domain defines `inbox`, `planned`, `ready`, `in_progress`, `waiting`, `blocked`, `done`, and `cancelled` states. **Waiting** and **Blocked** are active unresolved states, not hidden task graves.

For example, renewing vehicle registration is an ongoing responsibility. It can generate tasks to check requirements, collect paperwork, renew, verify completion, and schedule the next review. Completing the renewal task should not delete the responsibility.

## What is implemented in this repository

This describes visible code on the default branch reviewed **October 24, 2026**; it is not a claim that all behaviour has passed testing on a physical device.

### Application shell

- React Native / Expo application with TypeScript and Expo Router.
- Five navigation areas: **Today**, **Capture**, **Responsibilities**, **Calendar**, and **Needs Attention**.
- The Calendar screen has functional calendar-source and upcoming-event UI; the other primary views remain largely placeholders.

### Calendar foundation

- Add `.ics` subscription feeds with Work or Personal context.
- Store feed URLs through an Expo SecureStore abstraction; retain source metadata in local SQLite.
- Fetch and normalize feed events through an `ical.js` adapter.
- Persist events and sync status in SQLite.
- Show upcoming events, manual sync, and source removal in the Calendar UI.
- Provide a long-press event action for a test reminder.

### Rule-based reminders

- Domain rules for first and last event of day, workday midpoint, and event start/end triggers.
- Calendar-source rule evaluation and local notification scheduling using Expo Notifications.
- A 14-day scheduling horizon is defined in the current scheduling service.
- The source-creation flow includes optional clock-in, clock-out, and lunch reminders designed around a sample work-schedule use case.
- Best-effort background synchronization code exists; **iOS does not guarantee exact background refresh timing**.

### Domain, persistence, and tests

- Domain types for responsibilities, tasks, plans, reminders, calendars, and contexts.
- A task state machine and a calendar-rule engine.
- SQLite schema (version 3) covering contexts, calendar sources/events, responsibilities, tasks, planning blocks, reminders, conflicts, calendar rules, rule notifications, and external prompts.
- Jest tests for the task state machine, rule engine, and ICS adapter.
- GitHub Actions CI configuration plus lint, typecheck, and formatting scripts.

**Important:** Presence of a schema, model, test, or UI route does not mean the corresponding end-to-end feature is finished. Calendar correctness, notification actions, background sync, recurrence edge cases, and device reliability still need documented physical-iPhone validation.

## Planned workflows (not complete)

### Capture → plan

Capture an intention, preserve its context, choose a specific next action, distinguish **when to work** from **when it is due**, and schedule appropriate cues.

### Reminder → deliberate resolution

Support responses such as **Do Now**, **Reschedule**, **Waiting**, **Blocked**, and **Done**, while keeping unresolved commitments discoverable.

### Miss → plan repair

Detect a missed planned action, conflict, or delayed follow-up and surface a small number of useful choices. The aim is to repair the plan instead of producing a growing overdue list.

### Responsibility → recurring next action

Continue monitoring an owned responsibility, generate appropriate follow-up actions, and preserve its history across individual task completions.

### Calendar-aware execution

Use both work and personal calendars to detect collisions, preserve buffers and transitions, and avoid planning work into merely theoretical free time.

### ADHD-first support

Future support concepts include action countdowns, leave-by alerts, context packets, task resumption after interruption, hard-stop transition cues during hyperfocus, morning briefings, evening reconciliation, and optional external-prompt tracking.

These are intended product behaviours, not current release claims.

## Technology stack

The checked-in `package.json` currently specifies:

| Layer | Technology |
| --- | --- |
| App | React Native 0.86.2, React 19.2.3 |
| Tooling / runtime | Expo SDK ~57, Expo Router |
| Language | TypeScript ~6.0 |
| Persistence | `expo-sqlite` |
| Sensitive source URLs | `expo-secure-store` |
| ICS parsing | `ical.js` |
| Notifications | `expo-notifications` |
| Background refresh | `expo-background-fetch`, `expo-task-manager` |
| Testing | Jest, `jest-expo` |
| Quality checks | ESLint, Prettier, TypeScript |

The app is **local-first**: SQLite is the initial source of truth. Cloud accounts and multi-user sync are not part of the MVP plan.

## Getting started (development)

### Prerequisites

- Node.js and npm compatible with the checked-in Expo and React Native toolchain.
- A development environment suitable for Expo/React Native.
- A physical iPhone and Apple development tooling for validating iOS notifications and background behaviour.

### Setup

```bash
git clone https://github.com/RoadPilotAI/RMBR.git
cd RMBR
npm ci
cp .env.example .env.local
npm run start
```

On Windows PowerShell, use `Copy-Item .env.example .env.local` in place of `cp`.

The example environment file uses placeholder settings only. **Never put private calendar subscription URLs into environment files or source control.** Enter them through the app's calendar-source form instead.

### Project checks

```bash
npm run lint
npm run typecheck
npm test -- --runInBand
```

Other available commands include `npm run ios`, `npm run android`, `npm run web`, `npm run test:watch`, and `npm run format`. These are configured scripts, **not a guarantee of full platform support**. Development builds may be necessary for native functionality; validate on device.

## Repository map

```text
app/                         Expo Router screens and navigation
  (tabs)/                    Today, Capture, Responsibilities, Calendar, Needs Attention
  add-source.tsx              ICS calendar onboarding
src/
  application/               Calendar synchronization and rule scheduling
  domain/                    Framework-independent task and planning models/rules
  infrastructure/
    background/               Best-effort background sync
    calendar/                 ICS adapter
    db/                       SQLite schema and repositories
    notifications/            Notification service
    secure-storage/           Calendar URL secret storage
  shared/                     Shared utilities
tests/                        Domain and calendar adapter tests
docs/
  PRODUCT_HANDOFF.md          Detailed vision and failure-mode design
  IMPLEMENTATION_PLAN.md      Planned phases, exit criteria, device checklist
  GITHUB_ISSUES.md            Initial proposed engineering issue definitions
CLAUDE.md                     Repository engineering/product guardrails
AGENTS.md                     Agent guidance
.github/workflows/ci.yml      CI configuration
```

## Development roadmap

These phases are defined in `docs/IMPLEMENTATION_PLAN.md`; their presence does not confirm completion.

| Phase | Focus | Status from repo inspection |
| --- | --- | --- |
| 0 | Repository, Expo shell, architecture, testing, secrets hygiene | Scaffolding exists; runtime/CI outcomes not independently verified here |
| 1 | ICS → normalization → SQLite → transition cue → on-device notification | Significant code present; documented physical-device exit evidence not confirmed |
| 2 | Core responsibility/task models and state logic | Schema, types, and some domain logic present; integration incomplete |
| 3 | Minimal usable Today/Capture/Responsibilities/Calendar/Attention experience | Calendar partly functional; several screens placeholders |
| 4 | Work and personal calendar harmonization / conflict handling | Planned; underlying model groundwork exists |
| 5 | ADHD-first support, transitions, plan repair, resumption | Planned |

A key intended phase-1 milestone is `docs/FOUNDATION_SPIKE_RESULTS.md`: the implementation plan requires measured iPhone results before advancing. That file was **not found in the inspected repository tree**. Consequently, no physical-device reliability guarantee is made here.

## Platform realities and safety

- **Background work is best effort.** iOS determines when or whether background tasks run, and force-quitting can restrict execution. Pre-schedule local notifications where possible and refresh on foregrounding.
- **A reminder is not proof of action.** Dismissing a notification must not equal completion.
- **Calendar feeds are sensitive.** Private ICS URLs may grant access to personal schedule data; keep them out of commits, diagnostic output, and test fixtures.
- **Local-first doesn't mean risk-free.** Review persistence, migrations, notification content, and on-device secret handling before any external distribution.
- **Time zones and recurrence matter.** Daylight-saving transitions, recurring events, cancellations, all-day events, and changing schedules must be tested.
- **Neutral language matters.** Missed actions should lead to repair, not shame, punishment, or streak loss.

## Not in the MVP

The implementation handoff explicitly excludes a spouse/manager portal, social features, public accounts, multi-user collaboration, cloud sync, gamification, an AI chatbot, complex analytics, and Android-specific optimization. AI assistance may be added later for capture or decomposition but must not control the deterministic reliability core.

## Contributing

Before implementation work, read [`CLAUDE.md`](CLAUDE.md), [`docs/PRODUCT_HANDOFF.md`](docs/PRODUCT_HANDOFF.md), and [`docs/IMPLEMENTATION_PLAN.md`](docs/IMPLEMENTATION_PLAN.md). Review relevant code and tests, keep changes focused, and validate lint, types, tests, and device-specific flows where applicable. Product design should reduce—not transfer—cognitive work.

## Licensing note

A [`LICENSE`](LICENSE) file exists and contains MIT license text attributed to **650 Industries, Inc. (Expo)**. That attribution should be reviewed before representing the repository as independently licensed under MIT by its owner. This README does not change license terms.

---

**RMBR: Own the responsibility. Keep the context. Know the next action. Repair the plan.**
