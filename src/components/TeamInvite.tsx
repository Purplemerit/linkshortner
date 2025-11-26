'use client';

import { useState } from 'react';
import { dummyTeamMembers, TeamMember } from '@/lib/dummy-data';
import { TeamInviteModal } from './TeamInviteModal';

export function TeamInvite() {
  const [members, setMembers] = useState<TeamMember[]>(dummyTeamMembers);
  const [showInviteModal, setShowInviteModal] = useState(false);

  const handleRemoveMember = async (memberId: string) => {
    if (confirm('Are you sure you want to remove this team member?')) {
      try {
        const response = await fetch(`/api/team/members/${memberId}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          setMembers(members.filter((m) => m.id !== memberId));
        }
      } catch (err) {
        alert('Failed to remove member');
      }
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'owner':
        return 'bg-purple-600 text-white';
      case 'admin':
        return 'bg-blue-600 text-white';
      case 'editor':
        return 'bg-gray-600 text-white';
      case 'viewer':
        return 'bg-gray-200 text-gray-700';
      default:
        return 'bg-gray-200 text-gray-700';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Team Members</h2>
        <button
          onClick={() => setShowInviteModal(true)}
          className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold"
        >
          Invite Member
        </button>
      </div>

      <p className="text-gray-600 mb-6">Total members: {members.length}</p>

      {/* Members Table - Desktop */}
      <div className="hidden md:block bg-white rounded-lg border-2 border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b-2 border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold">Email</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Role</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Joined</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-6 py-3">{member.email}</td>
                <td className="px-6 py-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getRoleBadgeColor(member.role)}`}>
                    {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-3 text-sm text-gray-600">
                  {new Date(member.joinedAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-3">
                  {member.role !== 'owner' && (
                    <button
                      onClick={() => handleRemoveMember(member.id)}
                      className="text-red-600 hover:text-red-700 font-semibold text-sm"
                    >
                      Remove
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Members Cards - Mobile */}
      <div className="md:hidden space-y-4">
        {members.map((member) => (
          <div key={member.id} className="bg-white p-4 rounded-lg border-2 border-gray-200">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-semibold">{member.email}</p>
                <p className="text-sm text-gray-600">
                  Joined {new Date(member.joinedAt).toLocaleDateString()}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRoleBadgeColor(member.role)}`}>
                {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
              </span>
            </div>
            {member.role !== 'owner' && (
              <button
                onClick={() => handleRemoveMember(member.id)}
                className="text-red-600 hover:text-red-700 font-semibold text-sm"
              >
                Remove
              </button>
            )}
          </div>
        ))}
      </div>

      {showInviteModal && (
        <TeamInviteModal
          onClose={() => setShowInviteModal(false)}
          onInvite={(email, role) => {
            const newMember: TeamMember = {
              id: Date.now().toString(),
              email,
              role: role as TeamMember['role'],
              joinedAt: new Date().toISOString().split('T')[0],
            };
            setMembers([...members, newMember]);
            setShowInviteModal(false);
          }}
        />
      )}
    </div>
  );
}

