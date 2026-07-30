import React from 'react';
import { StaffNotification } from '../../types';
import { Bell, UserCheck, CalendarPlus, XCircle, Clock } from 'lucide-react';
import { NotificationCenter, NotificationCenterCategory } from '../Notifications/NotificationCenter';

interface CoordinatorNotificationsViewProps {
  notifications: StaffNotification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onTriggerToast: (msg: string) => void;
}

const categories: NotificationCenterCategory<StaffNotification>[] = [
  { id: 'all', label: 'All Alerts', match: () => true },
  {
    id: 'arrivals',
    label: 'Patient Arrivals',
    match: (n) => n.type === 'patient_checked_in' || n.type === 'check_in'
  },
  { id: 'new_appointment', label: 'New Bookings', match: (n) => n.type === 'new_appointment' },
  {
    id: 'cancellations',
    label: 'Cancellations & Reschedules',
    match: (n) => n.type === 'cancellation' || n.type === 'rescheduled'
  },
  { id: 'followup_reminder', label: 'Follow-Ups', match: (n) => n.type === 'followup_reminder' }
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
  return (
    <NotificationCenter
      title="Reception Notification Center"
      subtitle="Live updates on patient arrivals, walk-ins, schedule changes, and requests"
      items={notifications}
      categories={categories}
      getBadge={getBadge}
      getDetailLabel={(notif) => notif.type.replace('_', ' ').toUpperCase()}
      onMarkAsRead={onMarkAsRead}
      onMarkAllAsRead={() => {
        onMarkAllAsRead();
        onTriggerToast('All notifications marked as read.');
      }}
    />
  );
};
