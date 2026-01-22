'use client';

import Link from 'next/link';
import { UserButton } from '@clerk/nextjs';
import { VerificationBanner } from '@/components/VerificationBanner';
import { useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import {
    LayoutDashboard,
    QrCode,
    BarChart2,
    Settings,
    Users,
    Link as LinkIcon,
    Menu,
    X,
    Plus,
    Home,
    FolderOpen,
    Globe,
    Lock
} from 'lucide-react';

import { CreateModal } from '@/components/CreateModal';
import { useSubscription } from '@/hooks/useSubscription';

export default function DashboardClient({
    children,
}: {
    children: React.ReactNode;
}) {
    const { plan } = useSubscription();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const currentTab = searchParams.get('tab');

    const navItems = [
        { href: '/dashboard', label: 'Home', icon: Home, exact: true },
        { href: '/dashboard?tab=links', label: 'Links', icon: LinkIcon },
        { href: '/dashboard?tab=qr', label: 'QR Codes', icon: QrCode },
        { href: '/dashboard?tab=analytics', label: 'Analytics', icon: plan?.name === 'FREE' ? Lock : BarChart2, badge: plan?.name === 'FREE' ? 'PRO' : undefined, badgeColor: plan?.name === 'FREE' ? 'bg-gray-100 text-gray-500' : undefined },
        { href: '/dashboard/campaigns', label: 'Campaigns', icon: FolderOpen },
        { href: '/dashboard/domains', label: 'Custom domains', icon: plan?.name === 'FREE' ? Lock : Globe, badge: plan?.name === 'FREE' ? 'PRO' : 'TRY IT', badgeColor: plan?.name === 'FREE' ? 'bg-gray-100 text-gray-500' : 'bg-purple-100 text-purple-600' },
        { href: '/dashboard/team-collaboration', label: 'Teams & Workspaces', icon: Users },
        { href: '/dashboard/settings', label: 'Settings', icon: Settings },
    ];

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
            {/* Mobile Header */}
            <header className="md:hidden bg-white border-b border-gray-200 p-4 flex justify-between items-center sticky top-0 z-30">
                <Link href="/dashboard" className="flex items-center gap-2">
                    <span className="text-xl font-bold text-[#0e2a5c]">short.link</span>
                </Link>
                <div className="flex items-center gap-3">
                    <UserButton afterSignOutUrl="/" />
                    <button onClick={toggleSidebar} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </header>

            {/* Sidebar (Desktop & Mobile Drawer) */}
            <aside className={`
                fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 text-gray-900 transform transition-transform duration-200 ease-in-out
                md:translate-x-0 md:sticky md:top-0 md:h-screen
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="h-full flex flex-col font-sans">
                    {/* Logo Area */}
                    <div className="p-6 flex items-center gap-2">
                        <div className="text-3xl font-extrabold text-orange-600 tracking-tight">short.link</div>
                    </div>

                    {/* Create Button */}
                    <div className="px-4 pb-6">
                        <button
                            onClick={() => setCreateModalOpen(true)}
                            className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#0e2a5c] hover:bg-[#1a3b75] text-white rounded font-bold transition-colors text-sm shadow-sm"
                        >
                            Create new
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-0 space-y-0.5 overflow-y-auto">
                        {navItems.map((item) => {
                            let isActive = false;

                            if (item.label === 'Home') {
                                // Home is strictly /dashboard with NO tabs
                                isActive = pathname === '/dashboard' && !currentTab;
                            } else if (item.href.includes('?tab=')) {
                                const itemTab = item.href.split('?tab=')[1];
                                isActive = pathname === '/dashboard' && currentTab === itemTab;
                            } else {
                                isActive = pathname.startsWith(item.href);
                            }

                            return (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    onClick={() => setSidebarOpen(false)}
                                    className={`
                                        group flex items-center justify-between px-6 py-3 text-sm font-medium transition-colors border-l-4
                                        ${isActive
                                            ? 'bg-blue-50 text-[#0e2a5c] border-[#0e2a5c]'
                                            : 'text-gray-600 hover:bg-gray-50 border-transparent hover:text-[#0e2a5c]'
                                        }
                                    `}
                                >
                                    <div className="flex items-center gap-3">
                                        <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                                        {item.label}
                                    </div>
                                    {item.badge && (
                                        <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${item.badgeColor}`}>
                                            {item.badge}
                                        </span>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Mobile Profile Trigger */}
                    <div className="p-4 border-t border-gray-200 md:hidden">
                        {/* Mobile interactions */}
                    </div>
                </div>
            </aside>

            {/* Overlay for mobile sidebar */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Main Content */}
            <main className="flex-1 min-w-0 overflow-y-auto h-full md:h-screen">
                {/* Desktop Top Header (Search, User) */}
                <header className="hidden md:flex bg-white h-16 border-b border-gray-200  items-center justify-between px-8 sticky top-0 z-20">
                    <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
                    <div className="flex items-center gap-4">
                        {plan?.name === 'FREE' && (
                            <Link href="/pricing" className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-bold text-sm shadow-md hover:shadow-purple-200 hover:-translate-y-0.5 transition-all">
                                Upgrade Plan
                            </Link>
                        )}
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search links..."
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-blue-500 w-64 transition-all focus:w-80"
                            />
                            <svg className="w-4 h-4 text-gray-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </div>
                        <div className="h-6 w-px bg-gray-300 mx-2"></div>
                        <UserButton afterSignOutUrl="/" />
                    </div>
                </header>

                <div className="px-4 py-3 md:p-8 max-w-7xl mx-auto">
                    <VerificationBanner />
                    {children}
                </div>
            </main>
            {/* Create Selection Modal */}
            <CreateModal isOpen={createModalOpen} onClose={() => setCreateModalOpen(false)} />
        </div>
    );
}
