import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard,
  FileText,
  Briefcase, 
  Calendar, 
  Users,
  User,
  LogOut,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const StudentSidebar = ({ isOpen, onClose }) => {
  const { logout } = useAuth();

  const navItems = [
    { title: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/student/dashboard' },
    { title: 'Drives', icon: <Briefcase size={20} />, path: '/student/drives' },
    { title: 'Resume Management', icon: <FileText size={20} />, path: '/student/resume' },
    { title: 'Interviews', icon: <Users size={20} />, path: '/student/interviews' },
    { title: 'Calendar', icon: <Calendar size={20} />, path: '/student/calendar' },
  ];

  return (
    <aside className={`
      fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out flex flex-col h-screen
      ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      md:relative md:translate-x-0 md:flex
    `}>
      <div className="p-6 pb-2 flex justify-between items-center">
        <h1 className="brand-logo font-display tracking-tight text-xl">
          PLACEMATE
        </h1>
        {/* Mobile Close Button */}
        <button 
          onClick={onClose} 
          className="p-2 md:hidden text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg"
        >
          <X size={24} />
        </button>
      </div>

      <nav className="flex-1 px-4 space-y-1 mt-6 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => {
              if (window.innerWidth < 768) onClose();
            }}
            className={({ isActive }) => `
              sidebar-link flex items-center gap-3 px-4 py-3 rounded-xl
              ${isActive ? 'active' : 'text-slate-500'}
            `}
          >
            {item.icon}
            <span>{item.title}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all w-full"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default StudentSidebar;
