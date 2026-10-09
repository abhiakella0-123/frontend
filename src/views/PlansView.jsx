import React from 'react';
import { Award, Check, Plus, Edit2, Trash2, Sparkles } from 'lucide-react';

export default function PlansView({ plans, onAddPlan, onEditPlan, onDeletePlan }) {
  const formatInr = (value) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(Number(value || 0));

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-orange-400" />
            Gym Membership Tiers & Pricing
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage membership packages, durations, pricing plans, and member benefits
          </p>
        </div>

        <button
          onClick={onAddPlan}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition shadow-md shadow-orange-500/20 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Plan</span>
        </button>
      </div>

      {/* Plan Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {plans.map((plan, idx) => {
          const isPopular = idx === 1 || plan.name.toLowerCase().includes('pro');
          const featuresList = plan.features ? plan.features.split(',').map((f) => f.trim()) : [];

          return (
            <div
              key={plan.id}
              className={`rounded-2xl p-6 flex flex-col justify-between transition-all duration-200 relative overflow-hidden shadow-xl ${
                isPopular
                  ? 'bg-gradient-to-b from-orange-500/15 via-slate-900 to-slate-900 border-2 border-orange-500/60 scale-[1.02]'
                  : 'bg-slate-900/80 border border-slate-800 hover:border-slate-700'
              }`}
            >
              {isPopular && (
                <div className="absolute top-3 right-3">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-orange-500 text-white shadow-sm uppercase tracking-wide">
                    <Sparkles className="w-3 h-3" /> Most Popular
                  </span>
                </div>
              )}

              <div>
                <h4 className="text-lg font-bold text-white mb-1">{plan.name}</h4>
                <p className="text-xs text-slate-400 line-clamp-2 min-h-[32px]">{plan.description}</p>

                {/* Price Display */}
                <div className="my-5 pb-4 border-b border-slate-800">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-white font-mono">{formatInr(plan.price)}</span>
                    <span className="text-xs text-slate-400 font-medium">
                      / {plan.durationMonths} {plan.durationMonths === 1 ? 'Month' : 'Months'}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    Billed every {plan.durationMonths} month{plan.durationMonths > 1 ? 's' : ''}
                  </span>
                </div>

                {/* Features List */}
                <div className="space-y-2 mb-6">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    What's Included:
                  </p>
                  {featuresList.map((feat, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                      <div className="p-0.5 rounded-full bg-emerald-500/20 text-emerald-400 mt-0.5 shrink-0">
                        <Check className="w-3 h-3" />
                      </div>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-2">
                <button
                  onClick={() => onEditPlan(plan)}
                  className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition active:scale-95"
                >
                  <Edit2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Edit Plan</span>
                </button>
                <button
                  onClick={() => onDeletePlan(plan.id)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition active:scale-95"
                  title="Delete Plan"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
