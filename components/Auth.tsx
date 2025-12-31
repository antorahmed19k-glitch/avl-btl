
'use client';

import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { db } from '../services/db';

// @google/genai: Made onLogin optional to support standalone login pages in Next.js
interface AuthProps {
  onLogin?: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.VIEWER);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (isRegistering) {
      const existing = db.users.findByUsername(username);
      if (existing) {
        setError('Username already registered in ledger.');
        return;
      }
      const newUser: User = { username, password, role };
      db.users.save(newUser);
      setSuccess('Account registered. Please authorize sign-in.');
      setIsRegistering(false);
      setPassword('');
    } else {
      const user = db.users.findByUsername(username);
      if (user && user.password === password) {
        const sessionUser = { username: user.username, role: user.role };
        // @google/genai: Trigger callback if present (SPA mode), otherwise persist and redirect (Page mode)
        if (onLogin) {
          onLogin(sessionUser);
        } else {
          db.users.setCurrentSession(sessionUser);
          window.location.href = '/';
        }
      } else {
        setError('Invalid corporate credentials.');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-6 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-900/10 rounded-full blur-[100px]"></div>
      
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-fadeIn relative z-10">
        <div className="bg-slate-900 p-8 text-center border-b border-slate-100">
          <div className="flex flex-col items-center gap-2">
             <div className="flex items-baseline gap-1">
               <span className="text-3xl font-black text-white tracking-tighter uppercase">Akij</span>
               <span className="text-3xl font-black text-emerald-500 tracking-tighter uppercase">Venture</span>
             </div>
             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em]">Project Ledger Pro</p>
          </div>
          <h2 className="text-xl font-bold text-white mt-6">
            {isRegistering ? 'Register ID' : 'Sign In'}
          </h2>
        </div>

        <form onSubmit={handleAuth} className="p-8 space-y-5">
          {error && <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs font-bold border border-red-100">{error}</div>}
          {success && <div className="bg-emerald-50 text-emerald-700 p-3 rounded-xl text-xs font-bold border border-emerald-100">{success}</div>}

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Username</label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                placeholder="Official ID"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Password</label>
              <input
                type="password"
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {isRegistering && (
              <div className="space-y-1 animate-fadeIn">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">System Role</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole(UserRole.VIEWER)}
                    className={`py-2 rounded-lg text-xs font-bold transition-all border ${role === UserRole.VIEWER ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-slate-50 text-slate-500 border-slate-200'}`}
                  >
                    Viewer
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole(UserRole.ADMIN)}
                    className={`py-2 rounded-lg text-xs font-bold transition-all border ${role === UserRole.ADMIN ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-500 border-slate-200'}`}
                  >
                    Admin
                  </button>
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-slate-950 text-white font-black uppercase tracking-widest py-4 rounded-xl shadow-lg hover:bg-slate-800 transition-all active:scale-[0.98]"
          >
            {isRegistering ? 'Register Credential' : 'Authorize Login'}
          </button>

          <button
            type="button"
            onClick={() => {
              setIsRegistering(!isRegistering);
              setError('');
              setSuccess('');
            }}
            className="w-full text-center text-xs font-bold text-slate-500 uppercase tracking-widest mt-2 hover:text-emerald-600 transition-colors"
          >
            {isRegistering ? 'Back to Login' : "Request New Account"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Auth;
