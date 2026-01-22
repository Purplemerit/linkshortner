'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    // Simulate form submission (replace with actual API call in production)
    try {
      // In production, this would be an API call like:
      // await fetch('/api/contact', { method: 'POST', body: JSON.stringify(formData) });
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar currentPage="contact" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-3 sm:mb-4">Contact Us</h1>
        <p className="text-xs sm:text-sm lg:text-base xl:text-lg text-gray-600 mb-8 sm:mb-12">
          Have a question or need help? We&apos;d love to hear from you.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
          {/* Contact Form */}
          <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-lg sm:rounded-2xl border-2 border-gray-200">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Send a Message</h2>

            {status === 'success' ? (
              <div className="bg-green-50 border-l-4 border-green-600 p-4 sm:p-6 rounded">
                <h3 className="text-base sm:text-lg font-bold text-green-800 mb-2">Message Sent!</h3>
                <p className="text-xs sm:text-sm text-green-700">
                  Thank you for reaching out. We&apos;ll get back to you within 24 hours.
                </p>
                <button
                  onClick={() => setStatus('idle')}
                  className="mt-3 sm:mt-4 text-green-600 font-semibold hover:text-green-700 text-xs sm:text-sm"
                >
                  Send another message →
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                <div>
                  <label htmlFor="name" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-3 sm:px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-600 text-xs sm:text-sm"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-3 sm:px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-600 text-xs sm:text-sm"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">
                    Subject
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-3 sm:px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-600 text-xs sm:text-sm"
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="support">Technical Support</option>
                    <option value="billing">Billing Question</option>
                    <option value="enterprise">Enterprise Sales</option>
                    <option value="partnership">Partnership Opportunity</option>
                    <option value="bug">Bug Report</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-3 sm:px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-600 resize-none text-xs sm:text-sm"
                    placeholder="How can we help you?"
                  />
                </div>

                {status === 'error' && (
                  <p className="text-red-600 font-semibold text-xs sm:text-sm">
                    Something went wrong. Please try again.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="w-full px-4 sm:px-6 py-2 sm:py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed transition text-xs sm:text-base"
                >
                  {status === 'sending' ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>

          {/* Contact Info */}
          <div className="space-y-4 sm:space-y-6 lg:space-y-8">
            <div className="bg-purple-50 p-4 sm:p-6 lg:p-8 rounded-lg sm:rounded-2xl border-2 border-purple-200">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Get in Touch</h2>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-start gap-3 sm:gap-4">
                  <span className="text-lg sm:text-2xl">📧</span>
                  <div>
                    <h3 className="font-semibold text-xs sm:text-sm lg:text-base text-gray-900">Email</h3>
                    <a href="mailto:hello@short.link" className="text-purple-600 hover:text-purple-700 text-xs sm:text-sm">
                      hello@short.link
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3 sm:gap-4">
                  <span className="text-lg sm:text-2xl">💬</span>
                  <div>
                    <h3 className="font-semibold text-xs sm:text-sm lg:text-base text-gray-900">Live Chat</h3>
                    <p className="text-xs sm:text-sm text-gray-600">Available Mon-Fri, 9am-6pm EST</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 sm:gap-4">
                  <span className="text-lg sm:text-2xl">🐦</span>
                  <div>
                    <h3 className="font-semibold text-xs sm:text-sm lg:text-base text-gray-900">Twitter</h3>
                    <a
                      href="https://twitter.com/shortlinkapp"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-600 hover:text-purple-700 text-xs sm:text-sm"
                    >
                      @shortlinkapp
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 sm:p-6 lg:p-8 rounded-lg sm:rounded-2xl border-2 border-gray-200">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Response Times</h2>
              <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm lg:text-base text-gray-600">
                <li className="flex items-center gap-2">
                  <span className="text-green-600">●</span>
                  <span><strong>General:</strong> Within 24 hours</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-600">●</span>
                  <span><strong>Support:</strong> Within 4 hours</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-purple-600">●</span>
                  <span><strong>Enterprise:</strong> Within 2 hours</span>
                </li>
              </ul>
            </div>

            <div className="bg-gray-50 p-4 sm:p-6 lg:p-8 rounded-lg sm:rounded-2xl border-2 border-gray-200">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2 sm:mb-4">FAQ</h2>
              <p className="text-xs sm:text-sm lg:text-base text-gray-600 mb-2 sm:mb-4">
                Check our documentation for quick answers to common questions.
              </p>
              <Link
                href="/docs"
                className="text-purple-600 hover:text-purple-700 font-semibold text-xs sm:text-sm lg:text-base"
              >
                View Documentation →
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
