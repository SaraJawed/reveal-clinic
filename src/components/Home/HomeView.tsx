import React from 'react';
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
  CheckCircle2
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
  onOpenCheckIn: () => void;
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
  onChangeTab,
  onOpenCheckIn,
  onOpenGiftCards
}) => {
  const nextAppt = upcomingAppointments[0];

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
            Good day, {user.fullName}
          </h1>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            <p className="text-xs sm:text-sm text-slate-500">Welcome back to Reveal Clinic.</p>
            <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full whitespace-nowrap">
              File ID: {user.patientId}
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
          <span className="font-bold text-base block">Book Appointment</span>
          <span className="text-xs text-blue-100 font-medium">Schedule your next visit in seconds</span>
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
              <h2 className="text-lg font-bold text-slate-800">Next Appointment</h2>
              <button
                id="home-view-calendar-btn"
                onClick={() => onChangeTab('appointments')}
                className="text-[#4F8EF7] text-sm font-semibold cursor-pointer hover:underline"
              >
                View Calendar
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
                      <span className="shrink-0 px-2.5 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase rounded-full tracking-wider flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Confirmed
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 font-semibold mt-0.5 truncate">{nextAppt.doctorName}</p>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-xs text-slate-500">
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-blue-500" /> {nextAppt.date}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-blue-500" /> {nextAppt.timeSlot}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-blue-500" /> {selectedBranch.name}</span>
                    </div>
                  </div>
                </div>
                <div className="pt-3 mt-3 border-t border-blue-100/60 flex justify-end">
                  <button
                    id="home-appt-checkin-btn"
                    onClick={onOpenCheckIn}
                    className="px-4 py-2 bg-[#4F8EF7] hover:bg-blue-600 text-white text-xs font-bold rounded-xl transition shadow-xs cursor-pointer"
                  >
                    Check In Now
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-6 bg-slate-50 rounded-2xl text-center">
                <p className="text-sm text-slate-500 mb-3">No upcoming appointments scheduled.</p>
                <button
                  id="home-schedule-first-btn"
                  onClick={() => onChangeTab('appointments')}
                  className="px-4 py-2 bg-[#4F8EF7] text-white rounded-2xl text-xs font-semibold cursor-pointer"
                >
                  Schedule Appointment
                </button>
              </div>
            )}
          </div>

          {/* Active Treatment Package */}
          <div className="bg-white rounded-[32px] p-6 sm:p-8 shadow-xs border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-800">My Packages</h2>
              <button
                id="home-browse-packages-btn"
                onClick={() => onChangeTab('services')}
                className="text-xs font-bold text-[#4F8EF7] hover:underline cursor-pointer"
              >
                Browse All
              </button>
            </div>

            <div className="space-y-4">
              {activePackages.length > 0 ? (
                activePackages.slice(0, 1).map((pack) => {
                  const initial = pack.packageName.charAt(0);
                  const sessionsUsed = pack.totalSessions - pack.remainingSessions;
                  const progressPercent = Math.min(100, Math.round((sessionsUsed / pack.totalSessions) * 100));
                  return (
                    <div key={pack.id} className="p-4 border border-blue-100/80 bg-gradient-to-r from-blue-50/60 via-sky-50/40 to-indigo-50/20 rounded-2xl space-y-3">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-2xl bg-[#4F8EF7] text-white flex items-center justify-center font-bold text-base shrink-0 shadow-xs">
                            {initial}
                          </div>
                          <div className="min-w-0">
                            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">Currently Taking</span>
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
                    </div>
                  );
                })
              ) : (
                <div className="p-4 border border-dashed border-slate-200 rounded-2xl text-center text-xs text-slate-500">
                  No Active Package
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
              <h2 className="text-lg font-bold text-slate-800">Recent Reports</h2>
              <button
                id="home-all-reports-btn"
                onClick={() => onChangeTab('reports')}
                className="text-xs text-[#4F8EF7] font-semibold hover:underline"
              >
                View All
              </button>
            </div>
            <div className="space-y-4">
              {recentReports.slice(0, 2).map((rep, idx) => (
                <React.Fragment key={rep.id}>
                  {idx > 0 && <div className="h-px bg-slate-100" />}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-700">{rep.title}</p>
                      <p className="text-[11px] text-slate-400">Date: {rep.date}</p>
                    </div>
                    <button
                      id={`home-view-pdf-${rep.id}`}
                      onClick={() => onChangeTab('reports')}
                      className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-[#4F8EF7]"
                      title="View Report PDF"
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
            <h2 className="text-xl font-bold text-slate-800">Featured Aesthetic Treatments</h2>
            <p className="text-xs text-slate-500">Curated skin care and cosmetic dermatological services</p>
          </div>
          <button
            id="home-explore-treatments-btn"
            onClick={() => onChangeTab('services')}
            className="text-xs font-bold text-[#4F8EF7] hover:underline flex items-center gap-1"
          >
            Explore All <ChevronRight className="w-4 h-4" />
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
                    <Clock className="w-3.5 h-3.5 text-slate-400" /> {treat.durationMinutes} mins
                  </span>
                  <button
                    id={`home-book-${treat.id}`}
                    onClick={() => onChangeTab('appointments')}
                    className="px-3.5 py-1.5 bg-blue-50 text-[#4F8EF7] font-semibold rounded-xl text-xs hover:bg-[#4F8EF7] hover:text-white transition-colors"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

