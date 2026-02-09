// TODO: Migrate to Prisma. Currently uses in-memory storage (lost on restart).
const express = require('express');
const router = express.Router();

// In-memory storage for team data
let teams = new Map();

// Initialize default team
teams.set('user-1', {
  organizationId: 'org-1',
  members: [
    {
      id: 'member-1',
      userId: 'user-1',
      name: 'John Smith (You)',
      email: 'admin@company.com',
      role: 'owner',
      status: 'active',
      joinedAt: new Date('2024-01-15'),
      lastActive: new Date()
    },
    {
      id: 'member-2',
      userId: 'user-2',
      name: 'Priya Sharma',
      email: 'priya@company.com',
      role: 'admin',
      status: 'active',
      joinedAt: new Date('2024-02-20'),
      lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000)
    },
    {
      id: 'member-3',
      userId: 'user-3',
      name: 'Rahul Patel',
      email: 'rahul@company.com',
      role: 'member',
      status: 'active',
      joinedAt: new Date('2024-03-10'),
      lastActive: new Date(Date.now() - 24 * 60 * 60 * 1000)
    }
  ],
  invitations: [
    {
      id: 'inv-1',
      email: 'newmember@company.com',
      role: 'member',
      invitedBy: 'user-1',
      invitedAt: new Date('2024-11-20'),
      status: 'pending'
    }
  ],
  maxSeats: 5
});

// Get team members
router.get('/members', (req, res) => {
  const userId = req.headers['x-user-id'] || 'user-1';
  const team = teams.get(userId);

  if (!team) {
    return res.json({ members: [], total: 0 });
  }

  res.json({
    members: team.members,
    total: team.members.length,
    maxSeats: team.maxSeats,
    availableSeats: team.maxSeats - team.members.filter(m => m.status === 'active').length
  });
});

// Invite team member
router.post('/invite', (req, res) => {
  const userId = req.headers['x-user-id'] || 'user-1';
  const { email, role } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  if (!['admin', 'member', 'viewer'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role. Must be admin, member, or viewer' });
  }

  let team = teams.get(userId);
  if (!team) {
    team = {
      organizationId: `org-${Date.now()}`,
      members: [],
      invitations: [],
      maxSeats: 5
    };
    teams.set(userId, team);
  }

  // Check if already a member
  if (team.members.find(m => m.email === email)) {
    return res.status(400).json({ error: 'This email is already a team member' });
  }

  // Check if already invited
  if (team.invitations.find(i => i.email === email && i.status === 'pending')) {
    return res.status(400).json({ error: 'An invitation is already pending for this email' });
  }

  // Check seat availability
  const activeMembers = team.members.filter(m => m.status === 'active').length;
  if (activeMembers >= team.maxSeats) {
    return res.status(400).json({ error: 'No seats available. Please upgrade your plan.' });
  }

  const invitation = {
    id: `inv-${Date.now()}`,
    email,
    role,
    invitedBy: userId,
    invitedAt: new Date(),
    status: 'pending'
  };

  team.invitations.push(invitation);

  res.status(201).json({
    success: true,
    invitation,
    message: `Invitation sent to ${email}`
  });
});

// Get pending invitations
router.get('/invitations', (req, res) => {
  const userId = req.headers['x-user-id'] || 'user-1';
  const team = teams.get(userId);

  if (!team) {
    return res.json({ invitations: [] });
  }

  const pendingInvitations = team.invitations.filter(i => i.status === 'pending');

  res.json({
    invitations: pendingInvitations,
    total: pendingInvitations.length
  });
});

// Update member role
router.put('/members/:memberId/role', (req, res) => {
  const userId = req.headers['x-user-id'] || 'user-1';
  const { memberId } = req.params;
  const { role } = req.body;

  if (!['admin', 'member', 'viewer'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role. Must be admin, member, or viewer' });
  }

  const team = teams.get(userId);
  if (!team) {
    return res.status(404).json({ error: 'Team not found' });
  }

  const member = team.members.find(m => m.id === memberId);
  if (!member) {
    return res.status(404).json({ error: 'Member not found' });
  }

  if (member.role === 'owner') {
    return res.status(400).json({ error: 'Cannot change owner role' });
  }

  member.role = role;

  res.json({
    success: true,
    member,
    message: `Role updated to ${role}`
  });
});

// Remove team member
router.delete('/members/:memberId', (req, res) => {
  const userId = req.headers['x-user-id'] || 'user-1';
  const { memberId } = req.params;

  const team = teams.get(userId);
  if (!team) {
    return res.status(404).json({ error: 'Team not found' });
  }

  const memberIndex = team.members.findIndex(m => m.id === memberId);
  if (memberIndex === -1) {
    return res.status(404).json({ error: 'Member not found' });
  }

  if (team.members[memberIndex].role === 'owner') {
    return res.status(400).json({ error: 'Cannot remove owner' });
  }

  team.members.splice(memberIndex, 1);

  res.json({
    success: true,
    message: 'Member removed successfully'
  });
});

// Cancel invitation
router.delete('/invitations/:invitationId', (req, res) => {
  const userId = req.headers['x-user-id'] || 'user-1';
  const { invitationId } = req.params;

  const team = teams.get(userId);
  if (!team) {
    return res.status(404).json({ error: 'Team not found' });
  }

  const invIndex = team.invitations.findIndex(i => i.id === invitationId);
  if (invIndex === -1) {
    return res.status(404).json({ error: 'Invitation not found' });
  }

  team.invitations.splice(invIndex, 1);

  res.json({
    success: true,
    message: 'Invitation cancelled'
  });
});

// Resend invitation
router.post('/invitations/:invitationId/resend', (req, res) => {
  const userId = req.headers['x-user-id'] || 'user-1';
  const { invitationId } = req.params;

  const team = teams.get(userId);
  if (!team) {
    return res.status(404).json({ error: 'Team not found' });
  }

  const invitation = team.invitations.find(i => i.id === invitationId);
  if (!invitation) {
    return res.status(404).json({ error: 'Invitation not found' });
  }

  invitation.invitedAt = new Date();

  res.json({
    success: true,
    message: `Invitation resent to ${invitation.email}`
  });
});

module.exports = router;

