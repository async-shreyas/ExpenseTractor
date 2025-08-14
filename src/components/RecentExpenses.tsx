import { Expense } from '@/features/expenses/expensesSlice';

interface RecentExpensesProps {
  expenses: Expense[];
  loading: boolean;
}

export default function RecentExpenses({ expenses, loading }: RecentExpensesProps) {
  const recentExpenses = expenses.slice(0, 5);

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Expenses</h3>
      </div>
      
      <div className="divide-y divide-gray-200">
        {loading ? (
          <div className="p-4">
            <div className="animate-pulse space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        ) : recentExpenses.length === 0 ? (
          <div className="px-4 py-5 sm:p-6 text-center">
            <p className="text-gray-500">No recent expenses</p>
          </div>
        ) : (
          recentExpenses.map(expense => (
            <div key={expense._id} className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">{expense.title}</p>
                  <p className="text-sm text-gray-500">{expense.category}</p>
                </div>
                <p className="text-sm font-medium text-gray-900">₹{expense.amount.toFixed(2)}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}