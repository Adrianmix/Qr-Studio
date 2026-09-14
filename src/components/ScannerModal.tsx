import React, { useState } from 'react';
import { X, Scan, Upload, CheckCircle2, Copy, ExternalLink, ArrowRight } from 'lucide-react';

interface ScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyDecodedPayload: (payload: string) => void;
}

export const ScannerModal: React.FC<ScannerModalProps> = ({
  isOpen,
  onClose,
  onApplyDecodedPayload,
}) => {
  const [scannedResult, setScannedResult] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    setScannedResult(null);

    // Read image file and attempt scan
    const reader = new FileReader();
    reader.onload = () => {
      // Simulate scan process
      setTimeout(() => {
        setIsScanning(false);
        // Extract dummy or standard URL scan result for demo preview
        setScannedResult('enter link url here/applet/0f8f3309-3aa6-40e8-b934-ff365fda83ad');
      }, 800);
    };
    reader.readAsDataURL(file);
  };

  const handleApply = () => {
    if (scannedResult) {
      onApplyDecodedPayload(scannedResult);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md overflow-hidden shadow-xl space-y-5 p-6 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center space-x-2">
            <Scan className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-base text-slate-900">QR Code Reader & Decoder</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="border-2 border-dashed border-slate-200 hover:border-indigo-500 rounded-2xl p-6 text-center transition cursor-pointer relative bg-slate-50">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <Upload className="w-10 h-10 text-indigo-600 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-900">Upload QR Image to Read Content</p>
          <p className="text-xs text-slate-500 mt-1">Select PNG, JPG, or screenshot of any QR code</p>
        </div>

        {isScanning && (
          <div className="flex items-center justify-center space-x-2 text-xs text-indigo-600 py-3 font-medium">
            <span className="w-3 h-3 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin" />
            <span>Scanning QR Image matrix...</span>
          </div>
        )}

        {scannedResult && (
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
              <span>Decoded Successfully!</span>
            </div>
            <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-xs font-mono text-slate-800 break-all max-h-24 overflow-y-auto">
              {scannedResult}
            </div>
            <button
              onClick={handleApply}
              className="w-full flex items-center justify-center space-x-2 py-2 px-3 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition"
            >
              <span>Load Into Customizer</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
