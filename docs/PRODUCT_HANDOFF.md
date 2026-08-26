# RMBR — Product Handoff

## 1. Executive summary

**RMBR** is an iPhone-first external executive-function system designed to help a person convert intentions into completed responsibilities.

The product exists for a specific failure pattern:

> The user genuinely intends to handle something, but another person still ends up carrying part of the cognitive work: noticing it, reminding the user, checking whether it happened, reconstructing context, prompting follow-up, or rescuing the task when it slips.

RMBR should move that cognitive support from another person into a system.

The primary outcome is not “more tasks checked off.”

The primary outcome is:

> **Other people have to prompt the user less often about responsibilities the user already owns.**

---

## 2. What RMBR is not

RMBR is not:

- a generic to-do list;
- merely a calendar viewer;
- an AI chatbot with tasks attached;
- a spouse/manager delegation portal;
- a productivity-score app;
- a punishment system for missed tasks;
- a substitute for medical treatment;
- a system that assumes all users experience ADHD the same way.

A conventional task manager often begins after the hardest cognitive work has already happened. Someone still has to notice the need, remember the context, decide when to act, notice a broken plan, and follow up.

RMBR should manage the larger responsibility lifecycle.

---

## 3. Product doctrine

### 3.1 The system compensates before another person does

If a user has difficulty remembering, transitioning, estimating time, resuming work, or monitoring follow-up, the first response should be better scaffolding—not dependence on another human reminder.

### 3.2 Responsibilities are persistent

A responsibility is not the same thing as today's task.

Example:

**Responsibility:** Maintain vehicle registration.

This may generate:

- check renewal requirements;
- gather documents;
- renew;
- confirm renewal;
- schedule next monitoring date.

Completing one generated task does not delete the responsibility.

### 3.3 Preserve context

Never reduce meaningful information to “Call Dave.”

Prefer:

**Call Dave — Pacific Auto**  
Confirm alternator arrives Friday. If confirmed, schedule vehicle drop-off.

Future-you should not have to reconstruct Past-you's intent.

### 3.4 Recovery, not shame

Use language such as:

- “Your plan broke.”
- “This did not happen when planned.”
- “Choose what happens next.”
- “This is still unresolved.”

Avoid:

- FAILED
- YOU MISSED IT AGAIN
- streak-loss punishment
- giant red overdue counters

### 3.5 Hyperfocus can be useful

The product should not treat intense focus as inherently bad. It should protect transitions around it:

- early transition warning;
- hard-stop countdown;
- “save your work” prompt;
- leave-by enforcement for the next commitment.

### 3.6 Core reliability is deterministic

AI may later help interpret natural language, decompose tasks, or propose plans.

AI must not be required for:

- recurrence;
- deadlines;
- local reminder scheduling;
- escalation;
- task state;
- responsibility ownership;
- deterministic calendar conflict checks.

---

## 4. Target user

MVP target:

- one primary user;
- iPhone;
- has meaningful executive-function difficulties;
- may experience ADHD-related time management, prospective-memory, working-memory, initiation, attention, transition, prioritization, or emotional-regulation challenges;
- has work and personal responsibilities;
- uses at least one external calendar source;
- wants to stop relying on other people as their reminder/monitoring system.

The system must not assume every user has every ADHD-related difficulty. Supports should eventually be configurable.

---

## 5. ADHD cognitive failure model

RMBR should model **where the intention-to-action chain breaks**, not merely store tasks.

### Failure mode A — Prospective memory

**Pattern:** “I knew I needed to do it. I simply did not remember at the moment when I needed to act.”

**Product response:**

- time-triggered reactivation;
- context-triggered reminders where practical;
- persistent unresolved intention;
- escalation before consequence;
- reminders tied to action moments, not only deadlines.

### Failure mode B — Time perception / “time blindness”

**Pattern:**

- deadline feels far away;
- time passes without being noticed;
- start time is miscalculated;
- transition/travel/preparation time is omitted;
- task duration is underestimated.

**Product response:**

- visible countdown to action time;
- leave-by calculations;
- preparation buffers;
- transition alerts;
- elapsed-time display during focus;
- estimated-vs-actual duration history;
- suggested future duration based on observed history.

### Failure mode C — Working-memory/context loss

**Pattern:** “Why did I create this task? Who is Dave? What was I waiting for?”

**Product response:**

- context packet attached to every task;
- source/note/reason;
- person/org;
- next expected outcome;
- dependency;
- “what happens after this?” field.

### Failure mode D — Task initiation

**Pattern:** User understands the task but does not start it.

**Product response:**

- require or suggest a next physical action;
- “start for five minutes” option;
- implementation intention: when/where;
- reduce choice;
- show one recommended next action;
- allow task decomposition.

### Failure mode E — Distractibility

**Pattern:** User begins one task and attention is captured by something else.

**Product response:**

- current-focus state;
- quick side-thought capture without abandoning focus;
- interruption marker;
- task-resumption prompt.

### Failure mode F — Task resumption

**Pattern:** The interruption ends, but the original task is effectively gone from awareness.

**Product response:**

- “Resume what you were doing” card;
- preserve last task state;
- next step remains visible.

### Failure mode G — Hyperfocus / disengagement

**Pattern:** Productive attention becomes so absorbing that the next commitment is missed.

**Product response:**

- transition countdowns;
- escalating hard-stop alert;
- next commitment context;
- leave-by warning;
- allow intentional override, but require conscious action.

### Failure mode H — Prioritization / immediacy bias

**Pattern:** What is interesting, new, easy, or urgent-feeling displaces what is consequential.

**Product response:**

System-generated priority should consider:

- deadline;
- consequence;
- dependency;
- duration;
- opportunity window;
- required location;
- preparation lead time.

Do not force the user to manually rank everything every morning.

### Failure mode I — Planning/sequencing

**Pattern:** Desired outcome exists, but path is vague.

**Product response:**

- break responsibility/task into steps;
- dependencies;
- prep steps;
- next-action requirement;
- planning block before execution block where needed.

### Failure mode J — Monitoring/follow-up

**Pattern:** User takes an action, then forgets that an outcome is still pending.

Example: sent email, waiting for answer.

**Product response:**

- Waiting state;
- expected response date;
- automatic follow-up task;
- unresolved responsibility remains visible.

### Failure mode K — Emotional response to misses

**Pattern:** A repeated “simple” failure creates disproportionate frustration, embarrassment, avoidance, or self-criticism.

**Product response:**

- neutral copy;
- immediate plan-repair path;
- no punishment;
- no shame metrics;
- separate “what happened?” from “what next?”

### Failure mode L — Routine adherence

**Pattern:** A known beneficial routine is forgotten or resisted at the exact transition where it matters.

**Product response:**

- routine anchors;
- context-sensitive reminders;
- checklist with completion confirmation;
- adaptive escalation;
- travel/away-mode routines later.

---

## 6. Core lifecycle

RMBR should support:

**Notice → Understand → Plan → Prepare → Start → Do → Confirm → Monitor → Follow up**

A task may skip stages, but the data model should not assume “created → complete” is the whole lifecycle.

---

## 7. Core concepts

### Responsibility

An ongoing domain the user owns.

Examples:

- work documentation;
- laundry;
- vehicle maintenance;
- recurring household maintenance;
- expense reporting.

### Task / Commitment

A concrete action.

Examples:

- submit Smith documentation;
- start laundry;
- renew registration.

### Calendar event

An externally scheduled fact.

Examples:

- work shift;
- appointment;
- meeting.

Calendar events constrain planning but are not interchangeable with tasks.

### Planning block

A proposed/reserved period in which a task is intended to be done.

### Reminder

A notification or in-app cue attached to an actionable moment.

### Escalation

Increasing support as risk rises.

### Waiting state

The user has acted; progress now depends on someone/something else.

### Blocked state

The user cannot proceed until a blocking condition is resolved.

---

## 8. Calendar harmonization

Calendar harmonization is a first-class feature.

### 8.1 Sources

MVP:

- Work `.ics` feed
- Personal `.ics` feed

Both read-only initially.

Later:

- iOS device calendars
- optional write-back of planning blocks
- server-assisted feed monitoring if needed

### 8.2 Internal model

Do not merge calendar data directly into tasks.

Maintain separate entities:

- CalendarSource
- CalendarEvent
- Responsibility
- Task
- PlanningBlock

The planning engine reasons across them.

### 8.3 Availability

“Empty on the calendar” is not automatically available.

Availability may depend on:

- work/home/away context;
- event location;
- travel/transition time;
- required task location;
- task duration;
- preparation time;
- user-defined unavailable windows.

### 8.4 Plan-break detection

Example:

A task is planned Thursday at 18:00.

A work calendar refresh shows the user is now scheduled until 19:00.

RMBR should surface:

> **Your plan broke.**
>
> Thursday's work schedule now conflicts with “Vacuum house.”
>
> Suggested: Saturday at 10:00.

The user confirms or chooses another time.

### 8.5 Important iOS constraint

Do **not** assume background refresh runs at an exact time.

On iOS, background task execution is system-controlled and deferrable.

Therefore MVP architecture should:

1. sync calendar feeds on app foreground/open;
2. perform best-effort background refresh;
3. pre-schedule local notifications from known task/calendar state;
4. recompute scheduled notifications whenever calendar/task state changes;
5. never depend on an exact background fetch immediately before a critical alert.

If future requirements need near-real-time awareness of external `.ics` changes while the app is dormant, evaluate a small server-side feed watcher that can trigger push notifications.

---

## 9. Notification philosophy

Notifications are not decoration. They are part of the executive-function engine.

### 9.1 Reminder actions

A critical reminder should offer explicit resolution choices such as:

- **DO NOW**
- **RESCHEDULE**
- **BLOCKED**
- **WAITING**
- **CANCEL / NO LONGER REQUIRED**

Passive dismissal must not mark the task resolved.

### 9.2 Escalation example

For a critical work commitment:

**09:00**  
Planned start.

**09:15**  
No start acknowledgement. “Still planning to do this now?”

**10:30**  
At-risk warning.

**12:00**  
Deadline approaching.

Exact behavior should be configurable and risk-based.

### 9.3 Critical-transition reminders

Some actions should be modeled as transitions rather than generic tasks:

- clock in;
- clock out;
- leave for appointment;
- start travel;
- hard stop from focus;
- required routine at bedtime/travel.

Transition reminders should occur at the moment the user changes context, not only well before it.

---

## 10. MVP screens

Keep MVP UI small.

### Today

Show a small number of meaningful items.

Suggested hierarchy:

**MUST DO**  
High consequence / narrow window.

**SHOULD DO**  
Important but flexible.

**WATCHING**  
Responsibilities approaching a decision or deadline.

**NEEDS ATTENTION**  
Broken, blocked, waiting too long, overdue, or missing a plan.

Avoid giant undifferentiated task lists.

### Capture

Fast entry.

MVP text capture.

Voice capture can be added early if low-risk.

Capture should preserve:

- what;
- why/context;
- due date if known;
- intended action time if known;
- responsibility/context.

### Responsibilities

Persistent owned domains.

### Calendar

Unified view of:

- Work
- Personal
- RMBR planning blocks

### Needs Attention

The “Nobody Should Have to Ask Me” view.

Question:

> What currently exists that another person might reasonably have to remind me about?

---

## 11. Daily briefing

### Morning

Do not dump everything.

Show:

- top 3 commitments;
- any critical transition;
- one or two things to watch;
- unresolved/at-risk item;
- calendar conflicts.

### Evening reconciliation

Ask:

- What did not happen?
- Is it still required?
- Reschedule?
- Blocked?
- Waiting?
- Cancel?

No task should silently become permanent overdue wallpaper.

---

## 12. Capture requirements

Capture must be low friction.

Eventually support natural-language/voice such as:

> Finish Henderson paperwork tomorrow before lunch.

The system should parse/suggest:

- Task: Finish Henderson paperwork
- Due: tomorrow before lunch
- Ask: “When will you work on it?”

Do not require the user to configure a project before capturing an intention.

AI parsing may be added later, but manual correction must always be possible and deterministic state must be stored.

---

## 13. Responsibility ownership model

A responsibility should include enough information to operate without another human manager.

Potential fields:

- name
- context
- definition of done
- recurrence/monitoring rule
- default lead time
- expected duration
- required location
- notes
- source/reference info
- active/inactive
- next review date

Example:

**Furnace filters**

- monitor every 90 days
- filter size stored in notes
- replacements location
- change procedure
- next monitoring date
- definition of done: installed + replacement stock checked

---

## 14. Task state model

Initial states:

- Inbox
- Planned
- Ready
- In Progress
- Waiting
- Blocked
- Done
- Cancelled

Avoid a simple open/complete boolean.

### Waiting

Must record:

- waiting for what/who;
- expected response/review date;
- follow-up action if nothing happens.

### Blocked

Must record:

- blocker;
- next action to resolve blocker;
- review date if applicable.

---

## 15. Time model

Store separately where useful:

- `doAt` — intended execution
- `dueAt` — last acceptable completion
- `startBy` — derived latest safe start
- `leaveBy` — derived transition time
- `estimatedDuration`
- `actualDuration`
- `prepDuration`
- `bufferDuration`

Do not collapse all of these into one due date.

---

## 16. “Nobody Should Have to Ask Me” dashboard

This is a core product surface.

It should identify:

- overdue owned commitments;
- commitments at risk;
- unplanned commitments with deadlines;
- waiting items whose follow-up date passed;
- calendar conflicts;
- recurring responsibilities approaching action;
- critical transitions coming soon.

If the dashboard is clean, it should genuinely mean:

> There is nothing obvious right now that another person should have to chase me about.

---

## 17. External Prompt Count

Optional MVP or early post-MVP metric.

When another person reminds the user about something the user already owned, record an **external prompt** quickly.

Fields:

- timestamp
- context
- related task/responsibility if known
- reason category (optional)

Purpose:

Measure whether RMBR is solving its actual problem.

Do not frame this as a failure score.

Potential trend:

- Month 1: 18 prompts
- Month 2: 9
- Month 3: 4

---

## 18. Suggested conceptual data model

### Context

- id
- name
- type: work | home | personal | custom

### CalendarSource

- id
- name
- contextId
- sourceType: ics
- secret reference / secure-storage key
- sync state
- lastSuccessfulSyncAt

### CalendarEvent

- id
- calendarSourceId
- externalUid
- title
- startAt
- endAt
- location
- allDay
- recurrence metadata
- lastSeenAt
- sourceRevision/hash

### Responsibility

- id
- contextId
- name
- description
- definitionOfDone
- monitoringRule
- recurrenceRule
- defaultLeadTime
- expectedDuration
- requiredLocation
- active
- nextReviewAt

### Task

- id
- responsibilityId nullable
- contextId
- title
- contextPacket
- status
- doAt
- dueAt
- startBy
- estimatedDuration
- actualDuration
- requiredLocation
- priority/risk inputs
- waitingFor
- blockedBy
- completedAt
- cancelledAt

### PlanningBlock

- id
- taskId
- startAt
- endAt
- status
- source: user | system

### Reminder

- id
- taskId / transitionId
- scheduledAt
- type
- escalationLevel
- platformNotificationId
- state

### CompletionRecord

- id
- taskId
- startedAt
- completedAt
- duration
- notes

### ExternalPrompt

- id
- occurredAt
- contextId
- taskId nullable
- responsibilityId nullable
- note

Exact schema should be proposed by Claude after the initial technical spike.

---

## 19. Privacy and security

MVP is local-first intentionally.

### Sensitive values

Treat as secrets/private:

- `.ics` URLs
- work schedule details
- personal calendar details
- health/routine data
- location
- notification text
- employer/client names
- task notes

### Rules

- never hard-code `.ics` URLs;
- never commit them;
- never log them;
- redact sensitive URL query strings;
- use secure storage for calendar-source credentials/URLs;
- keep SQLite local;
- no analytics SDK by default;
- no cloud sync by default;
- no advertising;
- no selling or sharing personal/task/calendar data.

---

## 20. Technical stack direction

Initial recommendation:

- React Native
- Expo
- TypeScript
- Expo Router
- Expo SQLite
- Expo Notifications
- Expo Background Task + Task Manager for best-effort background work
- secure storage for calendar feed secrets
- well-maintained `.ics` parser selected after evaluation
- deterministic domain layer

Later possibilities:

- Expo Calendar
- location/geofencing
- speech-to-text / voice capture
- server-side `.ics` watcher
- push notifications
- optional cloud backup
- AI interpretation/decomposition layer

Do not add these later features to MVP merely because they are possible.

---

## 21. Repository structure — suggested

```text
RMBR/
├── CLAUDE.md
├── README.md
├── app/
│   ├── _layout.tsx
│   ├── index.tsx
│   ├── capture.tsx
│   ├── responsibilities.tsx
│   ├── calendar.tsx
│   └── attention.tsx
├── src/
│   ├── domain/
│   │   ├── responsibilities/
│   │   ├── tasks/
│   │   ├── planning/
│   │   ├── time/
│   │   └── reminders/
│   ├── application/
│   ├── infrastructure/
│   │   ├── db/
│   │   ├── calendar/
│   │   ├── notifications/
│   │   └── secure-storage/
│   └── shared/
├── docs/
│   ├── PRODUCT_HANDOFF.md
│   ├── IMPLEMENTATION_PLAN.md
│   └── GITHUB_ISSUES.md
└── tests/
```

Claude may adjust this structure after inspecting current Expo conventions, but preserve domain/infrastructure separation.

---

## 22. MVP acceptance criteria

MVP is successful when a user can:

1. install RMBR on a physical iPhone development build;
2. add a work `.ics` feed securely;
3. add a personal `.ics` feed securely;
4. sync and view normalized events;
5. create persistent responsibilities;
6. create tasks/commitments;
7. assign do time and due time separately;
8. receive actionable local notifications;
9. mark a task Doing / Rescheduled / Waiting / Blocked / Done;
10. recover a missed commitment through plan repair;
11. view a combined Today screen;
12. see calendar conflicts affecting a planned task;
13. receive at least one critical transition reminder;
14. perform morning briefing and evening reconciliation;
15. use the Needs Attention dashboard;
16. retain all state after app restart;
17. operate core features without internet except `.ics` synchronization;
18. avoid any need for another user account or spouse/manager portal.

---

## 23. Post-MVP roadmap

### Near-term

- notification escalation profiles;
- actual-vs-estimated duration learning;
- voice capture;
- task-resumption workflow;
- focus mode / hyperfocus hard stop;
- recurring responsibility templates;
- external prompt tracking;
- better conflict suggestions.

### Medium-term

- device calendar integration;
- location-aware transitions;
- travel/away mode;
- routine sequences;
- context-aware availability;
- optional server-side `.ics` watcher;
- push notifications.

### Later

- AI-assisted natural-language capture;
- AI-assisted task decomposition;
- “what am I forgetting?” reasoning over owned responsibilities;
- learned planning suggestions;
- optional encrypted cloud backup/sync.

---

## 24. Research/technical grounding

RMBR's ADHD-first design is informed by established adult-ADHD concerns including:

- prospective-memory difficulty;
- working-memory limitations;
- time perception/time-management difficulty;
- sustained-attention and distractibility;
- task initiation/procrastination;
- planning and organization;
- delay discounting / immediacy effects;
- emotional dysregulation as an associated feature;
- intense focus/hyperfocus as an associated but non-diagnostic phenomenon.

Do not present every feature as a medical treatment or imply every user has every symptom.

On iOS, background task execution is system-controlled and not exact. Critical reminders should be scheduled from known local state instead of depending on a background task firing at the desired minute.

Expo's current Calendar API requires a development build rather than Expo Go for device calendar access. Local notification scheduling and notification responses/actions are supported by Expo Notifications.

---

## 25. First principle for every feature discussion

Ask:

> **What cognitive work is this feature taking out of the user's head or out of another person's head?**

If the answer is “none,” reconsider whether RMBR needs it.
