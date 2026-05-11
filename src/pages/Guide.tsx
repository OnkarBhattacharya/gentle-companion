import { NavBar } from '../components/NavBar'
import { CrisisButton } from '../components/CrisisButton'

const sections = [
  {
    heading: '🚀 Getting Started',
    body: `When you open Gentle Companion for the first time, you'll move through a short 5-step onboarding:

1. Welcome — A brief introduction to what the app is (and isn't).
2. Privacy & Consent — Read how your data is handled, then tap "I agree & continue". Nothing is saved until you do this.
3. Your Name (optional) — Enter a name for a personalised greeting, or skip it.
4. Your Reasons (optional) — Share what brought you here. This is never stored.
5. Energy Calibration — Set your current energy level so the app feels right from day one.

After onboarding, a 3-screen guided tour walks you through the main features. You can swipe through or skip it — it won't appear again.`,
  },
  {
    heading: '🏠 Home & Check-in',
    body: `Each day starts with a gentle check-in on the Home screen:

• Energy slider (1–10) — How heavy does today feel?
• Mood weather — Pick from stormy → sunny to describe your mood.
• Optional note — A few words, or nothing at all.
• "Just let me in" — Skip the check-in entirely. No guilt.

If you log energy ≤ 3, the app switches to Quiet Mode — a simpler layout with just two gentle options, and your Letter to Myself surfaced if you've written one.`,
  },
  {
    heading: '✨ Daily Micro-Plan',
    body: `Three small, manageable tasks are suggested each day from a curated library.

• Tap a task to mark it complete — a gentle celebration follows.
• Tap the swap icon to replace a task with a different one.
• There are no streaks. Missing a day has no consequence.`,
  },
  {
    heading: '🌸 Glimmer Catcher',
    body: `Log anything that felt even slightly okay — a warm drink, a moment of quiet, a kind thought. One sentence is enough.

• Entries appear in reverse-chronological order.
• Glimmers feed into your Weekly Insights to show patterns over time.`,
  },
  {
    heading: '🧶 Thought Untangler',
    body: `A 4-step guided CBT reframing tool to gently work through difficult thoughts:

1. What's the thought? — Write it down as it is.
2. What's the evidence? — What supports it, and what doesn't?
3. Is there another way to see this? — A softer perspective.
4. What would you say to a friend? — Self-compassion step.

Past sessions are saved and viewable below the tool.`,
  },
  {
    heading: '🌬️ Soothing Toolkit',
    body: `Three grounding exercises for difficult moments:

• Box Breathing — An animated circle guides you through 4-4-4-4 breathing (inhale, hold, exhale, hold).
• 5-4-3-2-1 Senses — A grounding exercise that brings you back to the present moment.
• Safe Place Visualisation — A guided prompt to mentally visit a place of calm.`,
  },
  {
    heading: '📊 Weekly Insights',
    body: `A passive, judgment-free look at your week:

• Mood bar chart — Your energy levels across the past 7 days.
• Glimmer correlation — Whether days with glimmers tended to feel lighter.
• Virtual Garden — One element grows for each week you engage. Missed weeks are never penalised — a wildflower appears instead.`,
  },
  {
    heading: '💌 Letter to Myself',
    body: `Write a compassionate note to yourself on a stable day. On low-energy days (energy ≤ 3), the app gently surfaces this letter on the Home screen.`,
  },
  {
    heading: '💙 Crisis Button',
    body: `A "I need help" button is always visible on every screen. Tapping it opens a panel with:

• Crisis lines automatically matched to your region (17 countries supported)
• Call and SMS options for each helpline
• A pre-written SMS to your trusted contact (if configured)
• "Other countries" toggle to browse all available helplines

This button is never hidden and requires no navigation to reach.`,
  },
  {
    heading: '⚙️ Settings',
    body: `• Dark Mode — Toggles between light and dark theme.
• Gentle Reminders — Opt-in to a single daily nudge. No streaks, no guilt.
• Trusted Contact — Save a name and phone number for the crisis panel SMS.
• Delete Everything — Two-step confirmation that wipes all your data and resets the app.`,
  },
  {
    heading: '🔒 Your Privacy',
    body: `• Nothing leaves your device. All data is stored in your browser's localStorage only.
• No accounts, no servers, no analytics.
• You can delete everything at any time from Settings → Delete Everything.
• Data is only written after you give consent on the Privacy screen during onboarding.`,
  },
]

export default function Guide() {
  return (
    <div style={{ position: 'relative' }}>
      <CrisisButton />
      <div className="page fade-in">
        <h1 className="section-title">User Guide</h1>
        <p className="section-sub">Everything you need to know about Gentle Companion.</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {sections.map(({ heading, body }) => (
            <div key={heading} className="card">
              <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 10 }}>{heading}</h2>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-mid)', lineHeight: 1.75, whiteSpace: 'pre-line' }}>
                {body}
              </p>
            </div>
          ))}
        </div>

        <p style={{ fontSize: '0.8rem', color: 'var(--text-soft)', textAlign: 'center', marginTop: 24, lineHeight: 1.6 }}>
          Take what's useful. Leave what isn't. You're doing enough.
        </p>
      </div>
      <NavBar />
    </div>
  )
}
