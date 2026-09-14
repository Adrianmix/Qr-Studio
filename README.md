# QR Studio

A responsive QR code generator and customizer built with React, Vite, TypeScript, and the `qrcode` library. It lets you generate branded QR codes for URLs, text, Wi‑Fi, vCards, email, SMS, WhatsApp, social profiles, and crypto addresses, then customize colors, patterns, frames, logos, and export the result as SVG, PNG, or PDF.

## Overview

This project is a single-page app for designing and exporting QR codes for personal or business use. The app includes:

- multiple QR content types and payload builders
- live preview while you edit
- styling controls for module appearance, corner eyes, gradients, and frames
- optional logo embedding with preset brand icons
- scan-and-decode support for existing QR codes
- saved history with local storage
- export to SVG, PNG, and PDF

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- `qrcode` for QR matrix generation
- `jspdf` for PDF export
- `lucide-react` for icons

## Features

### Supported QR content types

- Website URL
- Plain text
- Wi‑Fi credentials
- vCard contact card
- Email link
- SMS message
- WhatsApp chat link
- Social profile link
- Crypto payment address

### Design customization

- foreground and background colors
- linear, diagonal, radial, and no-gradient options
- custom eye colors and finder-eye styles
- module patterns such as square, rounded, dots, fluid, stars, diamonds, and classy
- logo placement, sizing, background shape, border styling
- frame templates such as badge, banner, polaroid, neon glow, ticket, and more
- preset templates and palettes for quick styling

### Export and workflow tools

- live QR preview card
- save and restore previous QR designs from history
- scan existing QR codes from the browser and apply the decoded payload
- export the current design to:
  - SVG
  - PNG
  - PDF

## Project Structure

```text
qrmaker/
├── index.html
├── metadata.json
├── package.json
├── tsconfig.json
├── vite.config.ts
├── README.md
├── assets/
├── src/
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   ├── types.ts
│   ├── components/
│   │   ├── ContentTypeSelector.tsx
│   │   ├── CustomizerTabs.tsx
│   │   ├── ExportModal.tsx
│   │   ├── Header.tsx
│   │   ├── HistoryDrawer.tsx
│   │   ├── QRPreviewCard.tsx
│   │   └── ScannerModal.tsx
│   └── utils/
│       ├── presets.ts
│       ├── qrGenerator.ts
│       └── templates.ts
└── public/
```

## Key Files

- `src/App.tsx` — main app shell and state orchestration
- `src/types.ts` — types for QR configuration, content payloads, and styling options
- `src/components/ContentTypeSelector.tsx` — content type switching and payload generation
- `src/utils/qrGenerator.ts` — QR matrix generation and SVG export logic
- `src/components/CustomizerTabs.tsx` — visual customization controls
- `src/components/ExportModal.tsx` — export flow to PNG/SVG/PDF
- `src/components/ScannerModal.tsx` — QR decoding via camera
- `src/components/HistoryDrawer.tsx` — saved design history

## Installation

```bash
npm install
```

## Run the App

```bash
npm run dev
```

Then open the local Vite URL shown in the terminal, typically:

```text
http://localhost:3000
```

## Production Build

```bash
npm run build
```

## Preview the Production Build

```bash
npm run preview
```

## Lint / Type Check

```bash
npm run lint
```

## Notes on Behavior

- The app stores saved QR designs in browser local storage under the key `qr_studio_history`.
- Payloads are produced from content-specific form data before generating the QR matrix.
- The QR code generator calculates a custom SVG, then renders it for preview and export pipelines.
- PDF export uses generated canvas output and jsPDF with layout controls for different branding needs.

## Example Use Cases

- create Wi‑Fi QR codes for cafes and offices
- generate vCard QR codes for networking and business cards
- share WhatsApp or social links from a custom branded profile
- produce event, museum, or product QR labels with a polished visual style


## Summary

QR Studio is a focused, modern QR code creator with strong customization and export features. It is ideal for quick branded QR generation in a browser without needing a backend service.
