import React, { useState, useMemo } from 'react';
import { RiskItem, RiskCategory } from '../types';
import { RiskCard } from './RiskCard';
import { Filter, Download, PlayCircle, LayoutGrid, List } from 'lucide-react';

interface DashboardProps {
  risks: RiskItem[];
  onArchive: (id: string) => void;
  onBaseline: (id: string) => void;
  onStartTriage: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ risks, onArchive, onBaseline, onStartTriage }) => {
  const [selectedCategory, setSelectedCategory] = useState<RiskCategory | 'ALL'>('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const activeRisks = risks.filter(r => r.status === 'active');
  const baselinedRisks = risks.filter(r => r.status === 'baselined');
  
  const filteredRisks = useMemo(() => {
    let filtered = activeRisks;
    if (selectedCategory !== 'ALL') {
      filtered = filtered.filter(r => r.category === selectedCategory);
    }
    return filtered;
  }, [activeRisks, selectedCategory]);

  const categories = Object.values(RiskCategory);

  const handleExport = () => {
    const exportData = {
      generatedAt: new Date().toISOString(),
      classification: "OFFICIAL-SENSITIVE",
      baselinedRisks: baselinedRisks,
      activeRisks: activeRisks
    };
    
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", "FAIRE_Risk_Baseline.json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-defence-800 p-4 rounded-xl border border-defence-700">
        <div className="flex items-center gap-4 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
          <div className="flex items-center gap-2 text-slate-400 mr-2 shrink-0">
            <Filter className="w-4 h-4" />
            <span className="text-sm font-medium">Filter:</span>
          </div>
          <select 
            className="bg-defence-900 border border-defence-700 text-slate-200 text-sm rounded-lg focus:ring-defence-accent focus:border-defence-accent block p-2.5 outline-none"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as RiskCategory | 'ALL')}
          >
            <option value="ALL">All Categories ({activeRisks.length})</option>
            {categories.map(cat => {
              const count = activeRisks.filter(r => r.category === cat).length;
              return count > 0 ? <option key={cat} value={cat}>{cat} ({count})</option> : null;
            })}
          </select>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <div className="flex bg-defence-900 rounded-lg p-1 border border-defence-700 mr-2">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-defence-700 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-defence-700 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <button 
            onClick={onStartTriage}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <PlayCircle className="w-4 h-4" />
            Start Triage
          </button>
          <button 
            onClick={handleExport}
            disabled={baselinedRisks.length === 0 && activeRisks.length === 0}
            className="flex items-center gap-2 bg-defence-700 hover:bg-defence-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <Download className="w-4 h-4" />
            Export Baseline
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-defence-800 p-4 rounded-xl border border-defence-700 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-slate-200">{activeRisks.length}</span>
          <span className="text-xs text-slate-400 uppercase tracking-wider mt-1">Active Risks</span>
        </div>
        <div className="bg-defence-800 p-4 rounded-xl border border-defence-700 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-defence-accent">{baselinedRisks.length}</span>
          <span className="text-xs text-slate-400 uppercase tracking-wider mt-1">Baselined</span>
        </div>
        <div className="bg-defence-800 p-4 rounded-xl border border-defence-700 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-slate-500">{risks.filter(r => r.status === 'archived').length}</span>
          <span className="text-xs text-slate-400 uppercase tracking-wider mt-1">Archived</span>
        </div>
      </div>

      {/* Risk Grid/List */}
      {filteredRisks.length === 0 ? (
        <div className="text-center py-20 bg-defence-800/50 rounded-xl border border-defence-700 border-dashed">
          <p className="text-slate-400">No active risks found for this category.</p>
        </div>
      ) : (
        <div className={viewMode === 'grid' ? "grid grid-cols-1 xl:grid-cols-2 gap-6" : "flex flex-col gap-4"}>
          {filteredRisks.map(risk => (
            <RiskCard 
              key={risk.id} 
              risk={risk} 
              onArchive={onArchive} 
              onBaseline={onBaseline}
              compact={viewMode === 'list'}
            />
          ))}
        </div>
      )}
    </div>
  );
};
