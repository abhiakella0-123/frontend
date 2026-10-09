import React, { useState } from 'react';
import { X } from 'lucide-react';

const getDefaultFormData = (equipmentToEdit) => {
  if (equipmentToEdit) {
    return {
      name: equipmentToEdit.name || '',
      category: equipmentToEdit.category || 'CARDIO',
      quantity: equipmentToEdit.quantity || 1,
      conditionStatus: equipmentToEdit.conditionStatus || 'GOOD',
      location: equipmentToEdit.location || 'Zone A - Cardio Deck',
    };
  }

  return {
    name: '',
    category: 'CARDIO',
    quantity: 1,
    conditionStatus: 'GOOD',
    location: 'Zone A - Cardio Deck',
  };
};

export default function EquipmentModal({ isOpen, onClose, onSave, equipmentToEdit }) {
  const [formData, setFormData] = useState(() => getDefaultFormData(equipmentToEdit));

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      quantity: Number(formData.quantity),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-base font-bold text-white">
            {equipmentToEdit ? 'Edit Equipment Unit' : 'Add New Equipment'}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-[11px] font-semibold text-slate-400 block mb-1">Equipment Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-orange-500"
              placeholder="E.g., Precor Elliptical Trainer EFX 885"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-orange-500"
              >
                <option value="CARDIO">CARDIO</option>
                <option value="STRENGTH">STRENGTH</option>
                <option value="FREE_WEIGHTS">FREE WEIGHTS</option>
                <option value="RECOVERY">RECOVERY</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">Quantity</label>
              <input
                type="number"
                min="1"
                required
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">Condition Status</label>
              <select
                value={formData.conditionStatus}
                onChange={(e) => setFormData({ ...formData, conditionStatus: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-orange-500"
              >
                <option value="EXCELLENT">EXCELLENT</option>
                <option value="GOOD">GOOD</option>
                <option value="MAINTENANCE_NEEDED">MAINTENANCE NEEDED</option>
                <option value="BROKEN">BROKEN</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">Location / Zone</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-orange-500"
                placeholder="Zone A, Free Weights..."
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
              {equipmentToEdit ? 'Save Changes' : 'Add Equipment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
