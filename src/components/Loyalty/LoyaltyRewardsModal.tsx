import React, { useState } from 'react';
import { LoyaltyReward, UserProfile } from '../../types';
import { loyaltyRewards } from '../../data/mockData';
import { Award, CheckCircle2, Gift, Sparkles, X } from 'lucide-react';

interface LoyaltyRewardsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onRedeemReward: (pointsCost: number, rewardTitle: string) => void;
}

export const LoyaltyRewardsModal: React.FC<LoyaltyRewardsModalProps> = ({
  isOpen,
  onClose,
  user,
  onRedeemReward
}) => {
  const [redeemedCode, setRedeemedCode] = useState<string | null>(null);

  if (!isOpen) return null;

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
          {redeemedCode ? (
            <div className="text-center space-y-4 py-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="font-extrabold text-slate-900 text-lg">Reward Voucher Redeemed!</h4>
              <div className="bg-slate-900 text-amber-300 p-4 rounded-2xl text-base font-mono font-bold tracking-widest">
                {redeemedCode}
              </div>
              <p className="text-xs text-slate-500">
                Show this voucher code at clinic reception or apply during online checkout.
              </p>
              <button
                id="loyalty-code-close-btn"
                onClick={() => setRedeemedCode(null)}
                className="w-full bg-slate-900 text-white font-bold py-3 rounded-2xl text-xs"
              >
                Back to Rewards Catalog
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Available Rewards Catalog</div>
              {loyaltyRewards.map((rew) => {
                const canAfford = user.loyaltyPoints >= rew.pointsRequired;
                return (
                  <div
                    key={rew.id}
                    className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 flex items-center justify-between gap-3"
                  >
                    <div>
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full uppercase">
                        {rew.category}
                      </span>
                      <h4 className="font-bold text-slate-900 text-xs mt-1">{rew.title}</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">{rew.description}</p>
                      <div className="text-xs font-extrabold text-amber-600 mt-1">⭐ {rew.pointsRequired} Points Required</div>
                    </div>

                    <button
                      id={`loyalty-redeem-${rew.id}-btn`}
                      disabled={!canAfford}
                      onClick={() => {
                        onRedeemReward(rew.pointsRequired, rew.title);
                        setRedeemedCode(rew.code);
                      }}
                      className={`px-3 py-2 rounded-xl text-xs font-bold shrink-0 transition ${
                        canAfford
                          ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-xs'
                          : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      {canAfford ? 'Redeem' : 'Need Points'}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
