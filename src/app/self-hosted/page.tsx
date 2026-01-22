import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'Self-Hosted - short.link | Self-Hosted Installation Guide',
  description: 'Learn how to self-host short.link with Docker. Complete installation and configuration guide.',
};

export default function SelfHostedPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar currentPage="self-hosted" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-4">Self-Hosted Guide</h1>
        <p className="text-gray-600 mb-8 text-lg sm:text-xl lg:text-2xl">
          Deploy short.link on your own infrastructure for complete control.
        </p>

        <div className="bg-purple-50 border-l-4 border-purple-500 p-4 sm:p-6 lg:p-8 rounded-r-lg mb-12">
          <p className="text-purple-800">
            <strong>Note:</strong> Self-hosting is available for Enterprise customers.
            <Link href="/enterprise" className="underline ml-1">Contact our sales team</Link> to get started.
          </p>
        </div>

        <div className="prose max-w-none space-y-8">
          <section>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4">Prerequisites</h2>
            <ul className="list-disc pl-6 text-gray-600">
              <li>Docker and Docker Compose installed</li>
              <li>A domain name with DNS access</li>
              <li>SSL certificate (Let&apos;s Encrypt recommended)</li>
              <li>PostgreSQL database (v14 or higher)</li>
              <li>Redis server (optional, for caching)</li>
              <li>Minimum 2GB RAM, 20GB storage</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4">Quick Start</h2>
            <p className="text-gray-600 mb-4">
              Clone the repository and start the containers:
            </p>
            <div className="bg-gray-900 text-gray-100 p-4 sm:p-6 lg:p-8 rounded-lg overflow-x-auto">
              <pre className="text-sm">
                {`# Clone the repository
git clone https://github.com/shortlinkapp/short.link.git
cd short.link

# Copy environment template
cp .env.example .env

# Edit configuration
nano .env

# Start the containers
docker-compose up -d`}
              </pre>
            </div>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4">Configuration</h2>
            <p className="text-gray-600 mb-4">
              Edit the <code className="bg-gray-100 px-2 py-1 rounded">.env</code> file with your settings:
            </p>
            <div className="bg-gray-900 text-gray-100 p-4 sm:p-6 lg:p-8 rounded-lg overflow-x-auto">
              <pre className="text-sm">
                {`# Required Configuration
DOMAIN=yourdomain.com
DATABASE_URL=postgresql://user:password@localhost:5432/shortlink
NEXTAUTH_SECRET=your-secure-random-string

# Optional Configuration
REDIS_URL=redis://localhost:6379
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-email
SMTP_PASSWORD=your-password

# Feature Flags
ENABLE_ANALYTICS=true
ENABLE_QR_CODES=true
ENABLE_TEAM_FEATURES=true`}
              </pre>
            </div>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4">Database Setup</h2>
            <p className="text-gray-600 mb-4">
              Run database migrations after initial setup:
            </p>
            <div className="bg-gray-900 text-gray-100 p-4 sm:p-6 lg:p-8 rounded-lg overflow-x-auto">
              <pre className="text-sm">
                {`# Run migrations
docker-compose exec app npx prisma migrate deploy

# Seed initial data (optional)
docker-compose exec app npx prisma db seed`}
              </pre>
            </div>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4">SSL Configuration</h2>
            <p className="text-gray-600 mb-4">
              We recommend using Let&apos;s Encrypt with Caddy as a reverse proxy:
            </p>
            <div className="bg-gray-900 text-gray-100 p-4 sm:p-6 lg:p-8 rounded-lg overflow-x-auto">
              <pre className="text-sm">
                {`# Caddyfile
yourdomain.com {
    reverse_proxy app:3000
    encode gzip
    
    header {
        Strict-Transport-Security "max-age=31536000;"
        X-Content-Type-Options nosniff
        X-Frame-Options DENY
    }
}`}
              </pre>
            </div>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4">Updating</h2>
            <p className="text-gray-600 mb-4">
              To update to the latest version:
            </p>
            <div className="bg-gray-900 text-gray-100 p-4 sm:p-6 lg:p-8 rounded-lg overflow-x-auto">
              <pre className="text-sm">
                {`# Pull latest changes
git pull origin main

# Rebuild containers
docker-compose build

# Run migrations
docker-compose exec app npx prisma migrate deploy

# Restart services
docker-compose up -d`}
              </pre>
            </div>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4">Backup & Recovery</h2>
            <p className="text-gray-600 mb-4">
              Regular backups are essential. Here&apos;s how to backup your data:
            </p>
            <div className="bg-gray-900 text-gray-100 p-4 sm:p-6 lg:p-8 rounded-lg overflow-x-auto">
              <pre className="text-sm">
                {`# Backup database
pg_dump -h localhost -U shortlink shortlink > backup.sql

# Restore database
psql -h localhost -U shortlink shortlink < backup.sql`}
              </pre>
            </div>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4">Support</h2>
            <div className="bg-gray-50 p-4 sm:p-6 lg:p-8 rounded-lg border-2 border-gray-200">
              <p className="text-gray-600 mb-4">
                Self-hosted installations include:
              </p>
              <ul className="list-disc pl-6 text-gray-600">
                <li>Priority email support</li>
                <li>Access to private GitHub repository</li>
                <li>Monthly security updates</li>
                <li>Optional installation assistance</li>
              </ul>
            </div>
          </section>

          <section className="bg-purple-50 p-4 sm:p-6 lg:p-8 rounded-xl border-2 border-purple-200">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4">Need Help?</h2>
            <p className="text-gray-600 mb-6">
              Our team can help with installation, configuration, and ongoing support.
            </p>
            <div className="flex gap-3 sm:gap-4 lg:gap-6 flex-wrap">
              <Link
                href="/enterprise"
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold"
              >
                Contact Sales
              </Link>
              <Link
                href="/docs"
                className="px-6 py-3 border-2 border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 font-semibold"
              >
                View Documentation
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
