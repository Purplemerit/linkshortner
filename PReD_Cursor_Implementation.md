# ENHANCED PROCESS REQUIREMENT DOCUMENT (PReD) v2.0
## Frontend Development & Cursor Implementation Guide

**Document Version:** 2.0 - Cursor Optimized  
**Last Updated:** November 26, 2025  
**Focus:** Frontend Only (Next.js 14 + React 18 + TypeScript)  
**Status:** Ready for Cursor Development  

---

## PART 1: CURSOR PROMPTS & IMPLEMENTATION

### 🎯 Cursor Prompt Formula

Each feature follows this prompt structure:

```
"Create a React component for [FEATURE_NAME] using:
- Next.js 14 + React 18 + TypeScript
- TailwindCSS for styling
- White background, purple accents (#9333ea)
- Follow this user flow: [USER_FLOW]
- Use this dummy data: [DUMMY_DATA]
- Implement these functionalities: [FUNCTIONALITY_LIST]
- Error handling for: [ERROR_CASES]"
```

---

## CATEGORY 1: LINK MANAGEMENT FEATURES

### 🎯 Cursor Prompt #1: Link Shortener Component

```
Create a React component for Link Shortening using:
- Next.js 14 + React 18 + TypeScript
- TailwindCSS styling (white bg, purple accents)

User Flow:
1. User enters URL in input field
2. System validates URL format
3. On submit, show loading state
4. Display generated short code
5. Allow copying to clipboard

Dummy Data Response:
{
  "shortCode": "abc123",
  "shortUrl": "https://short.link/abc123",
  "destination": "https://example.com/very-long-url",
  "createdAt": "2025-11-26T10:00:00Z",
  "clicks": 0
}

Functionalities:
- URL validation (must start with http/https)
- Copy-to-clipboard button
- Loading spinner while creating
- Success message
- Error message on failure
- Disabled state during API call

Error Cases:
- Invalid URL format
- API call fails
- Network timeout

UI Elements:
- Input field (w-full, border-2 border-gray-300)
- Submit button (bg-purple-600, hover:bg-purple-700)
- Result display area
- Copy button (text-purple-600)
"
```

**Expected Output:**
```tsx
// File: components/LinkShortener.tsx
export function LinkShortener() {
  // Component code
}
```

---

### 🎯 Cursor Prompt #2: Custom Code Input Component

```
Create a React component for Custom Code Validation using:
- Next.js 14 + React 18 + TypeScript
- Real-time availability checking
- Debounced API calls (500ms delay)

User Flow:
1. User types custom code (e.g., "my-campaign")
2. Debounce waits 500ms after user stops typing
3. Call API to check availability
4. Show ✓ (green) if available
5. Show ✗ (red) if taken
6. Show "Checking..." while loading

Dummy Data:
Available: { "code": "my-campaign", "available": true }
Taken: { "code": "admin", "available": false, "suggestion": "admin-2024" }

Features:
- Real-time validation feedback
- Debounced API calls
- Allowed characters: a-z, 0-9, hyphens
- Min 3 chars, max 50 chars
- Show prefix "short.link/" before input
- Disable submit if not available

API Endpoint:
GET /api/links/check-availability?code=my-campaign
"
```

---

### 🎯 Cursor Prompt #3: Link Tags Component

```
Create a React component for Link Tagging using:
- Next.js 14 + React 18 + TypeScript
- Suggested tags: ["Campaign", "Social", "Email", "Q4-2025"]

User Flow:
1. User types tag name or clicks suggested tag
2. Tag added to selected tags array
3. Display as purple pills with X button
4. Remove tag on X click
5. Prevent duplicate tags

Functionalities:
- Add tag on Enter key
- Add tag by clicking suggested
- Remove tag by clicking X button
- Show autocomplete suggestions
- Prevent duplicate tags
- Persist tags to component state

Dummy Data:
initialTags: ["Campaign", "Q4-2025"]
suggestedTags: ["Campaign", "Social", "Email", "Q4-2025"]

UI:
- Selected tags: bg-purple-600, text-white, rounded-full
- Suggested tags: border-2 border-gray-300, clickable
- Input field: focus:border-purple-600
"
```

---

### 🎯 Cursor Prompt #4: Links Dashboard Table

```
Create a React component for Links Dashboard using:
- Next.js 14 + React 18 + TypeScript
- Responsive table (desktop), card layout (mobile)

User Flow:
1. Display list of user's links
2. Show: Short URL, Destination, Clicks, Created Date
3. Allow sorting by: Newest, Oldest, Most Clicks
4. Allow search by: Short code or destination
5. Show pagination: 25/50/100 per page
6. Hover effect on rows

Dummy Data:
[
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

Features:
- Search input (top of table)
- Sort dropdown
- Pagination buttons
- Truncate long URLs with ellipsis
- Stripe table rows (hover:bg-gray-50)
- Action buttons: View, Edit, Delete

UI:
- Table header: bg-gray-50, border-b-2
- Table rows: border-b border-gray-200
- Short URLs: font-mono, text-purple-600
- Clicks: font-bold
"
```

---

### 🎯 Cursor Prompt #5: Password Protection Feature

```
Create a React component for Password-Protected Links using:
- Next.js 14 + React 18 + TypeScript

User Flow:
1. Show toggle: "Protect this link with password"
2. If toggled ON, show password input
3. Min 6 characters
4. Show password strength indicator
5. Confirm password match
6. Save on submit

Password Strength:
- Weak (0-3): Red
- Medium (4-5): Yellow
- Strong (6+): Green

Dummy Data:
{ "protected": false, "password": "" }

Features:
- Password visibility toggle (eye icon)
- Password strength meter
- Character count
- Confirm password field
- Match validation

UI:
- Toggle switch (purple when ON)
- Password fields: border-2 border-gray-300
- Strength meter: bg-gray-200, fill color based on strength
- Confirm check: ✓ when passwords match
"
```

---

### 🎯 Cursor Prompt #6: Link Expiration Feature

```
Create a React component for Link Expiration using:
- Next.js 14 + React 18 + TypeScript
- Both time-based and click-based expiration

User Flow:
1. Show two tabs: "Time-Based" and "Click-Based"
2. Time-Based: Date + time picker, show when expires
3. Click-Based: Number input (1-10,000), show remaining clicks
4. Both can be set simultaneously
5. Whichever triggers first will expire link
6. Show preview: "Expires in X days" or "Max 100 clicks"

Dummy Data:
{
  "expirationMode": "time", // or "clicks" or "both"
  "expiresAt": "2025-12-26T23:59:59Z",
  "maxClicks": 500
}

Features:
- Tab switcher: Time-Based / Click-Based / Both
- Date picker (HTML5 input type="date")
- Time picker (HTML5 input type="time")
- Number input for max clicks
- Preview text showing expiration
- Disable past dates
- Disable zero or negative clicks

UI:
- Tabs: Active = bg-purple-600 text-white, Inactive = bg-gray-200
- Inputs: border-2 border-gray-300, focus:border-purple-600
- Preview: text-sm text-gray-600, italic
"
```

---

## CATEGORY 2: CUSTOM DOMAINS

### 🎯 Cursor Prompt #7: Domain Setup Wizard

```
Create a React component for Domain Setup using:
- Next.js 14 + React 18 + TypeScript
- Multi-step form

Steps:
1. Enter domain name (validation: valid domain format)
2. Show CNAME record instructions
3. Verify domain (poll API every 5 seconds for 2 minutes)
4. Success: Domain added!

Dummy Data:
Step 1: { "domain": "links.company.com" }
Step 2: Show CNAME values
Step 3: { "verified": true, "verifiedAt": "2025-11-26T10:00:00Z" }

Features:
- Domain format validation (regex)
- Step indicator (1/3, 2/3, 3/3)
- Copy CNAME to clipboard
- Auto-verify polling (5s interval)
- Timeout after 2 minutes with error
- Loading spinner during verification
- Success checkmark on completion

Verification Endpoint:
POST /api/domains/verify
Body: { "domain": "links.company.com" }
Response: { "verified": true, "sslCertExpiry": "2026-11-26" }

UI:
- Step indicator: bg-purple-600 for active step
- CNAME box: bg-gray-100, font-mono, text-sm
- Verify button: bg-purple-600, disabled during checking
- Instructions: text-sm text-gray-600
"
```

---

## CATEGORY 3: QR CODE FEATURES

### 🎯 Cursor Prompt #8: QR Code Generator

```
Create a React component for QR Code Generation using:
- Next.js 14 + React 18 + TypeScript
- npm library: qrcode.react

User Flow:
1. Display QR code preview
2. Show size slider (100-600px)
3. Format selector: PNG / JPEG / SVG
4. Download button
5. Copy QR code image to clipboard option

Dummy Data:
{ "shortUrl": "https://short.link/abc123", "size": 300 }

Features:
- Real-time QR preview on size change
- Size slider with display (100px to 600px)
- Format buttons (PNG, JPEG, SVG)
- Download QR with filename: qr-[shortCode].[format]
- Copy to clipboard (using canvas.toDataURL)
- Display QR code URL input (show in modal)

Endpoints:
GET /api/qr/{linkId}?size=300&format=png

UI:
- Preview area: bg-gray-50, p-4, rounded-lg
- Size slider: w-full
- Format buttons: Active = bg-purple-600, Inactive = bg-gray-200
- Download button: bg-purple-600, w-full
- Size display: text-xs text-gray-600
"
```

---

### 🎯 Cursor Prompt #9: QR Code Customization

```
Create a React component for QR Customization using:
- Next.js 14 + React 18 + TypeScript
- Color picker for foreground/background
- Logo upload

User Flow:
1. Show current QR (default black on white)
2. Foreground color picker (default: #000000)
3. Background color picker (default: #FFFFFF)
4. Logo upload (optional, max 500KB)
5. Preview updates in real-time
6. Validate contrast (min 4.5:1 ratio)

Features:
- Color picker inputs (hex or RGB)
- Live preview as colors change
- Logo upload (PNG/JPG, square recommended)
- Logo size: covers ~20% of QR center
- Contrast validation (warning if too low)
- Presets: 5 popular color schemes
- Reset to default button

Color Presets:
[
  { "name": "Original", "fg": "#000000", "bg": "#FFFFFF" },
  { "name": "Dark", "fg": "#1F2937", "bg": "#F3F4F6" },
  { "name": "Purple", "fg": "#7C3AED", "bg": "#F3E8FF" },
  { "name": "Blue", "fg": "#1E40AF", "bg": "#EFF6FF" },
  { "name": "Green", "fg": "#166534", "bg": "#F0FDF4" }
]

UI:
- Color inputs: type="color" with hex fallback
- Logo preview: w-16 h-16, rounded-lg
- Contrast indicator: Red/Yellow/Green
- Preset buttons: grid, clickable
"
```

---

## CATEGORY 4: ANALYTICS

### 🎯 Cursor Prompt #10: Real-Time Analytics Dashboard

```
Create a React component for Analytics Dashboard using:
- Next.js 14 + React 18 + TypeScript
- Real-time updates (WebSocket or poll every 5 seconds)

Display:
- Total Clicks (big number)
- Unique Visitors (big number)
- Click Rate % (calculated)
- Top Device (Mobile/Desktop/Tablet)
- Top Countries (table with 3 rows)
- Device Breakdown (pie chart)
- Time range filter: Today, 7d, 30d, Custom

Dummy Data:
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
  }
}

Features:
- Real-time updates (WebSocket preferred)
- Time range selector with quick buttons
- Metric cards with icons
- Progress bars for device breakdown
- Country table with flags (optional)
- Responsive grid layout
- Loading state while fetching

API Endpoint:
GET /api/links/{linkId}/analytics?range=7d
Response: [See dummy data above]

UI:
- Metric cards: bg-white, border-2 border-gray-200, p-6
- Number display: text-3xl font-bold text-gray-900
- Time buttons: Active = bg-purple-600, Inactive = bg-gray-200
- Progress bars: bg-gray-200, fill color = bg-purple-600
- Table: striped rows (hover:bg-gray-50)
"
```

---

### 🎯 Cursor Prompt #11: Click Trend Chart

```
Create a React component for Click Trends using:
- Next.js 14 + React 18 + TypeScript
- Recharts library for visualization
- Line chart showing clicks over time

Data Display:
- X-axis: Date/Time
- Y-axis: Click count
- Line color: Purple (#9333EA)
- Hover tooltip showing exact count

Dummy Data (7 days):
[180, 220, 150, 140, 160, 200, 200]
Dates: [Nov 20, Nov 21, Nov 22, Nov 23, Nov 24, Nov 25, Nov 26]

Features:
- Line chart (Recharts LineChart)
- Smooth curve
- Gradient area under line (optional)
- Hover tooltip with date + count
- Responsive width (100%)
- Min height 300px
- Legend showing "Total Clicks"

API Endpoint:
GET /api/links/{linkId}/analytics/trend?granularity=daily&range=7d

UI:
- Chart container: bg-white, border-2 border-gray-200, p-6, rounded-lg
- Line color: #9333EA (purple)
- Grid: light gray
- Tooltip: dark bg with white text
"
```

---

## CATEGORY 5: TEAM & COLLABORATION

### 🎯 Cursor Prompt #12: Team Members List

```
Create a React component for Team Management using:
- Next.js 14 + React 18 + TypeScript

User Flow:
1. Show list of team members
2. Display: Email, Role, Joined Date
3. Owner or Admin can remove members
4. Show invite button to add new
5. Show member count

Dummy Data:
[
  { "id": "1", "email": "john@company.com", "role": "owner", "joinedAt": "2025-11-20" },
  { "id": "2", "email": "jane@company.com", "role": "admin", "joinedAt": "2025-11-22" },
  { "id": "3", "email": "bob@company.com", "role": "editor", "joinedAt": "2025-11-24" }
]

Features:
- Table display (desktop), card view (mobile)
- Role badges: Owner (purple), Admin (blue), Editor (gray), Viewer (light gray)
- Remove button (delete confirmation modal)
- Invite button (opens modal)
- Filter by role (optional)
- Member count header

Roles:
- Owner: All permissions
- Admin: Manage links + team
- Editor: Create/edit own links
- Viewer: Read-only access

API:
DELETE /api/team/members/{memberId}
POST /api/team/members/invite

UI:
- Member table: bg-white, border-2 border-gray-200
- Role badges: px-3 py-1, rounded-full, font-semibold, text-sm
- Remove button: text-red-600, hover:text-red-700
- Invite button: bg-purple-600, text-white, w-full or top-right
"
```

---

### 🎯 Cursor Prompt #13: Team Invite Modal

```
Create a React component for Team Invite Dialog using:
- Next.js 14 + React 18 + TypeScript
- Modal/dialog component

User Flow:
1. Open modal on "Invite Member" button click
2. Enter email address
3. Select role from dropdown
4. Show preview: "John will be invited as Editor"
5. Send invite button
6. Show success message

Dummy Data:
{ "email": "newmember@company.com", "role": "editor" }

Features:
- Email validation
- Role selector (Owner, Admin, Editor, Viewer)
- Preview text (updates on change)
- Cancel button (close modal)
- Send button (disabled if no email/role)
- Success toast notification
- Error message if email invalid or already member

UI:
- Modal: bg-white, rounded-lg, border-2 border-gray-200, shadow-lg
- Input: border-2 border-gray-300, focus:border-purple-600
- Role selector: dropdown or button group
- Preview: text-sm text-gray-600, italic
- Send button: bg-purple-600, text-white
- Cancel button: bg-gray-200, text-gray-900
"
```

---

## CURSOR CODE VALIDATION CHECKLIST

After Cursor generates each component, validate:

- [ ] TypeScript types properly defined
- [ ] Props interface documented
- [ ] Dummy data follows API response format
- [ ] All error cases handled (try/catch)
- [ ] Loading states shown
- [ ] Disabled states on buttons during API calls
- [ ] Responsive layout (mobile/tablet/desktop)
- [ ] Accessibility: proper labels, ARIA attributes
- [ ] Color scheme: white bg, purple accents
- [ ] Border radius: consistent (lg, rounded-lg)
- [ ] Spacing: consistent 4px grid
- [ ] Focus states: visible focus rings on inputs
- [ ] No console errors or warnings

---

## CURSOR WORKFLOW EXAMPLE

**Step 1: Ask Cursor**
```
Copy prompt #1 from above into Cursor chat
```

**Step 2: Cursor generates component**
```tsx
// components/LinkShortener.tsx
export function LinkShortener() { ... }
```

**Step 3: Validate against checklist**
```
- Types? ✓
- Dummy data? ✓
- Error handling? ✓
- Loading state? ✓
- etc.
```

**Step 4: Ask Cursor to fix issues**
```
"Add error handling for [specific issue]"
"Add loading spinner in center of button"
"Change color from #xxx to #9333ea"
```

**Step 5: Save to components/ folder**
```
src/components/LinkShortener.tsx
```

---

**END OF PROCESS REQUIREMENT DOCUMENT - CURSOR OPTIMIZED**