
'use client';

import React from 'react';
import { UserRole, ViewType, User } from '../types';

// @google/genai: Made navigation props optional to support rendering in standalone Next.js pages
interface SidebarProps {
  user: User;
  currentView?: ViewType;
  setView?: (view: ViewType) => void;
  onLogout?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ user, currentView, setView, onLogout }) => {
  const isAdmin = user.role === UserRole.ADMIN;

  const menuItems = [
    { view: ViewType.DASHBOARD, label: 'Dashboard', icon: 'fa-chart-pie', visible: true },
    { view: ViewType.NEW_PROJECT, label: 'New Project Entry', icon: 'fa-plus-circle', visible: isAdmin },
    { view: ViewType.UPCOMING, label: 'Upcoming Projects', icon: 'fa-calendar-alt', visible: true },
    { view: ViewType.COMPLETED, label: 'Completed Projects', icon: 'fa-check-double', visible: true },
    { view: ViewType.HISTORY, label: 'History', icon: 'fa-history', visible: true },
  ];

  return (
    <aside className="w-64 bg-slate-950 text-white flex flex-col hidden md:flex sticky top-0 h-screen print:hidden shadow-2xl">
      <div className="p-6 border-b border-slate-800/50">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-baseline gap-1">
             <span className="text-2xl font-black text-white tracking-tighter uppercase">Akij</span>
             <span className="text-2xl font-black text-emerald-500 tracking-tighter uppercase">Venture</span>
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-[0.2em] leading-tight">Ltd.</p>
          <p className="text-[8px] text-slate-400 font-medium italic tracking-widest border-t border-slate-800 pt-1 mt-1 uppercase">
            Success here & hereafter
          </p>
        </div>
      </div>
      
      <div className="px-6 py-4 bg-slate-900/50 border-b border-slate-900">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center font-bold text-xs uppercase">
            {user.username.charAt(0)}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-bold truncate text-white">{user.username}</p>
            <p className={`text-[9px] font-black uppercase tracking-widest ${isAdmin ? 'text-emerald-400' : 'text-slate-500'}`}>
              {user.role}
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 mt-6 px-3 space-y-1">
        <p className="px-4 text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Navigation</p>
        {menuItems.filter(i => i.visible).map((item) => (
          <button
            key={item.view}
            onClick={() => setView?.(item.view)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-semibold ${
              currentView === item.view 
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20' 
                : 'text-slate-400 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <i className={`fas ${item.icon} w-5 ${currentView === item.view ? 'text-white' : 'text-emerald-500/70'}`}></i>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4 space-y-3">
        <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Status</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-xs font-bold text-slate-300">Auditor Secure</span>
          </div>
        </div>
        
        <button 
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black uppercase tracking-widest bg-slate-900 hover:bg-red-950 text-slate-400 hover:text-red-400 border border-slate-800 transition-all active:scale-[0.98]"
        >
          <i className="fas fa-sign-out-alt"></i>
          Logout Session
        </button>
      </div>

      <div className="p-6 text-[9px] text-slate-600 border-t border-slate-900 uppercase font-bold tracking-widest">
        &copy; 2024 Akij Venture Ltd.
      </div>
    </aside>
  );
};

export default Sidebar;
