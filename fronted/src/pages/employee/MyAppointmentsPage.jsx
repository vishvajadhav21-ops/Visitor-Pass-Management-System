import DashboardLayout from '../../components/common/DashboardLayout';
import AppointmentList from '../../components/appointments/AppointmentList';
import { useAuth } from '../../context/AuthContext';

const MyAppointmentsPage = () => {
  const { user } = useAuth();

  return (
    <DashboardLayout title="My appointments" subtitle="Review and respond to visitor requests.">
      <AppointmentList showActions={true} extraParams={{ host: user.id }} />
    </DashboardLayout>
  );
};

export default MyAppointmentsPage;