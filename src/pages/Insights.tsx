import { useApp } from '../context/AppContext'
import { CrisisButton } from '../components/CrisisButton'
import { NavBar } from '../components/NavBar'
import { MOOD_OPTIONS } from '../data/content'

function getWeekDates(): string[] {
  const dates: string[] = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    dates.push(d.toISOString().split('T')[0])
  }
  return dates
}

export default function Insights() {
  const { checkIns, glimmers, gardenCount } = useApp()

  const weekDates = getWeekDates()
  const weekCheckIns = weekDates.map(date => checkIns.find(c => c.date === date) || null)
  const weekGlimmerDates = new Set(glimmers.map(g => g.date))

  const logged = weekCheckIns.filter(Boolean).length
  const avgEnergy = logged > 0
    ? Math.round(weekCheckIns.filter(Boolean).reduce((s, c) => s + c!.energy, 0) / logged * 10) / 10
    : null

  // Glimmer correlation insight
  const glimmerDays = weekCheckIns.filter(c => c && weekGlimmerDates.has(c.date))
  const nonGlimmerDays = weekCheckIns.filter(c => c && !weekGlimmerDates.has(c.date))
  const avgGlimmerEnergy = glimmerDays.length > 0
    ? glimmerDays.reduce((s, c) => s + c!.energy, 0) / glimmerDays.length : null
  const avgNonGlimmerEnergy = nonGlimmerDays.length > 0
    ? nonGlimmerDays.reduce((s, c) => s + c!.energy, 0) / nonGlimmerDays.length : null

  const showGlimmerInsight = avgGlimmerEnergy !== null && avgNonGlimmerEnergy !== null
  const glimmerHelped = showGlimmerInsight && avgGlimmerEnergy! > avgNonGlimmerEnergy!

  const getMoodEmoji = (mood: string) => MOOD_OPTIONS.find(m => m.value === mood)?.emoji || '☁️'
  const getMoodColor = (mood: string) => MOOD_OPTIONS.find(m => m.value === mood)?.color || '#9a9590'

  // Garden elements — one per week of engagement
  const GARDEN_ELEMENTS = ['🌱', '🌿', '🌸', '🌺', '🌻', '🍀', '🌾', '🌼', '🪷', '🌳']
  const WILDFLOWER = '🌾' // for messy weeks

  return (
    <div style={{ position: 'relative' }}>
      <CrisisButton />
      <div className="page fade-in">
        <h1 className="section-title">Your Week 🌿</h1>
        <p className="section-sub">A gentle look at your patterns — no judgment, just noticing.</p>

        {/* 7-day mood bar chart */}
        <div className="card" style={{ marginBottom: 16 }}>
          <h3 style={{ fontWeight: 700, marginBottom: 4 }}>This week's mood</h3>
          <p style={{ color: 'var(--text-soft)', fontSize: '0.85rem', marginBottom: 16 }}>
            {logged === 0 ? 'No check-ins yet this week.' : `${logged} of 7 days logged.`}
          </p>
          <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end', height: 80 }}>
            {weekDates.map((date, i) => {
              const c = weekCheckIns[i]
              const dayLabel = new Date(date + 'T12:00:00').toLocaleDateString(undefined, { weekday: 'short' })
              return (
                <div key={date} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  {c ? (
                    <div
                      title={c.mood}
                      style={{
                        width: '100%', borderRadius: 6,
                        height: `${(c.energy / 10) * 60 + 10}px`,
                        background: getMoodColor(c.mood), opacity: 0.75,
                        transition: 'height 0.5s ease',
                      }}
                    />
                  ) : (
                    <div style={{ width: '100%', height: 10, borderRadius: 6, background: 'var(--sage-pale)' }} />
                  )}
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-soft)' }}>{dayLabel}</span>
                  {c && <span style={{ fontSize: '0.75rem' }}>{getMoodEmoji(c.mood)}</span>}
                </div>
              )
            })}
          </div>
          {avgEnergy !== null && (
            <p style={{ fontSize: '0.8rem', color: 'var(--text-soft)', marginTop: 12, textAlign: 'center' }}>
              Average energy this week: <strong style={{ color: 'var(--sage)' }}>{avgEnergy}/10</strong>
            </p>
          )}
        </div>

        {/* Glimmer insight */}
        {showGlimmerInsight && (
          <div className="card" style={{ marginBottom: 16, background: glimmerHelped ? 'var(--peach-pale)' : 'var(--sage-pale)' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: 8 }}>{glimmerHelped ? '🌸' : '🌿'}</div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-mid)', lineHeight: 1.7 }}>
              {glimmerHelped
                ? `On days you caught a glimmer, your energy seemed a little higher (${avgGlimmerEnergy!.toFixed(1)} vs ${avgNonGlimmerEnergy!.toFixed(1)}). That's not nothing.`
                : `You caught glimmers this week. Even when it doesn't feel like it's helping, noticing small things matters.`}
            </p>
          </div>
        )}

        {/* Gentle observation */}
        {logged >= 3 && (
          <div className="card" style={{ marginBottom: 16, background: 'var(--lavender-pale)' }}>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-mid)', lineHeight: 1.7 }}>
              💜 You checked in {logged} time{logged > 1 ? 's' : ''} this week. Showing up — even just to log how heavy it feels — is an act of self-care.
            </p>
          </div>
        )}

        {/* Virtual Garden (§10) */}
        <div className="card" style={{ marginBottom: 16 }}>
          <h3 style={{ fontWeight: 700, marginBottom: 4 }}>Your Garden 🌱</h3>
          <p style={{ color: 'var(--text-soft)', fontSize: '0.85rem', marginBottom: 16, lineHeight: 1.6 }}>
            One element grows for each week you've shown up — even a little. It's never lost, even on missed days. The wildflower {WILDFLOWER} is for the messy weeks.
          </p>
          {gardenCount === 0 ? (
            <p style={{ color: 'var(--text-soft)', fontSize: '0.9rem' }}>Your garden is waiting for its first seed. Check in today to plant it. 🌱</p>
          ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {Array.from({ length: gardenCount }).map((_, i) => (
                <span key={i} style={{ fontSize: '1.8rem' }} title={`Week ${i + 1}`}>
                  {GARDEN_ELEMENTS[i % GARDEN_ELEMENTS.length]}
                </span>
              ))}
            </div>
          )}
          {gardenCount > 0 && (
            <p style={{ fontSize: '0.75rem', color: 'var(--text-soft)', marginTop: 12 }}>
              {gardenCount} week{gardenCount > 1 ? 's' : ''} of showing up. That's real.
            </p>
          )}
        </div>

        <div className="card" style={{ background: 'var(--sage-pale)', padding: '16px 20px' }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-mid)', lineHeight: 1.7 }}>
            🌿 <strong>A note:</strong> These patterns are observations, not verdicts. Depression fluctuates — a hard week doesn't erase your progress.
          </p>
        </div>
      </div>
      <NavBar />
    </div>
  )
}
