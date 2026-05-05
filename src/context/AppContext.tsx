import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type MoodWeather = 'stormy' | 'cloudy' | 'foggy' | 'partly-sunny' | 'sunny'

export interface CheckIn {
  date: string
  energy: number
  mood: MoodWeather
  note?: string
}

export interface Glimmer {
  id: string
  date: string
  text: string
}

export interface ReflectSession {
  id: string
  date: string
  answers: string[]
}

export interface AppState {
  userName: string
  onboarded: boolean
  tourDone: boolean
  consentGiven: boolean
  theme: 'light' | 'dark'
  checkIns: CheckIn[]
  glimmers: Glimmer[]
  completedTasks: string[]
  reflectSessions: ReflectSession[]
  letterToSelf: string
  trustedContact: { name: string; phone: string } | null
  notificationsEnabled: boolean
  todayCheckIn: CheckIn | null
  todayTasksDone: string[]
  gardenCount: number
  setUserName: (n: string) => void
  setOnboarded: (v: boolean) => void
  setTourDone: (v: boolean) => void
  giveConsent: () => void
  toggleTheme: () => void
  addCheckIn: (c: CheckIn) => void
  addGlimmer: (text: string) => void
  completeTask: (id: string) => void
  saveReflectSession: (answers: string[]) => void
  saveLetterToSelf: (text: string) => void
  setTrustedContact: (c: { name: string; phone: string } | null) => void
  setNotificationsEnabled: (v: boolean) => void
  deleteAllData: () => void
}

const Ctx = createContext<AppState | null>(null)

const today = () => new Date().toISOString().split('T')[0]

const readIfConsented = <T,>(key: string, fallback: T): T => {
  if (localStorage.getItem('gc_consent') !== 'true') return fallback
  try { return JSON.parse(localStorage.getItem(key) || 'null') ?? fallback } catch { return fallback }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [consentGiven, setConsentGiven] = useState(() => localStorage.getItem('gc_consent') === 'true')
  const [userName, setUserName] = useState(() => readIfConsented('gc_name', ''))
  const [onboarded, setOnboarded] = useState(() => readIfConsented('gc_onboarded', false))
  const [tourDone, setTourDone] = useState(() => readIfConsented('gc_tour_done', false))
  const [theme, setTheme] = useState<'light' | 'dark'>(() => readIfConsented<'light' | 'dark'>('gc_theme', 'light'))
  const [checkIns, setCheckIns] = useState<CheckIn[]>(() => readIfConsented('gc_checkins', []))
  const [glimmers, setGlimmers] = useState<Glimmer[]>(() => readIfConsented('gc_glimmers', []))
  const [completedTasks, setCompletedTasks] = useState<string[]>(() => readIfConsented('gc_tasks', []))
  const [reflectSessions, setReflectSessions] = useState<ReflectSession[]>(() => readIfConsented('gc_reflect', []))
  const [letterToSelf, setLetterToSelf] = useState(() => readIfConsented('gc_letter', ''))
  const [trustedContact, setTrustedContact] = useState<{ name: string; phone: string } | null>(() => readIfConsented('gc_trusted', null))
  const [notificationsEnabled, setNotificationsEnabled] = useState(() => readIfConsented('gc_notifs', false))

  useEffect(() => { document.documentElement.setAttribute('data-theme', theme) }, [theme])

  useEffect(() => { if (consentGiven) localStorage.setItem('gc_name', userName) }, [userName, consentGiven])
  useEffect(() => { if (consentGiven) localStorage.setItem('gc_onboarded', String(onboarded)) }, [onboarded, consentGiven])
  useEffect(() => { if (consentGiven) localStorage.setItem('gc_tour_done', String(tourDone)) }, [tourDone, consentGiven])
  useEffect(() => { if (consentGiven) localStorage.setItem('gc_theme', theme) }, [theme, consentGiven])
  useEffect(() => { if (consentGiven) localStorage.setItem('gc_checkins', JSON.stringify(checkIns)) }, [checkIns, consentGiven])
  useEffect(() => { if (consentGiven) localStorage.setItem('gc_glimmers', JSON.stringify(glimmers)) }, [glimmers, consentGiven])
  useEffect(() => { if (consentGiven) localStorage.setItem('gc_tasks', JSON.stringify(completedTasks)) }, [completedTasks, consentGiven])
  useEffect(() => { if (consentGiven) localStorage.setItem('gc_reflect', JSON.stringify(reflectSessions)) }, [reflectSessions, consentGiven])
  useEffect(() => { if (consentGiven) localStorage.setItem('gc_letter', letterToSelf) }, [letterToSelf, consentGiven])
  useEffect(() => { if (consentGiven) localStorage.setItem('gc_trusted', JSON.stringify(trustedContact)) }, [trustedContact, consentGiven])
  useEffect(() => { if (consentGiven) localStorage.setItem('gc_notifs', String(notificationsEnabled)) }, [notificationsEnabled, consentGiven])

  const giveConsent = () => {
    localStorage.setItem('gc_consent', 'true')
    setConsentGiven(true)
  }

  const deleteAllData = () => {
    const keys = ['gc_consent', 'gc_name', 'gc_onboarded', 'gc_tour_done', 'gc_theme',
      'gc_checkins', 'gc_glimmers', 'gc_tasks', 'gc_reflect', 'gc_letter', 'gc_trusted', 'gc_notifs']
    keys.forEach(k => localStorage.removeItem(k))
    setConsentGiven(false); setUserName(''); setOnboarded(false); setTourDone(false)
    setTheme('light'); setCheckIns([]); setGlimmers([]); setCompletedTasks([])
    setReflectSessions([]); setLetterToSelf(''); setTrustedContact(null); setNotificationsEnabled(false)
  }

  const todayCheckIn = checkIns.find(c => c.date === today()) || null

  const addCheckIn = (c: CheckIn) =>
    setCheckIns(prev => [...prev.filter(x => x.date !== c.date), c])

  const addGlimmer = (text: string) =>
    setGlimmers(prev => [...prev, { id: Date.now().toString(), date: today(), text }])

  const completeTask = (id: string) => {
    const key = `${today()}::${id}`
    setCompletedTasks(prev => prev.includes(key) ? prev : [...prev, key])
  }

  const todayTasksDone = completedTasks
    .filter(k => k.startsWith(today() + '::'))
    .map(k => k.slice(today().length + 2))

  const saveReflectSession = (answers: string[]) =>
    setReflectSessions(prev => [...prev, { id: Date.now().toString(), date: today(), answers }])

  const saveLetterToSelf = (text: string) => setLetterToSelf(text)

  // Garden count: one element per week of engagement (unique ISO weeks with any check-in)
  const gardenCount = (() => {
    const weeks = new Set(checkIns.map(c => {
      const d = new Date(c.date)
      const jan1 = new Date(d.getFullYear(), 0, 1)
      return `${d.getFullYear()}-W${Math.ceil(((d.getTime() - jan1.getTime()) / 86400000 + jan1.getDay() + 1) / 7)}`
    }))
    return weeks.size
  })()

  return (
    <Ctx.Provider value={{
      userName, onboarded, tourDone, consentGiven, theme, checkIns, glimmers,
      completedTasks, reflectSessions, letterToSelf, trustedContact, notificationsEnabled,
      todayCheckIn, todayTasksDone, gardenCount,
      setUserName, setOnboarded, setTourDone, giveConsent,
      toggleTheme: () => setTheme(t => t === 'light' ? 'dark' : 'light'),
      addCheckIn, addGlimmer, completeTask, saveReflectSession,
      saveLetterToSelf, setTrustedContact, setNotificationsEnabled, deleteAllData,
    }}>
      {children}
    </Ctx.Provider>
  )
}

export const useApp = () => {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useApp must be inside AppProvider')
  return ctx
}
