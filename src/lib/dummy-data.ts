export interface Link {
  id: string;
  shortCode: string;
  shortUrl: string;
  destination: string;
  createdAt: Date | string;
  clicks: number;
  uniqueClicks: number;
  tags: string[];
  protected: boolean;
  expiresAt: Date | string | null;
  maxClicks: number | null;
  active: boolean;
  notes?: string;
  password?: string | null;
  workspaceId?: string | null;
  campaignId?: string | null;
  campaign?: { id: string; name: string } | null;
}

export interface AnalyticsData {
  totalClicks: number;
  uniqueClicks: number;
  topCountries: Array<{ country: string; clicks: number; percentage: number }>;
  topReferrers: Array<{ referrer: string; clicks: number; percentage: number }>;
  deviceBreakdown: {
    mobile: number;
    desktop: number;
    tablet: number;
  };
  clicksByDay: number[];
  topBrowsers: Array<{ browser: string; clicks: number }>;
  topOS: Array<{ os: string; clicks: number }>;
}

export interface TeamMember {
  id: string;
  email: string;
  role: 'owner' | 'admin' | 'editor' | 'viewer';
  joinedAt: string;
}

export const dummyLinks: Link[] = [
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
    maxClicks: null,
    active: true,
    notes: 'Main campaign link for Q4'
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
    maxClicks: 500,
    active: true
  },
  {
    id: 'link-3',
    shortCode: 'campaign-2025',
    shortUrl: 'https://short.link/campaign-2025',
    destination: 'https://example.com/special-offer',
    createdAt: new Date('2025-11-24'),
    clicks: 256,
    uniqueClicks: 180,
    tags: ['Campaign', 'Email', 'Q4-2025'],
    protected: false,
    expiresAt: new Date('2025-12-31'),
    maxClicks: null,
    active: true
  }
];

export const dummyAnalytics: AnalyticsData = {
  totalClicks: 1250,
  uniqueClicks: 890,
  topCountries: [
    { country: 'United States', clicks: 450, percentage: 36 },
    { country: 'India', clicks: 280, percentage: 22 },
    { country: 'Canada', clicks: 160, percentage: 13 },
    { country: 'United Kingdom', clicks: 120, percentage: 10 },
    { country: 'Germany', clicks: 90, percentage: 7 }
  ],
  topReferrers: [
    { referrer: 'twitter.com', clicks: 350, percentage: 28 },
    { referrer: 'reddit.com', clicks: 280, percentage: 22 },
    { referrer: 'direct', clicks: 260, percentage: 21 },
    { referrer: 'facebook.com', clicks: 180, percentage: 14 },
    { referrer: 'linkedin.com', clicks: 100, percentage: 8 }
  ],
  deviceBreakdown: {
    mobile: 650,
    desktop: 450,
    tablet: 150
  },
  clicksByDay: [180, 220, 150, 140, 160, 200, 200],
  topBrowsers: [
    { browser: 'Chrome', clicks: 500 },
    { browser: 'Safari', clicks: 320 },
    { browser: 'Firefox', clicks: 180 },
    { browser: 'Edge', clicks: 150 },
    { browser: 'Opera', clicks: 100 }
  ],
  topOS: [
    { os: 'Windows', clicks: 500 },
    { os: 'iOS', clicks: 350 },
    { os: 'Android', clicks: 200 },
    { os: 'macOS', clicks: 150 },
    { os: 'Linux', clicks: 50 }
  ]
};

export const dummyTeamMembers: TeamMember[] = [
  {
    id: '1',
    email: 'john@company.com',
    role: 'owner',
    joinedAt: '2025-11-20'
  },
  {
    id: '2',
    email: 'jane@company.com',
    role: 'admin',
    joinedAt: '2025-11-22'
  },
  {
    id: '3',
    email: 'bob@company.com',
    role: 'editor',
    joinedAt: '2025-11-24'
  },
  {
    id: '4',
    email: 'alice@company.com',
    role: 'viewer',
    joinedAt: '2025-11-25'
  }
];

// Reserved codes that should return as unavailable
export const reservedCodes = ['admin', 'api', 'dashboard', 'login', 'signup', 'settings', 'help', 'about', 'contact'];

