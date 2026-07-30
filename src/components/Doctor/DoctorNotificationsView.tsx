import React from 'react';
import { StaffNotification } from '../../types';
import { Bell, AlertCircle, UserCheck, Package } from 'lucide-react';
import { NotificationCenter, NotificationCenterCategory } from '../Notifications/NotificationCenter';

interface DoctorNotificationsViewProps {
  notifications: StaffNotification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
}

const categories: NotificationCenterCategory<StaffNotification>[] = [
  { id: 'all', label: 'All Alerts', match: () => true },
  { id: 'check_in', label: 'Patient Check-Ins', match: (n) => n.type === 'check_in' },
  { id: 'consumable_request', label: 'Consumables & Stock', match: (n) => n.type === 'consumable_request' },
  { id: 'emergency', label: 'Urgent Directives', match: (n) => n.type === 'emergency' },
  { id: 'cancellation', label: 'Schedule Changes', match: (n) => n.type === 'cancellation' || n.type === 'rescheduled' }
];

const getBadge = (notif: StaffNotification) => {
  switch (notif.type) {
    case 'check_in':
      return { icon: UserCheck, className: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
    case 'emergency':
      return { icon: AlertCircle, className: 'bg-rose-100 text-rose-800 border-rose-200' };
    case 'consumable_request':
      return { icon: Package, className: 'bg-amber-100 text-amber-800 border-amber-200' };
    default:
      return { icon: Bell, className: 'bg-blue-100 text-[#4F8EF7] border-blue-200' };
  }
};

export const DoctorNotificationsView: React.FC<DoctorNotificationsViewProps> = ({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead
}) => {
  return (
    <NotificationCenter
      title="Clinical Notification Center"
      subtitle="Real-time patient check-ins, room readiness, urgent requests, and schedule changes"
      items={notifications}
      categories={categories}
      getBadge={getBadge}
      getDetailLabel={(notif) => notif.type.replace('_', ' ').toUpperCase()}
      onMarkAsRead={onMarkAsRead}
      onMarkAllAsRead={onMarkAllAsRead}
    />
  );
};
