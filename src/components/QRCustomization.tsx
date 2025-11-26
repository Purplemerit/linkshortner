'use client';

import { useState, useRef } from 'react';
import QRCode from 'qrcode.react';

interface QRCustomizationProps {
  shortUrl: string;
}

interface ColorPreset {
  name: string;
  fg: string;
  bg: string;
}

const colorPresets: ColorPreset[] = [
  { name: 'Original', fg: '#000000', bg: '#FFFFFF' },
  { name: 'Dark', fg: '#1F2937', bg: '#F3F4F6' },
  { name: 'Purple', fg: '#7C3AED', bg: '#F3E8FF' },
  { name: 'Blue', fg: '#1E40AF', bg: '#EFF6FF' },
  { name: 'Green', fg: '#166534', bg: '#F0FDF4' },
];

export function QRCustomization({ shortUrl }: QRCustomizationProps) {
  const qrRef = useRef<HTMLDivElement>(null);
  const [foregroundColor, setForegroundColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');
  const [logo, setLogo] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 500 * 1024) {
        alert('Logo file must be less than 500KB');
        return;
      }
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const applyPreset = (preset: ColorPreset) => {
    setForegroundColor(preset.fg);
    setBackgroundColor(preset.bg);
  };

  const resetToDefault = () => {
    setForegroundColor('#000000');
    setBackgroundColor('#FFFFFF');
    setLogo(null);
    setLogoFile(null);
  };

  const downloadQR = () => {
    const canvas = qrRef.current?.querySelector('canvas');
    if (!canvas) return;

    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    const shortCode = shortUrl.split('/').pop() || 'qr-code';
    link.download = `qr-${shortCode}-custom.png`;
    link.click();
  };

  return (
    <div className="p-8 bg-white rounded-lg border-2 border-gray-200">
      <h3 className="text-2xl font-bold mb-6">Customize QR Code</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Preview */}
        <div>
          <h4 className="text-sm font-semibold mb-4">Preview</h4>
          <div
            ref={qrRef}
            className="flex justify-center p-4 rounded-lg"
            style={{ backgroundColor }}
          >
            <QRCode
              value={shortUrl}
              size={200}
              fgColor={foregroundColor}
              bgColor={backgroundColor}
              imageSettings={
                logo
                  ? {
                      src: logo,
                      height: 40,
                      width: 40,
                      excavate: true,
                    }
                  : undefined
              }
            />
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-6">
          {/* Color Presets */}
          <div>
            <label className="block text-sm font-semibold mb-2">Color Presets</label>
            <div className="grid grid-cols-5 gap-2">
              {colorPresets.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => applyPreset(preset)}
                  className="p-2 border-2 border-gray-300 rounded-lg hover:border-purple-600 text-xs"
                  title={preset.name}
                >
                  <div
                    className="w-full h-8 rounded mb-1"
                    style={{
                      background: `linear-gradient(135deg, ${preset.fg} 50%, ${preset.bg} 50%)`,
                    }}
                  />
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          {/* Foreground Color */}
          <div>
            <label className="block text-sm font-semibold mb-2">Foreground Color</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={foregroundColor}
                onChange={(e) => setForegroundColor(e.target.value)}
                className="w-16 h-10 border-2 border-gray-300 rounded"
              />
              <input
                type="text"
                value={foregroundColor}
                onChange={(e) => setForegroundColor(e.target.value)}
                className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-600 font-mono text-sm"
                placeholder="#000000"
              />
            </div>
          </div>

          {/* Background Color */}
          <div>
            <label className="block text-sm font-semibold mb-2">Background Color</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
                className="w-16 h-10 border-2 border-gray-300 rounded"
              />
              <input
                type="text"
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
                className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-600 font-mono text-sm"
                placeholder="#FFFFFF"
              />
            </div>
          </div>

          {/* Logo Upload */}
          <div>
            <label className="block text-sm font-semibold mb-2">Logo (Optional, max 500KB)</label>
            <input
              type="file"
              accept="image/png,image/jpeg,image/jpg"
              onChange={handleLogoUpload}
              className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-600 text-sm"
            />
            {logo && (
              <div className="mt-2 flex items-center gap-2">
                <img src={logo} alt="Logo preview" className="w-16 h-16 rounded-lg object-cover" />
                <button
                  onClick={() => {
                    setLogo(null);
                    setLogoFile(null);
                  }}
                  className="text-red-600 hover:text-red-700 text-sm font-semibold"
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={resetToDefault}
              className="px-4 py-2 border-2 border-gray-300 text-gray-900 rounded-lg hover:bg-gray-50 font-semibold"
            >
              Reset
            </button>
            <button
              onClick={downloadQR}
              className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold"
            >
              Download Custom QR
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

