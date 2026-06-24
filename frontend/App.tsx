import React, { useState, useCallback } from 'react';
import { Shield, Loader2, AlertTriangle } from 'lucide-react';
import { AppState, RiskItem } from './types';
import { Uploader } from './components/Uploader';
import { Dashboard } from './components/Dashboard';
import { Triage } from './components/Triage';
import { analyzeProjectText } from './services/geminiService';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('upload');
  const [risks, setRisks] = useState<RiskItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleUploadComplete = useCallback(async (extractedText: string) => {
    setAppState('processing');
    setError(null);
    try {
      const generatedRisks = await analyzeProjectText(extractedText);
      setRisks(generatedRisks);
      setAppState('dashboard');
    } catch (err: any) {
      setError(err.message || "An unknown error occurred during analysis.");
      setAppState('upload'); // Go back to upload on error
    }
  }, []);

  const handleArchiveRisk = useCallback((id: string) => {
    setRisks(prev => prev.map(r => r.id === id ? { ...r, status: 'archived' } : r));
  }, []);

  const handleBaselineRisk = useCallback((id: string) => {
    setRisks(prev => prev.map(r => r.id === id ? { ...r, status: 'baselined' } : r));
  }, []);

  const resetApp = () => {
    setRisks([]);
    setAppState('upload');
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-defence-900 border-b border-defence-800 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={resetApp}>
            <div className="bg-defence-accent/10 p-2 rounded-lg border border-defence-accent/20">
              <Shield className="w-6 h-6 text-defence-accent" />
            </div>
            <div>
              <h1 className="font-bold text-xl tracking-tight text-slate-100 leading-none">Team Oscar</h1>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Frontier AI Risk Engine</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-sm font-medium text-slate-400">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-defence-accent animate-pulse"></span>
              System Online
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        
        {error && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-red-400">Analysis Failed</h3>
              <p className="text-sm text-red-200/80 mt-1">{error}</p>
            </div>
          </div>
        )}

        {appState === 'upload' && (
          <Uploader onUploadComplete={handleUploadComplete} />
        )}

        {appState === 'processing' && (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full"></div>
              <Loader2 className="w-16 h-16 text-blue-400 animate-spin relative z-10" />
            </div>
            <h2 className="text-2xl font-bold mb-2">FAIRE Engine Active</h2>
            <p className="text-slate-400 max-w-md">
              Performing contextual deep parsing, cross-referencing defence taxonomies, and synthesizing mitigation strategies...
            </p>
          </div>
        )}

        {appState === 'dashboard' && (
          <Dashboard 
            risks={risks} 
            onArchive={handleArchiveRisk} 
            onBaseline={handleBaselineRisk}
            onStartTriage={() => setAppState('triage')}
          />
        )}

        {appState === 'triage' && (
          <Triage 
            risks={risks}
            onArchive={handleArchiveRisk}
            onBaseline={handleBaselineRisk}
            onExit={() => setAppState('dashboard')}
          />
        )}

      </main>
    </div>
  );
};

export default App;
