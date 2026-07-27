import React, { useState } from 'react';
import { GiftCard, UserProfile } from '../../types';
import { Gift, CheckCircle2, Sparkles, X } from 'lucide-react';

interface GiftCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  giftCards: GiftCard[];
  onPurchaseGiftCard: (card: GiftCard) => void;
  onRedeemGiftCardCode: (code: string) => void;
}

export const GiftCardModal: React.FC<GiftCardModalProps> = ({
  isOpen,
  onClose,
  user,
  giftCards,
  onPurchaseGiftCard,
  onRedeemGiftCardCode
}) => {
  const [activeTab, setActiveTab] = useState<'buy' | 'mycards' | 'redeem'>('buy');

  // Purchase Form
  const [amount, setAmount] = useState(250);
  const [recipientName, setRecipientName] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [personalMessage, setPersonalMessage] = useState('Enjoy a luxurious skin rejuvenation experience at Reveal Clinic!');
  const [theme, setTheme] = useState<'gold_luxury' | 'rose_glow' | 'serene_blue'>('gold_luxury');

  // Redeem
  const [redeemCodeInput, setRedeemCodeInput] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleBuySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientName || !recipientEmail) return;

    const newCard: GiftCard = {
      id: `gc_${Date.now()}`,
      code: `REVEAL-GIFT-${Math.floor(1000 + Math.random() * 9000)}`,
      amount,
      balance: amount,
      recipientName,
      recipientEmail,
      senderName: user.fullName,
      personalMessage,
      theme,
      purchaseDate: new Date().toISOString().split('T')[0],
      status: 'Active'
    };

    onPurchaseGiftCard(newCard);
    setSuccessMsg(`Digital Gift Card of SAR ${amount} purchased successfully! Sent to ${recipientEmail}`);
  };

  const handleRedeemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!redeemCodeInput.trim()) return;
    onRedeemGiftCardCode(redeemCodeInput.trim());
    setSuccessMsg(`Gift Card code "${redeemCodeInput}" redeemed to your account!`);
    setRedeemCodeInput('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-600 via-rose-700 to-pink-800 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <Gift className="w-6 h-6 text-rose-100" />
            </div>
            <div>
              <h3 className="font-extrabold text-base">Reveal Digital Gift Cards</h3>
              <p className="text-xs text-rose-100">Luxury e-gift vouchers for treatments</p>
            </div>
          </div>
          <button
            id="giftcards-modal-close-btn"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Sub Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-bold text-slate-600">
          <button
            id="giftcards-tab-buy-btn"
            onClick={() => { setActiveTab('buy'); setSuccessMsg(''); }}
            className={`flex-1 py-3 border-b-2 transition ${
              activeTab === 'buy' ? 'border-rose-600 text-rose-600 bg-white' : 'border-transparent'
            }`}
          >
            Buy Gift Card
          </button>
          <button
            id="giftcards-tab-mycards-btn"
            onClick={() => { setActiveTab('mycards'); setSuccessMsg(''); }}
            className={`flex-1 py-3 border-b-2 transition ${
              activeTab === 'mycards' ? 'border-rose-600 text-rose-600 bg-white' : 'border-transparent'
            }`}
          >
            My Cards ({giftCards.length})
          </button>
          <button
            id="giftcards-tab-redeem-btn"
            onClick={() => { setActiveTab('redeem'); setSuccessMsg(''); }}
            className={`flex-1 py-3 border-b-2 transition ${
              activeTab === 'redeem' ? 'border-rose-600 text-rose-600 bg-white' : 'border-transparent'
            }`}
          >
            Redeem Code
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {successMsg && (
            <div className="bg-emerald-50 text-emerald-800 p-3.5 rounded-2xl text-xs font-bold border border-emerald-200 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* TAB 1: BUY GIFT CARD */}
          {activeTab === 'buy' && (
            <form onSubmit={handleBuySubmit} className="space-y-3">
              {/* Card Amount Preset Pills */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Select Gift Voucher Amount</label>
                <div className="grid grid-cols-4 gap-2">
                  {[100, 250, 500, 1000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setAmount(amt)}
                      className={`py-2 rounded-xl text-xs font-bold border transition ${
                        amount === amt
                          ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      SAR {amt}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Recipient Name</label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="e.g. Jessica Martinez"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-hidden"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Recipient Email</label>
                <input
                  type="email"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  placeholder="jessica@example.com"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-hidden"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Personal Message</label>
                <textarea
                  value={personalMessage}
                  onChange={(e) => setPersonalMessage(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-hidden"
                />
              </div>

              <button
                type="submit"
                id="giftcards-buy-submit-btn"
                className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 rounded-2xl text-xs shadow-md shadow-rose-500/25 transition"
              >
                Purchase & E-Mail Gift Card (SAR {amount})
              </button>
            </form>
          )}

          {/* TAB 2: MY CARDS */}
          {activeTab === 'mycards' && (
            <div className="space-y-3">
              {giftCards.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">No gift cards issued yet.</div>
              ) : (
                giftCards.map((card) => (
                  <div
                    key={card.id}
                    className="bg-gradient-to-r from-rose-900 to-pink-950 text-white p-4 rounded-2xl border border-rose-800 shadow-md space-y-2"
                  >
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-rose-200">For: {card.recipientName}</span>
                      <span className="font-extrabold text-white text-sm">SAR {card.balance} Balance</span>
                    </div>
                    <div className="text-[11px] text-slate-300 italic">"{card.personalMessage}"</div>
                    <div className="flex justify-between items-center text-[10px] text-rose-300 font-mono pt-1 border-t border-rose-800">
                      <span>Code: {card.code}</span>
                      <span>Issued: {card.purchaseDate}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 3: REDEEM CODE */}
          {activeTab === 'redeem' && (
            <form onSubmit={handleRedeemSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Enter Gift Card Voucher Code</label>
                <input
                  type="text"
                  value={redeemCodeInput}
                  onChange={(e) => setRedeemCodeInput(e.target.value)}
                  placeholder="e.g. REVEAL-GIFT-9921"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold uppercase outline-hidden"
                  required
                />
              </div>

              <button
                type="submit"
                id="giftcards-redeem-submit-btn"
                className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 rounded-2xl text-xs shadow-md transition"
              >
                Redeem Gift Voucher
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
