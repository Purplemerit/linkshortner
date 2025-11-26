# ENHANCED PRODUCT REQUIREMENT DOCUMENT (PRD) v2.0
## Privacy-First URL Shortener - Frontend & API Specifications

**Document Version:** 2.0 - Cursor Optimized  
**Last Updated:** November 26, 2025  
**Tech Stack:** Next.js 14 + TypeScript + React 18 (Frontend Only)  
**Status:** Ready for Frontend Development  

---

## EXECUTIVE SUMMARY

### Product Vision
Build the **most feature-rich, privacy-first URL shortener** at the **lowest price**, targeting SMBs and developers with a beautiful, minimalist white+purple UI.

### Key Differentiators
1. **Privacy-First Analytics** - No cookies, IP anonymized
2. **Broken Link Monitoring** - Automated health checks
3. **Most Features at Lowest Price** - $9-15/mo vs Bitly $29+/mo
4. **Beautiful Minimalist UI** - White background, purple accents
5. **Self-Hosted + Managed** - Full control or convenience

### Target Users
- SMBs (10-100 employees)
- Individual developers
- Digital agencies
- Content creators

---

## CATEGORY 1: CORE LINK MANAGEMENT FEATURES (16 Features)

### Feature 1: Link Shortening (Basic URL Shortening)

**User Flow:**
```
User enters long URL → System generates short code → Short link created
```

**Frontend UI:**
```tsx
// components/LinkShortener.tsx
interface LinkShortenerProps {
  onSuccess: (shortLink: string) => void;
}

export function LinkShortener({ onSuccess }: LinkShortenerProps) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleShorten = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/links', {
        method: 'POST',
        body: JSON.stringify({ destination: url }),
      });
      
      if (!response.ok) throw new Error('Failed to shorten');
      
      const { shortUrl } = await response.json();
      onSuccess(shortUrl);
      setUrl('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-8 bg-white rounded-lg">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Shorten Your Link</h2>
      
      <div className="flex gap-4">
        <input
          type="url"
          placeholder="https://example.com/very-long-url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-600"
          disabled={loading}
        />
        
        <button
          onClick={handleShorten}
          disabled={loading || !url}
          className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400"
        >
          {loading ? 'Shortening...' : 'Shorten'}
        </button>
      </div>
      
      {error && <p className="mt-4 text-red-600">{error}</p>}
    </div>
  );
}
```

**API Endpoint:**
```
POST /api/links
Request Body:
{
  "destination": "https://example.com/very-long-url"
}

Response (201):
{
  "id": "link-123",
  "shortCode": "abc123",
  "shortUrl": "https://short.link/abc123",
  "destination": "https://example.com/very-long-url",
  "createdAt": "2025-11-26T10:00:00Z",
  "clicks": 0
}
```

**Dummy Data:**
```json
{
  "shortCode": "abc123",
  "shortUrl": "https://short.link/abc123",
  "destination": "https://example.com/very-long-url",
  "clicks": 42
}
```

---

### Feature 2: Custom Short URL / Back-Half Creation

**User Flow:**
```
User enters custom alias → System checks availability → Custom code reserved
```

**Frontend UI:**
```tsx
// components/CustomCodeInput.tsx
interface CustomCodeInputProps {
  onReserve: (code: string) => void;
}

export function CustomCodeInput({ onReserve }: CustomCodeInputProps) {
  const [customCode, setCustomCode] = useState('');
  const [available, setAvailable] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(false);

  const checkAvailability = async (code: string) => {
    if (!code) return;
    
    setChecking(true);
    try {
      const response = await fetch(`/api/links/check-availability?code=${code}`);
      const { available: isAvailable } = await response.json();
      setAvailable(isAvailable);
    } catch (err) {
      setAvailable(false);
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 rounded-lg border-2 border-gray-200">
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        Custom Short Code (Optional)
      </label>
      
      <div className="flex gap-2">
        <span className="flex items-center px-3 bg-gray-200 rounded-lg text-gray-700">
          short.link/
        </span>
        
        <input
          type="text"
          placeholder="my-campaign"
          value={customCode}
          onChange={(e) => {
            setCustomCode(e.target.value);
            checkAvailability(e.target.value);
          }}
          className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-600"
        />
        
        {checking && <span className="text-yellow-600">Checking...</span>}
        {available && <span className="text-green-600">✓ Available</span>}
        {available === false && <span className="text-red-600">✗ Taken</span>}
      </div>
    </div>
  );
}
```

**API Endpoint:**
```
GET /api/links/check-availability?code=my-campaign

Response:
{
  "code": "my-campaign",
  "available": true,
  "shortUrl": "https://short.link/my-campaign"
}
```

**Dummy Data:**
```json
{
  "code": "my-campaign",
  "available": true,
  "suggestion": "my-campaign-2024"
}
```

---

### Feature 3: HTTPS/SSL Encryption

**Status:** Automatic - All links use HTTPS by default

**Frontend Display:**
```tsx
// Show SSL indicator in dashboard
<div className="flex items-center gap-2 text-green-600">
  <LockIcon />
  <span>Secure HTTPS</span>
</div>
```

---

### Feature 4: API Access (REST API)

**API Documentation:**
```
Base URL: https://api.short.link/v1

Authentication:
  Authorization: Bearer {API_TOKEN}

Endpoints:
  POST   /links              (Create link)
  GET    /links              (List links)
  GET    /links/{id}         (Get link details)
  PATCH  /links/{id}         (Update link)
  DELETE /links/{id}         (Delete link)
  GET    /links/{id}/analytics (Get analytics)

Rate Limiting:
  Free: 1,000 requests/month
  Starter: 10,000 requests/month
  Pro: 50,000 requests/month
  Enterprise: Unlimited
```

---

### Feature 5: Link Tagging / Organization

**Frontend UI:**
```tsx
// components/LinkTags.tsx
interface LinkTagsProps {
  tags: string[];
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
}

export function LinkTags({ tags, onAddTag, onRemoveTag }: LinkTagsProps) {
  const [inputValue, setInputValue] = useState('');
  const suggestedTags = ['Campaign', 'Social', 'Email', 'Q4-2025'];

  return (
    <div className="p-6 bg-gray-50 rounded-lg">
      <label className="block text-sm font-semibold text-gray-700 mb-3">
        Tags (Optional)
      </label>
      
      {/* Display selected tags */}
      <div className="flex flex-wrap gap-2 mb-3">
        {tags.map((tag) => (
          <div
            key={tag}
            className="px-3 py-1 bg-purple-600 text-white rounded-full text-sm flex items-center gap-2"
          >
            {tag}
            <button
              onClick={() => onRemoveTag(tag)}
              className="hover:text-red-200"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {/* Add tag input */}
      <div className="flex gap-2 mb-3">
        <input
          type="text"
          placeholder="Type or select tag..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && inputValue) {
              onAddTag(inputValue);
              setInputValue('');
            }
          }}
          className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-600"
        />
      </div>

      {/* Suggested tags */}
      <div className="flex flex-wrap gap-2">
        {suggestedTags.map((tag) => (
          <button
            key={tag}
            onClick={() => onAddTag(tag)}
            disabled={tags.includes(tag)}
            className="px-3 py-1 bg-white border-2 border-gray-300 rounded-full text-sm hover:border-purple-600 disabled:opacity-50"
          >
            + {tag}
          </button>
        ))}
      </div>
    </div>
  );
}
```

**API Endpoint:**
```
POST /api/links/{id}/tags
{
  "tags": ["Campaign", "Q4-2025"]
}

Response:
{
  "id": "link-123",
  "tags": ["Campaign", "Q4-2025"]
}
```

---

### Feature 6: Link History / Dashboard

**Frontend UI:**
```tsx
// components/LinksDashboard.tsx
interface Link {
  id: string;
  shortUrl: string;
  destination: string;
  createdAt: string;
  clicks: number;
  tags: string[];
}

export function LinksDashboard() {
  const [links, setLinks] = useState<Link[]>([
    {
      id: 'link-1',
      shortUrl: 'https://short.link/abc123',
      destination: 'https://example.com/product',
      createdAt: '2025-11-26T10:00:00Z',
      clicks: 42,
      tags: ['Campaign']
    },
    {
      id: 'link-2',
      shortUrl: 'https://short.link/xyz789',
      destination: 'https://example.com/about',
      createdAt: '2025-11-25T15:30:00Z',
      clicks: 128,
      tags: ['Social', 'Q4']
    }
  ]);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  return (
    <div className="w-full">
      {/* Filters & Sorting */}
      <div className="mb-6 flex gap-4">
        <input
          type="text"
          placeholder="Search links..."
          className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-600"
        />
        
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2 border-2 border-gray-300 rounded-lg"
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="mostClicks">Most Clicks</option>
          <option value="leastClicks">Least Clicks</option>
        </select>
      </div>

      {/* Links Table */}
      <div className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b-2 border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Short URL
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Destination
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Clicks
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Created
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {links.map((link) => (
              <tr key={link.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-6 py-3">
                  <code className="text-purple-600 font-mono">{link.shortUrl}</code>
                </td>
                <td className="px-6 py-3 text-sm text-gray-600 truncate">
                  {link.destination}
                </td>
                <td className="px-6 py-3 font-semibold">{link.clicks}</td>
                <td className="px-6 py-3 text-sm text-gray-600">
                  {new Date(link.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-3">
                  <button className="text-purple-600 hover:text-purple-700 font-semibold">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

**Dummy Data:**
```json
{
  "links": [
    {
      "id": "link-1",
      "shortUrl": "https://short.link/abc123",
      "destination": "https://example.com/product",
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
}
```

---

### Feature 7-16: (Password Protection, Expiration, Editing, etc.)

*[Detailed specs for Features 7-16 follow same pattern as above]*

**Features 7-16:**
- Feature 7: Password-protected links (UI modal for password input)
- Feature 8: Link expiration (date/time picker + click counter)
- Feature 9: Link destination editing (edit form)
- Feature 10: Bulk link creation (CSV file upload)
- Feature 11: Link cloaking (preview toggle)
- Feature 12: Auto-archive/delete (scheduled actions)
- Feature 13: Multiple custom domains (domain selector)
- Feature 14: Link deactivation/pause (toggle button)
- Feature 15: Link duplication/cloning (copy button)
- Feature 16: Link notes (text area with markdown)

---

## CATEGORY 2: CUSTOM DOMAINS & BRANDING (8 Features)

### Feature 17-24: Domain Management

**Frontend UI - Domain Setup:**
```tsx
// components/DomainSetup.tsx
export function DomainSetup() {
  const [domain, setDomain] = useState('');
  const [status, setStatus] = useState<'pending' | 'verified' | 'error'>('pending');

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-lg border-2 border-gray-200">
      <h3 className="text-2xl font-bold mb-6">Add Custom Domain</h3>
      
      <div className="space-y-6">
        {/* Step 1: Enter domain */}
        <div>
          <label className="block text-sm font-semibold mb-2">Domain Name</label>
          <input
            type="text"
            placeholder="links.yourcompany.com"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-600"
          />
        </div>

        {/* Step 2: DNS Instructions */}
        {domain && (
          <div className="bg-purple-50 p-6 rounded-lg border-2 border-purple-200">
            <h4 className="font-semibold text-gray-900 mb-3">Step 2: Add CNAME Record</h4>
            <p className="text-sm text-gray-700 mb-3">Add this DNS record to your provider:</p>
            <div className="bg-white p-3 rounded border border-gray-300 font-mono text-sm mb-3">
              <div>Type: <span className="font-bold">CNAME</span></div>
              <div>Name: <span className="font-bold">{domain}</span></div>
              <div>Value: <span className="font-bold">platform.short.link</span></div>
            </div>
            <button className="text-purple-600 hover:text-purple-700 font-semibold text-sm">
              Copy to Clipboard
            </button>
          </div>
        )}

        {/* Step 3: Verify */}
        <button className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold">
          Verify Domain
        </button>
      </div>
    </div>
  );
}
```

---

## CATEGORY 3: QR CODE FEATURES (8 Features)

### Feature 25: Simple QR Code Generation

**Frontend UI:**
```tsx
// components/QRCodeGenerator.tsx
import QRCode from 'qrcode.react';

interface QRCodeGeneratorProps {
  shortUrl: string;
}

export function QRCodeGenerator({ shortUrl }: QRCodeGeneratorProps) {
  const qrRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState(300);
  const [format, setFormat] = useState<'png' | 'jpeg' | 'svg'>('png');

  const downloadQR = () => {
    const canvas = qrRef.current?.querySelector('canvas');
    if (!canvas) return;

    const link = document.createElement('a');
    link.href = canvas.toDataURL(`image/${format}`);
    link.download = `qr-code.${format}`;
    link.click();
  };

  return (
    <div className="p-8 bg-white rounded-lg border-2 border-gray-200">
      <h3 className="text-2xl font-bold mb-6">QR Code</h3>

      {/* QR Preview */}
      <div
        ref={qrRef}
        className="flex justify-center mb-6 p-4 bg-gray-50 rounded-lg"
      >
        <QRCode value={shortUrl} size={size} />
      </div>

      {/* Controls */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-2">Size</label>
          <input
            type="range"
            min="100"
            max="600"
            value={size}
            onChange={(e) => setSize(parseInt(e.target.value))}
            className="w-full"
          />
          <span className="text-xs text-gray-600">{size}x{size}px</span>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Format</label>
          <div className="flex gap-2">
            {(['png', 'jpeg', 'svg'] as const).map((fmt) => (
              <button
                key={fmt}
                onClick={() => setFormat(fmt)}
                className={`px-4 py-2 rounded-lg font-semibold ${
                  format === fmt
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-200 text-gray-900'
                }`}
              >
                {fmt.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={downloadQR}
          className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold"
        >
          Download QR Code
        </button>
      </div>
    </div>
  );
}
```

---

## CATEGORY 4: ANALYTICS & REPORTING (12 Features)

### Feature 33: Real-Time Analytics Dashboard

**Frontend UI:**
```tsx
// components/AnalyticsDashboard.tsx
interface AnalyticsData {
  totalClicks: number;
  uniqueClicks: number;
  topCountries: Array<{ country: string; clicks: number }>;
  topReferrers: Array<{ referrer: string; clicks: number }>;
  deviceBreakdown: { mobile: number; desktop: number; tablet: number };
}

export function AnalyticsDashboard({ linkId }: { linkId: string }) {
  const [data, setData] = useState<AnalyticsData>({
    totalClicks: 1250,
    uniqueClicks: 890,
    topCountries: [
      { country: 'United States', clicks: 450 },
      { country: 'India', clicks: 280 },
      { country: 'Canada', clicks: 160 }
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
    }
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      {/* Key Metrics */}
      <div className="bg-white p-6 rounded-lg border-2 border-gray-200">
        <p className="text-sm text-gray-600 mb-2">Total Clicks</p>
        <p className="text-3xl font-bold text-gray-900">{data.totalClicks}</p>
      </div>

      <div className="bg-white p-6 rounded-lg border-2 border-gray-200">
        <p className="text-sm text-gray-600 mb-2">Unique Visitors</p>
        <p className="text-3xl font-bold text-gray-900">{data.uniqueClicks}</p>
      </div>

      <div className="bg-white p-6 rounded-lg border-2 border-gray-200">
        <p className="text-sm text-gray-600 mb-2">Click Rate</p>
        <p className="text-3xl font-bold text-purple-600">
          {((data.uniqueClicks / data.totalClicks) * 100).toFixed(1)}%
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg border-2 border-gray-200">
        <p className="text-sm text-gray-600 mb-2">Top Device</p>
        <p className="text-3xl font-bold text-gray-900">Mobile</p>
        <p className="text-xs text-gray-500">{data.deviceBreakdown.mobile} clicks</p>
      </div>

      {/* Top Countries */}
      <div className="bg-white p-6 rounded-lg border-2 border-gray-200 md:col-span-2">
        <h3 className="font-bold mb-4">Top Countries</h3>
        {data.topCountries.map((item) => (
          <div key={item.country} className="flex justify-between mb-2 text-sm">
            <span>{item.country}</span>
            <span className="font-semibold">{item.clicks}</span>
          </div>
        ))}
      </div>

      {/* Device Breakdown */}
      <div className="bg-white p-6 rounded-lg border-2 border-gray-200 md:col-span-2">
        <h3 className="font-bold mb-4">Devices</h3>
        <div className="space-y-2">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Mobile</span>
              <span>{data.deviceBreakdown.mobile}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-purple-600 h-2 rounded-full"
                style={{
                  width: `${(data.deviceBreakdown.mobile / data.totalClicks) * 100}%`
                }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Desktop</span>
              <span>{data.deviceBreakdown.desktop}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-purple-600 h-2 rounded-full"
                style={{
                  width: `${(data.deviceBreakdown.desktop / data.totalClicks) * 100}%`
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

**API Endpoint:**
```
GET /api/links/{linkId}/analytics?range=7d

Response:
{
  "linkId": "link-123",
  "period": "7days",
  "totalClicks": 1250,
  "uniqueClicks": 890,
  "clicksPerDay": [180, 220, 150, 140, 160, 200, 200],
  "topCountries": [
    { "country": "United States", "clicks": 450, "percentage": 36 },
    { "country": "India", "clicks": 280, "percentage": 22 },
    { "country": "Canada", "clicks": 160, "percentage": 13 }
  ],
  "topReferrers": [
    { "referrer": "twitter.com", "clicks": 350, "percentage": 28 },
    { "referrer": "reddit.com", "clicks": 280, "percentage": 22 },
    { "referrer": "direct", "clicks": 260, "percentage": 21 }
  ],
  "deviceBreakdown": {
    "mobile": 650,
    "desktop": 450,
    "tablet": 150
  },
  "topBrowsers": [
    { "browser": "Chrome", "clicks": 500 },
    { "browser": "Safari", "clicks": 320 },
    { "browser": "Firefox", "clicks": 180 }
  ]
}
```

---

## CATEGORY 5: TEAM & COLLABORATION (4 Features)

### Feature 45-48: Team Management UI

**Frontend UI - Invite Team Members:**
```tsx
// components/TeamInvite.tsx
export function TeamInvite() {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'editor' | 'viewer'>('editor');
  const [members, setMembers] = useState([
    { id: '1', email: 'john@company.com', role: 'owner', joinedAt: '2025-11-20' },
    { id: '2', email: 'jane@company.com', role: 'admin', joinedAt: '2025-11-22' }
  ]);

  const handleInvite = async () => {
    // Dummy implementation
    setMembers([...members, {
      id: Date.now().toString(),
      email,
      role,
      joinedAt: new Date().toISOString().split('T')[0]
    }]);
    setEmail('');
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h2 className="text-2xl font-bold mb-6">Team Members</h2>

      {/* Invite Form */}
      <div className="bg-white p-6 rounded-lg border-2 border-gray-200 mb-8">
        <h3 className="font-bold mb-4">Invite New Member</h3>
        
        <div className="space-y-4">
          <input
            type="email"
            placeholder="team@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-600"
          />

          <select
            value={role}
            onChange={(e) => setRole(e.target.value as any)}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg"
          >
            <option value="editor">Editor (Can create/edit links)</option>
            <option value="viewer">Viewer (Read-only)</option>
          </select>

          <button
            onClick={handleInvite}
            className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold"
          >
            Send Invite
          </button>
        </div>
      </div>

      {/* Members List */}
      <div className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b-2 border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold">Email</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Role</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Joined</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-6 py-3">{member.email}</td>
                <td className="px-6 py-3">
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
                    {member.role}
                  </span>
                </td>
                <td className="px-6 py-3 text-sm text-gray-600">{member.joinedAt}</td>
                <td className="px-6 py-3">
                  <button className="text-red-600 hover:text-red-700 font-semibold">
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

---

## COMPLETE FEATURE LIST (50 MVP Features)

**CATEGORY 1: Link Management (16 features)**
1. Link shortening ✓
2. Custom alias ✓
3. HTTPS/SSL
4. API access
5. Link tagging ✓
6. Link history ✓
7. Password protection
8. Link expiration
9. Link destination editing
10. Bulk import
11. Link cloaking
12. Auto-archive
13. Multiple domains
14. Link pause
15. Link cloning
16. Link notes

**CATEGORY 2: Domains (8 features)**
17. Domain setup
18. DNS verification
19. SSL automation
20. Health monitoring
21. Root router
22. Custom 404 pages
23. Domain analytics
24. Multi-domain dashboard

**CATEGORY 3: QR Codes (8 features)**
25. QR generation ✓
26. PNG format
27. JPEG format
28. Size customization
29. Color customization
30. Gradients/patterns
31. Logo/branding
32. SVG format

**CATEGORY 4: Analytics (12 features)**
33. Real-time dashboard ✓
34. Click counts
35. Real-time tracking
36. Time-series data
37. Date filters
38. Unique vs total
39. Geographic data
40. City-level analytics
41. Device tracking
42. Browser tracking
43. Referrer tracking
44. OS tracking

**CATEGORY 5: Team (4 features)**
45. Multi-user accounts
46. RBAC
47. Workspace segmentation
48. Activity logs

**CATEGORY 6: API (2 features)**
49. REST API
50. API authentication

---

**END OF ENHANCED PRD - FRONTEND & API ONLY**