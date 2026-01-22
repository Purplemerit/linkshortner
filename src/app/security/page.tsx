import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'Security - short.link | Security & Compliance',
  description: 'Learn about short.link security measures, compliance, and data protection.',
};

export default function SecurityPage() {
  const securityFeatures = [
    {
      icon: '🔐',
      title: 'End-to-End Encryption',
      description: 'All data is encrypted in transit (TLS 1.3) and at rest (AES-256).',
    },
    {
      icon: '🛡️',
      title: 'DDoS Protection',
      description: 'Enterprise-grade DDoS mitigation protects our infrastructure 24/7.',
    },
    {
      icon: '🔑',
      title: 'Secure Authentication',
      description: 'Industry-standard authentication with optional 2FA and SSO support.',
    },
    {
      icon: '📝',
      title: 'Audit Logging',
      description: 'Complete audit trail of all actions for security and compliance.',
    },
    {
      icon: '🌍',
      title: 'Geographic Redundancy',
      description: 'Data replicated across multiple regions for disaster recovery.',
    },
    {
      icon: '🔍',
      title: 'Regular Penetration Testing',
      description: 'Third-party security audits conducted quarterly.',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar currentPage="security" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-3 sm:mb-4">Security & Compliance</h1>
        <p className="text-xs sm:text-sm lg:text-base xl:text-lg text-gray-600 mb-8 sm:mb-12">
          Your security is our top priority. Learn how we protect your data.
        </p>

        {/* Security Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-12 sm:mb-16">
          {securityFeatures.map((feature, idx) => (
            <div key={idx} className="bg-gray-50 p-4 sm:p-6 rounded-lg sm:rounded-2xl border-2 border-gray-200 hover:border-purple-400 transition">
              <div className="text-2xl sm:text-3xl mb-2 sm:mb-3">{feature.icon}</div>
              <h3 className="font-bold text-gray-900 text-base sm:text-lg mb-2">{feature.title}</h3>
              <p className="text-xs sm:text-sm lg:text-base text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="prose max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Infrastructure Security</h2>
            <ul className="list-disc pl-6 text-gray-600">
              <li>Hosted on enterprise-grade cloud infrastructure (AWS/GCP)</li>
              <li>Automated security patching and updates</li>
              <li>Network isolation and firewall protection</li>
              <li>Intrusion detection and prevention systems</li>
              <li>Real-time monitoring and alerting</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Protection</h2>
            <ul className="list-disc pl-6 text-gray-600">
              <li>All connections encrypted with TLS 1.3</li>
              <li>Data encrypted at rest using AES-256</li>
              <li>Secure password storage using bcrypt with salt</li>
              <li>API keys hashed and never stored in plain text</li>
              <li>Regular automated backups with encryption</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Compliance</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-50 p-6 rounded-lg text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">GDPR</div>
                <p className="text-sm text-gray-600">Fully Compliant</p>
              </div>
              <div className="bg-green-50 p-6 rounded-lg text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">CCPA</div>
                <p className="text-sm text-gray-600">Fully Compliant</p>
              </div>
              <div className="bg-yellow-50 p-6 rounded-lg text-center">
                <div className="text-3xl font-bold text-yellow-600 mb-2">SOC 2</div>
                <p className="text-sm text-gray-600">Type II In Progress</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Control</h2>
            <ul className="list-disc pl-6 text-gray-600">
              <li>Role-based access control (RBAC) for team accounts</li>
              <li>Optional two-factor authentication (2FA)</li>
              <li>Single sign-on (SSO) support for Enterprise plans</li>
              <li>Session management with automatic expiration</li>
              <li>API rate limiting to prevent abuse</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Incident Response</h2>
            <p className="text-gray-600 mb-4">
              In the event of a security incident, we follow a structured response process:
            </p>
            <ol className="list-decimal pl-6 text-gray-600">
              <li>Immediate containment and assessment</li>
              <li>Investigation and root cause analysis</li>
              <li>Notification to affected users within 72 hours</li>
              <li>Remediation and prevention measures</li>
              <li>Post-incident review and documentation</li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Responsible Disclosure</h2>
            <div className="bg-purple-50 p-6 rounded-lg border-2 border-purple-200">
              <p className="text-gray-700 mb-4">
                We appreciate security researchers who help us keep our users safe. If you discover a vulnerability, please report it responsibly.
              </p>
              <p className="text-gray-700">
                Email: <a href="mailto:security@short.link" className="text-purple-600 hover:text-purple-700 font-semibold">security@short.link</a>
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Questions?</h2>
            <p className="text-gray-600">
              For security-related inquiries, contact our security team:
            </p>
            <ul className="list-none mt-4 text-gray-600">
              <li>Email: <a href="mailto:security@short.link" className="text-purple-600 hover:text-purple-700">security@short.link</a></li>
              <li>For general inquiries: <Link href="/contact" className="text-purple-600 hover:text-purple-700">Contact Us</Link></li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
