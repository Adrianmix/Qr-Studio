import QRCode from 'qrcode';
import { jsPDF } from 'jspdf';
import { QRConfig } from '../types';

// Helper to calculate matrix from payload using qrcode library
export function getQRMatrix(payload: string, ecl: string = 'H') {
  try {
    const qr = QRCode.create(payload || 'enter link url here', {
      errorCorrectionLevel: ecl as QRCode.QRCodeErrorCorrectionLevel,
    });
    return qr.modules;
  } catch (err) {
    console.error('Error generating QR matrix:', err);
    // Fallback matrix for minimal valid URL
    const qr = QRCode.create('enter link url here', { errorCorrectionLevel: 'M' });
    return qr.modules;
  }
}

// Check if a cell (r, c) is inside any of the 3 main Finder Patterns (7x7 corners)
export function isFinderPattern(r: number, c: number, size: number): boolean {
  if (r < 7 && c < 7) return true; // Top-Left
  if (r < 7 && c >= size - 7) return true; // Top-Right
  if (r >= size - 7 && c < 7) return true; // Bottom-Left
  return false;
}

// Get which finder pattern (0: Top-Left, 1: Top-Right, 2: Bottom-Left)
export function getFinderIndex(r: number, c: number, size: number): number | null {
  if (r < 7 && c < 7) return 0;
  if (r < 7 && c >= size - 7) return 1;
  if (r >= size - 7 && c < 7) return 2;
  return null;
}

// Check if cell is in logo clear center zone
export function isLogoZone(r: number, c: number, size: number, logoSizeRatio: number): boolean {
  if (logoSizeRatio <= 0) return false;
  // Clear matrix modules around center
  const center = size / 2;
  // logo size in module units
  const logoModules = Math.ceil(size * logoSizeRatio) + 1;
  const half = logoModules / 2;
  
  return (
    r >= center - half &&
    r <= center + half &&
    c >= center - half &&
    c <= center + half
  );
}

// Build SVG String representation of QR code with all custom styling
export function generateSVGString(config: QRConfig): string {
  const payload = config.rawPayload || 'enter link url here';
  const modules = getQRMatrix(payload, config.ecl);
  const size = modules.size;

  // Canvas size inside SVG
  const baseSize = 400; // SVG viewBox width/height
  const frameStyle = config.frame.style;
  
  // Calculate Frame Layout dimensions
  let frameHeaderHeight = 0;
  let frameFooterHeight = 0;
  let framePadding = 24;

  if (frameStyle === 'bottom-badge') frameFooterHeight = 54;
  else if (frameStyle === 'top-banner') frameHeaderHeight = 54;
  else if (frameStyle === 'polaroid') { framePadding = 32; frameFooterHeight = 80; }
  else if (frameStyle === 'floating-tag') frameFooterHeight = 44;
  else if (frameStyle === 'phone-mockup') { frameHeaderHeight = 40; frameFooterHeight = 60; framePadding = 30; }
  else if (frameStyle === 'ticket') { frameFooterHeight = 50; framePadding = 28; }
  else if (frameStyle === 'neon-glow') frameFooterHeight = 48;
  else if (frameStyle === 'ribbon') frameHeaderHeight = 50;

  const qrDrawWidth = baseSize;
  const qrDrawHeight = baseSize;
  const svgTotalWidth = qrDrawWidth + framePadding * 2;
  const svgTotalHeight = qrDrawHeight + framePadding * 2 + frameHeaderHeight + frameFooterHeight;

  // Margin modules
  const margin = config.margin ?? 2;
  const totalGridSize = size + margin * 2;
  const cellSize = qrDrawWidth / totalGridSize;
  
  const qrXOffset = framePadding + margin * cellSize;
  const qrYOffset = framePadding + frameHeaderHeight + margin * cellSize;

  // Gradients IDs
  const fgGradId = `fg-grad-${config.id}`;
  const bgGradId = `bg-grad-${config.id}`;

  let defs = '';
  
  // Foreground gradient def
  if (config.colors.fgType === 'linear' || config.colors.fgType === 'diagonal') {
    const angle = config.colors.fgGradientAngle || 45;
    const rad = (angle * Math.PI) / 180;
    const x1 = Math.round(50 + Math.cos(rad) * 50);
    const y1 = Math.round(50 - Math.sin(rad) * 50);
    const x2 = Math.round(50 - Math.cos(rad) * 50);
    const y2 = Math.round(50 + Math.sin(rad) * 50);
    
    defs += `
      <linearGradient id="${fgGradId}" x1="${x1}%" y1="${y1}%" x2="${x2}%" y2="${y2}%">
        <stop offset="0%" stop-color="${config.colors.fgColor}" />
        <stop offset="100%" stop-color="${config.colors.fgGradientEnd}" />
      </linearGradient>
    `;
  } else if (config.colors.fgType === 'radial') {
    defs += `
      <radialGradient id="${fgGradId}" cx="50%" cy="50%" r="60%">
        <stop offset="0%" stop-color="${config.colors.fgColor}" />
        <stop offset="100%" stop-color="${config.colors.fgGradientEnd}" />
      </radialGradient>
    `;
  }

  // Background gradient def
  if (config.colors.bgType !== 'none') {
    const angle = config.colors.bgGradientAngle || 45;
    const rad = (angle * Math.PI) / 180;
    const x1 = Math.round(50 + Math.cos(rad) * 50);
    const y1 = Math.round(50 - Math.sin(rad) * 50);
    const x2 = Math.round(50 - Math.cos(rad) * 50);
    const y2 = Math.round(50 + Math.sin(rad) * 50);
    
    defs += `
      <linearGradient id="${bgGradId}" x1="${x1}%" y1="${y1}%" x2="${x2}%" y2="${y2}%">
        <stop offset="0%" stop-color="${config.colors.bgColor}" />
        <stop offset="100%" stop-color="${config.colors.bgGradientEnd}" />
      </linearGradient>
    `;
  }

  const fgFill = config.colors.fgType !== 'none' ? `url(#${fgGradId})` : config.colors.fgColor;
  const bgFill = config.colors.transparentBg 
    ? 'transparent' 
    : (config.colors.bgType !== 'none' ? `url(#${bgGradId})` : config.colors.bgColor);

  const outerEyeColor = config.colors.customEyeColors ? config.colors.eyeOuterColor : fgFill;
  const innerEyeColor = config.colors.customEyeColors ? config.colors.eyeInnerColor : fgFill;

  // Build SVG Content
  let svgPaths = '';

  // 1. Draw Outer Frame Background
  let frameSvg = '';
  if (frameStyle !== 'none') {
    const frameBg = config.frame.bgColor || '#ffffff';
    const frameBorder = config.frame.borderColor || '#e2e8f0';
    const frameWidth = config.frame.borderWidth ?? 1;
    
    if (frameStyle === 'polaroid') {
      frameSvg += `<rect x="0" y="0" width="${svgTotalWidth}" height="${svgTotalHeight}" rx="16" fill="${frameBg}" stroke="${frameBorder}" stroke-width="${frameWidth}" filter="drop-shadow(0 10px 15px rgba(0,0,0,0.1))"/>`;
    } else if (frameStyle === 'neon-glow') {
      frameSvg += `<rect x="2" y="2" width="${svgTotalWidth - 4}" height="${svgTotalHeight - 4}" rx="20" fill="${frameBg}" stroke="${frameBorder}" stroke-width="${Math.max(2, frameWidth)}" style="filter: drop-shadow(0 0 12px ${frameBorder});"/>`;
    } else if (frameStyle === 'phone-mockup') {
      frameSvg += `<rect x="0" y="0" width="${svgTotalWidth}" height="${svgTotalHeight}" rx="32" fill="${frameBg}" stroke="${frameBorder}" stroke-width="4"/>`;
      // Phone Notch
      const notchW = svgTotalWidth * 0.36;
      frameSvg += `<rect x="${(svgTotalWidth - notchW) / 2}" y="8" width="${notchW}" height="14" rx="7" fill="#0f172a"/>`;
    } else if (frameStyle === 'ticket') {
      frameSvg += `<rect x="0" y="0" width="${svgTotalWidth}" height="${svgTotalHeight}" rx="12" fill="${frameBg}" stroke="${frameBorder}" stroke-width="${frameWidth}"/>`;
      // Cutouts
      const cutoutR = 14;
      const cy = svgTotalHeight - frameFooterHeight - 8;
      frameSvg += `<circle cx="0" cy="${cy}" r="${cutoutR}" fill="${config.colors.bgColor}"/>`;
      frameSvg += `<circle cx="${svgTotalWidth}" cy="${cy}" r="${cutoutR}" fill="${config.colors.bgColor}"/>`;
      frameSvg += `<line x1="${cutoutR + 4}" y1="${cy}" x2="${svgTotalWidth - cutoutR - 4}" y2="${cy}" stroke="${frameBorder}" stroke-dasharray="4 4" stroke-width="1.5"/>`;
    } else {
      frameSvg += `<rect x="0" y="0" width="${svgTotalWidth}" height="${svgTotalHeight}" rx="20" fill="${frameBg}" stroke="${frameBorder}" stroke-width="${frameWidth}"/>`;
    }
  }

  // 2. Draw Inner QR Quiet Zone / Background Rect
  if (!config.colors.transparentBg) {
    const qrBgX = framePadding;
    const qrBgY = framePadding + frameHeaderHeight;
    frameSvg += `<rect x="${qrBgX}" y="${qrBgY}" width="${qrDrawWidth}" height="${qrDrawHeight}" rx="16" fill="${bgFill}"/>`;
  }

  // 3. Draw Modules (Data matrix)
  let modulesPath = '';
  const hasLogo = !!config.logo.src;
  const logoRatio = hasLogo ? (config.logo.sizeRatio || 0.22) : 0;

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      // Skip finder pattern blocks (we render custom finder eyes separately)
      if (isFinderPattern(r, c, size)) continue;
      // Skip modules cleared by logo center zone
      if (hasLogo && isLogoZone(r, c, size, logoRatio)) continue;

      const isDark = modules.get(r, c) === 1;
      if (!isDark) continue;

      const x = qrXOffset + c * cellSize;
      const y = qrYOffset + r * cellSize;
      
      // Render module based on moduleStyle
      modulesPath += renderSingleModule(x, y, cellSize, config.moduleStyle);
    }
  }

  svgPaths += `<path d="${modulesPath}" fill="${fgFill}" />`;

  // 4. Draw Custom Finder Eyes (3 corner eyes)
  const finderPositions = [
    { r: 0, c: 0 }, // Top-Left
    { r: 0, c: size - 7 }, // Top-Right
    { r: size - 7, c: 0 }, // Bottom-Left
  ];

  let finderEyesSvg = '';

  finderPositions.forEach((pos) => {
    const eyeX = qrXOffset + pos.c * cellSize;
    const eyeY = qrYOffset + pos.r * cellSize;
    const eyeSize = 7 * cellSize;

    finderEyesSvg += renderFinderEye(
      eyeX,
      eyeY,
      eyeSize,
      cellSize,
      config.eyes.outerStyle,
      config.eyes.innerStyle,
      outerEyeColor,
      innerEyeColor
    );
  });

  // 5. Draw Center Logo if enabled
  let logoSvg = '';
  if (hasLogo) {
    const logoPixelWidth = qrDrawWidth * logoRatio;
    const logoX = framePadding + (qrDrawWidth - logoPixelWidth) / 2;
    const logoY = framePadding + frameHeaderHeight + (qrDrawHeight - logoPixelWidth) / 2;
    const pad = config.logo.padding || 8;

    // Logo Background Shape
    if (config.logo.bgShape !== 'none') {
      const bgX = logoX - pad;
      const bgY = logoY - pad;
      const bgDim = logoPixelWidth + pad * 2;
      const bgFillColor = config.logo.bgColor || '#ffffff';
      const borderCol = config.logo.borderColor || '#e2e8f0';
      const bWidth = config.logo.borderWidth || 0;

      if (config.logo.bgShape === 'circle') {
        const cx = bgX + bgDim / 2;
        const cy = bgY + bgDim / 2;
        logoSvg += `<circle cx="${cx}" cy="${cy}" r="${bgDim / 2}" fill="${bgFillColor}" stroke="${borderCol}" stroke-width="${bWidth}"/>`;
      } else if (config.logo.bgShape === 'hexagon') {
        const cx = bgX + bgDim / 2;
        const cy = bgY + bgDim / 2;
        const r = bgDim / 2;
        let pts = '';
        for (let i = 0; i < 6; i++) {
          const a = (i * 60 * Math.PI) / 180;
          pts += `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)} `;
        }
        logoSvg += `<polygon points="${pts}" fill="${bgFillColor}" stroke="${borderCol}" stroke-width="${bWidth}"/>`;
      } else {
        const radius = config.logo.bgShape === 'rounded' ? (config.logo.borderRadius || 12) : 0;
        logoSvg += `<rect x="${bgX}" y="${bgY}" width="${bgDim}" height="${bgDim}" rx="${radius}" fill="${bgFillColor}" stroke="${borderCol}" stroke-width="${bWidth}"/>`;
      }
    }

    // Embed image or preset SVG
    if (config.logo.src.startsWith('data:') || config.logo.src.startsWith('http') || config.logo.src.startsWith('blob:')) {
      logoSvg += `<image href="${config.logo.src}" x="${logoX}" y="${logoY}" width="${logoPixelWidth}" height="${logoPixelWidth}" preserveAspectRatio="xMidYMid meet"/>`;
    } else if (config.logo.presetKey) {
      // Find preset SVG path string
      const presetSvg = getPresetLogoSvg(config.logo.presetKey, logoX, logoY, logoPixelWidth, config.colors.fgColor);
      logoSvg += presetSvg;
    }
  }

  // 6. Draw Frame Callout Text & Icons
  let frameTextSvg = '';
  if (frameStyle !== 'none' && config.frame.text) {
    const font = config.frame.fontFamily || 'sans-serif';
    const textColor = config.frame.textColor || '#ffffff';
    const fontSize = config.frame.fontSize || 14;

    if (frameStyle === 'bottom-badge') {
      const badgeY = svgTotalHeight - frameFooterHeight / 2 - 4;
      const badgeX = svgTotalWidth / 2;
      const badgeBg = config.frame.bgColor || config.colors.fgColor;
      
      frameTextSvg += `
        <g transform="translate(${badgeX}, ${badgeY})">
          <rect x="-90" y="-18" width="180" height="36" rx="18" fill="${badgeBg}" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.15))"/>
          <text x="0" y="5" text-anchor="middle" font-family="${font}" font-size="${fontSize}" font-weight="bold" fill="${textColor}">${escapeXml(config.frame.text)}</text>
        </g>
      `;
    } else if (frameStyle === 'top-banner') {
      const bannerY = frameHeaderHeight / 2 + 4;
      const bannerX = svgTotalWidth / 2;
      frameTextSvg += `
        <text x="${bannerX}" y="${bannerY}" text-anchor="middle" font-family="${font}" font-size="${fontSize + 2}" font-weight="bold" fill="${textColor}">${escapeXml(config.frame.text)}</text>
      `;
    } else if (frameStyle === 'polaroid') {
      const titleY = svgTotalHeight - frameFooterHeight + 34;
      const subY = titleY + 22;
      const textX = svgTotalWidth / 2;
      frameTextSvg += `
        <text x="${textX}" y="${titleY}" text-anchor="middle" font-family="${font}" font-size="${fontSize + 3}" font-weight="bold" fill="${textColor}">${escapeXml(config.frame.text)}</text>
      `;
      if (config.frame.subtext) {
        frameTextSvg += `
          <text x="${textX}" y="${subY}" text-anchor="middle" font-family="${font}" font-size="${fontSize - 2}" font-weight="normal" fill="${textColor}" opacity="0.8">${escapeXml(config.frame.subtext)}</text>
        `;
      }
    } else if (frameStyle === 'floating-tag') {
      const tagY = svgTotalHeight - frameFooterHeight / 2;
      const tagX = svgTotalWidth / 2;
      frameTextSvg += `
        <g transform="translate(${tagX}, ${tagY})">
          <rect x="-80" y="-16" width="160" height="32" rx="16" fill="${config.frame.bgColor}" stroke="${config.frame.borderColor}" stroke-width="1.5"/>
          <text x="0" y="4" text-anchor="middle" font-family="${font}" font-size="${fontSize}" font-weight="600" fill="${textColor}">${escapeXml(config.frame.text)}</text>
        </g>
      `;
    } else if (frameStyle === 'phone-mockup' || frameStyle === 'neon-glow' || frameStyle === 'ticket') {
      const footerY = svgTotalHeight - frameFooterHeight / 2 + 4;
      const footerX = svgTotalWidth / 2;
      frameTextSvg += `
        <text x="${footerX}" y="${footerY}" text-anchor="middle" font-family="${font}" font-size="${fontSize + 1}" font-weight="bold" fill="${textColor}">${escapeXml(config.frame.text)}</text>
      `;
    }
  }

  // Combine full SVG output
  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svgTotalWidth} ${svgTotalHeight}" width="100%" height="100%">
      <defs>${defs}</defs>
      ${frameSvg}
      ${svgPaths}
      ${finderEyesSvg}
      ${logoSvg}
      ${frameTextSvg}
    </svg>
  `.trim();
}

// Render individual data module shape
function renderSingleModule(x: number, y: number, size: number, style: string): string {
  if (style === 'dots') {
    const cx = x + size / 2;
    const cy = y + size / 2;
    const r = size * 0.44;
    return `M ${cx - r},${cy} a ${r},${r} 0 1,0 ${r * 2},0 a ${r},${r} 0 1,0 -${r * 2},0 `;
  }
  
  if (style === 'rounded') {
    const r = size * 0.35;
    return `M ${x + r},${y} h ${size - r * 2} a ${r},${r} 0 0 1 ${r},${r} v ${size - r * 2} a ${r},${r} 0 0 1 -${r},${r} h -${size - r * 2} a ${r},${r} 0 0 1 -${r},-${r} v -${size - r * 2} a ${r},${r} 0 0 1 ${r},-${r} Z `;
  }

  if (style === 'fluid') {
    const r = size * 0.48;
    return `M ${x + r},${y} h ${size - r * 2} a ${r},${r} 0 0 1 ${r},${r} v ${size - r * 2} a ${r},${r} 0 0 1 -${r},${r} h -${size - r * 2} a ${r},${r} 0 0 1 -${r},-${r} v -${size - r * 2} a ${r},${r} 0 0 1 ${r},-${r} Z `;
  }

  if (style === 'diamonds') {
    const cx = x + size / 2;
    const cy = y + size / 2;
    const h = size / 2;
    return `M ${cx},${cy - h} L ${cx + h},${cy} L ${cx},${cy + h} L ${cx - h},${cy} Z `;
  }

  if (style === 'stars') {
    const cx = x + size / 2;
    const cy = y + size / 2;
    const r = size / 2;
    const rIn = size * 0.22;
    let path = `M ${cx},${cy - r} `;
    path += `Q ${cx},${cy - rIn} ${cx + r},${cy} `;
    path += `Q ${cx + rIn},${cy} ${cx},${cy + r} `;
    path += `Q ${cx},${cy + rIn} ${cx - r},${cy} `;
    path += `Q ${cx - rIn},${cy} ${cx},${cy - r} Z `;
    return path;
  }

  if (style === 'classy') {
    const r = size * 0.45;
    return `M ${x + r},${y} h ${size - r * 2} a ${r},${r} 0 0 1 ${r},${r} v ${size - r * 2} a ${r},${r} 0 0 1 -${r},${r} h -${size - r * 2} a ${r},${r} 0 0 1 -${r},-${r} v -${size - r * 2} a ${r},${r} 0 0 1 ${r},-${r} Z `;
  }

  // Default 'square'
  return `M ${x},${y} h ${size} v ${size} h -${size} Z `;
}

// Render Custom Finder Eye (Outer Ring & Center Dot)
function renderFinderEye(
  x: number,
  y: number,
  size: number,
  cellSize: number,
  outerStyle: string,
  innerStyle: string,
  outerColor: string,
  innerColor: string
): string {
  let svg = '';

  // 1. Outer Eye (7x7 modules)
  if (outerStyle === 'rounded') {
    const rx = size * 0.22;
    svg += `<rect x="${x}" y="${y}" width="${size}" height="${size}" rx="${rx}" fill="none" stroke="${outerColor}" stroke-width="${cellSize * 1.05}"/>`;
  } else if (outerStyle === 'circle') {
    const cx = x + size / 2;
    const cy = y + size / 2;
    const r = (size - cellSize) / 2;
    svg += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${outerColor}" stroke-width="${cellSize * 1.05}"/>`;
  } else if (outerStyle === 'leaf') {
    const rx = size * 0.4;
    svg += `
      <path d="
        M ${x + rx},${y} 
        H ${x + size} 
        V ${y + size - rx} 
        A ${rx},${rx} 0 0 1 ${x + size - rx},${y + size} 
        H ${x} 
        V ${y + rx} 
        A ${rx},${rx} 0 0 1 ${x + rx},${y} Z
      " fill="none" stroke="${outerColor}" stroke-width="${cellSize * 1.05}" />
    `;
  } else if (outerStyle === 'hexagon') {
    const cx = x + size / 2;
    const cy = y + size / 2;
    const r = (size - cellSize / 2) / 2;
    let pts = '';
    for (let i = 0; i < 6; i++) {
      const a = (i * 60 - 30) * (Math.PI / 180);
      pts += `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)} `;
    }
    svg += `<polygon points="${pts}" fill="none" stroke="${outerColor}" stroke-width="${cellSize * 1.05}"/>`;
  } else if (outerStyle === 'double') {
    svg += `<rect x="${x}" y="${y}" width="${size}" height="${size}" rx="8" fill="none" stroke="${outerColor}" stroke-width="${cellSize * 0.6}"/>`;
    svg += `<rect x="${x + cellSize * 0.8}" y="${y + cellSize * 0.8}" width="${size - cellSize * 1.6}" height="${size - cellSize * 1.6}" rx="6" fill="none" stroke="${outerColor}" stroke-width="${cellSize * 0.5}"/>`;
  } else {
    // Default square
    svg += `<rect x="${x + cellSize * 0.5}" y="${y + cellSize * 0.5}" width="${size - cellSize}" height="${size - cellSize}" fill="none" stroke="${outerColor}" stroke-width="${cellSize}"/>`;
  }

  // 2. Inner Eye Center Dot (3x3 modules in center)
  const innerSize = 3 * cellSize;
  const innerX = x + 2 * cellSize;
  const innerY = y + 2 * cellSize;
  const cx = x + size / 2;
  const cy = y + size / 2;

  if (innerStyle === 'dot') {
    const r = innerSize / 2;
    svg += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${innerColor}"/>`;
  } else if (innerStyle === 'diamond') {
    const h = innerSize / 2;
    svg += `<polygon points="${cx},${cy - h} ${cx + h},${cy} ${cx},${cy + h} ${cx - h},${cy}" fill="${innerColor}"/>`;
  } else if (innerStyle === 'star') {
    const r = innerSize / 2;
    const rIn = r * 0.45;
    let pts = '';
    for (let i = 0; i < 5; i++) {
      const aOuter = (i * 72 - 90) * (Math.PI / 180);
      const aInner = ((i * 72 + 36) - 90) * (Math.PI / 180);
      pts += `${cx + r * Math.cos(aOuter)},${cy + r * Math.sin(aOuter)} `;
      pts += `${cx + rIn * Math.cos(aInner)},${cy + rIn * Math.sin(aInner)} `;
    }
    svg += `<polygon points="${pts}" fill="${innerColor}"/>`;
  } else if (innerStyle === 'heart') {
    const h = innerSize * 0.8;
    svg += `
      <g transform="translate(${cx}, ${cy}) scale(${h / 24})">
        <path d="M 0,8 C 0,8 -10,-1 -10,-7 C -10,-11 -7,-14 -3,-14 C -0.5,-14 2,-12 0,-9 C -2,-12 3.5,-14 6,-14 C 10,-14 13,-11 13,-7 C 13,-1 0,8 0,8 Z" transform="translate(0, 3)" fill="${innerColor}"/>
      </g>
    `;
  } else if (innerStyle === 'flower') {
    const r = innerSize / 2;
    svg += `
      <circle cx="${cx - r / 2}" cy="${cy}" r="${r / 2}" fill="${innerColor}"/>
      <circle cx="${cx + r / 2}" cy="${cy}" r="${r / 2}" fill="${innerColor}"/>
      <circle cx="${cx}" cy="${cy - r / 2}" r="${r / 2}" fill="${innerColor}"/>
      <circle cx="${cx}" cy="${cy + r / 2}" r="${r / 2}" fill="${innerColor}"/>
      <circle cx="${cx}" cy="${cy}" r="${r * 0.4}" fill="${innerColor}"/>
    `;
  } else {
    // Default square
    const rx = outerStyle === 'rounded' || outerStyle === 'circle' ? innerSize * 0.25 : 0;
    svg += `<rect x="${innerX}" y="${innerY}" width="${innerSize}" height="${innerSize}" rx="${rx}" fill="${innerColor}"/>`;
  }

  return svg;
}

// Convert XML characters to safe entity strings
function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// Helper to embed preset SVG logo into target region
function getPresetLogoSvg(key: string, x: number, y: number, size: number, color: string): string {
  // Preset SVG definitions
  const presetMap: Record<string, string> = {
    wifi: `<path d="M12 20h.01M2 8.82a15 15 0 0 1 20 0M5 12.85a10 10 0 0 1 14 0M8.5 16.88a5 5 0 0 1 7 0" stroke="${color}" stroke-width="2.2" stroke-linecap="round"/>`,
    link: `<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke="${color}" stroke-width="2.2" stroke-linecap="round"/>`,
    instagram: `<rect width="18" height="18" x="3" y="3" rx="4" stroke="${color}" stroke-width="2"/><circle cx="12" cy="12" r="4" stroke="${color}" stroke-width="2"/><circle cx="17" cy="7" r="1" fill="${color}"/>`,
    twitter: `<path d="M4 4l11.733 16h4.267l-11.733 -16zM4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" stroke="${color}" stroke-width="2"/>`,
    youtube: `<path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" stroke="${color}" stroke-width="2"/><polygon points="10 15 15 12 10 9 10 15" fill="${color}"/>`,
    linkedin: `<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" stroke="${color}" stroke-width="2"/><rect width="4" height="12" x="2" y="9" stroke="${color}" stroke-width="2"/><circle cx="4" cy="4" r="2" fill="${color}"/>`,
    whatsapp: `<path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" stroke="${color}" stroke-width="2"/>`,
    mail: `<rect width="20" height="16" x="2" y="4" rx="2" stroke="${color}" stroke-width="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" stroke="${color}" stroke-width="2"/>`,
    phone: `<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke="${color}" stroke-width="2"/>`,
    star: `<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="${color}"/>`,
  };

  const innerPath = presetMap[key] || presetMap.link;
  const scale = size / 24;

  return `
    <g transform="translate(${x}, ${y}) scale(${scale})" fill="none">
      ${innerPath}
    </g>
  `;
}

// Render SVG to Canvas element for crisp PNG Export
export async function renderSVGToCanvas(svgString: string, canvas: HTMLCanvasElement, scaleMultiplier: number = 2): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      // Set canvas size scaled up for HD resolution download
      canvas.width = img.width * scaleMultiplier;
      canvas.height = img.height * scaleMultiplier;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        URL.revokeObjectURL(url);
        reject(new Error('Canvas 2D context not available'));
        return;
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      URL.revokeObjectURL(url);
      resolve();
    };

    img.onerror = (err) => {
      URL.revokeObjectURL(url);
      reject(err);
    };

    img.src = url;
  });
}

// Export PDF Document
export async function exportToPDF(
  config: QRConfig,
  pdfLayout: 'card' | 'standee' | 'sticker-sheet' = 'card',
  title: string = 'Custom QR Code'
): Promise<void> {
  const svgString = generateSVGString(config);
  const tempCanvas = document.createElement('canvas');
  await renderSVGToCanvas(svgString, tempCanvas, 3);
  const imgData = tempCanvas.toDataURL('image/png');

  if (pdfLayout === 'card') {
    // Single 4x6 inch or A6 printable card
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a6', // 105 x 148 mm
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Background
    pdf.setFillColor(250, 250, 250);
    pdf.rect(0, 0, pageWidth, pageHeight, 'F');

    // Header Title
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(16);
    pdf.setTextColor(30, 41, 59);
    pdf.text(title, pageWidth / 2, 20, { align: 'center' });

    // QR Image
    const qrDim = 70; // 70mm
    const qrX = (pageWidth - qrDim) / 2;
    const qrY = 30;
    pdf.addImage(imgData, 'PNG', qrX, qrY, qrDim, qrDim);

    // Instructions
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.setTextColor(100, 116, 139);
    pdf.text('Scan with your smartphone camera to connect.', pageWidth / 2, qrY + qrDim + 15, { align: 'center' });

    pdf.save(`${config.title || 'QR-Code'}-card.pdf`);
  } else if (pdfLayout === 'standee') {
    // Table Standee (A4 sheet fold layout)
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4', // 210 x 297 mm
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Header Title
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(22);
    pdf.setTextColor(15, 23, 42);
    pdf.text(title, pageWidth / 2, 35, { align: 'center' });

    // Large QR Code
    const qrDim = 110;
    const qrX = (pageWidth - qrDim) / 2;
    const qrY = 55;
    pdf.addImage(imgData, 'PNG', qrX, qrY, qrDim, qrDim);

    // Callout text
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(14);
    pdf.setTextColor(79, 70, 229);
    pdf.text(config.frame.text || 'SCAN ME', pageWidth / 2, qrY + qrDim + 20, { align: 'center' });

    // Cut & Fold Guidelines
    pdf.setLineWidth(0.3);
    pdf.setDrawColor(203, 213, 225);
    pdf.line(10, 220, 200, 220);
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'italic');
    pdf.setTextColor(148, 163, 184);
    pdf.text('✂ Fold along line for desk table standee display', pageWidth / 2, 226, { align: 'center' });

    pdf.save(`${config.title || 'QR-Code'}-standee.pdf`);
  } else {
    // Sticker Sheet (Grid of 6 QR codes on A4)
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(16);
    pdf.setTextColor(15, 23, 42);
    pdf.text(`${title} - Sticker Sheet`, pageWidth / 2, 18, { align: 'center' });

    const rows = 3;
    const cols = 2;
    const stickerDim = 70;
    const startX = 20;
    const startY = 30;
    const gapX = 30;
    const gapY = 15;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = startX + c * (stickerDim + gapX);
        const y = startY + r * (stickerDim + gapY);
        pdf.addImage(imgData, 'PNG', x, y, stickerDim, stickerDim);
      }
    }

    pdf.save(`${config.title || 'QR-Code'}-sticker-sheet.pdf`);
  }
}
