import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Bell, Search, Check, Clock, Mail, ChevronDown, User, LogOut, Sun, Moon, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';

const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      const res = await axios.get('/api/notifications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(res.data.data);
      setUnreadCount(res.data.data.filter(n => !n.isRead).length);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };

  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/notifications/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchNotifications();
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const markAllRead = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put('/api/notifications/read-all', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchNotifications();
    } catch (err) {
      console.error('Error marking all as read:', err);
    }
  };

  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  return (
    <header className="h-16 md:h-20 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        {/* Mobile Menu Button */}
        <button 
          onClick={onMenuClick}
          className="p-2 -ml-2 md:hidden text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-lg"
        >
          <Menu size={24} />
        </button>

        {/* Search Bar - Hidden on mobile */}
        <div className="relative w-72 lg:w-96 hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search for students, companies..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
          />
        </div>
      </div>

      <div className="flex items-center bg-white rounded-full px-2 py-1.5 shadow-sm border border-slate-200">
        
        {/* Theme Toggle Button */}
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all mr-1"
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* Bell Icon with existing Notifications Logic */}
        <div className="relative">
          <button 
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileDropdown(false);
            }}
            className={`relative p-2 rounded-full transition-all ${showNotifications ? 'bg-slate-100 text-slate-800' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 border-2 border-white rounded-full box-content"></span>
            )}
          </button>

          {showNotifications && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)}></div>
              <div className="absolute right-[-40px] md:right-0 mt-4 w-[calc(100vw-32px)] sm:w-80 bg-white rounded-2xl shadow-premium border border-slate-100 z-50 overflow-hidden transform origin-top-right">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                  <h3 className="font-bold text-slate-900">Notifications</h3>
                  {unreadCount > 0 && (
                    <button 
                      onClick={markAllRead}
                      className="text-xs text-primary font-semibold hover:underline"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((notif) => (
                      <div 
                        key={notif._id} 
                        className={`p-4 border-b border-slate-50 last:border-0 hover:bg-slate-50/80 transition-all group ${!notif.isRead ? 'bg-primary/[0.02]' : ''}`}
                      >
                        <div className="flex justify-between items-start gap-3">
                          <div className="flex-1">
                            <p className={`text-sm ${!notif.isRead ? 'font-bold text-slate-900' : 'text-slate-600'}`}>
                              {notif.title}
                            </p>
                            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                              {notif.message}
                            </p>
                            <div className="flex items-center gap-1.5 mt-2 text-[10px] text-slate-400">
                              <Clock size={10} />
                              {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                          {!notif.isRead && (
                            <button 
                              onClick={() => markAsRead(notif._id)}
                              className="p-1 text-slate-300 hover:text-emerald-500 hover:bg-emerald-50 rounded-lg transition-all"
                              title="Mark as read"
                            >
                              <Check size={14} />
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-slate-400">
                      <Bell size={32} className="mx-auto mb-3 opacity-20" />
                      <p className="text-sm">No notifications yet</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="w-[1px] h-5 bg-slate-200 mx-1"></div>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button 
            onClick={() => {
              setShowProfileDropdown(!showProfileDropdown);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 pl-1.5 pr-3 py-1 rounded-full hover:bg-slate-50 transition-all"
          >
            {user?.profileImageURL ? (
              <img src={user.profileImageURL} alt="Profile" className="w-8 h-8 rounded-full object-cover" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-purple-800 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                {user?.name?.[0] || 'A'}
              </div>
            )}
            <ChevronDown size={16} className={`text-slate-400 transition-transform ${showProfileDropdown ? 'rotate-180' : ''}`} />
          </button>
          
          {/* Dropdown Menu */}
          {showProfileDropdown && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowProfileDropdown(false)}></div>
              <div className="absolute right-0 mt-3 w-56 bg-white border border-slate-100 rounded-2xl shadow-premium z-50 transform origin-top-right overflow-hidden">
            <div className="p-4 border-b border-slate-100">
              <p className="text-sm font-bold text-slate-900 truncate">{user?.name || 'Admin'}</p>
              <p className="text-xs text-slate-500 truncate capitalize">{user?.role || 'Administrator'}</p>
            </div>
            <div className="p-2">
              <RouterLink 
                to={user?.role === 'admin' ? "/admin/dashboard" : "/student/profile"}
                className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:text-primary hover:bg-slate-50 rounded-lg transition-colors"
              >
                <User size={16} />
                <span>My Profile</span>
              </RouterLink>
            </div>
          </div>
        </>
      )}
    </div>
      </div>
    </header>
  );
};

export default Navbar;
