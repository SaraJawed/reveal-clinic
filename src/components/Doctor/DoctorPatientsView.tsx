import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ClinicalPatientRecord, MedicalReport } from '../../types';
import {
  Users,
  Search,
  FileText,
  ShieldAlert,
  Calendar,
  Activity,
  Award,
  ChevronDown,
  ChevronUp,
  Download,
  Plus,
  Heart,
  Sparkles,
  FileSpreadsheet,
  FileCheck,
  X,
  Stethoscope,
  CheckCircle2
} from 'lucide-react';

interface DoctorPatientsViewProps {
  patients: ClinicalPatientRecord[];
  onAddClinicalNote?: (patientId: string, note: string) => void;
}

export const DoctorPatientsView: React.FC<DoctorPatientsViewProps> = ({
  patients,
  onAddClinicalNote
}) => {
  const { t } = useTranslation('doctor');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [expandedSection, setExpandedSection] = useState<'history' | 'visits' | 'treatments' | 'reports' | 'notes'>('history');
  
  const [newNoteText, setNewNoteText] = useState('');
  const [showAddNoteModal, setShowAddNoteModal] = useState(false);

  // Filter patients by search query (Excluding phone numbers completely)
  const filteredPatients = patients.filter((patient) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      patient.fullName.toLowerCase().includes(q) ||
      patient.patientId.toLowerCase().includes(q) ||
      patient.skinType.toLowerCase().includes(q)
    );
  });

  const selectedPatient = selectedPatientId ? (patients.find((p) => p.id === selectedPatientId) || null) : null;

  return (
    <div className="space-y-6 pb-20 md:pb-10">
      {/* Header */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 md:p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-blue-50 text-[#4F8EF7]">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-extrabold text-lg text-slate-900 tracking-tight">
              {t('patients.header.title')}
            </h1>
            <p className="text-xs text-slate-500">
              {t('patients.header.subtitle')}
            </p>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('patients.header.searchPlaceholder')}
            className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs font-semibold focus:bg-white focus:border-blue-500 outline-hidden"
          />
        </div>
      </div>

      {!selectedPatient ? (
        <div className="space-y-3">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
            {t('patients.list.registeredCount', { count: filteredPatients.length })}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPatients.map((patient) => {
              return (
                <div
                  key={patient.id}
                  onClick={() => setSelectedPatientId(patient.id)}
                  className="p-4 rounded-3xl border transition cursor-pointer flex items-center justify-between gap-3 bg-white border-slate-100 hover:border-blue-500/50 hover:shadow-md"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={patient.avatarUrl}
                      alt={patient.fullName}
                      className="w-12 h-12 rounded-2xl object-cover ring-2 ring-slate-100 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-extrabold text-xs text-slate-900 truncate">
                          {patient.fullName}
                        </h3>
                      </div>
                      <p className="text-[10px] font-bold text-[#4F8EF7] truncate">
                        {t('patients.list.idAgeGender', { patientId: patient.patientId, age: patient.age, gender: patient.gender })}
                      </p>
                      <p className="text-[10px] text-slate-500 truncate">
                        {patient.skinType}
                      </p>
                    </div>
                  </div>

                  {patient.allergies.length > 0 && (
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" title={t('patients.list.allergyFlagTitle')} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => setSelectedPatientId(null)}
              className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl text-xs font-bold transition cursor-pointer"
            >
              {t('patients.detail.backButton')}
            </button>
          </div>

          <div className="space-y-6">
            {/* Patient Master Card Header */}
            <div className="bg-white border border-slate-100 rounded-3xl p-5 md:p-6 shadow-md space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-4">
                  <img
                    src={selectedPatient.avatarUrl}
                    alt={selectedPatient.fullName}
                    className="w-16 h-16 rounded-2xl object-cover ring-4 ring-blue-50 shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-black text-slate-900 text-lg sm:text-xl">
                        {selectedPatient.fullName}
                      </h2>
                      <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#4F8EF7] text-[10px] font-extrabold border border-blue-100">
                        {selectedPatient.patientId}
                      </span>
                    </div>

                    <p className="text-xs font-semibold text-slate-500 mt-0.5">
                      {t('patients.detail.ageGenderBlood', { age: selectedPatient.age, gender: selectedPatient.gender.toUpperCase() })} <strong className="text-slate-800">{selectedPatient.bloodGroup}</strong>
                    </p>

                    <p className="text-xs text-[#4F8EF7] font-bold mt-1">
                      {selectedPatient.skinType}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setShowAddNoteModal(true)}
                    className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5 text-sky-300" />
                    <span>{t('patients.detail.addNoteButton')}</span>
                  </button>
                </div>
              </div>

              {/* Quick Info Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold block">{t('patients.detail.registeredBranch')}</span>
                  <span className="font-extrabold text-slate-800 truncate block">{selectedPatient.registeredBranch}</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold block">{t('patients.detail.activePackages')}</span>
                  <span className="font-extrabold text-[#4F8EF7]">{t('patients.detail.activePackagesValue', { count: selectedPatient.activePackagesCount })}</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-100 col-span-2 sm:col-span-1">
                  <span className="text-[10px] text-slate-400 font-bold block">{t('patients.detail.totalVisited')}</span>
                  <span className="font-extrabold text-slate-800">{t('patients.detail.totalVisitedValue', { count: selectedPatient.previousVisits.length })}</span>
                </div>
              </div>
            </div>

            {/* Expandable Medical Sections Accordion / Tabs */}
            <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-2xs space-y-4">
              <div className="flex border-b border-slate-100 pb-2 gap-2 overflow-x-auto">
                <button
                  type="button"
                  onClick={() => setExpandedSection('history')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                    expandedSection === 'history'
                      ? 'bg-[#4F8EF7] text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {t('patients.tabs.history')}
                </button>
                <button
                  type="button"
                  onClick={() => setExpandedSection('visits')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                    expandedSection === 'visits'
                      ? 'bg-[#4F8EF7] text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {t('patients.tabs.visits', { count: selectedPatient.previousVisits.length })}
                </button>
                <button
                  type="button"
                  onClick={() => setExpandedSection('treatments')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                    expandedSection === 'treatments'
                      ? 'bg-[#4F8EF7] text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {t('patients.tabs.treatments')}
                </button>
                <button
                  type="button"
                  onClick={() => setExpandedSection('reports')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                    expandedSection === 'reports'
                      ? 'bg-[#4F8EF7] text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {t('patients.tabs.reports', { count: selectedPatient.reports.length })}
                </button>
              </div>

              {/* TAB 1: Medical History Notes */}
              {expandedSection === 'history' && (
                <div className="space-y-3">
                  <h3 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider">
                    {t('patients.history.sectionTitle')}
                  </h3>
                  <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs text-slate-700 leading-relaxed font-medium whitespace-pre-wrap">
                    {selectedPatient.medicalHistoryNotes}
                  </div>
                </div>
              )}

              {/* TAB 2: Previous Visits */}
              {expandedSection === 'visits' && (
                <div className="space-y-3">
                  <h3 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider">
                    {t('patients.visits.sectionTitle')}
                  </h3>
                  {selectedPatient.previousVisits.map((vis) => (
                    <div key={vis.id} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-900 border-b border-slate-200/60 pb-1.5">
                        <span>{vis.treatmentName}</span>
                        <span className="text-[#4F8EF7]">{vis.date}</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed font-medium">
                        {vis.clinicalNotes}
                      </p>
                      <p className="text-[11px] text-slate-400 font-semibold">
                        {t('patients.visits.physicianLine', { doctor: vis.doctorName, branch: vis.clinicBranch })}
                      </p>
                      {vis.prescriptions && vis.prescriptions.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-slate-200/60 text-xs">
                          <span className="font-bold text-slate-700 block mb-1">{t('patients.visits.prescriptionsLabel')}</span>
                          {vis.prescriptions.map((p, i) => (
                            <span key={i} className="inline-block bg-white px-2.5 py-1 rounded-lg border border-slate-200/80 mr-2 text-[11px] font-semibold text-slate-800">
                              {t('patients.visits.prescriptionItem', { medication: p.medication, dosage: p.dosage, frequency: p.frequency })}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 3: Treatment History */}
              {expandedSection === 'treatments' && (
                <div className="space-y-3">
                  <h3 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider">
                    {t('patients.treatments.sectionTitle')}
                  </h3>
                  {selectedPatient.treatmentHistory.map((th) => (
                    <div key={th.id} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between gap-3">
                      <div>
                        <h4 className="font-bold text-xs text-slate-900">{th.treatmentName}</h4>
                        <p className="text-[11px] text-slate-500 font-medium">{t('patients.treatments.datesLine', { startDate: th.startDate, lastDate: th.lastSessionDate })}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="px-3 py-1 bg-blue-100 text-[#4F8EF7] font-extrabold rounded-full text-xs">
                          {t('patients.treatments.sessionsCount', { completed: th.completedSessions, total: th.totalSessions })}
                        </span>
                        <p className="text-[10px] text-emerald-600 font-bold mt-1 uppercase">{th.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 4: Reports */}
              {expandedSection === 'reports' && (
                <div className="space-y-3">
                  <h3 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider">
                    {t('patients.reports.sectionTitle')}
                  </h3>
                  {selectedPatient.reports.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">{t('patients.reports.empty')}</p>
                  ) : (
                    selectedPatient.reports.map((rep) => (
                      <div key={rep.id} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#4F8EF7] flex items-center justify-center shrink-0">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="font-bold text-xs text-slate-900">{rep.title}</h4>
                            <p className="text-[11px] text-slate-500">{rep.summary}</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => alert(t('patients.reports.downloadingAlert', { fileName: rep.downloadPdfName }))}
                          className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 font-bold rounded-xl text-xs transition flex items-center gap-1.5 shrink-0"
                        >
                          <Download className="w-3.5 h-3.5 text-[#4F8EF7]" />
                          <span>{t('patients.reports.pdfButton')}</span>
                        </button>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Clinical Note Modal */}
      {showAddNoteModal && selectedPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 space-y-4 border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-sm text-slate-900">
                {t('patients.noteModal.title', { name: selectedPatient.fullName })}
              </h3>
              <button onClick={() => setShowAddNoteModal(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <textarea
              rows={4}
              value={newNoteText}
              onChange={(e) => setNewNoteText(e.target.value)}
              placeholder={t('patients.noteModal.placeholder')}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-800 outline-hidden focus:bg-white focus:border-blue-500"
            />

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddNoteModal(false)}
                className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl font-bold text-xs"
              >
                {t('common:buttons.cancel')}
              </button>
              <button
                type="button"
                onClick={() => {
                  if (newNoteText.trim() && onAddClinicalNote) {
                    onAddClinicalNote(selectedPatient.id, newNoteText.trim());
                  } else if (newNoteText.trim()) {
                    const timestamp = `[${new Date().toLocaleDateString()}]`;
                    selectedPatient.medicalHistoryNotes = selectedPatient.medicalHistoryNotes
                      ? `${selectedPatient.medicalHistoryNotes}\n\n${timestamp} ${newNoteText.trim()}`
                      : `${timestamp} ${newNoteText.trim()}`;
                  }
                  setNewNoteText('');
                  setShowAddNoteModal(false);
                }}
                className="px-4 py-2 bg-[#4F8EF7] text-white rounded-xl font-bold text-xs"
              >
                {t('patients.noteModal.saveButton')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
