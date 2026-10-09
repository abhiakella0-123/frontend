import React from 'react';
import { UserPlus, UserCheck } from 'lucide-react';

export default function Header({ 
  _currentTab,
  title,
  onQuickCheckIn,
  onAddMember,
  _searchQuery,
  _setSearchQuery,
  activeInsideCount = 0,
  onLogout = () => {}
}) {
  return (
    <header className="h-18 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-8 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center space-x-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">{title}</h2>
          <p className="text-xs text-slate-400">Apex Fitness Club &bull; Admin Portal</p>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {/* Live Attendance Pill */}
        <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/60 text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-slate-300 font-medium">Currently in Gym:</span>
          <span className="font-bold text-emerald-400 font-mono">{activeInsideCount}</span>
        </div>

        {/* Quick Actions */}
        <button
          onClick={onQuickCheckIn}
          className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition shadow-sm active:scale-95"
        >
          <UserCheck className="w-4 h-4 text-emerald-400" />
          <span>Quick Check-In</span>
        </button>

        <button
          onClick={onLogout}
          className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition shadow-sm active:scale-95"
        >
          <span>Logout</span>
        </button>

        <button
          onClick={onAddMember}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-semibold shadow-md shadow-orange-500/25 transition active:scale-95"
        >
          <UserPlus className="w-4 h-4" />
          <span>New Member</span>
        </button>
      </div>
    </header>
  );
}
