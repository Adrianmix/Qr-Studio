export interface ColorPalette {
  name: string;
  fg: string;
  fgEnd: string;
  bg: string;
  gradientType: 'none' | 'linear' | 'radial' | 'diagonal';
}

export const PRESET_PALETTES: ColorPalette[] = [
  { name: 'Monochrome', fg: '#000000', fgEnd: '#000000', bg: '#ffffff', gradientType: 'none' },
  { name: 'Midnight Cyber', fg: '#38bdf8', fgEnd: '#818cf8', bg: '#0f172a', gradientType: 'linear' },
  { name: 'Sunset Bloom', fg: '#f43f5e', fgEnd: '#fb923c', bg: '#fff1f2', gradientType: 'linear' },
  { name: 'Emerald Spark', fg: '#10b981', fgEnd: '#06b6d4', bg: '#ecfdf5', gradientType: 'linear' },
  { name: 'Royal Velvet', fg: '#8b5cf6', fgEnd: '#ec4899', bg: '#faf5ff', gradientType: 'linear' },
  { name: 'Golden Hour', fg: '#d97706', fgEnd: '#f59e0b', bg: '#fffbeb', gradientType: 'linear' },
  { name: 'Oceanic Wave', fg: '#0284c7', fgEnd: '#2563eb', bg: '#f0f9ff', gradientType: 'linear' },
  { name: 'Dark Luxe Gold', fg: '#f59e0b', fgEnd: '#fbbf24', bg: '#18181b', gradientType: 'linear' },
  { name: 'Pastel Lavender', fg: '#6366f1', fgEnd: '#a855f7', bg: '#f3e8ff', gradientType: 'linear' },
  { name: 'Coral Fresh', fg: '#ff6b6b', fgEnd: '#ff8e53', bg: '#fff5f5', gradientType: 'linear' },
];

export interface PresetLogo {
  id: string;
  name: string;
  category: string;
  svg: string; // inline SVG string
}

export const PRESET_LOGOS: PresetLogo[] = [
  {
    id: 'wifi',
    name: 'Wi-Fi Signal',
    category: 'General',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h.01"/><path d="M2 8.82a15 15 0 0 1 20 0"/><path d="M5 12.85a10 10 0 0 1 14 0"/><path d="M8.5 16.88a5 5 0 0 1 7 0"/></svg>`,
  },
  {
    id: 'link',
    name: 'Website Link',
    category: 'General',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>`,
  },
  {
    id: 'user',
    name: 'Contact Profile',
    category: 'General',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
  },
  {
    id: 'instagram',
    name: 'Instagram',
    category: 'Social',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>`,
  },
  {
    id: 'twitter',
    name: 'Twitter / X',
    category: 'Social',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4l11.733 16h4.267l-11.733 -16z"/><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"/></svg>`,
  },
  {
    id: 'youtube',
    name: 'YouTube',
    category: 'Social',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><polygon points="10 15 15 12 10 9 10 15"/></svg>`,
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    category: 'Social',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>`,
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    category: 'Social',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21"/><path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1"/></svg>`,
  },
  {
    id: 'spotify',
    name: 'Spotify',
    category: 'Social',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M6 10c4-1 8 0 12 2"/><path d="M7 13c3.5-.8 7 0 10 1.5"/><path d="M8 16c3-.5 5.5 0 8 1"/></svg>`,
  },
  {
    id: 'mail',
    name: 'Email Envelope',
    category: 'General',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`,
  },
  {
    id: 'phone',
    name: 'Phone Call',
    category: 'General',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
  },
  {
    id: 'shopping-bag',
    name: 'Shop Store',
    category: 'Business',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>`,
  },
  {
    id: 'star',
    name: 'Star Rating',
    category: 'Business',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
  },
  {
    id: 'crypto',
    name: 'Crypto Coins',
    category: 'Business',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.5 8h4a2.5 2.5 0 0 1 0 5h-4"/><path d="M9.5 13h4.5a2.5 2.5 0 0 1 0 5h-4.5"/><path d="M12 6v12"/></svg>`,
  },
  {
    id: 'heart',
    name: 'Love Heart',
    category: 'General',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>`,
  },
];

export const FRAME_PRESET_TEXTS = [
  'SCAN ME',
  'CONNECT WI-FI',
  'SCAN TO ORDER',
  'FOLLOW US',
  'VIEW MENU',
  'GET DISCOUNT',
  'VISIT WEBSITE',
  'PAY HERE',
  'LEAVE A REVIEW',
  'DOWNLOAD APP',
];
