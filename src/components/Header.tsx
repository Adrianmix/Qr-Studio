import React from 'react';
import { QrCode, Scan, History, Sparkles, Download, Layers } from 'lucide-react';

interface HeaderProps {
  onOpenHistory: () => void;
  onOpenScanner: () => void;
  onOpenExport: () => void;
  savedCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenHistory,
  onOpenScanner,
  onOpenExport,
  savedCount,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 text-slate-900 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo Branding */}
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm">
            <QrCode className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg tracking-tight text-slate-900">
                QR Studio
              </span>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-indigo-50 text-indigo-600 border border-indigo-200 rounded-full">
                PRO STUDIO
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              Vector QR Customizer, Branding & High-Res PDF Export
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Scan QR Modal */}
          <button
            onClick={onOpenScanner}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-sm transition-all"
            title="Scan existing QR Code"
          >
            <Scan className="w-4 h-4 text-emerald-600" />
            <span className="hidden sm:inline">Scan QR</span>
          </button>

          {/* History Drawer Button */}
          <button
            onClick={onOpenHistory}
            className="relative flex items-center space-x-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-sm transition-all"
          >
            <History className="w-4 h-4 text-amber-600" />
            <span className="hidden sm:inline">Saved Library</span>
            {savedCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 text-[10px] font-bold bg-amber-100 text-amber-800 rounded-full border border-amber-200">
                {savedCount}
              </span>
            )}
          </button>

          {/* Quick Export Button */}
          <button
            onClick={onOpenExport}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-all active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>
    </header>
  );
};
