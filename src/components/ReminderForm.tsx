import { useState } from 'react';
import { Reminder } from '@/models/Reminder';

interface ReminderFormProps {
  reminder?: Reminder | null;
  onSubmit: (reminder: any) => void;
  onCancel: () => void;
}

export default function ReminderForm({ reminder, onSubmit, onCancel }: ReminderFormProps) {
  const [formData, setFormData] = useState({
    title: reminder?.title || '',
    message: reminder?.message || '',
    frequency: reminder?.frequency || 'monthly',
    nextRunAt: reminder?.nextRunAt ? new Date(reminder.nextRunAt).toISOString().slice(0, 16) : '',
    entityType: reminder?.entityType || '',
    entityId: reminder?.entityId || '',
    email: reminder?.email || false,
    inApp: reminder?.inApp || true,
    webPush: reminder?.webPush || false,
  });

  const frequencies = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'yearly', label: 'Yearly' },
  ];

  const entityTypes = [
    { value: 'expense', label: 'Expense' },
    { value: 'emi', label: 'EMI' },
    { value: 'loan', label: 'Loan' },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      nextRunAt: new Date(formData.nextRunAt),
    });
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">
        {reminder ? 'Edit Reminder' : 'Add New Reminder'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            name="title"
            id="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700">
            Message
          </label>
          <textarea
            name="message"
            id="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="frequency" className="block text-sm font-medium text-gray-700">
              Frequency
            </label>
            <select
              name="frequency"
              id="frequency"
              value={formData.frequency}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              {frequencies.map(freq => (
                <option key={freq.value} value={freq.value}>{freq.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="nextRunAt" className="block text-sm font-medium text-gray-700">
              Next Run Date & Time
            </label>
            <input
              type="datetime-local"
              name="nextRunAt"
              id="nextRunAt"
              value={formData.nextRunAt}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        </div>

        <div>
          <label htmlFor="entityType" className="block text-sm font-medium text-gray-700">
            Related To (Optional)
          </label>
          <select
            name="entityType"
            id="entityType"
            value={formData.entityType}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">None</option>
            {entityTypes.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-900">Notification Methods</h3>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              name="email"
              id="email"
              checked={formData.email}
              onChange={handleChange}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="email" className="ml-2 block text-sm text-gray-900">Email notification</label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="inApp"
              id="inApp"
              checked={formData.inApp}
              onChange={handleChange}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="inApp" className="ml-2 block text-sm text-gray-900">In-app notification</label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="webPush"
              id="webPush"
              checked={formData.webPush}
              onChange={handleChange}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="webPush" className="ml-2 block text-sm text-gray-900">Push notification</label>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700"
          >
            {reminder ? 'Update' : 'Add'} Reminder
          </button>
        </div>
      </form>
    </div>
  );
}