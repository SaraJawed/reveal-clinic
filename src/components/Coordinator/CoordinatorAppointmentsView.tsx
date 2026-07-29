import React, { useState } from 'react';
import {
  ClinicalScheduleItem,
  ClinicalAppointmentStatus,
  Doctor,
  TreatmentService
} from '../../types';
import {
  Calendar,
  Search,
  Filter,
  Plus,
  UserCheck,
  XCircle,
  RefreshCw,
  Clock,
  User,
  CheckCircle2,
  FileText,
  AlertTriangle,
  ChevronRight,
  X,
  Building,
  Sparkles,
  Phone
} from 'lucide-react';
import { initialDoctors, treatmentServices } from '../../data/mockData';

interface CoordinatorAppointmentsViewProps {
  schedule: ClinicalScheduleItem[];
  onUpdateStatus: (id: string, newStatus: ClinicalAppointmentStatus) => void;
  onAddScheduleItem: (item: ClinicalScheduleItem) => void;
  onTriggerToast: (msg: string) => void;
}

export const CoordinatorAppointmentsView: React.FC<CoordinatorAppointmentsViewProps> = ({
  schedule,
  onUpdateStatus,
  onAddScheduleItem,
  onTriggerToast
}) => {
  // Filtering & Search states
  const [activeFilter, setActiveFilter] = useState<'all' | 'scheduled' | 'checked_in' | 'completed' | 'cancelled'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected Appointment for Details / Action
  const [selectedAppt, setSelectedAppt] = useState<ClinicalScheduleItem | null>(null);

  // Modal states
  const [showBookModal, setShowBookModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState<ClinicalScheduleItem | null>(null);
  const [showRescheduleModal, setShowRescheduleModal] = useState<ClinicalScheduleItem | null>(null);

  // Cancel reason state
  const [cancelReason, setCancelReason] = useState('Patient Request');

  // Reschedule state
  const [rescheduleDate, setRescheduleDate] = useState('Tomorrow');
  const [rescheduleTimeSlot, setRescheduleTimeSlot] = useState('02:30 PM');
  const [rescheduleDoctor, setRescheduleDoctor] = useState('Dr. Sara Al-Ghamdi');

  // New Booking Form states
  const [bookPatientName, setBookPatientName] = useState('');
  const [bookPatientFileNo, setBookPatientFileNo] = useState('RC-88120');
  const [bookPatientPhone, setBookPatientPhone] = useState('+1 (555) 345-6789');
  const [bookDoctorId, setBookDoctorId] = useState('doc_1');
  const [bookServiceId, setBookServiceId] = useState(treatmentServices[0].id);
  const [bookDate, setBookDate] = useState('Today');
  const [bookTimeSlot, setBookTimeSlot] = useState('11:30 AM');
  const [bookNotes, setBookNotes] = useState('');

  // Filter schedule logic
  const filteredSchedule = schedule.filter((item) => {
    const matchesSearch =
      item.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.treatmentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.doctorName.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeFilter === 'all') return true;
    if (activeFilter === 'scheduled') return item.status === 'scheduled';
    if (activeFilter === 'checked_in') return item.status === 'checked_in' || item.status === 'in_consultation';
    if (activeFilter === 'completed') return item.status === 'completed';
    if (activeFilter === 'cancelled') return item.status === 'cancelled';

    return true;
  });

  const getStatusBadge = (status: ClinicalAppointmentStatus) => {
    switch (status) {
      case 'checked_in':
      case 'in_consultation':
        return (
          <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black flex items-center gap-1">
            <UserCheck className="w-3 h-3 text-emerald-600" />
            Checked In
          </span>
        );
      case 'scheduled':
        return (
          <span className="px-2.5 py-1 rounded-full bg-blue-100 text-[#4F8EF7] text-[10px] font-black flex items-center gap-1">
            <Clock className="w-3 h-3 text-[#4F8EF7]" />
            Scheduled
          </span>
        );
      case 'completed':
        return (
          <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[10px] font-black flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-slate-500" />
            Completed
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-2.5 py-1 rounded-full bg-red-100 text-red-700 text-[10px] font-black flex items-center gap-1">
            <XCircle className="w-3 h-3 text-red-600" />
            Cancelled
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full bg-purple-100 text-purple-800 text-[10px] font-black">
            {status}
          </span>
        );
    }
  };

  const handleConfirmCancel = () => {
    if (!showCancelModal) return;
    onUpdateStatus(showCancelModal.id, 'cancelled');
    onTriggerToast(`Appointment for ${showCancelModal.patientName} cancelled (${cancelReason}).`);
    setShowCancelModal(null);
  };

  const handleConfirmReschedule = () => {
    if (!showRescheduleModal) return;
    onUpdateStatus(showRescheduleModal.id, 'scheduled');
    onTriggerToast(`Appointment rescheduled to ${rescheduleDate} at ${rescheduleTimeSlot} with ${rescheduleDoctor}.`);
    setShowRescheduleModal(null);
  };

  const handleCreateBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookPatientName) return;

    const selectedDoc = initialDoctors.find(d => d.id === bookDoctorId) || initialDoctors[0];
    const selectedService = treatmentServices.find(s => s.id === bookServiceId) || treatmentServices[0];

    const newItem: ClinicalScheduleItem = {
      id: `cs_${Date.now().toString().slice(-4)}`,
      patientId: bookPatientFileNo || `RC-${Math.floor(10000 + Math.random() * 90000)}`,
      patientName: bookPatientName,
      patientAge: 30,
      patientGender: 'female',
      patientAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300',
      doctorId: selectedDoc.id,
      doctorName: selectedDoc.name,
      treatmentName: selectedService.name,
      consultationType: 'In-Clinic Consultation',
      date: bookDate,
      timeSlot: bookTimeSlot,
      durationMinutes: selectedService.durationMinutes || 45,
      status: 'scheduled',
      roomNumber: 'Reception Suite B',
      allergyAlerts: [],
      visitReason: bookNotes || 'Routine consultation booked at front desk.',
      vitalSigns: { bp: '120/80', pulse: 70 },
      notes: bookNotes,
      paymentStatus: 'Paid',
      queueNumber: Math.floor(10 + Math.random() * 20)
    };

    onAddScheduleItem(newItem);
    onTriggerToast(`New appointment booked for ${bookPatientName}!`);
    setShowBookModal(false);
    setBookPatientName('');
    setBookNotes('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header & New Booking Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Calendar className="w-6 h-6 text-[#4F8EF7]" />
            Appointment Management
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Search, schedule, reschedule, or check-in clinic appointments.
          </p>
        </div>

        <button
          onClick={() => setShowBookModal(true)}
          className="px-4 py-2.5 rounded-2xl bg-[#4F8EF7] hover:bg-blue-600 text-white font-extrabold text-xs transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Book New Appointment</span>
        </button>
      </div>

      {/* Search & Status Filters */}
      <div className="bg-white rounded-3xl border border-slate-100 p-4 shadow-2xs space-y-3">
        {/* Search input */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Patient Name, File # (e.g. RC-99841), Service, or Doctor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#4F8EF7]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-bold"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {(
            [
              { id: 'all', label: 'All Appointments' },
              { id: 'scheduled', label: 'Scheduled' },
              { id: 'checked_in', label: 'Checked In / Active' },
              { id: 'completed', label: 'Completed' },
              { id: 'cancelled', label: 'Cancelled' }
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold shrink-0 transition-all ${
                activeFilter === tab.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Appointment Cards List */}
      <div className="space-y-3">
        {filteredSchedule.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-slate-100 p-6 space-y-2">
            <Calendar className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="font-extrabold text-slate-800 text-sm">No matching appointments found</h3>
            <p className="text-xs text-slate-400">Try adjusting your search terms or status filters.</p>
          </div>
        ) : (
          filteredSchedule.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl border border-slate-100 p-4 sm:p-5 shadow-2xs hover:shadow-md transition-all space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                {/* Patient Info */}
                <div className="flex items-center gap-3">
                  <img
                    src={item.patientAvatar}
                    alt={item.patientName}
                    className="w-12 h-12 rounded-2xl object-cover ring-2 ring-slate-100"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-slate-900 text-sm">{item.patientName}</h3>
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                        {item.patientId}
                      </span>
                      {getStatusBadge(item.status)}
                    </div>
                    <p className="text-xs font-bold text-[#4F8EF7] mt-0.5">{item.treatmentName}</p>
                    <p className="text-[11px] text-slate-400 font-medium">
                      Doctor: {item.doctorName} • Room: {item.roomNumber}
                    </p>
                  </div>
                </div>

                {/* Time Slot & Queue */}
                <div className="flex items-center gap-3 sm:text-right shrink-0">
                  <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100 text-center min-w-[100px]">
                    <div className="text-xs font-black text-slate-900">{item.timeSlot}</div>
                    <div className="text-[10px] font-bold text-slate-400">{item.date}</div>
                  </div>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                <div className="text-[11px] text-slate-500 font-medium truncate max-w-md">
                  Reason: <span className="font-semibold text-slate-700">{item.visitReason}</span>
                </div>

                <div className="flex items-center gap-2 ml-auto">
                  {item.status === 'scheduled' && (
                    <button
                      onClick={() => {
                        onUpdateStatus(item.id, 'checked_in');
                        onTriggerToast(`${item.patientName} marked as Arrived & Checked In!`);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-xs flex items-center gap-1"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Confirm Arrival</span>
                    </button>
                  )}

                  {item.status !== 'cancelled' && item.status !== 'completed' && (
                    <button
                      onClick={() => setShowRescheduleModal(item)}
                      className="px-3 py-1.5 rounded-xl bg-blue-50 text-[#4F8EF7] hover:bg-blue-100 text-xs font-bold flex items-center gap-1 border border-blue-100"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Reschedule</span>
                    </button>
                  )}

                  {item.status !== 'cancelled' && item.status !== 'completed' && (
                    <button
                      onClick={() => setShowCancelModal(item)}
                      className="px-3 py-1.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 text-xs font-bold flex items-center gap-1 border border-red-100"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Cancel</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Book New Appointment Modal */}
      {showBookModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#4F8EF7]" />
                <h3 className="font-black text-slate-900 text-base">Book Clinic Appointment</h3>
              </div>
              <button
                onClick={() => setShowBookModal(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBooking} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Patient Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lama Al-Rashidi"
                    value={bookPatientName}
                    onChange={(e) => setBookPatientName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#4F8EF7]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Patient File #</label>
                  <input
                    type="text"
                    placeholder="e.g. RC-88120"
                    value={bookPatientFileNo}
                    onChange={(e) => setBookPatientFileNo(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#4F8EF7]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Contact</label>
                <input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={bookPatientPhone}
                  onChange={(e) => setBookPatientPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#4F8EF7]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Select Service / Treatment</label>
                <select
                  value={bookServiceId}
                  onChange={(e) => setBookServiceId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#4F8EF7]"
                >
                  {treatmentServices.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name} (${service.price} • {service.durationMinutes}m)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Select Attending Doctor</label>
                <select
                  value={bookDoctorId}
                  onChange={(e) => setBookDoctorId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#4F8EF7]"
                >
                  {initialDoctors.map((doc) => (
                    <option key={doc.id} value={doc.id}>
                      {doc.name} ({doc.specialty})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Date</label>
                  <select
                    value={bookDate}
                    onChange={(e) => setBookDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#4F8EF7]"
                  >
                    <option value="Today">Today</option>
                    <option value="Tomorrow">Tomorrow</option>
                    <option value="July 24, 2026">July 24, 2026</option>
                    <option value="July 25, 2026">July 25, 2026</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Time Slot</label>
                  <select
                    value={bookTimeSlot}
                    onChange={(e) => setBookTimeSlot(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#4F8EF7]"
                  >
                    <option value="09:00 AM">09:00 AM</option>
                    <option value="10:30 AM">10:30 AM</option>
                    <option value="11:30 AM">11:30 AM</option>
                    <option value="02:00 PM">02:00 PM</option>
                    <option value="04:15 PM">04:15 PM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Notes / Instructions</label>
                <textarea
                  rows={2}
                  placeholder="Special requests or patient preferences..."
                  value={bookNotes}
                  onChange={(e) => setBookNotes(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#4F8EF7]"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowBookModal(false)}
                  className="px-4 py-2 rounded-2xl text-slate-600 hover:bg-slate-100 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-2xl bg-[#4F8EF7] hover:bg-blue-600 text-white text-xs font-extrabold shadow-md shadow-blue-500/20"
                >
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cancel Appointment Reason Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-2 text-red-600 pb-2 border-b border-slate-100">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="font-black text-slate-900 text-base">Cancel Appointment</h3>
            </div>

            <p className="text-xs text-slate-600 font-medium">
              Are you sure you want to cancel appointment for <strong className="text-slate-900">{showCancelModal.patientName}</strong>?
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Reason for Cancellation *</label>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="Patient Request">Patient Requested Cancellation</option>
                <option value="Doctor Emergency">Doctor Emergency / Schedule Change</option>
                <option value="Weather or Traffic">Traffic or Severe Weather</option>
                <option value="Payment Issue">Payment / Package Issue</option>
                <option value="No-Show">Patient No-Show</option>
              </select>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                onClick={() => setShowCancelModal(null)}
                className="px-4 py-2 rounded-2xl text-slate-600 hover:bg-slate-100 text-xs font-bold"
              >
                Dismiss
              </button>
              <button
                onClick={handleConfirmCancel}
                className="px-5 py-2 rounded-2xl bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold shadow-md shadow-red-500/20"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reschedule Appointment Modal */}
      {showRescheduleModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-2 text-[#4F8EF7] pb-2 border-b border-slate-100">
              <RefreshCw className="w-5 h-5" />
              <h3 className="font-black text-slate-900 text-base">Reschedule Appointment</h3>
            </div>

            <p className="text-xs text-slate-600 font-medium">
              Select a new date and time slot for <strong className="text-slate-900">{showRescheduleModal.patientName}</strong>.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">New Date</label>
                <select
                  value={rescheduleDate}
                  onChange={(e) => setRescheduleDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#4F8EF7]"
                >
                  <option value="Tomorrow">Tomorrow</option>
                  <option value="July 24, 2026">July 24, 2026</option>
                  <option value="July 25, 2026">July 25, 2026</option>
                  <option value="July 28, 2026">July 28, 2026</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Available Time Slot</label>
                <select
                  value={rescheduleTimeSlot}
                  onChange={(e) => setRescheduleTimeSlot(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#4F8EF7]"
                >
                  <option value="10:00 AM">10:00 AM</option>
                  <option value="11:30 AM">11:30 AM</option>
                  <option value="02:30 PM">02:30 PM</option>
                  <option value="04:00 PM">04:00 PM</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Assigned Doctor</label>
                <select
                  value={rescheduleDoctor}
                  onChange={(e) => setRescheduleDoctor(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#4F8EF7]"
                >
                  <option value="Dr. Sara Al-Ghamdi">Dr. Sara Al-Ghamdi</option>
                  <option value="Dr. Faisal Al-Dosari">Dr. Faisal Al-Dosari</option>
                  <option value="Dr. Fatima Al-Zahrani">Dr. Fatima Al-Zahrani</option>
                </select>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                onClick={() => setShowRescheduleModal(null)}
                className="px-4 py-2 rounded-2xl text-slate-600 hover:bg-slate-100 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReschedule}
                className="px-5 py-2 rounded-2xl bg-[#4F8EF7] hover:bg-blue-600 text-white text-xs font-extrabold shadow-md shadow-blue-500/20"
              >
                Update Schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
