import { NavLink } from 'react-router-dom'
import BrandMark from './BrandMark'
import { BellIcon, GearIcon, UserIcon } from './Icons'

const navItems = [
  { label: 'Home', to: '/app/home' },
  { label: 'Medications', to: '/app/medications' },
  { label: 'History', to: '/app/history' },
  { label: 'Caregivers', to: '/app/caregivers' },
]

export default function AppNavbar({ currentUser, notifications = [], onOpenNotifications, onOpenSettings, onOpenProfile }) {
  const unreadCount = notifications.filter((item) => !item.read).length

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:flex-nowrap lg:px-8">
        <div className="w-auto shrink-0 lg:w-[132px]">
          <BrandMark compact />
        </div>

        <nav aria-label="Primary navigation" className="flex flex-1 items-center justify-center gap-2 sm:gap-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `rounded-full px-4 py-2 text-sm font-semibold transition ${isActive ? 'bg-primary-soft text-primary-dark' : 'text-text-soft hover:text-primary'}`}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex w-auto shrink-0 items-center justify-end gap-2 lg:w-[132px]">
          <button type="button" className="relative flex h-10 w-10 items-center justify-center rounded-full border border-line text-text-soft hover:border-primary hover:text-primary" onClick={onOpenNotifications} aria-label="Open notifications">
            <BellIcon />
            {unreadCount > 0 && (
              <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </button>
          <button type="button" className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-text-soft hover:border-primary hover:text-primary" onClick={onOpenSettings}>
            <GearIcon />
          </button>
          <button type="button" className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-line bg-surface-soft text-text-soft hover:border-primary" onClick={onOpenProfile}>
            {currentUser.avatar ? <img src={currentUser.avatar} alt={currentUser.name} className="h-full w-full object-cover" /> : <UserIcon />}
          </button>
        </div>
      </div>
    </header>
  )
}
