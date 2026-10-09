import React from 'react';
import { CreditCard, Plus, IndianRupee, CheckCircle2, Printer } from 'lucide-react';

export default function PaymentsView({ payments, onRecordPayment, onViewInvoice }) {
  const totalRevenue = payments.reduce((acc, p) => acc + (p.status === 'PAID' ? p.amount : 0), 0);
  const formatInr = (value) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(Number(value || 0));

  return (
    <div className="space-y-6">
      {/* Top Banner & Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="sm:col-span-2 flex flex-col justify-between bg-slate-900/80 p-5 rounded-2xl border border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-orange-400" />
              Gym Billing & Payment Invoices
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Track membership subscriptions, transaction receipts, payment methods, and invoices
            </p>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={onRecordPayment}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition shadow-md shadow-orange-500/20 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Record New Payment</span>
            </button>
          </div>
        </div>

        {/* Revenue Highlight Card */}
        <div className="bg-gradient-to-br from-cyan-500/20 via-slate-900 to-slate-900 p-5 rounded-2xl border border-cyan-500/30 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">Total Collected</span>
            <IndianRupee className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="my-2">
            <span className="text-3xl font-extrabold text-white font-mono">
              {formatInr(totalRevenue)}
            </span>
          </div>
          <span className="text-[11px] text-slate-400">{payments.length} transactions processed</span>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-6 shadow-xl">
        <h4 className="text-sm font-bold text-white mb-4">Payment Invoices & History</h4>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider">
                <th className="pb-3 font-semibold">Invoice #</th>
                <th className="pb-3 font-semibold">Member</th>
                <th className="pb-3 font-semibold">Membership Plan</th>
                <th className="pb-3 font-semibold">Payment Method</th>
                <th className="pb-3 font-semibold">Date & Time</th>
                <th className="pb-3 font-semibold">Amount</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {payments.map((p) => (
                <tr key={p.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 font-mono font-semibold text-orange-400">
                    {p.invoiceNumber}
                  </td>
                  <td className="py-3 font-medium text-white">
                    {p.member?.firstName} {p.member?.lastName}
                  </td>
                  <td className="py-3 text-slate-300">
                    {p.membershipPlan?.name || 'Membership Plan'}
                  </td>
                  <td className="py-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                      {p.paymentMethod}
                    </span>
                  </td>
                  <td className="py-3 text-slate-400 font-mono text-[11px]">
                    {new Date(p.paymentDate).toLocaleDateString()}{' '}
                    {new Date(p.paymentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="py-3 font-mono font-bold text-white">
                    {formatInr(p.amount)}
                  </td>
                  <td className="py-3">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <CheckCircle2 className="w-3 h-3" />
                      {p.status}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => onViewInvoice(p)}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-semibold transition active:scale-95"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Invoice</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
