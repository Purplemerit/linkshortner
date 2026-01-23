import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Features - short.link | 50+ URL Shortener Features',
    description: 'Explore all 50+ features of short.link: link shortening, QR codes, analytics, custom domains, team collaboration, and more.',
};

export default function FeaturesLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
