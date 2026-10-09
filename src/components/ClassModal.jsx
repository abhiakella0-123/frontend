import React, { useState } from 'react';
import { X } from 'lucide-react';

const getDefaultFormData = (classToEdit, trainers) => {
  if (classToEdit) {
    return {
      className: classToEdit.className || '',
      description: classToEdit.description || '',
      trainerId: classToEdit.trainer?.id || '',
      scheduleTime: classToEdit.scheduleTime || '07:00 AM - 08:00 AM',
      daysOfWeek: classToEdit.daysOfWeek || 'Mon, Wed, Fri',
      durationMinutes: classToEdit.durationMinutes || 60,
      capacity: classToEdit.capacity || 20,
      room: classToEdit.room || 'Studio A',
    };
  }

  return {
    className: '',
    description: '',
    trainerId: trainers[0]?.id || '',
    scheduleTime: '07:00 AM - 08:00 AM',
    daysOfWeek: 'Mon, Wed, Fri',
    durationMinutes: 60,
    capacity: 20,
    room: 'Studio A',
  };
};

export default function ClassModal({ isOpen, onClose, onSave, classToEdit, trainers }) {
  const [formData, setFormData] = useState(() => getDefaultFormData(classToEdit, trainers));

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      trainer: formData.trainerId ? { id: Number(formData.trainerId) } : null,
      durationMinutes: Number(formData.durationMinutes),
      capacity: Number(formData.capacity),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-base font-bold text-white">
            {classToEdit ? 'Edit Fitness Class' : 'Schedule New Class'}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          <div>
            <label className="text-[11px] font-semibold text-slate-400 block mb-1">Class Name *</label>
            <input
              type="text"
              required
              value={formData.className}
              onChange={(e) => setFormData({ ...formData, className: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-orange-500"
              placeholder="E.g., Iron Core & Abs"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-400 block mb-1">Description</label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-orange-500"
              placeholder="Short description of class focus and pace..."
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">Assigned Coach</label>
              <select
                value={formData.trainerId}
                onChange={(e) => setFormData({ ...formData, trainerId: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-orange-500"
              >
                <option value="">-- Choose Coach --</option>
                {trainers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.firstName} {t.lastName} ({t.specialization})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">Studio / Room</label>
              <input
                type="text"
                value={formData.room}
                onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-orange-500"
                placeholder="Studio A, Cardio Deck..."
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">Schedule Time</label>
              <input
                type="text"
                value={formData.scheduleTime}
                onChange={(e) => setFormData({ ...formData, scheduleTime: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-orange-500"
                placeholder="06:30 AM - 07:30 AM"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">Days of Week</label>
              <input
                type="text"
                value={formData.daysOfWeek}
                onChange={(e) => setFormData({ ...formData, daysOfWeek: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-orange-500"
                placeholder="Mon, Wed, Fri"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">Duration (Mins)</label>
              <input
                type="number"
                min="15"
                value={formData.durationMinutes}
                onChange={(e) => setFormData({ ...formData, durationMinutes: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">Max Capacity</label>
              <input
                type="number"
                min="1"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-orange-500"
              />
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
              {classToEdit ? 'Save Changes' : 'Schedule Class'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
