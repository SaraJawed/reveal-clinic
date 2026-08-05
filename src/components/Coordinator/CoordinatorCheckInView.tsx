import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ClinicalScheduleItem, ClinicalAppointmentStatus } from '../../types';
import { CLINICAL_STATUS_CARD_CLASS } from '../../utils/clinicalStatus';
import {
  QrCode,
  Search,
  UserCheck,
  Clock,
  Sparkles,
  CheckCircle2,
  Camera,
  AlertCircle,
  Users,
  ShieldCheck,
  ChevronRight,
  Printer
} from 'lucide-react';

interface CoordinatorCheckInViewProps {
  schedule: ClinicalScheduleItem[];
  onConfirmCheckIn: (id: string) => void;
  onUpdateStatus: (id: string, newStatus: ClinicalAppointmentStatus) => void;
  onTriggerToast: (msg: string) => void;
}

export const CoordinatorCheckInView: React.FC<CoordinatorCheckInViewProps> = ({
  schedule,
  onConfirmCheckIn,
  onUpdateStatus,
  onTriggerToast
}) => {
  const { t } = useTranslation('coordinator');

  // Scanner state
  const [isScanning, setIsScanning] = useState(false);
  const [manualQuery, setManualQuery] = useState('');
  const [scannedAppt, setScannedAppt] = useState<ClinicalScheduleItem | null>(null);

  // Filtered waiting queue (checked_in or in_consultation)
  const waitingQueue = schedule.filter(s => s.status === 'checked_in' || s.status === 'in_consultation');

  // Handle simulation of QR Code scan
  const handleSimulateScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      // Pick first scheduled or default appointment
      const found = schedule.find(s => s.status === 'scheduled') || schedule[0];
      setScannedAppt(found || null);
      onTriggerToast(t('checkin.scanner.toastScanned', { name: found?.patientName }));
    }, 1200);
  };

  // Handle manual lookup
  const handleManualSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualQuery.trim()) return;

    const found = schedule.find(
      s =>
        s.patientId.toLowerCase().includes(manualQuery.toLowerCase()) ||
        s.patientName.toLowerCase().includes(manualQuery.toLowerCase())
    );

    if (found) {
      setScannedAppt(found);
      onTriggerToast(t('checkin.manual.toastFound', { name: found.patientName }));
    } else {
      onTriggerToast(t('checkin.manual.toastNotFound', { query: manualQuery }));
    }
  };

  const handleConfirmArrival = () => {
    if (!scannedAppt) return;
    onConfirmCheckIn(scannedAppt.id);
    onTriggerToast(t('checkin.verification.toastConfirmed', { name: scannedAppt.patientName, token: scannedAppt.queueNumber || 104 }));
    setScannedAppt(null);
    setManualQuery('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <QrCode className="w-6 h-6 text-[#4F8EF7]" />
          {t('checkin.header.title')}
        </h1>
        <p className="text-xs text-slate-500 font-medium">
          {t('checkin.header.subtitle')}
        </p>
      </div>

      {/* Main Grid: QR Scanner & Manual Lookup */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* QR Code Scanner Section */}
        <div className="bg-white rounded-3xl border border-slate-100 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Camera className="w-5 h-5 text-[#4F8EF7]" />
              <h2 className="font-extrabold text-slate-900 text-base">{t('checkin.scanner.title')}</h2>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-blue-50 text-[#4F8EF7] text-[10px] font-black border border-blue-100">
              {t('checkin.scanner.liveFeed')}
            </span>
          </div>

          {/* Interactive Camera Viewfinder Simulation */}
          <div className="relative aspect-video rounded-2xl bg-slate-950 overflow-hidden flex flex-col items-center justify-center border-2 border-slate-800 shadow-inner group">
            {/* Camera Viewfinder Overlay Frame */}
            <div className="absolute inset-8 border-2 border-dashed border-[#4F8EF7]/50 rounded-2xl pointer-events-none flex items-center justify-center">
              {isScanning && (
                <div className="w-full h-1 bg-gradient-to-r from-transparent via-[#4F8EF7] to-transparent animate-pulse shadow-lg shadow-blue-500" />
              )}
            </div>

            {/* Viewfinder Corners */}
            <div className="absolute top-4 left-4 w-6 h-6 border-t-4 border-l-4 border-[#4F8EF7] rounded-tl-lg" />
            <div className="absolute top-4 right-4 w-6 h-6 border-t-4 border-r-4 border-[#4F8EF7] rounded-tr-lg" />
            <div className="absolute bottom-4 left-4 w-6 h-6 border-b-4 border-l-4 border-[#4F8EF7] rounded-bl-lg" />
            <div className="absolute bottom-4 right-4 w-6 h-6 border-b-4 border-r-4 border-[#4F8EF7] rounded-br-lg" />

            <div className="text-center p-4 z-10 space-y-2">
              <QrCode className={`w-12 h-12 mx-auto text-blue-400 ${isScanning ? 'animate-bounce' : ''}`} />
              <p className="text-xs font-bold text-slate-200">
                {isScanning ? t('checkin.scanner.scanning') : t('checkin.scanner.positionFrame')}
              </p>
              <button
                onClick={handleSimulateScan}
                disabled={isScanning}
                className="mt-2 px-4 py-2 rounded-xl bg-[#4F8EF7] hover:bg-blue-600 active:scale-95 text-white text-xs font-extrabold shadow-md shadow-blue-500/30 transition-all"
              >
                {isScanning ? t('checkin.scanner.processing') : t('checkin.scanner.simulateTest')}
              </button>
            </div>
          </div>

          {/* Manual Lookup Option */}
          <div className="pt-2">
            <div className="text-[11px] font-extrabold text-slate-400 uppercase mb-2">
              {t('checkin.scanner.manualLookupLabel')}
            </div>
            <form onSubmit={handleManualSearch} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder={t('checkin.scanner.manualPlaceholder')}
                  value={manualQuery}
                  onChange={(e) => setManualQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#4F8EF7]"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-extrabold shrink-0"
              >
                {t('common:buttons.search')}
              </button>
            </form>
          </div>
        </div>

        {/* Verification Result Card */}
        <div className="bg-white rounded-3xl border border-slate-100 p-5 shadow-2xs space-y-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h2 className="font-extrabold text-slate-900 text-base">{t('checkin.verification.title')}</h2>
          </div>

          {!scannedAppt ? (
            <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-100 text-slate-400 space-y-2">
              <QrCode className="w-10 h-10 mx-auto text-slate-300" />
              <p className="text-xs font-bold text-slate-700">{t('checkin.verification.emptyTitle')}</p>
              <p className="text-[11px]">{t('checkin.verification.emptySubtitle')}</p>
            </div>
          ) : (
            <div className="bg-gradient-to-b from-blue-50/50 to-white rounded-3xl border border-blue-100 p-5 space-y-4">
              <div className="flex items-center gap-3">
                <img
                  src={scannedAppt.patientAvatar}
                  alt={scannedAppt.patientName}
                  className="w-14 h-14 rounded-2xl object-cover ring-2 ring-[#4F8EF7]/30 shadow-xs"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-slate-900 text-base">{scannedAppt.patientName}</h3>
                    <span className="px-2 py-0.5 rounded-md bg-blue-100 text-[#4F8EF7] text-[10px] font-black">
                      {scannedAppt.patientId}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-slate-600 mt-0.5">{scannedAppt.treatmentName}</p>
                  <p className="text-[11px] text-slate-400">{t('checkin.doctorRoom', { doctorName: scannedAppt.doctorName, roomNumber: scannedAppt.roomNumber })}</p>
                </div>
              </div>

              {/* Verified Details Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs bg-white p-3 rounded-2xl border border-slate-100">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">{t('checkin.verification.scheduledSlot')}</span>
                  <span className="font-black text-slate-800">{scannedAppt.timeSlot}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">{t('checkin.verification.paymentStatus')}</span>
                  <span className="font-black text-emerald-600">{scannedAppt.paymentStatus || t('checkin.verification.paid')}</span>
                </div>
                <div className="col-span-2 pt-1 border-t border-slate-100">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">{t('checkin.verification.visitReason')}</span>
                  <span className="font-medium text-slate-700">{scannedAppt.visitReason}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => setScannedAppt(null)}
                  className="flex-1 py-2.5 rounded-2xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50"
                >
                  {t('checkin.verification.dismiss')}
                </button>
                <button
                  onClick={handleConfirmArrival}
                  className="flex-2 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-md shadow-emerald-500/20 flex items-center justify-center gap-1.5"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>{t('checkin.verification.confirmCheckIn')}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Waiting Room Queue Display */}
      <div className="bg-white rounded-3xl border border-slate-100 p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-600" />
            <h2 className="font-extrabold text-slate-900 text-base">{t('checkin.queue.title')}</h2>
          </div>
          <span className="text-xs font-bold text-slate-500">
            {t('checkin.queue.waitingCount', { count: waitingQueue.length })}
          </span>
        </div>

        {waitingQueue.length === 0 ? (
          <div className="text-center py-8 bg-slate-50 rounded-2xl border border-slate-100 text-slate-400">
            <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500 mb-2" />
            <p className="text-xs font-bold text-slate-700">{t('checkin.queue.emptyTitle')}</p>
            <p className="text-[11px]">{t('checkin.queue.emptySubtitle')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {waitingQueue.map((item, idx) => (
              <div
                key={item.id}
                className={`p-3.5 border rounded-2xl space-y-2 flex flex-col justify-between ${CLINICAL_STATUS_CARD_CLASS[item.status]}`}
              >
                <div className="flex items-center justify-between">
                  <span className="w-7 h-7 rounded-lg bg-slate-900 text-white font-black text-xs flex items-center justify-center">
                    #{item.queueNumber || idx + 1}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">
                    {item.status === 'in_consultation' ? t('checkin.queue.inRoom') : t('checkin.queue.waiting')}
                  </span>
                </div>

                <div>
                  <div className="font-extrabold text-xs text-slate-900">{item.patientName}</div>
                  <div className="text-[10px] text-slate-500 font-medium truncate">{item.treatmentName}</div>
                  <div className="text-[10px] text-slate-400">{t('checkin.queue.doctor', { doctorName: item.doctorName })}</div>
                </div>

                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px]">
                  <span className="text-slate-400 font-bold">{t('checkin.queue.suite', { roomNumber: item.roomNumber })}</span>
                  <span className="text-[#4F8EF7] font-black">{item.timeSlot}</span>
                </div>

                <select
                  id={`checkin-status-select-${item.id}`}
                  value={item.status}
                  onChange={(e) => onUpdateStatus(item.id, e.target.value as ClinicalAppointmentStatus)}
                  className="w-full px-2 py-1.5 rounded-xl bg-white border border-slate-200 text-[11px] font-bold text-slate-700 outline-hidden"
                >
                  <option value="checked_in">{t('appointments.status.checkedIn')}</option>
                  <option value="in_consultation">{t('appointments.status.inConsultation')}</option>
                  <option value="procedure">{t('appointments.status.procedure')}</option>
                  <option value="completed">{t('appointments.status.completed')}</option>
                </select>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
