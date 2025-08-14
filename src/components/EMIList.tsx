import { EMI } from '@/features/emis/emisSlice';

interface EMIListProps {
  emis: EMI[];
  loading: boolean;
  onEdit: (emi: EMI) => void;
  onDelete: (id: string) => void;
}

export default function EMIList({ emis, loading, onEdit, onDelete }: EMIListProps) {
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

  if (emis.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg p-6 text-center">
        <p className="text-gray-500">No EMIs found. Add your first EMI!</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <ul className="divide-y divide-gray-200">
        {emis.map((emi) => (
          <li key={emi._id}>
            <div className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-indigo-600 truncate">{emi.institution}</p>
                    <p className="mt-1 flex items-center text-sm text-gray-500">
                      <span>₹{emi.emiAmount.toFixed(2)} per month</span>
                      <span className="mx-2">•</span>
                      <span>Due on {emi.dueDayOfMonth}{getDaySuffix(emi.dueDayOfMonth)}</span>
                    </p>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      emi.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {emi.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
                <div className="ml-4 flex-shrink-0 flex space-x-2">
                  <button
                    onClick={() => onEdit(emi)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(emi._id)}
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

function getDaySuffix(day: number): string {
  if (day >= 11 && day <= 13) {
    return 'th';
  }
  switch (day % 10) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
}