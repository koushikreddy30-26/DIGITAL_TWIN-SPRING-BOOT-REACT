import React, { useState, useEffect } from 'react';
import api from '../api';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import { TrendingUp, BarChart3, Activity } from 'lucide-react';
import { SkeletonChart, ErrorCard } from '../components/SkeletonComponents';

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = async () => {
    setLoading(true); setError('');
    try {
      const response = await api.get('/data/dashboard');
      setData(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load analytics data.');
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  if (loading) return (
    <div className="space-y-6 animate-fade-in">
      <div className="h-7 bg-gray-200 rounded-full w-48 animate-pulse" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">{[...Array(3)].map((_, i) => <SkeletonChart key={i} />)}</div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">{[...Array(2)].map((_, i) => <SkeletonChart key={i} />)}</div>
    </div>
  );

  if (error) return <ErrorCard message={error} onRetry={fetchData} />;

  const { performances, activities } = data || {};

  // Study hours over time
  const studyData = activities?.map((a, i) => ({
    day: `Day ${i + 1}`,
    hours: a.studyHours,
    sleep: a.sleepHours,
    focus: a.focusLevel,
  })) || [];

  // Subject marks (bar chart)
  const subjectData = performances?.reduce((acc, p) => {
    const existing = acc.find(x => x.subject === p.subject);
    if (existing) {
      existing.marks = Math.max(existing.marks, p.marks);
    } else {
      acc.push({ subject: p.subject, marks: p.marks });
    }
    return acc;
  }, []) || [];

  // Marks trend (line chart)
  const marksTrend = performances?.map((p, i) => ({
    entry: i + 1,
    marks: p.marks,
    subject: p.subject,
  })) || [];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Detailed Analysis</h1>
        <p className="text-gray-400 text-sm mt-1">Deep dive into your academic and behavioral data</p>
      </div>

      {/* 3-Column Chart Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Study Hours Timeline */}
        <div className="stat-card !p-6">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
              <Activity size={16} className="text-blue-500" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">Study Hours</h3>
              <p className="text-[11px] text-gray-400">Over time</p>
            </div>
          </div>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={studyData}>
                <defs>
                  <linearGradient id="studyAreaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 10, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.06)', fontSize: 12 }} />
                <Area type="monotone" dataKey="hours" stroke="#3b82f6" strokeWidth={2} fill="url(#studyAreaGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Marks Trend */}
        <div className="stat-card !p-6">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
              <TrendingUp size={16} className="text-purple-500" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">Marks Trend</h3>
              <p className="text-[11px] text-gray-400">Performance over entries</p>
            </div>
          </div>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={marksTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="entry" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 10, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.06)', fontSize: 12 }} />
                <Line type="monotone" dataKey="marks" stroke="#a855f7" strokeWidth={3} dot={{ r: 4, fill: '#a855f7' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Subject Performance Bar */}
        <div className="stat-card !p-6">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
              <BarChart3 size={16} className="text-emerald-500" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">Subject Performance</h3>
              <p className="text-[11px] text-gray-400">Best marks per subject</p>
            </div>
          </div>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="subject" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 10, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.06)', fontSize: 12 }} />
                <Bar dataKey="marks" fill="#10b981" radius={[8, 8, 0, 0]} barSize={36} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Full-width: Sleep & Focus */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="stat-card !p-6">
          <h3 className="font-semibold text-gray-900 text-sm mb-4">Sleep Hours Timeline</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={studyData}>
                <defs>
                  <linearGradient id="sleepGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 10, border: 'none', fontSize: 12 }} />
                <Area type="monotone" dataKey="sleep" stroke="#8b5cf6" strokeWidth={2} fill="url(#sleepGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="stat-card !p-6">
          <h3 className="font-semibold text-gray-900 text-sm mb-4">Focus Level Timeline</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={studyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 10]} tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 10, border: 'none', fontSize: 12 }} />
                <Bar dataKey="focus" fill="#f59e0b" radius={[6, 6, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
