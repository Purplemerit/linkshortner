import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Terms of Service - short.link',
  description: 'Terms of Service for short.link. Read our terms and conditions.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar currentPage="terms" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-3 sm:mb-4">Terms of Service</h1>
        <p className="text-xs sm:text-sm lg:text-base xl:text-lg text-gray-600 mb-6 sm:mb-8">
          Please read these terms carefully before using short.link.
        </p>

        <div className="space-y-6 sm:space-y-8">
          <p className="text-xs sm:text-sm text-gray-600">
            <strong>Last Updated:</strong> November 26, 2025
          </p>

          <section>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2 sm:mb-4">1. Acceptance of Terms</h2>
            <p className="text-xs sm:text-sm lg:text-base text-gray-600">
              By accessing and using short.link (&quot;Service&quot;), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these terms, please do not use our Service.
            </p>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2 sm:mb-4">2. Description of Service</h2>
            <p className="text-xs sm:text-sm lg:text-base text-gray-600">
              short.link provides URL shortening services, link analytics, QR code generation, and related features. We reserve the right to modify, suspend, or discontinue the Service at any time with or without notice.
            </p>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2 sm:mb-4">3. User Accounts</h2>
            <p className="text-xs sm:text-sm lg:text-base text-gray-600 mb-4">When you create an account, you agree to:</p>
            <ul className="list-disc pl-5 sm:pl-6 text-xs sm:text-sm lg:text-base text-gray-600 space-y-1">
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain the security of your password</li>
              <li>Accept responsibility for all activities under your account</li>
              <li>Notify us immediately of any unauthorized access</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2 sm:mb-4">4. Acceptable Use</h2>
            <p className="text-xs sm:text-sm lg:text-base text-gray-600 mb-3 sm:mb-4">You agree NOT to use short.link for:</p>
            <div className="bg-red-50 p-4 sm:p-6 rounded-lg">
              <ul className="list-disc pl-5 sm:pl-6 text-xs sm:text-sm lg:text-base text-gray-700 space-y-1">
                <li><strong>Illegal activities</strong> - Any content that violates laws</li>
                <li><strong>Spam</strong> - Unsolicited bulk messaging or advertising</li>
                <li><strong>Phishing</strong> - Deceptive links intended to steal information</li>
                <li><strong>Malware distribution</strong> - Links to viruses or harmful software</li>
                <li><strong>Copyright infringement</strong> - Content you don&apos;t have rights to</li>
                <li><strong>Harassment</strong> - Content intended to harass or threaten</li>
                <li><strong>Adult content</strong> - Pornographic or explicit material</li>
                <li><strong>Violence</strong> - Content promoting violence or terrorism</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Link Removal</h2>
            <p className="text-gray-600">
              We reserve the right to disable or remove any link that violates these terms, without prior notice. Repeated violations may result in account termination.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Service Availability</h2>
            <p className="text-gray-600">
              We strive for 99.9% uptime but do not guarantee uninterrupted service. We are not liable for any damages arising from service interruptions or data loss. We recommend keeping backups of your important data.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Intellectual Property</h2>
            <p className="text-gray-600">
              The Service, including its original content, features, and functionality, is owned by short.link and is protected by international copyright, trademark, and other intellectual property laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Payment Terms</h2>
            <p className="text-gray-600 mb-4">For paid subscriptions:</p>
            <ul className="list-disc pl-6 text-gray-600">
              <li>Payments are billed in advance on a monthly or annual basis</li>
              <li>All fees are non-refundable except as required by law</li>
              <li>We may change pricing with 30 days notice</li>
              <li>You may cancel your subscription at any time</li>
              <li>Cancellations take effect at the end of the billing period</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Limitation of Liability</h2>
            <p className="text-gray-600">
              In no event shall short.link be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or goodwill, arising from your use of the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Changes to Terms</h2>
            <p className="text-gray-600">
              We reserve the right to modify these terms at any time. We will notify users of significant changes via email or through the Service. Continued use after changes constitutes acceptance of the new terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Governing Law</h2>
            <p className="text-gray-600">
              These Terms shall be governed by and construed in accordance with the laws of the European Union and applicable member state laws, without regard to conflict of law provisions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Contact</h2>
            <p className="text-gray-600">
              Questions about these Terms? Contact us at:
            </p>
            <ul className="list-none mt-4 text-gray-600">
              <li>Email: <a href="mailto:legal@short.link" className="text-purple-600 hover:text-purple-700">legal@short.link</a></li>
              <li>Contact page: <Link href="/contact" className="text-purple-600 hover:text-purple-700">short.link/contact</Link></li>
            </ul>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}
