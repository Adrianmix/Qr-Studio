import React, { useState } from 'react';
import { X, Download, FileImage, FileCode, FileText, Check, Printer } from 'lucide-react';
import { QRConfig } from '../types';
import { generateSVGString, renderSVGToCanvas, exportToPDF } from '../utils/qrGenerator';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: QRConfig;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, config }) => {
  const [format, setFormat] = useState<'png' | 'svg' | 'pdf'>('png');
  const [scale, setScale] = useState<number>(4); // default 4x (1600px HD)
  const [pdfLayout, setPdfLayout] = useState<'card' | 'standee' | 'sticker-sheet'>('card');
  const [fileName, setFileName] = useState<string>(config.title || 'custom-qr-code');
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleExport = async () => {
    setIsExporting(true);
    setDownloadSuccess(false);

    try {
      const cleanFileName = fileName.trim().replace(/[^a-z0-9_-]/gi, '_') || 'qr-code';
      const svgString = generateSVGString(config);

      if (format === 'svg') {
        const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${cleanFileName}.svg`;
        a.click();
        URL.revokeObjectURL(url);
      } else if (format === 'png') {
        const canvas = document.createElement('canvas');
        await renderSVGToCanvas(svgString, canvas, scale);
        const dataUrl = canvas.toDataURL('image/png');
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = `${cleanFileName}-${scale}x.png`;
        a.click();
      } else if (format === 'pdf') {
        await exportToPDF(config, pdfLayout, fileName);
      }

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 2500);
    } catch (err) {
      console.error('Export error:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg overflow-hidden shadow-xl space-y-5 p-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center space-x-2">
            <Download className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-base text-slate-900">Export QR Code</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* File Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">File Identifier Name</label>
          <input
            type="text"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            placeholder="my-qr-code"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* Format Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-2">Export Format</label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'png', label: 'PNG Image', icon: FileImage, sub: 'Web & Print' },
              { id: 'svg', label: 'SVG Vector', icon: FileCode, sub: 'Infinite scale' },
              { id: 'pdf', label: 'PDF Document', icon: FileText, sub: 'Printable sheets' },
            ].map((item) => {
              const Icon = item.icon;
              const isSel = format === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setFormat(item.id as any)}
                  className={`p-3 rounded-xl border text-left flex flex-col justify-between transition ${
                    isSel
                      ? 'bg-indigo-50 border-indigo-600 text-indigo-700 shadow-xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`w-5 h-5 mb-2 ${isSel ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <div>
                    <span className="font-bold text-xs block text-slate-900">{item.label}</span>
                    <span className="text-[10px] text-slate-500">{item.sub}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* PNG Resolution Scale Options */}
        {format === 'png' && (
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <div className="flex justify-between text-xs text-slate-700">
              <span className="font-semibold">Resolution Quality</span>
              <span className="text-indigo-600 font-mono font-bold">
                {scale === 1 && 'Standard (400x400 px)'}
                {scale === 2 && 'HD Web (800x800 px)'}
                {scale === 4 && '4K Print Quality (1600x1600 px)'}
                {scale === 8 && 'Ultra Poster Print (3200x3200 px)'}
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 4, 8].map((s) => (
                <button
                  key={s}
                  onClick={() => setScale(s)}
                  className={`py-2 text-xs font-bold rounded-lg border ${
                    scale === s
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>
        )}

        {/* PDF Layout Options */}
        {format === 'pdf' && (
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">Print Layout Type</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'card', label: 'Printable Card' },
                { id: 'standee', label: 'Table Standee' },
                { id: 'sticker-sheet', label: '6-Grid Sticker Sheet' },
              ].map((layout) => (
                <button
                  key={layout.id}
                  onClick={() => setPdfLayout(layout.id as any)}
                  className={`py-2 px-2 text-xs font-semibold rounded-lg border text-center ${
                    pdfLayout === layout.id
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {layout.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Action Controls */}
        <div className="pt-2 flex items-center space-x-3">
          <button
            onClick={onClose}
            className="w-1/3 py-2.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="w-2/3 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition flex items-center justify-center space-x-2"
          >
            {downloadSuccess ? (
              <>
                <Check className="w-4 h-4 text-white" />
                <span>Downloaded!</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>{isExporting ? 'Generating...' : `Download ${format.toUpperCase()}`}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
