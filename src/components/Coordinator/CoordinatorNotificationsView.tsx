import React from 'react';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';
import { StaffNotification } from '../../types';
import { Bell, UserCheck, CalendarPlus, XCircle, Clock } from 'lucide-react';
import { NotificationCenter, NotificationCenterCategory } from '../Notifications/NotificationCenter';

interface CoordinatorNotificationsViewProps {
  notifications: StaffNotification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onTriggerToast: (msg: string) => void;
}

const getCategories = (t: TFunction): NotificationCenterCategory<StaffNotification>[] => [
  { id: 'all', label: t('notifications.categories.all'), match: () => true },
  {
    id: 'arrivals',
    label: t('notifications.categories.arrivals'),
    match: (n) => n.type === 'patient_checked_in' || n.type === 'check_in'
  },
  { id: 'new_appointment', label: t('notifications.categories.newBookings'), match: (n) => n.type === 'new_appointment' },
  {
    id: 'cancellations',
    label: t('notifications.categories.cancellations'),
    match: (n) => n.type === 'cancellation' || n.type === 'rescheduled'
  },
  { id: 'followup_reminder', label: t('notifications.categories.followUps'), match: (n) => n.type === 'followup_reminder' }
];

const getBadge = (notif: StaffNotification) => {
  switch (notif.type) {
    case 'patient_checked_in':
    case 'check_in':
      return { icon: UserCheck, className: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
    case 'new_appointment':
      return { icon: CalendarPlus, className: 'bg-blue-100 text-[#4F8EF7] border-blue-200' };
    case 'cancellation':
    case 'rescheduled':
      return { icon: XCircle, className: 'bg-rose-100 text-rose-800 border-rose-200' };
    case 'followup_reminder':
      return { icon: Clock, className: 'bg-amber-100 text-amber-800 border-amber-200' };
    default:
      return { icon: Bell, className: 'bg-blue-100 text-[#4F8EF7] border-blue-200' };
  }
};

export const CoordinatorNotificationsView: React.FC<CoordinatorNotificationsViewProps> = ({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onTriggerToast
}) => {
  const { t } = useTranslation('coordinator');

  return (
    <NotificationCenter
      title={t('notifications.title')}
      subtitle={t('notifications.subtitle')}
      items={notifications}
      categories={getCategories(t)}
      getBadge={getBadge}
      getDetailLabel={(notif) => notif.type.replace('_', ' ').toUpperCase()}
      onMarkAsRead={onMarkAsRead}
      onMarkAllAsRead={() => {
        onMarkAllAsRead();
        onTriggerToast(t('notifications.toastAllRead'));
      }}
    />
  );
};
