import React from 'react';
import {
  Users,
  Clock,
  DollarSign,
  Dumbbell,
  UserCheck,
  CheckCircle2,
  ArrowUpRight,
  Calendar,
  Sparkles,
} from 'lucide-react';
import StatCard from '../components/StatCard';
import titanFitLogo from '../assets/titan-fit-logo.svg';

export default function DashboardView({
  stats,
  todayAttendance,
  _members,
  classes,
  onCheckOut,
  onQuickCheckIn,
  onNavigateTab,
}) {
  return (
    <div className="space-y-6">
      {/* Top Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-orange-600 via-amber-600 to-rose-600 p-7 text-white shadow-2xl shadow-orange-500/10">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-14 h-14 rounded-2xl border border-white/20 bg-white/10 p-1.5 backdrop-blur-md shadow-lg shadow-orange-900/20">
                <img src={titanFitLogo} alt="Titan Fit logo" className="w-full h-full rounded-xl object-cover" />
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold text-orange-100 border border-white/20">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                Live Gym Management Dashboard
              </div>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight">
              Welcome back, General Manager!
            </h1>
            <p className="text-orange-100 text-sm mt-1 max-w-xl">
              Gym occupancy is running smoothly today. Check members in and out, track plan renewals, manage trainer schedules, and view real-time revenue.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onQuickCheckIn}
              className="px-5 py-2.5 rounded-xl bg-white text-orange-600 font-bold text-xs uppercase tracking-wider shadow-lg hover:bg-orange-50 transition active:scale-95 flex items-center gap-2"
            >
              <UserCheck className="w-4 h-4" />
              Check-In Member
            </button>
            <button
              onClick={() => onNavigateTab('members')}
              className="px-5 py-2.5 rounded-xl bg-black/25 hover:bg-black/35 text-white font-bold text-xs uppercase tracking-wider border border-white/20 transition active:scale-95"
            >
              View Members
            </button>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Members"
          value={stats.activeMembers || 0}
          subtitle={`Total enrolled: ${stats.totalMembers || 0}`}
          trend="+12%"
          icon={Users}
          color="orange"
        />
        <StatCard
          title="Live in Gym Now"
          value={stats.activeInGym || 0}
          subtitle={`Total check-ins today: ${stats.todayCheckIns || 0}`}
          trend="Real-time"
          icon={Clock}
          color="emerald"
        />
        <StatCard
          title="Monthly Revenue"
          value={`$${(stats.monthlyRevenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          subtitle={`All-time: $${(stats.totalRevenue || 0).toLocaleString()}`}
          trend="+18.4%"
          icon={DollarSign}
          color="cyan"
        />
        <StatCard
          title="Equipment Status"
          value={`${stats.totalEquipment || 0} Units`}
          subtitle={stats.equipmentMaintenanceNeeded > 0 ? `${stats.equipmentMaintenanceNeeded} need attention` : 'All 100% operational'}
          icon={Dumbbell}
          color={stats.equipmentMaintenanceNeeded > 0 ? 'rose' : 'purple'}
        />
      </div>

      {/* Main Content Grid: Live Attendance & Class Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Attendance Activity */}
        <div className="lg:col-span-2 bg-slate-900/80 rounded-2xl border border-slate-800 p-6 flex flex-col shadow-lg">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Floor Attendance
              </h3>
              <p className="text-xs text-slate-400">Members currently checked in or completed workouts today</p>
            </div>
            <button
              onClick={() => onNavigateTab('attendance')}
              className="text-xs font-semibold text-orange-400 hover:text-orange-300 flex items-center gap-1"
            >
              Full Log <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex-1 overflow-x-auto">
            {todayAttendance.length === 0 ? (
              <div className="py-12 text-center text-slate-500 text-sm">
                No check-ins recorded yet today. Click "Check-In Member" to log someone in!
              </div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider">
                    <th className="pb-3 font-semibold">Member</th>
                    <th className="pb-3 font-semibold">Plan</th>
                    <th className="pb-3 font-semibold">Check-In</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {todayAttendance.slice(0, 6).map((att) => {
                    const isInside = att.status === 'CHECKED_IN';
                    return (
                      <tr key={att.id} className="hover:bg-slate-800/40 transition">
                        <td className="py-3">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={att.member?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                              alt=""
                              className="w-8 h-8 rounded-full object-cover border border-slate-700"
                            />
                            <div>
                              <p className="font-semibold text-white">
                                {att.member?.firstName} {att.member?.lastName}
                              </p>
                              <p className="text-[11px] text-slate-400">{att.member?.phone}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3">
                          <span className="px-2 py-0.5 rounded-full text-[11px] bg-slate-800 text-slate-300 border border-slate-700">
                            {att.member?.membershipPlan?.name || 'Standard'}
                          </span>
                        </td>
                        <td className="py-3 text-slate-300 font-mono">
                          {new Date(att.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="py-3">
                          {isInside ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                              Working Out
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-800 text-slate-400">
                              <CheckCircle2 className="w-3 h-3 text-slate-500" />
                              Completed
                            </span>
                          )}
                        </td>
                        <td className="py-3 text-right">
                          {isInside && (
                            <button
                              onClick={() => onCheckOut(att.member.id)}
                              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-300 hover:text-rose-300 text-[11px] font-semibold border border-slate-700 hover:border-rose-500/40 transition active:scale-95"
                            >
                              Check Out
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Classes Scheduled Today */}
        <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-6 flex flex-col shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-orange-400" />
                Featured Classes
              </h3>
              <p className="text-xs text-slate-400">Current schedule & bookings</p>
            </div>
            <button
              onClick={() => onNavigateTab('classes')}
              className="text-xs font-semibold text-orange-400 hover:text-orange-300 flex items-center gap-1"
            >
              All Classes <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3 flex-1">
            {classes.slice(0, 4).map((cls) => {
              const percent = Math.min(100, Math.round(((cls.enrolledCount || 0) / (cls.capacity || 1)) * 100));
              return (
                <div key={cls.id} className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-800 hover:border-slate-700 transition">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-sm text-white">{cls.className}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Coach: <span className="text-slate-300 font-medium">{cls.trainer?.firstName} {cls.trainer?.lastName}</span> &bull; {cls.room}
                      </p>
                    </div>
                    <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-slate-900 text-orange-400 border border-slate-800">
                      {cls.scheduleTime}
                    </span>
                  </div>

                  {/* Capacity Bar */}
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="text-slate-400">Capacity</span>
                      <span className="font-mono text-slate-300">
                        {cls.enrolledCount} / {cls.capacity} booked ({percent}%)
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-950 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          percent >= 90 ? 'bg-rose-500' : percent >= 60 ? 'bg-amber-500' : 'bg-orange-500'
                        }`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
