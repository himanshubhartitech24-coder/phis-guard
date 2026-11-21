import React, { useState } from 'react';
import { 
  Sparkles, 
  Trash2, 
  Copy, 
  Check, 
  FileText, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  ExternalLink,
  ChevronRight,
  Download,
  AlertOctagon,
  Eye,
  Code
} from 'lucide-react';
import RiskGauge from '../components/RiskGauge';
import ReportModal from '../components/ReportModal';
import { SAMPLE_EMAILS } from '../utils/sampleEmails';
import { analyzeEmailContent } from '../utils/api';

export default function EmailAnalyzer({ initialEmail = null }) {
  const [subject, setSubject] = useState(initialEmail ? initialEmail.subject : '');
  const [sender, setSender] = useState(initialEmail ? initialEmail.sender : '');
  const [emailText, setEmailText] = useState(initialEmail ? initialEmail.text : '');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('raw'); // 'raw' or 'highlighted'
  const [showReportModal, setShowReportModal] = useState(false);
  const [copiedAction, setCopiedAction] = useState(null);

  const handleAnalyze = async () => {
    if (!emailText.trim()) {
      setError("Please paste or type email content to analyze.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await analyzeEmailContent({
        subject: subject.trim(),
        sender: sender.trim(),
        text: emailText.trim()
      });
      setResult(data);
    } catch (err) {
      console.error("Analysis error:", err);
      setError(err.message || "Failed to analyze email. Verify backend connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleLoadSample = (sample) => {
    setSubject(sample.subject);
    setSender(sample.sender);
    setEmailText(sample.text);
    setResult(null);
    setError(null);
  };

  const handleClear = () => {
    setSubject('');
    setSender('');
    setEmailText('');
    setResult(null);
    setError(null);
  };

  const handleCopyText = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedAction(id);
    setTimeout(() => setCopiedAction(null), 2000);
  };

  // Render highlighted text preview with cyber badges
  const renderHighlightedText = () => {
    if (!result || !result.highlight_spans || result.highlight_spans.length === 0) {
      return (
        <div className="p-4 font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
          {emailText}
        </div>
      );
    }

    // Sort spans by start offset
    const spans = [...result.highlight_spans].sort((a, b) => a.start - b.start);
    const elements = [];
    let lastIndex = 0;

    spans.forEach((span, idx) => {
      // Add text before highlight
      if (span.start > lastIndex) {
        elements.push(
          <span key={`text-${idx}`}>{emailText.slice(lastIndex, span.start)}</span>
        );
      }

      // Add highlighted badge span
      let highlightClass = "bg-red-500/30 text-red-300 border border-red-500/50 px-1 py-0.5 rounded font-semibold";
      if (span.category === "urgent_language") {
        highlightClass = "bg-amber-500/30 text-amber-300 border border-amber-500/50 px-1 py-0.5 rounded font-semibold";
      } else if (span.category === "suspicious_sender") {
        highlightClass = "bg-purple-500/30 text-purple-300 border border-purple-500/50 px-1 py-0.5 rounded font-semibold";
      }

      elements.push(
        <mark
          key={`span-${idx}`}
          className={highlightClass}
          title={`Detected Indicator: ${span.category}`}
        >
          {emailText.slice(span.start, span.end)}
        </mark>
      );

      lastIndex = span.end;
    });

    if (lastIndex < emailText.length) {
      elements.push(
        <span key="text-end">{emailText.slice(lastIndex)}</span>
      );
    }

    return (
      <div className="p-4 font-mono text-xs text-slate-200 whitespace-pre-wrap leading-relaxed bg-slate-950/80 rounded-xl border border-slate-800">
        {elements}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Sample presets bar */}
      <div className="glass-panel rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-2 text-xs text-slate-400 font-mono">
          <FileText className="w-4 h-4 text-cyan-400" />
          <span>Quick Test Presets:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleLoadSample(SAMPLE_EMAILS[0])}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500/15 text-red-300 hover:bg-red-500/25 border border-red-500/30 transition"
          >
            PayPal Phishing
          </button>
          <button
            onClick={() => handleLoadSample(SAMPLE_EMAILS[1])}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500/15 text-red-300 hover:bg-red-500/25 border border-red-500/30 transition"
          >
            Microsoft 365 Lure
          </button>
          <button
            onClick={() => handleLoadSample(SAMPLE_EMAILS[2])}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500/15 text-red-300 hover:bg-red-500/25 border border-red-500/30 transition"
          >
            CEO Wire Fraud
          </button>
          <button
            onClick={() => handleLoadSample(SAMPLE_EMAILS[4])}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-500/15 text-amber-300 hover:bg-amber-500/25 border border-amber-500/30 transition"
          >
            Suspicious Invoice
          </button>
          <button
            onClick={() => handleLoadSample(SAMPLE_EMAILS[6])}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25 border border-emerald-500/30 transition"
          >
            Legitimate Sprint Agenda
          </button>
          <button
            onClick={handleClear}
            className="p-1.5 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition"
            title="Clear all inputs"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Analyzer Grid: Editor & Immediate Result */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Email Input Editor (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="glass-panel rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white tracking-tight flex items-center space-x-2">
                <span>Email Transmission Content</span>
              </h3>

              {result && (
                <div className="flex items-center rounded-lg bg-slate-900 border border-slate-800 p-0.5">
                  <button
                    onClick={() => setViewMode('raw')}
                    className={`px-2.5 py-1 text-xs font-mono rounded-md flex items-center space-x-1.5 transition ${
                      viewMode === 'raw' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Code className="w-3.5 h-3.5" />
                    <span>Editor</span>
                  </button>
                  <button
                    onClick={() => setViewMode('highlighted')}
                    className={`px-2.5 py-1 text-xs font-mono rounded-md flex items-center space-x-1.5 transition ${
                      viewMode === 'highlighted' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Flagged Words</span>
                  </button>
                </div>
              )}
            </div>

            {/* Subject & Sender Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                  Subject Header (Optional)
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Urgent: Account Restriction Notice"
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-950/80 border border-slate-800 text-white focus:outline-none focus:border-cyan-500 font-sans"
                />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                  Sender Email / Display (Optional)
                </label>
                <input
                  type="text"
                  value={sender}
                  onChange={(e) => setSender(e.target.value)}
                  placeholder="e.g. alert@security-update.xyz"
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-950/80 border border-slate-800 text-white focus:outline-none focus:border-cyan-500 font-sans"
                />
              </div>
            </div>

            {/* Email Body Text Area or Highlighted View */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-mono uppercase text-slate-400">
                  Full Email Body / Raw Text
                </label>
                <span className="text-[11px] font-mono text-slate-500">
                  {emailText.length} characters · {emailText.split('\n').filter(Boolean).length} lines
                </span>
              </div>

              {viewMode === 'highlighted' && result ? (
                renderHighlightedText()
              ) : (
                <textarea
                  rows={13}
                  value={emailText}
                  onChange={(e) => setEmailText(e.target.value)}
                  placeholder="Paste complete email headers, subject, and body text here for deep heuristic & NLP inspection..."
                  className="w-full p-4 rounded-xl bg-slate-950/90 border border-slate-800 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500 font-mono text-xs leading-relaxed resize-y transition shadow-inner"
                />
              )}
            </div>

            {error && (
              <div className="p-3.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 text-xs flex items-center space-x-2">
                <AlertOctagon className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Analyze Action Button */}
            <div className="pt-2 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-mono hidden sm:inline">
                Zero external telemetry · 100% passive non-invasive inspection
              </span>
              <button
                onClick={handleAnalyze}
                disabled={loading}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-sm shadow-lg shadow-blue-500/30 hover:shadow-cyan-500/40 transition-all duration-200 flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
              >
                <Sparkles className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span>{loading ? 'Evaluating Heuristics...' : 'Analyze Email Transmission'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Threat Assessment Result (5 cols) */}
        <div className="lg:col-span-5">
          {result ? (
            <div className="glass-panel rounded-2xl p-5 space-y-5 animate-fadeIn">
              {/* Classification Badge & Quick Controls */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                    System Verdict
                  </span>
                  <div className="mt-1">
                    {result.classification === 'Phishing' && (
                      <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-red-500/20 text-red-400 border border-red-500/40 shadow-sm shadow-red-500/20">
                        <ShieldAlert className="w-4 h-4" />
                        <span>PHISHING / MALICIOUS</span>
                      </span>
                    )}
                    {result.classification === 'Suspicious' && (
                      <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-sm shadow-amber-500/20">
                        <AlertTriangle className="w-4 h-4" />
                        <span>SUSPICIOUS ANOMALY</span>
                      </span>
                    )}
                    {result.classification === 'Safe' && (
                      <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm shadow-emerald-500/20">
                        <ShieldCheck className="w-4 h-4" />
                        <span>SAFE / LEGITIMATE</span>
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => setShowReportModal(true)}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition"
                >
                  <Download className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Report</span>
                </button>
              </div>

              {/* Gauge & Probabilities Section */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-col items-center">
                <RiskGauge
                  score={result.risk_score}
                  classification={result.classification}
                  size={170}
                />

                {/* Probability Distribution Bar */}
                <div className="w-full mt-4 space-y-2 pt-3 border-t border-slate-800/80">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400">Model Confidence:</span>
                    <span className="text-cyan-400 font-bold">{result.confidence}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden flex">
                    <div
                      style={{ width: `${result.probabilities.safe}%` }}
                      className="bg-emerald-500 h-full"
                      title={`Safe: ${result.probabilities.safe}%`}
                    />
                    <div
                      style={{ width: `${result.probabilities.suspicious}%` }}
                      className="bg-amber-500 h-full"
                      title={`Suspicious: ${result.probabilities.suspicious}%`}
                    />
                    <div
                      style={{ width: `${result.probabilities.phishing}%` }}
                      className="bg-red-500 h-full"
                      title={`Phishing: ${result.probabilities.phishing}%`}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] font-mono text-slate-400 pt-1">
                    <span>Safe: {result.probabilities.safe}%</span>
                    <span>Susp: {result.probabilities.suspicious}%</span>
                    <span>Phish: {result.probabilities.phishing}%</span>
                  </div>
                </div>
              </div>

              {/* Explanation Box */}
              <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80">
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                  Threat Explanation
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {result.explanation}
                </p>
              </div>
            </div>
          ) : (
            <div className="glass-panel rounded-2xl p-8 flex flex-col items-center justify-center text-center h-full min-h-[400px]">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-cyan-400 mb-3">
                <ShieldAlert className="w-7 h-7" />
              </div>
              <h4 className="text-base font-bold text-white tracking-tight">
                Awaiting Transmission
              </h4>
              <p className="text-xs text-slate-400 max-w-xs mt-1">
                Paste raw email content or choose one of the quick test presets above to trigger real-time AI & heuristic detection.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Detailed Analysis Breakdown Cards (Visible when results exist) */}
      {result && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Flagged Heuristic Indicators Card */}
          <div className="glass-panel rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white tracking-tight flex items-center space-x-2">
                <AlertOctagon className="w-4 h-4 text-cyan-400" />
                <span>Identified Phishing Indicators ({result.indicators.length})</span>
              </h3>
              <span className="text-xs font-mono text-slate-500">Heuristic Score: {result.heuristic_score}/100</span>
            </div>

            {result.indicators.length > 0 ? (
              <div className="space-y-3">
                {result.indicators.map((ind, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-100">{ind.title}</span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                        ind.severity === 'High' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}>
                        {ind.severity}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">{ind.explanation}</p>
                    {ind.matches && ind.matches.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {ind.matches.map((m, mi) => (
                          <span key={mi} className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-900 text-cyan-300 border border-slate-800">
                            "{m}"
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-xs text-slate-400 bg-slate-950/40 rounded-xl border border-slate-800">
                No hostile heuristic indicators or credential triggers identified.
              </div>
            )}
          </div>

          {/* Actionable Recommendations & Embedded URLs Card */}
          <div className="glass-panel rounded-2xl p-6 space-y-5">
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight flex items-center space-x-2 mb-3">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Recommended Defense Procedures</span>
              </h3>
              <div className="space-y-2">
                {result.recommended_actions.map((act, i) => (
                  <div key={i} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start space-x-3 text-xs text-slate-300">
                    <span className="w-5 h-5 rounded-full bg-blue-500/20 text-cyan-400 font-mono text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span className="flex-1">{act}</span>
                    <button
                      onClick={() => handleCopyText(act, `act-${i}`)}
                      className="text-slate-400 hover:text-white transition p-1"
                      title="Copy recommendation"
                    >
                      {copiedAction === `act-${i}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Embedded URLs Table if detected */}
            {result.url_analysis && result.url_analysis.length > 0 && (
              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
                  Embedded URLs ({result.url_analysis.length})
                </h4>
                <div className="space-y-2">
                  {result.url_analysis.map((u, i) => (
                    <div key={i} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-col space-y-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-cyan-300 truncate max-w-[240px]">
                          {u.url}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          u.classification === 'Dangerous' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                          u.classification === 'Suspicious' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                          'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        }`}>
                          {u.classification} ({u.risk_score}%)
                        </span>
                      </div>
                      {u.findings && u.findings.length > 0 && (
                        <p className="text-[11px] text-slate-400">
                          {u.findings[0].description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Analysis Report Modal */}
      {showReportModal && result && (
        <ReportModal
          scanData={result}
          onClose={() => setShowReportModal(false)}
        />
      )}
    </div>
  );
}
