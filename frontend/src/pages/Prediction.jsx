import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { Brain, Sparkles, ChevronRight, CheckCircle2, AlertTriangle, AlertCircle, Target, Zap, Download } from 'lucide-react';
import { SkeletonCard, ErrorCard } from '../components/SkeletonComponents';
import { generateReport } from '../utils/generateReport';

const ScoreGauge = ({ value }) => {
  const radius = 90;
  const stroke = 14;
  const normalizedRadius = radius - stroke;
  const circumference = normalizedRadius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;
  const getColor = (v) => v >= 75 ? '#10b981' : v >= 50 ? '#f59e0b' : '#ef4444';

  return (
    <div className="relative flex items-center justify-center">
      <svg height={radius * 2} width={radius * 2} className="-rotate-90">
        <circle stroke="#f1f5f9" fill="transparent" strokeWidth={stroke} r={normalizedRadius} cx={radius} cy={radius} />
        <circle stroke={getColor(value)} fill="transparent" strokeWidth={stroke} strokeDasharray={`${circumference} ${circumference}`} strokeDashoffset={offset} strokeLinecap="round" r={normalizedRadius} cx={radius} cy={radius} className="gauge-ring" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-5xl font-bold text-gray-900">{value.toFixed(0)}</span>
        <span className="text-sm text-gray-400 font-medium mt-1">/ 100</span>
      </div>
    </div>
  );
};

const PredictionPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pdfLoading, setPdfLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true); setError('');
    try {
      const response = await api.get('/data/dashboard');
      setData(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to connect to backend.');
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleDownloadReport = () => {
    setPdfLoading(true);
    try { generateReport(data); } catch (e) { console.error(e); }
    finally { setTimeout(() => setPdfLoading(false), 1000); }
  };

  if (loading) return (
    <div className="space-y-6 animate-fade-in">
      <div className="h-7 bg-gray-200 rounded-full w-64 animate-pulse" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">{[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}</div>
    </div>
  );

  if (error) return <ErrorCard message={error} onRetry={fetchData} />;

  const { latestPrediction, recommendations, comparison, goalTracker } = data || {};

  const riskConfig = {
    LOW_RISK: { label: '🟢 Low Risk', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', icon: CheckCircle2, desc: 'Great performance! Your patterns indicate strong academic trajectory.' },
    MEDIUM_RISK: { label: '🟡 Medium Risk', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', icon: AlertCircle, desc: 'Some areas need attention. Focus on weak subjects and consistency.' },
    HIGH_RISK: { label: '🔴 High Risk', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', icon: AlertTriangle, desc: 'Immediate action needed. Study hours and attendance are critically low.' },
  };

  const risk = latestPrediction ? riskConfig[latestPrediction.riskLevel] : null;

  return (
    <div className="space-y-7 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">🧠 ML Prediction Engine</h1>
          <p className="text-gray-400 text-sm mt-0.5">Prediction based on study behavior, attendance &amp; past performance using a weighted regression model.</p>
          <div className="flex flex-wrap gap-2 mt-2">
            <span className="text-[11px] font-semibold text-indigo-500 bg-indigo-50 px-2.5 py-0.5 rounded-full">Linear Regression</span>
            <span className="text-[11px] font-semibold text-purple-500 bg-purple-50 px-2.5 py-0.5 rounded-full">Spring Boot REST API</span>
            <span className="text-[11px] font-semibold text-blue-500 bg-blue-50 px-2.5 py-0.5 rounded-full">MySQL Database</span>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />Real-time</span>
          </div>
        </div>
        <button onClick={handleDownloadReport} disabled={pdfLoading} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-gray-700 border border-gray-200 text-sm font-semibold hover:bg-gray-50 hover:shadow-sm transition-all cursor-pointer disabled:opacity-50">
          <Download size={16} className="text-indigo-500" />
          {pdfLoading ? 'Generating...' : 'Download Report'}
        </button>
      </div>

      {!latestPrediction ? (
        <div className="stat-card !p-12 text-center">
          <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Brain size={32} className="text-indigo-500" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Predictions Yet</h3>
          <p className="text-gray-400 text-sm mb-6 max-w-sm mx-auto">Add study data and academic records to generate your first AI prediction.</p>
          <Link to="/add-data" className="inline-flex items-center gap-2 btn-gradient px-6 py-3 rounded-xl text-sm font-semibold no-underline">
            <Sparkles size={16} /> Start Tracking
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Score Gauge */}
            <div className="stat-card !p-8 flex flex-col items-center justify-center">
              <p className="text-xs font-semibold text-gray-400 mb-6 uppercase tracking-widest">Predicted Score</p>
              <ScoreGauge value={latestPrediction.predictedScore} />
              <div className="mt-6 flex items-center gap-2">
                <Zap size={14} className="text-indigo-500" />
                <span className="text-xs font-medium text-gray-500">Dynamic ML Projection</span>
              </div>
            </div>

            {/* Risk Assessment */}
            <div className="stat-card !p-8 flex flex-col justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-400 mb-4 uppercase tracking-widest">Risk Assessment</p>
                <div className={`flex items-start gap-3 p-4 rounded-xl ${risk.bg} border ${risk.border} mb-5`}>
                  <risk.icon size={22} className={`${risk.color} shrink-0 mt-0.5`} />
                  <div>
                    <p className={`font-bold text-sm ${risk.color}`}>{risk.label}</p>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">{risk.desc}</p>
                  </div>
                </div>
              </div>
              {/* Progress Bar */}
              <div>
                <div className="flex justify-between text-xs text-gray-400 mb-2">
                  <span>Score Progress</span>
                  <span>{latestPrediction.predictedScore.toFixed(0)}%</span>
                </div>
                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-1000" style={{
                    width: `${latestPrediction.predictedScore}%`,
                    background: latestPrediction.predictedScore >= 75 ? 'linear-gradient(90deg, #10b981, #34d399)' :
                               latestPrediction.predictedScore >= 50 ? 'linear-gradient(90deg, #f59e0b, #fbbf24)' :
                               'linear-gradient(90deg, #ef4444, #f87171)'
                  }} />
                </div>
              </div>
            </div>

            {/* Model Insights */}
            <div className="stat-card !p-8 space-y-4">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Model Insights</p>
              <div className="space-y-3">
                {[
                  { label: 'Algorithm', value: 'Linear Regression', icon: '🧬' },
                  { label: 'Data Points', value: `${(data?.activities?.length || 0) + (data?.performances?.length || 0)}`, icon: '📊' },
                  { label: 'Confidence', value: latestPrediction.predictedScore >= 70 ? 'High' : 'Moderate', icon: '🎯' },
                  { label: 'Status', value: 'Active', icon: '✅' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-indigo-50 transition-colors">
                    <span className="text-sm text-gray-500 flex items-center gap-2"><span>{item.icon}</span>{item.label}</span>
                    <span className="text-sm font-bold text-gray-700">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Goal Tracker in Prediction */}
          {goalTracker && (
            <div className="stat-card !p-6">
              <div className="flex items-center gap-2 mb-3">
                <Target size={16} className="text-indigo-500" />
                <h3 className="font-semibold text-gray-900 text-sm">🎯 Goal Tracker</h3>
                <span className="text-xs text-gray-400 ml-auto">Target: {goalTracker.target}%</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="w-full h-5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-1000 flex items-center justify-end pr-2" style={{ width: `${Math.min(100, goalTracker.progress)}%` }}>
                      <span className="text-[10px] text-white font-bold">{goalTracker.progress?.toFixed(0)}%</span>
                    </div>
                  </div>
                </div>
                <span className="text-lg font-bold text-gray-700">{goalTracker.current?.toFixed(1)}%</span>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                {goalTracker.current >= goalTracker.target ? '🎉 Congratulations! You\'ve reached your target!' : `📈 ${(goalTracker.target - goalTracker.current).toFixed(1)}% more to reach your goal. Keep pushing!`}
              </p>
            </div>
          )}

          {/* Comparison */}
          {comparison && (
            <div className="stat-card !p-6">
              <h3 className="font-semibold text-gray-900 text-sm mb-4">📊 You vs Top Students</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { label: 'Average Marks', yours: comparison.yourMarks, top: comparison.topMarks, unit: '%', color: 'bg-purple-500' },
                  { label: 'Study Hours/Day', yours: comparison.yourStudyHours, top: comparison.topStudyHours, unit: 'hrs', color: 'bg-blue-500' },
                  { label: 'Attendance', yours: comparison.yourAttendance, top: comparison.topAttendance, unit: '%', color: 'bg-emerald-500' },
                ].map((item, i) => (
                  <div key={i} className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-400 font-medium mb-3">{item.label}</p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 w-8">You</span>
                        <div className="flex-1 h-2.5 bg-gray-200 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${item.color}`} style={{ width: `${(item.yours / Math.max(item.top, 1)) * 100}%` }} />
                        </div>
                        <span className="text-xs font-bold text-gray-700 w-14 text-right">{item.yours}{item.unit}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 w-8">Top</span>
                        <div className="flex-1 h-2.5 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full rounded-full bg-gray-400" style={{ width: '100%' }} />
                        </div>
                        <span className="text-xs font-bold text-gray-400 w-14 text-right">{item.top}{item.unit}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Recommendations */}
      {recommendations?.length > 0 && (
        <div className="stat-card !p-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={16} className="text-indigo-500" />
            <h3 className="font-semibold text-gray-900 text-sm">🤖 AI Recommendations</h3>
          </div>
          <div className="space-y-2.5">
            {recommendations.map((rec, i) => (
              <div key={i} className="flex items-start gap-3 p-3.5 rounded-xl bg-gray-50 hover:bg-indigo-50 transition-colors group">
                <div className="w-6 h-6 rounded-lg bg-indigo-100 group-hover:bg-indigo-500 flex items-center justify-center shrink-0 transition-colors">
                  <ChevronRight size={14} className="text-indigo-500 group-hover:text-white transition-colors" />
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{rec}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PredictionPage;
