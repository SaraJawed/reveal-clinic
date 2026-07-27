import React from 'react';
import { UserProfile, Appointment, ClinicBranch } from '../../types';
import { QrCode, AlertCircle, ShieldCheck, FileText, User } from 'lucide-react';

interface DigitalCheckInViewProps {
  user: UserProfile;
  selectedBranch: ClinicBranch;
  upcomingAppointments: Appointment[];
  onOpenPayment: () => void;
}

export const DigitalCheckInView: React.FC<DigitalCheckInViewProps> = ({
  user,
  selectedBranch,
  upcomingAppointments,
  onOpenPayment
}) => {
  const appt = upcomingAppointments[0];
  const hasUnpaid = appt && !appt.paid;

  return (
    <div className="space-y-6 pb-24 md:pb-8 max-w-xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3 text-center">
        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
          <QrCode className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-slate-900">Clinic Digital Check-In</h1>
          <p className="text-xs text-slate-500">Present your patient QR code or File Number at reception desk upon arrival.</p>
        </div>

        {/* Location chip */}
        <div className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-semibold">
          📍 {selectedBranch.name}
        </div>
      </div>

      {/* Outstanding Payment Alert if needed */}
      {hasUnpaid && (
        <div className="bg-amber-500 text-white p-4 rounded-3xl shadow-md flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <div className="text-xs">
              <strong>Outstanding Payment Alert:</strong> You have an unpaid consultation fee of ${appt.fee}.
            </div>
          </div>
          <button
            id="checkin-pay-alert-btn"
            onClick={onOpenPayment}
            className="bg-white text-slate-900 px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-slate-100 shrink-0"
          >
            Pay Now
          </button>
        </div>
      )}

      {/* MAIN CHECK-IN QR & PATIENT FILE CARD */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md text-center space-y-6">
        {/* QR Code Container */}
        <div className="bg-gradient-to-b from-slate-900 to-blue-950 p-6 rounded-3xl text-white inline-block shadow-xl border border-slate-800">
          <div className="bg-white p-4 rounded-2xl inline-block shadow-inner">
            {/* Simulated QR Pattern */}
            <div className="w-48 h-48 bg-slate-900 p-2 rounded-xl flex flex-col justify-between">
              <div className="flex justify-between">
                <div className="w-12 h-12 bg-white rounded-md p-1">
                  <div className="w-full h-full bg-slate-900 rounded-xs" />
                </div>
                <div className="w-12 h-12 bg-white rounded-md p-1">
                  <div className="w-full h-full bg-slate-900 rounded-xs" />
                </div>
              </div>
              <div className="text-center text-white text-[10px] font-mono tracking-widest font-bold">
                REVEAL-{user.patientId}
              </div>
              <div className="flex justify-between items-end">
                <div className="w-12 h-12 bg-white rounded-md p-1">
                  <div className="w-full h-full bg-slate-900 rounded-xs" />
                </div>
                <div className="w-8 h-8 bg-sky-400 rounded-md" />
              </div>
            </div>
          </div>
          <div className="mt-3 text-xs font-bold text-sky-200 flex items-center justify-center gap-1.5">
            <User className="w-3.5 h-3.5 text-sky-400" />
            {user.fullName}
          </div>
        </div>

        {/* Prominent Patient File Number Display */}
        <div className="bg-slate-50 border border-slate-200/80 p-4 rounded-2xl text-center space-y-1.5 max-w-sm mx-auto shadow-2xs">
          <div className="flex items-center justify-center gap-1.5 text-slate-500">
            <FileText className="w-4 h-4 text-blue-600" />
            <span className="text-[11px] font-bold uppercase tracking-wider">Patient File Number</span>
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono tracking-widest selection:bg-blue-200">
            {user.patientId}
          </div>
          <p className="text-[11px] text-slate-500 font-medium">
            Present this file number or show your QR code to reception staff for instant check-in.
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 text-[11px] font-semibold text-slate-500 pt-2 border-t border-slate-100">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Verified Active Patient Profile • {selectedBranch.city}</span>
        </div>
      </div>
    </div>
  );
};
