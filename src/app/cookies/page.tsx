'use client';

import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export default function CookiePolicyPage() {
    return (
        <div className="min-h-screen bg-white">
            <Navbar currentPage="cookies" />

            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <h1 className="text-4xl font-bold text-gray-900 mb-8">Cookie Policy</h1>
                <div className="prose prose-lg prose-purple text-gray-600">
                    <p className="mb-6">Effective Date: January 01, 2025</p>

                    <p className="mb-6">
                        At short.link, we believe in being transparent about how we use your information. This Cookie Policy explains how and why cookies and other similar technologies may be stored on and accessed from your device when you use or visit our websites.
                    </p>

                    <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">What are cookies?</h2>
                    <p className="mb-6">
                        Cookies are small text files that a website saves on your computer or mobile device when you visit the site. It enables the website to remember your actions and preferences (such as login, language, font size and other display preferences) over a period of time, so you don’t have to keep re-entering them whenever you come back to the site or browse from one page to another.
                    </p>

                    <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">How do we use cookies?</h2>
                    <p className="mb-6">
                        We use cookies to:
                    </p>
                    <ul className="list-disc pl-6 mb-6 space-y-2">
                        <li>Keep you signed in to your account.</li>
                        <li>Analyze how our website is used (analytics) to improve performance.</li>
                        <li>Remember your preferences.</li>
                    </ul>
                    <p className="mb-6 font-bold">
                        IMPORTANT: We do NOT use cookies to track your visitors&apos; behavior across the web for advertising purposes. The links you generate on short.link are privacy-first.
                    </p>

                    <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Types of Cookies we use</h2>
                    <div className="space-y-4 mb-8">
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                            <h3 className="font-bold text-gray-900">Essential Cookies</h3>
                            <p className="text-sm">Necessary for the website to function properly (e.g., authentication).</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                            <h3 className="font-bold text-gray-900">Analytics Cookies</h3>
                            <p className="text-sm">Help us understand how visitors interact with the website.</p>
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Managing Cookies</h2>
                    <p className="mb-6">
                        You can control and/or delete cookies as you wish. You can delete all cookies that are already on your computer and you can set most browsers to prevent them from being placed. If you do this, however, you may have to manually adjust some preferences every time you visit a site and some services and functionalities may not work.
                    </p>
                </div>
            </div>

            <Footer />
        </div>
    );
}
