import { EMI } from '@/features/emis/emisSlice';

interface UpcomingEMIsProps {
  emis: EMI[];
  loading: boolean;
}

export default function UpcomingEMIs({ emis, loading }: UpcomingEMIsProps) {
  const today = new Date();
  const currentDay = today.getDate();
  
  const upcomingEMIs = emis
    .filter(emi => emi.active && emi.dueDayOfMonth >= currentDay)
    .sort((a, b) => a.dueDayOfMonth - b.dueDayOfMonth)
    .slice(0, 5);

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Upcoming EMIs</h3>
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
        ) : upcomingEMIs.length === 0 ? (
          <div className="px-4 py-5 sm:p-6 text-center">
            <p className="text-gray-500">No upcoming EMIs</p>
          </div>
        ) : (
          upcomingEMIs.map(emi => (
            <div key={emi._id} className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">{emi.institution}</p>
                  <p className="text-sm text-gray-500">Due on {emi.dueDayOfMonth}{getDaySuffix(emi.dueDayOfMonth)}</p>
                </div>
                <p className="text-sm font-medium text-gray-900">₹{emi.emiAmount.toFixed(2)}</p>
              </div>
            </div>
          ))
        )}
      </div>
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