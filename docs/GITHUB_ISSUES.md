# RMBR — Initial GitHub Issues

These are suggested issue bodies/titles for the first development milestone.

---

## Issue 1 — Initialize RMBR Expo repository

### Problem

RMBR needs a clean iPhone-first codebase with domain logic separated from UI and infrastructure.

### Acceptance criteria

- Expo + React Native + TypeScript initialized
- Expo Router configured
- project runs on iPhone development build
- lint/typecheck/test commands exist
- GitHub Actions runs them
- domain/infrastructure folders established
- SQLite package installed/initialized
- no feature logic beyond scaffold
- `CLAUDE.md` and `/docs` committed

### Out of scope

- task UI
- calendar sync
- notifications
- cloud backend

---

## Issue 2 — Secure calendar source storage

### User story

As the user, I can enter a private `.ics` subscription URL without it appearing in source control or ordinary application logs.

### Acceptance criteria

- calendar source configuration screen
- URL stored through secure-storage abstraction
- SQLite stores only safe metadata/reference where appropriate
- URL not logged
- delete source supported
- tests for redaction/helper logic
- `.env.example` contains no real URL

---

## Issue 3 — Fetch and normalize an ICS feed

### User story

As the user, I can add a work calendar feed and RMBR can understand its upcoming events.

### Acceptance criteria

- fetch `.ics`
- parse UID/title/start/end/all-day/location
- explicit time-zone handling
- persist normalized events
- idempotent re-sync
- detect updated/cancelled/removed events
- fixtures for recurring, all-day, and time-zone events
- document parser limitations

---

## Issue 4 — Display upcoming normalized calendar events

### User story

As the user, I can verify that RMBR correctly understands my external calendar.

### Acceptance criteria

- next events screen
- source/context clearly identified
- local display time correct
- refresh action
- last successful sync visible
- error state is useful and non-destructive

---

## Issue 5 — Schedule actionable local notification

### User story

As the user, RMBR can reactivate an intention at the time I need to act.

### Acceptance criteria

- notification permission flow
- schedule test notification
- notification category/actions implemented
- app receives selected action
- passive dismissal does not mark task complete
- physical iPhone test documented

---

## Issue 6 — Background calendar refresh spike

### Problem

RMBR needs to know what iOS background behavior is realistic before relying on calendar refresh.

### Acceptance criteria

- Expo background task configured
- physical-device test
- test after backgrounding
- test after force quit
- note system limitations
- reschedule local reminders after successful refresh
- write `docs/FOUNDATION_SPIKE_RESULTS.md`

### Important

This is an engineering experiment, not a promise of exact refresh timing.

---

## Issue 7 — Implement Responsibility domain model

### User story

As the user, I can own an ongoing responsibility independently of any one task.

### Acceptance criteria

Responsibility supports:

- context
- name
- definition of done
- active/inactive
- monitoring/recurrence
- expected duration
- required location
- notes/context
- next review

Unit tests required.

---

## Issue 8 — Implement Task lifecycle

### User story

As the user, a commitment can remain visible through planning, execution, waiting, blocking, and completion.

### Acceptance criteria

States:

- Inbox
- Planned
- Ready
- In Progress
- Waiting
- Blocked
- Done
- Cancelled

Waiting requires follow-up metadata.

Blocked requires blocker/review metadata.

Invalid transitions are tested.

---

## Issue 9 — Separate do time from due time

### User story

As the user, RMBR can tell me when I intend to work on something separately from when it becomes late.

### Acceptance criteria

- `doAt`
- `dueAt`
- UI labels are unambiguous
- risk logic can identify “unplanned but due soon”
- rescheduling do time does not silently change due time

---

## Issue 10 — Build Needs Attention query

### User story

As the user, I can see what another person might otherwise need to remind me about.

### Acceptance criteria

Return:

- overdue unresolved tasks
- due-soon tasks with no plan
- planned task whose time passed
- waiting follow-up passed
- blocked review passed
- calendar conflict with planning block
- recurring responsibility needing review

Sort by risk/consequence/time, not creation date alone.

---

## Issue 11 — Implement plan-break detection

### User story

As the user, when my calendar changes and invalidates a plan, RMBR tells me before another person has to.

### Acceptance criteria

- detect overlap between PlanningBlock and changed CalendarEvent
- create Needs Attention item
- preserve original commitment
- suggest at least one reschedule option using simple availability logic
- no silent auto-move in MVP

Copy direction:

> Your plan broke.

Not:

> You failed.

---

## Issue 12 — Implement morning briefing

### User story

As the user, RMBR shows me a small number of meaningful commitments instead of a wall of tasks.

### Acceptance criteria

Morning briefing includes:

- up to 3 Must Do
- critical transition(s)
- Watching items
- Needs Attention item(s)
- calendar conflict notice

Algorithm must be deterministic and unit tested.

---

## Issue 13 — Implement evening reconciliation

### User story

As the user, unfinished work cannot silently become forgotten overdue wallpaper.

### Acceptance criteria

For each unresolved planned commitment that should have happened:

- Done
- Reschedule
- Waiting
- Blocked
- Cancel

User can complete reconciliation quickly.

---

## Issue 14 — Critical transition prototype

### User story

As the user, RMBR helps me perform simple but easy-to-forget actions at the exact transition where they matter.

### Example targets

- clock in
- clock out
- leave for appointment
- hard stop from focus

### Acceptance criteria

- transition has trigger time
- advance warning
- action-time alert
- confirmation state
- unresolved state remains visible
- configurable escalation

---

## Issue 15 — Add context packet to tasks

### User story

As the user, I never have to stare at “Call Dave” and wonder who Dave is.

### Acceptance criteria

Task supports:

- why/reason
- person/org
- expected outcome
- next step after action
- source note/reference

Today/notification detail can expose the essential context without cluttering the title.

---

## Issue 16 — External Prompt Count

### User story

As the user, I can measure whether RMBR is reducing reminders from other people.

### Acceptance criteria

- one-tap prompt record
- optionally link to task/responsibility
- context
- timestamp
- simple trend view
- no failure/shame language

This metric is secondary to reliability and may be deferred if MVP scope expands.
