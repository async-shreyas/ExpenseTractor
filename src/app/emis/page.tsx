'use client';

import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/lib/store';
import { fetchEMIs, addEMI, updateEMI, deleteEMI } from '@/features/emis/emisSlice';
import Layout from '@/components/Layout';
import EMIList from '@/components/EMIList';
import EMIForm from '@/components/EMIForm';
import { EMI } from '@/features/emis/emisSlice';

export default function EMIsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { emis, loading } = useSelector((state: RootState) => state.emis);
  const [showForm, setShowForm] = useState(false);
  const [editingEMI, setEditingEMI] = useState<EMI | null>(null);

  useEffect(() => {
    dispatch(fetchEMIs());
  }, [dispatch]);

  const handleAddEMI = () => {
    setEditingEMI(null);
    setShowForm(true);
  };

  const handleEditEMI = (emi: EMI) => {
    setEditingEMI(emi);
    setShowForm(true);
  };

  const handleDeleteEMI = (id: string) => {
    if (confirm('Are you sure you want to delete this EMI?')) {
      dispatch(deleteEMI(id));
    }
  };

  const handleSubmitEMI = (emiData: Omit<EMI, '_id'>) => {
    if (editingEMI) {
      dispatch(updateEMI({ id: editingEMI._id, ...emiData }));
    } else {
      dispatch(addEMI(emiData));
    }
    setShowForm(false);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">EMIs</h1>
            <p className="mt-1 text-sm text-gray-600">Manage your EMIs</p>
          </div>
          <button
            onClick={handleAddEMI}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            Add EMI
          </button>
        </div>

        {showForm && (
          <EMIForm
            emi={editingEMI}
            onSubmit={handleSubmitEMI}
            onCancel={() => setShowForm(false)}
          />
        )}

        <EMIList
          emis={emis}
          loading={loading}
          onEdit={handleEditEMI}
          onDelete={handleDeleteEMI}
        />
      </div>
    </Layout>
  );
}