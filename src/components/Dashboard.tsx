'use client';

import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/lib/store';
import { deleteExpense, fetchExpenses, updateExpense } from '@/features/expenses/expensesSlice';
import { fetchNotifications } from '@/features/notifications/notificationsSlice';
import ExpenseList from '@/components/ExpenseList';
import NotificationPanel from '@/components/NotificationPanel';
import SummaryCards from '@/components/SummaryCards';

export default function Dashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { expenses, loading } = useSelector((state: RootState) => state.expenses);
  const { emis } = useSelector((state: RootState) => state.emis);
  const { notifications } = useSelector((state: RootState) => state.notifications);

  useEffect(() => {
    if (user) {
      dispatch(fetchExpenses({ period: undefined, limit: 10 }));
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
          <SummaryCards expenses={expenses} emis={emis} />
          <ExpenseList expenses={expenses} loading={loading} onDelete={id => dispatch(deleteExpense(id))} onEdit={expense => dispatch(updateExpense({ id: expense._id, ...expense }))} />
        </div>
        
        <div>
          <NotificationPanel notifications={notifications} />
        </div>
      </div>
    </div>
  );
}