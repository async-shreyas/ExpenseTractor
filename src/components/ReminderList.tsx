import { useState, useEffect } from 'react';
import  {Reminder} from '@/models/Reminder';

interface ReminderListProps {
  userId: string;
  onEdit: (reminder: Reminder) => void;
}

export default function ReminderList({ userId, onEdit }: ReminderListProps) {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReminders();
  }, [userId]);

  const fetchReminders = async () => {
    try {
      const response = await fetch('/api/reminders');
      const data = await response.json();
      if (data.success) {
        setReminders(data.data);
      }
    } catch (error) {
      console.error('Error fetching reminders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this reminder?')) {
      try {
        const response = await fetch(`/api/reminders/${id}`, {
          method: 'DELETE',
        });
        const data = await response.json();
        if (data.success) {
          setReminders(reminders.filter(r => r._id !== id));
        }
      } catch (error) {
        console.error('Error deleting reminder:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (reminders.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg p-6 text-center">
        <p className="text-gray-500">No reminders found. Add your first reminder!</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <ul className="divide-y divide-gray-200">
        {reminders.map((reminder) => (
          <li key={reminder._id}>
            <div className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-indigo-600 truncate">{reminder.title}</p>
                    <p className="mt-1 flex items-center text-sm text-gray-500">
                      <span>{reminder.frequency}</span>
                      <span className="mx-2">•</span>
                      <span>Next: {new Date(reminder.nextRunAt).toLocaleDateString()}</span>
                    </p>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      reminder.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {reminder.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
                <div className="ml-4 flex-shrink-0 flex space-x-2">
                  <button
                    onClick={() => onEdit(reminder)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(reminder._id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}