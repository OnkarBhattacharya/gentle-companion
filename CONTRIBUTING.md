# Contributing to Gentle Companion 🌿

Thank you for considering a contribution. This is a mental health app — the bar for quality, safety, and compassion is higher than a typical project. Please read this document fully before opening a PR.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [The Responsibility of Contributing](#the-responsibility-of-contributing)
- [Architecture Overview](#architecture-overview)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [How to Contribute](#how-to-contribute)
- [Contribution Types](#contribution-types)
- [Coding Standards](#coding-standards)
- [Adding Therapeutic Content](#adding-therapeutic-content)
- [GDPR & Privacy Rules](#gdpr--privacy-rules)
- [Accessibility Requirements](#accessibility-requirements)
- [Testing Checklist](#testing-checklist)
- [Pull Request Process](#pull-request-process)
- [What We Will Not Accept](#what-we-will-not-accept)
- [Getting Help](#getting-help)

---

## Code of Conduct

All contributors are expected to:

- Be respectful and kind in all interactions — this mirrors the app's values
- Assume good intent from other contributors
- Prioritise the safety and wellbeing of users above all technical preferences
- Never trivialise mental health topics in code comments, commit messages, or PR descriptions

Violations may result in removal from the project.

---

## The Responsibility of Contributing

People in genuine distress use this app. A bug in the crisis button, a dismissive error message, or a broken "delete my data" flow can cause real harm. Before contributing:

1. **Test your changes with empathy.** Imagine you are having the worst day of your life. Does your change still feel safe and gentle?
2. **Never add gamification that punishes.** No streaks, no failure states, no "you missed X days" messaging.
3. **Never add tracking, analytics, or external network requests** without explicit maintainer approval and a full GDPR impact assessment.
4. **If you are unsure whether a content change is clinically appropriate**, open an issue and ask before writing code.

---

## Architecture Overview

Understanding the architecture before contributing prevents the most common mistakes.

### Layers

```
┌─────────────────────────────────────────────────────────────────┐
│  index.html                                                     │
│  · CSP meta tag (no inline scripts, no external sources)        │
│  · No external font CDN                                         │
└────────────────────────────┬────────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────────┐
│  src/main.tsx                                                   │
│  · React.StrictMode mount                                       │
└────────────────────────────┬────────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────────┐
│  src/App.tsx                                                    │
│  · AppProvider wraps BrowserRouter                              │
│  · AppRoutes reads onboarded + tourDone to decide entry point   │
│  · All routes except /welcome and /tour are guarded             │
└────────────────────────────┬────────────────────────────────────┘
                             │
         ┌───────────────────┼───────────────────┐
         │                   │                   │
┌────────▼────────┐ ┌────────▼────────┐ ┌────────▼────────┐
│  AppContext.tsx │ │    Pages        │ │   Components    │
│                 │ │                 │ │                 │
│  Single source  │ │  One file per   │ │  CrisisButton   │
│  of truth.      │ │  route. Consume │ │  NavBar         │
│  All state,     │ │  useApp() hook  │ │                 │
│  all actions,   │ │  only.          │ │  Both are       │
│  all persistence│ │                 │ │  layout-level   │
│  logic lives    │ │  No direct      │ │  and appear on  │
│  here.          │ │  localStorage   │ │  every guarded  │
│                 │ │  access.        │ │  page.          │
└─────────────────┘ └─────────────────┘ └─────────────────┘
         │
┌────────▼────────┐
│  localStorage   │
│                 │
│  Written only   │
│  when           │
│  consentGiven   │
│  === true       │
└─────────────────┘
```

### The GDPR Gate

This is the most critical architectural rule. **Never bypass it.**

```typescript
// AppContext.tsx — called at initialisation time
const readIfConsented = <T,>(key: string, fallback: T): T => {
  if (localStorage.getItem('gc_consent') !== 'true') return fallback
  // ...
}

// All state initialisers use this:
const [checkIns, setCheckIns] = useState(() => readIfConsented('gc_checkins', []))

// All persistence effects check consentGiven:
useEffect(() => {
  if (consentGiven) localStorage.setItem('gc_checkins', JSON.stringify(checkIns))
}, [checkIns, consentGiven])
```

**Rule:** If you add a new piece of state that should be persisted, you must:
1. Add a `gc_*` key constant
2. Initialise with `readIfConsented('gc_your_key', defaultValue)`
3. Add a `useEffect` that only writes when `consentGiven === true`
4. Add the key to the `deleteAllData()` cleanup array

### State Shape

All state lives in `AppContext`. Pages are stateless with respect to persistence — they call actions from `useApp()` and render from context values. No page should ever call `localStorage` directly.

```typescript
// ✅ Correct
const { addGlimmer } = useApp()
addGlimmer('The sun came through the window')

// ❌ Never do this in a page
localStorage.setItem('gc_glimmers', JSON.stringify([...]))
```

### Routing Guards

The `guard` helper in `AppRoutes` redirects unauthenticated users:

```typescript
const guard = (el: JSX.Element) => onboarded ? el : <Navigate to="/welcome" replace />
```

All new routes for authenticated users must use this pattern.

### Static Content

All therapeutic content (tasks, grounding exercises, mood options, reframe prompts) lives in `src/data/content.ts`. This is intentional — it makes content changes reviewable in isolation from logic changes, and makes it easy for clinical reviewers to audit without reading component code.

---

## Development Setup

```bash
# Clone
git clone https://github.com/your-org/gentle-companion.git
cd gentle-companion

# Install
npm install

# Start dev server (http://localhost:5173)
npm run dev

# Type check
npx tsc --noEmit

# Production build
npm run build
```

Node.js ≥ 18 and npm ≥ 9 are required.

To test the full onboarding flow from scratch, open DevTools → Application → Local Storage → clear all `gc_*` keys, then refresh.

---

## Project Structure

```
src/
├── context/
│   └── AppContext.tsx       ← All state, actions, persistence. Edit with care.
├── data/
│   └── content.ts           ← Therapeutic content only. No logic.
├── components/
│   ├── CrisisButton.tsx     ← Safety-critical. Any change needs extra review.
│   └── NavBar.tsx           ← Navigation. Keep accessible.
└── pages/
    ├── Onboarding.tsx       ← GDPR consent lives here. Do not remove consent step.
    ├── Tour.tsx             ← One-time guided tour.
    ├── Home.tsx             ← Adaptive quiet mode logic lives here.
    ├── Plan.tsx             ← Micro-plan + swap logic.
    ├── Toolkit.tsx          ← Breathing pacer + grounding cards.
    ├── Glimmers.tsx         ← Glimmer add + list.
    ├── Reflect.tsx          ← Thought untangler + mood history.
    ├── Insights.tsx         ← Weekly chart + garden.
    ├── Letter.tsx           ← Letter to myself.
    └── Settings.tsx         ← Notifications, trusted contact, data deletion.
```

---

## How to Contribute

1. **Check existing issues** before starting work. Comment on the issue to claim it.
2. **Open an issue first** for any non-trivial change — especially content changes, new features, or anything touching the crisis button or GDPR flow.
3. **Fork** the repository and create a branch from `main`:
   ```bash
   git checkout -b feat/your-feature-name
   # or
   git checkout -b fix/your-bug-description
   ```
4. Make your changes following the standards below.
5. Run `npx tsc --noEmit` and `npm run build` — both must pass with zero errors.
6. Open a Pull Request against `main`.

### Branch Naming

| Type | Pattern | Example |
|---|---|---|
| Feature | `feat/short-description` | `feat/body-scan-audio` |
| Bug fix | `fix/short-description` | `fix/crisis-button-overlap` |
| Content | `content/short-description` | `content/add-grounding-exercise` |
| Refactor | `refactor/short-description` | `refactor/extract-mood-chart` |
| Docs | `docs/short-description` | `docs/update-readme` |

---

## Contribution Types

### Bug Fixes
- Describe the bug clearly in the PR
- Include steps to reproduce
- Explain what the correct behaviour should be

### New Features
- Must align with the product blueprint (see README)
- Must not add gamification that punishes (no streaks, no failure states)
- Must not add external network requests without maintainer approval
- Must follow the GDPR gate pattern if persisting any new data

### Therapeutic Content
See [Adding Therapeutic Content](#adding-therapeutic-content) below.

### Accessibility Improvements
Always welcome. See [Accessibility Requirements](#accessibility-requirements).

### Performance
The app is intentionally small. Avoid adding large dependencies. If a dependency adds >10KB gzipped, justify it in the PR.

### Design / CSS
- Use CSS custom properties from `index.css` — do not hardcode colours
- Test in both light and dark mode
- Test at 320px viewport width (minimum mobile)

---

## Coding Standards

### TypeScript

- Strict mode is enabled (`"strict": true` in `tsconfig.json`). No `any`, no `@ts-ignore`.
- All new state shapes must have explicit interfaces in `AppContext.tsx`.
- Prefer `const` over `let`. Prefer explicit return types on exported functions.

### React

- Functional components only. No class components.
- Keep components focused. If a component exceeds ~150 lines, consider extracting sub-components.
- No direct `localStorage` access outside `AppContext.tsx`.
- No `useEffect` with missing dependencies — fix the root cause instead.
- Prefer `key` props that are stable identifiers, not array indices, for lists that can change.

### Styling

- All colours via CSS custom properties. No hardcoded hex values in component files (exception: the crisis red `#e57373` and its variants, which are intentionally not part of the calm palette).
- No external CSS libraries. The entire design system lives in `index.css`.
- Inline styles are acceptable for layout and dynamic values. Class names are for reusable patterns.

### Naming

- Components: `PascalCase`
- Hooks: `camelCase` prefixed with `use`
- Constants: `SCREAMING_SNAKE_CASE` for static data arrays, `camelCase` for everything else
- localStorage keys: `gc_snake_case`

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add body scan audio to toolkit
fix: crisis button overlapping nav on small screens
content: add cold water grounding exercise
refactor: extract MoodChart into separate component
docs: update architecture diagram in README
```

---

## Adding Therapeutic Content

All therapeutic content lives in `src/data/content.ts`. This is the only file clinical reviewers need to read.

### Adding a new micro-task

```typescript
// In TASKS array:
{ id: 't16', text: 'Your task text here', emoji: '🌿', duration: '1 min', category: 'body' }
```

Categories: `'body' | 'breath' | 'environment' | 'connection' | 'mind'`

**Rules for tasks:**
- Must be completable in ≤ 5 minutes
- Must be achievable from bed or a chair on a very bad day
- Must not assume access to outdoor space, other people, or specific equipment
- Must not use language that implies failure if skipped ("you should", "you must", "don't forget")
- Must be reviewed by at least one person with lived experience of depression before merging

### Adding a grounding exercise

```typescript
{
  id: 'g4',
  title: 'Exercise Name',
  description: 'One sentence description',
  emoji: '🌿',
  duration: '3–5 min',
  steps: [
    'Step 1 instruction.',
    'Step 2 instruction.',
    // ...
  ],
}
```

**Rules for grounding exercises:**
- Must be evidence-based (cite the framework in your PR: CBT, ACT, polyvagal, etc.)
- Steps must be written in second person, present tense, gentle imperative ("Notice...", "Feel...", "Imagine...")
- Must not include any instruction that could be harmful to someone in acute distress
- Must be reviewed by a mental health professional before merging

### Tone guidelines for all content

| ✅ Do | ❌ Don't |
|---|---|
| "Notice what you feel" | "You should feel better now" |
| "Even one step counts" | "Try to do all three" |
| "There's no rush" | "Do this quickly" |
| "That's okay" | "Don't worry" (dismissive) |
| "You showed up" | "Good job!" (infantilising) |
| Acknowledge difficulty | Toxic positivity |

---

## GDPR & Privacy Rules

These are non-negotiable. Any PR that violates them will be closed.

1. **No external network requests.** No `fetch`, no `axios`, no image tags pointing to external URLs, no web fonts from CDNs.
2. **No analytics or tracking.** No Google Analytics, no Sentry, no Mixpanel, no pixel tags.
3. **All new persisted state must go through the GDPR gate.** See [The GDPR Gate](#the-gdpr-gate) above.
4. **All new persisted state must be deleted by `deleteAllData()`.** Add your key to the keys array.
5. **The consent screen in Onboarding must not be removed or made skippable.** The "Skip" button only appears after the consent step.
6. **The trusted contact phone number must only be used in an `href` attribute.** It must never be logged, transmitted, or processed server-side.
7. **If you add a new localStorage key, document it** in the Data & localStorage Schema table in `README.md`.

---

## Accessibility Requirements

Every contribution must maintain or improve accessibility:

- **Keyboard navigation:** All interactive elements must be reachable and operable via keyboard. `focus-visible` outlines must remain visible.
- **Screen readers:** All icon-only buttons must have `aria-label`. All images/emojis used as content must have `aria-label` or `title`.
- **Colour contrast:** All text must meet WCAG AA (4.5:1 for normal text, 3:1 for large text) in both light and dark mode.
- **No time limits:** No interaction should expire or auto-dismiss without user action (exception: celebration animations, which are purely decorative).
- **Motion:** Animations must respect `prefers-reduced-motion`. If you add a new animation, wrap it:
  ```css
  @media (prefers-reduced-motion: reduce) {
    .your-animation { animation: none; transition: none; }
  }
  ```
- **Touch targets:** All tappable elements must be at least 44×44px.

---

## Testing Checklist

Before opening a PR, manually verify:

- [ ] `npx tsc --noEmit` passes with zero errors
- [ ] `npm run build` completes successfully
- [ ] Full onboarding flow works (clear localStorage, reload, go through all 5 steps)
- [ ] Guided tour appears after onboarding and only once
- [ ] Check-in saves correctly and persists on reload
- [ ] "Just let me in" skips check-in without saving
- [ ] Quiet mode activates when energy ≤ 3 is saved
- [ ] Micro-plan swap replaces the task with a different one
- [ ] Thought Untangler session saves and appears in past reflections
- [ ] Glimmer saves and appears in list
- [ ] Crisis button opens, shows crisis lines, shows trusted contact if configured
- [ ] Letter to Myself saves and appears on low-energy days
- [ ] Weekly Insights shows mood chart and garden
- [ ] Settings: theme toggle works in both directions
- [ ] Settings: trusted contact saves, edits, and removes correctly
- [ ] Settings: "Delete everything" removes all `gc_*` keys and redirects to onboarding
- [ ] Dark mode: all pages render correctly
- [ ] 320px viewport: no horizontal overflow, all elements accessible
- [ ] Keyboard navigation: Tab through all interactive elements on every page

---

## Pull Request Process

1. Ensure all items in the [Testing Checklist](#testing-checklist) are checked.
2. Fill in the PR template completely.
3. Link the related issue (`Closes #123`).
4. Request review from at least one maintainer.
5. Content changes (therapeutic text, crisis resources) require review from a maintainer with clinical background or lived experience.
6. PRs touching `CrisisButton.tsx`, `AppContext.tsx` (GDPR gate), or `Onboarding.tsx` (consent step) require two approvals.
7. Do not merge your own PR.

### PR Template

```markdown
## What does this PR do?
<!-- One paragraph summary -->

## Why?
<!-- Link to issue or explain the motivation -->

## Type of change
- [ ] Bug fix
- [ ] New feature
- [ ] Content change (therapeutic text)
- [ ] Refactor
- [ ] Docs

## GDPR checklist (if adding persisted state)
- [ ] New state uses readIfConsented()
- [ ] Persistence useEffect checks consentGiven
- [ ] Key added to deleteAllData() cleanup array
- [ ] Key documented in README schema table

## Accessibility
- [ ] Keyboard navigable
- [ ] aria-labels on icon-only buttons
- [ ] Tested in dark mode
- [ ] Tested at 320px

## Testing
- [ ] tsc --noEmit passes
- [ ] npm run build passes
- [ ] Manual testing checklist completed
```

---

## What We Will Not Accept

- Any form of analytics, tracking, or telemetry
- External network requests of any kind
- Gamification that punishes (streaks, failure states, "you missed X days")
- Content that trivialises mental health, uses toxic positivity, or is clinically unsound
- Removal or weakening of the GDPR consent gate
- Removal or weakening of the crisis button
- Dependencies that significantly increase bundle size without clear justification
- AI-generated therapeutic content that has not been reviewed by a human with clinical knowledge
- Any feature that could cause a user to delay seeking professional help

---

## Getting Help

- **Questions about the codebase:** Open a GitHub Discussion
- **Bug reports:** Open a GitHub Issue with the bug template
- **Feature ideas:** Open a GitHub Issue with the feature template
- **Sensitive topics** (crisis protocol, clinical content): Email the maintainers directly rather than opening a public issue

---

> *Building a product for people with depression is a profound responsibility. Prioritise user safety, listen to the people you intend to serve, and resist the pressure to force engagement. Sometimes the most valuable thing the app can do is simply sit with someone in their darkness and whisper: "You don't have to fix anything right now. I'm here."*
