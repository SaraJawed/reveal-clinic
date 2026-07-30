import React, { useState } from 'react';
import {
  UserProfile,
  ClinicalScheduleItem,
  StaffNotification,
  WalkInPatient,
  CoordinatorTabType
} from '../../types';
import {
  Calendar,
  UserCheck,
  Clock,
  UserPlus,
  QrCode,
  Search,
  TrendingUp,
  AlertCircle,
  Plus,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Users,
  Building2,
  X,
  CreditCard
} from 'lucide-react';

interface CoordinatorDashboardViewProps {
  user: UserProfile;
  schedule: ClinicalScheduleItem[];
  walkInQueue: WalkInPatient[];
  notifications: StaffNotification[];
  onNavigateTab: (tab: CoordinatorTabType) => void;
  onConfirmCheckIn: (id: string) => void;
  onAddWalkIn: (patient: Omit<WalkInPatient, 'id' | 'queueNumber'>) => void;
  onTriggerToast: (msg: string) => void;
}

export const CoordinatorDashboardView: React.FC<CoordinatorDashboardViewProps> = ({
  user,
  schedule,
  walkInQueue,
  notifications,
  onNavigateTab,
  onConfirmCheckIn,
  onAddWalkIn,
  onTriggerToast
}) => {
  // Modal state for Walk-In Registration
  const [showWalkInModal, setShowWalkInModal] = useState(false);
  const [walkInName, setWalkInName] = useState('');
  const [walkInPhone, setWalkInPhone] = useState('');
  const [walkInDoctor, setWalkInDoctor] = useState('Dr. Fatima Al-Zahrani');
  const [walkInService, setWalkInService] = useState('Aesthetic Consultation & Skin Analysis');
  const [walkInNotes, setWalkInNotes] = useState('');

  // Operational metrics
  const totalToday = schedule.length;
  const checkedInCount = schedule.filter(s => s.status === 'checked_in' || s.status === 'in_consultation').length;
  const pendingCheckIns = schedule.filter(s => s.status === 'scheduled');
  const walkInCount = walkInQueue.length;

  const handleRegisterWalkIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!walkInName || !walkInPhone) return;

    onAddWalkIn({
      patientName: walkInName,
      patientPhone: walkInPhone,
      assignedDoctorId: 'doc_1',
      assignedDoctorName: walkInDoctor,
      requestedService: walkInService,
      arrivalTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      estimatedWaitMinutes: 15 + walkInQueue.length * 10,
      status: 'Waiting',
      notes: walkInNotes
    });

    onTriggerToast(`Walk-in patient ${walkInName} registered in queue!`);
    setShowWalkInModal(false);
    setWalkInName('');
    setWalkInPhone('');
    setWalkInNotes('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Banner / Operational Overview Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#1E293B] via-slate-800 to-[#0F172A] p-5 sm:p-6 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-black border border-blue-400/30 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" /> Reception & Front Desk Center
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Good Morning, {user.fullName.split(' ')[0]} 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl font-medium">
              Clinic is running smoothly today. Track check-ins, process walk-ins, and manage doctor schedules efficiently.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigateTab('checkin')}
              className="px-4 py-2.5 rounded-2xl bg-[#4F8EF7] hover:bg-blue-600 active:scale-95 text-white font-extrabold text-xs transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2"
            >
              <QrCode className="w-4 h-4" />
              <span>QR Scanner</span>
            </button>
            <button
              onClick={() => setShowWalkInModal(true)}
              className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs transition-all border border-white/15 flex items-center gap-2 backdrop-blur-sm"
            >
              <UserPlus className="w-4 h-4 text-emerald-400" />
              <span>Add Walk-In</span>
            </button>
          </div>
        </div>
      </div>

      {/* Today's Operational Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* Stat 1 */}
        <div className="p-4 rounded-3xl bg-white border border-slate-100 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Today Appts</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#4F8EF7] flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{totalToday}</div>
          <p className="text-[10px] font-bold text-slate-500">Scheduled across 3 doctors</p>
        </div>

        {/* Stat 2 */}
        <div className="p-4 rounded-3xl bg-white border border-slate-100 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Checked-In</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{checkedInCount}</div>
          <p className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Waiting or in room
          </p>
        </div>

        {/* Stat 3 */}
        <div className="p-4 rounded-3xl bg-white border border-slate-100 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Pending Check-In</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{pendingCheckIns.length}</div>
          <p className="text-[10px] font-bold text-amber-600">Expected arriving soon</p>
        </div>

        {/* Stat 4 */}
        <div className="p-4 rounded-3xl bg-white border border-slate-100 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Walk-In Queue</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{walkInCount}</div>
          <p className="text-[10px] font-bold text-purple-600">Unscheduled walk-ins</p>
        </div>
      </div>

      {/* Quick Action Hub */}
      <div className="p-4 bg-white rounded-3xl border border-slate-100 shadow-2xs space-y-3">
        <div className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
          Coordinator Quick Action Hub
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <button
            onClick={() => onNavigateTab('appointments')}
            className="p-3 rounded-2xl bg-purple-50/70 hover:bg-purple-100/80 border border-purple-100 text-slate-800 text-left transition-all flex items-center gap-3 group"
          >
            <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="font-extrabold text-xs text-slate-900">Book Appt</div>
              <div className="text-[10px] text-slate-500">New appointment</div>
            </div>
          </button>

          <button
            onClick={() => setShowWalkInModal(true)}
            className="p-3 rounded-2xl bg-emerald-50/70 hover:bg-emerald-100/80 border border-emerald-100 text-slate-800 text-left transition-all flex items-center gap-3 group"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <div className="font-extrabold text-xs text-slate-900">Walk-In Patient</div>
              <div className="text-[10px] text-slate-500">Register new walk-in</div>
            </div>
          </button>

          <button
            onClick={() => onNavigateTab('patients')}
            className="p-3 rounded-2xl bg-amber-50/70 hover:bg-amber-100/80 border border-amber-100 text-slate-800 text-left transition-all flex items-center gap-3 group"
          >
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <div className="font-extrabold text-xs text-slate-900">Receive Payment</div>
              <div className="text-[10px] text-slate-500">Process desk bills</div>
            </div>
          </button>
        </div>
      </div>

      {/* Grid Layout: Pending Check-Ins & Walk-In Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Check-Ins Section */}
        <div className="bg-white rounded-3xl border border-slate-100 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-500" />
              <h2 className="font-extrabold text-slate-900 text-base">Pending Check-Ins</h2>
            </div>
            <button
              onClick={() => onNavigateTab('appointments')}
              className="text-xs font-bold text-[#4F8EF7] hover:underline flex items-center gap-1"
            >
              <span>View All ({pendingCheckIns.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {pendingCheckIns.length === 0 ? (
            <div className="text-center py-8 bg-slate-50 rounded-2xl border border-slate-100 text-slate-400">
              <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500 mb-2" />
              <p className="text-xs font-bold text-slate-700">All scheduled patients are checked in!</p>
              <p className="text-[11px]">No pending arrivals for current time slot.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingCheckIns.slice(0, 4).map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 bg-slate-50 hover:bg-slate-100/80 rounded-2xl border border-slate-100 transition-all flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={item.patientAvatar}
                      alt={item.patientName}
                      className="w-10 h-10 rounded-xl object-cover ring-2 ring-slate-200"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-xs text-slate-900 truncate">{item.patientName}</span>
                        <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[9px] font-black uppercase">
                          {item.timeSlot}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate font-medium">{item.treatmentName}</p>
                      <p className="text-[10px] text-slate-400 truncate">Dr. {item.doctorName} • {item.roomNumber}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      onConfirmCheckIn(item.id);
                      onTriggerToast(`${item.patientName} marked as Checked In!`);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shrink-0 shadow-xs flex items-center gap-1"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Check In</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Walk-In Patients Queue */}
        <div className="bg-white rounded-3xl border border-slate-100 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-600" />
              <h2 className="font-extrabold text-slate-900 text-base">Walk-In Queue</h2>
            </div>
            <button
              onClick={() => setShowWalkInModal(true)}
              className="px-3 py-1 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 text-xs font-bold flex items-center gap-1 border border-purple-100"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Register Walk-In</span>
            </button>
          </div>

          {walkInQueue.length === 0 ? (
            <div className="text-center py-8 bg-slate-50 rounded-2xl border border-slate-100 text-slate-400">
              <Users className="w-8 h-8 mx-auto text-slate-300 mb-2" />
              <p className="text-xs font-bold text-slate-700">No active walk-in patients</p>
              <p className="text-[11px]">Click Register Walk-In to add unscheduled visits.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {walkInQueue.map((walkIn) => (
                <div
                  key={walkIn.id}
                  className="p-3.5 bg-purple-50/40 border border-purple-100 rounded-2xl flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-purple-600 text-white font-black text-sm flex items-center justify-center shrink-0">
                      #{walkIn.queueNumber}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-xs text-slate-900 truncate">{walkIn.patientName}</span>
                        <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 text-[9px] font-bold">
                          Arrived: {walkIn.arrivalTime}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 truncate font-medium">{walkIn.requestedService}</p>
                      <p className="text-[10px] text-slate-400 truncate">Assigned: {walkIn.assignedDoctorName}</p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="px-2.5 py-1 bg-amber-100 text-amber-800 text-[10px] font-black rounded-full block mb-1">
                      ~{walkIn.estimatedWaitMinutes} mins wait
                    </span>
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase">
                      {walkIn.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Register Walk-In Modal */}
      {showWalkInModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-emerald-600" />
                <h3 className="font-black text-slate-900 text-base">Register Walk-In Patient</h3>
              </div>
              <button
                onClick={() => setShowWalkInModal(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRegisterWalkIn} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Patient Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Nadia Mansoor"
                  value={walkInName}
                  onChange={(e) => setWalkInName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#4F8EF7]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Contact *</label>
                <input
                  type="tel"
                  required
                  placeholder="+966 5X XXX XXXX"
                  value={walkInPhone}
                  onChange={(e) => setWalkInPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#4F8EF7]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Assign Doctor</label>
                <select
                  value={walkInDoctor}
                  onChange={(e) => setWalkInDoctor(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#4F8EF7]"
                >
                  <option value="Dr. Fatima Al-Zahrani">Dr. Fatima Al-Zahrani (Dermatologist)</option>
                  <option value="Dr. Faisal Al-Dosari">Dr. Faisal Al-Dosari (Cosmetic Specialist)</option>
                  <option value="Dr. Fatima Al-Zahrani">Dr. Fatima Al-Zahrani (Aesthetic Nurse)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Requested Service / Reason</label>
                <input
                  type="text"
                  placeholder="e.g. Skin Analysis or Touch-up"
                  value={walkInService}
                  onChange={(e) => setWalkInService(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#4F8EF7]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Coordinator Notes (Optional)</label>
                <textarea
                  rows={2}
                  placeholder="Additional requests or instructions..."
                  value={walkInNotes}
                  onChange={(e) => setWalkInNotes(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#4F8EF7]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowWalkInModal(false)}
                  className="px-4 py-2 rounded-2xl text-slate-600 hover:bg-slate-100 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-md shadow-emerald-500/20"
                >
                  Confirm Walk-In
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
