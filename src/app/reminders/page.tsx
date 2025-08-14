'use client';

import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import Layout from '@/components/Layout';
import ReminderList from '@/components/ReminderList';
import ReminderForm from '@/components/ReminderForm';
import { Reminder } from '@/models/Reminder';

export default function RemindersPage() {
  const { user } = useSelector((state: RootState) => state.auth);
  const [showForm, setShowForm] = useState(false);
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);

  const handleAddReminder = () => {
    setEditingReminder(null);
    setShowForm(true);
  };

  const handleEditReminder = (reminder: Reminder) => {
    setEditingReminder(reminder);
    setShowForm(true);
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmitReminder = (reminderData: any) => {
    // API call to save reminder
    console.log('Saving reminder:', reminderData);
    setShowForm(false);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Reminders</h1>
            <p className="mt-1 text-sm text-gray-600">Manage your reminders</p>
          </div>
          <button
            onClick={handleAddReminder}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            Add Reminder
          </button>
        </div>

        {showForm && (
          <ReminderForm
            reminder={editingReminder}
            onSubmit={handleSubmitReminder}
            onCancel={() => setShowForm(false)}
          />
        )}

        <ReminderList
          userId={user?._id || ''}
          onEdit={handleEditReminder}
        />
      </div>
    </Layout>
  );
}