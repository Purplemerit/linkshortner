'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { motion, AnimatePresence } from 'framer-motion';

export default function OnboardingPage() {
    const router = useRouter();
    const { user } = useUser();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: user?.fullName || '',
        intent: [] as string[],
        industry: '',
    });

    const handleNext = () => {
        setStep(prev => prev + 1);
    };

    const handleFinish = (action?: string) => {
        // Save onboarding data if needed, then redirect
        // For now, simple redirect based on action
        if (action === 'create_link') {
            router.push('/dashboard?action=create_link');
        } else if (action === 'qr_code') {
            router.push('/dashboard?tab=qr');
        } else {
            router.push('/dashboard');
        }
    };

    const intents = [
        { id: 'branded', label: 'Branded short URLs', icon: '🔗' },
        { id: 'qr', label: 'Customizable QR Codes', icon: '📱' },
        { id: 'landing', label: 'Effective landing pages', icon: '📄' },
        { id: 'sms', label: 'Personalized SMS communications', icon: '💬' },
        { id: 'marketing', label: 'Digital marketing or branding', icon: '📣' },
        { id: 'analytics', label: 'Advanced analytics & tracking', icon: '📈' },
        { id: 'api', label: 'API for developers', icon: '⚙️' },
        { id: 'other', label: 'Other', icon: '💡' },
    ];

    return (
        <div className="min-h-screen flex bg-white">
            {/* Left Content */}
            <div className="w-full lg:w-1/2 p-8 lg:p-16 flex flex-col justify-center">
                <div className="max-w-xl mx-auto w-full">
                    {/* Logo */}
                    <div className="mb-12">
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">short.link</h1>
                    </div>

                    <div className="mb-8">
                        {/* Progress / Step Title */}
                        <div className="flex gap-4 mb-8 text-sm font-medium text-gray-500">
                            <span className={step >= 1 ? 'text-purple-600' : ''}>About you</span>
                            <span>—</span>
                            <span className={step >= 2 ? 'text-purple-600' : ''}>Your work</span>
                            <span>—</span>
                            <span className={step >= 3 ? 'text-purple-600' : ''}>Start creating</span>
                        </div>
                    </div>

                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div>
                                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome to short.link!</h2>
                                    <p className="text-gray-600">Tell us a bit about yourself</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">What should we call you?</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">This will be your display name.</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">How will you use short.link?</label>
                                    <div className="flex flex-wrap gap-2">
                                        {intents.map(intent => (
                                            <button
                                                key={intent.id}
                                                onClick={() => {
                                                    const newIntents = formData.intent.includes(intent.id)
                                                        ? formData.intent.filter(i => i !== intent.id)
                                                        : [...formData.intent, intent.id];
                                                    setFormData({ ...formData, intent: newIntents });
                                                }}
                                                className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors flex items-center gap-2 ${formData.intent.includes(intent.id)
                                                    ? 'border-purple-600 bg-purple-50 text-purple-700'
                                                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                                                    }`}
                                            >
                                                <span>{intent.icon}</span> {intent.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-4 flex justify-end">
                                    <button
                                        onClick={handleNext}
                                        className="px-8 py-3 bg-purple-600 text-white rounded font-semibold hover:bg-purple-700 transition-colors"
                                    >
                                        Continue &rarr;
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div>
                                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Tell us about your work</h2>
                                    <p className="text-gray-600">This will help us understand your needs a bit better</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">What does your company do?</label>
                                    <select
                                        value={formData.industry}
                                        onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none bg-white"
                                    >
                                        <option value="">Select an Industry</option>
                                        <option value="marketing">Marketing & Advertising</option>
                                        <option value="tech">Technology</option>
                                        <option value="ecommerce">E-Commerce & Retail</option>
                                        <option value="education">Education</option>
                                        <option value="finance">Finance & Insurance</option>
                                        <option value="healthcare">Healthcare</option>
                                        <option value="media">Media & Entertainment</option>
                                        <option value="nonprofit">Non-Profit</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>

                                <div className="pt-4 flex justify-between items-center">
                                    <button
                                        onClick={() => setStep(1)}
                                        className="text-gray-600 hover:text-gray-900 font-medium"
                                    >
                                        Back
                                    </button>
                                    <button
                                        onClick={handleNext}
                                        className="px-8 py-3 bg-purple-600 text-white rounded font-semibold hover:bg-purple-700 transition-colors"
                                    >
                                        Continue &rarr;
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div>
                                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Where would you like to start?</h2>
                                    <p className="text-gray-600">Let&apos;s get down to business</p>
                                </div>

                                <div className="space-y-4">
                                    <button
                                        onClick={() => handleFinish('create_link')}
                                        className="w-full p-6 border-2 border-gray-100 hover:border-purple-600 rounded-xl text-left group transition-all hover:bg-purple-50 flex items-start gap-4"
                                    >
                                        <div className="bg-purple-100 p-3 rounded-lg text-2xl group-hover:bg-purple-200 transition-colors">🔗</div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 text-lg group-hover:text-purple-700">Create a short link</h3>
                                            <p className="text-gray-500 text-sm">Turn a long and confusing URL into a short, memorable link.</p>
                                        </div>
                                    </button>

                                    <button
                                        onClick={() => handleFinish('qr_code')}
                                        className="w-full p-6 border-2 border-gray-100 hover:border-purple-600 rounded-xl text-left group transition-all hover:bg-purple-50 flex items-start gap-4"
                                    >
                                        <div className="bg-green-100 p-3 rounded-lg text-2xl group-hover:bg-green-200 transition-colors">📱</div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 text-lg group-hover:text-purple-700">Create a QR Code</h3>
                                            <p className="text-gray-500 text-sm">Connect a digital destination to the real world with a quick scan.</p>
                                        </div>
                                    </button>

                                    <button
                                        onClick={() => handleFinish()}
                                        className="w-full p-6 border-2 border-gray-100 hover:border-purple-600 rounded-xl text-left group transition-all hover:bg-purple-50 flex items-start gap-4"
                                    >
                                        <div className="bg-blue-100 p-3 rounded-lg text-2xl group-hover:bg-blue-200 transition-colors">📄</div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 text-lg group-hover:text-purple-700">Explore Dashboard</h3>
                                            <p className="text-gray-500 text-sm">See analytics, manage teams, and explore all features.</p>
                                        </div>
                                    </button>
                                </div>

                                <div className="pt-4 text-center">
                                    <button onClick={() => handleFinish()} className="text-gray-400 hover:text-gray-600 text-sm font-medium">I&apos;ll jump in on my own</button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Right Illustration */}
            <div className="hidden lg:flex w-1/2 bg-[#F6F8FA] items-center justify-center relative overflow-hidden">
                {/* Decorative Circles */}
                <div className="absolute w-[800px] h-[800px] border border-gray-200 rounded-full animate-[spin_60s_linear_infinite]"></div>
                <div className="absolute w-[600px] h-[600px] border border-gray-200 rounded-full animate-[spin_50s_linear_infinite_reverse]"></div>
                <div className="absolute w-[400px] h-[400px] border border-gray-200 rounded-full animate-[spin_40s_linear_infinite]"></div>

                {/* Icons floating on orbits */}
                <div className="absolute top-1/4 left-1/4 bg-white p-3 rounded shadow-lg animate-bounce delay-100">📊</div>
                <div className="absolute bottom-1/3 right-1/4 bg-white p-3 rounded shadow-lg animate-bounce delay-700">🔗</div>
                <div className="absolute top-1/2 right-20 bg-white p-3 rounded shadow-lg animate-bounce delay-300">📱</div>

                {/* Center Content */}
                <div className="relative z-10 text-center">
                    <div className="w-32 h-32 bg-purple-600 rounded-full mx-auto mb-6 flex items-center justify-center text-5xl shadow-2xl shadow-purple-200">
                        👋
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Connect to the tools you use</h3>
                    <p className="text-gray-600 max-w-sm mx-auto">Integrate with your favorite apps and streamline your workflow.</p>
                </div>
            </div>
        </div>
    );
}
