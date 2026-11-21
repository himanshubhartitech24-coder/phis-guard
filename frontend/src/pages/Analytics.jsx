import React, { useEffect, useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle,
  Cpu,
  RefreshCw,
  Activity,
  Layers
} from 'lucide-react';
import { 
  Chart as ChartJS, 
  ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title,
  PointElement,
  LineElement
} from 'chart.js';
import { Doughnut, Bar, Line } from 'react-chartjs-2';
import { getDashboardStats } from '../utils/api';

ChartJS.register(
  ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title,
  PointElement,
  LineElement
);

export default function Analytics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await getDashboardStats();
      setStats(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Trend Line Chart Data
  const lineData = {
    labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Today'],
    datasets: [
      {
        label: 'Average Risk Index (%)',
        data: [78, 62, 85, 42, 69, 74, stats ? stats.avg_risk_score : 70],
        borderColor: '#06b6d4',
        backgroundColor: 'rgba(6, 182, 212, 0.1)',
        tension: 0.35,
        fill: true,
        pointBackgroundColor: '#00f0ff',
        pointBorderColor: '#fff',
        pointRadius: 4
      },
      {
        label: 'Model Confidence (%)',
        data: [94, 91, 96, 89, 93, 95, stats ? stats.avg_confidence : 94],
        borderColor: '#3b82f6',
        backgroundColor: 'transparent',
        borderDash: [5, 5],
        tension: 0.3,
        pointRadius: 3
      }
    ]
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: { color: '#94a3b8', font: { family: 'JetBrains Mono', size: 11 } }
      },
      tooltip: {
        backgroundColor: '#0f172a',
        borderColor: 'rgba(59, 130, 246, 0.3)',
        borderWidth: 1
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#94a3b8' }
      },
      y: {
        min: 0,
        max: 100,
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#94a3b8', font: { family: 'JetBrains Mono' } }
      }
    }
  };

  // Attack Vectors Bar Chart
  const vectorLabels = stats && stats.attack_vectors ? Object.keys(stats.attack_vectors) : [];
  const vectorValues = stats && stats.attack_vectors ? Object.values(stats.attack_vectors) : [];

  const barData = {
    labels: vectorLabels,
    datasets: [
      {
        label: 'Incidents Detected',
        data: vectorValues,
        backgroundColor: [
          'rgba(239, 68, 68, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(6, 182, 212, 0.8)',
          'rgba(16, 185, 129, 0.8)'
        ],
        borderRadius: 6
      }
    ]
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
    scales: {
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#94a3b8', font: { size: 10 } }
      },
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#94a3b8', stepSize: 1 }
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Analytics Header */}
      <div className="glass-panel rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-cyan-400" />
            <span>Threat Intelligence & Detection Analytics</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Aggregated statistical metrics across Scikit-Learn TF-IDF vectorization and heuristic evaluations.
          </p>
        </div>

        <button
          onClick={fetchStats}
          disabled={loading}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono transition shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
          <span>Refresh Analytics</span>
        </button>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Trend Line Chart (8 cols) */}
        <div className="lg:col-span-8 glass-panel rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Threat Severity & Confidence Trend</h3>
              <p className="text-xs text-slate-400">7-day rolling risk index alongside model prediction confidence</p>
            </div>
            <span className="text-xs font-mono text-cyan-400">Active Pipeline</span>
          </div>

          <div className="h-72">
            <Line data={lineData} options={lineOptions} />
          </div>
        </div>

        {/* Threat Distribution Summary (4 cols) */}
        <div className="lg:col-span-4 glass-panel rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">Corpus Proportions</h3>
            <p className="text-xs text-slate-400 mb-4">Cumulative classification share</p>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-emerald-400 flex items-center space-x-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Safe / Clean</span>
                  </span>
                  <span className="text-white font-bold">{stats ? stats.safe_count : 0}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    style={{ width: `${stats && stats.total_scans > 0 ? (stats.safe_count / stats.total_scans) * 100 : 0}%` }}
                    className="bg-emerald-500 h-full"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-amber-400 flex items-center space-x-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Suspicious Anomaly</span>
                  </span>
                  <span className="text-white font-bold">{stats ? stats.suspicious_count : 0}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    style={{ width: `${stats && stats.total_scans > 0 ? (stats.suspicious_count / stats.total_scans) * 100 : 0}%` }}
                    className="bg-amber-500 h-full"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-red-400 flex items-center space-x-1.5">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>Malicious Phishing</span>
                  </span>
                  <span className="text-white font-bold">{stats ? stats.phishing_count : 0}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    style={{ width: `${stats && stats.total_scans > 0 ? (stats.phishing_count / stats.total_scans) * 100 : 0}%` }}
                    className="bg-red-500 h-full"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 mt-4">
            <div className="text-[11px] font-mono text-slate-400 flex justify-between">
              <span>Avg Risk Index:</span>
              <span className="text-cyan-400 font-bold">{stats ? stats.avg_risk_score : 0}%</span>
            </div>
            <div className="text-[11px] font-mono text-slate-400 flex justify-between mt-1">
              <span>Mean Confidence:</span>
              <span className="text-cyan-400 font-bold">{stats ? stats.avg_confidence : 0}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Attack Vector Frequencies */}
      <div className="glass-panel rounded-2xl p-6">
        <h3 className="text-base font-bold text-white tracking-tight mb-1">
          Attack Vector Prevalence Across Detected Threats
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          Distribution of individual linguistic lures and credential harvesting triggers
        </p>

        <div className="h-64">
          {vectorValues.length > 0 ? (
            <Bar data={barData} options={barOptions} />
          ) : (
            <div className="h-full flex items-center justify-center text-slate-500 text-xs font-mono">
              No vector metrics recorded.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
