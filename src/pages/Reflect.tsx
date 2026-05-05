import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { REFRAME_PROMPTS, MOOD_OPTIONS } from '../data/content'
import { CrisisButton } from '../components/CrisisButton'
import { NavBar } from '../components/NavBar'
import { ChevronRight, RotateCcw } from 'lucide-react'

function ThoughtUntangler() {
  const { saveReflectSession, reflectSessions } = useApp()
  const [active, setActive] = useState(false)
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<string[]>(['', '', '', ''])
  const [done, setDone] = useState(false)

  const reset = () => { setStep(0); setAnswers(['', '', '', '']); setDone(false); setActive(false) }

  const handleNext = () => {
    if (step < REFRAME_PROMPTS.length - 1) {
      setStep(s => s + 1)
    } else {
      saveReflectSession(answers)
      setDone(true)
    }
  }

  if (!active) {
    return (
      <div className="card" style={{ background: 'var(--sage-pale)', marginBottom: 20 }}>
        <div style={{ fontSize: '2rem', marginBottom: 12 }}>🧶</div>
        <h3 style={{ fontWeight: 700, marginBottom: 8 }}>Thought Untangler</h3>
        <p style={{ color: 'var(--text-mid)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: 16 }}>
          A gentle CBT-based tool to help you examine a difficult thought with kindness — not to dismiss it, but to see it more clearly.
        </p>
        <button className="btn-primary" onClick={() => setActive(true)}>
          Begin <ChevronRight size={16} style={{ display: 'inline', verticalAlign: 'middle' }} />
        </button>

        {reflectSessions.length > 0 && (
          <div style={{ marginTop: 20 }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-soft)', fontWeight: 700, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Past reflections ({reflectSessions.length})
            </div>
            {[...reflectSessions].reverse().slice(0, 3).map(s => (
              <div key={s.id} style={{ padding: '10px 14px', borderRadius: 'var(--radius-sm)', background: 'var(--card-bg)', marginBottom: 8 }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-soft)', marginBottom: 4 }}>
                  {new Date(s.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-mid)', lineHeight: 1.5 }}>
                  "{s.answers[3] || s.answers[0]}"
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  if (done) {
    return (
      <div className="card fade-in" style={{ marginBottom: 20 }}>
        <div className="celebration" style={{ padding: '8px 0 20px' }}>
          <span className="celebration-emoji">🌿</span>
          <h3 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: 8 }}>You did something brave.</h3>
          <p style={{ color: 'var(--text-mid)', fontSize: '0.9rem', lineHeight: 1.7 }}>
            Examining our thoughts takes courage. Here's what you found:
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
          {REFRAME_PROMPTS.map((p, i) => answers[i] && (
            <div key={i} style={{ padding: '12px 16px', borderRadius: 'var(--radius-sm)', background: 'var(--sage-pale)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-soft)', marginBottom: 4, fontWeight: 700 }}>
                Step {i + 1}
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-dark)', lineHeight: 1.6 }}>{answers[i]}</p>
            </div>
          ))}
        </div>
        <button className="btn-ghost" onClick={reset} style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--sage)' }}>
          <RotateCcw size={14} /> Start again
        </button>
      </div>
    )
  }

  const prompt = REFRAME_PROMPTS[step]

  return (
    <div className="card fade-in" style={{ marginBottom: 20 }}>
      <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
        {REFRAME_PROMPTS.map((_, i) => (
          <div key={i} style={{
            flex: 1, height: 4, borderRadius: 2,
            background: i <= step ? 'var(--sage)' : 'var(--sage-pale)',
            transition: 'background 0.3s ease',
          }} />
        ))}
      </div>

      <div style={{ fontSize: '0.75rem', color: 'var(--sage)', fontWeight: 700, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        Step {step + 1} of {REFRAME_PROMPTS.length}
      </div>
      <h3 style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: 6, lineHeight: 1.5 }}>{prompt.question}</h3>
      <p style={{ color: 'var(--text-soft)', fontSize: '0.85rem', marginBottom: 16, lineHeight: 1.6 }}>{prompt.hint}</p>

      <textarea
        autoFocus
        value={answers[step]}
        onChange={e => {
          const updated = [...answers]
          updated[step] = e.target.value
          setAnswers(updated)
        }}
        placeholder={prompt.placeholder}
        rows={3}
        style={{
          width: '100%', padding: '14px 16px', borderRadius: 'var(--radius-sm)',
          background: 'var(--sage-pale)', fontSize: '0.95rem', color: 'var(--text-dark)',
          resize: 'none', lineHeight: 1.6, marginBottom: 16,
        }}
      />

      <div style={{ display: 'flex', gap: 10 }}>
        <button className="btn-primary" onClick={handleNext}>
          {step < REFRAME_PROMPTS.length - 1 ? 'Next' : 'Finish'}
          <ChevronRight size={16} style={{ display: 'inline', verticalAlign: 'middle', marginLeft: 4 }} />
        </button>
        {step > 0 && (
          <button className="btn-ghost" onClick={() => setStep(s => s - 1)}>Back</button>
        )}
      </div>
    </div>
  )
}

function MoodHistory() {
  const { checkIns } = useApp()
  const recent = [...checkIns].reverse().slice(0, 7)

  if (recent.length === 0) return null

  const getMoodEmoji = (mood: string) => MOOD_OPTIONS.find(m => m.value === mood)?.emoji || '☁️'
  const getMoodColor = (mood: string) => MOOD_OPTIONS.find(m => m.value === mood)?.color || '#9a9590'

  return (
    <div className="card" style={{ marginBottom: 20 }}>
      <h3 style={{ fontWeight: 700, marginBottom: 4 }}>Your recent mood</h3>
      <p style={{ color: 'var(--text-soft)', fontSize: '0.85rem', marginBottom: 16 }}>
        No judgement here — just a gentle reflection.
      </p>
      <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', height: 80 }}>
        {recent.map((c, i) => (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <div
              title={c.mood}
              style={{
                width: '100%', borderRadius: 6,
                height: `${(c.energy / 10) * 60 + 10}px`,
                background: getMoodColor(c.mood),
                opacity: 0.7,
                transition: 'height 0.5s ease',
              }}
            />
            <span style={{ fontSize: '0.9rem' }}>{getMoodEmoji(c.mood)}</span>
          </div>
        ))}
      </div>
      <p style={{ fontSize: '0.75rem', color: 'var(--text-soft)', marginTop: 8, textAlign: 'center' }}>
        Last {recent.length} check-in{recent.length > 1 ? 's' : ''}
      </p>
    </div>
  )
}

export default function Reflect() {
  return (
    <div style={{ position: 'relative' }}>
      <CrisisButton />
      <div className="page fade-in">
        <h1 className="section-title">Reflect 🧶</h1>
        <p className="section-sub">Gentle tools to understand your inner world — at your own pace.</p>

        <ThoughtUntangler />
        <MoodHistory />

        <div className="card" style={{ background: 'var(--lavender-pale)', padding: '18px 20px' }}>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-mid)', lineHeight: 1.7 }}>
            💜 <strong>A note:</strong> This app is a supportive companion, not a replacement for therapy.
            If you're struggling, please consider reaching out to a mental health professional.
            The "I need help" button at the top connects you to crisis support anytime.
          </p>
        </div>
      </div>
      <NavBar />
    </div>
  )
}
