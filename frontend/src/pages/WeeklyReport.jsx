import { useState, useEffect } from 'react';
import { generateWeeklyReport, getLatestReport } from '../services/api';
import ProgressRing from '../components/common/ProgressRing';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { FiFileText, FiRefreshCw, FiDownload, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';

const WeeklyReport = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => { loadLatest(); }, []);

  const loadLatest = async () => {
    try {
      const { data } = await getLatestReport();
      setReport(data.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const generate = async () => {
    setGenerating(true);
    try {
      const { data } = await generateWeeklyReport();
      setReport(data.data);
      toast.success('Weekly report generated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to generate report');
    } finally { setGenerating(false); }
  };

  const exportPDF = () => {
    // Print-based PDF export
    window.print();
    toast.success('Use your browser print dialog to save as PDF');
  };

  if (loading) return <LoadingSkeleton type="page" />;

  const radarData = report ? [
    { subject: 'Nutrition', score: report.nutritionScore || 0 },
    { subject: 'Hydration', score: report.hydrationScore || 0 },
    { subject: 'Sleep', score: report.sleepScore || 0 },
    { subject: 'Fitness', score: report.fitnessScore || 0 },
  ] : [];

  const dailyChartData = report?.dailyData?.map(d => ({
    date: new Date(d.date).toLocaleDateString('en-US', { weekday: 'short' }),
    calories: d.calories || 0,
    protein: d.protein || 0,
    water: d.water || 0,
  })) || [];

  return (
    <div className="space-y-6 animate-fade-in print:space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-4 print:hidden">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <FiFileText className="text-green-500" /> Weekly Health Report
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">AI-powered analysis of your weekly health data</p>
        </div>
        <div className="flex gap-3">
          <button onClick={generate} disabled={generating} className="btn-primary flex items-center gap-2">
            {generating ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><FiRefreshCw /> Generate Report</>}
          </button>
          {report && (
            <button onClick={exportPDF} className="btn-outline flex items-center gap-2"><FiDownload /> Export PDF</button>
          )}
        </div>
      </div>

      {!report && !generating && (
        <div className="glass-card p-12 text-center">
          <p className="text-5xl mb-4">📊</p>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Report Yet</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Generate your first weekly health report. Make sure you have at least a few days of logged data.</p>
          <button onClick={generate} disabled={generating} className="btn-primary">Generate Report</button>
        </div>
      )}

      {generating && <LoadingSkeleton type="page" />}

      {report && !generating && (
        <>
          {/* Overall Score */}
          <div className="glass-card p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Overall Health Score</h3>
            <div className="flex justify-center">
              <ProgressRing progress={report.overallScore || 0} size={160} strokeWidth={12}
                color={report.overallScore >= 70 ? '#10b981' : report.overallScore >= 40 ? '#f59e0b' : '#ef4444'}
                label="" value={report.overallScore || 0} unit="/ 100" />
            </div>
          </div>

          {/* Score Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Nutrition', score: report.nutritionScore, icon: '🥗', color: '#10b981' },
              { label: 'Hydration', score: report.hydrationScore, icon: '💧', color: '#3b82f6' },
              { label: 'Sleep', score: report.sleepScore, icon: '😴', color: '#6366f1' },
              { label: 'Fitness', score: report.fitnessScore, icon: '💪', color: '#f97316' },
            ].map(item => (
              <div key={item.label} className="glass-card p-5 text-center">
                <span className="text-3xl">{item.icon}</span>
                <ProgressRing progress={item.score || 0} size={90} strokeWidth={6} color={item.color}
                  label={item.label} value={item.score || 0} unit="" />
              </div>
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Radar Chart */}
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Performance Radar</h3>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#6b7280', fontSize: 12 }} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
                  <Radar name="Score" dataKey="score" stroke="#6366f1" fill="#6366f1" fillOpacity={0.3} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Daily Breakdown */}
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Daily Calorie Breakdown</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dailyChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
                  <YAxis stroke="#9ca3af" fontSize={12} />
                  <Tooltip contentStyle={{ background: 'rgba(255,255,255,0.95)', border: 'none', borderRadius: '12px' }} />
                  <Bar dataKey="calories" fill="#f97316" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Strengths & Weaknesses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-green-600 dark:text-green-400 mb-4 flex items-center gap-2">
                <FiCheckCircle /> Strengths
              </h3>
              <div className="space-y-3">
                {report.strengths?.map((s, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <p className="text-gray-700 dark:text-gray-300 text-sm">{s}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-orange-600 dark:text-orange-400 mb-4 flex items-center gap-2">
                <FiAlertCircle /> Areas to Improve
              </h3>
              <div className="space-y-3">
                {report.weaknesses?.map((w, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-xl">
                    <span className="text-orange-500 mt-0.5">!</span>
                    <p className="text-gray-700 dark:text-gray-300 text-sm">{w}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">💡 AI Recommendations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {report.recommendations?.map((r, i) => (
                <div key={i} className="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-xl border border-primary-100 dark:border-primary-800/30">
                  <p className="text-sm text-gray-700 dark:text-gray-300">{r}</p>
                </div>
              ))}
            </div>
          </div>

          {report.aiAnalysis && (
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">📋 Detailed Analysis</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{report.aiAnalysis}</p>
            </div>
          )}

          {/* Averages */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Weekly Averages</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { label: 'Calories', value: report.avgCalories, unit: 'kcal', icon: '🔥' },
                { label: 'Protein', value: `${report.avgProtein}g`, icon: '🥩' },
                { label: 'Water', value: report.avgWater, unit: 'glasses', icon: '💧' },
                { label: 'Sleep', value: `${report.avgSleep}h`, icon: '😴' },
                { label: 'Steps', value: report.avgSteps, icon: '👟' },
                { label: 'Workout', value: `${report.totalWorkoutMinutes}m`, icon: '💪' },
              ].map(item => (
                <div key={item.label} className="text-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                  <span className="text-2xl">{item.icon}</span>
                  <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">{item.value}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default WeeklyReport;
