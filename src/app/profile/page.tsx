'use client';

import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import Layout from '@/components/Layout';
import { useSession } from 'next-auth/react';

export default function ProfilePage() {
  const { user } = useSelector((state: RootState) => state.auth);
  const { data: session } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currency: user?.preferences?.currency || 'INR',
    emailNotifications: user?.preferences?.notifications?.email || true,
    pushNotifications: user?.preferences?.notifications?.push || true,
    inAppNotifications: user?.preferences?.notifications?.inApp || true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // API call to update profile
    console.log('Updating profile:', formData);
    setIsEditing(false);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
          <p className="mt-1 text-sm text-gray-600">Manage your account settings</p>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Currency</label>
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="INR">Indian Rupee (₹)</option>
                  <option value="USD">US Dollar ($)</option>
                  <option value="EUR">Euro (€)</option>
                  <option value="GBP">British Pound (£)</option>
                </select>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Notification Preferences</h3>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="emailNotifications"
                    checked={formData.emailNotifications}
                    onChange={handleChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-900">Email notifications</label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="pushNotifications"
                    checked={formData.pushNotifications}
                    onChange={handleChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-900">Push notifications</label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="inAppNotifications"
                    checked={formData.inAppNotifications}
                    onChange={handleChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-900">In-app notifications</label>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Account Information</h3>
                <dl className="mt-2 divide-y divide-gray-200">
                  <div className="py-3 flex justify-between text-sm font-medium">
                    <dt className="text-gray-500">Full name</dt>
                    <dd className="text-gray-900">{user?.name}</dd>
                  </div>
                  <div className="py-3 flex justify-between text-sm font-medium">
                    <dt className="text-gray-500">Email address</dt>
                    <dd className="text-gray-900">{user?.email}</dd>
                  </div>
                  <div className="py-3 flex justify-between text-sm font-medium">
                    <dt className="text-gray-500">Currency</dt>
                    <dd className="text-gray-900">{user?.preferences?.currency || 'INR'}</dd>
                  </div>
                </dl>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900">Notification Preferences</h3>
                <dl className="mt-2 divide-y divide-gray-200">
                  <div className="py-3 flex justify-between text-sm font-medium">
                    <dt className="text-gray-500">Email notifications</dt>
                    <dd className="text-gray-900">
                      {user?.preferences?.notifications?.email ? 'Enabled' : 'Disabled'}
                    </dd>
                  </div>
                  <div className="py-3 flex justify-between text-sm font-medium">
                    <dt className="text-gray-500">Push notifications</dt>
                    <dd className="text-gray-900">
                      {user?.preferences?.notifications?.push ? 'Enabled' : 'Disabled'}
                    </dd>
                  </div>
                  <div className="py-3 flex justify-between text-sm font-medium">
                    <dt className="text-gray-500">In-app notifications</dt>
                    <dd className="text-gray-900">
                      {user?.preferences?.notifications?.inApp ? 'Enabled' : 'Disabled'}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700"
                >
                  Edit Profile
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}