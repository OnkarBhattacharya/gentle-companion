import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp, MoodWeather } from '../context/AppContext'
import { MOOD_OPTIONS } from '../data/content'
import { CrisisButton } from '../components/CrisisButton'
import { NavBar } from '../components/NavBar'
import { Moon, Sun, ChevronRight } from 'lucide-react'

export default function Home() {
  const { userName, todayCheckIn, addCheckIn, toggleTheme, theme, letterToSelf } = useApp()
  const navigate = useNavigate()
  const [energy, setEnergy] = useState(todayCheckIn?.energy ?? 5)
  const [mood, setMood] = useState<MoodWeather>(todayCheckIn?.mood ?? 'cloudy')
  const [saved, setSaved] = useState(!!todayCheckIn)
  const [skippedCheckIn, setSkippedCheckIn] = useState(false)

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 17) return 'Good afternoon'
    return 'Good evening'
  }

  const handleSave = () => {
    addCheckIn({ date: new Date().toISOString().split('T')[0], energy, mood })
    setSaved(true)
  }

  const energyLabel = energy <= 3 ? 'Very heavy' : energy <= 5 ? 'Heavy' : energy <= 7 ? 'Okay' : 'Lighter'

  // Adaptive mode: quiet if today's energy ≤ 3 (§5.2)
  const isLowDay = saved && energy <= 3
  const isQuietMode = isLowDay && !skippedCheckIn

  const QUICK_ACTIONS = [
    { label: 'My Micro-Plan', emoji: '✨', path: '/plan', bg: 'var(--lavender-pale)', color: 'var(--lavender)' },
    { label: 'Soothing Toolkit', emoji: '🌬️', path: '/toolkit', bg: 'var(--sky-pale)', color: 'var(--sky)' },
    { label: 'Catch a Glimmer', emoji: '🌸', path: '/glimmers', bg: 'var(--peach-pale)', color: 'var(--peach)' },
    { label: 'Thought Untangler', emoji: '🧶', path: '/reflect', bg: 'var(--sage-pale)', color: 'var(--sage)' },
    { label: 'My Week', emoji: '📊', path: '/insights', bg: 'var(--lavender-pale)', color: 'var(--lavender)' },
    { label: 'Letter to Myself', emoji: '💌', path: '/letter', bg: 'var(--peach-pale)', color: 'var(--peach)' },
  ]

  // Quiet mode: only show breathing + one micro-task
  const QUIET_ACTIONS = [
    { label: 'One breath', emoji: '🌬️', path: '/toolkit', bg: 'var(--sky-pale)', color: 'var(--sky)' },
    { label: 'One tiny task', emoji: '✨', path: '/plan', bg: 'var(--lavender-pale)', color: 'var(--lavender)' },
  ]

  return (
    <div style={{ position: 'relative' }}>
      <CrisisButton />

      <div className="page fade-in">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28, paddingTop: 8 }}>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-soft)' }}>{greeting()}</div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{userName || 'friend'} 🌿</h1>
          </div>
          <button onClick={toggleTheme} className="btn-ghost" style={{ padding: '8px', borderRadius: '50%' }}>
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        {/* Quiet mode banner */}
        {isQuietMode && (
          <div className="card fade-in" style={{ background: 'var(--sky-pale)', marginBottom: 20, padding: '18px 20px' }}>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-mid)', lineHeight: 1.7, marginBottom: 12 }}>
              Today feels very heavy. That's okay. You don't have to do anything. Here are just two gentle options.
            </p>
            <button
              className="btn-ghost"
              onClick={() => setSkippedCheckIn(true)}
              style={{ fontSize: '0.8rem', color: 'var(--text-soft)', padding: '6px 0' }}
            >
              Show me everything →
            </button>
          </div>
        )}

        {/* Gentle note — hidden in quiet mode */}
        {!isQuietMode && (
          <div className="card" style={{ background: 'var(--sage-pale)', marginBottom: 20, padding: '18px 20px' }}>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-mid)', lineHeight: 1.7, fontStyle: 'italic' }}>
              "You don't have to fix anything right now. Just being here is enough."
            </p>
          </div>
        )}

        {/* Letter prompt on low days */}
        {isLowDay && letterToSelf && (
          <button
            onClick={() => navigate('/letter')}
            className="card fade-in"
            style={{ width: '100%', textAlign: 'left', background: 'var(--lavender-pale)', marginBottom: 20, padding: '18px 20px', cursor: 'pointer' }}
          >
            <div style={{ fontSize: '1.4rem', marginBottom: 6 }}>💌</div>
            <div style={{ fontWeight: 700, color: 'var(--lavender)', marginBottom: 4 }}>A message from you, to you</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-soft)' }}>You wrote yourself something kind. Tap to read it.</div>
          </button>
        )}

        {/* Check-in card */}
        {!saved && (
          <div className="card" style={{ marginBottom: 20 }}>
            <h2 className="section-title" style={{ fontSize: '1.1rem' }}>How are you today?</h2>
            <p className="section-sub" style={{ marginBottom: 16 }}>No right or wrong answer. Just notice.</p>

            <div className="slider-wrap">
              <div className="slider-label">
                <span>Energy / Weight</span>
                <span style={{ color: 'var(--sage)', fontWeight: 700 }}>{energyLabel}</span>
              </div>
              <input
                type="range" min={1} max={10} value={energy}
                onChange={e => setEnergy(Number(e.target.value))}
              />
              <div className="slider-label"><span>Very heavy</span><span>Lighter</span></div>
            </div>

            <div style={{ marginTop: 20 }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-soft)', marginBottom: 10 }}>Mood weather</div>
            <div className="mood-chips">
                {MOOD_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    aria-pressed={mood === opt.value}
                    aria-label={opt.label}
                    onClick={() => setMood(opt.value as MoodWeather)}
                    style={{
                      padding: '8px 14px', borderRadius: 50, fontSize: '0.85rem', fontWeight: 600,
                      background: mood === opt.value ? opt.color : 'var(--sage-pale)',
                      color: mood === opt.value ? 'white' : 'var(--text-mid)',
                      transition: 'all 0.2s ease',
                      minHeight: 40,
                    }}
                  >
                    {opt.emoji} {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginTop: 20, display: 'flex', gap: 10 }}>
              <button className="btn-primary" onClick={handleSave} style={{ flex: 1 }}>Save check-in</button>
              <button
                className="btn-ghost"
                onClick={() => setSaved(true)}
                style={{ whiteSpace: 'nowrap', fontSize: '0.85rem' }}
              >
                Just let me in
              </button>
            </div>
          </div>
        )}

        {saved && (
          <div style={{ textAlign: 'center', padding: '12px', color: 'var(--sage)', fontWeight: 700, marginBottom: 20 }}>
            ✓ Logged — well done for showing up today
          </div>
        )}

        {/* Quick actions — reduced in quiet mode */}
        <div className="quick-grid">
          {(isQuietMode ? QUIET_ACTIONS : QUICK_ACTIONS).map(item => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="card"
              style={{
                background: item.bg, textAlign: 'left', padding: '18px 16px',
                display: 'flex', flexDirection: 'column', gap: 8, cursor: 'pointer',
              }}
            >
              <span style={{ fontSize: '1.6rem' }}>{item.emoji}</span>
              <span style={{ fontWeight: 700, fontSize: '0.9rem', color: item.color }}>{item.label}</span>
              <ChevronRight size={14} style={{ color: item.color, alignSelf: 'flex-end' }} />
            </button>
          ))}
        </div>
      </div>

      <NavBar />
    </div>
  )
}
