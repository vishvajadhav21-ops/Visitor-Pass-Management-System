import { NavLink } from 'react-router-dom';

const SidebarLink = ({ to, icon, label }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
          isActive
            ? 'bg-blue-500/90 text-white'
            : 'text-blue-50 hover:bg-blue-500'
        }`
      }
    >
      {icon}
      {label}
    </NavLink>
  );
};

export default SidebarLink;