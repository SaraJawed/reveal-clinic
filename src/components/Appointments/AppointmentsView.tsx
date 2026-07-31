import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Doctor, ClinicBranch, Appointment, TreatmentService, AppointmentStatus, ConsultationType } from '../../types';
import {
  Search,
  Filter,
  Calendar as CalendarIcon,
  Clock,
  Star,
  MapPin,
  CheckCircle2,
  XCircle,
  RotateCcw,
  User,
  ShieldCheck,
  ChevronRight,
  MessageSquare,
  Sparkles,
  Award,
  Tag,
  X
} from 'lucide-react';
import { BottomSheet } from '../PWA/BottomSheet';
import { calculateVoucherDiscount } from '../../utils/vouchers';
import { AvailableVouchersModal } from '../Vouchers/AvailableVouchersModal';
import { CardDetailsForm } from '../Payments/CardDetailsForm';

interface AppointmentsViewProps {
  doctors: Doctor[];
  branches: ClinicBranch[];
  treatments: TreatmentService[];
  appointments: Appointment[];
  selectedBranch: ClinicBranch;
  onBookAppointment: (newAppt: Appointment) => void;
  onCancelAppointment: (id: string) => void;
  onRescheduleAppointment: (id: string, newDate: string, newSlot: string) => void;
  onSubmitFeedback: (id: string, rating: number, comment: string) => void;
  activeSubTab: 'book' | 'history';
  onChangeSubTab: (tab: 'book' | 'history') => void;
}

export const AppointmentsView: React.FC<AppointmentsViewProps> = ({
  doctors,
  branches,
  treatments,
  appointments,
  selectedBranch,
  onBookAppointment,
  onCancelAppointment,
  onRescheduleAppointment,
  onSubmitFeedback,
  activeSubTab,
  onChangeSubTab: setActiveSubTab
}) => {
  const { t } = useTranslation('appointments');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('All');

  // Booking Flow State
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedTreatment, setSelectedTreatment] = useState<TreatmentService | null>(treatments[0]);
  const [consultationType, setConsultationType] = useState<ConsultationType>('In-Clinic Consultation');
  const [selectedDate, setSelectedDate] = useState('2026-07-29');
  const [selectedSlot, setSelectedSlot] = useState('11:00 AM');
  const [notes, setNotes] = useState('');
  const [bookingStep, setBookingStep] = useState<'form' | 'summary' | 'card_details'>('form');
  const [bookingSuccess, setBookingSuccess] = useState<Appointment | null>(null);
  const [customSuccessMessage, setCustomSuccessMessage] = useState<string>('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<Appointment['paymentMethod'] | null>(null);
  const [voucherInput, setVoucherInput] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState<{ code: string; discount: number } | null>(null);
  const [voucherError, setVoucherError] = useState('');
  const [showVoucherList, setShowVoucherList] = useState(false);

  // Reschedule / Feedback Modals
  const [rescheduleAppt, setRescheduleAppt] = useState<Appointment | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState('2026-07-30');
  const [rescheduleSlot, setRescheduleSlot] = useState('02:00 PM');

  const [feedbackAppt, setFeedbackAppt] = useState<Appointment | null>(null);
  const [starRating, setStarRating] = useState(5);
  const [feedbackComment, setFeedbackComment] = useState('');

  // Each filter maps to keywords found in the doctors' actual specialty text
  // rather than matching the filter label itself, since specialty wording
  // (e.g. "Laser Hair Removal & Skin Resurfacing") rarely contains the whole
  // label ("Laser & Skin") as a contiguous substring.
  const specialtyFilters: { id: string; label: string; keywords: string[] }[] = [
    { id: 'All', label: t('specialtyFilters.all'), keywords: [] },
    { id: 'Anti-Aging', label: t('specialtyFilters.antiAging'), keywords: ['anti-aging'] },
    { id: 'Laser & Skin', label: t('specialtyFilters.laserSkin'), keywords: ['laser', 'resurfacing'] },
    { id: 'Cosmetic Dermatology', label: t('specialtyFilters.cosmeticDermatology'), keywords: ['hydrafacial', 'filler', 'biostimulator'] },
    { id: 'Clinical Dermatology', label: t('specialtyFilters.clinicalDermatology'), keywords: ['oncology', 'medical dermatology'] }
  ];

  // Display-only translated labels for values that are also used internally for
  // logic/state/comparisons (kept in English at the data level; only the shown
  // text is localized).
  const consultationTypeLabels: Record<ConsultationType, string> = {
    'In-Clinic Consultation': t('consultationTypes.inClinic'),
    'Follow-up Checkup': t('consultationTypes.followUp'),
    'Procedure': t('consultationTypes.procedure')
  };
  const paymentMethodLabels: Record<NonNullable<Appointment['paymentMethod']>, string> = {
    'Pay at Clinic': t('paymentMethods.payAtClinic'),
    'Pay Online': t('paymentMethods.payOnline'),
    'Buy Now Pay Later': t('paymentMethods.buyNowPayLater')
  };

  const filteredDoctors = doctors.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    const activeFilter = specialtyFilters.find((f) => f.id === selectedSpecialty);
    const matchesSpecialty = selectedSpecialty === 'All' || !activeFilter
      ? selectedSpecialty === 'All'
      : activeFilter.keywords.some((kw) => doc.specialty.toLowerCase().includes(kw));
    return matchesSearch && matchesSpecialty;
  });

  const getAppointmentFee = () => {
    if (consultationType === 'In-Clinic Consultation') return 400;
    if (consultationType === 'Follow-up Checkup') return 200;
    if (consultationType === 'Procedure') return selectedTreatment ? selectedTreatment.price : 850;
    return 400;
  };

  const getDiscountedFee = () => {
    const baseFee = getAppointmentFee();
    if (!appliedVoucher) return baseFee;
    return Math.max(0, baseFee - appliedVoucher.discount);
  };

  const resetBookingFlowState = () => {
    setSelectedDoctor(null);
    setBookingStep('form');
    setSelectedPaymentMethod(null);
    setVoucherInput('');
    setAppliedVoucher(null);
    setVoucherError('');
    setShowVoucherList(false);
  };

  const applyVoucherCode = (rawCode: string) => {
    const code = rawCode.trim().toUpperCase();
    if (!code) return;
    const discount = calculateVoucherDiscount(code, getAppointmentFee());
    if (discount === null) {
      setVoucherError(t('summary.invalidVoucher'));
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

  const handleConfirmPayment = () => {
    if (!selectedDoctor || !selectedPaymentMethod) return;
    const method = selectedPaymentMethod;
    const fee = getDiscountedFee();
    const paid = method === 'Pay Online' || method === 'Buy Now Pay Later';
    const status: AppointmentStatus = method === 'Pay at Clinic' ? 'pending' : 'upcoming';

    const newAppt: Appointment = {
      id: `apt_${Date.now()}`,
      doctorId: selectedDoctor.id,
      doctorName: selectedDoctor.name,
      doctorSpecialty: selectedDoctor.specialty,
      doctorAvatar: selectedDoctor.avatarUrl,
      clinicId: selectedBranch.id,
      clinicName: selectedBranch.name,
      treatmentName: consultationType === 'Procedure' && selectedTreatment ? selectedTreatment.name : consultationType,
      consultationType,
      date: selectedDate,
      timeSlot: selectedSlot,
      status,
      fee,
      paid,
      paymentMethod: method,
      voucherCode: appliedVoucher?.code,
      discountAmount: appliedVoucher?.discount,
      notes,
      checkInStatus: 'pending'
    };

    const successMessages: Record<NonNullable<Appointment['paymentMethod']>, string> = {
      'Pay at Clinic': t('success.messages.payAtClinic'),
      'Pay Online': t('success.messages.payOnline'),
      'Buy Now Pay Later': t('success.messages.buyNowPayLater')
    };

    onBookAppointment(newAppt);
    setBookingSuccess(newAppt);
    setCustomSuccessMessage(successMessages[method]);
    resetBookingFlowState();
  };

  const handleConfirmReschedule = () => {
    if (!rescheduleAppt) return;
    onRescheduleAppointment(rescheduleAppt.id, rescheduleDate, rescheduleSlot);
    setRescheduleAppt(null);
  };

  const handleConfirmFeedback = () => {
    if (!feedbackAppt) return;
    onSubmitFeedback(feedbackAppt.id, starRating, feedbackComment);
    setFeedbackAppt(null);
  };

  return (
    <div className="space-y-6 pb-24 md:pb-8">
      {/* Header & Sub-Tabs */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-slate-900">{t('header.title')}</h1>
            <p className="text-xs text-slate-500">{t('header.subtitle')}</p>
          </div>
          <div className="flex bg-slate-100 p-1 rounded-2xl text-xs font-bold text-slate-600">
            <button
              id="appointments-tab-book-btn"
              onClick={() => setActiveSubTab('book')}
              className={`px-3.5 py-1.5 rounded-xl transition ${
                activeSubTab === 'book' ? 'bg-blue-600 text-white shadow-xs' : ''
              }`}
            >
              {t('header.tabBookNew')}
            </button>
            <button
              id="appointments-tab-history-btn"
              onClick={() => setActiveSubTab('history')}
              className={`px-3.5 py-1.5 rounded-xl transition ${
                activeSubTab === 'history' ? 'bg-blue-600 text-white shadow-xs' : ''
              }`}
            >
              {t('header.tabMyVisits', { count: appointments.length })}
            </button>
          </div>
        </div>

        {activeSubTab === 'book' && (
          <div className="space-y-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('header.searchPlaceholder')}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold focus:bg-white focus:border-blue-500 outline-hidden"
              />
            </div>

            {/* Specialty Pills */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
              {specialtyFilters.map((f) => (
                <button
                  key={f.id}
                  id={`appointments-specialty-filter-${f.id}`}
                  onClick={() => setSelectedSpecialty(f.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                    selectedSpecialty === f.id
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* SUB-TAB 1: BOOKING FLOW (Doctors List) */}
      {activeSubTab === 'book' && (
        <div className="space-y-4">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
            {t('doctorList.availableDoctors', { count: filteredDoctors.length })}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredDoctors.map((doc) => (
              <div
                key={doc.id}
                className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition flex flex-col justify-between"
              >
                <div className="flex items-start gap-3.5">
                  <img
                    src={doc.avatarUrl}
                    alt={doc.name}
                    className="w-16 h-16 rounded-2xl object-cover ring-2 ring-blue-500/20 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h3 className="font-bold text-slate-900 text-sm truncate">{doc.name}</h3>
                      <span className="flex items-center gap-1 bg-amber-50 text-amber-700 text-[11px] font-bold px-2 py-0.5 rounded-full border border-amber-200 shrink-0">
                        {doc.rating} <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {t('doctorList.reviewCount', { count: doc.reviewCount })}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-blue-600 truncate">{doc.title}</div>
                    <div className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                      {doc.specialty} • {t('doctorList.yearsExp', { years: doc.experienceYears })}
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 my-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  {doc.bio}
                </p>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">{t('doctorList.consultationFeeLabel')}</span>
                    <span className="font-extrabold text-slate-900 text-sm">{t('doctorList.feeAmount', { amount: doc.consultationFee })}</span>
                  </div>
                  <button
                    id={`appointments-select-doctor-${doc.id}-btn`}
                    onClick={() => setSelectedDoctor(doc)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-2xl text-xs shadow-xs transition flex items-center gap-1"
                  >
                    {t('doctorList.selectAndBook')} <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: APPOINTMENT HISTORY */}
      {activeSubTab === 'history' && (
        <div className="space-y-4">
          {appointments.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 text-center border border-slate-200">
              <CalendarIcon className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <h3 className="font-bold text-slate-800 text-sm">{t('history.emptyTitle')}</h3>
              <p className="text-xs text-slate-500">{t('history.emptySubtitle')}</p>
            </div>
          ) : (
            appointments.map((appt) => (
              <div
                key={appt.id}
                className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                    appt.status === 'upcoming'
                      ? 'bg-blue-100 text-blue-800'
                      : appt.status === 'completed'
                      ? 'bg-emerald-100 text-emerald-800'
                      : appt.status === 'pending'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    {appt.status === 'pending' ? t('history.pendingConfirmation') : appt.status}
                  </span>
                  <span className="text-xs font-bold text-slate-900">
                    {t('history.feeWithMethod', {
                      fee: appt.fee,
                      method: appt.paymentMethod
                        ? paymentMethodLabels[appt.paymentMethod]
                        : appt.paid
                          ? t('history.paidLabel')
                          : t('history.payAtClinicLabel')
                    })}
                  </span>
                </div>

                {appt.voucherCode && (
                  <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-semibold">
                    <Tag className="w-3 h-3" />
                    <span>{t('history.voucherApplied', { code: appt.voucherCode, amount: appt.discountAmount })}</span>
                  </div>
                )}

                <div className="flex items-start gap-3.5">
                  <img
                    src={appt.doctorAvatar}
                    alt={appt.doctorName}
                    className="w-12 h-12 rounded-2xl object-cover ring-2 ring-blue-500/20 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-900 text-sm truncate">{appt.doctorName}</h3>
                    <p className="text-xs font-semibold text-blue-600 truncate">{appt.treatmentName}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      <span>🗓️ {appt.date}</span>
                      <span>⏰ {appt.timeSlot}</span>
                    </div>
                  </div>
                </div>

                {/* Actions depending on status */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                  <span className="text-[11px] text-slate-500 truncate">📍 {appt.clinicName}</span>

                  {appt.status !== 'completed' && appt.status !== 'cancelled' && (
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        id={`appointments-cancel-${appt.id}-btn`}
                        onClick={() => {
                          if (confirm(t('history.cancelConfirm'))) {
                            onCancelAppointment(appt.id);
                          }
                        }}
                        className="text-rose-600 hover:bg-rose-50 px-2.5 py-1 rounded-xl font-bold transition"
                      >
                        {t('history.cancel')}
                      </button>
                      <button
                        id={`appointments-reschedule-${appt.id}-btn`}
                        onClick={() => setRescheduleAppt(appt)}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1"
                      >
                        <RotateCcw className="w-3.5 h-3.5" /> {t('history.reschedule')}
                      </button>
                    </div>
                  )}

                  {appt.status === 'completed' && (
                    <div>
                      {appt.feedbackRating ? (
                        <div className="flex items-center gap-1 text-amber-500 font-bold">
                          <Star className="w-4 h-4 fill-amber-400" /> {t('history.ratedOutOf5', { rating: appt.feedbackRating })}
                        </div>
                      ) : (
                        <button
                          id={`appointments-feedback-${appt.id}-btn`}
                          onClick={() => setFeedbackAppt(appt)}
                          className="bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200 px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1"
                        >
                          <MessageSquare className="w-3.5 h-3.5" /> {t('history.rateVisit')}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* BOOKING STEP BOTTOM SHEET */}
      <BottomSheet
        isOpen={!!selectedDoctor}
        onClose={resetBookingFlowState}
        title={selectedDoctor ? t('booking.sheetTitle', { doctorName: selectedDoctor.name }) : ''}
        subtitle={
          bookingStep === 'form'
            ? t('booking.subtitleForm')
            : bookingStep === 'card_details'
              ? t('booking.subtitleCardDetails')
              : t('booking.subtitleSummary')
        }
      >
        {selectedDoctor && bookingStep === 'form' && (
          <div className="space-y-4">
            {/* Consultation Type */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">{t('booking.consultationTypeLabel')}</label>
              <div className="grid grid-cols-3 gap-2">
                {(['In-Clinic Consultation', 'Follow-up Checkup', 'Procedure'] as ConsultationType[]).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setConsultationType(type)}
                    className={`py-2 px-2 rounded-xl text-[11px] font-bold border transition text-center ${
                      consultationType === type
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {consultationTypeLabels[type]}
                  </button>
                ))}
              </div>
            </div>

            {/* Select Treatment (Only if Procedure is selected) */}
            {consultationType === 'Procedure' ? (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">{t('booking.selectTreatmentLabel')}</label>
                <select
                  value={selectedTreatment?.id || ''}
                  onChange={(e) => {
                    const found = treatments.find(tr => tr.id === e.target.value);
                    setSelectedTreatment(found || null);
                  }}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-hidden"
                >
                  {treatments.map((tr) => (
                    <option key={tr.id} value={tr.id}>
                      {t('booking.treatmentOption', { name: tr.name, price: tr.price, duration: tr.durationMinutes })}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-600">{t('booking.consultationFeeFor', { type: consultationTypeLabels[consultationType] })}</span>
                <span className="font-extrabold text-slate-900">
                  {t('doctorList.feeAmount', { amount: consultationType === 'In-Clinic Consultation' ? 400 : 200 })}
                </span>
              </div>
            )}

            {/* Date Picker */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">{t('booking.appointmentDateLabel')}</label>
              <input
                type="date"
                value={selectedDate}
                min="2026-07-22"
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-hidden"
              />
            </div>

            {/* Time Slot Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">{t('booking.availableSlotsLabel')}</label>
              <div className="grid grid-cols-3 gap-2">
                {selectedDoctor.availableTimeSlots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                    className={`py-2 px-2 rounded-xl text-xs font-bold border transition text-center ${
                      selectedSlot === slot
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            {/* Medical Notes */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">{t('booking.notesLabel')}</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={t('booking.notesPlaceholder')}
                rows={2}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-hidden"
              />
            </div>

            {/* Total Fee & Proceed to Summary */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block font-medium">{t('booking.totalFeeLabel')}</span>
                <span className="font-extrabold text-slate-900 text-base">
                  {t('doctorList.feeAmount', { amount: getAppointmentFee() })}
                </span>
              </div>
              <button
                id="appointments-proceed-summary-btn"
                onClick={() => setBookingStep('summary')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-2xl text-xs shadow-md shadow-blue-500/25 transition flex items-center gap-2"
              >
                {t('booking.proceedToSummary')} <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {selectedDoctor && bookingStep === 'summary' && (
          <div className="space-y-4">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <div className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-200 flex justify-between">
                <span>{t('summary.title')}</span>
                <span className="text-blue-600">{selectedBranch.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{t('summary.doctorLabel')}</span>
                <span className="font-bold text-slate-900">{selectedDoctor.name} ({selectedDoctor.specialty})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{t('summary.typeLabel')}</span>
                <span className="font-bold text-slate-900">{consultationTypeLabels[consultationType]}</span>
              </div>
              {consultationType === 'Procedure' && selectedTreatment && (
                <div className="flex justify-between">
                  <span className="text-slate-500">{t('summary.treatmentLabel')}</span>
                  <span className="font-bold text-slate-900">{selectedTreatment.name}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-500">{t('summary.dateTimeLabel')}</span>
                <span className="font-bold text-slate-900">{t('summary.dateAtSlot', { date: selectedDate, slot: selectedSlot })}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{t('summary.subtotalLabel')}</span>
                <span className="font-bold text-slate-900">{t('summary.feeAmount', { amount: getAppointmentFee() })}</span>
              </div>
              {appliedVoucher && (
                <div className="flex justify-between text-emerald-600">
                  <span>{t('summary.voucherLabel', { code: appliedVoucher.code })}</span>
                  <span className="font-bold">{t('summary.voucherAmount', { amount: appliedVoucher.discount })}</span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t border-slate-200 font-extrabold text-sm text-slate-900">
                <span>{t('summary.totalDueLabel')}</span>
                <span className="text-blue-600">{t('summary.feeAmount', { amount: getDiscountedFee() })}</span>
              </div>
            </div>

            {/* Voucher Code */}
            <div className="bg-white border border-slate-200 rounded-2xl p-3.5 space-y-2">
              <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-emerald-600" />
                <span>{t('summary.haveVoucherCode')}</span>
              </div>
              {appliedVoucher ? (
                <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2">
                  <span className="text-xs font-bold text-emerald-800">
                    {t('summary.voucherAppliedInline', { code: appliedVoucher.code, amount: appliedVoucher.discount })}
                  </span>
                  <button
                    type="button"
                    id="appointments-remove-voucher-btn"
                    onClick={handleRemoveVoucher}
                    className="text-emerald-700 hover:text-rose-600 transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    id="appointments-voucher-input"
                    value={voucherInput}
                    onChange={(e) => {
                      setVoucherInput(e.target.value);
                      setVoucherError('');
                    }}
                    placeholder={t('summary.voucherPlaceholder')}
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-hidden focus:bg-white focus:border-blue-500"
                  />
                  <button
                    type="button"
                    id="appointments-apply-voucher-btn"
                    onClick={handleApplyVoucher}
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
                  id="appointments-view-vouchers-btn"
                  onClick={() => setShowVoucherList(true)}
                  className="text-[11px] font-bold text-emerald-700 hover:underline"
                >
                  {t('summary.viewAvailableVouchers')}
                </button>
              )}
            </div>

            <div className="space-y-2.5 pt-2">
              <div className="text-xs font-bold text-slate-700">{t('summary.selectPaymentOption')}</div>

              <button
                type="button"
                id="appointments-pay-clinic-btn"
                onClick={() => setSelectedPaymentMethod('Pay at Clinic')}
                className={`w-full font-bold py-3.5 px-4 rounded-2xl text-xs flex items-center justify-between transition ${
                  selectedPaymentMethod === 'Pay at Clinic'
                    ? 'bg-slate-900 text-white shadow-md ring-2 ring-offset-2 ring-slate-900'
                    : 'bg-white text-slate-700 border-2 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-base">🏥</span>
                  <div className="text-left">
                    <div className="font-bold">{t('paymentMethods.payAtClinic')}</div>
                    <div className={`text-[10px] font-normal ${selectedPaymentMethod === 'Pay at Clinic' ? 'text-slate-300' : 'text-slate-500'}`}>
                      {t('summary.payAtClinicDesc')}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  {selectedPaymentMethod === 'Pay at Clinic' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                  <span className={`text-xs px-2.5 py-1 rounded-xl ${selectedPaymentMethod === 'Pay at Clinic' ? 'bg-slate-800' : 'bg-slate-100'}`}>
                    {t('summary.feeAmount', { amount: getDiscountedFee() })}
                  </span>
                </div>
              </button>

              <button
                type="button"
                id="appointments-pay-online-btn"
                onClick={() => setSelectedPaymentMethod('Pay Online')}
                className={`w-full font-bold py-3.5 px-4 rounded-2xl text-xs flex items-center justify-between transition ${
                  selectedPaymentMethod === 'Pay Online'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 ring-2 ring-offset-2 ring-blue-600'
                    : 'bg-white text-slate-700 border-2 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-base">💳</span>
                  <div className="text-left">
                    <div className="font-bold">{t('paymentMethods.payOnlineFull')}</div>
                    <div className={`text-[10px] font-normal ${selectedPaymentMethod === 'Pay Online' ? 'text-blue-100' : 'text-slate-500'}`}>
                      {t('summary.payOnlineDesc')}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  {selectedPaymentMethod === 'Pay Online' && <CheckCircle2 className="w-4 h-4 text-white" />}
                  <span className={`text-xs px-2.5 py-1 rounded-xl ${selectedPaymentMethod === 'Pay Online' ? 'bg-blue-700' : 'bg-slate-100'}`}>
                    {t('summary.feeAmount', { amount: getDiscountedFee() })}
                  </span>
                </div>
              </button>

              <button
                type="button"
                id="appointments-pay-bnpl-btn"
                onClick={() => setSelectedPaymentMethod('Buy Now Pay Later')}
                className={`w-full font-bold py-3.5 px-4 rounded-2xl text-xs flex items-center justify-between transition ${
                  selectedPaymentMethod === 'Buy Now Pay Later'
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-500/25 ring-2 ring-offset-2 ring-purple-600'
                    : 'bg-white text-slate-700 border-2 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-base">🛍️</span>
                  <div className="text-left">
                    <div className="font-bold">{t('paymentMethods.bnplFull')}</div>
                    <div className={`text-[10px] font-normal ${selectedPaymentMethod === 'Buy Now Pay Later' ? 'text-purple-100' : 'text-slate-500'}`}>
                      {t('summary.bnplDesc')}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  {selectedPaymentMethod === 'Buy Now Pay Later' && <CheckCircle2 className="w-4 h-4 text-white" />}
                  <span className={`text-xs px-2.5 py-1 rounded-xl ${selectedPaymentMethod === 'Buy Now Pay Later' ? 'bg-purple-700' : 'bg-slate-100'}`}>
                    {t('summary.feeAmount', { amount: getDiscountedFee() })}
                  </span>
                </div>
              </button>
            </div>

            <button
              type="button"
              id="appointments-confirm-booking-btn"
              disabled={!selectedPaymentMethod}
              onClick={() => {
                if (selectedPaymentMethod === 'Pay Online') {
                  setBookingStep('card_details');
                } else {
                  handleConfirmPayment();
                }
              }}
              className={`w-full font-bold py-3.5 rounded-2xl text-xs shadow-md transition ${
                selectedPaymentMethod
                  ? 'bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 text-white shadow-blue-500/30'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
              }`}
            >
              {selectedPaymentMethod ? t('summary.confirmBookingWithFee', { amount: getDiscountedFee() }) : t('summary.selectPaymentToContinue')}
            </button>

            <button
              type="button"
              onClick={() => setBookingStep('form')}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl text-xs transition"
            >
              {t('summary.backToDetails')}
            </button>
          </div>
        )}

        {selectedDoctor && bookingStep === 'card_details' && (
          <div className="p-4 space-y-4">
            <CardDetailsForm
              amount={getDiscountedFee()}
              onBack={() => setBookingStep('summary')}
              onPay={handleConfirmPayment}
            />
          </div>
        )}
      </BottomSheet>

      {/* AVAILABLE VOUCHERS LIST */}
      {showVoucherList && (
        <AvailableVouchersModal
          onSelect={(code) => {
            applyVoucherCode(code);
            setShowVoucherList(false);
          }}
          onClose={() => setShowVoucherList(false)}
        />
      )}

      {/* BOOKING SUCCESS MODAL */}
      {bookingSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 shadow-2xl max-w-md w-full text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-lg">{t('success.title')}</h3>
            <p className="text-xs text-slate-700 font-medium leading-relaxed">
              {customSuccessMessage}
            </p>
            <div className="bg-slate-50 p-3 rounded-2xl text-xs text-slate-700 space-y-1 text-left font-medium border border-slate-200">
              <div>👨‍⚕️ <strong>{t('success.doctorLabel')}</strong> {bookingSuccess.doctorName}</div>
              <div>🗓️ <strong>{t('success.dateLabel')}</strong> {t('success.dateAtSlot', { date: bookingSuccess.date, slot: bookingSuccess.timeSlot })}</div>
              <div>📍 <strong>{t('success.locationLabel')}</strong> {bookingSuccess.clinicName}</div>
              <div>💳 <strong>{t('success.feeStatusLabel')}</strong> {t('success.feeStatusValue', {
                fee: bookingSuccess.fee,
                method: bookingSuccess.paymentMethod
                  ? paymentMethodLabels[bookingSuccess.paymentMethod]
                  : bookingSuccess.paid
                    ? t('paymentMethods.paidOnline')
                    : paymentMethodLabels['Pay at Clinic']
              })}</div>
              {bookingSuccess.voucherCode && (
                <div>🏷️ <strong>{t('success.voucherLabel')}</strong> {t('success.voucherValue', { code: bookingSuccess.voucherCode, amount: bookingSuccess.discountAmount })}</div>
              )}
            </div>
            <button
              id="appointments-success-close-btn"
              onClick={() => setBookingSuccess(null)}
              className="w-full bg-blue-600 text-white font-bold py-3 rounded-2xl text-xs shadow-md"
            >
              {t('success.doneButton')}
            </button>
          </div>
        </div>
      )}

      {/* RESCHEDULE SHEET */}
      <BottomSheet
        isOpen={!!rescheduleAppt}
        onClose={() => setRescheduleAppt(null)}
        title={t('rescheduleSheet.title')}
        subtitle={rescheduleAppt ? t('rescheduleSheet.subtitle', { name: rescheduleAppt.doctorName }) : ''}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">{t('rescheduleSheet.newDateLabel')}</label>
            <input
              type="date"
              value={rescheduleDate}
              onChange={(e) => setRescheduleDate(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-hidden"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">{t('rescheduleSheet.newSlotLabel')}</label>
            <select
              value={rescheduleSlot}
              onChange={(e) => setRescheduleSlot(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-hidden"
            >
              <option value="09:30 AM">09:30 AM</option>
              <option value="11:00 AM">11:00 AM</option>
              <option value="02:00 PM">02:00 PM</option>
              <option value="04:30 PM">04:30 PM</option>
            </select>
          </div>
          <button
            id="appointments-confirm-reschedule-btn"
            onClick={handleConfirmReschedule}
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-2xl text-xs shadow-md"
          >
            {t('rescheduleSheet.confirmButton')}
          </button>
        </div>
      </BottomSheet>

      {/* DOCTOR FEEDBACK SHEET */}
      <BottomSheet
        isOpen={!!feedbackAppt}
        onClose={() => setFeedbackAppt(null)}
        title={t('feedbackSheet.title')}
        subtitle={feedbackAppt ? t('feedbackSheet.subtitle', { name: feedbackAppt.doctorName }) : ''}
      >
        <div className="space-y-4 text-center">
          <div className="flex items-center justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setStarRating(star)}
                className="p-1"
              >
                <Star className={`w-8 h-8 ${star <= starRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
              </button>
            ))}
          </div>
          <textarea
            value={feedbackComment}
            onChange={(e) => setFeedbackComment(e.target.value)}
            placeholder={t('feedbackSheet.placeholder')}
            rows={3}
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-hidden text-left"
          />
          <button
            id="appointments-submit-feedback-btn"
            onClick={handleConfirmFeedback}
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-2xl text-xs shadow-md"
          >
            {t('feedbackSheet.submitButton')}
          </button>
        </div>
      </BottomSheet>
    </div>
  );
};
