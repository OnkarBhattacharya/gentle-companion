import { useState, useMemo } from 'react'
import { useApp } from '../context/AppContext'
import { Heart, Phone, X, MessageCircle, ExternalLink } from 'lucide-react'
import { CRISIS_LINES, CrisisLine } from '../data/content'

// Derive country code from the browser's timezone — no network request,
// no geolocation permission, works fully offline.
// Intl.supportedValuesOf is available in all modern browsers; we fall back
// gracefully if it isn't.
function detectCountryCode(): string {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
    // Timezone → country mapping for the most common zones.
    // Format: 'Continent/City' prefix match → ISO 3166-1 alpha-2
    const TZ_MAP: [string, string][] = [
      ['America/New_York', 'US'], ['America/Chicago', 'US'], ['America/Denver', 'US'],
      ['America/Los_Angeles', 'US'], ['America/Phoenix', 'US'], ['America/Anchorage', 'US'],
      ['Pacific/Honolulu', 'US'],
      ['America/Toronto', 'CA'], ['America/Vancouver', 'CA'], ['America/Winnipeg', 'CA'],
      ['America/Halifax', 'CA'], ['America/St_Johns', 'CA'],
      ['Europe/London', 'GB'],
      ['Europe/Dublin', 'IE'],
      ['Asia/Kolkata', 'IN'], ['Asia/Calcutta', 'IN'],
      ['Australia/Sydney', 'AU'], ['Australia/Melbourne', 'AU'], ['Australia/Brisbane', 'AU'],
      ['Australia/Perth', 'AU'], ['Australia/Adelaide', 'AU'],
      ['Pacific/Auckland', 'NZ'],
      ['Europe/Berlin', 'DE'], ['Europe/Vienna', 'DE'],
      ['Europe/Paris', 'FR'],
      ['Europe/Amsterdam', 'NL'],
      ['Africa/Johannesburg', 'ZA'],
      ['Asia/Singapore', 'SG'],
      ['Asia/Tokyo', 'JP'],
      ['America/Sao_Paulo', 'BR'], ['America/Manaus', 'BR'], ['America/Fortaleza', 'BR'],
      ['Asia/Karachi', 'PK'],
      ['Africa/Lagos', 'NG'],
      ['Africa/Nairobi', 'KE'],
    ]
    const match = TZ_MAP.find(([zone]) => tz === zone || tz.startsWith(zone))
    return match ? match[1] : 'default'
  } catch {
    return 'default'
  }
}

const COUNTRY_NAMES: Record<string, string> = {
  US: '🇺🇸 United States', GB: '🇬🇧 United Kingdom', IE: '🇮🇪 Ireland',
  IN: '🇮🇳 India', AU: '🇦🇺 Australia', CA: '🇨🇦 Canada',
  NZ: '🇳🇿 New Zealand', DE: '🇩🇪 Germany', FR: '🇫🇷 France',
  NL: '🇳🇱 Netherlands', ZA: '🇿🇦 South Africa', SG: '🇸🇬 Singapore',
  JP: '🇯🇵 Japan', BR: '🇧🇷 Brazil', PK: '🇵🇰 Pakistan',
  NG: '🇳🇬 Nigeria', KE: '🇰🇪 Kenya',
}

function CrisisLineCard({ line }: { line: CrisisLine }) {
  return (
    <div className="card" style={{ padding: '16px 20px', background: 'var(--sky-pale)' }}>
      <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 6 }}>{line.name}</div>
      {line.number && (
        <a
          href={`tel:${line.number}`}
          style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--sage)', fontWeight: 600, textDecoration: 'none', marginBottom: line.sms ? 4 : 0 }}
        >
          <Phone size={16} /> Call {line.number}
        </a>
      )}
      {line.sms && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-mid)', fontSize: '0.85rem' }}>
          <MessageCircle size={14} /> {line.sms}
        </div>
      )}
      {line.url && (
        <a
          href={line.url} target="_blank" rel="noreferrer"
          style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--sage)', fontSize: '0.85rem', textDecoration: 'none' }}
        >
          <ExternalLink size={13} /> Find your local crisis centre
        </a>
      )}
    </div>
  )
}

export function CrisisButton() {
  const { trustedContact, userName } = useApp()
  const [open, setOpen] = useState(false)
  const [showAll, setShowAll] = useState(false)

  const countryCode = useMemo(detectCountryCode, [])
  const regionLines = CRISIS_LINES[countryCode] ?? CRISIS_LINES['default']
  const regionName = COUNTRY_NAMES[countryCode]
  const hasRegion = countryCode !== 'default'

  const reachOutMessage = encodeURIComponent(
    `Hi ${trustedContact?.name || 'there'}, I'm having a really hard time right now and wanted to reach out. — ${userName || 'me'}`
  )

  return (
    <>
      <button className="crisis-btn" onClick={() => setOpen(true)} aria-label="I need help">
        <Heart size={14} fill="white" /> I need help
      </button>

      {open && (
        <div className="modal-overlay" onClick={() => setOpen(false)}>
          <div className="modal-sheet" onClick={e => e.stopPropagation()}>
            <button className="btn-ghost" style={{ float: 'right', padding: '4px 8px' }} aria-label="Close help panel" onClick={() => setOpen(false)}>
              <X size={20} />
            </button>

            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: '2rem', marginBottom: 8 }}>💙</div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 8 }}>You reached out. That matters.</h2>
              <p style={{ color: 'var(--text-mid)', fontSize: '0.95rem', lineHeight: 1.7 }}>
                You don't have to face this alone. Real humans are available right now,
                and they want to hear from you. There is no wrong reason to call.
              </p>
            </div>

            {/* Trusted contact */}
            {trustedContact && (
              <div className="card" style={{ marginBottom: 16, background: 'var(--lavender-pale)', padding: '16px 20px' }}>
                <div style={{ fontWeight: 700, marginBottom: 6 }}>💜 Reach out to {trustedContact.name}</div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-soft)', marginBottom: 12, lineHeight: 1.5 }}>
                  A pre-written message is ready. You can send it as-is or edit it first.
                </p>
                <a
                  href={`sms:${trustedContact.phone}?body=${reachOutMessage}`}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    padding: '10px 18px', borderRadius: 50,
                    background: 'var(--lavender)', color: 'white',
                    fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none',
                  }}
                >
                  <MessageCircle size={16} /> Text {trustedContact.name}
                </a>
              </div>
            )}

            {/* Region-specific lines */}
            <div style={{ marginBottom: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-soft)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {hasRegion ? `Helplines — ${regionName}` : 'International helplines'}
              </span>
              {hasRegion && (
                <button
                  className="btn-ghost"
                  style={{ fontSize: '0.75rem', padding: '4px 8px' }}
                  onClick={() => setShowAll(s => !s)}
                >
                  {showAll ? 'Show fewer' : 'Other countries'}
                </button>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
              {regionLines.map((line, i) => <CrisisLineCard key={i} line={line} />)}
            </div>

            {/* Other countries — shown on demand */}
            {showAll && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-soft)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>
                  Other countries
                </div>
                {Object.entries(CRISIS_LINES)
                  .filter(([code]) => code !== countryCode && code !== 'default')
                  .map(([code, lines]) => (
                    <div key={code}>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-mid)', marginBottom: 6 }}>
                        {COUNTRY_NAMES[code] ?? code}
                      </div>
                      {lines.map((line, i) => <CrisisLineCard key={i} line={line} />)}
                    </div>
                  ))}
                {CRISIS_LINES['default'].map((line, i) => <CrisisLineCard key={i} line={line} />)}
              </div>
            )}

            <p style={{ marginTop: 8, fontSize: '0.8rem', color: 'var(--text-soft)', textAlign: 'center' }}>
              This app is a support tool, not a substitute for professional care.
            </p>
          </div>
        </div>
      )}
    </>
  )
}
