import React, { useState } from 'react';
import { TreatmentService, TreatmentPackage, Doctor } from '../../types';
import { Sparkles, Check, Clock, ChevronRight, ShieldCheck, Gift, Award } from 'lucide-react';
import { BottomSheet } from '../PWA/BottomSheet';

interface ServicesViewProps {
  treatments: TreatmentService[];
  packages: TreatmentPackage[];
  doctors: Doctor[];
  onSelectTreatmentForBooking: (treatment: TreatmentService) => void;
  onPurchasePackage: (pack: TreatmentPackage, doctor: Doctor, date: string, timeSlot: string) => void;
}

export const ServicesView: React.FC<ServicesViewProps> = ({
  treatments,
  packages,
  doctors,
  onSelectTreatmentForBooking,
  onPurchasePackage
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedTreatment, setSelectedTreatment] = useState<TreatmentService | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<TreatmentPackage | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor>(doctors[0] || {} as any);
  const [selectedDate, setSelectedDate] = useState('2026-07-29');
  const [selectedSlot, setSelectedSlot] = useState('11:00 AM');

  const categories = ['All', 'Medical Aesthetics', 'Laser Treatments', 'Injectables', 'Anti-Aging', 'Body Contouring'];

  const filteredTreatments = treatments.filter(t => {
    if (activeCategory === 'All') return true;
    return t.categoryName.toLowerCase() === activeCategory.toLowerCase();
  });

  return (
    <div className="space-y-6 pb-24 md:pb-8">
      {/* Header & Categories */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3">
        <div>
          <h1 className="text-lg font-bold text-slate-900">Treatments, Services & Packages</h1>
          <p className="text-xs text-slate-500">Explore FDA-approved dermatology & aesthetic procedures.</p>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {categories.map((cat) => (
            <button
              key={cat}
              id={`services-cat-${cat}-btn`}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                activeCategory === cat
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* SECTION 1: VALUE PACKAGES & MEMBERSHIP PLANS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-sky-500" /> Treatment Packages & Savings Packs
          </h2>
          <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            Save up to 22%
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {packages.map((pack) => (
            <div
              key={pack.id}
              className="bg-gradient-to-b from-slate-900 via-slate-900 to-blue-950 text-white rounded-3xl p-5 border border-slate-800 shadow-lg flex flex-col justify-between relative overflow-hidden"
            >
              <div className="absolute top-3 right-3 bg-emerald-500 text-slate-950 font-extrabold text-[10px] px-2.5 py-0.5 rounded-full">
                SAVE {pack.savingsPercentage}%
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400">
                  {pack.totalSessions} Sessions Pack
                </span>
                <h3 className="font-bold text-base text-white">{pack.name}</h3>
                <p className="text-xs text-slate-300 leading-tight">{pack.tagline}</p>

                <div className="pt-2 space-y-1">
                  {pack.includedTreatments.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-200">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 line-through block">SAR {pack.originalValue}</span>
                  <span className="font-extrabold text-white text-lg">SAR {pack.price}</span>
                </div>
                <button
                  id={`services-buy-pack-${pack.id}-btn`}
                  onClick={() => setSelectedPackage(pack)}
                  className="bg-sky-400 hover:bg-sky-300 text-slate-950 font-bold px-4 py-2 rounded-2xl text-xs transition shadow-md"
                >
                  Purchase Package
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: INDIVIDUAL TREATMENTS GRID */}
      <div className="space-y-3 pt-2">
        <h2 className="text-sm font-bold text-slate-900 px-1">
          Single Treatments & Clinical Procedures ({filteredTreatments.length})
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTreatments.map((treat) => (
            <div
              key={treat.id}
              className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col justify-between hover:shadow-md transition p-4 space-y-3"
            >
              <div className="flex items-start gap-3.5">
                <img
                  src={treat.imageUrl}
                  alt={treat.name}
                  className="w-20 h-20 rounded-2xl object-cover ring-2 ring-blue-500/10 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full uppercase">
                      {treat.categoryName}
                    </span>
                    <span className="font-extrabold text-slate-900 text-sm">SAR {treat.price}</span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm mt-1">{treat.name}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">{treat.shortDescription}</p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-blue-500" /> {treat.durationMinutes} Minutes
                </span>
                <div className="flex items-center gap-2">
                  <button
                    id={`services-details-${treat.id}-btn`}
                    onClick={() => setSelectedTreatment(treat)}
                    className="text-slate-600 hover:text-slate-900 font-bold px-2 py-1"
                  >
                    Details
                  </button>
                  <button
                    id={`services-book-now-${treat.id}-btn`}
                    onClick={() => onSelectTreatmentForBooking(treat)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-1.5 rounded-xl transition shadow-xs"
                  >
                    Book
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* TREATMENT DETAILS SHEET */}
      <BottomSheet
        isOpen={!!selectedTreatment}
        onClose={() => setSelectedTreatment(null)}
        title={selectedTreatment?.name}
        subtitle={selectedTreatment?.categoryName}
      >
        {selectedTreatment && (
          <div className="space-y-4">
            <img
              src={selectedTreatment.imageUrl}
              alt={selectedTreatment.name}
              className="w-full h-44 rounded-2xl object-cover shadow-sm"
            />
            <p className="text-xs text-slate-600 leading-relaxed">{selectedTreatment.fullDescription}</p>

            <div className="bg-blue-50 p-3 rounded-2xl border border-blue-200/60 space-y-1.5">
              <h4 className="font-bold text-blue-900 text-xs">Key Treatment Benefits</h4>
              {selectedTreatment.benefits.map((b, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-slate-700">
                  <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" /> {b}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <strong className="block text-slate-800 text-[11px]">Pre-Care Guidance:</strong>
                <span className="text-slate-600 text-[11px]">{selectedTreatment.preCare}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <strong className="block text-slate-800 text-[11px]">Post-Care Guidance:</strong>
                <span className="text-slate-600 text-[11px]">{selectedTreatment.postCare}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="font-extrabold text-slate-900 text-lg">SAR {selectedTreatment.price}</span>
              <button
                id="services-sheet-book-btn"
                onClick={() => {
                  const t = selectedTreatment;
                  setSelectedTreatment(null);
                  onSelectTreatmentForBooking(t);
                }}
                className="bg-blue-600 text-white font-bold px-6 py-3 rounded-2xl text-xs shadow-md"
              >
                Schedule Appointment
              </button>
            </div>
          </div>
        )}
      </BottomSheet>

      {/* PACKAGE PURCHASE CONFIRM SHEET */}
      <BottomSheet
        isOpen={!!selectedPackage}
        onClose={() => setSelectedPackage(null)}
        title="Confirm Package Purchase"
        subtitle={selectedPackage?.name}
      >
        {selectedPackage && (
          <div className="space-y-4">
            <div className="bg-slate-900 text-white p-4 rounded-2xl space-y-2">
              <div className="flex justify-between text-xs">
                <span>Total Package Price:</span>
                <span className="font-bold text-sky-400">SAR {selectedPackage.price}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>Original Value:</span>
                <span className="line-through text-slate-400">SAR {selectedPackage.originalValue}</span>
              </div>
              <div className="flex justify-between text-xs font-bold text-emerald-400 pt-1 border-t border-slate-800">
                <span>Your Total Savings:</span>
                <span>SAR {selectedPackage.originalValue - selectedPackage.price} ({selectedPackage.savingsPercentage}%)</span>
              </div>
            </div>

            {/* Select Doctor for Package */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Select Specialist Doctor</label>
              <select
                value={selectedDoctor?.id || ''}
                onChange={(e) => {
                  const doc = doctors.find(d => d.id === e.target.value);
                  if (doc) setSelectedDoctor(doc);
                }}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-hidden"
              >
                {doctors.map(d => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.specialty})
                  </option>
                ))}
              </select>
            </div>

            {/* Date & Time Slot */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Appointment Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-hidden"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Time Slot</label>
                <select
                  value={selectedSlot}
                  onChange={(e) => setSelectedSlot(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-hidden"
                >
                  {['09:00 AM', '10:30 AM', '11:00 AM', '01:30 PM', '03:00 PM', '04:30 PM'].map(slot => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>
            </div>

            <p className="text-xs text-slate-500">
              Purchasing this package adds <strong>{selectedPackage.totalSessions} sessions</strong> to your active user account, valid for {selectedPackage.validityMonths} months across all Reveal Clinic locations.
            </p>

            <button
              id="services-confirm-purchase-pack-btn"
              onClick={() => {
                const p = selectedPackage;
                setSelectedPackage(null);
                onPurchasePackage(p, selectedDoctor, selectedDate, selectedSlot);
              }}
              className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-2xl text-xs shadow-md shadow-blue-500/25"
            >
              Proceed to Online Payment (SAR {selectedPackage.price})
            </button>
          </div>
        )}
      </BottomSheet>
    </div>
  );
};
