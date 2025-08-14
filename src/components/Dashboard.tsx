'use client';

import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/lib/store';
import { fetchExpenses } from '@/features/expenses/expensesSlice';
import { fetchNotifications } from '@/features/notifications/notificationsSlice';
import ExpenseList from '@/components/ExpenseList';
import NotificationPanel from '@/components/NotificationPanel';
import SummaryCards from '@/components/SummaryCards';

export default function Dashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { expenses, loading } = useSelector((state: RootState) => state.expenses);

  useEffect(() => {
    if (user) {
      dispatch(fetchExpenses());
      dispatch(fetchNotifications());
    }
  }, [dispatch, user]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Expense Tracker Dashboard</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <SummaryCards expenses={expenses} />
          <ExpenseList expenses={expenses} />
        </div>
        
        <div>
          <NotificationPanel />
        </div>
      </div>
    </div>
  );
}