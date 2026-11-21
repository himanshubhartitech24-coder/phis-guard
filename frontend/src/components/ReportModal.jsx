import React from 'react';
import { X, Printer, Download, ShieldAlert, CheckCircle2, AlertTriangle, ShieldX } from 'lucide-react';

export default function ReportModal({ scanData, onClose }) {
  if (!scanData) return null;

  const handleDownloadJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(scanData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `phishguard-report-scan-${scanData.id || 'current'}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handlePrint = () => {
    window.print();
  };

  const getStatusBadge = (classification) => {
    if (classification === 'Phishing') {
      return (
        <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-red-500/15 text-red-400 border border-red-500/30">
          <ShieldX className="w-3.5 h-3.5" />
          <span>PHISHING / MALICIOUS</span>
        </span>
      );
    }
    if (classification === 'Suspicious') {
      return (
        <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/15 text-amber-400 border border-amber-500/30">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>SUSPICIOUS ANOMALY</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
        <CheckCircle2 className="w-3.5 h-3.5" />
        <span>SAFE / LEGITIMATE</span>
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto print:p-0 print:bg-white print:text-black">
      <div className="relative w-full max-w-3xl bg-[#0b1222] border border-blue-500/25 rounded-2xl shadow-2xl overflow-hidden my-8 print:border-none print:shadow-none print:bg-white print:text-black">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between p-6 border-b border-blue-500/15 bg-slate-900/60 print:bg-white print:border-b-2 print:border-black">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white print:bg-black">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight print:text-black">
                PhishGuard Cybersecurity Report
              </h2>
              <p className="text-xs text-slate-400 font-mono print:text-slate-600">
                Evaluation ID: #{scanData.id || 'N/A'} · Generated: {new Date().toLocaleString()}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 print:hidden">
            <button
              onClick={handlePrint}
              className="p-2 text-slate-300 hover:text-white rounded-lg bg-slate-800 hover:bg-slate-700 transition"
              title="Print Report"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={handleDownloadJSON}
              className="p-2 text-slate-300 hover:text-white rounded-lg bg-slate-800 hover:bg-slate-700 transition"
              title="Download JSON Report"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto print:max-h-none print:overflow-visible text-sm text-slate-200 print:text-black">
          {/* Executive Summary Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-xl bg-slate-950/70 border border-slate-800 print:bg-gray-50 print:border-gray-200">
            <div>
              <span className="text-xs uppercase font-mono text-slate-400">Verdict</span>
              <div className="mt-1.5">{getStatusBadge(scanData.classification)}</div>
            </div>
            <div>
              <span className="text-xs uppercase font-mono text-slate-400">Risk Score</span>
              <div className="text-2xl font-bold font-mono text-white print:text-black mt-0.5">
                {scanData.risk_score} <span className="text-xs text-slate-400">/ 100</span>
              </div>
            </div>
            <div>
              <span className="text-xs uppercase font-mono text-slate-400">Confidence</span>
              <div className="text-2xl font-bold font-mono text-cyan-400 print:text-blue-700 mt-0.5">
                {scanData.confidence}%
              </div>
            </div>
          </div>

          {/* Email Metadata */}
          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 space-y-2 print:bg-white print:border-gray-300">
            <div className="flex">
              <span className="w-24 text-xs font-mono text-slate-400 uppercase">Subject:</span>
              <span className="font-semibold text-slate-100 print:text-black flex-1">
                {scanData.subject || "No Subject Provided"}
              </span>
            </div>
            <div className="flex">
              <span className="w-24 text-xs font-mono text-slate-400 uppercase">Sender:</span>
              <span className="font-mono text-xs text-slate-300 print:text-gray-800 flex-1">
                {scanData.sender || "Unspecified"}
              </span>
            </div>
          </div>

          {/* Explanation */}
          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
              Threat Evaluation Synopsis
            </h3>
            <p className="p-4 rounded-xl bg-slate-950/60 border border-slate-850 text-slate-300 leading-relaxed print:bg-white print:border-gray-300 print:text-black">
              {scanData.explanation}
            </p>
          </div>

          {/* Indicators Identified */}
          {scanData.indicators && scanData.indicators.length > 0 && (
            <div>
              <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
                Flagged Heuristic Attack Vectors ({scanData.indicators.length})
              </h3>
              <div className="space-y-2.5">
                {scanData.indicators.map((ind, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800 print:bg-white print:border-gray-300">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-white print:text-black text-xs sm:text-sm">
                        {ind.title}
                      </span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                        ind.severity === 'High' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}>
                        {ind.severity} Severity
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 print:text-gray-700">{ind.explanation}</p>
                    {ind.matches && ind.matches.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {ind.matches.map((m, mi) => (
                          <span key={mi} className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700 print:border-gray-400 print:text-black">
                            "{m}"
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommended Security Actions */}
          {scanData.recommended_actions && scanData.recommended_actions.length > 0 && (
            <div>
              <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
                Recommended Security Actions
              </h3>
              <ul className="space-y-2">
                {scanData.recommended_actions.map((act, i) => (
                  <li key={i} className="flex items-start space-x-2.5 text-xs sm:text-sm text-slate-300 print:text-black">
                    <span className="w-5 h-5 rounded-full bg-blue-500/20 text-cyan-400 font-mono text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span>{act}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Disclaimer */}
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-400 leading-relaxed font-mono print:border-gray-300">
            <strong>Security Notice & Automated Assessment Disclaimer:</strong> This evaluation was generated by PhishGuard's automated TF-IDF Scikit-Learn vectorization model and heuristic threat detection algorithms. These predictions are automated cybersecurity indicators and should be verified against organizational SOC policies.
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-blue-500/15 bg-slate-900/60 flex items-center justify-between print:hidden">
          <span className="text-xs text-slate-400 font-mono">
            PhishGuard Defense Core v1.0
          </span>
          <div className="flex space-x-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium transition"
            >
              Print / Save PDF
            </button>
            <button
              onClick={handleDownloadJSON}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition"
            >
              Export JSON
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
