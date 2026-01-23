'use client';

import { X, Link as LinkIcon, QrCode, FileText, Sparkles, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface CreateModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function CreateModal({ isOpen, onClose }: CreateModalProps) {
    const router = useRouter();

    if (!isOpen) return null;

    const handleCreate = (type: 'link' | 'qr' | 'page') => {
        // Navigate to appropriate creation flow
        if (type === 'link') {
            router.push('/dashboard?tab=links&action=create'); // We'll handle this param in Dashboard
        } else if (type === 'qr') {
            router.push('/dashboard?tab=qr');
        } else if (type === 'page') {
            router.push('/dashboard/pages');
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="flex justify-between items-center p-6 pb-2">
                    <h2 className="text-2xl font-bold text-gray-900">What do you want to create?</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6 pt-4">
                    {/* Main Options */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button
                            onClick={() => handleCreate('link')}
                            className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl hover:border-blue-600 hover:bg-blue-50 transition-all group text-left"
                        >
                            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                <LinkIcon size={20} />
                            </div>
                            <div>
                                <span className="font-bold text-gray-900 block">Link</span>
                                <span className="text-xs text-gray-500 hidden group-hover:block fade-in">Shorten a URL</span>
                            </div>
                            <span className="ml-auto text-xs font-mono text-gray-400 border border-gray-200 px-1.5 rounded">L</span>
                        </button>

                        <button
                            onClick={() => handleCreate('qr')}
                            className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl hover:border-blue-600 hover:bg-blue-50 transition-all group text-left"
                        >
                            <div className="p-2 bg-orange-100 text-orange-600 rounded-lg group-hover:bg-orange-600 group-hover:text-white transition-colors">
                                <QrCode size={20} />
                            </div>
                            <div>
                                <span className="font-bold text-gray-900 block">QR Code</span>
                            </div>
                            <span className="ml-auto text-xs font-mono text-gray-400 border border-gray-200 px-1.5 rounded">Q</span>
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}
