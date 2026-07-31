import React from 'react';
import { useTranslation } from 'react-i18next';
import { Appointment } from '../../types';
import { Tag, X, CheckCircle2 } from 'lucide-react';

type PaymentMethod = NonNullable<Appointment['paymentMethod']>;

interface PaymentOptionsSectionProps {
  fee: number;
  selectedMethod: PaymentMethod | null;
  onSelectMethod: (method: PaymentMethod) => void;
  voucherInput: string;
  onVoucherInputChange: (value: string) => void;
  appliedVoucher: { code: string; discount: number } | null;
  onApplyVoucher: () => void;
  onRemoveVoucher: () => void;
  voucherError: string;
  onViewAvailableVouchers: () => void;
}

export const PaymentOptionsSection: React.FC<PaymentOptionsSectionProps> = ({
  fee,
  selectedMethod,
  onSelectMethod,
  voucherInput,
  onVoucherInputChange,
  appliedVoucher,
  onApplyVoucher,
  onRemoveVoucher,
  voucherError,
  onViewAvailableVouchers
}) => {
  const { t } = useTranslation('payments');
  return (
    <div className="space-y-4">
      {/* Voucher Code */}
      <div className="bg-white border border-slate-200 rounded-2xl p-3.5 space-y-2">
        <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
          <Tag className="w-3.5 h-3.5 text-emerald-600" />
          <span>{t('paymentOptions.haveVoucher')}</span>
        </div>
        {appliedVoucher ? (
          <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2">
            <span className="text-xs font-bold text-emerald-800">
              {t('paymentOptions.voucherApplied', { code: appliedVoucher.code, discount: appliedVoucher.discount })}
            </span>
            <button type="button" onClick={onRemoveVoucher} className="text-emerald-700 hover:text-rose-600 transition">
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <input
              type="text"
              value={voucherInput}
              onChange={(e) => onVoucherInputChange(e.target.value)}
              placeholder={t('paymentOptions.voucherPlaceholder')}
              className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-hidden focus:bg-white focus:border-blue-500"
            />
            <button
              type="button"
              onClick={onApplyVoucher}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition shrink-0"
            >
              {t('common:buttons.apply')}
            </button>
          </div>
        )}
        {voucherError && <p className="text-[11px] text-rose-600 font-semibold">{voucherError}</p>}
        {!appliedVoucher && (
          <button
            type="button"
            onClick={onViewAvailableVouchers}
            className="text-[11px] font-bold text-emerald-700 hover:underline"
          >
            {t('paymentOptions.viewAvailableVouchers')}
          </button>
        )}
      </div>

      <div className="space-y-2.5">
        <div className="text-xs font-bold text-slate-700">{t('paymentOptions.selectPaymentOption')}</div>

        <button
          type="button"
          onClick={() => onSelectMethod('Pay at Clinic')}
          className={`w-full font-bold py-3.5 px-4 rounded-2xl text-xs flex items-center justify-between transition ${
            selectedMethod === 'Pay at Clinic'
              ? 'bg-slate-900 text-white shadow-md ring-2 ring-offset-2 ring-slate-900'
              : 'bg-white text-slate-700 border-2 border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <span className="text-base">🏥</span>
            <div className="text-left">
              <div className="font-bold">{t('paymentOptions.payAtClinicTitle')}</div>
              <div className={`text-[10px] font-normal ${selectedMethod === 'Pay at Clinic' ? 'text-slate-300' : 'text-slate-500'}`}>
                {t('paymentOptions.payAtClinicDescription')}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {selectedMethod === 'Pay at Clinic' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
            <span className={`text-xs px-2.5 py-1 rounded-xl ${selectedMethod === 'Pay at Clinic' ? 'bg-slate-800' : 'bg-slate-100'}`}>
              {t('paymentOptions.sarAmount', { amount: fee })}
            </span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onSelectMethod('Pay Online')}
          className={`w-full font-bold py-3.5 px-4 rounded-2xl text-xs flex items-center justify-between transition ${
            selectedMethod === 'Pay Online'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 ring-2 ring-offset-2 ring-blue-600'
              : 'bg-white text-slate-700 border-2 border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <span className="text-base">💳</span>
            <div className="text-left">
              <div className="font-bold">{t('paymentOptions.payOnlineTitle')}</div>
              <div className={`text-[10px] font-normal ${selectedMethod === 'Pay Online' ? 'text-blue-100' : 'text-slate-500'}`}>
                {t('paymentOptions.payOnlineDescription')}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {selectedMethod === 'Pay Online' && <CheckCircle2 className="w-4 h-4 text-white" />}
            <span className={`text-xs px-2.5 py-1 rounded-xl ${selectedMethod === 'Pay Online' ? 'bg-blue-700' : 'bg-slate-100'}`}>
              {t('paymentOptions.sarAmount', { amount: fee })}
            </span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onSelectMethod('Buy Now Pay Later')}
          className={`w-full font-bold py-3.5 px-4 rounded-2xl text-xs flex items-center justify-between transition ${
            selectedMethod === 'Buy Now Pay Later'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-500/25 ring-2 ring-offset-2 ring-purple-600'
              : 'bg-white text-slate-700 border-2 border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <span className="text-base">🛍️</span>
            <div className="text-left">
              <div className="font-bold">{t('paymentOptions.bnplTitle')}</div>
              <div className={`text-[10px] font-normal ${selectedMethod === 'Buy Now Pay Later' ? 'text-purple-100' : 'text-slate-500'}`}>
                {t('paymentOptions.bnplDescription')}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {selectedMethod === 'Buy Now Pay Later' && <CheckCircle2 className="w-4 h-4 text-white" />}
            <span className={`text-xs px-2.5 py-1 rounded-xl ${selectedMethod === 'Buy Now Pay Later' ? 'bg-purple-700' : 'bg-slate-100'}`}>
              {t('paymentOptions.sarAmount', { amount: fee })}
            </span>
          </div>
        </button>
      </div>
    </div>
  );
};
