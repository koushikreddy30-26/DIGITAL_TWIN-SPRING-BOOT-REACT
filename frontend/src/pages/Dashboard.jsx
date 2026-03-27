import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, Radar
} from 'recharts';
import { BookOpen, Clock, TrendingUp, Brain, ArrowUpRight, Sparkles, Target, MessageCircle, Send, X, Bot, Download, AlertCircle } from 'lucide-react';
import { SkeletonCard, SkeletonChart, SkeletonTable, ErrorCard } from '../components/SkeletonComponents';
import { generateReport } from '../utils/generateReport';

// ── AI Chatbot ──
const Chatbot = ({ data }) => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([{ from: 'bot', text: "Hi! I'm your Digital Twin AI 🤖 Ask me anything about your performance!" }]);
  const [input, setInput] = useState('');

  const generateReply = (q) => {
    const l = q.toLowerCase();
    const pred = data?.latestPrediction;
    const perfs = data?.performances || [];
    const acts = data?.activities || [];
    const avgMarks = perfs.length ? (perfs.reduce((s, p) => s + p.marks, 0) / perfs.length).toFixed(1) : '0';
    const avgStudy = acts.length ? (acts.reduce((s, a) => s + a.studyHours, 0) / acts.length).toFixed(1) : '0';
    const avgAtt = acts.length ? (acts.reduce((s, a) => s + a.attendance, 0) / acts.length).toFixed(1) : '0';
    const avgSleep = acts.length ? (acts.reduce((s, a) => s + a.sleepHours, 0) / acts.length).toFixed(1) : '0';

    if (l.includes('score') || l.includes('predict')) return `Your predicted score is ${pred?.predictedScore?.toFixed(1) || 'N/A'}% with ${pred?.riskLevel?.replace('_', ' ') || 'Unknown'} status. This is calculated live using Linear Regression on your study habits.`;
    if (l.includes('improve') || l.includes('better')) return `To improve: 1) Increase study hours (avg: ${avgStudy}hrs → target 6+) 2) Keep attendance above 90% (yours: ${avgAtt}%) 3) Focus on weak subjects. Consistency is key!`;
    if (l.includes('weak') || l.includes('subject')) { const weak = [...new Set(perfs.filter(p => p.marks < 70).map(p => p.subject))]; return weak.length ? `Weak subjects detected: ${weak.join(', ')}. These are below 70%. Allocate extra revision time.` : 'No weak subjects! All marks are above 70%. Keep it up! 🎉'; }
    if (l.includes('study') || l.includes('hours')) return `Average study time: ${avgStudy} hrs/day. Top students study 6-8 hours. Increase gradually — even 30 mins more daily adds up!`;
    if (l.includes('attendance')) return `Your attendance: ${avgAtt}%. ${parseFloat(avgAtt) < 75 ? '⚠️ Below 75% — high academic risk! Attend all sessions immediately.' : parseFloat(avgAtt) < 90 ? 'Good! But aim for 90%+ for best results.' : '✅ Excellent attendance!'}`;
    if (l.includes('sleep')) return `Average sleep: ${avgSleep} hrs. ${parseFloat(avgSleep) < 6 ? '⚠️ Sleep deprivation reduces memory retention by 40%. Aim for 7-8 hours.' : '✅ Good sleep pattern!'}`;
    if (l.includes('hello') || l.includes('hi')) return `Hello! 👋 I can answer: score, how to improve, weak subjects, study hours, attendance, sleep. What would you like to know?`;
    if (l.includes('pdf') || l.includes('report') || l.includes('download')) return `Click the "Download Report" button at the top of the page to get a full PDF with your score, charts, comparison stats, and AI recommendations!`;
    return `I can help with: "What's my score?", "How to improve?", "Weak subjects?", "Study hours?", "Attendance?", "Sleep?" — try one!`;
  };

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages(p => [...p, { from: 'user', text: input }, { from: 'bot', text: generateReply(input) }]);
    setInput('');
  };

  return (
    <>
      <button onClick={() => setOpen(!open)} className="fixed bottom-6 right-6 w-14 h-14 rounded-full btn-gradient shadow-2xl flex items-center justify-center z-50 hover:scale-110 transition-transform cursor-pointer">
        {open ? <X size={22} className="text-white" /> : <MessageCircle size={22} className="text-white" />}
      </button>
      {open && (
        <div className="fixed bottom-24 right-6 w-[340px] sm:w-[380px] bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden animate-fade-in">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 flex items-center gap-3">
            <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center"><Bot size={18} className="text-white" /></div>
            <div><p className="text-white font-semibold text-sm">AI Assistant</p><p className="text-white/70 text-xs">Powered by Digital Twin ML</p></div>
          </div>
          <div className="h-64 sm:h-[280px] overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[88%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${m.from === 'user' ? 'bg-indigo-500 text-white rounded-br-md' : 'bg-gray-100 text-gray-700 rounded-bl-md'}`}>{m.text}</div>
              </div>
            ))}
          </div>
          <div className="p-3 border-t border-gray-100 flex gap-2">
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} placeholder="Ask me anything..." className="flex-1 px-4 py-2.5 rounded-xl bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 border border-gray-200" />
            <button onClick={handleSend} className="w-10 h-10 btn-gradient rounded-xl flex items-center justify-center cursor-pointer"><Send size={16} className="text-white" /></button>
          </div>
        </div>
      )}
    </>
  );
};

// ── Dashboard ──
const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pdfLoading, setPdfLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true); setError('');
    try {
      const res = await api.get('/data/dashboard');
      setData(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to connect to backend. Make sure the server is running on port 8081.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleDownloadReport = async () => {
    setPdfLoading(true);
    try { generateReport(data); } catch (e) { console.error(e); }
    finally { setPdfLoading(false); }
  };

  if (loading) return (
    <div className="space-y-6 animate-fade-in">
      <div className="h-8 bg-gray-200 rounded-full w-64 animate-pulse" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">{[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}</div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6"><SkeletonChart /><SkeletonChart /></div>
      <SkeletonTable />
    </div>
  );

  if (error) return <ErrorCard message={error} onRetry={fetchData} />;

  const { latestPrediction, recommendations, performances, activities, comparison, goalTracker } = data || {};

  const avgMarks = performances?.length ? (performances.reduce((s, p) => s + p.marks, 0) / performances.length).toFixed(1) : '0';
  const totalStudyHours = activities?.length ? activities.reduce((s, a) => s + a.studyHours, 0).toFixed(1) : '0';
  const avgAttendance = activities?.length ? (activities.reduce((s, a) => s + a.attendance, 0) / activities.length).toFixed(1) : '0';
  const predictedScore = latestPrediction?.predictedScore?.toFixed(1) || '—';
  const riskLevel = latestPrediction?.riskLevel;

  const riskBg = { LOW_RISK: 'bg-emerald-50', MEDIUM_RISK: 'bg-amber-50', HIGH_RISK: 'bg-red-50' };
  const riskText = { LOW_RISK: 'text-emerald-600', MEDIUM_RISK: 'text-amber-600', HIGH_RISK: 'text-red-600' };
  const riskLabels = { LOW_RISK: '🟢 Low Risk', MEDIUM_RISK: '🟡 Medium Risk', HIGH_RISK: '🔴 High Risk' };

  const statCards = [
    { label: 'Study Hours', value: totalStudyHours, suffix: 'hrs', icon: Clock, bg: 'bg-blue-50', text: 'text-blue-600' },
    { label: 'Attendance', value: avgAttendance, suffix: '%', icon: TrendingUp, bg: 'bg-emerald-50', text: 'text-emerald-600' },
    { label: 'Avg Marks', value: avgMarks, suffix: '%', icon: BookOpen, bg: 'bg-purple-50', text: 'text-purple-600' },
    { label: 'Predicted Score', value: predictedScore, suffix: '%', icon: Brain, bg: 'bg-orange-50', text: 'text-orange-600', risk: riskLevel },
  ];

  const areaData = activities?.slice(-10).map((a, i) => ({ day: `D${i + 1}`, hours: parseFloat(a.studyHours?.toFixed(1) || 0) })) || [];
  const radarData = performances?.reduce((acc, p) => { const ex = acc.find(x => x.subject === p.subject); if (ex) { ex.marks = Math.max(ex.marks, p.marks); } else { acc.push({ subject: p.subject, marks: p.marks }); } return acc; }, []) || [];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Welcome, {data?.user?.name || 'Student'} 👋</h1>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            <p className="text-gray-400 text-sm">Your digital twin insights</p>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Data
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-500 bg-indigo-50 px-2.5 py-0.5 rounded-full">🧠 ML Powered</span>
          </div>
        </div>
        <div className="flex gap-3 flex-wrap">
          <button onClick={handleDownloadReport} disabled={pdfLoading} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-gray-700 border border-gray-200 text-sm font-semibold hover:bg-gray-50 hover:shadow-sm transition-all cursor-pointer disabled:opacity-50">
            <Download size={16} className="text-indigo-500" />
            {pdfLoading ? 'Generating...' : 'Download Report'}
          </button>
          <Link to="/add-data" className="btn-gradient px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 no-underline">
            <Sparkles size={16} /> Add Data
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <div key={i} className="stat-card flex flex-col gap-3 group">
            <div className="flex items-center justify-between">
              <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center`}><card.icon size={20} className={card.text} /></div>
              <ArrowUpRight size={14} className="text-gray-200 group-hover:text-indigo-400 transition-colors" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">{card.label}</p>
              <p className="text-2xl font-bold text-gray-900">{card.value}<span className="text-sm text-gray-400 font-normal ml-1">{card.suffix}</span></p>
            </div>
            {card.risk && (
              <span className={`text-xs font-semibold px-3 py-1 rounded-full w-fit ${riskBg[card.risk]} ${riskText[card.risk]}`}>{riskLabels[card.risk]}</span>
            )}
          </div>
        ))}
      </div>

      {/* Goal Tracker */}
      {goalTracker && (
        <div className="stat-card !p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2"><Target size={16} className="text-indigo-500" /><h3 className="font-semibold text-gray-900 text-sm">🎯 Goal Tracker</h3></div>
            <span className="text-xs text-gray-400">Target: {goalTracker.target}%</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-1000" style={{ width: `${Math.min(100, goalTracker.progress || 0)}%` }} />
            </div>
            <span className="text-sm font-bold text-gray-700 shrink-0">{goalTracker.current?.toFixed(1)}%</span>
          </div>
          <p className="text-xs text-gray-400 mt-2">{goalTracker.current >= goalTracker.target ? '🎉 Goal achieved!' : `${(goalTracker.target - goalTracker.current).toFixed(1)}% more to reach your goal`}</p>
        </div>
      )}

      {/* Charts Row + Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="stat-card !p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 text-sm">Study Trends</h3>
            <span className="text-[10px] font-bold text-indigo-500 bg-indigo-50 px-2.5 py-0.5 rounded-full">LIVE</span>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={areaData}>
                <defs><linearGradient id="sg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#667eea" stopOpacity={0.25}/><stop offset="95%" stopColor="#667eea" stopOpacity={0}/></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f8fafc"/>
                <XAxis dataKey="day" tick={{fontSize:10,fill:'#9ca3af'}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fontSize:10,fill:'#9ca3af'}} axisLine={false} tickLine={false}/>
                <Tooltip contentStyle={{borderRadius:10,border:'none',boxShadow:'0 4px 20px rgba(0,0,0,0.08)',fontSize:12}} formatter={(v) => [`${v} hrs`, 'Study']}/>
                <Area type="monotone" dataKey="hours" stroke="#667eea" strokeWidth={2.5} fillOpacity={1} fill="url(#sg)"/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="stat-card !p-6">
          <h3 className="font-semibold text-gray-900 text-sm mb-4">Subject Radar</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                <PolarGrid stroke="#e5e7eb"/>
                <PolarAngleAxis dataKey="subject" tick={{fontSize:10,fill:'#6b7280'}}/>
                <Radar dataKey="marks" stroke="#764ba2" fill="#764ba2" fillOpacity={0.2} strokeWidth={2}/>
                <Tooltip contentStyle={{borderRadius:10,border:'none',fontSize:12}}/>
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {comparison && (
          <div className="stat-card !p-6">
            <h3 className="font-semibold text-gray-900 text-sm mb-5">📊 You vs Top Students</h3>
            <div className="space-y-5">
              {[
                { label: 'Avg Marks', yours: comparison.yourMarks, top: comparison.topMarks, unit: '%' },
                { label: 'Study Hrs/Day', yours: comparison.yourStudyHours, top: comparison.topStudyHours, unit: 'h' },
                { label: 'Attendance', yours: comparison.yourAttendance, top: comparison.topAttendance, unit: '%' },
              ].map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-gray-500 font-medium">{item.label}</span>
                    <span className="text-indigo-600 font-semibold">{item.yours}{item.unit} <span className="text-gray-300">vs</span> <span className="text-gray-400">{item.top}{item.unit}</span></span>
                  </div>
                  <div className="flex gap-1 h-2.5">
                    <div className="bg-indigo-500 rounded-full transition-all duration-700" style={{ width: `${(item.yours / Math.max(item.top, item.yours, 1)) * 100}%` }} />
                    <div className="flex-1 bg-gray-100 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Activity History Table */}
      {activities?.length > 0 && (
        <div className="stat-card !p-6 overflow-x-auto">
          <h3 className="font-semibold text-gray-900 text-sm mb-4">📅 Recent Activity History</h3>
          <table className="w-full text-sm min-w-[500px]">
            <thead>
              <tr className="text-left text-xs text-gray-400 border-b border-gray-100">
                {['Date', 'Study Hrs', 'Sleep Hrs', 'Attendance', 'Focus'].map(h => <th key={h} className="pb-3 font-semibold">{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {activities.slice(-7).reverse().map((a, i) => (
                <tr key={i} className="border-b border-gray-50 hover:bg-indigo-50/30 transition-colors">
                  <td className="py-2.5 font-medium text-gray-700">{a.date}</td>
                  <td className="py-2.5 text-gray-600">{a.studyHours?.toFixed(1)}h</td>
                  <td className="py-2.5 text-gray-600">{a.sleepHours?.toFixed(1)}h</td>
                  <td className="py-2.5">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${a.attendance >= 90 ? 'bg-emerald-50 text-emerald-600' : a.attendance >= 75 ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'}`}>{a.attendance?.toFixed(1)}%</span>
                  </td>
                  <td className="py-2.5">
                    <div className="flex items-center gap-1.5">
                      <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-indigo-500 rounded-full" style={{ width: `${(a.focusLevel / 10) * 100}%` }} /></div>
                      <span className="text-xs text-gray-500">{a.focusLevel}/10</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* AI Recommendations */}
      {recommendations?.length > 0 && (
        <div className="stat-card !p-6">
          <div className="flex items-center gap-2 mb-4"><Sparkles size={16} className="text-indigo-500" /><h3 className="font-semibold text-gray-900 text-sm">🤖 AI Recommendations</h3></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {recommendations.map((rec, i) => (
              <div key={i} className="flex items-start gap-3 p-3.5 rounded-xl bg-gray-50 hover:bg-indigo-50 transition-colors group">
                <div className="w-6 h-6 rounded-lg bg-indigo-100 group-hover:bg-indigo-500 flex items-center justify-center shrink-0 transition-colors">
                  <span className="text-xs font-bold text-indigo-600 group-hover:text-white transition-colors">{i + 1}</span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{rec}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <Chatbot data={data} />
    </div>
  );
};

export default Dashboard;
