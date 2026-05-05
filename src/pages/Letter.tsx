import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { CrisisButton } from '../components/CrisisButton'
import { NavBar } from '../components/NavBar'
import { Save, Edit3 } from 'lucide-react'

export default function Letter() {
  const { letterToSelf, saveLetterToSelf, todayCheckIn } = useApp()
  const [editing, setEditing] = useState(!letterToSelf)
  const [draft, setDraft] = useState(letterToSelf)
  const [saved, setSaved] = useState(false)

  const isLowDay = todayCheckIn ? todayCheckIn.energy <= 3 : false

  const handleSave = () => {
    if (!draft.trim()) return
    saveLetterToSelf(draft.trim())
    setEditing(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div style={{ position: 'relative' }}>
      <CrisisButton />
      <div className="page fade-in">
        <h1 className="section-title">Letter to Myself 💌</h1>
        <p className="section-sub">
          Write a compassionate note to yourself during a stable moment. On hard days, we'll gently offer it back to you.
        </p>

        {/* Show letter on low-energy days */}
        {isLowDay && letterToSelf && !editing && (
          <div className="card fade-in" style={{ background: 'var(--lavender-pale)', marginBottom: 20, padding: '24px' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: 12 }}>💜</div>
            <p style={{ fontSize: '0.85rem', color: 'var(--lavender)', fontWeight: 700, marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              A message from you, to you
            </p>
            <p style={{ fontSize: '1rem', lineHeight: 1.8, color: 'var(--text-dark)', fontStyle: 'italic' }}>
              "{letterToSelf}"
            </p>
          </div>
        )}

        {saved && (
          <div className="celebration fade-in" style={{ marginBottom: 16 }}>
            <span className="celebration-emoji">💌</span>
            <p style={{ fontWeight: 700, color: 'var(--sage)' }}>Saved. Your future self will be glad you wrote this.</p>
          </div>
        )}

        {editing ? (
          <div className="card" style={{ marginBottom: 20 }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-soft)', marginBottom: 16, lineHeight: 1.6 }}>
              Imagine you're writing to a dear friend who is having a very hard day. What would you want them to know?
            </p>
            <textarea
              autoFocus
              value={draft}
              onChange={e => setDraft(e.target.value)}
              placeholder={'e.g. "You\'ve been through hard things before and you\'re still here. That matters. You don\'t have to fix everything today — just breathe."'}
              rows={6}
              maxLength={600}
              style={{
                width: '100%', padding: '14px 16px', borderRadius: 'var(--radius-sm)',
                background: 'var(--lavender-pale)', fontSize: '0.95rem', color: 'var(--text-dark)',
                resize: 'none', lineHeight: 1.7, marginBottom: 16,
              }}
            />
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn-primary" onClick={handleSave} disabled={!draft.trim()}>
                <Save size={16} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />
                Save letter
              </button>
              {letterToSelf && (
                <button className="btn-ghost" onClick={() => { setDraft(letterToSelf); setEditing(false) }}>
                  Cancel
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="card" style={{ marginBottom: 20 }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-soft)', marginBottom: 12, lineHeight: 1.6 }}>
              Your letter is saved. On days when your energy is very low, we'll gently show it to you.
            </p>
            <div style={{ padding: '16px', borderRadius: 'var(--radius-sm)', background: 'var(--lavender-pale)', marginBottom: 16 }}>
              <p style={{ fontSize: '0.95rem', lineHeight: 1.7, color: 'var(--text-dark)', fontStyle: 'italic' }}>
                "{letterToSelf}"
              </p>
            </div>
            <button
              onClick={() => { setDraft(letterToSelf); setEditing(true) }}
              style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--lavender)', fontWeight: 600, fontSize: '0.9rem', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            >
              <Edit3 size={14} /> Edit letter
            </button>
          </div>
        )}

        <div className="card" style={{ background: 'var(--sage-pale)', padding: '16px 20px' }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-mid)', lineHeight: 1.7 }}>
            🌿 <strong>Tip:</strong> Write this on a day when you feel even slightly okay. Your future self will thank you.
          </p>
        </div>
      </div>
      <NavBar />
    </div>
  )
}
