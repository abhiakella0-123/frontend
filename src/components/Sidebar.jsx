import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Clock, 
  Award, 
  Dumbbell, 
  Calendar, 
  CreditCard, 
  Wrench,
  MapPinned
} from 'lucide-react';
import titanFitLogo from '../assets/titan-fit-logo.svg';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'members', label: 'Members', icon: Users },
  { id: 'attendance', label: 'Live Attendance', icon: Clock },
  { id: 'plans', label: 'Membership Plans', icon: Award },
  { id: 'trainers', label: 'Trainers & Staff', icon: Dumbbell },
  { id: 'classes', label: 'Class Schedule', icon: Calendar },
  { id: 'roomAvailability', label: 'Room Availability', icon: MapPinned },
  { id: 'payments', label: 'Billing & Invoices', icon: CreditCard },
  { id: 'equipment', label: 'Equipment Inventory', icon: Wrench },
];

export default function Sidebar({ currentTab, setCurrentTab, activeInsideCount = 0 }) {
  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0 min-h-screen">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-800/80 flex items-center space-x-3">
        <img
          src={titanFitLogo}
          alt="Titan Fit logo"
          className="w-12 h-12 rounded-xl border border-orange-400/20 object-cover shadow-lg shadow-orange-500/20"
        />
        <div>
          <h1 className="font-bold text-lg tracking-wider text-white flex items-center gap-1.5">
            TITAN <span className="text-orange-500">FIT</span>
          </h1>
          <p className="text-xs text-slate-400 font-medium">Gym Management Suite</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-orange-500/20 to-amber-500/10 text-orange-400 border border-orange-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-5 h-5 ${isActive ? 'text-orange-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.id === 'attendance' && activeInsideCount > 0 && (
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 animate-pulse">
                  {activeInsideCount} live
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-900/50">
        <div className="bg-slate-800/40 rounded-xl p-3 border border-slate-800">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-slate-400">System Engine</span>
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-400">
              Spring Boot 3
            </span>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Database</span>
            <span className="text-slate-300 font-mono">MySQL 8.0</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
