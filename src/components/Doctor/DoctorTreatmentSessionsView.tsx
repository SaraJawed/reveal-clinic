import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TreatmentSession, UserProfile } from '../../types';
import {
  Activity,
  CheckCircle2,
  Clock,
  Zap,
  Package,
  Plus,
  AlertCircle,
  Play,
  Check,
  CreditCard,
  Building2,
  Syringe,
  Sparkles,
  Sliders,
  Send,
  FileText,
  MapPin,
  UserCheck,
  ClipboardCheck
} from 'lucide-react';

// Covers every TreatmentSession status so nothing falls through to a raw,
// untranslated i18n key -- badge/card colors follow the same palette used
// for ClinicalAppointmentStatus elsewhere in the app (amber = waiting,
// blue = prep/consultation, purple = active procedure, emerald = done).
const SESSION_STATUS_CONFIG: Record<TreatmentSession['status'], {
  labelKey: string;
  badgeClass: string;
  cardClass: string;
}> = {
  'Scheduled': { labelKey: 'scheduled', badgeClass: 'bg-slate-100 text-slate-700', cardClass: 'bg-white border-slate-100' },
  'Checked In': { labelKey: 'checkedIn', badgeClass: 'bg-amber-100 text-amber-800', cardClass: 'bg-amber-50/50 border-amber-100' },
  'Ready for Procedure': { labelKey: 'readyForProcedure', badgeClass: 'bg-blue-100 text-[#4F8EF7]', cardClass: 'bg-blue-50/50 border-blue-100' },
  'In Progress': { labelKey: 'inProgress', badgeClass: 'bg-purple-600 text-white animate-pulse', cardClass: 'bg-purple-50/50 border-purple-100' },
  'Pending Review': { labelKey: 'pendingReview', badgeClass: 'bg-amber-100 text-amber-800', cardClass: 'bg-amber-50/40 border-amber-100' },
  'Completed': { labelKey: 'completed', badgeClass: 'bg-emerald-100 text-emerald-700', cardClass: 'bg-emerald-50/40 border-emerald-100' }
};

interface DoctorTreatmentSessionsViewProps {
  sessions: TreatmentSession[];
  user: UserProfile;
  onUpdateSessionStatus: (sessionId: string, newStatus: TreatmentSession['status']) => void;
  onIssueItem?: (sessionId: string, itemName: string, qty: number) => void;
  onRequestItem?: (sessionId: string, itemName: string, urgency: 'Normal' | 'High' | 'Immediate') => void;
}

export const DoctorTreatmentSessionsView: React.FC<DoctorTreatmentSessionsViewProps> = ({
  sessions,
  user,
  onUpdateSessionStatus,
  onIssueItem,
  onRequestItem
}) => {
  const { t } = useTranslation('doctor');
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showRequestItemModal, setShowRequestItemModal] = useState(false);
  const [requestItemName, setRequestItemName] = useState('');
  const [requestUrgency, setRequestUrgency] = useState<'Normal' | 'High' | 'Immediate'>('Normal');

  const filteredSessions = sessions.filter((s) => {
    if (statusFilter !== 'all' && s.status !== statusFilter) return false;
    return true;
  });

  const selectedSession = selectedSessionId ? (sessions.find((s) => s.id === selectedSessionId) || null) : null;

  return (
    <div className="space-y-6 pb-20 md:pb-10">
      {/* Header */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 md:p-6 shadow-2xs flex flex-col justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-purple-50 text-purple-600">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-extrabold text-lg text-slate-900 tracking-tight">
              {t('sessions.header.title')}
            </h1>
            <p className="text-xs text-slate-500">
              {t('sessions.header.subtitle')}
            </p>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex bg-slate-100 p-1 rounded-2xl text-xs font-bold shrink-0 overflow-x-auto max-w-full no-scrollbar">
          {['all', 'In Progress', 'Scheduled', 'Completed'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl transition ${
                statusFilter === st ? 'bg-white text-purple-700 shadow-2xs' : 'text-slate-600'
              }`}
            >
              {st === 'all' ? t('sessions.filters.all') : t(`sessions.status.${SESSION_STATUS_CONFIG[st as TreatmentSession['status']].labelKey}`)}
            </button>
          ))}
        </div>
      </div>

      {!selectedSession ? (
        <div className="space-y-3">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
            {t('sessions.list.activeCount', { count: filteredSessions.length })}
          </h2>

          <div className="grid grid-cols-1 gap-4">
            {filteredSessions.map((session) => {
              const statusConfig = SESSION_STATUS_CONFIG[session.status];
              return (
                <div
                  key={session.id}
                  onClick={() => setSelectedSessionId(session.id)}
                  className={`p-5 rounded-3xl border transition cursor-pointer flex flex-col justify-between gap-4 hover:shadow-md ${statusConfig.cardClass}`}
                >
                  <div className="space-y-2 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="flex items-center gap-1 text-slate-500 text-[11px] font-bold truncate min-w-0">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{session.roomNumber}</span>
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold shrink-0 ${statusConfig.badgeClass}`}>
                        {t(`sessions.status.${statusConfig.labelKey}`)}
                      </span>
                    </div>

                    <div className="pt-1">
                      <h3 className="font-extrabold text-sm text-slate-900 truncate">
                        {session.patientName}
                      </h3>
                      <p className="text-[11px] font-extrabold text-purple-700 truncate mt-0.5">
                        {session.treatmentName}
                      </p>
                      <p className="text-[10px] text-slate-500 truncate mt-0.5">
                        {t('sessions.list.attending', { doctor: session.doctorName })}
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-3 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400">
                      <span>{t('sessions.list.progressLabel')}</span>
                      <span className="text-purple-700 font-bold">{session.progressPercent}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-purple-600 to-[#4F8EF7] h-full rounded-full transition-all duration-500"
                        style={{ width: `${session.progressPercent}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => setSelectedSessionId(null)}
              className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl text-xs font-bold transition cursor-pointer"
            >
              {t('sessions.detail.backButton')}
            </button>
          </div>

          <div className="space-y-6">
            {/* Session Summary Card */}
            <div className="bg-white border border-slate-100 rounded-3xl p-5 md:p-6 shadow-md space-y-4">
              <div className="flex flex-col justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-700 text-[10px] font-extrabold uppercase">
                      {t('sessions.detail.sessionId', { id: selectedSession.id })}
                    </span>
                    <span className="flex items-center gap-1 text-xs font-bold text-slate-400">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {selectedSession.roomNumber}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${SESSION_STATUS_CONFIG[selectedSession.status].badgeClass}`}>
                      {t(`sessions.status.${SESSION_STATUS_CONFIG[selectedSession.status].labelKey}`)}
                    </span>
                  </div>
                  <h2 className="font-black text-slate-900 text-lg sm:text-xl mt-1">
                    {selectedSession.treatmentName}
                  </h2>
                  <p className="text-xs font-semibold text-slate-600">
                    {t('sessions.detail.patientLine', { name: selectedSession.patientName, doctor: selectedSession.doctorName })}
                  </p>
                </div>

                {/* Status Action Button */}
                <div className="flex items-center gap-2 shrink-0">
                  {selectedSession.status === 'Scheduled' && (
                    <button
                      type="button"
                      onClick={() => onUpdateSessionStatus(selectedSession.id, 'Checked In')}
                      className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-2xl text-xs font-bold transition flex items-center gap-2 shadow-md shadow-amber-500/20"
                    >
                      <UserCheck className="w-4 h-4" />
                      <span>{t('sessions.detail.checkInButton')}</span>
                    </button>
                  )}
                  {selectedSession.status === 'Checked In' && (
                    <button
                      type="button"
                      onClick={() => onUpdateSessionStatus(selectedSession.id, 'Ready for Procedure')}
                      className="px-4 py-2.5 bg-[#4F8EF7] hover:bg-blue-600 text-white rounded-2xl text-xs font-bold transition flex items-center gap-2 shadow-md shadow-blue-500/20"
                    >
                      <ClipboardCheck className="w-4 h-4" />
                      <span>{t('sessions.detail.markReadyButton')}</span>
                    </button>
                  )}
                  {selectedSession.status === 'Ready for Procedure' && (
                    <button
                      type="button"
                      onClick={() => onUpdateSessionStatus(selectedSession.id, 'In Progress')}
                      className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl text-xs font-bold transition flex items-center gap-2 shadow-md shadow-purple-500/20"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      <span>{t('sessions.detail.startButton')}</span>
                    </button>
                  )}
                  {selectedSession.status === 'In Progress' && (
                    <button
                      type="button"
                      onClick={() => onUpdateSessionStatus(selectedSession.id, 'Completed')}
                      className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-bold transition flex items-center gap-2 shadow-md shadow-emerald-500/20"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{t('sessions.detail.finishButton')}</span>
                    </button>
                  )}
                  {selectedSession.status === 'Pending Review' && (
                    <button
                      type="button"
                      onClick={() => onUpdateSessionStatus(selectedSession.id, 'Completed')}
                      className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-bold transition flex items-center gap-2 shadow-md shadow-emerald-500/20"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{t('sessions.detail.approveButton')}</span>
                    </button>
                  )}
                  {selectedSession.status === 'Completed' && (
                    <span className="px-3.5 py-2 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-extrabold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>{t('sessions.detail.completedArchived')}</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Progress Bar */}
              <div>
                <div className="flex justify-between text-xs font-bold mb-1.5">
                  <span className="text-slate-700">{t('sessions.detail.progressLabel')}</span>
                  <span className="text-purple-700">{selectedSession.progressPercent}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-purple-600 to-[#4F8EF7] h-full rounded-full transition-all duration-500"
                    style={{ width: `${selectedSession.progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Payment Integration Gateway Status */}
              <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <CreditCard className="w-4 h-4 text-[#4F8EF7]" />
                  <div>
                    <span className="font-bold text-slate-800 block">
                      {t('sessions.detail.gatewayStatus', { gateway: selectedSession.paymentIntegrationStatus?.gateway || (selectedSession as any).paymentGateway || t('sessions.detail.defaultGateway') })}
                    </span>
                    <span className="text-slate-500 text-[11px]">
                      {t('sessions.detail.refLabel', { ref: selectedSession.paymentIntegrationStatus?.transactionRef || (selectedSession as any).paymentTransactionId || t('sessions.detail.defaultRef') })}
                    </span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-extrabold">
                  {selectedSession.paymentIntegrationStatus?.status || (selectedSession as any).paymentStatus || t('sessions.detail.defaultPaid')}
                </span>
              </div>
            </div>

            {/* Consumables & Machines Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Consumables Used Card */}
              <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-2xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h3 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Syringe className="w-4 h-4 text-[#4F8EF7]" />
                    <span>{t('sessions.consumables.title')}</span>
                  </h3>
                  <span className="text-[10px] font-bold text-slate-400">
                    {t('sessions.consumables.itemsCount', { count: selectedSession.consumablesUsed?.length || 0 })}
                  </span>
                </div>

                <div className="space-y-2">
                  {(selectedSession.consumablesUsed || []).map((item, idx) => (
                    <div key={idx} className="p-2.5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-slate-800 block">{item.name}</span>
                        <span className="text-[10px] text-slate-400 font-semibold">{t('sessions.consumables.lotLabel', { lot: item.batchNumber || (item as any).lotNumber || t('sessions.consumables.defaultLot') })}</span>
                      </div>
                      <span className="px-2.5 py-1 bg-blue-50 text-[#4F8EF7] font-extrabold rounded-xl border border-blue-100 text-xs">
                        {item.quantity} {item.unit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Machines & Energy Devices Used Card */}
              <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-2xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h3 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-purple-600" />
                    <span>{t('sessions.devices.title')}</span>
                  </h3>
                  <span className="text-[10px] font-bold text-slate-400">
                    {t('sessions.devices.count', { count: selectedSession.machinesUsed?.length || 0 })}
                  </span>
                </div>

                <div className="space-y-2">
                  {(selectedSession.machinesUsed || []).map((m: any, idx) => {
                    const settingsObj = m.settings || (m.laserSettings ? {
                      [t('sessions.devices.settings.energy')]: m.laserSettings.energyJoules ? `${m.laserSettings.energyJoules} J` : undefined,
                      [t('sessions.devices.settings.pulse')]: m.laserSettings.pulseDurationMs ? `${m.laserSettings.pulseDurationMs} ms` : undefined,
                      [t('sessions.devices.settings.spotSize')]: m.laserSettings.spotSizeMm ? `${m.laserSettings.spotSizeMm} mm` : undefined,
                      [t('sessions.devices.settings.passes')]: m.laserSettings.totalPasses ? `${m.laserSettings.totalPasses}` : undefined
                    } : {
                      [t('sessions.devices.settings.model')]: m.model || t('sessions.devices.defaultModel'),
                      [t('sessions.devices.settings.sanitized')]: m.lastSanitized || t('sessions.devices.defaultSanitized')
                    });

                    const entries = Object.entries(settingsObj || {}).filter(([_, v]) => v !== undefined);

                    return (
                      <div key={idx} className="p-3 bg-purple-50/50 border border-purple-100 rounded-2xl text-xs space-y-2">
                        <div className="font-black text-purple-900 flex justify-between">
                          <span>{m.machineName || m.name || t('sessions.devices.defaultName')}</span>
                          <span className="text-[10px] text-purple-700 font-bold">{t('sessions.devices.serialLabel', { serial: m.serialNumber || t('sessions.devices.defaultSerial') })}</span>
                        </div>
                        {entries.length > 0 && (
                          <div className="grid grid-cols-2 gap-1 text-[11px] bg-white p-2 rounded-xl border border-purple-100">
                            {entries.map(([k, v]) => (
                              <div key={k} className="truncate">
                                <span className="text-slate-400 font-semibold uppercase text-[9px] block">{k}:</span>
                                <span className="font-extrabold text-slate-800">{String(v)}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Issued & Requested Items Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Items Issued Card */}
              <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-2xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h3 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Package className="w-4 h-4 text-emerald-600" />
                    <span>{t('sessions.issued.title')}</span>
                  </h3>
                </div>

                <div className="space-y-2">
                  {(selectedSession.itemsIssued || []).map((item, idx) => (
                    <div key={idx} className="p-2.5 bg-emerald-50/50 border border-emerald-100 rounded-2xl flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-emerald-900 block">{item.name}</span>
                        <span className="text-[10px] text-emerald-700 font-medium">{t('sessions.issued.issuedByStaff')}</span>
                      </div>
                      <span className="px-2 py-0.5 bg-emerald-600 text-white font-extrabold rounded-lg text-[10px]">
                        {t('sessions.issued.quantityBadge', { qty: item.quantity })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Items Requested Card */}
              <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-2xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h3 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-amber-500" />
                    <span>{t('sessions.requested.title')}</span>
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowRequestItemModal(true)}
                    className="px-2.5 py-1 bg-amber-50 text-amber-700 font-bold rounded-xl text-[10px] hover:bg-amber-100 transition flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>{t('sessions.requested.requestButton')}</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {(selectedSession.itemsRequested || []).map((req, idx) => (
                    <div key={idx} className="p-2.5 bg-amber-50/40 border border-amber-200/60 rounded-2xl flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-amber-900 block">{req.name}</span>
                        <span className="text-[10px] text-amber-700 font-semibold uppercase">{t('sessions.requested.urgencyLabel', { urgency: req.urgency })}</span>
                      </div>
                      <span className="px-2.5 py-1 bg-white border border-amber-200 font-extrabold rounded-xl text-[10px] text-amber-800">
                        {t(`sessions.requested.statusLabels.${req.status.toLowerCase().replace(' ', '')}`, req.status)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Request Item Modal */}
      {showRequestItemModal && selectedSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 space-y-4 border border-slate-100">
            <h3 className="font-extrabold text-sm text-slate-900">
              {t('sessions.requestModal.title')}
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">{t('sessions.requestModal.itemNameLabel')}</label>
              <input
                type="text"
                value={requestItemName}
                onChange={(e) => setRequestItemName(e.target.value)}
                placeholder={t('sessions.requestModal.itemNamePlaceholder')}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">{t('sessions.requestModal.urgencyLabel')}</label>
              <select
                value={requestUrgency}
                onChange={(e) => setRequestUrgency(e.target.value as any)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-hidden"
              >
                <option value="Normal">{t('sessions.requestModal.urgencyOptions.normal')}</option>
                <option value="High">{t('sessions.requestModal.urgencyOptions.high')}</option>
                <option value="Immediate">{t('sessions.requestModal.urgencyOptions.immediate')}</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowRequestItemModal(false)}
                className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl font-bold text-xs"
              >
                {t('common:buttons.cancel')}
              </button>
              <button
                type="button"
                onClick={() => {
                  if (requestItemName.trim()) {
                    if (onRequestItem) {
                      onRequestItem(selectedSession.id, requestItemName.trim(), requestUrgency);
                    } else {
                      selectedSession.itemsRequested.push({
                        id: `req_${Date.now()}`,
                        name: requestItemName.trim(),
                        quantity: 1,
                        urgency: requestUrgency,
                        requestedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        status: 'Pending'
                      });
                    }
                    setRequestItemName('');
                    setShowRequestItemModal(false);
                  }
                }}
                className="px-4 py-2 bg-purple-600 text-white rounded-xl font-bold text-xs"
              >
                {t('sessions.requestModal.sendButton')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
