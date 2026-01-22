import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Privacy Policy - short.link',
  description: 'Privacy policy for short.link. Learn how we protect your data and respect your privacy.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar currentPage="privacy" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-3 sm:mb-4">Privacy Policy</h1>
        <p className="text-xs sm:text-sm lg:text-base xl:text-lg text-gray-600 mb-6 sm:mb-8">
          Your privacy is our priority. Here&apos;s how we protect your data.
        </p>

        <div className="bg-green-50 border-l-4 border-green-500 p-4 sm:p-6 rounded-r-lg mb-8 sm:mb-12">
          <p className="text-xs sm:text-sm lg:text-base text-green-800 font-semibold">
            TL;DR: We don&apos;t track your visitors, we don&apos;t sell your data, and we&apos;re GDPR compliant by default.
          </p>
        </div>

        <div className="prose max-w-none space-y-8">
          <p className="text-gray-600">
            <strong>Last Updated:</strong> November 26, 2025
          </p>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Overview</h2>
            <p className="text-gray-600">
              At short.link, we are committed to protecting your privacy and the privacy of people who click on your links. This Privacy Policy explains how we collect, use, and safeguard your information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Information We Collect</h2>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Account Information</h3>
            <ul className="list-disc pl-6 text-gray-600 mb-4">
              <li>Email address (for account creation and communication)</li>
              <li>Name (optional, for personalization)</li>
              <li>Payment information (processed securely by Stripe)</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-2">Link Data</h3>
            <ul className="list-disc pl-6 text-gray-600 mb-4">
              <li>Destination URLs you create short links for</li>
              <li>Custom short codes and tags you assign</li>
              <li>Link settings (password protection, expiration)</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-2">Analytics Data (Anonymized)</h3>
            <ul className="list-disc pl-6 text-gray-600">
              <li>Aggregated click counts</li>
              <li>Approximate geographic regions (country/city level)</li>
              <li>Device types and browsers (aggregated)</li>
              <li>Referrer sources (aggregated)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">What We DON&apos;T Collect</h2>
            <div className="bg-red-50 p-6 rounded-lg">
              <ul className="list-disc pl-6 text-gray-700">
                <li><strong>No cookies</strong> on link visitors</li>
                <li><strong>No IP address logging</strong> - IPs are immediately hashed and anonymized</li>
                <li><strong>No tracking pixels</strong> or third-party trackers</li>
                <li><strong>No behavioral tracking</strong> across websites</li>
                <li><strong>No selling of data</strong> to third parties</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">How We Use Your Information</h2>
            <ul className="list-disc pl-6 text-gray-600">
              <li>To provide and maintain our service</li>
              <li>To send you important service updates</li>
              <li>To provide customer support</li>
              <li>To improve our product and develop new features</li>
              <li>To detect and prevent fraud and abuse</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Retention</h2>
            <p className="text-gray-600">
              We retain your account data for as long as your account is active. Analytics data is retained for 2 years. You can request deletion of your data at any time by contacting us or through your account settings.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">GDPR Compliance</h2>
            <p className="text-gray-600 mb-4">
              We are fully compliant with the General Data Protection Regulation (GDPR). As a data controller, we:
            </p>
            <ul className="list-disc pl-6 text-gray-600">
              <li>Process data lawfully, fairly, and transparently</li>
              <li>Collect data for specified, legitimate purposes only</li>
              <li>Minimize data collection to what is necessary</li>
              <li>Keep data accurate and up to date</li>
              <li>Store data only as long as necessary</li>
              <li>Ensure appropriate security of personal data</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Rights</h2>
            <p className="text-gray-600 mb-4">You have the right to:</p>
            <ul className="list-disc pl-6 text-gray-600">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Delete your data</li>
              <li>Export your data in a portable format</li>
              <li>Object to processing</li>
              <li>Withdraw consent at any time</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
            <p className="text-gray-600">
              If you have questions about this Privacy Policy or want to exercise your rights, please contact us:
            </p>
            <ul className="list-none mt-4 text-gray-600">
              <li>Email: <a href="mailto:privacy@short.link" className="text-purple-600 hover:text-purple-700">privacy@short.link</a></li>
              <li>Contact page: <Link href="/contact" className="text-purple-600 hover:text-purple-700">short.link/contact</Link></li>
            </ul>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}
