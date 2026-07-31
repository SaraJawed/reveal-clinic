import React from 'react';
import { useTranslation } from 'react-i18next';
import { MedicalReport } from '../../types';
import { FileText, Download, ShieldCheck } from 'lucide-react';

interface MedicalReportsViewProps {
  reports: MedicalReport[];
}

export const MedicalReportsView: React.FC<MedicalReportsViewProps> = ({ reports }) => {
  const { t } = useTranslation('reports');

  const handleDownloadPdf = (report: MedicalReport) => {
    // Generate a simple simulated PDF text file blob download
    const content = `
==================================================
              ${t('pdf.clinicName')}
   ${t('pdf.clinicTagline')}
==================================================
${t('pdf.documentLabel', { title: report.title })}
${t('pdf.documentTypeLabel', { type: report.type })}
${t('pdf.doctorLabel', { doctorName: report.doctorName })}
${t('pdf.dateLabel', { date: report.date })}
${t('pdf.locationLabel', { clinicName: report.clinicName })}
--------------------------------------------------
${t('pdf.summaryHeading')}
${report.summary}

${report.prescriptions ? `${t('pdf.prescriptionsHeading')}
` + report.prescriptions.map(p => t('pdf.prescriptionLine', { medication: p.medication, dosage: p.dosage, instructions: p.instructions })).join('\n') : ''}

--------------------------------------------------
${t('pdf.signatureNote')}
    `;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = report.downloadPdfName || t('pdf.defaultFileName');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 pb-24 md:pb-8">
      {/* Header */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-1">
        <h1 className="text-lg font-bold text-slate-900">{t('header.title')}</h1>
        <p className="text-xs text-slate-500">{t('header.subtitle')}</p>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {reports.map((rep) => (
          <div
            key={rep.id}
            className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition space-y-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-200">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full uppercase border border-amber-200">
                    {rep.type}
                  </span>
                  <h3 className="font-bold text-slate-900 text-sm mt-1">{rep.title}</h3>
                  <p className="text-xs text-slate-500">{t('card.doctorDate', { doctorName: rep.doctorName, date: rep.date })}</p>
                </div>
              </div>
              <span className="text-[11px] font-semibold text-slate-400 shrink-0">{rep.fileSize}</span>
            </div>

            <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-2xl border border-slate-100 line-clamp-2">
              {rep.summary}
            </p>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> {t('card.digitallySigned')}
              </span>
              <button
                id={`reports-download-${rep.id}-btn`}
                onClick={() => handleDownloadPdf(rep)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-3.5 py-1.5 rounded-xl transition shadow-xs flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" /> {t('card.downloadButton')}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
