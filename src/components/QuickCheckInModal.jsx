import React, { useState } from 'react';
import { X, UserCheck, Search } from 'lucide-react';

export default function QuickCheckInModal({ isOpen, onClose, members, onCheckIn, activeInsideIds }) {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const eligibleMembers = members.filter(
    (m) => m.status === 'ACTIVE' && !activeInsideIds.includes(m.id)
  );

  const filtered = eligibleMembers.filter(
    (m) =>
      `${m.firstName} ${m.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.email && m.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (m.phone && m.phone.includes(searchTerm))
  );

  const handleSelect = (memberId) => {
    onCheckIn(memberId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white">Instant Gym Check-In</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              autoFocus
              placeholder="Search member name or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-orange-500 transition"
            />
          </div>

          <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
            {filtered.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500">
                {eligibleMembers.length === 0
                  ? 'All active members are already checked in!'
                  : 'No matching members found.'}
              </div>
            ) : (
              filtered.map((m) => (
                <div
                  key={m.id}
                  onClick={() => handleSelect(m.id)}
                  className="p-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-emerald-500/50 cursor-pointer flex items-center justify-between transition group"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={m.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                      alt=""
                      className="w-8 h-8 rounded-full object-cover border border-slate-700"
                    />
                    <div>
                      <p className="font-bold text-xs text-white group-hover:text-emerald-400 transition">
                        {m.firstName} {m.lastName}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {m.membershipPlan?.name || 'Standard'} &bull; {m.phone}
                      </p>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 group-hover:bg-emerald-500 group-hover:text-white text-emerald-400 text-[10px] font-bold transition">
                    Check In &rarr;
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
