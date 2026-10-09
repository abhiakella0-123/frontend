import React from 'react';
import { Dumbbell, Plus, Star, Edit2, Trash2 } from 'lucide-react';

export default function TrainersView({ trainers, onAddTrainer, onEditTrainer, onDeleteTrainer }) {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Dumbbell className="w-5 h-5 text-orange-400" />
            Fitness Coaches & Trainers
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage your certified personal trainers, specializations, ratings, and coaching roster
          </p>
        </div>

        <button
          onClick={onAddTrainer}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition shadow-md shadow-orange-500/20 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Coach</span>
        </button>
      </div>

      {/* Trainer Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {trainers.map((trainer) => (
          <div
            key={trainer.id}
            className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5 flex flex-col justify-between hover:border-slate-700 transition shadow-lg group overflow-hidden"
          >
            <div>
              {/* Photo & Rating */}
              <div className="relative mb-4">
                <img
                  src={trainer.imageUrl || 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=300'}
                  alt=""
                  className="w-full h-44 rounded-xl object-cover border border-slate-700 group-hover:scale-[1.02] transition duration-300"
                />
                <div className="absolute top-2.5 right-2.5 flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-md text-amber-400 text-xs font-bold border border-slate-800">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{trainer.rating?.toFixed(1) || '5.0'}</span>
                </div>
              </div>

              <h4 className="font-bold text-base text-white group-hover:text-orange-400 transition">
                {trainer.firstName} {trainer.lastName}
              </h4>
              <p className="text-xs text-orange-400 font-medium mt-0.5">
                {trainer.specialization}
              </p>

              <div className="mt-4 space-y-2 text-xs bg-slate-950/40 p-3 rounded-xl border border-slate-800/80">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-500">Experience:</span>
                  <span className="font-medium text-slate-200">{trainer.experienceYears} Years</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-500">Phone:</span>
                  <span className="font-mono text-slate-300">{trainer.phone || 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-500">Email:</span>
                  <span className="text-slate-400 truncate max-w-[140px]">{trainer.email}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
              <button
                onClick={() => onEditTrainer(trainer)}
                className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition active:scale-95"
              >
                <Edit2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Edit Profile</span>
              </button>
              <button
                onClick={() => onDeleteTrainer(trainer.id)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition active:scale-95"
                title="Delete Coach"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
