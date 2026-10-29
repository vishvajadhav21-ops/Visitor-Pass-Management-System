import SidebarLink from '../common/SidebarLink';

const icon = (path) => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d={path} />
  </svg>
);

const FrontdeskSidebar = () => {
  return (
    <div className="w-56 min-h-screen bg-blue-300 from-blue-500 to-blue-600 flex flex-col p-4">
      <div className="flex items-center gap-2 px-2 mb-6">
        <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
          {icon('M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z')}
        </div>
        <span className="text-white font-semibold text-sm">VPS Frontdesk</span>
      </div>

      <nav className="flex flex-col gap-1 flex-1">
        <SidebarLink to="/frontdesk/dashboard" icon={icon('M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z')} label="Dashboard" />
        <SidebarLink to="/frontdesk/register-visitor" icon={icon('M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z')} label="Register visitor" />
        <SidebarLink to="/frontdesk/appointments" icon={icon('M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z')} label="Appointments" />
        <SidebarLink to="/frontdesk/issue-pass" icon={icon('M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z')} label="Issue pass" />
        <SidebarLink to="/frontdesk/scan" icon={icon('M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z')} label="Check-in scan" />
      </nav>
    </div>
  );
};

export default FrontdeskSidebar;
