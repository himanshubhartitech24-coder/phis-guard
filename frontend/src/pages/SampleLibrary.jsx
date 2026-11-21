import React, { useState } from 'react';
import { 
  FolderGit2, 
  MailSearch, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  ArrowRight,
  Copy,
  Check,
  Tag
} from 'lucide-react';
import { SAMPLE_EMAILS } from '../utils/sampleEmails';

export default function SampleLibrary({ onSelectSample }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [copiedId, setCopiedId] = useState(null);

  const categories = ['all', 'Phishing', 'Suspicious', 'Safe'];

  const filtered = activeCategory === 'all' 
    ? SAMPLE_EMAILS 
    : SAMPLE_EMAILS.filter(s => s.category.toLowerCase() === activeCategory.toLowerCase());

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-panel rounded-2xl p-6 relative overflow-hidden bg-gradient-to-r from-blue-950/40 via-slate-900/60 to-cyan-950/20 border border-blue-500/20">
        <div className="max-w-3xl">
          <div className="flex items-center space-x-2 text-cyan-400 text-xs font-mono font-medium mb-1.5">
            <FolderGit2 className="w-4 h-4" />
            <span>CURATED THREAT BENCHMARK DATASET</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Synthetic & Real-World Attack Vector Corpus
          </h2>
          <p className="text-sm text-slate-300 mt-1">
            Explore authentic phishing archetypes (credential harvesting, BEC wire fraud, cryptojacking, invoice spoofing) alongside legitimate corporate communications for interactive benchmark testing.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2">
        <span className="text-xs font-mono text-slate-400 mr-2">Filter Category:</span>
        <div className="flex rounded-xl bg-slate-900 border border-slate-800 p-0.5 text-xs font-mono">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg capitalize transition ${
                activeCategory === cat ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              {cat === 'all' ? 'All Datasets' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Samples Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((sample) => {
          let badge = (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center space-x-1">
              <ShieldCheck className="w-3 h-3" />
              <span>Safe / Legitimate</span>
            </span>
          );
          if (sample.category === 'Phishing') {
            badge = (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-red-500/15 text-red-400 border border-red-500/30 flex items-center space-x-1">
                <ShieldAlert className="w-3 h-3" />
                <span>Phishing Threat</span>
              </span>
            );
          } else if (sample.category === 'Suspicious') {
            badge = (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center space-x-1">
                <AlertTriangle className="w-3 h-3" />
                <span>Suspicious</span>
              </span>
            );
          }

          return (
            <div 
              key={sample.id}
              className="glass-panel glass-panel-hover rounded-2xl p-5 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  {badge}
                  <button
                    onClick={() => handleCopy(sample.text, sample.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                    title="Copy text to clipboard"
                  >
                    {copiedId === sample.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white tracking-tight">
                    {sample.title}
                  </h3>
                  <div className="text-[11px] font-mono text-cyan-400 truncate mt-1">
                    {sample.sender}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 font-mono text-[11px] text-slate-300 line-clamp-4 leading-relaxed">
                  {sample.text}
                </div>

                {sample.highlights && sample.highlights.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {sample.highlights.slice(0, 3).map((h, i) => (
                      <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800 truncate max-w-[150px]">
                        {h}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Button */}
              <button
                onClick={() => onSelectSample(sample)}
                className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-medium text-xs flex items-center justify-center space-x-1.5 shadow-md shadow-blue-500/20 transition cursor-pointer"
              >
                <MailSearch className="w-3.5 h-3.5" />
                <span>Load in Analyzer</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
