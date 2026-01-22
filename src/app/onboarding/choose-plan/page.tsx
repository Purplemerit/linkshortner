'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import { Check, Sparkles, Zap, Crown } from 'lucide-react';

const PLANS = [
    {
        id: 'FREE',
        name: 'Free',
        subtitle: 'Perfect for getting started',
        price: 0,
        currency: '₹',
        period: '/month',
        icon: Sparkles,
        features: [
            '100 links/week',
            'Basic analytics',
            '1 default domain',
            'No custom domains',
            'No team members',
        ],
        buttonStyle: 'border-2 border-gray-300 text-gray-900 hover:bg-gray-50',
        highlighted: false,
    },
    {
        id: 'STARTER',
        name: 'Starter',
        subtitle: 'For teams & agencies',
        price: 999,
        currency: '₹',
        period: '/month',
        icon: Zap,
        popular: true,
        features: [
            '500 links/week',
            'Real-time analytics',
            '2 custom domains',
            'QR codes',
            '3 team members',
        ],
        buttonStyle: 'bg-purple-600 text-white hover:bg-purple-700',
        highlighted: true,
    },
    {
        id: 'PROFESSIONAL',
        name: 'Professional',
        subtitle: 'For enterprises',
        price: 2999,
        currency: '₹',
        period: '/month',
        icon: Crown,
        features: [
            '5,000 links/month',
            'All analytics',
            '10 custom domains',
            'Advanced team RBAC',
            'API access',
        ],
        buttonStyle: 'border-2 border-purple-600 text-purple-600 hover:bg-purple-50',
        highlighted: false,
    },
];

export default function ChoosePlanPage() {
    const { user, isSignedIn, isLoaded } = useUser();
    const router = useRouter();
    const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

    useEffect(() => {
        if (isLoaded && !isSignedIn) {
            router.push('/sign-up');
        }
    }, [isLoaded, isSignedIn, router]);

    const handleSelectPlan = async (planId: string, amount: number) => {
        if (!isSignedIn) {
            router.push('/sign-up');
            return;
        }

        // For free plan, just redirect to dashboard
        if (amount === 0) {
            setLoadingPlan(planId);
            try {
                // Mark onboarding as complete
                const res = await fetch('/api/user/complete-onboarding', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ plan: 'FREE' })
                });

                if (!res.ok) {
                    const errData = await res.json();
                    throw new Error(errData.error || 'Server error');
                }

                // Force a hard refresh to ensure server layout sees the DB change
                window.location.href = '/dashboard';
            } catch (error) {
                console.error('Error:', error);
                alert('Failed to activate plan: ' + String(error));
                setLoadingPlan(null);
            }
            return;
        }

        setLoadingPlan(planId);
        try {
            // 1. Create Order
            const response = await fetch('/api/subscription/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ plan: planId, amount }),
            });

            if (!response.ok) throw new Error('Failed to create order');
            const order = await response.json();

            // 2. Open Razorpay
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: order.currency,
                name: 'short.link',
                description: `${planId} Subscription`,
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
                        // Mark onboarding as complete
                        await fetch('/api/user/complete-onboarding', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ plan: planId })
                        });
                        router.push('/dashboard?welcome=true');
                    } else {
                        alert('Payment verification failed. Please try again.');
                    }
                    setLoadingPlan(null);
                },
                prefill: {
                    name: user?.fullName || '',
                    email: user?.primaryEmailAddress?.emailAddress || '',
                },
                theme: {
                    color: '#9333ea',
                },
                modal: {
                    ondismiss: function () {
                        setLoadingPlan(null);
                    }
                }
            };

            const rzp = new (window as any).Razorpay(options);
            rzp.open();

        } catch (error) {
            console.error('Payment Error:', error);
            alert('Something went wrong. Please try again.');
            setLoadingPlan(null);
        }
    };

    if (!isLoaded) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
            <Script src="https://checkout.razorpay.com/v1/checkout.js" />

            {/* Header */}
            <div className="pt-12 pb-8 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                        <Sparkles size={16} />
                        Welcome to short.link!
                    </div>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                        Choose Your Plan
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Start with our free plan or unlock powerful features with a premium subscription.
                        You can always upgrade later.
                    </p>
                </div>
            </div>

            {/* Plans */}
            <div className="max-w-5xl mx-auto px-4 pb-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {PLANS.map((plan) => {
                        const Icon = plan.icon;
                        return (
                            <div
                                key={plan.id}
                                className={`relative bg-white rounded-2xl p-6 transition-all cursor-pointer ${plan.highlighted
                                    ? 'border-2 border-purple-500 shadow-xl shadow-purple-100 md:scale-105'
                                    : 'border-2 border-gray-200 shadow-lg hover:shadow-xl hover:border-gray-300'
                                    } ${selectedPlan === plan.id ? 'ring-2 ring-purple-500 ring-offset-2' : ''}`}
                                onClick={() => setSelectedPlan(plan.id)}
                            >
                                {/* Popular Badge */}
                                {plan.popular && (
                                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                        <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1 rounded-full text-xs font-bold shadow-lg">
                                            Recommended
                                        </span>
                                    </div>
                                )}

                                {/* Plan Icon & Name */}
                                <div className="flex items-center gap-3 mb-4 mt-2">
                                    <div className={`p-2 rounded-lg ${plan.highlighted ? 'bg-purple-100' : 'bg-gray-100'}`}>
                                        <Icon size={20} className={plan.highlighted ? 'text-purple-600' : 'text-gray-600'} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                                        <p className="text-xs text-gray-500">{plan.subtitle}</p>
                                    </div>
                                </div>

                                {/* Price */}
                                <div className="mb-6">
                                    <div className="flex items-baseline">
                                        <span className="text-4xl font-bold text-gray-900">{plan.currency}{plan.price}</span>
                                        <span className="text-gray-500 ml-1 text-sm">{plan.period}</span>
                                    </div>
                                    {plan.price > 0 && (
                                        <p className="text-xs text-green-600 mt-1">30-day money-back guarantee</p>
                                    )}
                                </div>

                                {/* Features */}
                                <ul className="space-y-3 mb-6">
                                    {plan.features.map((feature, fIdx) => (
                                        <li key={fIdx} className="flex items-start gap-2">
                                            <Check size={16} className="text-purple-600 mt-0.5 flex-shrink-0" />
                                            <span className="text-sm text-gray-600">{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                {/* CTA Button */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleSelectPlan(plan.id, plan.price);
                                    }}
                                    disabled={loadingPlan === plan.id}
                                    className={`w-full py-3 rounded-xl font-bold text-sm transition-all disabled:opacity-60 ${plan.buttonStyle}`}
                                >
                                    {loadingPlan === plan.id ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                            Processing...
                                        </span>
                                    ) : plan.price === 0 ? (
                                        'Continue with Free'
                                    ) : (
                                        'Get Started'
                                    )}
                                </button>
                            </div>
                        );
                    })}
                </div>

                {/* Skip Link */}
                <div className="text-center mt-8">
                    <button
                        onClick={() => handleSelectPlan('FREE', 0)}
                        className="text-gray-500 hover:text-gray-700 text-sm underline underline-offset-4"
                    >
                        Skip for now and use the free plan
                    </button>
                </div>

                {/* Trust Badges */}
                <div className="flex flex-wrap justify-center gap-6 mt-12 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        Secure payments via Razorpay
                    </div>
                    <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Cancel anytime
                    </div>
                    <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                        UPI, Cards & Net Banking
                    </div>
                </div>
            </div>
        </div>
    );
}
