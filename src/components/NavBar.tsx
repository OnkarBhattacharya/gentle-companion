import { useNavigate, useLocation } from 'react-router-dom'
import { Home, Sparkles, Flower2, BookHeart, Wind, Settings, BarChart2 } from 'lucide-react'

const NAV = [
  { path: '/home', icon: Home, label: 'Home' },
  { path: '/plan', icon: Sparkles, label: 'My Plan' },
  { path: '/toolkit', icon: Wind, label: 'Toolkit' },
  { path: '/glimmers', icon: Flower2, label: 'Glimmers' },
  { path: '/reflect', icon: BookHeart, label: 'Reflect' },
  { path: '/insights', icon: BarChart2, label: 'My Week' },
  { path: '/settings', icon: Settings, label: 'Settings' },
]

export function NavBar() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  return (
    <nav className="nav-bar">
      {NAV.map(({ path, icon: Icon, label }) => (
        <button
          key={path}
          className={`nav-item ${pathname === path ? 'active' : ''}`}
          onClick={() => navigate(path)}
          aria-label={label}
        >
          <Icon />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  )
}
