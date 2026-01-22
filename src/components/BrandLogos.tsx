export function BrandLogos() {
    return (
        <div className="w-full py-8 overflow-hidden opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            <div className="flex justify-center items-center flex-wrap gap-8 md:gap-16">
                {/* Placeholder Logo 1: TechFlow */}
                <svg className="h-8 md:h-9" viewBox="0 0 140 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M25 20L15 5H5L15 20L5 35H15L25 20Z" fill="currentColor" className="text-purple-600" />
                    <path d="M35 5H25L35 20L25 35H35L45 20L35 5Z" fill="currentColor" className="text-blue-500" />
                    <text x="55" y="28" fontFamily="sans-serif" fontSize="22" fontWeight="bold" fill="currentColor" className="text-gray-900">TechFlow</text>
                </svg>

                {/* Placeholder Logo 2: NexaScale */}
                <svg className="h-7 md:h-8" viewBox="0 0 150 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="20" cy="20" r="12" fill="currentColor" className="text-gray-900" />
                    <circle cx="20" cy="20" r="6" fill="white" />
                    <text x="40" y="27" fontFamily="sans-serif" fontSize="22" fontWeight="bold" fill="currentColor" className="text-gray-900">NexScale</text>
                </svg>

                {/* Placeholder Logo 3: Velocity */}
                <svg className="h-6 md:h-7" viewBox="0 0 140 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 35L20 5L30 35" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600" />
                    <text x="40" y="27" fontFamily="sans-serif" fontSize="22" fontWeight="bold" fontStyle="italic" fill="currentColor" className="text-gray-900">Velocity</text>
                </svg>

                {/* Placeholder Logo 4: Core */}
                <svg className="h-8 md:h-9" viewBox="0 0 100 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="5" y="5" width="30" height="30" rx="8" fill="currentColor" className="text-emerald-500" />
                    <rect x="15" y="15" width="10" height="10" rx="2" fill="white" />
                    <text x="45" y="28" fontFamily="sans-serif" fontSize="22" fontWeight="bold" fill="currentColor" className="text-gray-900">Core</text>
                </svg>

                {/* Placeholder Logo 5: Lattice */}
                <svg className="h-7 md:h-8 hidden sm:block" viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 10H20V30H10V10Z" fill="currentColor" className="text-orange-500" />
                    <path d="M22 20H32V30H22V20Z" fill="currentColor" className="text-orange-500" />
                    <text x="42" y="27" fontFamily="sans-serif" fontSize="22" fontWeight="bold" fill="currentColor" className="text-gray-900">Lattice</text>
                </svg>
            </div>
        </div>
    );
}
