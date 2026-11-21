import React, { useEffect, useState } from 'react';
import { 
  History, 
  Search, 
  Trash2, 
  Eye, 
  Filter, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle,
  Download,
  AlertOctagon,
  RefreshCw
} from 'lucide-react';
import ReportModal from '../components/ReportModal';
import { getScanHistory, deleteScanRecord, clearAllHistoryRecords, getScanById } from '../utils/api';

export default function ScanHistory() {
  const [historyItems, setHistoryItems] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedScan, setSelectedScan] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await getScanHistory({
        limit: 100,
        filter: filterType,
        search: searchTerm
      });
      setHistoryItems(res.items || []);
      setTotalCount(res.total || 0);
    } catch (err) {
      console.error("Failed to load history:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [filterType, searchTerm]);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm(`Delete scan record #${id}?`)) return;
    try {
      await deleteScanRecord(id);
      fetchHistory();
    } catch (err) {
      alert("Failed to delete scan: " + err.message);
    }
  };

  const handleClearAll = async () => {
    try {
      await clearAllHistoryRecords();
      setConfirmClear(false);
      fetchHistory();
    } catch (err) {
      alert("Failed to clear history: " + err.message);
    }
  };

  const handleViewDetails = async (id) => {
    try {
      const fullScan = await getScanById(id);
      setSelectedScan(fullScan);
      setShowModal(true);
    } catch (err) {
      alert("Failed to fetch scan details: " + err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search & Filter Header Bar */}
      <div className="glass-panel rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by subject, sender, or content snippet..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-slate-950/80 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-sans"
          />
        </div>

        {/* Filter Tabs & Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-xl bg-slate-900 border border-slate-800 p-0.5 text-xs font-mono">
            {['all', 'safe', 'suspicious', 'phishing'].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilterType(tab)}
                className={`px-3 py-1 rounded-lg capitalize transition ${
                  filterType === tab ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <button
            onClick={fetchHistory}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
            title="Refresh history"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
          </button>

          {historyItems.length > 0 && (
            <button
              onClick={() => setConfirmClear(true)}
              className="px-3 py-1.5 rounded-xl text-xs font-mono text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 transition flex items-center space-x-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          )}
        </div>
      </div>

      {/* Confirmation Modal for Clearing History */}
      {confirmClear && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-slate-900 border border-red-500/40 p-6 rounded-2xl max-w-sm w-full space-y-4">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <AlertOctagon className="w-5 h-5 text-red-400" />
              <span>Clear Entire Scan Archive?</span>
            </h3>
            <p className="text-xs text-slate-300">
              This will permanently remove all analyzed email records and metrics from the local SQLite database.
            </p>
            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setConfirmClear(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-mono"
              >
                Cancel
              </button>
              <button
                onClick={handleClearAll}
                className="px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-500 text-xs font-mono font-bold"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* History Table */}
      <div className="glass-panel rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <span className="text-xs font-mono text-slate-400">
            Total Audited Records: <strong className="text-white">{historyItems.length}</strong> of {totalCount}
          </span>
          <span className="text-[11px] font-mono text-cyan-400">SQLite Backend · phishguard.db</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3 px-4 font-semibold">ID</th>
                <th className="py-3 px-4 font-semibold">Timestamp</th>
                <th className="py-3 px-4 font-semibold">Subject / Preview</th>
                <th className="py-3 px-4 font-semibold">Classification</th>
                <th className="py-3 px-4 font-semibold">Risk Score</th>
                <th className="py-3 px-4 font-semibold">Confidence</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {historyItems.length > 0 ? (
                historyItems.map((scan) => {
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
                      onClick={() => handleViewDetails(scan.id)}
                      className="hover:bg-slate-800/40 transition cursor-pointer group"
                    >
                      <td className="py-3.5 px-4 text-cyan-400 font-bold">#{scan.id}</td>
                      <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap">{scan.timestamp}</td>
                      <td className="py-3.5 px-4 font-sans max-w-sm">
                        <div className="font-semibold text-slate-100 truncate group-hover:text-cyan-300 transition">
                          {scan.subject}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate mt-0.5 font-mono">
                          {scan.preview_text}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">{badge}</td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className={`font-bold ${
                          scan.risk_score >= 68 ? 'text-red-400' : scan.risk_score >= 35 ? 'text-amber-400' : 'text-emerald-400'
                        }`}>
                          {scan.risk_score}%
                        </span>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap text-slate-300">
                        {scan.confidence}%
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={() => handleViewDetails(scan.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                            title="Inspect Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => handleDelete(scan.id, e)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition"
                            title="Delete Record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-500 font-sans">
                    {loading ? "Loading scan history records..." : "No scan records matching current criteria."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {showModal && selectedScan && (
        <ReportModal
          scanData={selectedScan}
          onClose={() => {
            setShowModal(false);
            setSelectedScan(null);
          }}
        />
      )}
    </div>
  );
}
