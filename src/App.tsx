import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider, useApp } from './context/AppContext'
import Onboarding from './pages/Onboarding'
import Tour from './pages/Tour'
import Home from './pages/Home'
import Plan from './pages/Plan'
import Toolkit from './pages/Toolkit'
import Glimmers from './pages/Glimmers'
import Reflect from './pages/Reflect'
import Insights from './pages/Insights'
import Letter from './pages/Letter'
import Settings from './pages/Settings'
import Guide from './pages/Guide'

function AppRoutes() {
  const { onboarded, tourDone } = useApp()
  const guard = (el: JSX.Element) => onboarded ? el : <Navigate to="/welcome" replace />

  return (
    <Routes>
      <Route path="/" element={<Navigate to={onboarded ? (tourDone ? '/home' : '/tour') : '/welcome'} replace />} />
      <Route path="/welcome" element={onboarded ? <Navigate to={tourDone ? '/home' : '/tour'} replace /> : <Onboarding />} />
      <Route path="/tour" element={onboarded ? <Tour /> : <Navigate to="/welcome" replace />} />
      <Route path="/home" element={guard(<Home />)} />
      <Route path="/plan" element={guard(<Plan />)} />
      <Route path="/toolkit" element={guard(<Toolkit />)} />
      <Route path="/glimmers" element={guard(<Glimmers />)} />
      <Route path="/reflect" element={guard(<Reflect />)} />
      <Route path="/insights" element={guard(<Insights />)} />
      <Route path="/letter" element={guard(<Letter />)} />
      <Route path="/settings" element={guard(<Settings />)} />
      <Route path="/guide" element={guard(<Guide />)} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  )
}
