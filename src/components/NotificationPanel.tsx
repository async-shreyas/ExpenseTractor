import { Notification } from '@/features/notifications/notificationsSlice';
import { useDispatch } from 'react-redux';
import { markAsRead, markAllAsRead } from '@/features/notifications/notificationsSlice';

interface NotificationPanelProps {
  notifications: Notification[];
}

export default function NotificationPanel({ notifications }: NotificationPanelProps) {
  const dispatch = useDispatch();
  const unreadCount = notifications.filter(n => !n.readAt).length;

  const handleMarkAsRead = (id: string) => {
    dispatch(markAsRead(id));
  };

  const handleMarkAllAsRead = () => {
    dispatch(markAllAsRead());
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Notifications
            {unreadCount > 0 && (
              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                {unreadCount} unread
              </span>
            )}
          </h3>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="text-sm text-indigo-600 hover:text-indigo-900"
            >
              Mark all as read
            </button>
          )}
        </div>
      </div>
      
      <div className="divide-y divide-gray-200">
        {notifications.length === 0 ? (
          <div className="px-4 py-5 sm:p-6 text-center">
            <p className="text-gray-500">No notifications</p>
          </div>
        ) : (
          notifications.map(notification => (
            <div
              key={notification._id}
              className={`px-4 py-4 sm:px-6 ${!notification.readAt ? 'bg-blue-50' : ''}`}
            >
              <div className="flex items-start">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                  <p className="mt-1 text-sm text-gray-500">{notification.body}</p>
                  <p className="mt-1 text-xs text-gray-400">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </div>
                {!notification.readAt && (
                  <button
                    onClick={() => handleMarkAsRead(notification._id)}
                    className="ml-4 text-sm text-indigo-600 hover:text-indigo-900"
                  >
                    Mark as read
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}