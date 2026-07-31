import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ClinicalScheduleItem,
  ClinicalAppointmentStatus,
  Doctor,
  UserProfile
} from '../../types';
import {
  Calendar as CalendarIcon,
  Clock,
  Filter,
  User,
  MapPin,
  ShieldAlert,
  FileText,
  ChevronRight,
  X,
  CheckCircle2,
  AlertCircle,
  Search,
  ChevronLeft,
  CalendarCheck,
  Stethoscope
} from 'lucide-react';

interface DoctorScheduleViewProps {
  schedule: ClinicalScheduleItem[];
  user: UserProfile;
  doctors: Doctor[];
  onUpdateStatus: (id: string, status: ClinicalAppointmentStatus) => void;
  onSelectPatientFile?: (patientId: string) => void;
}

export const DoctorScheduleView: React.FC<DoctorScheduleViewProps> = ({
  schedule,
  user,
  doctors,
  onUpdateStatus,
  onSelectPatientFile
}) => {
  const { t } = useTranslation('doctor');
  const [viewMode, setViewMode] = useState<'daily' | 'weekly'>('daily');
  const [selectedDate, setSelectedDate] = useState<'Today' | 'Tomorrow' | 'This Week'>('Today');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [selectedDoctorFilter, setSelectedDoctorFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected item modal
  const [selectedAppointment, setSelectedAppointment] = useState<ClinicalScheduleItem | null>(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  // Date filter option display key mapping (underlying values stay unchanged for state/logic)
  const dateOptionKeys: Record<'Today' | 'Tomorrow' | 'This Week', string> = {
    'Today': 'today',
    'Tomorrow': 'tomorrow',
    'This Week': 'thisWeek'
  };

  // Weekly day display key mapping
  const dayKeys: Record<string, string> = {
    'Monday': 'monday',
    'Tuesday': 'tuesday',
    'Wednesday': 'wednesday',
    'Thursday': 'thursday',
    'Friday': 'friday'
  };

  // Status mapping
  const statusOptions: Array<{ value: ClinicalAppointmentStatus; label: string; badgeClass: string }> = [
    { value: 'scheduled', label: t('schedule.status.scheduled'), badgeClass: 'bg-slate-100 text-slate-700 border-slate-200' },
    { value: 'checked_in', label: t('schedule.status.checkedIn'), badgeClass: 'bg-amber-100 text-amber-800 border-amber-200' },
    { value: 'in_consultation', label: t('schedule.status.inConsultation'), badgeClass: 'bg-blue-100 text-[#4F8EF7] border-blue-200' },
    { value: 'procedure', label: t('schedule.status.procedure'), badgeClass: 'bg-purple-100 text-purple-700 border-purple-200' },
    { value: 'completed', label: t('schedule.status.completed'), badgeClass: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
    { value: 'cancelled', label: t('schedule.status.cancelled'), badgeClass: 'bg-rose-100 text-rose-700 border-rose-200' }
  ];

  // Filtering
  const filteredSchedule = schedule.filter((item) => {
    // Status filter
    if (selectedStatusFilter !== 'all' && item.status !== selectedStatusFilter) {
      return false;
    }
    // Doctor filter
    if (selectedDoctorFilter !== 'all' && item.doctorId !== selectedDoctorFilter) {
      return false;
    }
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesName = item.patientName.toLowerCase().includes(q);
      const matchesTreatment = item.treatmentName.toLowerCase().includes(q);
      const matchesRoom = item.roomNumber.toLowerCase().includes(q);
      if (!matchesName && !matchesTreatment && !matchesRoom) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-20 md:pb-10">
      {/* Header & Controls */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 md:p-6 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-2xl bg-blue-50 text-[#4F8EF7]">
                <CalendarIcon className="w-5 h-5" />
              </span>
              <div>
                <h1 className="font-extrabold text-lg text-slate-900 tracking-tight">
                  {t('schedule.header.title')}
                </h1>
                <p className="text-xs text-slate-500">
                  {t('schedule.header.subtitle')}
                </p>
              </div>
            </div>
          </div>

          {/* Daily vs Weekly Toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-2xl shrink-0 self-start md:self-auto">
            <button
              type="button"
              id="schedule-view-daily-btn"
              onClick={() => setViewMode('daily')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                viewMode === 'daily'
                  ? 'bg-white text-[#4F8EF7] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t('schedule.viewToggle.daily')}
            </button>
            <button
              type="button"
              id="schedule-view-weekly-btn"
              onClick={() => setViewMode('weekly')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                viewMode === 'weekly'
                  ? 'bg-white text-[#4F8EF7] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t('schedule.viewToggle.weekly')}
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {/* Date Selector */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              {t('schedule.filters.dateLabel')}
            </label>
            <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-200/80 text-xs font-bold">
              {(['Today', 'Tomorrow', 'This Week'] as const).map((d) => (
                <button
                  key={d}
                  onClick={() => setSelectedDate(d)}
                  className={`flex-1 py-1.5 rounded-lg transition ${
                    selectedDate === d ? 'bg-white text-[#4F8EF7] shadow-2xs' : 'text-slate-600'
                  }`}
                >
                  {t(`schedule.filters.dateOptions.${dateOptionKeys[d]}`)}
                </button>
              ))}
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              {t('schedule.filters.statusLabel')}
            </label>
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-semibold text-slate-800 outline-hidden"
            >
              <option value="all">{t('schedule.filters.allStatuses', { count: schedule.length })}</option>
              <option value="scheduled">{t('schedule.status.scheduled')}</option>
              <option value="checked_in">{t('schedule.status.checkedIn')}</option>
              <option value="in_consultation">{t('schedule.status.inConsultation')}</option>
              <option value="procedure">{t('schedule.status.procedure')}</option>
              <option value="completed">{t('schedule.status.completed')}</option>
              <option value="cancelled">{t('schedule.status.cancelled')}</option>
            </select>
          </div>

          {/* Quick Search Input */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              {t('schedule.filters.searchLabel')}
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('schedule.filters.searchPlaceholder')}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-semibold text-slate-800 outline-hidden focus:bg-white focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main View Display */}
      {viewMode === 'daily' ? (
        /* Daily Timeline View */
        <div className="space-y-4">
          {filteredSchedule.length === 0 ? (
            <div className="bg-white border border-slate-100 rounded-3xl p-10 text-center space-y-3">
              <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto">
                <CalendarIcon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-800 text-sm">{t('schedule.empty.title')}</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {t('schedule.empty.subtitle')}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredSchedule.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border border-slate-100 rounded-3xl p-4 md:p-5 shadow-2xs hover:shadow-md transition space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    {/* Time Slot & Queue Number */}
                    <div className="flex items-center gap-3">
                      <div className="px-3 py-2 rounded-2xl bg-blue-50 border border-blue-100 text-[#4F8EF7] text-xs font-extrabold flex items-center gap-1.5 shrink-0">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{item.timeSlot}</span>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold">
                        {t('schedule.list.queueNumber', { number: item.queueNumber })}
                      </span>
                      <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{item.roomNumber}</span>
                      </span>
                    </div>

                    {/* Status Badge */}
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold border capitalize ${
                          statusOptions.find((s) => s.value === item.status)?.badgeClass ||
                          'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {statusOptions.find((s) => s.value === item.status)?.label || item.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  {/* Patient Info Card */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.patientAvatar}
                        alt={item.patientName}
                        className="w-12 h-12 rounded-2xl object-cover ring-2 ring-slate-100 shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-extrabold text-sm text-slate-900">{item.patientName}</h3>
                          <span className="text-xs text-slate-400 font-medium">
                            {t('schedule.list.ageGender', { age: item.patientAge, gender: item.patientGender })}
                          </span>
                        </div>
                        <p className="text-xs font-bold text-[#4F8EF7]">{item.treatmentName}</p>
                        <p className="text-[11px] text-slate-500 font-medium leading-tight">
                          {t('schedule.list.attendingType', { doctor: item.doctorName, type: item.consultationType })}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-end">
                      <button
                        type="button"
                        onClick={() => setSelectedAppointment(item)}
                        className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                      >
                        <FileText className="w-3.5 h-3.5 text-sky-300" />
                        <span>{t('schedule.list.detailsButton')}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Weekly Calendar View Grid */
        <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-sm text-slate-900">
              {t('schedule.weekly.title')}
            </h3>
            <span className="text-xs font-bold text-[#4F8EF7]">{t('schedule.weekly.operatingDays')}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day, idx) => {
              const dayItems = schedule.slice(0, 2 + idx);
              return (
                <div key={day} className="bg-slate-50/70 border border-slate-100 rounded-2xl p-3 space-y-2">
                  <div className="font-bold text-xs text-slate-800 border-b border-slate-200/60 pb-1.5 flex justify-between">
                    <span>{t(`schedule.weekly.days.${dayKeys[day]}`)}</span>
                    <span className="text-[10px] text-slate-400">Jul {20 + idx}</span>
                  </div>

                  <div className="space-y-2">
                    {dayItems.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => setSelectedAppointment(item)}
                        className="p-2 bg-white rounded-xl border border-slate-200/70 shadow-2xs text-[11px] cursor-pointer hover:border-[#4F8EF7] transition"
                      >
                        <div className="font-extrabold text-[#4F8EF7] text-[10px]">{item.timeSlot}</div>
                        <div className="font-bold text-slate-900 truncate">{item.patientName}</div>
                        <div className="text-slate-500 truncate text-[10px]">{item.treatmentName}</div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Appointment Details & Status Updater Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100 relative max-h-[92vh] flex flex-col">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={selectedAppointment.patientAvatar}
                  alt={selectedAppointment.patientName}
                  className="w-12 h-12 rounded-2xl object-cover ring-2 ring-white/20"
                />
                <div>
                  <h3 className="font-extrabold text-base">{selectedAppointment.patientName}</h3>
                  <p className="text-xs text-sky-200 font-medium">
                    {selectedAppointment.treatmentName} • {selectedAppointment.timeSlot}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedAppointment(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 overflow-y-auto flex-1 space-y-4">
              {/* Allergy Warning */}
              {selectedAppointment.allergyAlerts.length > 0 && (
                <div className="p-3 bg-amber-50 border border-amber-200/80 rounded-2xl flex items-start gap-2 text-xs font-semibold text-amber-900">
                  <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-[10px] uppercase text-amber-900 block">
                      {t('schedule.modal.allergyCautionFlag')}
                    </span>
                    {selectedAppointment.allergyAlerts.join(', ')}
                  </div>
                </div>
              )}

              {/* Status Update Options */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  {t('schedule.modal.updateStatusLabel')}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {statusOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        onUpdateStatus(selectedAppointment.id, opt.value);
                        setSelectedAppointment({ ...selectedAppointment, status: opt.value });
                      }}
                      className={`p-2.5 rounded-2xl text-xs font-bold border transition flex items-center justify-between ${
                        selectedAppointment.status === opt.value
                          ? 'bg-[#4F8EF7] text-white border-[#4F8EF7] shadow-xs'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200/80'
                      }`}
                    >
                      <span>{opt.label}</span>
                      {selectedAppointment.status === opt.value && <CheckCircle2 className="w-4 h-4 text-white" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Patient Summary Details */}
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-2 text-xs">
                <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                  <span className="text-slate-500">{t('schedule.modal.fields.patientId')}</span>
                  <span className="font-bold text-slate-900">{selectedAppointment.patientId}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                  <span className="text-slate-500">{t('schedule.modal.fields.ageGender')}</span>
                  <span className="font-bold text-slate-900">{t('schedule.modal.fields.ageGenderValue', { age: selectedAppointment.patientAge, gender: selectedAppointment.patientGender })}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                  <span className="text-slate-500">{t('schedule.modal.fields.consultationType')}</span>
                  <span className="font-bold text-slate-900">{selectedAppointment.consultationType}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                  <span className="text-slate-500">{t('schedule.modal.fields.roomLocation')}</span>
                  <span className="font-bold text-slate-900">{selectedAppointment.roomNumber}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                  <span className="text-slate-500">{t('schedule.modal.fields.paymentStatus')}</span>
                  <span className="font-bold text-emerald-700">{selectedAppointment.paymentStatus || t('schedule.modal.fields.paymentStatusPaid')}</span>
                </div>
                <div className="pt-1">
                  <span className="text-slate-500 font-semibold block mb-0.5">{t('schedule.modal.fields.visitReason')}</span>
                  <p className="text-slate-800 font-medium bg-white p-2 rounded-xl border border-slate-200/60">
                    {selectedAppointment.visitReason}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2">
                {onSelectPatientFile && (
                  <button
                    type="button"
                    onClick={() => {
                      onSelectPatientFile(selectedAppointment.patientId);
                      setSelectedAppointment(null);
                    }}
                    className="flex-1 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold text-xs transition flex items-center justify-center gap-1.5"
                  >
                    <FileText className="w-4 h-4 text-sky-300" />
                    <span>{t('schedule.modal.openPatientFile')}</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setSelectedAppointment(null)}
                  className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold text-xs transition"
                >
                  {t('common:buttons.close')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
