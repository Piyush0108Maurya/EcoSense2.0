import { Outlet } from 'react-router-dom'
import { EcoSenseLogo } from '../components/EcoSenseLogo'
import { Sidebar } from '../components/Sidebar'

export function AppLayout() {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="app-main-wrap">
        <header className="app-brand-corner">
          <div className="app-brand-corner__mark" aria-label="EcoSense">
            <EcoSenseLogo className="app-brand-corner__logo" />
            <span className="app-brand-corner__name">EcoSense</span>
          </div>
        </header>
        <main className="app-main" id="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
