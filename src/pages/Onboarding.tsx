import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp, MoodWeather } from '../context/AppContext'
import { MOOD_OPTIONS } from '../data/content'
import { ChevronRight, SkipForward } from 'lucide-react'

const REASONS = [
  { id: 'low', label: 'Feeling low', emoji: '🌧️' },
  { id: 'burnout', label: 'Burnout', emoji: '🕯️' },
  { id: 'anxiety', label: 'Anxiety', emoji: '🌀' },
  { id: 'therapy', label: 'Supporting therapy', emoji: '🌱' },
  { id: 'curious', label: 'Just exploring', emoji: '🔍' },
]

export default function Onboarding() {
  const { setUserName, setOnboarded, giveConsent, addCheckIn } = useApp()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [name, setName] = useState('')
  const [selected, setSelected] = useState<string[]>([])
  const [energy, setEnergy] = useState(5)
  const [mood, setMood] = useState<MoodWeather>('cloudy')

  const finish = (skipCalibration = false) => {
    setUserName(name.trim() || 'friend')
    if (!skipCalibration) {
      addCheckIn({ date: new Date().toISOString().split('T')[0], energy, mood })
    }
    setOnboarded(true)
    navigate('/tour')
  }

  const handleConsentAndContinue = () => {
    giveConsent()
    setStep(2)
  }

  const toggleReason = (id: string) =>
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])

  const screens = [
    // Screen 0 — Welcome
    <div className="fade-in" style={{ textAlign: 'center', paddingTop: 'clamp(32px, 10vh, 60px)' }}>
      <div style={{ fontSize: '4rem', marginBottom: 24 }}>🌿</div>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: 16, lineHeight: 1.3 }}>
        We're glad you're here.
      </h1>
      <p style={{ color: 'var(--text-mid)', fontSize: '1rem', lineHeight: 1.8, margin: '0 auto 32px', maxWidth: 320 }}>
        This app meets you exactly where you are. No pressure, no judgment — just a gentle companion for the hard days.
      </p>
      <button className="btn-primary" onClick={() => setStep(1)}>
        Let's begin <ChevronRight size={18} style={{ display: 'inline', verticalAlign: 'middle' }} />
      </button>
    </div>,

    // Screen 1 — Privacy & Consent
    <div className="fade-in" style={{ paddingTop: 'clamp(20px, 5vh, 40px)' }}>
      <div style={{ fontSize: '3rem', marginBottom: 20, textAlign: 'center' }}>🔒</div>
      <h2 className="section-title" style={{ textAlign: 'center' }}>Your privacy is sacred</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, margin: '24px 0' }}>
        {[
          ['🗂️', 'Your data stays on your device', 'Everything is stored locally. Nothing leaves your device.'],
          ['🚫', 'No ads, ever', 'We will never sell your data or show you ads.'],
          ['🗑️', 'Delete anytime', 'You own your data. Delete everything from Settings with one tap.'],
        ].map(([emoji, title, desc]) => (
          <div key={title} className="card" style={{ display: 'flex', gap: 16, alignItems: 'flex-start', padding: '16px 20px' }}>
            <span style={{ fontSize: '1.5rem' }}>{emoji}</span>
            <div>
              <div style={{ fontWeight: 700, marginBottom: 2 }}>{title}</div>
              <div style={{ color: 'var(--text-soft)', fontSize: '0.85rem' }}>{desc}</div>
            </div>
          </div>
        ))}
      </div>
      <p style={{ fontSize: '0.8rem', color: 'var(--text-soft)', marginBottom: 16, lineHeight: 1.6 }}>
        By tapping "I agree", you consent to this app storing your check-ins, glimmers, and reflections locally on your device. No data is sent to any server.
      </p>
      <button className="btn-primary" onClick={handleConsentAndContinue}>I agree &amp; continue</button>
    </div>,

    // Screen 2 — Name
    <div className="fade-in" style={{ paddingTop: 'clamp(20px, 5vh, 40px)' }}>
      <div style={{ fontSize: '3rem', marginBottom: 20, textAlign: 'center' }}>👋</div>
      <h2 className="section-title" style={{ textAlign: 'center' }}>What shall I call you?</h2>
      <p className="section-sub" style={{ textAlign: 'center' }}>Totally optional — a nickname, first name, or anything you like.</p>
      <input
        type="text"
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Your name (optional)"
        maxLength={30}
        style={{
          width: '100%', padding: '16px 20px', borderRadius: 'var(--radius)',
          background: 'var(--sage-pale)', fontSize: '1rem', color: 'var(--text-dark)',
          marginBottom: 24,
        }}
      />
      <button className="btn-primary" onClick={() => setStep(3)}>
        {name.trim() ? `Nice to meet you, ${name.trim()}` : 'Continue'}
      </button>
    </div>,

    // Screen 3 — Reasons (not stored)
    <div className="fade-in" style={{ paddingTop: 'clamp(20px, 5vh, 40px)' }}>
      <h2 className="section-title">What brings you here?</h2>
      <p className="section-sub">Optional — helps set the tone. Not stored.</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 32 }}>
        {REASONS.map(r => (
          <button
            key={r.id}
            className={`chip ${selected.includes(r.id) ? 'selected' : ''}`}
            onClick={() => toggleReason(r.id)}
          >
            {r.emoji} {r.label}
          </button>
        ))}
      </div>
      <button className="btn-primary" onClick={() => setStep(4)}>Continue</button>
    </div>,

    // Screen 4 — Energy Calibration (§6)
    <div className="fade-in" style={{ paddingTop: 'clamp(20px, 5vh, 40px)' }}>
      <div style={{ fontSize: '3rem', marginBottom: 20, textAlign: 'center' }}>🌡️</div>
      <h2 className="section-title" style={{ textAlign: 'center' }}>How are you right now?</h2>
      <p className="section-sub" style={{ textAlign: 'center' }}>
        Just one honest answer. This helps us set the right tone for today.
      </p>

      <div className="card" style={{ marginBottom: 20 }}>
        <div className="slider-wrap">
          <div className="slider-label">
            <span>Energy / Weight</span>
            <span style={{ color: 'var(--sage)', fontWeight: 700 }}>
              {energy <= 3 ? 'Very heavy' : energy <= 5 ? 'Heavy' : energy <= 7 ? 'Okay' : 'Lighter'}
            </span>
          </div>
          <input type="range" min={1} max={10} value={energy} onChange={e => setEnergy(Number(e.target.value))} />
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
      </div>

      <button className="btn-primary" onClick={() => finish(false)}>Start my journey 🌿</button>
    </div>,
  ]

  return (
    <div className="onboarding-wrap">
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        {step > 1 && (
          <button className="btn-ghost" onClick={() => finish(true)} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <SkipForward size={14} /> Skip
          </button>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, margin: '16px 0' }}>
        {screens.map((_, i) => (
          <div key={i} style={{
            width: i === step ? 20 : 8, height: 8, borderRadius: 4,
            background: i === step ? 'var(--sage)' : 'var(--sage-pale)',
            transition: 'all 0.3s ease',
          }} />
        ))}
      </div>

      <div style={{ flex: 1 }}>{screens[step]}</div>
    </div>
  )
}
