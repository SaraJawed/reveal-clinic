import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Doctor, Appointment, AppointmentStatus } from '../../types';
import { MatchedTreatment } from '../../utils/chatTreatmentMatch';
import { Clock, CheckCircle2, Tag, X, ArrowRight, CalendarCheck, Sparkles, CalendarDays } from 'lucide-react';
import { calculateVoucherDiscount } from '../../utils/vouchers';
import { AvailableVouchersModal } from '../Vouchers/AvailableVouchersModal';
import { CardDetailsForm } from '../Payments/CardDetailsForm';

interface ChatBookingCardProps {
  treatment: MatchedTreatment;
  doctors: Doctor[];
  onBookAppointment: (appt: Appointment) => void;
  onDismiss: () => void;
}

type Step = 'doctor_select' | 'slots' | 'payment' | 'card_details' | 'confirmed';

export const ChatBookingCard: React.FC<ChatBookingCardProps> = ({
  treatment,
  doctors,
  onBookAppointment,
  onDismiss
}) => {
  const { t } = useTranslation('chat');
  const today = new Date().toISOString().split('T')[0];
  const [step, setStep] = useState<Step>('doctor_select');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(doctors.length === 1 ? doctors[0] : null);
  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<Appointment['paymentMethod'] | null>(null);
  const [voucherInput, setVoucherInput] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState<{ code: string; discount: number } | null>(null);
  const [voucherError, setVoucherError] = useState('');
  const [showVoucherList, setShowVoucherList] = useState(false);
  const [confirmedAppt, setConfirmedAppt] = useState<Appointment | null>(null);

  const baseFee = treatment.price;
  const finalFee = appliedVoucher ? Math.max(0, baseFee - appliedVoucher.discount) : baseFee;

  const applyVoucherCode = (rawCode: string) => {
    const code = rawCode.trim().toUpperCase();
    if (!code) return;
    const discount = calculateVoucherDiscount(code, baseFee);
    if (discount === null) {
      setVoucherError(t('chatBookingCard.invalidVoucher'));
      setAppliedVoucher(null);
      return;
    }
    setAppliedVoucher({ code, discount });
    setVoucherInput(code);
    setVoucherError('');
  };

  const handleApplyVoucher = () => applyVoucherCode(voucherInput);

  const handleRemoveVoucher = () => {
    setAppliedVoucher(null);
    setVoucherInput('');
    setVoucherError('');
  };

  const handleSelectDoctor = (doc: Doctor) => {
    setSelectedDoctor(doc);
    setStep('slots');
  };

  const handleSelectSlot = (slot: string) => {
    setSelectedSlot(slot);
    setStep('payment');
  };

  const handleConfirm = () => {
    if (!selectedDoctor || !selectedSlot || !paymentMethod) return;
    const paid = paymentMethod === 'Pay Online' || paymentMethod === 'Buy Now Pay Later';
    const status: AppointmentStatus = paymentMethod === 'Pay at Clinic' ? 'pending' : 'upcoming';

    const newAppt: Appointment = {
      id: `apt_${Date.now()}`,
      doctorId: selectedDoctor.id,
      doctorName: selectedDoctor.name,
      doctorSpecialty: selectedDoctor.specialty,
      doctorAvatar: selectedDoctor.avatarUrl,
      clinicId: selectedDoctor.clinicId,
      clinicName: selectedDoctor.clinicName,
      treatmentName: treatment.name,
      consultationType: 'Procedure',
      date: selectedDate,
      timeSlot: selectedSlot,
      status,
      fee: finalFee,
      paid,
      paymentMethod,
      voucherCode: appliedVoucher?.code,
      discountAmount: appliedVoucher?.discount,
      checkInStatus: 'pending'
    };

    onBookAppointment(newAppt);
    setConfirmedAppt(newAppt);
    setStep('confirmed');
  };

  return (
    <div className="bg-white border border-blue-100 rounded-3xl shadow-md overflow-hidden max-w-[85%] sm:max-w-[75%] text-slate-800">
      {/* Header: shows the matched treatment until a doctor is picked, then switches to the doctor */}
      <div className="flex items-center gap-2.5 p-3.5 border-b border-slate-100 bg-blue-50/50">
        {selectedDoctor ? (
          <img
            src={selectedDoctor.avatarUrl}
            alt={selectedDoctor.name}
            className="w-10 h-10 rounded-xl object-cover ring-2 ring-blue-500/20 shrink-0"
          />
        ) : (
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="font-bold text-slate-900 text-xs truncate">
            {selectedDoctor ? selectedDoctor.name : treatment.name}
          </div>
          <div className="text-[10px] text-slate-500 truncate">
            {selectedDoctor ? selectedDoctor.specialty : treatment.categoryName}
          </div>
        </div>
        {step !== 'confirmed' && (
          <button type="button" onClick={onDismiss} className="text-slate-400 hover:text-slate-600 shrink-0" title={t('chatBookingCard.dismissTitle')}>
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="p-3.5 space-y-3">
        {step === 'doctor_select' && (
          <>
            <p className="text-[11px] text-slate-500">
              {t('chatBookingCard.suggestedDoctorsFor', { treatment: treatment.name })} • <strong className="text-slate-800">{t('chatBookingCard.sarAmount', { amount: treatment.price })}</strong>
            </p>
            <div className="space-y-1.5">
              {doctors.map((doc) => (
                <button
                  key={doc.id}
                  type="button"
                  id={`chat-booking-doctor-${doc.id}-btn`}
                  onClick={() => handleSelectDoctor(doc)}
                  className="w-full flex items-center gap-2.5 p-2.5 rounded-2xl border text-left transition bg-white border-slate-200 hover:bg-blue-50 hover:border-blue-300"
                >
                  <img src={doc.avatarUrl} alt={doc.name} className="w-9 h-9 rounded-lg object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span className="font-bold text-slate-900 text-xs truncate block">{doc.name}</span>
                    <p className="text-[10px] text-slate-500 truncate">{doc.specialty}</p>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                </button>
              ))}
            </div>
          </>
        )}

        {step === 'slots' && selectedDoctor && (
          <>
            <p className="text-[11px] text-slate-500">
              {t('chatBookingCard.treatmentFeeLabel', { treatment: treatment.name })} <strong className="text-slate-800">{t('chatBookingCard.sarAmount', { amount: treatment.price })}</strong>
            </p>
            <div>
              <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5 mb-1.5">
                <CalendarDays className="w-3.5 h-3.5 text-blue-600" /> {t('chatBookingCard.chooseDateLabel')}
              </label>
              <input
                type="date"
                value={selectedDate}
                min={today}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setSelectedSlot(null);
                }}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-hidden focus:bg-white focus:border-blue-500"
              />
            </div>
            <div>
              <div className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5 mb-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-600" /> {t('chatBookingCard.availableSlotsFor', { date: selectedDate })}
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {selectedDoctor.availableTimeSlots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => handleSelectSlot(slot)}
                    className="py-2 px-1.5 rounded-lg text-[11px] font-bold border bg-slate-50 border-slate-200 text-slate-700 hover:bg-blue-50 hover:border-blue-300 transition"
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
            {doctors.length > 1 && (
              <button
                type="button"
                onClick={() => setStep('doctor_select')}
                className="w-full text-[11px] font-bold text-slate-500 hover:text-slate-700 py-1"
              >
                {t('common:buttons.back')}
              </button>
            )}
          </>
        )}

        {step === 'payment' && selectedDoctor && (
          <>
            <div className="flex items-center justify-between text-[11px] text-slate-600 bg-slate-50 rounded-lg px-2.5 py-1.5">
              <span>{t('chatBookingCard.dateAtSlot', { date: selectedDate, slot: selectedSlot })}</span>
              <span className="font-bold text-slate-900">{t('chatBookingCard.sarAmount', { amount: finalFee })}</span>
            </div>

            {/* Voucher */}
            <div className="space-y-1">
              <div className="text-[10px] font-bold text-slate-600 flex items-center gap-1">
                <Tag className="w-3 h-3 text-emerald-600" /> {t('chatBookingCard.haveVoucher')}
              </div>
              {appliedVoucher ? (
                <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-lg px-2.5 py-1.5">
                  <span className="text-[10px] font-bold text-emerald-800">
                    {t('chatBookingCard.voucherApplied', { code: appliedVoucher.code, discount: appliedVoucher.discount })}
                  </span>
                  <button type="button" onClick={handleRemoveVoucher} className="text-emerald-700 hover:text-rose-600">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    id="chat-booking-voucher-input"
                    value={voucherInput}
                    onChange={(e) => {
                      setVoucherInput(e.target.value);
                      setVoucherError('');
                    }}
                    placeholder={t('chatBookingCard.voucherPlaceholder')}
                    className="flex-1 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[11px] font-semibold outline-hidden focus:bg-white focus:border-blue-500"
                  />
                  <button
                    type="button"
                    id="chat-booking-apply-voucher-btn"
                    onClick={handleApplyVoucher}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-[11px] transition shrink-0"
                  >
                    {t('common:buttons.apply')}
                  </button>
                </div>
              )}
              {voucherError && <p className="text-[10px] text-rose-600 font-semibold">{voucherError}</p>}
              {!appliedVoucher && (
                <button
                  type="button"
                  id="chat-booking-view-vouchers-btn"
                  onClick={() => setShowVoucherList(true)}
                  className="text-[10px] font-bold text-emerald-700 hover:underline"
                >
                  {t('chatBookingCard.viewAvailableVouchers')}
                </button>
              )}
            </div>

            {/* Payment methods */}
            <div className="space-y-1.5">
              <button
                type="button"
                id="chat-booking-pay-clinic-btn"
                onClick={() => setPaymentMethod('Pay at Clinic')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-[11px] font-bold transition ${
                  paymentMethod === 'Pay at Clinic'
                    ? 'bg-slate-900 text-white ring-2 ring-offset-1 ring-slate-900'
                    : 'bg-white text-slate-700 border border-slate-200'
                }`}
              >
                <span>{t('chatBookingCard.payAtClinic')}</span>
                <span className="flex items-center gap-1">
                  {paymentMethod === 'Pay at Clinic' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                  {t('chatBookingCard.sarAmount', { amount: finalFee })}
                </span>
              </button>

              <button
                type="button"
                id="chat-booking-pay-online-btn"
                onClick={() => setPaymentMethod('Pay Online')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-[11px] font-bold transition ${
                  paymentMethod === 'Pay Online'
                    ? 'bg-blue-600 text-white ring-2 ring-offset-1 ring-blue-600'
                    : 'bg-white text-slate-700 border border-slate-200'
                }`}
              >
                <span>{t('chatBookingCard.payOnline')}</span>
                <span className="flex items-center gap-1">
                  {paymentMethod === 'Pay Online' && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                  {t('chatBookingCard.sarAmount', { amount: finalFee })}
                </span>
              </button>

              <button
                type="button"
                id="chat-booking-pay-bnpl-btn"
                onClick={() => setPaymentMethod('Buy Now Pay Later')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-[11px] font-bold transition ${
                  paymentMethod === 'Buy Now Pay Later'
                    ? 'bg-purple-600 text-white ring-2 ring-offset-1 ring-purple-600'
                    : 'bg-white text-slate-700 border border-slate-200'
                }`}
              >
                <span>{t('chatBookingCard.buyNowPayLater')}</span>
                <span className="flex items-center gap-1">
                  {paymentMethod === 'Buy Now Pay Later' && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                  {t('chatBookingCard.sarAmount', { amount: finalFee })}
                </span>
              </button>
            </div>

            <button
              type="button"
              id="chat-booking-confirm-btn"
              disabled={!paymentMethod}
              onClick={() => {
                if (paymentMethod === 'Pay Online') {
                  setStep('card_details');
                } else {
                  handleConfirm();
                }
              }}
              className={`w-full font-bold py-2.5 rounded-xl text-xs transition ${
                paymentMethod
                  ? 'bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 text-white shadow-md shadow-blue-500/30'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              {paymentMethod ? t('chatBookingCard.confirmAppointment', { amount: finalFee }) : t('chatBookingCard.selectPaymentOption')}
            </button>

            <button
              type="button"
              onClick={() => setStep('slots')}
              className="w-full text-[11px] font-bold text-slate-500 hover:text-slate-700 py-1"
            >
              {t('common:buttons.back')}
            </button>
          </>
        )}

        {step === 'card_details' && (
          <CardDetailsForm
            amount={finalFee}
            onBack={() => setStep('payment')}
            onPay={handleConfirm}
          />
        )}

        {step === 'confirmed' && confirmedAppt && selectedDoctor && (
          <div className="text-center space-y-2.5 py-1">
            <div className="w-11 h-11 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CalendarCheck className="w-6 h-6" />
            </div>
            <p className="text-xs font-bold text-slate-900">{t('chatBookingCard.appointmentConfirmed')}</p>
            <p className="text-[11px] text-slate-500">
              {t('chatBookingCard.confirmedDateWithDoctor', { date: selectedDate, slot: confirmedAppt.timeSlot, doctorName: selectedDoctor.name })}
            </p>
            <p className="text-[11px] font-bold text-slate-700">
              {t('chatBookingCard.confirmedFeeMethod', { fee: confirmedAppt.fee, method: confirmedAppt.paymentMethod })}
            </p>
            <button
              type="button"
              onClick={onDismiss}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2 rounded-xl text-xs transition"
            >
              {t('common:buttons.done')}
            </button>
          </div>
        )}
      </div>

      {showVoucherList && (
        <AvailableVouchersModal
          onSelect={(code) => {
            applyVoucherCode(code);
            setShowVoucherList(false);
          }}
          onClose={() => setShowVoucherList(false)}
        />
      )}
    </div>
  );
};
