# Address Print - Offline-First Address Form & Printing PWA

A production-grade, offline-first Address Form & Printing Progressive Web Application (PWA) built with **React, TypeScript, Vite, Tailwind CSS, Dexie.js (IndexedDB), React Hook Form, Zod, and `vite-plugin-pwa`**.

Designed as a business utility for daily customer address slip printing in office receptions, billing counters, dispatch departments, courier operations, and order processing.

---

## 🌟 Key Features

* **Offline-First Architecture**: Powered by IndexedDB (`AddressPrintDB`) using Dexie.js and Service Worker pre-caching.
* **100% Client-Side Privacy**: All customer address data resides strictly inside the user's browser. Zero network transmission, zero backend, zero analytics.
* **Form Validation**: Powered by React Hook Form & Zod schema, including 10-digit Indian Mobile Number and 6-digit Indian PIN Code validation.
* **Draft Auto-Save & Restoration**: Automatically saves form progress locally and prompts with *"Unsaved draft found"* alert upon page load.
* **Unique Reference Sequence**: Format `ADR-YYYYMMDD-XXXX` (e.g., `ADR-20260817-0001`) generated using atomic IndexedDB sequence counters.
* **A4 Print Engine & Print CSS**: Native browser printing via `window.print()` formatted for A4 paper size (`210mm x 297mm`) with hidden UI navigation during printing.
* **Saved Forms & Multi-Field Search**: Real-time search by reference number, customer name, mobile number, city, or PIN code with pagination and delete confirmation protection.
* **Installable PWA**: Responsive layout installable as a standalone app on Windows, macOS, Android, Chrome, and Edge.

---

## 🛠 Tech Stack

* **Core**: React, TypeScript, Vite
* **Styling**: Tailwind CSS
* **Database**: Dexie.js (IndexedDB wrapper)
* **Form Management**: React Hook Form
* **Validation**: Zod + `@hookform/resolvers`
* **PWA**: `vite-plugin-pwa` (Workbox)
* **Icons**: Lucide React

---

## 📂 Project Structure

```text
src/
├── app/
│   ├── App.tsx                      # App shell & top-level layout
│   └── routes.tsx                   # Client view router
├── components/
│   ├── forms/                       # AddressForm & DraftAlert
│   ├── layout/                      # Navbar & Footer
│   ├── preview/                     # DocumentPreview (A4 sheet)
│   ├── pwa/                         # NetworkBadge & PWAInstallBanner
│   ├── recent-forms/                # RecentFormsList
│   └── ui/                          # Button, Input, Textarea, Card, Modal, Badge
├── db/
│   ├── database.ts                  # Dexie IndexedDB setup
│   ├── schemas.ts                   # Database interfaces
│   └── repositories/                # FormRepository & CounterRepository
├── hooks/
│   ├── useAddressForms.ts
│   ├── useDraftForm.ts
│   ├── useNetworkStatus.ts
│   └── usePWAInstall.ts
├── pages/
│   ├── Dashboard/                   # Overview metrics & quick actions
│   ├── NewForm/                     # Form creation & edit
│   ├── Preview/                     # Print preview & print dialog trigger
│   └── SavedForms/                  # Searchable database records & delete modal
├── schemas/
│   └── address.schema.ts            # Zod validation rules
├── services/
│   ├── form.service.ts
│   ├── print.service.ts
│   ├── pwa.service.ts
│   └── reference.service.ts
├── styles/
│   ├── index.css
│   └── print.css                    # A4 @media print stylesheet
├── types/
│   └── address.types.ts
└── main.tsx                         # Entry point & PWA registration
```

---

## 🚀 Getting Started

### Prerequisites

* Node.js `v18.0.0` or higher
* npm `v9.0.0` or higher

### Installation

1. Clone repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/address-print-pwa.git
   cd address-print-pwa
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

---

## 🌐 Production Build & Deployment

### Local Build

To create an optimized production build:
```bash
npm run build
```
The output directory will be `dist/`.

### Preview Build Locally

```bash
npm run preview
```

### Vercel Deployment

1. Push your repository to GitHub.
2. Import the project into Vercel.
3. Configuration:
   * **Framework Preset**: Vite
   * **Build Command**: `npm run build`
   * **Output Directory**: `dist`
   * **Environment Variables**: None required!
4. Deploy!

---

## 🔒 Privacy & Security

This application is strictly **offline-first and client-side only**.
No customer data, address records, mobile numbers, or emails are ever sent to an external server or third-party service. All data remains inside the user's browser IndexedDB database.
