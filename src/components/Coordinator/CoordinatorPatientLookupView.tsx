import React, { useState } from 'react';
import { ClinicalPatientRecord, ClinicalScheduleItem, PaymentRecord } from '../../types';
import {
  Search,
  User,
  CreditCard,
  DollarSign,
  Calendar,
  FileText,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  Clock,
  Printer,
  Sparkles,
  X,
  Receipt,
  Download
} from 'lucide-react';
import { initialClinicalPatients } from '../../data/mockData';

interface CoordinatorPatientLookupViewProps {
  schedule: ClinicalScheduleItem[];
  onTriggerToast: (msg: string) => void;
}

interface ReceiptItem {
  id: string;
  appointmentId: string;
  treatmentName: string;
  doctorName: string;
  amountPaid: number;
  paymentDate: string;
  paymentMethod: string;
  status: string;
  receiptUrl: string;
  transactionRef: string;
}

export const CoordinatorPatientLookupView: React.FC<CoordinatorPatientLookupViewProps> = ({
  schedule,
  onTriggerToast
}) => {
  const [searchQuery, setSearchQuery] = useState('RC-99841');
  const [selectedPatient, setSelectedPatient] = useState<ClinicalPatientRecord | null>(initialClinicalPatients[0]);

  // Payment Modal States
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('150');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash' | 'tabby'>('card');
  const [cashTendered, setCashTendered] = useState('200');
  const [paymentSuccessReceipt, setPaymentSuccessReceipt] = useState<ReceiptItem | null>(null);

  // Search logic
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const found = initialClinicalPatients.find(
      (p) =>
        p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.phone && p.phone.includes(searchQuery))
    );

    if (found) {
      setSelectedPatient(found);
      onTriggerToast(`Patient file loaded for ${found.fullName}.`);
    } else {
      onTriggerToast(`No patient found matching "${searchQuery}".`);
    }
  };

  const handleProcessPayment = () => {
    if (!selectedPatient) return;

    const amt = parseFloat(paymentAmount) || 150;
    const newReceipt: ReceiptItem = {
      id: `rcpt_${Date.now().toString().slice(-6)}`,
      appointmentId: 'cs_101',
      treatmentName: 'HydraFacial Elite + LED Therapy',
      doctorName: 'Dr. Sarah Chen',
      amountPaid: amt,
      paymentDate: new Date().toISOString().split('T')[0],
      paymentMethod: paymentMethod === 'card' ? 'Credit / Debit Card' : paymentMethod === 'cash' ? 'Cash at Desk' : 'Tabby Installments',
      status: 'completed',
      receiptUrl: '#',
      transactionRef: `tx_rc_${Math.floor(100000 + Math.random() * 900000)}`
    };

    setPaymentSuccessReceipt(newReceipt);
    setShowPaymentModal(false);
    onTriggerToast(`Payment of $${amt} processed for ${selectedPatient.fullName}!`);
  };

  const cashChange = (parseFloat(cashTendered) || 0) - (parseFloat(paymentAmount) || 0);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <Search className="w-6 h-6 text-[#4F8EF7]" />
          Patient File & Desk Payments
        </h1>
        <p className="text-xs text-slate-500 font-medium">
          Lookup patient files by File Number, Phone, or Name. Process desk payments and issue receipts.
        </p>
      </div>

      {/* Search Input Bar */}
      <div className="bg-white rounded-3xl border border-slate-100 p-4 shadow-2xs">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by File Number (e.g. RC-99841), Mobile Number, or Full Name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#4F8EF7]"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-2xl bg-[#4F8EF7] hover:bg-blue-600 text-white font-extrabold text-xs transition-all shadow-md shadow-blue-500/20 shrink-0"
          >
            Lookup Patient
          </button>
        </form>
      </div>

      {/* Patient File Overview */}
      {selectedPatient && (
        <div className="space-y-6">
          {/* Patient Card & Summary */}
          <div className="bg-white rounded-3xl border border-slate-100 p-5 sm:p-6 shadow-2xs space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <img
                  src={selectedPatient.avatarUrl}
                  alt={selectedPatient.fullName}
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-[#4F8EF7]/20 shadow-xs"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-black text-slate-900">{selectedPatient.fullName}</h2>
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#4F8EF7] text-xs font-black border border-blue-100">
                      {selectedPatient.id}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium mt-1">
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-slate-400" /> {selectedPatient.phone}
                    </span>
                    <span className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-slate-400" /> {selectedPatient.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" /> {selectedPatient.preferredBranch}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action: Receive Payment */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setShowPaymentModal(true)}
                  className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md shadow-emerald-500/20 flex items-center gap-2"
                >
                  <DollarSign className="w-4 h-4" />
                  <span>Receive Desk Payment</span>
                </button>
              </div>
            </div>

            {/* Appointment & Last Treatment Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
              {/* Last Treatment Summary */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#4F8EF7]" /> Last Treatment
                </div>
                <div className="font-extrabold text-slate-900 text-sm">
                  HydraFacial Elite + LED Therapy
                </div>
                <div className="text-xs text-slate-500">
                  Date: <span className="font-semibold text-slate-700">July 10, 2026</span> • Dr. Sarah Chen
                </div>
              </div>

              {/* Outstanding Balance */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <CreditCard className="w-3.5 h-3.5 text-emerald-600" /> Account Financial Status
                </div>
                <div className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                  <span>Outstanding Balance:</span>
                  <span className="text-emerald-600">$0.00 (Fully Settled)</span>
                </div>
                <div className="text-xs text-slate-500">
                  Total Loyalty Points: <span className="font-bold text-[#4F8EF7]">1,450 pts (Gold Tier)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Appointment History Timeline */}
          <div className="bg-white rounded-3xl border border-slate-100 p-5 sm:p-6 shadow-2xs space-y-4">
            <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#4F8EF7]" />
              Appointment & Billing History
            </h3>

            <div className="space-y-3">
              {schedule.map((appt) => (
                <div
                  key={appt.id}
                  className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-xs text-slate-900">{appt.treatmentName}</span>
                      <span className="px-2 py-0.5 rounded-md bg-blue-100 text-[#4F8EF7] text-[10px] font-bold">
                        {appt.date} • {appt.timeSlot}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">Dr. {appt.doctorName} • {appt.roomNumber}</p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold">
                      $280 Paid
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Receive Payment Modal */}
      {showPaymentModal && selectedPatient && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-600" />
                <h3 className="font-black text-slate-900 text-base">Receive Desk Payment</h3>
              </div>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-900 block">{selectedPatient.fullName}</span>
                  <span className="text-[10px] text-slate-400">File #: {selectedPatient.id}</span>
                </div>
                <span className="font-black text-[#4F8EF7]">Today's Visit</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Payment Amount ($) *</label>
                <input
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-black text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Select Payment Method</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`py-2 px-3 rounded-xl border text-xs font-extrabold text-center transition-all ${
                      paymentMethod === 'card'
                        ? 'bg-blue-50 border-[#4F8EF7] text-[#4F8EF7]'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    Credit Card
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cash')}
                    className={`py-2 px-3 rounded-xl border text-xs font-extrabold text-center transition-all ${
                      paymentMethod === 'cash'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    Cash
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('tabby')}
                    className={`py-2 px-3 rounded-xl border text-xs font-extrabold text-center transition-all ${
                      paymentMethod === 'tabby'
                        ? 'bg-purple-50 border-purple-500 text-purple-700'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    Tabby
                  </button>
                </div>
              </div>

              {paymentMethod === 'cash' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Cash Tendered ($)</label>
                  <input
                    type="number"
                    value={cashTendered}
                    onChange={(e) => setCashTendered(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none"
                  />
                  <div className="text-xs font-bold text-slate-600 mt-1 flex justify-between">
                    <span>Change Due:</span>
                    <span className="text-emerald-600 font-black">${cashChange > 0 ? cashChange.toFixed(2) : '0.00'}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="px-4 py-2 rounded-2xl text-slate-600 hover:bg-slate-100 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleProcessPayment}
                className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-md shadow-emerald-500/20"
              >
                Confirm Payment & Issue Receipt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Digital Receipt Modal */}
      {paymentSuccessReceipt && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-slate-100 text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl mx-auto flex items-center justify-center">
              <Receipt className="w-6 h-6" />
            </div>

            <h3 className="font-black text-slate-900 text-lg">Payment Complete!</h3>
            <p className="text-xs text-slate-500 font-medium">Digital receipt issued and saved to patient account.</p>

            <div className="bg-slate-50 rounded-2xl border border-slate-100 p-4 text-left space-y-2 text-xs">
              <div className="flex justify-between text-slate-500 text-[10px] uppercase font-extrabold">
                <span>Receipt Ref</span>
                <span className="text-slate-800">{paymentSuccessReceipt.transactionRef}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Item:</span>
                <span className="font-bold text-slate-800">{paymentSuccessReceipt.treatmentName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Paid Amount:</span>
                <span className="font-black text-emerald-600">${paymentSuccessReceipt.amountPaid}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Method:</span>
                <span className="font-semibold text-slate-700">{paymentSuccessReceipt.paymentMethod}</span>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-2">
              <button
                onClick={() => setPaymentSuccessReceipt(null)}
                className="w-full py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold"
              >
                Close Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
