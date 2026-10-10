import React, { useState } from 'react';
import { X } from 'lucide-react';

function hasPaidForCurrentMembership(member, planId, payments) {
  if (!member || !planId) return false;
  const today = new Date().toLocaleDateString('en-CA');
  if (member.membershipEndDate && member.membershipEndDate < today) return false;

  return payments.some((payment) =>
    String(payment.member?.id) === String(member.id)
      && String(payment.membershipPlan?.id) === String(planId)
      && payment.status === 'PAID'
      && (!member.membershipStartDate || String(payment.paymentDate || '').slice(0, 10) >= member.membershipStartDate),
  );
}

export default function PaymentModal({ isOpen, onClose, onSave, members, plans, payments = [] }) {
  const [formData, setFormData] = useState({
    memberId: members[0]?.id || '',
    planId: plans[0]?.id || '',
    amount: plans[0]?.price || 0,
    paymentMethod: 'CREDIT_CARD',
    notes: 'Membership subscription payment',
  });

  if (!isOpen) return null;

  const selectedMember = members.find((member) => String(member.id) === String(formData.memberId));
  const selectedPlanId = formData.planId || selectedMember?.membershipPlan?.id;
  const isAlreadyPaid = hasPaidForCurrentMembership(selectedMember, selectedPlanId, payments);

  const handleMemberChange = (id) => {
    const selectedMem = members.find((m) => String(m.id) === String(id));
    const plan = selectedMem?.membershipPlan || plans[0];
    setFormData({
      ...formData,
      memberId: id,
      planId: plan ? plan.id : '',
      amount: plan ? plan.price : 0,
    });
  };

  const formatInr = (value) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(Number(value || 0));

  const handlePlanChange = (planId) => {
    const plan = plans.find((p) => String(p.id) === String(planId));
    setFormData({
      ...formData,
      planId: planId,
      amount: plan ? plan.price : formData.amount,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isAlreadyPaid) return;
    onSave({
      member: { id: Number(formData.memberId) },
      membershipPlan: formData.planId ? { id: Number(formData.planId) } : null,
      amount: Number(formData.amount),
      paymentMethod: formData.paymentMethod,
      notes: formData.notes,
      status: 'PAID',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-base font-bold text-white">Record Member Payment</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-[11px] font-semibold text-slate-400 block mb-1">Select Member *</label>
            <select
              required
              value={formData.memberId}
              onChange={(e) => handleMemberChange(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-orange-500"
            >
              <option value="">-- Choose Member --</option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.firstName} {m.lastName} ({m.email}){hasPaidForCurrentMembership(m, m.membershipPlan?.id, payments) ? ' - Paid' : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">Plan / Package</label>
              <select
                value={formData.planId}
                onChange={(e) => handlePlanChange(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-orange-500"
              >
                <option value="">-- Select Plan --</option>
                {plans.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({formatInr(p.price)}){hasPaidForCurrentMembership(selectedMember, p.id, payments) ? ' - Paid' : ''}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">Amount (₹) *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                readOnly
                value={formData.amount}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-orange-500 font-mono read-only:cursor-not-allowed read-only:opacity-75"
              />
            </div>
          </div>

          {isAlreadyPaid && (
            <div role="status" className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-300">
              This member has already paid for the selected plan during the current membership period.
            </div>
          )}

          <div>
            <label className="text-[11px] font-semibold text-slate-400 block mb-1">Payment Method</label>
            <select
              value={formData.paymentMethod}
              onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
              disabled={isAlreadyPaid}
              className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-orange-500"
            >
              <option value="CREDIT_CARD">Credit / Debit Card</option>
              <option value="UPI">UPI / Digital QR</option>
              <option value="CASH">Cash</option>
              <option value="BANK_TRANSFER">Bank Wire / Transfer</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-400 block mb-1">Payment Memo / Notes</label>
            <input
              type="text"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              disabled={isAlreadyPaid}
              className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-orange-500"
              placeholder="E.g., 3-month membership fee payment"
            />
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
              disabled={isAlreadyPaid}
              className="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50 text-xs font-bold text-white shadow-md shadow-orange-500/25 transition active:scale-95"
            >
              {isAlreadyPaid ? 'Already Paid' : 'Process Payment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
