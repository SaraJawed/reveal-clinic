import React from 'react';
import { useTranslation } from 'react-i18next';
import { Doctor } from '../../types';
import { Star } from 'lucide-react';

interface DoctorSlotPickerProps {
  doctors: Doctor[];
  selectedDoctor: Doctor | null;
  onSelectDoctor: (doctor: Doctor) => void;
  selectedDate: string;
  onChangeDate: (date: string) => void;
  selectedSlot: string | null;
  onChangeSlot: (slot: string) => void;
  minDate?: string;
}

export const DoctorSlotPicker: React.FC<DoctorSlotPickerProps> = ({
  doctors,
  selectedDoctor,
  onSelectDoctor,
  selectedDate,
  onChangeDate,
  selectedSlot,
  onChangeSlot,
  minDate
}) => {
  const { t } = useTranslation('payments');
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-2">{t('doctorSlotPicker.selectDoctorLabel')}</label>
        <div className="space-y-2">
          {doctors.map((doc) => (
            <button
              key={doc.id}
              type="button"
              id={`doctor-slot-picker-doctor-${doc.id}-btn`}
              onClick={() => onSelectDoctor(doc)}
              className={`w-full flex items-center gap-3 p-3 rounded-2xl border text-left transition ${
                selectedDoctor?.id === doc.id
                  ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-500/20'
                  : 'bg-white border-slate-200 hover:bg-slate-50'
              }`}
            >
              <img src={doc.avatarUrl} alt={doc.name} className="w-11 h-11 rounded-xl object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span className="font-bold text-slate-900 text-xs truncate">{doc.name}</span>
                  <span className="flex items-center gap-0.5 text-[10px] font-bold text-amber-700 shrink-0">
                    {doc.rating} <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 truncate">{doc.specialty}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1.5">{t('doctorSlotPicker.appointmentDateLabel')}</label>
        <input
          type="date"
          value={selectedDate}
          min={minDate}
          onChange={(e) => onChangeDate(e.target.value)}
          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-hidden focus:bg-white focus:border-blue-500"
        />
      </div>

      {selectedDoctor && (
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">{t('doctorSlotPicker.availableTimeSlotsLabel')}</label>
          <div className="grid grid-cols-3 gap-2">
            {selectedDoctor.availableTimeSlots.map((slot) => (
              <button
                key={slot}
                type="button"
                onClick={() => onChangeSlot(slot)}
                className={`py-2 px-2 rounded-xl text-xs font-bold border transition text-center ${
                  selectedSlot === slot
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
