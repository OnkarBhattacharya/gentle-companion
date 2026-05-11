import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { ChevronRight } from 'lucide-react'

const SLIDES = [
  {
    emoji: '✨',
    title: 'Your Daily Micro-Plan',
    body: 'Each day, we suggest 1–3 tiny actions — things so small they barely count. But they do. Completing even one is worth celebrating.',
    color: 'var(--lavender-pale)',
    accent: 'var(--lavender)',
  },
  {
    emoji: '🌸',
    title: 'Catch Your Glimmers',
    body: 'A glimmer is anything even slightly okay — a warm drink, a moment of quiet, a song. Catching them gently trains your mind to notice the light.',
    color: 'var(--peach-pale)',
    accent: 'var(--peach)',
  },
  {
    emoji: '🌬️',
    title: 'Your Soothing Toolkit',
    body: 'Breathing exercises, grounding tools, and thought untangling — all here whenever you need them. No schedule, no pressure.',
    color: 'var(--sky-pale)',
    accent: 'var(--sky)',
  },
]

export default function Tour() {
  const { setTourDone } = useApp()
  const navigate = useNavigate()
  const [slide, setSlide] = useState(0)

  const finish = () => {
    setTourDone(true)
    navigate('/home')
  }

  const isLast = slide === SLIDES.length - 1
  const current = SLIDES[slide]

  return (
    <div className="onboarding-wrap">
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button className="btn-ghost" onClick={finish}>Skip tour</button>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div
          className="card fade-in"
          key={slide}
          style={{ background: current.color, textAlign: 'center', padding: '48px 32px' }}
        >
          <div style={{ fontSize: '4rem', marginBottom: 24 }}>{current.emoji}</div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: 16, color: current.accent }}>
            {current.title}
          </h2>
          <p style={{ color: 'var(--text-mid)', fontSize: '1rem', lineHeight: 1.8 }}>
            {current.body}
          </p>
        </div>

        {/* Dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, margin: '28px 0 32px' }}>
          {SLIDES.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setSlide(i)}
              aria-label={`Go to slide ${i + 1}`}
              style={{
                width: i === slide ? 20 : 8, height: 8, borderRadius: 4, cursor: 'pointer',
                background: i === slide ? 'var(--sage)' : 'var(--sage-pale)',
                transition: 'all 0.3s ease',
                padding: 0, border: 'none',
              }}
            />
          ))}
        </div>

        {isLast ? (
          <button className="btn-primary" onClick={finish}>
            Let's go 🌿
          </button>
        ) : (
          <button className="btn-primary" onClick={() => setSlide(s => s + 1)}>
            Next <ChevronRight size={18} style={{ display: 'inline', verticalAlign: 'middle' }} />
          </button>
        )}
      </div>
    </div>
  )
}
