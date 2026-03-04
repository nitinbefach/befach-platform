'use client';

import { useState, Suspense } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Modal } from '@/components/ui';
import { Users, Lock, ClipboardList } from 'lucide-react';
import { useUserMode } from '@/context/UserModeContext';
import { useMobile } from '@/hooks/useMobile';
import { useTour } from '@/hooks/useTour';
import { teamManagementTourSteps, mobileTeamManagementTourSteps } from '@/lib/tourSteps';
import TourFAB from '@/components/walkthrough/TourFAB';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  status: 'active' | 'pending';
  joinedDate: string;
  lastActive?: string;
  avatar?: string;
}

const mockTeamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'You (Owner)',
    email: 'admin@company.com',
    role: 'owner',
    status: 'active',
    joinedDate: 'Jan 15, 2024',
    lastActive: 'Just now'
  },
  {
    id: '2',
    name: 'Priya Sharma',
    email: 'priya@company.com',
    role: 'admin',
    status: 'active',
    joinedDate: 'Feb 20, 2024',
    lastActive: '2 hours ago'
  },
  {
    id: '3',
    name: 'Rahul Patel',
    email: 'rahul@company.com',
    role: 'member',
    status: 'active',
    joinedDate: 'Mar 10, 2024',
    lastActive: 'Yesterday'
  },
  {
    id: '4',
    name: 'Pending Invite',
    email: 'newmember@company.com',
    role: 'member',
    status: 'pending',
    joinedDate: 'Invited Nov 20, 2024'
  }
];

const roleDescriptions = {
  owner: 'Full access, billing management, can delete organization',
  admin: 'Full access, can manage team members',
  member: 'Can create orders, view reports, manage suppliers',
  viewer: 'Read-only access to dashboard and reports'
};

const roleColors = {
  owner: '#dc2626',
  admin: '#7c3aed',
  member: '#2563eb',
  viewer: '#6b7280'
};

function TeamManagementContent() {
  const { isMobile } = useMobile();
  const tourSteps = isMobile ? mobileTeamManagementTourSteps : teamManagementTourSteps;
  const { startTour, isActive: tourActive } = useTour({ tourId: 'team-management', steps: tourSteps });
  const { subscription, organization } = useUserMode();
  const [members, setMembers] = useState(mockTeamMembers);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<TeamMember['role']>('member');

  const activeMembers = members.filter(m => m.status === 'active').length;
  const maxSeats = subscription?.seats || 5;

  const handleInvite = () => {
    if (!inviteEmail) return;
    
    const newMember: TeamMember = {
      id: Date.now().toString(),
      name: 'Pending Invite',
      email: inviteEmail,
      role: inviteRole,
      status: 'pending',
      joinedDate: `Invited ${new Date().toLocaleDateString()}`
    };
    
    setMembers([...members, newMember]);
    setInviteEmail('');
    setInviteRole('member');
    setShowInviteModal(false);
  };

  const handleRoleChange = () => {
    if (!selectedMember) return;
    // Role change logic here
    setShowRoleModal(false);
    setSelectedMember(null);
  };

  const handleRemoveMember = (id: string) => {
    if (confirm('Are you sure you want to remove this team member?')) {
      setMembers(members.filter(m => m.id !== id));
    }
  };

  const resendInvite = (email: string) => {
    alert(`Invitation resent to ${email}`);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <AppLayout>      <div className="content-header">
        <div>
          <h1><Users size={20} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8 }} /> Team Management</h1>
          <p>Manage your team members and their access levels</p>        </div>
        <button 
          className="btn-primary"
          onClick={() => setShowInviteModal(true)}
          disabled={activeMembers >= maxSeats}
        >
          + Invite Member
        </button>
      </div>

      {/* Seats Usage */}
      <div id="team-seats" className="seats-card">
        <div className="seats-info">
          <h3>Team Seats</h3>
          <p className="seats-count">
            <span className="current">{activeMembers}</span>
            <span className="separator">/</span>
            <span className="max">{maxSeats}</span>
            <span className="label">seats used</span>
          </p>
        </div>
        <div className="seats-bar">
          <div 
            className="seats-fill" 
            style={{ width: `${(activeMembers / maxSeats) * 100}%` }}
          />
        </div>
        {activeMembers >= maxSeats && (
          <p className="seats-warning">
            <Lock size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} /> You&apos;ve reached your seat limit. Upgrade your plan to add more members.
          </p>
        )}
      </div>

      {/* Team Members List */}
      <div id="team-members" className="team-list">
        <h2>Team Members</h2>
        <div className="members-grid">
          {members.map(member => (
            <div key={member.id} className={`member-card ${member.status}`}>
              <div className="member-avatar">
                {member.avatar ? (
                  <img src={member.avatar} alt={member.name} />
                ) : (
                  <span>{getInitials(member.name)}</span>
                )}
                {member.status === 'active' && (
                  <span className="online-dot" />
                )}
              </div>
              
              <div className="member-info">
                <h4>{member.name}</h4>
                <p className="member-email">{member.email}</p>
                <div className="member-meta">
                  <span 
                    className="role-badge"
                    style={{ background: roleColors[member.role] }}
                  >
                    {member.role}
                  </span>
                  <span className="joined">{member.joinedDate}</span>
                </div>
                {member.lastActive && (
                  <p className="last-active">Last active: {member.lastActive}</p>
                )}
              </div>

              {member.role !== 'owner' && (
                <div className="member-actions">
                  {member.status === 'pending' ? (
                    <>
                      <button 
                        className="action-btn"
                        onClick={() => resendInvite(member.email)}
                      >
                        Resend
                      </button>
                      <button 
                        className="action-btn danger"
                        onClick={() => handleRemoveMember(member.id)}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button 
                        className="action-btn"
                        onClick={() => {
                          setSelectedMember(member);
                          setShowRoleModal(true);
                        }}
                      >
                        Change Role
                      </button>
                      <button 
                        className="action-btn danger"
                        onClick={() => handleRemoveMember(member.id)}
                      >
                        Remove
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Roles Guide */}
      <div id="team-roles" className="roles-guide">
        <h2><ClipboardList size={18} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8 }} /> Roles & Permissions</h2>
        <div className="roles-grid">
          {(Object.keys(roleDescriptions) as TeamMember['role'][]).map(role => (
            <div key={role} className="role-card">
              <div className="role-header">
                <span 
                  className="role-indicator"
                  style={{ background: roleColors[role] }}
                />
                <h4>{role.charAt(0).toUpperCase() + role.slice(1)}</h4>
              </div>
              <p>{roleDescriptions[role]}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Invite Modal */}
      <Modal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        title="Invite Team Member"
      >
        <div className="form-group">
          <label>Email Address</label>
          <input 
            type="email"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            placeholder="colleague@company.com"
          />
        </div>
        <div className="form-group">
          <label>Role</label>
          <select 
            value={inviteRole}
            onChange={(e) => setInviteRole(e.target.value as TeamMember['role'])}
          >
            <option value="admin">Admin</option>
            <option value="member">Member</option>
            <option value="viewer">Viewer</option>
          </select>
          <span className="form-hint">{roleDescriptions[inviteRole]}</span>
        </div>
        <div className="modal-actions">
          <button className="btn-cancel" onClick={() => setShowInviteModal(false)}>
            Cancel
          </button>
          <button className="btn-submit" onClick={handleInvite} disabled={!inviteEmail}>
            Send Invitation
          </button>
        </div>
      </Modal>

      {/* Change Role Modal */}
      <Modal
        isOpen={showRoleModal}
        onClose={() => setShowRoleModal(false)}
        title={`Change Role for ${selectedMember?.name}`}
      >
        <div className="form-group">
          <label>New Role</label>
          <select 
            value={selectedMember?.role}
            onChange={(e) => setSelectedMember(prev => 
              prev ? { ...prev, role: e.target.value as TeamMember['role'] } : null
            )}
          >
            <option value="admin">Admin</option>
            <option value="member">Member</option>
            <option value="viewer">Viewer</option>
          </select>
        </div>
        <div className="modal-actions">
          <button className="btn-cancel" onClick={() => setShowRoleModal(false)}>
            Cancel
          </button>
          <button className="btn-submit" onClick={handleRoleChange}>
            Update Role
          </button>
        </div>
      </Modal>

      <style jsx>{`
        .seats-card {
          background: var(--card-bg);
          border-radius: 12px;
          padding: 25px;
          margin-bottom: 30px;
        }
        .seats-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }
        .seats-info h3 {
          color: var(--text-primary);
          margin: 0;
        }
        .seats-count {
          display: flex;
          align-items: baseline;
          gap: 5px;
        }
        .seats-count .current {
          font-size: 2em;
          font-weight: 700;
          color: var(--accent-primary);
        }
        .seats-count .separator {
          color: var(--text-muted);
        }
        .seats-count .max {
          font-size: 1.5em;
          color: var(--text-secondary);
        }
        .seats-count .label {
          color: var(--text-muted);
          margin-left: 8px;
        }
        .seats-bar {
          height: 8px;
          background: var(--bg-tertiary);
          border-radius: 4px;
          overflow: hidden;
        }
        .seats-fill {
          height: 100%;
          background: var(--accent-gradient);
          border-radius: 4px;
          transition: width 0.3s;
        }
        .seats-warning {
          color: #f59e0b;
          font-size: 0.9em;
          margin: 15px 0 0 0;
        }
        .team-list h2 {
          color: var(--text-primary);
          margin-bottom: 20px;
        }
        .members-grid {
          display: grid;
          gap: 15px;
        }
        .member-card {
          display: flex;
          gap: 20px;
          background: var(--card-bg);
          border-radius: 12px;
          padding: 20px;
          align-items: center;
        }
        .member-card.pending {
          opacity: 0.7;
          border: 2px dashed var(--border-color);
        }
        .member-avatar {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: var(--accent-gradient);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 700;
          font-size: 1.2em;
          position: relative;
          flex-shrink: 0;
        }
        .member-avatar img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
        }
        .online-dot {
          position: absolute;
          bottom: 2px;
          right: 2px;
          width: 14px;
          height: 14px;
          background: #10b981;
          border: 3px solid var(--card-bg);
          border-radius: 50%;
        }
        .member-info {
          flex: 1;
        }
        .member-info h4 {
          color: var(--text-primary);
          margin-bottom: 4px;
        }
        .member-email {
          color: var(--text-secondary);
          font-size: 0.9em;
          margin: 0 0 8px 0;
        }
        .member-meta {
          display: flex;
          gap: 10px;
          align-items: center;
        }
        .role-badge {
          padding: 3px 10px;
          border-radius: 12px;
          font-size: 0.75em;
          color: white;
          font-weight: 600;
          text-transform: capitalize;
        }
        .joined {
          color: var(--text-muted);
          font-size: 0.85em;
        }
        .last-active {
          color: var(--text-muted);
          font-size: 0.8em;
          margin: 5px 0 0 0;
        }
        .member-actions {
          display: flex;
          gap: 10px;
        }
        .action-btn {
          background: var(--bg-tertiary);
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          color: var(--text-primary);
          cursor: pointer;
          font-size: 0.85em;
        }
        .action-btn:hover {
          background: var(--accent-primary);
          color: white;
        }
        .action-btn.danger:hover {
          background: #dc2626;
        }
        .roles-guide {
          background: var(--card-bg);
          border-radius: 12px;
          padding: 25px;
          margin-top: 30px;
        }
        .roles-guide h2 {
          color: var(--text-primary);
          margin-bottom: 20px;
        }
        .roles-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 15px;
        }
        .role-card {
          background: var(--bg-tertiary);
          border-radius: 10px;
          padding: 15px;
        }
        .role-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 8px;
        }
        .role-indicator {
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }
        .role-card h4 {
          color: var(--text-primary);
          margin: 0;
        }
        .role-card p {
          color: var(--text-secondary);
          font-size: 0.85em;
          margin: 0;
        }
        .form-hint {
          display: block;
          color: var(--text-muted);
          font-size: 0.85em;
          margin-top: 5px;
        }
        @media (max-width: 768px) {
          .member-card {
            flex-wrap: wrap;
          }
          .member-actions {
            width: 100%;
            justify-content: flex-end;
          }
        }
      `}</style>
      {!tourActive && <TourFAB onStart={startTour} />}
    </AppLayout>
  );
}

export default function TeamManagementPage() {
  return (
    <Suspense fallback={null}>
      <TeamManagementContent />
    </Suspense>
  );
}

