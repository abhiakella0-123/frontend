import React from 'react';

export default function StatCard({ title, value, subtitle, icon: Icon, trend, color = 'orange' }) {
  const colorMap = {
    orange: 'from-orange-500/20 to-amber-500/5 text-orange-400 border-orange-500/30',
    emerald: 'from-emerald-500/20 to-teal-500/5 text-emerald-400 border-emerald-500/30',
    cyan: 'from-cyan-500/20 to-blue-500/5 text-cyan-400 border-cyan-500/30',
    purple: 'from-purple-500/20 to-indigo-500/5 text-purple-400 border-purple-500/30',
    rose: 'from-rose-500/20 to-pink-500/5 text-rose-400 border-rose-500/30',
  };

  const iconBgMap = {
    orange: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    rose: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  };

  return (
    <div className={`rounded-2xl p-5 bg-gradient-to-br ${colorMap[color]} bg-slate-900/90 border shadow-lg relative overflow-hidden backdrop-blur-sm group hover:scale-[1.01] transition duration-200`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</p>
          <h3 className="text-2xl font-bold text-white mt-1.5 font-mono">{value}</h3>
          {subtitle && (
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
              {trend && (
                <span className="text-emerald-400 font-semibold">{trend}</span>
              )}
              <span>{subtitle}</span>
            </p>
          )}
        </div>
        <div className={`p-3 rounded-xl border ${iconBgMap[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}
