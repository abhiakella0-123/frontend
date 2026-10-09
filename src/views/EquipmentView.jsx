import React, { useState } from 'react';
import { Wrench, Plus, CheckCircle2, AlertTriangle, Check, Edit2, Trash2 } from 'lucide-react';

export default function EquipmentView({ 
  equipmentList, 
  onAddEquipment, 
  onEditEquipment, 
  onDeleteEquipment, 
  onMarkDone 
}) {
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const filteredEquipment = equipmentList.filter((item) => {
    if (selectedCategory === 'ALL') return true;
    return item.category === selectedCategory;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Wrench className="w-5 h-5 text-orange-400" />
            Equipment & Facility Maintenance
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Track gym machinery, service intervals, maintenance status, and floor location
          </p>
        </div>

        <button
          onClick={onAddEquipment}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition shadow-md shadow-orange-500/20 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add Equipment</span>
        </button>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {['ALL', 'CARDIO', 'STRENGTH', 'FREE_WEIGHTS', 'RECOVERY'].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
              selectedCategory === cat
                ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {cat === 'ALL' ? 'All Equipment' : cat.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Equipment Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredEquipment.map((eq) => {
          const isGood = eq.conditionStatus === 'GOOD' || eq.conditionStatus === 'EXCELLENT';

          return (
            <div
              key={eq.id}
              className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5 flex flex-col justify-between hover:border-slate-700 transition shadow-lg relative overflow-hidden"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400 px-2 py-0.5 rounded bg-orange-500/10 border border-orange-500/20">
                      {eq.category}
                    </span>
                    <h4 className="font-bold text-base text-white mt-1.5">{eq.name}</h4>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                      isGood
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    }`}
                  >
                    {isGood ? (
                      <CheckCircle2 className="w-3 h-3" />
                    ) : (
                      <AlertTriangle className="w-3 h-3" />
                    )}
                    {eq.conditionStatus.replace('_', ' ')}
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-2 text-xs bg-slate-950/40 p-3 rounded-xl border border-slate-800/80 my-3">
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-500">Location:</span>
                    <span className="font-medium text-slate-200">{eq.location || 'Main Floor'}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-500">Total Units:</span>
                    <span className="font-mono text-slate-200">{eq.quantity || 1}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-500">Last Service:</span>
                    <span className="font-mono text-slate-200">{eq.lastMaintenanceDate || 'Recently'}</span>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                {!isGood ? (
                  <button
                    onClick={() => onMarkDone(eq.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 text-xs font-semibold border border-emerald-500/30 transition active:scale-95"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Mark Operational</span>
                  </button>
                ) : (
                  <span className="text-[11px] text-slate-500 font-medium">Fully operational</span>
                )}

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onEditEquipment(eq)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition active:scale-95"
                    title="Edit Equipment"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-cyan-400" />
                  </button>
                  <button
                    onClick={() => onDeleteEquipment(eq.id)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition active:scale-95"
                    title="Delete Equipment"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
