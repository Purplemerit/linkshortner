'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';

interface Feature {
    name: string;
    implemented: boolean;
    planRequired?: 'FREE' | 'STARTER' | 'PROFESSIONAL';
    route?: string;
}

interface FeatureCategory {
    icon: string;
    title: string;
    features: Feature[];
}

import { useSubscription } from '@/hooks/useSubscription';

export default function FeaturesPage() {
    const { user } = useUser();
    const { plan, loading } = useSubscription();
    // Use the fetched plan name or default to FREE
    const userPlan = plan?.name || 'FREE';

    const categories: FeatureCategory[] = [
        {
            icon: '🔗',
            title: 'Link Management',
            features: [
                { name: 'Link Shortening', implemented: true },
                { name: 'Custom Short URLs', implemented: true },
                { name: 'HTTPS/SSL Encryption', implemented: true },
                { name: 'API Access', implemented: true, planRequired: 'STARTER', route: '/dashboard/settings/api' },
                { name: 'Link Tagging', implemented: true },
                { name: 'Link History', implemented: true },
                { name: 'Password Protection', implemented: true, planRequired: 'STARTER' },
                { name: 'Link Expiration', implemented: true },
                { name: 'Link Editing', implemented: true },
                { name: 'Bulk Import', implemented: true, planRequired: 'STARTER' },
                { name: 'Link Cloaking', implemented: true, planRequired: 'PROFESSIONAL' },
                { name: 'Auto-Archive', implemented: true },
                { name: 'Multiple Domains', implemented: true, planRequired: 'STARTER', route: '/dashboard/domains' },
                { name: 'Link Pause', implemented: true },
                { name: 'Link Cloning', implemented: true },
                { name: 'Link Notes', implemented: true },
            ],
        },
        {
            icon: '🌐',
            title: 'Custom Domains',
            features: [
                { name: 'Domain Setup', implemented: true, planRequired: 'STARTER', route: '/dashboard/domains' },
                { name: 'DNS Verification', implemented: true, planRequired: 'STARTER' },
                { name: 'SSL Automation', implemented: true, planRequired: 'STARTER' },
                { name: 'Health Monitoring', implemented: true, planRequired: 'PROFESSIONAL' },
                { name: 'Root Router', implemented: true, planRequired: 'PROFESSIONAL' },
                { name: 'Custom 404 Pages', implemented: true, planRequired: 'PROFESSIONAL' },
                { name: 'Domain Analytics', implemented: true, planRequired: 'PROFESSIONAL' },
                { name: 'Multi-Domain Dashboard', implemented: true, planRequired: 'PROFESSIONAL' },
            ],
        },
        {
            icon: '📱',
            title: 'QR Codes',
            features: [
                { name: 'QR Generation', implemented: true },
                { name: 'PNG Format', implemented: true },
                { name: 'JPEG Format', implemented: true },
                { name: 'SVG Format', implemented: true, planRequired: 'STARTER' },
                { name: 'Size Customization', implemented: true },
                { name: 'Color Customization', implemented: true },
                { name: 'Gradients/Patterns', implemented: true, planRequired: 'PROFESSIONAL' },
                { name: 'Logo Branding', implemented: true, planRequired: 'PROFESSIONAL' },
            ],
        },
        {
            icon: '📊',
            title: 'Analytics',
            features: [
                { name: 'Real-Time Dashboard', implemented: true },
                { name: 'Click Counts', implemented: true },
                { name: 'Real-Time Tracking', implemented: true },
                { name: 'Time-Series Data', implemented: true },
                { name: 'Date Filters', implemented: true },
                { name: 'Unique vs Total', implemented: true },
                { name: 'Geographic Data', implemented: true },
                { name: 'City-Level Analytics', implemented: true },
                { name: 'Device Tracking', implemented: true },
                { name: 'Browser Tracking', implemented: true },
                { name: 'Referrer Tracking', implemented: true },
                { name: 'OS Tracking', implemented: true },
            ],
        },
        {
            icon: '👥',
            title: 'Team & Collaboration',
            features: [
                { name: 'Multi-User Accounts', implemented: true, planRequired: 'PROFESSIONAL' },
                { name: 'Role-Based Access', implemented: true, planRequired: 'PROFESSIONAL' },
                { name: 'Workspace Segmentation', implemented: true, planRequired: 'PROFESSIONAL' },
                { name: 'Activity Logs', implemented: true, planRequired: 'PROFESSIONAL' },
            ],
        },
    ];

    const getFeatureStatus = (feature: Feature) => {
        if (!feature.implemented) {
            return { status: 'coming-soon', color: 'bg-gray-100 text-gray-500 border-gray-200' };
        }
        if (feature.planRequired && !canAccessFeature(feature.planRequired, userPlan)) {
            return { status: 'upgrade', color: 'bg-amber-50 text-amber-700 border-amber-200' };
        }
        return { status: 'available', color: 'bg-green-50 text-green-700 border-green-200' };
    };

    const canAccessFeature = (required: string, current: string) => {
        const planHierarchy = { FREE: 0, STARTER: 1, PROFESSIONAL: 2 };
        return planHierarchy[current as keyof typeof planHierarchy] >= planHierarchy[required as keyof typeof planHierarchy];
    };

    return (
        <div className="max-w-7xl mx-auto px-8 py-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">All Features</h1>
                <p className="text-gray-600">
                    Explore all the powerful features available in your plan.
                    <Link href="/pricing" className="text-purple-600 hover:underline ml-1">
                        Upgrade to unlock more →
                    </Link>
                </p>
            </div>

            {/* Plan Badge */}
            <div className="mb-8 inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg font-semibold">
                <span>Current Plan:</span>
                <span className="px-3 py-1 bg-purple-600 text-white rounded-full text-sm">{userPlan}</span>
            </div>

            {/* Feature Categories */}
            <div className="space-y-12">
                {categories.map((category) => (
                    <div key={category.title} className="bg-white rounded-xl border-2 border-gray-200 p-6">
                        {/* Category Header */}
                        <div className="flex items-center gap-3 mb-6">
                            <span className="text-3xl">{category.icon}</span>
                            <h2 className="text-2xl font-bold text-gray-900">{category.title}</h2>
                        </div>

                        {/* Features Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {category.features.map((feature) => {
                                const { status, color } = getFeatureStatus(feature);

                                const FeatureCard = (
                                    <div
                                        className={`p-4 rounded-lg border-2 ${color} transition-all ${status === 'available' && feature.route
                                            ? 'hover:shadow-md cursor-pointer'
                                            : ''
                                            }`}
                                    >
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex items-start gap-2 flex-1">
                                                <span className="text-lg mt-0.5">
                                                    {status === 'available' ? '✓' : status === 'upgrade' ? '🔒' : '⏳'}
                                                </span>
                                                <span className="font-medium text-sm">{feature.name}</span>
                                            </div>
                                            {feature.planRequired && status === 'upgrade' && (
                                                <span className="text-xs px-2 py-1 bg-amber-200 text-amber-800 rounded-full whitespace-nowrap">
                                                    {feature.planRequired}
                                                </span>
                                            )}
                                        </div>
                                        {status === 'coming-soon' && (
                                            <p className="text-xs text-gray-500 mt-2">Coming soon</p>
                                        )}
                                    </div>
                                );

                                return feature.route && status === 'available' ? (
                                    <Link key={feature.name} href={feature.route}>
                                        {FeatureCard}
                                    </Link>
                                ) : (
                                    <div key={feature.name}>{FeatureCard}</div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* CTA Section */}
            <div className="mt-12 bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl p-8 text-white text-center">
                <h3 className="text-2xl font-bold mb-2">Want to unlock all features?</h3>
                <p className="mb-6 text-purple-100">
                    Upgrade to Professional plan and get access to advanced analytics, team collaboration, and more.
                </p>
                <Link
                    href="/pricing"
                    className="inline-block px-8 py-3 bg-white text-purple-600 rounded-lg hover:bg-gray-100 font-semibold"
                >
                    View Pricing Plans
                </Link>
            </div>
        </div>
    );
}
