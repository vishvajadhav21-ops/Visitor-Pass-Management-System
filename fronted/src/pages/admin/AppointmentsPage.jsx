import { useState } from 'react';
import DashboardLayout from '../../components/common/DashboardLayout';
import AppointmentForm from '../../components/appointments/AppointmentForm';
import AppointmentList from '../../components/appointments/AppointmentList';

const AppointmentsPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleCreated = () => {
    setShowForm(false);
    setRefreshKey((k) => k + 1); // triggers AppointmentList to refetch
  };

  return (
    <DashboardLayout title="Appointments" subtitle="Create and manage visitor appointments.">
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition"
        >
          {showForm ? 'Hide form' : '+ New appointment'}
        </button>
      </div>

      {showForm && (
        <div className="mb-6">
          <AppointmentForm onSuccess={handleCreated} />
        </div>
      )}

      <AppointmentList showActions={true} refreshKey={refreshKey} />
    </DashboardLayout>
  );
};

export default AppointmentsPage;