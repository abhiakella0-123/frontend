import React, { useState } from 'react';
import { X, RefreshCw } from 'lucide-react';

const formatInr = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

export default function RenewModal({ isOpen, onClose, member, plans, onRenew }) {
  const [selectedPlanId, setSelectedPlanId] = useState('');

  if (!isOpen || !member) return null;

  const currentPlan = member.membershipPlan;
  const initialPlanId = selectedPlanId || (currentPlan ? currentPlan.id : (plans[0]?.id || ''));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (initialPlanId) {
      onRenew(member.id, initialPlanId);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-orange-400" />
            <h3 className="text-base font-bold text-white">Renew Membership</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center gap-3">
            <img
              src={member.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
              alt=""
              className="w-10 h-10 rounded-full object-cover border border-slate-700"
            />
            <div>
              <p className="font-bold text-sm text-white">
                {member.firstName} {member.lastName}
              </p>
              <p className="text-xs text-slate-400">
                Current status: <span className="font-semibold text-orange-400">{member.status}</span>
              </p>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Select Membership Tier to Extend / Renew
            </label>
            <div className="space-y-2">
              {plans.map((p) => {
                const isSelected = String(initialPlanId) === String(p.id);
                return (
                  <label
                    key={p.id}
                    onClick={() => setSelectedPlanId(p.id)}
                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                      isSelected
                        ? 'bg-orange-500/10 border-orange-500/50 text-white'
                        : 'bg-slate-800/40 border-slate-800 text-slate-300 hover:bg-slate-800/80'
                    }`}
                  >
                    <div>
                      <p className="font-bold text-xs">{p.name}</p>
                      <p className="text-[11px] text-slate-400">Valid for {p.durationMonths} Months</p>
                    </div>
                    <span className="font-mono font-bold text-orange-400 text-sm">
                      {formatInr(p.price)}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-xs font-bold text-white shadow-md shadow-orange-500/25 transition active:scale-95"
            >
              Confirm Renewal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
