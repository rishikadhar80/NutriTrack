import { useState, useEffect } from 'react';
import { generateRiskAssessment, getLatestRiskAssessment } from '../services/api';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import { FiAlertTriangle, FiRefreshCw, FiShield } from 'react-icons/fi';
import toast from 'react-hot-toast';

const riskLabels = {
  dehydration: { label: 'Dehydration Risk', icon: '💧', desc: 'Based on water intake patterns' },
  protein_deficiency: { label: 'Protein Deficiency', icon: '🥩', desc: 'Based on protein intake analysis' },
  poor_recovery: { label: 'Poor Recovery', icon: '😴', desc: 'Based on sleep and rest patterns' },
  obesity: { label: 'Obesity Risk', icon: '⚖️', desc: 'Based on BMI and calorie analysis' },
  sedentary_lifestyle: { label: 'Sedentary Lifestyle', icon: '🏃', desc: 'Based on activity and step data' },
};

const riskColors = {
  low: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-600 dark:text-green-400', bar: 'bg-green-500', border: 'border-green-200 dark:border-green-800' },
  medium: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-600 dark:text-yellow-400', bar: 'bg-yellow-500', border: 'border-yellow-200 dark:border-yellow-800' },
  high: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-600 dark:text-red-400', bar: 'bg-red-500', border: 'border-red-200 dark:border-red-800' },
};

const RiskPredictor = () => {
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => { loadLatest(); }, []);

  const loadLatest = async () => {
    try {
      const { data } = await getLatestRiskAssessment();
      setAssessment(data.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const generate = async () => {
    setGenerating(true);
    try {
      const { data } = await generateRiskAssessment();
      setAssessment(data.data);
      toast.success('Risk assessment complete!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to assess risks');
    } finally { setGenerating(false); }
  };

  if (loading) return <LoadingSkeleton type="page" />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <FiShield className="text-red-500" /> AI Risk Predictor
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">AI-powered nutritional risk analysis</p>
        </div>
        <button onClick={generate} disabled={generating} className="btn-primary flex items-center gap-2">
          {generating ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><FiRefreshCw /> Analyze Risks</>}
        </button>
      </div>

      {!assessment && !generating && (
        <div className="glass-card p-12 text-center">
          <p className="text-5xl mb-4">🛡️</p>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Assessment Yet</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Run your first AI risk assessment to identify potential health risks.</p>
          <button onClick={generate} className="btn-primary">Run Assessment</button>
        </div>
      )}

      {generating && <LoadingSkeleton type="list" count={5} />}

      {assessment && !generating && (
        <>
          {/* Overall */}
          <div className={`glass-card p-6 border-2 ${riskColors[assessment.overallRiskLevel]?.border || 'border-gray-200'}`}>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Overall Risk Level</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">BMI: {assessment.bmi}</p>
              </div>
              <span className={`px-5 py-2 rounded-full text-lg font-bold uppercase ${riskColors[assessment.overallRiskLevel]?.bg} ${riskColors[assessment.overallRiskLevel]?.text}`}>
                {assessment.overallRiskLevel}
              </span>
            </div>
          </div>

          {/* Risk Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {assessment.risks?.map((risk, i) => {
              const info = riskLabels[risk.type] || { label: risk.type, icon: '⚠️', desc: '' };
              const colors = riskColors[risk.level] || riskColors.low;

              return (
                <div key={i} className="glass-card p-6 animate-slide-up" style={{ animationDelay: `${i * 100}ms` }}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{info.icon}</span>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">{info.label}</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{info.desc}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${colors.bg} ${colors.text}`}>
                      {risk.level}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-500 dark:text-gray-400">Risk Score</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{risk.score}/100</span>
                    </div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${colors.bar} transition-all duration-1000`}
                        style={{ width: `${risk.score}%` }} />
                    </div>
                  </div>

                  {/* Reason */}
                  <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                    <p className="text-sm text-gray-700 dark:text-gray-300"><strong>Reason:</strong> {risk.reason}</p>
                  </div>

                  {/* Recommendations */}
                  {risk.recommendations?.length > 0 && (
                    <div className="mb-3">
                      <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">Recommendations:</p>
                      <ul className="space-y-1">
                        {risk.recommendations.map((r, j) => (
                          <li key={j} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                            <span className="text-primary-500 mt-0.5">•</span> {r}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Suggested Foods */}
                  {risk.suggestedFoods?.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">Suggested Foods:</p>
                      <div className="flex flex-wrap gap-2">
                        {risk.suggestedFoods.map((f, j) => (
                          <span key={j} className="px-3 py-1 bg-accent-100 dark:bg-accent-900/30 text-accent-700 dark:text-accent-300 rounded-full text-xs font-medium">
                            {f}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {assessment.aiAnalysis && (
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">🔍 AI Analysis</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{assessment.aiAnalysis}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default RiskPredictor;
