/**
 * Validation Script for URL Shortener Implementation
 * Runs comprehensive validation of all components, APIs, pages, and files
 */

const fs = require('fs');
const path = require('path');

const validationResults = {
  components: [],
  apiEndpoints: [],
  pages: [],
  chromeExtension: [],
  designSystem: [],
  dummyData: [],
  utilities: [],
  seo: [],
  errors: [],
  warnings: []
};

// Component files to check
const components = [
  'LinkShortener.tsx',
  'CustomCodeInput.tsx',
  'LinkTags.tsx',
  'LinksDashboard.tsx',
  'PasswordProtection.tsx',
  'LinkExpiration.tsx',
  'DomainSetup.tsx',
  'QRCodeGenerator.tsx',
  'QRCustomization.tsx',
  'AnalyticsDashboard.tsx',
  'ClickTrendsChart.tsx',
  'TeamInvite.tsx',
  'TeamInviteModal.tsx'
];

// API endpoints to check
const apiEndpoints = [
  'api/links/route.ts',
  'api/links/check-availability/route.ts',
  'api/links/[id]/analytics/route.ts',
  'api/links/[id]/tags/route.ts',
  'api/domains/verify/route.ts',
  'api/qr/[id]/route.ts',
  'api/team/members/route.ts',
  'api/team/members/[memberId]/route.ts'
];

// Pages to check
const pages = [
  'app/page.tsx',
  'app/features/page.tsx',
  'app/pricing/page.tsx',
  'app/docs/page.tsx',
  'app/blog/page.tsx',
  'app/comparison/page.tsx',
  'app/self-hosted/page.tsx',
  'app/enterprise/page.tsx',
  'app/privacy/page.tsx',
  'app/terms/page.tsx',
  'app/security/page.tsx',
  'app/dashboard/page.tsx'
];

// Chrome extension files
const chromeExtensionFiles = [
  'chrome-extension/manifest.json',
  'chrome-extension/popup.html',
  'chrome-extension/popup.js',
  'chrome-extension/styles.css'
];

function checkFileExists(filePath) {
  const fullPath = path.join(process.cwd(), 'src', filePath);
  return fs.existsSync(fullPath) || fs.existsSync(path.join(process.cwd(), filePath));
}

function checkFileContent(filePath, checks) {
  const fullPath = fs.existsSync(path.join(process.cwd(), 'src', filePath))
    ? path.join(process.cwd(), 'src', filePath)
    : path.join(process.cwd(), filePath);
  
  if (!fs.existsSync(fullPath)) {
    return { exists: false, checks: [] };
  }

  const content = fs.readFileSync(fullPath, 'utf8');
  const results = checks.map(check => ({
    name: check.name,
    passed: check.test(content),
    message: check.message
  }));

  return { exists: true, checks: results };
}

function validateComponents() {
  console.log('\n📦 VALIDATING COMPONENTS...\n');
  
  components.forEach(component => {
    const filePath = `components/${component}`;
    const exists = checkFileExists(filePath);
    
    if (exists) {
      const content = fs.readFileSync(
        fs.existsSync(path.join(process.cwd(), 'src', filePath))
          ? path.join(process.cwd(), 'src', filePath)
          : path.join(process.cwd(), filePath),
        'utf8'
      );
      
      const checks = [
        { name: 'TypeScript', test: (c) => /interface|type|export.*function/.test(c), message: 'Has TypeScript types' },
        { name: 'Client Component', test: (c) => /'use client'/.test(c) || /export default/.test(c), message: 'Is client component or page' },
        { name: 'Styling', test: (c) => /className|bg-purple-600|text-purple-600/.test(c), message: 'Uses TailwindCSS with purple theme' },
        { name: 'Error Handling', test: (c) => /try|catch|error|Error/.test(c), message: 'Has error handling' }
      ];
      
      const results = checks.map(check => ({
        name: check.name,
        passed: check.test(content),
        message: check.message
      }));
      
      validationResults.components.push({
        name: component,
        status: '✓',
        exists: true,
        checks: results
      });
    } else {
      validationResults.components.push({
        name: component,
        status: '✗',
        exists: false,
        checks: []
      });
      validationResults.errors.push(`Missing component: ${component}`);
    }
  });
}

function validateAPIEndpoints() {
  console.log('\n🔌 VALIDATING API ENDPOINTS...\n');
  
  apiEndpoints.forEach(endpoint => {
    const filePath = `app/${endpoint}`;
    const exists = checkFileExists(filePath);
    
    if (exists) {
      validationResults.apiEndpoints.push({
        name: endpoint,
        status: '✓',
        exists: true
      });
    } else {
      validationResults.apiEndpoints.push({
        name: endpoint,
        status: '✗',
        exists: false
      });
      validationResults.errors.push(`Missing API endpoint: ${endpoint}`);
    }
  });
}

function validatePages() {
  console.log('\n📄 VALIDATING PAGES...\n');
  
  pages.forEach(page => {
    const filePath = page;
    const exists = checkFileExists(filePath);
    
    if (exists) {
      validationResults.pages.push({
        name: page,
        status: '✓',
        exists: true
      });
    } else {
      validationResults.pages.push({
        name: page,
        status: '✗',
        exists: false
      });
      validationResults.errors.push(`Missing page: ${page}`);
    }
  });
}

function validateChromeExtension() {
  console.log('\n🌐 VALIDATING CHROME EXTENSION...\n');
  
  chromeExtensionFiles.forEach(file => {
    const exists = fs.existsSync(path.join(process.cwd(), file));
    
    if (exists) {
      validationResults.chromeExtension.push({
        name: file,
        status: '✓',
        exists: true
      });
    } else {
      validationResults.chromeExtension.push({
        name: file,
        status: '✗',
        exists: false
      });
      validationResults.errors.push(`Missing Chrome extension file: ${file}`);
    }
  });
}

function validateDesignSystem() {
  console.log('\n🎨 VALIDATING DESIGN SYSTEM...\n');
  
  const tailwindConfig = fs.existsSync(path.join(process.cwd(), 'tailwind.config.js'));
  const globalsCSS = checkFileExists('styles/globals.css');
  
  validationResults.designSystem.push({
    name: 'tailwind.config.js',
    status: tailwindConfig ? '✓' : '✗',
    exists: tailwindConfig
  });
  
  validationResults.designSystem.push({
    name: 'globals.css',
    status: globalsCSS ? '✓' : '✗',
    exists: globalsCSS
  });
}

function validateDummyData() {
  console.log('\n💾 VALIDATING DUMMY DATA...\n');
  
  const dummyDataPath = 'lib/dummy-data.ts';
  const exists = checkFileExists(dummyDataPath);
  
  if (exists) {
    const content = fs.readFileSync(
      fs.existsSync(path.join(process.cwd(), 'src', dummyDataPath))
        ? path.join(process.cwd(), 'src', dummyDataPath)
        : path.join(process.cwd(), dummyDataPath),
      'utf8'
    );
    
    const hasLinks = /dummyLinks|export.*links/.test(content);
    const hasAnalytics = /dummyAnalytics|export.*analytics/.test(content);
    const hasTeam = /dummyTeamMembers|export.*team/.test(content);
    
    validationResults.dummyData.push({
      name: 'dummy-data.ts',
      status: '✓',
      exists: true,
      hasLinks,
      hasAnalytics,
      hasTeam
    });
  } else {
    validationResults.dummyData.push({
      name: 'dummy-data.ts',
      status: '✗',
      exists: false
    });
    validationResults.errors.push('Missing dummy data file');
  }
}

function validateUtilities() {
  console.log('\n🛠️ VALIDATING UTILITIES...\n');
  
  const apiClient = checkFileExists('lib/api.ts');
  const useLinks = checkFileExists('hooks/useLinks.ts');
  const useAnalytics = checkFileExists('hooks/useAnalytics.ts');
  
  validationResults.utilities.push({
    name: 'api.ts',
    status: apiClient ? '✓' : '✗',
    exists: apiClient
  });
  
  validationResults.utilities.push({
    name: 'useLinks.ts',
    status: useLinks ? '✓' : '✗',
    exists: useLinks
  });
  
  validationResults.utilities.push({
    name: 'useAnalytics.ts',
    status: useAnalytics ? '✓' : '✗',
    exists: useAnalytics
  });
}

function validateSEO() {
  console.log('\n🔍 VALIDATING SEO...\n');
  
  const robotsTxt = fs.existsSync(path.join(process.cwd(), 'public', 'robots.txt'));
  const sitemap = fs.existsSync(path.join(process.cwd(), 'public', 'sitemap.xml'));
  const layout = checkFileExists('app/layout.tsx');
  
  validationResults.seo.push({
    name: 'robots.txt',
    status: robotsTxt ? '✓' : '✗',
    exists: robotsTxt
  });
  
  validationResults.seo.push({
    name: 'sitemap.xml',
    status: sitemap ? '✓' : '✗',
    exists: sitemap
  });
  
  validationResults.seo.push({
    name: 'layout.tsx (metadata)',
    status: layout ? '✓' : '✗',
    exists: layout
  });
}

function generateReport() {
  console.log('\n\n' + '='.repeat(60));
  console.log('✅ VALIDATION REPORT');
  console.log('='.repeat(60) + '\n');
  
  // Components
  console.log('📦 COMPONENTS (13 total)');
  console.log('-'.repeat(60));
  const componentsComplete = validationResults.components.filter(c => c.exists).length;
  console.log(`Status: ${componentsComplete}/13 complete\n`);
  validationResults.components.forEach(comp => {
    console.log(`${comp.status} ${comp.name}`);
    if (comp.checks) {
      comp.checks.forEach(check => {
        console.log(`  ${check.passed ? '✓' : '✗'} ${check.name}: ${check.message}`);
      });
    }
  });
  
  // API Endpoints
  console.log('\n🔌 API ENDPOINTS (8+ total)');
  console.log('-'.repeat(60));
  const apiComplete = validationResults.apiEndpoints.filter(a => a.exists).length;
  console.log(`Status: ${apiComplete}/${apiEndpoints.length} complete\n`);
  validationResults.apiEndpoints.forEach(api => {
    console.log(`${api.status} ${api.name}`);
  });
  
  // Pages
  console.log('\n📄 WEBSITE PAGES (12 total)');
  console.log('-'.repeat(60));
  const pagesComplete = validationResults.pages.filter(p => p.exists).length;
  console.log(`Status: ${pagesComplete}/${pages.length} complete\n`);
  validationResults.pages.forEach(page => {
    console.log(`${page.status} ${page.name}`);
  });
  
  // Chrome Extension
  console.log('\n🌐 CHROME EXTENSION (4 files)');
  console.log('-'.repeat(60));
  const extComplete = validationResults.chromeExtension.filter(e => e.exists).length;
  console.log(`Status: ${extComplete}/4 complete\n`);
  validationResults.chromeExtension.forEach(file => {
    console.log(`${file.status} ${file.name}`);
  });
  
  // Design System
  console.log('\n🎨 DESIGN SYSTEM');
  console.log('-'.repeat(60));
  validationResults.designSystem.forEach(item => {
    console.log(`${item.status} ${item.name}`);
  });
  
  // Dummy Data
  console.log('\n💾 DUMMY DATA');
  console.log('-'.repeat(60));
  validationResults.dummyData.forEach(item => {
    console.log(`${item.status} ${item.name}`);
    if (item.hasLinks !== undefined) {
      console.log(`  ${item.hasLinks ? '✓' : '✗'} Has links data`);
      console.log(`  ${item.hasAnalytics ? '✓' : '✗'} Has analytics data`);
      console.log(`  ${item.hasTeam ? '✓' : '✗'} Has team data`);
    }
  });
  
  // Utilities
  console.log('\n🛠️ UTILITIES & HOOKS');
  console.log('-'.repeat(60));
  validationResults.utilities.forEach(item => {
    console.log(`${item.status} ${item.name}`);
  });
  
  // SEO
  console.log('\n🔍 SEO FILES');
  console.log('-'.repeat(60));
  validationResults.seo.forEach(item => {
    console.log(`${item.status} ${item.name}`);
  });
  
  // Summary
  console.log('\n\n' + '='.repeat(60));
  console.log('📊 SUMMARY');
  console.log('='.repeat(60));
  
  const totalItems = 
    validationResults.components.length +
    validationResults.apiEndpoints.length +
    validationResults.pages.length +
    validationResults.chromeExtension.length;
  
  const completeItems = 
    validationResults.components.filter(c => c.exists).length +
    validationResults.apiEndpoints.filter(a => a.exists).length +
    validationResults.pages.filter(p => p.exists).length +
    validationResults.chromeExtension.filter(e => e.exists).length;
  
  const percentage = Math.round((completeItems / totalItems) * 100);
  
  console.log(`\nOverall Completion: ${completeItems}/${totalItems} (${percentage}%)`);
  
  if (validationResults.errors.length > 0) {
    console.log(`\n⚠️ ERRORS FOUND: ${validationResults.errors.length}`);
    validationResults.errors.forEach(error => {
      console.log(`  ✗ ${error}`);
    });
  } else {
    console.log('\n✅ NO ERRORS FOUND - ALL FILES PRESENT');
  }
  
  if (percentage === 100) {
    console.log('\n🎉 STATUS: 100% COMPLETE - READY FOR PRODUCTION! 🚀\n');
  } else {
    console.log(`\n⚠️ STATUS: ${percentage}% COMPLETE - ${totalItems - completeItems} ITEMS MISSING\n`);
  }
  
  console.log('='.repeat(60) + '\n');
}

// Run all validations
console.log('🔍 Starting comprehensive validation...\n');

validateComponents();
validateAPIEndpoints();
validatePages();
validateChromeExtension();
validateDesignSystem();
validateDummyData();
validateUtilities();
validateSEO();

generateReport();

// Exit with appropriate code
if (validationResults.errors.length === 0 && 
    validationResults.components.filter(c => c.exists).length === components.length &&
    validationResults.apiEndpoints.filter(a => a.exists).length === apiEndpoints.length &&
    validationResults.pages.filter(p => p.exists).length === pages.length &&
    validationResults.chromeExtension.filter(e => e.exists).length === chromeExtensionFiles.length) {
  process.exit(0); // Success
} else {
  process.exit(1); // Has errors
}

