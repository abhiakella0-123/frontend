import React, { useState } from 'react';
import {
  Users,
  Search,
  UserPlus,
  Mail,
  Edit2,
  Trash2,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  UserCheck,
} from 'lucide-react';

export default function MembersView({
  members,
  _plans,
  onAddMember,
  onEditMember,
  onDeleteMember,
  onRenewMember,
  onCheckIn,
  activeInsideIds = [],
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const formatIndianPhone = (phone) => {
    if (!phone) return 'N/A';
    const digits = String(phone).replace(/\D/g, '');
    if (digits.length === 10) {
      return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
    }
    if (digits.length === 12 && digits.startsWith('91')) {
      return `+91 ${digits.slice(2, 7)} ${digits.slice(7)}`;
    }
    return phone;
  };

  const filteredMembers = members.filter((m) => {
    const matchesSearch = 
      `${m.firstName} ${m.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.email && m.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (m.phone && m.phone.includes(searchTerm));
    
    if (!matchesSearch) return false;
    if (statusFilter === 'ALL') return true;
    return m.status === statusFilter;
  });

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-3 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, email, or phone number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-orange-500 transition"
            />
          </div>

          <div className="flex items-center gap-1.5 bg-slate-800/80 p-1 rounded-xl border border-slate-700">
            {['ALL', 'ACTIVE', 'EXPIRED'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  statusFilter === status
                    ? 'bg-orange-500 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {status === 'ALL' ? 'All Members' : status}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={onAddMember}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition shadow-md shadow-orange-500/20 active:scale-95"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add New Member</span>
        </button>
      </div>

      {/* Members Grid / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredMembers.map((member) => {
          const isActive = member.status === 'ACTIVE';
          const isCurrentlyIn = activeInsideIds.includes(member.id);

          return (
            <div
              key={member.id}
              className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5 flex flex-col justify-between hover:border-slate-700 transition shadow-lg relative group overflow-hidden"
            >
              {/* Status Ribbon Indicator */}
              <div
                className={`absolute top-0 right-0 left-0 h-1 ${
                  isActive ? 'bg-emerald-500' : 'bg-rose-500'
                }`}
              />

              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={member.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120'}
                      alt=""
                      className="w-12 h-12 rounded-2xl object-cover border border-slate-700 shadow-sm"
                    />
                    <div>
                      <h4 className="font-bold text-sm text-white group-hover:text-orange-400 transition">
                        {member.firstName} {member.lastName}
                      </h4>
                      <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                        <Mail className="w-3 h-3 text-slate-500" />
                        {member.email}
                      </p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                      isActive
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                    }`}
                  >
                    {isActive ? (
                      <CheckCircle className="w-3 h-3" />
                    ) : (
                      <AlertCircle className="w-3 h-3" />
                    )}
                    {member.status}
                  </span>
                </div>

                {/* Details list */}
                <div className="space-y-2 text-xs text-slate-300 bg-slate-950/40 p-3 rounded-xl border border-slate-800/80">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Plan:</span>
                    <span className="font-semibold text-orange-400">
                      {member.membershipPlan?.name || 'No Plan'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Phone:</span>
                    <span className="font-mono text-slate-300">{formatIndianPhone(member.phone)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Valid Until:</span>
                    <span className="font-mono text-slate-300">
                      {member.membershipEndDate || 'Lifetime'}
                    </span>
                  </div>
                  {member.emergencyContact && (
                    <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-800">
                      <span className="text-slate-500">Emergency:</span>
                      <span className="text-slate-400 truncate max-w-[160px]">
                        {member.emergencyContact}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions Footer */}
              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  {/* Quick Check-In Button */}
                  {isActive && !isCurrentlyIn && (
                    <button
                      onClick={() => onCheckIn(member.id)}
                      title="Quick Check-In"
                      className="p-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 transition active:scale-95"
                    >
                      <UserCheck className="w-4 h-4" />
                    </button>
                  )}
                  {isCurrentlyIn && (
                    <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-semibold px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      In Gym
                    </span>
                  )}
                  {/* Renew Button */}
                  <button
                    onClick={() => onRenewMember(member)}
                    title="Renew Membership Plan"
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition active:scale-95"
                  >
                    <RefreshCw className="w-4 h-4 text-orange-400" />
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onEditMember(member)}
                    title="Edit Member"
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition active:scale-95"
                  >
                    <Edit2 className="w-4 h-4 text-cyan-400" />
                  </button>
                  <button
                    onClick={() => onDeleteMember(member.id)}
                    title="Delete Member"
                    className="p-2 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition active:scale-95"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredMembers.length === 0 && (
        <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-12 text-center">
          <Users className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h4 className="text-base font-bold text-white">No members found</h4>
          <p className="text-xs text-slate-400 mt-1">Try adjusting your search criteria or register a new member.</p>
        </div>
      )}
    </div>
  );
}
