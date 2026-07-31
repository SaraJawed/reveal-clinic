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
  Sparkles
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Good day, {user.fullName}
            </h1>
            <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full whitespace-nowrap">
              File ID: {user.patientId}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">Welcome back to Reveal Clinic.</p>
        </div>
      </div>

      {/* 1. Quick Action: Book Appointment */}
      <button
        id="home-action-book-btn"
        onClick={() => onChangeTab('appointments')}
        className="w-full bg-[#4F8EF7] text-white p-5 sm:p-6 rounded-3xl flex items-center justify-center gap-3 shadow-lg shadow-blue-100 hover:opacity-90 transition-opacity cursor-pointer"
      >
        <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
          <Plus className="w-6 h-6 text-white" />
        </div>
        <span className="font-semibold text-base">Book Appointment</span>
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
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 p-4 sm:p-5 bg-slate-50 rounded-2xl border border-slate-100/80">
                <div className="flex-1">
                  <p className="font-bold text-slate-800 text-base">{nextAppt.treatmentName}</p>
                  <p className="text-sm text-slate-500">{nextAppt.date} • {nextAppt.timeSlot} • {nextAppt.doctorName}</p>
                  <p className="text-xs text-slate-400 mt-1">📍 {selectedBranch.name}</p>
                </div>
                <div className="flex flex-row sm:flex-col items-center sm:items-end gap-2 w-full sm:w-auto justify-between sm:justify-start">
                  <span className="px-3 py-1 bg-green-100 text-green-600 text-[10px] font-bold uppercase rounded-full tracking-wider">
                    Confirmed
                  </span>
                  <button
                    id="home-appt-checkin-btn"
                    onClick={onOpenCheckIn}
                    className="text-xs text-[#4F8EF7] font-semibold underline hover:text-blue-700 cursor-pointer"
                  >
                    Check In
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
                  return (
                    <div key={pack.id} className="p-4 border border-blue-100/80 bg-gradient-to-r from-blue-50/60 via-sky-50/40 to-indigo-50/20 rounded-2xl flex items-center justify-between gap-3">
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

