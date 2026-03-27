import React, { useState } from 'react';
import api from '../api';
import { BookOpen, Activity, Loader2, CheckCircle, Send } from 'lucide-react';

const AddData = () => {
  const [perfData, setPerfData] = useState({ subject: '', marks: '' });
  const [actData, setActData] = useState({ studyHours: '', sleepHours: '', attendance: '', focusLevel: 5 });
  const [loadingPerf, setLoadingPerf] = useState(false);
  const [loadingAct, setLoadingAct] = useState(false);
  const [successPerf, setSuccessPerf] = useState(false);
  const [successAct, setSuccessAct] = useState(false);

  const handlePerformance = async (e) => {
    e.preventDefault();
    setLoadingPerf(true);
    setSuccessPerf(false);
    try {
      await api.post('/data/performance', {
        subject: perfData.subject,
        marks: parseFloat(perfData.marks),
      });
      setSuccessPerf(true);
      setPerfData({ subject: '', marks: '' });
      setTimeout(() => setSuccessPerf(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingPerf(false);
    }
  };

  const handleActivity = async (e) => {
    e.preventDefault();
    setLoadingAct(true);
    setSuccessAct(false);
    try {
      await api.post('/data/activity', {
        studyHours: parseFloat(actData.studyHours),
        sleepHours: parseFloat(actData.sleepHours),
        attendance: parseFloat(actData.attendance),
        focusLevel: parseInt(actData.focusLevel),
      });
      setSuccessAct(true);
      setActData({ studyHours: '', sleepHours: '', attendance: '', focusLevel: 5 });
      setTimeout(() => setSuccessAct(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAct(false);
    }
  };

  const inputClass = "w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all placeholder:text-gray-400";

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Add Data</h1>
        <p className="text-gray-400 text-sm mt-1">Log your academic performance and daily activities</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Academic Performance */}
        <div className="stat-card !p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
              <BookOpen size={20} className="text-purple-500" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Academic Performance</h3>
              <p className="text-xs text-gray-400">Subject & marks</p>
            </div>
          </div>

          <form onSubmit={handlePerformance} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1.5 block">Subject</label>
              <input
                type="text"
                required
                className={inputClass}
                placeholder="e.g. Mathematics"
                value={perfData.subject}
                onChange={(e) => setPerfData({ ...perfData, subject: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1.5 block">Marks (0-100)</label>
              <input
                type="number"
                required
                min="0"
                max="100"
                className={inputClass}
                placeholder="e.g. 85"
                value={perfData.marks}
                onChange={(e) => setPerfData({ ...perfData, marks: e.target.value })}
              />
            </div>
            <button
              type="submit"
              disabled={loadingPerf}
              className="w-full btn-gradient py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {loadingPerf ? <Loader2 className="animate-spin" size={16} /> :
               successPerf ? <><CheckCircle size={16} /> Saved!</> :
               <><Send size={16} /> Submit Performance</>}
            </button>
          </form>
        </div>

        {/* Daily Activity */}
        <div className="stat-card !p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <Activity size={20} className="text-blue-500" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Daily Activity</h3>
              <p className="text-xs text-gray-400">Study, sleep & focus</p>
            </div>
          </div>

          <form onSubmit={handleActivity} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1.5 block">Study Hours</label>
                <input
                  type="number"
                  required
                  min="0"
                  max="24"
                  step="0.5"
                  className={inputClass}
                  placeholder="e.g. 6"
                  value={actData.studyHours}
                  onChange={(e) => setActData({ ...actData, studyHours: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1.5 block">Sleep Hours</label>
                <input
                  type="number"
                  required
                  min="0"
                  max="24"
                  step="0.5"
                  className={inputClass}
                  placeholder="e.g. 7"
                  value={actData.sleepHours}
                  onChange={(e) => setActData({ ...actData, sleepHours: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-500 mb-1.5 block">Attendance %</label>
              <input
                type="number"
                required
                min="0"
                max="100"
                className={inputClass}
                placeholder="e.g. 90"
                value={actData.attendance}
                onChange={(e) => setActData({ ...actData, attendance: e.target.value })}
              />
            </div>

            {/* Focus Level Slider */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-medium text-gray-500">Focus Level</label>
                <span className="text-sm font-bold text-indigo-600">{actData.focusLevel}/10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={actData.focusLevel}
                onChange={(e) => setActData({ ...actData, focusLevel: e.target.value })}
                className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-indigo-500"
              />
              <div className="flex justify-between text-[10px] text-gray-300 mt-1">
                <span>Low</span>
                <span>High</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loadingAct}
              className="w-full btn-gradient py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {loadingAct ? <Loader2 className="animate-spin" size={16} /> :
               successAct ? <><CheckCircle size={16} /> Saved!</> :
               <><Send size={16} /> Submit Activity</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddData;
