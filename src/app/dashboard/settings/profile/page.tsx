'use client';

import { UserProfile } from '@clerk/nextjs';

export default function ProfileSettingsPage() {
    return (
        <div className="w-full">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Profile details</h2>
            <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden">
                <UserProfile
                    appearance={{
                        elements: {
                            rootBox: "w-full",
                            card: "w-full shadow-none border-none rounded-none p-0",
                            navbar: "hidden", // We provide our own sidebar navigation
                            pageScrollBox: "p-6",
                            headerTitle: "hidden",
                            headerSubtitle: "hidden"
                        }
                    }}
                    routing="hash"
                />
            </div>
        </div>
    );
}
