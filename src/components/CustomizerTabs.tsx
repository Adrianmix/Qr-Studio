import React, { useState } from 'react';
import { 
  Palette, 
  Shapes, 
  Image as ImageIcon, 
  LayoutTemplate, 
  Sparkles,
  Upload,
  X,
  Sliders,
  Type,
  Check,
  ShieldAlert
} from 'lucide-react';
import { 
  QRConfig, 
  ModuleStyle, 
  OuterEyeStyle, 
  InnerEyeStyle, 
  FrameStyle, 
  LogoBgShape,
  ErrorCorrectionLevel,
  GradientType
} from '../types';
import { PRESET_TEMPLATES } from '../utils/templates';
import { PRESET_PALETTES, PRESET_LOGOS, FRAME_PRESET_TEXTS } from '../utils/presets';

interface CustomizerTabsProps {
  config: QRConfig;
  onChangeConfig: (newConfig: QRConfig) => void;
}

type TabType = 'templates' | 'colors' | 'shapes' | 'logo' | 'frame';

export const CustomizerTabs: React.FC<CustomizerTabsProps> = ({ config, onChangeConfig }) => {
  const [activeTab, setActiveTab] = useState<TabType>('templates');

  const updateColors = (patch: Partial<QRConfig['colors']>) => {
    onChangeConfig({
      ...config,
      colors: { ...config.colors, ...patch },
    });
  };

  const updateEyes = (patch: Partial<QRConfig['eyes']>) => {
    onChangeConfig({
      ...config,
      eyes: { ...config.eyes, ...patch },
    });
  };

  const updateLogo = (patch: Partial<QRConfig['logo']>) => {
    onChangeConfig({
      ...config,
      logo: { ...config.logo, ...patch },
    });
  };

  const updateFrame = (patch: Partial<QRConfig['frame']>) => {
    onChangeConfig({
      ...config,
      frame: { ...config.frame, ...patch },
    });
  };

  // Image upload handler for logo
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        onChangeConfig({
          ...config,
          ecl: 'H', // Auto-upgrade ECL to H for logo clarity
          logo: {
            ...config.logo,
            src: result,
            presetKey: undefined,
          },
        });
      }
    };
    reader.readAsDataURL(file);
  };

  // Preset Logo click handler
  const handleSelectPresetLogo = (presetId: string) => {
    onChangeConfig({
      ...config,
      ecl: config.ecl === 'L' ? 'M' : config.ecl,
      logo: {
        ...config.logo,
        src: 'preset',
        presetKey: presetId,
      },
    });
  };

  // Clear logo
  const handleRemoveLogo = () => {
    onChangeConfig({
      ...config,
      logo: {
        ...config.logo,
        src: '',
        presetKey: undefined,
      },
    });
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      {/* Navigation Tab Bar */}
      <div className="flex border-b border-slate-200 bg-slate-50/70 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('templates')}
          className={`flex items-center space-x-2 px-4 py-3 text-xs sm:text-sm font-semibold transition-all border-b-2 whitespace-nowrap ${
            activeTab === 'templates'
              ? 'border-indigo-600 text-indigo-600 bg-white'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Templates</span>
        </button>

        <button
          onClick={() => setActiveTab('colors')}
          className={`flex items-center space-x-2 px-4 py-3 text-xs sm:text-sm font-semibold transition-all border-b-2 whitespace-nowrap ${
            activeTab === 'colors'
              ? 'border-indigo-600 text-indigo-600 bg-white'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Palette className="w-4 h-4 text-pink-500" />
          <span>Colors & Gradients</span>
        </button>

        <button
          onClick={() => setActiveTab('shapes')}
          className={`flex items-center space-x-2 px-4 py-3 text-xs sm:text-sm font-semibold transition-all border-b-2 whitespace-nowrap ${
            activeTab === 'shapes'
              ? 'border-indigo-600 text-indigo-600 bg-white'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Shapes className="w-4 h-4 text-cyan-600" />
          <span>Shapes & Eyes</span>
        </button>

        <button
          onClick={() => setActiveTab('logo')}
          className={`flex items-center space-x-2 px-4 py-3 text-xs sm:text-sm font-semibold transition-all border-b-2 whitespace-nowrap ${
            activeTab === 'logo'
              ? 'border-indigo-600 text-indigo-600 bg-white'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <ImageIcon className="w-4 h-4 text-emerald-600" />
          <span>Logo & Branding</span>
        </button>

        <button
          onClick={() => setActiveTab('frame')}
          className={`flex items-center space-x-2 px-4 py-3 text-xs sm:text-sm font-semibold transition-all border-b-2 whitespace-nowrap ${
            activeTab === 'frame'
              ? 'border-indigo-600 text-indigo-600 bg-white'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <LayoutTemplate className="w-4 h-4 text-purple-600" />
          <span>Frame & Message</span>
        </button>
      </div>

      {/* Tab Panels Content */}
      <div className="p-5">
        {/* TAB 1: TEMPLATES */}
        {activeTab === 'templates' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Preset Studio Styles</h3>
                <p className="text-xs text-slate-500">Click any preset to instantly apply professional colors, frames, and finder eyes</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {PRESET_TEMPLATES.map((tmpl) => (
                <button
                  key={tmpl.id}
                  onClick={() => {
                    onChangeConfig({
                      ...config,
                      ...tmpl.config,
                      colors: { ...config.colors, ...tmpl.config.colors },
                      eyes: { ...config.eyes, ...tmpl.config.eyes },
                      frame: { ...config.frame, ...tmpl.config.frame },
                    });
                  }}
                  className="group relative text-left bg-slate-50 border border-slate-200 hover:border-indigo-500 rounded-xl p-3.5 transition-all duration-200 hover:shadow-sm flex flex-col justify-between"
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-tr ${tmpl.previewGradient} flex items-center justify-center shadow-sm`}>
                      <Sparkles className="w-4 h-4 text-white opacity-90" />
                    </div>
                    <div>
                      <span className="font-semibold text-xs text-slate-900 group-hover:text-indigo-600 transition">
                        {tmpl.name}
                      </span>
                      <p className="text-[11px] text-slate-500 line-clamp-1">{tmpl.description}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-medium text-indigo-600 flex items-center space-x-1 pt-1 opacity-0 group-hover:opacity-100 transition">
                    <span>Apply Preset</span>
                    <Check className="w-3 h-3" />
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: COLORS & GRADIENTS */}
        {activeTab === 'colors' && (
          <div className="space-y-5">
            {/* Quick Palettes */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">Quick Palette Presets</label>
              <div className="flex flex-wrap gap-2">
                {PRESET_PALETTES.map((pal) => (
                  <button
                    key={pal.name}
                    onClick={() => {
                      updateColors({
                        fgType: pal.gradientType,
                        fgColor: pal.fg,
                        fgGradientEnd: pal.fgEnd,
                        bgColor: pal.bg,
                        transparentBg: false,
                      });
                    }}
                    className="flex items-center space-x-1.5 px-2.5 py-1.5 bg-white border border-slate-200 hover:border-slate-300 rounded-lg text-xs font-medium text-slate-700 transition shadow-sm"
                  >
                    <span
                      className="w-3 h-3 rounded-full border border-slate-200 shadow-xs"
                      style={{ background: pal.gradientType !== 'none' ? `linear-gradient(135deg, ${pal.fg}, ${pal.fgEnd})` : pal.fg }}
                    />
                    <span>{pal.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {/* Foreground Color Settings */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
                <h4 className="text-xs font-bold text-indigo-600 tracking-wider uppercase">Foreground (QR Pattern)</h4>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Color Fill Mode</label>
                  <div className="grid grid-cols-4 gap-1.5 bg-white p-1 rounded-lg border border-slate-200">
                    {(['none', 'linear', 'radial', 'diagonal'] as GradientType[]).map((gt) => (
                      <button
                        key={gt}
                        type="button"
                        onClick={() => updateColors({ fgType: gt })}
                        className={`py-1 text-[11px] font-semibold rounded-md capitalize transition ${
                          config.colors.fgType === gt
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {gt === 'none' ? 'Solid' : gt}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-700">Primary Color</span>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={config.colors.fgColor}
                      onChange={(e) => updateColors({ fgColor: e.target.value })}
                      className="w-8 h-8 rounded border-0 cursor-pointer bg-transparent"
                    />
                    <span className="text-xs font-mono text-slate-500">{config.colors.fgColor}</span>
                  </div>
                </div>

                {config.colors.fgType !== 'none' && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-700">Gradient End Color</span>
                      <div className="flex items-center space-x-2">
                        <input
                          type="color"
                          value={config.colors.fgGradientEnd}
                          onChange={(e) => updateColors({ fgGradientEnd: e.target.value })}
                          className="w-8 h-8 rounded border-0 cursor-pointer bg-transparent"
                        />
                        <span className="text-xs font-mono text-slate-500">{config.colors.fgGradientEnd}</span>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs text-slate-600 mb-1">
                        <span>Gradient Angle</span>
                        <span className="font-mono">{config.colors.fgGradientAngle || 45}°</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="360"
                        value={config.colors.fgGradientAngle || 45}
                        onChange={(e) => updateColors({ fgGradientAngle: Number(e.target.value) })}
                        className="w-full accent-indigo-600"
                      />
                    </div>
                  </>
                )}
              </div>

              {/* Background Color Settings */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-700 tracking-wider uppercase">Background Canvas</h4>
                  <label className="flex items-center space-x-2 text-xs text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.colors.transparentBg}
                      onChange={(e) => updateColors({ transparentBg: e.target.checked })}
                      className="rounded text-indigo-600 bg-white border-slate-300 focus:ring-indigo-500"
                    />
                    <span>Transparent</span>
                  </label>
                </div>

                {!config.colors.transparentBg && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-700">Background Color</span>
                      <div className="flex items-center space-x-2">
                        <input
                          type="color"
                          value={config.colors.bgColor}
                          onChange={(e) => updateColors({ bgColor: e.target.value })}
                          className="w-8 h-8 rounded border-0 cursor-pointer bg-transparent"
                        />
                        <span className="text-xs font-mono text-slate-500">{config.colors.bgColor}</span>
                      </div>
                    </div>
                  </>
                )}

                {/* Custom Eye Colors */}
                <div className="pt-3 border-t border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold text-slate-900">Independent Finder Eye Colors</span>
                      <p className="text-[10px] text-slate-500">Override corner eye colors for custom branding</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={config.colors.customEyeColors}
                      onChange={(e) => updateColors({ customEyeColors: e.target.checked })}
                      className="rounded text-indigo-600 bg-white border-slate-300 focus:ring-indigo-500"
                    />
                  </div>

                  {config.colors.customEyeColors && (
                    <div className="space-y-2 pt-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-700">Outer Eye Border Indicator</span>
                        <input
                          type="color"
                          value={config.colors.eyeOuterColor}
                          onChange={(e) => updateColors({ eyeOuterColor: e.target.value })}
                          className="w-7 h-7 rounded border-0 cursor-pointer bg-transparent"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-700">Center of Border Indicator (Dot)</span>
                        <input
                          type="color"
                          value={config.colors.eyeInnerColor}
                          onChange={(e) => updateColors({ eyeInnerColor: e.target.value })}
                          className="w-7 h-7 rounded border-0 cursor-pointer bg-transparent"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SHAPES & FINDER EYES */}
        {activeTab === 'shapes' && (
          <div className="space-y-6">
            {/* Module Data Pattern Styles */}
            <div>
              <label className="block text-xs font-bold text-slate-400 tracking-wider uppercase mb-2">
                Data Module Matrix Pattern
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                {[
                  { id: 'square', label: 'Classic Square' },
                  { id: 'rounded', label: 'Rounded Box' },
                  { id: 'dots', label: 'Soft Dots' },
                  { id: 'fluid', label: 'Fluid Bubbles' },
                  { id: 'diamonds', label: 'Diamonds' },
                  { id: 'stars', label: 'Sparkle Stars' },
                  { id: 'classy', label: 'Classy Pill' },
                ].map((mod) => (
                  <button
                    key={mod.id}
                    onClick={() => onChangeConfig({ ...config, moduleStyle: mod.id as ModuleStyle })}
                    className={`px-3 py-2.5 rounded-xl border text-xs font-semibold transition text-center flex flex-col items-center justify-center space-y-1 ${
                      config.moduleStyle === mod.id
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <span>{mod.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Border Indicator (Outer Eye) Styles */}
            <div>
              <label className="block text-xs font-bold text-slate-400 tracking-wider uppercase mb-2">
                Border Indicator (Outer Finder Eye Style)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                {[
                  { id: 'square', label: 'Square' },
                  { id: 'rounded', label: 'Rounded' },
                  { id: 'circle', label: 'Circle' },
                  { id: 'leaf', label: 'Organic Leaf' },
                  { id: 'hexagon', label: 'Hexagon' },
                  { id: 'double', label: 'Double Ring' },
                ].map((eye) => (
                  <button
                    key={eye.id}
                    onClick={() => updateEyes({ outerStyle: eye.id as OuterEyeStyle })}
                    className={`px-3 py-2.5 rounded-xl border text-xs font-semibold transition text-center ${
                      config.eyes.outerStyle === eye.id
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <span>{eye.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Center of Border Indicator (Inner Eye) Styles */}
            <div>
              <label className="block text-xs font-bold text-slate-400 tracking-wider uppercase mb-2">
                Center of Border Indicator (Inner Eye Center)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                {[
                  { id: 'square', label: 'Solid Square' },
                  { id: 'dot', label: 'Center Dot' },
                  { id: 'diamond', label: 'Diamond' },
                  { id: 'star', label: 'Star Center' },
                  { id: 'heart', label: 'Heart Icon' },
                  { id: 'flower', label: 'Petal Flower' },
                ].map((inner) => (
                  <button
                    key={inner.id}
                    onClick={() => updateEyes({ innerStyle: inner.id as InnerEyeStyle })}
                    className={`px-3 py-2.5 rounded-xl border text-xs font-semibold transition text-center ${
                      config.eyes.innerStyle === inner.id
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <span>{inner.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: LOGO & BRANDING */}
        {activeTab === 'logo' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Custom Image Upload */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <h4 className="text-xs font-bold text-slate-700 tracking-wider uppercase">Upload Brand Logo</h4>
                <div className="border-2 border-dashed border-slate-200 hover:border-indigo-500/50 rounded-xl p-4 text-center transition cursor-pointer relative bg-white">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <Upload className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-slate-900">Click or drag logo image here</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">PNG, SVG, or JPG (transparent background recommended)</p>
                </div>

                {config.logo.src && (
                  <div className="flex items-center justify-between bg-white px-3 py-2 rounded-lg border border-slate-200">
                    <span className="text-xs text-indigo-600 font-semibold">Logo Attached</span>
                    <button
                      onClick={handleRemoveLogo}
                      className="text-slate-400 hover:text-rose-600 p-1 rounded"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Preset Icon Library */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <h4 className="text-xs font-bold text-slate-700 tracking-wider uppercase">Or Choose Preset Icon</h4>
                <div className="grid grid-cols-5 gap-2 max-h-40 overflow-y-auto pr-1">
                  {PRESET_LOGOS.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => handleSelectPresetLogo(preset.id)}
                      className={`p-2.5 rounded-lg border flex items-center justify-center transition ${
                        config.logo.presetKey === preset.id
                          ? 'bg-indigo-600 border-indigo-600 text-white'
                          : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900'
                      }`}
                      title={preset.name}
                    >
                      <div className="w-5 h-5" dangerouslySetInnerHTML={{ __html: preset.svg }} />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Logo Formatting Sliders */}
            {config.logo.src && (
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
                <h4 className="text-xs font-bold text-slate-700 tracking-wider uppercase">Logo Size & Padding</h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="flex justify-between text-xs text-slate-600 mb-1">
                      <span>Logo Scale</span>
                      <span className="font-mono">{Math.round((config.logo.sizeRatio || 0.22) * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.10"
                      max="0.35"
                      step="0.01"
                      value={config.logo.sizeRatio || 0.22}
                      onChange={(e) => updateLogo({ sizeRatio: Number(e.target.value) })}
                      className="w-full accent-indigo-600"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-slate-600 mb-1">
                      <span>Background Padding</span>
                      <span className="font-mono">{config.logo.padding || 8}px</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="20"
                      value={config.logo.padding || 8}
                      onChange={(e) => updateLogo({ padding: Number(e.target.value) })}
                      className="w-full accent-indigo-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">Logo Container Shape</label>
                  <div className="grid grid-cols-5 gap-2">
                    {(['none', 'circle', 'rounded', 'square', 'hexagon'] as LogoBgShape[]).map((shape) => (
                      <button
                        key={shape}
                        type="button"
                        onClick={() => updateLogo({ bgShape: shape })}
                        className={`py-1.5 text-xs font-semibold rounded-lg capitalize border ${
                          config.logo.bgShape === shape
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {shape}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: FRAMES & MESSAGES */}
        {activeTab === 'frame' && (
          <div className="space-y-6">
            {/* Frame Styles Grid */}
            <div>
              <label className="block text-xs font-bold text-slate-400 tracking-wider uppercase mb-2">
                Frame Callout Style
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
                {[
                  { id: 'none', label: 'No Frame' },
                  { id: 'bottom-badge', label: 'Bottom Badge' },
                  { id: 'top-banner', label: 'Top Banner' },
                  { id: 'polaroid', label: 'Polaroid Card' },
                  { id: 'floating-tag', label: 'Floating Tag' },
                  { id: 'phone-mockup', label: 'Phone Frame' },
                  { id: 'ticket', label: 'Ticket / Coupon' },
                  { id: 'neon-glow', label: 'Neon Glow Card' },
                ].map((fr) => (
                  <button
                    key={fr.id}
                    onClick={() => updateFrame({ style: fr.id as FrameStyle })}
                    className={`px-3 py-3 rounded-xl border text-xs font-semibold transition text-center ${
                      config.frame.style === fr.id
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <span>{fr.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Frame Text & Custom Colors */}
            {config.frame.style !== 'none' && (
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Frame Callout Text</label>
                    <input
                      type="text"
                      value={config.frame.text}
                      onChange={(e) => updateFrame({ text: e.target.value })}
                      placeholder="SCAN ME"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                    {/* Quick Text Suggestions */}
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {FRAME_PRESET_TEXTS.slice(0, 5).map((txt) => (
                        <button
                          key={txt}
                          type="button"
                          onClick={() => updateFrame({ text: txt })}
                          className="px-2 py-0.5 text-[10px] bg-white text-slate-700 rounded border border-slate-200 hover:bg-slate-100 font-medium"
                        >
                          {txt}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Subtext / Tagline (Optional)</label>
                    <input
                      type="text"
                      value={config.frame.subtext || ''}
                      onChange={(e) => updateFrame({ subtext: e.target.value })}
                      placeholder="Point camera at code"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  <div>
                    <span className="block text-[11px] text-slate-600 mb-1">Text Color</span>
                    <input
                      type="color"
                      value={config.frame.textColor}
                      onChange={(e) => updateFrame({ textColor: e.target.value })}
                      className="w-full h-8 rounded border-0 cursor-pointer bg-transparent"
                    />
                  </div>
                  <div>
                    <span className="block text-[11px] text-slate-600 mb-1">Frame Background</span>
                    <input
                      type="color"
                      value={config.frame.bgColor}
                      onChange={(e) => updateFrame({ bgColor: e.target.value })}
                      className="w-full h-8 rounded border-0 cursor-pointer bg-transparent"
                    />
                  </div>
                  <div>
                    <span className="block text-[11px] text-slate-600 mb-1">Frame Border</span>
                    <input
                      type="color"
                      value={config.frame.borderColor}
                      onChange={(e) => updateFrame({ borderColor: e.target.value })}
                      className="w-full h-8 rounded border-0 cursor-pointer bg-transparent"
                    />
                  </div>
                  <div>
                    <span className="block text-[11px] text-slate-600 mb-1">Font Family</span>
                    <select
                      value={config.frame.fontFamily}
                      onChange={(e) => updateFrame({ fontFamily: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-lg text-xs text-slate-900 py-1.5 px-2"
                    >
                      <option value="sans-serif">Sans-Serif</option>
                      <option value="serif">Serif Classic</option>
                      <option value="monospace">Monospace Tech</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Error Correction Level Settings */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-900">QR Error Correction Level (ECL)</span>
                <span className="text-xs font-mono text-indigo-600 font-bold">Level {config.ecl}</span>
              </div>
              <p className="text-[11px] text-slate-500">Higher levels add redundancy, ensuring scan readability even if partially covered by logos or damage.</p>
              
              <div className="grid grid-cols-4 gap-2 pt-1">
                {[
                  { level: 'L', label: 'Low (7%)' },
                  { level: 'M', label: 'Medium (15%)' },
                  { level: 'Q', label: 'Quartile (25%)' },
                  { level: 'H', label: 'High (30%)' },
                ].map((item) => (
                  <button
                    key={item.level}
                    type="button"
                    onClick={() => onChangeConfig({ ...config, ecl: item.level as ErrorCorrectionLevel })}
                    className={`py-1.5 text-xs font-semibold rounded-lg border ${
                      config.ecl === item.level
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
