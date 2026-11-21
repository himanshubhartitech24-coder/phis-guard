import React, { useState } from 'react';
import { 
  Globe, 
  Search, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  ArrowRight,
  ExternalLink,
  Lock,
  Unlock,
  Hash,
  AlertOctagon,
  Sparkles
} from 'lucide-react';
import { scanUrlEndpoint } from '../utils/api';

export default function UrlScanner() {
  const [urlInput, setUrlInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const sampleUrls = [
    { label: "IP Hostname Phishing", url: "http://192.168.1.105/paypal/login.php" },
    { label: "Suspicious .xyz TLD", url: "http://boa-secure-verify.xyz/auth?user=492" },
    { label: "Masked URL Shortener", url: "http://bit.ly/hr-portal-secure" },
    { label: "Legitimate GitHub HTTPS", url: "https://github.com/company/api-gateway" }
  ];

  const handleScan = async (targetUrl = null) => {
    const urlToScan = targetUrl || urlInput;
    if (!urlToScan.trim()) {
      setError("Please enter a URL to scan.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await scanUrlEndpoint(urlToScan.trim());
      setResult(data);
    } catch (err) {
      console.error("URL scan error:", err);
      setError(err.message || "Failed to inspect URL.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Intro Header Card */}
      <div className="glass-panel rounded-2xl p-6 relative overflow-hidden bg-gradient-to-r from-blue-950/30 via-slate-900/60 to-cyan-950/20 border border-blue-500/20">
        <div className="max-w-3xl">
          <div className="flex items-center space-x-2 text-cyan-400 text-xs font-mono font-medium mb-1.5">
            <Globe className="w-4 h-4" />
            <span>NON-INVASIVE PASSIVE ENGINE</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Passive URL Threat Inspection
          </h2>
          <p className="text-sm text-slate-300 mt-1">
            Examines lexical composition, IP hostname spoofing, URL shortener redirection patterns, suspicious Top-Level Domains, and Shannon entropy without sending outbound network traffic to untrusted domains.
          </p>
        </div>
      </div>

      {/* URL Input & Quick Presets */}
      <div className="glass-panel rounded-2xl p-6 space-y-4">
        <label className="block text-xs font-mono uppercase text-slate-400">
          Target URL Address for Passive Inspection
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Globe className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleScan()}
              placeholder="e.g. http://paypal-security-update-center.com/login?token=8923"
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-950/80 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 font-mono text-xs sm:text-sm"
            />
          </div>
          <button
            onClick={() => handleScan()}
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-blue-500/30 transition flex items-center justify-center space-x-2 shrink-0 cursor-pointer disabled:opacity-50"
          >
            <Search className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Inspecting Lexicals...' : 'Scan URL'}</span>
          </button>
        </div>

        {/* Quick presets */}
        <div className="pt-2 flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono text-slate-500 mr-1">Presets:</span>
          {sampleUrls.map((s, idx) => (
            <button
              key={idx}
              onClick={() => {
                setUrlInput(s.url);
                handleScan(s.url);
              }}
              className="px-2.5 py-1 rounded-lg text-xs font-mono bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-cyan-400 border border-slate-800 transition"
            >
              {s.label}
            </button>
          ))}
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 text-xs flex items-center space-x-2">
            <AlertOctagon className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* URL Scan Results */}
      {result && (
        <div className="glass-panel rounded-2xl p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <span className="text-xs font-mono uppercase text-slate-400">Inspected Endpoint</span>
              <p className="text-base font-mono font-bold text-white break-all mt-0.5">
                {result.url}
              </p>
            </div>

            <div className="shrink-0">
              {result.classification === 'Dangerous' && (
                <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-red-500/20 text-red-400 border border-red-500/40">
                  <ShieldAlert className="w-4 h-4" />
                  <span>DANGEROUS PHISHING ENDPOINT</span>
                </span>
              )}
              {result.classification === 'Suspicious' && (
                <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/40">
                  <AlertTriangle className="w-4 h-4" />
                  <span>SUSPICIOUS PATTERNS</span>
                </span>
              )}
              {result.classification === 'Safe' && (
                <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                  <ShieldCheck className="w-4 h-4" />
                  <span>CLEAN DESTINATION</span>
                </span>
              )}
            </div>
          </div>

          {/* Lexical Diagnostics Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
              <span className="text-[10px] font-mono uppercase text-slate-400">Risk Score</span>
              <div className={`text-xl font-bold font-mono mt-1 ${
                result.risk_score >= 65 ? 'text-red-400' : result.risk_score >= 30 ? 'text-amber-400' : 'text-emerald-400'
              }`}>
                {result.risk_score} / 100
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
              <span className="text-[10px] font-mono uppercase text-slate-400">Protocol Security</span>
              <div className="text-xl font-bold font-mono mt-1 flex items-center space-x-1 text-slate-200">
                {result.protocol === 'https' ? (
                  <>
                    <Lock className="w-4 h-4 text-emerald-400" />
                    <span>HTTPS</span>
                  </>
                ) : (
                  <>
                    <Unlock className="w-4 h-4 text-red-400" />
                    <span>HTTP (Plain)</span>
                  </>
                )}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
              <span className="text-[10px] font-mono uppercase text-slate-400">Top-Level Domain</span>
              <div className="text-xl font-bold font-mono mt-1 text-cyan-400">
                .{result.tld || 'none'}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
              <span className="text-[10px] font-mono uppercase text-slate-400">Shannon Entropy</span>
              <div className="text-xl font-bold font-mono mt-1 text-purple-400">
                {result.entropy} <span className="text-xs text-slate-500">bits</span>
              </div>
            </div>
          </div>

          {/* Identified Findings List */}
          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-3">
              Identified Security Indicators & Structural Risk Factors
            </h3>
            {result.findings && result.findings.length > 0 ? (
              <div className="space-y-2.5">
                {result.findings.map((f, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-start space-x-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase shrink-0 mt-0.5 ${
                      f.severity === 'High' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}>
                      {f.severity}
                    </span>
                    <div className="text-xs">
                      <span className="font-mono text-slate-300 font-semibold">{f.code}: </span>
                      <span className="text-slate-400">{f.description}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 text-xs text-slate-400">
                No hostile lexical markers, IP anomalies, or suspicious TLD risks found on this URL.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
