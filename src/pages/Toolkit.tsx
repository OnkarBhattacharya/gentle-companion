import { useState, useEffect, useRef } from 'react'
import { GROUNDING } from '../data/content'
import { CrisisButton } from '../components/CrisisButton'
import { NavBar } from '../components/NavBar'
import { X, ChevronRight } from 'lucide-react'

type Phase = 'idle' | 'in' | 'hold-in' | 'out' | 'hold-out'

const BOX_PHASES: { phase: Phase; label: string; duration: number }[] = [
  { phase: 'in', label: 'Breathe in…', duration: 4 },
  { phase: 'hold-in', label: 'Hold…', duration: 4 },
  { phase: 'out', label: 'Breathe out…', duration: 4 },
  { phase: 'hold-out', label: 'Hold…', duration: 4 },
]

function BreathingPacer() {
  const [active, setActive] = useState(false)
  const [phase, setPhase] = useState<Phase>('idle')
  const [count, setCount] = useState(0)
  const [cycles, setCycles] = useState(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!active) { setPhase('idle'); setCount(0); return }
    let phaseIdx = 0
    let remaining = BOX_PHASES[0].duration

    const tick = () => {
      setPhase(BOX_PHASES[phaseIdx].phase)
      setCount(remaining)
      remaining--
      if (remaining < 0) {
        phaseIdx = (phaseIdx + 1) % BOX_PHASES.length
        if (phaseIdx === 0) setCycles(c => c + 1)
        remaining = BOX_PHASES[phaseIdx].duration - 1
        setPhase(BOX_PHASES[phaseIdx].phase)
        setCount(remaining + 1)
      }
      timerRef.current = setTimeout(tick, 1000)
    }

    timerRef.current = setTimeout(tick, 0)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [active])

  const circleScale = phase === 'in' ? 1.5 : phase === 'hold-in' ? 1.5 : phase === 'out' ? 1 : 1
  const phaseLabel = phase === 'idle' ? 'Tap to begin' : BOX_PHASES.find(p => p.phase === phase)?.label || ''

  return (
    <div className="card" style={{ textAlign: 'center', padding: '32px 24px' }}>
      <h3 style={{ fontWeight: 700, marginBottom: 6 }}>Box Breathing</h3>
      <p style={{ color: 'var(--text-soft)', fontSize: '0.85rem', marginBottom: 28 }}>4-4-4-4 rhythm to calm your nervous system</p>

      <div
        onClick={() => setActive(a => !a)}
        style={{
          width: 120, height: 120, borderRadius: '50%',
          background: 'var(--sky-pale)',
          border: '3px solid var(--sky)',
          margin: '0 auto 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer',
          transform: `scale(${circleScale})`,
          transition: phase === 'in' ? 'transform 4s ease-in-out' : phase === 'out' ? 'transform 4s ease-in-out' : 'transform 0.3s ease',
        }}
      >
        <span style={{ fontSize: active ? '1.8rem' : '1.4rem', fontWeight: 700, color: 'var(--sky)' }}>
          {active ? count : '▶'}
        </span>
      </div>

      <p style={{ fontWeight: 600, color: 'var(--text-mid)', fontSize: '1rem', marginBottom: 8 }}>{phaseLabel}</p>
      {cycles > 0 && <p style={{ color: 'var(--sage)', fontSize: '0.85rem' }}>🌿 {cycles} cycle{cycles > 1 ? 's' : ''} complete</p>}
      {active && (
        <button className="btn-ghost" onClick={() => setActive(false)} style={{ marginTop: 12 }}>
          <X size={14} style={{ display: 'inline', marginRight: 4 }} /> Stop
        </button>
      )}
    </div>
  )
}

function GroundingCard({ exercise }: { exercise: typeof GROUNDING[0] }) {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(0)

  const reset = () => { setStep(0); setOpen(false) }

  return (
    <>
      <button
        className="card"
        onClick={() => setOpen(true)}
        style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 16, padding: '18px 20px' }}
      >
        <span style={{ fontSize: '2rem' }}>{exercise.emoji}</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, marginBottom: 2 }}>{exercise.title}</div>
          <div style={{ color: 'var(--text-soft)', fontSize: '0.85rem' }}>{exercise.description}</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-soft)', background: 'var(--sage-pale)', padding: '3px 10px', borderRadius: 50 }}>
            {exercise.duration}
          </span>
          <ChevronRight size={16} style={{ color: 'var(--text-soft)' }} />
        </div>
      </button>

      {open && (
        <div className="modal-overlay" onClick={reset}>
          <div className="modal-sheet" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontWeight: 700, fontSize: '1.2rem' }}>{exercise.emoji} {exercise.title}</h2>
              <button className="btn-ghost" onClick={reset} style={{ padding: '4px 8px' }}><X size={20} /></button>
            </div>

            <div style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
                {exercise.steps.map((_, i) => (
                  <div key={i} style={{
                    flex: 1, height: 4, borderRadius: 2,
                    background: i <= step ? 'var(--sage)' : 'var(--sage-pale)',
                    transition: 'background 0.3s ease',
                  }} />
                ))}
              </div>

              <div className="card fade-in" key={step} style={{ background: 'var(--sage-pale)', minHeight: 100, display: 'flex', alignItems: 'center', padding: '24px' }}>
                <p style={{ fontSize: '1.05rem', lineHeight: 1.8, color: 'var(--text-dark)' }}>
                  {exercise.steps[step]}
                </p>
              </div>
            </div>

            {step < exercise.steps.length - 1 ? (
              <button className="btn-primary" onClick={() => setStep(s => s + 1)}>
                Next <ChevronRight size={16} style={{ display: 'inline', verticalAlign: 'middle' }} />
              </button>
            ) : (
              <div>
                <div className="celebration" style={{ padding: '16px 0 24px' }}>
                  <span className="celebration-emoji">🌿</span>
                  <p style={{ fontWeight: 700, color: 'var(--sage)' }}>Well done. Take a moment to notice how you feel.</p>
                </div>
                <button className="btn-primary" onClick={reset}>Close</button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default function Toolkit() {
  return (
    <div style={{ position: 'relative' }}>
      <CrisisButton />
      <div className="page fade-in">
        <h1 className="section-title">Soothing Toolkit 🌬️</h1>
        <p className="section-sub">Gentle tools to help you feel a little more grounded.</p>

        <BreathingPacer />

        <h2 style={{ fontWeight: 700, fontSize: '1rem', margin: '24px 0 12px', color: 'var(--text-mid)' }}>
          Grounding Exercises
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {GROUNDING.map(ex => <GroundingCard key={ex.id} exercise={ex} />)}
        </div>
      </div>
      <NavBar />
    </div>
  )
}
