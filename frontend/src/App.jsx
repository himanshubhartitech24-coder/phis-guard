import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import EmailAnalyzer from './pages/EmailAnalyzer';
import UrlScanner from './pages/UrlScanner';
import Analytics from './pages/Analytics';
import ScanHistory from './pages/ScanHistory';
import SampleLibrary from './pages/SampleLibrary';
import AboutSecurity from './pages/AboutSecurity';
import ReportModal from './components/ReportModal';
import { checkBackendHealth, getScanById } from './utils/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [backendStatus, setBackendStatus] = useState({ status: 'checking' });
  const [selectedSample, setSelectedSample] = useState(null);
  const [modalScan, setModalScan] = useState(null);

  useEffect(() => {
    const verifyHealth = async () => {
      const res = await checkBackendHealth();
      setBackendStatus(res);
    };
    verifyHealth();
    const interval = setInterval(verifyHealth, 25000);
    return () => clearInterval(interval);
  }, []);

  const handleSelectSample = (sample) => {
    setSelectedSample(sample);
    setActiveTab('analyzer');
  };

  const handleViewScanFromAnywhere = async (scanId) => {
    try {
      const data = await getScanById(scanId);
      setModalScan(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex cyber-grid selection:bg-cyan-500 selection:text-black">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab !== 'analyzer') setSelectedSample(null);
          setActiveTab(tab);
        }}
        backendStatus={backendStatus}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        {/* Top App Header */}
        <Header
          activeTab={activeTab}
          onOpenMobileMenu={() => setIsMobileOpen(true)}
          onQuickScan={() => {
            setSelectedSample(null);
            setActiveTab('analyzer');
          }}
        />

        {/* Dynamic Page Router */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && (
            <Dashboard
              onNavigateToAnalyzer={() => {
                setSelectedSample(null);
                setActiveTab('analyzer');
              }}
              onViewScan={handleViewScanFromAnywhere}
            />
          )}

          {activeTab === 'analyzer' && (
            <EmailAnalyzer
              key={selectedSample ? selectedSample.id : 'fresh'}
              initialEmail={selectedSample}
            />
          )}

          {activeTab === 'url_scanner' && <UrlScanner />}

          {activeTab === 'analytics' && <Analytics />}

          {activeTab === 'history' && <ScanHistory />}

          {activeTab === 'samples' && (
            <SampleLibrary onSelectSample={handleSelectSample} />
          )}

          {activeTab === 'about' && <AboutSecurity />}
        </main>

        {/* Global Footer */}
        <footer className="border-t border-blue-500/10 py-6 px-6 text-center text-xs text-slate-400 font-mono">
          <div className="flex flex-col sm:flex-row items-center justify-between max-w-7xl mx-auto gap-2">
            <span>PhishGuard v1.0 · AI-Powered Email Phishing Detection System</span>
            <span className="text-slate-400">
              Scikit-Learn TF-IDF · Deterministic Heuristics · SQLite Database
            </span>
          </div>
        </footer>
      </div>

      {/* Cross-page view modal */}
      {modalScan && (
        <ReportModal
          scanData={modalScan}
          onClose={() => setModalScan(null)}
        />
      )}
    </div>
  );
}
