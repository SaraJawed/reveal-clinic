import React, { useState } from 'react';
import { TreatmentService, TreatmentPackage, Doctor, Appointment } from '../../types';
import { Sparkles, Check, Clock, CheckCircle2 } from 'lucide-react';
import { BottomSheet } from '../PWA/BottomSheet';
import { DoctorSlotPicker } from '../Booking/DoctorSlotPicker';
import { PaymentOptionsSection } from '../Payments/PaymentOptionsSection';
import { CardDetailsForm } from '../Payments/CardDetailsForm';
import { calculateVoucherDiscount } from '../../utils/vouchers';
import { AvailableVouchersModal } from '../Vouchers/AvailableVouchersModal';

type PaymentMethod = NonNullable<Appointment['paymentMethod']>;
type BookingStep = 'details' | 'doctor_slot' | 'payment' | 'card_details' | 'confirmed';

interface ServicesViewProps {
  treatments: TreatmentService[];
  packages: TreatmentPackage[];
  doctors: Doctor[];
  onBookAppointment: (appt: Appointment) => void;
  onPurchasePackage: (
    pack: TreatmentPackage,
    doctor: Doctor,
    date: string,
    timeSlot: string,
    paymentMethod: PaymentMethod,
    voucher: { code: string; discount: number } | null
  ) => void;
}

const TODAY = new Date().toISOString().split('T')[0];

export const ServicesView: React.FC<ServicesViewProps> = ({
  treatments,
  packages,
  doctors,
  onBookAppointment,
  onPurchasePackage
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  // Single Treatment booking wizard
  const [selectedTreatment, setSelectedTreatment] = useState<TreatmentService | null>(null);
  const [treatmentStep, setTreatmentStep] = useState<BookingStep>('details');
  const [treatmentDoctor, setTreatmentDoctor] = useState<Doctor | null>(null);
  const [treatmentDate, setTreatmentDate] = useState(TODAY);
  const [treatmentSlot, setTreatmentSlot] = useState<string | null>(null);
  const [treatmentPaymentMethod, setTreatmentPaymentMethod] = useState<PaymentMethod | null>(null);
  const [treatmentVoucherInput, setTreatmentVoucherInput] = useState('');
  const [treatmentVoucher, setTreatmentVoucher] = useState<{ code: string; discount: number } | null>(null);
  const [treatmentVoucherError, setTreatmentVoucherError] = useState('');
  const [showTreatmentVouchers, setShowTreatmentVouchers] = useState(false);
  const [confirmedTreatmentAppt, setConfirmedTreatmentAppt] = useState<Appointment | null>(null);

  // Package purchase wizard
  const [selectedPackage, setSelectedPackage] = useState<TreatmentPackage | null>(null);
  const [packageStep, setPackageStep] = useState<BookingStep>('details');
  const [packageDoctor, setPackageDoctor] = useState<Doctor | null>(null);
  const [packageDate, setPackageDate] = useState(TODAY);
  const [packageSlot, setPackageSlot] = useState<string | null>(null);
  const [packagePaymentMethod, setPackagePaymentMethod] = useState<PaymentMethod | null>(null);
  const [packageVoucherInput, setPackageVoucherInput] = useState('');
  const [packageVoucher, setPackageVoucher] = useState<{ code: string; discount: number } | null>(null);
  const [packageVoucherError, setPackageVoucherError] = useState('');
  const [showPackageVouchers, setShowPackageVouchers] = useState(false);
  const [confirmedPackagePurchase, setConfirmedPackagePurchase] = useState<{
    pack: TreatmentPackage;
    doctor: Doctor;
    date: string;
    slot: string;
    paymentMethod: PaymentMethod;
    finalPrice: number;
  } | null>(null);

  const categories = ['All', 'Medical Aesthetics', 'Laser Treatments', 'Injectables', 'Anti-Aging', 'Body Contouring'];

  const filteredTreatments = treatments.filter(t => {
    if (activeCategory === 'All') return true;
    return t.categoryName.toLowerCase() === activeCategory.toLowerCase();
  });

  const resetTreatmentFlow = () => {
    setSelectedTreatment(null);
    setTreatmentStep('details');
    setTreatmentDoctor(null);
    setTreatmentDate(TODAY);
    setTreatmentSlot(null);
    setTreatmentPaymentMethod(null);
    setTreatmentVoucherInput('');
    setTreatmentVoucher(null);
    setTreatmentVoucherError('');
    setShowTreatmentVouchers(false);
    setConfirmedTreatmentAppt(null);
  };

  const resetPackageFlow = () => {
    setSelectedPackage(null);
    setPackageStep('details');
    setPackageDoctor(null);
    setPackageDate(TODAY);
    setPackageSlot(null);
    setPackagePaymentMethod(null);
    setPackageVoucherInput('');
    setPackageVoucher(null);
    setPackageVoucherError('');
    setShowPackageVouchers(false);
    setConfirmedPackagePurchase(null);
  };

  const applyTreatmentVoucher = (rawCode: string, fee: number) => {
    const code = rawCode.trim().toUpperCase();
    if (!code) return;
    const discount = calculateVoucherDiscount(code, fee);
    if (discount === null) {
      setTreatmentVoucherError('Invalid or expired voucher code.');
      setTreatmentVoucher(null);
      return;
    }
    setTreatmentVoucher({ code, discount });
    setTreatmentVoucherInput(code);
    setTreatmentVoucherError('');
  };

  const applyPackageVoucher = (rawCode: string, fee: number) => {
    const code = rawCode.trim().toUpperCase();
    if (!code) return;
    const discount = calculateVoucherDiscount(code, fee);
    if (discount === null) {
      setPackageVoucherError('Invalid or expired voucher code.');
      setPackageVoucher(null);
      return;
    }
    setPackageVoucher({ code, discount });
    setPackageVoucherInput(code);
    setPackageVoucherError('');
  };

  const getTreatmentFinalFee = () => {
    if (!selectedTreatment) return 0;
    return Math.max(0, selectedTreatment.price - (treatmentVoucher?.discount || 0));
  };

  const getPackageFinalFee = () => {
    if (!selectedPackage) return 0;
    return Math.max(0, selectedPackage.price - (packageVoucher?.discount || 0));
  };

  const handleConfirmTreatmentBooking = () => {
    if (!selectedTreatment || !treatmentDoctor || !treatmentSlot || !treatmentPaymentMethod) return;
    const fee = getTreatmentFinalFee();
    const paid = treatmentPaymentMethod !== 'Pay at Clinic';

    const newAppt: Appointment = {
      id: `apt_${Date.now()}`,
      doctorId: treatmentDoctor.id,
      doctorName: treatmentDoctor.name,
      doctorSpecialty: treatmentDoctor.specialty,
      doctorAvatar: treatmentDoctor.avatarUrl,
      clinicId: treatmentDoctor.clinicId,
      clinicName: treatmentDoctor.clinicName,
      treatmentName: selectedTreatment.name,
      consultationType: 'Procedure',
      date: treatmentDate,
      timeSlot: treatmentSlot,
      status: treatmentPaymentMethod === 'Pay at Clinic' ? 'pending' : 'upcoming',
      fee,
      paid,
      paymentMethod: treatmentPaymentMethod,
      voucherCode: treatmentVoucher?.code,
      discountAmount: treatmentVoucher?.discount,
      checkInStatus: 'pending'
    };

    onBookAppointment(newAppt);
    setConfirmedTreatmentAppt(newAppt);
    setTreatmentStep('confirmed');
  };

  const handleConfirmPackagePurchase = () => {
    if (!selectedPackage || !packageDoctor || !packageSlot || !packagePaymentMethod) return;
    const finalPrice = getPackageFinalFee();
    onPurchasePackage(selectedPackage, packageDoctor, packageDate, packageSlot, packagePaymentMethod, packageVoucher);
    setConfirmedPackagePurchase({
      pack: selectedPackage,
      doctor: packageDoctor,
      date: packageDate,
      slot: packageSlot,
      paymentMethod: packagePaymentMethod,
      finalPrice
    });
    setPackageStep('confirmed');
  };

  return (
    <div className="space-y-6 pb-24 md:pb-8">
      {/* Header & Categories */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3">
        <div>
          <h1 className="text-lg font-bold text-slate-900">Treatments, Services & Packages</h1>
          <p className="text-xs text-slate-500">Explore FDA-approved dermatology & aesthetic procedures.</p>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {categories.map((cat) => (
            <button
              key={cat}
              id={`services-cat-${cat}-btn`}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                activeCategory === cat
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* SECTION 1: VALUE PACKAGES & MEMBERSHIP PLANS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-sky-500" /> Treatment Packages & Savings Packs
          </h2>
          <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            Save up to 22%
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {packages.map((pack) => (
            <button
              key={pack.id}
              type="button"
              id={`services-pack-${pack.id}-btn`}
              onClick={() => setSelectedPackage(pack)}
              className="text-left bg-gradient-to-b from-slate-900 via-slate-900 to-blue-950 text-white rounded-3xl p-5 border border-slate-800 shadow-lg flex flex-col justify-between relative overflow-hidden hover:shadow-xl hover:-translate-y-0.5 transition"
            >
              <div className="absolute top-3 right-3 bg-emerald-500 text-slate-950 font-extrabold text-[10px] px-2.5 py-0.5 rounded-full">
                SAVE {pack.savingsPercentage}%
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400">
                  {pack.totalSessions} Sessions Pack
                </span>
                <h3 className="font-bold text-base text-white">{pack.name}</h3>
                <p className="text-xs text-slate-300 leading-tight">{pack.tagline}</p>

                <div className="pt-2 space-y-1">
                  {pack.includedTreatments.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-200">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 line-through block">SAR {pack.originalValue}</span>
                  <span className="font-extrabold text-white text-lg">SAR {pack.price}</span>
                </div>
                <span className="bg-sky-400 text-slate-950 font-bold px-4 py-2 rounded-2xl text-xs shadow-md">
                  Purchase Package
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* SECTION 2: INDIVIDUAL TREATMENTS GRID */}
      <div className="space-y-3 pt-2">
        <h2 className="text-sm font-bold text-slate-900 px-1">
          Single Treatments & Clinical Procedures ({filteredTreatments.length})
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTreatments.map((treat) => (
            <div
              key={treat.id}
              className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col justify-between hover:shadow-md transition p-4 space-y-3"
            >
              <div className="flex items-start gap-3.5">
                <img
                  src={treat.imageUrl}
                  alt={treat.name}
                  className="w-20 h-20 rounded-2xl object-cover ring-2 ring-blue-500/10 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full uppercase">
                      {treat.categoryName}
                    </span>
                    <span className="font-extrabold text-slate-900 text-sm">SAR {treat.price}</span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm mt-1">{treat.name}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">{treat.shortDescription}</p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-blue-500" /> {treat.durationMinutes} Minutes
                </span>
                <div className="flex items-center gap-2">
                  <button
                    id={`services-details-${treat.id}-btn`}
                    onClick={() => setSelectedTreatment(treat)}
                    className="text-slate-600 hover:text-slate-900 font-bold px-2 py-1"
                  >
                    Details
                  </button>
                  <button
                    id={`services-book-now-${treat.id}-btn`}
                    onClick={() => {
                      setSelectedTreatment(treat);
                      setTreatmentStep('doctor_slot');
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-1.5 rounded-xl transition shadow-xs"
                  >
                    Book
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SINGLE TREATMENT BOOKING SHEET */}
      <BottomSheet
        isOpen={!!selectedTreatment}
        onClose={resetTreatmentFlow}
        title={selectedTreatment?.name}
        subtitle={
          treatmentStep === 'details'
            ? selectedTreatment?.categoryName
            : treatmentStep === 'doctor_slot'
              ? 'Choose a doctor, date & time slot.'
              : treatmentStep === 'card_details'
                ? 'Enter your card details to complete payment.'
                : treatmentStep === 'payment'
                  ? 'Review booking summary & select payment option.'
                  : undefined
        }
      >
        {selectedTreatment && treatmentStep === 'details' && (
          <div className="space-y-4">
            <img
              src={selectedTreatment.imageUrl}
              alt={selectedTreatment.name}
              className="w-full h-44 rounded-2xl object-cover shadow-sm"
            />
            <p className="text-xs text-slate-600 leading-relaxed">{selectedTreatment.fullDescription}</p>

            <div className="bg-blue-50 p-3 rounded-2xl border border-blue-200/60 space-y-1.5">
              <h4 className="font-bold text-blue-900 text-xs">Key Treatment Benefits</h4>
              {selectedTreatment.benefits.map((b, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-slate-700">
                  <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" /> {b}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <strong className="block text-slate-800 text-[11px]">Pre-Care Guidance:</strong>
                <span className="text-slate-600 text-[11px]">{selectedTreatment.preCare}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <strong className="block text-slate-800 text-[11px]">Post-Care Guidance:</strong>
                <span className="text-slate-600 text-[11px]">{selectedTreatment.postCare}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="font-extrabold text-slate-900 text-lg">SAR {selectedTreatment.price}</span>
              <button
                id="services-sheet-book-btn"
                onClick={() => setTreatmentStep('doctor_slot')}
                className="bg-blue-600 text-white font-bold px-6 py-3 rounded-2xl text-xs shadow-md"
              >
                Schedule Appointment
              </button>
            </div>
          </div>
        )}

        {selectedTreatment && treatmentStep === 'doctor_slot' && (
          <div className="space-y-4">
            <DoctorSlotPicker
              doctors={doctors}
              selectedDoctor={treatmentDoctor}
              onSelectDoctor={setTreatmentDoctor}
              selectedDate={treatmentDate}
              onChangeDate={setTreatmentDate}
              selectedSlot={treatmentSlot}
              onChangeSlot={setTreatmentSlot}
              minDate={TODAY}
            />
            <button
              type="button"
              id="services-treatment-continue-btn"
              disabled={!treatmentDoctor || !treatmentSlot}
              onClick={() => setTreatmentStep('payment')}
              className={`w-full font-bold py-3.5 rounded-2xl text-xs shadow-md transition ${
                treatmentDoctor && treatmentSlot
                  ? 'bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 text-white shadow-blue-500/30'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
              }`}
            >
              Continue to Payment
            </button>
          </div>
        )}

        {selectedTreatment && treatmentDoctor && treatmentStep === 'payment' && (
          <div className="space-y-4">
            <div className="bg-slate-900 text-white p-4 rounded-2xl space-y-2 text-xs">
              <div className="flex justify-between">
                <span>Treatment:</span>
                <span className="font-bold">{selectedTreatment.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Doctor:</span>
                <span className="font-bold">{treatmentDoctor.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Date & Time:</span>
                <span className="font-bold">{treatmentDate} at {treatmentSlot}</span>
              </div>
              {treatmentVoucher && (
                <div className="flex justify-between text-emerald-400 pt-1 border-t border-slate-800">
                  <span>Voucher Discount:</span>
                  <span>-SAR {treatmentVoucher.discount}</span>
                </div>
              )}
              <div className="flex justify-between font-bold pt-1 border-t border-slate-800">
                <span>Total:</span>
                <span className="text-sky-400">SAR {getTreatmentFinalFee()}</span>
              </div>
            </div>

            <PaymentOptionsSection
              fee={getTreatmentFinalFee()}
              selectedMethod={treatmentPaymentMethod}
              onSelectMethod={setTreatmentPaymentMethod}
              voucherInput={treatmentVoucherInput}
              onVoucherInputChange={(v) => {
                setTreatmentVoucherInput(v);
                setTreatmentVoucherError('');
              }}
              appliedVoucher={treatmentVoucher}
              onApplyVoucher={() => applyTreatmentVoucher(treatmentVoucherInput, selectedTreatment.price)}
              onRemoveVoucher={() => {
                setTreatmentVoucher(null);
                setTreatmentVoucherInput('');
                setTreatmentVoucherError('');
              }}
              voucherError={treatmentVoucherError}
              onViewAvailableVouchers={() => setShowTreatmentVouchers(true)}
            />

            <button
              type="button"
              id="services-treatment-confirm-btn"
              disabled={!treatmentPaymentMethod}
              onClick={() => {
                if (treatmentPaymentMethod === 'Pay Online') {
                  setTreatmentStep('card_details');
                } else {
                  handleConfirmTreatmentBooking();
                }
              }}
              className={`w-full font-bold py-3.5 rounded-2xl text-xs shadow-md transition ${
                treatmentPaymentMethod
                  ? 'bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 text-white shadow-blue-500/30'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
              }`}
            >
              {treatmentPaymentMethod ? `Confirm Booking — SAR ${getTreatmentFinalFee()}` : 'Select a Payment Option to Continue'}
            </button>

            <button
              type="button"
              onClick={() => setTreatmentStep('doctor_slot')}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl text-xs transition"
            >
              Back
            </button>
          </div>
        )}

        {selectedTreatment && treatmentStep === 'card_details' && (
          <CardDetailsForm
            amount={getTreatmentFinalFee()}
            onBack={() => setTreatmentStep('payment')}
            onPay={handleConfirmTreatmentBooking}
          />
        )}

        {treatmentStep === 'confirmed' && confirmedTreatmentAppt && (
          <div className="text-center space-y-3 py-2">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <p className="text-sm font-bold text-slate-900">Appointment Booked!</p>
            <div className="bg-slate-50 p-4 rounded-2xl text-xs space-y-1.5 text-left border border-slate-200">
              <div>💉 <strong>Treatment:</strong> {confirmedTreatmentAppt.treatmentName}</div>
              <div>👨‍⚕️ <strong>Doctor:</strong> {confirmedTreatmentAppt.doctorName}</div>
              <div>🗓️ <strong>Date:</strong> {confirmedTreatmentAppt.date} at {confirmedTreatmentAppt.timeSlot}</div>
              <div>💳 <strong>Fee / Method:</strong> SAR {confirmedTreatmentAppt.fee} ({confirmedTreatmentAppt.paymentMethod})</div>
              {confirmedTreatmentAppt.voucherCode && (
                <div>🏷️ <strong>Voucher:</strong> {confirmedTreatmentAppt.voucherCode} (-SAR {confirmedTreatmentAppt.discountAmount})</div>
              )}
            </div>
            <button
              type="button"
              id="services-treatment-done-btn"
              onClick={resetTreatmentFlow}
              className="w-full bg-blue-600 text-white font-bold py-3 rounded-2xl text-xs shadow-md"
            >
              Done
            </button>
          </div>
        )}
      </BottomSheet>

      {showTreatmentVouchers && (
        <AvailableVouchersModal
          onSelect={(code) => {
            if (selectedTreatment) applyTreatmentVoucher(code, selectedTreatment.price);
            setShowTreatmentVouchers(false);
          }}
          onClose={() => setShowTreatmentVouchers(false)}
        />
      )}

      {/* PACKAGE PURCHASE SHEET */}
      <BottomSheet
        isOpen={!!selectedPackage}
        onClose={resetPackageFlow}
        title={selectedPackage?.name}
        subtitle={
          packageStep === 'details'
            ? 'Package Details'
            : packageStep === 'doctor_slot'
              ? 'Choose a doctor, date & time slot for your first session.'
              : packageStep === 'card_details'
                ? 'Enter your card details to complete payment.'
                : packageStep === 'payment'
                  ? 'Review booking summary & select payment option.'
                  : undefined
        }
      >
        {selectedPackage && packageStep === 'details' && (
          <div className="space-y-4">
            <div className="bg-slate-900 text-white p-4 rounded-2xl space-y-2">
              <p className="text-xs text-slate-300">{selectedPackage.description}</p>
              <div className="pt-2 space-y-1">
                {selectedPackage.includedTreatments.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-slate-200">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-xs pt-2 border-t border-slate-800">
                <span>Total Package Price:</span>
                <span className="font-bold text-sky-400">SAR {selectedPackage.price}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>Original Value:</span>
                <span className="line-through text-slate-400">SAR {selectedPackage.originalValue}</span>
              </div>
              <div className="flex justify-between text-xs font-bold text-emerald-400 pt-1 border-t border-slate-800">
                <span>Your Total Savings:</span>
                <span>SAR {selectedPackage.originalValue - selectedPackage.price} ({selectedPackage.savingsPercentage}%)</span>
              </div>
            </div>

            <p className="text-xs text-slate-500">
              Purchasing this package adds <strong>{selectedPackage.totalSessions} sessions</strong> to your active user account, valid for {selectedPackage.validityMonths} months across all Reveal Clinic locations.
            </p>

            <button
              type="button"
              id="services-package-book-btn"
              onClick={() => setPackageStep('doctor_slot')}
              className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-2xl text-xs shadow-md shadow-blue-500/25"
            >
              Book First Session
            </button>
          </div>
        )}

        {selectedPackage && packageStep === 'doctor_slot' && (
          <div className="space-y-4">
            <DoctorSlotPicker
              doctors={doctors}
              selectedDoctor={packageDoctor}
              onSelectDoctor={setPackageDoctor}
              selectedDate={packageDate}
              onChangeDate={setPackageDate}
              selectedSlot={packageSlot}
              onChangeSlot={setPackageSlot}
              minDate={TODAY}
            />
            <button
              type="button"
              id="services-package-continue-btn"
              disabled={!packageDoctor || !packageSlot}
              onClick={() => setPackageStep('payment')}
              className={`w-full font-bold py-3.5 rounded-2xl text-xs shadow-md transition ${
                packageDoctor && packageSlot
                  ? 'bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 text-white shadow-blue-500/30'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
              }`}
            >
              Continue to Payment
            </button>
            <button
              type="button"
              onClick={() => setPackageStep('details')}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl text-xs transition"
            >
              Back
            </button>
          </div>
        )}

        {selectedPackage && packageDoctor && packageStep === 'payment' && (
          <div className="space-y-4">
            <div className="bg-slate-900 text-white p-4 rounded-2xl space-y-2 text-xs">
              <div className="flex justify-between">
                <span>Package:</span>
                <span className="font-bold">{selectedPackage.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Doctor:</span>
                <span className="font-bold">{packageDoctor.name}</span>
              </div>
              <div className="flex justify-between">
                <span>First Session:</span>
                <span className="font-bold">{packageDate} at {packageSlot}</span>
              </div>
              {packageVoucher && (
                <div className="flex justify-between text-emerald-400 pt-1 border-t border-slate-800">
                  <span>Voucher Discount:</span>
                  <span>-SAR {packageVoucher.discount}</span>
                </div>
              )}
              <div className="flex justify-between font-bold pt-1 border-t border-slate-800">
                <span>Total:</span>
                <span className="text-sky-400">SAR {getPackageFinalFee()}</span>
              </div>
            </div>

            <PaymentOptionsSection
              fee={getPackageFinalFee()}
              selectedMethod={packagePaymentMethod}
              onSelectMethod={setPackagePaymentMethod}
              voucherInput={packageVoucherInput}
              onVoucherInputChange={(v) => {
                setPackageVoucherInput(v);
                setPackageVoucherError('');
              }}
              appliedVoucher={packageVoucher}
              onApplyVoucher={() => applyPackageVoucher(packageVoucherInput, selectedPackage.price)}
              onRemoveVoucher={() => {
                setPackageVoucher(null);
                setPackageVoucherInput('');
                setPackageVoucherError('');
              }}
              voucherError={packageVoucherError}
              onViewAvailableVouchers={() => setShowPackageVouchers(true)}
            />

            <button
              type="button"
              id="services-package-confirm-btn"
              disabled={!packagePaymentMethod}
              onClick={() => {
                if (packagePaymentMethod === 'Pay Online') {
                  setPackageStep('card_details');
                } else {
                  handleConfirmPackagePurchase();
                }
              }}
              className={`w-full font-bold py-3.5 rounded-2xl text-xs shadow-md transition ${
                packagePaymentMethod
                  ? 'bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 text-white shadow-blue-500/30'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
              }`}
            >
              {packagePaymentMethod ? `Confirm Purchase — SAR ${getPackageFinalFee()}` : 'Select a Payment Option to Continue'}
            </button>

            <button
              type="button"
              onClick={() => setPackageStep('doctor_slot')}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl text-xs transition"
            >
              Back
            </button>
          </div>
        )}

        {selectedPackage && packageStep === 'card_details' && (
          <CardDetailsForm
            amount={getPackageFinalFee()}
            onBack={() => setPackageStep('payment')}
            onPay={handleConfirmPackagePurchase}
          />
        )}

        {packageStep === 'confirmed' && confirmedPackagePurchase && (
          <div className="text-center space-y-3 py-2">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <p className="text-sm font-bold text-slate-900">Package Purchased!</p>
            <div className="bg-slate-50 p-4 rounded-2xl text-xs space-y-1.5 text-left border border-slate-200">
              <div>📦 <strong>Package:</strong> {confirmedPackagePurchase.pack.name} ({confirmedPackagePurchase.pack.totalSessions} sessions)</div>
              <div>👨‍⚕️ <strong>First Session Doctor:</strong> {confirmedPackagePurchase.doctor.name}</div>
              <div>🗓️ <strong>Date:</strong> {confirmedPackagePurchase.date} at {confirmedPackagePurchase.slot}</div>
              <div>💳 <strong>Fee / Method:</strong> SAR {confirmedPackagePurchase.finalPrice} ({confirmedPackagePurchase.paymentMethod})</div>
            </div>
            <button
              type="button"
              id="services-package-done-btn"
              onClick={resetPackageFlow}
              className="w-full bg-blue-600 text-white font-bold py-3 rounded-2xl text-xs shadow-md"
            >
              Done
            </button>
          </div>
        )}
      </BottomSheet>

      {showPackageVouchers && (
        <AvailableVouchersModal
          onSelect={(code) => {
            if (selectedPackage) applyPackageVoucher(code, selectedPackage.price);
            setShowPackageVouchers(false);
          }}
          onClose={() => setShowPackageVouchers(false)}
        />
      )}
    </div>
  );
};
