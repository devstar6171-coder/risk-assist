import React, { useState, useCallback, useRef } from 'react';
import { UploadCloud, FileText, ShieldAlert, CheckCircle2, Loader2 } from 'lucide-react';
import { ProcessingStep } from '../types';
import { MOCK_DEFENCE_PROJECT_TEXT } from '../constants';

interface UploaderProps {
  onUploadComplete: (extractedText: string) => void;
}

export const Uploader: React.FC<UploaderProps> = ({ onUploadComplete }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [steps, setSteps] = useState<ProcessingStep[]>([
    { id: 'malware', label: 'Malware & Integrity Scan', status: 'pending', progress: 0 },
    { id: 'pii', label: 'NLP PII Sanitization', status: 'pending', progress: 0 },
    { id: 'normalize', label: 'Data Normalization & Extraction', status: 'pending', progress: 0 },
  ]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const simulateProcessing = async (file: File) => {
    setProcessing(true);
    
    // Helper to update step state
    const updateStep = (id: string, updates: Partial<ProcessingStep>) => {
      setSteps(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
    };

    // 1. Malware Scan
    updateStep('malware', { status: 'running', progress: 20 });
    await new Promise(r => setTimeout(r, 800));
    updateStep('malware', { progress: 100, status: 'complete' });

    // 2. PII Sanitization
    updateStep('pii', { status: 'running', progress: 10 });
    await new Promise(r => setTimeout(r, 1000));
    updateStep('pii', { progress: 100, status: 'complete' });

    // 3. Normalization
    updateStep('normalize', { status: 'running', progress: 30 });
    
    let extractedText = MOCK_DEFENCE_PROJECT_TEXT; // Default fallback

    if (file.type === 'text/plain') {
      try {
        extractedText = await file.text();
      } catch (e) {
        console.error("Failed to read text file", e);
      }
    } else {
      // Simulate OCR/Extraction delay for PDF/Docx
      await new Promise(r => setTimeout(r, 1500));
    }

    updateStep('normalize', { progress: 100, status: 'complete' });
    
    // Brief pause before transitioning
    await new Promise(r => setTimeout(r, 500));
    onUploadComplete(extractedText);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      simulateProcessing(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      simulateProcessing(e.target.files[0]);
    }
  };

  if (processing) {
    return (
      <div className="max-w-2xl mx-auto mt-20 p-8 bg-defence-800 rounded-xl border border-defence-700 shadow-2xl">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
          <ShieldAlert className="text-defence-accent" />
          Secure Ingestion Pipeline
        </h2>
        <div className="space-y-6">
          {steps.map((step) => (
            <div key={step.id} className="space-y-2">
              <div className="flex justify-between text-sm font-medium">
                <span className="flex items-center gap-2">
                  {step.status === 'running' && <Loader2 className="w-4 h-4 animate-spin text-blue-400" />}
                  {step.status === 'complete' && <CheckCircle2 className="w-4 h-4 text-defence-accent" />}
                  {step.status === 'pending' && <div className="w-4 h-4 rounded-full border-2 border-slate-600" />}
                  <span className={step.status === 'pending' ? 'text-slate-400' : 'text-slate-200'}>
                    {step.label}
                  </span>
                </span>
                <span className="text-slate-400">{step.progress}%</span>
              </div>
              <div className="h-2 bg-defence-900 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ease-out ${
                    step.status === 'complete' ? 'bg-defence-accent' : 'bg-blue-500'
                  }`}
                  style={{ width: `${step.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-500 mt-8 text-center">
          Establishing TLS 1.3 connection to isolated AI compute cluster...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-20">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight mb-4">Data Ingestion Portal</h1>
        <p className="text-slate-400 text-lg">Upload project documentation for automated risk analysis and compliance verification.</p>
      </div>

      <div 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`
          relative group cursor-pointer
          border-2 border-dashed rounded-2xl p-16
          flex flex-col items-center justify-center text-center
          transition-all duration-200 ease-in-out
          ${isDragging 
            ? 'border-defence-accent bg-defence-accent/5' 
            : 'border-defence-700 hover:border-slate-500 hover:bg-defence-800/50'
          }
        `}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept=".pdf,.docx,.txt"
          onChange={handleFileInput}
        />
        
        <div className="w-20 h-20 mb-6 rounded-full bg-defence-900 flex items-center justify-center group-hover:scale-110 transition-transform">
          <UploadCloud className={`w-10 h-10 ${isDragging ? 'text-defence-accent' : 'text-slate-400'}`} />
        </div>
        
        <h3 className="text-xl font-semibold mb-2">Drag & Drop Documents</h3>
        <p className="text-slate-400 mb-6">or click to browse local files</p>
        
        <div className="flex gap-4 text-sm text-slate-500">
          <span className="flex items-center gap-1 bg-defence-900 px-3 py-1 rounded-md"><FileText className="w-4 h-4"/> .PDF</span>
          <span className="flex items-center gap-1 bg-defence-900 px-3 py-1 rounded-md"><FileText className="w-4 h-4"/> .DOCX</span>
          <span className="flex items-center gap-1 bg-defence-900 px-3 py-1 rounded-md"><FileText className="w-4 h-4"/> .TXT</span>
        </div>
      </div>
      
      <div className="mt-8 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <p className="text-sm text-amber-200/80">
          <strong>Notice:</strong> All uploads are subject to automated malware scanning and PII sanitization before processing by the Frontier AI Risk Engine.
        </p>
      </div>
    </div>
  );
};
