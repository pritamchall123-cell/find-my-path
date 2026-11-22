const User = require('../models/User');

const escapeRegex = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const ROLES = ['student', 'admin'];
const LEVELS = ['class10', 'class12', 'college', 'graduate'];

const listUsers = async ({ search, role, verified, level, page, limit }) => {
  const filter = {};

  if (typeof search === 'string' && search.trim()) {
    const rx = escapeRegex(search.trim());
    filter.$or = [
      { name: { $regex: rx, $options: 'i' } },
      { email: { $regex: rx, $options: 'i' } },
    ];
  }
  if (ROLES.includes(role)) filter.role = role;
  if (verified === 'true') filter.isVerified = true;
  if (verified === 'false') filter.isVerified = false;
  if (LEVELS.includes(level)) filter.educationLevel = level;

  const p = Math.max(1, parseInt(page, 10) || 1);
  const l = Math.min(50, Math.max(1, parseInt(limit, 10) || 20));

  const [users, total] = await Promise.all([
    User.find(filter)
      .sort({ createdAt: -1 })
      .skip((p - 1) * l)
      .limit(l)
      .select('name email role educationLevel isVerified createdAt lastActiveDate currentStreak')
      .lean(),
    User.countDocuments(filter),
  ]);

  return { users, total, page: p, pages: Math.max(1, Math.ceil(total / l)) };
};

module.exports = { listUsers };