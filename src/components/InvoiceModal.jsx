import React from 'react';
import { X, Printer, Flame, CheckCircle2 } from 'lucide-react';

export default function InvoiceModal({ isOpen, onClose, payment }) {
  if (!isOpen || !payment) return null;

  const handlePrint = () => {
    window.print();
  };

  const formatInr = (value) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(Number(value || 0));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl">
        {/* Controls bar */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between print:hidden">
          <span className="text-xs font-semibold text-slate-400">Official Payment Receipt</span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
            >
              <Printer className="w-4 h-4 text-cyan-400" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Paper */}
        <div className="p-8 bg-slate-950 text-slate-200 space-y-6 print:p-0 print:bg-white print:text-black">
          {/* Header */}
          <div className="flex items-start justify-between border-b border-slate-800 pb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center text-white">
                <Flame className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-black tracking-wider text-white print:text-black">
                  TITAN <span className="text-orange-500">FIT</span>
                </h2>
                <p className="text-[11px] text-slate-400 print:text-slate-600">
                  Elite Gym & Athletic Club
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 print:border-emerald-600 print:text-emerald-700">
                <CheckCircle2 className="w-3 h-3" />
                {payment.status}
              </span>
              <p className="text-[11px] font-mono text-slate-400 mt-1 print:text-slate-600">
                {payment.invoiceNumber}
              </p>
            </div>
          </div>

          {/* Billed To / Date Grid */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Billed To</p>
              <p className="font-bold text-white print:text-black text-sm mt-0.5">
                {payment.member?.firstName} {payment.member?.lastName}
              </p>
              <p className="text-slate-400 print:text-slate-600">{payment.member?.email}</p>
              <p className="text-slate-400 print:text-slate-600">{payment.member?.phone}</p>
            </div>

            <div className="text-right">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Transaction Details</p>
              <p className="text-slate-300 print:text-slate-700 mt-0.5">
                Date: {new Date(payment.paymentDate).toLocaleDateString()}
              </p>
              <p className="text-slate-300 print:text-slate-700">
                Method: <span className="font-semibold">{payment.paymentMethod}</span>
              </p>
            </div>
          </div>

          {/* Itemized Table */}
          <div className="border border-slate-800 rounded-xl overflow-hidden print:border-slate-300">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 border-b border-slate-800 print:bg-slate-100 print:border-slate-300 text-slate-400 print:text-slate-700">
                <tr>
                  <th className="py-2.5 px-4 font-semibold">Description</th>
                  <th className="py-2.5 px-4 font-semibold text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 print:divide-slate-200">
                <tr>
                  <td className="py-3 px-4">
                    <p className="font-semibold text-white print:text-black">
                      {payment.membershipPlan?.name || 'Membership Plan'}
                    </p>
                    <p className="text-[11px] text-slate-400 print:text-slate-600">
                      {payment.notes || 'Full gym facility access & member benefits'}
                    </p>
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-white print:text-black text-right">
                    {formatInr(payment.amount)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Total */}
          <div className="flex justify-between items-baseline pt-2">
            <span className="text-xs text-slate-400 print:text-slate-600">Total Paid (Tax Included):</span>
            <span className="text-2xl font-black font-mono text-orange-400 print:text-black">
              {formatInr(payment.amount)}
            </span>
          </div>

          {/* Footer Thank You Note */}
          <div className="pt-4 border-t border-slate-800 text-center text-[11px] text-slate-500 print:text-slate-600">
            Thank you for being part of Titan Fit! For inquiries, email support@titanfit.com.
          </div>
        </div>
      </div>
    </div>
  );
}
