import React, { useState } from 'react';
import {
  Clock,
  UserCheck,
  CheckCircle2,
  Flame,
  LogOut,
} from 'lucide-react';

export default function AttendanceView({
  todayAttendance,
  _recentAttendance,
  members,
  onCheckIn,
  onCheckOut,
}) {
  const [selectedMemberId, setSelectedMemberId] = useState('');

  const activeCheckIns = todayAttendance.filter((a) => a.status === 'CHECKED_IN');
  const completedToday = todayAttendance.filter((a) => a.status === 'CHECKED_OUT');

  // Filter members eligible for check-in: active members not already checked in
  const activeInsideMemberIds = new Set(activeCheckIns.map((a) => a.member?.id));
  const eligibleMembers = members.filter(
    (m) => m.status === 'ACTIVE' && !activeInsideMemberIds.has(m.id)
  );

  const handleManualCheckIn = (e) => {
    e.preventDefault();
    if (selectedMemberId) {
      onCheckIn(Number(selectedMemberId));
      setSelectedMemberId('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Check-In Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Check-In Form */}
        <div className="lg:col-span-2 bg-slate-900/80 rounded-2xl border border-slate-800 p-6 shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Floor Check-In Terminal</h3>
              <p className="text-xs text-slate-400">Select an active member or search to log them into the gym</p>
            </div>
          </div>

          <form onSubmit={handleManualCheckIn} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <select
                  value={selectedMemberId}
                  onChange={(e) => setSelectedMemberId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-orange-500 transition font-medium"
                >
                  <option value="">-- Choose Member to Check In ({eligibleMembers.length} available) --</option>
                  {eligibleMembers.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.firstName} {m.lastName} &bull; {m.membershipPlan?.name || 'Standard'} &bull; {m.phone || m.email}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={!selectedMemberId}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold shadow-md shadow-orange-500/20 transition active:scale-95 flex items-center justify-center gap-2"
              >
                <UserCheck className="w-4 h-4" />
                <span>Check In Now</span>
              </button>
            </div>
          </form>
        </div>

        {/* Live Occupancy Metric */}
        <div className="bg-gradient-to-br from-emerald-500/15 via-slate-900 to-slate-900 rounded-2xl border border-emerald-500/30 p-6 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                Live Gym Occupancy
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            </div>
            <div className="flex items-baseline gap-3 mt-3">
              <span className="text-4xl font-extrabold text-white font-mono">{activeCheckIns.length}</span>
              <span className="text-xs text-slate-400">members on gym floor</span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>Completed workouts today:</span>
            <span className="font-bold text-white font-mono">{completedToday.length}</span>
          </div>
        </div>
      </div>

      {/* Currently In Gym Table */}
      <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-6 shadow-xl">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-400" />
              Members Currently Working Out ({activeCheckIns.length})
            </h3>
            <p className="text-xs text-slate-400">Real-time attendance roster with checkout actions</p>
          </div>
        </div>

        {activeCheckIns.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-xs">
            No active members inside the gym at this moment.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider">
                  <th className="pb-3 font-semibold">Member</th>
                  <th className="pb-3 font-semibold">Plan</th>
                  <th className="pb-3 font-semibold">Check-In Time</th>
                  <th className="pb-3 font-semibold">Time Elapsed</th>
                  <th className="pb-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {activeCheckIns.map((att) => {
                  const checkInDate = new Date(att.checkInTime);
                  const diffMinutes = Math.max(0, Math.floor((new Date() - checkInDate) / 60000));
                  const hours = Math.floor(diffMinutes / 60);
                  const mins = diffMinutes % 60;
                  const elapsedText = hours > 0 ? `${hours}h ${mins}m` : `${mins} mins`;

                  return (
                    <tr key={att.id} className="hover:bg-slate-800/40 transition">
                      <td className="py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={att.member?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                            alt=""
                            className="w-9 h-9 rounded-full object-cover border border-slate-700"
                          />
                          <div>
                            <p className="font-bold text-white">
                              {att.member?.firstName} {att.member?.lastName}
                            </p>
                            <p className="text-[11px] text-slate-400">{att.member?.phone || att.member?.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3">
                        <span className="px-2.5 py-1 rounded-full text-[11px] bg-slate-800 text-orange-400 border border-slate-700 font-medium">
                          {att.member?.membershipPlan?.name || 'Standard'}
                        </span>
                      </td>
                      <td className="py-3 text-slate-300 font-mono">
                        {checkInDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="py-3">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                          <Clock className="w-3 h-3" />
                          {elapsedText}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => onCheckOut(att.member.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold border border-rose-500/30 transition active:scale-95"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Check Out</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Today's Completed Sessions */}
      <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-6 shadow-xl">
        <h3 className="text-base font-bold text-white flex items-center gap-2 mb-4">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          Completed Sessions Today ({completedToday.length})
        </h3>

        {completedToday.length === 0 ? (
          <div className="py-8 text-center text-slate-500 text-xs">
            No completed workouts logged yet today.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {completedToday.map((att) => (
              <div key={att.id} className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img
                    src={att.member?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                    alt=""
                    className="w-8 h-8 rounded-full object-cover border border-slate-700"
                  />
                  <div>
                    <p className="font-semibold text-xs text-white">
                      {att.member?.firstName} {att.member?.lastName}
                    </p>
                    <p className="text-[10px] text-slate-400 font-mono">
                      Out at: {new Date(att.checkOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                  Done
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
