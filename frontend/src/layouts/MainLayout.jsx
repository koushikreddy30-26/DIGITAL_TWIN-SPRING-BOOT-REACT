import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, BarChart3, Brain, LogOut, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const MainLayout = ({ children }) => {
  const { logout, user } = useAuth();
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Add Data', path: '/add-data', icon: PlusCircle },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Prediction', path: '/prediction', icon: Brain },
  ];

  return (
    <div className="flex h-screen bg-[#f1f5f9] overflow-hidden">
      {/* Sidebar */}
      <div className="w-[260px] bg-white flex flex-col sidebar-shadow">
        {/* Logo */}
        <div className="p-6 pb-2">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Brain className="text-white" size={20} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Digital Twin</h1>
              <p className="text-[10px] text-gray-400 font-medium -mt-0.5">Student Analytics</p>
            </div>
          </div>
        </div>

        {/* User Card */}
        <div className="px-5 py-4">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-4 text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-lg font-bold">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div>
                <p className="font-semibold text-sm">{user?.name || 'Student'}</p>
                <p className="text-white/70 text-xs">Active Profile</p>
              </div>
            </div>
          </div>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <item.icon size={18} className={isActive ? 'text-indigo-500' : ''} />
                <span>{item.name}</span>
                {isActive && <ChevronRight size={14} className="ml-auto text-indigo-400" />}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4">
          <button
            onClick={logout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all cursor-pointer"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto custom-scrollbar">
        <main className="p-8 max-w-[1400px] mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
