'use client';

import { useState, useRef } from 'react';
import QRCode from 'qrcode.react';

interface QRCodeGeneratorProps {
  shortUrl: string;
}

export function QRCodeGenerator({ shortUrl }: QRCodeGeneratorProps) {
  const qrRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState(300);
  const [format, setFormat] = useState<'png' | 'jpeg' | 'svg'>('png');

  const downloadQR = () => {
    const canvas = qrRef.current?.querySelector('canvas');
    if (!canvas) return;

    const link = document.createElement('a');
    link.href = canvas.toDataURL(`image/${format}`);
    const shortCode = shortUrl.split('/').pop() || 'qr-code';
    link.download = `qr-${shortCode}.${format}`;
    link.click();
  };

  const copyQR = async () => {
    const canvas = qrRef.current?.querySelector('canvas');
    if (!canvas) return;

    try {
      canvas.toBlob(async (blob) => {
        if (blob) {
          await navigator.clipboard.write([
            new ClipboardItem({ [blob.type]: blob }),
          ]);
          alert('QR code copied to clipboard!');
        }
      });
    } catch (err) {
      alert('Failed to copy QR code. Please download instead.');
    }
  };

  return (
    <div className="p-8 bg-white rounded-lg border-2 border-gray-200">
      <h3 className="text-2xl font-bold mb-6">QR Code</h3>

      {/* QR Preview */}
      <div
        ref={qrRef}
        className="flex justify-center mb-6 p-4 bg-gray-50 rounded-lg"
      >
        <QRCode value={shortUrl} size={size} />
      </div>

      {/* Controls */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-2">Size: {size}x{size}px</label>
          <input
            type="range"
            min="100"
            max="600"
            value={size}
            onChange={(e) => setSize(parseInt(e.target.value))}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Format</label>
          <div className="flex gap-2">
            {(['png', 'jpeg', 'svg'] as const).map((fmt) => (
              <button
                key={fmt}
                onClick={() => setFormat(fmt)}
                className={`px-4 py-2 rounded-lg font-semibold ${
                  format === fmt
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                }`}
              >
                {fmt.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={downloadQR}
            className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold"
          >
            Download QR Code
          </button>
          <button
            onClick={copyQR}
            className="px-6 py-3 border-2 border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 font-semibold"
          >
            Copy
          </button>
        </div>
      </div>
    </div>
  );
}

