'use client';

import { useState } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export default function PricingPage() {
  const { isSignedIn, user } = useUser();
  const router = useRouter();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const plans = [
    {
      name: 'Free',
      subtitle: 'Perfect for testing',
      price: 0,
      currency: '₹',
      period: '/month',
      features: [
        '100 links/week',
        'Basic analytics',
        '1 default domain',
        'No custom domains',
        'No team members',
      ],
      cta: 'Get Started',
      highlighted: false,
      buttonStyle: 'border-2 border-gray-300 text-gray-900 hover:bg-gray-50',
    },
    {
      name: 'Starter',
      subtitle: 'For teams & agencies',
      price: 999,
      currency: '₹',
      period: '/month',
      popular: true,
      features: [
        '500 links/week',
        'Real-time analytics',
        '2 custom domains',
        'QR codes',
        '3 team members',
      ],
      cta: 'Get Started',
      highlighted: true,
      buttonStyle: 'bg-purple-600 text-white hover:bg-purple-700',
    },
    {
      name: 'Professional',
      subtitle: 'For enterprises',
      price: 2999,
      currency: '₹',
      period: '/month',
      features: [
        '5,000 links/month',
        'All analytics',
        '10 custom domains',
        'Advanced team RBAC',
        'API access',
      ],
      cta: 'Get Started',
      highlighted: false,
      buttonStyle: 'border-2 border-purple-600 text-purple-600 hover:bg-purple-50',
    },
  ];

  const handleSubscription = async (plan: string, amount: number) => {
    if (!isSignedIn) {
      router.push('/sign-up?redirect_url=/onboarding/choose-plan');
      return;
    }


    if (amount === 0) {
      router.push('/dashboard');
      return;
    }

    setLoadingPlan(plan);
    try {
      // 1. Create Order
      const response = await fetch('/api/subscription/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, amount }),
      });

      if (!response.ok) throw new Error('Failed to create order');
      const order = await response.json();

      // 2. Open Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'short.link',
        description: `${plan} Subscription`,
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
            router.push('/dashboard');
          } else {
            alert('Payment verification failed.');
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
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />

      <Navbar currentPage="pricing" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-3 sm:mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto">
            No hidden fees. Cancel anytime. 30-day money-back guarantee.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-6xl mx-auto mb-12 sm:mb-16 lg:mb-20">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={`relative bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 lg:p-8 transition-all ${plan.highlighted
                ? 'border-2 border-purple-600 shadow-xl lg:shadow-2xl md:scale-105'
                : 'border-2 border-gray-200 shadow-md lg:shadow-lg hover:shadow-lg lg:hover:shadow-xl'
                }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-3 sm:-top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-purple-600 text-white px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm font-bold shadow-lg">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Plan Name */}
              <div className="mb-4 sm:mb-6">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">{plan.name}</h3>
                <p className="text-xs sm:text-sm text-gray-600">{plan.subtitle}</p>
              </div>

              {/* Price */}
              <div className="mb-6 sm:mb-8">
                <div className="flex items-baseline">
                  <span className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">{plan.currency}{plan.price}</span>
                  <span className="text-gray-600 ml-2 text-xs sm:text-sm">{plan.period}</span>
                </div>
              </div>

              {/* Features */}
              <ul className="space-y-2 sm:space-y-3 lg:space-y-4 mb-6 sm:mb-8">
                {plan.features.map((feature, fIdx) => (
                  <li key={fIdx} className="flex items-start gap-2 sm:gap-3">
                    <svg className="w-4 sm:w-5 h-4 sm:h-5 text-purple-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-xs sm:text-sm lg:text-base text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <button
                onClick={() => handleSubscription(plan.name.toUpperCase(), plan.price)}
                disabled={loadingPlan === plan.name.toUpperCase()}
                className={`w-full py-2 sm:py-3 rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm lg:text-lg transition-all disabled:opacity-50 ${plan.buttonStyle}`}
              >
                {loadingPlan === plan.name.toUpperCase() ? 'Processing...' : plan.cta}
              </button>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-3 sm:space-y-4 lg:space-y-6">
            <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-5 lg:p-6 border-2 border-gray-200">
              <h3 className="font-bold text-gray-900 mb-2 text-sm sm:text-base">Can I change plans later?</h3>
              <p className="text-xs sm:text-sm text-gray-600">Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
            </div>
            <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-5 lg:p-6 border-2 border-gray-200">
              <h3 className="font-bold text-gray-900 mb-2 text-sm sm:text-base">What payment methods do you accept?</h3>
              <p className="text-xs sm:text-sm text-gray-600">We accept all major credit cards, debit cards, UPI, and net banking through Razorpay.</p>
            </div>
            <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-5 lg:p-6 border-2 border-gray-200">
              <h3 className="font-bold text-gray-900 mb-2 text-sm sm:text-base">Do you offer refunds?</h3>
              <p className="text-xs sm:text-sm text-gray-600">Yes, we offer a 30-day money-back guarantee on all paid plans. No questions asked.</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
