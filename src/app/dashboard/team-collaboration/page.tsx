'use client';

import { useState, useEffect } from 'react';
// import { Navbar } from '@/components/Navbar'; // Removed duplicate navbar

interface Team {
  id: string;
  name: string;
  slug: string;
  description?: string;
  members: TeamMember[];
  workspaces: Workspace[];
  createdAt: string;
}

interface TeamMember {
  id: string;
  user?: { id: string; email: string; name?: string } | null;
  role: string;
  status: string;
  joinedAt: string;
  invitedEmail?: string | null;
}

interface Workspace {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

import { useSubscription } from '@/hooks/useSubscription';

export default function TeamCollaborationPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamSlug, setNewTeamSlug] = useState('');
  const [activeTab, setActiveTab] = useState<'teams' | 'workspaces'>('teams');
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [modalType, setModalType] = useState<'manage' | 'settings' | null>(null);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('member');
  const [isInviting, setIsInviting] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const [newWorkspaceSlug, setNewWorkspaceSlug] = useState('');
  const [selectedWorkspaceTeam, setSelectedWorkspaceTeam] = useState('');

  const { plan, loading: planLoading } = useSubscription();

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const res = await fetch('/api/teams');
      if (res.ok) {
        const data = await res.json();
        setTeams(data);
      }
    } catch (error) {
      console.error('Error fetching teams:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async () => {
    if (!selectedTeam || !inviteEmail) return;
    setIsInviting(true);
    try {
      const res = await fetch(`/api/teams/${selectedTeam.id}/invite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: inviteEmail, role: inviteRole })
      });
      const data = await res.json();
      if (res.ok) {
        if (data.inviteLink) {
          prompt("Invitation Created! (Dev Mode: SMTP missing). Copy this link:", data.inviteLink);
        } else {
          alert('Invitation sent!');
        }
        setInviteEmail('');
        fetchTeams();
      } else {
        alert(data.error || 'Failed to invite');
      }
    } catch (e) {
      console.error(e);
      alert('Error inviting user');
    } finally {
      setIsInviting(false);
    }
  };

  const handleCreateWorkspace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWorkspaceName || !newWorkspaceSlug) return;
    try {
      const res = await fetch('/api/workspaces', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newWorkspaceName,
          slug: newWorkspaceSlug,
          teamId: selectedWorkspaceTeam || undefined
        })
      });
      if (res.ok) {
        setNewWorkspaceName('');
        setNewWorkspaceSlug('');
        alert('Workspace created!');
        fetchTeams();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to create workspace');
      }
    } catch (e) {
      console.error(e);
      alert('Error creating workspace');
    }
  };

  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(null);
  const [workspaceModalType, setWorkspaceModalType] = useState<'manage' | 'settings' | 'create-link' | 'analytics' | null>(null);
  const [workspaceLinks, setWorkspaceLinks] = useState<any[]>([]);

  // State for creating links in workspace
  const [newLinkUrl, setNewLinkUrl] = useState('');
  const [newLinkCode, setNewLinkCode] = useState('');
  const [isCreatingLink, setIsCreatingLink] = useState(false);
  const [createLinkError, setCreateLinkError] = useState('');
  const [createLinkSuccess, setCreateLinkSuccess] = useState('');


  const handleOpenWorkspace = async (workspace: Workspace) => {
    setSelectedWorkspace(workspace);
    setWorkspaceModalType('manage');
    // Fetch links
    try {
      const res = await fetch(`/api/workspaces/${workspace.id}/links`);
      if (res.ok) {
        const links = await res.json();
        setWorkspaceLinks(links);
      }
    } catch (e) {
      console.error('Error fetching workspace links:', e);
    }
  };

  const handleCreateLinkInWorkspace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWorkspace || !newLinkUrl) return;

    setIsCreatingLink(true);
    setCreateLinkError('');
    setCreateLinkSuccess('');

    try {
      const response = await fetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination: newLinkUrl,
          customCode: newLinkCode || undefined,
          workspaceId: selectedWorkspace.id,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to create link');
      }

      const newLink = await response.json();
      setCreateLinkSuccess(`Link created: ${newLink.shortUrl}`);
      setNewLinkUrl('');
      setNewLinkCode('');

      // Refresh workspace links
      const res = await fetch(`/api/workspaces/${selectedWorkspace.id}/links`);
      if (res.ok) {
        const links = await res.json();
        setWorkspaceLinks(links);
      }

      // Auto-switch back to manage view after 2 seconds
      setTimeout(() => {
        setWorkspaceModalType('manage');
        setCreateLinkSuccess('');
      }, 2000);
    } catch (error) {
      setCreateLinkError((error as Error).message);
    } finally {
      setIsCreatingLink(false);
    }
  };

  const handleUpdateWorkspace = async () => {
    if (!selectedWorkspace) return;
    try {
      const res = await fetch(`/api/workspaces/${selectedWorkspace.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: selectedWorkspace.name })
      });
      if (res.ok) {
        alert('Workspace updated');
        setWorkspaceModalType('manage'); // Go back to manage view
        fetchTeams();
      } else {
        alert('Failed to update workspace');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteWorkspace = async (workspaceId: string) => {
    if (!confirm('Are you sure? All links in this workspace will be deleted!')) return;
    try {
      const res = await fetch(`/api/workspaces/${workspaceId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        alert('Workspace deleted');
        setWorkspaceModalType(null);
        setSelectedWorkspace(null);
        fetchTeams();
      } else {
        alert('Failed to delete workspace');
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (planLoading) return <div className="p-8 text-center">Loading subscription...</div>;

  if (plan && plan.name === 'FREE') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Team & Collaboration</h1>
        <p className="text-gray-600 mb-8">Manage your teams, members, workspaces, and activity logs</p>

        <div className="bg-gradient-to-br from-purple-50 to-white border-2 border-purple-100 rounded-2xl p-8 text-center max-w-2xl mx-auto">
          <div className="text-5xl mb-4">👥</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Upgrade for Team Features</h2>
          <p className="text-gray-600 mb-8 text-lg">
            Team collaboration and workspaces are available on Starter (3 members) and Professional (10+ members) plans.
          </p>
          <a href="/pricing" className="inline-block px-8 py-4 bg-purple-600 text-white rounded-xl hover:bg-purple-700 font-bold transition-transform hover:scale-105 shadow-lg shadow-purple-200">
            View Upgrade Options
          </a>
        </div>
      </div>
    );
  }

  // ... rest of logic for handleCreateTeam ...

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName || !newTeamSlug) return;

    try {
      const res = await fetch('/api/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newTeamName,
          slug: newTeamSlug
        })
      });

      if (res.ok) {
        setNewTeamName('');
        setNewTeamSlug('');
        await fetchTeams();
      }
    } catch (error) {
      console.error('Error creating team:', error);
    }
  };



  // ... fetchTeams and other existing code ...

  const handleUpdateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeam) return;

    try {
      const res = await fetch(`/api/teams/${selectedTeam.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: selectedTeam.name })
      });

      if (res.ok) {
        alert(`Updated team: ${selectedTeam.name}`);
        setModalType(null);
        setSelectedTeam(null);
        fetchTeams();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to update team');
      }
    } catch (e) {
      console.error(e);
      alert('Error updating team');
    }
  };



  return (
    <main className="bg-gray-50 min-h-screen relative">
      {selectedWorkspace && workspaceModalType && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full p-6 animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                {workspaceModalType === 'manage' ? `Workspace: ${selectedWorkspace.name}` :
                  workspaceModalType === 'create-link' ? 'Create Link in Workspace' :
                    workspaceModalType === 'analytics' ? 'Workspace Analytics' :
                      'Workspace Settings'}
              </h3>
              <button
                onClick={() => { setWorkspaceModalType(null); setSelectedWorkspace(null); setWorkspaceLinks([]); setNewLinkUrl(''); setNewLinkCode(''); }}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {workspaceModalType === 'manage' ? (
              <div className="flex-1 overflow-y-auto">
                {/* Header Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="text-sm text-purple-600 font-semibold">Total Links</p>
                    <p className="text-2xl font-bold text-gray-900">{workspaceLinks.length}</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-600 font-semibold">Total Clicks</p>
                    <p className="text-2xl font-bold text-gray-900">{workspaceLinks.reduce((sum: number, l: any) => sum + (l.clicks || 0), 0)}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-green-600 font-semibold">Slug</p>
                    <p className="text-lg font-mono font-bold text-gray-900">/{selectedWorkspace.slug}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2 mb-6">
                  <button
                    onClick={() => setWorkspaceModalType('create-link')}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold text-sm flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    Create Link
                  </button>
                  <button
                    onClick={() => setWorkspaceModalType('analytics')}
                    className="px-4 py-2 border border-purple-200 text-purple-600 rounded-lg hover:bg-purple-50 font-semibold text-sm flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                    View Analytics
                  </button>
                  <button
                    onClick={() => setWorkspaceModalType('settings')}
                    className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 font-semibold text-sm flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    Settings
                  </button>
                </div>

                <h4 className="font-bold text-gray-900 mb-3">Links in this Workspace</h4>
                {workspaceLinks.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                    <div className="text-4xl mb-3">🔗</div>
                    <p className="mb-4">No links yet in this workspace.</p>
                    <button
                      onClick={() => setWorkspaceModalType('create-link')}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold text-sm"
                    >
                      Create Your First Link
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {workspaceLinks.map((link: any) => (
                      <div key={link.id} className="border border-gray-200 p-4 rounded-lg hover:bg-gray-50 flex justify-between items-center">
                        <div className="overflow-hidden flex-1">
                          <p className="text-purple-600 font-mono font-semibold truncate">{link.shortUrl}</p>
                          <p className="text-xs text-gray-500 truncate">{link.destination}</p>
                        </div>
                        <div className="flex items-center gap-3 ml-4">
                          <span className="text-sm font-semibold text-gray-700 bg-gray-100 px-3 py-1 rounded-full">
                            {link.clicks} clicks
                          </span>
                          <button
                            onClick={() => {
                              // Navigate to analytics for this specific link
                              window.location.href = `/dashboard?tab=analytics&linkId=${link.id}`;
                            }}
                            className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg"
                            title="View Analytics"
                          >
                            📊
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : workspaceModalType === 'create-link' ? (
              <div className="space-y-6">
                <form onSubmit={handleCreateLinkInWorkspace} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Destination URL</label>
                    <input
                      type="url"
                      value={newLinkUrl}
                      onChange={e => setNewLinkUrl(e.target.value)}
                      placeholder="https://example.com/your-long-url"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Custom Code (Optional)</label>
                    <input
                      type="text"
                      value={newLinkCode}
                      onChange={e => setNewLinkCode(e.target.value.toLowerCase())}
                      placeholder="my-custom-link"
                      pattern="[a-z0-9-]+"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">Lowercase letters, numbers, and hyphens only.</p>
                  </div>

                  {createLinkError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
                      {createLinkError}
                    </div>
                  )}
                  {createLinkSuccess && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-800">
                      {createLinkSuccess}
                    </div>
                  )}

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => { setWorkspaceModalType('manage'); setNewLinkUrl(''); setNewLinkCode(''); setCreateLinkError(''); setCreateLinkSuccess(''); }}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isCreatingLink || !newLinkUrl}
                      className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold disabled:bg-gray-400"
                    >
                      {isCreatingLink ? 'Creating...' : 'Create Link'}
                    </button>
                  </div>
                </form>
              </div>
            ) : workspaceModalType === 'analytics' ? (
              <div className="flex-1 overflow-y-auto">
                <div className="mb-6">
                  <h4 className="font-bold text-gray-900 mb-4">Analytics Summary for {selectedWorkspace.name}</h4>
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-purple-50 p-4 rounded-lg text-center">
                      <p className="text-3xl font-bold text-purple-700">{workspaceLinks.length}</p>
                      <p className="text-sm text-purple-600">Total Links</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg text-center">
                      <p className="text-3xl font-bold text-blue-700">{workspaceLinks.reduce((sum: number, l: any) => sum + (l.clicks || 0), 0)}</p>
                      <p className="text-sm text-blue-600">Total Clicks</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg text-center">
                      <p className="text-3xl font-bold text-green-700">
                        {workspaceLinks.length > 0 ? Math.round(workspaceLinks.reduce((sum: number, l: any) => sum + (l.clicks || 0), 0) / workspaceLinks.length) : 0}
                      </p>
                      <p className="text-sm text-green-600">Avg. Clicks/Link</p>
                    </div>
                  </div>
                </div>

                {workspaceLinks.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                    No analytics data yet. Create some links first.
                  </div>
                ) : (
                  <div>
                    <h5 className="font-semibold text-gray-900 mb-3">Link Performance</h5>
                    <div className="space-y-2">
                      {workspaceLinks
                        .sort((a: any, b: any) => (b.clicks || 0) - (a.clicks || 0))
                        .map((link: any) => (
                          <div key={link.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <div className="flex-1 overflow-hidden">
                              <p className="font-mono text-sm text-purple-600 truncate">{link.shortCode}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-32 bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-purple-600 h-2 rounded-full"
                                  style={{
                                    width: `${Math.min(100, (link.clicks || 0) / Math.max(1, Math.max(...workspaceLinks.map((l: any) => l.clicks || 0))) * 100)}%`
                                  }}
                                />
                              </div>
                              <span className="text-sm font-semibold text-gray-700 w-16 text-right">{link.clicks} clicks</span>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                <div className="mt-6 pt-4 border-t">
                  <button
                    onClick={() => setWorkspaceModalType('manage')}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
                  >
                    ← Back to Workspace
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Workspace Name</label>
                  <input
                    type="text"
                    value={selectedWorkspace.name}
                    onChange={e => setSelectedWorkspace({ ...selectedWorkspace, name: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Slug (Read-only)</label>
                  <input
                    type="text"
                    value={selectedWorkspace.slug}
                    readOnly
                    className="w-full px-3 py-2 border rounded-lg bg-gray-50 text-gray-500"
                  />
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    onClick={() => handleDeleteWorkspace(selectedWorkspace.id)}
                    className="px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50"
                  >
                    Delete Workspace
                  </button>
                  <div className="flex-1"></div>
                  <button onClick={() => setWorkspaceModalType('manage')} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Cancel</button>
                  <button onClick={handleUpdateWorkspace} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">Save Changes</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {selectedTeam && modalType && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          {/* ... existing Team Modal content ... */}
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                {modalType === 'manage' ? 'Manage Team Members' : 'Team Settings'}
              </h3>
              <button
                onClick={() => { setModalType(null); setSelectedTeam(null); }}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            {modalType === 'manage' ? (
              <div className="space-y-4">
                <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 flex flex-col gap-4">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1">
                      <label className="block text-xs font-bold text-purple-700 uppercase mb-1">Email Address</label>
                      <input
                        type="email"
                        placeholder="colleague@example.com"
                        value={inviteEmail}
                        onChange={e => setInviteEmail(e.target.value)}
                        className="w-full px-3 py-2 text-sm border-2 border-purple-200 rounded-lg focus:outline-none focus:border-purple-500 bg-white shadow-sm"
                      />
                    </div>
                    <div className="sm:w-32">
                      <label className="block text-xs font-bold text-purple-700 uppercase mb-1">Role</label>
                      <select
                        value={inviteRole}
                        onChange={e => setInviteRole(e.target.value)}
                        className="w-full px-3 py-2 text-sm border-2 border-purple-200 rounded-lg focus:outline-none focus:border-purple-500 bg-white shadow-sm"
                      >
                        <option value="member">Member</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                  </div>
                  <button
                    onClick={handleInvite}
                    disabled={isInviting || !inviteEmail}
                    className="w-full py-2 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
                  >
                    {isInviting ? (
                      <><div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div> Sending...</>
                    ) : (
                      'Send Invitation'
                    )}
                  </button>
                </div>
                <div className="max-h-60 overflow-y-auto space-y-2">
                  {selectedTeam.members.map(member => (
                    <div key={member.id} className="flex justify-between items-center bg-gray-50/50 p-3 rounded-lg group">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${member.status === 'invited' ? 'bg-gray-200 text-gray-500' : 'bg-purple-100 text-purple-600'}`}>
                          {((member as any).user?.email || (member as any).invitedEmail || '?')[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800 text-sm">
                            {(member as any).user?.email || (member as any).invitedEmail || 'Unknown'}
                          </p>
                          <p className="text-[10px] text-gray-400">
                            {member.status === 'invited' ? 'Waiting for sign up...' : `Joined ${new Date(member.joinedAt).toLocaleDateString()}`}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {member.status === 'invited' && (
                          <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full text-[10px] font-bold uppercase tracking-wider animate-pulse">
                            Pending
                          </span>
                        )}
                        <span className={`px-2 py-0.5 text-[10px] rounded-full uppercase font-bold tracking-wider
                            ${member.role === 'owner' ? 'bg-purple-600 text-white' : 'bg-blue-100 text-blue-700'}`}>
                          {member.role}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <form onSubmit={handleUpdateTeam} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Team Name</label>
                  <input
                    type="text"
                    value={selectedTeam.name}
                    onChange={e => setSelectedTeam({ ...selectedTeam, name: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Team Slug</label>
                  <input
                    type="text"
                    value={selectedTeam.slug}
                    onChange={e => setSelectedTeam({ ...selectedTeam, slug: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 bg-gray-50"
                    readOnly
                  />
                  <p className="text-xs text-gray-500 mt-1">Slug cannot be changed once created.</p>
                </div>
                <div className="pt-4 flex gap-3">
                  <button type="button" onClick={() => { setModalType(null); setSelectedTeam(null); }} className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50">Cancel</button>
                  <button type="submit" className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">Save Changes</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Team & Collaboration</h1>
          <p className="text-gray-600">Manage your teams, members, and workspaces</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('teams')}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${activeTab === 'teams'
              ? 'border-purple-600 text-purple-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
          >
            👥 Teams
          </button>
          <button
            onClick={() => setActiveTab('workspaces')}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${activeTab === 'workspaces'
              ? 'border-purple-600 text-purple-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
          >
            📁 Workspaces
          </button>

        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        ) : activeTab === 'teams' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Create Team */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4">Create Team</h2>
                <form onSubmit={handleCreateTeam} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Team Name
                    </label>
                    <input
                      type="text"
                      value={newTeamName}
                      onChange={(e) => setNewTeamName(e.target.value)}
                      placeholder="My Team"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Team Slug
                    </label>
                    <input
                      type="text"
                      value={newTeamSlug}
                      onChange={(e) => setNewTeamSlug(e.target.value.toLowerCase())}
                      placeholder="my-team"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-purple-600 text-white font-medium py-2 rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Create Team
                  </button>
                </form>
              </div>
            </div>

            {/* Teams List */}
            <div className="lg:col-span-2 space-y-4">
              {teams.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                  <p className="text-gray-600 mb-4">No teams yet</p>
                  <p className="text-sm text-gray-500">Create your first team to get started</p>
                </div>
              ) : (
                teams.map((team) => (
                  <div key={team.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{team.name}</h3>
                        <p className="text-sm text-gray-600">@{team.slug}</p>
                      </div>
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                        {team.members.length} members
                      </span>
                    </div>

                    {team.description && (
                      <p className="text-gray-600 mb-4">{team.description}</p>
                    )}

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-gray-50 rounded p-3">
                        <p className="text-xs text-gray-600 font-medium">Members</p>
                        <p className="text-xl font-bold text-gray-900">{team.members.length}</p>
                      </div>
                      <div className="bg-gray-50 rounded p-3">
                        <p className="text-xs text-gray-600 font-medium">Workspaces</p>
                        <p className="text-xl font-bold text-gray-900">{team.workspaces.length}</p>
                      </div>
                    </div>

                    {team.members.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">Team Members:</p>
                        <div className="space-y-1">
                          {team.members.slice(0, 3).map((member) => (
                            <div key={member.id} className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">
                                {member.user?.email || member.invitedEmail || 'Pending Member'}
                              </span>
                              <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium">
                                {member.role}
                              </span>
                            </div>
                          ))}
                          {team.members.length > 3 && (
                            <p className="text-sm text-gray-500 pt-2">
                              +{team.members.length - 3} more members
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <button
                        onClick={() => { setSelectedTeam(team); setModalType('manage'); }}
                        className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                      >
                        Manage
                      </button>
                      <button
                        onClick={() => { setSelectedTeam(team); setModalType('settings'); }}
                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                      >
                        Settings
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ) : activeTab === 'workspaces' ? (
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Create Workspace</h2>
              <form onSubmit={handleCreateWorkspace} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      value={newWorkspaceName}
                      onChange={e => setNewWorkspaceName(e.target.value)}
                      placeholder="Marketing"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                    <input
                      type="text"
                      value={newWorkspaceSlug}
                      onChange={e => setNewWorkspaceSlug(e.target.value.toLowerCase())}
                      placeholder="marketing"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Team (Optional)</label>
                    <select
                      value={selectedWorkspaceTeam}
                      onChange={e => setSelectedWorkspaceTeam(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">Select a Team</option>
                      {teams.map(t => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">Create Workspace</button>
              </form>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Your Workspaces</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {teams.flatMap(t => t.workspaces.map(w => ({ ...w, teamName: t.name }))).length === 0 ? (
                  <div className="col-span-full text-center py-8 text-gray-500">
                    <p>No workspaces yet.</p>
                    <p className="text-sm">Create one above to organize your links.</p>
                  </div>
                ) : (
                  teams.flatMap(t => t.workspaces.map(w => ({ ...w, teamName: t.name }))).map(w => (
                    <div
                      key={w.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow relative bg-white cursor-pointer group"
                      onClick={() => handleOpenWorkspace(w)}
                    >
                      <div className="absolute top-2 right-2 text-3xl opacity-10 group-hover:opacity-20 transition-opacity">📁</div>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-lg text-gray-900">{w.name}</h3>
                      </div>
                      <span className="block text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-1 rounded w-fit mb-2">Group: {w.teamName}</span>
                      <p className="text-sm text-gray-500 font-mono bg-gray-50 px-2 py-1 rounded inline-block">/{w.slug}</p>
                      <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
                        <span className="text-sm text-purple-600 font-medium group-hover:underline">Manage Workspace &rarr;</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </main>
  );
}
