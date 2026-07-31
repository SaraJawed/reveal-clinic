import React, { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { UserProfile } from '../../types';
import { Share2, Copy, Check, Gift, Sparkles, X } from 'lucide-react';

interface ReferralModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
}

export const ReferralModal: React.FC<ReferralModalProps> = ({ isOpen, onClose, user }) => {
  const { t } = useTranslation('payments');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(`https://revealclinic.app/invite?ref=${user.referralCode}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-100 flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-800 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <Share2 className="w-6 h-6 text-emerald-100" />
            </div>
            <div>
              <h3 className="font-extrabold text-base">{t('referral.headerTitle')}</h3>
              <p className="text-xs text-emerald-100">{t('referral.headerSubtitle')}</p>
            </div>
          </div>
          <button
            id="referral-modal-close-btn"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-center">
          <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 text-xs text-emerald-900 leading-relaxed">
            <Trans t={t} i18nKey="referral.promoText" components={{ strong: <strong /> }} />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 text-left">{t('referral.referralCodeLabel')}</label>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-slate-100 p-3 rounded-2xl font-mono font-bold text-slate-800 text-sm border border-slate-200">
                {user.referralCode}
              </div>
              <button
                id="referral-copy-code-btn"
                onClick={handleCopy}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold p-3 rounded-2xl text-xs flex items-center gap-1.5 shadow-xs shrink-0"
              >
                {copied ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? t('referral.copied') : t('referral.copyLink')}</span>
              </button>
            </div>
          </div>

          <div className="pt-2 text-[11px] text-slate-400">
            {t('referral.footerNote')}
          </div>
        </div>
      </div>
    </div>
  );
};
