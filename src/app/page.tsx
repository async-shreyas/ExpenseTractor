'use client';

import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/lib/store';
import { fetchExpenses } from '@/features/expenses/expensesSlice';
import { fetchEMIs } from '@/features/emis/emisSlice';
import { fetchNotifications } from '@/features/notifications/notificationsSlice';
import Layout from '@/components/Layout';
import SummaryCards from '@/components/SummaryCards';
import RecentExpenses from '@/components/RecentExpenses';
import UpcomingEMIs from '@/components/UpcomingEmis';
import NotificationPanel from '@/components/NotificationPanel';

export default function Dashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { expenses, loading: expensesLoading } = useSelector((state: RootState) => state.expenses);
  const { emis, loading: emisLoading } = useSelector((state: RootState) => state.emis);
  const { notifications } = useSelector((state: RootState) => state.notifications);

  useEffect(() => {
    if (user) {
      dispatch(fetchExpenses());
      dispatch(fetchEMIs(true));
      dispatch(fetchNotifications());
    }
  }, [dispatch, user]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Welcome to ExpenseTracker</h1>
          <p className="mb-6">Please sign in to access your dashboard</p>
          <a href="/api/auth/signin" className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700">
            Sign In
          </a>
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-600">Welcome back, {user.name}!</p>
        </div>

        <SummaryCards expenses={expenses} emis={emis} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <RecentExpenses expenses={expenses} loading={expensesLoading} />
            <UpcomingEMIs emis={emis} loading={emisLoading} />
          </div>
          
          <div>
            <NotificationPanel notifications={notifications} />
          </div>
        </div>
      </div>
    </Layout>
  );
}