export type ContentType = 
  | 'url' 
  | 'text' 
  | 'wifi' 
  | 'vcard' 
  | 'email' 
  | 'sms' 
  | 'whatsapp' 
  | 'social' 
  | 'crypto';

export type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

export type GradientType = 'none' | 'linear' | 'radial' | 'diagonal';

export type ModuleStyle = 
  | 'square' 
  | 'rounded' 
  | 'dots' 
  | 'fluid' 
  | 'stars' 
  | 'diamonds' 
  | 'classy';

export type OuterEyeStyle = 
  | 'square' 
  | 'rounded' 
  | 'circle' 
  | 'leaf' 
  | 'hexagon' 
  | 'double' 
  | 'diamond';

export type InnerEyeStyle = 
  | 'square' 
  | 'dot' 
  | 'diamond' 
  | 'star' 
  | 'heart' 
  | 'flower';

export type FrameStyle = 
  | 'none' 
  | 'bottom-badge' 
  | 'top-banner' 
  | 'polaroid' 
  | 'floating-tag' 
  | 'phone-mockup' 
  | 'ticket' 
  | 'neon-glow' 
  | 'ribbon';

export type LogoBgShape = 'none' | 'circle' | 'rounded' | 'square' | 'hexagon';

export interface QRColorConfig {
  // Foreground
  fgType: GradientType;
  fgColor: string;
  fgGradientEnd: string;
  fgGradientAngle: number;
  
  // Background
  bgType: GradientType;
  bgColor: string;
  bgGradientEnd: string;
  bgGradientAngle: number;
  transparentBg: boolean;

  // Custom Eye Colors
  customEyeColors: boolean;
  eyeOuterColor: string;
  eyeInnerColor: string;
}

export interface QREyeConfig {
  outerStyle: OuterEyeStyle;
  innerStyle: InnerEyeStyle;
}

export interface QRLogoConfig {
  src: string; // Data URL or SVG string or Preset icon key
  presetKey?: string;
  sizeRatio: number; // e.g. 0.22 (22%)
  padding: number; // e.g. 8px
  bgShape: LogoBgShape;
  bgColor: string;
  borderColor: string;
  borderWidth: number;
  borderRadius: number;
}

export interface QRFrameConfig {
  style: FrameStyle;
  text: string;
  subtext?: string;
  textColor: string;
  bgColor: string;
  borderColor: string;
  borderWidth: number;
  fontSize: number; // px
  fontFamily: string;
  icon?: string;
}

export interface QRConfig {
  id: string;
  title: string;
  createdAt: number;
  contentType: ContentType;
  rawPayload: string;
  ecl: ErrorCorrectionLevel;
  size: number; // grid pixel canvas base size (e.g., 300)
  margin: number; // quiet zone in blocks
  
  // Styling
  moduleStyle: ModuleStyle;
  colors: QRColorConfig;
  eyes: QREyeConfig;
  logo: QRLogoConfig;
  frame: QRFrameConfig;
}

export interface PresetTemplate {
  id: string;
  name: string;
  description: string;
  previewGradient: string;
  config: Partial<QRConfig>;
}

export interface ContentFormData {
  // URL
  url: string;
  
  // Text
  text: string;
  
  // Wi-Fi
  wifiSsid: string;
  wifiPassword: string;
  wifiEncryption: 'WPA' | 'WEP' | 'nopass' | 'WPA3';
  wifiHidden: boolean;

  // vCard
  vcardFirstName: string;
  vcardLastName: string;
  vcardPhone: string;
  vcardEmail: string;
  vcardCompany: string;
  vcardTitle: string;
  vcardUrl: string;
  vcardStreet: string;
  vcardCity: string;
  vcardCountry: string;

  // Email
  emailTo: string;
  emailSubject: string;
  emailBody: string;

  // SMS
  smsPhone: string;
  smsMessage: string;

  // WhatsApp
  waPhone: string;
  waMessage: string;

  // Social
  socialPlatform: string;
  socialUsername: string;

  // Crypto
  cryptoCurrency: 'BTC' | 'ETH' | 'SOL' | 'USDT';
  cryptoAddress: string;
  cryptoAmount: string;
}
