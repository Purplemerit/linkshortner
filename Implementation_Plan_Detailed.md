# IMPLEMENTATION PLAN v1.0
## Step-by-Step Frontend Development Guide

**Document Version:** 1.0  
**Last Updated:** November 26, 2025  
**Focus:** Frontend + API Mock Layer (Next.js 14)  
**Status:** Ready for Development  

---

## WEEK 1: PROJECT SETUP & CORE LINK MANAGEMENT

### Day 1-2: Environment Setup

**Step 1: Initialize Next.js 14 Project**
```bash
npx create-next-app@latest url-shortener \
  --typescript \
  --tailwind \
  --eslint \
  --app
```

**Step 2: Project Structure**
```
src/
  app/
    page.tsx                 # Homepage
    dashboard/
      page.tsx              # User dashboard
    api/
      links/
        route.ts            # Mock API endpoints
  components/
    LinkShortener.tsx
    LinksDashboard.tsx
    etc.
  hooks/
    useLinks.ts             # API call wrapper
    useAnalytics.ts
  lib/
    api.ts                  # API client
    dummy-data.ts           # Mock data
  styles/
    globals.css             # Tailwind + custom styles
```

**Step 3: Install Dependencies**
```bash
npm install recharts qrcode.react date-fns
```

---

### Day 3: Create Dummy Data Store

**File: `src/lib/dummy-data.ts`**
```typescript
export const dummyLinks = [
  {
    id: 'link-1',
    shortCode: 'abc123',
    shortUrl: 'https://short.link/abc123',
    destination: 'https://example.com/very-long-url-about-product',
    createdAt: new Date('2025-11-26'),
    clicks: 42,
    uniqueClicks: 32,
    tags: ['Campaign', 'November'],
    protected: false,
    expiresAt: null,
    maxClicks: null
  },
  {
    id: 'link-2',
    shortCode: 'xyz789',
    shortUrl: 'https://short.link/xyz789',
    destination: 'https://example.com/about',
    createdAt: new Date('2025-11-25'),
    clicks: 128,
    uniqueClicks: 95,
    tags: ['Social', 'Q4-2025'],
    protected: true,
    expiresAt: new Date('2025-12-26'),
    maxClicks: 500
  }
];

export const dummyAnalytics = {
  totalClicks: 1250,
  uniqueClicks: 890,
  topCountries: [
    { country: 'United States', clicks: 450, percentage: 36 },
    { country: 'India', clicks: 280, percentage: 22 },
    { country: 'Canada', clicks: 160, percentage: 13 }
  ],
  topReferrers: [
    { referrer: 'twitter.com', clicks: 350 },
    { referrer: 'reddit.com', clicks: 280 },
    { referrer: 'direct', clicks: 260 }
  ],
  deviceBreakdown: {
    mobile: 650,
    desktop: 450,
    tablet: 150
  },
  clicksByDay: [180, 220, 150, 140, 160, 200, 200]
};
```

---

### Day 4-5: Implement Core Components

**Cursor Prompt for Feature 1: Link Shortener**

Copy this entire prompt into Cursor:

```
Create a React component for Link Shortening using:
- Next.js 14 + React 18 + TypeScript
- TailwindCSS styling (white bg, purple accents #9333ea)
- Component path: src/components/LinkShortener.tsx

User Flow:
1. User enters URL in input field
2. On submit, show loading spinner
3. API call to /api/links (mock will return dummy)
4. Display result: short URL + copy button
5. Clear input on success

Dummy Data Response:
{
  "id": "link-123",
  "shortCode": "abc123",
  "shortUrl": "https://short.link/abc123",
  "destination": "https://example.com/very-long-url",
  "createdAt": "2025-11-26T10:00:00Z",
  "clicks": 0
}

Functionalities Required:
- URL validation (must start with http/https)
- Copy-to-clipboard using navigator.clipboard
- Loading spinner in button during API call
- Success message (green text)
- Error message (red text)
- Button disabled during loading
- Input cleared after successful submission

Error Cases to Handle:
- Invalid URL format → Show "Invalid URL (must start with http/https)"
- API call fails → Show "Failed to create link. Try again."
- Network timeout → Show "Request timed out"

UI Requirements:
- Input field: w-full, px-4 py-3, border-2 border-gray-300, rounded-lg
- Focus state: focus:outline-none focus:border-purple-600
- Button: px-6 py-3, bg-purple-600 text-white, rounded-lg, hover:bg-purple-700
- Result box: mt-4, p-4, bg-green-50, border-l-4 border-green-600
- Copy button: text-purple-600 hover:text-purple-700 font-semibold
"
```

**File: `src/components/LinkShortener.tsx`**

```typescript
'use client';

import { useState } from 'react';

interface LinkResult {
  shortUrl: string;
  shortCode: string;
}

export function LinkShortener() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<LinkResult | null>(null);

  const handleShorten = async () => {
    setError('');
    
    // Validation
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      setError('Invalid URL (must start with http:// or https://)');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ destination: url }),
      });

      if (!response.ok) throw new Error('Failed to create link');
      
      const data = await response.json();
      setResult(data);
      setUrl('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (result?.shortUrl) {
      await navigator.clipboard.writeText(result.shortUrl);
      alert('Copied to clipboard!');
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-8 bg-white rounded-lg border-2 border-gray-200">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Shorten Your Link</h2>
      
      <div className="flex gap-4">
        <input
          type="url"
          placeholder="https://example.com/very-long-url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          disabled={loading}
          className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-600 disabled:bg-gray-100"
        />
        
        <button
          onClick={handleShorten}
          disabled={loading || !url}
          className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 font-semibold whitespace-nowrap"
        >
          {loading ? 'Shortening...' : 'Shorten'}
        </button>
      </div>

      {error && <p className="mt-4 text-red-600 font-semibold">{error}</p>}

      {result && (
        <div className="mt-6 p-4 bg-green-50 border-l-4 border-green-600 rounded">
          <p className="text-sm text-gray-600 mb-2">Your shortened link:</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 text-lg font-mono text-purple-600">{result.shortUrl}</code>
            <button
              onClick={copyToClipboard}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 text-sm font-semibold"
            >
              Copy
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
```

---

### Mock API Endpoint: Create Link

**File: `src/app/api/links/route.ts`**

```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { destination } = await request.json();

    // Validate URL
    if (!destination.startsWith('http://') && !destination.startsWith('https://')) {
      return NextResponse.json(
        { error: 'Invalid URL' },
        { status: 400 }
      );
    }

    // Generate random short code
    const shortCode = Math.random().toString(36).substring(2, 8);

    return NextResponse.json({
      id: `link-${Date.now()}`,
      shortCode,
      shortUrl: `https://short.link/${shortCode}`,
      destination,
      createdAt: new Date().toISOString(),
      clicks: 0
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create link' },
      { status: 500 }
    );
  }
}
```

---

### Day 6: Dashboard Component

**Cursor Prompt for Feature 6: Links Dashboard**

```
Create a React component for Links Dashboard using:
- Next.js 14 + React 18 + TypeScript
- Component path: src/components/LinksDashboard.tsx
- Responsive table (desktop) / card view (mobile)

Display these links (use dummy data from src/lib/dummy-data.ts):
[
  {
    "id": "link-1",
    "shortUrl": "https://short.link/abc123",
    "destination": "https://example.com/very-long-url",
    "createdAt": "2025-11-26T10:00:00Z",
    "clicks": 42,
    "tags": ["Campaign"]
  },
  {
    "id": "link-2",
    "shortUrl": "https://short.link/xyz789",
    "destination": "https://example.com/about",
    "createdAt": "2025-11-25T15:30:00Z",
    "clicks": 128,
    "tags": ["Social", "Q4"]
  }
]

Features:
- Show list of links in table format
- Columns: Short URL, Destination, Clicks, Created Date
- Sort dropdown: Newest, Oldest, Most Clicks, Least Clicks
- Search input: filter by short code or destination
- Pagination: 25/50/100 per page buttons
- Row hover effect: bg-gray-50
- Truncate long URLs with ellipsis
- Short URLs: font-mono, text-purple-600

UI Requirements:
- Table header: bg-gray-50, border-b-2 border-gray-200
- Table rows: border-b border-gray-200
- Search input: w-full, border-2 border-gray-300, focus:border-purple-600
- Sort dropdown: px-4 py-2, border-2 border-gray-300
- Pagination buttons: bg-gray-200, active = bg-purple-600 text-white
"
```

---

## WEEK 2: ADVANCED LINK FEATURES

### Day 8-9: Custom Code & Tags

**Cursor Prompt for Feature 2: Custom Code Input**

[Use prompt from PReD document]

**Cursor Prompt for Feature 5: Link Tags**

[Use prompt from PReD document]

---

### Day 10: Password Protection & Expiration

**Cursor Prompt for Feature 7: Password Protection**

[Use prompt from PReD document]

**Cursor Prompt for Feature 8: Link Expiration**

[Use prompt from PReD document]

---

## WEEK 3: CUSTOM DOMAINS & QR CODES

### Day 15-16: Domain Setup

**Cursor Prompt for Feature 17: Domain Setup Wizard**

[Use prompt from PReD document]

---

### Day 17-18: QR Code Generator

**Cursor Prompt for Feature 25: QR Code Generator**

```
Create a React component for QR Code Generation using:
- Next.js 14 + React 18 + TypeScript
- npm library: qrcode.react
- Component path: src/components/QRCodeGenerator.tsx

User Flow:
1. Display QR code preview from shortUrl prop
2. Show size slider: 100px to 600px
3. Format selector buttons: PNG / JPEG / SVG
4. Download button with filename
5. Copy to clipboard option

Required Props:
- shortUrl: string (e.g., "https://short.link/abc123")

Dummy Implementation:
import QRCode from 'qrcode.react';
const qrRef = useRef<HTMLDivElement>(null);

Features:
- Real-time QR preview on size change
- Size slider with current size display
- Format buttons (PNG, JPEG, SVG) - only one active
- Download button: downloads as qr-[code].[format]
- Copy button: copies canvas as image data
- Size display: show "300x300px" under slider
- All text and buttons: white bg, purple accents

Download Implementation:
const canvas = qrRef.current?.querySelector('canvas');
const link = document.createElement('a');
link.href = canvas.toDataURL(`image/${format}`);
link.download = `qr-${shortCode}.${format}`;
link.click();

UI Requirements:
- Preview area: bg-gray-50, p-4, rounded-lg, centered
- Size slider: w-full, mb-4
- Format buttons: 3 buttons in row, active = bg-purple-600 text-white
- Download button: bg-purple-600, text-white, w-full, hover:bg-purple-700
- Copy button: text-purple-600, hover:text-purple-700
"
```

---

## WEEK 4: ANALYTICS & TEAM FEATURES

### Day 22-23: Analytics Dashboard

**Cursor Prompt for Feature 33: Real-Time Analytics Dashboard**

```
Create a React component for Analytics Dashboard using:
- Next.js 14 + React 18 + TypeScript
- Component path: src/components/AnalyticsDashboard.tsx

Use Dummy Data (src/lib/dummy-data.ts dummyAnalytics):
{
  "totalClicks": 1250,
  "uniqueClicks": 890,
  "topCountries": [
    { "country": "United States", "clicks": 450 },
    { "country": "India", "clicks": 280 },
    { "country": "Canada", "clicks": 160 }
  ],
  "deviceBreakdown": {
    "mobile": 650,
    "desktop": 450,
    "tablet": 150
  },
  "clicksByDay": [180, 220, 150, 140, 160, 200, 200]
}

Layout (4-column grid):
1. Total Clicks card
2. Unique Visitors card
3. Click Rate % card (uniqueClicks / totalClicks * 100)
4. Top Device card (highest from deviceBreakdown)
5. Top Countries table (2 columns wide)
6. Device Breakdown (2 columns wide)

Features:
- Display 4 metric cards (grid grid-cols-1 md:grid-cols-4)
- Cards: bg-white, border-2 border-gray-200, p-6, rounded-lg
- Large number display: text-3xl font-bold
- Device breakdown: show progress bars
- Progress bars: bg-gray-200, fill color = bg-purple-600
- Hover effect on rows
- Responsive: stack on mobile, grid on desktop

Metric Card Layout:
- Small label: text-sm text-gray-600
- Big number: text-3xl font-bold text-gray-900
- Optional subtitle: text-xs text-gray-500

Device Breakdown Progress Bars:
For each device:
  <div className="flex justify-between text-sm mb-1">
    <span>{deviceName}</span>
    <span>{clicks}</span>
  </div>
  <ProgressBar width={percentage} />
"
```

---

### Day 24: Click Trends Chart

**Cursor Prompt for Feature 34: Click Trends Chart**

```
Create a React component for Click Trends using:
- Next.js 14 + React 18 + TypeScript
- Recharts LineChart
- Component path: src/components/ClickTrendsChart.tsx

Dummy Data (7-day trend):
const data = [
  { date: 'Nov 20', clicks: 180 },
  { date: 'Nov 21', clicks: 220 },
  { date: 'Nov 22', clicks: 150 },
  { date: 'Nov 23', clicks: 140 },
  { date: 'Nov 24', clicks: 160 },
  { date: 'Nov 25', clicks: 200 },
  { date: 'Nov 26', clicks: 200 }
];

Features:
- LineChart from Recharts (100% width, min-height 300px)
- Line color: #9333ea (purple)
- Smooth animation on load
- Hover tooltip showing date + clicks
- Grid lines: light gray
- Responsive width: 100%

Recharts Setup:
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

UI:
- Container: bg-white, border-2 border-gray-200, p-6, rounded-lg
- Chart: width 100%, height 300px
- Legend: bottom
- Tooltip: background dark with white text
"
```

---

### Day 25: Team Management

**Cursor Prompt for Feature 45: Team Members List**

[Use prompt from PReD document]

**Cursor Prompt for Feature 46: Team Invite Modal**

[Use prompt from PReD document]

---

## WEEK 5: WEBSITE PAGES

### Day 29: Homepage

**File: `src/app/page.tsx`**

```typescript
'use client';

import { LinkShortener } from '@/components/LinkShortener';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">short.link</h1>
        <div className="flex gap-6">
          <a href="#features" className="text-gray-600 hover:text-purple-600">Features</a>
          <a href="#pricing" className="text-gray-600 hover:text-purple-600">Pricing</a>
          <button className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">Sign In</button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-8 py-20 text-center max-w-4xl mx-auto">
        <h2 className="text-5xl font-bold text-gray-900 mb-6">
          Privacy-First URL Shortener
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          Create beautiful short links with powerful analytics. No cookies. No tracking. Just data.
        </p>
        
        {/* Link Shortener Component */}
        <LinkShortener />
      </section>

      {/* Features Preview */}
      <section id="features" className="px-8 py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Powerful Features
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg border-2 border-gray-200">
              <h4 className="text-xl font-bold text-purple-600 mb-3">Custom Domains</h4>
              <p className="text-gray-600">Use your own domain for branded short links</p>
            </div>
            
            <div className="bg-white p-8 rounded-lg border-2 border-gray-200">
              <h4 className="text-xl font-bold text-purple-600 mb-3">QR Codes</h4>
              <p className="text-gray-600">Generate customizable QR codes for any link</p>
            </div>
            
            <div className="bg-white p-8 rounded-lg border-2 border-gray-200">
              <h4 className="text-xl font-bold text-purple-600 mb-3">Real-Time Analytics</h4>
              <p className="text-gray-600">Track clicks, geographic data, and referrers</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-8 py-20 text-center max-w-4xl mx-auto">
        <h3 className="text-3xl font-bold text-gray-900 mb-6">
          Get Started Free
        </h3>
        <p className="text-lg text-gray-600 mb-8">
          No credit card required. 100 short links per month free forever.
        </p>
        <button className="px-8 py-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-bold text-lg">
          Start Shortening
        </button>
      </section>
    </div>
  );
}
```

---

## DEPLOYMENT CHECKLIST

**Before pushing to production:**

- [ ] All components render without errors
- [ ] API endpoints return correct dummy data
- [ ] Responsive design tested (mobile/tablet/desktop)
- [ ] All buttons/inputs have proper styling
- [ ] Error messages display correctly
- [ ] Loading states show spinner
- [ ] Focus states visible on keyboard navigation
- [ ] Accessibility: tab order correct, labels present
- [ ] Colors match purple (#9333ea) + white theme
- [ ] No console errors or warnings

---

**END OF IMPLEMENTATION PLAN**