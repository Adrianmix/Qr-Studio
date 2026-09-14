import React from 'react';
import { 
  Globe, 
  FileText, 
  Wifi, 
  User, 
  Mail, 
  MessageSquare, 
  Send, 
  Share2, 
  Coins,
  CheckCircle2
} from 'lucide-react';
import { ContentType, ContentFormData } from '../types';

interface ContentTypeSelectorProps {
  contentType: ContentType;
  onChangeContentType: (type: ContentType, newPayload: string) => void;
  formData: ContentFormData;
  onChangeFormData: (newFormData: ContentFormData, newPayload: string) => void;
}

export const CONTENT_TYPES: { id: ContentType; label: string; icon: React.FC<{ className?: string }> }[] = [
  { id: 'url', label: 'Website URL', icon: Globe },
  { id: 'text', label: 'Plain Text', icon: FileText },
  { id: 'wifi', label: 'Wi-Fi Network', icon: Wifi },
  { id: 'vcard', label: 'Contact vCard', icon: User },
  { id: 'email', label: 'Send Email', icon: Mail },
  { id: 'sms', label: 'SMS Message', icon: MessageSquare },
  { id: 'whatsapp', label: 'WhatsApp Chat', icon: Send },
  { id: 'social', label: 'Social Profile', icon: Share2 },
  { id: 'crypto', label: 'Crypto Address', icon: Coins },
];

export function buildPayload(type: ContentType, data: ContentFormData): string {
  switch (type) {
    case 'url':
      let url = data.url.trim();
      if (!url) return 'enter link url here';
      if (!/^https?:\/\//i.test(url)) {
        url = 'https://' + url;
      }
      return url;

    case 'text':
      return data.text || 'Hello from QR Studio!';

    case 'wifi':
      const ssid = data.wifiSsid || 'MyCoffeeShop_WiFi';
      const enc = data.wifiEncryption || 'WPA';
      const pass = data.wifiPassword || '';
      const hidden = data.wifiHidden ? 'true' : 'false';
      return `WIFI:S:${ssid};T:${enc};P:${pass};H:${hidden};;`;

    case 'vcard':
      const fn = data.vcardFirstName || 'Alex';
      const ln = data.vcardLastName || 'Morgan';
      return [
        'BEGIN:VCARD',
        'VERSION:3.0',
        `N:${ln};${fn};;;`,
        `FN:${fn} ${ln}`,
        data.vcardCompany ? `ORG:${data.vcardCompany}` : '',
        data.vcardTitle ? `TITLE:${data.vcardTitle}` : '',
        data.vcardPhone ? `TEL;TYPE=CELL:${data.vcardPhone}` : '',
        data.vcardEmail ? `EMAIL:${data.vcardEmail}` : '',
        data.vcardUrl ? `URL:${data.vcardUrl}` : '',
        data.vcardCity || data.vcardCountry ? `ADR:;;${data.vcardStreet || ''};${data.vcardCity || ''};;;${data.vcardCountry || ''}` : '',
        'END:VCARD',
      ].filter(Boolean).join('\n');

    case 'email':
      const mailto = data.emailTo || 'contact@example.com';
      const sub = encodeURIComponent(data.emailSubject || '');
      const body = encodeURIComponent(data.emailBody || '');
      return `mailto:${mailto}?subject=${sub}&body=${body}`;

    case 'sms':
      const phone = data.smsPhone || '+1234567890';
      const msg = data.smsMessage || '';
      return `smsto:${phone}:${msg}`;

    case 'whatsapp':
      const waNum = (data.waPhone || '1234567890').replace(/[^\d]/g, '');
      const waMsg = encodeURIComponent(data.waMessage || '');
      return `https://wa.me/${waNum}${waMsg ? '?text=' + waMsg : ''}`;

    case 'social':
      const platform = data.socialPlatform || 'instagram';
      const user = (data.socialUsername || 'myusername').replace(/^@/, '');
      if (platform === 'twitter') return `https://x.com/${user}`;
      if (platform === 'youtube') return `https://youtube.com/@${user}`;
      if (platform === 'linkedin') return `https://linkedin.com/in/${user}`;
      if (platform === 'tiktok') return `https://tiktok.com/@${user}`;
      if (platform === 'spotify') return `https://open.spotify.com/user/${user}`;
      return `https://instagram.com/${user}`;

    case 'crypto':
      const curr = (data.cryptoCurrency || 'BTC').toLowerCase();
      const addr = data.cryptoAddress || '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa';
      const amt = data.cryptoAmount ? `?amount=${data.cryptoAmount}` : '';
      return `${curr}:${addr}${amt}`;

    default:
      return 'enter link url here';
  }
}

export const ContentTypeSelector: React.FC<ContentTypeSelectorProps> = ({
  contentType,
  onChangeContentType,
  formData,
  onChangeFormData,
}) => {
  const handleTypeClick = (type: ContentType) => {
    const newPayload = buildPayload(type, formData);
    onChangeContentType(type, newPayload);
  };

  const handleInputChange = (field: keyof ContentFormData, value: any) => {
    const updated = { ...formData, [field]: value };
    const newPayload = buildPayload(contentType, updated);
    onChangeFormData(updated, newPayload);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
      {/* Category Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-200">
        {CONTENT_TYPES.map((type) => {
          const Icon = type.icon;
          const isActive = contentType === type.id;
          return (
            <button
              key={type.id}
              onClick={() => handleTypeClick(type.id)}
              className={`flex items-center space-x-2 px-3.5 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all duration-200 border ${
                isActive
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                  : 'bg-slate-50 text-slate-600 hover:text-slate-900 hover:bg-slate-100 border-slate-200'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
              <span>{type.label}</span>
            </button>
          );
        })}
      </div>

      {/* Inputs per selected Content Type */}
      <div className="pt-2">
        {contentType === 'url' && (
          <div className="space-y-3">
            <label className="block text-xs font-semibold text-slate-700">
              Target Website URL
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.url}
                onChange={(e) => handleInputChange('url', e.target.value)}
                placeholder="https://mywebsite.com or portfolio link"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              />
            </div>
            {/* Quick URL Presets */}
            <div className="flex flex-wrap gap-2 text-xs text-slate-500 pt-1">
              <span className="text-slate-400">Quick presets:</span>
              {['https://google.com', 'https://instagram.com', 'https://github.com', 'https://spotify.com'].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => handleInputChange('url', preset)}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md border border-slate-200 transition font-medium"
                >
                  {preset.replace('https://', '')}
                </button>
              ))}
            </div>
          </div>
        )}

        {contentType === 'text' && (
          <div className="space-y-3">
            <label className="block text-xs font-semibold text-slate-700">
              Plain Text or Message
            </label>
            <textarea
              rows={3}
              value={formData.text}
              onChange={(e) => handleInputChange('text', e.target.value)}
              placeholder="Type any custom text, note, secret code, or message here..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            />
          </div>
        )}

        {contentType === 'wifi' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Network SSID (Name)
              </label>
              <input
                type="text"
                value={formData.wifiSsid}
                onChange={(e) => handleInputChange('wifiSsid', e.target.value)}
                placeholder="e.g. CoffeeShop_Guest_5G"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Password
              </label>
              <input
                type="text"
                value={formData.wifiPassword}
                onChange={(e) => handleInputChange('wifiPassword', e.target.value)}
                placeholder="Password (leave blank if open)"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Security Encryption
              </label>
              <select
                value={formData.wifiEncryption}
                onChange={(e) => handleInputChange('wifiEncryption', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="WPA">WPA / WPA2 (Recommended)</option>
                <option value="WPA3">WPA3 (Latest)</option>
                <option value="WEP">WEP (Legacy)</option>
                <option value="nopass">None (Open Network)</option>
              </select>
            </div>
            <div className="sm:col-span-2 flex items-center space-x-2 pt-1">
              <input
                type="checkbox"
                id="wifiHidden"
                checked={formData.wifiHidden}
                onChange={(e) => handleInputChange('wifiHidden', e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 bg-slate-50 border-slate-300 focus:ring-indigo-500"
              />
              <label htmlFor="wifiHidden" className="text-xs text-slate-700 cursor-pointer">
                Hidden SSID Network
              </label>
            </div>
          </div>
        )}

        {contentType === 'vcard' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">First Name</label>
              <input
                type="text"
                value={formData.vcardFirstName}
                onChange={(e) => handleInputChange('vcardFirstName', e.target.value)}
                placeholder="Alex"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Last Name</label>
              <input
                type="text"
                value={formData.vcardLastName}
                onChange={(e) => handleInputChange('vcardLastName', e.target.value)}
                placeholder="Morgan"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
              <input
                type="text"
                value={formData.vcardPhone}
                onChange={(e) => handleInputChange('vcardPhone', e.target.value)}
                placeholder="+1 555-019-2834"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
              <input
                type="email"
                value={formData.vcardEmail}
                onChange={(e) => handleInputChange('vcardEmail', e.target.value)}
                placeholder="alex@company.com"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Company</label>
              <input
                type="text"
                value={formData.vcardCompany}
                onChange={(e) => handleInputChange('vcardCompany', e.target.value)}
                placeholder="Acme Studio Inc."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Job Title</label>
              <input
                type="text"
                value={formData.vcardTitle}
                onChange={(e) => handleInputChange('vcardTitle', e.target.value)}
                placeholder="Lead Product Designer"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
        )}

        {contentType === 'email' && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Recipient Email</label>
              <input
                type="email"
                value={formData.emailTo}
                onChange={(e) => handleInputChange('emailTo', e.target.value)}
                placeholder="support@mybrand.com"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Subject</label>
              <input
                type="text"
                value={formData.emailSubject}
                onChange={(e) => handleInputChange('emailSubject', e.target.value)}
                placeholder="Feedback / Inquiry"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Default Body Text</label>
              <textarea
                rows={2}
                value={formData.emailBody}
                onChange={(e) => handleInputChange('emailBody', e.target.value)}
                placeholder="Hello, I scanned your QR code and wanted to connect..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
        )}

        {contentType === 'sms' && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Recipient Phone Number</label>
              <input
                type="text"
                value={formData.smsPhone}
                onChange={(e) => handleInputChange('smsPhone', e.target.value)}
                placeholder="+1 555-123-4567"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Pre-filled SMS Message</label>
              <textarea
                rows={2}
                value={formData.smsMessage}
                onChange={(e) => handleInputChange('smsMessage', e.target.value)}
                placeholder="JOIN VIP LIST"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
        )}

        {contentType === 'whatsapp' && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">WhatsApp Phone (with country code)</label>
              <input
                type="text"
                value={formData.waPhone}
                onChange={(e) => handleInputChange('waPhone', e.target.value)}
                placeholder="+15551234567"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Initial Greeting Message</label>
              <textarea
                rows={2}
                value={formData.waMessage}
                onChange={(e) => handleInputChange('waMessage', e.target.value)}
                placeholder="Hi! I am interested in booking a consultation."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
        )}

        {contentType === 'social' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Platform</label>
              <select
                value={formData.socialPlatform}
                onChange={(e) => handleInputChange('socialPlatform', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="instagram">Instagram</option>
                <option value="twitter">Twitter / X</option>
                <option value="youtube">YouTube</option>
                <option value="linkedin">LinkedIn</option>
                <option value="tiktok">TikTok</option>
                <option value="spotify">Spotify</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Handle / Username</label>
              <input
                type="text"
                value={formData.socialUsername}
                onChange={(e) => handleInputChange('socialUsername', e.target.value)}
                placeholder="@myusername"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
        )}

        {contentType === 'crypto' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Currency</label>
              <select
                value={formData.cryptoCurrency}
                onChange={(e) => handleInputChange('cryptoCurrency', e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="BTC">Bitcoin (BTC)</option>
                <option value="ETH">Ethereum (ETH)</option>
                <option value="SOL">Solana (SOL)</option>
                <option value="USDT">Tether (USDT)</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Wallet Address</label>
              <input
                type="text"
                value={formData.cryptoAddress}
                onChange={(e) => handleInputChange('cryptoAddress', e.target.value)}
                placeholder="1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
