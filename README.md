# 🌿 Gentle Companion

> A safe, evidence-based, and deeply compassionate web app that reduces the weight of depression by making therapeutic skills, self-tracking, and micro-actions accessible to everyone, every day.

---

## Table of Contents

- [Vision](#vision)
- [Features](#features)
- [Screenshots & User Flow](#screenshots--user-flow)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Data & localStorage Schema](#data--localstorage-schema)
- [GDPR & Privacy](#gdpr--privacy)
- [Therapeutic Framework](#therapeutic-framework)
- [Design System](#design-system)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

---

## Vision

A world where no one faces depression alone — and every person has a gentle, effective, private companion that helps them reclaim hope, one tiny step at a time.

Gentle Companion is built on a single principle: **any action is worthy of celebration**. The app never scolds, never punishes missed days, and never demands more than you can give.

---

## Features

### MVP (Fully Implemented)

| Feature | Description |
|---|---|
| **Mood & Energy Check-in** | Daily slider for energy/weight (1–10) and "mood weather" selector (stormy → sunny). Skippable with a "Just let me in" button. |
| **Daily Micro-Plan** | 3 randomly selected tiny tasks from a curated library of 15. Swap any task for a different one. Completion triggers a gentle celebration. No streaks, no punishment. |
| **Thought Untangler** | 4-step guided CBT reframing tool. Sessions are persisted and past reflections are shown. |
| **Glimmer Catcher** | Log anything even slightly okay — one sentence is enough. Displayed in reverse-chronological order. |
| **Soothing Toolkit** | Box breathing pacer (4-4-4-4 animated circle), 5-4-3-2-1 senses grounding, safe place visualisation. |
| **Crisis Button** | Always-visible "I need help" button. Shows crisis lines (988, Samaritans, IASP), SMS options, and a pre-written reach-out message to your trusted contact. |
| **Adaptive Quiet Mode** | When energy ≤ 3 is logged, the home screen switches to a minimal layout with only two gentle options. |
| **Letter to Myself** | Write a compassionate note to yourself on a stable day. Automatically surfaced on low-energy days. |
| **Weekly Insights** | Passive mood bar chart, glimmer correlation insight ("on days you caught a glimmer, your energy was higher"), and a virtual garden. |
| **Virtual Garden** | One element grows per week of engagement. Never lost on missed days. A wildflower for the messy weeks. |
| **Guided Tour** | 3-screen swipeable tour shown once after onboarding. Skippable. |
| **Energy Calibration** | Final onboarding step seeds the first check-in so the app is personalised from minute one. |
| **Trusted Contact** | Configure a person's name and phone number. The crisis panel offers a pre-written SMS to them. |
| **Gentle Reminders** | Opt-in toggle for a single daily nudge. No streaks, no guilt. |
| **Dark Mode** | Full dark theme via CSS custom properties. |
| **GDPR Consent Gate** | No data is written to localStorage until explicit consent is given. |
| **Data Deletion** | One-tap deletion of all data from Settings, with two-step confirmation. Withdraws consent. |

---

## Screenshots & User Flow

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  Welcome    │───▶│  Privacy &  │───▶│    Name     │───▶│   Reasons   │───▶│   Energy    │
│  Screen     │    │  Consent    │    │  (optional) │    │  (optional) │    │ Calibration │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘    └──────┬──────┘
                                                                                    │
                                                                                    ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  Settings   │    │   Insights  │    │   Letter    │    │   Reflect   │    │  Guided     │
│             │    │  My Week 📊 │    │  to Myself  │    │  🧶         │    │  Tour       │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘    └──────┬──────┘
                                                                                    │
                                                                                    ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│    Home     │───▶│  Micro-Plan │    │   Toolkit   │    │  Glimmers   │    │   Crisis    │
│  Check-in   │    │  ✨         │    │  🌬️         │    │  🌸         │    │  Button 💙  │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

**Adaptive Quiet Mode** activates automatically when energy ≤ 3 is logged, reducing the home screen to just two gentle options and surfacing the Letter to Myself if one exists.

---

## Architecture

### High-Level Overview

```
┌──────────────────────────────────────────────────────────────────┐
│                        Browser / PWA                             │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                    React Application                     │    │
│  │                                                          │    │
│  │  ┌──────────────┐   ┌──────────────────────────────┐   │    │
│  │  │  BrowserRouter│   │         AppProvider           │   │    │
│  │  │  (react-router│   │  (React Context — single      │   │    │
│  │  │   -dom v6)    │   │   source of truth for all     │   │    │
│  │  └──────┬───────┘   │   app state)                  │   │    │
│  │         │            └──────────────┬───────────────┘   │    │
│  │         │                           │                    │    │
│  │         ▼                           ▼                    │    │
│  │  ┌─────────────────────────────────────────────────┐    │    │
│  │  │                    Pages                         │    │    │
│  │  │  /welcome  /tour  /home  /plan  /toolkit         │    │    │
│  │  │  /glimmers /reflect /insights /letter /settings  │    │    │
│  │  └──────────────────────┬──────────────────────────┘    │    │
│  │                         │                                │    │
│  │         ┌───────────────┼───────────────┐               │    │
│  │         ▼               ▼               ▼               │    │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐        │    │
│  │  │ CrisisButton│  │   NavBar   │  │  content.ts│        │    │
│  │  │ (component) │  │ (component)│  │  (static   │        │    │
│  │  └────────────┘  └────────────┘  │   data)    │        │    │
│  │                                   └────────────┘        │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                   localStorage (device-only)             │    │
│  │  gc_consent · gc_name · gc_onboarded · gc_tour_done     │    │
│  │  gc_theme · gc_checkins · gc_glimmers · gc_tasks        │    │
│  │  gc_reflect · gc_letter · gc_trusted · gc_notifs        │    │
│  └─────────────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────────┘
```

### State Management

All application state lives in a single React Context (`AppContext`). There is no external state library — the app is intentionally dependency-light.

```
AppProvider (AppContext.tsx)
│
├── Primitive state (useState)
│   ├── userName: string
│   ├── onboarded: boolean
│   ├── tourDone: boolean
│   ├── consentGiven: boolean
│   ├── theme: 'light' | 'dark'
│   ├── letterToSelf: string
│   ├── trustedContact: { name, phone } | null
│   └── notificationsEnabled: boolean
│
├── Collection state (useState)
│   ├── checkIns: CheckIn[]          — { date, energy, mood, note? }
│   ├── glimmers: Glimmer[]          — { id, date, text }
│   ├── completedTasks: string[]     — "YYYY-MM-DD::taskId" keys
│   └── reflectSessions: ReflectSession[] — { id, date, answers[] }
│
├── Derived state (computed inline)
│   ├── todayCheckIn                 — checkIns.find(date === today)
│   ├── todayTasksDone               — completedTasks filtered by today
│   └── gardenCount                  — unique ISO weeks with any check-in
│
└── Persistence (useEffect → localStorage)
    └── Every state slice syncs to its gc_* key only when consentGiven === true
```

### GDPR Consent Flow

```
App loads
    │
    ▼
readIfConsented() checks gc_consent
    │
    ├── 'true'  → hydrate all state from localStorage normally
    │
    └── anything else → all state initialises to empty defaults
                        (nothing is read from localStorage)
                            │
                            ▼
                    User reaches Privacy screen
                            │
                            ▼
                    Taps "I agree & continue"
                            │
                            ▼
                    giveConsent() sets gc_consent = 'true'
                    All subsequent useEffect syncs now write to localStorage
```

### Routing & Guards

```
/                   → redirects to /welcome, /tour, or /home based on state
/welcome            → Onboarding (5 steps: welcome, consent, name, reasons, calibration)
/tour               → Guided Tour (shown once, sets tourDone = true)
/home               → Home (check-in, adaptive quiet mode, quick actions)
/plan               → Daily Micro-Plan (3 tasks, swap, complete)
/toolkit            → Soothing Toolkit (breathing pacer, grounding exercises)
/glimmers           → Glimmer Catcher (add, list)
/reflect            → Thought Untangler + Mood History
/insights           → Weekly Insights + Virtual Garden
/letter             → Letter to Myself
/settings           → Appearance, notifications, trusted contact, data deletion
```

All routes except `/welcome` and `/tour` are guarded: unauthenticated (non-onboarded) users are redirected to `/welcome`.

### Data Flow

```
User interaction
      │
      ▼
Page component calls action (e.g. addCheckIn, addGlimmer)
      │
      ▼
AppContext updates React state (immutable update pattern)
      │
      ▼
useEffect detects state change
      │
      ├── consentGiven === true  → writes to localStorage
      └── consentGiven === false → no-op (GDPR gate)
      │
      ▼
Component re-renders with new state via useApp() hook
```

### Component Hierarchy

```
App
└── AppProvider
    └── BrowserRouter
        └── AppRoutes
            ├── Onboarding
            ├── Tour
            └── [guarded pages]
                ├── CrisisButton        ← fixed position, always visible
                ├── [page content]
                │   ├── Home
                │   │   └── adaptive quiet mode / full mode
                │   ├── Plan
                │   ├── Toolkit
                │   │   ├── BreathingPacer
                │   │   └── GroundingCard (×3)
                │   ├── Glimmers
                │   ├── Reflect
                │   │   ├── ThoughtUntangler
                │   │   └── MoodHistory
                │   ├── Insights
                │   ├── Letter
                │   └── Settings
                └── NavBar              ← fixed bottom, 7 items
```

---

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| UI Framework | React | 18.3 |
| Language | TypeScript | 5.9 |
| Routing | React Router DOM | 6.30 |
| Icons | Lucide React | 0.294 |
| Build Tool | Vite | 8.x |
| PWA / Service Worker | vite-plugin-pwa (Workbox) | 1.x |
| Styling | CSS Custom Properties (no CSS-in-JS library) | — |
| State | React Context + useState + useCallback + useMemo | — |
| Persistence | Browser localStorage | — |
| Fonts | System font stack (no external CDN) | — |

**Minimal runtime dependencies** — React, React Router, Lucide, and vite-plugin-pwa (dev). No Redux, no Zustand, no Tailwind, no styled-components.

---

## Getting Started

### Prerequisites

- Node.js ≥ 18
- npm ≥ 9

### Installation

```bash
git clone https://github.com/your-org/gentle-companion.git
cd gentle-companion
npm install
```

### Development

```bash
npm run dev
```

Opens at `http://localhost:5173`. Hot module replacement is enabled.

### Production Build

```bash
npm run build
```

Output goes to `dist/`. The build is a fully static SPA with a generated service worker (`dist/sw.js`) — deploy to any static host (Netlify, Vercel, S3 + CloudFront, GitHub Pages).

### Preview Production Build

```bash
npm run preview
```

### Type Check

```bash
node_modules/typescript/bin/tsc --noEmit
```

> Note: use the local TypeScript binary directly — the global `npx tsc` may resolve a different version.

---

## Project Structure

```
gentle-companion/
├── index.html                  # Entry HTML — CSP meta tag, no external CDN
├── vite.config.ts              # Vite config (React plugin + VitePWA)
├── tsconfig.json               # TypeScript strict mode
├── package.json
├── public/
│   ├── manifest.json           # PWA manifest (separate any + maskable icon entries)
│   ├── icon-192.png
│   └── icon-512.png
└── src/
    ├── main.tsx                # React root mount
    ├── App.tsx                 # Router + AppProvider + route guards
    ├── index.css               # Global styles, CSS custom properties, dark theme
    │
    ├── context/
    │   └── AppContext.tsx      # Single source of truth — all state, persistence, GDPR gate
    │                           # Actions memoised with useCallback; derived state with useMemo
    │
    ├── data/
    │   └── content.ts          # Static therapeutic content (tasks, grounding, moods, prompts)
    │
    ├── components/
    │   ├── CrisisButton.tsx    # Always-visible crisis panel — region-detected lines (17 countries)
    │   └── NavBar.tsx          # Fixed bottom navigation (7 items)
    │
    └── pages/
        ├── Onboarding.tsx      # 5-step onboarding (welcome, consent, name, reasons, calibration)
        ├── Tour.tsx            # 3-screen guided tour (shown once) — dots are keyboard-accessible buttons
        ├── Home.tsx            # Daily check-in, adaptive quiet mode, quick actions
        ├── Plan.tsx            # Daily micro-plan — date-seeded selection, consistent all day
        ├── Toolkit.tsx         # Box breathing pacer + grounding exercises
        ├── Glimmers.tsx        # Glimmer catcher (add + list)
        ├── Reflect.tsx         # Thought untangler (CBT) + mood history chart
        ├── Insights.tsx        # Weekly mood chart, glimmer correlation, virtual garden
        ├── Letter.tsx          # Letter to myself (shown on low-energy days)
        ├── Settings.tsx        # Theme, notifications, trusted contact, data deletion
        └── Guide.tsx           # In-app user guide (accessible from Settings)
```

---

## Data & localStorage Schema

All keys are prefixed `gc_` to avoid collisions. Nothing is written until `gc_consent === 'true'`.

| Key | Type | Description |
|---|---|---|
| `gc_consent` | `"true"` | GDPR consent flag. Written before all others. |
| `gc_name` | `string` | User's chosen display name. |
| `gc_onboarded` | `"true"` | Whether onboarding has been completed. |
| `gc_tour_done` | `"true"` | Whether the guided tour has been seen. |
| `gc_theme` | `"light" \| "dark"` | UI theme preference. |
| `gc_checkins` | `CheckIn[]` | Array of `{ date, energy, mood, note? }`. One per day. |
| `gc_glimmers` | `Glimmer[]` | Array of `{ id, date, text }`. |
| `gc_tasks` | `string[]` | Completed task keys in `"YYYY-MM-DD::taskId"` format. |
| `gc_reflect` | `ReflectSession[]` | Array of `{ id, date, answers[] }` from Thought Untangler. |
| `gc_letter` | `string` | The user's letter to themselves. |
| `gc_trusted` | `{ name, phone } \| null` | Trusted contact for crisis panel. |
| `gc_notifs` | `"true" \| "false"` | Gentle reminder opt-in preference. |

**Deleting all data** removes every `gc_*` key, resets all React state to defaults, and navigates to `/welcome` — returning the app to a fresh install state.

---

## GDPR & Privacy

Gentle Companion is designed with privacy as a first-class feature, not an afterthought.

### Principles

- **No server, no network requests.** All data is stored exclusively in the user's browser localStorage. Nothing is transmitted anywhere.
- **Consent before storage.** The `readIfConsented()` function in AppContext ensures that on first load, if `gc_consent` is not `'true'`, all state initialises to empty defaults. No data is read from or written to localStorage until the user explicitly taps "I agree & continue" on the privacy screen.
- **Right to erasure.** The Settings page provides a two-step "Delete everything" flow that calls `deleteAllData()`, which removes all `gc_*` keys from localStorage and resets all React state. This constitutes full data deletion and consent withdrawal.
- **No third-party data sharing.** No analytics, no error tracking, no advertising SDKs, no Google Fonts CDN (removed to prevent IP leakage).
- **Content Security Policy.** `index.html` includes a `Content-Security-Policy` meta tag restricting all sources to `'self'`.
- **Sensitive data handling.** The trusted contact's phone number is stored locally and only used to pre-populate an SMS `href`. It is never transmitted.

### What is stored and why

| Data | Purpose | Stored? |
|---|---|---|
| Display name | Personalised greeting | Yes, locally |
| Check-ins (mood, energy) | Insights, adaptive UI | Yes, locally |
| Glimmers | Glimmer list, insights | Yes, locally |
| Completed tasks | Daily plan state | Yes, locally |
| Reflect sessions | Past reflections | Yes, locally |
| Letter to self | Shown on hard days | Yes, locally |
| Trusted contact | Crisis panel SMS | Yes, locally |
| Onboarding reasons | Not stored | **No** |
| IP address | N/A | **Never** |
| Usage analytics | N/A | **Never** |

---

## Therapeutic Framework

All content is grounded in evidence-based approaches:

| Framework | Where used |
|---|---|
| **Behavioural Activation (BA)** | Daily Micro-Plan — scheduling small, potentially rewarding activities |
| **Cognitive Behavioural Therapy (CBT)** | Thought Untangler — identifying and gently challenging unhelpful thought patterns |
| **Self-Compassion (Kristin Neff)** | Letter to Myself, all copy tone, celebration language |
| **Acceptance & Commitment Therapy (ACT)** | Glimmer Catcher — noticing without judgment; Thought Untangler step 3 |
| **Polyvagal-inspired grounding** | Box Breathing (4-4-4-4), 5-4-3-2-1 Senses, Safe Place Visualisation |
| **Self-Determination Theory** | No streaks, no leagues — autonomy (choose tasks), competence (celebrate any completion), virtual garden |

**Important:** This app is a supportive companion, not a medical device or a substitute for professional mental health care. The crisis button is always visible and connects users to real human support.

---

## Design System

### Colour Palette

| Token | Light | Dark | Usage |
|---|---|---|---|
| `--sage` | `#7a9e87` | same | Primary actions, active states |
| `--sage-pale` | `#e8f2eb` | `#1e2b22` | Card backgrounds, inputs |
| `--lavender` | `#9b8ec4` | same | Secondary accent |
| `--lavender-pale` | `#f0eefb` | `#221f30` | Letter, insights cards |
| `--peach` | `#e8a87c` | same | Glimmers accent |
| `--peach-pale` | `#fdf0e8` | `#2e2218` | Glimmer backgrounds |
| `--sky` | `#7ab8d4` | same | Toolkit, breathing |
| `--sky-pale` | `#e8f4fb` | `#182530` | Crisis panel, toolkit |
| `--warm-white` | `#faf9f7` | `#1e1c1a` | Page background |
| `--card-bg` | `#ffffff` | `#2a2826` | Card surfaces |

### Typography

System font stack: `'Nunito', 'Segoe UI', system-ui, -apple-system, sans-serif`. Large, rounded, minimum text density. No external font CDN.

### Motion

All animations use `ease` or `ease-in-out` with durations of 200–500ms. No jarring transitions. The breathing circle uses a 4-second CSS transition to mirror the breath rhythm.

### Accessibility

- `focus-visible` outlines on all interactive elements (keyboard navigation safe)
- `aria-label` on icon-only buttons
- Semantic HTML (`<nav>`, `<h1>`–`<h3>`, `<button>`, `<a>`)
- No time-limited interactions
- Known gap: the `--text-soft` colour (`#9a9590`) is below WCAG AA contrast on white when used for body copy — a palette adjustment is planned

---

## Roadmap

### Phase 2 (planned)
- [ ] Strengths & Values Discovery (ACT card-sort)
- [ ] Medication & sleep tracking (optional)
- [ ] HealthKit / Google Fit integration
- [ ] PHQ-9 voluntary self-assessment (8-week check-in)
- [ ] Data export (JSON download for therapist sharing)
- [x] PWA manifest + service worker (offline support) — shipped in v1.0

### Phase 3 (future)
- [ ] Moderated peer support circles
- [ ] Therapist opt-in summary sharing (secure link, no in-app messaging)
- [ ] Structured multi-week courses ("Finding your feet again")
- [ ] Localisation (i18n)

---

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for full guidelines.

---

## License

MIT © Gentle Companion Contributors

> *"You don't have to fix anything right now. Just being here is enough."*
