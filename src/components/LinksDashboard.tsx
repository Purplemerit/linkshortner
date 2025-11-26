'use client';

import { useState, useMemo } from 'react';
import { Link } from '@/lib/dummy-data';
import { dummyLinks } from '@/lib/dummy-data';

export function LinksDashboard() {
  const [links] = useState<Link[]>(dummyLinks);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'mostClicks' | 'leastClicks'>('newest');
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredAndSortedLinks = useMemo(() => {
    let filtered = links.filter((link) => {
      const query = searchQuery.toLowerCase();
      return (
        link.shortCode.toLowerCase().includes(query) ||
        link.destination.toLowerCase().includes(query) ||
        link.tags.some((tag) => tag.toLowerCase().includes(query))
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

  return (
    <div className="w-full">
      {/* Filters & Sorting */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Search links by code, destination, or tags..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-600"
        />
        
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-600"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="mostClicks">Most Clicks</option>
          <option value="leastClicks">Least Clicks</option>
        </select>
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
            {paginatedLinks.map((link) => (
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
                    {link.tags.slice(0, 2).map((tag) => (
                      <span key={tag} className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">
                        {tag}
                      </span>
                    ))}
                    {link.tags.length > 2 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                        +{link.tags.length - 2}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-3 text-sm text-gray-600">
                  {new Date(link.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-3">
                  <button className="text-purple-600 hover:text-purple-700 font-semibold text-sm">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Links Cards - Mobile */}
      <div className="md:hidden space-y-4">
        {paginatedLinks.map((link) => (
          <div key={link.id} className="bg-white p-4 rounded-lg border-2 border-gray-200">
            <div className="mb-2">
              <code className="text-purple-600 font-mono text-sm break-all">{link.shortUrl}</code>
            </div>
            <p className="text-sm text-gray-600 mb-2 truncate">{link.destination}</p>
            <div className="flex justify-between items-center">
              <span className="font-semibold">{link.clicks} clicks</span>
              <span className="text-xs text-gray-500">
                {new Date(link.createdAt).toLocaleDateString()}
              </span>
            </div>
            {link.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {link.tags.map((tag) => (
                  <span key={tag} className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex gap-2">
            <button
              onClick={() => setItemsPerPage(25)}
              className={`px-4 py-2 rounded-lg font-semibold ${
                itemsPerPage === 25
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
              }`}
            >
              25
            </button>
            <button
              onClick={() => setItemsPerPage(50)}
              className={`px-4 py-2 rounded-lg font-semibold ${
                itemsPerPage === 50
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
              }`}
            >
              50
            </button>
            <button
              onClick={() => setItemsPerPage(100)}
              className={`px-4 py-2 rounded-lg font-semibold ${
                itemsPerPage === 100
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
              }`}
            >
              100
            </button>
          </div>
          <div className="flex gap-2 items-center">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="px-4 py-2">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

