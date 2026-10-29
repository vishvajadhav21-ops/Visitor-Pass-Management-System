import { useState } from 'react';
import { approveAppointment, rejectAppointment, cancelAppointment } from '../../api/appointmentApi';

const AppointmentActions = ({ appointment, onUpdate }) => {
  const [loadingAction, setLoadingAction] = useState('');

  const handleApprove = async () => {
    setLoadingAction('approve');
    try {
      await approveAppointment(appointment._id);
      onUpdate?.();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to approve appointment');
    } finally {
      setLoadingAction('');
    }
  };

  const handleReject = async () => {
    const reason = prompt('Reason for rejection (optional):') || '';
    setLoadingAction('reject');
    try {
      await rejectAppointment(appointment._id, reason);
      onUpdate?.();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to reject appointment');
    } finally {
      setLoadingAction('');
    }
  };

  const handleCancel = async () => {
    if (!confirm('Cancel this appointment?')) return;
    setLoadingAction('cancel');
    try {
      await cancelAppointment(appointment._id);
      onUpdate?.();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel appointment');
    } finally {
      setLoadingAction('');
    }
  };

  if (appointment.status === 'pending') {
    return (
      <div className="flex gap-2">
        <button
          onClick={handleApprove}
          disabled={loadingAction === 'approve'}
          className="px-3 py-1.5 rounded-lg bg-green-100 hover:bg-green-200 text-green-700 text-xs font-semibold transition disabled:opacity-60"
        >
          {loadingAction === 'approve' ? '...' : 'Approve'}
        </button>
        <button
          onClick={handleReject}
          disabled={loadingAction === 'reject'}
          className="px-3 py-1.5 rounded-lg bg-red-100 hover:bg-red-200 text-red-700 text-xs font-semibold transition disabled:opacity-60"
        >
          {loadingAction === 'reject' ? '...' : 'Reject'}
        </button>
      </div>
    );
  }

  if (appointment.status === 'approved') {
    return (
      <button
        onClick={handleCancel}
        disabled={loadingAction === 'cancel'}
        className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold transition disabled:opacity-60"
      >
        {loadingAction === 'cancel' ? '...' : 'Cancel'}
      </button>
    );
  }

  return <span className="text-xs text-slate-400">No actions available</span>;
};

export default AppointmentActions;
