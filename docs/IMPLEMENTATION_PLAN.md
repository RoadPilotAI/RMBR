# RMBR — Implementation Plan

## Goal

Prove the risky foundation before spending significant effort on polished UI.

Claude Code's first assignment is **not** to build the complete product.

---

# Phase 0 — Repository and architecture

## Tasks

1. Create/verify a private GitHub repository.
2. Initialize an Expo + React Native + TypeScript application using the latest stable supported Expo SDK.
3. Configure Expo Router.
4. Establish:
   - domain layer;
   - infrastructure layer;
   - persistence layer;
   - test setup.
5. Add:
   - lint;
   - formatting;
   - TypeScript strictness where practical;
   - unit-test command;
   - GitHub Actions CI.
6. Add secret-safe configuration:
   - no real `.ics` URLs in repository;
   - `.env.example` placeholders only;
   - secure-storage abstraction.
7. Commit the handoff documents to the repository.

## Exit criteria

- app launches;
- CI passes;
- basic navigation shell exists;
- SQLite initializes;
- no production feature logic yet.

---

# Phase 1 — Technical foundation spike

## Objective

Prove:

> External calendar → local normalization → SQLite → transition calculation → scheduled iPhone notification

on a **physical iPhone**.

## Required demonstration

1. Securely enter one `.ics` URL in the app.
2. Fetch the feed.
3. Parse at least:
   - UID;
   - title;
   - start/end;
   - time zone;
   - all-day flag;
   - location when present;
   - recurrence if supported by selected parser.
4. Normalize into local calendar-event records.
5. Persist records in SQLite.
6. Display next five events.
7. Choose an upcoming event.
8. Derive one transition cue, e.g.:
   - “event begins in 30 minutes”
   - or “leave-by test reminder.”
9. Schedule a local notification.
10. Verify the notification fires on the physical iPhone.
11. Verify an actionable notification category can produce an app-side state/event.
12. Run a best-effort background refresh test on the physical device and document actual behavior.

## Important technical finding to preserve

Do not promise exact background refresh.

iOS controls background scheduling. Background tasks can be delayed and may stop when the user force-quits the app.

Therefore:

- local notifications should be pre-scheduled;
- background sync should refresh/reschedule opportunistically;
- opening/foregrounding the app should always refresh stale calendar data;
- future server-side monitoring remains an option if external calendar changes must be detected promptly.

## Exit criteria

Create `docs/FOUNDATION_SPIKE_RESULTS.md` describing:

- packages chosen;
- parser limitations;
- recurrence behavior;
- time-zone handling;
- notification action behavior;
- background refresh observations;
- known risks;
- recommended architecture changes.

Do not move to Phase 2 until this document exists.

---

# Phase 2 — Core domain model

Implement/test:

- Context
- Responsibility
- Task
- TaskStatus
- PlanningBlock
- CalendarSource
- CalendarEvent
- Reminder
- Waiting/Blocked metadata

## Unit-test first targets

- due vs do date;
- start-by calculation;
- status transitions;
- Waiting follow-up logic;
- Blocked review logic;
- recurrence generation;
- calendar conflict detection;
- time-zone conversions;
- plan-break detection.

---

# Phase 3 — Minimal usable RMBR

Build:

1. Today
2. Capture
3. Responsibilities
4. Calendar
5. Needs Attention

No design-system rabbit hole. Functional, readable, iPhone-native feeling.

## Core flows

### Capture → plan

- create task;
- add context;
- add due date;
- choose do time;
- schedule reminder.

### Reminder → resolution

- Do Now
- Reschedule
- Waiting
- Blocked
- Done

### Miss → repair

- detect planned time passed;
- surface Needs Attention;
- ask what happens next;
- require conscious resolution.

### Responsibility → generated task

- recurring monitoring produces next action;
- task completion updates responsibility monitoring.

---

# Phase 4 — Calendar harmonization

Support two calendar sources:

- Work
- Personal

Build unified availability.

Detect:

- direct overlaps;
- planning block vs event conflicts;
- schedule changes that invalidate a planning block;
- narrow transition windows.

Do not attempt routing/travel-time intelligence until basic conflict logic is trustworthy.

---

# Phase 5 — ADHD-first support layer

Implement one feature at a time behind testable domain logic.

Recommended order:

1. Critical transitions
2. Countdown-to-action
3. Context packets
4. Plan repair
5. Waiting/follow-up
6. Task resumption
7. Duration history
8. Hyperfocus hard-stop mode
9. External prompt tracking
10. Configurable support profile

---

# GitHub issue discipline

Each issue should contain:

- problem;
- user story;
- product doctrine connection;
- acceptance criteria;
- technical notes;
- out-of-scope notes;
- testing requirements.

Prefer issues that can be completed and reviewed independently.

---

# Physical-device test checklist

At minimum test:

- notification permission denied/granted;
- phone locked;
- app backgrounded;
- app force-quit;
- device restarted;
- no network;
- stale `.ics` feed;
- changed `.ics` event;
- daylight-saving/time-zone boundary fixture;
- repeating event;
- all-day event;
- task reschedule;
- notification action tap;
- multiple reminders close together.

Document platform behavior rather than assuming it.
