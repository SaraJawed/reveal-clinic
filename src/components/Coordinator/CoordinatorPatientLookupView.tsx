import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ClinicalScheduleItem } from '../../types';
import {
  Search,
  CreditCard,
  DollarSign,
  Phone,
  Mail,
  X,
  Receipt,
  CheckCircle2,
  Star,
  Droplet,
  AlertTriangle,
  Clock,
  FileText
} from 'lucide-react';
import { initialClinicalPatients } from '../../data/mockData';

interface CoordinatorPatientLookupViewProps {
  schedule: ClinicalScheduleItem[];
  onTriggerToast: (msg: string) => void;
}

interface ReceiptItem {
  id: string;
  appointmentId: string;
  treatmentName: string;
  doctorName: string;
  amountPaid: number;
  paymentDate: string;
  paymentMethod: string;
  status: string;
  receiptUrl: string;
  transactionRef: string;
}

interface PatientListEntry {
  patientId: string;
  patientName: string;
  patientAvatar: string;
  patientAge: number;
  patientGender: string;
  phone?: string;
  email?: string;
  latestTreatment: string;
  latestDoctorName: string;
  visitsCount: number;
  hasUnpaidBalance: boolean;
}

function buildPatientList(schedule: ClinicalScheduleItem[]): PatientListEntry[] {
  const byPatient = new Map<string, ClinicalScheduleItem[]>();
  schedule.forEach((item) => {
    const existing = byPatient.get(item.patientId) || [];
    existing.push(item);
    byPatient.set(item.patientId, existing);
  });

  return Array.from(byPatient.entries()).map(([patientId, items]) => {
    const latest = items[0];
    const record = initialClinicalPatients.find((p) => p.patientId === patientId);
    return {
      patientId,
      patientName: latest.patientName,
      patientAvatar: latest.patientAvatar,
      patientAge: latest.patientAge,
      patientGender: latest.patientGender,
      phone: record?.phone,
      email: record?.email,
      latestTreatment: latest.treatmentName,
      latestDoctorName: latest.doctorName,
      visitsCount: items.length + (record?.previousVisits.length || 0),
      hasUnpaidBalance: items.some((i) => i.paymentStatus === 'Pending Deposit')
    };
  });
}

export const CoordinatorPatientLookupView: React.FC<CoordinatorPatientLookupViewProps> = ({
  schedule,
  onTriggerToast
}) => {
  const { t } = useTranslation('coordinator');

  const [searchQuery, setSearchQuery] = useState('');
  const [detailPatient, setDetailPatient] = useState<PatientListEntry | null>(null);

  // Payment Modal States
  const [paymentTarget, setPaymentTarget] = useState<PatientListEntry | null>(null);
  const [paymentAmount, setPaymentAmount] = useState('150');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash' | 'tabby'>('card');
  const [cashTendered, setCashTendered] = useState('200');
  const [paymentSuccessReceipt, setPaymentSuccessReceipt] = useState<ReceiptItem | null>(null);

  const patientList = buildPatientList(schedule);
  const maxVisits = patientList.reduce((max, p) => Math.max(max, p.visitsCount), 0);

  const filteredList = patientList.filter((p) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      p.patientName.toLowerCase().includes(q) ||
      p.patientId.toLowerCase().includes(q) ||
      (p.phone && p.phone.includes(searchQuery))
    );
  });

  const handleProcessPayment = () => {
    if (!paymentTarget) return;

    const amt = parseFloat(paymentAmount) || 150;
    const newReceipt: ReceiptItem = {
      id: `rcpt_${Date.now().toString().slice(-6)}`,
      appointmentId: paymentTarget.patientId,
      treatmentName: paymentTarget.latestTreatment,
      doctorName: paymentTarget.latestDoctorName,
      amountPaid: amt,
      paymentDate: new Date().toISOString().split('T')[0],
      paymentMethod: paymentMethod === 'card' ? t('patientLookup.paymentMethodLabels.card') : paymentMethod === 'cash' ? t('patientLookup.paymentMethodLabels.cash') : t('patientLookup.paymentMethodLabels.tabby'),
      status: 'completed',
      receiptUrl: '#',
      transactionRef: `tx_rc_${Math.floor(100000 + Math.random() * 900000)}`
    };

    setPaymentSuccessReceipt(newReceipt);
    setPaymentTarget(null);
    onTriggerToast(t('patientLookup.paymentModal.toastProcessed', { amount: amt, name: paymentTarget.patientName }));
  };

  const cashChange = (parseFloat(cashTendered) || 0) - (parseFloat(paymentAmount) || 0);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <Search className="w-6 h-6 text-[#4F8EF7]" />
          {t('patientLookup.header.title')}
        </h1>
        <p className="text-xs text-slate-500 font-medium">
          {t('patientLookup.header.subtitle')}
        </p>
      </div>

      {/* Search Input Bar */}
      <div className="bg-white rounded-3xl border border-slate-100 p-4 shadow-2xs">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder={t('patientLookup.search.placeholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#4F8EF7]"
          />
        </div>
      </div>

      {/* Patient Listing */}
      <div className="space-y-3">
        {filteredList.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-100 p-8 text-center text-slate-400 text-xs shadow-2xs">
            {t('patientLookup.list.empty')}
          </div>
        ) : (
          filteredList.map((patient) => {
            const isMostVisited = maxVisits > 1 && patient.visitsCount === maxVisits;
            return (
              <div
                key={patient.patientId}
                className="bg-white rounded-3xl border border-slate-100 p-4 sm:p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <button
                  type="button"
                  id={`patient-view-profile-${patient.patientId}-btn`}
                  onClick={() => setDetailPatient(patient)}
                  className="flex items-center gap-4 min-w-0 text-left hover:opacity-80 transition"
                >
                  <img
                    src={patient.patientAvatar}
                    alt={patient.patientName}
                    className="w-14 h-14 rounded-2xl object-cover ring-2 ring-[#4F8EF7]/20 shadow-xs shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center flex-wrap gap-2">
                      <h3 className="font-black text-slate-900 text-sm">{patient.patientName}</h3>
                      <span className="px-2 py-0.5 rounded-full bg-blue-50 text-[#4F8EF7] text-[10px] font-black border border-blue-100">
                        {patient.patientId}
                      </span>
                      {isMostVisited && (
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-extrabold border border-amber-200">
                          <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                          {t('patientLookup.list.mostVisitedBadge')}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 font-medium mt-1">
                      {patient.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-slate-400" /> {patient.phone}
                        </span>
                      )}
                      {patient.email && (
                        <span className="flex items-center gap-1 truncate">
                          <Mail className="w-3 h-3 text-slate-400" /> {patient.email}
                        </span>
                      )}
                      <span>{t('patientLookup.list.visitsCount', { count: patient.visitsCount })}</span>
                    </div>
                  </div>
                </button>

                <div className="shrink-0">
                  {patient.hasUnpaidBalance ? (
                    <button
                      type="button"
                      id={`patient-take-payment-${patient.patientId}-btn`}
                      onClick={() => setPaymentTarget(patient)}
                      className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2"
                    >
                      <DollarSign className="w-4 h-4" />
                      <span>{t('patientLookup.list.takePaymentButton')}</span>
                    </button>
                  ) : (
                    <span className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-100 font-extrabold text-xs">
                      <CheckCircle2 className="w-4 h-4" />
                      {t('patientLookup.list.paidBadge')}
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Patient Detail Modal */}
      {detailPatient && (() => {
        const fullRecord = initialClinicalPatients.find((p) => p.patientId === detailPatient.patientId);
        return (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between p-5 pb-3 border-b border-slate-100 shrink-0">
                <h3 className="font-black text-slate-900 text-base">{t('patientLookup.detailModal.title')}</h3>
                <button
                  type="button"
                  id="patient-detail-close-btn"
                  onClick={() => setDetailPatient(null)}
                  className="p-1 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-5 space-y-4 overflow-y-auto flex-1">
                <div className="flex items-center gap-4">
                  <img
                    src={detailPatient.patientAvatar}
                    alt={detailPatient.patientName}
                    className="w-16 h-16 rounded-2xl object-cover ring-2 ring-[#4F8EF7]/20 shadow-xs shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center flex-wrap gap-2">
                      <h4 className="font-black text-slate-900 text-base">{detailPatient.patientName}</h4>
                      <span className="px-2 py-0.5 rounded-full bg-blue-50 text-[#4F8EF7] text-[10px] font-black border border-blue-100">
                        {detailPatient.patientId}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      {t('patientLookup.detailModal.ageGender', { age: detailPatient.patientAge, gender: detailPatient.patientGender })}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {detailPatient.phone && (
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">{t('profile.contact.phone')}</span>
                      <span className="font-extrabold text-slate-800 flex items-center gap-1.5 mt-0.5">
                        <Phone className="w-3.5 h-3.5 text-slate-400" /> {detailPatient.phone}
                      </span>
                    </div>
                  )}
                  {detailPatient.email && (
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">{t('profile.contact.email')}</span>
                      <span className="font-extrabold text-slate-800 flex items-center gap-1.5 mt-0.5 truncate">
                        <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" /> {detailPatient.email}
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#4F8EF7]" /> {t('patientLookup.detailModal.latestVisit')}
                  </div>
                  <div className="text-xs font-semibold text-slate-700">
                    {t('patientLookup.detailModal.doctorTreatment', { treatmentName: detailPatient.latestTreatment, doctorName: detailPatient.latestDoctorName })}
                  </div>
                </div>

                {fullRecord ? (
                  <>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                        <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                          <Droplet className="w-3 h-3 text-rose-500" /> {t('patientLookup.detailModal.bloodGroup')}
                        </span>
                        <span className="font-extrabold text-slate-800 block mt-0.5">{fullRecord.bloodGroup}</span>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">{t('patientLookup.detailModal.skinType')}</span>
                        <span className="font-extrabold text-slate-800 block mt-0.5">{fullRecord.skinType}</span>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-100 space-y-1.5">
                      <div className="text-[10px] font-black text-amber-700 uppercase tracking-wider flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" /> {t('patientLookup.detailModal.allergies')}
                      </div>
                      <p className="text-xs font-semibold text-amber-900">
                        {fullRecord.allergies.length > 0 ? fullRecord.allergies.join(', ') : t('patientLookup.detailModal.noAllergies')}
                      </p>
                    </div>

                    {fullRecord.medicalHistoryNotes && (
                      <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1">
                          <FileText className="w-3.5 h-3.5 text-[#4F8EF7]" /> {t('patientLookup.detailModal.medicalNotes')}
                        </div>
                        <p className="text-xs text-slate-600 font-medium whitespace-pre-line">{fullRecord.medicalHistoryNotes}</p>
                      </div>
                    )}

                    {fullRecord.previousVisits.length > 0 && (
                      <div className="space-y-2">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                          {t('patientLookup.detailModal.previousVisits')}
                        </div>
                        {fullRecord.previousVisits.map((visit) => (
                          <div key={visit.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-slate-900">{visit.treatmentName}</span>
                              <span className="text-[10px] text-slate-400 font-semibold">{visit.date}</span>
                            </div>
                            <p className="text-[11px] text-slate-500 mt-0.5">{visit.doctorName} • {visit.clinicBranch}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-center text-slate-400 text-xs py-4">{t('patientLookup.detailModal.noAdditionalRecord')}</p>
                )}
              </div>
            </div>
          </div>
        );
      })()}

      {/* Receive Payment Modal */}
      {paymentTarget && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-600" />
                <h3 className="font-black text-slate-900 text-base">{t('patientLookup.paymentModal.title')}</h3>
              </div>
              <button
                onClick={() => setPaymentTarget(null)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-900 block">{paymentTarget.patientName}</span>
                  <span className="text-[10px] text-slate-400">{t('patientLookup.paymentModal.fileNo', { id: paymentTarget.patientId })}</span>
                </div>
                <span className="font-black text-[#4F8EF7]">{t('patientLookup.paymentModal.todaysVisit')}</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">{t('patientLookup.paymentModal.amountLabel')}</label>
                <input
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-black text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">{t('patientLookup.paymentModal.methodLabel')}</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`py-2 px-3 rounded-xl border text-xs font-extrabold text-center transition-all ${
                      paymentMethod === 'card'
                        ? 'bg-blue-50 border-[#4F8EF7] text-[#4F8EF7]'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    {t('patientLookup.paymentModal.creditCard')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cash')}
                    className={`py-2 px-3 rounded-xl border text-xs font-extrabold text-center transition-all ${
                      paymentMethod === 'cash'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    {t('patientLookup.paymentModal.cash')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('tabby')}
                    className={`py-2 px-3 rounded-xl border text-xs font-extrabold text-center transition-all ${
                      paymentMethod === 'tabby'
                        ? 'bg-purple-50 border-purple-500 text-purple-700'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    {t('patientLookup.paymentModal.tabby')}
                  </button>
                </div>
              </div>

              {paymentMethod === 'cash' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">{t('patientLookup.paymentModal.cashTendered')}</label>
                  <input
                    type="number"
                    value={cashTendered}
                    onChange={(e) => setCashTendered(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none"
                  />
                  <div className="text-xs font-bold text-slate-600 mt-1 flex justify-between">
                    <span>{t('patientLookup.paymentModal.changeDue')}</span>
                    <span className="text-emerald-600 font-black">${cashChange > 0 ? cashChange.toFixed(2) : '0.00'}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                onClick={() => setPaymentTarget(null)}
                className="px-4 py-2 rounded-2xl text-slate-600 hover:bg-slate-100 text-xs font-bold"
              >
                {t('common:buttons.cancel')}
              </button>
              <button
                onClick={handleProcessPayment}
                className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-md shadow-emerald-500/20"
              >
                {t('patientLookup.paymentModal.confirm')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Digital Receipt Modal */}
      {paymentSuccessReceipt && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-slate-100 text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl mx-auto flex items-center justify-center">
              <Receipt className="w-6 h-6" />
            </div>

            <h3 className="font-black text-slate-900 text-lg">{t('patientLookup.receiptModal.title')}</h3>
            <p className="text-xs text-slate-500 font-medium">{t('patientLookup.receiptModal.subtitle')}</p>

            <div className="bg-slate-50 rounded-2xl border border-slate-100 p-4 text-left space-y-2 text-xs">
              <div className="flex justify-between text-slate-500 text-[10px] uppercase font-extrabold">
                <span>{t('patientLookup.receiptModal.receiptRef')}</span>
                <span className="text-slate-800">{paymentSuccessReceipt.transactionRef}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{t('patientLookup.receiptModal.item')}</span>
                <span className="font-bold text-slate-800">{paymentSuccessReceipt.treatmentName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{t('patientLookup.receiptModal.paidAmount')}</span>
                <span className="font-black text-emerald-600">${paymentSuccessReceipt.amountPaid}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{t('patientLookup.receiptModal.method')}</span>
                <span className="font-semibold text-slate-700">{paymentSuccessReceipt.paymentMethod}</span>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-2">
              <button
                onClick={() => setPaymentSuccessReceipt(null)}
                className="w-full py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold"
              >
                {t('patientLookup.receiptModal.close')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
