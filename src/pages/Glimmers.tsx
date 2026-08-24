import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { CrisisButton } from '../components/CrisisButton'
import { NavBar } from '../components/NavBar'
import { Plus, X } from 'lucide-react'

export default function Glimmers() {
  const { glimmers, addGlimmer } = useApp()
  const [text, setText] = useState('')
  const [adding, setAdding] = useState(false)
  const [celebrated, setCelebrated] = useState(false)

  const handleAdd = () => {
    if (!text.trim()) return
    addGlimmer(text.trim())
    setText('')
    setAdding(false)
    setCelebrated(true)
    setTimeout(() => setCelebrated(false), 2500)
  }

  const sorted = [...glimmers].reverse()

  const formatDate = (iso: string) => {
    const d = new Date(iso)
    return d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })
  }

  return (
    <div style={{ position: 'relative' }}>
      <CrisisButton />
      <div className="page fade-in">
        <h1 className="section-title">Glimmer Catcher 🌸</h1>
        <p className="section-sub">
          A glimmer is anything even slightly okay — a warm drink, a moment of quiet, a song.
          No pressure. One word is enough.
        </p>

        {celebrated && (
          <div className="celebration fade-in" style={{ marginBottom: 16 }}>
            <span className="celebration-emoji">✨</span>
            <p style={{ fontWeight: 700, color: 'var(--sage)' }}>Caught. That moment is yours to keep.</p>
          </div>
        )}

        {/* Add glimmer */}
        {adding ? (
          <div className="card fade-in" style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ fontWeight: 700 }}>What's your glimmer?</span>
              <button className="btn-ghost" onClick={() => setAdding(false)} aria-label="Cancel adding glimmer" style={{ padding: '4px 8px' }}>
                <X size={18} />
              </button>
            </div>
            <textarea
              autoFocus
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="e.g. The sun came through the window for a moment…"
              maxLength={200}
              rows={3}
              style={{
                width: '100%', padding: '14px 16px', borderRadius: 'var(--radius-sm)',
                background: 'var(--peach-pale)', fontSize: '0.95rem', color: 'var(--text-dark)',
                resize: 'none', lineHeight: 1.6, marginBottom: 12,
              }}
            />
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn-primary" onClick={handleAdd} disabled={!text.trim()}>
                Catch this glimmer 🌸
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setAdding(true)}
            style={{
              width: '100%', padding: '16px', borderRadius: 'var(--radius)',
              background: 'var(--peach-pale)', color: 'var(--peach)',
              fontWeight: 700, fontSize: '1rem', marginBottom: 20,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              border: '2px dashed var(--peach)',
            }}
          >
            <Plus size={20} /> Add a glimmer
          </button>
        )}

        {/* Glimmer list */}
        {sorted.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '40px 24px', background: 'var(--peach-pale)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🌱</div>
            <p style={{ color: 'var(--text-mid)', lineHeight: 1.7 }}>
              Your glimmers will grow here. Even the tiniest ones count.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {sorted.map(g => (
              <div key={g.id} className="card fade-in" style={{ padding: '16px 20px', borderLeft: '4px solid var(--peach)' }}>
                <p style={{ fontSize: '0.95rem', lineHeight: 1.7, marginBottom: 6 }}>"{g.text}"</p>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-soft)' }}>{formatDate(g.date)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      <NavBar />
    </div>
  )
}
