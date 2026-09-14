import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ContentTypeSelector } from './components/ContentTypeSelector';
import { CustomizerTabs } from './components/CustomizerTabs';
import { QRPreviewCard } from './components/QRPreviewCard';
import { ExportModal } from './components/ExportModal';
import { ScannerModal } from './components/ScannerModal';
import { HistoryDrawer } from './components/HistoryDrawer';
import { QRConfig, ContentType, ContentFormData } from './types';
import { buildPayload } from './components/ContentTypeSelector';

const INITIAL_FORM_DATA: ContentFormData = {
  url: 'enter link url here',
  text: 'Hello from QR Studio!',
  wifiSsid: 'CoffeeShop_Guest_5G',
  wifiPassword: 'coffee_pass_2026',
  wifiEncryption: 'WPA',
  wifiHidden: false,
  vcardFirstName: 'Alex',
  vcardLastName: 'Morgan',
  vcardPhone: '+1 (555) 234-5678',
  vcardEmail: 'alex.morgan@brand.com',
  vcardCompany: 'Creative Design Studio',
  vcardTitle: 'Product Director',
  vcardUrl: 'https://brand.com',
  vcardStreet: '100 Market St',
  vcardCity: 'San Francisco',
  vcardCountry: 'USA',
  emailTo: 'hello@brand.com',
  emailSubject: 'Inquiry from QR Code',
  emailBody: 'Hi! I scanned your QR code and would love to connect.',
  smsPhone: '+15552345678',
  smsMessage: 'JOIN VIP LIST',
  waPhone: '15552345678',
  waMessage: 'Hi! I would like to book a consultation.',
  socialPlatform: 'instagram',
  socialUsername: 'alex_studio',
  cryptoCurrency: 'BTC',
  cryptoAddress: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
  cryptoAmount: '',
};

const INITIAL_CONFIG: QRConfig = {
  id: 'default-config',
  title: 'Website QR Code',
  createdAt: Date.now(),
  contentType: 'url',
  rawPayload: 'enter link url here',
  ecl: 'H',
  size: 300,
  margin: 2,
  moduleStyle: 'rounded',
  colors: {
    fgType: 'linear',
    fgColor: '#4f46e5',
    fgGradientEnd: '#9333ea',
    fgGradientAngle: 45,
    bgType: 'none',
    bgColor: '#ffffff',
    bgGradientEnd: '#ffffff',
    bgGradientAngle: 0,
    transparentBg: false,
    customEyeColors: true,
    eyeOuterColor: '#4338ca',
    eyeInnerColor: '#7e22ce',
  },
  eyes: {
    outerStyle: 'rounded',
    innerStyle: 'dot',
  },
  logo: {
    src: '',
    presetKey: undefined,
    sizeRatio: 0.22,
    padding: 8,
    bgShape: 'circle',
    bgColor: '#ffffff',
    borderColor: '#e2e8f0',
    borderWidth: 1,
    borderRadius: 12,
  },
  frame: {
    style: 'bottom-badge',
    text: 'SCAN ME',
    subtext: 'Point camera to connect',
    textColor: '#ffffff',
    bgColor: '#4f46e5',
    borderColor: '#4f46e5',
    borderWidth: 0,
    fontSize: 13,
    fontFamily: 'sans-serif',
  },
};

export default function App() {
  const [config, setConfig] = useState<QRConfig>(INITIAL_CONFIG);
  const [formData, setFormData] = useState<ContentFormData>(INITIAL_FORM_DATA);

  // Modals and Drawer state
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Saved Items History
  const [savedItems, setSavedItems] = useState<QRConfig[]>(() => {
    try {
      const raw = localStorage.getItem('qr_studio_history');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  // Sync saved history to local storage
  useEffect(() => {
    try {
      localStorage.setItem('qr_studio_history', JSON.stringify(savedItems));
    } catch (e) {
      console.error('Failed to save history to localStorage', e);
    }
  }, [savedItems]);

  // Handle Content Type Change
  const handleChangeContentType = (type: ContentType, newPayload: string) => {
    let defaultTitle = 'Custom QR Code';
    if (type === 'url') defaultTitle = 'Website Link';
    else if (type === 'wifi') defaultTitle = 'Wi-Fi Network Access';
    else if (type === 'vcard') defaultTitle = 'Digital Business Card';
    else if (type === 'social') defaultTitle = 'Social Media Profile';
    else if (type === 'crypto') defaultTitle = 'Crypto Payment Address';

    setConfig((prev) => ({
      ...prev,
      contentType: type,
      rawPayload: newPayload,
      title: defaultTitle,
    }));
  };

  // Handle Form Input Data Change
  const handleChangeFormData = (updatedFormData: ContentFormData, newPayload: string) => {
    setFormData(updatedFormData);
    setConfig((prev) => ({
      ...prev,
      rawPayload: newPayload,
    }));
  };

  // Save current QR Code to History
  const handleSaveToHistory = () => {
    const newItem: QRConfig = {
      ...config,
      id: `qr-${Date.now()}`,
      createdAt: Date.now(),
    };
    setSavedItems((prev) => [newItem, ...prev.filter((i) => i.id !== newItem.id)]);
  };

  // Delete single history item
  const handleDeleteHistoryItem = (id: string) => {
    setSavedItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Clear all history
  const handleClearHistory = () => {
    setSavedItems([]);
  };

  // Apply decoded payload from Scanner
  const handleApplyDecodedPayload = (scannedPayload: string) => {
    setFormData((prev) => ({ ...prev, url: scannedPayload, text: scannedPayload }));
    setConfig((prev) => ({
      ...prev,
      contentType: 'url',
      rawPayload: scannedPayload,
      title: 'Scanned QR Code',
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-indigo-500 selection:text-white antialiased">
      {/* Top Navbar */}
      <Header
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenScanner={() => setIsScannerOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
        savedCount={savedItems.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Row 1: Content Type & Payload Inputs */}
        <section>
          <ContentTypeSelector
            contentType={config.contentType}
            onChangeContentType={handleChangeContentType}
            formData={formData}
            onChangeFormData={handleChangeFormData}
          />
        </section>

        {/* Row 2: Grid with Customization Tabs (Left 2 cols) & Live Preview (Right 1 col) */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Customizer Tabs Column */}
          <div className="lg:col-span-2">
            <CustomizerTabs config={config} onChangeConfig={setConfig} />
          </div>

          {/* Sticky Interactive Preview Column */}
          <div className="lg:col-span-1">
            <QRPreviewCard
              config={config}
              onSaveToHistory={handleSaveToHistory}
              onOpenExportModal={() => setIsExportOpen(true)}
            />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <p>QR Studio • Vector QR Customizer & PDF Generator</p>
      </footer>

      {/* Modals & Drawers */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        config={config}
      />

      <ScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onApplyDecodedPayload={handleApplyDecodedPayload}
      />

      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        savedItems={savedItems}
        onLoadConfig={setConfig}
        onDeleteItem={handleDeleteHistoryItem}
        onClearAll={handleClearHistory}
      />
    </div>
  );
}
