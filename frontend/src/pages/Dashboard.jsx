import React, { useEffect, useState } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle, 
  Activity, 
  MailSearch, 
  ArrowRight,
  TrendingUp,
  Cpu,
  RefreshCw,
  Clock
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
import { Doughnut, Bar } from 'react-chartjs-2';
import StatCard from '../components/StatCard';
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

export default function Dashboard({ onNavigateToAnalyzer, onViewScan }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await getDashboardStats();
      setStats(data);
      setError(null);
    } catch (err) {
      console.error("Dashboard stats fetch error:", err);
      setError("Unable to connect to PhishGuard API. Please ensure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // Doughnut Chart Data: Threat Distribution
  const doughnutData = {
    labels: ['Safe / Legitimate', 'Suspicious', 'Phishing / Malicious'],
    datasets: [
      {
        data: stats ? [stats.distribution.safe, stats.distribution.suspicious, stats.distribution.phishing] : [0, 0, 0],
        backgroundColor: [
          'rgba(16, 185, 129, 0.85)', // Safe green
          'rgba(245, 158, 11, 0.85)', // Suspicious amber
          'rgba(239, 68, 68, 0.85)'   // Phishing red
        ],
        borderColor: [
          '#10b981',
          '#f59e0b',
          '#ef4444'
        ],
        borderWidth: 2,
        hoverOffset: 6
      }
    ]
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#94a3b8',
          font: { family: 'JetBrains Mono', size: 11 },
          padding: 16
        }
      },
      tooltip: {
        backgroundColor: '#0f172a',
        titleColor: '#f8fafc',
        bodyColor: '#cbd5e1',
        borderColor: 'rgba(59, 130, 246, 0.3)',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6
      }
    },
    cutout: '72%'
  };

  // Bar Chart Data: Top Phishing Attack Vectors
  const vectorLabels = stats && stats.attack_vectors ? Object.keys(stats.attack_vectors) : [];
  const vectorValues = stats && stats.attack_vectors ? Object.values(stats.attack_vectors) : [];

  const barData = {
    labels: vectorLabels,
    datasets: [
      {
        label: 'Detected Instances',
        data: vectorValues,
        backgroundColor: 'rgba(59, 130, 246, 0.75)',
        borderColor: '#3b82f6',
        borderWidth: 1,
        borderRadius: 8,
        hoverBackgroundColor: 'rgba(6, 182, 212, 0.9)'
      }
    ]
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#0f172a',
        titleColor: '#f8fafc',
        bodyColor: '#cbd5e1',
        borderColor: 'rgba(59, 130, 246, 0.3)',
        borderWidth: 1,
        padding: 10
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#94a3b8', font: { size: 11 } }
      },
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#94a3b8', stepSize: 1, font: { family: 'JetBrains Mono' } }
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Callout */}
      <div className="glass-panel rounded-2xl p-6 relative overflow-hidden bg-gradient-to-r from-blue-950/40 via-slate-900/60 to-cyan-950/30 border border-blue-500/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2 text-cyan-400 text-xs font-mono font-medium mb-1.5">
              <Cpu className="w-4 h-4 animate-pulse" />
              <span>ACTIVE DEFENSE ACTIVE</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              AI-Powered Email Threat Defense & SOC Telemetry
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              PhishGuard fuses natural language processing, TF-IDF n-gram vectorization, and deterministic heuristic triggers to intercept credential harvesting, deceptive URLs, and executive impersonation.
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <button
              onClick={fetchStats}
              disabled={loading}
              className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition"
              title="Refresh Telemetry"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
            </button>
            <button
              onClick={onNavigateToAnalyzer}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-600 to-indigo-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold text-sm shadow-lg shadow-blue-500/25 transition-all duration-200"
            >
              <MailSearch className="w-4 h-4" />
              <span>Analyze New Email</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>

        {/* Cyber glow ambient light */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Scanned"
          value={stats ? stats.total_scans : '--'}
          subtitle="Processed email transmissions"
          icon={Activity}
          color="blue"
          trend="Live Telemetry"
        />
        <StatCard
          title="Phishing Blocked"
          value={stats ? stats.phishing_count : '--'}
          subtitle={stats && stats.total_scans > 0 ? `${Math.round((stats.phishing_count / stats.total_scans) * 100)}% of total traffic` : '--'}
          icon={ShieldAlert}
          color="red"
          trend="Malicious"
        />
        <StatCard
          title="Suspicious Anomalies"
          value={stats ? stats.suspicious_count : '--'}
          subtitle={stats && stats.total_scans > 0 ? `${Math.round((stats.suspicious_count / stats.total_scans) * 100)}% of total traffic` : '--'}
          icon={AlertTriangle}
          color="amber"
          trend="Needs Review"
        />
        <StatCard
          title="Safe & Legitimate"
          value={stats ? stats.safe_count : '--'}
          subtitle={stats && stats.total_scans > 0 ? `${Math.round((stats.safe_count / stats.total_scans) * 100)}% of total traffic` : '--'}
          icon={ShieldCheck}
          color="green"
          trend="Verified Clean"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Threat Distribution Chart (5 cols) */}
        <div className="lg:col-span-5 glass-panel rounded-2xl p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Threat Distribution</h3>
              <p className="text-xs text-slate-400">Proportional classification breakdown</p>
            </div>
            <div className="text-xs font-mono px-2 py-0.5 rounded bg-blue-500/15 text-cyan-400 border border-blue-500/30">
              Confidence {stats ? stats.avg_confidence : '--'}%
            </div>
          </div>

          <div className="h-64 relative flex items-center justify-center">
            {stats && stats.total_scans > 0 ? (
              <Doughnut data={doughnutData} options={doughnutOptions} />
            ) : (
              <div className="text-center text-slate-500 text-sm">No telemetry records yet.</div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-slate-800 text-center">
            <div>
              <div className="text-xs text-emerald-400 font-mono font-bold">
                {stats ? stats.distribution.safe : 0}
              </div>
              <div className="text-[11px] text-slate-400">Safe</div>
            </div>
            <div>
              <div className="text-xs text-amber-400 font-mono font-bold">
                {stats ? stats.distribution.suspicious : 0}
              </div>
              <div className="text-[11px] text-slate-400">Suspicious</div>
            </div>
            <div>
              <div className="text-xs text-red-400 font-mono font-bold">
                {stats ? stats.distribution.phishing : 0}
              </div>
              <div className="text-[11px] text-slate-400">Phishing</div>
            </div>
          </div>
        </div>

        {/* Attack Vector Frequency Chart (7 cols) */}
        <div className="lg:col-span-7 glass-panel rounded-2xl p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Attack Vector Breakdown</h3>
              <p className="text-xs text-slate-400">Frequent indicators detected across email corpus</p>
            </div>
            <span className="text-xs font-mono text-slate-400">Heuristic Engine</span>
          </div>

          <div className="h-72">
            {vectorValues.length > 0 ? (
              <Bar data={barData} options={barOptions} />
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500 text-sm">
                No attack vectors recorded.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="glass-panel rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">Recent Threat Scans</h3>
            <p className="text-xs text-slate-400">Latest evaluated emails and security verdicts</p>
          </div>
          <button
            onClick={onNavigateToAnalyzer}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center space-x-1"
          >
            <span>Run New Scan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="pb-3 font-semibold">Evaluation ID</th>
                <th className="pb-3 font-semibold">Timestamp</th>
                <th className="pb-3 font-semibold">Subject</th>
                <th className="pb-3 font-semibold">Classification</th>
                <th className="pb-3 font-semibold">Risk Index</th>
                <th className="pb-3 font-semibold text-right">Confidence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {stats && stats.recent_scans && stats.recent_scans.length > 0 ? (
                stats.recent_scans.map((scan) => {
                  let badge = (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      SAFE
                    </span>
                  );
                  if (scan.classification === 'Phishing') {
                    badge = (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/15 text-red-400 border border-red-500/30">
                        PHISHING
                      </span>
                    );
                  } else if (scan.classification === 'Suspicious') {
                    badge = (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                        SUSPICIOUS
                      </span>
                    );
                  }

                  return (
                    <tr 
                      key={scan.id} 
                      className="hover:bg-slate-800/40 transition cursor-pointer"
                      onClick={() => onViewScan && onViewScan(scan.id)}
                    >
                      <td className="py-3 text-cyan-400 font-bold">#{scan.id}</td>
                      <td className="py-3 text-slate-400">{scan.timestamp}</td>
                      <td className="py-3 font-sans text-slate-200 font-medium truncate max-w-xs">
                        {scan.subject}
                      </td>
                      <td className="py-3">{badge}</td>
                      <td className="py-3">
                        <span className={`font-bold ${
                          scan.risk_score >= 68 ? 'text-red-400' : scan.risk_score >= 35 ? 'text-amber-400' : 'text-emerald-400'
                        }`}>
                          {scan.risk_score}%
                        </span>
                      </td>
                      <td className="py-3 text-right text-slate-300">{scan.confidence}%</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-slate-500">
                    No scans available in database.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
