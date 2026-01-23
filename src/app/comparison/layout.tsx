import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Comparison - short.link vs Bitly, Short.io | URL Shortener Comparison',
    description: 'Compare short.link with Bitly, Short.io, and Rebrandly. See why short.link offers the best features at the lowest price.',
};

export default function ComparisonLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
