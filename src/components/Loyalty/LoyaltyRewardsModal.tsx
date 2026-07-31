import React, { useState } from 'react';
import { loyaltyRewards } from '../../data/mockData';
import { Award, Check, Copy, Tag, X } from 'lucide-react';

interface LoyaltyRewardsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoyaltyRewardsModal: React.FC<LoyaltyRewardsModalProps> = ({
  isOpen,
  onClose
}) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopyCode = (code: string) => {
    navigator.clipboard?.writeText(code).catch(() => {});
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <Award className="w-6 h-6 text-amber-100" />
            </div>
            <div>
              <h3 className="font-extrabold text-base">Reveal Loyalty Club</h3>
              <p className="text-xs text-amber-100">Patient Special Offers & Rewards Catalog</p>
            </div>
          </div>
          <button
            id="loyalty-modal-close-btn"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Available Rewards Catalog</div>
          {loyaltyRewards.map((rew) => (
            <div
              key={rew.id}
              className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2.5"
            >
              <div>
                <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full uppercase">
                  {rew.category}
                </span>
                <h4 className="font-bold text-slate-900 text-xs mt-1.5">{rew.title}</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">{rew.description}</p>
              </div>

              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 bg-slate-900 text-amber-300 font-mono font-bold text-xs px-3 py-1.5 rounded-xl tracking-wider">
                  <Tag className="w-3.5 h-3.5" />
                  {rew.code}
                </div>
                <button
                  type="button"
                  id={`loyalty-copy-${rew.id}-btn`}
                  onClick={() => handleCopyCode(rew.code)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition bg-amber-500 hover:bg-amber-600 text-white shadow-xs flex items-center gap-1.5"
                >
                  {copiedCode === rew.code ? (
                    <>
                      <Check className="w-3.5 h-3.5" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> Copy Code
                    </>
                  )}
                </button>
              </div>
              <p className="text-[10px] text-slate-400">Use this voucher code during appointment booking or payment.</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
