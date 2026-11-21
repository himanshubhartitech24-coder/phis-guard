import React from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Lock, 
  Cpu, 
  Database, 
  FileCode2, 
  CheckCircle2, 
  AlertTriangle,
  Layers,
  Terminal
} from 'lucide-react';

export default function AboutSecurity() {
  const securityRules = [
    {
      title: "No Credential Solicitation",
      desc: "PhishGuard never asks for, records, stores, or transmits real passwords, credit cards, or MFA OTP tokens.",
      icon: Lock,
      status: "Compliant"
    },
    {
      title: "Passive, Non-Invasive URL Inspection",
      desc: "The URL engine performs lexical parsing and entropy checks offline. It strictly avoids making network connections to untrusted endpoints.",
      icon: ShieldCheck,
      status: "Compliant"
    },
    {
      title: "Synthetic & Safe Demonstration Data",
      desc: "All presets and sample benchmarks utilize sanitized synthetic mock domains and simulated threat lures.",
      icon: FileCode2,
      status: "Compliant"
    },
    {
      title: "Clear Automated Assessment Disclaimers",
      desc: "Classifications and risk scores are automated assistive indicators intended for human SOC verification, not definitive legal verdicts.",
      icon: AlertTriangle,
      status: "Compliant"
    }
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="glass-panel rounded-2xl p-6 relative overflow-hidden bg-gradient-to-r from-blue-950/40 via-slate-900/60 to-cyan-950/20 border border-blue-500/20">
        <div className="max-w-2xl">
          <div className="flex items-center space-x-2 text-cyan-400 text-xs font-mono font-medium mb-1.5">
            <Cpu className="w-4 h-4" />
            <span>SYSTEM ARCHITECTURE & ETHICAL PROTOCOLS</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            About PhishGuard
          </h2>
          <p className="text-sm text-slate-300 mt-1">
            An enterprise-grade, explainable cybersecurity platform fusing Natural Language Processing, statistical classification, and deterministic heuristic triggers.
          </p>
        </div>
      </div>

      {/* Security Policies Grid */}
      <div className="glass-panel rounded-2xl p-6 space-y-4">
        <h3 className="text-base font-bold text-white tracking-tight flex items-center space-x-2">
          <ShieldAlert className="w-4 h-4 text-cyan-400" />
          <span>Security & Ethical Operating Requirements</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {securityRules.map((rule, idx) => {
            const Icon = rule.icon;
            return (
              <div key={idx} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-100 text-xs sm:text-sm flex items-center space-x-2">
                    <Icon className="w-4 h-4 text-cyan-400" />
                    <span>{rule.title}</span>
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    {rule.status}
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {rule.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Technical Architecture */}
      <div className="glass-panel rounded-2xl p-6 space-y-4">
        <h3 className="text-base font-bold text-white tracking-tight flex items-center space-x-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          <span>Detection Engine Mechanics</span>
        </h3>

        <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <h4 className="font-mono text-cyan-400 font-bold mb-1">1. TF-IDF Text Vectorization</h4>
            <p className="text-slate-400">
              Tokenizes incoming email strings into unigrams and bigrams with sublinear term-frequency scaling. Weights rare discriminative tokens (e.g. "unauthorized login", "confidential wire", "account suspended") over generic corporate phrases.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <h4 className="font-mono text-cyan-400 font-bold mb-1">2. Calibrated Scikit-Learn Classifier</h4>
            <p className="text-slate-400">
              Computes balanced posterior probability distributions across Safe, Suspicious, and Phishing classes. Leverages regularized Logistic Regression with class-weight balancing.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <h4 className="font-mono text-cyan-400 font-bold mb-1">3. Deterministic Heuristic Fusion</h4>
            <p className="text-slate-400">
              Scans for explicit structural threat patterns: urgency panic triggers, fake login requests, OTP/password solicitations, and financial scams. The final Risk Score dynamically blends ML confidence (55%) with heuristic weight (45%).
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <h4 className="font-mono text-cyan-400 font-bold mb-1">4. Passive URL Security Engine</h4>
            <p className="text-slate-400">
              Calculates domain Shannon entropy, tests for raw IP hostnames, checks for low-reputation TLDs, and detects known URL shorteners—without making network socket calls to external origins.
            </p>
          </div>
        </div>
      </div>

      {/* Technology Stack Badges */}
      <div className="glass-panel rounded-2xl p-6">
        <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-3">
          Technology Stack
        </h3>
        <div className="flex flex-wrap gap-2">
          {[
            "React.js 18",
            "Tailwind CSS",
            "Python 3.11",
            "Flask REST API",
            "Scikit-learn",
            "TF-IDF Vectorizer",
            "SQLite 3",
            "Chart.js",
            "Lucide React",
            "Vite"
          ].map((tech, i) => (
            <span key={i} className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-cyan-300">
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
