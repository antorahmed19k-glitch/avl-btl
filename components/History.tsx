
'use client';

import React, { useMemo } from 'react';
import { Project } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

interface HistoryProps {
  projects: Project[];
}

const History: React.FC<HistoryProps> = ({ projects }) => {
  const analytics = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const counts = {
      total: projects.length,
      ongoing: projects.filter(p => new Date(p.startDate) <= today && new Date(p.endDate) >= today).length,
      pending: projects.filter(p => new Date(p.startDate) > today).length,
      completed: projects.filter(p => new Date(p.endDate) < today).length,
    };

    // Monthly aggregation
    const monthlyMap: Record<string, number> = {};
    projects.forEach(p => {
      const monthYear = new Date(p.createdAt).toLocaleString('en-GB', { month: 'short', year: '2-digit' });
      monthlyMap[monthYear] = (monthlyMap[monthYear] || 0) + 1;
    });

    const monthlyData = Object.entries(monthlyMap).map(([name, count]) => ({ name, count }));

    // Yearly aggregation
    const yearlyMap: Record<string, number> = {};
    projects.forEach(p => {
      const year = new Date(p.createdAt).getFullYear().toString();
      yearlyMap[year] = (yearlyMap[year] || 0) + 1;
    });

    const yearlyData = Object.entries(yearlyMap).map(([name, count]) => ({ name, count }));

    return { counts, monthlyData, yearlyData };
  }, [projects]);

  const cards = [
    { label: 'Ongoing Projects', value: analytics.counts.ongoing, icon: 'fa-spinner', color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Pending Projects', value: analytics.counts.pending, icon: 'fa-clock', color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Completed Projects', value: analytics.counts.completed, icon: 'fa-check-circle', color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Total Volume', value: analytics.counts.total, icon: 'fa-database', color: 'text-slate-600', bg: 'bg-slate-50' },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      <header>
        <h2 className="text-3xl font-bold text-slate-900">History & Analytics</h2>
        <p className="text-slate-500">Long-term tracking of project cycles and volume metrics.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex justify-between items-start">
              <div className={`${card.bg} ${card.color} w-10 h-10 rounded-lg flex items-center justify-center`}>
                <i className={`fas ${card.icon}`}></i>
              </div>
            </div>
            <p className="text-slate-500 text-sm mt-4 font-medium">{card.label}</p>
            <h3 className="text-3xl font-bold text-slate-900 mt-1">{card.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">Total Projects per Month</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics.monthlyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Line type="monotone" dataKey="count" stroke="#2563eb" strokeWidth={3} dot={{ r: 4, fill: '#2563eb' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">Total Projects per Year</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.yearlyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="count" fill="#9333ea" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default History;
