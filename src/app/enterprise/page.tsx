'use client';

import { useState } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';

export default function EnterprisePage() {
  const [formData, setFormData] = useState({
    email: '',
    company: '',
    teamSize: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    try {
      // In production, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setStatus('success');
      setFormData({ email: '', company: '', teamSize: '', message: '' });
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
      <Navbar currentPage="enterprise" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16">
          {/* Left Column - Info */}
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-6">Enterprise Solutions</h1>
            <p className="text-gray-600 mb-8 text-lg sm:text-xl lg:text-2xl">
              Custom solutions for large organizations with dedicated support, unlimited resources, and enterprise-grade security.
            </p>

            <div className="space-y-6 mb-12">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🚀</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg sm:text-xl">Unlimited Everything</h3>
                  <p className="text-gray-600">Unlimited links, team members, and custom domains for your organization.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">👤</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg sm:text-xl">Dedicated Account Manager</h3>
                  <p className="text-gray-600">Personal support from a dedicated account manager who knows your business.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🔒</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg sm:text-xl">Enterprise Security</h3>
                  <p className="text-gray-600">SSO, advanced access controls, audit logs, and SOC 2 Type II compliance.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">⚡</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg sm:text-xl">99.99% SLA Uptime</h3>
                  <p className="text-gray-600">Enterprise-grade reliability with guaranteed uptime and priority support.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🏢</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg sm:text-xl">On-Premise Option</h3>
                  <p className="text-gray-600">Deploy short.link on your own infrastructure for complete control.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🔌</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg sm:text-xl">Custom Integrations</h3>
                  <p className="text-gray-600">Custom API integrations, webhooks, and workflow automation.</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 sm:p-6 lg:p-8 rounded-lg">
              <p className="text-gray-600 text-sm">
                <strong className="text-gray-900">Trusted by:</strong> Fortune 500 companies, government agencies, and leading enterprises worldwide.
              </p>
            </div>
          </div>

          {/* Right Column - Form */}
          <div>
            <div className="bg-purple-50 p-4 sm:p-6 lg:p-8 rounded-xl border-2 border-purple-200">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Contact Sales</h2>
              <p className="text-gray-600 mb-6">
                Get in touch with our sales team to discuss your enterprise needs.
              </p>

              {status === 'success' ? (
                <div className="bg-green-50 border-l-4 border-green-600 p-6 rounded">
                  <h3 className="text-lg font-bold text-green-800 mb-2">Request Received!</h3>
                  <p className="text-green-700 mb-4">
                    Thank you for your interest. Our enterprise sales team will contact you within 2 business hours.
                  </p>
                  <button
                    type="button"
                    onClick={() => setStatus('idle')}
                    className="text-green-600 font-semibold hover:text-green-700"
                  >
                    Submit another request →
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">
                      Work Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-600"
                      placeholder="you@company.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="company" className="block text-sm font-semibold text-gray-700 mb-1">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-600"
                      placeholder="Acme Inc."
                    />
                  </div>

                  <div>
                    <label htmlFor="teamSize" className="block text-sm font-semibold text-gray-700 mb-1">
                      Team Size *
                    </label>
                    <select
                      id="teamSize"
                      name="teamSize"
                      value={formData.teamSize}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-600"
                    >
                      <option value="">Select team size</option>
                      <option value="10-50">10-50 employees</option>
                      <option value="51-200">51-200 employees</option>
                      <option value="201-500">201-500 employees</option>
                      <option value="501-1000">501-1,000 employees</option>
                      <option value="1000+">1,000+ employees</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-1">
                      Tell us about your requirements
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-600 resize-none"
                      placeholder="What are you looking to achieve with short.link?"
                    />
                  </div>

                  {status === 'error' && (
                    <p className="text-red-600 font-semibold">
                      Something went wrong. Please try again or email us directly.
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="w-full px-6 py-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-bold text-lg disabled:bg-gray-400 disabled:cursor-not-allowed transition"
                  >
                    {status === 'sending' ? 'Sending...' : 'Contact Sales'}
                  </button>

                  <p className="text-sm text-gray-500 text-center">
                    Or email us directly at{' '}
                    <a href="mailto:enterprise@short.link" className="text-purple-600 hover:text-purple-700 font-semibold">
                      enterprise@short.link
                    </a>
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
