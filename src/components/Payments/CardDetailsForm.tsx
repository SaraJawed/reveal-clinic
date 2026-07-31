import React, { useState } from 'react';
import { CreditCard, Lock, RefreshCw } from 'lucide-react';

interface CardDetailsFormProps {
  amount: number;
  onBack: () => void;
  onPay: () => void;
}

export const CardDetailsForm: React.FC<CardDetailsFormProps> = ({ amount, onBack, onPay }) => {
  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');
  const [cardName, setCardName] = useState('');
  const [expiry, setExpiry] = useState('12/28');
  const [cvv, setCvv] = useState('123');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onPay();
    }, 900);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-blue-50/70 border border-blue-100 rounded-2xl p-3.5 flex items-center justify-between text-xs">
        <span className="font-semibold text-slate-600 flex items-center gap-1.5">
          <Lock className="w-3.5 h-3.5 text-blue-600" /> Secure Card Payment
        </span>
        <span className="font-black text-slate-900">SAR {amount}</span>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">Cardholder Name</label>
        <input
          type="text"
          required
          value={cardName}
          onChange={(e) => setCardName(e.target.value)}
          placeholder="Name on card"
          className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-hidden focus:bg-white focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">Card Number</label>
        <div className="relative">
          <CreditCard className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            required
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            placeholder="1234 5678 9012 3456"
            className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-hidden focus:bg-white focus:border-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Expiry (MM/YY)</label>
          <input
            type="text"
            required
            value={expiry}
            onChange={(e) => setExpiry(e.target.value)}
            placeholder="MM/YY"
            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-hidden focus:bg-white focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">CVV</label>
          <input
            type="text"
            required
            value={cvv}
            onChange={(e) => setCvv(e.target.value)}
            placeholder="123"
            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-hidden focus:bg-white focus:border-blue-500"
          />
        </div>
      </div>

      <button
        type="submit"
        id="card-details-pay-btn"
        disabled={loading}
        className="w-full bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 text-white font-bold py-3.5 rounded-2xl text-xs shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 transition disabled:opacity-70"
      >
        {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : `Pay SAR ${amount} Now`}
      </button>

      <button
        type="button"
        onClick={onBack}
        disabled={loading}
        className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl text-xs transition"
      >
        Back
      </button>
    </form>
  );
};
