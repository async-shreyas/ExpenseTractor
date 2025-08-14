import { useState } from 'react';
import { EMI } from '@/features/emis/emisSlice';

interface EMIFormProps {
  emi?: EMI | null;
  onSubmit: (emi: Omit<EMI, '_id'>) => void;
  onCancel: () => void;
}

export default function EMIForm({ emi, onSubmit, onCancel }: EMIFormProps) {
  const [formData, setFormData] = useState({
    institution: emi?.institution || '',
    principal: emi?.principal || 0,
    interestRate: emi?.interestRate || 0,
    emiAmount: emi?.emiAmount || 0,
    dueDayOfMonth: emi?.dueDayOfMonth || 1,
    startDate: emi?.startDate ? new Date(emi.startDate).toISOString().split('T')[0] : '',
    endDate: emi?.endDate ? new Date(emi.endDate).toISOString().split('T')[0] : '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'principal' || name === 'interestRate' || name === 'emiAmount' || name === 'dueDayOfMonth' 
        ? parseFloat(value) || 0 
        : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      active: true,
    });
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">
        {emi ? 'Edit EMI' : 'Add New EMI'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="institution" className="block text-sm font-medium text-gray-700">
            Institution
          </label>
          <input
            type="text"
            name="institution"
            id="institution"
            value={formData.institution}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="principal" className="block text-sm font-medium text-gray-700">
              Principal Amount (₹)
            </label>
            <input
              type="number"
              name="principal"
              id="principal"
              value={formData.principal}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="interestRate" className="block text-sm font-medium text-gray-700">
              Interest Rate (%)
            </label>
            <input
              type="number"
              name="interestRate"
              id="interestRate"
              value={formData.interestRate}
              onChange={handleChange}
              required
              min="0"
              step="0.1"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="emiAmount" className="block text-sm font-medium text-gray-700">
              EMI Amount (₹)
            </label>
            <input
              type="number"
              name="emiAmount"
              id="emiAmount"
              value={formData.emiAmount}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="dueDayOfMonth" className="block text-sm font-medium text-gray-700">
              Due Day of Month
            </label>
            <input
              type="number"
              name="dueDayOfMonth"
              id="dueDayOfMonth"
              value={formData.dueDayOfMonth}
              onChange={handleChange}
              required
              min="1"
              max="31"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
              Start Date
            </label>
            <input
              type="date"
              name="startDate"
              id="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
              End Date
            </label>
            <input
              type="date"
              name="endDate"
              id="endDate"
              value={formData.endDate}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700"
          >
            {emi ? 'Update' : 'Add'} EMI
          </button>
        </div>
      </form>
    </div>
  );
}