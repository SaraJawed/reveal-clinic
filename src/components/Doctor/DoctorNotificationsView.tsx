import React from 'react';
import { useTranslation } from 'react-i18next';
import { StaffNotification } from '../../types';
import { Bell, AlertCircle, UserCheck, Package, Activity, CheckCircle2 } from 'lucide-react';
import { NotificationCenter, NotificationCenterCategory } from '../Notifications/NotificationCenter';

interface DoctorNotificationsViewProps {
  notifications: StaffNotification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
}

const getBadge = (notif: StaffNotification) => {
  switch (notif.type) {
    case 'check_in':
    case 'patient_checked_in':
      return { icon: UserCheck, className: 'bg-amber-100 text-amber-800 border-amber-200' };
    case 'patient_in_consultation':
      return { icon: Activity, className: 'bg-blue-100 text-[#4F8EF7] border-blue-200' };
    case 'patient_ready_for_procedure':
      return { icon: Activity, className: 'bg-purple-100 text-purple-700 border-purple-200' };
    case 'patient_completed':
      return { icon: CheckCircle2, className: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
    case 'emergency':
      return { icon: AlertCircle, className: 'bg-rose-100 text-rose-800 border-rose-200' };
    case 'consumable_request':
      return { icon: Package, className: 'bg-amber-100 text-amber-800 border-amber-200' };
    default:
      return { icon: Bell, className: 'bg-blue-100 text-[#4F8EF7] border-blue-200' };
  }
};

// Notification type -> translation key mapping (underlying type values stay unchanged)
const typeLabelKeys: Record<string, string> = {
  check_in: 'checkIn',
  patient_checked_in: 'patientCheckedIn',
  patient_in_consultation: 'patientInConsultation',
  patient_ready_for_procedure: 'patientInProcedure',
  patient_completed: 'patientCompleted',
  consumable_request: 'consumableRequest',
  emergency: 'emergency',
  cancellation: 'cancellation',
  rescheduled: 'rescheduled'
};

export const DoctorNotificationsView: React.FC<DoctorNotificationsViewProps> = ({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead
}) => {
  const { t } = useTranslation('doctor');

  const categories: NotificationCenterCategory<StaffNotification>[] = [
    { id: 'all', label: t('notifications.categories.all'), match: () => true },
    { id: 'check_in', label: t('notifications.categories.checkIns'), match: (n) => n.type === 'check_in' },
    { id: 'consumable_request', label: t('notifications.categories.consumables'), match: (n) => n.type === 'consumable_request' },
    { id: 'emergency', label: t('notifications.categories.emergency'), match: (n) => n.type === 'emergency' },
    { id: 'cancellation', label: t('notifications.categories.scheduleChanges'), match: (n) => n.type === 'cancellation' || n.type === 'rescheduled' }
  ];

  return (
    <NotificationCenter
      title={t('notifications.header.title')}
      subtitle={t('notifications.header.subtitle')}
      items={notifications}
      categories={categories}
      getBadge={getBadge}
      getDetailLabel={(notif) => t(`notifications.types.${typeLabelKeys[notif.type] || notif.type}`, notif.type.replace('_', ' ').toUpperCase())}
      onMarkAsRead={onMarkAsRead}
      onMarkAllAsRead={onMarkAllAsRead}
    />
  );
};
