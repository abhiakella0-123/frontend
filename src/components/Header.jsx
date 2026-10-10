import React from 'react';
import { UserPlus, UserCheck, Sun, Moon } from 'lucide-react';

export default function Header({ 
  _currentTab,
  title,
  onQuickCheckIn,
  onAddMember,
  _searchQuery,
  _setSearchQuery,
  activeInsideCount = 0,
  onLogout = () => {},
  theme = 'dark',
  onToggleTheme = () => {},
}) {
  return (
    <header className="min-h-[4.5rem] bg-slate-950/95 backdrop-blur-md border-b border-orange-500/20 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 sticky top-0 z-30 shadow-[0_8px_30px_rgba(0,0,0,0.2)]">
      <div className="flex items-center justify-end gap-2 sm:gap-3 lg:gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">{title}</h2>
          <p className="text-xs text-slate-400">Apex Fitness Club &bull; Admin Portal</p>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {/* Live Attendance Pill */}
        <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-700/60 text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-slate-300 font-medium">Currently in Gym:</span>
          <span className="font-bold text-emerald-400 font-mono">{activeInsideCount}</span>
        </div>

        {/* Quick Actions */}
        <button
          type="button"
          onClick={onToggleTheme}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          className="flex items-center gap-2 rounded-xl border border-orange-500/30 bg-orange-500/10 px-3 py-2 text-xs font-semibold text-orange-300 transition hover:bg-orange-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
        >
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          <span className="hidden sm:inline">{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>
        </button>

        <button
          type="button"
          onClick={onQuickCheckIn}
          className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold border border-slate-700 transition shadow-sm active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
        >
          <UserCheck className="w-4 h-4 text-emerald-400" />
          <span>Quick Check-In</span>
        </button>

        <button
          type="button"
          onClick={onLogout}
          className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold border border-slate-700 transition shadow-sm active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
        >
          <span>Logout</span>
        </button>

        <button
          type="button"
          onClick={onAddMember}
          className="flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-semibold shadow-md shadow-orange-500/25 transition active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300"
        >
          <UserPlus className="w-4 h-4" />
          <span>New Member</span>
        </button>
      </div>
    </header>
  );
}
