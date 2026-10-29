import { useAuth } from '../../context/AuthContext';
import AdminSidebar from '../admin/AdminSidebar';
import FrontdeskSidebar from '../frontdesk/FrontdeskSidebar';
import EmployeeSidebar from '../employee/EmployeeSidebar';
import Navbar from './Navbar';

const DashboardLayout = ({ children, title, subtitle }) => {
  const { user } = useAuth();

  const renderSidebar = () => {
    if (user?.role === 'admin') return <AdminSidebar />;
    if (user?.role === 'frontdesk') return <FrontdeskSidebar />;
    if (user?.role === 'employee') return <EmployeeSidebar />;
    return null;
  };

  return (
    <div className="flex max-h-screen bg-blue-50">
      <div className="sticky top-0 h-screen">
        {renderSidebar()}
      </div>
      <div className="flex-1 p-6">
        <Navbar title={title} subtitle={subtitle} />
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;