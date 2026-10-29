import SidebarLink from '../common/SidebarLink';

const icon = (path) => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d={path} />
  </svg>
);

const EmployeeSidebar = () => {
  return (
    <div className="w-56 min-h-screen bg-blue-300 from-blue-500 to-blue-600 flex flex-col p-4">
      <div className="flex items-center gap-2 px-2 mb-6">
        <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
          {icon('M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z')}
        </div>
        <span className="text-white font-semibold text-sm">VPS Employee</span>
      </div>

      <nav className="flex flex-col gap-1 flex-1">
        <SidebarLink to="/employee/dashboard" icon={icon('M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z')} label="Dashboard" />
        <SidebarLink to="/employee/appointments" icon={icon('M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z')} label="My appointments" />
      </nav>
    </div>
  );
};

export default EmployeeSidebar;