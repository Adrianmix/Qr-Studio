import React, { useState, useEffect } from 'react';
import { 
  Download, 
  Copy, 
  Check, 
  Bookmark, 
  RefreshCw, 
  AlertTriangle, 
  Maximize2,
  FileCode,
  FileText,
  FileSpreadsheet
} from 'lucide-react';
import { QRConfig } from '../types';
import { generateSVGString, renderSVGToCanvas } from '../utils/qrGenerator';

interface QRPreviewCardProps {
  config: QRConfig;
  onSaveToHistory: () => void;
  onOpenExportModal: () => void;
}

export const QRPreviewCard: React.FC<QRPreviewCardProps> = ({
  config,
  onSaveToHistory,
  onOpenExportModal,
}) => {
  const [copiedSvg, setCopiedSvg] = useState(false);
  const [copiedImage, setCopiedImage] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const svgString = generateSVGString(config);

  // Copy SVG text to clipboard
  const handleCopySvg = async () => {
    try {
      await navigator.clipboard.writeText(svgString);
      setCopiedSvg(true);
      setTimeout(() => setCopiedSvg(false), 2000);
    } catch (err) {
      console.error('Copy SVG failed', err);
    }
  };

  // Copy PNG image blob to clipboard
  const handleCopyImage = async () => {
    try {
      const tempCanvas = document.createElement('canvas');
      await renderSVGToCanvas(svgString, tempCanvas, 2);
      tempCanvas.toBlob(async (blob) => {
        if (!blob) return;
        try {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
          ]);
          setCopiedImage(true);
          setTimeout(() => setCopiedImage(false), 2000);
        } catch (e) {
          console.error('Clipboard item error', e);
        }
      });
    } catch (err) {
      console.error('Copy image failed', err);
    }
  };

  const handleSave = () => {
    onSaveToHistory();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  // Basic Contrast check hint
  const isDarkFg = config.colors.fgColor.toLowerCase() === '#000000' || config.colors.fgColor.startsWith('#0') || config.colors.fgColor.startsWith('#1');
  const isDarkBg = config.colors.bgColor.toLowerCase() === '#000000' || config.colors.bgColor.startsWith('#0') || config.colors.bgColor.startsWith('#1');
  const lowContrast = isDarkFg && isDarkBg && !config.colors.transparentBg;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col items-center justify-between space-y-6 sticky top-20">
      {/* Title & Status */}
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-xs font-bold text-slate-600 tracking-wider uppercase">Live Vector Preview</span>
        </div>
        <span className="text-[11px] font-mono text-slate-600 bg-slate-100 px-2 py-1 rounded border border-slate-200">
          ECL {config.ecl}
        </span>
      </div>

      {/* Main Interactive QR Box */}
      <div className="relative w-full aspect-square max-w-[320px] bg-slate-50 rounded-2xl p-4 border border-slate-200 flex items-center justify-center overflow-hidden group">
        {/* Render SVG directly inside */}
        <div
          className="w-full h-full flex items-center justify-center transition-transform duration-300 group-hover:scale-105"
          dangerouslySetInnerHTML={{ __html: svgString }}
        />
      </div>

      {/* Contrast Warning Banner if any */}
      {lowContrast && (
        <div className="w-full bg-amber-50 border border-amber-200 rounded-xl p-2.5 flex items-start space-x-2 text-amber-800 text-xs">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <span>Low color contrast detected. Standard smartphone cameras scan best with light background and dark foreground.</span>
        </div>
      )}

      {/* Primary Export & Save Actions */}
      <div className="w-full space-y-2.5">
        <button
          onClick={onOpenExportModal}
          className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow-xs transition-all active:scale-[0.98]"
        >
          <Download className="w-4 h-4" />
          <span>Download High-Res (PNG, SVG, PDF)</span>
        </button>

        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={handleSave}
            className={`flex items-center justify-center space-x-1 py-2 px-2 text-xs font-semibold rounded-lg border transition ${
              savedSuccess
                ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
            }`}
          >
            {savedSuccess ? <Check className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
            <span>{savedSuccess ? 'Saved!' : 'Save'}</span>
          </button>

          <button
            onClick={handleCopyImage}
            className={`flex items-center justify-center space-x-1 py-2 px-2 text-xs font-semibold rounded-lg border transition ${
              copiedImage
                ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
            }`}
          >
            {copiedImage ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedImage ? 'Copied!' : 'Copy PNG'}</span>
          </button>

          <button
            onClick={handleCopySvg}
            className={`flex items-center justify-center space-x-1 py-2 px-2 text-xs font-semibold rounded-lg border transition ${
              copiedSvg
                ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
            }`}
          >
            {copiedSvg ? <Check className="w-3.5 h-3.5" /> : <FileCode className="w-3.5 h-3.5" />}
            <span>{copiedSvg ? 'Copied!' : 'Copy SVG'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
