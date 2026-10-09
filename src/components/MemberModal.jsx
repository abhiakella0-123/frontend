import React, { useState } from 'react';
import { X } from 'lucide-react';

const formatInr = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

const getDefaultFormData = (memberToEdit, plans) => {
  if (memberToEdit) {
    return {
      firstName: memberToEdit.firstName || '',
      lastName: memberToEdit.lastName || '',
      email: memberToEdit.email || '',
      phone: memberToEdit.phone || '',
      gender: memberToEdit.gender || 'Male',
      membershipPlanId: memberToEdit.membershipPlan?.id || '',
      emergencyContact: memberToEdit.emergencyContact || '',
      notes: memberToEdit.notes || '',
      avatarUrl: memberToEdit.avatarUrl || '',
      status: memberToEdit.status || 'ACTIVE',
    };
  }

  return {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    gender: 'Male',
    membershipPlanId: plans.length > 0 ? plans[0].id : '',
    emergencyContact: '',
    notes: '',
    avatarUrl: '',
    status: 'ACTIVE',
  };
};

export default function MemberModal({ isOpen, onClose, onSave, memberToEdit, plans }) {
  const [formData, setFormData] = useState(() => getDefaultFormData(memberToEdit, plans));

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      membershipPlan: formData.membershipPlanId ? { id: Number(formData.membershipPlanId) } : null,
    };
    onSave(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-base font-bold text-white">
            {memberToEdit ? 'Edit Member Details' : 'Register New Member'}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">First Name *</label>
              <input
                type="text"
                required
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-orange-500"
                placeholder="Alex"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">Last Name *</label>
              <input
                type="text"
                required
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-orange-500"
                placeholder="Mercer"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">Email Address *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-orange-500"
                placeholder="alex@example.com"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">Phone Number *</label>
              <input
                type="text"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-orange-500"
                placeholder="+1 555-0199"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">Membership Plan</label>
              <select
                value={formData.membershipPlanId}
                onChange={(e) => setFormData({ ...formData, membershipPlanId: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-orange-500"
              >
                <option value="">-- Select Plan --</option>
                {plans.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({formatInr(p.price)} / {p.durationMonths}mo)
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">Gender</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-orange-500"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Non-Binary">Non-Binary</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-orange-500"
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="EXPIRED">EXPIRED</option>
                <option value="PENDING">PENDING</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">Emergency Contact</label>
              <input
                type="text"
                value={formData.emergencyContact}
                onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-orange-500"
                placeholder="Name & Contact"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-400 block mb-1">Profile Photo URL (optional)</label>
            <input
              type="text"
              value={formData.avatarUrl}
              onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-orange-500"
              placeholder="https://images.unsplash.com/..."
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-400 block mb-1">Fitness Goals / Medical Notes</label>
            <textarea
              rows={2}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-orange-500"
              placeholder="E.g., Hypertrophy goal, previous knee injury..."
            />
          </div>

          {/* Action Buttons */}
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
              {memberToEdit ? 'Save Changes' : 'Register Member'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
