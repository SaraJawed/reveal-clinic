import React, { useState } from 'react';
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
  FileText
} from 'lucide-react';

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
              Clinical Treatment Sessions
            </h1>
            <p className="text-xs text-slate-500">
              Manage procedure consumables, laser machine settings, items issued, and session progress
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
              {st === 'all' ? 'All Sessions' : st}
            </button>
          ))}
        </div>
      </div>

      {!selectedSession ? (
        <div className="space-y-3">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
            Active Sessions ({filteredSessions.length})
          </h2>

          <div className="grid grid-cols-1 gap-4">
            {filteredSessions.map((session) => {
              return (
                <div
                  key={session.id}
                  onClick={() => setSelectedSessionId(session.id)}
                  className="p-5 rounded-3xl border transition cursor-pointer flex flex-col justify-between gap-4 bg-white border-slate-100 hover:border-purple-500/50 hover:shadow-md"
                >
                  <div className="space-y-2 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 text-[10px] font-extrabold uppercase border border-purple-100">
                        Room {session.roomNumber}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                          session.status === 'In Progress'
                            ? 'bg-purple-600 text-white animate-pulse'
                            : session.status === 'Completed'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {session.status}
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
                        Attending: {session.doctorName}
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-slate-50 pt-3 flex items-center justify-between text-[11px] font-semibold text-slate-400">
                    <span>Progress</span>
                    <span className="text-purple-700 font-bold">{session.progressPercent}%</span>
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
              ← Back to Active Sessions
            </button>
          </div>

          <div className="space-y-6">
            {/* Session Summary Card */}
            <div className="bg-white border border-slate-100 rounded-3xl p-5 md:p-6 shadow-md space-y-4">
              <div className="flex flex-col justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-700 text-[10px] font-extrabold uppercase">
                      Session #{selectedSession.id}
                    </span>
                    <span className="text-xs font-bold text-slate-400">
                      Suite {selectedSession.roomNumber}
                    </span>
                  </div>
                  <h2 className="font-black text-slate-900 text-lg sm:text-xl mt-1">
                    {selectedSession.treatmentName}
                  </h2>
                  <p className="text-xs font-semibold text-slate-600">
                    Patient: <strong className="text-slate-900">{selectedSession.patientName}</strong> • Attending: {selectedSession.doctorName}
                  </p>
                </div>

                {/* Status Action Button */}
                <div className="flex items-center gap-2 shrink-0">
                  {selectedSession.status === 'Scheduled' && (
                    <button
                      type="button"
                      onClick={() => onUpdateSessionStatus(selectedSession.id, 'In Progress')}
                      className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl text-xs font-bold transition flex items-center gap-2 shadow-md shadow-purple-500/20"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      <span>Start Procedure</span>
                    </button>
                  )}
                  {selectedSession.status === 'In Progress' && (
                    <button
                      type="button"
                      onClick={() => onUpdateSessionStatus(selectedSession.id, 'Completed')}
                      className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-bold transition flex items-center gap-2 shadow-md shadow-emerald-500/20"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Finish & Save Session</span>
                    </button>
                  )}
                  {selectedSession.status === 'Completed' && (
                    <span className="px-3.5 py-2 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-extrabold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Completed & Archived</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Progress Bar */}
              <div>
                <div className="flex justify-between text-xs font-bold mb-1.5">
                  <span className="text-slate-700">Procedure Steps Completed</span>
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
                      Gateway Payment Status ({selectedSession.paymentIntegrationStatus?.gateway || (selectedSession as any).paymentGateway || 'Stripe'})
                    </span>
                    <span className="text-slate-500 text-[11px]">
                      Ref: {selectedSession.paymentIntegrationStatus?.transactionRef || (selectedSession as any).paymentTransactionId || 'N/A'}
                    </span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-extrabold">
                  {selectedSession.paymentIntegrationStatus?.status || (selectedSession as any).paymentStatus || 'Paid'}
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
                    <span>Consumables Applied</span>
                  </h3>
                  <span className="text-[10px] font-bold text-slate-400">
                    {selectedSession.consumablesUsed?.length || 0} Items
                  </span>
                </div>

                <div className="space-y-2">
                  {(selectedSession.consumablesUsed || []).map((item, idx) => (
                    <div key={idx} className="p-2.5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-slate-800 block">{item.name}</span>
                        <span className="text-[10px] text-slate-400 font-semibold">Lot: {item.batchNumber || (item as any).lotNumber || 'N/A'}</span>
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
                    <span>Devices & Laser Parameters</span>
                  </h3>
                  <span className="text-[10px] font-bold text-slate-400">
                    {selectedSession.machinesUsed?.length || 0} Device
                  </span>
                </div>

                <div className="space-y-2">
                  {(selectedSession.machinesUsed || []).map((m: any, idx) => {
                    const settingsObj = m.settings || (m.laserSettings ? {
                      'Energy': m.laserSettings.energyJoules ? `${m.laserSettings.energyJoules} J` : undefined,
                      'Pulse': m.laserSettings.pulseDurationMs ? `${m.laserSettings.pulseDurationMs} ms` : undefined,
                      'Spot Size': m.laserSettings.spotSizeMm ? `${m.laserSettings.spotSizeMm} mm` : undefined,
                      'Passes': m.laserSettings.totalPasses ? `${m.laserSettings.totalPasses}` : undefined
                    } : {
                      'Model': m.model || 'Standard',
                      'Sanitized': m.lastSanitized || 'Verified'
                    });

                    const entries = Object.entries(settingsObj || {}).filter(([_, v]) => v !== undefined);

                    return (
                      <div key={idx} className="p-3 bg-purple-50/50 border border-purple-100 rounded-2xl text-xs space-y-2">
                        <div className="font-black text-purple-900 flex justify-between">
                          <span>{m.machineName || m.name || 'Device'}</span>
                          <span className="text-[10px] text-purple-700 font-bold">Serial #{m.serialNumber || 'N/A'}</span>
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
                    <span>Items Issued To Patient</span>
                  </h3>
                </div>

                <div className="space-y-2">
                  {(selectedSession.itemsIssued || []).map((item, idx) => (
                    <div key={idx} className="p-2.5 bg-emerald-50/50 border border-emerald-100 rounded-2xl flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-emerald-900 block">{item.name}</span>
                        <span className="text-[10px] text-emerald-700 font-medium">Issued by staff</span>
                      </div>
                      <span className="px-2 py-0.5 bg-emerald-600 text-white font-extrabold rounded-lg text-[10px]">
                        x{item.quantity}
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
                    <span>Requested Consumables</span>
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowRequestItemModal(true)}
                    className="px-2.5 py-1 bg-amber-50 text-amber-700 font-bold rounded-xl text-[10px] hover:bg-amber-100 transition flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Request Stock</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {(selectedSession.itemsRequested || []).map((req, idx) => (
                    <div key={idx} className="p-2.5 bg-amber-50/40 border border-amber-200/60 rounded-2xl flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-amber-900 block">{req.name}</span>
                        <span className="text-[10px] text-amber-700 font-semibold uppercase">Urgency: {req.urgency}</span>
                      </div>
                      <span className="px-2.5 py-1 bg-white border border-amber-200 font-extrabold rounded-xl text-[10px] text-amber-800">
                        {req.status}
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
              Request Additional Consumable / Item
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Item Name:</label>
              <input
                type="text"
                value={requestItemName}
                onChange={(e) => setRequestItemName(e.target.value)}
                placeholder="e.g. Sterile Gauze 4x4 or 1% Lidocaine"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Urgency Level:</label>
              <select
                value={requestUrgency}
                onChange={(e) => setRequestUrgency(e.target.value as any)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-hidden"
              >
                <option value="Normal">Normal</option>
                <option value="High">High Priority</option>
                <option value="Immediate">Immediate Room Delivery</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowRequestItemModal(false)}
                className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl font-bold text-xs"
              >
                Cancel
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
                Send Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
