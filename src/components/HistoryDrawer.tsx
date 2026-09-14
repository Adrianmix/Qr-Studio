import React from 'react';
import { X, Trash2, RotateCcw, Download, Calendar, ArrowRight } from 'lucide-react';
import { QRConfig } from '../types';
import { generateSVGString } from '../utils/qrGenerator';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedItems: QRConfig[];
  onLoadConfig: (config: QRConfig) => void;
  onDeleteItem: (id: string) => void;
  onClearAll: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  savedItems,
  onLoadConfig,
  onDeleteItem,
  onClearAll,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white border-l border-slate-200 w-full max-w-md h-full flex flex-col justify-between shadow-xl p-6 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div>
            <h3 className="font-bold text-base text-slate-900">Saved QR Codes</h3>
            <p className="text-xs text-slate-500">{savedItems.length} items in your local library</p>
          </div>
          <div className="flex items-center space-x-2">
            {savedItems.length > 0 && (
              <button
                onClick={onClearAll}
                className="text-xs text-rose-600 hover:text-rose-700 px-2 py-1 bg-rose-50 hover:bg-rose-100 rounded border border-rose-200 transition"
              >
                Clear All
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* List of Saved Items */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3 pr-1">
          {savedItems.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                <RotateCcw className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium text-slate-700">No saved QR codes yet</p>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Customize a QR code and click "Save" on the live preview card to store it here.
              </p>
            </div>
          ) : (
            savedItems.map((item) => {
              const svgThumb = generateSVGString(item);
              const dateStr = new Date(item.createdAt).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });

              return (
                <div
                  key={item.id}
                  className="bg-slate-50 border border-slate-200 hover:border-indigo-500 rounded-xl p-3 flex items-center space-x-3 transition group"
                >
                  {/* Thumbnail SVG */}
                  <div
                    className="w-16 h-16 bg-white rounded-lg p-1 border border-slate-200 shrink-0 flex items-center justify-center overflow-hidden"
                    dangerouslySetInnerHTML={{ __html: svgThumb }}
                  />

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-xs text-slate-900 truncate">{item.title || 'Untitled QR'}</h4>
                    <p className="text-[11px] text-slate-500 truncate">{item.rawPayload}</p>
                    <span className="text-[10px] text-slate-400 flex items-center space-x-1 mt-1">
                      <Calendar className="w-3 h-3" />
                      <span>{dateStr}</span>
                    </span>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => {
                        onLoadConfig(item);
                        onClose();
                      }}
                      className="p-1.5 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition"
                      title="Load into Editor"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteItem(item.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                      title="Delete saved item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
