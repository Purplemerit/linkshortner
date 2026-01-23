'use client';

import { useState, useMemo, useEffect } from 'react';
import { Link } from '@/lib/dummy-data';
import { dummyLinks } from '@/lib/dummy-data';
import { parseTags } from '@/lib/api';

import { QRCodeSVG } from 'qrcode.react';

interface LinkDetailsModalProps {
  link: Link;
  onClose: () => void;
  onDelete?: (linkId: string) => Promise<void>;
  onUpdate?: () => Promise<void>;
}

function LinkDetailsModal({ link, onClose, onDelete, onUpdate }: LinkDetailsModalProps) {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [qrColor, setQrColor] = useState('#000000');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Parse tags in case they're in tagsJson format
  const tags = parseTags(link);

  // Edit form state
  const [editDestination, setEditDestination] = useState(link.destination);
  const [editTags, setEditTags] = useState(tags.join(', '));
  const [editPassword, setEditPassword] = useState(link.password || '');
  const [editNotes, setEditNotes] = useState(link.notes || '');
  const [editActive, setEditActive] = useState(link.active);
  // Format Date to YYYY-MM-DDTHH:mm for datetime-local input
  const initialDate = link.expiresAt ? new Date(link.expiresAt).toISOString().slice(0, 16) : '';
  const [editExpiresAt, setEditExpiresAt] = useState(initialDate);


  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(link.shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this link? This action cannot be undone.')) return;

    setIsDeleting(true);
    try {
      await onDelete?.(link.id);
      onClose();
    } catch (error) {
      console.error('Failed to delete:', error);
      alert('Failed to delete link');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const tagsArray = editTags.split(',').map(t => t.trim()).filter(Boolean);

      const response = await fetch(`/api/links/${link.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination: editDestination,
          tags: tagsArray,
          password: editPassword || null,
          notes: editNotes || null,
          active: editActive,
          // If empty string, send null to clear expiration
          expiresAt: editExpiresAt ? new Date(editExpiresAt).toISOString() : null,
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update link');
      }

      await onUpdate?.();
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update:', error);
      alert((error as Error).message);
    } finally {
      setIsSaving(false);
    }
  };

  // ... (render logic)

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl max-h-[95vh] overflow-y-auto outline-none animate-in fade-in zoom-in duration-200">

        {/* ... Header ... */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{isEditing ? 'Edit Link' : 'Link Details'}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl font-bold">×</button>
        </div>

        <div className="space-y-6">
          {/* QR Code Section */}
          {showQR && !isEditing && (
            <div className="flex flex-col items-center p-6 bg-gray-50 rounded-lg mb-4">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <QRCodeSVG
                  id={`qr-${link.id}`}
                  value={link.shortUrl}
                  size={200}
                  fgColor={qrColor}
                  level="H"
                  includeMargin={true}
                />
              </div>
              <div className="mt-4 flex items-center gap-2">
                <label className="text-sm font-semibold text-gray-700">QR Color:</label>
                <input
                  type="color"
                  value={qrColor}
                  onChange={(e) => setQrColor(e.target.value)}
                  className="h-8 w-16 cursor-pointer border border-gray-300 rounded"
                />
              </div>
              <p className="mt-2 text-sm text-gray-600">Scan to visit link</p>

              {/* QR Actions */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-2 w-full">
                <button
                  onClick={() => {
                    // Download QR Code as PNG
                    const svg = document.getElementById(`qr-${link.id}`);
                    if (!svg) return;

                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    const svgData = new XMLSerializer().serializeToString(svg);
                    const img = new Image();

                    img.onload = () => {
                      canvas.width = img.width;
                      canvas.height = img.height;
                      ctx?.drawImage(img, 0, 0);

                      const downloadLink = document.createElement('a');
                      downloadLink.download = `qr-${link.shortCode || 'code'}.png`;
                      downloadLink.href = canvas.toDataURL('image/png');
                      downloadLink.click();
                    };

                    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
                  }}
                  className="px-4 py-2.5 bg-purple-600 text-white rounded-xl hover:bg-purple-700 font-bold text-xs"
                >
                  PNG
                </button>
                <button
                  onClick={() => {
                    // Download as JPEG
                    const svg = document.getElementById(`qr-${link.id}`);
                    if (!svg) return;

                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    const svgData = new XMLSerializer().serializeToString(svg);
                    const img = new Image();

                    img.onload = () => {
                      canvas.width = img.width;
                      canvas.height = img.height;
                      // Fill white background for JPEG (transparency becomes black otherwise)
                      ctx!.fillStyle = '#FFFFFF';
                      ctx!.fillRect(0, 0, canvas.width, canvas.height);
                      ctx?.drawImage(img, 0, 0);

                      const downloadLink = document.createElement('a');
                      downloadLink.download = `qr-${link.shortCode || 'code'}.jpg`;
                      downloadLink.href = canvas.toDataURL('image/jpeg');
                      downloadLink.click();
                    };

                    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
                  }}
                  className="px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-bold text-xs"
                >
                  JPEG
                </button>
                <button
                  onClick={() => {
                    // Download as SVG
                    const svg = document.getElementById(`qr-${link.id}`);
                    if (!svg) return;

                    const svgData = new XMLSerializer().serializeToString(svg);
                    const blob = new Blob([svgData], { type: 'image/svg+xml' });
                    const url = URL.createObjectURL(blob);
                    const downloadLink = document.createElement('a');
                    downloadLink.href = url;
                    downloadLink.download = `qr-${link.shortCode || 'code'}.svg`;
                    downloadLink.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="px-4 py-2.5 bg-white border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 font-bold text-xs"
                >
                  SVG
                </button>
              </div>


              <button
                onClick={() => setShowQR(false)}
                className="mt-4 text-sm text-purple-600 font-semibold hover:underline"
              >
                Hide QR Code
              </button>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Short URL</label>
            <div className="flex gap-2">
              <code className="flex-1 px-4 py-3 bg-purple-50 text-purple-600 rounded-lg font-mono break-all">{link.shortUrl}</code>
              <button onClick={copyToClipboard} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold whitespace-nowrap">{copied ? 'Copied!' : 'Copy'}</button>
            </div>
          </div>

          {/* Destination */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Destination URL</label>
            {isEditing ? (
              <input type="url" value={editDestination} onChange={(e) => setEditDestination(e.target.value)} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-600" />
            ) : (
              <a href={link.destination} target="_blank" rel="noopener noreferrer" className="block px-4 py-3 bg-gray-50 text-gray-600 rounded-lg break-all hover:text-purple-600">{link.destination}</a>
            )}
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Tags</label>
            {isEditing ? (
              <input type="text" value={editTags} onChange={(e) => setEditTags(e.target.value)} placeholder="Separate tags with commas" className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-600" />
            ) : (
              tags.length > 0 && <div className="flex flex-wrap gap-2">{tags.map((tag) => <span key={tag} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">{tag}</span>)}</div>
            )}
          </div>

          {/* Advanced Settings (Only in Edit Mode) */}
          {isEditing && (
            <div className="space-y-4 pt-4 border-t border-gray-200">
              <h3 className="font-bold text-gray-900">Advanced Settings</h3>

              {/* Active Toggle */}
              <div className="flex items-center gap-2">
                <input type="checkbox" id="active-toggle" checked={editActive} onChange={(e) => setEditActive(e.target.checked)} className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500" />
                <label htmlFor="active-toggle" className="text-gray-700 font-medium">Link Active</label>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Password Protection (Optional)</label>
                <input type="text" value={editPassword} onChange={(e) => setEditPassword(e.target.value)} placeholder="Set a password to protect this link" className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-600" />
              </div>

              {/* Expiration */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Expiration Date (Optional)</label>
                <input type="datetime-local" value={editExpiresAt} onChange={(e) => setEditExpiresAt(e.target.value)} className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-600" />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Notes (Internal Use)</label>
                <textarea value={editNotes} onChange={(e) => setEditNotes(e.target.value)} rows={3} placeholder="Add notes for your team..." className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-600" />
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-6 border-t border-gray-100">
            {isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  disabled={isSaving}
                  className="flex-1 px-4 py-3 border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 font-bold disabled:opacity-50 transition-all shadow-md shadow-purple-100"
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="px-4 py-3 border-2 border-red-100 text-red-600 rounded-xl hover:bg-red-50 font-bold disabled:opacity-50 transition-all"
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
                <div className="flex-1 flex gap-2">
                  <button
                    onClick={() => setShowQR(true)}
                    className="flex-1 px-4 py-3 border-2 border-purple-100 text-purple-600 rounded-xl hover:bg-purple-50 font-bold transition-all"
                  >
                    QR Code
                  </button>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 font-bold transition-all shadow-md shadow-purple-100"
                  >
                    Edit
                  </button>
                </div>
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

interface LinksDashboardProps {
  links?: Link[];
  loading?: boolean;
  onLinkSelect?: (link: Link) => void;
  onLinkDelete?: (linkId: string) => Promise<void>;
  onLinkUpdate?: () => Promise<void>;
  onCSVImport?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isImporting?: boolean;
}

export function LinksDashboard({ links = [], loading = false, onLinkSelect, onLinkDelete, onLinkUpdate, onCSVImport, isImporting = false }: LinksDashboardProps) {
  // const [links] = useState<Link[]>(dummyLinks); // Removed internal state
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'mostClicks' | 'leastClicks'>('newest');
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLink, setSelectedLink] = useState<Link | null>(null);

  // Filter and sort... (logic depends on 'links' prop now)


  const filteredAndSortedLinks = useMemo(() => {
    let filtered = links.filter((link) => {
      const query = searchQuery.toLowerCase();
      const linkTags = parseTags(link);
      return (
        link.shortCode.toLowerCase().includes(query) ||
        link.destination.toLowerCase().includes(query) ||
        linkTags.some((tag) => tag.toLowerCase().includes(query))
      );
    });

    // Sort
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'mostClicks':
          return b.clicks - a.clicks;
        case 'leastClicks':
          return a.clicks - b.clicks;
        default:
          return 0;
      }
    });

    return filtered;
  }, [links, searchQuery, sortBy]);

  const paginatedLinks = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedLinks.slice(start, start + itemsPerPage);
  }, [filteredAndSortedLinks, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredAndSortedLinks.length / itemsPerPage);

  if (loading) {
    return <div className="w-full text-center py-12 text-gray-500">Loading links...</div>;
  }

  return (
    <div className="w-full">
      {/* Link Details Modal */}
      {selectedLink && (
        <LinkDetailsModal
          link={selectedLink}
          onClose={() => setSelectedLink(null)}
          onDelete={onLinkDelete}
          onUpdate={onLinkUpdate}
        />
      )}

      {/* Filters & Sorting */}
      <div className="mb-6 flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
        <div className="flex flex-col sm:flex-row flex-1 gap-3 w-full lg:w-auto">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search links..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-4 pr-10 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 transition-all text-sm"
            />
            <div className="absolute right-3 top-3 text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
          </div>

          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="flex-1 sm:flex-none px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 bg-white text-sm font-medium"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="mostClicks">Most Clicks</option>
              <option value="leastClicks">Least Clicks</option>
            </select>

            <label
              htmlFor="csv-upload"
              className={`flex-1 sm:flex-none px-4 py-2.5 bg-white border-2 border-purple-600 text-purple-600 rounded-xl hover:bg-purple-50 font-bold text-sm cursor-pointer shadow-sm transition-all flex items-center justify-center gap-2 ${isImporting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12" /></svg>
              <span className="hidden sm:inline">{isImporting ? 'Importing...' : 'Import CSV'}</span>
              <span className="sm:hidden">Import</span>
              <input
                id="csv-upload"
                type="file"
                accept=".csv"
                onChange={onCSVImport}
                disabled={isImporting}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>


      {/* Links Table - Desktop */}
      <div className="hidden md:block bg-white rounded-lg border-2 border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b-2 border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Short URL</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Destination</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Clicks</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Tags</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Created</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedLinks.map((link) => {
              const linkTags = parseTags(link);
              return (
                <tr key={link.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-3">
                    <code className="text-purple-600 font-mono text-sm">{link.shortUrl}</code>
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-600 max-w-md truncate" title={link.destination}>
                    {link.destination}
                  </td>
                  <td className="px-6 py-3 font-semibold">{link.clicks}</td>
                  <td className="px-6 py-3">
                    <div className="flex flex-wrap gap-1">
                      {link.campaign && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-bold flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg>
                          {link.campaign.name}
                        </span>
                      )}
                      {linkTags.slice(0, 2).map((tag) => (
                        <span key={tag} className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">
                          {tag}
                        </span>
                      ))}
                      {linkTags.length > 2 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                          +{linkTags.length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-600">
                    {new Date(link.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedLink(link);
                          onLinkSelect?.(link);
                        }}
                        className="text-purple-600 hover:text-purple-700 font-semibold text-sm"
                      >
                        View
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedLink(link);
                        }}
                        className="text-gray-500 hover:text-purple-600 font-semibold text-sm"
                        title="Generate QR Code"
                      >
                        QR
                      </button>
                      <button
                        onClick={async (e) => {
                          e.stopPropagation();
                          if (!confirm('Clone this link?')) return;
                          try {
                            const res = await fetch('/api/links', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                destination: link.destination,
                                tags: linkTags,
                                // Clone behavior: new random code
                              })
                            });
                            if (res.ok) {
                              onLinkUpdate?.();
                            } else {
                              alert('Failed to clone');
                            }
                          } catch (err) {
                            console.error(err);
                            alert('Error cloning link');
                          }
                        }}
                        className="text-gray-500 hover:text-purple-600 font-semibold text-sm"
                      >
                        Clone
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Links Cards - Mobile */}
      <div className="md:hidden space-y-4">
        {paginatedLinks.map((link) => {
          const linkTags = parseTags(link);
          return (
            <div
              key={link.id}
              className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm cursor-pointer hover:border-purple-400 active:bg-gray-50 transition-all"
              onClick={() => {
                setSelectedLink(link);
                onLinkSelect?.(link);
              }}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" /></svg>
                  </div>
                  <span className="font-bold text-gray-900 text-sm">{link.shortCode}</span>
                </div>
                <span className="text-xs font-mono text-gray-400">{new Date(link.createdAt).toLocaleDateString()}</span>
              </div>

              <div className="mb-4 pl-1">
                <p className="text-xs text-purple-600 font-mono mb-1 break-all">{link.shortUrl}</p>
                <p className="text-sm text-gray-600 truncate" title={link.destination}>{link.destination}</p>
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                <div className="flex items-center gap-1.5 text-gray-700">
                  <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  <span className="font-bold text-sm">{link.clicks}</span>
                </div>

                {(link.campaign || linkTags.length > 0) && (
                  <div className="flex flex-wrap gap-1">
                    {link.campaign && (
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[10px] font-bold uppercase tracking-wide flex items-center gap-1">
                        <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg>
                        {link.campaign.name}
                      </span>
                    )}
                    {linkTags.slice(0, 2).map((tag) => (
                      <span key={tag} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px] font-medium uppercase tracking-wide">
                        {tag}
                      </span>
                    ))}
                    {linkTags.length > 2 && (
                      <span className="px-2 py-0.5 bg-gray-50 text-gray-400 rounded text-[10px] uppercase tracking-wide">+{linkTags.length - 2}</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-6 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mr-2">Show:</span>
            {[25, 50, 100].map((size) => (
              <button
                key={size}
                onClick={() => {
                  setItemsPerPage(size);
                  setCurrentPage(1);
                }}
                className={`w-10 h-10 rounded-lg font-bold text-sm transition-all ${itemsPerPage === size
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
              >
                {size}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2.5 bg-gray-50 rounded-lg text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
              title="Previous Page"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>

            <div className="flex items-center gap-2 px-4 py-2 bg-purple-50 rounded-lg">
              <span className="text-sm font-bold text-purple-600">
                {currentPage}
              </span>
              <span className="text-sm text-purple-300">/</span>
              <span className="text-sm font-bold text-purple-400">
                {totalPages}
              </span>
            </div>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2.5 bg-gray-50 rounded-lg text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
              title="Next Page"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
