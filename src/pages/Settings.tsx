import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { NavBar } from '../components/NavBar'
import { CrisisButton } from '../components/CrisisButton'
import { Trash2, Moon, Sun, Bell, BellOff, UserPlus, Check, BookOpen } from 'lucide-react'

export default function Settings() {
  const navigate = useNavigate()
  const {
    userName, theme, toggleTheme, deleteAllData,
    notificationsEnabled, setNotificationsEnabled,
    trustedContact, setTrustedContact,
  } = useApp()

  const [confirming, setConfirming] = useState(false)
  const [editingContact, setEditingContact] = useState(false)
  const [contactName, setContactName] = useState(trustedContact?.name || '')
  const [contactPhone, setContactPhone] = useState(trustedContact?.phone || '')
  const [contactSaved, setContactSaved] = useState(false)

  const handleDelete = () => deleteAllData()

  const handleSaveContact = () => {
    if (!contactName.trim() || !contactPhone.trim()) return
    setTrustedContact({ name: contactName.trim(), phone: contactPhone.trim() })
    setEditingContact(false)
    setContactSaved(true)
    setTimeout(() => setContactSaved(false), 2000)
  }

  const handleToggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled)
  }

  return (
    <div style={{ position: 'relative' }}>
      <CrisisButton />
      <div className="page fade-in">
        <h1 className="section-title">Settings</h1>
        <p className="section-sub">Your preferences and privacy controls.</p>

        {/* User Guide */}
        <div className="card" style={{ marginBottom: 16 }}>
          <button
            onClick={() => navigate('/guide')}
            style={{
              display: 'flex', alignItems: 'center', gap: 10, width: '100%',
              background: 'transparent', padding: 0, textAlign: 'left',
            }}
          >
            <BookOpen size={20} style={{ color: 'var(--sage)', flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, marginBottom: 2 }}>User Guide</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-soft)' }}>
                Learn how to use every feature in Gentle Companion.
              </div>
            </div>
          </button>
        </div>

        {/* Appearance */}
        <div className="card" style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 700, marginBottom: 2 }}>Appearance</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-soft)' }}>
                {theme === 'dark' ? 'Dark mode' : 'Light mode'}
              </div>
            </div>
            <button onClick={toggleTheme} className="btn-ghost" style={{ padding: '10px', borderRadius: '50%' }}>
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>

        {/* Gentle reminders (§10) */}
        <div className="card" style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ flex: 1, marginRight: 16 }}>
              <div style={{ fontWeight: 700, marginBottom: 2 }}>Gentle Reminders</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-soft)', lineHeight: 1.5 }}>
                Opt-in to a single daily nudge — something like "Just breathing counts. Want to try a short grounding exercise?" No pressure, no streaks.
              </div>
            </div>
            <button
              onClick={handleToggleNotifications}
              style={{
                padding: '10px', borderRadius: '50%', flexShrink: 0,
                background: notificationsEnabled ? 'var(--sage-pale)' : 'transparent',
                color: notificationsEnabled ? 'var(--sage)' : 'var(--text-soft)',
              }}
            >
              {notificationsEnabled ? <Bell size={20} /> : <BellOff size={20} />}
            </button>
          </div>
          {notificationsEnabled && (
            <p style={{ fontSize: '0.8rem', color: 'var(--sage)', marginTop: 10, fontWeight: 600 }}>
              ✓ Gentle reminders on — you can turn these off anytime.
            </p>
          )}
        </div>

        {/* Trusted contact (§12) */}
        <div className="card" style={{ marginBottom: 16 }}>
          <h3 style={{ fontWeight: 700, marginBottom: 6 }}>
            <UserPlus size={16} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />
            Trusted Contact
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-soft)', marginBottom: 16, lineHeight: 1.6 }}>
            Someone you trust. On very hard days, the crisis panel can offer a pre-written "reach out" message to them. Stored only on your device.
          </p>

          {contactSaved && (
            <p style={{ color: 'var(--sage)', fontWeight: 700, fontSize: '0.85rem', marginBottom: 12 }}>
              <Check size={14} style={{ display: 'inline', marginRight: 4 }} /> Contact saved.
            </p>
          )}

          {editingContact ? (
            <div>
              <input
                type="text"
                value={contactName}
                onChange={e => setContactName(e.target.value)}
                placeholder="Their name"
                maxLength={40}
                style={{
                  width: '100%', padding: '12px 16px', borderRadius: 'var(--radius-sm)',
                  background: 'var(--sage-pale)', fontSize: '0.95rem', color: 'var(--text-dark)',
                  marginBottom: 10,
                }}
              />
              <input
                type="tel"
                value={contactPhone}
                onChange={e => setContactPhone(e.target.value)}
                placeholder="Their phone number"
                maxLength={20}
                style={{
                  width: '100%', padding: '12px 16px', borderRadius: 'var(--radius-sm)',
                  background: 'var(--sage-pale)', fontSize: '0.95rem', color: 'var(--text-dark)',
                  marginBottom: 16,
                }}
              />
              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn-primary" onClick={handleSaveContact} disabled={!contactName.trim() || !contactPhone.trim()}>
                  Save contact
                </button>
                <button className="btn-ghost" onClick={() => setEditingContact(false)}>Cancel</button>
              </div>
            </div>
          ) : trustedContact ? (
            <div>
              <div style={{ padding: '12px 16px', borderRadius: 'var(--radius-sm)', background: 'var(--sage-pale)', marginBottom: 12 }}>
                <div style={{ fontWeight: 700 }}>{trustedContact.name}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-soft)' }}>{trustedContact.phone}</div>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  onClick={() => { setContactName(trustedContact.name); setContactPhone(trustedContact.phone); setEditingContact(true) }}
                  style={{ fontSize: '0.85rem', color: 'var(--sage)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                >
                  Edit
                </button>
                <button
                  onClick={() => setTrustedContact(null)}
                  style={{ fontSize: '0.85rem', color: '#e57373', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                >
                  Remove
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setEditingContact(true)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '12px 20px', borderRadius: 50,
                background: 'var(--sage-pale)', color: 'var(--sage)',
                fontWeight: 700, fontSize: '0.9rem',
              }}
            >
              <UserPlus size={16} /> Add trusted contact
            </button>
          )}
        </div>

        {/* Privacy */}
        <div className="card" style={{ marginBottom: 16 }}>
          <h3 style={{ fontWeight: 700, marginBottom: 12 }}>🔒 Your Privacy</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: '0.9rem', color: 'var(--text-mid)', lineHeight: 1.7 }}>
            <p>All data — check-ins, glimmers, reflections — is stored <strong>only on this device</strong>. Nothing is sent to any server.</p>
            <p>No analytics, no tracking, no ads. Ever.</p>
            <p>You gave consent during onboarding. You can withdraw it at any time by deleting your data below.</p>
          </div>
        </div>

        {/* Data deletion */}
        <div className="card" style={{ marginBottom: 16, border: confirming ? '2px solid #e57373' : '2px solid transparent' }}>
          <h3 style={{ fontWeight: 700, marginBottom: 6 }}>🗑️ Delete All My Data</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-soft)', marginBottom: 16, lineHeight: 1.6 }}>
            This permanently deletes your name, check-ins, glimmers, reflections, letter, trusted contact, and withdraws your consent. This cannot be undone.
          </p>
          {!confirming ? (
            <button
              onClick={() => setConfirming(true)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '12px 20px', borderRadius: 50,
                background: '#fdecea', color: '#c62828',
                fontWeight: 700, fontSize: '0.9rem',
              }}
            >
              <Trash2 size={16} /> Delete everything
            </button>
          ) : (
            <div>
              <p style={{ fontWeight: 700, color: '#c62828', marginBottom: 12, fontSize: '0.9rem' }}>
                Are you sure? This cannot be undone.
              </p>
              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  onClick={handleDelete}
                  style={{ padding: '12px 20px', borderRadius: 50, background: '#e57373', color: 'white', fontWeight: 700, fontSize: '0.9rem' }}
                >
                  Yes, delete everything
                </button>
                <button className="btn-ghost" onClick={() => setConfirming(false)}>Cancel</button>
              </div>
            </div>
          )}
        </div>

        <p style={{ fontSize: '0.75rem', color: 'var(--text-soft)', textAlign: 'center', lineHeight: 1.6 }}>
          Gentle Companion v1.0 · Built with care · Not a medical device
          {userName ? ` · Hi, ${userName}` : ''}
        </p>
      </div>
      <NavBar />
    </div>
  )
}
