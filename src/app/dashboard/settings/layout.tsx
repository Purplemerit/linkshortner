'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, Key, CreditCard } from 'lucide-react';

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const settingsNavItems = [
    { href: '/dashboard/settings/profile', label: 'Profile Settings', icon: User },
    { href: '/dashboard/settings/api', label: 'Developer API', icon: Key },
    { href: '/dashboard/settings/billing', label: 'Billing & Usage', icon: CreditCard },
  ];

  return (
    <div className="max-w-6xl mx-auto w-full py-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Account Settings</h1>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Settings Sidebar */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <nav className="space-y-1">
            {settingsNavItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                                        flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors
                                        ${isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }
                                    `}
                >
                  <item.icon size={18} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Settings Content */}
        <div className="flex-1 w-full min-w-0">
          {children}
        </div>
      </div>
    </div>
  );
}
