import React, { useState } from 'react';
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
  Award
} from 'lucide-react';
import { BottomSheet } from '../PWA/BottomSheet';

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
  onOpenCheckIn: () => void;
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
  onOpenCheckIn
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'book' | 'history'>('book');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('All');

  // Booking Flow State
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedTreatment, setSelectedTreatment] = useState<TreatmentService | null>(treatments[0]);
  const [consultationType, setConsultationType] = useState<ConsultationType>('In-Clinic Consultation');
  const [selectedDate, setSelectedDate] = useState('2026-07-29');
  const [selectedSlot, setSelectedSlot] = useState('11:00 AM');
  const [notes, setNotes] = useState('');
  const [bookingStep, setBookingStep] = useState<'form' | 'summary'>('form');
  const [bookingSuccess, setBookingSuccess] = useState<Appointment | null>(null);
  const [customSuccessMessage, setCustomSuccessMessage] = useState<string>('');

  // Reschedule / Feedback Modals
  const [rescheduleAppt, setRescheduleAppt] = useState<Appointment | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState('2026-07-30');
  const [rescheduleSlot, setRescheduleSlot] = useState('02:00 PM');

  const [feedbackAppt, setFeedbackAppt] = useState<Appointment | null>(null);
  const [starRating, setStarRating] = useState(5);
  const [feedbackComment, setFeedbackComment] = useState('');

  const specialties = ['All', 'Anti-Aging', 'Laser & Skin', 'Cosmetic Dermatology', 'Clinical Dermatology'];

  const filteredDoctors = doctors.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialty = selectedSpecialty === 'All' || doc.specialty.toLowerCase().includes(selectedSpecialty.toLowerCase());
    return matchesSearch && matchesSpecialty;
  });

  const getAppointmentFee = () => {
    if (consultationType === 'In-Clinic Consultation') return 400;
    if (consultationType === 'Follow-up Checkup') return 200;
    if (consultationType === 'Procedure') return selectedTreatment ? selectedTreatment.price : 850;
    return 400;
  };

  const handlePayAtClinic = () => {
    if (!selectedDoctor) return;
    const fee = getAppointmentFee();
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
      status: 'pending',
      fee,
      paid: false,
      notes,
      checkInStatus: 'pending'
    };

    onBookAppointment(newAppt);
    setBookingSuccess(newAppt);
    setCustomSuccessMessage("Your appointment slot has been reserved. Your booking will be confirmed once the payment is completed at the clinic.");
    setSelectedDoctor(null);
    setBookingStep('form');
  };

  const handlePayOnline = () => {
    if (!selectedDoctor) return;
    const fee = getAppointmentFee();
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
      status: 'upcoming',
      fee,
      paid: true,
      notes,
      checkInStatus: 'pending'
    };

    onBookAppointment(newAppt);
    setBookingSuccess(newAppt);
    setCustomSuccessMessage("Your appointment has been successfully booked and your payment has been received. A confirmation has been sent to you.");
    setSelectedDoctor(null);
    setBookingStep('form');
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
            <h1 className="text-lg font-bold text-slate-900">Appointment Management</h1>
            <p className="text-xs text-slate-500">Schedule dermatologists or manage upcoming clinic visits.</p>
          </div>
          <div className="flex bg-slate-100 p-1 rounded-2xl text-xs font-bold text-slate-600">
            <button
              id="appointments-tab-book-btn"
              onClick={() => setActiveSubTab('book')}
              className={`px-3.5 py-1.5 rounded-xl transition ${
                activeSubTab === 'book' ? 'bg-blue-600 text-white shadow-xs' : ''
              }`}
            >
              Book New
            </button>
            <button
              id="appointments-tab-history-btn"
              onClick={() => setActiveSubTab('history')}
              className={`px-3.5 py-1.5 rounded-xl transition ${
                activeSubTab === 'history' ? 'bg-blue-600 text-white shadow-xs' : ''
              }`}
            >
              My Visits ({appointments.length})
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
                placeholder="Search doctors, specialties or treatments..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold focus:bg-white focus:border-blue-500 outline-hidden"
              />
            </div>

            {/* Specialty Pills */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
              {specialties.map((spec) => (
                <button
                  key={spec}
                  id={`appointments-specialty-filter-${spec}`}
                  onClick={() => setSelectedSpecialty(spec)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                    selectedSpecialty === spec
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {spec}
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
            Available Dermatologists & Surgeons ({filteredDoctors.length})
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
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {doc.rating} ({doc.reviewCount})
                      </span>
                    </div>
                    <div className="text-xs font-bold text-blue-600 truncate">{doc.title}</div>
                    <div className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                      {doc.specialty} • {doc.experienceYears} yrs exp
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 my-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  {doc.bio}
                </p>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Consultation Fee</span>
                    <span className="font-extrabold text-slate-900 text-sm">SAR {doc.consultationFee}</span>
                  </div>
                  <button
                    id={`appointments-select-doctor-${doc.id}-btn`}
                    onClick={() => setSelectedDoctor(doc)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-2xl text-xs shadow-xs transition flex items-center gap-1"
                  >
                    Select & Book <ChevronRight className="w-3.5 h-3.5" />
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
              <h3 className="font-bold text-slate-800 text-sm">No Appointment Records Found</h3>
              <p className="text-xs text-slate-500">Book your first consultation using the 'Book New' tab.</p>
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
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    {appt.status}
                  </span>
                  <span className="text-xs font-bold text-slate-900">SAR {appt.fee} (Paid)</span>
                </div>

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

                  {appt.status === 'upcoming' && (
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        id={`appointments-cancel-${appt.id}-btn`}
                        onClick={() => {
                          if (confirm("Are you sure you want to cancel this appointment?")) {
                            onCancelAppointment(appt.id);
                          }
                        }}
                        className="text-rose-600 hover:bg-rose-50 px-2.5 py-1 rounded-xl font-bold transition"
                      >
                        Cancel
                      </button>
                      <button
                        id={`appointments-reschedule-${appt.id}-btn`}
                        onClick={() => setRescheduleAppt(appt)}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1"
                      >
                        <RotateCcw className="w-3.5 h-3.5" /> Reschedule
                      </button>
                      <button
                        id={`appointments-checkin-${appt.id}-btn`}
                        onClick={onOpenCheckIn}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-xl font-bold transition shadow-xs"
                      >
                        Check-In
                      </button>
                    </div>
                  )}

                  {appt.status === 'completed' && (
                    <div>
                      {appt.feedbackRating ? (
                        <div className="flex items-center gap-1 text-amber-500 font-bold">
                          <Star className="w-4 h-4 fill-amber-400" /> Rated {appt.feedbackRating}/5
                        </div>
                      ) : (
                        <button
                          id={`appointments-feedback-${appt.id}-btn`}
                          onClick={() => setFeedbackAppt(appt)}
                          className="bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200 px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1"
                        >
                          <MessageSquare className="w-3.5 h-3.5" /> Leave Doctor Feedback
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
        onClose={() => {
          setSelectedDoctor(null);
          setBookingStep('form');
        }}
        title={selectedDoctor ? `Book Appointment - ${selectedDoctor.name}` : ''}
        subtitle={bookingStep === 'form' ? "Select consultation type, date & time slot." : "Review booking summary & select payment option."}
      >
        {selectedDoctor && bookingStep === 'form' && (
          <div className="space-y-4">
            {/* Consultation Type */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Consultation Type</label>
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
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Select Treatment (Only if Procedure is selected) */}
            {consultationType === 'Procedure' ? (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Select Treatment Service</label>
                <select
                  value={selectedTreatment?.id || ''}
                  onChange={(e) => {
                    const t = treatments.find(tr => tr.id === e.target.value);
                    setSelectedTreatment(t || null);
                  }}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-hidden"
                >
                  {treatments.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} (SAR {t.price} • {t.durationMinutes} mins)
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-600">Consultation Fee ({consultationType}):</span>
                <span className="font-extrabold text-slate-900">
                  SAR {consultationType === 'In-Clinic Consultation' ? 400 : 200}
                </span>
              </div>
            )}

            {/* Date Picker */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Appointment Date</label>
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
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Available Time Slots</label>
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
              <label className="block text-xs font-bold text-slate-700 mb-1">Notes for Doctor (Optional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Mention skin concerns or allergies..."
                rows={2}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-hidden"
              />
            </div>

            {/* Total Fee & Proceed to Summary */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block font-medium">Total Appointment Fee</span>
                <span className="font-extrabold text-slate-900 text-base">
                  SAR {getAppointmentFee()}
                </span>
              </div>
              <button
                id="appointments-proceed-summary-btn"
                onClick={() => setBookingStep('summary')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-2xl text-xs shadow-md shadow-blue-500/25 transition flex items-center gap-2"
              >
                Proceed to Booking Summary <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {selectedDoctor && bookingStep === 'summary' && (
          <div className="space-y-4">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <div className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-200 flex justify-between">
                <span>Booking Summary</span>
                <span className="text-blue-600">{selectedBranch.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Doctor:</span>
                <span className="font-bold text-slate-900">{selectedDoctor.name} ({selectedDoctor.specialty})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Type:</span>
                <span className="font-bold text-slate-900">{consultationType}</span>
              </div>
              {consultationType === 'Procedure' && selectedTreatment && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Treatment:</span>
                  <span className="font-bold text-slate-900">{selectedTreatment.name}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-500">Date & Time:</span>
                <span className="font-bold text-slate-900">{selectedDate} at {selectedSlot}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200 font-extrabold text-sm text-slate-900">
                <span>Total Due:</span>
                <span className="text-blue-600">SAR {getAppointmentFee()}</span>
              </div>
            </div>

            <div className="space-y-2.5 pt-2">
              <div className="text-xs font-bold text-slate-700">Select Payment Option</div>
              
              <button
                id="appointments-pay-clinic-btn"
                onClick={handlePayAtClinic}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 px-4 rounded-2xl text-xs shadow-md flex items-center justify-between transition"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-base">🏥</span>
                  <div className="text-left">
                    <div className="font-bold">Pay at Clinic</div>
                    <div className="text-[10px] text-slate-300 font-normal">Pay cash or card upon arrival at the clinic counter</div>
                  </div>
                </div>
                <span className="text-xs bg-slate-800 px-2.5 py-1 rounded-xl">SAR {getAppointmentFee()}</span>
              </button>

              <button
                id="appointments-pay-online-btn"
                onClick={handlePayOnline}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-2xl text-xs shadow-md shadow-blue-500/25 flex items-center justify-between transition"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-base">💳</span>
                  <div className="text-left">
                    <div className="font-bold">Pay Online (Mada / Apple Pay / Visa)</div>
                    <div className="text-[10px] text-blue-100 font-normal">Instant secure online payment & immediate confirmation</div>
                  </div>
                </div>
                <span className="text-xs bg-blue-700 px-2.5 py-1 rounded-xl">SAR {getAppointmentFee()}</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => setBookingStep('form')}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl text-xs transition"
            >
              Back to Appointment Details
            </button>
          </div>
        )}
      </BottomSheet>

      {/* BOOKING SUCCESS MODAL */}
      {bookingSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 shadow-2xl max-w-md w-full text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-lg">Appointment Confirmation</h3>
            <p className="text-xs text-slate-700 font-medium leading-relaxed">
              {customSuccessMessage}
            </p>
            <div className="bg-slate-50 p-3 rounded-2xl text-xs text-slate-700 space-y-1 text-left font-medium border border-slate-200">
              <div>👨‍⚕️ <strong>Doctor:</strong> {bookingSuccess.doctorName}</div>
              <div>🗓️ <strong>Date:</strong> {bookingSuccess.date} at {bookingSuccess.timeSlot}</div>
              <div>📍 <strong>Location:</strong> {bookingSuccess.clinicName}</div>
              <div>💳 <strong>Fee / Status:</strong> SAR {bookingSuccess.fee} ({bookingSuccess.paid ? 'Paid Online' : 'Pay at Clinic'})</div>
            </div>
            <button
              id="appointments-success-close-btn"
              onClick={() => setBookingSuccess(null)}
              className="w-full bg-blue-600 text-white font-bold py-3 rounded-2xl text-xs shadow-md"
            >
              Done & Return to Appointments
            </button>
          </div>
        </div>
      )}

      {/* RESCHEDULE SHEET */}
      <BottomSheet
        isOpen={!!rescheduleAppt}
        onClose={() => setRescheduleAppt(null)}
        title="Reschedule Appointment"
        subtitle={rescheduleAppt ? `Doctor: ${rescheduleAppt.doctorName}` : ''}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">New Date</label>
            <input
              type="date"
              value={rescheduleDate}
              onChange={(e) => setRescheduleDate(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-hidden"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">New Time Slot</label>
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
            Confirm New Appointment Slot
          </button>
        </div>
      </BottomSheet>

      {/* DOCTOR FEEDBACK SHEET */}
      <BottomSheet
        isOpen={!!feedbackAppt}
        onClose={() => setFeedbackAppt(null)}
        title="Doctor Feedback"
        subtitle={feedbackAppt ? `Rate your procedure with ${feedbackAppt.doctorName}` : ''}
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
            placeholder="How was your procedure experience and care quality?"
            rows={3}
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-hidden text-left"
          />
          <button
            id="appointments-submit-feedback-btn"
            onClick={handleConfirmFeedback}
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-2xl text-xs shadow-md"
          >
            Submit Patient Review
          </button>
        </div>
      </BottomSheet>
    </div>
  );
};
