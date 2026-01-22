'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import { Check, Lock, HelpCircle, CreditCard, Calendar, FileText } from 'lucide-react';

// Plan configuration
const PLANS = {
    FREE: {
        name: 'Free plan',
        price: 0,
        currency: '₹',
        features: [
            '100 short links/week',
            '2 QR Codes per month',
            '2 landing pages',
            '0 complimentary custom domains'
        ],
        limits: {
            shortLinks: 100,
            customBackHalves: 3,
            linkRedirects: 0,
            apiRequests: 1000,
            qrCodes: 2,
            pages: 2
        }
    },
    STARTER: {
        name: 'Starter plan',
        price: 999,
        currency: '₹',
        features: [
            '500 short links/week',
            'Real-time analytics',
            '2 custom domains',
            'QR codes',
            '3 team members'
        ],
        limits: {
            shortLinks: 500,
            customBackHalves: 50,
            linkRedirects: 100,
            apiRequests: 10000,
            qrCodes: 50,
            pages: 10
        }
    },
    PROFESSIONAL: {
        name: 'Professional plan',
        price: 2999,
        currency: '₹',
        features: [
            '5,000 links/month',
            'All analytics',
            '10 custom domains',
            'Advanced team RBAC',
            'API access'
        ],
        limits: {
            shortLinks: 5000,
            customBackHalves: 500,
            linkRedirects: 1000,
            apiRequests: 100000,
            qrCodes: 500,
            pages: 50
        }
    }
};

interface UsageData {
    shortLinks: number;
    qrCodes: number;
    pages: number;
}

interface SubscriptionData {
    plan: keyof typeof PLANS;
    status: string;
    startDate: string | null;
    endDate: string | null;
    paymentMethod?: string | null;
}

interface PaymentData {
    id: string;
    date: string;
    description: string;
    amount: number;
    currency: string;
}

export default function BillingPage() {
    const { user, isSignedIn, isLoaded } = useUser();
    const router = useRouter();
    const [loadingUpgrade, setLoadingUpgrade] = useState<string | null>(null);
    const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
    const [usage, setUsage] = useState<UsageData>({ shortLinks: 0, qrCodes: 0, pages: 0 });
    const [payments, setPayments] = useState<PaymentData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);

    // Get current month range
    const getCurrentMonthRange = () => {
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth(), 1);
        const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
    };

    useEffect(() => {
        if (isLoaded && !isSignedIn) {
            router.push('/sign-in');
            return;
        }

        if (isSignedIn) {
            fetchBillingData();
        }
    }, [isLoaded, isSignedIn, router]);

    const fetchBillingData = async () => {
        setIsLoading(true);
        try {
            // Fetch subscription data
            const subRes = await fetch('/api/subscription/current');
            if (subRes.ok) {
                const subData = await subRes.json();
                setSubscription(subData);
            } else {
                // Default to free plan
                setSubscription({ plan: 'FREE', status: 'ACTIVE', startDate: null, endDate: null });
            }

            // Fetch usage data
            const usageRes = await fetch('/api/usage/current');
            if (usageRes.ok) {
                const usageData = await usageRes.json();
                setUsage(usageData);
            }

            // Fetch payment history
            const paymentRes = await fetch('/api/payments/history');
            if (paymentRes.ok) {
                const paymentData = await paymentRes.json();
                setPayments(paymentData);
            }
        } catch (error) {
            console.error('Error fetching billing data:', error);
            // Set defaults on error
            setSubscription({ plan: 'FREE', status: 'ACTIVE', startDate: null, endDate: null });
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpgrade = async (targetPlan: string, amount: number) => {
        if (!isSignedIn) {
            router.push('/sign-up');
            return;
        }

        setLoadingUpgrade(targetPlan);
        try {
            // 1. Create Order
            const response = await fetch('/api/subscription/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ plan: targetPlan, amount }),
            });

            if (!response.ok) throw new Error('Failed to create order');
            const order = await response.json();

            // 2. Open Razorpay
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: order.currency,
                name: 'short.link',
                description: `${targetPlan} Subscription`,
                order_id: order.id,
                handler: async function (response: any) {
                    // 3. Verify Payment
                    const verifyRes = await fetch('/api/subscription/verify', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        })
                    });

                    if (verifyRes.ok) {
                        alert('Payment Successful! Subscription activated.');
                        fetchBillingData(); // Refresh data
                        setShowUpgradeModal(false);
                    } else {
                        alert('Payment verification failed.');
                    }
                    setLoadingUpgrade(null);
                },
                prefill: {
                    name: user?.fullName || '',
                    email: user?.primaryEmailAddress?.emailAddress || '',
                },
                theme: {
                    color: '#3b5998',
                },
                modal: {
                    ondismiss: function () {
                        setLoadingUpgrade(null);
                    }
                }
            };

            const rzp = new (window as any).Razorpay(options);
            rzp.open();

        } catch (error) {
            console.error('Payment Error:', error);
            alert('Something went wrong. Please try again.');
            setLoadingUpgrade(null);
        }
    };

    const currentPlan = subscription?.plan || 'FREE';
    const planConfig = PLANS[currentPlan as keyof typeof PLANS] || PLANS.FREE;
    const limits = planConfig.limits;

    // Calculate usage percentages
    const getUsagePercentage = (used: number, limit: number) => {
        if (limit === 0) return 0;
        return Math.min((used / limit) * 100, 100);
    };

    if (!isLoaded || isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <Script src="https://checkout.razorpay.com/v1/checkout.js" />

            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Billing and usage</h1>
            </div>

            {/* Plan Details Section */}
            <section>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Plan details</h2>
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                    {/* Plan Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                        <h3 className="text-lg font-bold text-gray-900">{planConfig.name}</h3>
                        <button
                            onClick={() => setShowUpgradeModal(true)}
                            className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors text-sm"
                        >
                            Upgrade
                        </button>
                    </div>

                    {/* Plan Features */}
                    <div className="px-6 py-5">
                        <p className="text-sm font-medium text-gray-700 mb-3">Included in your plan:</p>
                        <ul className="space-y-2">
                            {planConfig.features.map((feature, idx) => (
                                <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                                    <Check size={16} className="text-gray-400" />
                                    {feature}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* Monthly Usage Section */}
            <section>
                <div className="mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">Monthly usage</h2>
                    <p className="text-sm text-gray-500">{getCurrentMonthRange()}</p>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100">
                        <h3 className="text-base font-semibold text-gray-900">Usage details</h3>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {/* Short Links */}
                        <div className="px-6 py-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-gray-700">Short Links</span>
                                <span className="text-sm font-semibold text-gray-900">
                                    {usage.shortLinks} of {limits.shortLinks} used
                                </span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-1.5">
                                <div
                                    className="bg-blue-500 h-1.5 rounded-full transition-all"
                                    style={{ width: `${getUsagePercentage(usage.shortLinks, limits.shortLinks)}%` }}
                                />
                            </div>
                        </div>

                        {/* Custom back-halves */}
                        <div className="px-6 py-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-gray-700">Custom back-halves</span>
                                <span className="text-sm font-semibold text-gray-900">
                                    0 of {limits.customBackHalves} used
                                </span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-1.5">
                                <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '0%' }} />
                            </div>
                        </div>

                        {/* Link redirects */}
                        <div className="px-6 py-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-gray-700 flex items-center gap-1">
                                    Link redirects
                                    {limits.linkRedirects === 0 && <Lock size={14} className="text-gray-400" />}
                                </span>
                                <span className="text-sm font-semibold text-blue-600">
                                    0 of {limits.linkRedirects} used
                                </span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-1.5">
                                <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '0%' }} />
                            </div>
                        </div>

                        {/* API Requests */}
                        <div className="px-6 py-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-gray-700 flex items-center gap-1">
                                    API Requests
                                    <HelpCircle size={14} className="text-gray-400 cursor-help" />
                                </span>
                                <span className="text-sm font-semibold text-gray-900">
                                    0 of {limits.apiRequests.toLocaleString()} used
                                </span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-1.5">
                                <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '0%' }} />
                            </div>
                        </div>

                        {/* QR Codes */}
                        <div className="px-6 py-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-gray-700">QR Codes</span>
                                <span className="text-sm font-semibold text-gray-900">
                                    {usage.qrCodes} of {limits.qrCodes} used
                                </span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-1.5">
                                <div
                                    className="bg-blue-500 h-1.5 rounded-full transition-all"
                                    style={{ width: `${getUsagePercentage(usage.qrCodes, limits.qrCodes)}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Plan Limits Section */}
            <section>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Plan limits</h2>
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100">
                        <h3 className="text-base font-semibold text-gray-900">Usage details</h3>
                    </div>
                    <div className="px-6 py-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-700">Landing Pages</span>
                            <span className="text-sm font-semibold text-gray-900">
                                {usage.pages} of {limits.pages} used
                            </span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-1.5">
                            <div
                                className="bg-blue-500 h-1.5 rounded-full transition-all"
                                style={{ width: `${getUsagePercentage(usage.pages, limits.pages)}%` }}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Billing Details Section */}
            <section>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Billing details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Payment Method */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                        <div className="flex items-center gap-2 mb-3">
                            <CreditCard size={18} className="text-gray-400" />
                            <h3 className="text-base font-semibold text-gray-900">Payment method</h3>
                        </div>
                        <p className="text-lg font-medium text-gray-900">-</p>
                        <p className="text-sm text-gray-500">No card on file</p>
                    </div>

                    {/* Next Renewal */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                        <div className="flex items-center gap-2 mb-3">
                            <Calendar size={18} className="text-gray-400" />
                            <h3 className="text-base font-semibold text-gray-900">Next renewal date</h3>
                        </div>
                        <p className="text-sm text-teal-600 font-medium">
                            {subscription?.endDate
                                ? new Date(subscription.endDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
                                : 'No upcoming renewal'
                            }
                        </p>
                    </div>
                </div>
            </section>

            {/* Billing History Section */}
            <section>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Billing history</h2>
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                    <div className="grid grid-cols-3 px-6 py-3 border-b border-gray-100 bg-gray-50">
                        <span className="text-sm font-medium text-gray-600">Date</span>
                        <span className="text-sm font-medium text-gray-600">Description</span>
                        <span className="text-sm font-medium text-gray-600">Amount</span>
                    </div>
                    <div className="px-6 py-8 text-center">
                        {payments.length === 0 ? (
                            <p className="text-sm text-gray-500">You have not made any payments</p>
                        ) : (
                            <div className="divide-y divide-gray-100">
                                {payments.map((payment) => (
                                    <div key={payment.id} className="grid grid-cols-3 py-3 text-left">
                                        <span className="text-sm text-gray-700">{new Date(payment.date).toLocaleDateString()}</span>
                                        <span className="text-sm text-gray-700">{payment.description}</span>
                                        <span className="text-sm text-gray-900 font-medium">₹{payment.amount}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Upgrade Modal */}
            {showUpgradeModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-100">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold text-gray-900">Choose a Plan</h2>
                                <button
                                    onClick={() => setShowUpgradeModal(false)}
                                    className="text-gray-400 hover:text-gray-600 p-2"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="18" y1="6" x2="6" y2="18"></line>
                                        <line x1="6" y1="6" x2="18" y2="18"></line>
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Free Plan */}
                                <div className={`border-2 rounded-xl p-5 ${currentPlan === 'FREE' ? 'border-blue-500 bg-blue-50/30' : 'border-gray-200'}`}>
                                    <h3 className="text-lg font-bold text-gray-900 mb-1">Free</h3>
                                    <p className="text-xs text-gray-500 mb-4">Perfect for testing</p>
                                    <div className="mb-4">
                                        <span className="text-3xl font-bold text-gray-900">₹0</span>
                                        <span className="text-gray-500 text-sm">/month</span>
                                    </div>
                                    <ul className="space-y-2 mb-4">
                                        {PLANS.FREE.features.map((f, i) => (
                                            <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                                                <Check size={14} className="text-purple-600 mt-0.5 flex-shrink-0" />
                                                {f}
                                            </li>
                                        ))}
                                    </ul>
                                    <button
                                        disabled={currentPlan === 'FREE'}
                                        className={`w-full py-2 rounded-lg font-semibold text-sm ${currentPlan === 'FREE'
                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                : 'border-2 border-gray-300 text-gray-900 hover:bg-gray-50'
                                            }`}
                                    >
                                        {currentPlan === 'FREE' ? 'Current Plan' : 'Downgrade'}
                                    </button>
                                </div>

                                {/* Starter Plan */}
                                <div className={`border-2 rounded-xl p-5 relative ${currentPlan === 'STARTER' ? 'border-purple-500 bg-purple-50/30' : 'border-purple-500'}`}>
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                        <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                                            Most Popular
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-1 mt-2">Starter</h3>
                                    <p className="text-xs text-gray-500 mb-4">For teams & agencies</p>
                                    <div className="mb-4">
                                        <span className="text-3xl font-bold text-gray-900">₹999</span>
                                        <span className="text-gray-500 text-sm">/month</span>
                                    </div>
                                    <ul className="space-y-2 mb-4">
                                        {PLANS.STARTER.features.map((f, i) => (
                                            <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                                                <Check size={14} className="text-purple-600 mt-0.5 flex-shrink-0" />
                                                {f}
                                            </li>
                                        ))}
                                    </ul>
                                    <button
                                        onClick={() => handleUpgrade('STARTER', 999)}
                                        disabled={currentPlan === 'STARTER' || loadingUpgrade === 'STARTER'}
                                        className={`w-full py-2 rounded-lg font-semibold text-sm ${currentPlan === 'STARTER'
                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                : 'bg-purple-600 text-white hover:bg-purple-700'
                                            }`}
                                    >
                                        {loadingUpgrade === 'STARTER' ? 'Processing...' : currentPlan === 'STARTER' ? 'Current Plan' : 'Upgrade'}
                                    </button>
                                </div>

                                {/* Professional Plan */}
                                <div className={`border-2 rounded-xl p-5 ${currentPlan === 'PROFESSIONAL' ? 'border-purple-500 bg-purple-50/30' : 'border-gray-200'}`}>
                                    <h3 className="text-lg font-bold text-gray-900 mb-1">Professional</h3>
                                    <p className="text-xs text-gray-500 mb-4">For enterprises</p>
                                    <div className="mb-4">
                                        <span className="text-3xl font-bold text-gray-900">₹2,999</span>
                                        <span className="text-gray-500 text-sm">/month</span>
                                    </div>
                                    <ul className="space-y-2 mb-4">
                                        {PLANS.PROFESSIONAL.features.map((f, i) => (
                                            <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                                                <Check size={14} className="text-purple-600 mt-0.5 flex-shrink-0" />
                                                {f}
                                            </li>
                                        ))}
                                    </ul>
                                    <button
                                        onClick={() => handleUpgrade('PROFESSIONAL', 2999)}
                                        disabled={currentPlan === 'PROFESSIONAL' || loadingUpgrade === 'PROFESSIONAL'}
                                        className={`w-full py-2 rounded-lg font-semibold text-sm ${currentPlan === 'PROFESSIONAL'
                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                : 'border-2 border-purple-600 text-purple-600 hover:bg-purple-50'
                                            }`}
                                    >
                                        {loadingUpgrade === 'PROFESSIONAL' ? 'Processing...' : currentPlan === 'PROFESSIONAL' ? 'Current Plan' : 'Upgrade'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
