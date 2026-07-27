import React, { useState } from 'react';
import {
  UserProfile,
  ClinicalScheduleItem,
  TreatmentSession,
  StaffNotification,
  StaffTabType
} from '../../types';
import {
  Calendar,
  Clock,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  Play,
  ArrowRight,
  Plus,
  Search,
  FileText,
  Activity,
  Bell,
  Sparkles,
  ShieldAlert,
  ChevronRight,
  Syringe,
  MapPin,
  Check,
  Heart
} from 'lucide-react';

interface DoctorDashboardViewProps {
  user: UserProfile;
  schedule: ClinicalScheduleItem[];
  sessions: TreatmentSession[];
  notifications: StaffNotification[];
  onNavigateTab: (tab: StaffTabType) => void;
  onSelectScheduleItem: (item: ClinicalScheduleItem) => void;
  onSelectSession: (session: TreatmentSession) => void;
  onUpdateScheduleStatus: (id: string, newStatus: ClinicalScheduleItem['status']) => void;
}

export const DoctorDashboardView: React.FC<DoctorDashboardViewProps> = ({
  user,
  schedule,
  sessions,
  notifications,
  onNavigateTab,
  onSelectScheduleItem,
  onSelectSession,
  onUpdateScheduleStatus
}) => {
  const [quickSearchQuery, setQuickSearchQuery] = useState('');

  // Statistics calculation
  const totalToday = schedule.length;
  const inConsultationCount = schedule.filter(s => s.status === 'in_consultation' || s.status === 'procedure').length;
  const checkedInCount = schedule.filter(s => s.status === 'checked_in').length;
  const completedCount = schedule.filter(s => s.status === 'completed').length;

  // Active current patient
  const currentScheduleItem = schedule.find(
    s => s.status === 'in_consultation' || s.status === 'procedure' || s.status === 'checked_in'
  ) || schedule[0];

  const activeSession = sessions.find(
    s => s.appointmentId === currentScheduleItem?.id || s.status === 'In Progress'
  );

  const upcomingAppointments = schedule.filter(
    s => s.status === 'scheduled' || s.status === 'checked_in'
  );

  return (
    <div className="space-y-6 pb-20 md:pb-10">
      {/* Welcome & Role Hero Header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-3xl p-5 md:p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-sky-300 text-[10px] font-bold uppercase tracking-wider border border-blue-400/20">
                {user.role === 'nurse' ? 'Aesthetic Nursing Portal' : user.role === 'coordinator' ? 'Clinic Coordinator' : 'Physician Portal'}
              </span>
              <span className="text-xs text-slate-300 font-medium">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              Good day, {user.fullName}
            </h1>
            <p className="text-xs text-slate-300 max-w-xl">
              You have <strong className="text-white">{checkedInCount} patient(s) checked in</strong> and waiting for procedure in {user.consultationRoom || 'Treatment Suite'}.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              id="dash-quick-schedule-btn"
              onClick={() => onNavigateTab('schedule')}
              className="px-4 py-2.5 bg-[#4F8EF7] hover:bg-blue-600 text-white font-bold text-xs rounded-2xl shadow-md transition flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Full Schedule ({totalToday})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {/* Total Today */}
        <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-2xs hover:shadow-md transition">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Today's Total</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#4F8EF7] flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{totalToday}</div>
          <p className="text-[11px] text-slate-500 mt-1">Scheduled appointments</p>
        </div>

        {/* Checked In / Waiting */}
        <div className="bg-white p-4 rounded-3xl border border-amber-100/80 shadow-2xs hover:shadow-md transition bg-amber-50/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">Checked-In</span>
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-800">{checkedInCount}</div>
          <p className="text-[11px] text-amber-700/80 mt-1 font-medium">Ready in lobby / pod</p>
        </div>

        {/* In Consultation / Procedure */}
        <div className="bg-white p-4 rounded-3xl border border-blue-100 shadow-2xs hover:shadow-md transition bg-blue-50/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-[#4F8EF7] uppercase tracking-wider">Active Room</span>
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-[#4F8EF7] flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-blue-900">{inConsultationCount}</div>
          <p className="text-[11px] text-blue-700/80 mt-1 font-medium">In procedure suite</p>
        </div>

        {/* Completed */}
        <div className="bg-white p-4 rounded-3xl border border-emerald-100 shadow-2xs hover:shadow-md transition bg-emerald-50/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">Completed</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-800">{completedCount}</div>
          <p className="text-[11px] text-emerald-700/80 mt-1 font-medium">Finished today</p>
        </div>
      </div>

      {/* Main Grid: Current Active Patient + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Current Patient Card & Timeline */}
        <div className="lg:col-span-2 space-y-6">
          {/* Current Active Patient Card */}
          {currentScheduleItem && (
            <div className="bg-white border border-slate-100 rounded-3xl p-5 md:p-6 shadow-md relative">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <h2 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider">
                    Current Patient Focus
                  </h2>
                </div>
                <span className="px-3 py-1 rounded-full bg-blue-50 text-[#4F8EF7] text-xs font-bold border border-blue-100">
                  {currentScheduleItem.roomNumber}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <img
                  src={currentScheduleItem.patientAvatar}
                  alt={currentScheduleItem.patientName}
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-blue-100 shrink-0"
                />
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-slate-900 text-lg">
                      {currentScheduleItem.patientName}
                    </h3>
                    <span className="text-xs text-slate-400 font-semibold">
                      ({currentScheduleItem.patientAge}y, {currentScheduleItem.patientGender})
                    </span>
                  </div>

                  <p className="text-xs font-bold text-[#4F8EF7] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{currentScheduleItem.treatmentName}</span>
                  </p>

                  <p className="text-xs text-slate-500 font-medium">
                    Scheduled: {currentScheduleItem.timeSlot} • Reason: {currentScheduleItem.visitReason}
                  </p>
                </div>

                <div className="shrink-0 flex sm:flex-col gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    id="dash-open-patient-records-btn"
                    onClick={() => onNavigateTab('patients')}
                    className="flex-1 sm:flex-initial px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
                  >
                    <FileText className="w-3.5 h-3.5 text-sky-300" />
                    <span>View Medical File</span>
                  </button>

                  <button
                    type="button"
                    id="dash-open-session-btn"
                    onClick={() => onNavigateTab('sessions')}
                    className="flex-1 sm:flex-initial px-3.5 py-2 bg-[#4F8EF7] hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <Activity className="w-3.5 h-3.5" />
                    <span>Treatment Session</span>
                  </button>
                </div>
              </div>



              {/* Vitals Summary */}
              {currentScheduleItem.vitalSigns && (
                <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-bold block">Blood Pressure</span>
                    <span className="font-extrabold text-slate-800">{currentScheduleItem.vitalSigns.bp || '120/80'}</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-bold block">Pulse Rate</span>
                    <span className="font-extrabold text-slate-800">{currentScheduleItem.vitalSigns.pulse || 72} bpm</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-bold block">Skin Type</span>
                    <span className="font-extrabold text-slate-800">{currentScheduleItem.vitalSigns.skinType || 'Fitzpatrick II'}</span>
                  </div>
                </div>
              )}

              {/* Status Change Buttons */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <span className="text-slate-500 font-medium">Update Patient Status:</span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => onUpdateScheduleStatus(currentScheduleItem.id, 'in_consultation')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                      currentScheduleItem.status === 'in_consultation'
                        ? 'bg-[#4F8EF7] text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    In Consultation
                  </button>
                  <button
                    type="button"
                    onClick={() => onUpdateScheduleStatus(currentScheduleItem.id, 'procedure')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                      currentScheduleItem.status === 'procedure'
                        ? 'bg-purple-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    In Procedure
                  </button>
                  <button
                    type="button"
                    onClick={() => onUpdateScheduleStatus(currentScheduleItem.id, 'completed')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                      currentScheduleItem.status === 'completed'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Complete Session
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column (1 Col): Quick Actions + Clinical Alerts */}
        <div className="space-y-6">
          {/* Quick Actions Panel */}
          <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-2xs space-y-3">
            <h3 className="font-extrabold text-sm text-slate-900 tracking-tight flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#4F8EF7]" />
              <span>Clinical Quick Actions</span>
            </h3>

            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                id="dash-qa-schedule-btn"
                onClick={() => onNavigateTab('schedule')}
                className="w-full text-left p-3 bg-slate-50 hover:bg-blue-50/60 border border-slate-100 hover:border-blue-200 rounded-2xl transition flex items-center gap-3 group"
              >
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-[#4F8EF7] flex items-center justify-center shrink-0 group-hover:bg-[#4F8EF7] group-hover:text-white transition">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-800">Daily Schedule & Filtering</h4>
                  <p className="text-[10px] text-slate-500">View calendar and update statuses</p>
                </div>
              </button>

              <button
                type="button"
                id="dash-qa-patients-btn"
                onClick={() => onNavigateTab('patients')}
                className="w-full text-left p-3 bg-slate-50 hover:bg-emerald-50/60 border border-slate-100 hover:border-emerald-200 rounded-2xl transition flex items-center gap-3 group"
              >
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-800">Search Patient Records</h4>
                  <p className="text-[10px] text-slate-500">Access medical history & allergies</p>
                </div>
              </button>

              <button
                type="button"
                id="dash-qa-sessions-btn"
                onClick={() => onNavigateTab('sessions')}
                className="w-full text-left p-3 bg-slate-50 hover:bg-purple-50/60 border border-slate-100 hover:border-purple-200 rounded-2xl transition flex items-center gap-3 group"
              >
                <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 group-hover:bg-purple-600 group-hover:text-white transition">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-800">Treatment Session Tracker</h4>
                  <p className="text-[10px] text-slate-500">Log machines, consumables & items</p>
                </div>
              </button>

              <button
                type="button"
                id="dash-qa-notifs-btn"
                onClick={() => onNavigateTab('notifications')}
                className="w-full text-left p-3 bg-slate-50 hover:bg-sky-50/60 border border-slate-100 hover:border-sky-200 rounded-2xl transition flex items-center gap-3 group"
              >
                <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0 group-hover:bg-sky-600 group-hover:text-white transition">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-800">Staff Notifications</h4>
                  <p className="text-[10px] text-slate-500">Patient check-ins & cancellations</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
