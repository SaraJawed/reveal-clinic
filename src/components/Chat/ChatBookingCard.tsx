import React, { useState } from 'react';
import { Doctor, ClinicBranch, Appointment, AppointmentStatus } from '../../types';
import { Star, Clock, CheckCircle2, Tag, X, ArrowRight, CalendarCheck } from 'lucide-react';
import { calculateVoucherDiscount } from '../../utils/vouchers';
import { AvailableVouchersModal } from '../Vouchers/AvailableVouchersModal';

interface ChatBookingCardProps {
  doctor: Doctor;
  selectedBranch: ClinicBranch;
  onBookAppointment: (appt: Appointment) => void;
  onDismiss: () => void;
}

type Step = 'suggestion' | 'slots' | 'payment' | 'confirmed';

export const ChatBookingCard: React.FC<ChatBookingCardProps> = ({
  doctor,
  selectedBranch,
  onBookAppointment,
  onDismiss
}) => {
  const [step, setStep] = useState<Step>('suggestion');
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<Appointment['paymentMethod'] | null>(null);
  const [voucherInput, setVoucherInput] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState<{ code: string; discount: number } | null>(null);
  const [voucherError, setVoucherError] = useState('');
  const [showVoucherList, setShowVoucherList] = useState(false);
  const [confirmedAppt, setConfirmedAppt] = useState<Appointment | null>(null);

  const baseFee = doctor.consultationFee;
  const finalFee = appliedVoucher ? Math.max(0, baseFee - appliedVoucher.discount) : baseFee;
  const today = new Date().toISOString().split('T')[0];

  const applyVoucherCode = (rawCode: string) => {
    const code = rawCode.trim().toUpperCase();
    if (!code) return;
    const discount = calculateVoucherDiscount(code, baseFee);
    if (discount === null) {
      setVoucherError('Invalid or expired voucher code.');
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

  const handleConfirm = () => {
    if (!selectedSlot || !paymentMethod) return;
    const paid = paymentMethod === 'Pay Online' || paymentMethod === 'Buy Now Pay Later';
    const status: AppointmentStatus = paymentMethod === 'Pay at Clinic' ? 'pending' : 'upcoming';

    const newAppt: Appointment = {
      id: `apt_${Date.now()}`,
      doctorId: doctor.id,
      doctorName: doctor.name,
      doctorSpecialty: doctor.specialty,
      doctorAvatar: doctor.avatarUrl,
      clinicId: doctor.clinicId,
      clinicName: doctor.clinicName,
      treatmentName: 'In-Clinic Consultation',
      consultationType: 'In-Clinic Consultation',
      date: today,
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
      {/* Doctor header, shown at every step */}
      <div className="flex items-center gap-2.5 p-3.5 border-b border-slate-100 bg-blue-50/50">
        <img
          src={doctor.avatarUrl}
          alt={doctor.name}
          className="w-10 h-10 rounded-xl object-cover ring-2 ring-blue-500/20 shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="font-bold text-slate-900 text-xs truncate">{doctor.name}</div>
          <div className="text-[10px] text-slate-500 truncate">{doctor.specialty}</div>
        </div>
        {step !== 'confirmed' && (
          <button type="button" onClick={onDismiss} className="text-slate-400 hover:text-slate-600 shrink-0" title="Dismiss">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="p-3.5 space-y-3">
        {step === 'suggestion' && (
          <>
            <div className="flex items-center gap-1.5 text-[11px] text-amber-700 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {doctor.rating} ({doctor.reviewCount} Reviews)
            </div>
            <p className="text-[11px] text-slate-500">
              {selectedBranch.name} • Consultation Fee: <strong className="text-slate-800">SAR {doctor.consultationFee}</strong>
            </p>
            <button
              type="button"
              id="chat-booking-start-btn"
              onClick={() => setStep('slots')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-xs shadow-xs transition flex items-center justify-center gap-1.5"
            >
              Book Appointment <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </>
        )}

        {step === 'slots' && (
          <>
            <div className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-600" /> Available Time Slots Today
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {doctor.availableTimeSlots.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => {
                    setSelectedSlot(slot);
                    setStep('payment');
                  }}
                  className="py-2 px-1.5 rounded-lg text-[11px] font-bold border bg-slate-50 border-slate-200 text-slate-700 hover:bg-blue-50 hover:border-blue-300 transition"
                >
                  {slot}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setStep('suggestion')}
              className="w-full text-[11px] font-bold text-slate-500 hover:text-slate-700 py-1"
            >
              Back
            </button>
          </>
        )}

        {step === 'payment' && (
          <>
            <div className="flex items-center justify-between text-[11px] text-slate-600 bg-slate-50 rounded-lg px-2.5 py-1.5">
              <span>🗓️ {today} at {selectedSlot}</span>
              <span className="font-bold text-slate-900">SAR {finalFee}</span>
            </div>

            {/* Voucher */}
            <div className="space-y-1">
              <div className="text-[10px] font-bold text-slate-600 flex items-center gap-1">
                <Tag className="w-3 h-3 text-emerald-600" /> Have a Voucher Code?
              </div>
              {appliedVoucher ? (
                <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-lg px-2.5 py-1.5">
                  <span className="text-[10px] font-bold text-emerald-800">
                    {appliedVoucher.code} applied (-SAR {appliedVoucher.discount})
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
                    placeholder="e.g. GLOW10"
                    className="flex-1 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[11px] font-semibold outline-hidden focus:bg-white focus:border-blue-500"
                  />
                  <button
                    type="button"
                    id="chat-booking-apply-voucher-btn"
                    onClick={handleApplyVoucher}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-[11px] transition shrink-0"
                  >
                    Apply
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
                  View Available Vouchers
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
                <span>🏥 Pay at Clinic</span>
                <span className="flex items-center gap-1">
                  {paymentMethod === 'Pay at Clinic' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                  SAR {finalFee}
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
                <span>💳 Pay Online</span>
                <span className="flex items-center gap-1">
                  {paymentMethod === 'Pay Online' && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                  SAR {finalFee}
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
                <span>🛍️ Buy Now, Pay Later</span>
                <span className="flex items-center gap-1">
                  {paymentMethod === 'Buy Now Pay Later' && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                  SAR {finalFee}
                </span>
              </button>
            </div>

            <button
              type="button"
              id="chat-booking-confirm-btn"
              disabled={!paymentMethod}
              onClick={handleConfirm}
              className={`w-full font-bold py-2.5 rounded-xl text-xs transition ${
                paymentMethod
                  ? 'bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 text-white shadow-md shadow-blue-500/30'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              {paymentMethod ? `Confirm Appointment — SAR ${finalFee}` : 'Select a Payment Option'}
            </button>

            <button
              type="button"
              onClick={() => setStep('slots')}
              className="w-full text-[11px] font-bold text-slate-500 hover:text-slate-700 py-1"
            >
              Back
            </button>
          </>
        )}

        {step === 'confirmed' && confirmedAppt && (
          <div className="text-center space-y-2.5 py-1">
            <div className="w-11 h-11 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CalendarCheck className="w-6 h-6" />
            </div>
            <p className="text-xs font-bold text-slate-900">Appointment Confirmed!</p>
            <p className="text-[11px] text-slate-500">
              {today} at {confirmedAppt.timeSlot} with {doctor.name}
            </p>
            <p className="text-[11px] font-bold text-slate-700">
              SAR {confirmedAppt.fee} ({confirmedAppt.paymentMethod})
            </p>
            <button
              type="button"
              onClick={onDismiss}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2 rounded-xl text-xs transition"
            >
              Done
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
