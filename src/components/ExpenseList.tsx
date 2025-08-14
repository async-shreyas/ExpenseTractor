import { Expense } from '@/features/expenses/expensesSlice';

interface ExpenseListProps {
  expenses: Expense[];
  loading: boolean;
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
}

export default function ExpenseList({ expenses, loading, onEdit, onDelete }: ExpenseListProps) {
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

  if (expenses.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg p-6 text-center">
        <p className="text-gray-500">No expenses found. Add your first expense!</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <ul className="divide-y divide-gray-200">
        {expenses.map((expense) => (
          <li key={expense._id}>
            <div className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-indigo-600 truncate">{expense.title}</p>
                    <p className="mt-1 flex items-center text-sm text-gray-500">
                      <span className="truncate">{expense.category}</span>
                      <span className="mx-2">•</span>
                      <span>{new Date(expense.date).toLocaleDateString()}</span>
                    </p>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <p className="text-sm font-medium text-gray-900">₹{expense.amount.toFixed(2)}</p>
                  </div>
                </div>
                <div className="ml-4 flex-shrink-0 flex space-x-2">
                  <button
                    onClick={() => onEdit(expense)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(expense._id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </div>
              </div>
              {expense.notes && (
                <p className="mt-2 text-sm text-gray-500">{expense.notes}</p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}