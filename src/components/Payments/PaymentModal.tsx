import React, { useState } from 'react';
import { PaymentRecord, Appointment, TreatmentPackage } from '../../types';
import { CreditCard, CheckCircle2, ShieldCheck, Download, ArrowRight, X, RefreshCw } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  pendingAppointment?: Appointment | null;
  pendingPackage?: TreatmentPackage | null;
  paymentHistory: PaymentRecord[];
  onPaymentSuccess: (newPayment: PaymentRecord) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  pendingAppointment,
  pendingPackage,
  paymentHistory,
  onPaymentSuccess
}) => {
  const [activeTab, setActiveTab] = useState<'checkout' | 'history'>('checkout');
  const [method, setMethod] = useState<'Credit / Debit Card' | 'Apple Pay' | 'Google Pay' | 'Pay at Clinic' | 'Installments (Tabby)'>('Apple Pay');
  const [loading, setLoading] = useState(false);
  const [completedPayment, setCompletedPayment] = useState<PaymentRecord | null>(null);

  // Form fields for card
  const [cardNumber, setCardNumber] = useState('•••• •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');

  if (!isOpen) return null;

  const itemTitle = pendingAppointment
    ? `Appointment: ${pendingAppointment.treatmentName}`
    : pendingPackage
    ? `Package: ${pendingPackage.name}`
    : 'Clinic Outstanding Services';

  const amount = pendingAppointment
    ? pendingAppointment.fee
    : pendingPackage
    ? pendingPackage.price
    : 220;

  const handlePayNow = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const newRec: PaymentRecord = {
        id: `pay_${Date.now()}`,
        appointmentId: pendingAppointment?.id,
        packageId: pendingPackage?.id,
        title: itemTitle,
        amount,
        date: new Date().toISOString().split('T')[0],
        paymentMethod: method,
        status: 'Paid',
        invoicePdfUrl: '#',
        receiptNumber: `RC-INV-2026-${Math.floor(1000 + Math.random() * 9000)}`
      };
      onPaymentSuccess(newRec);
      setCompletedPayment(newRec);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-base">Reveal Clinic Payments</h3>
            <p className="text-xs text-slate-400">Secure 256-bit Encrypted Checkout</p>
          </div>
          <button
            id="payment-modal-close-btn"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Sub tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-bold text-slate-600">
          <button
            id="payment-tab-checkout-btn"
            onClick={() => setActiveTab('checkout')}
            className={`flex-1 py-3 border-b-2 transition ${
              activeTab === 'checkout' ? 'border-blue-600 text-blue-600 bg-white' : 'border-transparent'
            }`}
          >
            Pay Now
          </button>
          <button
            id="payment-tab-history-btn"
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-3 border-b-2 transition ${
              activeTab === 'history' ? 'border-blue-600 text-blue-600 bg-white' : 'border-transparent'
            }`}
          >
            Payment History ({paymentHistory.length})
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {/* TAB 1: CHECKOUT */}
          {activeTab === 'checkout' && !completedPayment && (
            <div className="space-y-4">
              {/* Summary Box */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Item Summary</div>
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-900">{itemTitle}</span>
                  <span className="font-extrabold text-slate-900 text-sm">SAR {amount}.00</span>
                </div>
                <div className="flex justify-between items-center text-[11px] text-slate-500 pt-1 border-t border-slate-200">
                  <span>Taxes & Clinic Service Fee</span>
                  <span>Included (SAR 0.00)</span>
                </div>
              </div>

              {/* Payment Methods */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Select Payment Method</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'Apple Pay', name: ' Apple Pay' },
                    { id: 'Credit / Debit Card', name: '💳 Card' },
                    { id: 'Pay at Clinic', name: '🏥 Pay at Clinic' },
                    { id: 'Installments (Tabby)', name: '🛍️ 4x Tabby' }
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setMethod(m.id as any)}
                      className={`p-3 rounded-2xl text-xs font-bold border transition text-left ${
                        method === m.id
                          ? 'bg-blue-50 border-blue-600 text-blue-900 ring-2 ring-blue-500/20'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {m.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Card Inputs if selected */}
              {method === 'Credit / Debit Card' && (
                <div className="space-y-3 pt-2 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Card Number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-hidden"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Expiry</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">CVC</label>
                      <input
                        type="text"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-hidden"
                      />
                    </div>
                  </div>
                </div>
              )}

              <button
                id="payment-pay-now-btn"
                onClick={handlePayNow}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-2xl text-xs shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 transition"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : `Complete Payment of SAR ${amount}.00`}
              </button>
            </div>
          )}

          {/* COMPLETED PAYMENT SUCCESS */}
          {completedPayment && (
            <div className="text-center space-y-4 py-3">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-lg">Payment Successful!</h3>
              <p className="text-xs text-slate-500">
                Receipt #{completedPayment.receiptNumber} issued for {completedPayment.title}.
              </p>

              <div className="bg-slate-50 p-4 rounded-2xl text-xs space-y-1 text-left font-medium border border-slate-200">
                <div>💳 <strong>Method:</strong> {completedPayment.paymentMethod}</div>
                <div>💵 <strong>Amount Paid:</strong> SAR {completedPayment.amount}.00</div>
                <div>🗓️ <strong>Date:</strong> {completedPayment.date}</div>
              </div>

              <button
                id="payment-done-btn"
                onClick={onClose}
                className="w-full bg-blue-600 text-white font-bold py-3 rounded-2xl text-xs shadow-md"
              >
                Done
              </button>
            </div>
          )}

          {/* TAB 2: PAYMENT HISTORY */}
          {activeTab === 'history' && (
            <div className="space-y-3">
              {paymentHistory.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">No previous payment receipts.</div>
              ) : (
                paymentHistory.map((rec) => (
                  <div
                    key={rec.id}
                    className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-slate-900">{rec.title}</div>
                      <div className="text-[11px] text-slate-500">{rec.date} • {rec.paymentMethod}</div>
                      <div className="text-[10px] text-blue-600 font-mono mt-0.5">{rec.receiptNumber}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-extrabold text-slate-900">${rec.amount}.00</div>
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {rec.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
