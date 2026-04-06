import { useState } from 'react'
import { NavLink } from 'react-router-dom'

const NAV_ITEMS = [
  {
    to: '/air-quality',
    label: 'Air Quality',
    icon: IconAir,
  },
  {
    to: '/eco-sort',
    label: 'Eco Sort',
    icon: IconEcoSort,
  },
  {
    to: '/neighbourhood-waste-map',
    label: 'Neighbourhood waste map',
    icon: IconMap,
  },
] as const

function IconBurger({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 20 20" aria-hidden>
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        d="M4 5.5h12M4 10h12M4 14.5h12"
      />
    </svg>
  )
}

function IconLogout({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 20 20" aria-hidden>
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8 5H5.5A1.5 1.5 0 004 6.5v7A1.5 1.5 0 005.5 15H8M13 11l3-3-3-3M8 8h8"
      />
    </svg>
  )
}

function IconAir({ className }: { className?: string }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 20 20" aria-hidden>
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        d="M3 8h11a2 2 0 012 2v0a2 2 0 01-2 2H6M3 12h9a2 2 0 012 2v0a2 2 0 01-2 2H5M17 4H8a2 2 0 00-2 2v0a2 2 0 002 2h5"
      />
    </svg>
  )
}

function IconEcoSort({ className }: { className?: string }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 20 20" aria-hidden>
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 4v12M6 8l3-3M6 8l-3-3M14 16V4M14 12l3 3M14 12l-3 3"
      />
    </svg>
  )
}

function IconMap({ className }: { className?: string }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 20 20" aria-hidden>
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
        d="M8 3L3 6v11l5-3 5 3 5-3V3l-5 3-5-3z"
      />
    </svg>
  )
}

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={['sidebar', collapsed ? 'sidebar--collapsed' : ''].join(' ')}
      aria-label="EcoSense navigation"
    >
      <div className="sidebar__topbar">
        <button
          type="button"
          className="sidebar__icon-btn"
          aria-expanded={!collapsed}
          aria-controls="sidebar-nav"
          aria-label={collapsed ? 'Expand menu' : 'Collapse menu'}
          onClick={() => setCollapsed((c) => !c)}
        >
          <IconBurger />
        </button>
      </div>

      <div className="sidebar__header">
        <span className="sidebar__eyebrow">Mission</span>
        <p className="sidebar__brand">EcoSense</p>
      </div>

      <nav className="sidebar__scroll" id="sidebar-nav" aria-label="Sections">
        <p className="sidebar__section-label">Navigation</p>
        <ul className="sidebar__list">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  ['sidebar__link', isActive ? 'sidebar__link--active' : ''].join(' ')
                }
                title={collapsed ? label : undefined}
              >
                <span className="sidebar__link-icon" aria-hidden>
                  <Icon />
                </span>
                <span className="sidebar__link-text">{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar__footer">
        <button
          type="button"
          className="sidebar__logout"
          onClick={() => {}}
          aria-disabled="true"
          title="Logout (coming soon)"
        >
          <IconLogout />
          <span className="sidebar__logout-text">Logout</span>
        </button>
      </div>
    </aside>
  )
}
