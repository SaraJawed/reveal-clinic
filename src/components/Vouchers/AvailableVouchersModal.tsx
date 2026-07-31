import React from 'react';
import { useTranslation } from 'react-i18next';
import { loyaltyRewards } from '../../data/mockData';
import { Gift, Tag, X } from 'lucide-react';

interface AvailableVouchersModalProps {
  onSelect: (code: string) => void;
  onClose: () => void;
}

export const AvailableVouchersModal: React.FC<AvailableVouchersModalProps> = ({ onSelect, onClose }) => {
  const { t } = useTranslation('payments');
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm max-h-[80vh] flex flex-col border border-slate-100">
        <div className="flex items-center justify-between p-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2">
            <Gift className="w-4 h-4 text-emerald-600" />
            <h3 className="font-extrabold text-sm text-slate-900">{t('vouchers.availableVouchers')}</h3>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4 overflow-y-auto flex-1 space-y-2.5">
          {loyaltyRewards.map((rew) => (
            <button
              key={rew.id}
              type="button"
              id={`available-voucher-${rew.id}-btn`}
              onClick={() => onSelect(rew.code)}
              className="w-full text-left bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-2xl p-3.5 transition"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full uppercase">
                  {rew.category}
                </span>
                <span className="text-xs font-black text-emerald-700">{rew.discountValue}</span>
              </div>
              <h4 className="font-bold text-slate-900 text-xs mt-1.5">{rew.title}</h4>
              <div className="mt-2 inline-flex items-center gap-1.5 bg-slate-900 text-white text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg">
                <Tag className="w-3 h-3" /> {rew.code}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
