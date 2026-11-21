import React from 'react';
import { Menu, ShieldAlert, Sparkles, Terminal, Bell } from 'lucide-react';

export default function Header({ activeTab, onOpenMobileMenu, onQuickScan }) {
  const titles = {
    dashboard: { title: 'Security Dashboard', desc: 'Real-time telemetry, email threat distribution, and system overview' },
    analyzer: { title: 'AI Email Threat Analyzer', desc: 'Deep linguistic inspection, credential lure parsing, and heuristic scoring' },
    url_scanner: { title: 'URL Security Scanner', desc: 'Passive lexical inspection, domain entropy, and TLD reputation checks' },
    analytics: { title: 'Threat Analytics & Metrics', desc: 'Telemetry charts, attack vector classifications, and detection confidence' },
    history: { title: 'Scan History Archive', desc: 'Audited log of analyzed email transmissions and threat verdicts' },
    samples: { title: 'Attack Vector Library', desc: 'Curated real-world and synthetic phishing lures for testing' },
    about: { title: 'System Architecture & Policies', desc: 'Technical documentation, ML methodology, and ethical testing standards' }
  };

  const current = titles[activeTab] || titles.dashboard;

  return (
    <header className="h-20 border-b border-blue-500/15 bg-[#0a0f1d]/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center space-x-4">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          aria-label="Open navigation"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center space-x-2">
            <span>{current.title}</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5 hidden sm:block">
            {current.desc}
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-300 font-mono">
          <Terminal className="w-3.5 h-3.5 text-cyan-400" />
          <span>PORT 5050 · REST API</span>
        </div>

        {activeTab !== 'analyzer' && (
          <button
            onClick={onQuickScan}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-medium text-xs sm:text-sm shadow-lg shadow-blue-600/30 transition-all duration-200"
          >
            <Sparkles className="w-4 h-4" />
            <span className="hidden sm:inline">Analyze Email</span>
            <span className="sm:hidden">Scan</span>
          </button>
        )}
      </div>
    </header>
  );
}
