'use client';

import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/lib/store';
import { fetchExpenses, addExpense, updateExpense, deleteExpense } from '@/features/expenses/expensesSlice';
import Layout from '@/components/Layout';
import ExpenseList from '@/components/ExpenseList';
import ExpenseForm from '@/components/ExpenseForm';
import { Expense } from '@/features/expenses/expensesSlice';

export default function ExpensesPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { expenses, loading } = useSelector((state: RootState) => state.expenses);
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  useEffect(() => {
    dispatch(fetchExpenses());
  }, [dispatch]);

  const handleAddExpense = () => {
    setEditingExpense(null);
    setShowForm(true);
  };

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
    setShowForm(true);
  };

  const handleDeleteExpense = (id: string) => {
    if (confirm('Are you sure you want to delete this expense?')) {
      dispatch(deleteExpense(id));
    }
  };

  const handleSubmitExpense = (expenseData: Omit<Expense, '_id'>) => {
    if (editingExpense) {
      dispatch(updateExpense({ id: editingExpense._id, ...expenseData }));
    } else {
      dispatch(addExpense(expenseData));
    }
    setShowForm(false);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Expenses</h1>
            <p className="mt-1 text-sm text-gray-600">Manage your expenses</p>
          </div>
          <button
            onClick={handleAddExpense}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            Add Expense
          </button>
        </div>

        {showForm && (
          <ExpenseForm
            expense={editingExpense}
            onSubmit={handleSubmitExpense}
            onCancel={() => setShowForm(false)}
          />
        )}

        <ExpenseList
          expenses={expenses}
          loading={loading}
          onEdit={handleEditExpense}
          onDelete={handleDeleteExpense}
        />
      </div>
    </Layout>
  );
}