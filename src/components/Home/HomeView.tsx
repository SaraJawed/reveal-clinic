import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  UserProfile,
  ClinicBranch,
  Appointment,
  ActiveUserPackage,
  MedicalReport,
  TreatmentService,
  TreatmentPackage,
  TabType
} from '../../types';
import {
  Plus,
  CreditCard,
  Gift,
  FileText,
  Download,
  Award,
  Share2,
  ChevronRight,
  Clock,
  Sparkles,
  Calendar,
  MapPin,
  CheckCircle2,
  Check,
  X
} from 'lucide-react';

interface HomeViewProps {
  user: UserProfile;
  selectedBranch: ClinicBranch;
  upcomingAppointments: Appointment[];
  activePackages: ActiveUserPackage[];
  recentReports: MedicalReport[];
  popularTreatments: TreatmentService[];
  featuredPackages: TreatmentPackage[];
  onChangeTab: (tab: TabType) => void;
  onViewMyVisits: () => void;
  onSelectDoctorOrTreatment?: (item: any) => void;
  onOpenGiftCards: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  user,
  selectedBranch,
  upcomingAppointments,
  activePackages,
  recentReports,
  popularTreatments,
  featuredPackages,
  onChangeTab,
  onViewMyVisits,
  onOpenGiftCards
}) => {
  const { t } = useTranslation('home');
  const nextAppt = upcomingAppointments[0];
  const [selectedActivePackage, setSelectedActivePackage] = useState<ActiveUserPackage | null>(null);

  return (
    <div className="space-y-8 pb-20 md:pb-8">
      {/* Welcome Header */}
      <div className="flex items-center gap-3.5 sm:gap-4 pb-2">
        <img
          src={user.avatarUrl}
          alt={user.fullName}
          className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover ring-2 ring-blue-100 shadow-xs shrink-0"
        />
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight truncate">
            {t('welcome.greeting', { name: user.fullName })}
          </h1>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            <p className="text-xs sm:text-sm text-slate-500">{t('welcome.subtitle')}</p>
            <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full whitespace-nowrap">
              {t('welcome.fileId', { id: user.patientId })}
            </span>
          </div>
        </div>
      </div>

      {/* 1. Quick Action: Book Appointment */}
      <button
        id="home-action-book-btn"
        onClick={() => onChangeTab('appointments')}
        className="relative w-full overflow-hidden bg-gradient-to-r from-blue-600 to-sky-500 text-white p-5 sm:p-6 rounded-3xl flex items-center gap-4 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
      >
        <div className="absolute -top-10 -right-6 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
          <Plus className="w-6 h-6 text-white" />
        </div>
        <div className="relative text-left min-w-0">
          <span className="font-bold text-base block">{t('quickAction.bookAppointment')}</span>
          <span className="text-xs text-blue-100 font-medium">{t('quickAction.subtitle')}</span>
        </div>
        <ChevronRight className="relative w-5 h-5 text-white/70 ml-auto shrink-0" />
      </button>

      {/* 2. Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Next Appointment & Active Packages */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Next Appointment Card */}
          <div className="bg-white rounded-[32px] p-6 sm:p-8 shadow-xs flex flex-col gap-6 border border-slate-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-800">{t('nextAppointment.title')}</h2>
              <button
                id="home-view-calendar-btn"
                onClick={onViewMyVisits}
                className="text-[#4F8EF7] text-sm font-semibold cursor-pointer hover:underline"
              >
                {t('nextAppointment.myVisits')}
              </button>
            </div>

            {nextAppt ? (
              <div className="p-4 sm:p-5 bg-gradient-to-br from-blue-50/70 via-white to-sky-50/40 rounded-2xl border border-blue-100/60">
                <div className="flex items-start gap-3.5 sm:gap-4">
                  <img
                    src={nextAppt.doctorAvatar}
                    alt={nextAppt.doctorName}
                    className="w-14 h-14 rounded-2xl object-cover ring-2 ring-white shadow-xs shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-bold text-slate-800 text-base leading-tight">{nextAppt.treatmentName}</p>
                      {nextAppt.status === 'pending' ? (
                        <span className="shrink-0 px-2.5 py-1 bg-amber-100 text-amber-700 text-[10px] font-bold uppercase rounded-full tracking-wider flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {t('nextAppointment.pendingConfirmation')}
                        </span>
                      ) : (
                        <span className="shrink-0 px-2.5 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase rounded-full tracking-wider flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> {t('nextAppointment.confirmed')}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-600 font-semibold mt-0.5 truncate">{nextAppt.doctorName}</p>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-xs text-slate-500">
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-blue-500" /> {nextAppt.date}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-blue-500" /> {nextAppt.timeSlot}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-blue-500" /> {selectedBranch.name}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 bg-slate-50 rounded-2xl text-center">
                <p className="text-sm text-slate-500 mb-3">{t('nextAppointment.noAppointments')}</p>
                <button
                  id="home-schedule-first-btn"
                  onClick={() => onChangeTab('appointments')}
                  className="px-4 py-2 bg-[#4F8EF7] text-white rounded-2xl text-xs font-semibold cursor-pointer"
                >
                  {t('nextAppointment.scheduleAppointment')}
                </button>
              </div>
            )}
          </div>

          {/* Active Treatment Package */}
          <div className="bg-white rounded-[32px] p-6 sm:p-8 shadow-xs border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-800">{t('myPackages.title')}</h2>
            </div>

            <div className="space-y-4">
              {activePackages.length > 0 ? (
                activePackages.slice(0, 1).map((pack) => {
                  const initial = pack.packageName.charAt(0);
                  const sessionsUsed = pack.totalSessions - pack.remainingSessions;
                  const progressPercent = Math.min(100, Math.round((sessionsUsed / pack.totalSessions) * 100));
                  return (
                    <button
                      key={pack.id}
                      type="button"
                      id={`home-package-${pack.id}-btn`}
                      onClick={() => setSelectedActivePackage(pack)}
                      className="w-full text-left p-4 border border-blue-100/80 bg-gradient-to-r from-blue-50/60 via-sky-50/40 to-indigo-50/20 rounded-2xl space-y-3 hover:shadow-md hover:border-blue-200 transition cursor-pointer"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-2xl bg-[#4F8EF7] text-white flex items-center justify-center font-bold text-base shrink-0 shadow-xs">
                            {initial}
                          </div>
                          <div className="min-w-0">
                            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">{t('myPackages.currentlyTaking')}</span>
                            <p className="text-sm font-bold text-slate-800 truncate">{pack.packageName}</p>
                          </div>
                        </div>
                        <span className="text-xs font-black text-[#4F8EF7] bg-white px-2.5 py-1 rounded-xl shrink-0 border border-blue-100">
                          {sessionsUsed}/{pack.totalSessions}
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-white rounded-full overflow-hidden border border-blue-100/60">
                        <div
                          className="h-full bg-[#4F8EF7] rounded-full transition-all"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="p-4 border border-dashed border-slate-200 rounded-2xl text-center text-xs text-slate-500">
                  {t('myPackages.noActivePackage')}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Recent Reports */}
        <div className="lg:col-span-5 flex flex-col gap-6">

          {/* Recent Reports */}
          <div className="bg-white rounded-[32px] p-6 sm:p-8 shadow-xs border border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-800">{t('recentReports.title')}</h2>
              <button
                id="home-all-reports-btn"
                onClick={() => onChangeTab('reports')}
                className="text-xs text-[#4F8EF7] font-semibold hover:underline"
              >
                {t('recentReports.viewAll')}
              </button>
            </div>
            <div className="space-y-4">
              {recentReports.slice(0, 2).map((rep, idx) => (
                <React.Fragment key={rep.id}>
                  {idx > 0 && <div className="h-px bg-slate-100" />}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-700">{rep.title}</p>
                      <p className="text-[11px] text-slate-400">{t('recentReports.dateLabel', { date: rep.date })}</p>
                    </div>
                    <button
                      id={`home-view-pdf-${rep.id}`}
                      onClick={() => onChangeTab('reports')}
                      className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-[#4F8EF7]"
                      title={t('recentReports.viewReportPdf')}
                    >
                      <Download className="w-5 h-5" />
                    </button>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Popular Treatments Grid */}
      <div className="pt-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-800">{t('popularTreatments.title')}</h2>
            <p className="text-xs text-slate-500">{t('popularTreatments.subtitle')}</p>
          </div>
          <button
            id="home-explore-treatments-btn"
            onClick={() => onChangeTab('services')}
            className="text-xs font-bold text-[#4F8EF7] hover:underline flex items-center gap-1"
          >
            {t('popularTreatments.exploreAll')} <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularTreatments.map((treat) => (
            <div
              key={treat.id}
              className="bg-white rounded-3xl border border-slate-100 shadow-xs overflow-hidden flex flex-col justify-between hover:shadow-md transition-all"
            >
              <div className="relative h-36 overflow-hidden">
                <img
                  src={treat.imageUrl}
                  alt={treat.name}
                  className="w-full h-full object-cover hover:scale-105 transition duration-300"
                />
                <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-slate-800 text-[10px] font-bold px-3 py-1 rounded-full shadow-xs">
                  {treat.categoryName}
                </span>
                <span className="absolute bottom-3 right-3 bg-[#4F8EF7] text-white font-black text-xs px-2.5 py-1 rounded-xl shadow-xs">
                  ${treat.price}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">{treat.name}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                    {treat.shortDescription}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" /> {t('popularTreatments.durationMinutes', { minutes: treat.durationMinutes })}
                  </span>
                  <button
                    id={`home-book-${treat.id}`}
                    onClick={() => onChangeTab('appointments')}
                    className="px-3.5 py-1.5 bg-blue-50 text-[#4F8EF7] font-semibold rounded-xl text-xs hover:bg-[#4F8EF7] hover:text-white transition-colors"
                  >
                    {t('popularTreatments.bookNow')}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MY PACKAGE DETAIL MODAL */}
      {selectedActivePackage && (() => {
        const fullPackage = featuredPackages.find((p) => p.id === selectedActivePackage.packageId);
        const sessionsUsed = selectedActivePackage.totalSessions - selectedActivePackage.remainingSessions;
        const progressPercent = Math.min(100, Math.round((sessionsUsed / selectedActivePackage.totalSessions) * 100));
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-100 max-h-[85vh] flex flex-col">
              {fullPackage?.imageUrl && (
                <img
                  src={fullPackage.imageUrl}
                  alt={selectedActivePackage.packageName}
                  className="w-full h-36 object-cover shrink-0"
                />
              )}
              <div className="p-5 space-y-4 overflow-y-auto flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">{t('packageDetail.currentlyTaking')}</span>
                    <h3 className="font-extrabold text-slate-900 text-base leading-tight">{selectedActivePackage.packageName}</h3>
                  </div>
                  <button
                    id="home-package-detail-close-btn"
                    onClick={() => setSelectedActivePackage(null)}
                    className="text-slate-400 hover:text-slate-600 shrink-0"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {fullPackage?.description && (
                  <p className="text-xs text-slate-500 leading-relaxed">{fullPackage.description}</p>
                )}

                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1.5">
                    <span>{t('packageDetail.sessionsUsed')}</span>
                    <span className="text-[#4F8EF7]">{sessionsUsed}/{selectedActivePackage.totalSessions}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#4F8EF7] rounded-full" style={{ width: `${progressPercent}%` }} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <span className="block text-[10px] text-slate-400 font-bold uppercase">{t('packageDetail.purchasedOn')}</span>
                    <span className="font-bold text-slate-800">{selectedActivePackage.purchaseDate}</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <span className="block text-[10px] text-slate-400 font-bold uppercase">{t('packageDetail.validUntil')}</span>
                    <span className="font-bold text-slate-800">{selectedActivePackage.expiryDate}</span>
                  </div>
                </div>

                {fullPackage?.includedTreatments && fullPackage.includedTreatments.length > 0 && (
                  <div className="bg-blue-50/70 p-3.5 rounded-2xl border border-blue-100 space-y-1.5">
                    <h4 className="font-bold text-blue-900 text-xs">{t('packageDetail.includedInPackage')}</h4>
                    {fullPackage.includedTreatments.map((treatmentName, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-700">
                        <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" /> {treatmentName}
                      </div>
                    ))}
                  </div>
                )}

                <div className="bg-slate-900 p-3.5 rounded-2xl text-center">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">{t('packageDetail.qrCheckInCode')}</span>
                  <span className="font-mono font-bold text-sky-300 text-sm">{selectedActivePackage.qrCodeValue}</span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedActivePackage(null);
                    onChangeTab('services');
                  }}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl text-xs transition"
                >
                  {t('packageDetail.browseMorePackages')}
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};

