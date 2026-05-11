import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { TASKS } from '../data/content'
import { CrisisButton } from '../components/CrisisButton'
import { NavBar } from '../components/NavBar'
import { RefreshCw, Check } from 'lucide-react'

// Deterministic daily selection: same 3 tasks all day, changes at midnight
function getDailyTasks(): typeof TASKS {
  const seed = new Date().toISOString().split('T')[0]
  let hash = 0
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0
  return [...TASKS]
    .map((t, i) => ({ t, sort: (hash * (i + 1)) >>> 0 }))
    .sort((a, b) => a.sort - b.sort)
    .slice(0, 3)
    .map(x => x.t)
}

export default function Plan() {
  const { completeTask, todayTasksDone } = useApp()
  const [tasks, setTasks] = useState(() => getDailyTasks())
  const [swapped, setSwapped] = useState<Set<number>>(new Set())
  const [celebrating, setCelebrating] = useState<string | null>(null)

  const allDone = tasks.every(t => todayTasksDone.includes(t.id))

  const handleComplete = (id: string) => {
    completeTask(id)
    setCelebrating(id)
    setTimeout(() => setCelebrating(null), 2000)
  }

  const swapTask = (index: number) => {
    const usedIds = new Set(tasks.map(t => t.id))
    const pool = TASKS.filter(t => !usedIds.has(t.id))
    if (pool.length === 0) return
    const replacement = pool[Math.floor(Math.random() * pool.length)]
    setTasks(prev => prev.map((t, i) => i === index ? replacement : t))
    setSwapped(prev => new Set(prev).add(index))
  }

  return (
    <div style={{ position: 'relative' }}>
      <CrisisButton />
      <div className="page fade-in">
        <h1 className="section-title">Today's Micro-Plan ✨</h1>
        <p className="section-sub">
          {allDone
            ? 'You did it. Every single one. That\'s remarkable.'
            : 'Three tiny things. Do one, do all, or do none — you\'re still worthy.'}
        </p>

        {allDone ? (
          <div className="celebration">
            <span className="celebration-emoji">🌸</span>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: 8 }}>You showed up today.</h2>
            <p style={{ color: 'var(--text-mid)' }}>That's not small. That's everything.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {tasks.map((task, i) => {
              const done = todayTasksDone.includes(task.id)
              const isCelebrating = celebrating === task.id

              return (
                <div
                  key={task.id}
                  className="card fade-in"
                  style={{
                    opacity: done ? 0.6 : 1,
                    transition: 'opacity 0.3s ease',
                    border: done ? '2px solid var(--sage-light)' : '2px solid transparent',
                  }}
                >
                  {isCelebrating ? (
                    <div className="celebration" style={{ padding: '16px 0' }}>
                      <span className="celebration-emoji">🌟</span>
                      <p style={{ fontWeight: 700, color: 'var(--sage)' }}>Beautiful. You did it.</p>
                    </div>
                  ) : (
                    <>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                        <span style={{ fontSize: '2rem' }}>{task.emoji}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-soft)', background: 'var(--sage-pale)', padding: '3px 10px', borderRadius: 50 }}>
                          {task.duration}
                        </span>
                      </div>
                      <p style={{ fontWeight: 600, fontSize: '1rem', marginBottom: 16, lineHeight: 1.5 }}>{task.text}</p>
                      <div style={{ display: 'flex', gap: 10 }}>
                        {!done ? (
                          <>
                            <button
                              className="btn-primary"
                              style={{ flex: 1, padding: '12px' }}
                              onClick={() => handleComplete(task.id)}
                            >
                              <Check size={16} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />
                              Done
                            </button>
                            {!swapped.has(i) && (
                              <button
                                onClick={() => swapTask(i)}
                                style={{
                                  padding: '12px 16px', borderRadius: 50, background: 'var(--sage-pale)',
                                  color: 'var(--text-mid)', fontWeight: 600, fontSize: '0.85rem',
                                  display: 'flex', alignItems: 'center', gap: 6,
                                }}
                              >
                                <RefreshCw size={14} /> Not today
                              </button>
                            )}
                          </>
                        ) : (
                          <div style={{ color: 'var(--sage)', fontWeight: 700, fontSize: '0.9rem' }}>
                            ✓ Completed
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )
            })}
          </div>
        )}

        <div className="card" style={{ marginTop: 24, background: 'var(--lavender-pale)', padding: '16px 20px' }}>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-mid)', lineHeight: 1.7 }}>
            💜 <strong>Remember:</strong> These tasks aren't tests. They're tiny invitations.
            Skipping one doesn't mean you failed — it means today was hard, and that's valid.
          </p>
        </div>
      </div>
      <NavBar />
    </div>
  )
}
