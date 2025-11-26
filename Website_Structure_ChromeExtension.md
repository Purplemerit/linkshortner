# WEBSITE STRUCTURE & CHROME EXTENSION DESIGN DOCUMENT
## Complete Page Architecture + SEO + Conversion Optimization

**Document Version:** 1.0  
**Last Updated:** November 26, 2025  
**Design:** White background, purple accents (#9333ea)  
**Status:** Ready for Implementation  

---

## PART 1: WEBSITE PAGES & ARCHITECTURE

### Website Sitemap (9 Core Pages)

```
Homepage (/)
  ├─ Hero Section
  ├─ Features Preview (Top 12 of 50)
  ├─ Pricing Preview
  └─ CTA Section

Features Page (/features)
  ├─ All 50 MVP Features
  ├─ Feature Categories
  ├─ Use Cases
  └─ Search/Filter

Pricing Page (/pricing)
  ├─ Tier Comparison Table
  ├─ Monthly/Annual Toggle
  ├─ Free Tier Details
  └─ FAQ

Documentation (/docs)
  ├─ API Reference
  ├─ Quick Start
  └─ Integration Guides

Blog (/blog)
  ├─ Launch Post
  ├─ Tutorial: "How to Create QR Codes"
  ├─ Guide: "Privacy-First Analytics"
  └─ Blog List

Comparison Page (/comparison)
  ├─ vs Bitly
  ├─ vs Short.io
  ├─ vs Rebrandly
  └─ Feature Matrix

Self-Hosted Guide (/self-hosted)
  ├─ Docker Setup
  ├─ Prerequisites
  ├─ Installation Steps
  └─ Configuration

Enterprise Page (/enterprise)
  ├─ Enterprise Features
  ├─ Contact Form
  ├─ Case Studies
  └─ Custom Solutions

Privacy & Legal
  ├─ Privacy Policy (/privacy)
  ├─ Terms of Service (/terms)
  └─ Security & Compliance (/security)
```

---

## PART 2: HOMEPAGE STRUCTURE

### Homepage Wireframe (Full Page Sections)

**1. Navigation Bar (Fixed, Sticky)**

```html
<nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
  <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
    <!-- Left: Logo -->
    <div className="flex items-center gap-2">
      <span className="text-2xl font-bold text-purple-600">short.link</span>
      <span className="text-sm text-gray-600">Privacy-first URL shortener</span>
    </div>
    
    <!-- Center: Links -->
    <div className="hidden md:flex gap-8">
      <a href="#features" className="text-gray-600 hover:text-purple-600 font-semibold">Features</a>
      <a href="/pricing" className="text-gray-600 hover:text-purple-600 font-semibold">Pricing</a>
      <a href="/docs" className="text-gray-600 hover:text-purple-600 font-semibold">Docs</a>
      <a href="/blog" className="text-gray-600 hover:text-purple-600 font-semibold">Blog</a>
    </div>
    
    <!-- Right: CTA Buttons -->
    <div className="flex gap-4">
      <button className="px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-lg font-semibold">
        Sign In
      </button>
      <button className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold">
        Get Started Free
      </button>
    </div>
  </div>
</nav>
```

**SEO Tags:**
```html
<title>short.link - Privacy-First URL Shortener | 50+ Features</title>
<meta name="description" content="The most feature-rich, privacy-first URL shortener at the lowest price. Create beautiful short links with real-time analytics. No cookies. No tracking. $9-15/mo." />
<meta name="keywords" content="URL shortener, short link, QR code generator, analytics, privacy-first, Bitly alternative" />
<meta name="og:title" content="short.link - Privacy-First URL Shortener" />
<meta name="og:description" content="50+ features. Privacy-first analytics. $9-15/mo. The most affordable URL shortener with broken link monitoring." />
<meta name="og:image" content="/og-image.png" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="short.link - Privacy-First URL Shortener" />
```

**JSON-LD Schema (Structured Data):**
```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "short.link",
  "description": "Privacy-first URL shortener with 50+ features",
  "url": "https://short.link",
  "offers": {
    "@type": "Offer",
    "price": "9",
    "priceCurrency": "USD"
  },
  "applicationCategory": "UtilityApplication",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "ratingCount": "1200"
  }
}
```

---

**2. Hero Section (Above the Fold)**

```html
<section className="px-8 py-32 bg-white">
  <div className="max-w-5xl mx-auto text-center">
    <!-- Main Headline (H1 - Critical for SEO) -->
    <h1 className="text-6xl font-bold text-gray-900 mb-4 leading-tight">
      The Privacy-First URL Shortener
    </h1>
    
    <!-- Subheadline -->
    <p className="text-2xl text-gray-600 mb-8 leading-relaxed">
      50+ features. Real-time analytics. Zero cookies. Starting at just <span className="text-purple-600 font-bold">$9/month</span>
    </p>
    
    <!-- Social Proof -->
    <div className="flex justify-center gap-8 mb-12">
      <div className="text-center">
        <div className="text-2xl font-bold text-gray-900">10,000+</div>
        <div className="text-sm text-gray-600">Active Users</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-gray-900">5M+</div>
        <div className="text-sm text-gray-600">Short Links Created</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-gray-900">4.8★</div>
        <div className="text-sm text-gray-600">User Rating</div>
      </div>
    </div>
    
    <!-- CTA Buttons -->
    <div className="flex gap-4 justify-center mb-12">
      <button className="px-8 py-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-bold text-lg">
        Start Free (100 links/month)
      </button>
      <button className="px-8 py-4 border-2 border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 font-bold text-lg">
        Watch Demo
      </button>
    </div>
    
    <!-- Link Shortener Component (Live Demo) -->
    <LinkShortener />
  </div>
</section>

HTML & Meta for Hero:
<section>
  <h1>The Privacy-First URL Shortener</h1>
  <p>50+ features. Real-time analytics. Zero cookies.</p>
</section>
```

**SEO Optimization:**
- H1 contains main keyword "Privacy-First URL Shortener"
- Subheading includes secondary keywords: "features", "analytics", "pricing"
- Social proof builds trust for conversion
- Clear CTA above the fold

---

**3. Features Preview Section**

```html
<section id="features" className="px-8 py-20 bg-gray-50">
  <div className="max-w-6xl mx-auto">
    <h2 className="text-4xl font-bold text-gray-900 mb-4 text-center">
      Powerful Features for Every Need
    </h2>
    <p className="text-center text-gray-600 mb-12 text-lg">
      All 50 features included in every paid plan. No hidden limits.
    </p>
    
    <!-- 12 Featured Features (Out of 50) -->
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
      <!-- Feature Card Template -->
      <div className="bg-white p-8 rounded-lg border-2 border-gray-200 hover:border-purple-600 hover:shadow-lg transition">
        <div className="text-3xl mb-3">🔗</div>
        <h3 className="text-xl font-bold text-gray-900 mb-3">Link Shortening</h3>
        <p className="text-gray-600 mb-4">Convert any long URL into a beautiful short link in seconds</p>
        <a href="/features#link-shortening" className="text-purple-600 hover:text-purple-700 font-semibold">Learn more →</a>
      </div>
      
      <!-- Repeat for: QR Codes, Analytics, Custom Domains, Password Protection, Team Collab, etc. -->
    </div>
    
    <!-- "See All 50 Features" Link -->
    <div className="text-center">
      <a href="/features" className="px-6 py-3 border-2 border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 font-semibold">
        See All 50 Features →
      </a>
    </div>
  </div>
</section>
```

---

**4. Pricing Preview Section**

```html
<section id="pricing" className="px-8 py-20 bg-white">
  <div className="max-w-6xl mx-auto">
    <h2 className="text-4xl font-bold text-gray-900 mb-4 text-center">
      Simple, Transparent Pricing
    </h2>
    <p className="text-center text-gray-600 mb-12 text-lg">
      No hidden fees. Cancel anytime. 30-day money-back guarantee.
    </p>
    
    <!-- 3-Tier Pricing Cards -->
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <!-- Free Tier -->
      <div className="bg-white border-2 border-gray-200 rounded-lg p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Free</h3>
        <p className="text-gray-600 mb-6">Perfect for testing</p>
        <div className="mb-6">
          <span className="text-4xl font-bold text-gray-900">$0</span>
          <span className="text-gray-600">/month</span>
        </div>
        <ul className="space-y-3 mb-6 text-sm text-gray-600">
          <li className="flex items-center gap-2">✓ 100 links/week</li>
          <li className="flex items-center gap-2">✓ Basic analytics</li>
          <li className="flex items-center gap-2">✓ 1 default domain</li>
          <li className="flex items-center gap-2">✗ No custom domains</li>
          <li className="flex items-center gap-2">✗ No team members</li>
        </ul>
        <button className="w-full px-4 py-2 border-2 border-gray-300 text-gray-900 rounded-lg hover:bg-gray-50">
          Get Started
        </button>
      </div>
      
      <!-- Starter Tier (Popular) -->
      <div className="bg-white border-3 border-purple-600 rounded-lg p-8 relative transform scale-105">
        <div className="absolute top-4 right-4 bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
          Most Popular
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Starter</h3>
        <p className="text-gray-600 mb-6">For teams & agencies</p>
        <div className="mb-6">
          <span className="text-4xl font-bold text-gray-900">$12</span>
          <span className="text-gray-600">/month</span>
        </div>
        <ul className="space-y-3 mb-6 text-sm text-gray-600">
          <li className="flex items-center gap-2">✓ 500 links/week</li>
          <li className="flex items-center gap-2">✓ Real-time analytics</li>
          <li className="flex items-center gap-2">✓ 2 custom domains</li>
          <li className="flex items-center gap-2">✓ QR codes</li>
          <li className="flex items-center gap-2">✓ 3 team members</li>
        </ul>
        <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold">
          Start Free Trial
        </button>
      </div>
      
      <!-- Pro Tier -->
      <div className="bg-white border-2 border-gray-200 rounded-lg p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Professional</h3>
        <p className="text-gray-600 mb-6">For enterprises</p>
        <div className="mb-6">
          <span className="text-4xl font-bold text-gray-900">$39</span>
          <span className="text-gray-600">/month</span>
        </div>
        <ul className="space-y-3 mb-6 text-sm text-gray-600">
          <li className="flex items-center gap-2">✓ 5,000 links/month</li>
          <li className="flex items-center gap-2">✓ All analytics</li>
          <li className="flex items-center gap-2">✓ 10 custom domains</li>
          <li className="flex items-center gap-2">✓ Advanced team RBAC</li>
          <li className="flex items-center gap-2">✓ API access</li>
        </ul>
        <button className="w-full px-4 py-2 border-2 border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50">
          Contact Sales
        </button>
      </div>
    </div>
    
    <!-- See All Pricing -->
    <div className="text-center mt-12">
      <a href="/pricing" className="text-purple-600 hover:text-purple-700 font-semibold">
        See complete pricing →
      </a>
    </div>
  </div>
</section>
```

**SEO Keywords for Pricing Section:**
- "transparent pricing", "no hidden fees", "affordable URL shortener"
- "pricing comparison", "pricing plans"
- Schema: Offer with price, priceCurrency

---

**5. Comparison Section (vs Competitors)**

```html
<section className="px-8 py-20 bg-purple-50">
  <div className="max-w-6xl mx-auto">
    <h2 className="text-4xl font-bold text-gray-900 mb-4 text-center">
      Why short.link Wins
    </h2>
    
    <!-- 3 Key Differentiators -->
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
      <!-- Privacy-First -->
      <div className="bg-white p-8 rounded-lg">
        <h3 className="text-xl font-bold text-purple-600 mb-3">🔒 Privacy-First</h3>
        <p className="text-gray-600 mb-4">
          Zero cookies. IP anonymized. GDPR-compliant by default. Unlike Bitly and Short.io which track users, we respect privacy.
        </p>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>✓ No cookie tracking</li>
          <li>✓ No IP logging</li>
          <li>✓ GDPR compliant</li>
        </ul>
      </div>
      
      <!-- Lowest Price -->
      <div className="bg-white p-8 rounded-lg">
        <h3 className="text-xl font-bold text-purple-600 mb-3">💰 Lowest Price</h3>
        <p className="text-gray-600 mb-4">
          50+ features at $9-15/mo. Bitly charges $29+ for basic features. We offer 40% more features at 60% lower price.
        </p>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>✓ $9-15/mo (vs Bitly $29+)</li>
          <li>✓ 50+ features included</li>
          <li>✓ No overage charges</li>
        </ul>
      </div>
      
      <!-- Broken Link Monitoring -->
      <div className="bg-white p-8 rounded-lg">
        <h3 className="text-xl font-bold text-purple-600 mb-3">🔍 Link Health Monitoring</h3>
        <p className="text-gray-600 mb-4">
          Automated broken link detection. Alerts on 404 errors. Usually $99+/mo, included free in our Starter plan.
        </p>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>✓ Auto-health checks</li>
          <li>✓ Failure alerts</li>
          <li>✓ Backup redirects</li>
        </ul>
      </div>
    </div>
    
    <!-- Feature Comparison Table -->
    <div className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden">
      <table className="w-full">
        <thead className="bg-purple-600 text-white">
          <tr>
            <th className="px-6 py-3 text-left font-semibold">Feature</th>
            <th className="px-6 py-3 text-center font-semibold">short.link</th>
            <th className="px-6 py-3 text-center font-semibold">Bitly</th>
            <th className="px-6 py-3 text-center font-semibold">Short.io</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-gray-200 hover:bg-gray-50">
            <td className="px-6 py-3">Privacy-First Analytics</td>
            <td className="px-6 py-3 text-center">✓</td>
            <td className="px-6 py-3 text-center">✗</td>
            <td className="px-6 py-3 text-center">✗</td>
          </tr>
          <tr className="border-b border-gray-200 hover:bg-gray-50">
            <td className="px-6 py-3">Broken Link Monitoring</td>
            <td className="px-6 py-3 text-center">✓</td>
            <td className="px-6 py-3 text-center">✗</td>
            <td className="px-6 py-3 text-center">✗</td>
          </tr>
          <!-- More rows... -->
        </tbody>
      </table>
    </div>
    
    <div className="text-center mt-12">
      <a href="/comparison" className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold">
        Full Comparison →
      </a>
    </div>
  </div>
</section>
```

**SEO Keywords for Comparison:**
- "Bitly alternative", "Short.io vs Bitly", "best URL shortener"
- "privacy-first URL shortener", "GDPR-compliant shortener"
- Schema: Comparison table with competitors

---

**6. Trust & Social Proof Section**

```html
<section className="px-8 py-20 bg-white">
  <div className="max-w-6xl mx-auto">
    <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
      Trusted by Teams Worldwide
    </h2>
    
    <!-- 3 Testimonials -->
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
      <div className="bg-gray-50 p-8 rounded-lg">
        <div className="flex gap-1 mb-3">★★★★★</div>
        <p className="text-gray-600 mb-4">
          "We switched from Bitly and saved 60% on subscription costs. The privacy-first approach is exactly what we needed for GDPR compliance."
        </p>
        <div>
          <div className="font-semibold text-gray-900">Sarah Chen</div>
          <div className="text-sm text-gray-600">Marketing Director, TechCorp</div>
        </div>
      </div>
      
      <!-- 2 more testimonials... -->
    </div>
    
    <!-- Logo Wall -->
    <div>
      <p className="text-center text-gray-600 mb-8 font-semibold">Used by:</p>
      <div className="flex justify-center items-center gap-12 flex-wrap">
        <div className="text-gray-400 font-bold">Client Logo 1</div>
        <div className="text-gray-400 font-bold">Client Logo 2</div>
        <div className="text-gray-400 font-bold">Client Logo 3</div>
        <div className="text-gray-400 font-bold">Client Logo 4</div>
      </div>
    </div>
  </div>
</section>
```

---

**7. FAQ Section**

```html
<section className="px-8 py-20 bg-gray-50">
  <div className="max-w-2xl mx-auto">
    <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
      Common Questions
    </h2>
    
    <!-- Accordion Items -->
    <div className="space-y-4">
      <details className="bg-white p-6 rounded-lg border border-gray-200">
        <summary className="cursor-pointer font-bold text-gray-900">
          Do you track my users with cookies?
        </summary>
        <p className="mt-4 text-gray-600">
          No. We never use cookies or pixels to track users. Our analytics are privacy-first and GDPR-compliant by design.
        </p>
      </details>
      
      <details className="bg-white p-6 rounded-lg border border-gray-200">
        <summary className="cursor-pointer font-bold text-gray-900">
          Can I use my own domain?
        </summary>
        <p className="mt-4 text-gray-600">
          Yes! Starting with the Starter plan ($9/mo), you can add custom domains. Pro plan includes up to 10 custom domains.
        </p>
      </details>
      
      <!-- More FAQ items... -->
    </div>
  </div>
</section>
```

**SEO Keywords for FAQ:**
- "Do you track users", "privacy policy", "custom domain"
- Schema: FAQPage with itemListElement

---

**8. Final CTA Section**

```html
<section className="px-8 py-32 bg-purple-600 text-white text-center">
  <div className="max-w-3xl mx-auto">
    <h2 className="text-4xl font-bold mb-6">
      Ready to Start?
    </h2>
    <p className="text-xl text-purple-100 mb-12">
      100 free short links per month. No credit card required.
    </p>
    
    <div className="flex gap-4 justify-center flex-wrap">
      <button className="px-8 py-4 bg-white text-purple-600 rounded-lg hover:bg-gray-100 font-bold text-lg">
        Start Free
      </button>
      <button className="px-8 py-4 border-2 border-white text-white rounded-lg hover:bg-purple-700 font-bold text-lg">
        View Pricing
      </button>
    </div>
  </div>
</section>
```

---

**9. Footer**

```html
<footer className="bg-gray-900 text-white px-8 py-12">
  <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
    <!-- Column 1: About -->
    <div>
      <h4 className="font-bold mb-4">short.link</h4>
      <p className="text-gray-400 text-sm">
        Privacy-first URL shortener with 50+ features. No cookies. No tracking.
      </p>
    </div>
    
    <!-- Column 2: Product -->
    <div>
      <h4 className="font-bold mb-4">Product</h4>
      <ul className="space-y-2 text-sm text-gray-400">
        <li><a href="/features" className="hover:text-white">Features</a></li>
        <li><a href="/pricing" className="hover:text-white">Pricing</a></li>
        <li><a href="/docs" className="hover:text-white">Documentation</a></li>
        <li><a href="/blog" className="hover:text-white">Blog</a></li>
      </ul>
    </div>
    
    <!-- Column 3: Company -->
    <div>
      <h4 className="font-bold mb-4">Company</h4>
      <ul className="space-y-2 text-sm text-gray-400">
        <li><a href="/about" className="hover:text-white">About</a></li>
        <li><a href="/comparison" className="hover:text-white">Comparison</a></li>
        <li><a href="/privacy" className="hover:text-white">Privacy</a></li>
        <li><a href="/terms" className="hover:text-white">Terms</a></li>
      </ul>
    </div>
    
    <!-- Column 4: Connect -->
    <div>
      <h4 className="font-bold mb-4">Connect</h4>
      <ul className="space-y-2 text-sm text-gray-400">
        <li><a href="https://twitter.com" className="hover:text-white">Twitter</a></li>
        <li><a href="https://github.com" className="hover:text-white">GitHub</a></li>
        <li><a href="/contact" className="hover:text-white">Contact</a></li>
        <li><a href="mailto:hello@short.link">Email</a></li>
      </ul>
    </div>
  </div>
  
  <div className="border-t border-gray-800 pt-8 flex justify-between items-center">
    <p className="text-gray-400 text-sm">© 2025 short.link. All rights reserved.</p>
    <div className="flex gap-4">
      <a href="/privacy" className="text-gray-400 hover:text-white text-sm">Privacy</a>
      <a href="/terms" className="text-gray-400 hover:text-white text-sm">Terms</a>
      <a href="/security" className="text-gray-400 hover:text-white text-sm">Security</a>
    </div>
  </div>
</footer>
```

---

## PART 3: CHROME EXTENSION DESIGN

### Extension Manifest & Structure

**File: `manifest.json`**
```json
{
  "manifest_version": 3,
  "name": "short.link",
  "version": "1.0",
  "description": "Privacy-first URL shortener with built-in QR codes",
  "permissions": ["activeTab", "scripting"],
  "action": {
    "default_popup": "popup.html",
    "default_title": "Short your link"
  },
  "host_permissions": ["https://api.short.link/*"]
}
```

### Extension Pages

**1. Popup (Main Interface)**

**File: `popup.html`**
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <link href="styles.css" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            width: 400px; 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: white;
        }
        .container { padding: 16px; }
        .header { 
            display: flex; 
            justify-content: space-between; 
            align-items: center; 
            margin-bottom: 16px;
            border-bottom: 2px solid #f3f4f6;
            padding-bottom: 12px;
        }
        .logo { 
            font-size: 18px; 
            font-weight: bold; 
            color: #9333ea;
        }
        .tabs {
            display: flex;
            gap: 8px;
            margin-bottom: 16px;
            border-bottom: 2px solid #f3f4f6;
        }
        .tab {
            padding: 8px 12px;
            background: none;
            border: none;
            cursor: pointer;
            font-weight: 500;
            color: #6b7280;
            border-bottom: 3px solid transparent;
        }
        .tab.active {
            color: #9333ea;
            border-bottom-color: #9333ea;
        }
        .section { display: none; }
        .section.active { display: block; }
        
        /* Create Tab */
        .input-group {
            margin-bottom: 12px;
        }
        label {
            display: block;
            font-size: 12px;
            font-weight: 600;
            margin-bottom: 6px;
            color: #374151;
        }
        input, select, button {
            width: 100%;
            padding: 10px 12px;
            border: 2px solid #d1d5db;
            border-radius: 6px;
            font-size: 14px;
        }
        input:focus { 
            outline: none; 
            border-color: #9333ea;
        }
        button {
            background: #9333ea;
            color: white;
            border: none;
            font-weight: 600;
            cursor: pointer;
            margin-top: 12px;
        }
        button:hover { background: #7e22ce; }
        
        .result {
            background: #f0fdf4;
            border: 2px solid #86efac;
            border-radius: 6px;
            padding: 12px;
            margin-top: 12px;
            display: none;
        }
        .result.show { display: block; }
        .result-url {
            font-family: monospace;
            font-size: 12px;
            color: #9333ea;
            word-break: break-all;
            margin-bottom: 8px;
        }
        .copy-btn {
            background: #9333ea;
            color: white;
            padding: 6px 12px;
            border: none;
            border-radius: 4px;
            font-size: 12px;
            cursor: pointer;
        }
        
        /* Analytics Tab */
        .analytics-item {
            background: #f9fafb;
            padding: 12px;
            border-radius: 6px;
            margin-bottom: 12px;
            border-left: 4px solid #9333ea;
        }
        .analytics-label {
            font-size: 12px;
            color: #6b7280;
            margin-bottom: 4px;
        }
        .analytics-value {
            font-size: 18px;
            font-weight: bold;
            color: #9333ea;
        }
        
        /* Settings Tab */
        .checkbox-group {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 12px;
        }
        input[type="checkbox"] {
            width: auto;
        }
    </style>
</head>
<body>
    <div className="container">
        <div class="header">
            <span class="logo">short.link</span>
            <button id="settingsBtn" style="width: auto; background: none; border: none; color: #9333ea; cursor: pointer; font-size: 18px;">⚙️</button>
        </div>

        <!-- Tabs Navigation -->
        <div class="tabs">
            <button class="tab active" data-tab="create">Create</button>
            <button class="tab" data-tab="analytics">Analytics</button>
            <button class="tab" data-tab="settings">Settings</button>
        </div>

        <!-- Create Tab -->
        <div id="create" class="section active">
            <div class="input-group">
                <label>Current Page URL</label>
                <input type="text" id="currentUrl" readonly style="background: #f9fafb; color: #6b7280;">
            </div>

            <div class="input-group">
                <label>Short Code (Optional)</label>
                <input type="text" id="customCode" placeholder="my-campaign">
            </div>

            <div class="input-group">
                <label>Tags (Optional)</label>
                <input type="text" id="tags" placeholder="Campaign, Email">
            </div>

            <div class="input-group">
                <label>
                    <input type="checkbox" id="generateQr"> Generate QR Code
                </label>
            </div>

            <button id="shortenBtn">Shorten Link</button>

            <div id="result" class="result">
                <div class="result-url" id="resultUrl"></div>
                <button class="copy-btn" id="copyBtn">Copy to Clipboard</button>
                <button class="copy-btn" style="margin-top: 6px;" id="qrBtn" style="display: none;">Download QR</button>
            </div>

            <div id="loading" style="text-align: center; margin-top: 12px; display: none; color: #9333ea;">
                Loading...
            </div>
            <div id="error" style="color: #dc2626; margin-top: 12px; display: none; font-size: 12px;"></div>
        </div>

        <!-- Analytics Tab -->
        <div id="analytics" class="section">
            <div class="analytics-item">
                <div class="analytics-label">Clicks (This Link)</div>
                <div class="analytics-value" id="linkClicks">42</div>
            </div>

            <div class="analytics-item">
                <div class="analytics-label">Unique Visitors</div>
                <div class="analytics-value" id="uniqueVisitors">32</div>
            </div>

            <div class="analytics-item">
                <div class="analytics-label">Top Country</div>
                <div class="analytics-value" id="topCountry">United States</div>
            </div>

            <div class="analytics-item">
                <div class="analytics-label">Top Device</div>
                <div class="analytics-value" id="topDevice">Mobile</div>
            </div>

            <button style="margin-top: 16px; background: #9333ea;" id="openDashboard">
                View Full Dashboard →
            </button>
        </div>

        <!-- Settings Tab -->
        <div id="settings" class="section">
            <div class="input-group">
                <label>API Token</label>
                <input type="password" id="apiToken" placeholder="Enter your API token">
            </div>

            <div class="checkbox-group">
                <input type="checkbox" id="autoShorten" checked>
                <label for="autoShorten" style="margin: 0;">Auto-shorten on copy</label>
            </div>

            <div class="checkbox-group">
                <input type="checkbox" id="showQrDefault" checked>
                <label for="showQrDefault" style="margin: 0;">Generate QR by default</label>
            </div>

            <button style="margin-top: 16px; background: #9333ea;">Save Settings</button>

            <button style="margin-top: 8px; background: #ef4444;">Logout</button>
        </div>
    </div>

    <script src="popup.js"></script>
</body>
</html>
```

---

### Extension JavaScript

**File: `popup.js`**
```javascript
// Tab switching
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const tabName = tab.dataset.tab;
    
    // Hide all sections
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    
    // Show selected section
    document.getElementById(tabName).classList.add('active');
    
    // Update active tab
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
  });
});

// Get current tab URL
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  const currentUrl = tabs[0].url;
  document.getElementById('currentUrl').value = currentUrl;
});

// Shorten link
document.getElementById('shortenBtn').addEventListener('click', async () => {
  const url = document.getElementById('currentUrl').value;
  const customCode = document.getElementById('customCode').value;
  const tags = document.getElementById('tags').value;
  const generateQr = document.getElementById('generateQr').checked;

  document.getElementById('loading').style.display = 'block';
  document.getElementById('error').style.display = 'none';

  try {
    const response = await fetch('https://api.short.link/api/links', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        destination: url,
        customCode: customCode || undefined,
        tags: tags ? tags.split(',') : undefined
      })
    });

    const data = await response.json();
    
    document.getElementById('resultUrl').textContent = data.shortUrl;
    document.getElementById('result').classList.add('show');
    
    if (generateQr) {
      document.getElementById('qrBtn').style.display = 'inline-block';
    }
  } catch (error) {
    document.getElementById('error').textContent = 'Failed to shorten link';
    document.getElementById('error').style.display = 'block';
  }

  document.getElementById('loading').style.display = 'none';
});

// Copy to clipboard
document.getElementById('copyBtn').addEventListener('click', () => {
  const url = document.getElementById('resultUrl').textContent;
  navigator.clipboard.writeText(url);
  alert('Copied!');
});

// Download QR
document.getElementById('qrBtn').addEventListener('click', () => {
  const shortCode = document.getElementById('resultUrl').textContent.split('/').pop();
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.executeScript(tabs[0].id, {
      code: `
        fetch('https://api.short.link/api/qr/${shortCode}?format=png')
          .then(r => r.blob())
          .then(blob => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'qr-code.png';
            a.click();
          });
      `
    });
  });
});

// Open dashboard
document.getElementById('openDashboard').addEventListener('click', () => {
  chrome.tabs.create({ url: 'https://app.short.link/dashboard' });
});
```

---

### Extension Features Summary

**Feature 1: One-Click Link Shortening**
- Get current tab URL automatically
- Input custom code (optional)
- Add tags for organization
- Display shortened link
- Copy to clipboard button

**Feature 2: QR Code Generation**
- Checkbox to generate QR
- Download as PNG/JPEG/SVG
- Display in popup

**Feature 3: Analytics Popup**
- Show clicks on current link
- Unique visitors count
- Top country + device
- "View Full Dashboard" button

**Feature 4: Settings**
- Save API token
- Auto-shorten preferences
- QR generation default
- Logout option

---

## COMPREHENSIVE SEO CHECKLIST

### On-Page SEO
- [ ] H1 contains main keyword "Privacy-First URL Shortener"
- [ ] Meta description includes key phrases (50-160 chars)
- [ ] H2, H3 tags properly hierarchical
- [ ] Alt text on all images with keywords
- [ ] Internal linking (cross-reference pages)
- [ ] Keyword density: 1-2% for primary keyword
- [ ] Mobile responsive (tested on devices)
- [ ] Page load speed <2 seconds
- [ ] Proper heading hierarchy (no skipped levels)

### Technical SEO
- [ ] XML sitemap created
- [ ] robots.txt configured
- [ ] Schema.org markup (SoftwareApplication, Offer, FAQPage)
- [ ] JSON-LD for structured data
- [ ] Open Graph tags (og:title, og:description, og:image)
- [ ] Twitter Card tags
- [ ] Canonical tags on all pages
- [ ] 404 page configured
- [ ] SSL/HTTPS enabled

### Content SEO
- [ ] Target keywords per page:
  - Homepage: "privacy-first URL shortener", "free short link", "best URL shortener"
  - Pricing: "URL shortener pricing", "affordable", "transparent pricing"
  - Features: "50 features", "QR codes", "analytics"
  - Comparison: "vs Bitly", "Bitly alternative", "comparison"
- [ ] Long-form content (1000+ words per page)
- [ ] Fresh content (updated regularly)
- [ ] User-generated content (testimonials, reviews)

### Link Building
- [ ] Submit to SaaS directories
- [ ] PR outreach to tech bloggers
- [ ] Guest blogging opportunities
- [ ] Internal linking strategy
- [ ] Backlink tracking with Ahrefs/Semrush

---

**END OF WEBSITE STRUCTURE & CHROME EXTENSION DESIGN DOCUMENT**

---

**📚 ALL 4 DOCUMENTS COMPLETE:**

✅ **PRD_Enhanced_Frontend_API.md** [120]  
✅ **PReD_Cursor_Implementation.md** [121]  
✅ **Implementation_Plan_Detailed.md** [122]  
✅ **Website_Structure_ChromeExtension.md** [123]  

**Ready for Development! 🚀**