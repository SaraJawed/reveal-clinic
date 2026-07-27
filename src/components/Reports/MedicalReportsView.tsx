import React from 'react';
import { MedicalReport } from '../../types';
import { FileText, Download, ShieldCheck } from 'lucide-react';

interface MedicalReportsViewProps {
  reports: MedicalReport[];
}

export const MedicalReportsView: React.FC<MedicalReportsViewProps> = ({ reports }) => {
  const handleDownloadPdf = (report: MedicalReport) => {
    // Generate a simple simulated PDF text file blob download
    const content = `
==================================================
              REVEAL CLINIC
   Aesthetic & Medical Dermatology Center
==================================================
Document: ${report.title}
Document Type: ${report.type}
Doctor: ${report.doctorName}
Date: ${report.date}
Location: ${report.clinicName}
--------------------------------------------------
CLINICAL SUMMARY & NOTES:
${report.summary}

${report.prescriptions ? `PRESCRIPTIONS & RECOMMENDATIONS:
` + report.prescriptions.map(p => `- ${p.medication}: ${p.dosage} (${p.instructions})`).join('\n') : ''}

--------------------------------------------------
This document is digitally signed and encrypted by Reveal Clinic PWA Portal.
    `;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = report.downloadPdfName || 'Reveal_Medical_Report.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 pb-24 md:pb-8">
      {/* Header */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-1">
        <h1 className="text-lg font-bold text-slate-900">Medical Reports & Certificates</h1>
        <p className="text-xs text-slate-500">Access digitally signed skin diagnostics, treatment notes & certificates.</p>
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
                  <p className="text-xs text-slate-500">{rep.doctorName} • {rep.date}</p>
                </div>
              </div>
              <span className="text-[11px] font-semibold text-slate-400 shrink-0">{rep.fileSize}</span>
            </div>

            <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-2xl border border-slate-100 line-clamp-2">
              {rep.summary}
            </p>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Digitally Signed PDF
              </span>
              <button
                id={`reports-download-${rep.id}-btn`}
                onClick={() => handleDownloadPdf(rep)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-3.5 py-1.5 rounded-xl transition shadow-xs flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" /> Download PDF
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
